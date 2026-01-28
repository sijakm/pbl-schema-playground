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

window.buildUnitHtmlRendererPrompt = function(jsonText) {
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

window.buildSectionPrompt = function({ sectionTitle, htmlHeading, jsonPayload, isFirstSection }) {
  const greenHeading = `<h3><span style="color: rgb(115, 191, 39);">${htmlHeading}</span></h3>`;

  return `
You will receive ONE JSON object (already validated). Render ONLY the requested section into clean HTML.

GLOBAL RULES
- Output ONLY valid HTML (no markdown, no backticks, no prose).
- Allowed tags: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- No other tags.
- Well-indented HTML.
- In any <ol> or <ul>, ONLY <li> as direct children. No nested lists.
- Do NOT invent content; use only JSON fields.
- If a string field is empty (""), OMIT that subsection and its label.
- If an array is empty, omit its heading and the corresponding <ul>/<ol>.
- If text clearly forms a list, use <ul>/<ol>, otherwise <p>.
- Expected/model responses must be rendered as:
  <p>✅ Expected Student Responses</p>
  then <ul><li>...</li></ul> (or <ol> if ordered).

COLOR RULE
- Use GREEN only for MAIN SECTION HEADINGS, exactly like:
${greenHeading}

OUTPUT SCOPE (HARD RULE)
- Render ONLY this section: ${sectionTitle}
- Do NOT render other sections.
- Do NOT wrap with <html> or <body>. Output a fragment only.

SECTION HEADING (HARD RULE)
- Start the fragment with:
${greenHeading}

${isFirstSection ? `
UNIT HEADER (ONLY IN THIS FIRST SECTION)
- Before the section heading, render:
  <h2>{UnitPlan.UnitMeta.UnitName}</h2>
  then a <ul> of UnitMeta fields as <li> lines (UnitSubject, GradeLevel, ClassDurationMinutes, ProjectDurationDays, Location, ZipCode).
` : ""}

SECTION JSON:
${JSON.stringify(jsonPayload)}
`.trim();
}

window.buildPrompt1 = function (jsonText) {
  return `
You will receive ONE JSON object that strictly follows the PBLUnitPlanResponse schema (already validated).

Your task is to render the FIRST PART of the Unit Plan into clean, readable HTML.

GLOBAL RULES
- Output ONLY valid HTML (no markdown, no prose).
- Allowed tags: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- Do NOT use any other tags.
- HTML must be well-indented.
- In <ul> or <ol>, ONLY <li> as direct children.
- Do NOT invent content.
- Use the exact order defined below.
- If a string field is empty (""), OMIT that subsection.
- If an array is empty, OMIT its list — EXCEPT where noted.
- Use <ul>/<ol> when text clearly forms lists; otherwise use <p>.

EXPECTED STUDENT RESPONSES RULE
Whenever expected/model student responses appear:
<p>✅ Expected Student Responses</p>
<ul><li>…</li></ul>

COLOR RULE (HARD)
Use GREEN only for MAIN SECTION HEADINGS:
<h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

BEGIN DOCUMENT
- Start with:
<h2>{UnitPlan.UnitMeta.UnitName}</h2>
- Then render UnitMeta as a <ul> of <li> items.

RENDER SECTIONS IN THIS EXACT ORDER

1) Unit Description

2) 💡 Assess Prior Knowledge
- ALWAYS render this heading.
- If content is empty, render:
<p>(No content provided.)</p>

3) Unit Overview

4) Desired Outcomes

5) Framing the Learning
- Include Place
- Include ALL Key Vocabulary tiers (Tier 1, 2, 3)
- Omit any empty vocabulary tiers individually

6) Assessment Plan

7) Learning Plan

UNIT PLAN JSON:
${jsonText}
`.trim();
};


window.buildPrompt2 = function (jsonText) {
  return `
You will receive ONE JSON object that strictly follows the PBLUnitPlanResponse schema.

Render ONLY the following section into HTML:

9) Teacher Guidance Phase 1

RULES
- Output ONLY valid HTML.
- Same allowed tags and list rules as before.
- Use GREEN heading style for the section title.
- Do NOT render any other sections.
- If all content is empty, render only the heading and:
<p>(No content provided.)</p>

SECTION HEADING
<h3><span style="color: rgb(115, 191, 39);">Teacher Guidance – Phase 1</span></h3>

UNIT PLAN JSON:
${jsonText}
`.trim();
};

window.buildPrompt3 = function (jsonText) {
  return `
You will receive ONE JSON object that strictly follows the PBLUnitPlanResponse schema.

Render ONLY the following section into HTML:

10) Teacher Guidance Phase 2

RULES
- Output ONLY valid HTML.
- Same allowed tags and list rules as before.
- Use GREEN heading style.
- Do NOT render any other sections.
- If all content is empty, render only the heading and:
<p>(No content provided.)</p>

SECTION HEADING
<h3><span style="color: rgb(115, 191, 39);">Teacher Guidance – Phase 2</span></h3>

UNIT PLAN JSON:
${jsonText}
`.trim();
};

window.buildPrompt4 = function (jsonText) {
  return `
You will receive ONE JSON object that strictly follows the PBLUnitPlanResponse schema.

Render the FINAL PART of the Unit Plan into HTML.

RULES
- Output ONLY valid HTML.
- Same tag and list rules.
- Use GREEN heading style for BOTH sections.
- Do NOT render any other sections.

RENDER IN THIS EXACT ORDER

11) Teacher Guidance Phase 3
- If empty, render heading +:
<p>(No content provided.)</p>

8) Unit Preparation & Considerations
- Render AFTER Phase 3.
- Omit empty subsections individually.

UNIT PLAN JSON:
${jsonText}
`.trim();
};

