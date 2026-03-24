const STEP0_PROMPT_TEMPLATE = `
Create the unit outline and lesson structure using the info below. Do NOT write full lesson plans.
                    
Based on Unit Subject, NGSS Standards, Unit Description/Instruction, Grade Level, Duration of class period (minutes), and the requested Number of Lessons, generate a JSON response that includes a cohesive UnitDescription and a non-overlapping list of lesson “containers”.

Unit Subject:
{{$Subject}}

Unit Name:
{{$Name}}

Unit Description/Instruction:
{{$UserPrompt}}

Grade Level:
{{$GradeLevel}}

Duration of class period in minutes:
{{$ClassDuration}}
	
Standards to Align:
{{$Standards}}
    
Students with individualized support:
{{$LearningPlans}}

Resources/Media to use:
{{$MediaContext}}
	
Unit Content:
{{$AttachedUnit}}

Essential Questions requirements:
- Each question MUST be a complete, grammatically correct sentence that ends with a question mark.
- Each question MUST begin with either "How" or "Why".
- Questions MUST be conceptual and exploratory, not factual, procedural, or definitional.
- Questions MUST focus on broad, universal ideas (such as change, evidence, patterns, relationships, systems, or reasoning), not on subject-specific content.
- Questions MUST be transferable across disciplines and applicable beyond this unit.
- Questions MUST be reused verbatim in every lesson within the unit.

What to generate:
- Output MUST be valid JSON matching the schema.
- MANDATORY: Fully populate all properties within the "UnitDescription" object:
  - "Description": Write a 4-5 sentence paragraph that describes the unit's core focus and narrative journey.
  - "StudentLearningObjectives": List 3-5 key measurable learning goals for the unit.
  - "StandardsAligned": List all standards being addressed throughout the unit.
  - "EssentialQuestions": Exactly 3 conceptual questions following the rules above.
- GENERATE the "Lessons" list containing exactly {{$NumberOfLessons}} lessons.
  - Each lesson must include "lessonNumber" (1-based index), "lessonName", and "lessonDescription" (2–4 sentences describing lesson scope).

Constraints:
- Keep the unit and every lesson aligned to the unit focus.
- Ensure logical sequencing from foundational ideas to more complex modeling.
- Accuracy: All content must be scientifically accurate and age-appropriate.

Output MUST be valid JSON matching the schema. Use compact formatting (no extra blank lines).
`;

const PER_LESSON_PROMPT_TEMPLATE = `
Create ONE lesson plan (NOT a unit plan, NOT multiple lessons) using the info below.
You MUST output valid JSON that matches the provided JSON schema exactly (LessonPlanResponse with a single "LessonPlan" object). Do not include any extra keys. Use compact JSON formatting (no extra blank lines).
Unit Subject: 
{{$Subject}}
Unit Name: 
{{$Name}}
Unit Description/Instruction: 
{{$UserPrompt}}
Grade Level: 
{{$GradeLevel}}
Duration of class period in minutes 
{{$ClassDuration}}
Resources/Media to use: 
{{$MediaContext}}
Unit Content: 
{{$ParentUnitData}}
Standards to Align:
{{$Standards}}
Attached Lesson Content: 
{{$AttachedLesson}}

Unit Essential Questions (USE THESE VERBATIM):
{{$UnitEssentialQuestions}}


STUDENTS WITH INDIVIDUALIZED SUPPORT (MUST be used ONLY inside GuidedPractice.AccommodationsAndModifications; use the student names/plans exactly as written):
{{$LearningPlans}}

IMPORTANT CONTENT RULES:
- Keep the lesson aligned to the unit focus: developing and using models to describe atomic composition of simple molecules and/or extended structures.
- Include brief, high-level connections to other relevant NGSS DCIs where appropriate, but keep the lesson centered on modeling and structure–property reasoning (no deep math, no balancing equations unless explicitly required by standards).
- Ensure all parts of the lesson reflect the Lesson Scope/Boundaries above; avoid introducing new major concepts that belong to other lessons.
- EssentialQuestions: MUST exactly equal the unit-level essential questions (same text, same order).
- AssessPriorKnowledge: ONLY if LessonNumber == 1, write 150–250 words and follow the required structure in the schema description. If LessonNumber != 1, return "" (empty string).
- DirectPresentation must be ≤10 minutes total and must follow the required HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT format with Say/Do/Ask/Listen for/Write, and expected student responses as bullet points.
- GuidedPractice.InstructionsForTeachers must be at least 700 words and must include the required components listed in the schema description.
- GuidedPractice.AccommodationsAndModifications must include:
  - General: general supports
  - IndividualSupport: array with exactly the provided students and their plans (same names/plans; no additional students).
- StudentPractice MUST include a TeacherNotes paragraph starting with 'These tasks reinforce today’s learning about ____ by ______.', a list of 2-3 tasks with DOK 2-4 and success criteria, and interleaving if the subject is math.

OUTPUT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema exactly.
- Output MUST be a SINGLE lesson plan only.
- No HTML. No emojis. No markdown. Plain text inside string fields.
`;

const HTML_LESSON_PROMPT_TEMPLATE = `
You will receive ONE JSON object that strictly follows the UnitPlanResponse schema (already validated on my side). Your job is to transform this JSON into clean, readable HTML that a teacher can use directly in class.

INPUT FORMAT
I will send you the JSON object like this:

UNIT PLAN JSON:
{{{JsonResponse}}}

Treat everything after the line “UNIT PLAN JSON:” as the exact JSON object. Do NOT explain or comment on it; just parse it and render it.

GLOBAL RULES
    - Output ONLY valid HTML (no markdown, no backticks, no prose explanation).
    - Allowed tags: <p>, <h1>, <h2>, <h3>, 
    - (wrapped inside <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - Do NOT use any other tags (no <main>, <section>, <header>, <div>, <h4>, etc.).
    - HTML should be well-indented and easy to read.
    - In any <ol> or <ul>, ONLY use <li> elements as direct children. Never place <p>, <span>, <ul>, <ol>, or any other tag as a child of a list.
    - Do NOT invent new instructional content; use only what exists in the JSON fields.
    - Preserve the logical order implied by the schema:
    - Inside each lesson, follow the schema field order.
    - If a string field is empty (""), OMIT that subsection and its label.
    - If an array is empty, omit its heading and the corresponding <ul> or <ol>.
    - Whenever the text clearly forms a list of prompts/questions/statements/responses, use <ul><li>…</li></ul> or <ol><li>…</li></ol>. Otherwise, use <p>.
    - Whenever you render model/expected student responses in ANY section, use this pattern:
        - First: <p>✅ Expected Student Responses</p> (no bullets on this line)
        - Then a <ul> or <ol> list containing the responses (one response per <li>).
    - Whenever you render a Quick Check:
        - Use this exact header: <p><strong>✔Quick Check</strong></p>
        - Render the question or task immediately following the header as a paragraph that tasks EVERY student to show their understanding (not just one student in a verbal check).
        - Use the global ✅Expected Student Responses pattern for the answers.

For this lesson:
    - Lesson Essential Questions (if any):
    - <h3>💭 Essential Questions</h3>
    - <ul> with each item in Lesson.EssentialQuestions as <li>.
    - Key Vocabulary (if any):
    - <h3>🔤 Key Vocabulary</h3>
    - <ol> where each item from KeyVocabulary is one <li>, keeping the “Term – Definition” structure:
    - <strong>Term</strong> – Definition
    - Student Learning Objectives (if any):
    - <h3>🎯 Student Learning Objectives</h3>
    - <ul> with each item from Lesson.StudentLearningObjectives as <li>.
    - Standards for the lesson:
    - <h3>📏 Standards Aligned</h3>
    - <ul> containing Lesson.StandardsAligned as <li>.
    Hard rule — Standards Aligned must always render:
    If Lesson.StandardsAligned contains at least one non-empty item, you MUST render the “📏 Standards Aligned” block exactly once for that lesson. Do not omit it for any reason.
    Placement: render it immediately after “🎯 Student Learning Objectives”; if “💡 Assess Prior Knowledge” is rendered, then render “📏 Standards Aligned” immediately after the Assess Prior Knowledge block.

ASSESS PRIOR KNOWLEDGE
    - This subsection appears ONLY if the "AssessPriorKnowledge" property exists in the JSON and is a non-empty string.
    - Place it immediately after that lesson’s <h3>🎯 Student Learning Objectives</h3> block.

    Rendering:
        - <h3>💡 Assess Prior Knowledge</h3>
        - Render the following paragraph: <p><strong>Teacher note: </strong>Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. This process activates existing neural pathways, making it easier for the brain to attach new information to what is already known. This technique, called elaborative encoding, helps students move knowledge into long-term memory faster and more effectively, improving both understanding and retention. </p>
        - Overview:
            - Render any opening teacher-script paragraph(s) that introduce the activity as one or more <p> blocks before any lists.
        - Instructions:
            - Render teacher instructions as a bulleted list (<ul>) where each instruction becomes one plain-text <li> (do NOT include HTML inside <li>).
            - Do NOT nest lists inside any <li>; all lists must be top-level and contain only <li>.
        - Template/Structure:
            - Render the Template/Structure text as a single paragraph <p> containing the teacher script (e.g., Say: ... Do: ...), preserving exact wording and punctuation.
            - Immediately after that <p>, if expected student responses are provided, render:
            <p>✅ Expected Student Responses</p>
            followed by an <ul> where each response is one plain-text <li>.
            - Do NOT place these response lists inside any other <li> or list.
        - Closing lines:
            - Any closing teacher sentence provided as a separate paragraph should be rendered as its own <p> after the lists.
        - Constraints:
            - Preserve exact source wording; do not invent or summarize content.
            - Use only allowed tags; lists may contain only <li> as direct children; no nested lists inside <li>.
            - Ensure readable indentation and that all <li> elements are plain text only.
        - Alternate Options:
            - Place this AFTER the closing </ol> of the main ordered list.
            - First output: <p><strong>Alternate Options</strong></p>
            - Then render an independent top-level ordered list <ol> where each option is one plain-text <li>.

Do not invent content; only restructure what exists inside Lesson.AssessPriorKnowledge.

DIRECT PRESENTATION
    - Render the Direct Presentation section (if present for that lesson) as:

    - <h3><span style="color: rgb(115, 191, 39);">Direct Presentation (10 min)</span></h3>
    - Materials (if any):
    - <p><strong>📚 Materials</strong></p>
    - <ul> with <li> items from DirectPresentation.Materials.
    - Instructions for Teachers:
    - <p><strong>📋 Instructions for Teachers</strong></p>
    - Render teacher-facing script as a sequence of <p> blocks. Each teacher cue or sentence that begins with labels like "Say:", "Do:", "Ask:", "Write:", "Draw/Show:", "Listen for:" should be its own numbered <p> when it is explanatory or stage-setting (for example: Say: "…", Do: Show …).
    - When short student-cue lists follow a teacher prompt (e.g., "Listen for:" examples), render those as a separate top-level <ul> immediately after the related <p>. Each <li> in that <ul> must be plain text (for example: <li>Listen for: - "I would see tiny balls." - "I would see lots of different shapes."</li>).
    - If you instead choose to render the sequence of MAIN steps as a list, use a top-level <ul> where each MAIN step is one <li>. Each such <li> MUST contain only plain text (no HTML tags inside the <li>). Preserve teacher cues as plain text inside those <li>.
    - Do NOT nest <ul>, <ol>, <p>, <span>, or any other HTML inside a <li>. To represent sub-points, prompts, questions, model responses, or ordered substeps, FLATTEN them as additional consecutive top-level <li> entries immediately after the parent step, using a clear prefix tying them to the parent step. Examples of required prefixes:
        - "Related to previous step: …"
        - "From step 2: …"
        - "Step 3.a — …"
    - Expected student responses that would normally be nested MUST be flattened into individual top-level <li> elements. Each such <li> must begin with the plain-text label:
        ✅ Expected Student Response — Response text
           - Keep one response per <li>.

        7) Strict formatting and safety:
           - Use only allowed tags (<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>).
           - Lists may contain only <li> as direct children. No nested lists inside a <li>.
           - Preserve exact teacher wording from the JSON; do not invent or summarize.
           - Ensure readable indentation.

        APPLY THESE MAPPING RULES:
      (One response per <li>; do not combine responses in one <li>.)
    - For Quick Checks that would be embedded in the sequence, use the global ✔Quick Check and ✅Expected Student Responses pattern.
    - After the final step or final <p>/<ul> block, CLOSE the <ul> tag if you opened one for MAIN steps and continue with the next labeled block or section as required.
    - Anticipated Misconceptions (if any):
    - <p><strong>⚠️ Anticipated Misconceptions</strong></p>
    - Render misconceptions as one or more <p> or as <ul><li>…</li></ul>. Do not place additional nested lists inside <li>—keep lists only as top-level <ul> where each <li> is plain text.
    - Transcendent Thinking (if any):
    - <p><strong>🌍 Transcendent Thinking</strong></p>
    - Use <p> for explanatory text, and <ul><li>…</li></ul> for examples. Keep each <li> plain text.
    - If examples/models are provided, use the global pattern for responses:
    - <p>✅ Expected Student Responses</p> followed by the appropriate list placed outside of any <li> (either as a top-level <ul> or as flattened <li> entries in the main <ol>), so no HTML nesting occurs inside list items.
    - Quick Check (if any):
    - Use the global ✔Quick Check header followed by the task and the ✅Expected Student Responses pattern.

GUIDED PRACTICE
    - Render Guided Practice (if present) as:

    - <h3><span style="color: rgb(115, 191, 39);">Guided Practice</span></h3>
    - Materials (if any):
    - <p><strong>📚 Materials</strong></p>
    - <ul> with <li> items from GuidedPractice.Materials.</ul>

    - Instructions for Teachers:
    - <p><strong>📋 Instructions for Teachers</strong></p>
    - Render teacher-facing script as a sequence of <p> blocks.
    - Each numbered step from the JSON (1., 2., 3...) should start its own <p>.
    - If a step includes sub-prompts (like the Step 6 circulation prompts):
        - Render each prompt as its own <p> block (e.g., "Prompt 1: '...'").
        - Render "✅ Expected Student Responses" as its own <p>.
        - Render the accompanying sample answers as a <ul> bullet list with each response in its own <li>.
    - For the Quick Check at the end:
        - Render <p><strong>Quick Check</strong> "{TaskText}"</p>
        - Render <p>✅ Expected Student Responses</p>
        - Render responses as a <ul><li> list.
    - Additional presentation rules (apply to the option above):
      - For Group/Partner Work, Roles, Rotations, and Setup lines: render each clear sentence as its own <p>, preserving role names and timing exactly as provided.
      - Do NOT invent or summarize content; only restructure what exists in the JSON.
      - Maintain the example patterns exactly when rendering model/expected responses and quick checks.

    -  Differentiation (if any):
    -  <p><strong>🪜 Differentiation</strong></p>
    -  Use <p> blocks for explanatory text.
    -  For labeled subsections such as “Language Learners”, “Additional Scaffolding”, “Go Deeper” (or similar):
        - Use <p><strong>Label</strong></p> for each label.
        - Under each label use a top-level <ul><li>…</li></ul> with plain-text <li> items (do not nest lists inside list items).

    -  Accommodations & Modifications (if any):
    -  <p><strong>🤝 Accommodations &amp; Modifications</strong></p>
    -  Start with a line for the general supports as its own paragraph, e.g. <p><strong>General support:</strong></p>
    -  Then render each general support item as a list item inside a top-level <ul>. Each <li> must be plain text.
    -  After the general supports, render the individual supports:
        - Use a paragraph label: <p><strong>Individual support:</strong></p>
        - For each student in the IndividualSupport array:
            - Render the student name as a <p> with red text: <p><span style="color: rgb(204, 0, 0);">Student Name</span></p>.
            - Then render a <ul> containing exactly two <li> elements:
                - <li>{PlanProvided}</li>
                - <li>{PlanImplementation}</li>
            - Repeat this pattern for each student.
    -  Use ONLY the student names and plans provided in the JSON (IndividualSupport list); do not invent or add extra students.

    Notes (summary of compatibility rules):
    - Never place HTML tags inside the <li> elements used for the main instructional ordered list; those <li> must be plain text only.
    - Represent any nested structure by flattening into additional top-level <li> entries with clear prefixes (as in Assess Prior Knowledge).
    - Use paragraph labels (<p><strong>…</strong></p>) and top-level lists (<ul>, <ol>) outside of those plain-text <li> elements for headings, materials, differentiation, and accommodations.

INDEPENDENT PRACTICE
    - Render Independent Practice (if present) as:

    <h3><span style="color: rgb(115, 191, 39);">Independent Practice</span></h3>
    - Materials (if any):
    - <p><strong>📚 Materials</strong></p>
    - <ul> with <li> items from IndependentPractice.Materials.</ul>
    - <p><strong>Purpose:</strong></p>
    - Use <p> for purpose text.

    - Instructions for Teachers:
    - Render each teacher task as a single paragraph heading in this exact pattern:
      <p><strong>Task N (DOK X):</strong> Teacher Notes: [teacher notes text]. Say: "…"</p>
      - Replace N with the task number in ascending order and X with the DOK level provided.
      - Include any teacher-script labels (Say:, Do:, Ask:, Write:, Draw/Show:, Listen for:) verbatim inside the paragraph.
      - If the task paragraph text is empty, omit that task entirely.
    - If Expected Student Responses exist for a task, render immediately after that task paragraph:
      <p>✅ Expected Student Responses</p>
      <ul><li>Response 1</li><li>Response 2</li></ul>
      - Use <ul> or <ol> based on whether responses are clearly ordered. Each response is one <li>. Do not nest lists inside <li>.
    - If Success Criteria exist for a task, render:
      <p>Success Criteria</p>
      <ul><li>Criterion 1</li><li>Criterion 2</li></ul>
      - Omit this block if the criteria array is empty.
    - If Reflection prompts exist for the task block, render:
      <p><strong>Reflection:</strong></p>
      - Then render each reflection sentence or prompt as its own <p>. Use separate <p> for self-regulation and transcendent prompts if provided.
    - Render tasks in ascending task order. Omit any subsection whose source string or array is empty.
    - Use only the allowed tags and ensure HTML remains well-indented and readable.
    - Do NOT flatten these task-level paragraph + list blocks into the Assess Prior Knowledge / Direct Presentation flat <ol> rule; this block is the alternative format for teacher tasks and must follow the example structure exactly.

REVIEW & SPACED RETRIEVAL (5 min)
    - <h3><span style="color: rgb(115, 191, 39);">Review & Spaced Retrieval (5 min)</span></h3>
    - Render the content from ReviewAndSpacedRetrieval string following these mapping rules:
        - Header 📚 Materials: Follow with a list of items.
        - Label Teacher Notes: Render as <p><strong>Teacher Notes:</strong> [notes text]</p>.
        - Header 📋 Instructions for Teachers: Render as <p><strong>📋 Instructions for Teachers</strong></p>.
        - Sub-header Active Recall: Bold. Follow withNumbered items and Say: script.
        - Use the global ✅ Expected Student Responses pattern for all sample answers.
        - Sub-header Correct Common Misconceptions: Bold. Render as <ul> with each "If student says... respond:..." as <li>.
        - Sub-header 💭Essential Question Connection: Bold.
        - Sub-header 🌍Transcendent Thinking: Bold.
        - Sub-header ⌛Spaced Retrieval: Bold.
        - Ensure each sub-header section follows the structure in the image (Numbered actions, Say: scripts, bullets).

FORMATIVE ASSESSMENT (Rendered as part of the Review chapter)
    - <p><strong>✅Formative Assessment</strong></p>
    - Render the intro paragraph (if present).
    - For each Prompt N (DOK X):
        - <p><strong>Prompt N (DOK X):</strong> {QuestionText}</p>
        - Render "✅ Expected Student Responses" as its own <p>. Use the global ✅ symbol.
        - Render the accompanying responses as a <ul> bullet list with each response in its own <li>.

Hard rules (UI-safe, no nesting):
    - Prompts:
       - For EACH prompt in ascending order, add ONE plain-text <li> containing ONLY:
    Prompt X (DOK Y) — "Question text"
    - Do NOT put any HTML tags inside this <li>.
    - Do NOT put <p> inside <li>.
    - Expected responses (interleaved, no sublists):
    -  Immediately AFTER the prompt <li>, if that SAME prompt has expected/model/student responses, render each response as its own plain-text <li> (still inside the SAME top-level <ul>), each beginning exactly with:
    ✅ Expected Student Response — Response text
        - One response per <li>.
        - Do NOT create any nested <ul> or <ol> anywhere in Formative Assessment.
        - Close </ul> after all prompt <li> items and their interleaved expected-response <li> items.

Reflection:
    -  After the closed </ul>, render reflection as paragraphs only:
    -  <p><strong>Reflection:</strong></p>
    -  <p>Self-regulation prompts: ...</p>
    -  <p>Transcendent prompts: ...</p>

STUDENT PRACTICE
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Student Practice</span></h3>
    - <p><strong>Teacher Notes:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>

    - For each task in StudentPractice.StudentPractice_Tasks (Numbered 1, 2, 3...):
        - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
        - <p><strong>Success Criteria</strong></p>
        - <ul> with each SuccessCriteria item as an <li>.
    - If StudentPractice.StudentPractice_InterleavingIfMath is not empty:
        - <p><strong>Interleaving (Math only)</strong></p>
        - Render the interleaving content as one or more <p> blocks.


FINAL INSTRUCTIONS
    - Output ONLY HTML using the allowed tags listed in GLOBAL RULES.
    - Do NOT use any other HTML tags.
    - Make sure the structure and ordering mirror the JSON schema and the patterns described above.
    - Do NOT include the lesson title (do not use <h2>); begin your output directly with the <h3>💭 Essential Questions</h3> section and continue from there.
`;

const UNIT_COMMON_HTML_PROMPT_TEMPLATE = `
You will receive ONE JSON object that strictly follows the UnitPlanResponse schema (already validated on my side). Your job is to transform this JSON into clean, readable HTML that a teacher can use directly in class.
                   
INPUT FORMAT
I will send you the JSON object like this:

UNIT PLAN JSON:
{{{JsonResponse}}}

Treat everything after the line “UNIT PLAN JSON:” as the exact JSON object. Do NOT explain or comment on it; just parse it and render it.

GLOBAL RULES
    -  Output ONLY valid HTML (no markdown, no backticks, no prose explanation).
    -  Allowed tags: <p>, <h1>, <h2>, <h3>, 
    -  (wrapped inside <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    -  Do NOT use any other tags (no <main>, <section>, <header>, <div>, <h4>, etc.).
    -  HTML should be well-indented and easy to read.
    -  In any <ol> or <ul>, ONLY use <li> elements as direct children. Never place <p>, <span>, <ul>, <ol>, or any other tag as a child of a list.
    -  Do NOT invent new instructional content; use only what exists in the JSON fields.
    -  Preserve the logical order implied by the schema:
        1. Unit-level info (title, description, essential questions, objectives, standards)
        2. Then Lessons in ascending LessonNumber
        3. Inside each lesson, follow the schema field order.
    -  If a string field is empty (""), OMIT that subsection and its label.
    -  If an array is empty, omit its heading and the corresponding <ul> or <ol>.
    -  Whenever the text clearly forms a list of prompts/questions/statements/responses, use <ul><li>…</li></ul> or <ol><li>…</li></ol>. Otherwise, use <p>.
    -  Whenever you render model/expected student responses in ANY section (whenever the schema or text clearly indicates “Expected Student Responses”, “Model responses”, “Sample answers”, or similar), use this pattern:
    -  First: <p>✅ Expected Student Responses</p>
    -  Then a list of responses:
    -  <ul><li>…</li></ul> for unordered responses.
    -  <ol><li>…</li></ol> when the text is clearly numbered or ordered (e.g., 1., 2., 3.).


- At the top of the page:
    -  <h1> with UnitTitle.
    -  One <p> for UnitDescription.

- Essential Questions (if any):
    -  <h2>💭 Essential Questions</h2>
    -  <ul> with each item from EssentialQuestions as <li>.

- Student Learning Objectives (if any):
    -  <h2>🎯 Student Learning Objectives</h2>
    -  <ul> with each item from StudentLearningObjectives as <li>.

- Standards (if any):
    -  <h2>📏 Standards Aligned</h2>
    -  <ul> with each string from StandardsAligned as <li>.
`;

const STEP0_SCHEMA = {
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
                }
            },
            "required": [
                "Description",
                "EssentialQuestions",
                "StudentLearningObjectives",
                "StandardsAligned"
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
}

const PER_LESSON_SCHEMA = {
    "title": "LessonPlanResponse",
    "type": "object",
    "properties": {
        "LessonDescription": {
            "type": "object",
            "properties": {
                "EssentialQuestions": {
                    "type": "array",
                    "description": "Just paste all the essential questions that are generated in unit level in same order.",
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
                },
                "StudentLearningObjectives": {
                    "type": "array",
                    "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses, e.g. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
                    "items": {
                        "type": "string"
                    }
                },
                "StandardsAligned": {
                    "type": "string",
                    "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'NGSS MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'"
                },
                "AssessPriorKnowledge": {
                    "type": "string",
                    "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
                },
                "DirectPresentation": {
                    "type": "object",
                    "description": "Full 'Direct Presentation' section as plain text. This is the FIRST in-class activity and should last NO LONGER THAN 10 minutes.",
                    "properties": {
                        "Materials": {
                            "type": "array",
                            "description": "List of required materials (e.g. visual aids, markers, etc.)",
                            "items": {
                                "type": "string"
                            }
                        },
                        "InstructionsForTeachers": {
                            "type": "string",
                            "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
                        },
                        "AnticipatedMisconceptions": {
                            "type": "string",
                            "description": "Common misconceptions and exact correction language for addressing each one"
                        },
                        "TranscendentThinking": {
                            "type": "string",
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding"
                        },
                        "QuickCheck": {
                            "type": "string",
                            "description": "A final check of understanding for a student learning objective already declared in the lesson. This MUST be an individual task for EVERY student to complete (not just a verbal question to the class), e.g., 'Take 2 minutes to sketch X in your notebook' or 'On a scratchpad, explain why Y...'. Include 2-3 specific expected student responses."
                        }
                    },
                    "required": [
                        "Materials",
                        "InstructionsForTeachers",
                        "AnticipatedMisconceptions",
                        "TranscendentThinking",
                        "QuickCheck"
                    ],
                    "additionalProperties": false
                },
                "GuidedPractice": {
                    "type": "object",
                    "description": "Structured Guided Practice section with separate fields for materials, instructions, differentiation, and optional accommodations.",
                    "properties": {
                        "Materials": {
                            "type": "array",
                            "description": "Required physical items needed for this guided practice activity (e.g., 'Styrofoam balls, string, markers') formatted as a list",
                            "items": {
                                "type": "string"
                            }
                        },
                        "InstructionsForTeachers": {
                            "type": "string",
                            "description": "400–600 words. Format as a strict numbered list of teacher actions (1, 2, 3...). Each step should combine teacher actions (Show:, On the board, write:, Demonstrate:) and teacher script (Say:). Step 6 MUST be 'As students work, circulate and use these prompts:' followed by 2-4 circulation prompts, each with its own 'Expected Student Responses' label and bulleted sample answers. End the section with a 'Quick Check' bold header, the individual task, and sample responses."
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
                                    "description": "Exactly the provided students. PlanProvided must match prompt exactly. Add concrete implementation in PlanImplementation.",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "StudentName": {
                                                "type": "string"
                                            },
                                            "PlanProvided": {
                                                "type": "string",
                                                "description": "MUST match the plan text from the prompt exactly."
                                            },
                                            "PlanImplementation": {
                                                "type": "string",
                                                "description": "Concrete tools/stems/visuals/organizers for this task (e.g., exact sentence frames, organizer layout, labels)."
                                            }
                                        },
                                        "required": [
                                            "StudentName",
                                            "PlanProvided",
                                            "PlanImplementation"
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
                        }
                    },
                    "required": [
                        "Materials",
                        "InstructionsForTeachers",
                        "Differentiation",
                        "AccommodationsAndModifications"
                    ],
                    "additionalProperties": false
                },
                "IndependentPractice": {
                    "type": "string",
                    "description": "Full 'Independent Practice' section as plain text. Structure must follow this format: Start with 'Materials' header and simple bulleted list of needed items. A 'Purpose' paragraph explaining how practice strengthens understanding and transfer. 3-4 sequentially numbered tasks labeled as 'Task 1 (DOK level):', 'Task 2 (DOK level):', etc. For each task: - Brief 'Teacher Notes:' explaining connection to lesson/goals. - Required 'Say:' statement with exact teacher prompt. - 'Expected Student Responses' with sample answers. - 'Success Criteria' listing 2-4 elements showing mastery. 'Reflection' section with: - 2 self-regulation prompts about managing learning. - 2 transcendent questions about broader impact/future. 'Early Finishers' extension task that: - Uses same core concepts at higher depth. - Lists specific elements students must address. - Requires applying accurate content principles. See solar system example for detailed format model."
                },
                "ReviewAndSpacedRetrieval": {
                    "type": "string",
                    "description": "Full 'Review & Spaced Retrieval' section as plain text. This 5-minute activity must include in this exact order: 1. Materials List (often none needed) 2. Teacher Notes paragraph that explains: - How this review strategy enhances retention - Connection to prior learning concepts - How transcendent reflection deepens understanding 3. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 4. Correct Common Misconceptions block with: - Sample misconception statements - Teacher response scripts addressing each 5. Essential Question Connection including: - Teacher prompt linking to unit question - Expected Student Responses (2-3 examples) 6. Transcendent Thinking section with: - Real-world application prompt - Think time instruction - Expected Student Responses (2-3 examples) 7. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers. Return as plain text."
                },
                "FormativeAssessment": {
                    "type": "string",
                    "description": "Full 'Formative Assessment' section as plain text. This MUST contain exactly 4 question prompts labeled 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', 'Prompt 3 (DOK 3):', and 'Prompt 4 (DOK 4):'. For each prompt: - Question that tests understanding at stated DOK level - Header '✅ Expected Student Responses' - 1-2 sample responses showing mastery. DO NOT include a 'Reflection' section. Example format: Prompt 1 (DOK 1): 'Why do planets stay in orbit?' ✅ Expected Student Responses - 'Gravity and forward motion.' [Continue for Prompts 2-4]"
                },
                "StudentPractice": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                        "StudentPractice_TeacherNotes",
                        "StudentPractice_Tasks",
                        "StudentPractice_InterleavingIfMath"
                    ],
                    "properties": {
                        "StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this lesson. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant lesson content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the lesson focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
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
                        "StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        }
                    }
                }
            },
            "required": [
                "EssentialQuestions",
                "KeyVocabulary",
                "StudentLearningObjectives",
                "StandardsAligned",
                "AssessPriorKnowledge",
                "DirectPresentation",
                "GuidedPractice",
                "IndependentPractice",
                "ReviewAndSpacedRetrieval",
                "FormativeAssessment",
                "StudentPractice"
            ],
            "additionalProperties": false
        }
    },
    "required": [
        "LessonDescription"
    ],
    "additionalProperties": false,
}
