(() => {
  "use strict";

  // ---- Defaults ----
  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

  // ---- Prompt templates and schemas moved to prompts.js ----


  // ---- DOM helpers ----
  const $ = (id) => document.getElementById(id);

  const els = {
    apiKey: () => $("apiKey"),
    endpoint: () => $("endpoint"),
    model: () => $("modelSelect"),

    subject: () => $("subject"),
    name: () => $("name"),
    gradeLevel: () => $("gradeLevel"),
    classDuration: () => $("classDuration"),
    numberOfLessons: () => $("numberOfLessons"),
    standards: () => $("standards"),
    userPrompt: () => $("userPrompt"),
    learningPlans: () => $("learningPlans"),
    mediaContext: () => $("mediaContext"),
    attachedUnit: () => $("attachedUnit"),
    attachedLesson: () => $("attachedLesson"),
    unitEssentialQuestions: () => $("unitEssentialQuestions"),

    runChainBtn: () => $("runChainBtn"),
    cancelBtn: () => $("cancelBtn"),
    status: () => $("status"),

    log: () => $("log"),
    step0Json: () => $("step0Json"),
    unitHtml: () => $("unitHtml"),
    lessonsBundle: () => $("lessonsBundle"),
    finalHtml: () => $("finalHtml"),
    htmlPreview: () => $("htmlPreview")
  };

  // ---- state ----
  let currentAbortController = null;
  let isRunning = false;

  // ---- timing helpers ----
  function nowMs() {
    return (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  }
  function fmtMs(ms) {
    if (!Number.isFinite(ms)) return "—";
    if (ms < 1000) return `${ms.toFixed(0)} ms`;
    return `${(ms / 1000).toFixed(2)} s`;
  }

  function setStatus(msg) {
    const el = els.status();
    if (el) el.textContent = msg || "";
  }

  function logLine(line) {
    const log = els.log();
    if (!log) return;
    log.value += (log.value ? "\n" : "") + line;
    log.scrollTop = log.scrollHeight;
  }

  function setRunning(running) {
    isRunning = running;
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    if (runBtn) runBtn.disabled = running;
    if (cancelBtn) cancelBtn.disabled = !running;
  }

  // ---- simple template substitution ----
  function fillTemplate(tpl, vars) {
    return tpl.replace(/\{\{\$([A-Za-z0-9_]+)\}\}/g, (_, key) => {
      const v = vars[key];
      return v === undefined || v === null ? "" : String(v);
    });
  }

  // ---- SSE parsing (same format as playground.js) ----
  function parseSseLines(text) {
    const events = [];
    let rest = text;

    while (true) {
      const idx = rest.indexOf("\n\n");
      if (idx === -1) break;

      const chunk = rest.slice(0, idx);
      rest = rest.slice(idx + 2);

      const lines = chunk.split("\n");
      for (const ln of lines) {
        const m = ln.match(/^data:\s?(.*)$/);
        if (m) events.push(m[1]);
      }
    }

    return { events, rest };
  }

  async function callResponsesApiStream({ endpoint, apiKey, model, prompt, schemaName, schemaObj, signal }) {
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const body = {
      model,
      stream: true,
      reasoning: { effort: "low" },
      input: [{ role: "user", content: prompt }]
    };

    if (schemaObj) {
      body.text = {
        format: {
          type: "json_schema",
          name: schemaName || "Response",
          schema: schemaObj,
          strict: true
        }
      };
    }

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText}${errText ? `\n${errText}` : ""}`);
    }
    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let finalText = "";
    let streamClosed = false;

    try {
      while (!streamClosed) {
        const { value, done } = await reader.read();
        if (done) {
          streamClosed = true;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseLines(buffer);
        buffer = parsed.rest;

        for (const raw of parsed.events) {
          if (raw === "[DONE]") {
            streamClosed = true;
            break;
          }

          let evt;
          try {
            evt = JSON.parse(raw);
          } catch (e) {
            console.warn("Ignored non-JSON event:", raw);
            continue;
          }

          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            finalText += evt.delta;
          }

          if (evt.type === "response.error") {
            throw new Error(evt.error?.message || "Unknown model error");
          }
        }
      }

      // Attempt to process any remaining content in the buffer as a raw event if it didn't end with \n\n
      if (buffer.trim() && !streamClosed) {
        const lines = buffer.split("\n");
        for (const ln of lines) {
          const m = ln.match(/^data:\s?(.*)$/);
          const raw = m ? m[1] : ln.trim();
          if (raw === "[DONE]") break;
          try {
            const evt = JSON.parse(raw);
            if (evt.delta) finalText += evt.delta;
          } catch { }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return finalText;
  }

  function buildVarsFromUi() {
    return {
      Subject: els.subject()?.value?.trim() || "",
      Name: els.name()?.value?.trim() || "",
      UserPrompt: els.userPrompt()?.value?.trim() || "",
      GradeLevel: els.gradeLevel()?.value?.trim() || "",
      ClassDuration: els.classDuration()?.value?.trim() || "",
      NumberOfLessons: els.numberOfLessons()?.value?.trim() || "",
      Standards: els.standards()?.value?.trim() || "",
      LearningPlans: els.learningPlans()?.value?.trim() || "",
      MediaContext: els.mediaContext()?.value?.trim() || "",
      AttachedUnit: els.attachedUnit()?.value?.trim() || "",
      AttachedLesson: els.attachedLesson()?.value?.trim() || ""
    };
  }

  function readUnitEQsOptional() {
    const raw = els.unitEssentialQuestions()?.value?.trim();
    if (!raw) return "";
    // Accept either JSON array or plain text.
    try {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return JSON.stringify(arr);
    } catch { }
    return raw;
  }

  function buildUnitCommonJson(step0Obj, unitTitle) {
    return {
      UnitTitle: unitTitle,
      UnitDescription: step0Obj?.UnitDescription?.Description || "",
      EssentialQuestions: step0Obj?.UnitDescription?.EssentialQuestions || [],
      StudentLearningObjectives: step0Obj?.UnitDescription?.StudentLearningObjectives || [],
      StandardsAligned: step0Obj?.UnitDescription?.StandardsAligned || [],
      KeyVocabulary: step0Obj?.UnitDescription?.KeyVocabulary || []
    };
  }

  function dbg(label, payload) {
    try {
      console.log(`[DBG] ${label}`, payload);
    } catch {
      console.log(`[DBG] ${label}`);
    }
  }

  function previewText(s, n = 400) {
    if (typeof s !== "string") return s;
    return s.length <= n ? s : s.slice(0, n) + "…";
  }

  // ---- concurrency helpers ----
  function createLimiter(maxConcurrent = 4) {
    let active = 0;
    const queue = [];
    const next = () => {
      if (active >= maxConcurrent) return;
      const item = queue.shift();
      if (!item) return;
      active++;
      item()
        .catch(() => { })
        .finally(() => {
          active--;
          next();
        });
    };

    return function limit(fn) {
      return new Promise((resolve, reject) => {
        queue.push(async () => {
          try { resolve(await fn()); }
          catch (e) { reject(e); }
        });
        next();
      });
    };
  }

  /**
   * Wraps a task with a timeout and retry logic.
   * If timeoutMs is reached, the signal is aborted and the task is retried up to maxRetries.
   */
  async function withRetry(taskFn, label, timeoutMs = 180000, maxRetries = 2) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        logLine(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
        controller.abort();
      }, timeoutMs);

      try {
        // Also respect the global cancel button
        const onGlobalAbort = () => controller.abort();
        if (currentAbortController) {
          currentAbortController.signal.addEventListener("abort", onGlobalAbort, { once: true });
        }

        const result = await taskFn(controller.signal);
        clearTimeout(timeoutId);
        if (currentAbortController) {
          currentAbortController.signal.removeEventListener("abort", onGlobalAbort);
        }
        return result;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        const isTimeout = controller.signal.aborted && (!currentAbortController || !currentAbortController.signal.aborted);
        const isGlobalAbort = currentAbortController && currentAbortController.signal.aborted;

        if (isGlobalAbort) throw err; // Don't retry if user clicked Cancel

        if (attempt < maxRetries) {
          const reason = isTimeout ? "Timeout" : (err.message || "Unknown error");
          logLine(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
        }
      }
    }
    throw lastError;
  }

  async function runChain() {
    if (isRunning) return;

    const HARDCODED_PASSWORD = ""; // Enter password here while working locally
    const apiKey = HARDCODED_PASSWORD || els.apiKey()?.value?.trim() || "";
    const endpoint = (els.endpoint()?.value?.trim() || DEFAULT_ENDPOINT).trim();
    const model = els.model()?.value || "gpt-5.4-mini";

    const vars = buildVarsFromUi();
    const numLessons = parseInt(vars.NumberOfLessons, 10);

    if (!vars.Subject || !vars.Name || !vars.UserPrompt || !vars.GradeLevel || !vars.ClassDuration || !vars.NumberOfLessons) {
      alert("Please fill in at least: Subject, Name, UserPrompt, GradeLevel, ClassDuration, NumberOfLessons.");
      return;
    }

    if (!Number.isFinite(numLessons) || numLessons < 1) {
      alert("NumberOfLessons must be a positive integer.");
      return;
    }

    // reset outputs
    if (els.log()) els.log().value = "";
    if (els.step0Json()) els.step0Json().value = "";
    if (els.unitHtml()) els.unitHtml().value = "";
    if (els.lessonsBundle()) els.lessonsBundle().value = "";
    if (els.finalHtml()) els.finalHtml().value = "";
    if (els.htmlPreview()) els.htmlPreview().srcdoc = "";

    setRunning(true);
    setStatus("Running…");
    currentAbortController = new AbortController();

    // timings
    const timings = {
      step0_outline_ms: 0,
      unit_common_html_ms: 0,
      per_lesson_json_ms: [],
      per_lesson_html_ms: [],
      all_lessons_json_parallel_ms: 0,
      all_lessons_html_parallel_ms: 0,
      join_final_ms: 0,
      total_ms: 0
    };
    const tTotal0 = nowMs();

    try {
      // ---- Step 0: outline ----
      const t0 = nowMs();
      logLine("[1/5] Step 0: generating unit outline JSON…");

      const step0Prompt = fillTemplate(STEP0_PROMPT_TEMPLATE, vars);

      const step0JsonText = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint,
          apiKey,
          model,
          prompt: step0Prompt,
          schemaName: "UnitPlanResponse",
          schemaObj: STEP0_SCHEMA,
          signal: signal
        }), "Step 0 Outline");

      dbg("Step0 raw response received", {
        chars: step0JsonText?.length ?? 0,
        preview: previewText(step0JsonText, 500)
      });

      let step0Obj;
      try {
        step0Obj = JSON.parse(step0JsonText);
        dbg("Step0 parsed JSON", {
          hasUnitDescription: !!step0Obj?.UnitDescription,
          lessonsCount: Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons.length : 0
        });
      } catch (e) {
        throw new Error("Step 0 did not return valid JSON.\n\n" + step0JsonText.slice(0, 1200));
      }

      if (els.step0Json()) els.step0Json().value = JSON.stringify(step0Obj, null, 2);

      timings.step0_outline_ms = nowMs() - t0;
      logLine(`[OK] Step 0 JSON received. (${fmtMs(timings.step0_outline_ms)})`);

      // ---- Common unit HTML ----
      const t1 = nowMs();
      logLine("[2/5] Rendering common unit HTML…");

      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);
      const unitHtmlPrompt = fillTemplate(UNIT_COMMON_HTML_PROMPT_TEMPLATE, {
        UnitCommonJson: JSON.stringify(unitCommonJson)
      });

      const unitHtml = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint,
          apiKey,
          model,
          prompt: unitHtmlPrompt,
          schemaObj: null,
          signal: signal
        }), "Unit Common HTML");

      dbg("Unit common HTML received", {
        chars: unitHtml?.length ?? 0,
        preview: previewText(unitHtml, 500)
      });

      if (els.unitHtml()) els.unitHtml().value = unitHtml;

      timings.unit_common_html_ms = nowMs() - t1;
      logLine(`[OK] Common unit HTML received. (${fmtMs(timings.unit_common_html_ms)})`);

      // ---- Per-lesson JSON (PARALLEL) ----
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      if (lessons.length !== numLessons) {
        logLine(`[warn] Step 0 returned ${lessons.length} lessons but NumberOfLessons is ${numLessons}. Continuing with returned lessons.`);
      }

      const unitEqOverride = readUnitEQsOptional();

      // (optional) limiter to avoid rate limits; bump/down as needed
      const limit = createLimiter(4);

      const tJsonAll0 = nowMs();
      logLine(`[3/5] Generating lesson JSON in parallel (${lessons.length} lessons)…`);

      timings.per_lesson_json_ms = new Array(lessons.length).fill(0);

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();

            const perLessonVars = {
              ...vars,
              UnitDescriptionDescription: step0Obj?.UnitDescription?.Description ?? "",
              UnitEssentialQuestions: unitEqOverride || JSON.stringify(step0Obj?.UnitDescription?.EssentialQuestions ?? []),
              UnitStudentLearningObjectives: JSON.stringify(step0Obj?.UnitDescription?.StudentLearningObjectives ?? []),
              UnitKeyVocabulary: JSON.stringify(step0Obj?.UnitDescription?.KeyVocabulary ?? []),
              UnitStandardsAligned: JSON.stringify(step0Obj?.UnitDescription?.StandardsAligned ?? []),

              LessonNumber: String(L.lessonNumber ?? (i + 1)),
              LessonTitle: String(L.lessonTitle ?? ""),
              LessonOutline: String(L.lessonOutline ?? "")
            };

            const perLessonPrompt = fillTemplate(PER_LESSON_PROMPT_TEMPLATE, perLessonVars);

            const lessonJsonText = await callResponsesApiStream({
              endpoint,
              apiKey,
              model,
              prompt: perLessonPrompt,
              schemaName: "InquiryUnitPlanResponse",
              schemaObj: PER_LESSON_SCHEMA,
              signal: signal
            });

            dbg(`Lesson ${i} JSON raw response received`, {
              chars: lessonJsonText?.length ?? 0,
              preview: previewText(lessonJsonText, 500)
            });

            let lessonObj;
            try {
              lessonObj = JSON.parse(lessonJsonText);
            } catch {
              throw new Error(`Lesson ${i} did not return valid JSON.\n\n` + lessonJsonText.slice(0, 1200));
            }

            const dur = nowMs() - ti0;
            timings.per_lesson_json_ms[i] = dur;
            logLine(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(dur)})`);

            return lessonObj;
          }, `Lesson ${i + 1} JSON`)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      timings.all_lessons_json_parallel_ms = nowMs() - tJsonAll0;
      logLine(`[OK] All lesson JSON done (parallel). (${fmtMs(timings.all_lessons_json_parallel_ms)})`);

      // ---- Per-lesson HTML (PARALLEL) ----
      const tHtmlAll0 = nowMs();
      logLine(`[4/5] Rendering lesson HTML in parallel (${lessonJsons.length} lessons)…`);

      timings.per_lesson_html_ms = new Array(lessonJsons.length).fill(0);

      const lessonHtmlPromises = lessonJsons.map((lessonObj, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();

            const lessonHtmlPrompt = fillTemplate(HTML_LESSON_PROMPT_TEMPLATE, {
              LessonInquiryJson: JSON.stringify(lessonObj)
            });

            const lessonHtml = await callResponsesApiStream({
              endpoint,
              apiKey,
              model,
              prompt: lessonHtmlPrompt,
              schemaObj: null,
              signal: signal
            });

            dbg(`Lesson ${i} HTML received`, {
              chars: lessonHtml?.length ?? 0,
              preview: previewText(lessonHtml, 500)
            });

            const dur = nowMs() - ti0;
            timings.per_lesson_html_ms[i] = dur;
            logLine(`[OK] Lesson ${i + 1}/${lessonJsons.length} HTML done. (${fmtMs(dur)})`);

            return lessonHtml;
          }, `Lesson ${i + 1} HTML`)
        )
      );

      const lessonHtmls = await Promise.all(lessonHtmlPromises);
      timings.all_lessons_html_parallel_ms = nowMs() - tHtmlAll0;
      logLine(`[OK] All lesson HTML done (parallel). (${fmtMs(timings.all_lessons_html_parallel_ms)})`);

      // ---- Bundle (debug output) ----
      const bundleEl = els.lessonsBundle();
      if (bundleEl) {
        bundleEl.value = "";
        for (let i = 0; i < lessonJsons.length; i++) {
          const block = [
            `=== Lesson ${i} JSON ===`,
            JSON.stringify(lessonJsons[i], null, 2),
            `=== Lesson ${i} HTML ===`,
            lessonHtmls[i]
          ].join("\n");
          bundleEl.value += (bundleEl.value ? "\n\n" : "") + block;
        }
        bundleEl.scrollTop = bundleEl.scrollHeight;
      }

      // ---- Join final HTML ----
      const tJoin0 = nowMs();
      logLine("[5/5] Joining final HTML…");

      const finalHtml = [unitHtml, ...lessonHtmls].join("\n");

      dbg("Final HTML joined", {
        lessonHtmlCount: lessonHtmls.length,
        chars: finalHtml.length,
        preview: previewText(finalHtml, 500)
      });

      if (els.finalHtml()) els.finalHtml().value = finalHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = finalHtml;

      timings.join_final_ms = nowMs() - tJoin0;

      timings.total_ms = nowMs() - tTotal0;

      // ---- Timing summary ----
      logLine("");
      logLine("===== TIMING SUMMARY =====");
      logLine(`Step 0 (outline JSON): ${fmtMs(timings.step0_outline_ms)}`);
      logLine(`Unit common HTML: ${fmtMs(timings.unit_common_html_ms)}`);
      logLine(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
      for (let i = 0; i < timings.per_lesson_json_ms.length; i++) {
        logLine(`  - Lesson ${i + 1} JSON: ${fmtMs(timings.per_lesson_json_ms[i])}`);
      }
      logLine(`All lessons HTML (parallel): ${fmtMs(timings.all_lessons_html_parallel_ms)}`);
      for (let i = 0; i < timings.per_lesson_html_ms.length; i++) {
        logLine(`  - Lesson ${i + 1} HTML: ${fmtMs(timings.per_lesson_html_ms[i])}`);
      }
      logLine(`Join final HTML: ${fmtMs(timings.join_final_ms)}`);
      logLine(`TOTAL: ${fmtMs(timings.total_ms)}`);
      logLine("==========================");

      setStatus("Done.");
      logLine("[OK] Done.");
    } catch (err) {
      if (currentAbortController?.signal?.aborted) {
        setStatus("Canceled.");
        logLine("[canceled]");
      } else {
        setStatus("Error.");
        logLine("[error] " + (err?.message || String(err)));
        console.error(err);
      }
    } finally {
      setRunning(false);
      currentAbortController = null;
    }
  }

  function cancel() {
    if (currentAbortController) currentAbortController.abort();
  }

  function onReady() {
    setStatus("");

    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    if (runBtn) runBtn.addEventListener("click", runChain);
    if (cancelBtn) cancelBtn.addEventListener("click", cancel);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
