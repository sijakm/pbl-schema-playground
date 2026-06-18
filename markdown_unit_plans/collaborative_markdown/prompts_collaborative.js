window.prompts_collaborative = {
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
`

  ,
  PER_LESSON_PROMPT_TEMPLATE: `
Create ONE collaborative-style lesson plan (NOT a unit plan, NOT multiple lessons) using the info below.

You MUST output valid JSON that matches the provided JSON schema exactly (LessonPlanResponse with a single "LessonPlan" object). Do not include any extra keys. Use compact JSON formatting (no extra blank lines).

UNIT CONTEXT (read-only context for coherence):
Unit Subject:
{{$Subject}}

Unit Content: 
{{$ParentUnitData}}

Unit Description/Instruction: Create a unit using the following Standards:
{{$Standards}}

Grade Level:
{{$GradeLevel}}

Resources/Media to use: 
{{$MediaContext}}

Duration of class period in minutes:
{{$ClassDuration}}

Lesson Title:
{{$Name}}

Unit Description/Instruction: 
{{$UserPrompt}}

Unit Essential Questions (USE THESE VERBATIM):
{{$UnitEssentialQuestions}}

If Unit Essential Questions above is empty, generate exactly 3 conceptual questions following these rules:
- Each question MUST be a complete, grammatically correct sentence that ends with a question mark.
- Each question MUST begin with either "How" or "Why".
- Questions MUST be conceptual and exploratory, not factual, procedural, or definitional.
- Questions MUST focus on broad, universal ideas (such as change, evidence, patterns, relationships, systems, or reasoning), not on subject-specific content.
- Questions MUST be transferable across disciplines and applicable beyond this unit.

STUDENTS WITH INDIVIDUALIZED SUPPORT (MUST be used ONLY inside CollaborativeActivities.AccommodationsAndModifications; use the student names/plans exactly as written):
{{$LearningPlans}}

IMPORTANT CONTENT RULES (Collaborative Style):
- Keep the lesson aligned to the unit focus and the Lesson Scope/Boundaries above; avoid introducing new major concepts that belong to other lessons.
- Cultural Relevance & Inclusion: incorporate multiple perspectives; connect to varied communities; avoid stereotypes; show impacts for all involved.
- Transfer: embed real-world application and reasoning throughout.
- Interleaving: when students practice/apply, mix strategies or concepts (not blocked practice). If the lesson contains any math-like reasoning, include at least one DOK 3–4 interleaved item that mixes current content with an earlier lesson concept and requires students to justify strategy choice.

FIELD-SPECIFIC RULES:
- EssentialQuestions: MUST exactly equal the unit-level essential questions (same text, same order).
- AssessPriorKnowledge: If this section is required (e.g., for the first lesson or when introducing new major concepts), write 150–250 words following the required structure in the schema description. Otherwise, return "" (empty string).
- Instruction:
  - InstructionsForTeachers: These steps must be thorough and include all new learning for the lesson with explanations for how to teach it. Be precise.
  - It must include how to introduce the new subject content (hooks, guiding questions, transitions).
  - It must include the content and script for the teacher to teach content directly (definitions, examples, key points, explanations).
  - Structure must flow naturally with Say/Do/Ask/Listen for/Write prompts.
  - IMPORTANT: Do NOT include all-caps headers (like HOOK, INTRODUCTION, etc.) for sections.
  - IMPORTANT: Do NOT include time durations for individual directions or steps.
  - TranscendentThinking: Provide one real-world application question connecting learning to purpose/meaning, followed by the label 'Expected Student Responses:' and 2–3 examples.
- GroupStructureAndRoles:
  - Output MUST be teacher-facing.
  - GroupSize: specify 'pairs', 'triads', or '4-5 students'.
  - TeacherSay: 1-2 sentences explaining that roles matter and you will model what each role looks like.
  - Roles: Must define exactly these five roles (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) with concrete duties tied to the lesson's CollaborativeActivities.
  - Rotation: One sentence specifying when roles rotate in THIS lesson (e.g., "Rotate roles after Phase A and again before the gallery walk.")

CollaborativeActivities:
- Create an interdependent collaborative activity (collaborative replacement for Guided Practice) aligned to this lesson’s scope.
- Every student must contribute and groups must produce a shared product or decision.
- Include timing cues, teacher Say: scripting, circulation prompts + expected responses, and a quick check where ALL students respond + expected responses.
- Include Differentiation (3 tiers) and AccommodationsAndModifications (General + IndividualSupport exactly as provided).
- If this is a math lesson, include one DOK 3–4 interleaved problem mixing current content with a prior lesson/unit and explain why it is included; otherwise omit interleaving.
- ReflectionOnGroupDynamics:
  - Must be ~5 minutes.
  - Include 2–4 student debrief prompts (e.g., what went well, challenge, voice heard).
  - Provide teacher facilitation moves (quick-write exit slip, group self-rating 1–5, or 2-minute discussion), with teacher prompts and expected student answers.
  - Explicitly link reflection back to CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Same structure and requirements as the Direct Instruction version (see schema description).
  - Must include a retrieval check that connects to ONE prior lesson concept (name the prior lesson number).
- StudentPractice:
  - Homework/out-of-class practice.
  - Must follow the exact required format in the schema description (including the ✅Expected Student Responses markers).

OUTPUT REQUIREMENTS:
- Output MUST be valid JSON matching the provided schema exactly.
- Output MUST be a SINGLE lesson plan only.
- No HTML. No emojis. No markdown. Plain text inside string fields.
`

  ,
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
    "title": "LessonPlanResponse",
    "type": "object",
    "properties": {
      "LessonDescription": {
        "type": "object",
        "properties": {
          "LessonTitle": {
            "x-format": "# {value}",
            "type": "string",
            "description": "Short descriptive title for the lesson. Do NOT include emojis here."
          },
          "EssentialQuestions": {
            "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
            "type": "array",
            "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
            "type": "array",
            "description": "List of 'Term - Definition' strings. Definitions must be short, age-appropriate, and tied to this lesson.",
            "items": {
              "x-format": "{index}. {value}",
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
            "type": "array",
            "description": "2–3 measurable objectives, each ending with a DOK label in parentheses.",
            "items": {
              "x-format": "- {value}\n",
              "type": "string"
            }
          },
          "StandardsAligned": {
            "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
            "type": "array",
            "description": "Aligned educational standards for this lesson. Must match unit standards exactly in code + description.",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            }
          },
          "AssessPriorKnowledge": {
            "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
            "type": "object",
            "description": "Assess Prior Knowledge section. ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN NULL or OMIT this field. For Lesson 1, structure must include ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, and AlternateOptions.",
            "properties": {
              "ActivityInstructions": {
                "type": "string",
                "description": "Clear instructions and template/structure for the chosen modality. E.g. 'Say: \"Before we build...\"'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "description": "Anticipated answers or common misconceptions for the chosen modality.",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              },
              "ClosingTeacherPrompt": {
                "type": "string",
                "description": "Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation."
              },
              "AlternateOptions": {
                "x-format": "**{loc.AlternateOptions}**\n\n{items}",
                "type": "array",
                "description": "2 brief alternate options a teacher could choose.",
                "items": {
                  "x-format": "{index}. {value}",
                  "type": "string"
                }
              }
            },
            "required": [
              "ActivityInstructions",
              "ExpectedStudentResponses",
              "ClosingTeacherPrompt",
              "AlternateOptions"
            ],
            "additionalProperties": false
          },
          "Instruction": {
            "x-format": "### {green}({loc.Instruction})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}",
            "type": "object",
            "description": "Collaborative lesson's 'Instruction' section (equivalent to Direct Presentation).",
            "properties": {
              "Materials": {
                "x-format": "**📚 {loc.Materials}**\n\n{items}",
                "type": "array",
                "description": "Materials list.",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
                "type": "array",
                "description": "Teacher script organized into sequential steps. These steps must collectively act as a thorough guide to help the teacher deliver new content. It must include how to introduce the new subject content (hooks, guiding questions, transitions), and content/script for the teacher to teach directly (definitions, examples, key points, explanations). Instructions should be thorough and include all new learning for the lesson with explanations for how to teach it. Be precise. Do NOT use all-caps headers for sections and do NOT include time markers.",
                "items": {
                  "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                  "type": "object",
                  "properties": {
                    "Instruction": {
                      "type": "string",
                      "description": "The teacher action, e.g. Say: '...', Do: '...', Ask: '...'"
                    },
                    "ExpectedStudentResponses": {
                      "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                      "type": "array",
                      "description": "Anticipated answers if the instruction was a question. Return an empty array if not applicable.",
                      "items": {
                        "x-format": "  - {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Instruction",
                    "ExpectedStudentResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "AnticipatedMisconceptions": {
                "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
                "type": "array",
                "description": "List of common misconceptions and exact correction language for addressing each one.",
                "items": {
                  "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
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
                  "additionalProperties": false
                }
              },
              "TranscendentThinking": {
                "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Real-world application question connecting learning to purpose/meaning.",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "2-3 expected student responses showing deeper understanding.",
                    "items": {
                      "x-format": "- {value}",
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
              "QuickCheck": {
                "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Final comprehension check question.",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "2-3 expected student responses.",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Question",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
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
          "GroupStructureAndRoles": {
            "x-format": "### {green}({loc.GroupStructureAndRoles})\n\n{loc.DetermineThePurpose}\n\n{value.GroupSize}\n\n**📋 {loc.InstructionsForTeachers}**\n{value.TeacherSay}\n\n{value.Roles}\n\n{value.Rotation}",
            "type": "object",
            "description": "Group size, teacher script, defined roles, and rotation.",
            "properties": {
              "GroupSize": {
                "x-format": "{loc.GroupSize}: {value}",
                "type": "string",
                "description": "e.g. 'pairs', 'triads', or '4-5 students'"
              },
              "TeacherSay": {
                "type": "string",
                "description": "Teacher script explaining roles."
              },
              "Roles": {
                "x-format": "{value.Facilitator}\n{value.Recorder}\n{value.MaterialsManager}\n{value.Timekeeper}\n{value.Presenter}",
                "type": "object",
                "properties": {
                  "Facilitator": {
                    "x-format": "- **{loc.Facilitator}:** {value}",
                    "type": "string"
                  },
                  "Recorder": {
                    "x-format": "- **{loc.Recorder}:** {value}",
                    "type": "string"
                  },
                  "MaterialsManager": {
                    "x-format": "- **{loc.MaterialsManager}:** {value}",
                    "type": "string"
                  },
                  "Timekeeper": {
                    "x-format": "- **{loc.Timekeeper}:** {value}",
                    "type": "string"
                  },
                  "Presenter": {
                    "x-format": "- **{loc.Presenter}:** {value}",
                    "type": "string"
                  }
                },
                "required": [
                  "Facilitator",
                  "Recorder",
                  "MaterialsManager",
                  "Timekeeper",
                  "Presenter"
                ],
                "additionalProperties": false
              },
              "Rotation": {
                "x-format": "{loc.Rotation}:\n- {value}",
                "type": "string",
                "description": "Sentence specifying when roles rotate."
              }
            },
            "required": [
              "GroupSize",
              "TeacherSay",
              "Roles",
              "Rotation"
            ],
            "additionalProperties": false
          },
          "CollaborationGuidelines": {
            "x-format": "### {green}({loc.CollaborationGuidelines})\n\n{loc.CollaborationGuidelinesIntro}\n\n{items}",
            "type": "array",
            "description": "Prompts to help groups create their own collaboration norms.",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            }
          },
          "CollaborativeActivities": {
            "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
            "type": "object",
            "description": "Interdependent group work (collaborative replacement for Guided Practice). Teacher-facing, highly structured, and designed so students cannot complete the task alone. Must include: (a) clear interdependence (jigsaw, consensus-building, gallery walk, structured problem-solving challenge, or similar), (b) explicit timing for each phase (e.g., '8 minutes discussion, 2 minutes prepare response'), (c) scripted teacher facilitation using 'Say:' statements throughout, (d) a shared group product (claim, model, chart, solution set, gallery artifact, etc.), (e) circulation prompts with expected student responses, (f) at least one ALL-student response check (whiteboards, quick write, polling, thumbs, etc.) with expected responses, (g) quick check question + expected responses, (h) Differentiation in three tiers focused on instruction (not accommodations), and (i) AccommodationsAndModifications separated into General supports and IndividualSupport exactly matching the provided students/plans. Ensure cultural relevance and inclusion by inviting multiple perspectives and ensuring equitable participation.",
            "properties": {
              "Materials": {
                "x-format": "**📚 {loc.Materials}**\n\n{items}",
                "type": "array",
                "description": "Complete list of teacher + student materials used in this collaborative activity. Include any prepared items (prompt cards, sentence frames, role cards, checklists, rubrics, gallery walk sheets, whiteboards, timers, visuals, word banks, etc.). One item per array element; no placeholders.",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
                "type": "array",
                "description": "Teacher script for the collaborative activity (aim for 6-8 numbered steps). Ensure one step is explicitly 'Circulation Prompts:' which includes specific questions to ask groups as they work.",
                "items": {
                  "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                  "type": "object",
                  "properties": {
                    "Instruction": {
                      "type": "string",
                      "description": "The specific teacher action, starting with 'Say: ', 'Do: ', or exactly 'Circulation Prompts:'."
                    },
                    "CirculationPrompts": {
                      "x-format": "\n{items}",
                      "type": "array",
                      "description": "ONLY populate this if the Instruction is 'Circulation Prompts:'. List specific questions to ask groups while circulating. OMIT this property if not applicable.",
                      "items": {
                        "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                        "type": "object",
                        "properties": {
                          "Prompt": {
                            "type": "string",
                            "description": "The question to ask the group."
                          },
                          "ExpectedStudentResponses": {
                            "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                            "type": "array",
                            "description": "Expected answers to this specific circulation prompt. OMIT this property if none.",
                            "items": {
                              "x-format": "       - {value}",
                              "type": "string"
                            }
                          }
                        },
                        "required": ["Prompt", "ExpectedStudentResponses"],
                        "additionalProperties": false
                      }
                    },
                    "ExpectedStudentResponses": {
                      "x-format": "\n   ✅ {loc.ExpectedStudentResponses}\n{items}",
                      "type": "array",
                      "description": "Anticipated answers if the Instruction was a direct question to the class. OMIT this property if not applicable.",
                      "items": {
                        "x-format": "     - {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": ["Instruction", "CirculationPrompts", "ExpectedStudentResponses"],
                  "additionalProperties": false
                }
              },
              "Differentiation": {
                "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
                "type": "object",
                "description": "Labeled with three clearly labeled tiers: Language Learners, Students in Need of Additional Scaffolding, Go Deeper. Requirements: The content must differentiate instruction, not provide accommodations or modifications (those are addressed elsewhere). Strategies should focus on how to teach, not how to simplify materials. Activities should vary in complexity and depth, aligned to the same learning objectives. Each tier must promote active engagement, language development, and conceptual understanding. Use clear, teacher-facing language and make supports realistic for classroom use.",
                "properties": {
                  "LanguageLearners": {
                    "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}",
                    "type": "object",
                    "properties": {
                      "Strategies": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Provide 2-3 concrete teaching strategies for language learners. Examples: providing specific visuals (e.g., 'Planet Fact Sheet'), using sentence frames (e.g., 'This is placed here because...'), or asking students to gesture/point before explaining verbally. Focus on active engagement and language development."
                      }
                    },
                    "required": [
                      "Strategies"
                    ],
                    "additionalProperties": false
                  },
                  "AdditionalScaffolding": {
                    "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}",
                    "type": "object",
                    "properties": {
                      "Strategies": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Provide 2-3 concrete teaching strategies for scaffolding. Examples: providing pre-drawn organizers/templates, using a simplified checklist with specific guiding questions, or modeling a think-aloud process (e.g., 'Watch how I match...'). Focus on how to teach and vary complexity without simplifying materials."
                      }
                    },
                    "required": [
                      "Strategies"
                    ],
                    "additionalProperties": false
                  },
                  "GoDeeper": {
                    "x-format": "{loc.GoDeeper}\n\n{value.Strategies}",
                    "type": "object",
                    "properties": {
                      "Strategies": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Provide 1-2 extension tasks that deepen conceptual understanding. Include specific challenges (e.g., 'Adjust spacing to show...') or higher-order questions (e.g., 'How would you model... accurately?'). Must align to the same learning objectives."
                      }
                    },
                    "required": [
                      "Strategies"
                    ],
                    "additionalProperties": false
                  }
                },
                "required": [
                  "LanguageLearners",
                  "AdditionalScaffolding",
                  "GoDeeper"
                ],
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
              "Materials",
              "InstructionsForTeachers",
              "Differentiation",
              "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          },
          "ReflectionOnGroupDynamics": {
            "x-format": "### {green}({loc.ReflectionOnGroupDynamics})\n\n{value.DebriefPrompt}\n\n{value.TeacherFacilitationOptions}\n\n{value.ClosingPrompt}",
            "type": "object",
            "description": "Students evaluate how well the group worked together. MUST contain exactly 3 segments in order: a debrief prompt, facilitation options, and a closing prompt linking to norms.",
            "properties": {
              "DebriefPrompt": {
                "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "A short debrief prompt for students after collaboration.",
                "properties": {
                  "Say": {
                    "type": "string",
                    "description": "The exact wording the teacher says, e.g., 'Say: \"Take two minutes to reflect: What did our group do well today?\"'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Expected student answers (2-3 examples)."
                  }
                },
                "required": [
                  "Say",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "TeacherFacilitationOptions": {
                "x-format": "**2.** {loc.TeacherFacilitationOptions}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Exactly 3 teacher facilitation moves to choose from (e.g., Quick-write exit slip, 1-5 group collaboration rating, 2-minute whole-group share). Just the options, no expected responses."
              },
              "ClosingPrompt": {
                "x-format": "**3.** {value}",
                "type": "string",
                "description": "A final teacher prompt linking reflections back to the collaboration guidelines. e.g., 'Say: \"Which of your norms helped the most today?\"'"
              }
            },
            "required": [
              "DebriefPrompt",
              "TeacherFacilitationOptions",
              "ClosingPrompt"
            ],
            "additionalProperties": false
          },
          "ReviewAndSpacedRetrieval": {
            "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
            "type": "object",
            "description": "Full 'Review & Spaced Retrieval' section.",
            "properties": {
              "Materials": {
                "x-format": "**📚 {loc.Materials}**\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Materials list (e.g. ['None'] or ['Whiteboards'])."
              },
              "TeacherNotes": {
                "x-format": "**{loc.TeacherNotes}:** {value}",
                "type": "string",
                "description": "Short note explaining how the retrieval practice supports retention."
              },
              "ActiveRecall": {
                "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
                "type": "object",
                "description": "Asking students to recall NEW learning from TODAY'S lesson.",
                "properties": {
                  "Say": {
                    "type": "string",
                    "description": "The teacher prompt."
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    }
                  },
                  "CorrectCommonMisconceptions": {
                    "x-format": "⚠️ {loc.CorrectCommonMisconceptions}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "1-2 misconceptions and how to correct them."
                  }
                },
                "required": [
                  "Say",
                  "ExpectedStudentResponses",
                  "CorrectCommonMisconceptions"
                ],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Teacher prompt linking to unit question.",
                "properties": {
                  "Say": {
                    "type": "string"
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
                  "Say",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "TranscendentThinking": {
                "x-format": "🌍 **{loc.TranscendentThinking}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Real-world application prompt.",
                "properties": {
                  "Say": {
                    "type": "string"
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
                  "Say",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "x-format": "⏳ **{loc.SpacedRetrieval} ({value.DrawsFrom})**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "description": "Recall from a specific prior lesson/unit.",
                "properties": {
                  "DrawsFrom": {
                    "type": "string",
                    "description": "The prior lesson referenced, e.g. 'Draws from Unit 2, Lesson 3'"
                  },
                  "Say": {
                    "type": "string"
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
                  "DrawsFrom",
                  "Say",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
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
            "additionalProperties": false
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
          "LessonTitle",
          "EssentialQuestions",
          "KeyVocabulary",
          "StudentLearningObjectives",
          "StandardsAligned",
          "AssessPriorKnowledge",
          "Instruction",
          "GroupStructureAndRoles",
          "CollaborationGuidelines",
          "CollaborativeActivities",
          "ReflectionOnGroupDynamics",
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
        "LessonDescription.CollaborativeActivities.AccommodationsAndModifications"
      ]
    }
  }
};
