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

const defaultPrompt = `
Create unit plan and inquiry lessons using info below:

Unit Subject: Earth & Space Science (Gravity & Orbits)
Unit Name: Gravity at Work: Modeling Motion in Our Solar System
Unit Description/Instruction: Students will investigate how gravity affects motion in the solar system and create a model that explains and predicts orbital motion. The final product should be a clear model (physical and/or digital) plus a short explanation for a community audience, using evidence from observations and simple data. Emphasize sensemaking, modeling, and communication.
Number of Lessons Plans to create: 1
Grade Level: The student is in the 1st grade of middle school, which consists of 4 grades total.
Duration of class period in minutes: 45
Resources/Media to use: Short NASA gravity/orbit visuals, images of the solar system, classroom manipulatives (string/balls), simple browser-based orbit simulations, chart paper, student science notebooks.
Unit Content: No attached unit text provided.

Standards (use verbatim if present):
MS-ESS1-2 Develop and use a model to describe the role of gravity in the motions within galaxies and the solar system.

Students with learning plans (use verbatim; if none, treat as empty):
Student Name: Maria Valdez
Plan: Provide a partially pre-labeled orbit map and sentence frames for explanations.

Student Name: Jacob Garrow
Plan: Allow speech-to-text for reasoning and labeling.

Student Name: Ava Lund
Plan: Supply bilingual planet labels and a visual flow chart showing Sun → Planets → Moons.

You are tasked with designing a detailed inquiry-style unit and lesson plans using cognitive science principles. 

Global Output Rules (apply to everything)

1. Follow the exact section order and headings shown below.
2. Do not add extra sections or rename headings.
3. Use clear teacher-facing prose and student-facing directions where specified.
4. Include specific examples, scripts, and expected answers (not placeholders like "e.g.").
5. Before introducing any new concept or content, include an Attention Reset activity designed to re-engage students, increase cognitive focus, and prepare working memory for new learning.
   * movement-based, sensory, or novelty-driven
   * take 20–45 seconds
   * require minimal materials
   * directly connect to the lesson’s core idea and smoothly transition students into the upcoming content.
   * Language to use: Attention Reset & Interactive Activity: This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (same language here for every attention reset & interactivity)
6. Include interleaving: When providing practice problems, mix strategies, content, skills rather than blocking to help students learn to know when to apply a skill.
7. Ensure transfer knowledge is embedded throughout so students can apply knowledge in various ways and under different circumstances using real-world application of skills and promoting critical thinking and problem solving.
8. Cultural Relevance & Inclusion:
   a. Incorporate multiple perspectives and reflect on the impacts for all involved.
   b. Content should connect with students from varied backgrounds and communities to create culturally relevant and culturally responsive lessons.
   c. Avoid stereotypes.

Output rule:
Return ONLY JSON that validates against the response schema.
`;

/************************************
 * INVALID CHAR VALIDATION
 ************************************/
function findInvalidChars(text) {
  const issues = [];
  if (/[\u201C\u201D]/.test(text)) issues.push("Smart double quotes");
  if (/[\u2018\u2019]/.test(text)) issues.push("Smart single quotes");
  if (/[\u2013\u2014]/.test(text)) issues.push("Long dash");
  if (/[^\x09\x0A\x0D\x20-\x7E]/.test(text)) issues.push("Non-ASCII characters (emoji, special characters)");
  if (/\n/.test(text)) issues.push("Line breaks");
  if (/\t/.test(text)) issues.push("Tabs");
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
let currentAbort = null;

async function run() {
  const invalid = [];
  document.querySelectorAll("#descriptions textarea").forEach(t => {
    if (findInvalidChars(t.value).length) invalid.push(t);
  });
  if (invalid.length) {
    alert("Your text contains characters that aren’t supported yet.
Please remove or replace the following before continuing:

Curly quotes ( “ ” or ‘ ’ ) → use straight quotes ( " ' )

Long dashes ( – or — ) → use a regular hyphen ( - )

Emojis or special symbols

Line breaks (new lines)

Tabs or extra spacing

These characters can cause errors when your content is processed.
Once everything is in plain text, you’re good to go.");
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
      reasoning: { effort: "low" },
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
