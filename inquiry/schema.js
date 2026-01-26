console.log("schema.js loading");
window.masterSchema = `
{
  "title": "InquiryUnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitTitle": {
      "type": "string",
      "description": ""
    },
    "UnitDescription": {
      "type": "string",
      "description": ""
    },
    "EssentialQuestions": {
      "type": "array",
      "description": "",
      "minItems": 3,
      "maxItems": 3,
      "items": {
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "type": "array",
      "description": "",
      "items": {
        "type": "string"
      }
    },
    "StandardsAligned": {
      "type": "array",
      "description": "",
      "items": {
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "type": "array",
      "description": "",
      "items": {
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "type": "string",
      "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
    },
    "OrientationPhase": {
      "type": "object",
      "properties": {
        "Purpose": {
          "type": "string",
          "description": ""
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Conceptualization Phase": {
      "type": "object",
      "description": "",
      "properties": {
        "Purpose": {
          "type": "string",
          "description": ""
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Investigation Phase": {
      "type": "object",
      "description": "",
      "properties": {
        "Purpose": {
          "type": "string",
          "description": ""
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
        },
        "AnticipatedMisconceptions": {
          "type": "string",
          "description": "Common misconceptions and exact correction language for addressing each one"
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
          "description": ""
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
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
          "description": ""
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: 1. HOOK (1-2 min) [Pose an intriguing opening question or demonstration] Say: [Exact engaging hook question] Do: [Specific teacher actions] Listen for: [2-3 expected student responses] 2. INTRODUCTION (1-2 min) Say: [Frame lesson purpose and agenda] Write: [What to put on board] Do: [Teacher setup actions] 3. DIRECT TEACHING (4-5 min) Say: [Main content explanation broken into small chunks] Draw/Show: [Visual aids / diagrams / models to use] Ask: [Check for understanding questions] Listen for: [2-3 expected student responses per question] Write: [What to capture on board] 4. GUIDED ENGAGEMENT (2-3 min) Say: [Instructions for student participation] Do: [How to structure student engagement] Listen for: [What students should say/do] Each section must include exact timing, teacher talk using Say/Ask/Listen for statements, teacher actions using Do/Draw/Show/Write directives, and student responses after each prompt. Format all expected student responses with bullet points."
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
      "description": "",
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
              "description": "",
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
    "KeyVocabulary",
    "UnitTitle",
    "UnitDescription",
    "EssentialQuestions",
    "StudentLearningObjectives",
    "StandardsAligned",
    "AssessPriorKnowledge",
    "OrientationPhase",
    "Conceptualization Phase",
    "Investigation Phase",
    "ConclusionPhase",
    "DiscussionPhase",
    "ReviewAndSpacedRetrieval",
    "FormativeAssessment",
    "StudentPractice"
  ],
  "additionalProperties": false
}
`;
