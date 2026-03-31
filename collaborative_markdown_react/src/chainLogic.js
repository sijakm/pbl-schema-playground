export const DEFAULT_ENDPOINT = "https://fancy-sun-80f1.sijakmilan.workers.dev";

export const MODEL_PRICING = {
  "gpt-5.4":      { input: 2.50,  output: 15.00 },
  "gpt-5.4-mini": { input: 0.75,  output: 4.50  },
  "gpt-5.4-nano": { input: 0.20,  output: 1.25  },
  "gpt-5-mini":   { input: 0.75,  output: 4.50  },
  "gpt-5.2":      { input: 2.50,  output: 15.00 },
};

export function fillTemplate(tpl, vars) {
  return tpl.replace(/\{\{\{?\$?([A-Za-z0-9_]+)\}?\}\}/g, (match, key) => {
    const v = vars[key];
    return v === undefined || v === null ? match : String(v);
  });
}

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

export async function callResponsesApiStream({ endpoint, apiKey, model, prompt, schemaName, schemaObj, signal, onUsage }) {
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const body = {
    model,
    stream: true,
    reasoning: { effort: "low" },
    input: [{ role: "user", content: prompt }],
  };

  if (schemaObj) {
    body.text = {
      format: {
        type: "json_schema",
        name: schemaName || "Response",
        schema: schemaObj,
        strict: true,
      },
    };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
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
      if (done) { streamClosed = true; break; }
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseLines(buffer);
      buffer = parsed.rest;

      for (const raw of parsed.events) {
        if (raw === "[DONE]") { streamClosed = true; break; }
        let evt;
        try { evt = JSON.parse(raw); } catch { continue; }

        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          finalText += evt.delta;
        }
        if (evt.type === "response.completed" && evt.response?.usage) {
          onUsage && onUsage(evt.response.usage);
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

export function createLimiter(maxConcurrent = 4) {
  let active = 0;
  const queue = [];
  const next = () => {
    if (active >= maxConcurrent) return;
    const item = queue.shift();
    if (!item) return;
    active++;
    item().catch(() => {}).finally(() => { active--; next(); });
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

export async function withRetry(taskFn, label, globalAbortSignal, timeoutMs = 180000, maxRetries = 2, onLog) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      onLog && onLog(`[timeout] ${label} (Attempt ${attempt}) timed out after ${timeoutMs / 1000}s. Retrying...`);
      controller.abort();
    }, timeoutMs);

    try {
      const onGlobalAbort = () => controller.abort();
      if (globalAbortSignal) globalAbortSignal.addEventListener("abort", onGlobalAbort, { once: true });

      const result = await taskFn(controller.signal);
      clearTimeout(timeoutId);
      if (globalAbortSignal) globalAbortSignal.removeEventListener("abort", onGlobalAbort);
      return result;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
      const isGlobalAbort = globalAbortSignal && globalAbortSignal.aborted;
      if (isGlobalAbort) throw err;
      if (attempt < maxRetries) {
        const reason = (controller.signal.aborted && !isGlobalAbort) ? "Timeout" : (err.message || "Unknown error");
        onLog && onLog(`[retry] ${label} failed (${reason}). Starting attempt ${attempt + 1}...`);
      }
    }
  }
  throw lastError;
}

export function buildUnitCommonJson(step0Obj, unitTitle) {
  return {
    UnitTitle: unitTitle,
    UnitDescription: step0Obj?.UnitDescription?.Description || "",
    EssentialQuestions: step0Obj?.UnitDescription?.EssentialQuestions || [],
    StudentLearningObjectives: step0Obj?.UnitDescription?.StudentLearningObjectives || [],
    StandardsAligned: step0Obj?.UnitDescription?.StandardsAligned || [],
    KeyVocabulary: step0Obj?.UnitDescription?.KeyVocabulary || [],
  };
}

export function generateMarkdown(unitObj, lessonObjs, lang) {
  const labels = lang === "en" ? {
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
    expected: "✅ Expected Student Responses",
  } : {
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
    expected: "✅ Očekivani odgovori učenika",
  };

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
    if (l.Instruction?.InstructionsForTeachers) md += `**${labels.teacherInstructions}**\n\n${l.Instruction.InstructionsForTeachers}\n\n`;
    if (l.Instruction?.AnticipatedMisconceptions) md += `**${labels.misconceptions}**\n\n${l.Instruction.AnticipatedMisconceptions}\n\n`;
    if (l.Instruction?.TranscendentThinking) md += `### ${labels.transcendent}\n\n${l.Instruction.TranscendentThinking}\n\n`;
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
      if (l.CollaborativeActivities.InstructionsForTeachers) md += `**${labels.teacherInstructions}**\n\n${l.CollaborativeActivities.InstructionsForTeachers}\n\n`;
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
    if (l.FormativeAssessment) md += `### ${labels.formative}\n\n${l.FormativeAssessment}\n\n`;
    if (l.StudentPractice) md += `### <span style="color:rgb(115, 191, 39);">${labels.practice}</span>\n\n${l.StudentPractice}\n\n`;
  });

  return md;
}
