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


//NOVI PROMPTOVI!!!

window.buildEmptySectionPrompt = function ({ htmlHeading }) {
  return `
<h3><span style="color: rgb(115, 191, 39);">${htmlHeading}</span></h3>
<p>(No content provided.)</p>
`.trim();
};

window.buildUnitDescription = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const { UnitName, Description } = parsed.UnitPlan.UnitDescription;
  console.log(UnitName, Description);
  return `
You will receive a JSON object with the following structure:
{
  "UnitName": "...",
  "Description": "..."
}

Render HTML using this EXACT template:
<h2><strong>Unit Description: ${UnitName}</strong></h2>
<p>${Description}</p>
`.trim();
};

window.buildAssessPriorKnowledge = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "💡 Assess Prior Knowledge"
  });
};

window.buildUnitOverview = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Unit Overview"
  });
};

window.buildDesiredOutcomes = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Desired Outcomes"
  });
};

window.buildFramingTheLearning = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Framing the Learning"
  });
};

window.buildAssessmentPlan = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Assessment Plan"
  });
};

window.buildLearningPlan = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Learning Plan"
  });
};

window.buildUnitPreparationAndConsiderations = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Unit Preparation & Considerations"
  });
};

window.buildTeacherGuidancePhase1 = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Teacher Guidance – Phase 1"
  });
};

window.buildTeacherGuidancePhase2 = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Teacher Guidance – Phase 2"
  });
};

window.buildTeacherGuidancePhase3 = function () {
  return window.buildEmptySectionPrompt({
    htmlHeading: "Teacher Guidance – Phase 3"
  });
};


