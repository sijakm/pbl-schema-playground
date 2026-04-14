window.promptsEN = {
  STEP0_PROMPT_TEMPLATE: `Create ONLY the INQUIRY unit outline (Step 0) using the info below. Do NOT create a full unit plan and do NOT write full lesson plans.

You MUST output valid JSON that matches the provided JSON schema exactly: UnitPlanResponse. Do not include any extra keys. Use compact JSON formatting (no extra blank lines or whitespace between JSON properties). No HTML. No emojis. Plain text inside string fields.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period in minutes: {{$ClassDuration}}
Requested Number of Lessons: {{$NumberOfItems}}
Standards to Align (use verbatim if present; do NOT add new standards): {{$Standards}}
Students with individualized support (context only): {{$LearningPlans}}
Resources/Media to use: {{$MediaContext}}
Unit Content: {{$AttachedUnit}}
Attached Lesson Content (if any): {{$AttachedLesson}}

INQUIRY OUTLINE REQUIREMENTS:
- This is inquiry-first. Lessons MUST progress through this arc:
  (1) phenomenon/experience + noticing/wondering,
  (2) selecting questions + planning investigations,
  (3) evidence collection + pattern-finding,
  (4) model-building + revision using evidence,
  (5) explanation/argument + communication + transfer.
- Maintain sensemaking through discovery: students build and revise models using observations and simple data; emphasize evidence, reasoning, and communication.
- Keep alignment ONLY to the provided standards. Do NOT add any new standards or frameworks.
- Cultural relevance & inclusion: include brief community-relevant contexts or perspectives without stereotypes.
- Interleaving & transfer: revisit skills across lessons (observing, modeling, arguing from evidence, communicating).
- Lessons MUST be non-overlapping with clear boundaries.

LESSONS ARRAY CONSTRAINTS:
- The Lessons array MUST contain exactly {{$NumberOfItems}} lessons.
- lessonNumber is 1-based and strictly increasing by 1.
- Ensure logical sequencing from foundational inquiry moves to more complex modeling and explanation.
- Pacing must fit {{$ClassDuration}} minute class periods at grade {{$GradeLevel}}.

OUTPUT RULE:
Return ONLY JSON that validates against the UnitPlanResponse schema.`,

  PER_LESSON_PROMPT_TEMPLATE: `Create ONE inquiry lesson plan (NOT a unit plan, NOT multiple lessons) using the info below. You MUST output valid JSON that matches the provided JSON schema exactly: InquiryUnitPlanResponse. Do not include any extra keys. Use compact JSON formatting (no extra blank lines or whitespace between JSON properties). No HTML. No emojis. No markdown. Plain text inside string fields.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period in minutes: {{$ClassDuration}}
Standards to Align (use verbatim if present; do NOT add new standards): {{$Standards}}
Students with individualized support (MUST be used ONLY inside InvestigationPhase.AccommodationsAndModifications; use the student names/plans exactly as written): {{$LearningPlans}}
Resources/Media to use: {{$MediaContext}}
Unit Content: {{$AttachedUnit}}

Unit and Lesson Elements from Step 0 (use verbatim):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (exactly as provided; reuse verbatim where relevant): {{$UnitEssentialQuestions}}

Attached Lesson Content (if any): {{$AttachedLesson}}

INQUIRY LESSON FLOW REQUIREMENTS:
- This lesson must follow the inquiry arc and be aligned to the lesson outline boundaries: Orientation → Conceptualization → Investigation → Conclusion → Discussion.
- Maintain sensemaking through discovery: students build and revise ideas using observations and simple data; emphasize evidence, reasoning, and communication.
- Cultural relevance & inclusion: include brief community-relevant contexts or perspectives without stereotypes.
- Do NOT introduce major new concepts that belong to other lessons; stay within the scope and boundaries of this lesson’s outline.
- Keep alignment ONLY to the provided standards. Do NOT add any new standards or frameworks.
- Teacher moves must guide thinking without giving scientific explanations directly.

FIELD-SPECIFIC RULES (map to schema):
- AssessPriorKnowledge: ONLY if lesson number is 1, write 150–250 words and follow the required structure in the schema description; otherwise return "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: include general supports.
  - IndividualSupport: array must include exactly the provided students and their plans (same names/plans; no extra students; no missing students).

OUTPUT RULE:
Return ONLY JSON that validates against the InquiryUnitPlanResponse schema.`,

  HTML_LESSON_PROMPT_TEMPLATE: `You are a professional instructional HTML formatter writing for classroom teachers.

CRITICAL RULES
- Output ONLY valid HTML.
- Do NOT add explanations or commentary.
- Do NOT invent content.
- Allowed tags ONLY: <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
- Lists may ONLY contain <li> as direct children.
- NO nested lists.
- NO <p> inside <li>.
- Keep section order EXACTLY as specified below. Do NOT reorder.

--------------------------------
INPUT JSON (InquiryUnitPlanResponse for ONE lesson):
{{$LessonInquiryJson}}
--------------------------------

TASK
Transform the INPUT JSON into teacher-facing HTML using ONLY allowed tags and following the exact rendering rules and structures below.

First render essential questions and standards aligned:
<h3>💭 Essential Questions</h3>
<ul>
  - Render each item from EssentialQuestions as a <li>.
</ul>

<h3>🎯 Student Learning Objectives</h3>
<ul>
  - Render each item from StudentLearningObjectives as a <li>.
</ul>

<h3>📏 Standards Aligned</h3>
<ul>
  - Render each item from StandardsAligned as a <li>.
</ul>

==================================================
SECTION 0: ASSESS PRIOR KNOWLEDGE (CONDITIONAL)
==================================================
ONLY render this section if AssessPriorKnowledge is NOT an empty string.

HARD STRUCTURE (MUST FOLLOW EXACTLY):

<h3><span>💡 Assess Prior Knowledge</span></h3>

<p><strong>Teacher Note:</strong> Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. This process activates existing neural pathways, making it easier for the brain to attach new information to what is already known. This technique, called elaborative encoding, helps students move knowledge into long-term memory faster and more effectively, improving both understanding and retention.</p>

Then render:

<p><strong>Say:</strong></p>
- One or more <p> elements synthesizing teacher talk (even if "Say:" does not explicitly appear in the input).

Student tasks / prompts / statements:
- Render as <ol> or <ul> (but note: <ol> is NOT an allowed tag, so you MUST use <ul>).
- Each item must be ONE <li>
- NO other tags inside <li>

Expected responses:
<p>✅ Expected Student Responses</p>
<ul>
  <li>...</li>
</ul>

Alternate options (if present):
<p><strong>Alternate Options:</strong></p>
<ul>
  <li>...</li>
</ul>

==================================================
SECTION 1: ORIENTATION PHASE – DEFINE THE PROBLEM
==================================================

<h3><span style="color: rgb(115, 191, 39);">Orientation Phase – Define the Problem (5 min)</span></h3>

<p><strong>Purpose:</strong> Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from OrientationPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋Instructions for Teachers</strong></p>

<p><strong><span style="color: rgb(145, 56, 230);">Engage – Introduce the phenomenon in a way that sparks curiosity without explaining it.</span></strong></p>
<p><strong>Say:</strong> {OrientationPhase.InstructionsForTeachers.Engage.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in OrientationPhase.InstructionsForTeachers.Engage.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {OrientationPhase.InstructionsForTeachers.Engage.PromptingOptions}</li>
</ul>

<p><strong><span style="color: rgb(145, 56, 230);">Connect – Help students link their observations to the broader mystery that will anchor the investigation.</span></strong></p>
<p><strong>Say:</strong> {OrientationPhase.InstructionsForTeachers.Connect.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  <li><strong>Prompt with questions such as:</strong> {OrientationPhase.InstructionsForTeachers.Connect.PromptingOptions}</li>
  - For each move in OrientationPhase.InstructionsForTeachers.Connect.FacilitationMoves, render as <li>.
</ul>

<p><strong><span style="color: rgb(145, 56, 230);">Activate – Shift students into collaborative sensemaking.</span></strong></p>
<p><strong>Say:</strong> {OrientationPhase.InstructionsForTeachers.Activate.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in OrientationPhase.InstructionsForTeachers.Activate.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {OrientationPhase.InstructionsForTeachers.Activate.PromptingOptions}</li>
</ul>

<p><strong><span style="color: rgb(145, 56, 230);">Probe – Encourage refinement of thinking by pushing students to examine assumptions.</span></strong></p>
<p><strong>Say:</strong> {OrientationPhase.InstructionsForTeachers.Probe.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  <li><strong>Prompt with questions such as:</strong> {OrientationPhase.InstructionsForTeachers.Probe.PromptingOptions}</li>
  - For each move in OrientationPhase.InstructionsForTeachers.Probe.FacilitationMoves, render as <li>.
</ul>
<p>{OrientationPhase.InstructionsForTeachers.Probe.Closing}</p>

==================================================
SECTION 2: CONCEPTUALIZATION PHASE – RESEARCH QUESTION + ACTION PLAN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Conceptualization Phase – Research Question + Action Plan (10 min)</span></h3>

<p><strong>Purpose:</strong> Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from ConceptualizationPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋Instructions for Teachers</strong></p>

<p><strong>Guide Question Generation – Introduce the inquiry by prompting curiosity, not delivering content.</strong></p>
<p><strong>Say:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.PromptingOptions}</li>
</ul>

<p><strong>Identify Research Question – Help students collaboratively decide which question is most useful for investigation.</strong></p>
<p><strong>Say:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.PromptingOptions}</li>
</ul>

<p><strong>Create an Action Plan – Support students in designing their own investigation rather than giving them the plan.</strong></p>
<p><strong>Say:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.PromptingOptions}</li>
</ul>

==================================================
SECTION 3: INVESTIGATION PHASE
==================================================

<h3><span style="color: rgb(115, 191, 39);">Investigation Phase – Explore + Research + Experiment + Collect Data (15 min)</span></h3>

<p><strong>Purpose:</strong> Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from InvestigationPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋Instructions for Teachers</strong></p>

<p><strong>Launch the Investigation – Introduce the task without explaining content.</strong></p>
<p><strong>Say:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move in InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.PromptingOptions}</li>
</ul>

<p><strong>Collaboration Expectations – Frame the task as interdependent—each student contributes to shared analysis.</strong></p>
<p><strong>Say:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.Prompt}</p>
<p><strong>Facilitation Moves:</strong></p>
<ul>
  - For each move/expectation in InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.FacilitationMoves, render as <li>.
  <li><strong>Prompt with questions such as:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.PromptingOptions}</li>
</ul>

<p><strong>Circulation Prompts – Use these only while circulating.</strong></p>

<p><strong>Conceptual Prompts</strong></p>
<ul>
  - For each move in InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Conceptual, render as <li>.
</ul>

<p><strong>Reasoning Prompts</strong></p>
<ul>
  - For each move in InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Reasoning, render as <li>.
</ul>

<p><strong>Collaboration Prompts</strong></p>
<ul>
  - For each move in InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Collaboration, render as <li>.
</ul>

<p><strong>❗ <span style="color: rgb(145, 56, 230);">Anticipated Misconceptions</span></strong></p>
- For each item in InvestigationPhase.AnticipatedMisconceptions:
<p>{item.Misconception} (Ensure NO bolding/strong tags are used here)</p>
<ul>
  <li>{item.TeacherResponse} (Ensure NO bolding/strong tags are used here)</li>
</ul>

<p><strong>🪜 <span style="color: rgb(145, 56, 230);">Differentiation</span></strong></p>

<p><strong>Language Learners:</strong></p>
- For each strategy in InvestigationPhase.Differentiation.LanguageLearners.Strategies:
<p>{strategy}</p>
<p>Use sentence frames to support explanation and reasoning:</p>
<ul>
  - For each starter in InvestigationPhase.Differentiation.LanguageLearners.SentenceStarters, render as <li>.
</ul>

<p><strong>Additional Scaffolding:</strong></p>
- For each strategy in InvestigationPhase.Differentiation.AdditionalScaffolding.Strategies:
<p>{strategy}</p>
<p>Offer a step-by-step checklist to guide the investigation:</p>
<ul>
  - For each item in InvestigationPhase.Differentiation.AdditionalScaffolding.Checklist, render as <li>.
</ul>

<p><strong>Go Deeper:</strong></p>
- For each strategy in InvestigationPhase.Differentiation.GoDeeper.Strategies:
<p>{strategy}</p>

<p><strong>Advanced Thinking Question:</strong></p>
<ul>
  <li>Say: "{InvestigationPhase.Differentiation.GoDeeper.AdvancedQuestion}"</li>
</ul>

<p><strong>✅ Expected Student Responses</strong></p>
<ul>
  - For each response in InvestigationPhase.Differentiation.GoDeeper.ExpectedResponses, render as <li>.
</ul>

<p><strong>🤝 <span style="color: rgb(145, 56, 230);">Accommodations & Modifications</span></strong></p>

<p><strong>General Supports:</strong></p>
<ul>
  <li>{Render InvestigationPhase.AccommodationsAndModifications.General}</li>
</ul>

<p><strong>Individual Supports:</strong></p>
- For each item in InvestigationPhase.AccommodationsAndModifications.IndividualSupport render:
<p><strong><span style="color: rgb(240, 56, 40);">{StudentName}:</span></strong></p>
- For each entry in InvestigationPhase.AccommodationsAndModifications.IndividualSupport.Plan:
<p>{entry.item}</p>
<ul>
  - For each subItem in entry.subItems, render as <li>.
</ul>

<p><strong>✔ <span style="color: rgb(145, 56, 230);">Quick Checks</span></strong></p>
<p>{InvestigationPhase.QuickCheck.Question}</p>
<p><strong>✅ Expected Student Responses</strong></p>
<ul>
  - For each response in InvestigationPhase.QuickCheck.ExpectedResponses, render as <li>.
</ul>

==================================================
SECTION 4: CONCLUSION PHASE
==================================================

<h3><span style="color: rgb(115, 191, 39);">Conclusion Phase – Analyze Findings + Answer Research Question (5 min)</span></h3>

<p><strong>Purpose:</strong> Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from ConclusionPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋 Instructions for Teachers</strong></p>
<p>{ConclusionPhase.InstructionsForTeachers.OpeningScript}</p>
- For each move in ConclusionPhase.InstructionsForTeachers.FacilitationMoves render as <p>:
<p>{move}</p>

<p><strong>Prompt with questions such as:</strong></p>
<ul>
  - For each question in ConclusionPhase.InstructionsForTeachers.ProbingQuestions, render as <li>.
</ul>

- For each move in ConclusionPhase.InstructionsForTeachers.FacilitationMoves (additional moves if any), render as <p>.
<p>{ConclusionPhase.InstructionsForTeachers.WritingPrompt}</p>
<p>{ConclusionPhase.InstructionsForTeachers.CollaborationInstruction}</p>
<p><em>{ConclusionPhase.InstructionsForTeachers.Guardrail}</em></p>

<p><strong>✅ Expected Student Responses</strong></p>
<ul>
  - For each response in ConclusionPhase.ExpectedStudentResponses, render as <li>.
</ul>

==================================================
SECTION 5: DISCUSSION PHASE
==================================================

<h3><span style="color: rgb(115, 191, 39);">Discussion Phase – Implications + Meaning + Future Use (5 min)</span></h3>

<p><strong>Purpose:</strong> Help students shift from what they figured out to why it matters.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from DiscussionPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋 Instructions for Teachers</strong></p>
<p>{DiscussionPhase.InstructionsForTeachers.OpeningScript}</p>
- For each move in DiscussionPhase.InstructionsForTeachers.FacilitationMoves, render as <p>:
<p>{move}</p>

<p><strong>Prompt with questions such as:</strong></p>
<ul>
  - For each question in DiscussionPhase.InstructionsForTeachers.ProbingQuestions, render as <li>.
</ul>

<p><strong>🌍 <span style="color: rgb(145, 56, 230);">Transcendent Thinking</span></strong></p>
<p>{DiscussionPhase.TranscendentThinking.Question}</p>

<p><strong>✅ Expected Student Responses</strong></p>
<ul>
  - For each response in DiscussionPhase.ExpectedStudentResponses, render as <li>.
</ul>

==================================================
SECTION 6: REVIEW & SPACED RETRIEVAL
==================================================

You are a professional instructional HTML formatter. Your goal is to transform JSON data into a clean, teacher-facing classroom guide.

HTML & STYLE CONSTRAINTS:
- Output ONLY valid HTML using allowed tags.
- Every <li> must be inside a <ul>. Never put <p> inside <li>.
- Use emojis as markers for sections as shown in the template.

CONTENT PROCESSING RULES:
- Single Say Rule: Ensure every teacher prompt starts with exactly one <strong>Say:</strong>. If the JSON already contains "Say:", remove it before wrapping.
- Metadata Migration: For Spaced Retrieval, find the "(Draws from...)" info in the JSON. Move it to the <strong> title and delete it from the "Say:" body.
- Intelligence: Do not just copy-paste. If the JSON text is messy, rephrase it to be professional and clear for a teacher WITHOUT inventing new ideas.

RENDER THIS SKELETON EXACTLY (fill placeholders from JSON; if Materials empty output <li>None</li>):

<h3><span style="color: rgb(145, 56, 230);">Review & Spaced Retrieval (5 min)</span></h3>

<p>Teacher Notes: This strategy strengthens retention through active recall and connects today’s investigation of the shaduf to core science ideas about levers and mechanical advantage. The transcendent reflection helps students recognize how simple machines like levers allow people to solve real-world problems efficiently, both in ancient Egypt and today. It reinforces that changing variables such as arm length or counterweight affects force, effort, and efficiency in a system. </p>

<h3>📋 Instructions for Teachers</h3>

<p><strong>Active Recall</strong></p>
<p>[Clean and render ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question using Single Say Rule]</p>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses as <li> items]
</ul>

<p><strong>Correct Common Misconceptions</strong></p>
- For each item in ReviewAndSpacedRetrieval.InstructionsForTeachers.CorrectCommonMisconceptions:
<p>{item.Misconception}</p>
<ul>
  <li>{item.TeacherResponse}</li>
</ul>

<p><strong>💭 Essential Question Connection</strong></p>
<p>[Clean and render ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question using Single Say Rule]</p>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses as <li> items]
</ul>

<p><strong>⏳ Spaced Retrieval</strong></p>
<p>[Clean and render ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay using metadata migration and Single Say Rule]</p>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses as <li> items]
</ul>

==================================================
SECTION 7: FORMATIVE ASSESSMENT
==================================================

<h3><span>✅Formative Assessment</span></h3>

From the FormativeAssessment plain text, extract and render Prompts 1–4 in this exact structure (do not invent prompts; extract from text; clean formatting):

<p><strong>Prompt 1 (DOK 1):</strong></p>
<p>{Prompt 1 question}</p>
<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>{1–2 expected responses}</li>
</ul>

<p><strong>Prompt 2 (DOK 2):</strong></p>
<p>{Prompt 2 question}</p>
<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>{1–2 expected responses}</li>
</ul>

<p><strong>Prompt 3 (DOK 3):</strong></p>
<p>{Prompt 3 question}</p>
<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>{1–2 expected responses}</li>
</ul>

<p><strong>Prompt 4 (DOK 4):</strong></p>
<p>{Prompt 4 question}</p>
<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>{1–2 expected responses}</li>
</ul>

==================================================
SECTION 8: STUDENT PRACTICE
==================================================

SECTION HEADING (MUST):
<h3><span style="color: rgb(115, 191, 39);">🖋️ Student Practice</span></h3>

<p>Teacher Notes: This practice helps students extend the lesson by applying inquiry skills to a new situation outside class. Students will continue building the habits of noticing patterns, explaining choices with evidence, and considering how design changes affect results. The tasks also connect learning to real-world problem solving, showing that investigation and revision are useful beyond a single classroom activity.</p>

- For each task in StudentPractice.Tasks:
<p><strong>{task.TaskTitle}:</strong> {task.Instruction}</p>
<p><strong>Success Criteria</strong></p>
<ul>
  [Render {task.SuccessCriteria} as <li> items]
</ul>

<p><strong>Reflection:</strong></p>
<p>[Clean and render StudentPractice.Reflection.Instruction]</p>
<ul>
  [Render StudentPractice.Reflection.Prompts as <li> items]
</ul>

Reflection MUST be:
<p><strong>Reflection:</strong></p>
<p>One reflective prompt.</p>

FINAL OUTPUT RULE:
Return ONLY the combined HTML for all sections in order. No extra wrapper text.`,

  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `You are a professional instructional HTML formatter writing for classroom teachers.

You will receive a structured JSON payload representing high-level unit information.

CRITICAL RULES
- Output ONLY valid HTML.
- Do NOT add explanations or commentary.
- Do NOT invent content.
- Do NOT repeat sections.
- Allowed tags ONLY: <p>, <h2>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>
- Lists may ONLY contain <li> as direct children.
- NO nested lists.
- NO <p> inside <li>.

--------------------------------
SECTION 1: UNIT DESCRIPTION
--------------------------------
Render using EXACT template:

<h2><strong>{UnitTitle}</strong></h2>
<p>{UnitDescription}</p>
<h3><span>Unit Overview</span></h3>

--------------------------------
SECTION 2: ESSENTIAL QUESTIONS
--------------------------------
<h3><span>💭Essential Questions</span></h3>
Render as an unordered list.

--------------------------------
SECTION 3: STUDENT LEARNING OBJECTIVES
--------------------------------
<h3><span>🎯Student Learning Objectives</span></h3>
Render as an unordered list.

--------------------------------
SECTION 4: STANDARDS ALIGNED
--------------------------------
<h3><span>📏Standards Aligned</span></h3>
Render as an unordered list.

--------------------------------
SECTION 5: KEY VOCABULARY
--------------------------------
<h3><span>🔤Key Vocabulary</span></h3>
Render as an ordered list.

--------------------------------
INPUT JSON:
{{$UnitCommonJson}}
`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Unit description as one cohesive plain-text paragraph (4–5 complete sentences) written in natural teacher voice that you could say directly to students. No HTML, no emojis, no bullet points. Must flow conversationally but follow this structure (without headlines): (1) hook sentence that sparks curiosity or makes a surprising contrast, (2) 'In this unit, you will...' sentence about mastery outcomes, (3) 'You'll strengthen your skills in...' sentence about thinking/analysis abilities, (4) 'This connects to...' sentence about real-world relevance, (5) 'Understanding this matters because...' sentence about broader significance or long-term impact."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Full 'Key Vocabulary' section as a list of strings. Each string should be a single term with definition separated by dash/hyphen. Example: 'Gravity - The force that pulls objects toward each other'. All definitions must be short, age-appropriate, and directly related to the lesson's content.",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "Description",
          "EssentialQuestions",
          "StudentLearningObjectives",
          "StandardsAligned",
          "KeyVocabulary"
        ],
        "additionalProperties": false
      },
      "Lessons": {
        "type": "array",
        "description": "List of lesson containers for this unit (outline only). Each item must be non-overlapping and scoped clearly so lesson content does not repeat across lessons.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Ordering number of a lesson. 1 Based."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Short lesson title as plain text."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2–4 sentences describing the lesson scope, focus, and boundaries to prevent overlap with other lessons."
            }
          },
          "required": [
            "lessonNumber",
            "lessonTitle",
            "lessonOutline"
          ],
          "additionalProperties": false
        }
      }
    },
    "required": [
      "UnitDescription",
      "Lessons"
    ],
    "additionalProperties": false,
    "x-removablePaths": {
      "EssentialQuestions": [
        "UnitDescription.EssentialQuestions"
      ],
      "StandardsAligned": [
        "UnitDescription.StandardsAligned"
      ]
    }
  },

  PER_LESSON_SCHEMA: {
    "title": "InquiryUnitPlanResponse",
    "type": "object",
    "properties": {
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
      },
      "EssentialQuestions": {
        "type": "array",
        "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "List only the specific student learning objectives for this lesson, derived from the unit-level objectives. Each objective should be measurable and include a DOK label.",
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "array",
        "description": "List only the unique educational standards addressed in this specific lesson. Each standard must include standard code and description and must be exactly the same used in the Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
        "items": { "type": "string" }
      },
      "OrientationPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for Word: 'Purpose: Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.'"
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Engage": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script to introduce the phenomenon. Ensure it focuses on sparking curiosity without giving scientific explanations." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 specific pedagogical moves that guide silent observation and partner sharing. Include scripts starting with 'Say:' (e.g., 'Say: Take 30 seconds to look silently...'). Focus on capturing and organizing student observations into meaningful categories and encouraging multiple perspectives.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts as a single string to help students identify details, notice patterns, and surface initial wonderings. Encourage students to explain why certain details feel important and to build on or contrast each other’s observations." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "Connect": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a specific teacher script (starting with 'Say:') that helps students turn their observations of the phenomenon into research questions or problems while clustering ideas into key themes." },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 specific prompts to help students connect observations to underlying challenges, justify thinking with evidence, and prioritize which ideas are most worth investigating." },
                  "FacilitationMoves": { "type": "array", "description": "Suggest 2-3 moves to support students in refining and grouping their ideas, while pressing them to explain their reasoning. Include instructions to record and highlight recurring questions without answering them.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Activate": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Develop a teacher-led instruction ('Say:') to facilitate partner or group discussion that generates specific ideas, explanations, or solutions using available information and constraints. Encourage comparison and reasoning." },
                  "PromptingOptions": { "type": "string", "description": "List 2-3 prompts to encourage students to propose ideas, explain reasoning, consider alternative approaches, and evaluate which parts of their thinking are strongest or most uncertain." },
                  "FacilitationMoves": { "type": "array", "description": "Describe 2-3 circulation moves to listen for reasoning, press for clarity/justification, and highlight diverse approaches without evaluating which is correct.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Probe": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script to push students to refine and test their ideas by examining assumptions, considering different conditions, and identifying key factors of this lesson." },
                  "PromptingOptions": { "type": "string", "description": "Suggest 2-3 specific prompts to test ideas against new conditions, identify weaknesses, and revise thinking using evidence for this lesson's phenomena." },
                  "FacilitationMoves": { "type": "array", "description": "Provide 2-3 specific moves to encourage students to revisit and revise their initial ideas based on evidence and justify changes in their thinking.", "items": { "type": "string" } },
                  "Closing": { "type": "string", "description": "A final instruction to push students to test and revise their ideas, consider long-term effects and changing conditions, and use evidence from observations to strengthen or challenge their thinking." }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves", "Closing"],
                "additionalProperties": false
              }
            },
            "required": ["Engage", "Connect", "Activate", "Probe"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "ConceptualizationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word 'Purpose: Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.'"
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "GuideQuestionGeneration": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a teacher script (starting with 'Say:') to introduce the question brainstorming session. Focus on moving from individual to partner sharing to expand ideas." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 specific moves to support student generation of questions. Include providing think time, capturing all questions publicly, and encouraging students to refine, combine, or expand questions without judgmental evaluation.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts to help students surface curiosities, identify what they want to understand, and focus on key aspects of the system or design." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "IdentifyResearchQuestion": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script ('Say:') to guide students in selecting a question that would help them learn the most from a testable model." },
                  "FacilitationMoves": { "type": "array", "description": "Suggest 2-3 moves to guide students in sorting questions into themes and comparing ideas based on testability. Include moves to support students in refining broad questions into clear investigations by identifying variables.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 prompts to help students evaluate questions based on testability, clarity, focus on variables, and potential to generate useful evidence." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CreateAnActionPlan": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script ('Say:') to prompt students to define what they will observe, change, and collect as evidence." },
                  "FacilitationMoves": { "type": "array", "description": "Describe 2-3 moves to support students in designing an investigation plan and identifying variables. Include moves to press students to make plans specific and testable, and ensure they have a clear way to determine success.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 specific prompts to help students clarify what they will change, keep the same, and how they will compare results." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              }
            },
            "required": ["GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "InvestigationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions"
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "LaunchInvestigation": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create teacher scripts (starting with 'Say:') to introduce a puzzling scenario or model. Include an instruction to 'Display a model, scenario, demonstration, or short story that includes a flaw, inefficiency, or unexpected result' to spark curiosity." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 moves to guide the launch. Include giving students time to observe before acting, encouraging multiple interpretations, and reinforcing that there may be multiple valid ideas.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts to help students notice important or unexpected features, generate possible explanations, and justify thinking with evidence." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CollaborationExpectations": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script ('Say:') to frame the task as interdependent and emphasize shared responsibility. Include instructions to use sentence starters (e.g., 'I think... because...') and participation structures like talking chips." },
                  "FacilitationMoves": { "type": "array", "description": "List 3-5 specific moves or student behaviors to monitor during group work (e.g., identifying patterns, recording in shared data tables, comparing interpretations). Ensure they focus on all students contributing to observing and refining ideas.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 prompts to encourage students to share observations, compare interpretations, justify claims with evidence, and collaboratively revise ideas." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CirculationPrompts": {
                "type": "object",
                "description": "Specific prompts to be used by the teacher while circulating between groups.",
                "properties": {
                  "Conceptual": { "type": "array", "description": "2-3 prompts focusing on key scientific or lesson concepts (e.g., 'What evidence shows this is working?').", "items": { "type": "string" } },
                  "Reasoning": { "type": "array", "description": "2-3 prompts to press for justification and logic (e.g., 'How does this trial change your thinking?').", "items": { "type": "string" } },
                  "Collaboration": { "type": "array", "description": "2-3 prompts to ensure all voices are included (e.g., 'Who has not contributed yet?').", "items": { "type": "string" } }
                },
                "required": ["Conceptual", "Reasoning", "Collaboration"],
                "additionalProperties": false
              }
            },
            "required": ["LaunchInvestigation", "CollaborationExpectations", "CirculationPrompts"],
            "additionalProperties": false
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "description": "Generate 2-3 common student misconceptions likely to arise during this lesson. Each item must focus on a specific misunderstanding and a teacher response script.",
            "items": {
              "type": "object",
              "properties": {
                "Misconception": { "type": "string", "description": "Describe the misconception in 1 sentence, starting with 'Students may think...'. DO NOT use any bolding or strong tags." },
                "TeacherResponse": { "type": "string", "description": "A clear teacher-facing response script (starting with 'Teacher Response: ') that models how to respond in the moment with a specific prompt (starting with 'Say:'). DO NOT use any bolding or strong tags." }
              },
              "required": ["Misconception", "TeacherResponse"],
              "additionalProperties": false
            }
          },
          "Differentiation": {
            "type": "object",
            "properties": {
              "LanguageLearners": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 lesson-specific supports (visuals, word banks, gestures) to help language learners access and express ideas.", "items": { "type": "string" } },
                  "SentenceStarters": { "type": "array", "description": "Generate 3-4 sentence starters that help students describe, explain, and communicate their thinking for this specific lesson.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "SentenceStarters"],
                "additionalProperties": false
              },
              "AdditionalScaffolding": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 step-by-step supports (structured tools, modeled examples, think-alouds) and exact guidance to help students complete the task.", "items": { "type": "string" } },
                  "Checklist": { "type": "array", "description": "Generate 3-4 checklist questions to guide students in making sense of their learning during the investigation.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "Checklist"],
                "additionalProperties": false
              },
              "GoDeeper": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 extensions that increase complexity (specific challenges, pattern identification) to help students deepen or improve their thinking uses evidence.", "items": { "type": "string" } },
                  "AdvancedQuestion": { "type": "string", "description": "Generate one complex 'Say:' prompt/question to press for deeper conceptual understanding." },
                  "ExpectedResponses": { "type": "array", "description": "Generate 3-4 specific examples of high-quality student responses to the advanced question.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "AdvancedQuestion", "ExpectedResponses"],
                "additionalProperties": false
              }
            },
            "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
            "additionalProperties": false
          },
          "AccommodationsAndModifications": {
            "type": "object",
            "description": "General accommodations for the class plus individual student support plans. The model must use ONLY the student names and plans provided in the prompt.",
            "properties": {
              "General": {
                "type": "string",
                "description": "General classroom supports and modifications that apply to most or all students during this activity."
              },
              "IndividualSupport": {
                "type": "array",
                "description": "List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt.",
                "items": {
                  "type": "object",
                  "properties": {
                    "StudentName": {
                      "type": "string",
                      "description": "Full name of the student exactly as provided in the prompt."
                    },
                    "Plan": {
                      "type": "array",
                      "description": "A mix of instructions and sub-lists. Each entry has a 'item' (as a paragraph) and optional 'subItems' (as bullets) for when a task needs to be broken down logically.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "item": { "type": "string", "description": "The main instruction or list header." },
                          "subItems": { "type": "array", "description": "Optional bulleted steps or specific examples linked to the item.", "items": { "type": "string" } }
                        },
                        "required": ["item", "subItems"],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "StudentName",
                    "Plan"
                  ],
                  "additionalProperties": false
                }
              }
            },
            "required": [
              "General",
              "IndividualSupport"
            ],
            "additionalProperties": false
          },
          "QuickCheck": {
            "type": "object",
            "properties": {
              "Question": { "type": "string", "description": "Generate one specific 'Say:' question to check for student understanding during or at the end of the investigation." },
              "ExpectedResponses": { "type": "array", "description": "Generate 3-4 expected student responses that show mastery of the lesson concept.", "items": { "type": "string" } }
            },
            "required": ["Question", "ExpectedResponses"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "AnticipatedMisconceptions",
          "Differentiation",
          "AccommodationsAndModifications",
          "QuickCheck"
        ],
        "additionalProperties": false
      },
      "ConclusionPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings."
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "OpeningScript": { "type": "string", "description": "A 'Say:' statement to bring students back to the research question and surfacing emerging ideas about how the design works." },
              "FacilitationMoves": { "type": "array", "description": "2-3 pedagogical moves to give students time to review data, identify patterns, and compare results through discussion.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 specific questions to push students to explain patterns, justify decisions with evidence, and describe cause-and-effect relationships.", "items": { "type": "string" } },
              "WritingPrompt": { "type": "string", "description": "A 'Say:' statement outlining what their written explanation must include (content-specific components) and a reminder to use data as evidence." },
              "CollaborationInstruction": { "type": "string", "description": "Instruction for students to write independently then share with a partner or group to refine their reasoning." },
              "Guardrail": { "type": "string", "description": "A firm reminder that the teacher should NOT provide the scientific explanation, but instead press students to point to data." }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions", "WritingPrompt", "CollaborationInstruction", "Guardrail"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "3-4 responses that directly answer the research question using evidence and cause-and-effect reasoning (e.g., 'when we changed ___, ___ happened').",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "DiscussionPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Write word for word: Purpose: Help students shift from what they figured out to why it matters."
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "OpeningScript": { "type": "string", "description": "A 'Say:' statement to prompt students to think about the broader implications of their evidence beyond the classroom." },
              "FacilitationMoves": { "type": "array", "description": "2-3 pedagogical moves to encourage students to discuss with partners/groups and generate their own examples of real-world impact.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 specific questions to connect the investigation results to everyday life, community issues, or system redesign.", "items": { "type": "string" } }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions"],
            "additionalProperties": false
          },
          "TranscendentThinking": {
            "type": "object",
            "properties": {
              "Question": { "type": "string", "description": "Generate 1 transcendent thinking question that requires students to apply learning beyond themselves to real-world contexts (communities, global challenges). Focus on why learning matters at scale (safety, sustainability, innovation, etc.). Avoid personal/school-only focus." }
            },
            "required": ["Question"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "4-5 responses illustrating how students might apply their understanding to authentic, real-world contexts or future-oriented problem solving.",
            "items": { "type": "string" }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Full 'Review & Spaced Retrieval' section. This 5-minute activity must include: 1. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 2. Correct Common Misconceptions block 3. Essential Question Connection 4. Transcendent Thinking section 5. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers.",
        "description": "Full 'Review & Spaced Retrieval' section. This 5-minute activity must include: 1. Instructions for Teachers section containing active recall, misconception corrections, connections to unit goals, and spaced retrieval of prior learning.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Step-by-step teacher guidance for the 5-minute review and spaced retrieval session.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Prompt students to retrieve key learning from today's lesson using only evidence from the investigation.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A specific teacher script (starting with 'Say:') that prompts students to reflect on today's investigation and what it revealed about the system."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 examples of high-quality student responses showing clear use of evidence.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "CorrectCommonMisconceptions": {
                "type": "array",
                "description": "Identify 2-3 common misconceptions likely to arise for this specific topic and provide correction scripts.",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string", "description": "Describe the misconception clearly in one sentence (e.g., 'Students may think that...')." },
                    "TeacherResponse": { "type": "string", "description": "A teacher script (starting with 'Teacher Response:') and prompt (starting with 'Say:') to guide students back to the correct understanding using investigation evidence." }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Help students connect today's specific evidence to the broader unit essential questions.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A teacher script (starting with 'Say:') that links today's findings to one of the unit's essential questions."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 examples of how students justify the connection using evidence.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Revisit a concept from a previous unit or lesson to strengthen cumulative retention.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "A teacher script (starting with 'Say:') that explicitly connects a concept from a prior lesson to today's work. Must include the meta-reference (e.g., '(Draws from Unit 1, Lesson 2.)') directly in the text."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 examples of expected responses.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["TeacherSay", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["ActiveRecall", "CorrectCommonMisconceptions", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["InstructionsForTeachers"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Full 'Formative Assessment' section as plain text. Must follow this structure: A teacher-facing introduction paragraph briefly stating purpose and how to implement. 4 required question prompts labeled 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', etc. covering DOK levels 1-4. For each prompt: - Question that tests understanding at stated DOK level - Header 'Expected Student Responses' (without checkmarks/emojis) - 1-2 complete sentence responses showing mastery End with short paragraph naming specific formative assessment strategy to use (e.g.,'Exit Ticket','Think-Pair-Share'). Example format: Prompt 1 (DOK 1): 'Why do planets stay in orbit instead of flying off into space?' Expected Student Responses 'Because their forward motion and the Sun's gravity work together to create a stable orbit.' [Continue with Prompts 2-4 following same structure]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Full 'Student Practice' section for homework / out-of-class practice.",
        "properties": {
          "Tasks": {
            "type": "array",
            "description": "Generate 3 tasks covering DOK levels 2 and 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "e.g., 'Task 1 (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Clear step-by-step student directions for the task." },
                "SuccessCriteria": { "type": "array", "description": "4-5 specific, evidence-based bullet points showing what mastery looks like for this task. CRITICAL: Every criterion MUST start with an action verb (e.g., 'Describes', 'Explains', 'Uses').", "items": { "type": "string" } }
              },
              "required": ["TaskTitle", "Instruction", "SuccessCriteria"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "description": "End with self-regulation or transcendent thinking reflections.",
            "properties": {
              "Instruction": { "type": "string", "description": "Instruction for the reflection section (e.g., 'Write 2–3 sentences responding to one prompt:')." },
              "Prompts": { "type": "array", "description": "4-5 specific reflection prompts connecting today's inquiry to real life, future tools, or personal learning.", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "AssessPriorKnowledge",
      "OrientationPhase",
      "ConceptualizationPhase",
      "InvestigationPhase",
      "ConclusionPhase",
      "DiscussionPhase",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice",
      "EssentialQuestions",
      "StudentLearningObjectives",
      "StandardsAligned"
    ],
    "additionalProperties": false,
    "x-removablePaths": {
      "EssentialQuestions": [
        "EssentialQuestions"
      ],
      "StandardsAligned": [
        "StandardsAligned"
      ],
      "AssessPriorKnowledge": [
        "AssessPriorKnowledge"
      ],
      "SpacedLearningAndRetrieval": [
        "ReviewAndSpacedRetrieval"
      ],
      "FormativeAssessment": [
        "FormativeAssessment"
      ],
      "AccommodationsAndModifications": [
        "InvestigationPhase.AccommodationsAndModifications"
      ]
    }
  }
};
