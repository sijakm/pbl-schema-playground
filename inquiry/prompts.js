window.promptsEN = {
  STEP0_PROMPT_TEMPLATE: `Create ONLY the INQUIRY unit outline (Step 0) using the info below. Do NOT create a full unit plan and do NOT write full lesson plans.

You MUST output valid JSON that matches the provided JSON schema exactly: UnitPlanResponse. Do not include any extra keys. Use compact JSON formatting (no extra blank lines or whitespace between JSON properties). No HTML. No emojis. Plain text inside string fields.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period in minutes: {{$ClassDuration}}
Requested Number of Lessons: {{$NumberOfLessons}}
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
- Maintain NGSS sensemaking: students build and revise models using observations and simple data; emphasize evidence, reasoning, and communication.
- Keep alignment ONLY to the provided standards. Do NOT add any new standards or frameworks.
- Cultural relevance & inclusion: include brief community-relevant contexts or perspectives without stereotypes.
- Interleaving & transfer: revisit skills across lessons (observing, modeling, arguing from evidence, communicating).
- Lessons MUST be non-overlapping with clear boundaries.

LESSONS ARRAY CONSTRAINTS:
- The Lessons array MUST contain exactly {{$NumberOfLessons}} lessons.
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
- Maintain NGSS sensemaking: students build and revise ideas using observations and simple data; emphasize evidence, reasoning, and communication.
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

<h3><span style="color: rgb(115, 191, 39);">Orientation Phase – Define the Problem</span></h3>

<p><strong>Purpose:</strong> Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.</p>

<p><strong>📚Materials:</strong></p>
<ul>
  - Render each item from OrientationPhase.Materials as a <li>. If empty, output <li>None</li>.
</ul>

<p><strong>📋Instructions for Teachers</strong></p>

<p><strong>Engage – Introduce the phenomenon in a way that sparks curiosity without explaining it.</strong></p>
<ul>
  <li>Say: Invite students to closely observe the visual phenomenon and share what they notice without offering explanations.</li>
  <li>Prompt observation with questions such as: What stands out to you? What seems surprising or worth investigating?</li>
  <li>Display or project the core visual related to the phenomenon.</li>
  <li>Facilitation move: Invite quiet observation before discussion.</li>
  <li>Facilitation move: Ask open noticing questions such as “What patterns or motions stand out to you?” and “What makes you say that?”</li>
  <li>Record student observations publicly without confirming or correcting.</li>
</ul>

<p><strong>Connect – Help students link their observations to the broader mystery that will anchor the investigation.</strong></p>
<ul>
  <li>Say: Ask students what questions are forming based on their observations.</li>
  <li>Prompt wondering with questions such as: What do you wonder about how this works? What seems unclear or puzzling?</li>
  <li>Point to specific parts of the visual when students reference details.</li>
  <li>Facilitation move: Encourage students to generate multiple possible questions.</li>
  <li>Facilitation move: Prompt reasoning with “What might be influencing what you’re seeing?”</li>
  <li>Cluster similar student questions to highlight emerging themes.</li>
</ul>

<p><strong>Activate – Shift students into collaborative sensemaking.</strong></p>
<ul>
  <li>Say: Turn students to a partner or small group to discuss initial ideas or hypotheses.</li>
  <li>Prompt students to support ideas using evidence from the visual or observations.</li>
  <li>Facilitation move: Encourage students to reference the model or image directly.</li>
  <li>Facilitation move: Circulate and ask guiding questions such as “What evidence supports your idea?” and “What might help refine your thinking?”</li>
  <li>Invite a few groups to share different hypotheses without evaluating them.</li>
  <li>Expected student responses may include ideas about forces, motion, balance, or multiple factors acting together.</li>
</ul>

<p><strong>Probe – Encourage refinement of thinking by pushing students to examine assumptions.</strong></p>
<ul>
  <li>Say: Reference a common student idea and ask what might cause that outcome.</li>
  <li>Ask probing questions such as: What makes a path curve instead of going straight?</li>
  <li>Facilitation move: Challenge assumptions with “What would happen if that force disappeared?”</li>
  <li>Encourage modeling gestures to show predicted motion or change.</li>
  <li>Prompt evidence-based reasoning by asking what in the visual supports their idea.</li>
  <li>Expected student responses may include ideas about forces pulling, motion continuing, or changes in direction.</li>
</ul>

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
<ul>
  <li>Say: Explain that scientists begin investigations by asking questions that help them make sense of what they observe.</li>
  <li>Invite students to examine the phenomenon and brainstorm as many questions as possible.</li>
  <li>Prompt question generation with open-ended cues such as: What are you wondering? What seems interesting, surprising, or puzzling?</li>
  <li>Record all student-generated questions publicly without judging, ranking, or refining them yet.</li>
  <li>Facilitation move: Encourage volume and variety of questions to surface student curiosity.</li>
</ul>

<p><strong>Identify Research Question – Help students collaboratively decide which question is most useful for investigation.</strong></p>
<ul>
  <li>Say: Ask students to review the list of questions and consider which ones would help them understand the core problem more deeply.</li>
  <li>Support students in sorting questions into categories such as cause, effect, mechanism, prediction, or evidence.</li>
  <li>Facilitation move: Ask which questions could be explored using models, data, or observations.</li>
  <li>Guide students to discuss and nominate a strong candidate research question.</li>
  <li>Teacher charts and confirms the final class research question without evaluating correctness.</li>
</ul>

<p><strong>Create an Action Plan – Support students in designing their own investigation rather than giving them the plan.</strong></p>
<ul>
  <li>Say: Explain that scientists design an action plan before collecting evidence.</li>
  <li>Prompt students to decide what they will observe during the investigation.</li>
  <li>Guide students to identify what they will test or compare.</li>
  <li>Ask students to clarify what evidence they need to collect to answer their research question.</li>
  <li>Encourage students to document thinking, track evidence, and revise ideas as their investigation unfolds.</li>
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
<ul>
  <li>Say: Position students as investigators and explain that their role is to explore the model and gather evidence.</li>
  <li>Display or distribute the investigation materials and reference model.</li>
  <li>Prompt students to look for anything that does not match expectations or reference examples.</li>
  <li>Emphasize that errors or mismatches are clues meant to spark thinking.</li>
</ul>

<p><strong>Collaboration Expectations – Establish shared responsibility.</strong></p>
<ul>
  <li>Frame the investigation as interdependent work where every student contributes.</li>
  <li>Require students to identify inaccuracies or mismatches in the model.</li>
  <li>Direct students to record observations and evidence in a structured data table.</li>
  <li>Have students compare their findings to a reference example and justify claims using evidence.</li>
  <li>Encourage use of sentence starters such as “I think ___ because ___.”</li>
  <li>Use participation structures (e.g., talking chips) to ensure equitable contribution.</li>
</ul>

<p><strong>Circulation Prompts – Use only while circulating.</strong></p>
<ul>
  <li>Conceptual Prompt: What evidence tells you this part of the model is incorrect?</li>
  <li>Conceptual Prompt: How does gravity help explain what you are observing?</li>
  <li>Reasoning Prompt: How does changing distance affect motion in this model?</li>
  <li>Reasoning Prompt: What would happen if this object had no forward motion?</li>
  <li>Collaboration Prompt: Who has not contributed yet, and how will you include them?</li>
</ul>

<p><strong>❗Anticipated Misconceptions</strong></p>
<ul>
  - Convert InvestigationPhase.AnticipatedMisconceptions into multiple <li> items (split into separate misconceptions if needed). Do NOT include numbering.
</ul>

<p><strong>🪜Differentiation</strong></p>
<ul>
  - Convert InvestigationPhase.Differentiation into exactly 3 <li> items: (1) Language Learners, (2) Additional Scaffolding, (3) Go Deeper. If the input is already structured, preserve meaning and clean wording.
</ul>

<p><strong>🤝Accommodations & Modifications</strong></p>

<p><strong>General Supports:</strong></p>
<ul>
  <li>{Render InvestigationPhase.AccommodationsAndModifications.General}</li>
</ul>

<p><strong>Individual Supports:</strong></p>
<ul>
  - For each item in InvestigationPhase.AccommodationsAndModifications.IndividualSupport render:
  <li><strong>{StudentName}:</strong> {Plan}</li>
</ul>

<p><strong>✔Quick Checks</strong></p>
<ul>
  <li>{Render InvestigationPhase.QuickCheck}</li>
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

<p><strong>📋Instructions for Teachers</strong></p>
<ul>
  <li>Say: Invite students to revisit the research question and consider how their collected evidence helps answer it.</li>
  <li>Say: Prompt students to review their notes and data and identify patterns they notice across observations.</li>
  <li>Encourage students to discuss emerging ideas in small groups and compare explanations.</li>
  <li>Say: Ask students to justify ideas by responding to prompts such as “What evidence supports this idea?”</li>
  <li>Guide students to refine explanations through peer discussion without confirming or correcting ideas.</li>
  <li>Say: Instruct students to write an explanation independently, using evidence to support each claim.</li>
  <li>Have students share their written explanation with a partner or small group.</li>
</ul>

<p><strong>Expected Student Responses</strong></p>
<ul>
  <li>References to specific observations or data points as evidence.</li>
  <li>Claims that are supported by patterns noticed across the investigation.</li>
  <li>Explanations that connect evidence to conclusions.</li>
  <li>Use of reasoning language such as “because,” “this shows,” or “based on our data.”</li>
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

<p><strong>📋Instructions for Teachers</strong></p>
<ul>
  <li>Say: Prompt students to move beyond restating findings and begin explaining why their new understanding matters.</li>
  <li>Facilitate partner or small-group discussion focused on applying learning to broader situations or future contexts.</li>
  <li>Use prompts that encourage students to extend their reasoning into real-world or future-oriented scenarios.</li>
  <li>Guide discussion with questions that push application, such as how this understanding could inform decisions or solve problems.</li>
  <li>Support meaning-making by helping students generate their own examples rather than providing examples for them.</li>
  <li>Circulate to listen, ask follow-up questions, and prompt students to justify ideas using evidence from the investigation.</li>
</ul>

<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>Students describe how their understanding could apply beyond the immediate investigation.</li>
  <li>Students connect findings to real-world decisions, future scenarios, or broader ideas.</li>
  <li>Students explain why the learning matters using evidence from their work.</li>
  <li>Students propose implications or consequences based on their new understanding.</li>
</ul>

<p><strong>🌍Transcendent Thinking</strong></p>
<ul>
  <li>Say: Invite students to reflect on how this understanding connects to larger purposes, future challenges, or meaningful real-world applications.</li>
  <li>Prompt students to write or share one sentence explaining why this learning matters beyond the classroom.</li>
  <li>Expected responses highlight long-term impact, relevance to future decisions, or connections to larger systems or ideas.</li>
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

<h3><span style="color: rgb(115, 191, 39);">Review & Spaced Retrieval (5 min)</span></h3>

<p>📚 <strong>Materials</strong></p>
<ul>
  [List items from ReviewAndSpacedRetrieval.Materials or <li>None</li>]
</ul>

<p><strong>Teacher Notes:</strong> [Write a brief pedagogical context about active recall and long-term retention based on the lesson's goal, using ONLY ideas present in the input section.]</p>

<h3>📋 Instructions for Teachers</h3>

<p><strong>Active Recall</strong></p>
<ul>
  <li><strong>Say:</strong> [Extract and clean ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question]</li>
</ul>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  [Render ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses as <li> items]
</ul>

<p><strong>Correct Common Misconceptions</strong></p>
<ul>
  <li>[Provide a concise correction script for common errors using ONLY what appears in the input section; if none are explicit, summarize minimally without adding new content.]</li>
</ul>

<p><strong>💭 Essential Question Connection</strong></p>
<ul>
  <li><strong>Say:</strong> [Create a prompt connecting today's evidence to the unit's big question using only the provided Unit Essential Questions context if present, otherwise keep generic and content-neutral.]</li>
</ul>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  <li>Students explain how evidence clarified a larger pattern.</li>
</ul>

<p><strong>🌍 Transcendent Thinking</strong></p>
<ul>
  <li><strong>Say:</strong> [Create a prompt asking why this matters in the real world or future, consistent with the lesson.]</li>
</ul>
<p>✅ <strong>Expected Student Responses</strong></p>
<ul>
  <li>Students connect learning to real-world decisions or global systems.</li>
</ul>

<p><strong>⏳ Spaced Retrieval</strong></p>
<ul>
  <li><strong>Say:</strong> [Clean ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay by removing metadata and "Say:" prefixes; output only the core instruction.]</li>
</ul>
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
<h3><span>🖊Student Practice</span></h3>

Render StudentPractice plain text into HTML using this REQUIRED structure and order (do not reorder; do not add tasks; do not add emojis):
- Teacher Notes paragraph
- Task 1 (DOK 2) directions
- Expected Student Responses (as <ul> with 3–4 <li>)
- Task 2 (DOK 3) directions
- Expected Student Responses (as <ul> with 3–4 <li>)
- Task 3 (DOK 3) directions + required elements
- Expected Student Responses (as <ul> with 3–4 <li>)
- Reflection at end

Expected Student Responses blocks MUST:
<p><strong>✅Expected Student Responses</strong></p>
<ul>
  <li>...</li>
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

<h2><strong>Unit Description: {UnitTitle}</strong></h2>
<p>{UnitDescription}</p>

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
            "description": "List all unique NGSS standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'NGSS MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
            "type": "string",
            "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: The model must include the following four sections with headers and definition. These are in (). (Engage- Introduce the phenomenon in a way that sparks curiosity without explaining it.) Provide a teacher script that draws attention to the phenomenon. Include observation-based questions without revealing explanations. Facilitation moves must encourage noticing, wondering, and curiosity. (Connect- Help students with their observations to the broader mystery that will anchor the investigation.) Include prompts that help students turn observations into questions. Facilitation moves cluster student ideas and highlight emerging patterns. Must guide teachers to build the anchor problem without giving content. (Activate- Shift students into collaborative sensemaking.) Include partner or small group discussion prompts. Students share initial hypotheses without evaluation. Teacher circulates asking open, evidence-seeking questions. (Probe- Encourage refinement of thinking by pushing students to examine assumptions.) Include probing questions that disrupt simplistic reasoning. Teacher challenges students to justify ideas or test predictions. Example moves- What makes you say that? What would happen if that assumption were wrong?"
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
            "type": "string",
            "description": "The model must include these three required section headers with definitions. These are in (). (Guide Question Generation - Introduce the inquiry by prompting curiosity, not delivering content.) Students brainstorm questions based on the phenomenon. Teacher records all questions publicly without judging them. (Identify Research Question - Help students collaboratively decide which question is most useful for investigation.) Students sort questions, compare them, and select the one with the highest investigative potential. Teacher prompts must help refine questions into testable forms. (Create an Action Plan - Support students in designing their own investigation rather than giving them the plan.) The output must guide students to define: what they will observe, what they will test or compare, and what evidence they need to collect. Teacher facilitation moves must support planning without providing the investigation steps directly."
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
            "type": "string",
            "description": "The model must include the following sections with headers and definition. These are in ().(Launch the Investigation - Introduce the investigation task without explaining content so students uncover ideas through exploration and evidence-gathering.) The model must show that the teacher sets up materials and expectations and that students run tests, trials, or observations without being told the scientific explanation. (Collaboration Expectations - Guide students to work interdependently with shared responsibility.) The model must produce a paragraph that instructs teachers on how to establish collaboration expectations during group investigations, ensuring all tasks require shared responsibility and equal participation. Do not create 'roles'. The paragraph must explicitly direct the model to include a list of required student actions presented as general investigation behaviors, not subject-specific outcomes. These required actions must include: identifying inaccuracies or mismatches in a the project; recording observations and evidence in a structured data table; comparing their work to a reference example and justifying claims with evidence; using sentence starters to explain reasoning (such as 'I think _ because _'); and using participation structures (such as talking chips) to ensure every student contributes. The schema must emphasize that teachers support collaboration by reinforcing norms, monitoring engagement, and prompting evidence-based discussion without supplying  explanations.(Circulation Prompts - Use these only while circulating, each prompt supports thinking, not answers.) Prompts must be categorized into Conceptual (example: 'What evidence tells you this is happening?'), Reasoning (example: 'How does this trial change your thinking?'), and Collaboration (example: 'Who has not contributed yet? How can you include them?'). The model must clearly state that the teacher must not give away scientific explanations."
          },
          "AnticipatedMisconceptions": {
            "type": "string",
            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding."
          },
          "Differentiation": {
            "type": "string",
            "description": "Three-part differentiation strategies including: (1) Language Learners support (2-3 strategies), (2) Additional Scaffolding support (2-3 strategies), (3) Go Deeper extensions (1-2 activities with expected responses)"
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
                      "type": "string",
                      "description": "Short description of the individualized accommodation or modification for this student."
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
            "type": "string",
            "description": "Final comprehension check question with 2-3 expected student responses showing mastery"
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
            "type": "string",
            "description": "The Instructions for Teachers must follow this structure: teachers prompt students to revisit the research question, review collected data, identify patterns, refine ideas through group discussion, and justify explanations with evidence. Teachers must guide but never provide scientific explanations. The model must include scripted teacher prompts such as Review your notes and data, What patterns do you notice, What evidence supports this idea, and Use your data to support your claim. The Instructions must require students to write an explanation independently and then share with a partner or group. Expected Student Responses must demonstrate evidence-based reasoning in a general way, without domain-specific examples. The entire output must remain content-neutral."
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
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
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "string",
            "description": "The model must generate a paragraph that instructs teachers on how to facilitate a discussion phase in which students move beyond simply reporting findings and begin exploring the broader significance, applications, and implications of their learning. The paragraph must direct teachers to prompt students to connect their investigation results to real-world situations, future scenarios, or larger conceptual ideas. It should require the model to include guidance for partner or group discussion, teacher-led questioning that encourages students to extend and apply their reasoning, and facilitation moves that support students in generating their own examples rather than relying on teacher-provided ones. The schema must also require the model to output a set of expected student responses illustrating how learners might apply their understanding to authentic or future-oriented contexts."
          },
          "TranscendentThinking": {
            "type": "string",
            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding"
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Full 'Review & Spaced Retrieval' section as plain text. This 5-minute activity must include in this exact order: 1. Materials List (often none needed) 2. Teacher Notes paragraph that explains: - How this review strategy enhances retention - Connection to prior learning concepts - How transcendent reflection deepens understanding 3. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 4. Correct Common Misconceptions block with: - Sample misconception statements - Teacher response scripts addressing each 5. Essential Question Connection including: - Teacher prompt linking to unit question - Expected Student Responses (2-3 examples) 6. Transcendent Thinking section with: - Real-world application prompt - Think time instruction - Expected Student Responses (2-3 examples) 7. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers. Return as plain text.",
        "properties": {
          "Materials": {
            "type": "array",
            "description": "Required physical items needed for this guided practice activity (e.g., 'Styrofoam balls, string, markers') formatted as a list",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": ""
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Question",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Must include a clear reference to specific prior lesson next to the Spaced Retrieval title and note it like this: '(Draws from Unit 3, Lesson 2.)'  Must use active recall question connecting past and current concepts. Must not require students using notes or resources to answer.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": ""
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "TeacherSay",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "required": [
              "ActiveRecall",
              "SpacedRetrieval"
            ],
            "additionalProperties": false
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Full 'Formative Assessment' section as plain text. Must follow this structure: A teacher-facing introduction paragraph briefly stating purpose and how to implement. 4 required question prompts labeled 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', etc. covering DOK levels 1-4. For each prompt: - Question that tests understanding at stated DOK level - Header 'Expected Student Responses' (without checkmarks/emojis) - 1-2 complete sentence responses showing mastery End with short paragraph naming specific formative assessment strategy to use (e.g.,'Exit Ticket','Think-Pair-Share'). Example format: Prompt 1 (DOK 1): 'Why do planets stay in orbit instead of flying off into space?' Expected Student Responses 'Because their forward motion and the Sun's gravity work together to create a stable orbit.' [Continue with Prompts 2-4 following same structure]"
      },
      "StudentPractice": {
        "type": "string",
        "description": "Full 'Student Practice' section as plain text. This is homework / out-of-class practice. Follow this EXACT format for the response: Teacher Notes: [1 paragraph explaining how the tasks reinforce learning + build real-world connections] (DOK 2) [First task with clear student directions] Expected Student Responses [3-4 bullet points showing mastery] (DOK 3) [Second task requiring higher-order thinking] Expected Student Responses [3-4 bullet points showing analysis/application] (DOK 3) [Third task connecting to broader concepts] Must include: [3+ specific elements students need to address] Expected Student Responses [3-4 bullet points showing synthesis/evaluation] Reflection: End with one self-regulation or transcendent thinking reflection, such as: 'What evidence of today's science concept can you find in your home or neighborhood?', 'How does what you learned today help you see the world differently?', 'What challenges did you face doing this at home, and how did you overcome them?', or 'How might this concept impact our community or future discoveries?'"
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
      "StudentPractice"
    ],
    "additionalProperties": false,
    "x-removablePaths": {
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
