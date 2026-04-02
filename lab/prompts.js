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
Create ONE LAB lesson plan (NOT a unit plan, NOT multiple lessons) using the info below.
You MUST output valid JSON that matches the provided JSON schema exactly (LabUnitPlanResponse). Do not include any extra keys. Use compact JSON formatting (no extra blank lines).
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

LESSON JSON:
{{{JsonResponse}}}

Also, you have these variables available:
Lesson Number: {{$LessonNumber}}
Lesson Title: {{$LessonTitle}}

GLOBAL RULES
    - Output ONLY valid HTML.
    - Allowed tags: <p>, <h1>, <h2>, <h3>, <h4>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>.
    - Do NOT invent content. Render exactly what is in the JSON.
    - Format expected student responses as: <p>✅<strong>Expected Student Responses</strong></p> followed by a <ul>.
    - Format 'Say' prompts and Teacher Notes distinctly using <strong> or <em> where appropriate.
    - Preserve line breaks from text by using <br> or multiple <p> tags.

MAPPING RULES:

- <h3>💭 Essential Questions</h3> (if available, UL list from EssentialQuestions)
- <h3>🔤 Key Vocabulary</h3> (if available, UL or text from KeyVocabulary)
- <h3>🎯 Student Learning Objectives</h3> (UL list from StudentLearningObjectives)
- <h3>📏 Standards Aligned</h3> (UL list or paragraphs from StandardsAligned)
- <h3>💡 Assess Prior Knowledge</h3> (If string is not empty. Render text structurally: use Teacher Note:, Say:, Options:, and ✅ Expected Student Responses labels if present based on text contents)

LAB SECTIONS (Render exactly in this order if they exist in the JSON):

- <h3>Question (5 min)</h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Expected Student Responses</strong></p> <ul>{ExpectedStudentResponses}</ul>
  - <p><strong>Final Investigation Question:</strong> {FinalInvestigationQuestion}</p>

- <h3>Research (5 min)</h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <h4>❗️ Anticipated Misconceptions</h4> (Iterate AnticipatedMisconceptions: <p><strong>Misconception:</strong> {Misconception}</p> <p><strong>Teacher Response:</strong> {TeacherResponse}</p>)

- <h3>Hypothesize (5 min)</h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Expected Student Responses</strong></p> <ul>{ExpectedStudentResponses}</ul>

- <h3>Experiment (20 min)</h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>
  - <h4>🪜 Differentiation</h4> <p>{Differentiation}</p>
  - <h4>🤝 Accommodations & Modifications</h4> <p>{AccommodationsAndModifications}</p>
  - <h4>✅ Quick Check</h4> <p>{QuickCheck}</p>

- <h3>Analyze (5 min)</h3>
  - <p><strong>Purpose:</strong> {Purpose}</p>
  - <h4>📚 Materials</h4> <ul>{Materials}</ul>
  - <h4>📋 Instructions for Teachers</h4> <p>{InstructionsForTeachers}</p>

- <h3>Share (5 min)</h3>
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
    - <p><strong>Description:</strong> {{{UnitDescription.Description}}}</p>

- Essential Questions:
    - <h2>💭 Essential Questions</h2>
    - <ul> with each item from UnitDescription.EssentialQuestions as <li>.

- Student Learning Objectives:
    - <h2>🎯 Student Learning Objectives</h2>
    - <ul> with each item from UnitDescription.StudentLearningObjectives as <li>.

- Standards:
    - <h2>📏 Standards Aligned</h2>
    - <ul> with each string from UnitDescription.StandardsAligned as <li>.`,
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
  },
  PER_LESSON_SCHEMA: {
    "title": "LabUnitPlanResponse",
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
        "minItems": 2,
        "maxItems": 3,
        "items": {
          "type": "string"
        }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'"
      },
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
      },
      "Question": {
        "type": "object",
        "description": "Guide teacher so students will observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for Word - Purpose: Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation."
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Step-by-step teacher instructions, actions, and 'Say:' prompts to present a phenomenon and invite questions."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 expected student questions or ideas about the phenomenon."
              },
              "FinalInvestigationQuestion": {
                "type": "string",
                "description": "The closing teacher prompt that synthesizes the students' ideas into one big question to investigate today."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses", "FinalInvestigationQuestion"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Research": {
        "type": "object",
        "description": "Guide teacher so students learn background information, vocabulary, and prior knowledge needed to understand the topic.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Step-by-step teacher instructions, actions, and 'Say:' prompts to explain background knowledge, vocabulary, and model the phenomenon."
              },
              "AnticipatedMisconceptions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string", "description": "Student misconception" },
                    "TeacherResponse": { "type": "string", "description": "What the teacher should say to correct it" }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              }
            },
            "required": ["Instructions", "AnticipatedMisconceptions"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Hypothesize": {
        "type": "object",
        "description": "Guide teacher so students develop a testable prediction.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for Word: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Teacher instructions, including 'Say:' prompts for hypothesis sentence frames."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 expected hypothesis examples."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Experiment": {
        "type": "object",
        "description": "Guide teacher so students carry out a structured investigation.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Step-by-step teacher instructions to organize the experiment, give directions, and circulate."
              },
              "Differentiation": {
                "type": "object",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "AdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": { "type": "array", "items": { "type": "string" } },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "For Go Deeper responses." }
                },
                "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper", "ExpectedStudentResponses"],
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
              },
              "QuickCheck": {
                "type": "object",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["Instructions", "Differentiation", "AccommodationsAndModifications", "QuickCheck"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Analyze": {
        "type": "object",
        "description": "Guide teachers so students interpret the data they collected.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Purpose: Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions."
          },
          "Materials": {
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": {
              "type": "string",
              "description": ""
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Teacher instructions and sentence starters for analysis."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Expected answers or sentence frame completions from students."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Share": {
        "type": "object",
        "description": "Guide teachers so students communicate their findings clearly.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Teacher instructions for organizing student sharing."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Expected ideas shared by students."
              },
              "TranscendentThinking": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Prompt", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses", "TranscendentThinking"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "string",
        "description": "Full 'Review & Spaced Retrieval' section as plain text. This 5-minute activity must include in this exact order: 1. Materials List (often none needed) 2. Teacher Notes paragraph that explains: - How this review strategy enhances retention - Connection to prior learning concepts - How transcendent reflection deepens understanding 3. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 4. Correct Common Misconceptions block with: - Sample misconception statements - Teacher response scripts addressing each 5. Essential Question Connection including: - Teacher prompt linking to unit question - Expected Student Responses (2-3 examples) 6. Transcendent Thinking section with: - Real-world application prompt - Think time instruction - Expected Student Responses (2-3 examples) 7. Spaced Retrieval component containing:  Clear reference to specific prior lesson. Example (Draws from Unit 3, Lesson 2.  Must use active recall question connecting past + current concepts. Must not require students using notes or resources to answer. - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers. Return as plain text."
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
      "EssentialQuestions",
      "KeyVocabulary",
      "StudentLearningObjectives",
      "StandardsAligned",
      "AssessPriorKnowledge",
      "Question",
      "Research",
      "Hypothesize",
      "Experiment",
      "Analyze",
      "Share",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice"
    ],
    "additionalProperties": false
  }
};
