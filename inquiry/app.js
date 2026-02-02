/************************************
 * TIMER UI
 ************************************/
let timerInterval = null;
let startTime = null;

let lastJsonText = "";
let lastJsonObject = null;
let lastRenderedHtml = "";
let activeAbortControllers = [];

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

window.loadJsonAndEnableRender = function (json) {
  try {
    const parsed = typeof json === "string"
      ? JSON.parse(json)
      : json;

    lastJsonObject = parsed;
    lastJsonText = JSON.stringify(parsed, null, 2);

    console.log("✅ JSON loaded. Ready for HTML rendering.");
    console.log("➡️ You can now click: Render HTML");

    const btn = document.getElementById("renderBtn");
    if (btn) btn.disabled = false;

  } catch (e) {
    console.error("❌ Invalid JSON:", e.message);
  }
};

/************************************
 * INVALID CHAR VALIDATION
 ************************************/
function findInvalidChars(text) {
  const issues = [];
  if (/[\u201C\u201D]/.test(text)) issues.push("Smart double quotes");
  if (/[\u2018\u2019]/.test(text)) issues.push("Smart single quotes");
  if (/[\u2013\u2014]/.test(text)) issues.push("Long dash");
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text)) issues.push("Non-ASCII characters (emoji, special characters)");
  // if (/\n/.test(text)) issues.push("Line breaks");
  // if (/\t/.test(text)) issues.push("Tabs");
  return issues;
}

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
let currentAbortController = null;

async function run() {
  const invalid = [];
  document.querySelectorAll("#descriptions textarea").forEach(t => {
    if (findInvalidChars(t.value).length) invalid.push(t);
  });
  if (invalid.length) {
    alert(
  "Your text contains characters that aren’t supported yet.\n\n" +
  "Please remove or replace the following before continuing:\n\n" +
  "Curly quotes ( “ ” or ‘ ’ ) → use straight quotes ( \" ' )\n\n" +
  "Long dashes ( – or — ) → use a regular hyphen ( - )\n\n" +
  "Emojis or special symbols\n\n" +
  // "Line breaks (new lines)\n\n" +
  // "Tabs or extra spacing\n\n" +
  "These characters can cause errors when your content is processed.\n" +
  "Once everything is in plain text, you’re good to go."
);
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

  // if (!apiKey) return alert("API key required");

  output.value = "";
  startTimer();

  currentAbortController = new AbortController();

  const res = await fetch("https://fancy-sun-80f1.sijakmilan.workers.dev", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    signal: currentAbortController.signal,
    body: JSON.stringify({
      model: model,
      stream: true,
      reasoning: { effort: "low" },
      input: [{ role: "user", content: prompt }],
      text: {
        format: {
          type: "json_schema",
          name: "InquiryUnitPlanResponse",
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
    const parsed = JSON.parse(final);
    const pretty = JSON.stringify(parsed, null, 2);
  
    output.value = pretty;
  
    lastJsonObject = parsed;
    lastJsonText = pretty;
  
    const btn = document.getElementById("renderBtn");
    if (btn) btn.disabled = false;
  
  } catch {
    output.value += "\n\n[Invalid JSON output]";
  }

  stopTimer();
}

function setUiRunning(isRunning) {
  const runBtn = document.querySelector("button[onclick='run()']");
  const renderBtn = document.getElementById("renderBtn");

  if (runBtn) runBtn.disabled = isRunning;
  if (renderBtn) renderBtn.disabled = isRunning || !lastJsonObject;
}

async function renderHtml() {
  const output = document.getElementById("output");
  const htmlOutput = document.getElementById("htmlOutput");
  const htmlPreview = document.getElementById("htmlPreview");

  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("modelSelect").value;

  // if (!apiKey) {
  //   alert("API key is required.");
  //   return;
  // }

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
  { key: "p1",  name: "Unit Description",                     build: window.unitDescriptionPrompt },
  { key: "p2",  name: "Orientation Phase",               build: window.buildOrientationPhasePrompt },
  { key: "p3",  name: "Conceptualization Phase",                        build: window.buildConceptualizationPhase },
  { key: "p4",  name: "Investigation Phase",                     build: window.buildInvestigationPhasePrompt },
  { key: "p5",  name: "Conclusion Phase",                 build: window.buildConclusionPhasePrompt },
  { key: "p6",  name: "Discussion Phase",                      build: window.buildDiscussionPhasePrompt },
  { key: "p7",  name: "Review and Spaced Retrieval",                        build: window.buildReviewAndSpacedRetrievalPrompt },
  { key: "p8",  name: "Formative Assessment",            build: window.buildFormativeAssessmentPrompt },
  { key: "p9",  name: "Student Practice",            build: window.buildStudentPracticePrompt },
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
      (htmlByPrompt.get("p4") || "") +
      (htmlByPrompt.get("p5") || "") +
      (htmlByPrompt.get("p6") || "") +
      (htmlByPrompt.get("p7") || "") +
      (htmlByPrompt.get("p8") || "") +
      (htmlByPrompt.get("p9") || "");
      // (htmlByPrompt.get("p10") || "") +
      // (htmlByPrompt.get("p11") || "");

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


/************************************
 * INIT
 ************************************/
window.onload = () => {
  parsedMasterSchema = JSON.parse(window.masterSchema);
  document.getElementById("prompt").value = window.defaultPrompt;
  renderDescriptionEditor();
};
