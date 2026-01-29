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
Return ONLY valid HTML.
Return a placeholder for an empty section using this EXACT template:
<h3><span style="color: rgb(115, 191, 39);">${htmlHeading}</span></h3>
<p>Work in progress... 🚧</p>
`.trim();
};

window.buildUnitDescription = function (jsonText) {
  const parsed = JSON.parse(jsonText);

  const payload = {
    UnitName: parsed.UnitPlan.UnitMeta.UnitName,
    UnitDescription: parsed.UnitPlan.UnitDescription.Description
  };

  return `
You are a professional HTML formatter.

You will receive:
- UnitName (string)
- UnitDescription (string)

Return ONLY HTML.
Do NOT add explanations.
Do NOT invent content.

Render HTML using this EXACT template:

<h2><strong>Unit Description: {UnitName}</strong></h2>
<p>{UnitDescription}</p>

DATA:
${JSON.stringify(payload)}
`.trim();
};

window.buildAssessPriorKnowledge = function (jsonText) {
  const parsed = JSON.parse(jsonText);

  const payload = {
    AssessPriorKnowledge: parsed.UnitPlan.AssessPriorKnowledge
  };

  return `
You are a professional instructional HTML formatter writing for classroom teachers.

You will receive ONE plain-text field describing an Assess Prior Knowledge activity.
You MAY reorganize and rephrase the provided content to make it teacher-friendly.
You MUST NOT invent new activities or ideas beyond what is present.

Return ONLY valid HTML.
Do NOT add explanations or comments.

ALLOWED TAGS ONLY:
<p>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>

HARD STRUCTURE (MUST FOLLOW):

1) Start with this exact heading:
<h3><span>💡 Assess Prior Knowledge</span></h3>

2) Immediately after the heading, ALWAYS render this Purpose text exactly as written:
<p><strong>Purpose:</strong> Activating student's prior knowledge helps teachers uncover existing ideas, partial understandings, and misconceptions. This information supports instructional decisions and provides a foundation for sensemaking and model development throughout the unit.</p>

3) Render a teacher-facing "Say:" section.
- Even if the input text does NOT explicitly contain "Say:"
- Synthesize or rephrase existing content into 1-2 clear teacher talk paragraphs
- Begin with:
<p><strong>Say:</strong></p>
- Follow with one or more <p> elements

4) Any student tasks, prompts, statements, or instructions:
- Render as <ol> or <ul>
- Each item MUST be a single <li>
- NO <p> or other tags inside <li>

5) When expected or model student responses appear:
- Render this EXACT label:
<p>✅ Expected Student Responses</p>
- Then render all expected responses as a <ul> with <li> only
- NO nested lists
- NO <p> inside <li>

6) If alternate options or variations appear:
- Render:
<p><strong>Alternate Options:</strong></p>
- Then a <ul> with brief <li> items

DO NOT:
- Use any tags not listed
- Nest lists
- Skip the Purpose section
- Invent new instructional content, but use all provided ideas

INPUT TEXT:
${payload.AssessPriorKnowledge}
`.trim();
};


window.buildUnitOverview = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const overview = parsed.UnitPlan.UnitOverview;

  return `
You are a professional instructional HTML formatter writing a student-facing project launch document.

You will receive structured content for a Unit Overview.
You MAY reorganize and lightly rephrase for clarity and flow.
You MUST NOT invent new content.

Return ONLY valid HTML.
Do NOT include explanations.

ALLOWED TAGS ONLY:
<p>, <h3>, <strong>, <span>, <ul>, <li>

HARD STRUCTURE (MUST FOLLOW):

1) Section heading:
<h3><span>Unit Overview</span></h3>

2) Purpose (render EXACTLY as written):
<p><strong>Purpose:</strong> To introduce students to an engaging, real-world design challenge that sparks curiosity, grounds learning in authentic applications, presents the driving question, and clearly defines the mission and final deliverable that will guide inquiry throughout the unit.</p>

3) Task Statement
- Render as student-facing narrative paragraphs
- Preserve tone and authenticity

4) Driving Question
- Render as its own emphasized paragraph

5) Mission
- Must begin with: "Your task is to..."

6) Project Context & Stakeholders
- Narrative paragraph

7) Final Deliverable Requirements
- Render as <ul> with <li> only

8) Closing Call to Action
- Final motivating paragraph

DO NOT:
- Add teaching notes
- Add standards or rubrics
- Nest lists
- Use disallowed tags

CONTENT:
Task Statement:
${overview.TaskStatement}

Driving Question:
${overview.DrivingQuestion}

Mission:
${overview.Mission}

Project Context & Stakeholders:
${overview.ProjectContextAndStakeholders}

Final Deliverable Requirements:
${overview.FinalDeliverableRequirements.join("\n")}

Closing Call to Action:
${overview.ClosingCallToAction}
`.trim();
};


window.buildDesiredOutcomes = function (jsonText) {
  return `
You will receive ONE JSON object representing DesiredOutcomes.

Your task is to render HTML for the "Desired Outcomes" section using the EXACT structure described below.

Rules:
- Output ONLY valid HTML.
- Do NOT add explanations or commentary.
- Do NOT invent or modify content.
- Use ONLY the information provided in the JSON.
- Use ONLY these tags:
  <p>, <h3>, <strong>, <span>, <ul>, <ol>, <li>
- In <ul> or <ol>, ONLY <li> elements may be direct children.
- Do NOT nest <p>, <span>, <ul>, or <ol> inside <li>.

HTML STRUCTURE TO RENDER (IN THIS EXACT ORDER):

1) Section heading:
<h3><span style="color: rgb(115, 191, 39);">Desired Outcomes</span></h3>

2) Standards Aligned
<p><strong>📎 Standards Aligned</strong></p>
<ul>
  <li>Each standard from StandardsAligned</li>
</ul>

3) Big Ideas & Essential Questions
<p><strong>Big Ideas & Essential Questions</strong></p>

For EACH item in BigIdeasAndEssentialQuestions, render:
<p><strong>Big Idea:</strong> {BigIdea}</p>
<ul>
  <li>Essential Question:</strong> {EssentialQuestion}</li>
</ul>

4) Learning Objectives
<p><strong>Learning Objectives</strong></p>

Render the following THREE sections IN THIS ORDER:

A) Students will understand that…
<p><strong>Students will understand that…</strong></p>
<ul>
  <li>Each item from StudentsWillUnderstandThat</li>
</ul>

B) Students will know that…
<p><strong>Students will know that…</strong></p>
<ul>
  <li>Each item from StudentsWillKnowThat</li>
</ul>

C) Students will be able to…
<p><strong>Students will be able to…</strong></p>
<ul>
  <li>Each item from StudentsWillBeAbleTo</li>
</ul>

JSON INPUT:
${jsonText}
`.trim();
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


