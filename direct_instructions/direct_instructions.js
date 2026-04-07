(() => {
  "use strict";

  // ---- Defaults ----
  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

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

  let schemaEditor; // Initialized in initSchemaEditor

  function initSchemaEditor() {
    if (!window.SchemaEditor) {
      console.warn("SchemaEditor class not found! Retrying in 50ms...");
      setTimeout(initSchemaEditor, 50);
      return;
    }

    schemaEditor = new window.SchemaEditor({
      container: $("schemaEditorContainer"),
      tabs: [
        { 
          id: "perLesson", 
          label: "Per Lesson", 
          schema: (document.getElementById('languageSelect')?.value === 'sr' ? window.promptsSR : window.promptsEN).PER_LESSON_SCHEMA, 
          template: (document.getElementById('languageSelect')?.value === 'sr' ? window.promptsSR : window.promptsEN).PER_LESSON_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "MediaContext", "ParentUnitData", "Standards", "AttachedLesson", "UnitEssentialQuestions", "LearningPlans"]
        },
        { 
          id: "step0", 
          label: "Unit Outline (Step 0)", 
          schema: (document.getElementById('languageSelect')?.value === 'sr' ? window.promptsSR : window.promptsEN).STEP0_SCHEMA, 
          template: (document.getElementById('languageSelect')?.value === 'sr' ? window.promptsSR : window.promptsEN).STEP0_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "Standards", "LearningPlans", "MediaContext", "AttachedUnit", "NumberOfItems"]
        }
      ],
      colorProvider: (node, name, pathArr, inheritedColor) => {
        const depth = pathArr.length;
        if (depth === 2 && pathArr[0] === "properties") {
          const colors = {
            Question: "color-blue", Research: "color-green", Hypothesize: "color-orange",
            Experiment: "color-purple", Analyze: "color-pink", Share: "color-teal",
            ReviewAndSpacedRetrieval: "color-gray", StudentPractice: "color-gray", FormativeAssessment: "color-gray",
            UnitDescription: "color-blue", Lessons: "color-green"
          };
          return colors[name] || "color-gray";
        }
        return inheritedColor || "color-gray";
      }
    });
    window.schemaEditor = schemaEditor; // Keep it globally accessible for Run Chain logic

    // Toggle buttons logic for Direct Instructions
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

  // Expose to window globally for onclick handlers in index.html
  window.schemaEditor = schemaEditor;

  // ---- Wrapper for shared helpers ----
  const log = (msg) => window.utils.logLine(els.log(), msg);
  const status = (msg) => window.utils.setStatus(els.status(), msg);

  // ---- flexible template substitution ----
  // We use the shared window.utils.fillTemplate

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
      endpoint,
      apiKey,
      body,
      signal,
      onDelta: params.onDelta,
      onUsage: (usage) => tokenManager.add(usage),
      onError: (err) => { throw new Error(err.message || "Unknown error"); }
    });
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
    console.log(`[DBG] ${label}`, payload);
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

        const isGlobalAbort = currentAbortController && currentAbortController.signal.aborted;
        if (isGlobalAbort) throw err;

        if (attempt < maxRetries) {
          const reason = (controller.signal.aborted && !isGlobalAbort) ? "Timeout" : (err.message || "Unknown error");
          log(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
        }
      }
    }
    throw lastError;
  }

  async function runChain() {
    if (isRunning) return;

    const lang = document.getElementById('languageSelect')?.value || 'sr';
    const prompts = lang === 'sr' ? window.promptsSR : window.promptsEN;
    const {
      UNIT_COMMON_HTML_PROMPT_TEMPLATE,
      HTML_LESSON_PROMPT_TEMPLATE
    } = prompts;
    
    // Fallbacks just in case schemaEditor isn't ready
    const STEP0_PROMPT_TEMPLATE = (window.schemaEditor && window.schemaEditor.getModifiedTemplate("step0")) || prompts.STEP0_PROMPT_TEMPLATE;
    const STEP0_SCHEMA = (window.schemaEditor && window.schemaEditor.getModifiedSchema("step0")) || prompts.STEP0_SCHEMA;
    const PER_LESSON_PROMPT_TEMPLATE = (window.schemaEditor && window.schemaEditor.getModifiedTemplate("perLesson")) || prompts.PER_LESSON_PROMPT_TEMPLATE;
    const PER_LESSON_SCHEMA = (window.schemaEditor && window.schemaEditor.getModifiedSchema("perLesson")) || prompts.PER_LESSON_SCHEMA;

    const HARDCODED_PASSWORD = ""; // Enter password here while working locally
    const apiKey = HARDCODED_PASSWORD || els.apiKey()?.value?.trim() || "";
    const endpoint = (els.endpoint()?.value?.trim() || DEFAULT_ENDPOINT).trim();
    const model = els.model()?.value || "gpt-5.4-mini";

    const vars = buildVarsFromUi();
    const numLessons = parseInt(vars.NumberOfItems, 10);

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
      const step0Prompt = window.utils.fillTemplate(STEP0_PROMPT_TEMPLATE, vars);
      console.log("[DEBUG] Step 0 Prompt (Unit Outline):", step0Prompt);

      const step0JsonText = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: step0Prompt,
          schemaName: "UnitPlanResponse",
          schemaObj: STEP0_SCHEMA,
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
        UnitCommonJson: JSON.stringify(unitCommonJson),
        JsonResponse: JSON.stringify(unitCommonJson) // direct_instructions.js use JsonResponse
      });
      console.log("[DEBUG] Unit Common HTML Prompt:", unitHtmlPrompt);

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
      const limit = createLimiter(4);
      const tJsonAll0 = nowMs();
      log(`[3/5] Generating lesson JSON in parallel (${lessons.length} lessons)…`);

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const perLessonVars = {
              ...vars,
              UnitEssentialQuestions: (step0Obj?.UnitDescription?.EssentialQuestions || []).join("\n"),
              // Since the prompt file cannot be changed, we include both unit and lesson-specific 
              // context in the ParentUnitData field which is present in the original template.
              ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\n\nCURRENT LESSON CONTEXT (MUST follow these constraints):\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\n- Lesson Title: ${L.lessonTitle ?? ""}\n- Lesson Outline: ${L.lessonOutline ?? ""}`
            };

            const perLessonPrompt = window.utils.fillTemplate(PER_LESSON_PROMPT_TEMPLATE, perLessonVars);
            console.log(`[DEBUG] Lesson ${i + 1} JSON Prompt:`, perLessonPrompt);

            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "LessonPlanResponse",
              schemaObj: PER_LESSON_SCHEMA,
              signal
            });

            let lessonObj = JSON.parse(lessonJsonText);
            const dur = nowMs() - ti0;
            timings.per_lesson_json_ms[i] = dur;
            log(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(dur)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      timings.all_lessons_json_parallel_ms = nowMs() - tJsonAll0;
      log(`[OK] All lesson JSON done. (${fmtMs(timings.all_lessons_json_parallel_ms)})`);

      // ---- Per-lesson HTML (PARALLEL) ----
      const tHtmlAll0 = nowMs();
      log(`[4/5] Rendering lesson HTML in parallel…`);
      const lessonHtmlPromises = lessonJsons.map((lessonObj, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const lessonHtmlPrompt = window.utils.fillTemplate(HTML_LESSON_PROMPT_TEMPLATE, {
              LessonInquiryJson: JSON.stringify(lessonObj), // for compatibility
              JsonResponse: JSON.stringify(lessonObj),      // expected by direct_instructions prompts
              LessonNumber: i + 1,
              LessonTitle: step0Obj?.Lessons?.[i]?.lessonTitle || ""
            });
            console.log(`[DEBUG] Lesson ${i + 1} HTML Prompt:`, lessonHtmlPrompt);

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

      // Bundle debug output
      if (els.lessonsBundle()) {
        els.lessonsBundle().value = lessonJsons.map((obj, i) =>
          `=== Lesson ${i + 1} JSON ===\n${JSON.stringify(obj, null, 2)}\n\n=== Lesson ${i + 1} HTML ===\n${lessonHtmls[i]}`
        ).join("\n\n");
      }

      // ---- Join final HTML ----
      const tJoin0 = nowMs();
      log("[5/5] Joining final HTML…");
      const finalHtml = [unitHtml, ...lessonHtmls].join("\n");
      if (els.finalHtml()) els.finalHtml().value = finalHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = finalHtml;

      timings.join_final_ms = nowMs() - tJoin0;
      timings.total_ms = nowMs() - tTotal0;

      log("\n===== TIMING SUMMARY =====");
      log(`Step 0 (outline): ${fmtMs(timings.step0_outline_ms)}`);
      log(`Unit common HTML: ${fmtMs(timings.unit_common_html_ms)}`);
      log(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
      log(`All lessons HTML (parallel): ${fmtMs(timings.all_lessons_html_parallel_ms)}`);
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
        alert("JSZip library not loaded. Check your internet connection or CDN link.");
        return;
      }

      const zipEN = new JSZip();
      const zipSR = new JSZip();

      // window.promptsEN and window.promptsSR are defined in prompts.js / prompts_sr.js
      const pEN = window.promptsEN || {};
      const pSR = window.promptsSR || {};

      const addFiles = (zip, obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === "object" && value !== null) {
            zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          } else if (typeof value === "string") {
            zip.file(`${key}.txt`, value);
          }
        }
      };

      addFiles(zipEN, pEN);
      addFiles(zipSR, pSR);

      const contentEN = await zipEN.generateAsync({ type: "blob" });
      const contentSR = await zipSR.generateAsync({ type: "blob" });

      const saveZip = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };

      saveZip(contentEN, "direct_instructions_prompts_en.zip");
      setTimeout(() => {
        saveZip(contentSR, "direct_instructions_prompts_sr.zip");
      }, 500);

      log("[OK] Prompts downloaded successfully.");
    } catch (err) {
      log("[error] Failed to download prompts: " + err.message);
      console.error(err);
    }
  }

  function onReady() {
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    const downloadBtn = els.downloadPromptsBtn();
    if (runBtn) runBtn.addEventListener("click", runChain);
    if (cancelBtn) cancelBtn.addEventListener("click", cancel);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPrompts);

    // Toggle Input Variables
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

    initSchemaEditor();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();