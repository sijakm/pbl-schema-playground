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
          schema: window.labPrompts.PER_LESSON_SCHEMA, 
          template: window.labPrompts.PER_LESSON_PROMPT_TEMPLATE,
          requiredVariables: ["Subject", "Name", "UserPrompt", "GradeLevel", "ClassDuration", "MediaContext", "ParentUnitData", "Standards", "AttachedLesson", "UnitEssentialQuestions", "LearningPlans"]
        },
        { 
          id: "step0", 
          label: "Unit Outline (Step 0)", 
          schema: window.labPrompts.STEP0_SCHEMA, 
          template: window.labPrompts.STEP0_PROMPT_TEMPLATE,
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

    // Toggle buttons logic for Lab
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

  function formatTime(ms) {
    if (ms < 1000) return ms.toFixed(0) + "ms";
    return (ms / 1000).toFixed(2) + "s";
  }

  async function withRetry(fn, label = "Task", maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn(currentAbortController.signal);
      } catch (err) {
        if (err.name === "AbortError") throw err;
        log(`[RETRY ${i + 1}/${maxRetries}] ${label} failed: ${err.message}`);
        if (i === maxRetries - 1) throw err;
        await new Promise(r => setTimeout(r, 1000 * (i + 1)));
      }
    }
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

  async function runChain() {
    const prompts = window.labPrompts;
    
    // Fallbacks just in case schemaEditor isn't ready
    const STEP0_PROMPT_TEMPLATE = (window.schemaEditor && window.schemaEditor.getModifiedTemplate("step0")) || prompts.STEP0_PROMPT_TEMPLATE;
    const STEP0_SCHEMA = (window.schemaEditor && window.schemaEditor.getModifiedSchema("step0")) || prompts.STEP0_SCHEMA;
    const PER_LESSON_PROMPT_TEMPLATE = (window.schemaEditor && window.schemaEditor.getModifiedTemplate("perLesson")) || prompts.PER_LESSON_PROMPT_TEMPLATE;
    const PER_LESSON_SCHEMA = (window.schemaEditor && window.schemaEditor.getModifiedSchema("perLesson")) || prompts.PER_LESSON_SCHEMA;

    const HARDCODED_PASSWORD = ""; 
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
      const unitHtmlPrompt = window.utils.fillTemplate(prompts.UNIT_COMMON_HTML_PROMPT_TEMPLATE, {
        UnitCommonJson: JSON.stringify(unitCommonJson),
        JsonResponse: JSON.stringify(unitCommonJson)
      });
      console.log("[DEBUG] Unit Common HTML Prompt:", unitHtmlPrompt);

      const unitHtml = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: unitHtmlPrompt,
          signal
        }), "Unit HTML");

      if (els.unitHtml()) els.unitHtml().value = unitHtml;
      timings.unit_common_html_ms = nowMs() - t1;
      log(`[OK] Unit HTML rendered. (${fmtMs(timings.unit_common_html_ms)})`);

      // ---- Parallel Lessons JSON ----
      const tParallelJson0 = nowMs();
      log(`[3/5] Generating ${numLessons} lessons in parallel…`);
      const limitJson = createLimiter(5);
      const lessonObjects = [];

      const jsonTasks = (step0Obj.Lessons || []).map((outline, idx) => {
        return limitJson(async () => {
          const tStart = nowMs();
          const perLessonVars = {
            ...vars,
            ParentUnitData: JSON.stringify(unitCommonJson),
            UnitEssentialQuestions: JSON.stringify(unitCommonJson.EssentialQuestions),
            AttachedLesson: JSON.stringify(outline)
          };

          const perLessonPrompt = window.utils.fillTemplate(PER_LESSON_PROMPT_TEMPLATE, perLessonVars);
          const lessonJsonText = await callResponsesApiStream({
            endpoint, apiKey, model,
            prompt: perLessonPrompt,
            schemaName: "LabUnitPlanResponse",
            schemaObj: PER_LESSON_SCHEMA,
            signal: currentAbortController.signal
          });

          try {
            const lObj = JSON.parse(lessonJsonText);
            lessonObjects[idx] = lObj;
            const ms = nowMs() - tStart;
            timings.per_lesson_json_ms[idx] = ms;
            log(`  - Lesson ${idx + 1} JSON ok (${fmtMs(ms)})`);
          } catch (err) {
            throw new Error(`Lesson ${idx + 1} JSON invalid: ${err.message}`);
          }
        });
      });

      await Promise.all(jsonTasks);
      timings.all_lessons_json_parallel_ms = nowMs() - tParallelJson0;
      log(`[OK] All lessons JSON generated. (${fmtMs(timings.all_lessons_json_parallel_ms)})`);
      if (els.lessonsBundle()) els.lessonsBundle().value = JSON.stringify(lessonObjects, null, 2);

      // ---- Parallel Lessons HTML ----
      const tParallelHtml0 = nowMs();
      log("[4/5] Rendering lessons HTML in parallel…");
      const limitHtml = createLimiter(5);
      const lessonHtmls = [];

      const htmlTasks = lessonObjects.map((lObj, idx) => {
        return limitHtml(async () => {
          const tStart = nowMs();
          const lessonHtmlPrompt = window.utils.fillTemplate(prompts.HTML_LESSON_PROMPT_TEMPLATE, {
            JsonResponse: JSON.stringify(lObj)
          });

          const lHtml = await callResponsesApiStream({
            endpoint, apiKey, model,
            prompt: lessonHtmlPrompt,
            signal: currentAbortController.signal
          });

          lessonHtmls[idx] = lHtml;
          const ms = nowMs() - tStart;
          timings.per_lesson_html_ms[idx] = ms;
          log(`  - Lesson ${idx + 1} HTML ok (${fmtMs(ms)})`);
        });
      });

      await Promise.all(htmlTasks);
      timings.all_lessons_html_parallel_ms = nowMs() - tParallelHtml0;
      log(`[OK] All lessons HTML rendered. (${fmtMs(timings.all_lessons_html_parallel_ms)})`);

      // ---- Join & Preview ----
      const tJoin0 = nowMs();
      log("[5/5] Joining results…");
      const combinedHtml = `
        <div class="unit-plan">
          ${unitHtml}
          <hr/>
          ${lessonHtmls.join("<hr class='lesson-sep'/>")}
        </div>
      `;
      if (els.finalHtml()) els.finalHtml().value = combinedHtml;
      if (els.htmlPreview()) els.htmlPreview().srcdoc = combinedHtml;
      
      timings.join_final_ms = nowMs() - tJoin0;
      timings.total_ms = nowMs() - tTotal0;

      tokenManager.updateUI(model);
      status(`Done! (${fmtMs(timings.total_ms)})`);
      log(`[FINISHED] Total time: ${fmtMs(timings.total_ms)}`);

    } catch (err) {
      if (err.name === "AbortError") {
        status("Cancelled");
        log("❌ Process aborted by user.");
      } else {
        status("Error");
        log(`❌ CRITICAL ERROR: ${err.message}`);
        console.error(err);
      }
    } finally {
      setRunning(false);
      currentAbortController = null;
    }
  }

  function cancelChain() {
    if (currentAbortController) {
      currentAbortController.abort();
    }
  }

  async function downloadPrompts() {
    if (typeof JSZip === "undefined") {
      alert("JSZip not found!"); return;
    }
    const zip = new JSZip();
    const p = window.labPrompts;
    const vars = buildVarsFromUi();

    zip.file("1_step0_outline_prompt.txt", window.utils.fillTemplate(p.STEP0_PROMPT_TEMPLATE, vars));
    zip.file("2_step0_schema.json", JSON.stringify(p.STEP0_SCHEMA, null, 2));
    zip.file("3_per_lesson_plan_prompt.txt", window.utils.fillTemplate(p.PER_LESSON_PROMPT_TEMPLATE, vars));
    zip.file("4_per_lesson_schema.json", JSON.stringify(p.PER_LESSON_SCHEMA, null, 2));
    zip.file("5_html_rendering_prompt.txt", p.HTML_LESSON_PROMPT_TEMPLATE);

    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lab_prompts.zip";
    a.click();
  }

  function onReady() {
    const runBtn = els.runChainBtn();
    const cancelBtn = els.cancelBtn();
    const downloadBtn = els.downloadPromptsBtn();
    if (runBtn) runBtn.addEventListener("click", runChain);
    if (cancelBtn) cancelBtn.addEventListener("click", cancelChain);
    if (downloadBtn) downloadBtn.addEventListener("click", downloadPrompts);

    initSchemaEditor();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  // Expose to window
  window.runChain = runChain;
  window.cancelChain = cancelChain;
  window.downloadPrompts = downloadPrompts;

})();