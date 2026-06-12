window.promptsEN = {
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

If Unit Essential Questions above is empty, generate exactly 3 conceptual questions following these rules:
- Each question MUST be a complete, grammatically correct sentence that ends with a question mark.
- Each question MUST begin with either "How" or "Why".
- Questions MUST be conceptual and exploratory, not factual, procedural, or definitional.
- Questions MUST focus on broad, universal ideas (such as change, evidence, patterns, relationships, systems, or reasoning), not on subject-specific content.
- Questions MUST be transferable across disciplines and applicable beyond this unit.


STUDENTS WITH INDIVIDUALIZED SUPPORT (MUST be used ONLY inside GuidedPractice.AccommodationsAndModifications; use the student names/plans exactly as written):
{{$LearningPlans}}

IMPORTANT CONTENT RULES:
- Keep the lesson aligned to the unit focus: developing and using models to describe atomic composition of simple molecules and/or extended structures.
- Include brief, high-level connections to other relevant DCIs where appropriate, but keep the lesson centered on modeling and structure–property reasoning (no deep math, no balancing equations unless explicitly required by standards).
- Ensure all parts of the lesson reflect the Lesson Scope/Boundaries above; avoid introducing new major concepts that belong to other lessons.
- EssentialQuestions: MUST exactly equal the unit-level essential questions (same text, same order).
- AssessPriorKnowledge: ONLY if LessonNumber == 1, write 150–250 words and follow the required structure in the schema description. If LessonNumber != 1, return "" (empty string).
- DirectPresentation must be ≤10 minutes total and must follow the required HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT format with Say/Do/Ask/✅ Expected Student Responses/Write, and expected student responses as bullet points (DO NOT include the section headers/titles in the string).
- GuidedPractice.InstructionsForTeachers must be at least 700 words and must include the required components listed in the schema description.
- GuidedPractice.AccommodationsAndModifications must include:
  - General: general supports
  - IndividualSupport: array with exactly the provided students and their plans (same names/plans; no additional students).
- StudentPractice MUST include a TeacherNotes paragraph starting with 'These tasks reinforce today’s learning about ____ by ______.', a list of 2-3 tasks with DOK 2-4 and success criteria, and interleaving if the subject is math.

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
                        "type": "array",
                        "minItems": 3,
                        "maxItems": 3,
                        "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
                        "items": {
                            "type": "string",
                            "x-format": "- {value}"
                        },
                        "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
                        "x-cache": true
                    },
                    "StudentLearningObjectives": {
                        "type": "array",
                        "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
                        "items": {
                            "type": "string",
                            "x-format": "- {value}"
                        },
                        "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
                    },
                    "StandardsAligned": {
                        "type": "array",
                        "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
                        "items": {
                            "type": "string",
                            "x-format": "- {value}"
                        },
                        "x-format": "### 📏{loc.StandardsAligned}\n\n{items}"
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
                },
                "x-format": false
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
        "title": "LessonPlanResponse",
        "type": "object",
        "properties": {
            "LessonDescription": {
                "type": "object",
                "properties": {
                    "EssentialQuestions": {
                        "type": "array",
                        "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
                        "items": {
                            "type": "string"
                        },
                        "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
                    },
                    "KeyVocabulary": {
                        "type": "array",
                        "description": "Full 'Key Vocabulary' section as a list of strings. Each string should be a single term with definition separated by dash/hyphen. Example: 'Gravity - The force that pulls objects toward each other'. All definitions must be short, age-appropriate, and directly related to the lesson's content.",
                        "items": {
                            "type": "string",
                            "x-format": "{index}. {value}"
                        },
                        "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
                    },
                    "StudentLearningObjectives": {
                        "type": "array",
                        "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses, e.g. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
                        "items": {
                            "type": "string",
                            "x-format": "- {value}\n"
                        },
                        "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
                    },
                    "StandardsAligned": {
                        "type": "array",
                        "description": "Full 'Standards Aligned' section for this lesson as a list. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
                        "items": {
                            "type": "string",
                            "x-format": "- {value}"
                        },
                        "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
                    },
                    "AssessPriorKnowledge": {
                        "type": "object",
                        "description": "Assess Prior Knowledge section. ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN EMPTY ARRAYS for all fields. For Lesson 1, structure must include ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, and AlternateOptions. 1. Ensure DOK 1-3 prompts are used. 2. Include prerequisite skills. 3. Pick one modality and fully develop it. 4. Provide initial teacher prompts, instructions, expected responses, closing prompts, and 2 alternate options.",
                        "properties": {
                            "ActivityInstructions": {
                                "type": "array",
                                "description": "Sequential steps (e.g. 'Say: ...', 'Project or read...') to start the activity.",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "x-format": "{items}"
                            },
                            "ExpectedStudentResponses": {
                                "type": "array",
                                "description": "Anticipated answers or common misconceptions for the chosen modality.",
                                "items": {
                                    "type": "string",
                                    "x-format": "  - {value}"
                                },
                                "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                            },
                            "ClosingTeacherPrompt": {
                                "type": "array",
                                "description": "Closing teacher steps and prompts that validate student thinking and preview unit investigation.",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "x-format": "{items}"
                            },
                            "AlternateOptions": {
                                "type": "array",
                                "description": "2 brief alternate options a teacher could choose.",
                                "items": {
                                    "type": "string",
                                    "x-format": "{index}. {value}"
                                },
                                "x-format": "**{loc.AlternateOptions}**\n\n{items}"
                            }
                        },
                        "required": [
                            "ActivityInstructions",
                            "ExpectedStudentResponses",
                            "ClosingTeacherPrompt",
                            "AlternateOptions"
                        ],
                        "additionalProperties": false,
                        "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}"
                    },
                    "DirectPresentation": {
                        "type": "object",
                        "description": "Full 'Direct Presentation' section. This is the FIRST in-class activity and should last NO LONGER THAN 10 minutes.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "description": "List of required materials (e.g. visual aids, markers, etc.)",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "x-format": "**📚 {loc.Materials}**\n\n{items}"
                            },
                            "InstructionsForTeachers": {
                                "type": "array",
                                "description": "Teacher script organized into sequential steps following this EXACT sequence: (1) HOOK (1-2 min), (2) INTRODUCTION (1-2 min), (3) DIRECT TEACHING (4-5 min), and (4) GUIDED ENGAGEMENT (2-3 min). Do NOT include the headers in the strings. Each step must include teacher talk (Say:/Ask:), teacher actions (Do:/Write:/Draw/Show:), and if applicable, expected student responses.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "Instruction": {
                                            "type": "string",
                                            "description": "The specific teacher action, starting with 'Say: ', 'Do: ', etc."
                                        },
                                        "ExpectedStudentResponses": {
                                            "type": "array",
                                            "description": "Anticipated answers if the instruction was a question. Return an empty array if not applicable.",
                                            "items": {
                                                "type": "string",
                                                "x-format": "  - {value}"
                                            },
                                            "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                        }
                                    },
                                    "required": [
                                        "Instruction",
                                        "ExpectedStudentResponses"
                                    ],
                                    "additionalProperties": false,
                                    "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
                                },
                                "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
                            },
                            "AnticipatedMisconceptions": {
                                "type": "array",
                                "description": "List of common misconceptions and exact correction language for addressing each one.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "Misconception": {
                                            "type": "string",
                                            "description": "The misconception description."
                                        },
                                        "Correction": {
                                            "type": "string",
                                            "description": "The correction language starting with 'Say: '."
                                        }
                                    },
                                    "required": [
                                        "Misconception",
                                        "Correction"
                                    ],
                                    "additionalProperties": false,
                                    "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}"
                                },
                                "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}"
                            },
                            "TranscendentThinking": {
                                "type": "object",
                                "description": "Real-world application question connecting learning to purpose/meaning/big ideas.",
                                "properties": {
                                    "Question": {
                                        "type": "string"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "description": "Expected student responses showing deeper understanding.",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Question",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
                            },
                            "QuickCheck": {
                                "type": "object",
                                "description": "A final check of understanding for a student learning objective already declared in the lesson. This MUST be an individual task for EVERY student to complete.",
                                "properties": {
                                    "Question": {
                                        "type": "string",
                                        "description": "e.g., 'Take 2 minutes to sketch X in your notebook' or 'On a scratchpad, explain why Y...'"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "description": "2-3 specific expected student responses.",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Question",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
                            }
                        },
                        "required": [
                            "Materials",
                            "InstructionsForTeachers",
                            "AnticipatedMisconceptions",
                            "TranscendentThinking",
                            "QuickCheck"
                        ],
                        "additionalProperties": false,
                        "x-format": "### {green}({loc.DirectPresentation})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}"
                    },
                    "GuidedPractice": {
                        "type": "object",
                        "description": "Structured Guided Practice section with separate fields for materials, instructions, differentiation, and optional accommodations.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "description": "Required physical items needed for this guided practice activity (e.g., 'Styrofoam balls, string, markers') formatted as a list",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "x-format": "**📚 {loc.Materials}**\n\n{items}"
                            },
                            "InstructionsForTeachers": {
                                "type": "array",
                                "description": "Teacher script organized into sequential steps. Each step should combine teacher actions and script. End with prompts for circulation.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "Instruction": {
                                            "type": "string",
                                            "description": "The specific teacher action, starting with 'Say: ', 'Do: ', etc."
                                        },
                                        "ExpectedStudentResponses": {
                                            "type": "array",
                                            "description": "Anticipated answers if the instruction was a question. Return an empty array if not applicable.",
                                            "items": {
                                                "type": "string",
                                                "x-format": "  - {value}"
                                            },
                                            "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                        }
                                    },
                                    "required": [
                                        "Instruction",
                                        "ExpectedStudentResponses"
                                    ],
                                    "additionalProperties": false,
                                    "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
                                },
                                "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
                            },
                            "QuickCheck": {
                                "type": "object",
                                "description": "Final comprehension check question for the guided practice.",
                                "properties": {
                                    "Question": {
                                        "type": "string"
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "description": "2-3 expected student responses.",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Question",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
                            },
                            "Differentiation": {
                                "type": "object",
                                "description": "Labeled with three clearly labeled tiers: Language Learners, Students in Need of Additional Scaffolding, Go Deeper. Requirements: The content must differentiate instruction, not provide accommodations or modifications (those are addressed elsewhere). Strategies should focus on how to teach, not how to simplify materials. Activities should vary in complexity and depth, aligned to the same learning objectives. Each tier must promote active engagement, language development, and conceptual understanding. Use clear, teacher-facing language and make supports realistic for classroom use.",
                                "properties": {
                                    "LanguageLearners": {
                                        "type": "object",
                                        "properties": {
                                            "Strategies": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-format": "- {value}"
                                                },
                                                "description": "Provide 2-3 concrete teaching strategies for language learners. Examples: providing specific visuals (e.g., 'Planet Fact Sheet'), using sentence frames (e.g., 'This is placed here because...'), or asking students to gesture/point before explaining verbally. Focus on active engagement and language development.",
                                                "x-format": "{items}"
                                            }
                                        },
                                        "required": [
                                            "Strategies"
                                        ],
                                        "additionalProperties": false,
                                        "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}"
                                    },
                                    "AdditionalScaffolding": {
                                        "type": "object",
                                        "properties": {
                                            "Strategies": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-format": "- {value}"
                                                },
                                                "description": "Provide 2-3 concrete teaching strategies for scaffolding. Examples: providing pre-drawn organizers/templates, using a simplified checklist with specific guiding questions, or modeling a think-aloud process (e.g., 'Watch how I match...'). Focus on how to teach and vary complexity without simplifying materials.",
                                                "x-format": "{items}"
                                            }
                                        },
                                        "required": [
                                            "Strategies"
                                        ],
                                        "additionalProperties": false,
                                        "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}"
                                    },
                                    "GoDeeper": {
                                        "type": "object",
                                        "properties": {
                                            "Strategies": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-format": "- {value}"
                                                },
                                                "description": "Provide 1-2 extension tasks that deepen conceptual understanding. Include specific challenges (e.g., 'Adjust spacing to show...') or higher-order questions (e.g., 'How would you model... accurately?'). Must align to the same learning objectives.",
                                                "x-format": "{items}"
                                            },
                                            "ExpectedStudentResponses": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string",
                                                    "x-format": "- {value}"
                                                },
                                                "description": "Expected student responses showing what success looks like. Return empty array if not applicable.",
                                                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                            }
                                        },
                                        "required": [
                                            "Strategies",
                                            "ExpectedStudentResponses"
                                        ],
                                        "additionalProperties": false,
                                        "x-format": "{loc.GoDeeper}\n\n{value.Strategies}\n\n{value.ExpectedStudentResponses}"
                                    }
                                },
                                "required": [
                                    "LanguageLearners",
                                    "AdditionalScaffolding",
                                    "GoDeeper"
                                ],
                                "additionalProperties": false,
                                "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}"
                            },
                            "AccommodationsAndModifications": {
                                "type": "object",
                                "description": "This section must include two types of supports: General Supports and Individualized Supports. Focus on access, not lowering rigor.",
                                "properties": {
                                    "General": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions). Provide 2-4 bullet points.",
                                        "x-format": "{items}"
                                    },
                                    "IndividualSupport": {
                                        "type": "array",
                                        "description": "Specific accommodations and modifications for named students with formal plans. List EACH student individually; do NOT group students together. The supports for each student should be an easy-to-scan list.",
                                        "items": {
                                            "type": "object",
                                            "properties": {
                                                "StudentName": {
                                                    "type": "string",
                                                    "description": "First and last name of the individual student receiving these supports."
                                                },
                                                "PlanProvided": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "string",
                                                        "x-format": "- {value}"
                                                    },
                                                    "description": "The formal plan provided for this student in the prompt. Parse the plan into a clear list. You may paraphrase it to improve formatting, but do NOT omit or add any information."
                                                },
                                                "PlanImplementation": {
                                                    "type": "array",
                                                    "items": {
                                                        "type": "string",
                                                        "x-format": "- {value}"
                                                    },
                                                    "description": "Concrete tools/stems/visuals/organizers for this task.",
                                                    "x-format": "{items}"
                                                }
                                            },
                                            "required": [
                                                "StudentName",
                                                "PlanProvided",
                                                "PlanImplementation"
                                            ],
                                            "additionalProperties": false,
                                            "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}"
                                        },
                                        "x-format": "{items}"
                                    }
                                },
                                "required": [
                                    "General",
                                    "IndividualSupport"
                                ],
                                "additionalProperties": false,
                                "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}"
                            }
                        },
                        "required": [
                            "Materials",
                            "InstructionsForTeachers",
                            "QuickCheck",
                            "Differentiation",
                            "AccommodationsAndModifications"
                        ],
                        "additionalProperties": false,
                        "x-format": "### {green}({loc.GuidedPractice})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}"
                    },
                    "IndependentPractice": {
                        "type": "object",
                        "description": "Structured Independent Practice section.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "description": "Required materials.",
                                "x-format": "**📚 {loc.Materials}**\n\n{items}"
                            },
                            "Purpose": {
                                "type": "string",
                                "description": "Purpose of the independent practice."
                            },
                            "InstructionsForTeachers": {
                                "type": "array",
                                "description": "Sequential tasks for independent practice.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "TaskName": {
                                            "type": "string"
                                        },
                                        "DOKLevel": {
                                            "type": "string",
                                            "description": "e.g., 'DOK 3' or 'DOK 3-4'"
                                        },
                                        "TeacherNotes": {
                                            "type": "string",
                                            "description": "Explanation connecting task to presentation/goals."
                                        },
                                        "Instruction": {
                                            "type": "string",
                                            "description": "The specific instruction or 'Say:' statement."
                                        },
                                        "ExpectedStudentResponses": {
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-format": "  - {value}"
                                            },
                                            "description": "Sample answers.",
                                            "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                        },
                                        "SuccessCriteria": {
                                            "type": "array",
                                            "items": {
                                                "type": "string",
                                                "x-format": "  - {value}"
                                            },
                                            "description": "2-4 elements showing mastery.",
                                            "x-format": "- {loc.SuccessCriteria}\n\n{items}"
                                        }
                                    },
                                    "required": [
                                        "TaskName",
                                        "DOKLevel",
                                        "TeacherNotes",
                                        "Instruction",
                                        "ExpectedStudentResponses",
                                        "SuccessCriteria"
                                    ],
                                    "additionalProperties": false,
                                    "x-format": "\n\n**{loc.Task} {index}:** {value.TaskName} ({value.DOKLevel})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.SuccessCriteria}"
                                },
                                "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
                            },
                            "Reflection": {
                                "type": "array",
                                "description": "Self-regulation and transcendence questions.",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "Question": {
                                            "type": "string"
                                        },
                                        "ReflectionType": {
                                            "type": "string",
                                            "description": "e.g., 'Self-Regulation' or 'Transcendence'"
                                        }
                                    },
                                    "required": [
                                        "Question",
                                        "ReflectionType"
                                    ],
                                    "additionalProperties": false,
                                    "x-format": "- **{value.ReflectionType}:** {value.Question}"
                                },
                                "x-format": "**{loc.Reflection}**\n\n{items}"
                            },
                            "EarlyFinishers": {
                                "type": "object",
                                "properties": {
                                    "Prompt": {
                                        "type": "string",
                                        "description": "The early finisher task prompt/description."
                                    },
                                    "Requirements": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Specific elements students must address.",
                                        "x-format": "{items}"
                                    },
                                    "Justification": {
                                        "type": "string",
                                        "description": "Concluding sentence about using accurate principles."
                                    }
                                },
                                "required": [
                                    "Prompt",
                                    "Requirements",
                                    "Justification"
                                ],
                                "additionalProperties": false,
                                "x-format": "**{loc.EarlyFinishers}**\n\n**{loc.Prompt}:** {value.Prompt}\n\n**{loc.Requirements}:**\n{value.Requirements}\n\n**{loc.Justification}:** {value.Justification}"
                            }
                        },
                        "required": [
                            "Materials",
                            "Purpose",
                            "InstructionsForTeachers",
                            "Reflection",
                            "EarlyFinishers"
                        ],
                        "additionalProperties": false,
                        "x-format": "### {green}({loc.IndependentPractice})\n\n{value.Materials}\n\n**{loc.Purpose}:** {value.Purpose}\n\n{value.InstructionsForTeachers}\n\n{value.Reflection}\n\n{value.EarlyFinishers}"
                    },
                    "ReviewAndSpacedRetrieval": {
                        "type": "object",
                        "description": "Structured Review & Spaced Retrieval section. This 5-minute activity reinforces prior concepts and connects them to current learning.",
                        "properties": {
                            "Materials": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                    "x-format": "- {value}"
                                },
                                "description": "Required materials (often none needed).",
                                "x-format": "**📚 {loc.Materials}**\n\n{items}"
                            },
                            "TeacherNotes": {
                                "type": "string",
                                "description": "Teacher Notes paragraph that explains: How this review strategy enhances retention, connection to prior learning concepts, and how transcendent reflection deepens understanding.",
                                "x-format": "**{loc.TeacherNotes}:** {value}"
                            },
                            "ActiveRecall": {
                                "type": "object",
                                "description": "Instructions for Teachers containing Active Recall prompt.",
                                "properties": {
                                    "Instruction": {
                                        "type": "string",
                                        "description": "Active Recall prompt using partner/group sharing. Must use a 'Say:' statement."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Expected Student Responses (2-3 bulleted examples).",
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    },
                                    "CorrectCommonMisconceptions": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Sample misconception statements and teacher response scripts addressing each (e.g. 'If a student says X, respond Y').",
                                        "x-format": "**{loc.CorrectCommonMisconceptions}**\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Instruction",
                                    "ExpectedStudentResponses",
                                    "CorrectCommonMisconceptions"
                                ],
                                "additionalProperties": false,
                                "x-format": "**{loc.ActiveRecall}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}"
                            },
                            "EssentialQuestionConnection": {
                                "type": "object",
                                "description": "Connection to the unit's essential question.",
                                "properties": {
                                    "Question": {
                                        "type": "string",
                                        "description": "Teacher prompt linking to unit question. Must use a 'Say:' statement."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Expected Student Responses (2-3 examples).",
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Question",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "**💭 {loc.EssentialQuestionConnection}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
                            },
                            "TranscendentThinking": {
                                "type": "object",
                                "description": "Reflection on real-world application or broader impact.",
                                "properties": {
                                    "Question": {
                                        "type": "string",
                                        "description": "Real-world application prompt. Must include a think time instruction (e.g., 'Take 30 seconds to think silently, then share:') and use a 'Say:' statement."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Expected Student Responses (2-3 examples).",
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "Question",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
                            },
                            "SpacedRetrieval": {
                                "type": "object",
                                "description": "Recall of specific prior learning concepts.",
                                "properties": {
                                    "HeaderTitle": {
                                        "type": "string",
                                        "description": "Clear reference to specific prior lesson (e.g., 'Spaced Retrieval (Draws from Unit 2, Lesson 3)')."
                                    },
                                    "Instruction": {
                                        "type": "string",
                                        "description": "Question connecting past and current concepts. Must use a 'Say:' statement."
                                    },
                                    "ExpectedStudentResponses": {
                                        "type": "array",
                                        "items": {
                                            "type": "string",
                                            "x-format": "- {value}"
                                        },
                                        "description": "Detailed success criteria or expected student responses (2-3 examples).",
                                        "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                                    }
                                },
                                "required": [
                                    "HeaderTitle",
                                    "Instruction",
                                    "ExpectedStudentResponses"
                                ],
                                "additionalProperties": false,
                                "x-format": "**⏳ {value.HeaderTitle}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}"
                            }
                        },
                        "required": [
                            "Materials",
                            "TeacherNotes",
                            "ActiveRecall",
                            "EssentialQuestionConnection",
                            "TranscendentThinking",
                            "SpacedRetrieval"
                        ],
                        "additionalProperties": false,
                        "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}"
                    },
                    "FormativeAssessment": {
                        "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
                        "type": "array",
                        "description": "Exactly 4 Formative Assessment prompts, one for each DOK level.",
                        "items": {
                            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
                            "type": "object",
                            "properties": {
                                "PromptLabel": {
                                    "type": "string",
                                    "description": "e.g., 'Prompt 1 (DOK 1)'"
                                },
                                "Question": {
                                    "type": "string",
                                    "description": "The exact question text, e.g., 'Why do planets stay in orbit instead of flying off into space?'"
                                },
                                "ExpectedStudentResponses": {
                                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                                    "type": "array",
                                    "items": {
                                        "x-format": "- {value}",
                                        "type": "string"
                                    },
                                    "description": "1-2 sample responses showing mastery (wrapped in quotes)."
                                }
                            },
                            "required": [
                                "PromptLabel",
                                "Question",
                                "ExpectedStudentResponses"
                            ],
                            "additionalProperties": false
                        },
                        "minItems": 4,
                        "maxItems": 4
                    },
                    "StudentPractice": {
                        "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n{value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
                        "type": "object",
                        "description": "Homework/out-of-class practice.",
                        "properties": {
                            "TeacherNotes": {
                                "x-format": "**{loc.TeacherNotes}:** {value}",
                                "type": "string",
                                "description": "Short explanation of the practice goals, e.g., 'These tasks reinforce today's learning about [topic] by asking students to observe real-world patterns and explain them using the concepts introduced in class...'"
                            },
                            "PracticeTasks": {
                                "x-format": "{items}",
                                "type": "array",
                                "description": "Exactly 3 practice tasks (DOK 2 or DOK 3).",
                                "items": {
                                    "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                                    "type": "object",
                                    "properties": {
                                        "TaskDescription": {
                                            "type": "string",
                                            "description": "e.g., '(DOK 2) Tonight, go outside and write 3-4 sentences...'"
                                        },
                                        "ExpectedStudentResponses": {
                                            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                                            "type": "array",
                                            "items": {
                                                "x-format": "- {value}",
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "required": [
                                        "TaskDescription",
                                        "ExpectedStudentResponses"
                                    ],
                                    "additionalProperties": false
                                },
                                "minItems": 3,
                                "maxItems": 3
                            },
                            "Reflection": {
                                "x-format": "{value.Prompt}\n\n{value.ReflectionOptions}",
                                "type": "object",
                                "description": "A reflection task for the students.",
                                "properties": {
                                    "Prompt": {
                                        "type": "string",
                                        "description": "e.g., 'Reflection: Write 2-3 sentences responding to one prompt:'"
                                    },
                                    "ReflectionOptions": {
                                        "type": "array",
                                        "items": {
                                            "x-format": "- {value}",
                                            "type": "string"
                                        },
                                        "description": "Exactly 4 reflection question options in quotes."
                                    }
                                },
                                "required": [
                                    "Prompt",
                                    "ReflectionOptions"
                                ],
                                "additionalProperties": false
                            }
                        },
                        "required": [
                            "TeacherNotes",
                            "PracticeTasks",
                            "Reflection"
                        ],
                        "additionalProperties": false
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
        "x-removablePaths": {
            "EssentialQuestions": [
                "LessonDescription.EssentialQuestions"
            ],
            "StandardsAligned": [
                "LessonDescription.StandardsAligned"
            ],
            "AssessPriorKnowledge": [
                "LessonDescription.AssessPriorKnowledge"
            ],
            "SpacedLearningAndRetrieval": [
                "LessonDescription.ReviewAndSpacedRetrieval"
            ],
            "FormativeAssessment": [
                "LessonDescription.FormativeAssessment"
            ],
            "AccommodationsAndModifications": [
                "GuidedPractice.AccommodationsAndModifications"
            ]
        }
    }
};
