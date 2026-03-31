(() => {
  "use strict";

  // ---- Defaults ----
  const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

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
    markdownOutput: () => $("markdownOutput")
  };

  // ---- state ----
  let currentAbortController = null;
  let isRunning = false;
  let editorInstance = null;

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
    "gpt-5.4":       { input: 2.50,  output: 15.00 },
    "gpt-5.4-mini":  { input: 0.75,  output: 4.50  },
    "gpt-5.4-nano":  { input: 0.20,  output: 1.25  },
    "gpt-5-mini":    { input: 0.75,  output: 4.50  },
    "gpt-5.2":       { input: 2.50,  output: 15.00 }
  };

  function updateTokenSummaryUI(model) {
    const pricing = MODEL_PRICING[model] || { input: 0, output: 0 };
    const inputCost  = (tokenUsage.input  / 1_000_000) * pricing.input;
    const outputCost = (tokenUsage.output / 1_000_000) * pricing.output;
    const totalCost  = inputCost + outputCost;

    const fmt = n => n.toLocaleString("en-US");
    const fmtUSD = n => n < 0.01 ? `< $0.01` : `$${n.toFixed(4)}`;

    const set = (id, val) => { const el = $(id); if (el) el.textContent = val; };

    set("tsInput",        fmt(tokenUsage.input));
    set("tsInputCost",    fmtUSD(inputCost));
    set("tsOutput",       fmt(tokenUsage.output));
    set("tsOutputCost",   fmtUSD(outputCost));
    set("tsTotal",        fmt(tokenUsage.total));
    set("tsTotalCost",    `${tokenUsage.calls} call${tokenUsage.calls !== 1 ? "s" : ""}`);
    set("tsCallCount",    String(tokenUsage.calls));
    set("tsModel",        model);
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

        const isGlobalAbort = currentAbortController && currentAbortController.signal.aborted;
        if (isGlobalAbort) throw err;

        if (attempt < maxRetries) {
          const reason = (controller.signal.aborted && !isGlobalAbort) ? "Timeout" : (err.message || "Unknown error");
          logLine(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
        }
      }
    }
    throw lastError;
  }

  async function runChain() {
    if (isRunning) return;

    const apiKey = els.apiKey()?.value?.trim() || "";
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
    if (els.markdownOutput()) els.markdownOutput().value = "";
    resetTokenUsage();

    setRunning(true);
    setStatus("Running…");
    currentAbortController = new AbortController();

    const timings = {
      step0_outline_ms: 0,
      all_lessons_json_parallel_ms: 0,
      total_ms: 0
    };
    const tTotal0 = nowMs();

    try {
      const lang = document.getElementById("languageSelect")?.value || "sr";
      const prompts = lang === "en" ? window.promptsEN : window.promptsSR;

      // ---- Step 0: outline ----
      const t0 = nowMs();
      logLine("[1/3] Step 0: generating unit outline JSON…");
      const step0Prompt = fillTemplate(prompts.STEP0_PROMPT_TEMPLATE, vars);

      const step0JsonText = await withRetry((signal) =>
        callResponsesApiStream({
          endpoint, apiKey, model,
          prompt: step0Prompt,
          schemaName: "UnitPlanResponse",
          schemaObj: prompts.STEP0_SCHEMA,
          signal
        }), "Step 0 Outline");

      let step0Obj;
      try {
        step0Obj = JSON.parse(step0JsonText);
      } catch (e) {
        throw new Error("Step 0 did not return valid JSON.");
      }

      if (els.step0Json()) els.step0Json().value = JSON.stringify(step0Obj, null, 2);
      timings.step0_outline_ms = nowMs() - t0;
      logLine(`[OK] Step 0 JSON received. (${fmtMs(timings.step0_outline_ms)})`);

      const unitCommonJson = buildUnitCommonJson(step0Obj, vars.Name);

      // ---- Per-lesson JSON (PARALLEL) ----
      const lessons = Array.isArray(step0Obj?.Lessons) ? step0Obj.Lessons : [];
      const limit = createLimiter(25);
      const tJsonAll0 = nowMs();
      logLine(`[2/3] Generating lesson JSON in parallel (${lessons.length} lessons)…`);

      const lessonJsonPromises = lessons.map((L, i) =>
        limit(() =>
          withRetry(async (signal) => {
            const ti0 = nowMs();
            const perLessonVars = {
              ...vars,
              UnitEssentialQuestions: (step0Obj?.UnitDescription?.EssentialQuestions || []).join("\n"),
              ParentUnitData: `UNIT DESCRIPTION: ${step0Obj.UnitDescription.Description}\n\nCURRENT LESSON CONTEXT:\n- Lesson Number: ${L.lessonNumber ?? (i + 1)}\n- Lesson Title: ${L.lessonTitle ?? ""}\n- Lesson Outline: ${L.lessonOutline ?? ""}`
            };

            const perLessonPrompt = fillTemplate(prompts.PER_LESSON_PROMPT_TEMPLATE, perLessonVars);

            const lessonJsonText = await callResponsesApiStream({
              endpoint, apiKey, model,
              prompt: perLessonPrompt,
              schemaName: "LessonPlanResponse",
              schemaObj: prompts.PER_LESSON_SCHEMA,
              signal
            });

            let lessonObj = JSON.parse(lessonJsonText);
            const dur = nowMs() - ti0;
            logLine(`[OK] Lesson ${i + 1}/${lessons.length} JSON done. (${fmtMs(dur)})`);
            return lessonObj;
          }, `Lesson ${i + 1} JSON`)
        )
      );

      const lessonJsons = await Promise.all(lessonJsonPromises);
      timings.all_lessons_json_parallel_ms = nowMs() - tJsonAll0;
      logLine(`[OK] All lesson JSON done. (${fmtMs(timings.all_lessons_json_parallel_ms)})`);

      // ---- Step 3: Generate Markdown locally ----
      logLine("[3/3] Generating final Markdown locally…");
      const finalMarkdown = generateMarkdown(unitCommonJson, lessonJsons, lang);

      if (els.markdownOutput()) els.markdownOutput().value = finalMarkdown;

      const html = typeof marked !== "undefined" ? marked.parse(finalMarkdown) : "Marked.js not loaded";
      if (editorInstance) {
        editorInstance.setData(html);
      } else {
        const preview = $("markdownPreview");
        if (preview) {
          preview.style.display = "block";
          preview.innerHTML = html;
        }
      }

      timings.total_ms = nowMs() - tTotal0;
      logLine(`\nTOTAL: ${fmtMs(timings.total_ms)}`);

      updateTokenSummaryUI(model);
      setStatus("Done.");

    } catch (err) {
      if (currentAbortController?.signal?.aborted) {
        setStatus("Canceled.");
        logLine("[canceled]");
      } else {
        setStatus("Error.");
        logLine("[error] " + (err?.message || String(err)));
      }
    } finally {
      setRunning(false);
      currentAbortController = null;
    }
  }

  function generateMarkdown(unitObj, lessonObjs, lang) {
    const labels = {
      sr: {
        unitEq: "💭 Ključna Pitanja",
        unitObjectives: "🎯 Ciljevi učenja",
        unitStandards: "📏 Usklađeni standardi",
        lessonEq: "💭 Ključna Pitanja",
        lessonVocab: "🔤 Ključni vokabular",
        lessonObjectives: "🎯 Ciljevi učenja",
        lessonStandards: "📏 Usklađeni standardi",
        priorKnowledge: "💡 Procena predznanja",
        apkPrerequisites: "Preduslovne veštine",
        apkModality: "Modalitet",
        apkInstructions: "Uputstva i šablon",
        apkAlternates: "Alternativne opcije",
        instruction: "Instrukcija",
        materials: "📚 Materijali",
        teacherInstructions: "📋 Instrukcije za nastavnike",
        misconceptions: "⚠️ Moguća pogrešna uverenja",
        transcendent: "🌍 Transcendentno razmišljanje",
        quickCheck: "Brza provera",
        groupStructure: "Struktura i uloge grupe (3–4 min)",
        collabGuidelines: "Smernice za saradnju (5 min)",
        collabActivities: "Kolaborativne aktivnosti (25 min)",
        differentiation: "🪜 Diferencijacija",
        accommodations: "🤝 Prilagođavanja i modifikacije",
        reflection: "Refleksija o dinamici grupe (5 min)",
        review: "Pregled i prisećanje uz vremenske razmake (5 min)",
        formative: "✅ Formativna procena",
        practice: "🖊 Vežba učenika",
        expected: "✅ Očekivani odgovori učenika"
      },
      en: {
        unitEq: "💭 Essential Questions",
        unitObjectives: "🎯 Student Learning Objectives",
        unitStandards: "📏 Standards Aligned",
        lessonEq: "💭 Essential Questions",
        lessonVocab: "🔤 Key Vocabulary",
        lessonObjectives: "🎯 Student Learning Objectives",
        lessonStandards: "📏 Standards Aligned",
        priorKnowledge: "💡 Assess Prior Knowledge",
        apkPrerequisites: "Prerequisite Skills",
        apkModality: "Modality",
        apkInstructions: "Instructions & Template",
        apkAlternates: "Alternate Options",
        instruction: "Instruction",
        materials: "📚 Materials",
        teacherInstructions: "📋 Instructions for Teachers",
        misconceptions: "⚠️ Anticipated Misconceptions",
        transcendent: "🌍 Transcendent Thinking",
        quickCheck: "Quick Check",
        groupStructure: "Group Structure & Roles (3–4 min)",
        collabGuidelines: "Collaboration Guidelines (5 min)",
        collabActivities: "Collaborative Activities (25 min)",
        differentiation: "🪜 Differentiation",
        accommodations: "🤝 Accommodations & Modifications",
        reflection: "Reflection on Group Dynamics (5 min)",
        review: "Review & Spaced Retrieval (5 min)",
        formative: "✅ Formative Assessment",
        practice: "🖊 Student Practice",
        expected: "✅ Expected Student Responses"
      }
    }[lang] || labels.sr;

    let md = `# ${unitObj.UnitTitle || "Unit"}\n\n`;
    md += `${unitObj.UnitDescription || ""}\n\n`;

    if (unitObj.EssentialQuestions?.length) {
      md += `## ${labels.unitEq}\n`;
      unitObj.EssentialQuestions.forEach(q => md += `- ${q}\n`);
      md += "\n";
    }

    if (unitObj.StudentLearningObjectives?.length) {
      md += `## ${labels.unitObjectives}\n`;
      unitObj.StudentLearningObjectives.forEach(o => md += `- ${o}\n`);
      md += "\n";
    }

    if (unitObj.StandardsAligned?.length) {
      md += `## ${labels.unitStandards}\n`;
      unitObj.StandardsAligned.forEach(s => md += `- ${s}\n`);
      md += "\n";
    }

    lessonObjs.forEach((lWrap, i) => {
      const l = lWrap.LessonPlan || lWrap.LessonDescription;
      if (!l) return;
      md += `---\n\n# Lesson ${l.LessonNumber || (i + 1)}: ${l.LessonTitle}\n\n`;

      if (l.EssentialQuestions?.length) {
        md += `### ${labels.lessonEq}\n`;
        l.EssentialQuestions.forEach(q => md += `- ${q}\n`);
        md += "\n";
      }

      if (l.KeyVocabulary?.length) {
        md += `### ${labels.lessonVocab}\n`;
        l.KeyVocabulary.forEach(v => md += `1. **${v.split(" - ")[0]}** — ${v.split(" - ")[1] || ""}\n`);
        md += "\n";
      }

      if (l.StudentLearningObjectives?.length) {
        md += `### ${labels.lessonObjectives}\n`;
        l.StudentLearningObjectives.forEach(o => md += `- ${o}\n`);
        md += "\n";
      }

      if (l.StandardsAligned) {
        md += `### ${labels.lessonStandards}\n`;
        md += `- ${l.StandardsAligned}\n\n`;
      }

      const apk = l.AssessPriorKnowledge;
      const hasApk = apk && (apk.Modality || apk.TeacherPrompt || apk.PrerequisiteSkills?.length);
      if (hasApk) {
        md += `### ${labels.priorKnowledge}\n\n`;
        if (apk.PrerequisiteSkills?.length) {
          md += `**${labels.apkPrerequisites}**\n`;
          apk.PrerequisiteSkills.forEach(s => md += `- ${s}\n`);
          md += "\n";
        }
        if (apk.Modality) md += `**${labels.apkModality}:** ${apk.Modality}\n\n`;
        if (apk.TeacherPrompt) md += `${apk.TeacherPrompt}\n\n`;
        if (apk.InstructionsAndTemplate) md += `**${labels.apkInstructions}**\n\n${apk.InstructionsAndTemplate}\n\n`;
        if (apk.ExpectedStudentResponses?.length) {
          md += `**${labels.expected}**\n`;
          apk.ExpectedStudentResponses.forEach(r => md += `- ${r}\n`);
          md += "\n";
        }
        if (apk.ClosingPrompt) md += `${apk.ClosingPrompt}\n\n`;
        if (apk.AlternateOptions?.length) {
          md += `**${labels.apkAlternates}**\n`;
          apk.AlternateOptions.forEach((opt, i) => md += `${i + 1}. ${opt}\n`);
          md += "\n";
        }
      }

      md += `### <span style="color:rgb(115, 191, 39);">${labels.instruction}</span>\n\n`;
      if (l.Instruction?.Materials?.length) {
        md += `**${labels.materials}**\n`;
        l.Instruction.Materials.forEach(m => md += `- ${m}\n`);
        md += "\n";
      }
      if (l.Instruction?.InstructionsForTeachers) {
        md += `**${labels.teacherInstructions}**\n\n${l.Instruction.InstructionsForTeachers}\n\n`;
      }
      if (l.Instruction?.AnticipatedMisconceptions) {
        md += `**${labels.misconceptions}**\n\n${l.Instruction.AnticipatedMisconceptions}\n\n`;
      }
      if (l.Instruction?.TranscendentThinking) {
        md += `### ${labels.transcendent}\n\n${l.Instruction.TranscendentThinking}\n\n`;
      }
      if (l.Instruction?.QuickCheck) md += `**${labels.quickCheck}**\n\n${l.Instruction.QuickCheck}\n\n`;

      if (l.GroupStructureAndRoles) md += `### <span style="color:rgb(115, 191, 39);">${labels.groupStructure}</span>\n\n${l.GroupStructureAndRoles}\n\n`;
      if (l.CollaborationGuidelines) md += `### <span style="color:rgb(115, 191, 39);">${labels.collabGuidelines}</span>\n\n${l.CollaborationGuidelines}\n\n`;

      if (l.CollaborativeActivities) {
        md += `### <span style="color:rgb(115, 191, 39);">${labels.collabActivities}</span>\n\n`;
        if (l.CollaborativeActivities.Materials?.length) {
          md += `**${labels.materials}**\n`;
          l.CollaborativeActivities.Materials.forEach(m => md += `- ${m}\n`);
          md += "\n";
        }
        if (l.CollaborativeActivities.InstructionsForTeachers) {
          md += `**${labels.teacherInstructions}**\n\n${l.CollaborativeActivities.InstructionsForTeachers}\n\n`;
        }
        if (l.CollaborativeActivities.Differentiation) md += `**${labels.differentiation}**\n\n${l.CollaborativeActivities.Differentiation}\n\n`;
        if (l.CollaborativeActivities.AccommodationsAndModifications) {
          const am = l.CollaborativeActivities.AccommodationsAndModifications;
          md += `**${labels.accommodations}**\n\n`;
          if (am.General) md += `**General:** ${am.General}\n\n`;
          if (am.IndividualSupport?.length) {
            am.IndividualSupport.forEach(st => {
              md += `<span style="color:red;">**${st.StudentName}**</span>\n`;
              md += `- ${st.PlanProvided}\n`;
              md += `- ${st.PlanImplementation}\n\n`;
            });
          }
        }
      }

      if (l.ReflectionOnGroupDynamics) md += `### <span style="color:rgb(115, 191, 39);">${labels.reflection}</span>\n\n${l.ReflectionOnGroupDynamics}\n\n`;
      if (l.ReviewAndSpacedRetrieval) md += `### <span style="color:rgb(115, 191, 39);">${labels.review}</span>\n\n${l.ReviewAndSpacedRetrieval}\n\n`;

      if (l.FormativeAssessment) {
        md += `### ${labels.formative}\n\n${l.FormativeAssessment}\n\n`;
      }

      if (l.StudentPractice) {
        md += `### <span style="color:rgb(115, 191, 39);">${labels.practice}</span>\n\n${l.StudentPractice}\n\n`;
      }
    });

    return md;
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
          if (typeof value === "object" && value !== null) zip.file(`${key}.json`, JSON.stringify(value, null, 2));
          else if (typeof value === "string") zip.file(`${key}.txt`, value);
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

      saveZip(contentEN, "collaborative_prompts_en.zip");
      setTimeout(() => saveZip(contentSR, "collaborative_prompts_sr.zip"), 500);
      logLine("[OK] Prompts downloaded.");
    } catch (err) {
      logLine("[error] Failed to download prompts: " + err.message);
    }
  }

  function onReady() {
    if (els.runChainBtn()) els.runChainBtn().addEventListener("click", runChain);
    if (els.cancelBtn()) els.cancelBtn().addEventListener("click", () => currentAbortController?.abort());
    if (els.downloadPromptsBtn()) els.downloadPromptsBtn().addEventListener("click", downloadPrompts);

    // Init CKEditor
    if (typeof CKEDITOR !== "undefined") {
      CKEDITOR.ClassicEditor
        .create(document.querySelector("#editor"), {
          licenseKey: 'GPL',
          toolbar: {
            items: [
              'heading', '|',
              'bold', 'italic', 'strikethrough', 'underline', 'link', '|',
              'bulletedList', 'numberedList', 'todoList', '|',
              'outdent', 'indent', '|',
              'undo', 'redo', '-',
              'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
              'alignment', '|',
              'blockQuote', 'insertTable', 'mediaEmbed', 'codeBlock', 'htmlEmbed', '|',
              'specialCharacters', 'horizontalLine', 'pageBreak', '|',
              'sourceEditing'
            ],
            shouldNotGroupWhenFull: true
          },
          removePlugins: [
            'AIAssistant', 'CKBox', 'CKFinder', 'EasyImage', 
            'RealTimeCollaborativeComments', 'RealTimeCollaborativeTrackChanges', 
            'RealTimeCollaborativeRevisionHistory', 'PresenceList', 'Comments', 
            'TrackChanges', 'TrackChangesData', 'RevisionHistory', 'Pagination', 
            'WProofreader', 'MathType', 'SlashCommand', 'Template', 'DocumentOutline', 
            'FormatPainter', 'TableOfContents', 'PasteFromOfficeEnhanced', 'CaseChange'
          ],
          htmlSupport: {
            allow: [
              {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
              }
            ]
          }
        })
        .then(editor => {
          editorInstance = editor;
        })
        .catch(err => {
          console.error("CKEditor error", err);
        });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onReady);
  else onReady();
})();
