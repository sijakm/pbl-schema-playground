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

function stopTimer(label = "Completed") {
  clearInterval(timerInterval);
  timerInterval = null;

  const elapsedMs = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("status").textContent =
    `${label} (${minutes}:${seconds.toString().padStart(2, "0")})`;
}

/************************************
 * INVALID CHAR VALIDATION
 ************************************/
function findInvalidChars(text) {
  const issues = [];
  if (/[\u201C\u201D]/.test(text)) issues.push("Smart double quotes");
  if (/[\u2018\u2019]/.test(text)) issues.push("Smart single quotes");
  if (/[\u2013\u2014]/.test(text)) issues.push("Long dash");
  if (/…/.test(text)) issues.push("Ellipsis");
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text)) issues.push("Non-ASCII characters");
  if (/\n/.test(text)) issues.push("Line breaks");
  if (/\t/.test(text)) issues.push("Tabs");
  return issues;
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
      collectDescriptions(
        schema.properties[key],
        [...path, "properties", key],
        result
      );
    }
  }

  if (schema.items) {
    collectDescriptions(schema.items, [...path, "items"], result);
  }

  return result;
}

/************************************
 * RENDER DESCRIPTION EDITOR
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
    label.style.fontWeight = "bold";

    const textarea = document.createElement("textarea");
    textarea.rows = 2;
    textarea.value = item.value;
    textarea.dataset.path = JSON.stringify(item.path);

    const warning = document.createElement("div");
    warning.style.color = "#b00020";
    warning.style.fontSize = "12px";
    warning.style.display = "none";

    textarea.addEventListener("input", () => {
      const problems = findInvalidChars(textarea.value);
      if (problems.length) {
        textarea.style.border = "2px solid #b00020";
        warning.style.display = "block";
        warning.textContent = "Invalid: " + problems.join(", ");
      } else {
        textarea.style.border = "";
        warning.style.display = "none";
      }
    });

    wrapper.append(label, textarea, warning);
    container.appendChild(wrapper);
  });
}

/************************************
 * PATH SETTER
 ************************************/
function setValueAtPath(obj, path, value) {
  let cur = obj;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]];
  cur[path[path.length - 1]] = value;
}

/************************************
 * STREAM HELPERS
 ************************************/
function parseSseLines(buffer) {
  const events = [];
  const parts = buffer.split("\n");
  let rest = parts.pop() ?? "";
  for (const line of parts) {
    if (line.startsWith("data:")) {
      const data = line.slice(5).trim();
      if (data) events.push(data);
    }
  }
  return { events, rest };
}

/************************************
 * RUN (Responses API, streaming)
 ************************************/
let parsedMasterSchema = null;
let currentAbort = null;

async function run() {
  const invalid = [];
  document.querySelectorAll("#descriptions textarea").forEach(t => {
    if (findInvalidChars(t.value).length) invalid.push(t);
  });
  if (invalid.length) {
    alert("Fix invalid characters first.");
    return;
  }

  const schema = JSON.parse(JSON.stringify(parsedMasterSchema));
  document.querySelectorAll("#descriptions textarea").forEach(t => {
    setValueAtPath(schema, JSON.parse(t.dataset.path), t.value.trim());
  });

  document.getElementById("finalSchema").value =
    JSON.stringify(schema, null, 2);

  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("modelSelect").value;
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  if (!apiKey) return alert("API key required");

  output.value = "";
  startTimer();

  currentAbort = new AbortController();

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    signal: currentAbort.signal,
    body: JSON.stringify({
      model,
      stream: true,
      input: [{ role: "user", content: prompt }],
      text: {
        format: {
          type: "json_schema",
          name: "UnitPlan",
          schema,
          strict: true
        }
      }
    })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "", final = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const { events, rest } = parseSseLines(buffer);
    buffer = rest;

    for (const e of events) {
      const evt = JSON.parse(e);
      if (evt.type === "response.output_text.delta") {
        output.value += evt.delta;
        final += evt.delta;
        output.scrollTop = output.scrollHeight;
      }
    }
  }

  try {
    output.value = JSON.stringify(JSON.parse(final), null, 2);
  } catch {
    output.value += "\n\n[Invalid JSON output]";
  }

  stopTimer();
}

/************************************
 * INIT
 ************************************/
window.onload = () => {
  parsedMasterSchema = JSON.parse(window.masterSchema);
  document.getElementById("prompt").value = defaultPrompt;
  renderDescriptionEditor();
};
