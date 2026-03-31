/************************************
 * TIMER UI
 ************************************/
let timerInterval = null;
let startTime = null;

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
  if (/[\u2013\u2014]/.test(text)) issues.push("Long dash");
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text)) issues.push("Non-ASCII characters (emoji, special characters)");
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
  const events = [];
  const parts = buffer.split("\n");
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
  const cancelBtn = document.getElementById("cancelBtn");
  runBtn.disabled = isRunning;
  cancelBtn.disabled = !isRunning;
}

function cancelRun() {
  if (currentAbortController) {
    currentAbortController.abort();
  }
}

async function run() {
  const invalidFields = [];
  const model = document.getElementById("modelSelect").value;

  document.querySelectorAll("#descriptions textarea").forEach(t => {
    if (findInvalidChars(t.value).length > 0) {
      invalidFields.push(t);
    }
  });

  if (invalidFields.length > 0) {
    alert(
      "Your text contains characters that aren’t supported yet.\n\n" +
      "Please remove or replace the following before continuing:\n\n" +
      "Curly quotes ( “ ” or ‘ ’ ) → use straight quotes ( \" ' )\n\n" +
      "Long dashes ( – or — ) → use a regular hyphen ( - )\n\n" +
      "Emojis or special symbols\n\n" +
      "These characters can cause errors when your content is processed.\n" +
      "Once everything is in plain text, you’re good to go."
    );
    return;
  }
  
  const schema = JSON.parse(JSON.stringify(parsedMasterSchema));
  document.querySelectorAll("#descriptions textarea").forEach(textarea => {
    const path = JSON.parse(textarea.dataset.path);
    setValueAtPath(schema, path, textarea.value.trim());
  });
  lastEditedSchema = schema;

  document.getElementById("finalSchema").value = JSON.stringify(schema, null, 2);

  const HARDCODED_PASSWORD = "";
  const apiKey = HARDCODED_PASSWORD || document.getElementById("apiKey").value.trim();
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  output.value = "";
  startTimer();
  setUiRunning(true);
  resetTokenUsage();

  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  let lastDeltaAt = Date.now();
  const stuckInterval = setInterval(() => {
    const diff = Date.now() - lastDeltaAt;
    if (diff > 30000) {
      output.value += `\n\n[⚠️ No streamed output for ${(diff/1000).toFixed(0)}s — The model is still thinking 🤔]\n`;
      output.scrollTop = output.scrollHeight;
      lastDeltaAt = Date.now();
    }
  }, 4000);

  try {
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
            name: "LabUnitPlanResponse",
            schema: schema,
            strict: true
          }
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      output.value = `HTTP ${response.status} ${response.statusText}\n\n` + (errText || "(no body)");
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
        if (raw === "[DONE]") break;

        let evt;
        try {
          evt = JSON.parse(raw);
        } catch {
          continue;
        }

        if (evt.type === 'response.output_text.delta' && typeof evt.delta === 'string') {
          lastDeltaAt = Date.now();
          finalText += evt.delta;
          const shouldAutoScroll = isUserNearBottom(output);
          output.value += evt.delta;
          if (shouldAutoScroll) output.scrollTop = output.scrollHeight;
          continue;
        }

        if (evt.type === "response.refusal.delta" && typeof evt.delta === "string") {
          lastDeltaAt = Date.now();
          output.value += evt.delta;
          output.scrollTop = output.scrollHeight;
          continue;
        }

        if (evt.type === "response.completed" && evt.response?.usage) {
          addTokenUsage(evt.response.usage);
        }

        if (evt.type === "error" || evt.type === "response.error") {
          lastDeltaAt = Date.now();
          output.value += `\n\n[ERROR]\n${JSON.stringify(evt, null, 2)}\n`;
          output.scrollTop = output.scrollHeight;
          continue;
        }
      }
    }

    try {
      const parsed = JSON.parse(finalText);
      output.value = JSON.stringify(parsed, null, 2);
    } catch {
      output.value += "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
    }

    stopTimer("Completed");
    updateTokenSummaryUI(model);
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

/************************************
 * INIT
 ************************************/
window.onload = () => {
  if (!window.labPrompts || !window.labPrompts.SCHEMA) {
    alert("Prompts/Schema failed to load.");
    return;
  }
  parsedMasterSchema = window.labPrompts.SCHEMA;
  document.getElementById("prompt").value = window.labPrompts.DEFAULT_PROMPT.trim();
  renderDescriptionEditor();
};
