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
function renderDescriptionEditor() {
  const container = document.getElementById("descriptions");
  container.innerHTML = "";

  const descriptions = collectDescriptions(parsedMasterSchema);

  descriptions.forEach(item => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "16px";

    const label = document.createElement("label");
    label.innerText = item.path
      .filter(p => !["properties", "items", "description"].includes(p))
      .join(" → ");
    label.style.display = "block";
    label.style.fontWeight = "bold";

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.style.resize = "vertical";
    textarea.style.width = "100%";
    textarea.value = item.value;
    textarea.dataset.path = JSON.stringify(item.path);

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
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
  // Clone schema and apply description edits
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
    if (diff > 20000) {
      output.value += `\n\n[⚠️ No streamed output for ${(diff/1000).toFixed(0)}s — request may be stuck or the model is thinking]\n`;
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
    model: "gpt-5-mini",
    stream: true,
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

          output.value += evt.delta;
          finalText += evt.delta;

          output.scrollTop = output.scrollHeight;
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
      output.value = JSON.stringify(parsed, null, 2);
    } catch {
      output.value += "\n\n[⚠️ Could not parse JSON at end — leaving raw streamed output as-is.]\n";
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

/************************************
 * INIT
 ************************************/
window.onload = () => {
  if (!window.masterSchema) {
    console.error("❌ masterSchema is not loaded");
    alert("Schema failed to load. Check schema.js");
    return;
  }

  try {
    parsedMasterSchema = JSON.parse(window.masterSchema);
  } catch (e) {
    console.error("❌ Invalid JSON in masterSchema", e);
    alert("Schema JSON is invalid. Check console.");
    return;
  }

  document.getElementById("prompt").value = defaultPrompt;
  renderDescriptionEditor();
};
