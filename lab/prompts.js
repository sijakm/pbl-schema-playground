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
Create ONE LAB lesson plan using the info below. 
You MUST output valid JSON that matches the provided JSON schema exactly.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration: {{$ClassDuration}}
Location: {{$Location}}
Zip Code: {{$ZipCode}}
Standards: {{$Standards}}

Attached Lesson Context: {{$ParentUnitData}}
Resources/Media: {{$MediaContext}}

Ensure you fill out all sections: KeyVocabulary, StudentLearningObjectives, AssessPriorKnowledge, Question, Research, Hypothesize, Experiment, Analyze, Share, ReviewAndSpacedRetrieval, FormativeAssessment, StudentPractice.
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
    - Allowed tags: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>.
    - Do NOT invent content.
    - Render model/expected student responses as: <p>✅ Expected Student Responses</p> followed by <ul><li>.

MAPPING RULES:
- Top level: <h2>Lesson {{$LessonNumber}}: {{$LessonTitle}}</h2>

- Essential Questions: <h3>💭 Essential Questions</h3> (UL list from EssentialQuestions)
- Key Vocabulary: <h3>🔤 Key Vocabulary</h3> (OL list from KeyVocabulary, Term - Definition)
- Student Learning Objectives: <h3>🎯 Student Learning Objectives</h3> (UL list from StudentLearningObjectives)
- Standards Aligned: <h3>📏 Standards Aligned</h3> (Show as text or list from StandardsAligned)
- Assess Prior Knowledge: <h3>💡 Assess Prior Knowledge</h3> (Render if string is not empty)

LAB SECTIONS (Render each if it exists):
- Question Phase: <h3>🔍 Question</h3>
  - Purpose, Materials (UL), Instructions (P), Expected Responses (pattern), Final Question (P with strong label).
- Research Phase: <h3>📚 Research</h3>
  - Purpose, Materials (UL), Instructions (P), Misconceptions (pattern).
- Hypothesize Phase: <h3>🧪 Hypothesize</h3>
  - Purpose, Materials (UL), Instructions (P), Expected Responses (pattern).
- Experiment Phase: <h3>🔬 Experiment</h3>
  - Purpose, Materials (UL), Instructions (P), Differentiation (P), Accommodations (P), Quick Check (pattern).
- Analyze Phase: <h3>📊 Analyze</h3>
  - Purpose, Materials (UL), Instructions (P).
- Share Phase: <h3>🗣️ Share</h3>
  - Purpose, Materials (UL), Instructions (P), Transcendent Thinking (pattern).

CLOSING SECTIONS:
- Review & Spaced Retrieval: <h3>🔄 Review & Spaced Retrieval</h3>
- Formative Assessment: <h3>✅ Formative Assessment</h3>
- Student Practice: <h3>�� Student Practice</h3>`,
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
  DEFAULT_PROMPT: `
Create a complete LAB unit plan and lab-based lessons using ONLY the information provided below. Your response MUST be valid JSON that strictly matches the provided response schema (no extra keys, no text outside JSON).

MVP planning requirements (must be reflected in the unit):
• Zip code localization: If a zip code is provided, include examples, stakeholders, audiences, and place-based resources that plausibly fit the community and surrounding area. Do not invent exact addresses/phone numbers; refer to realistic local institution types and roles.
• Project Duration: The project lasts {{$ProjectDuration}} days, so the plan and lesson progression must be written across multiple days (not a single class period).

Use these unit inputs exactly:
Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction (teacher request): {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period (minutes): {{$ClassDuration}}
Project Duration (days): {{$ProjectDuration}}
Location: {{$Location}}
Zip code: {{$ZipCode}}
Resources/Media to use: {{$MediaContext}}
Standards: {{$Standards}}

Students with plans:
{{$LearningPlans}}

Output rule: Return ONLY JSON that validates against the response schema.
Follow the exact section order and headings shown below. 
Do not add extra sections or rename headings. 
Use clear teacher-facing prose and student-facing directions where specified. 
Include specific examples, scripts, and expected answers (not placeholders like “e.g.”).  
Before introducing any new concept or content, include an Attention Reset activity designed to re-engage students, increase cognitive focus, and prepare working memory for new learning. 
Language to use: Attention Reset & Interactive Activity: This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (same language here for every attention reset & Interactivity) 
Include interleaving: When providing practice problems, mix strategies, content, skills rather than blocking to help students learn to know when to a apply a skill.  
Ensure transfer knowledge is embedded throughout so students can apply knowledge in various ways and under different circumstances using real-world application of skills and promoting critical thinking and problem solving. 
Cultural Relevance & Inclusion: 
Incorporate multiple perspectives and reflect on the impacts for all involved.  
Content should connect with students from varied backgrounds and communities to create culturally relevant and culturally responsive lessons 
Avoid stereotypes. 
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
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "string",
            "description": "Must direct the teacher to present a phenomenon, prompt students to observe closely, ask what they notice, and invite them to share questions about what might be happening. The model must require the teacher to record all student questions publicly without judging or correcting them. The instructions must conclude with the teacher guiding the class toward identifying one central question that will anchor the investigation."
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "Expected Student Responses [3-4 bullet points showing mastery]",
            "items": {
              "type": "string"
            }
          },
          "FinalInvestigationQuestion": {
            "type": "string",
            "description": "The model must output one clear investigation question selected by the teacher that the class will explore. The question must be written as a single open-ended inquiry aligned to the phenomenon introduced in the Question Phase. It must reflect what students are genuinely wondering and set up an investigation rather than explain the answer."
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "ExpectedStudentResponses",
          "FinalInvestigationQuestion"
        ],
        "additionalProperties": false
      },
      "Research": {
        "type": "object",
        "description": "Guide teacher so students learn background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
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
            "description": "Provide a universal, step-by-step teacher script in which the teacher directs students to record key ideas and vocabulary, demonstrates or presents a phenomenon using physical or visual tools, prompts students to observe closely, asks what they notice and wonder, and explains that the information gathered will support the upcoming investigation without revealing final conclusions. The end must contain 2 to 4 concise statements that summarize essential background knowledge students gain in this phase, establishing foundational concepts needed for later investigation while avoiding giving away the final explanation."
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "description": "",
            "items": {
              "type": "object",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "properties": {
                "Misconception": {
                  "type": "string",
                  "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                },
                "TeacherResponse": {
                  "type": "string",
                  "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                }
              },
              "required": [
                "Misconception",
                "TeacherResponse"
              ],
              "additionalProperties": false
            }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "AnticipatedMisconceptions"
        ],
        "additionalProperties": false
      },
      "Hypothesize": {
        "type": "object",
        "description": "Guide teacher so students develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for Word: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
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
            "description": "Provide a universal teacher script in which the teacher explains that scientists make evidence-based predictions, provides model examples, offers clear sentence starters for students to use, prompts students to write an individual hypothesis, and invites a small number of students to share aloud while recording several examples publicly. Must output 2 to 4 sentence starters that guide students in forming testable 'If..., then...' predictions without revealing any final scientific explanation."
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "Expected Student Responses [3-4 bullet points showing mastery]",
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
      "Experiment": {
        "type": "object",
        "description": "Guide teacher so students carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
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
            "description": "must direct the teacher to place students in small groups, introduce a physical or representational model related to the phenomenon, and have students manipulate or adjust the model to observe changes. Students must be required to record specific observations, note patterns, and document how the model behaves under different conditions. The model must also include a teacher prompt that asks groups to modify a variable or condition in the model and compare the results to their initial observations. The InstructionsForTeachers must end with circulation prompts that support sensemaking without giving answers, such as What do you notice as the model changes, How does this representation help you understand the phenomenon, and What changes when you adjust the model in different ways."
          },
          "Differentiation": {
            "type": "string",
            "description": "Three-part differentiation strategies including: (1) Language Learners support (2-3 strategies), (2) Additional Scaffolding support (2-3 strategies), (3) Go Deeper extensions (1-2 activities with expected responses)"
          },
          "AccommodationsAndModifications": {
            "type": "string",
            "description": "Accommodations General - General classroom supports and modifications that apply to most or all students during this activity. Accommodations Individual Support - List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt. Accommodations Individual Support Student Name - Full name of the student exactly as provided in the prompt. Accommodations Individual Support Plan Implementation - Short description of the individualized accommodation or modification for this student."
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
          "Differentiation",
          "AccommodationsAndModifications",
          "QuickCheck"
        ],
        "additionalProperties": false
      },
      "Analyze": {
        "type": "object",
        "description": "Guide teachers so students interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions.",
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
            "type": "string",
            "description": "Direct the teacher to help students move from simple observations to clear, evidence-based explanations. Must begin with the teacher telling students that scientists do more than observe; they explain why patterns occur using complete sentences supported by evidence from their model, data, or investigation. The teacher must provide an example of turning an observation into an explanation by pairing what was seen with why it happened. The model must instruct the teacher to display two labeled components on the board: Observation and Explanation- and demonstrate how an explanation connects the observed pattern to an underlying cause, mechanism, or principle. Must also include a list of generic sentence starters such as 'Our model showed that when...happened,' 'This occurred because ...,' 'The pattern changed when we adjusted...,' and 'This explains...because...' Students must be prompted to share one observation and one explanation with a partner before writing their own full sentences. The teacher must circulate and prompt deeper reasoning without giving answers, ensuring explanations include both what happened and why it happened."
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "Share": {
        "type": "object",
        "description": "Guide teachers so students communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Word for word: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
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
            "description": "Must begin with the teacher stating that experts share their work with others and that each group will present its question, hypothesis or prediction, method or model, data or evidence, and final conclusion. The model must instruct the teacher to display a simple presentation structure with the following section headers exactly as written: Our Question, Our Hypothesis, Our Model and Data, Our Conclusion, and Why This Matters. Must guide the teacher to remind students that sharing findings involves summarizing key ideas, using evidence to support claims, and explaining the significance of their results. The teacher must prompt groups to speak clearly, reference their recorded evidence, and connect their conclusion to the broader purpose of the investigation. The model must instruct the teacher to circulate, support equitable group participation, and encourage students to ask respectful questions after each presentation."
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
