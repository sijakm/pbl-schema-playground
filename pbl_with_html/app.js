/************************************
 * TIMER UI
 ************************************/
let timerInterval = null;
let startTime = null;

let lastJsonText = "";
let lastJsonObject = null;
let lastRenderedHtml = "";

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
 * DEFAULT PROMPT
 ************************************/
const defaultPrompt = `
Create a complete Project-Based Learning (PBL) unit plan and project-based lessons using ONLY the information provided below. Your response MUST be valid JSON that strictly matches the provided response schema (no extra keys, no text outside JSON).

MVP planning requirements (must be reflected in the unit):
• Zip code localization: If a zip code is provided, include examples, stakeholders, audiences, and place-based resources that plausibly fit the community and surrounding area. Do not invent exact addresses/phone numbers; refer to realistic local institution types and roles.
• Project Duration: The project lasts 10 days, so the plan and lesson progression must be written across multiple days (not a single class period).

Use these unit inputs exactly:
Unit Subject: Earth & Space Science (Gravity & Orbits)
Unit Name: “Gravity at Work: Modeling Motion in Our Solar System”
Unit Description/Instruction (teacher request): Students will investigate how gravity affects motion in the solar system and create a model that explains and predicts orbital motion. The final product should be a clear model (physical and/or digital) plus a short explanation for a community audience, using evidence from observations and simple data. Emphasize sensemaking, modeling, and communication.
Grade Level: The student is in the 1st grade of middle school, which consists of 4 grades total.
Duration of class period (minutes): 45
Project Duration (days): 10
Location: Greenville, Wisconsin, United States
Zip code: 54942
Resources/Media to use: Short NASA gravity/orbit visuals, images of the solar system, classroom manipulatives (string/balls), simple orbit simulations (browser-based), chart paper, student science notebooks.
Standards: MS-ESS1-2 Develop and use a model to describe the role of gravity in the motions within galaxies and the solar system.

Students with plans:
Maria Valdez: Provide a partially pre-labeled orbit map and sentence frames for explanations.
Jacob Garrow: Allow speech-to-text for reasoning and labeling.
Ava Lund: Supply bilingual planet labels and a visual flow chart showing Sun → Planets → Moons.

Output rule: Return ONLY JSON that validates against the response schema.
`;

function buildUnitHtmlRendererPrompt(jsonText) {
  return `
You will receive ONE JSON object that strictly follows the PBLUnitPlanResponse schema (already validated on my side). Your job is to transform this JSON into clean, readable HTML that a teacher can use directly.

INPUT FORMAT
I will send you the JSON object like this:

UNIT PLAN JSON:
{{unitResponse}}

Treat everything after the line “UNIT PLAN JSON:” as the exact JSON object. Do NOT explain or comment on it; just parse it and render it.

GLOBAL RULES
- Output ONLY valid HTML (no markdown, no backticks, no prose explanation).
- Allowed tags: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- Do NOT use any other tags (no <main>, <section>, <header>, <div>, <h4>, etc.).
- HTML must be well-indented and easy to read.
- In any <ol> or <ul>, ONLY use <li> elements as direct children. Never place <p>, <span>, <ul>, <ol>, or any other tag as a child of a list.
- Do NOT invent new instructional content; use only what exists in the JSON fields.
- Preserve the logical order implied by the schema: render sections in the exact schema order.
- If a string field is empty (""), OMIT that subsection and its label.
- If an array is empty, omit its heading and the corresponding <ul> or <ol>.
- Whenever the text clearly forms a list of prompts/questions/statements/responses, use <ul><li>…</li></ul> or <ol><li>…</li></ol>. Otherwise, use <p>.
- Whenever you render expected/model student responses in ANY section, use this pattern:
  - First: <p>✅ Expected Student Responses</p>
  - Then: <ul><li>…</li></ul> (or <ol> if ordered)
  - Do NOT nest lists inside <li>.

COLOR RULE (HARD RULE)
- Use GREEN only for MAIN SECTION HEADINGS.
- Apply this exact style for those headings only:
  <h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

RENDERING INSTRUCTION (MONOLITHIC)
- Begin with:
  <h2>{UnitPlan.UnitMeta.UnitName}</h2>
  then Unit meta as <ul> of <li> lines.
- Then render, in this exact order:
  1) Unit Description
  2) 💡 Assess Prior Knowledge (ALWAYS render heading; if empty show "(No content provided.)")
  3) Unit Overview
  4) Desired Outcomes
  5) Framing the Learning (including Place + Key Vocabulary tiers)
  6) Assessment Plan
  7) Learning Plan
  8) Unit Preparation & Considerations
  9) Teacher Guidance Phase 1
  10) Teacher Guidance Phase 2
  11) Teacher Guidance Phase 3

Within each section, use the field order from the JSON.

UNIT PLAN JSON:
${jsonText}
`.trim();
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
  if (currentAbortController) {
    currentAbortController.abort();
  }
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
    const response = await fetch("https://api.openai.com/v1/responses", {
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

function sanitizeSchemaText(raw) {
  let text = raw
    .replace(/\r\n/g, "\n")
    .replace(/\u00A0/g, " ")
    .replace(/[\u2028\u2029]/g, "\n")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[→⇒↔]/g, "->");
  let result = "";
  let inString = false;
  let prev = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && prev !== "\\") {
      inString = !inString;
      result += char;
    }
    else if (inString && char === "\n") {
      result += "\\n";
    }
    else if (inString && char === "\t") {
      result += "\\t";
    }
    else if (inString && char === '"' && prev !== "\\") {
      result += '\\"';
    }
    else {
      result += char;
    }

    prev = char;
  }

  return result;
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

  // Reset HTML panes
  htmlOutput.value = "";
  lastRenderedHtml = "";
  if (htmlPreview) htmlPreview.srcdoc = "";

  // Log to existing output window (progress tracker)
  output.value += "\n\n=== Rendering HTML (stream) ===\n";
  output.scrollTop = output.scrollHeight;

  startTimer();
  setUiRunning(true);

  // Abort support
  currentAbortController = new AbortController();
  const { signal } = currentAbortController;

  // Stuck detector (same pattern)
  let lastDeltaAt = Date.now();
  const stuckInterval = setInterval(() => {
    const diff = Date.now() - lastDeltaAt;
    if (diff > 30000) {
      output.value += `\n\n[⚠️ No streamed output for ${(diff / 1000).toFixed(
        0
      )}s — The model is still thinking 🤔]\n`;
      output.scrollTop = output.scrollHeight;
      lastDeltaAt = Date.now();
    }
  }, 4000);

  try {
    const prompt = buildUnitHtmlRendererPrompt(lastJsonText);

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal,
      body: JSON.stringify({
        model,
        stream: true,
        reasoning: { effort: "low" },
        input: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      output.value +=
        `\n\n[HTML Render Error] HTTP ${response.status} ${response.statusText}\n\n` +
        (errText || "(no body)") +
        "\n";
      stopTimer("Error");
      return;
    }

    if (!response.body) {
      output.value += "\n\n[HTML Render Error] No response body (stream not available).\n";
      stopTimer("Error");
      return;
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
        try {
          evt = JSON.parse(raw);
        } catch {
          continue;
        }

        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          lastDeltaAt = Date.now();

          // Stream progress into the existing output window
          const shouldAutoScroll = isUserNearBottom(output);
          output.value += evt.delta;
          if (shouldAutoScroll) output.scrollTop = output.scrollHeight;

          // Stream final HTML into dedicated textarea
          htmlOutput.value += evt.delta;
          lastRenderedHtml += evt.delta;
          htmlOutput.scrollTop = htmlOutput.scrollHeight;

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

    // Set preview
    if (htmlPreview) {
      htmlPreview.srcdoc = lastRenderedHtml;
    }

    output.value += "\n\n=== HTML Render Completed ===\n";
    output.scrollTop = output.scrollHeight;

    stopTimer("Completed");
  } catch (err) {
    if (err?.name === "AbortError") {
      output.value += "\n\n[HTML Render Cancelled]\n";
      stopTimer("Cancelled");
    } else {
      output.value += `\n\n[HTML Render Fetch error]\n${err?.message || String(err)}\n`;
      stopTimer("Error");
    }
  } finally {
    clearInterval(stuckInterval);
    currentAbortController = null;
    setUiRunning(false);
  }
}

/************************************
 * INIT
 ************************************/
window.onload = () => {
  if (!window.masterSchema) {
    alert("Schema failed to load.");
    return;
  }

  try {
    //const cleaned = sanitizeSchemaText(window.masterSchema);
    parsedMasterSchema = JSON.parse(window.masterSchema);
  } catch (e) {
    console.error("❌ Schema still invalid after sanitization", e);
    alert("Schema could not be loaded even after auto-fix.");
    return;
  }

  document.getElementById("prompt").value = defaultPrompt;
  renderDescriptionEditor();
  setRenderEnabled(false);
};
