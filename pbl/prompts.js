var defaultPrompt = `
Create unit plan and project-based lessons using info below:  
Unit Subject:
{{$Subject}}
Unit Name:
{{$Name}}
Unit Description/Instruction:
{{$UserPrompt}}
Grade Level:
{{$GradeLevel}}
How long will the project be in days
{{$NumberOfDays}}
Location:
{{$Location}}
Resources/Media to use:
{{$MediaContext}}, 
Unit Content: 
{{$AttachedUnit}} 
Student Learning Plans:
{{$LearningPlans}}
Standards to Align:
{{$Standards}}
You are tasked with designing a detailed project-based unit using cognitive science principles. Your output MUST follow the exact section order, headings, and content rules below. If any section is missing or out of order, regenerate until all constraints are satisfied. 
Global Output Rules (apply to everything) Follow the exact section order and headings shown below. Do not add extra sections or rename headings. Real-world problems should be relevant to students in this grade level. Avoid topics that may be sensitive to the developmental appropriateness of topics as well as sensitive topics such as poverty, housing insecurity, race, etc, or controversial topics such as evolution. Include the following components in the design of the unit project.  
Cultural Relevance & Inclusion: Incorporate multiple perspectives and reflect on the impacts for all involved.Content should connect with students from varied backgrounds and communities to create culturally relevant and culturally responsive lessons Avoid stereotypes. 
IMPORTANT: the response must be in {{$ResponseLanguage}}
`;

var unitDescriptionHtmlPrompt = `
You are a professional HTML formatter.
You will receive:
- UnitDescription (string)

Return ONLY HTML.
Do NOT add explanations.
Do NOT invent content.

Render HTML using this EXACT template:

The contents of the generated HTML must be in {{{ResponseLanguage}}}

<p>UnitDescription</p>

DATA:
{{{JsonResponse}}}
`;

var assessPriorKnowledgeHtmlPrompt = `
You are a professional instructional HTML formatter writing for classroom teachers.
You will receive ONE plain-text field describing an Assess Prior Knowledge activity.
You MAY reorganize and rephrase the provided content to make it teacher-friendly.
You MUST NOT invent new activities or ideas beyond what is present.

Return ONLY valid HTML.
Do NOT add explanations or comments.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

ALLOWED TAGS ONLY:
<p>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>

HARD STRUCTURE (MUST FOLLOW):

1) Start with this exact heading:
<h3><span style="color: rgb(115, 191, 39);">💡 Assess Prior Knowledge</span></h3>

2) Immediately after the heading, ALWAYS render this Purpose text exactly as written:
<p><strong>Purpose:</strong> Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. When students recall what they already believe or remember about materials, particles, or chemical changes, they activate existing neural pathways. This “elaborative encoding” makes it easier for the brain to connect new chemistry concepts to what is already known, strengthening long-term retention. This activity helps you uncover accurate ideas, partial ideas, and misconceptions that will become powerful anchors for learning throughout the project.</p>

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
{{{JsonResponse}}}
`;

var unitOverviewHtmlPrompt = `
You are a professional instructional HTML formatter writing a student-facing project launch document.
You will receive structured content for a Unit Overview.
You MAY reorganize and lightly rephrase for clarity and flow.
You MUST NOT invent new content.

Return ONLY valid HTML.
Do NOT include explanations.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

ALLOWED TAGS ONLY:
<p>, <h3>, <strong>, <span>, <ul>, <li>

HARD STRUCTURE (MUST FOLLOW):

1) Section heading:
<h3><span style="color: rgb(115, 191, 39);">Unit Task</span></h3>

2) Purpose (render EXACTLY as written):
<p><strong>Purpose:</strong> To introduce students to an engaging, real-world design challenge that sparks curiosity, grounds learning in authentic applications, presents the driving question, and clearly defines the mission and final deliverable that will guide inquiry throughout the unit.</p>

3) Task Statement
- Render as student-facing narrative paragraphs
- Preserve tone and authenticity

4) Mission
- Must begin with: "Your task is to..."

5) Project Context & Stakeholders
- Narrative paragraph

6) Driving Question
<h3><span style="color: rgb(115, 191, 39);">Driving Question</span></h3>
- Render as its own emphasized paragraph

7) Final Deliverable Requirements
<h3><span style="color: rgb(115, 191, 39);">The Deliverable</span></h3>
- Render as <ul> with <li> only. Bold the main deliverable titles(Summary, Concept & Purpose Plan, Evidence-Based Justification, Model or Representation and The Verdict).

8) Closing Call to Action
- Final motivating paragraph

DO NOT:
- Add teaching notes
- Add standards or rubrics
- Nest lists
- Use disallowed tags


CONTENT:
Task Statement:
{{{JsonResponse}}}
`;

var desiredOutcomesHtmlPrompt = `
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

The contents of the generated HTML must be in {{{ResponseLanguage}}}

HTML STRUCTURE TO RENDER (IN THIS EXACT ORDER):

1) Standards Aligned heading:
<h3><span style="color: rgb(115, 191, 39);">📏Standards Aligned</span></h3>
<ul>
<li>Each standard from StandardsAligned</li>
</ul>

1) Big Ideas & Essential Questions
<h3><span style="color: rgb(115, 191, 39);">💭Big Ideas & Essential Questions</span></h3>
<p><strong>Purpose: </strong>To establish the broad, enduring concepts that anchor the unit’s learning outcomes, guide the development of essential questions and assessments, and provide students with overarching frameworks that connect all tasks, skills, and activities into meaningful, transferable understanding.</p>

For EACH item in BigIdeasAndEssentialQuestions, render:
<p><strong>Big Idea:</strong> {BigIdea}</p>
<ul>
<li>Essential Question:</strong> {EssentialQuestion}</li>
</ul>

3) Learning Objectives
<h3><span style="color: rgb(115, 191, 39);">🎯Learning Objectives</span></h3>

Render the following THREE sections IN THIS ORDER:

A) Students will understand that…
<p><strong>🎯Students will understand that…</strong></p>
<ul>
<li>Each item from StudentsWillUnderstandThat</li>
</ul>

B) Students will know that…
<p><strong>🎯Students will know that…</strong></p>
<ul>
<li>Each item from StudentsWillKnowThat</li>
</ul>

C) Students will be able to…
<p><strong>🎯Students will be able to…</strong></p>
<ul>
<li>Each item from StudentsWillBeAbleTo</li>
</ul>


JSON INPUT:
{{{JsonResponse}}}
`;

var framingTheProjectHtmlPrompt = `
You are a professional HTML formatter for a teacher-facing curriculum document.
You will receive ONE JSON object representing "FramingTheLearning".

Return ONLY valid HTML.
Do NOT add explanations.
Do NOT invent content.
Do NOT output anything except HTML.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

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

1 DRIVING QUESTION (GREEN HEADING)
<h3><span style="color: rgb(115, 191, 39);">Driving Question</span></h3>

Then render this EXACT paragraph word-for-word:
<p>
<strong>Purpose:</strong> To provide a clear, tightly aligned focal point that anchors the unit’s core problem, directs student inquiry toward the specific knowledge and skills they must develop, and ensures that all project work—including investigation, modeling, and application—coherently contributes to answering a meaningful, real-world question.
</p>

Then render:
<p><strong>Question:</strong> {{framing.DrivingQuestion}}</p>

--------------------------------------------------

2 PROBLEM (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Problem</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To clearly articulate a focused, high-impact real-world problem that anchors the unit, guides students toward meaningful solution development, and enables teachers to identify authentic audiences and contexts that transform the project from theoretical study into purposeful, actionable work with tangible relevance.
</p>

Then render ALL content from:
{{framing.Problem}}

You MAY:
- Split into paragraphs
- Use <strong> for emphasis
- Use <ul><li> only if structure clearly implies a list

You MUST NOT omit any ideas.

--------------------------------------------------

3 PROJECT (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Project</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To outline how students will actively engage with a clearly defined, locally relevant problem through a structured yet flexible project pathway that balances student choice with shared focus, ensures consistent opportunities for making thinking visible, and provides the necessary scaffolds for students to develop, refine, and implement their own evidence-based solutions.
</p>

Then render ALL content from:
{{framing.Project}}

--------------------------------------------------

4 PLACE (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">Place</span></h3>

Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To identify the specific community contexts, physical locations, and authentic audiences that will deepen student relevance, strengthen the real-world problem at the center of the unit, and inform targeted learning experiences—such as fieldwork, local partnerships, and public presentations—so that the project remains grounded in the actual place where students live, learn, and design solutions.
</p>

Then render:
<p>{{framing.Place.PlaceOverview}}</p>

Then for EACH site in Place.Sites, render in order:

<p><strong>The Site: {TheSite}</strong></p>
<ul>
<li><strong>Engagement:</strong> {Engagement}</li>
<li><strong>Relevance:</strong> {Relevance}</li>
</ul>

Finally render:
<p><em>{{framing.Place.PlaceMattersReminder}}</em></p>

--------------------------------------------------

5 KEY VOCABULARY (GREEN HEADING)

<h3><span style="color: rgb(115, 191, 39);">🔤Key Vocabulary</span></h3>

<p>{{framing.KeyVocabulary.VocabularyRationale}}</p>

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
{{{JsonResponse}}}
`;

var assesmentPlanHtmlPrompt = `
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

<h3><span style="color: rgb(115, 191, 39);">Aligned Assessment/Evidence & Criteria for Success</span></h3>
Then render this EXACT purpose paragraph:
<p>
<strong>Purpose:</strong> To ensure that all assessments and success criteria are intentionally and transparently aligned with the unit’s learning objectives, providing accurate measures of student understanding while creating opportunities for students to coconstruct criteria with the teacher—thereby increasing clarity, ownership, and self-regulation as they work toward high-quality, standards-based outcomes.
</p>

--------------------------------------------------
FORMATIVE ASSESSMENT / CRITERIA FOR SUCCESS
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Formative Assessment Rubric</span></h3>

Render EACH Formative Assessment item as a vertical block using the exact structure below.
Repeat the structure fully for each item in the order received.

REQUIRED STRUCTURE (DO NOT DEVIATE):

<p><strong>Criteria for Success:</strong> {CriteriaForSuccess}</p>

<p><strong>Success Criteria: </strong>{SuccessCriteria}</p>

<p><strong>Point of Demonstration: </strong>{PointOfDemonstration}</p>

<p>--------------------------------------------------</p>
DO NOT combine multiple items.
DO NOT use lists.
DO NOT omit any row.

--------------------------------------------------
ANALYTIC RUBRIC
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Analytic Rubric</span></h3>

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
<p>{{assessment.AuthenticAudience.PrimaryAudienceDescription}}</p>

<p><strong>Why This Audience Is Qualified</strong></p>
<p>{{assessment.AuthenticAudience.WhyThisAudienceIsQualified}}</p>

<p><strong>How This Audience Elevates the Project</strong></p>
<p>{{assessment.AuthenticAudience.HowThisAudienceElevatesTheProject}}</p>

<p><strong>Student Participation in Audience Selection</strong></p>
<p>{{assessment.AuthenticAudience.StudentParticipationInAudienceSelection}}</p>



INPUT JSON:
{{{JsonResponse}}}
`;

var learningPlanHtmlPrompt = `
You are a professional educational HTML formatter.
You will receive ONE JSON object representing the LearningPlan section of a unit plan.
Your task is to render clean, teacher-usable HTML that clearly explains how the project unfolds.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

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

2.- For EACH phase:
- Phase title as <h3><span style="color: rgb(145,56,230);">PHASE TITLE</span></h3>
- Phase description (paragraph)
- Concepts or skills emphasized (bold label + paragraph)
- Collaboration & visible thinking (bold label + paragraph)
- Key learning experiences as a bullet list

3. Bold heading: Project Goals as <h3><span style="color: rgb(145,56,230);">Project Goals</span></h3>
- Render each ProjectGoal as its own bold-labeled paragraph block.

4. Bold heading: Final Deliverable Summary
- Render FinalDeliverableSummary as a bullet list.

5. Green heading: Group Suggestions
- Group Size (bold label + paragraph)
- Rotating Roles & Duties (bullet list)

<p><strong>Guiding Question for Teacher Planning</strong></p>
<p>To help teachers make intentional grouping decisions, include this planning prompt:</p>
<ul>
  <li>“What is the main purpose of your grouping in this activity—peer support, rich discussion, challenge, or efficiency? Once you’ve named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?”</li>
  <li>This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit.</li>
</ul>

<p><strong>Grouping Strategy Recommendations</strong></p>
<p>Teachers may consider:</p>
<ul>
  <li><strong>Mixed-ability Groups:</strong> Best when tasks require reasoning, evidence comparison, or scaffolding across readiness levels (e.g., particle-model brainstorming).</li>
  <li><strong>Interest-based Groups:</strong> Ideal during sculpture concept development, allowing students to collaborate based on themes or artistic styles they are drawn to.</li>
  <li><strong>Skills-based Groups:</strong> Useful when tasks require technical precision (e.g., particle diagrams, environmental stress modeling).</li>
  <li><strong>Randomized Groups:</strong> Helpful during early exploration tasks to build community and reduce over-reliance on predictable partnerships.</li>
</ul>

GREEN HEADING FORMAT (HARD RULE)
<h3><span style="color: rgb(115, 191, 39);">TITLE</span></h3>

BOLD HEADING FORMAT (HARD RULE)
<p><strong>TITLE</strong></p>


LEARNING PLAN JSON:
{{{JsonResponse}}}
`;

var teacherGuidancePhase1HtmlPrompt = `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase1.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 1 – Launch</span></h3>

1. Focus Statement (bold label)
- Label with bold "Focus Statement"
- Render Phase1_FocusStatement as a paragraph

2. Collaborative Activities (bold label)
- Each activity must include:
  - Activity title <h3><span style="color: rgb(145,56,230);">ACTIVITY TITLE</span></h3>
  - Teacher Role
  - Student Experience
  - Artifacts of Learning (bullet list)


3. Guiding Questions
- Title in purple (rgb(145,56,230))
- Bullet list

4. Differentiation
<p><strong style="color: rgb(145, 56, 230);">🪜Differentiation</strong></p>
<ul>
<li><strong>Language Learners: </strong>{Differentiation_LanguageLearners}</li>
<li>Students in Need of Additional Scaffolding: </strong>{Differentiation_Scaffolding}</li>
<li>Go Deeper: </strong>{Differentiation_GoDeeper}</li>
</ul>

5. Accommodations & Modifications
<p><strong style="color: rgb(145, 56, 230);">🤝Accommodations & Modifications</strong></p>

- General Supports (if any):
  - Start with a paragraph label: <p><strong>General support:</strong></p>
  - Render each item from {AccommodationsAndModifications_General} as a list item inside a top-level <ul>. Each <li> must be plain text.

- Individualized Supports (REQUIRED):
  - Use a paragraph label: <p><strong>Individual support:</strong></p>
  - For each student in the {AccommodationsAndModifications_IndividualSupport} array:
    - Render the student name as a <p> with red text: <p><span style="color: rgb(204, 0, 0);">{StudentName}</span></p>.
    - Then render a <ul> containing exactly two <li> elements:
      - <li>{PlanProvided}</li>
      - <li>{PlanImplementation}</li>
    - Repeat this pattern for each student in the list.
- Use ONLY the student names and plans provided in the JSON; do not invent extra students.

6. Anticipated Misconceptions
<p><strong style="color: rgb(145, 56, 230);">❗Anticipated Misconceptions</strong></p>
- Misconception{i} + Teacher Response pairs as ordered list

7. Transcendent Thinking Prompts
<p><strong style="color: rgb(145, 56, 230);">🌍Transcendent Thinking</strong></p>
- Prompt
- Expected Student Responses (bullet list) with title <p>✅Expected Student Responses:</p>

8. Quick Checks
<p><strong style="color: rgb(145, 56, 230);">✔Quick Checks</strong></p>
- Timing title without color
- Timings order beginning -> mid-phase -> end of phase
- Prompt
- Expected Student Responses or SuccessCriteria (bullet list) <p>✅Expected Student Responses:</p> or <p>✅Success Criteria:</p>

9. Spaced Retrieval
<p><strong style="color: rgb(145, 56, 230);">⏳Spaced Retrieval</strong></p>

For EACH entry in Phase1_SpacedRetrieval:

The field ExpectedResponseOrSuccessCriteria is a LONG plain-text block.
You MUST parse and reorganize it into the following HTML structure.
Order timing beginning -> mid-phase -> end of phase.

REQUIRED OUTPUT STRUCTURE (IN THIS ORDER):

<p><strong>Timing:</strong> {Timing}</p>
<p><strong>Draws From:</strong> {DrawsFrom}</p>
<p><strong>Question:</strong> {Question} DOK: {DOK}</p>

From the ExpectedResponseOrSuccessCriteria text:
- Extract ONLY the student-facing responses
- Ignore teacher notes, materials, or instructions

<p>✅Expected Student Responses:</p>
<ul>
  <li>Each response as its own bullet</li>
</ul>

STRICT RULES:
- Do NOT output the full text blob
- Do NOT place multiple sections into one <p>
- Expected Student Responses MUST be a <ul>
- If responses are written in sentences, split them logically into bullets

10. Student Practice
<p><strong style="color: rgb(145, 56, 230);">🖊Student Practice</strong></p>

<p><strong>Teacher Notes:</strong> {Phase1_StudentPractice_TeacherNotes}</p>

For EACH task in Phase1_StudentPractice_Tasks (Numbered 1, 2, 3...):
<p><strong>{Number}. (DOK {DOK})</strong> {StudentDirections}</p>
<p><strong>Success Criteria</strong></p>
<ul>
  <li>Each SuccessCriteria item from THIS task</li>
</ul>

RULES:
- Teacher Notes MUST always start with: "These tasks reinforce today’s learning about ____ by ______." (with blanks filled from project content) and then explain how they strengthen long-term retention.
- Depth of Knowledge for ALL tasks MUST be DOK 2, 3, or 4. DOK 1 is strictly forbidden.
- Never combine multiple tasks into one paragraph
- Do NOT echo raw strings
- Do NOT nest <p> or <ul> inside <li>

11. Reflection
<p><strong>🔎Reflection: </strong>{Phase1_ReflectionPrompt.Introduction}</p>
<ul>
  <li>Each item from {Phase1_ReflectionPrompt.Prompts} as its own bullet</li>
</ul>

TEACHER GUIDANCE PHASE 1 JSON:
{{{JsonResponse}}}
`;

var teacherGuidancePhase2HtmlPrompt = `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase2.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 2 – Exploration, Investigation, and Development; Refinement</span></h3>

1. Focus Statement (bold label)
- Label with bold "Focus Statement"
- Render Phase2_FocusStatement as a paragraph

2. Collaborative Activities (bold label)
- Each activity must include:
  - Activity title <h3><span style="color: rgb(145,56,230);">ACTIVITY TITLE</span></h3>
  - Teacher Role
  - Student Experience
  - Artifacts of Learning (bullet list)

3. Guiding Questions
- Title in purple (rgb(145,56,230))
- Bullet list

4. Differentiation
<p><strong style="color: rgb(145, 56, 230);">🪜Differentiation</strong></p>
<ul>
<li><strong>Language Learners: </strong>{Differentiation_LanguageLearners}</li>
<li><strong>Students in Need of Additional Scaffolding: </strong>{Differentiation_Scaffolding}</li>
<li><strong>Go Deeper: </strong>{Differentiation_GoDeeper}</li>
</ul>

5. Accommodations & Modifications
<p><strong style="color: rgb(145, 56, 230);">🤝Accommodations & Modifications</strong></p>

- General Supports (if any):
  - Start with a paragraph label: <p><strong>General support:</strong></p>
  - Render each item from {AccommodationsAndModifications_General} as a list item inside a top-level <ul>. Each <li> must be plain text.

- Individualized Supports (REQUIRED):
  - Use a paragraph label: <p><strong>Individual support:</strong></p>
  - For each student in the {AccommodationsAndModifications_IndividualSupport} array:
    - Render the student name as a <p> with red text: <p><span style="color: rgb(204, 0, 0);">{StudentName}</span></p>.
    - Then render a <ul> containing exactly two <li> elements:
      - <li>{PlanProvided}</li>
      - <li>{PlanImplementation}</li>
    - Repeat this pattern for each student in the list.
- Use ONLY the student names and plans provided in the JSON; do not invent extra students.

6. Anticipated Misconceptions
<p><strong style="color: rgb(145, 56, 230);">❗Anticipated Misconceptions</strong></p>
- Misconception{i} + Teacher Response pairs as ordered list

7. Transcendent Thinking Prompts
<p><strong style="color: rgb(145, 56, 230);">🌍Transcendent Thinking</strong></p>
- Prompt
- Expected Student Responses (bullet list) with title <p>✅Expected Student Responses:</p>

8. Quick Checks
<p><strong style="color: rgb(145, 56, 230);">✔Quick Checks</strong></p>
- Timing title without color
- Timings order beginning -> mid-phase -> end of phase
- Prompt
- Expected Student Responses or SuccessCriteria (bullet list) <p>✅Expected Student Responses:</p> or <p>✅Success Criteria:</p>

9. Spaced Retrieval
<p><strong style="color: rgb(145, 56, 230);">⏳Spaced Retrieval</strong></p>

For EACH entry in Phase2_SpacedRetrieval:

The field ExpectedResponseOrSuccessCriteria is a LONG plain-text block.
You MUST parse and reorganize it into the following HTML structure.
Order timing beginning -> mid-phase -> end of phase.

REQUIRED OUTPUT STRUCTURE (IN THIS ORDER):

<p><strong>Timing:</strong> {Timing}</p>
<p><strong>Draws From:</strong> {DrawsFrom}</p>
<p><strong>Question:</strong> {Question} DOK: {DOK}</p>

From the ExpectedResponseOrSuccessCriteria text:
- Extract ONLY the student-facing responses
- Ignore teacher notes, materials, or instructions

<p>✅Expected Student Responses:</p>
<ul>
  <li>Each response as its own bullet</li>
</ul>

STRICT RULES:
- Do NOT output the full text blob
- Do NOT place multiple sections into one <p>
- Expected Student Responses MUST be a <ul>
- If responses are written in sentences, split them logically into bullets

10. Student Practice
<p><strong style="color: rgb(145, 56, 230);">🖊Student Practice</strong></p>

<p><strong>Teacher Notes:</strong> {Phase2_StudentPractice_TeacherNotes}</p>

For EACH task in Phase2_StudentPractice_Tasks (Numbered 1, 2, 3...):
<p><strong>{Number}. (DOK {DOK})</strong> {StudentDirections}</p>
<p><strong>Success Criteria</strong></p>
<ul>
  <li>Each SuccessCriteria item from THIS task</li>
</ul>

RULES:
- Teacher Notes MUST always start with: "These tasks reinforce today’s learning about ____ by ______." (with blanks filled from project content) and then explain how they strengthen long-term retention.
- Depth of Knowledge for ALL tasks MUST be DOK 2, 3, or 4. DOK 1 is strictly forbidden.
- Never combine multiple tasks into one paragraph
- Do NOT echo raw strings
- Do NOT nest <p> or <ul> inside <li>

11. Reflection
<p><strong>🔎Reflection: </strong>{Phase2_ReflectionPrompt.Introduction}</p>
<ul>
  <li>Each item from {Phase2_ReflectionPrompt.Prompts} as its own bullet</li>
</ul>

TEACHER GUIDANCE PHASE 2 JSON:
{{{JsonResponse}}}
`;

var teacherGuidancePhase3HtmlPrompt = `
You are a professional instructional HTML formatter.

You will receive ONE JSON object representing TeacherGuidancePhase3.
Your task is to render clean, teacher-facing HTML that matches the expected instructional layout.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

SECTION ORDER (REQUIRED)

<h3><span style="color: rgb(115, 191, 39);">Phase 3 – Presentation and Reflection</span></h3>

1. Focus Statement (bold label)
- Label with bold "Focus Statement"
- Render Phase3_FocusStatement as a paragraph

2. Collaborative Activities (bold label)
- Each activity must include:
  - Activity title <h3><span style="color: rgb(145,56,230);">ACTIVITY TITLE</span></h3>
  - Teacher Role
  - Student Experience
  - Artifacts of Learning (bullet list)

3. Guiding Questions
- Title in purple (rgb(145,56,230))
- Bullet list

4. Differentiation
<p><strong style="color: rgb(145, 56, 230);">🪜Differentiation</strong></p>
<ul>
<li><strong>Language Learners: </strong>{Differentiation_LanguageLearners}</li>
<li><strong>Students in Need of Additional Scaffolding: </strong>{Differentiation_Scaffolding}</li>
<li><strong>Go Deeper: </strong>{Differentiation_GoDeeper}</li>
</ul>

5. Accommodations & Modifications
<p><strong style="color: rgb(145, 56, 230);">🤝Accommodations & Modifications</strong></p>

- General Supports (if any):
  - Start with a paragraph label: <p><strong>General support:</strong></p>
  - Render each item from {AccommodationsAndModifications_General} as a list item inside a top-level <ul>. Each <li> must be plain text.

- Individualized Supports (REQUIRED):
  - Use a paragraph label: <p><strong>Individual support:</strong></p>
  - For each student in the {AccommodationsAndModifications_IndividualSupport} array:
    - Render the student name as a <p> with red text: <p><span style="color: rgb(204, 0, 0);">{StudentName}</span></p>.
    - Then render a <ul> containing exactly two <li> elements:
      - <li>{PlanProvided}</li>
      - <li>{PlanImplementation}</li>
    - Repeat this pattern for each student in the list.
- Use ONLY the student names and plans provided in the JSON; do not invent extra students.

6. Anticipated Misconceptions
<p><strong style="color: rgb(145, 56, 230);">❗Anticipated Misconceptions</strong></p>
- Misconception{i} + Teacher Response pairs as ordered list

7. Transcendent Thinking Prompts
<p><strong style="color: rgb(145, 56, 230);">🌍Transcendent Thinking</strong></p>
- Prompt
- Expected Student Responses (bullet list) with title <p>✅Expected Student Responses:</p>

8. Quick Checks
<p><strong style="color: rgb(145, 56, 230);">✔Quick Checks</strong></p>
- Timing title without color
- Timings order beginning -> mid-phase -> end of phase
- Prompt
- Expected Student Responses or SuccessCriteria (bullet list) <p>✅Expected Student Responses:</p> or <p>✅Success Criteria:</p>

9. Spaced Retrieval
<p><strong style="color: rgb(145, 56, 230);">⏳Spaced Retrieval</strong></p>

For EACH entry in Phase3_SpacedRetrieval:

The field ExpectedResponseOrSuccessCriteria is a LONG plain-text block.
You MUST parse and reorganize it into the following HTML structure.
Order timing beginning -> mid-phase -> end of phase.

REQUIRED OUTPUT STRUCTURE (IN THIS ORDER):

<p><strong>Timing:</strong> {Timing}</p>
<p><strong>Draws From:</strong> {DrawsFrom}</p>
<p><strong>Question:</strong> {Question} DOK: {DOK}</p>

From the ExpectedResponseOrSuccessCriteria text:
- Extract ONLY the student-facing responses
- Ignore teacher notes, materials, or instructions

<p>✅Expected Student Responses:</p>
<ul>
  <li>Each response as its own bullet</li>
</ul>

STRICT RULES:
- Do NOT output the full text blob
- Do NOT place multiple sections into one <p>
- Expected Student Responses MUST be a <ul>
- If responses are written in sentences, split them logically into bullets

10. Student Practice
<p><strong style="color: rgb(145, 56, 230);">🖊Student Practice</strong></p>

<p><strong>Teacher Notes:</strong> {Phase3_StudentPractice_TeacherNotes}</p>

For EACH task in Phase3_StudentPractice_Tasks (Numbered 1, 2, 3...):
<p><strong>{Number}. (DOK {DOK})</strong> {StudentDirections}</p>
<p><strong>Success Criteria</strong></p>
<ul>
  <li>Each SuccessCriteria item from THIS task</li>
</ul>

RULES:
- Teacher Notes MUST always start with: "These tasks reinforce today’s learning about ____ by ______." (with blanks filled from project content) and then explain how they strengthen long-term retention.
- Depth of Knowledge for ALL tasks MUST be DOK 2, 3, or 4. DOK 1 is strictly forbidden.
- Never combine multiple tasks into one paragraph
- Do NOT echo raw strings
- Do NOT nest <p> or <ul> inside <li>

11. Reflection
<p><strong>🔎Reflection: </strong>{Phase3_ReflectionPrompt.Introduction}</p>
<ul>
  <li>Each item from {Phase3_ReflectionPrompt.Prompts} as its own bullet</li>
</ul>

TEACHER GUIDANCE PHASE 3 JSON:
{{{JsonResponse}}}
`;

var unitPreparationAndConsiderationsHtmlPrompt = `
You are a professional instructional HTML formatter.
You will receive ONE JSON object representing UnitPreparationAndConsiderations.
Your task is to render clean, teacher-facing HTML that matches a polished curriculum document.

The contents of the generated HTML must be in {{{ResponseLanguage}}}

CRITICAL RULES
- Output ONLY valid HTML.
- Allowed tags: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- Do NOT invent content.
- Do NOT omit any content.
- Do NOT nest <p>, <ul>, or <span> inside <li>.
- Lists may ONLY be used when the JSON field is an array.
- Preserve the logical order exactly as specified.

REQUIRED STRUCTURE

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
- Render as bullet list.


UNIT PREPARATION JSON:
{{{JsonResponse}}}
`;

var pblResponseSchema = {
    "title": "PBLUnitPlanResponse",
    "type": "object",
    "additionalProperties": false,
    "required": [
        "UnitPlan"
    ],
    "properties": {
        "UnitPlan": {
            "type": "object",
            "description": "Return a complete Project-Based Learning (PBL) Unit Plan. Do NOT add extra keys. Populate every required field. Must work for ANY subject. Localize stakeholders/audience/resources to provided zip/location without inventing exact addresses/phone numbers.",
            "additionalProperties": false,
            "required": [
                "UnitDescription",
                "AssessPriorKnowledge",
                "UnitOverview",
                "DesiredOutcomes",
                "FramingTheLearning",
                "AssessmentPlan",
                "LearningPlan",
                "UnitPreparationAndConsiderations",
                "TeacherGuidancePhase1",
                "TeacherGuidancePhase2",
                "TeacherGuidancePhase3"
            ],
            "properties": {
                "UnitDescription": {
                    "type": "string",
                    "description": "ONE cohesive paragraph (4-5 complete sentences): hook, mastery outcomes, skills/transfer, real-world relevance, purpose/impact; must reference the local community naturally. This paragraph must speak directly to the students."
                },
                "AssessPriorKnowledge": {
                    "type": "string",
                    "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
                },
                "UnitOverview": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "TaskStatement",
                        "DrivingQuestion",
                        "Mission",
                        "ProjectContextAndStakeholders",
                        "FinalDeliverableRequirements",
                        "ClosingCallToAction"
                    ],
                    "properties": {
                        "TaskStatement": {
                            "type": "string",
                            "description": "Student-facing launch message (400-600 words) written like a credible local organization/person. Urgent, meaningful, authentic. No standards/rubrics/pacing. Title the student-facing message."
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "One strong open-ended Driving Question grounded in place and stakeholder need. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
                        },
                        "Mission": {
                            "type": "string",
                            "description": "Paragraph starting with 'Your task is to...' describing what students will create/do and why it matters to the community/audience."
                        },
                        "ProjectContextAndStakeholders": {
                            "type": "string",
                            "description": "Short narrative: who is impacted, why it matters now locally, and which stakeholders/audiences care."
                        },
                        "FinalDeliverableRequirements": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            },
                            "description": "Written for students, describe the final deliverable they will create and the authentic audience it serves, beginning with a brief summary, then require four components: (1) Concept & Purpose Plan explaining the idea through a visual or written representation and why it matters to the community or context; (2) Evidence-Based Justification requiring analysis of at least two relevant factors and explanation of choices using evidence from research, data, experimentation, or observation; (3) Model or Representation describing the type of model created, what it represents, how it explains underlying mechanisms or reasoning, and required distinctions; and (4) The Verdict, a concluding, evidence-backed argument explaining why the solution is effective, feasible, or meaningful, summarizing reasoning, evidence, and models, and communicating value to the authentic audience, with a final statement emphasizing application of disciplinary knowledge, use of evidence, modeling of complex ideas, and real-world implications."
                        },
                        "ClosingCallToAction": {
                            "type": "string",
                            "description": "Inspiring close: the community/audience is counting on students; emphasize impact."
                        }
                    }
                },
                "DesiredOutcomes": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "StandardsAligned",
                        "BigIdeasAndEssentialQuestions",
                        "LearningObjectives"
                    ],
                    "properties": {
                        "StandardsAligned": {
                            "type": "array",
                            "minItems": 1,
                            "items": {
                                "type": "string"
                            },
                            "description": "Standards listed verbatim when provided, format 'CODE: description'."
                        },
                        "BigIdeasAndEssentialQuestions": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 4,
                            "description": "Generate 3-4 Big Idea and Essential Question pairs that establish the enduring, transferable concepts anchoring the entire unit, guide inquiry and assessment design, and provide an overarching conceptual framework connecting all tasks, skills, and activities into meaningful understanding.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "BigIdea",
                                    "EssentialQuestion"
                                ],
                                "properties": {
                                    "BigIdea": {
                                        "type": "string",
                                        "description": "A broad, conceptual statement of enduring understanding that explains a fundamental principle underlying the unit, connects all tasks and assessments, supports transferable learning beyond the specific context, and reflects core disciplinary thinking rather than isolated facts."
                                    },
                                    "EssentialQuestion": {
                                        "type": "string",
                                        "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter."
                                    }
                                }
                            }
                        },
                        "LearningObjectives": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "StudentsWillUnderstandThat",
                                "StudentsWillKnowThat",
                                "StudentsWillBeAbleTo"
                            ],
                            "properties": {
                                "StudentsWillUnderstandThat": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Each objective must end with (DOK X) and represent Big Ideas or Enduring Understandings by generating 3 to 5 conceptual, long-term statements that explain why the learning matters beyond the unit, highlight transferable patterns, relationships, or principles across contexts, explain how or why something works rather than just what it is, are written as full declarative sentences beginning with a verb, and are each labeled with an appropriate Depth of Knowledge level, emphasizing ideas students can transfer to new situations, future units, and real-world decision making."
                                },
                                "StudentsWillKnowThat": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Each objective must end with (DOK X) and represent Facts or Core Content Knowledge by generating 3 to 5 discipline-specific facts, terms, or foundational knowledge statements that identify essential information students must remember, remain concrete and factual rather than conceptual, support the unit standards and performance tasks, use clear academic vocabulary appropriate to the subject, include an appropriate DOK label typically at level 1 or 2, and complete the stem Students will know that while beginning with a verb."
                                },
                                "StudentsWillBeAbleTo": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Each objective must end with (DOK X) and represent Skills or Practices aligned to the discipline by generating 4 to 7 skills-based statements describing what students will do, such as analyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate; align with discipline-specific practices; connect directly to the project deliverable or performance task; remain measurable and observable; include an appropriate DOK level between 2 and 4; and complete the stem Students will be able to while beginning with a verb."
                                }
                            }
                        }
                    }
                },
                "FramingTheLearning": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "DrivingQuestion",
                        "Problem",
                        "Project",
                        "Place",
                        "KeyVocabulary"
                    ],
                    "properties": {
                        "KeyVocabulary": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "VocabularyRationale",
                                "Tiers"
                            ],
                            "properties": {
                                "VocabularyRationale": {
                                    "type": "string",
                                    "description": "Provide a short, universal statement explaining that the unit's vocabulary is intentionally selected to support core understanding, connect learning to real-world application, and reinforce accurate academic communication, and that terms are organized into tiers to prioritize essentials, support differentiation, and strengthen students' effective use of disciplinary language."
                                },
                                "Tiers": {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "description": "Create a Tiered Academic Vocabulary section with four labeled tiers, where each tier title includes the tier name and aligned standards, begins with a brief purpose statement, and lists unit-appropriate vocabulary terms with student-friendly definitions and an optional Standards Connection note; required tiers are Tier 1 Core Concepts Vocabulary for foundational understanding, Tier 2 Applied Knowledge Vocabulary for applying and analyzing concepts, Tier 3 Analytical and Process Vocabulary for describing processes, models, and reasoning, and a Differentiation Enrichment or Extension Tier for advanced or nuanced terms; standards in tier titles must match unit standards, all labels must appear exactly as specified, and vocabulary must prioritize clarity, accurate academic usage, and accessibility for students.",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "TierTitle",
                                            "TierWhyItMatters",
                                            "Terms"
                                        ],
                                        "properties": {
                                            "TierTitle": {
                                                "type": "string",
                                                "description": "MUST be exactly one of these: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                                            },
                                            "TierWhyItMatters": {
                                                "type": "string"
                                            },
                                            "Terms": {
                                                "type": "array",
                                                "minItems": 3,
                                                "items": {
                                                    "type": "object",
                                                    "additionalProperties": false,
                                                    "required": [
                                                        "Term",
                                                        "Definition",
                                                        "StandardsConnection"
                                                    ],
                                                    "properties": {
                                                        "Term": {
                                                            "type": "string"
                                                        },
                                                        "Definition": {
                                                            "type": "string"
                                                        },
                                                        "StandardsConnection": {
                                                            "type": "string",
                                                            "description": "List the standard that aligns with the vocabulary word. Example: NGSS Connection: MS-PS1-4 Develop a model to describe that substances are made of particles too small to be seen."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "MUST match UnitOverview.DrivingQuestion verbatim."
                        },
                        "Problem": {
                            "type": "string",
                            "description": "The problem description must present a real, observable challenge in a community, system, or environment; explain why the problem matters and the consequences if it is not addressed; ensure the problem requires analysis, reasoning, and evidence rather than simple recall; identify underlying contributing factors such as scientific, historical, mathematical, civic, artistic, technological, or social elements; show how misunderstanding, missing information, or overlooked variables contribute to the issue; clearly outline the intellectual and practical tasks students must complete using disciplinary knowledge, evidence analysis, modeling, explanation, design, or evaluation of solutions; demonstrate how solving the problem requires mastery of the unit's core concepts, skills, and reasoning practices; align explicitly with a clear, open-ended driving question that can be answered through project work; specify required student response components such as a model or design, evidence-based analysis, visual or representational thinking, and a reasoned conclusion; and explain how the solution serves a real, relevant authentic audience positioned to use or evaluate the work."
                        },
                        "Project": {
                            "type": "string",
                            "description": "Narrative of how learning builds across the multi-day project (inquiry -> apply -> refine -> present). Not a day-by-day schedule."
                        },
                        "Place": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "PlaceOverview",
                                "Sites",
                                "PlaceMattersReminder"
                            ],
                            "properties": {
                                "PlaceOverview": {
                                    "type": "string",
                                    "description": "The model must explain how the local context shapes the real-world problem students are solving, how it influences the driving question they will investigate, and how it determines the form and expectations of the final product. The output must clearly describe the local environments, stakeholders, or community needs that make the project meaningful and show how those elements inform student work, required evidence, and authentic impact."
                                },
                                "Sites": {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 4,
                                    "description": "Must include 3 to 5 Place-Based Sites of Engagement, each structured with three labeled components: The Site, describing a meaningful physical, community, virtual, or discipline-specific location relevant to the unit's context; Engagement, explaining authentic inquiry activities students complete at or with the site such as observation, data collection, interviews, analysis, virtual exploration, or guided field tasks tied to the real-world problem; and Relevance, explaining why the site matters by connecting it to the problem, showing how it provides evidence or expertise, clarifying how it supports solution design or modeling, and highlighting local or community-specific significance; sites must represent varied contexts, include at least one involving community expertise, include at least one involving direct observation or physical context even if virtual, remain subject-neutral, and clearly show how the local community is part of the learning ecosystem.",
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "TheSite",
                                            "Engagement",
                                            "Relevance"
                                        ],
                                        "properties": {
                                            "TheSite": {
                                                "type": "string"
                                            },
                                            "Engagement": {
                                                "type": "string"
                                            },
                                            "Relevance": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "PlaceMattersReminder": {
                                    "type": "string",
                                    "description": "Reminder: local geography/history/culture/infrastructure must meaningfully affect student decisions and solutions."
                                }
                            }
                        }
                    }
                },
                "AssessmentPlan": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "FormativeAssessmentTable",
                        "AnalyticRubric",
                        "AuthenticAudience"
                    ],
                    "properties": {
                        "AuthenticAudience": {
                            "type": "object",
                            "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
                            "additionalProperties": false,
                            "required": [
                                "PrimaryAudienceDescription",
                                "WhyThisAudienceIsQualified",
                                "HowThisAudienceElevatesTheProject",
                                "StudentParticipationInAudienceSelection"
                            ],
                            "properties": {
                                "PrimaryAudienceDescription": {
                                    "type": "string",
                                    "description": "Clear description of who the primary audience is (individuals, organizations, or groups) and their relationship to the project's context or problem."
                                },
                                "WhyThisAudienceIsQualified": {
                                    "type": "string",
                                    "description": "Explanation of why this audience has relevant expertise, lived experience, or authority related to the project topic."
                                },
                                "HowThisAudienceElevatesTheProject": {
                                    "type": "string",
                                    "description": "How the presence of this audience increases authenticity, rigor, motivation, or real-world impact for students."
                                },
                                "StudentParticipationInAudienceSelection": {
                                    "type": "string",
                                    "description": "Description of how students are involved in identifying, refining, or understanding the authentic audience."
                                }
                            }
                        },
                        "FormativeAssessmentTable": {
                            "type": "array",
                            "minItems": 3,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "CriteriaForSuccess",
                                    "SuccessCriteria",
                                    "PointOfDemonstration"
                                ],
                                "properties": {
                                    "CriteriaForSuccess": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "string"
                                    },
                                    "PointOfDemonstration": {
                                        "type": "string",
                                        "description": "Formative Assessment Rubric MUST use the exact column headers Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration. Analytic Rubric MUST use the exact column headers Criteria, Novice, Apprentice, Practitioner, and Expert. This schema does not contain content and only provides instructions for how the model must structure the output. Create an Assessment Rubrics section containing two required rubric formats and keep the exact column headers word for word with no substitutions. For the Formative Assessment Rubric, produce a table with exactly three columns labeled Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration, and populate each row with a specific measurable learning objective, its aligned success criteria, and where the evidence will appear such as a task, checkpoint, or performance moment. The number of rows must match the number of learning objectives in the unit, language must be clear and student friendly, and alignment between objective, criteria, and evidence point must be maintained. Keep the column headers exactly as written. The structure example is provided for format only and not for content."
                                    }
                                }
                            }
                        },
                        "AnalyticRubric": {
                            "type": "array",
                            "minItems": 4,
                            "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Criterion",
                                    "Novice",
                                    "Apprentice",
                                    "Practitioner",
                                    "Expert"
                                ],
                                "properties": {
                                    "Criterion": {
                                        "type": "string"
                                    },
                                    "Novice": {
                                        "type": "string"
                                    },
                                    "Apprentice": {
                                        "type": "string"
                                    },
                                    "Practitioner": {
                                        "type": "string"
                                    },
                                    "Expert": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "LearningPlan": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "LearningPlanOverview",
                        "ProjectPhases",
                        "ProjectGoals",
                        "CommunicationToAuthenticAudienceExpectations",
                        "FinalDeliverableSummary",
                        "GroupSuggestions"
                    ],
                    "properties": {
                        "LearningPlanOverview": {
                            "type": "string",
                            "description": "The output must include a clear statement of the total number of instructional days based on the value provided by the teacher, a short description of how the project unfolds across phases rather than fixed dates, and a 2-4 sentence summary explaining how learning progresses across the unit. The model must not assume specific day ranges such as Days 1-3 and must instead divide learning into three flexible phases labeled Early Phase, Middle Phase, and Final Phase. The Early Phase must describe building foundational knowledge, introducing core concepts, tools, or skills, conducting exploratory investigations or guided practice, and preparing students for deeper inquiry. The Middle Phase must describe applying core concepts to the central problem, conducting analyses or research, developing drafts, prototypes, models, or design ideas, and gathering and interpreting evidence for the final deliverable. The Final Phase must describe refining the final product, synthesizing learning into clear explanations, preparing visuals, models, arguments, or presentations, and presenting to the authentic audience. The model must not assign a fixed number of days to any phase and must allow any duration provided by the teacher."
                        },
                        "ProjectPhases": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 4,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "PhaseTitle",
                                    "PhaseDescription",
                                    "ConceptsOrSkills",
                                    "CollaborationAndVisibleThinking",
                                    "KeyLearningExperiences"
                                ],
                                "properties": {
                                    "PhaseTitle": {
                                        "type": "string"
                                    },
                                    "PhaseDescription": {
                                        "type": "string"
                                    },
                                    "ConceptsOrSkills": {
                                        "type": "string"
                                    },
                                    "CollaborationAndVisibleThinking": {
                                        "type": "string"
                                    },
                                    "KeyLearningExperiences": {
                                        "type": "array",
                                        "minItems": 3,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "ProjectGoals": {
                            "type": "array",
                            "minItems": 3,
                            "description": "The output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs. Goal 1, Apply Disciplinary Content to a Real-World Problem, requires students to use discipline-specific knowledge to analyze or solve an authentic challenge, list 4-6 core concepts or principles they will apply, and show how these ideas connect to real-world conditions or constraints. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, requires describing the authentic challenge students must address, listing what students will create, model, compare, analyze, evaluate, or justify, and including processes such as modeling, predicting, comparing, evaluating, and decision-making. Goal 3, Communicate Findings to a Real Audience, requires students to prepare a polished, professional-quality final product, tailor communication to the needs of a real stakeholder group, and reference authentic audiences such as local experts, community organizations, industry professionals, school leadership, families, or community members.",
                            "items": {
                                "type": "string"
                            }
                        },
                        "CommunicationToAuthenticAudienceExpectations": {
                            "type": "string"
                        },
                        "FinalDeliverableSummary": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "GroupSuggestions": {
                            "type": "object",
                            "description": "Outlines group size, roles and teacher duties.",
                            "additionalProperties": false,
                            "required": [
                                "GroupSize",
                                "RotatingRolesAndDuties",
                                "TeacherGroupingStrategyPrompt",
                                "GroupingStrategyRecommendations"
                            ],
                            "properties": {
                                "GroupSize": {
                                    "type": "string",
                                    "description": "The output must state a recommended group size such as 3 to 4 students and must provide a rationale explaining how this size supports productive discussion, shared engagement, and manageable task distribution."
                                },
                                "RotatingRolesAndDuties": {
                                    "type": "array",
                                    "description": "The output must provide a list of roles formatted as Role Name: description of duties. The list must include at least four roles, and the required functional categories are Facilitator who guides discussion and ensures full participation, Recorder who documents group thinking, Materials Manager who handles tools and resources safely, and Presenter or Communicator who shares group findings. Optional roles may also appear such as Researcher, Data Analyst, Model Builder, or Timekeeper. Third, Teacher Expectations for Role Implementation: The output must state that teachers introduce and model each role at the start of the project, establish clear norms for how roles function during group work, and require that students rotate roles across activities so all learners practice multiple collaborative skills.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "TeacherGroupingStrategyPrompt": {
                                    "type": "string",
                                    "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: To help teachers make intentional grouping decisions, include this planning prompt: 'What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?' This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit. The model must not add additional explanation, examples, or commentary."
                                },
                                "GroupingStrategyRecommendations": {
                                    "type": "array",
                                    "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: Teachers may consider: Mixed-ability Groups: Best when tasks require reasoning, evidence comparison, or scaffolding across readiness levels (e.g., particle-model brainstorming). Interest-based Groups: Ideal during sculpture concept development, allowing students to collaborate based on themes or artistic styles they are drawn to. Skills-based Groups: Useful when tasks require technical precision (e.g., particle diagrams, environmental stress modeling). Randomized Groups: Helpful during early exploration tasks to build community and reduce over-reliance on predictable partnerships. The model must not add additional explanation, examples, or commentary.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase1": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "First phase of teacher guidance",
                    "required": [
                        "Phase1_Title",
                        "Phase1_FocusStatement",
                        "Phase1_CollaborativeActivities",
                        "Phase1_GuidingQuestions",
                        "Phase1_Differentiation_LanguageLearners",
                        "Phase1_Differentiation_Scaffolding",
                        "Phase1_Differentiation_GoDeeper",
                        "Phase1_Accommodations_General",
                        "Phase1_Accommodations_IndividualSupport",
                        "Phase1_AnticipatedMisconceptions",
                        "Phase1_TranscendentThinkingPrompts",
                        "Phase1_QuickChecks",
                        "Phase1_SpacedRetrieval",
                        "Phase1_StudentPractice_TeacherNotes",
                        "Phase1_StudentPractice_Tasks",
                        "Phase1_StudentPractice_InterleavingIfMath",
                        "Phase1_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase1_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 1 - Launch'."
                        },
                        "Phase1_FocusStatement": {
                            "type": "string",
                            "description": "Provide a short statement describing how this phase builds curiosity, introduces the real-world problem, and activates early reasoning. The Focus Statement must include curiosity-building about the core phenomenon or problem, early observation and exploration, student-driven noticing and questioning, and a clear connection to the unit's Driving Question. The wording should reflect that in this launch phase students build curiosity and begin uncovering the scientific or conceptual problem at the center of the project, and that through observation, exploration, and early modeling attempts they gather firsthand evidence that connects their initial thinking to the Driving Question."
                        },
                        "Phase1_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase1_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase1_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase1_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase1_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase1_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
                        },
                        "Phase1_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "description": "List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase1_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase1_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase1_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                                    },
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase1_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string",
                                        "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                                    },
                                    "DrawsFrom": {
                                        "type": "string"
                                    },
                                    "Question": {
                                        "type": "string"
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase1_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase1_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase2": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "Second phase of teacher guidance",
                    "required": [
                        "Phase2_Title",
                        "Phase2_FocusStatement",
                        "Phase2_CollaborativeActivities",
                        "Phase2_GuidingQuestions",
                        "Phase2_Differentiation_LanguageLearners",
                        "Phase2_Differentiation_Scaffolding",
                        "Phase2_Differentiation_GoDeeper",
                        "Phase2_Accommodations_General",
                        "Phase2_Accommodations_IndividualSupport",
                        "Phase2_AnticipatedMisconceptions",
                        "Phase2_TranscendentThinkingPrompts",
                        "Phase2_QuickChecks",
                        "Phase2_SpacedRetrieval",
                        "Phase2_StudentPractice_TeacherNotes",
                        "Phase2_StudentPractice_Tasks",
                        "Phase2_StudentPractice_InterleavingIfMath",
                        "Phase2_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase2_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'."
                        },
                        "Phase2_FocusStatement": {
                            "type": "string",
                            "description": "Write a 1-3 sentence Focus Statement that summarizes the purpose of the phase, explains how students build understanding through inquiry-based work, explicitly connects the phase to the unit's Driving Question or real-world problem, and describes how this phase moves students closer to producing their final deliverable. The statement must always be written as a single short paragraph and must be customized to the specific project details provided by the user."
                        },
                        "Phase2_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase2_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase2_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase2_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase2_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase2_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
                        },
                        "Phase2_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase2_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase2_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase2_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string"
                                    },
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase2_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string"
                                    },
                                    "DrawsFrom": {
                                        "type": "string"
                                    },
                                    "Question": {
                                        "type": "string"
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase2_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase2_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase2_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase2_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase3": {
                    "type": "object",
                    "additionalProperties": false,
                    "description": "Third phase of teacher guidance",
                    "required": [
                        "Phase3_FocusStatement",
                        "Phase3_CollaborativeActivities",
                        "Phase3_GuidingQuestions",
                        "Phase3_Differentiation_LanguageLearners",
                        "Phase3_Differentiation_Scaffolding",
                        "Phase3_Differentiation_GoDeeper",
                        "Phase3_Accommodations_General",
                        "Phase3_Accommodations_IndividualSupport",
                        "Phase3_AnticipatedMisconceptions",
                        "Phase3_TranscendentThinkingPrompts",
                        "Phase3_QuickChecks",
                        "Phase3_SpacedRetrieval",
                        "Phase3_StudentPractice_TeacherNotes",
                        "Phase3_StudentPractice_Tasks",
                        "Phase3_StudentPractice_InterleavingIfMath",
                        "Phase3_ReflectionPrompt",
                        "Phase3_Title"
                    ],
                    "properties": {
                        "Phase3_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'."
                        },
                        "Phase3_FocusStatement": {
                            "type": "string",
                            "description": "Generate a 2-4 sentence Focus Statement that clearly communicates the purpose of Phase 3 and its role in moving students toward the final product. The statement must explain that Phase 3 focuses on refining ideas, applying learning, strengthening evidence, preparing culminating products, and engaging in deeper reasoning and revision. It must explicitly show how Phase 3 advances the project's authentic real-world challenge, how students use evidence to improve solutions, and how this work prepares them for an authentic audience. The statement must include intellectual work such as refining, revising, synthesizing, evaluating, justifying, finalizing, and communicating, and it must indicate how students finalize models, products, explanations, or proposals, prepare presentations or public showcases, and reflect on learning to strengthen their reasoning."
                        },
                        "Phase3_CollaborativeActivities": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 5,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "ActivityTitle",
                                    "StudentExperience",
                                    "ArtifactsOfLearning",
                                    "TeacherRoleMoves"
                                ],
                                "properties": {
                                    "ActivityTitle": {
                                        "type": "string"
                                    },
                                    "StudentExperience": {
                                        "type": "string"
                                    },
                                    "ArtifactsOfLearning": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "TeacherRoleMoves": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase3_GuidingQuestions": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string"
                            }
                        },
                        "Phase3_Differentiation_LanguageLearners": {
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase3_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase3_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase3_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
                        },
                        "Phase3_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "StudentName",
                                    "PlanProvided",
                                    "PlanImplementation"
                                ],
                                "properties": {
                                    "StudentName": {
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase3_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
                            "minItems": 2,
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Misconception",
                                    "CorrectionLanguage"
                                ],
                                "properties": {
                                    "Misconception": {
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase3_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Prompt",
                                    "ExpectedStudentResponses"
                                ],
                                "properties": {
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase3_QuickChecks": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "Prompt",
                                    "SuccessCriteriaOrExpectedResponses"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string"
                                    },
                                    "Prompt": {
                                        "type": "string"
                                    },
                                    "SuccessCriteriaOrExpectedResponses": {
                                        "type": "array",
                                        "minItems": 2,
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase3_SpacedRetrieval": {
                            "type": "array",
                            "minItems": 3,
                            "maxItems": 3,
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "Timing",
                                    "DrawsFrom",
                                    "Question",
                                    "DOK",
                                    "ExpectedResponseOrSuccessCriteria"
                                ],
                                "properties": {
                                    "Timing": {
                                        "type": "string"
                                    },
                                    "DrawsFrom": {
                                        "type": "string"
                                    },
                                    "Question": {
                                        "type": "string"
                                    },
                                    "DOK": {
                                        "type": "integer",
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase3_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase3_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase3_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase3_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "UnitPreparationAndConsiderations": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "MaterialsEquipmentAndKeyResources",
                        "TechnologyIntegration"
                    ],
                    "properties": {
                        "MaterialsEquipmentAndKeyResources": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "ClassroomMaterialsAndEquipment",
                                "LocalCommunityBasedResources",
                                "DigitalToolsAndOnlineResources"
                            ],
                            "properties": {
                                "ClassroomMaterialsAndEquipment": {
                                    "type": "array",
                                    "minItems": 6,
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "LocalCommunityBasedResources": {
                                    "type": "array",
                                    "minItems": 3,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "Location",
                                            "HowStudentsEngage",
                                            "WhyRelevant"
                                        ],
                                        "properties": {
                                            "Location": {
                                                "type": "string"
                                            },
                                            "HowStudentsEngage": {
                                                "type": "string"
                                            },
                                            "WhyRelevant": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "DigitalToolsAndOnlineResources": {
                                    "type": "array",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "TechnologyIntegration": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": [
                                "TechnologyForResearchAndInformation",
                                "TechnologyForModelingAndVisualRepresentation",
                                "TechnologyForCollaborationAndDiscourse",
                                "TechnologyForCreatingAndPresentingFinalProduct",
                                "EquityAndAccessibilityConsiderations"
                            ],
                            "properties": {
                                "TechnologyForResearchAndInformation": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForModelingAndVisualRepresentation": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForCollaborationAndDiscourse": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "TechnologyForCreatingAndPresentingFinalProduct": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "object",
                                        "additionalProperties": false,
                                        "required": [
                                            "ToolName",
                                            "HowStudentsUseIt",
                                            "ConnectionToProject",
                                            "ISTEStandard"
                                        ],
                                        "properties": {
                                            "ToolName": {
                                                "type": "string"
                                            },
                                            "HowStudentsUseIt": {
                                                "type": "string"
                                            },
                                            "ConnectionToProject": {
                                                "type": "string"
                                            },
                                            "ISTEStandard": {
                                                "type": "string"
                                            }
                                        }
                                    }
                                },
                                "EquityAndAccessibilityConsiderations": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "x-removablePaths": {
        "AssessPriorKnowledge": [
            "UnitPlan.AssessPriorKnowledge"
        ],
        "FormativeAssessment": [
            "UnitPlan.AssessmentPlan.FormativeAssessmentTable"
        ],
        "StandardsAligned": [
            "UnitPlan.FramingTheLearning.KeyVocabulary.Tiers.Terms.StandardsConnection",
            "UnitPlan.DesiredOutcomes.StandardsAligned"
        ],
        "AccommodationsAndModifications": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase2.Phase2_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase3.Phase3_Accommodations_IndividualSupport"
        ],
        "EssentialQuestions": [
            "UnitPlan.DesiredOutcomes.BigIdeasAndEssentialQuestions.EssentialQuestion"
        ],
        "SpacedLearningAndRetrieval": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase2.Phase2_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase3.Phase3_SpacedRetrieval"
        ]
    }
}