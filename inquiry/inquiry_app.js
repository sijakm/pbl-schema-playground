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
  // ---- Shared Helpers Aliases ----
  const { $, nowMs, fmtMs, logLine, setStatus, fillTemplate } = window.utils;

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

    // Schema Editor
    toggleSchemaEditorHeader: () => $("toggleSchemaEditorHeader"),
    toggleSchemaEditorBtn: () => $("toggleSchemaEditorBtn"),
    schemaEditorContainer: () => $("schemaEditorContainer"),
    schemaStep0Tab: () => $("schemaStep0Tab"),
    schemaPerLessonTab: () => $("schemaPerLessonTab"),
    schemaStep0Editor: () => $("schemaStep0Editor"),
    schemaPerLessonEditor: () => $("schemaPerLessonEditor"),
    copySchemaBtn: () => $("copySchemaBtn")
  };

  // ---- state ----
  let currentAbortController = null;
  let isRunning = false;

  // ---- shared components ----
  const tokenManager = new window.TokenManager();

  function setRunning(running) {
    isRunning = running;
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    if (runBtn) runBtn.disabled = running;
    if (cancelBtn) cancelBtn.disabled = !running;
  }

  // ---- Wrapper for shared helpers ----
  const log = (msg) => window.utils.logLine(els.log(), msg);
  const status = (msg) => window.utils.setStatus(els.status(), msg);

  // ---- API Client Wrapper ----
  async function callResponsesApiStream(params) {
    const { endpoint, apiKey, model, prompt, schemaName, schemaObj, signal } = params;
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
    return await window.apiClient.stream({
      endpoint, apiKey, body, signal,
      onDelta: params.onDelta,
      onUsage: (usage) => {
        tokenManager.add(usage);
        console.log("Usage raw object:", usage);
      },
      onError: (err) => { throw new Error(err.message || "Unknown error"); }
    });
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

  // ---- API Client Wrapper ----
  // (already defined above)

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

  async function withRetry(taskFn, label, timeoutMs = 80000, maxRetries = 2) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        log(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
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
          log(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
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
    tokenManager.reset();

    setRunning(true);
    status("Running…");
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
      log("[1/5] Step 0: generating unit outline JSON…");
      const step0Prompt = window.utils.fillTemplate(schemaEditor.getModifiedTemplate("step0"), vars);
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
      log(`[OK] Step 0 JSON received. (${fmtMs(timings.step0_outline_ms)})`);

      // ---- Common unit HTML ----
      const t1 = nowMs();
      log("[2/5] Rendering common unit HTML…");
      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);
      const unitHtmlPrompt = window.utils.fillTemplate(UNIT_COMMON_HTML_PROMPT_TEMPLATE, {
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
      log(`[OK] Common unit HTML received. (${fmtMs(timings.unit_common_html_ms)})`);

      // ---- Per-lesson JSON (PARALLEL) ----
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const unitEqOverride = readUnitEQsOptional();
      const limit = createLimiter(4);
      const tJsonAll0 = nowMs();
      log(`[3/5] Generating lesson JSON in parallel (${lessons.length} lessons)…`);

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

            const perLessonPrompt = window.utils.fillTemplate(schemaEditor.getModifiedTemplate("perLesson"), perLessonVars);
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
            log(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(dur)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      timings.all_lessons_json_parallel_ms = nowMs() - tJsonAll0;
      log(`[OK] All lesson JSON done (parallel). (${fmtMs(timings.all_lessons_json_parallel_ms)})`);

      // ---- Per-lesson HTML (PARALLEL) ----
      const tHtmlAll0 = nowMs();
      log(`[4/5] Rendering lesson HTML in parallel (${lessonJsons.length} lessons)…`);

      timings.per_lesson_html_ms = new Array(lessonJsons.length).fill(0);

      const lessonHtmlPromises = lessonJsons.map((lessonObj, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const lessonHtmlPrompt = window.utils.fillTemplate(HTML_LESSON_PROMPT_TEMPLATE, {
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
            log(`[OK] Lesson ${i + 1}/${lessonJsons.length} HTML done. (${fmtMs(dur)})`);
            return lessonHtml;
          }, `Lesson ${i + 1} HTML`)
        )
      );

      const lessonHtmls = await Promise.all(lessonHtmlPromises);
      timings.all_lessons_html_parallel_ms = nowMs() - tHtmlAll0;
      log(`[OK] All lesson HTML done (parallel). (${fmtMs(timings.all_lessons_html_parallel_ms)})`);

      const bundleEl = els.lessonsBundle();
      if (bundleEl) {
        bundleEl.value = "";
        for (let i = 0; i < lessonJsons.length; i++) {
          bundleEl.value += (bundleEl.value ? "\n\n" : "") + `=== Lesson ${i + 1} JSON ===\n${JSON.stringify(lessonJsons[i], null, 2)}\n=== Lesson ${i + 1} HTML ===\n${lessonHtmls[i]}`;
        }
      }

      const tJoin0 = nowMs();
      log("[5/5] Joining final HTML…");

      const langEl = $("languageSelect");
      const lang = langEl ? langEl.value : "en";
      const lessonLabel = lang === "sr" ? "Lekcija" : "Lesson";
      const noteLabel = lang === "sr" ? "ovo će biti sadržaj unutar box-a na našoj platformi" : "this will be the content inside the box on our platform";

      const formattedLessons = lessonHtmls.map((html, i) => {
        return `
<p><strong>${lessonLabel} ${i + 1} (${noteLabel})</strong></p>
${html}`;
      });

      const finalHtml = [unitHtml, ...formattedLessons].join("\n");

      if (els.finalHtml()) els.finalHtml().value = finalHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = finalHtml;
      timings.join_final_ms = nowMs() - tJoin0;
      timings.total_ms = nowMs() - tTotal0;

      log("");
      log("===== TIMING SUMMARY =====");
      log(`Step 0 (outline JSON): ${fmtMs(timings.step0_outline_ms)}`);
      log(`Unit common HTML: ${fmtMs(timings.unit_common_html_ms)}`);
      log(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
      log(`All lessons HTML (parallel): ${fmtMs(timings.all_lessons_html_parallel_ms)}`);
      log(`Join final HTML: ${fmtMs(timings.join_final_ms)}`);
      log(`TOTAL: ${fmtMs(timings.total_ms)}`);
      log("==========================");

      tokenManager.updateUI(model);
      status("Done.");
      log("[OK] Done.");

    } catch (err) {
      if (currentAbortController?.signal?.aborted) {
        status("Canceled.");
        log("[canceled]");
      } else {
        status("Error.");
        log("[error] " + (err?.message || String(err)));
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
      log("[OK] Prompts downloaded.");
    } catch (err) {
      log("[error] Failed to download: " + err.message);
    }
  }

  function onReady() {
    status("");
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

  // Expose to window
  window.runChain = runChain;
  window.cancel = cancel;
  window.downloadPrompts = downloadPrompts;
  window.getPrompts = getPrompts;

})();
