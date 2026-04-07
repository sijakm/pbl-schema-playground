(() => {
  "use strict";

  // ---- Defaults ----
  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

  // ---- Prompt templates and schemas moved to prompts.js ----
  function getPrompts() {
    const langEl = $("languageSelect");
    const lang = langEl ? langEl.value : "en";
    return lang === "sr" ? window.promptsSR : window.promptsEN;
  }
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
    downloadPromptsBtn: () => $("downloadPromptsBtn"),
    status: () => $("status"),

    log: () => $("log"),
    step0Json: () => $("step0Json"),
    unitHtml: () => $("unitHtml"),
    lessonsBundle: () => $("lessonsBundle"),
    finalHtml: () => $("finalHtml"),
    htmlPreview: () => $("htmlPreview"),

    // Toggles
    toggleInputVariablesHeader: () => $("toggleInputVariablesHeader"),
    toggleInputVariablesBtn: () => $("toggleInputVariablesBtn"),
    inputVariablesContainer: () => $("inputVariablesContainer"),

    toggleSchemaEditorHeader: () => $("toggleSchemaEditorHeader"),
    toggleSchemaEditorBtn: () => $("toggleSchemaEditorBtn"),
    schemaEditorContainer: () => $("schemaEditorContainer"),

    // Schema Editor tabs/editors
    schemaStep0Tab: () => $("schemaStep0Tab"),
    schemaPerLessonTab: () => $("schemaPerLessonTab"),
    schemaStep0Editor: () => $("schemaStep0Editor"),
    schemaPerLessonEditor: () => $("schemaPerLessonEditor"),
    copySchemaBtn: () => $("copySchemaBtn")
  };

  // ---- state ----
  let currentAbortController = null;
  let isRunning = false;

  // ---- token usage tracking ----
  const tokenUsage = { input: 0, output: 0, total: 0, calls: 0 };

  function resetTokenUsage() {
    tokenUsage.input = 0; tokenUsage.output = 0; tokenUsage.total = 0; tokenUsage.calls = 0;
    const panel = $("tokenSummary");
    if (panel) panel.style.display = "none";
  }

  function addTokenUsage(usage) {
    if (!usage) return;
    tokenUsage.input += usage.input_tokens || 0;
    tokenUsage.output += usage.output_tokens || 0;
    tokenUsage.total += usage.total_tokens || 0;
    tokenUsage.calls += 1;
  }

  const MODEL_PRICING = {
    "gpt-5.4": { input: 2.50, output: 15.00 },
    "gpt-5.4-mini": { input: 0.75, output: 4.50 },
    "gpt-5.4-nano": { input: 0.20, output: 1.25 },
    "gpt-5-mini": { input: 0.75, output: 4.50 },
    "gpt-5.2": { input: 2.50, output: 15.00 }
  };

  function updateTokenSummaryUI(model) {
    const pricing = MODEL_PRICING[model] || { input: 0, output: 0 };
    const inputCost = (tokenUsage.input / 1_000_000) * pricing.input;
    const outputCost = (tokenUsage.output / 1_000_000) * pricing.output;
    const totalCost = inputCost + outputCost;

    const fmt = n => n.toLocaleString("en-US");
    const fmtUSD = n => n < 0.01 ? `< $0.01` : `$${n.toFixed(4)}`;

    const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    set("tsInput", fmt(tokenUsage.input));
    set("tsInputCost", fmtUSD(inputCost));
    set("tsOutput", fmt(tokenUsage.output));
    set("tsOutputCost", fmtUSD(outputCost));
    set("tsTotal", fmt(tokenUsage.total));
    set("tsTotalCost", `${tokenUsage.calls} call${tokenUsage.calls !== 1 ? "s" : ""}`);
    set("tsCallCount", String(tokenUsage.calls));
    set("tsModel", model);
    set("tsTotalCostValue", `$${totalCost.toFixed(4)}`);

    const panel = $("tokenSummary");
    if (panel) panel.style.display = "block";
  }

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

  let schemaEditor; // Initialized in initSchemaEditor

  function initSchemaEditor() {
    if (!window.SchemaEditor) {
      console.warn("SchemaEditor class not found! Retrying in 100ms...");
      setTimeout(initSchemaEditor, 100);
      return;
    }

    schemaEditor = new window.SchemaEditor({
      container: $("schemaEditorContainer"),
      tabs: [
        { 
          id: "perLesson", 
          label: "Per Lesson", 
          schema: getPrompts().PER_LESSON_SCHEMA, 
          template: getPrompts().PER_LESSON_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "MediaContext", "ParentUnitData", "Standards", "AttachedUnit", "AttachedLesson", "UnitEssentialQuestions", "LearningPlans"]
        },
        { 
          id: "step0", 
          label: "Unit Outline (Step 0)", 
          schema: getPrompts().STEP0_SCHEMA, 
          template: getPrompts().STEP0_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "Standards", "LearningPlans", "MediaContext", "AttachedUnit", "AttachedLesson", "NumberOfItems"]
        }
      ],
      colorProvider: (node, name, pathArr, inheritedColor) => {
        const depth = pathArr.length;
        if (depth === 2 && pathArr[0] === "properties") {
          const colors = {
            OrientationPhase: "color-blue", ConceptualizationPhase: "color-green", InvestigationPhase: "color-orange",
            ConclusionPhase: "color-purple", DiscussionPhase: "color-pink", ReviewAndSpacedRetrieval: "color-teal",
            FormativeAssessment: "color-gray", StudentPractice: "color-gray", UnitDescription: "color-blue", Lessons: "color-green"
          };
          return colors[name] || "color-gray";
        }
        return inheritedColor || "color-gray";
      }
    });
    window.schemaEditor = schemaEditor; // Keep it globally accessible for Run Chain logic

    // Toggle buttons logic for Inquiry
    const seHeader = els.toggleSchemaEditorHeader();
    const seContainer = els.schemaEditorContainer();
    const seBtn = els.toggleSchemaEditorBtn();
    if (seHeader && seContainer && seBtn) {
      seHeader.addEventListener("click", () => {
        const isHidden = seContainer.style.display === "none";
        seContainer.style.display = isHidden ? "block" : "none";
        seBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
        if (isHidden) schemaEditor.render();
      });
    }
  }

  const ivHeader = els.toggleInputVariablesHeader();
  const ivContainer = els.inputVariablesContainer();
  const ivBtn = els.toggleInputVariablesBtn();
  if (ivHeader && ivContainer && ivBtn) {
    ivHeader.addEventListener("click", () => {
      const isHidden = ivContainer.style.display === "none";
      ivContainer.style.display = isHidden ? "block" : "none";
      ivBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
    });
  }

  // ---- flexible template substitution ----
  function fillTemplate(tpl, vars) {
    // Supports {{$Key}}, {{Key}}, and {{{Key}}}
    return tpl.replace(/\{\{\{?\$?([A-Za-z0-9_]+)\}\}\}?/g, (match, key) => {
      const v = vars[key];
      return v === undefined || v === null ? match : String(v);
    });
  }

  // ---- SSE parsing ----
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

          if (evt.type === "response.completed" && evt.response?.usage) {
            addTokenUsage(evt.response.usage);
          }

          if (evt.type === "response.error") {
            throw new Error(evt.error?.message || "Unknown model error");
          }
        }
      }

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
      NumberOfItems: els.numberOfLessons()?.value?.trim() || "",
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

  async function withRetry(taskFn, label, timeoutMs = 180000, maxRetries = 2) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        logLine(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
        controller.abort();
      }, timeoutMs);

      try {
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

        if (isGlobalAbort) throw err;

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

    const pmpts = getPrompts();
    const {
      UNIT_COMMON_HTML_PROMPT_TEMPLATE,
      HTML_LESSON_PROMPT_TEMPLATE
    } = pmpts;

    const HARDCODED_PASSWORD = ""; 
    const apiKey = HARDCODED_PASSWORD || els.apiKey()?.value?.trim() || "";
    const endpoint = (els.endpoint()?.value?.trim() || DEFAULT_ENDPOINT).trim();
    const model = els.model()?.value || "gpt-5.4-mini";

    const vars = buildVarsFromUi();

    if (!vars.Subject || !vars.Name || !vars.UserPrompt || !vars.GradeLevel || !vars.ClassDuration || !vars.NumberOfItems) {
      alert("Please fill in at least: Subject, Name, UserPrompt, GradeLevel, ClassDuration, NumberOfItems.");
      return;
    }

    if (els.log()) els.log().value = "";
    if (els.step0Json()) els.step0Json().value = "";
    if (els.unitHtml()) els.unitHtml().value = "";
    if (els.lessonsBundle()) els.lessonsBundle().value = "";
    if (els.finalHtml()) els.finalHtml().value = "";
    if (els.htmlPreview()) els.htmlPreview().srcdoc = "";
    resetTokenUsage();

    setRunning(true);
    setStatus("Running…");
    currentAbortController = new AbortController();

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
      const step0Prompt = fillTemplate(schemaEditor.getModifiedTemplate("step0"), vars);
      console.log("[STEP0_PROMPT]", step0Prompt);

      const step0JsonText = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: step0Prompt,
          schemaName: "UnitPlanResponse",
          schemaObj: schemaEditor.getModifiedSchema("step0"),
          signal
        }), "Step 0 Outline");

      let step0Obj;
      try {
        step0Obj = JSON.parse(step0JsonText);
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
      console.log("[UNIT_HTML_PROMPT]", unitHtmlPrompt);

      const unitHtml = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: unitHtmlPrompt,
          signal
        }), "Unit Common HTML");

      if (els.unitHtml()) els.unitHtml().value = unitHtml;
      timings.unit_common_html_ms = nowMs() - t1;
      logLine(`[OK] Common unit HTML received. (${fmtMs(timings.unit_common_html_ms)})`);

      // ---- Per-lesson JSON (PARALLEL) ----
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const unitEqOverride = readUnitEQsOptional();
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
              UnitEssentialQuestions: unitEqOverride || JSON.stringify(step0Obj?.UnitDescription?.EssentialQuestions ?? []),
              ParentUnitData: [
                `UnitDescription.Description: ${step0Obj?.UnitDescription?.Description ?? ""}`,
                `UnitDescription.StudentLearningObjectives: ${JSON.stringify(step0Obj?.UnitDescription?.StudentLearningObjectives ?? [])}`,
                `UnitDescription.KeyVocabulary: ${JSON.stringify(step0Obj?.UnitDescription?.KeyVocabulary ?? [])}`,
                `UnitDescription.StandardsAligned: ${JSON.stringify(step0Obj?.UnitDescription?.StandardsAligned ?? [])}`,
                `Lesson Number: ${L.lessonNumber ?? (i + 1)}`,
                `Lesson Title: ${L.lessonTitle ?? ""}`,
                `Lesson Outline: ${L.lessonOutline ?? ""}`
              ].join("\n")
            };

            const perLessonPrompt = fillTemplate(schemaEditor.getModifiedTemplate("perLesson"), perLessonVars);
            console.log(`[PER_LESSON_PROMPT ${i + 1}]`, perLessonPrompt);

            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "InquiryUnitPlanResponse",
              schemaObj: schemaEditor.getModifiedSchema("perLesson"),
              signal
            });

            let lessonObj;
            try {
              lessonObj = JSON.parse(lessonJsonText);
            } catch {
              throw new Error(`Lesson ${i + 1} did not return valid JSON.\n\n` + lessonJsonText.slice(0, 1200));
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
            console.log(`[LESSON_HTML_PROMPT ${i + 1}]`, lessonHtmlPrompt);

            const lessonHtml = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: lessonHtmlPrompt,
              signal
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

      const bundleEl = els.lessonsBundle();
      if (bundleEl) {
        bundleEl.value = "";
        for (let i = 0; i < lessonJsons.length; i++) {
          bundleEl.value += (bundleEl.value ? "\n\n" : "") + `=== Lesson ${i + 1} JSON ===\n${JSON.stringify(lessonJsons[i], null, 2)}\n=== Lesson ${i + 1} HTML ===\n${lessonHtmls[i]}`;
        }
      }

      const tJoin0 = nowMs();
      logLine("[5/5] Joining final HTML…");
      const separator = '<hr style="border: none; border-top: 8px solid #f0f0f0; margin: 60px 0; border-radius: 4px;">';
      const finalHtml = [unitHtml, separator, ...lessonHtmls].join("\n");
      if (els.finalHtml()) els.finalHtml().value = finalHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = finalHtml;
      timings.join_final_ms = nowMs() - tJoin0;
      timings.total_ms = nowMs() - tTotal0;

      logLine("");
      logLine("===== TIMING SUMMARY =====");
      logLine(`Step 0 (outline JSON): ${fmtMs(timings.step0_outline_ms)}`);
      logLine(`Unit common HTML: ${fmtMs(timings.unit_common_html_ms)}`);
      logLine(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
      logLine(`All lessons HTML (parallel): ${fmtMs(timings.all_lessons_html_parallel_ms)}`);
      logLine(`Join final HTML: ${fmtMs(timings.join_final_ms)}`);
      logLine(`TOTAL: ${fmtMs(timings.total_ms)}`);
      logLine("==========================");

      updateTokenSummaryUI(model);
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

  async function downloadPrompts() {
    try {
      if (typeof JSZip === "undefined") {
        alert("JSZip library not loaded.");
        return;
      }
      const zipEN = new JSZip();
      const zipSR = new JSZip();
      const pEN = window.promptsEN || {};
      const pSR = window.promptsSR || {};

      const addFiles = (zip, obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object") zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          else zip.file(`${key}.txt`, String(value));
        }
      };
      addFiles(zipEN, pEN);
      addFiles(zipSR, pSR);

      const contentEN = await zipEN.generateAsync({ type: "blob" });
      const contentSR = await zipSR.generateAsync({ type: "blob" });

      const save = (blob, name) => {
        const url = URL.createObjectURL(blob);
        const a = document.body.appendChild(document.createElement("a"));
        a.href = url; a.download = name; a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
      save(contentEN, "inquiry_prompts_en.zip");
      setTimeout(() => save(contentSR, "inquiry_prompts_sr.zip"), 500);
      logLine("[OK] Prompts downloaded.");
    } catch (err) {
      logLine("[error] Failed to download: " + err.message);
    }
  }

  function onReady() {
    setStatus("");
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    const downloadBtn = els.downloadPromptsBtn();
    if (runBtn) runBtn.addEventListener("click", runChain);
    if (cancelBtn) cancelBtn.addEventListener("click", cancel);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPrompts);

    initSchemaEditor();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
