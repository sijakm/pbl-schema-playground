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
  - This is the same structure as Direct Presentation, but renamed.
  - Structure must flow naturally with Say/Do/Ask/Listen for/Write prompts.
  - IMPORTANT: Do NOT include all-caps headers (like HOOK, INTRODUCTION, etc.) for sections.
  - IMPORTANT: Do NOT include time durations for individual directions or steps.
  - TranscendentThinking: Provide one real-world application question connecting learning to purpose/meaning, followed by the label 'Expected Student Responses:' and 2–3 examples.
- GroupStructureAndRoles (3–4 minutes):
  - Output MUST be teacher-facing and MUST follow this exact structure and labels (same order, same emojis/characters):
  
  REQUIRED FORMAT (exact headings/labels):
  Group Size: [one of: pairs / triads / 4–5 students]
  
  📋 Instructions for Teachers
  Say: "[1–2 sentences: explain that roles matter and you will model what each role looks like]"
  
  Roles:
  Facilitator: [keeps group on task; prompts participation; ensures everyone speaks at least once]
  Recorder: [writes labels and group reasoning; captures evidence/consensus]
  Materials Manager: [collects/distributes materials; checks materials return; supports safe handling]
  Timekeeper: [tracks time for each phase; gives 1-minute warnings]
  Presenter: [shares group model and explanation; uses sentence frames]
  
  Rotation:
  - Include one sentence specifying when roles rotate in THIS lesson (e.g., “Rotate roles after Phase A and again before the gallery walk.”)
  
  Constraints:
  - Roles must be exactly these five role names (Facilitator, Recorder, Materials Manager, Timekeeper, Presenter) and each must have a concrete duty tied to the lesson’s CollaborativeActivities.
  - Group Size must match the task structure (e.g., if you use a jigsaw, prefer 4–5; if quick build-and-share, triads/pairs).
  - Keep total length ~120–180 words.
- CollaborationGuidelines:
  - Must be ~5 minutes.
  - Return empty string for this field because for now I have hardcoded text.
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
    "title": "LessonPlanResponse",
    "type": "object",
    "properties": {
      "LessonDescription": {
        "type": "object",
        "properties": {
          "LessonNumber": {
            "type": "integer",
            "description": "Sequential lesson number within the unit (1–based index)."
          },
          "LessonTitle": {
            "type": "string",
            "description": "Short descriptive title for the lesson. Do NOT include emojis here."
          },
          "EssentialQuestions": {
            "type": "array",
            "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "List of 'Term - Definition' strings. Definitions must be short, age-appropriate, and tied to this lesson.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "2–3 measurable objectives, each ending with a DOK label in parentheses.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "string",
            "description": "Aligned educational standards for this lesson. Must match unit standards exactly in code + description."
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
          },
          "Instruction": {
            "type": "object",
            "description": "Collaborative lesson's 'Instruction' section (equivalent to Direct Presentation).",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Materials list.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Teacher script with Say/Do/Ask/Listen for/Write prompts. Do NOT use all-caps headers for sections and do NOT include time markers for individual steps."
              },
              "AnticipatedMisconceptions": {
                "type": "string",
                "description": "Common misconceptions and exact correction language for addressing each one."
              },
              "TranscendentThinking": {
                "type": "string",
                "description": "Real-world application question connecting learning to purpose/meaning, with 2–3 expected student responses showing deeper understanding."
              },
              "QuickCheck": {
                "type": "string",
                "description": "Final comprehension check question with 2–3 expected student responses."
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
            "type": "string",
            "description": "3–4 minute setup for group size + rotating roles + duties + teacher prompt about grouping strategy."
          },
          "CollaborationGuidelines": {
            "type": "string",
            "description": "~5 minutes. 3–5 norms, teacher prompts for student-created norms (full + short), and equitable participation scaffolds."
          },
          "CollaborativeActivities": {
            "type": "object",
            "description": "Interdependent group work (collaborative replacement for Guided Practice). Teacher-facing, highly structured, and designed so students cannot complete the task alone. Must include: (a) clear interdependence (jigsaw, consensus-building, gallery walk, structured problem-solving challenge, or similar), (b) explicit timing for each phase (e.g., '8 minutes discussion, 2 minutes prepare response'), (c) scripted teacher facilitation using 'Say:' statements throughout, (d) a shared group product (claim, model, chart, solution set, gallery artifact, etc.), (e) circulation prompts with expected student responses, (f) at least one ALL-student response check (whiteboards, quick write, polling, thumbs, etc.) with expected responses, (g) quick check question + expected responses, (h) Differentiation in three tiers focused on instruction (not accommodations), and (i) AccommodationsAndModifications separated into General supports and IndividualSupport exactly matching the provided students/plans. Ensure cultural relevance and inclusion by inviting multiple perspectives and ensuring equitable participation.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Complete list of teacher + student materials used in this collaborative activity. Include any prepared items (prompt cards, sentence frames, role cards, checklists, rubrics, gallery walk sheets, whiteboards, timers, visuals, word banks, etc.). One item per array element; no placeholders.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Teacher-facing script for the 25-minute collaborative activity. MUST be concise and fit within the timeframe (aim for 6-10 total numbered steps). DO NOT use all-caps headers (e.g., SETUP, MODELING). DO NOT include time durations for individual steps. Circulation prompts must be integrated as single numbered tasks (e.g., '5. Circulation Prompt: ...'). Expected student responses must follow the corresponding task: write 'Expected student response:' once as a numbered step, then list each response indented on its own new line starting with a checkmark (✅). Example:\n5. Circulation Prompt: [question]\n6. Expected student response:\n7. ✅ Response 1\n8. ✅ Response 2"
              },
              "Differentiation": {
                "type": "string",
                "description": "Instructional differentiation ONLY (not accommodations/modifications). Must be organized into three labeled tiers in this exact order: 'Language Learners:', 'Students in Need of Additional Scaffolding:', 'Go Deeper:'. Each tier must include concrete teaching moves (2–3 strategies for the first two tiers; 1–2 extension tasks for Go Deeper) aligned to the same learning objectives. Include at least one expected student response/example per tier showing what success looks like. Keep rigor intact; vary complexity, scaffolding, and discourse demands."
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Access supports for this activity, separated into (1) General supports for all learners and (2) IndividualSupport for students with plans. Focus on access without lowering rigor. For each support, include concrete tools (exact sentence stems, organizer layout, visual description, checklist steps, etc.). IndividualSupport MUST include exactly the students provided in the prompt (same names, same PlanProvided text) and must add PlanImplementation that is specific to THIS activity.",
                "properties": {
                  "General": {
                    "type": "string",
                    "description": "General supports for the whole class during this collaborative activity (non-student-specific). Must be specific and usable (e.g., exact sentence frames, a 3-step checklist, a described anchor chart, a provided word bank, chunked task cards, pre-labeled templates). Do not lower rigor; improve access."
                  },
                  "IndividualSupport": {
                    "type": "array",
                    "minItems": 0,
                    "description": "Exactly the provided students (no more, no less). StudentName and PlanProvided must match the prompt exactly. PlanImplementation must provide concrete supports for THIS activity (sentence frames, partially completed organizer, bilingual labels, speech-to-text workflow, etc.).",
                    "items": {
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string"
                        },
                        "PlanProvided": {
                          "type": "string"
                        },
                        "PlanImplementation": {
                          "type": "string",
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
            "type": "string",
            "description": "~5 minutes. Structured debrief on how the group worked + teacher facilitation moves + expected student answers; link back to norms."
          },
          "ReviewAndSpacedRetrieval": {
            "type": "string",
            "description": "Full 'Review & Spaced Retrieval' section as plain text (400-600 words). MUST include these components in order: (1) Materials List, (2) Teacher Notes: One paragraph explaining the 'why' and 'how' (theory/science), not directions for the teacher. Use this stem: 'Teacher Notes: This strategy boosts retention through active recall and links today's ideas about [topic] to prior [concept] concepts. The transcendent reflection helps students recognize how [topic] influences [big idea]...', (3) Active Recall: 2-3 numbered items asking students to recall NEW learning from TODAY'S lesson (NOT fill-in-the-blanks, NO exit slips, NO reflections on improvement), (4) Correct Common Misconceptions: Placed immediately under Active Recall and aligned to the questions asked, (5) Connection to Essential Question: Teacher prompt linking to unit question + expected responses, (6) Transcendent Thinking: Real-world application prompt + expected responses, (7) Spaced Retrieval: Recall from a specific prior lesson/unit (naming the lesson number). For all prompts, include 'Expected student response:' with 2-3 concrete examples."
          },
          "FormativeAssessment": {
            "type": "string",
            "description": "Full 'Formative Assessment' section as plain text. This MUST contain exactly 4 question prompts labeled 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', 'Prompt 3 (DOK 3):', and 'Prompt 4 (DOK 4):'. For each prompt: - Question that tests understanding at stated DOK level - Header '✅ Expected Student Responses' - 1-2 sample responses showing mastery. DO NOT include a 'Reflection' section. Example format: Prompt 1 (DOK 1): 'Why do planets stay in orbit?' ✅ Expected Student Responses - 'Gravity and forward motion.' [Continue for Prompts 2-4]"
          },
          "StudentPractice": {
            "type": "string",
            "description": "Homework/out-of-class practice. Must follow the same required format as Direct Instruction, including ✅Expected Student Responses."
          }
        },
        "required": [
          "LessonNumber",
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
        "CollaborativeActivities.AccommodationsAndModifications"
      ]
    }
  }
};
