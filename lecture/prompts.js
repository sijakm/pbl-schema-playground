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
- AssessPriorKnowledge: ONLY if LessonNumber == 1, write 150–250 words and follow the required structure in the schema description. If LessonNumber != 1, return "" (empty string).
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
        - Use this exact header: <p><strong>✔Quick Check</strong></p>
        - Render the question or task immediately following the header as a paragraph that tasks EVERY student to show their understanding (not just one student in a verbal check).
        - Use the global ✅Expected Student Responses pattern for the answers.
    - Use emojis if they exist in following mapping rules.

MAPPING RULES:

- <h3>💭 Essential Questions</h3> (if available, UL list from EssentialQuestions)
- <h3>🎯 Student Learning Objectives</h3> (UL list from StudentLearningObjectives)
- <h3>📏 Standards Aligned</h3> (UL list or paragraphs from StandardsAligned)

ASSESS PRIOR KNOWLEDGE:
- Start with this exact heading:
<h3>💡 Assess Prior Knowledge</h3>
- Immediately after the heading, ALWAYS render this Purpose text exactly as written:
<p><strong>Purpose:</strong> Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. When students recall what they already believe or remember about materials, particles, or chemical changes, they activate existing neural pathways. This “elaborative encoding” makes it easier for the brain to connect new chemistry concepts to what is already known, strengthening long-term retention. This activity helps you uncover accurate ideas, partial ideas, and misconceptions that will become powerful anchors for learning throughout the project.</p>
- Render a teacher-facing "Say:" section.
- Even if the input text does NOT explicitly contain "Say:"
- Synthesize or rephrase existing content into 1-2 clear teacher talk paragraphs
- Begin with:
<p><strong>Say:</strong></p>
- Follow with one or more <p> elements
- Any student tasks, prompts, statements, or instructions:
- Render as <ol> or <ul>
- Each item MUST be a single <li>
- NO <p> or other tags inside <li>
- When expected or model student responses appear:
- Render this EXACT label:
<p>✅ Expected Student Responses</p>
- Then render all expected responses as a <ul> with <li> only
- NO nested lists
- NO <p> inside <li>
- If alternate options or variations appear:
- Render:
<p><strong>Alternate Options:</strong></p>
- Then a <ul> with brief <li> items

DO NOT:
- Use any tags not listed
- Nest lists
- Skip the Purpose section
- Invent new instructional content, but use all provided ideas


- <h3><span style="color: rgb(115, 191, 39);">Question</span> (5 min)</h3>
Purpose needs to be word for word as in the JSON
  - <p><strong>Purpose:</strong> {Purpose}</p>
  then render (with emojis if available in html tags)
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Expected Student Responses</strong></p> <ul>{ExpectedStudentResponses}</ul>
  - <p><strong>Final Investigation Question:</strong> {FinalInvestigationQuestion}</p>

  // i need Research (5 min) in green color
- <h3><span style="color: rgb(115, 191, 39);">Research (5 min)</span></h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <h4>❗️ Anticipated Misconceptions</h4> (Iterate AnticipatedMisconceptions: <p><strong>Misconception:</strong> {Misconception}</p> <p><strong>Teacher Response:</strong> {TeacherResponse}</p>)

- <h3><span style="color: rgb(115, 191, 39);">Hypothesize (5 min)</span></h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Expected Student Responses</strong></p> <ul>{ExpectedStudentResponses}</ul>

- <h3><span style="color: rgb(115, 191, 39);">Experiment (20 min)</span></h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <h4>🪜 Differentiation</h4> <p>{Differentiation}</p>
  - <h4>🤝 Accommodations & Modifications</h4> <p>{AccommodationsAndModifications}</p>
  - <h4>✅ Quick Check</h4> <p>{QuickCheck}</p>

- <h3><span style="color: rgb(115, 191, 39);">Analyze (5 min)</span></h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>

- <h3><span style="color: rgb(115, 191, 39);">Share (5 min)</span></h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <h4>🌍 Transcendent Thinking</h4> <p>{TranscendentThinking}</p>

CLOSING SECTIONS:
- <h3>⏳ Review & Spaced Retrieval (5 min)</h3>
  - (Format text from ReviewAndSpacedRetrieval ensuring headings like Teacher Notes, Active Recall, Misconceptions, Transcendent Thinking are bolded and easily readable)
- <h3>✅ Formative Assessment</h3>
  - (Format text from FormativeAssessment, separating the prompts and expected responses clearly)
- <h3>🖊 Student Practice</h3>
  - (Format text from StudentPractice ensuring tasks and expected responses are structured cleanly)`,
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
        "description": "List of vocabulary terms with definitions. (e.g. 'Solar System – The Sun and all...').",
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
        "description": "Full 'Standards Aligned' section as plain text for this lesson."
      },
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field."
      },
      "Objective": {
        "type": "object",
        "description": "Block for introducing objectives.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(2-3 min)')" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Teacher instructions, actions, and 'Say:' prompts to communicate the goals and why they matter." }
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
              "Hook": { "type": "array", "items": { "type": "string" }, "description": "Hook statements including 'Say:'" },
              "Vocabulary": { "type": "array", "items": { "type": "string" }, "description": "Teacher script for defining terms" },
              "ClarifyObjective": { "type": "array", "items": { "type": "string" } },
              "NewConceptsAndKnowledge": { "type": "array", "items": { "type": "string" }, "description": "Teacher lecture with scripts" },
              "AttentionReset": {
                "type": "object",
                "properties": {
                  "WhyThisWorks": { "type": "array", "items": { "type": "string" } },
                  "Directions": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["WhyThisWorks", "Directions"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "type": "array", "items": { "type": "string" } },
              "AnticipatedMisconceptions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string" },
                    "TeacherResponse": { "type": "string" }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "Connect": { "type": "array", "items": { "type": "string" } },
              "EssentialQuestion": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Prompt", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Prompt", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "QuickCheck": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Prompt", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "AdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Tasks": { "type": "array", "items": { "type": "string" } },
                      "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["Tasks", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" } },
                  "IndividualSupports": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["GeneralSupports", "IndividualSupports"],
                "additionalProperties": false
              }
            },
            "required": [
              "Hook", "Vocabulary", "ClarifyObjective", "NewConceptsAndKnowledge", "AttentionReset",
              "ContinueInstruction", "AnticipatedMisconceptions", "Connect", "EssentialQuestion",
              "SpacedRetrieval", "QuickCheck", "Differentiation", "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "QAndAAndDiscussion": {
        "type": "object",
        "description": "Block for Q&A.",
        "properties": {
          "Duration": { "type": "string" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Teacher questions and directions." }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "type": "object",
        "description": "Block for Conclusion.",
        "properties": {
          "Duration": { "type": "string" },
          "TranscendentThinking": {
            "type": "object",
            "properties": {
              "Prompt": { "type": "array", "items": { "type": "string" } },
              "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } },
              "BuildCuriosity": { "type": "string" }
            },
            "required": ["Prompt", "ExpectedStudentResponses", "BuildCuriosity"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "TranscendentThinking"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Full 'Formative Assessment' section as plain text."
      },
      "StudentPractice": {
        "type": "string",
        "description": "Full 'Student Practice' section as plain text. This is homework / out-of-class practice."
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
      "QAndAAndDiscussion",
      "Conclusion",
      "FormativeAssessment",
      "StudentPractice"
    ],
    "additionalProperties": false
  }
};
