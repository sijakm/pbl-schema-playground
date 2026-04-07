/************************************
 * TIMER UI
 ************************************/
let timerInterval = null;
let startTime = null;

let lastJsonText = "";
let lastJsonObject = null;
let lastRenderedHtml = "";
let activeAbortControllers = [];

// ---- token usage tracking ----
const tokenUsage = { input: 0, output: 0, total: 0, calls: 0 };

function resetTokenUsage() {
  tokenUsage.input = 0; tokenUsage.output = 0; tokenUsage.total = 0; tokenUsage.calls = 0;
  const panel = document.getElementById("tokenSummary");
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

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set("tsInput",        fmt(tokenUsage.input));
  set("tsInputCost",    fmtUSD(inputCost));
  set("tsOutput",       fmt(tokenUsage.output));
  set("tsOutputCost",   fmtUSD(outputCost));
  set("tsTotal",        fmt(tokenUsage.total));
  set("tsTotalCost",    `${tokenUsage.calls} call${tokenUsage.calls !== 1 ? "s" : ""}`);
  set("tsCallCount",    String(tokenUsage.calls));
  set("tsModel",        model);
  set("tsTotalCostValue", `$${totalCost.toFixed(4)}`);

  const panel = document.getElementById("tokenSummary");
  if (panel) panel.style.display = "block";
}

function setRenderEnabled(enabled) {
  // Logic removed (Run Chain handles rendering)
}

function startTimer() {
  startTime = Date.now();
  const status = document.getElementById("status");

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

  const status = document.getElementById("status");
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
 * RENDER UI FOR DESCRIPTIONS
 ************************************/

function findInvalidChars(text) {
  const issues = [];

  if (/[\u201C\u201D]/.test(text)) issues.push("Smart double quotes");
  if (/[\u2018\u2019]/.test(text)) issues.push("Smart single quotes");
  if (/[\u2013\u2014]/.test(text)) issues.push("Long dash (– or —)");
  if (/…/.test(text)) issues.push("Ellipsis (…)");

  if (/[\u2028\u2029]/.test(text)) issues.push("Invalid line separator");
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text)) issues.push("Non-ASCII characters");
  if (/\n/.test(text)) issues.push("Line breaks are not allowed");
  if (/\t/.test(text)) issues.push("Tabs are not allowed");

  return issues;
}



/************************************
 * STREAMING HELPERS (SSE parsing)
 ************************************/
function parseSseLines(buffer) {
  // SSE payload is lines like:
  // data: {...}\n
  // data: {...}\n
  // \n
  // We'll return {events, rest}
  const events = [];
  const parts = buffer.split("\n");
  // Keep last partial line as remainder
  let rest = parts.pop() ?? "";

  for (const line of parts) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (!trimmed.startsWith("data:")) continue;

    const data = trimmed.slice(5).trim();
    if (!data) continue;

    events.push(data);
  }

  return { events, rest };
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
        // We use the initial schema for reference to find property indices
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

let lastEditedSchema = null;
let currentAppSchema = null; 

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

  runBtn.disabled = isRunning;
  cancelBtn.disabled = !isRunning;

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
  generatePrompt();
  
  const schema = schemaEditor.getModifiedSchema();
  if (!schema) {
    alert("Critical Error: JSON Schema is missing or invalid. Please check the console.");
    return;
  }
  
  const model = document.getElementById("modelSelect").value;
  console.log("🚀 Running with model:", model, "and schema:", schema);
  lastEditedSchema = schema;

  const HARDCODED_PASSWORD = ""; // Enter password here while working locally
  const apiKey = HARDCODED_PASSWORD || document.getElementById("apiKey").value.trim();
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  output.value = "";
  resetTokenUsage();
  startTimer();
  setUiRunning(true);

  // Abort support
  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  // Simple “stuck detector”: if no deltas for 20s, print a marker.
  let lastDeltaAt = Date.now();
  let consecutiveWhitespaceCount = 0;
  const MAX_WHITESPACE_DELTAS = 1000;
  const stuckInterval = setInterval(() => {
    const diff = Date.now() - lastDeltaAt;
    if (diff > 30000) {
      output.value += `\n\n[⚠️ No streamed output for ${(diff/1000).toFixed(0)}s — The model is still thinking 🤔]\n`;
      output.scrollTop = output.scrollHeight;
      lastDeltaAt = Date.now(); // avoid spamming
    }
  }, 4000);

  try {
    console.log("🚀 Main Prompt:", prompt);
    // ✅ Use playground endpoint as requested
    const response = await fetch("https://fancy-sun-80f1.sijakmilan.workers.dev", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
  },
  signal,
  body: JSON.stringify({
    model: model,
    stream: true,
    reasoning: { effort: "low" },
    input: [
      { role: "user", content: prompt }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "PBLUnitPlanResponse",
        schema: schema,
        strict: true
      }
    }
  })
});

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      output.value =
        `HTTP ${response.status} ${response.statusText}\n\n` +
        (errText || "(no body)");
      stopTimer("Error");
      return;
    }

    if (!response.body) {
      output.value = "No response body (stream not available in this environment).";
      stopTimer("Error");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";
    let finalText = "";
    
    // Throttle UI updates
    let lastUiUpdateAt = 0;
    const UI_UPDATE_INTERVAL = 100; // 100ms
    let pendingDeltas = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const { events, rest } = parseSseLines(buffer);
      buffer = rest;

      for (const raw of events) {
        if (raw === "[DONE]") {
          break;
        }

        let evt;
        try {
          evt = JSON.parse(raw);
        } catch {
          continue;
        }

        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          lastDeltaAt = Date.now();
        
          // 🔒 WHITESPACE STALL DETECTOR
          if (evt.delta.trim().length === 0) {
            consecutiveWhitespaceCount++;
          } else {
            consecutiveWhitespaceCount = 0;
          }
        
          if (consecutiveWhitespaceCount >= MAX_WHITESPACE_DELTAS) {
            alert(
              "⚠️ Model output stalled.\n\n" +
              "Too many empty / whitespace tokens were received.\n" +
              "The request was stopped. Please run again."
            );
        
            currentAbortController?.abort();
            break;
          }
        
          pendingDeltas += evt.delta;
          finalText += evt.delta;
          
          const now = Date.now();
          if (now - lastUiUpdateAt > UI_UPDATE_INTERVAL) {
            lastUiUpdateAt = now;
            const shouldAutoScroll = isUserNearBottom(output);
            output.value += pendingDeltas;
            pendingDeltas = "";
            if (shouldAutoScroll) {
              output.scrollTop = output.scrollHeight;
            }
          }
          continue;
        }

        if (evt.type === "response.refusal.delta" && typeof evt.delta === "string") {
          lastDeltaAt = Date.now();
          output.value += evt.delta;
          output.scrollTop = output.scrollHeight;
          continue;
        }

        if (evt.type === "error") {
          lastDeltaAt = Date.now();
          output.value += `\n\n[ERROR]\n${JSON.stringify(evt, null, 2)}\n`;
          output.scrollTop = output.scrollHeight;
          continue;
        }

        if (evt.type === "response.completed" && evt.response?.usage) {
          addTokenUsage(evt.response.usage);
        }
      }
    }
    
    // One final update if there are leftover pending deltas
    if (pendingDeltas) {
      const shouldAutoScroll = isUserNearBottom(output);
      output.value += pendingDeltas;
      if (shouldAutoScroll) {
        output.scrollTop = output.scrollHeight;
      }
    }

    try {
      const parsed = JSON.parse(finalText);
      const pretty = JSON.stringify(parsed, null, 2);

      console.log("📥 Main Response JSON:", parsed);
      output.value = pretty;

      lastJsonObject = parsed;
      lastJsonText = pretty;
      
      // Automatically trigger HTML rendering (Run Chain)
      await renderHtml();
    } catch {
      output.value += "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
      lastJsonObject = null;
      lastJsonText = "";
      setRenderEnabled(false);
    }

    updateTokenSummaryUI(model);
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
    clearInterval(stuckInterval);
    currentAbortController = null;
    setUiRunning(false);
  }
}

async function renderHtml() {
  const htmlOutput = document.getElementById("htmlOutput");
  const output = document.getElementById("output");
  
  htmlOutput.innerHTML = "<p>Rendering all 11 sections in parallel... Please wait.</p>";
  
  const promptsSet = window.currentPblPrompts || window.pblPrompts_en;
  const prompts = [
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

  const responseLanguage = document.getElementById("input_ResponseLanguage")?.value || "English";
  const HARDCODED_PASSWORD = ""; // Enter password here while working locally
  const apiKey = HARDCODED_PASSWORD || document.getElementById("apiKey").value.trim();
  const model = document.getElementById("modelSelect").value;
  
  const results = {};
  
  output.value += "\n\n=== Starting Parallel HTML Rendering (11 tasks) ===\n";

  const tasks = prompts.map(async (p) => {
    if (!p.prompt) {
      console.error(`❌ Missing prompt for: ${p.name}`);
      results[p.key] = `<p style="color:red">Error: Prompt missing for ${p.name}</p>`;
      return;
    }

    const promptContent = fillTemplate(p.prompt, {
      ResponseLanguage: responseLanguage,
      JsonResponse: lastJsonText
    });

    console.log(`🚀 Section Prompt [${p.name}]:`, promptContent);

    try {
      const res = await fetch("https://fancy-sun-80f1.sijakmilan.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "Authorization": `Bearer ${apiKey}` } : {})
        },
        body: JSON.stringify({
          model: model,
          stream: true,
          reasoning: { effort: "low" },
          input: [{ role: "user", content: promptContent }]
        })
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";
      let sectionHtml = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = parseSseLines(buffer);
        buffer = rest;

        for (const raw of events) {
          if (raw === "[DONE]") break;
          try {
            const evt = JSON.parse(raw);
            if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
              sectionHtml += evt.delta;
            }
            if (evt.type === "response.completed" && evt.response?.usage) {
              addTokenUsage(evt.response.usage);
            }
          } catch (e) { continue; }
        }
      }

      console.log(`📥 Section HTML extracted [${p.name}]:`, sectionHtml.length, "chars");
      results[p.key] = sectionHtml;
    } catch (err) {
      console.error(`❌ Error in ${p.name}:`, err);
      results[p.key] = `<p style="color:red">Error rendering ${p.name}: ${err.message}</p>`;
    }
  });

  await Promise.all(tasks);

  // Final Assembly in specific order
  let combinedHtml = "";
  prompts.forEach(p => {
    if (results[p.key]) {
      combinedHtml += results[p.key] + "\n";
    }
  });

  htmlOutput.value = combinedHtml;

  const htmlPreview = document.getElementById("htmlPreview");
  if (htmlPreview) {
    htmlPreview.srcdoc = combinedHtml;
  }

  output.value += "=== HTML Render Completed ===\n";
  updateTokenSummaryUI(model);
  setRenderEnabled(true);
}


function isUserNearBottom(el, threshold = 40) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

/************************************
 * DEBUG / MANUAL LOAD
 ************************************/
function loadJsonAndEnableRender(jsonTextOrObj) {
  try {
    let input = jsonTextOrObj;
    
    // If it's a string, try to clean it (remove markdown code blocks if any)
    if (typeof input === "string") {
      input = input.trim();
      // Remove starting ```json if present
      if (input.startsWith("```json")) {
        input = input.replace(/^```json/, "");
      } else if (input.startsWith("```")) {
        input = input.replace(/^```/, "");
      }
      
      // Remove ending ``` if present
      if (input.endsWith("```")) {
        input = input.replace(/```$/, "");
      }
      
      input = input.trim();
    }

    const parsed =
      typeof input === "string"
        ? JSON.parse(input)
        : input;

    lastJsonObject = parsed;
    lastJsonText = JSON.stringify(parsed, null, 2);
    setRenderEnabled(true);

    // Also populate the output box so the user sees something changed
    const outputEl = document.getElementById("output");
    if (outputEl) {
      outputEl.value = lastJsonText;
    }

    console.log("✅ JSON loaded. You can now click Render HTML.");
  } catch (e) {
    console.error("❌ Invalid JSON:", e);
    alert("Invalid JSON: " + e.message);
  }
}

window.loadJsonAndEnableRender = loadJsonAndEnableRender;
window.run = run;
window.renderHtml = renderHtml;
window.cancelRun = cancelRun;
window.copySchema = () => schemaEditor.copySchemaUI();

/************************************
 * TEMPLATE ENGINE
 ************************************/
function fillTemplate(template, data) {
  if (!template) return "";
  // Supports {{$Var}}, {{{$Var}}}, [[$Var]], and nested keys like {{{framing.Problem}}}
  return template.replace(/(\{\{\{?|\[\[)([$a-zA-Z0-9_.]+)(\}\}\}?|\]\])/g, (match, open, key, close) => {
    // Basic support for nested paths through simple property access if needed
    if (key.includes(".")) {
      const parts = key.split(".");
      let val = data;
      for (const part of parts) {
        if (val && typeof val === "object") val = val[part];
        else { val = undefined; break; }
      }
      return val !== undefined ? val : match;
    }
    return data[key] !== undefined ? data[key] : match;
  });
}

function generatePrompt() {
  const data = {
    "$Subject": document.getElementById("input_Subject").value,
    "$Name": document.getElementById("input_Name").value,
    "$UserPrompt": document.getElementById("input_UserPrompt").value,
    "$GradeLevel": document.getElementById("input_GradeLevel").value,
    "$NumberOfDays": document.getElementById("input_NumberOfDays").value,
    "$Location": document.getElementById("input_Location").value,
    "$MediaContext": document.getElementById("input_MediaContext").value,
    "$AttachedUnit": document.getElementById("input_AttachedUnit").value,
    "$LearningPlans": document.getElementById("input_LearningPlans").value,
    "$Standards": document.getElementById("input_Standards").value,
    "$ResponseLanguage": document.getElementById("input_ResponseLanguage").value
  };

  const prompts = window.currentPblPrompts || window.pblPrompts_en;
  const finalPrompt = fillTemplate(prompts?.defaultPrompt || window.defaultPrompt, data);
  document.getElementById("prompt").value = finalPrompt;
}

/************************************
 * EXPORT PROMPTS TO ZIP
 ************************************/
async function downloadPrompts() {
  if (typeof JSZip === "undefined") {
    alert("JSZip is not loaded yet. Please wait or check your internet connection.");
    return;
  }

  const status = document.getElementById("status");
  const oldText = status.textContent;
  status.textContent = "Generating ZIP files...";

  try {
    const configs = [
      { filename: "pbl_prompts_en.zip", data: window.pblPrompts_en },
      { filename: "pbl_prompts_sr.zip", data: window.pblPrompts_sr }
    ];

    for (const config of configs) {
      const zip = new JSZip();
      const data = config.data;

      if (!data) {
        console.warn(`No data found for ${config.filename}`);
        continue;
      }

      for (const key in data) {
        let content = data[key];
        let fileExt = "txt";

        if (typeof content === "object" && content !== null) {
          content = JSON.stringify(content, null, 2);
          fileExt = "json";
        } else if (key.toLowerCase().includes("schema")) {
          // If it's a string but named schema, give it .json extension
          fileExt = "json";
        }

        zip.file(`${key}.${fileExt}`, content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = config.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
    status.textContent = "ZIP files downloaded successfully.";
  } catch (err) {
    console.error("ZIP Generation Error:", err);
    status.textContent = "Error generating ZIP files.";
  } finally {
    setTimeout(() => {
      if (status.textContent.includes("downloaded") || status.textContent.includes("Error")) {
          // Keep the message for a bit then restore or clear
      }
    }, 3000);
  }
}

window.downloadPrompts = downloadPrompts;

function onReady() {
  const schema = ensureSchema();
  if (!schema) {
    console.error("Schema failed to load. Check console for details.");
  }

  // Toggle buttons logic for PBL
  const seHeader = document.getElementById("toggleSchemaEditorHeader");
  const seContainer = document.getElementById("schemaEditorContainer");
  const seBtn = document.getElementById("toggleSchemaEditorBtn");
  if (seHeader && seContainer && seBtn) {
    seHeader.addEventListener("click", () => {
      const isHidden = seContainer.style.display === "none";
      seContainer.style.display = isHidden ? "block" : "none";
      seBtn.textContent = isHidden ? "Hide Editor" : "Show Editor";
      if (isHidden && window.schemaEditor) window.schemaEditor.render();
    });
  }

  const ivHeader = document.getElementById("toggleInputVariablesHeader");
  const ivContainer = document.getElementById("inputVariablesContainer");
  const ivBtn = document.getElementById("toggleInputVariablesBtn");
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

window.generatePrompt = generatePrompt;
