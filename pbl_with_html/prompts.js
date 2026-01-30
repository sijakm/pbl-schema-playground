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

window.buildFramingTheLearning = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const framing = parsed.UnitPlan.FramingTheLearning;

  return `
You are a professional HTML formatter for a teacher-facing curriculum document.

You will receive ONE JSON object representing "FramingTheLearning".

Return ONLY valid HTML.
Do NOT add explanations.
Do NOT invent content.
Do NOT output anything except HTML.

Allowed tags:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

LIST RULE (CRITICAL):
- In <ul> or <ol>, ONLY <li> may be direct children.
- NEVER place <p>, <span>, <ul>, <ol>, or any other tag inside a <li>.

COLOR RULE:
All MAIN SECTION HEADINGS must be rendered exactly like this:
<h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

--------------------------------------------------
RENDER ORDER & STRUCTURE (HARD RULE)
--------------------------------------------------

1️⃣ DRIVING QUESTION (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Driving Question</span></h3>

Then render this EXACT paragraph word-for-word:
<p>
<strong>Purpose:</strong> To provide a clear, tightly aligned focal point that anchors the unit’s core problem, directs student inquiry toward the specific knowledge and skills they must develop, and ensures that all project work—including investigation, modeling, and application—coherently contributes to answering a meaningful, real-world question.
</p>

Then render:
<p><strong>Question:</strong> ${framing.DrivingQuestion}</p>

--------------------------------------------------

2️⃣ PROBLEM (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Problem</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To clearly articulate a focused, high-impact real-world problem that anchors the unit, guides students toward meaningful solution development, and enables teachers to identify authentic audiences and contexts that transform the project from theoretical study into purposeful, actionable work with tangible relevance.
</p>

Then render ALL content from:
${framing.Problem}

You MAY:
- Split into paragraphs
- Use <strong> for emphasis
- Use <ul><li> only if structure clearly implies a list

You MUST NOT omit any ideas.

--------------------------------------------------

3️⃣ PROJECT (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Project</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To outline how students will actively engage with a clearly defined, locally relevant problem through a structured yet flexible project pathway that balances student choice with shared focus, ensures consistent opportunities for making thinking visible, and provides the necessary scaffolds for students to develop, refine, and implement their own evidence-based solutions.
</p>

Then render ALL content from:
${framing.Project}

--------------------------------------------------

4️⃣ PLACE (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Place</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To identify the specific community contexts, physical locations, and authentic audiences that will deepen student relevance, strengthen the real-world problem at the center of the unit, and inform targeted learning experiences—such as fieldwork, local partnerships, and public presentations—so that the project remains grounded in the actual place where students live, learn, and design solutions.
</p>

Then render:
<p>${framing.Place.PlaceOverview}</p>

Then for EACH site in Place.Sites, render in order:

<p><strong>The Site:</strong> {TheSite}</p>
<p><strong>Engagement:</strong> {Engagement}</p>
<p><strong>Relevance:</strong> {Relevance}</p>

Finally render:
<p><em>${framing.Place.PlaceMattersReminder}</em></p>

--------------------------------------------------

5️⃣ KEY VOCABULARY (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Key Vocabulary</span></h3>

<p>${framing.KeyVocabulary.VocabularyRationale}</p>

For EACH Tier (in order), render:

<p><strong>{TierTitle}</strong></p>
<p><em>{TierWhyItMatters}</em></p>

<ul>
  <li><strong>TERM</strong>: Definition (StandardsConnection)</li>
</ul>

Each term MUST be its own <li>.
Do NOT nest lists.

--------------------------------------------------

INPUT JSON:
${JSON.stringify(framing)}
`.trim();
};


window.buildAssessmentPlan = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const assessment = parsed.UnitPlan.AssessmentPlan;

  return `
You are a professional HTML formatter for a teacher-facing curriculum document.

You will receive ONE JSON object representing "AssessmentPlan".

Return ONLY valid HTML.
Do NOT add explanations.
Do NOT invent content.
Do NOT output anything except HTML.

Allowed tags:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

LIST RULE (CRITICAL):
- In <ul> or <ol>, ONLY <li> may be direct children.
- NEVER place <p>, <span>, <ul>, <ol>, or any other tag inside a <li>.

COLOR RULE:
All GREEN HEADINGS must be rendered exactly like this:
<h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

--------------------------------------------------
RENDER STRUCTURE (HARD RULE)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Assessment Plan</span></h3>

--------------------------------------------------
FORMATIVE ASSESSMENT / CRITERIA FOR SUCCESS
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Aligned Assessment/Evidence & Criteria for Success</span></h3>

Render EACH Formative Assessment item as a vertical block using the exact structure below.
Repeat the structure fully for each item in the order received.

REQUIRED STRUCTURE (DO NOT DEVIATE):

<p><strong>Criteria for Success (Student Learning Objective): {CriteriaForSuccess}</strong></p>

<p><strong>Success Criteria: </strong>{SuccessCriteria}</p>

<p><strong>Point of Demonstration: </strong>{PointOfDemonstration}</p>

<p>--------------------------------------------------</p>
DO NOT combine multiple items.
DO NOT use lists.
DO NOT omit any row.

--------------------------------------------------
ANALYTIC RUBRIC
--------------------------------------------------

<p><strong>Analytic Rubric (Assessment of Final Product)</strong></p>

For EACH row in AnalyticRubric, render as a grouped block:

<p><strong>Criterion:</strong> {Criterion}</p>
<ul>
  <li><strong>Novice:</strong> {Novice}</li>
  <li><strong>Apprentice:</strong> {Apprentice}</li>
  <li><strong>Practitioner:</strong> {Practitioner}</li>
  <li><strong>Expert:</strong> {Expert}</li>
</ul>

--------------------------------------------------
AUTHENTIC AUDIENCE
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Authentic Audience</span></h3>

<p>
<strong>Purpose:</strong> To identify and engage an authentic audience beyond the classroom that deepens the relevance and real-world impact of student work, while empowering students to participate in selecting stakeholders, experts, or community members whose involvement enhances ownership, motivation, and the quality of final deliverables.
</p>

<p><strong>Primary Audience</strong></p>
<p>${assessment.AuthenticAudience.PrimaryAudienceDescription}</p>

<p><strong>Why This Audience Is Qualified</strong></p>
<p>${assessment.AuthenticAudience.WhyThisAudienceIsQualified}</p>

<p><strong>How This Audience Elevates the Project</strong></p>
<p>${assessment.AuthenticAudience.HowThisAudienceElevatesTheProject}</p>

<p><strong>Student Participation in Audience Selection</strong></p>
<p>${assessment.AuthenticAudience.StudentParticipationInAudienceSelection}</p>

--------------------------------------------------
INPUT JSON:
${JSON.stringify(assessment)}
`.trim();
};


window.buildLearningPlan = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const learningPlan = parsed.UnitPlan.LearningPlan;
  return `
You are a professional educational HTML formatter.

You will receive ONE JSON object representing the LearningPlan section of a unit plan.
Your task is to render clean, teacher-usable HTML that clearly explains how the project unfolds.

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h2>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT use tables, divs, sections, headers, or any other tags.
- Do NOT invent content.
- Do NOT omit any information.
- Light paraphrasing is allowed ONLY to improve clarity and organization.
- Lists may ONLY be used where the JSON already represents lists.
- Never place <p>, <ul>, or <span> inside <li>.

SECTION STRUCTURE (REQUIRED ORDER)

1. Green heading: Learning Plan Overview
- Render LearningPlanOverview as a paragraph.

2. Green heading: Project Phases
- For EACH phase:
  - Phase title (bold)
  - Phase description (paragraph)
  - Concepts or skills emphasized (bold label + paragraph)
  - Collaboration & visible thinking (bold label + paragraph)
  - Key learning experiences as a bullet list

3. Green heading: Project Goals
- Render each ProjectGoal as its own bold-labeled paragraph block.

4. Green heading: Collaboration & Group Structures
- Group Size (bold label + paragraph)
- Rotating Roles & Duties (bullet list)
- Teacher Grouping Strategy Prompt (paragraph, EXACT text)
- Grouping Strategy Recommendations (bullet list, EXACT text)

5. Green heading: Milestones & Indicators of Progress
- Provide a comprehensive paragraph explaining checkpoints, indicators of progress, and feedback cycles.
- Use ALL relevant information from project phases and goals.

6. Green heading: Communicating to an Authentic Audience
- Render CommunicationToAuthenticAudienceExpectations as a paragraph.

7. Green heading: Final Deliverable Summary
- Render FinalDeliverableSummary as a bullet list.

GREEN HEADING FORMAT (HARD RULE)
<h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

LEARNING PLAN JSON:
${JSON.stringify(learningPlan)}
`.trim();
};


window.buildUnitPreparationAndConsiderations = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const preparation = parsed.UnitPlan.UnitPreparationAndConsiderations;
  return `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing UnitPreparationAndConsiderations.
Your task is to render clean, teacher-facing HTML that matches a polished curriculum document.

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

REQUIRED STRUCTURE

<h3><span style="color: rgb(115, 191, 39);">Unit Preparation &amp; Considerations</span></h3>

<p><strong><span style="color: rgb(115, 191, 39);">Materials, Equipment &amp; Key Resources</span></strong></p>

1. Classroom Materials & Equipment
- Render ClassroomMaterialsAndEquipment as a bullet list.

2. Local & Community-Based Resources
- For each resource:
  - Location (bold)
  - How Students Engage
  - Why Relevant

3. Digital Tools & Online Resources
- Render DigitalToolsAndOnlineResources as a bullet list.

<p><strong><span style="color: rgb(115, 191, 39);">Technology Integration</span></strong></p>

4. Technology to Deepen Inquiry & Disciplinary Thinking
5. Technology for Modeling & Visual Representation
6. Technology for Collaboration & Discourse
7. Technology for Creating & Presenting the Final Product

For each technology tool:
- Tool Name (bold)
- How Students Use It
- Connection to Project
- ISTE Standard

8. Equity & Accessibility Considerations
- Render as paragraph text only.

UNIT PREPARATION JSON:
${JSON.stringify(preparation)}
`.trim();
};


window.buildTeacherGuidancePhase1 = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const phase1 = parsed.UnitPlan.TeacherGuidancePhase1;
  return `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase1.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 1 – Launch</span></h3>

1. Focus
- Label with bold "Focus"
- Render Phase1_FocusStatement as a paragraph

2. Collaborative Activities
- For each activity:
  - Activity title (bold)
  - Student Experience
  - Artifacts of Learning (bullet list)
  - Teacher Role

3. Guiding Questions
- Bullet list

4. Differentiation
- Language Learners
- Students in Need of Additional Scaffolding
- Go Deeper

5. Accommodations & Modifications
- General Supports
- Individualized Supports (student names in red)

6. Anticipated Misconceptions
- Misconception + Teacher Response pairs

7. Transcendent Thinking Prompts
- Prompt
- Expected Student Responses (bullet list)

8. Quick Checks
- Timing
- Prompt
- Expected Student Responses (bullet list)

9. Spaced Retrieval
- Render each entry as structured paragraphs

10. Student Practice
- Task title + DOK
- Teacher Notes
- Student Directions
- Expected Student Responses

11. Reflection
- Render Phase1_ReflectionPrompt

TEACHER GUIDANCE PHASE 1 JSON:
${JSON.stringify(phase1)}
`.trim();
};

window.buildTeacherGuidancePhase2 = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const phase2 = parsed.UnitPlan.TeacherGuidancePhase2;
  return `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase1.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 1 – Launch</span></h3>

1. Focus
- Label with bold "Focus"
- Render Phase1_FocusStatement as a paragraph

2. Collaborative Activities
- For each activity:
  - Activity title (bold)
  - Student Experience
  - Artifacts of Learning (bullet list)
  - Teacher Role

3. Guiding Questions
- Bullet list

4. Differentiation
- Language Learners
- Students in Need of Additional Scaffolding
- Go Deeper

5. Accommodations & Modifications
- General Supports
- Individualized Supports (student names in red)

6. Anticipated Misconceptions
- Misconception + Teacher Response pairs

7. Transcendent Thinking Prompts
- Prompt
- Expected Student Responses (bullet list)

8. Quick Checks
- Timing
- Prompt
- Expected Student Responses (bullet list)

9. Spaced Retrieval
- Render each entry as structured paragraphs

10. Student Practice
- Task title + DOK
- Teacher Notes
- Student Directions
- Expected Student Responses

11. Reflection
- Render Phase1_ReflectionPrompt

TEACHER GUIDANCE PHASE 1 JSON:
${JSON.stringify(phase2)}
`.trim();
};

window.buildTeacherGuidancePhase3 = function (jsonText) {
  const parsed = JSON.parse(jsonText);
  const phase3 = parsed.UnitPlan.TeacherGuidancePhase3;
  return `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase1.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 1 – Launch</span></h3>

1. Focus
- Label with bold "Focus"
- Render Phase1_FocusStatement as a paragraph

2. Collaborative Activities
- For each activity:
  - Activity title (bold)
  - Student Experience
  - Artifacts of Learning (bullet list)
  - Teacher Role

3. Guiding Questions
- Bullet list

4. Differentiation
- Language Learners
- Students in Need of Additional Scaffolding
- Go Deeper

5. Accommodations & Modifications
- General Supports
- Individualized Supports (student names in red)

6. Anticipated Misconceptions
- Misconception + Teacher Response pairs

7. Transcendent Thinking Prompts
- Prompt
- Expected Student Responses (bullet list)

8. Quick Checks
- Timing
- Prompt
- Expected Student Responses (bullet list)

9. Spaced Retrieval
- Render each entry as structured paragraphs

10. Student Practice
- Task title + DOK
- Teacher Notes
- Student Directions
- Expected Student Responses

11. Reflection
- Render Phase1_ReflectionPrompt

TEACHER GUIDANCE PHASE 1 JSON:
${JSON.stringify(phase3)}
`.trim();
};


