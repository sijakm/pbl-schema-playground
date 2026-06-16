window.lecturePromptsEN = {
  STEP0_PROMPT_TEMPLATE: `
Create the unit outline and lesson structure using the info below. Do NOT write full lesson plans.
                    
Based on Unit Subject, educational standards, Unit Description/Instruction, Grade Level, Duration of class period (minutes), and the requested Number of Lessons, generate a JSON response that includes a cohesive UnitDescription and a non-overlapping list of lesson "containers".

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


STUDENTS WITH INDIVIDUALIZED SUPPORT (MUST be used ONLY inside ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; use the student names/plans exactly as written):
{{$LearningPlans}}

IMPORTANT CONTENT RULES:
- Keep the lesson aligned to the unit focus: developing and using models to describe atomic composition of simple molecules and/or extended structures.
- Include brief, high-level connections to other relevant DCIs where appropriate, but keep the lesson centered on modeling and structure–property reasoning (no deep math, no balancing equations unless explicitly required by standards).
- Ensure all parts of the lesson reflect the Lesson Scope/Boundaries provided in the unit context; avoid introducing new major concepts that belong to other lessons.
- EssentialQuestions: MUST exactly equal the unit-level essential questions (same text, same order).
- AssessPriorKnowledge: ONLY if LessonNumber == 1, populate the object as defined in the schema. For ALL OTHER LESSONS, you MUST return an empty object {} with NO keys inside. DO NOT use placeholders like "N/A", "none", or empty arrays.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications must include general supports followed by individual support for each student provided in {{$LearningPlans}}.
- When suggesting "sentence frames" or "sentence starters" anywhere in the lesson plan (especially in Individualized Supports), you MUST provide the actual, specific sentence stems tailored to the lesson content so the teacher can use them directly.
- StudentPractice MUST include a TeacherNotes paragraph starting with 'These tasks reinforce today's learning about ____ by ______.', a list of 2-3 tasks with DOK 2-4 and success criteria, and interleaving if the subject is math.

OUTPUT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema exactly.
- Output MUST be a SINGLE lesson plan only.
- No HTML. No emojis. No markdown. Plain text inside string fields.
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
            "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
            "x-cache": true,
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
            "type": "array",
            "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            }
          },
          "StandardsAligned": {
            "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
            "type": "array",
            "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
            "type": "array",
            "description": "Full 'Key Vocabulary' section as a list of strings. Each string should be a single term with definition separated by dash/hyphen. Example: 'Gravity - The force that pulls objects toward each other'. All definitions must be short, age-appropriate, and directly related to the lesson's content.",
            "items": {
              "x-format": "- {value}",
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
        "x-format": false,
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
        "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
        "type": "array",
        "description": "Just paste all the essential questions that are generated in unit level in same order.",
        "items": { 
          "x-format": "- {value}",
          "type": "string" 
        }
      },
      "KeyVocabulary": {
        "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
        "type": "array",
        "description": "List of vocabulary terms with definitions. (e.g. 'Solar System – The Sun and all...'). ONLY include terms that are actively used in this specific lesson.",
        "items": { 
          "x-format": "{index}. {value}",
          "type": "string" 
        }
      },
      "StudentLearningObjectives": {
        "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
        "type": "array",
        "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses.",
        "minItems": 2,
        "maxItems": 3,
        "items": { 
          "x-format": "- {value}\n",
          "type": "string" 
        }
      },
      "StandardsAligned": {
        "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
        "type": "array",
        "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
        "items": { 
          "x-format": "- {value}",
          "type": "string" 
        }
      },
      "AssessPriorKnowledge": {
        "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n**Say:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**Say:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**Say:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
        "type": "object",
        "description": "Full 'Assess Prior Knowledge' section. CRITICAL: Look at the 'lessonNumber' in the Attached Lesson Content. IF this is Lesson 1, populate this object fully. IF this is Lesson 2, 3, or any other lesson, YOU MUST RETURN AN EMPTY OBJECT {} with NO properties. Do not populate this for any lesson other than Lesson 1.",
        "properties": {
          "SayIntroduction": { "type": "string", "description": "What the teacher says to introduce the activity." },
          "StatementsToProject": { 
            "x-format": "{items}",
            "type": "array", 
            "items": { "x-format": "- {value}", "type": "string" }, 
            "description": "List of statements to project or read, containing both accurate ideas and common misconceptions." 
          },
          "SayInstructions": { "type": "string", "description": "What the teacher says to instruct students on what to do with the statements." },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": { "x-format": "- {value}", "type": "string" },
            "description": "Expected student responses/markings for each statement."
          },
          "SayConclusion": { "type": "string", "description": "What the teacher says to wrap up." },
          "ActionConclusion": { "type": "string", "description": "Teacher action to conclude (e.g., drawing a diagram)." },
          "AlternateOptions": {
            "x-format": "**{loc.AlternateOptions}**\n\n{items}",
            "type": "array",
            "items": { "x-format": "- {value}", "type": "string" },
            "description": "List of alternate options for the activity."
          }
        },
        "required": ["SayIntroduction", "StatementsToProject", "SayInstructions", "ExpectedStudentResponses", "SayConclusion", "ActionConclusion", "AlternateOptions"],
        "additionalProperties": false
      },
      "Objective": {
        "x-format": "### {green}({loc.Objective} {value.Duration})\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "Create an Objective section that clearly states the student learning goals for the lesson.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(2-3 min)')" },
          "Materials": { 
            "x-format": "{items}",
            "type": "array", 
            "items": { "x-format": "- {value}", "type": "string" } 
          },
          "InstructionsForTeachers": { 
            "x-format": "{items}",
            "type": "array", 
            "items": { "x-format": "- {value}", "type": "string" }, 
            "description": "Must include: 1) Explain learning goals using direct teacher-facing script (e.g., Say: '...') in clear, student-friendly language. 2) Ask students to record objectives in their notebooks. 3) Briefly tell the teacher how to connect objectives to students' real-life experiences." 
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ContentDeliveryAndInteractiveActivities": {
        "x-format": "### {green}({loc.ContentDeliveryAndInteractiveActivities} {value.Duration})\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "Block for content delivery.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(30 min)')" },
          "Materials": {
            "x-format": "**{loc.TeacherOnlyMaterials}:**\n{value.TeacherOnlyMaterials}\n\n**{loc.StudentMaterials}:**\n{value.StudentMaterials}",
            "type": "object",
            "properties": {
              "TeacherOnlyMaterials": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } },
              "StudentMaterials": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
            },
            "required": ["TeacherOnlyMaterials", "StudentMaterials"],
            "additionalProperties": false
          },
          "InstructionsForTeachers": {
            "x-format": "**{loc.Hook}:**\n{value.Hook}\n\n**{loc.Vocabulary}:**\n{value.Vocabulary}\n\n**{loc.ClarifyObjective}:**\n{value.ClarifyObjective}\n\n**{loc.NewConceptsAndKnowledge}:**\n{value.NewConceptsAndKnowledge}\n\n**⚡ {loc.AttentionReset} (1-3 {loc.Minutes}):**\n{value.AttentionReset}\n\n**{loc.ContinueInstructionAfterActivity}:**\n{value.ContinueInstruction}\n\n**⚠️ {loc.AnticipatedMisconceptions}:**\n{value.AnticipatedMisconceptions}\n\n{value.Connect}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
            "type": "object",
            "properties": {
              "Hook": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Write a dramatic, high-engagement hook delivered through teacher script. Should be surprising, curiosity-building, and tied to the main concept." },
              "Vocabulary": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "List essential vocabulary terms. Provide teacher script for defining each term formatted strictly as: '[Term] - Say: \"[Definition/Script]\"'. Example: 'Lever - Say: \"A lever is a simple machine...\"'." },
              "ClarifyObjective": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Clarify today's student learning objective for this specific lesson sharing script for teacher." },
              "NewConceptsAndKnowledge": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Write a detailed teacher lecture with scripts (Say: “…”). Include step-by-step what teacher says, does, and may demonstrate. Break down complex ideas, provide examples/analogies, make explicit connections to prior knowledge." },
              "AttentionReset": {
                "x-format": "{value.StandardParagraph}\n\n**{loc.Directions}:**\n{value.Directions}\n\n**{loc.WhyThisWorks}:**\n{value.WhyThisWorks}",
                "type": "object",
                "description": "Insert the standard attention-reset paragraph exactly as written: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
                "properties": {
                  "StandardParagraph": { "type": "string", "description": "Must be exactly: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'" },
                  "Directions": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Provide directions for the activity, including teacher script and what students & teacher need to do." },
                  "WhyThisWorks": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Explain in bullets why activity works for re-engagement, resetting cognitive focus, reinforcing concepts and purposeful preview. E.g. 'Standing + rotating resets attention.'" }
                },
                "required": ["StandardParagraph", "Directions", "WhyThisWorks"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Detailed teacher lecture with scripts (Say: “…”). Break down complex ideas, provide examples/analogies, to intrigue, foreshadow future learning, extend key ideas." },
              "AnticipatedMisconceptions": {
                "x-format": "{items}",
                "type": "array",
                "description": "List anticipated common student misconceptions to ensure teacher is ready.",
                "items": {
                  "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
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
                "x-format": "### {green}({loc.Connect} (3 min))\n\n**💭 {loc.EssentialQuestionConnection}:** {value.EssentialQuestionVerbatim}\n\n**Say:** \"{value.ConnectToEQ.Say}\"\n\n**{loc.Prompts}:**\n{value.ConnectToEQ.Prompts}\n\n✅ **{loc.ExpectedStudentResponses}**\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Relate to a purpose. Connect to one of the essential questions.",
                "properties": {
                  "EssentialQuestionVerbatim": { "type": "string", "description": "Use the provided essential question verbatim." },
                  "ConnectToEQ": {
                    "type": "object",
                    "properties": {
                      "Say": { "type": "string", "description": "Teacher script connecting the previous activity to the Essential Question." },
                      "Prompts": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Specific prompts/questions for students." }
                    },
                    "required": ["Say", "Prompts"],
                    "additionalProperties": false
                  },
                  "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" }, "description": "Deep expected student responses that use reasoning or evidence." }
                },
                "required": ["EssentialQuestionVerbatim", "ConnectToEQ", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "x-format": "### 🪜 {loc.Differentiation}\n\n**{loc.LanguageLearners}**\n{value.LanguageLearners}\n\n**{loc.StudentsInNeedOfAdditionalScaffolding}**\n{value.StudentsInNeedOfAdditionalScaffolding}\n\n**{loc.GoDeeper}**\n{value.GoDeeper.Challenges}\n\n✅ **{loc.ExpectedStudentResponses}**\n{value.GoDeeper.ExpectedStudentResponses}",
                "type": "object",
                "description": "Differentiate instruction (how to teach, not simplify materials). Vary complexity and depth, promote active engagement/language. Realistic for classroom.",
                "properties": {
                  "LanguageLearners": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } },
                  "StudentsInNeedOfAdditionalScaffolding": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Challenges": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } },
                      "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
                    },
                    "required": ["Challenges", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "StudentsInNeedOfAdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
                "type": "object",
                "description": "This section must include two types of supports: General Supports and Individualized Supports. Focus on access, not lowering rigor.",
                "properties": {
                  "General": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions). Provide 2-4 bullet points."
                  },
                  "IndividualSupport": {
                    "x-format": "{items}",
                    "type": "array",
                    "description": "Specific accommodations and modifications for named students with formal plans. List EACH student individually; do NOT group students together. The supports for each student should be an easy-to-scan list.",
                    "items": {
                      "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string",
                          "description": "First and last name of the individual student receiving these supports."
                        },
                        "PlanProvided": {
                          "type": "array",
                          "items": {
                            "x-format": "- {value}",
                            "type": "string"
                          },
                          "description": "The formal plan provided for this student in the prompt. Parse the plan into a clear list. You may paraphrase it to improve formatting, but do NOT omit or add any information."
                        },
                        "PlanImplementation": {
                          "type": "array",
                          "items": {
                            "x-format": "- {value}",
                            "type": "string"
                          },
                          "description": "Concrete tools/stems/visuals/organizers for this task."
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
        "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "Full 'Review & Spaced Retrieval' section.",
        "properties": {
          "InstructionsForTeachers": {
            "x-format": "**{loc.ActiveRecall}**\n\n**Say:** \"{value.ActiveRecall.Question}\"\n\n✅ {loc.ExpectedStudentResponses}\n{value.ActiveRecall.ExpectedStudentResponses}\n\n**💭 {loc.EssentialQuestionConnection}**\n\n**Say:** \"{value.EssentialQuestionConnection.Question}\"\n\n✅ {loc.ExpectedStudentResponses}\n{value.EssentialQuestionConnection.ExpectedStudentResponses}\n\n**⏳ {loc.SpacedRetrieval}**\n\n**Say:** \"{value.SpacedRetrieval.TeacherSay}\"\n\n✅ {loc.ExpectedStudentResponses}\n{value.SpacedRetrieval.ExpectedStudentResponses}",
            "type": "object",
            "description": "Step-by-step teacher guidance for the 5-minute review and spaced retrieval session.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Prompt students to retrieve key learning from today's lesson using only evidence from the lecture/activities.",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Help students connect today's specific concept to the broader unit essential questions.",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Revisit a concept from a previous unit or lesson to strengthen cumulative retention.",
                "properties": {
                  "TeacherSay": { "type": "string" },
                  "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
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
        "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. {value.InstructionsForTeachers.Step1_Invite}\n\n2. Ask:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n\n3. {value.InstructionsForTeachers.Step3_Capture}\n\n4. {value.InstructionsForTeachers.Step4_Answer}\n\n**Note for Teacher:**\n- Answer questions that connect directly to today's objective\n- \"Park\" deeper or future-focused questions by circling or starring them\n- Revisit parked questions in upcoming lessons to show continuity of learning",
        "type": "object",
        "description": "Block for Q&A and Discussion.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(5 min)')" },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Teacher guidance for the Q&A and Discussion session.",
            "properties": {
              "Step1_Invite": { "type": "string" },
              "Step2_AskQuestions": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } },
              "Step3_Capture": { "type": "string" },
              "Step4_Answer": { "type": "string" }
            },
            "required": ["Step1_Invite", "Step2_AskQuestions", "Step3_Capture", "Step4_Answer"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "x-format": "### {green}({loc.Conclusion} {value.Duration})\n\n{value.BuildCuriosity}",
        "type": "object",
        "description": "Block for Conclusion.",
        "properties": {
          "Duration": { "type": "string", "description": "Time estimate (e.g. '(1 min)')" },
          "BuildCuriosity": { "type": "string" }
        },
        "required": ["Duration", "BuildCuriosity"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
        "type": "array",
        "description": "Extract and generate EXACTLY 4 Formative Assessment prompts covering DOK 1-4. For each prompt, include the PromptLabel, Question, and ExpectedStudentResponses.",
        "items": {
          "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
          "type": "object",
          "properties": {
            "PromptLabel": { "type": "string", "description": "e.g., 'Prompt 1 (DOK 1)'" },
            "Question": { "type": "string", "description": "The exact question text." },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": { "x-format": "- {value}", "type": "string" },
              "description": "1-2 sample responses showing mastery."
            }
          },
          "required": [ "PromptLabel", "Question", "ExpectedStudentResponses" ],
          "additionalProperties": false
        },
        "minItems": 4,
        "maxItems": 4
      },
      "StudentPractice": {
        "x-format": "### 🖋️ {green}({loc.StudentPractice})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.Tasks}\n\n**{value.Reflection.Instruction}**\n\n{value.Reflection.Prompts}",
        "type": "object",
        "description": "Full 'Student Practice' section for homework / out-of-class practice.",
        "properties": {
          "TeacherNotes": { "type": "string" },
          "Tasks": {
            "x-format": "{items}",
            "type": "array",
            "description": "Generate 3 tasks covering DOK levels 2 and 3.",
            "items": {
              "x-format": "\n\n**{index}.** {value.TaskTitle} {value.Instruction}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}",
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string" },
                "Instruction": { "type": "string" },
                "ExpectedStudentResponses": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
              },
              "required": ["TaskTitle", "Instruction", "ExpectedStudentResponses"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "properties": {
              "Instruction": { "type": "string" },
              "Prompts": { "x-format": "{items}", "type": "array", "items": { "x-format": "- {value}", "type": "string" } }
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
      "FormativeAssessment": [
        "FormativeAssessment"
      ]
    }
  }
};
