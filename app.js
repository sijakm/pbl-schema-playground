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

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;

  const elapsedMs = Date.now() - startTime;
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("status").textContent =
    `Completed in ${minutes}:${seconds.toString().padStart(2, "0")}`;
}

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
 * 3) DESCRIPTION COLLECTION
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
    collectDescriptions(
      schema.items,
      [...path, "items"],
      result
    );
  }

  return result;
}

/************************************
 * 4) RENDER UI FOR DESCRIPTIONS
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
 * 5) PATH SETTER
 ************************************/
function setValueAtPath(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

/************************************
 * 6) RUN OPENAI REQUEST
 ************************************/
let lastEditedSchema = null;

async function run() {
  const schema = JSON.parse(JSON.stringify(parsedMasterSchema));

  document
    .querySelectorAll("#descriptions textarea")
    .forEach(textarea => {
      const path = JSON.parse(textarea.dataset.path);
      setValueAtPath(schema, path, textarea.value.trim());
    });

  lastEditedSchema = schema;

// Prikaži finalnu schema-u u UI
const finalSchemaTextarea = document.getElementById("finalSchema");
finalSchemaTextarea.value = JSON.stringify(schema, null, 2);

  const apiKey = document.getElementById("apiKey").value.trim();
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  output.value = "Running...";
  startTimer();

  if (!apiKey) {
    output.value = "API key is required.";
    stopTimer();
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "PBLUnitPlanResponse",
            schema: schema,
            strict: true
          }
        }
      })
    });

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      output.value = "No content returned.\n\n" + JSON.stringify(data, null, 2);
      stopTimer();
      return;
    }

    try {
      const parsed = JSON.parse(content);
      output.value = JSON.stringify(parsed, null, 2);
      stopTimer();
    } catch {
      output.value = content;
    }

  } catch (err) {
    output.value = err.message;
  }
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
    .then(() => {
      alert("Schema copied to clipboard ✅");
    })
    .catch(() => {
      alert("Failed to copy schema.");
    });
}


/************************************
 * 7) INIT
 ************************************/
let parsedMasterSchema = null;

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

