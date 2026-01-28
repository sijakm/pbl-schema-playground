window.prompt1 = `...`;
window.prompt2 = `...`;
window.prompt3 = `...`;
window.prompt4 = `...`;
window.prompt5 = `...`;
window.prompt6 = `...`;

window.defaultPrompt = `
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

window.buildUnitHtmlRendererPrompt(jsonText) {
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
};
