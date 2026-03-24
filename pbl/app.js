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
  const renderBtn = document.getElementById("renderBtn");
  if (renderBtn) renderBtn.disabled = !enabled;
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
let lastEditedSchema = null;
let currentAppSchema = null; 

function ensureSchema() {
  if (currentAppSchema) return currentAppSchema;

  const prompts = window.currentPblPrompts || window.pblPrompts_en;
  const rawSchema = prompts?.pblResponseSchema || window.pblResponseSchema;
  
  if (!rawSchema) {
    console.warn("⚠️ No schema found in currentPblPrompts or pblResponseSchema");
    return null;
  }

  try {
    currentAppSchema = typeof rawSchema === "string" ? JSON.parse(rawSchema) : rawSchema;
    console.log("✅ Schema initialized:", currentAppSchema);
    return currentAppSchema;
  } catch (e) {
    console.error("❌ Schema parsing failed", e);
    return null;
  }
}

let currentAbortController = null;

function resetAppSchema() {
  currentAppSchema = null;
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
  
  const schema = ensureSchema();
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
      setRenderEnabled(true);
    } catch {
      output.value += "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
      lastJsonObject = null;
      lastJsonText = "";
      setRenderEnabled(false);
    }

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
  if (!lastJsonText) {
    alert("No JSON to render. Please run the unit plan generation first.");
    return;
  }

  const htmlOutput = document.getElementById("htmlOutput");
  const output = document.getElementById("output");
  
  setRenderEnabled(false);
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
window.copySchema = copySchema;

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
      { filename: "prompts_en.zip", data: window.pblPrompts_en },
      { filename: "prompts_sr.zip", data: window.pblPrompts_sr }
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

/************************************
 * INIT
 ************************************/
window.onload = () => {
  const schema = ensureSchema();
  if (!schema) {
    alert("Schema failed to load. Check console for details.");
  }
  generatePrompt();
  setRenderEnabled(false);
};

window.generatePrompt = generatePrompt;
