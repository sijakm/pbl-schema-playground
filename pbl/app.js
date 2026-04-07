/************************************
 * SHARED HELPERS & COMPONENTS
 ************************************/
const { $, nowMs, fmtMs, logLine, setStatus, fillTemplate } = window.utils;
const tokenManager = new window.TokenManager();

// Aliases for compatibility
const log = (msg) => logLine($("log"), msg);
const statusMsg = (msg) => setStatus($("status"), msg);

/************************************
 * TIMER UI
 ************************************/
let timerInterval = null;
let startTime = null;

let lastJsonText = "";
let lastJsonObject = null;
let lastRenderedHtml = "";
let activeAbortControllers = [];

function setRenderEnabled(enabled) {
  const btn = $("renderBtn");
  if (btn) btn.disabled = !enabled;
}

function startTimer() {
  startTime = Date.now();
  const status = $("status");

  timerInterval = setInterval(() => {
    const elapsedMs = Date.now() - startTime;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    status.textContent = `Running… ${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, 500);
}

function stopTimer(finalMessage) {
  clearInterval(timerInterval);
  timerInterval = null;

  const elapsedMs = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const status = $("status");
  status.textContent =
    (finalMessage ? `${finalMessage} ` : "") +
    `(${minutes}:${seconds.toString().padStart(2, "0")})`;
}

/************************************
 * DESCRIPTION COLLECTION
 ************************************/
function collectDescriptions(schema, path = [], result = []) {
  if (!schema || typeof schema !== "object") return result;

  if (typeof schema.description === "string") {
    result.push({
      path: [...path, "description"],
      value: schema.description
    });
  }

  if (schema.properties) {
    for (const key in schema.properties) {
      collectDescriptions(schema.properties[key], [...path, "properties", key], result);
    }
  }

  if (schema.items) {
    collectDescriptions(schema.items, [...path, "items"], result);
  }

  return result;
}

/************************************
 * API Client Wrapper
 ************************************/
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
      format: { type: "json_schema", name: schemaName || "Response", schema: schemaObj, strict: true }
    };
  }
  return await window.apiClient.stream({
    endpoint, apiKey, body, signal,
    onDelta: params.onDelta,
    onUsage: (usage) => tokenManager.add(usage),
    onError: (err) => { throw new Error(err.message || "Unknown error"); }
  });
}

/************************************
 * RUN (STREAM ONLY into #output)
 ************************************/
const schemaEditor = new window.SchemaEditor({
  container: document.getElementById("schemaMainEditor"),
  tabs: [
    { 
      id: "main", 
      label: "Main", 
      schema: (window.currentPblPrompts || window.pblPrompts_en)?.pblResponseSchema || window.pblResponseSchema, 
      template: (window.currentPblPrompts || window.pblPrompts_en)?.defaultPrompt
    }
  ],
  colorProvider: (node, name, pathArr, inheritedColor) => {
    const depth = pathArr.length;
    if (depth === 4 && pathArr[0] === "properties" && pathArr[2] === "properties") {
        const colors = ["color-blue", "color-green", "color-orange", "color-purple", "color-pink", "color-teal"];
        const initialSchema = (window.currentPblPrompts || window.pblPrompts_en)?.pblResponseSchema || window.pblResponseSchema;
        const unitPlanProps = initialSchema.properties?.UnitPlan?.properties || {};
        const idx = Object.keys(unitPlanProps).indexOf(name);
        if (idx !== -1) return colors[idx % colors.length];
    }
    return inheritedColor || "color-gray";
  },
  onUpdate: () => window.generatePrompt ? window.generatePrompt() : null
});
window.schemaEditor = schemaEditor;

function ensureSchema() {
  if (schemaEditor.getModifiedSchema()) return schemaEditor.getModifiedSchema();
  schemaEditor.init();
  return schemaEditor.getModifiedSchema();
}

let currentAbortController = null;

function resetAppSchema() {
  const prompts = window.currentPblPrompts || window.pblPrompts_en;
  const schema = prompts?.pblResponseSchema || window.pblResponseSchema;
  schemaEditor.updateData([
    { id: "main", label: "Main", schema: schema, template: null }
  ]);
}
window.resetAppSchema = resetAppSchema;

function setUiRunning(isRunning) {
  const runBtn = document.getElementById("runBtn");
  const renderBtn = document.getElementById("renderBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  if (runBtn) runBtn.disabled = isRunning;
  if (cancelBtn) cancelBtn.disabled = !isRunning;

  if (renderBtn) {
    renderBtn.disabled = isRunning || !lastJsonObject;
  }
}

function cancelRun() {
  if (currentAbortController) currentAbortController.abort();

  for (const ac of activeAbortControllers) {
    try { ac.abort(); } catch {}
  }
  activeAbortControllers = [];
}

async function run() {
  if (window.generatePrompt) window.generatePrompt();
  const schema = schemaEditor.getModifiedSchema();
  if (!schema) {
    alert("Critical Error: JSON Schema is missing or invalid.");
    return;
  }
  const model = $("modelSelect").value;
  const HARDCODED_PASSWORD = ""; 
  const apiKey = HARDCODED_PASSWORD || $("apiKey").value.trim();
  const prompt = $("prompt").value;
  const output = $("output");

  output.value = "";
  tokenManager.reset();
  startTimer();
  setUiRunning(true);

  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  try {
    let finalText = "";
    finalText = await callResponsesApiStream({
      endpoint: "https://fancy-sun-80f1.sijakmilan.workers.dev",
      apiKey, model, prompt,
      schemaName: "PBLUnitPlanResponse",
      schemaObj: schema,
      signal,
      onDelta: (delta) => {
        output.value += delta;
        output.scrollTop = output.scrollHeight;
      }
    });

    try {
      const parsed = JSON.parse(finalText);
      const pretty = JSON.stringify(parsed, null, 2);
      output.value = pretty;
      lastJsonObject = parsed;
      lastJsonText = pretty;
      await renderHtml();
    } catch {
      output.value += "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
      lastJsonObject = null;
    }

    tokenManager.updateUI(model);
    stopTimer("Completed");
  } catch (err) {
    if (err?.name === "AbortError") {
      output.value += "\n\n[Cancelled]\n";
      stopTimer("Cancelled");
    } else {
      output.value += `\n\n[Fetch error]\n${err?.message || String(err)}\n`;
      stopTimer("Error");
    }
  } finally {
    currentAbortController = null;
    setUiRunning(false);
  }
}

async function renderHtml() {
  const htmlOutput = $("htmlOutput");
  const output = $("output");
  
  htmlOutput.innerHTML = "<p>Rendering sections in parallel... Please wait.</p>";
  
  const promptsSet = window.currentPblPrompts || window.pblPrompts_en;
  const promptsList = [
    { key: "p1",  name: "Unit Description",                     prompt: promptsSet.unitDescriptionHtmlPrompt },
    { key: "p2",  name: "Assess Prior Knowledge",               prompt: promptsSet.assessPriorKnowledgeHtmlPrompt },
    { key: "p3",  name: "Unit Overview",                        prompt: promptsSet.unitOverviewHtmlPrompt },
    { key: "p4",  name: "Desired Outcomes",                     prompt: promptsSet.desiredOutcomesHtmlPrompt },
    { key: "p5",  name: "Framing the Project",                  prompt: promptsSet.framingTheProjectHtmlPrompt },
    { key: "p6",  name: "Assessment Plan",                      prompt: promptsSet.assesmentPlanHtmlPrompt },
    { key: "p7",  name: "Learning Plan",                        prompt: promptsSet.learningPlanHtmlPrompt },
    { key: "p8",  name: "Teacher Guidance: Phase 1",            prompt: promptsSet.teacherGuidancePhase1HtmlPrompt },
    { key: "p9",  name: "Teacher Guidance: Phase 2",            prompt: promptsSet.teacherGuidancePhase2HtmlPrompt },
    { key: "p10", name: "Teacher Guidance: Phase 3",            prompt: promptsSet.teacherGuidancePhase3HtmlPrompt },
    { key: "p11", name: "Unit Preparation & Considerations",     prompt: promptsSet.unitPreparationAndConsiderationsHtmlPrompt }
  ];

  const responseLanguage = $("input_ResponseLanguage")?.value || "English";
  const apiKey = $("apiKey").value.trim();
  const model = $("modelSelect").value;
  
  const results = {};
  output.value += "\n\n=== Starting Parallel HTML Rendering ===\n";

  const tasks = promptsList.map(async (p) => {
    if (!p.prompt) return;
    const promptContent = window.utils.fillTemplate(p.prompt, {
      ResponseLanguage: responseLanguage,
      JsonResponse: lastJsonText
    });

    try {
      results[p.key] = await callResponsesApiStream({
        endpoint: "https://fancy-sun-80f1.sijakmilan.workers.dev",
        apiKey, model,
        prompt: promptContent,
        signal: currentAbortController?.signal
      });
      output.value += `[OK] ${p.name} rendered.\n`;
    } catch (e) {
      output.value += `[ERR] ${p.name}: ${e.message}\n`;
      results[p.key] = `<p style="color:red">Error rendering ${p.name}</p>`;
    }
    output.scrollTop = output.scrollHeight;
  });

  await Promise.all(tasks);

  output.value += "=== HTML Render Completed ===\n";
  tokenManager.updateUI(model);
  setRenderEnabled(true);
  
  // Join the results in order
  const finalHtml = promptsList.map(p => results[p.key] || "").join("<hr/>");
  htmlOutput.value = finalHtml;
  if ($("htmlPreview")) $("htmlPreview").srcdoc = finalHtml;
}

function generatePrompt() {
  const data = {
    "Subject": $("input_Subject")?.value || "",
    "Name": $("input_Name")?.value || "",
    "UserPrompt": $("input_UserPrompt")?.value || "",
    "GradeLevel": $("input_GradeLevel")?.value || "",
    "NumberOfDays": $("input_NumberOfDays")?.value || "",
    "Location": $("input_Location")?.value || "",
    "MediaContext": $("input_MediaContext")?.value || "",
    "AttachedUnit": $("input_AttachedUnit")?.value || "",
    "LearningPlans": $("input_LearningPlans")?.value || "",
    "Standards": $("input_Standards")?.value || "",
    "ResponseLanguage": $("input_ResponseLanguage")?.value || ""
  };

  const prompts = window.currentPblPrompts || window.pblPrompts_en;
  const template = (window.schemaEditor && window.schemaEditor.getModifiedTemplate("main")) || prompts?.defaultPrompt || window.defaultPrompt;
  const finalPrompt = window.utils.fillTemplate(template, data);
  if ($("prompt")) $("prompt").value = finalPrompt;
}

async function downloadPrompts() {
  if (typeof JSZip === "undefined") {
    alert("JSZip not found!"); return;
  }
  const zip = new JSZip();
  const vars = {
    Subject: $("input_Subject")?.value || "",
    Name: $("input_Name")?.value || "",
    UserPrompt: $("input_UserPrompt")?.value || "",
    GradeLevel: $("input_GradeLevel")?.value || "",
    ClassDuration: $("input_NumberOfDays")?.value || "", 
    Standards: $("input_Standards")?.value || ""
  };

  const p = window.currentPblPrompts || window.pblPrompts_en;
  zip.file("pbl_outline_prompt.txt", window.utils.fillTemplate(p.defaultPrompt, vars));
  zip.file("pbl_schema.json", JSON.stringify(p.pblResponseSchema, null, 2));

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pbl_prompts.zip";
  a.click();
}

function onReady() {
  ensureSchema();
  
  // Toggle buttons logic for PBL
  const seHeader = $("toggleSchemaEditorHeader");
  const seContainer = $("schemaEditorContainer");
  const seBtn = $("toggleSchemaEditorBtn");
  if (seHeader && seContainer && seBtn) {
    seHeader.addEventListener("click", () => {
      const isHidden = seContainer.style.display === "none";
      seContainer.style.display = isHidden ? "block" : "none";
      seBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
      if (isHidden && window.schemaEditor) window.schemaEditor.render();
    });
  }

  const ivHeader = $("toggleInputVariablesHeader");
  const ivContainer = $("inputVariablesContainer");
  const ivBtn = $("toggleInputVariablesBtn");
  if (ivHeader && ivContainer && ivBtn) {
    ivHeader.addEventListener("click", () => {
      const isHidden = ivContainer.style.display === "none";
      ivContainer.style.display = isHidden ? "block" : "none";
      ivBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
    });
  }

  generatePrompt();
  setRenderEnabled(false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onReady);
} else {
  onReady();
}

// Global exports
window.run = run;
window.renderHtml = renderHtml;
window.cancelRun = cancelRun;
window.generatePrompt = generatePrompt;
window.downloadPrompts = downloadPrompts;
window.resetAppSchema = resetAppSchema;
