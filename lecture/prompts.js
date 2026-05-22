window.labPrompts = {
  STEP0_PROMPT_TEMPLATE: `
Create the unit outline and lesson structure using the info below. Do NOT write full lesson plans.
                    
Based on Unit Subject, educational standards, Unit Description/Instruction, Grade Level, Duration of class period (minutes), and the requested Number of Lessons, generate a JSON response that includes a cohesive UnitDescription and a non-overlapping list of lesson “containers”.

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
- GENERATE the "Lessons" list containing exactly {{$NumberOfItems}} lessons.
  - Each lesson must include "lessonNumber" (1-based index), "lessonName", and "lessonDescription" (2–4 sentences describing lesson scope).

Constraints:
- Keep the unit and every lesson aligned to the unit focus.
- Ensure logical sequencing from foundational ideas to more complex modeling.
- Accuracy: All content must be scientifically accurate and age-appropriate.

Output MUST be valid JSON matching the schema. Use compact formatting (no extra blank lines).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Create ONE LECTURE lesson plan (NOT a unit plan, NOT multiple lessons) using the info below.
You MUST output valid JSON that matches the provided JSON schema exactly. Do not include any extra keys. Use compact JSON formatting (no extra blank lines).
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

If Unit Essential Questions above is empty, generate exactly 3 conceptual questions following these rules:
- Each question MUST be a complete, grammatically correct sentence that ends with a question mark.
- Each question MUST begin with either "How" or "Why".
- Questions MUST be conceptual and exploratory, not factual, procedural, or definitional.
- Questions MUST focus on broad, universal ideas (such as change, evidence, patterns, relationships, systems, or reasoning), not on subject-specific content.
- Questions MUST be transferable across disciplines and applicable beyond this unit.


STUDENTS WITH INDIVIDUALIZED SUPPORT (MUST be used ONLY inside Experiment.AccommodationsAndModifications; use the student names/plans exactly as written):
{{$LearningPlans}}

IMPORTANT CONTENT RULES:
- Keep the lesson aligned to the unit focus: developing and using models to describe atomic composition of simple molecules and/or extended structures.
- Include brief, high-level connections to other relevant DCIs where appropriate, but keep the lesson centered on modeling and structure–property reasoning (no deep math, no balancing equations unless explicitly required by standards).
- Ensure all parts of the lesson reflect the Lesson Scope/Boundaries provided in the unit context; avoid introducing new major concepts that belong to other lessons.
- EssentialQuestions: MUST exactly equal the unit-level essential questions (same text, same order).
- AssessPriorKnowledge: ONLY if LessonNumber == 1, populate the object as defined in the schema. For ALL OTHER LESSONS, you MUST return an empty object {} with NO keys inside. DO NOT use placeholders like "N/A", "none", or empty arrays.
- Lab Phases (Question, Research, Hypothesize, Experiment, Analyze, Share): Follow the specific instructional requirements and "Purpose:" strings for each phase as defined in the JSON schema.
- Experiment.AccommodationsAndModifications must include general supports followed by individual support for each student provided in {{$LearningPlans}}.
- StudentPractice MUST include a TeacherNotes paragraph starting with 'These tasks reinforce today’s learning about ____ by ______.', a list of 2-3 tasks with DOK 2-4 and success criteria, and interleaving if the subject is math.

OUTPUT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema exactly.
- Output MUST be a SINGLE lesson plan only.
- No HTML. No emojis. No markdown. Plain text inside string fields.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `You will receive ONE JSON object that strictly follows the LabUnitPlanResponse schema. Your job is to transform this JSON into clean, readable HTML for a single lesson.

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
        - Use this exact header: <h3><span>✔ Quick Check</span></h3>
        - Include the strategy alignment and then the prompt (question/task) in quotes.
        - Use the global ✅Expected Student Responses pattern for the answers.
    - Use emojis if they exist in following mapping rules.

MAPPING RULES:

FIRST, always generate these 4 introductory sections if the data is available in the JSON:
- <h3>💭 Essential Questions</h3> (if available, UL list from EssentialQuestions)
- <h3>🔤 Key Vocabulary</h3> (UL list from KeyVocabulary)
- <h3>🎯 Student Learning Objectives</h3> (UL list from StudentLearningObjectives)
- <h3>📏 Standards Aligned</h3> (UL list from StandardsAligned. Even though the input is a single string, parse the standards and render them as a bulleted list <ul><li>...</li></ul>)

THEN, proceed to SECTION 0:

SECTION 0: ASSESS PRIOR KNOWLEDGE (CONDITIONAL)
==================================================
CONDITION: Render this section ONLY if the current lesson is Lesson 1. For all other lessons, skip this entire section (render NOTHING, not even headings).

CRITICAL CHECK: Before rendering ANY HTML for this section, look at the AssessPriorKnowledge object.
- If AssessPriorKnowledge is {} (empty object), OR if SayIntroduction is "", null, " ", or "N/A", SKIP THIS SECTION AND PROCEED TO THE NEXT ONE. Do NOT stop the overall generation.
- For all other lessons (Lesson 2, 3, etc.), you MUST skip this entire section regardless of content.

IF (and only if) current lesson is Lesson 1 AND AssessPriorKnowledge contains real content:
<h3>💡 Assess Prior Knowledge</h3>
<p><strong>Teacher Note:</strong> Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. This process activates existing neural pathways, making it easier for the brain to attach new information to what is already known. This technique, called elaborative encoding, helps students move knowledge into long-term memory faster and more effectively, improving both understanding and retention.</p>
  - <p><strong>Say:</strong> “{SayIntroduction}”</p>
  - <p>Project or read the following statements one at a time:</p>
  - <ul>{StatementsToProject}</ul> (each item as <li>“Statement”</li>)
  - <p><strong>Say:</strong> “{SayInstructions}”</p>
  - <p><strong>✅ Expected Student Responses</strong></p>
  - <ul>{ExpectedStudentResponses}</ul> (each item as <li>“Statement” → Response</li>)
  - <p><strong>Say:</strong> “{SayConclusion}”</p>
  - <p>{ActionConclusion}</p>
  - <p><strong>Alternate Options</strong></p>
  - <ul>{AlternateOptions}</ul> (each item as <li><strong>OptionName:</strong> Description</li>)
- If the current lesson is NOT Lesson 1, skip this entire section (render NOTHING for AssessPriorKnowledge).



- <h3><span style="color: rgb(115, 191, 39);">Objective {Duration}</span></h3>
  - <p><strong>Purpose:</strong> Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.</p>
  - <p><strong>📚 Materials</strong></p> <ul>{Materials}</ul> (each item as <li>)
  - <p><strong>📋 Instructions for Teachers</strong></p> <ol>{InstructionsForTeachers}</ol> (each item as <li>)

- <h3><span style="color: rgb(115, 191, 39);">Content Delivery & Interactive Activities {Duration}</span></h3>
  - <p><strong>📚 Materials</strong></p>
    - <p><strong>Teacher Only Materials:</strong></p> <ul>{TeacherOnlyMaterials}</ul> (each item as <li>)
    - <p><strong>Student Materials:</strong></p> <ul>{StudentMaterials}</ul> (each item as <li>)
  - <p><strong>📋 Instructions for Teachers</strong></p>
    - <p><strong>Hook</strong></p> <ul>{Hook}</ul> (each item as <li>)
    - <p><strong>Vocabulary</strong></p> <ul>{Vocabulary}</ul> (each item as <li>)
    - <p><strong>Clarify Objective</strong></p> <ul>{ClarifyObjective}</ul> (each item as <li>)
    - <p><strong>New Concepts & Knowledge</strong></p> <ul>{NewConceptsAndKnowledge}</ul> (each item as <li>)
    - <p><strong>⚡ Attention Reset & Interactive Activity (1-3 minutes)</strong></p>
      - <p>{StandardParagraph}</p>
      - <p><strong>Directions:</strong></p> <ul>{Directions}</ul> (each item as <li>)
      - <p><strong>Why this works:</strong></p> <ul>{WhyThisWorks}</ul> (each item as <li>)
    - <p><strong>Continue Instruction After Activity</strong></p> <ul>{ContinueInstruction}</ul> (each item as <li>)
- <p><strong>⚠️ Anticipated Misconceptions</strong></p>
      - Iterate over AnticipatedMisconceptions:
        <p>{Misconception} (Ensure NO bolding/strong tags are used here)</p>
        <ul><li>{TeacherResponse} (Ensure NO bolding/strong tags are used here)</li></ul>
- <h3><span style="color: rgb(115, 191, 39);">Connect (3 min)</span></h3>
  - <p>{RelateToPurpose}</p> (Render as a list of paragraphs or a UL/OL if it's multiple items, but keep it flat)
  - <p><strong>💭 Essential Question:</strong> {EssentialQuestionVerbatim}</p>
  - <p><strong>Say:</strong> “{ConnectToEQ.Say}”</p>
  - <p><strong>Prompts:</strong></p>
  - <ul>{ConnectToEQ.Prompts}</ul> (each item as <li>)
  - <p>✅ Expected Student Responses</p>
  - <ul>{ExpectedStudentResponses}</ul> (each item as <li>)

- <h3><span>🪜 Differentiation</span></h3>
  - <p><strong>Language Learners</strong></p> <ul>{LanguageLearners}</ul> (each item as <li>)
  - <p><strong>Students in Need of Additional Scaffolding</strong></p> <ul>{StudentsInNeedOfAdditionalScaffolding}</ul> (each item as <li>)
  - <p><strong>Go Deeper</strong></p>
    - <ul>{GoDeeper.Challenges}</ul> (each item as <li>)
    - <p>✅ Expected Student Responses</p>
    - <ul>{GoDeeper.ExpectedStudentResponses}</ul> (each item as <li>)

- <h3><span>🤝 Accommodations & Modifications</span></h3>
  - <p><strong>General Supports:</strong></p> <ul>{GeneralSupports}</ul> (each item as <li>)
  - <p><strong>Individualized Supports:</strong></p> {IndividualizedSupports} (for each student, format their name as <p><strong><span style="color: rgb(240, 56, 40);">Name:</span></strong></p>. Split their specific supports into distinct bullet points and place each in its own <li> within a <ul>)

- <h3><span style="color: rgb(115, 191, 39);">🧠 Review & Spaced Retrieval (5 min)</span></h3>
  - <p><strong>Teacher Notes:</strong> [Generate a brief teacher note paragraph explaining how this active recall review strategy strengthens retention by asking students to retrieve key ideas from the lesson after a short delay. Connect it to the specific learning from today's lesson, and include a brief transcendent reflection that helps students see the broader real-world application/meaning of these concepts.]</p>
  - <h3><span>🔁 Active Recall</span></h3>
  - <p><strong>Say:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question}”</p> (Ensure every teacher prompt starts with exactly one Say. If the JSON already contains "Say:", remove it before wrapping.)
  - <p>✅ Expected Student Responses</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses}</ul> (each item as <li>)
  - <h3><span>💭 Essential Question Connection</span></h3>
  - <p><strong>Say:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question}”</p> (Ensure every teacher prompt starts with exactly one Say. If the JSON already contains "Say:", remove it before wrapping.)
  - <p>✅ Expected Student Responses</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses}</ul> (each item as <li>)
  - <h3><span>⌛ Spaced Retrieval</span></h3>
  - <p>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay}</p> (Ensure every teacher prompt starts with exactly one Say. If the JSON already contains "Say:", remove it before wrapping. Move any "(Draws from...)" metadata in the text to be clearly styled at the start of the prompt)
  - <p>✅ Expected Student Responses</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses}</ul> (each item as <li>)

- <h3><span style="color: rgb(115, 191, 39);">Q & A and Discussion {Duration}</span></h3>
  - <p><strong>📋 Instructions for Teachers</strong></p>
    - <p>1. {QAndAAndDiscussion.InstructionsForTeachers.Step1_Invite}</p> (Ensure every teacher prompt starts with exactly one Say. If the JSON already contains "Say:", remove it before wrapping.)
    - <p>2. Ask:</p>
    - <ul>{QAndAAndDiscussion.InstructionsForTeachers.Step2_AskQuestions}</ul> (each item as <li>)
    - <p>3. {QAndAAndDiscussion.InstructionsForTeachers.Step3_Capture}</p> (Ensure all teacher prompts like 'Say:' or 'Record:' within the text are styled cleanly.)
    - <p>4. {QAndAAndDiscussion.InstructionsForTeachers.Step4_Answer}</p> (Ensure all teacher prompts like 'Say:' or 'Address:' within the text are styled cleanly.)
  - <p>Note for Teacher:</p>
  - <ul>
      <li>Answer questions that connect directly to today’s objective</li>
      <li>“Park” deeper or future-focused questions by circling or starring them</li>
      <li>Revisit parked questions in upcoming lessons to show continuity of learning</li>
    </ul>

- <h3><span style="color: rgb(115, 191, 39);">Conclusion {Duration}</span></h3>
  - <p>{Conclusion.BuildCuriosity}</p> (Ensure every teacher prompt starts with exactly one Say. If the JSON already contains "Say:", remove it before wrapping.)

- <h3><span style="color: rgb(115, 191, 39);">✅Formative Assessment (5 min)</span></h3>
  - From the FormativeAssessment plain text, extract and render Prompts 1–4 in this exact structure (do not invent prompts; extract from text; clean formatting):
    - <p><strong>Prompt 1 (DOK 1):</strong></p>
    - <p>{Prompt 1 question}</p>
    - <p>✅ Expected Student Responses</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Prompt 2 (DOK 2):</strong></p>
    - <p>{Prompt 2 question}</p>
    - <p>✅ Expected Student Responses</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Prompt 3 (DOK 3):</strong></p>
    - <p>{Prompt 3 question}</p>
    - <p>✅ Expected Student Responses</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Prompt 4 (DOK 4):</strong></p>
    - <p>{Prompt 4 question}</p>
    - <p>✅ Expected Student Responses</p> <ul><li>{1–2 expected responses}</li></ul>

- <h3><span style="color: rgb(115, 191, 39);">🖋️ Student Practice</span></h3>
  - <p><strong>Teacher Notes:</strong> {StudentPractice.TeacherNotes}</p>
  - For each task in StudentPractice.Tasks:
    - <p>{task.TaskTitle} {task.Instruction}</p>
    - <p>✅ Expected Student Responses</p>
    - <ul>{task.ExpectedStudentResponses}</ul> (each item as <li>)
  - <p><strong>{StudentPractice.Reflection.Instruction}</strong></p>
  - <ul>{StudentPractice.Reflection.Prompts}</ul> (each item as <li>)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `You will receive ONE JSON object that strictly follows the UnitPlanResponse schema (already validated on my side). Your job is to transform this JSON into clean, readable HTML that a teacher can use directly in class.
                   
INPUT FORMAT
I will send you the JSON object like this:

UNIT PLAN JSON:
{{{JsonResponse}}}

Treat everything after the line “UNIT PLAN JSON:” as the exact JSON object. Do NOT explain or comment on it; just parse it and render it.

GLOBAL RULES
    -  Output ONLY valid HTML (no markdown, no backticks, no prose explanation).
    -  Allowed tags: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    -  Do NOT use any other tags (no <main>, <section>, <header>, <div>, <h4>, etc.).
    -  HTML should be well-indented and easy to read.
    -  In any <ol> or <ul>, ONLY use <li> elements as direct children. Never place <p>, <span>, <ul>, <ol>, or any other tag as a child of a list.
    -  Do NOT invent new instructional content; use only what exists in the JSON fields.
    -  Preserve the logical order implied by the schema.

- At the top:
    - <h1>Unit Plan Overview</h1>
    - <p>{{{UnitDescription.Description}}}</p>
- Then add a new line with:
    <h1>Unit Overview</h1>

- Essential Questions:
    - <h2>💭 Essential Questions</h2>
    - <ul> with each item from UnitDescription.EssentialQuestions as <li>.

- Student Learning Objectives:
    - <h2>🎯 Student Learning Objectives</h2>
    - <ul> with each item from UnitDescription.StudentLearningObjectives as <li>.

- Standards:
    - <h2>📏 Standards Aligned</h2>
    - <ul> with each string from UnitDescription.StandardsAligned as <li>.

- Key Vocabulary:
    - <h2>🔤 Key Vocabulary</h2>
    - <ul> with each string from UnitDescription.KeyVocabulary as <li>.`,

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
    "title": "LectureUnitPlanResponse",
    "type": "object",
    "properties": {
      "EssentialQuestions": {
        "type": "array",
        "description": "Just paste all the essential questions that are generated in unit level in same order.",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "List of vocabulary terms with definitions. (e.g. 'Solar System – The Sun and all...'). ONLY include terms that are actively used in this specific lesson.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses.",
        "minItems": 2,
        "maxItems": 3,
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'"
      },
      "AssessPriorKnowledge": {
        "type": "object",
        "description": "Full 'Assess Prior Knowledge' section. CRITICAL: Look at the 'lessonNumber' in the Attached Lesson Content. IF this is Lesson 1, populate this object fully. IF this is Lesson 2, 3, or any other lesson, YOU MUST RETURN AN EMPTY OBJECT {} with NO properties. Do not populate this for any lesson other than Lesson 1. For Lesson 1, structure must include:",
        "properties": {
          "SayIntroduction": { "type": "string", "description": "What the teacher says to introduce the activity." },
          "StatementsToProject": { "type": "array", "items": { "type": "string" }, "description": "List of statements to project or read, containing both accurate ideas and common misconceptions." },
          "SayInstructions": { "type": "string", "description": "What the teacher says to instruct students on what to do with the statements." },
          "ExpectedStudentResponses": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Expected student responses/markings for each statement."
          },
          "SayConclusion": { "type": "string", "description": "What the teacher says to wrap up." },
          "ActionConclusion": { "type": "string", "description": "Teacher action to conclude (e.g., drawing a diagram)." },
          "AlternateOptions": {
            "type": "array",
            "items": { "type": "string" },
            "description": "List of alternate options for the activity."
          }
        },
        "required": ["SayIntroduction", "StatementsToProject", "SayInstructions", "ExpectedStudentResponses", "SayConclusion", "ActionConclusion", "AlternateOptions"],
        "additionalProperties": false
      },
      "Objective": {
        "type": "object",
        "description": "Create an Objective section that clearly states the student learning goals for the lesson.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(2-3 min)')" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Must include: 1) Explain learning goals using direct teacher-facing script (e.g., Say: '...') in clear, student-friendly language. 2) Ask students to record objectives in their notebooks. 3) Briefly tell the teacher how to connect objectives to students' real-life experiences." }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ContentDeliveryAndInteractiveActivities": {
        "type": "object",
        "description": "Block for content delivery.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(30 min)')" },
          "Materials": {
            "type": "object",
            "properties": {
              "TeacherOnlyMaterials": { "type": "array", "items": { "type": "string" } },
              "StudentMaterials": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["TeacherOnlyMaterials", "StudentMaterials"],
            "additionalProperties": false
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Hook": { "type": "array", "items": { "type": "string" }, "description": "Write a dramatic, high-engagement hook delivered through teacher script. Should be surprising, curiosity-building, and tied to the main concept." },
              "Vocabulary": { "type": "array", "items": { "type": "string" }, "description": "List essential vocabulary terms. Provide teacher script for defining each term." },
              "ClarifyObjective": { "type": "array", "items": { "type": "string" }, "description": "Clarify today's student learning objective for this specific lesson sharing script for teacher." },
              "NewConceptsAndKnowledge": { "type": "array", "items": { "type": "string" }, "description": "Write a detailed teacher lecture with scripts (Say: “…”). Include step-by-step what teacher says, does, and may demonstrate. Break down complex ideas, provide examples/analogies, make explicit connections to prior knowledge." },
              "AttentionReset": {
                "type": "object",
                "description": "Insert the standard attention-reset paragraph exactly as written: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
                "properties": {
                  "StandardParagraph": { "type": "string", "description": "Must be exactly: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'" },
                  "Directions": { "type": "array", "items": { "type": "string" }, "description": "Provide directions for the activity, including teacher script and what students & teacher need to do." },
                  "WhyThisWorks": { "type": "array", "items": { "type": "string" }, "description": "Explain in bullets why activity works for re-engagement, resetting cognitive focus, reinforcing concepts and purposeful preview. E.g. 'Standing + rotating resets attention.'" }
                },
                "required": ["StandardParagraph", "Directions", "WhyThisWorks"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "type": "array", "items": { "type": "string" }, "description": "Detailed teacher lecture with scripts (Say: “…”). Break down complex ideas, provide examples/analogies, to intrigue, foreshadow future learning, extend key ideas." },
              "AnticipatedMisconceptions": {
                "type": "array",
                "description": "List anticipated common student misconceptions to ensure teacher is ready.",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string" },
                    "TeacherResponse": { "type": "string", "description": "How to effectively respond to potential student misunderstanding and guide to accurate understanding." }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "Connect": {
                "type": "object",
                "description": "Relate to a purpose. Connect to one of the essential questions.",
                "properties": {
                  "RelateToPurpose": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "1-2 steps to relate the lesson to a broader purpose or real-world data. IMPORTANT: There shouldn't be any 'teaching' of content or knowledge here. (e.g., '1. Show the daylight chart...', '2. Ask students to consider how this relates to...')."
                  },
                  "EssentialQuestionVerbatim": { "type": "string", "description": "Use the provided essential question verbatim." },
                  "ConnectToEQ": {
                    "type": "object",
                    "properties": {
                      "Say": { "type": "string", "description": "Teacher script connecting the previous activity to the Essential Question." },
                      "Prompts": { "type": "array", "items": { "type": "string" }, "description": "Specific prompts/questions for students." }
                    },
                    "required": ["Say", "Prompts"],
                    "additionalProperties": false
                  },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Deep expected student responses that use reasoning or evidence." }
                },
                "required": ["RelateToPurpose", "EssentialQuestionVerbatim", "ConnectToEQ", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "description": "Differentiate instruction (how to teach, not simplify materials). Vary complexity and depth, promote active engagement/language. Realistic for classroom.",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "StudentsInNeedOfAdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Challenges": { "type": "array", "items": { "type": "string" } },
                      "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["Challenges", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "StudentsInNeedOfAdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "List all students with learning plans in red font. Group students with shared supports. Focus on access.",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" }, "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions)." },
                  "IndividualizedSupports": { "type": "array", "items": { "type": "string" }, "description": "Specific accommodations and modifications for named students with formal plans. List names in RED font." }
                },
                "required": ["GeneralSupports", "IndividualizedSupports"],
                "additionalProperties": false
              }
            },
            "required": [
              "Hook", "Vocabulary", "ClarifyObjective", "NewConceptsAndKnowledge", "AttentionReset",
              "ContinueInstruction", "AnticipatedMisconceptions", "Connect",
              "Differentiation", "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Full 'Review & Spaced Retrieval' section. This 5-minute activity must include: 1. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 2. Essential Question Connection 3. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Step-by-step teacher guidance for the 5-minute review and spaced retrieval session.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Prompt students to retrieve key learning from today's lesson using only evidence from the lecture/activities.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A specific teacher script (starting with 'Say:') that prompts students to reflect on today's lesson and what it revealed."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 examples of high-quality student responses showing clear understanding.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Help students connect today's specific concept to the broader unit essential questions.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A teacher script (starting with 'Say:') that links today's findings to one of the unit's essential questions."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 examples of how students justify the connection.",
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
            "required": ["ActiveRecall", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["InstructionsForTeachers"],
        "additionalProperties": false
      },
      "QAndAAndDiscussion": {
        "type": "object",
        "description": "Block for Q&A and Discussion.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(5 min)')" },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Teacher guidance for the Q&A and Discussion session.",
            "properties": {
              "Step1_Invite": {
                "type": "string",
                "description": "Invite student questions, starting with 'Say:' (e.g. 'Say: “Now is your chance to think about what we learned and identify anything that still feels important to explore.”')"
              },
              "Step2_AskQuestions": {
                "type": "array",
                "description": "3–4 teacher questions that connect to today's lesson, avoiding the words 'confused' or 'don't understand' but still revealing uncertainty.",
                "items": { "type": "string" }
              },
              "Step3_Capture": {
                "type": "string",
                "description": "Directions to capture questions including 'Say:', 'Record:', and another 'Say:' statement (e.g., 'Say: “If you have a question, that means you are thinking deeply. Let’s capture those ideas.” Record: Write student questions on a chart titled “Questions We Still Have.” Say: “We will keep adding to this chart throughout the unit. Some questions we may answer today, and others we will investigate in future lessons.”')"
              },
              "Step4_Answer": {
                "type": "string",
                "description": "Directions to answer questions including 'Say:', 'Address:', and another 'Say:' statement (e.g., 'Say: “Let’s look at our questions. Which ones can we answer using what we learned today?” Address a few questions using student responses and evidence. Say: “Some of these questions will help guide what we learn next. Scientists don’t answer everything at once—they keep building understanding over time.”')"
              }
            },
            "required": ["Step1_Invite", "Step2_AskQuestions", "Step3_Capture", "Step4_Answer"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "type": "object",
        "description": "Block for Conclusion.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(1 min)')" },
          "BuildCuriosity": {
            "type": "string",
            "description": "A curiosity-building preview of the next lesson that creates suspense, starting with 'Say:'. Must be at least 3–4 sentences long (or longer if it makes sense to build deeper curiosity)."
          }
        },
        "required": ["Duration", "BuildCuriosity"],
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
          "TeacherNotes": {
            "type": "string",
            "description": "Must follow this template exactly, filling in the bracketed part: 'These homework tasks reinforce today's learning about [insert lesson concepts] by asking students to observe real-world patterns and explain them using the concepts introduced in class. By applying classroom ideas independently, students strengthen long-term retention and build the ability to transfer scientific thinking to everyday experiences.'"
          },
          "Tasks": {
            "type": "array",
            "description": "Generate 3 tasks covering DOK levels 2 and 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "e.g., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Clear step-by-step student directions for the task." },
                "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Expected student responses. DO NOT include checkmarks/emojis." }
              },
              "required": ["TaskTitle", "Instruction", "ExpectedStudentResponses"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "properties": {
              "Instruction": { "type": "string", "description": "e.g., '4. Reflection: Write 2-3 sentences responding to one prompt:'" },
              "Prompts": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["TeacherNotes", "Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "EssentialQuestions",
      "KeyVocabulary",
      "StudentLearningObjectives",
      "StandardsAligned",
      "AssessPriorKnowledge",
      "Objective",
      "ContentDeliveryAndInteractiveActivities",
      "ReviewAndSpacedRetrieval",
      "QAndAAndDiscussion",
      "Conclusion",
      "FormativeAssessment",
      "StudentPractice"
    ],
    "additionalProperties": false
  }
};
