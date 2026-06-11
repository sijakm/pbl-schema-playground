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
    lessonsBundle: () => $("lessonsBundle"),

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
      onUsage: (usage) => tokenManager.add(usage),
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

    const p = window.promptsEN;
    schemaEditor = new window.SchemaEditor({
      container: $("schemaEditorContainer"),
      tabs: [
        { 
          id: "perLesson", 
          label: "Per Lesson", 
          schema: p.PER_LESSON_SCHEMA, 
          template: p.PER_LESSON_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "MediaContext", "ParentUnitData", "Standards", "AttachedLesson", "UnitEssentialQuestions", "LearningPlans"]
        },
        { 
          id: "step0", 
          label: "Unit Outline (Step 0)", 
          schema: p.STEP0_SCHEMA, 
          template: p.STEP0_PROMPT_TEMPLATE,
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
    window.schemaEditor = schemaEditor; // Keep it globally accessible

    // Toggle buttons logic for Collaborative
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
    if (els.lessonsBundle()) els.lessonsBundle().value = "";
    tokenManager.reset();

    setRunning(true);
    status("Running…");
    currentAbortController = new AbortController();

    const timings = {
      step0_outline_ms: 0,
      per_lesson_json_ms: [],
      all_lessons_json_parallel_ms: 0,
      total_ms: 0
    };
    const tTotal0 = nowMs();

    try {


      // ---- Step 0: outline ----
      const t0 = nowMs();
      log("[1/5] Step 0: generating unit outline JSON…");
      const step0Prompt = window.utils.fillTemplate(schemaEditor.getModifiedTemplate("step0"), vars);
      console.log("[DEBUG] Step 0 Prompt (Unit Outline):", step0Prompt);

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
              ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\n\nCURRENT LESSON CONTEXT (MUST follow these constraints):\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\n- Lesson Title: ${L.lessonTitle ?? ""}\n- Lesson Outline: ${L.lessonOutline ?? ""}`
            };

            const perLessonPrompt = window.utils.fillTemplate(schemaEditor.getModifiedTemplate("perLesson"), perLessonVars);
            console.log(`[DEBUG] Lesson ${i + 1} JSON Prompt:`, perLessonPrompt);

            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "LessonPlanResponse",
              schemaObj: schemaEditor.getModifiedSchema("perLesson"),
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



      // Bundle debug output
      if (els.lessonsBundle()) {
        els.lessonsBundle().value = lessonJsons.map((obj, i) =>
          `=== Lesson ${i + 1} JSON ===\n${JSON.stringify(obj, null, 2)}`
        ).join("\n\n");
      }

      log("Calling .NET API to generate Markdown...");
      try {
        const unitTitle = $("name")?.value || "";
        const reqBody = {
          UnitTitle: unitTitle,
          Step0Json: JSON.stringify(step0Obj, null, 2),
          LessonJsons: lessonJsons.map(obj => JSON.stringify(obj, null, 2))
        };
        const res = await fetch("http://localhost:5200/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reqBody)
        });
        if (!res.ok) throw new Error("API returned " + res.status);
        const data = await res.json();
        const mrTextarea = document.getElementById("markdownResult");
        if (mrTextarea) {
          mrTextarea.value = data.markdown;
        }
        log("[OK] Markdown generated by .NET API.");
      } catch(apiErr) {
        log("[error] .NET API failed: " + apiErr.message);
      }

      timings.total_ms = nowMs() - tTotal0;

      log("\n===== TIMING SUMMARY =====");
      log(`Step 0 (outline): ${fmtMs(timings.step0_outline_ms)}`);
      log(`All lessons JSON (parallel): ${fmtMs(timings.all_lessons_json_parallel_ms)}`);
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

      const p = window.promptsEN;
      const zip = new JSZip();
      
      if (p) {
        for (const [key, value] of Object.entries(p)) {
          if (typeof value === "object" && value !== null) {
            zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          } else if (typeof value === "string") {
            zip.file(`${key}.txt`, value);
          }
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const link = document.createElement("a");
        link.href = url;
        link.download = `collaborative_prompts_English.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      log("[OK] All prompts downloaded successfully.");
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

    initSchemaEditor();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
