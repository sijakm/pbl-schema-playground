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

function renderDescriptionEditor() {
  const container = document.getElementById("descriptions");
  container.innerHTML = "";

  const descriptions = collectDescriptions(parsedMasterSchema);

  descriptions.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    // Label
    const label = document.createElement("label");
    label.innerText = item.path
      .filter(p => !["properties", "items", "description"].includes(p))
      .join(" → ");
    label.style.display = "block";
    label.style.fontWeight = "bold";
    label.style.marginBottom = "4px";

    // Textarea
    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.style.resize = "vertical";
    textarea.style.width = "100%";
    textarea.value = item.value;
    textarea.dataset.path = JSON.stringify(item.path);

    // Warning message
    const warning = document.createElement("div");
    warning.style.color = "#b00020";
    warning.style.fontSize = "12px";
    warning.style.marginTop = "4px";
    warning.style.display = "none";

    // Validation on input
    textarea.addEventListener("input", () => {
      const problems = findInvalidChars(textarea.value);

      if (problems.length > 0) {
        textarea.style.border = "2px solid #b00020";
        warning.style.display = "block";
        warning.textContent =
          "Invalid characters detected: " + problems.join(", ");
      } else {
        textarea.style.border = "";
        warning.style.display = "none";
        warning.textContent = "";
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    wrapper.appendChild(warning);
    container.appendChild(wrapper);
  });
}


/************************************
 * PATH SETTER
 ************************************/
function setValueAtPath(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

/************************************
 * COPY SCHEMA
 ************************************/
function copySchema() {
  const textarea = document.getElementById("finalSchema");
  if (!textarea.value) {
    alert("Schema is empty.");
    return;
  }
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  navigator.clipboard.writeText(textarea.value)
    .then(() => alert("Schema copied to clipboard ✅"))
    .catch(() => alert("Failed to copy schema."));
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
let parsedMasterSchema = null;

let currentAbortController = null;

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
  // Clone schema and apply description edits
  const invalidFields = [];
  const model = document.getElementById("modelSelect").value;

document.querySelectorAll("#descriptions textarea").forEach(t => {
  if (findInvalidChars(t.value).length > 0) {
    invalidFields.push(t);
  }
});

if (invalidFields.length > 0) {
  alert("Some fields contain invalid characters. Please fix highlighted fields.");
  return;
}
  
  const schema = JSON.parse(JSON.stringify(parsedMasterSchema));
  document.querySelectorAll("#descriptions textarea").forEach(textarea => {
    const path = JSON.parse(textarea.dataset.path);
    setValueAtPath(schema, path, textarea.value.trim());
  });
  lastEditedSchema = schema;

  // Show final schema in UI
  document.getElementById("finalSchema").value = JSON.stringify(schema, null, 2);

  const apiKey = document.getElementById("apiKey").value.trim();
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  output.value = "";
  startTimer();
  setUiRunning(true);

  if (!apiKey) {
    output.value = "API key is required.";
    stopTimer("Stopped");
    setUiRunning(false);
    return;
  }

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
    // ✅ Responses API streaming (recommended) :contentReference[oaicite:2]{index=2}
    const response = await fetch("https://fancy-sun-80f1.sijakmilan.workers.dev", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
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

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const { events, rest } = parseSseLines(buffer);
      buffer = rest;

      for (const raw of events) {
        // Some servers emit [DONE]; Responses API mostly emits typed events, but handle both.
        if (raw === "[DONE]") {
          break;
        }

        let evt;
        try {
          evt = JSON.parse(raw);
        } catch {
          continue;
        }

        // Primary: text deltas :contentReference[oaicite:4]{index=4}
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
        
          const shouldAutoScroll = isUserNearBottom(output);
        
          output.value += evt.delta;
          finalText += evt.delta;
        
          if (shouldAutoScroll) {
            output.scrollTop = output.scrollHeight;
          }
          continue;
}

        // Optional: show refusals inline (so you see why it stopped)
        if (evt.type === "response.refusal.delta" && typeof evt.delta === "string") {
          lastDeltaAt = Date.now();
          output.value += evt.delta;
          output.scrollTop = output.scrollHeight;
          continue;
        }

        // Optional: show terminal errors as text
        if (evt.type === "error") {
          lastDeltaAt = Date.now();
          output.value += `\n\n[ERROR]\n${JSON.stringify(evt, null, 2)}\n`;
          output.scrollTop = output.scrollHeight;
          continue;
        }
      }
    }

    // Try parse + pretty-print at end (keeps “stream-only” feel, but fixes readability)
    // If parsing fails, you still have the raw partial output which is exactly what you want for debugging.
    try {
  const parsed = JSON.parse(finalText);
  const pretty = JSON.stringify(parsed, null, 2);

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

function isUserNearBottom(el, threshold = 40) {
  return el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
}

async function renderHtml() {
  const output = document.getElementById("output");
  const htmlOutput = document.getElementById("htmlOutput");
  const htmlPreview = document.getElementById("htmlPreview");

  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("modelSelect").value;

  if (!apiKey) {
    alert("API key is required.");
    return;
  }

  if (!lastJsonText || !lastJsonObject) {
    alert("No valid JSON found yet. Run the unit generation first.");
    return;
  }

  // reset UI
  htmlOutput.value = "";
  lastRenderedHtml = "";
  if (htmlPreview) htmlPreview.srcdoc = "";

  output.value += "\n\n=== Rendering HTML (PARALLEL ×4) ===\n";
  output.value += "\n[progress] Prompt 1:-  Prompt 2:-  Prompt 3:-  Prompt 4:-";
  output.scrollTop = output.scrollHeight;

  startTimer();
  setUiRunning(true);

  // ---- progress throttling ----
  let lastProgressRenderAt = 0;
  const PROGRESS_RENDER_INTERVAL = 500; // ms

  // ---- shared state ----
  const prompts = [
  { key: "p1",  name: "Unit Description",                     build: window.buildUnitDescription },
  { key: "p2",  name: "Assess Prior Knowledge",               build: window.buildAssessPriorKnowledge },
  { key: "p3",  name: "Unit Overview",                        build: window.buildUnitOverview },
  { key: "p4",  name: "Desired Outcomes",                     build: window.buildDesiredOutcomes },
  { key: "p5",  name: "Framing the Learning",                 build: window.buildFramingTheLearning },
  { key: "p6",  name: "Assessment Plan",                      build: window.buildAssessmentPlan },
  { key: "p7",  name: "Learning Plan",                        build: window.buildLearningPlan },
  { key: "p8",  name: "Teacher Guidance – Phase 1",            build: window.buildTeacherGuidancePhase1 },
  { key: "p9",  name: "Teacher Guidance – Phase 2",            build: window.buildTeacherGuidancePhase2 },
  { key: "p10", name: "Teacher Guidance – Phase 3",            build: window.buildTeacherGuidancePhase3 },
  { key: "p11", name: "Unit Preparation & Considerations",     build: window.buildUnitPreparationAndConsiderations }
];

  const htmlByPrompt = new Map();
  const progressMap = new Map();

  try {
    const tasks = prompts.map(p => (async () => {
      const ac = new AbortController();
      activeAbortControllers.push(ac);

      let localHtml = "";
      let consecutiveWhitespaceCount = 0;
      const MAX_WHITESPACE_DELTAS = 1000;

      const response = await fetch("https://fancy-sun-80f1.sijakmilan.workers.dev", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: ac.signal,
        body: JSON.stringify({
          model,
          stream: true,
          reasoning: { effort: "low" },
          input: [{ role: "user", content: p.build(lastJsonText) }]
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`${p.name} failed to start`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, rest } = parseSseLines(buffer);
        buffer = rest;

        for (const raw of events) {
          if (raw === "[DONE]") break;

          let evt;
          try { evt = JSON.parse(raw); } catch { continue; }

          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            if (evt.delta.trim().length === 0) {
              consecutiveWhitespaceCount++;
            } else {
              consecutiveWhitespaceCount = 0;
            }

            if (consecutiveWhitespaceCount >= MAX_WHITESPACE_DELTAS) {
              ac.abort();
              throw new Error(`${p.name} stalled (whitespace flood)`);
            }

            localHtml += evt.delta;
            progressMap.set(p.key, localHtml.length);

            // 🔒 THROTTLED progress render
            const now = Date.now();
            if (now - lastProgressRenderAt > PROGRESS_RENDER_INTERVAL) {
              lastProgressRenderAt = now;

              const progressLine = prompts
                .map(x => {
                  const v = progressMap.get(x.key);
                  return `${x.name}:${v ? Math.round(v / 1000) + "k" : "-"}`;
                })
                .join("  ");

              output.value = output.value.replace(/\n\[progress][^\n]*$/, "");
              output.value += `\n[progress] ${progressLine}`;
              output.scrollTop = output.scrollHeight;
            }
          }
        }
      }

      htmlByPrompt.set(p.key, localHtml);
    })());

    // 🚀 RUN ALL PROMPTS IN PARALLEL
    await Promise.all(tasks);

    // 🧩 MERGE IN FIXED ORDER
    lastRenderedHtml =
      (htmlByPrompt.get("p1") || "") +
      (htmlByPrompt.get("p2") || "") +
      (htmlByPrompt.get("p3") || "") +
      (htmlByPrompt.get("p4") || "");

    htmlOutput.value = lastRenderedHtml;
    if (htmlPreview) htmlPreview.srcdoc = lastRenderedHtml;

    output.value += "\n\n=== HTML Render Completed ===\n";
    stopTimer("Completed");

  } catch (err) {
    if (err?.name === "AbortError") {
      output.value += "\n\n[HTML Render Cancelled]\n";
      stopTimer("Cancelled");
    } else {
      output.value += `\n\n[HTML Render Error]\n${err?.message || String(err)}\n`;
      stopTimer("Error");
    }
  } finally {
    activeAbortControllers.forEach(ac => {
      try { ac.abort(); } catch {}
    });
    activeAbortControllers = [];
    currentAbortController = null;
    setUiRunning(false);
  }
}


window.loadJsonAndEnableRender = function (jsonText) {
  try {
    const parsed = typeof jsonText === "string"
      ? JSON.parse(jsonText)
      : jsonText;

    lastJsonObject = parsed;
    lastJsonText = JSON.stringify(parsed, null, 2);

    setRenderEnabled(true);

    console.log("✅ JSON loaded. You can now click Render HTML.");
  } catch (e) {
    console.error("❌ Invalid JSON:", e);
  }
};

/************************************
 * INIT
 ************************************/
window.onload = () => {
  if (!window.masterSchema) {
    alert("Schema failed to load.");
    return;
  }

  try {
    parsedMasterSchema = JSON.parse(window.masterSchema);
  } catch (e) {
    console.error("❌ Schema still invalid after sanitization", e);
    alert("Schema could not be loaded even after auto-fix.");
    return;
  }

  document.getElementById("prompt").value = window.defaultPrompt;
  renderDescriptionEditor();
  setRenderEnabled(false);
};
