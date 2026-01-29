window.masterSchema = `
{
  "title": "LabUnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitTitle": {
      "type": "string",
      "description": "Unit title as a single line of plain text, use exactly the Unit Name given in the prompt."
    },
    "UnitDescription": {
      "type": "string",
      "description": "Unit description as one cohesive plain-text paragraph (4-5 complete sentences) written in natural teacher voice that you could say directly to students. No HTML, no emojis, no bullet points. Must flow conversationally but follow this structure (without headlines): (1) hook sentence that sparks curiosity or makes a surprising contrast, (2) 'In this unit, you will...' sentence about mastery outcomes, (3) 'You'll strengthen your skills in...' sentence about thinking/analysis abilities, (4) 'This connects to...' sentence about real-world relevance, (5) 'Understanding this matters because...' sentence about broader significance or long-term impact."
    },
    "EssentialQuestions": {
      "type": "array",
      "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
      "minItems": 3,
      "maxItems": 3,
      "items": {
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "type": "array",
      "items": {
        "type": "string",
        "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses"
      }
    },
    "StandardsAligned": {
      "type": "array",
      "description": "List all unique standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content.",
      "items": {
        "type": "string"
      }
    },
    "Lessons": {
      "type": "array",
      "description": "All lessons in this unit in chronological order.",
      "minItems": 1,
      "maxItems": 3,
      "items": {
        "type": "object",
        "properties": {
          "LessonNumber": {
            "type": "integer",
            "description": "Sequential lesson number within the unit (1-based index). Lesson 1 MUST be the first, Lesson 2 the second, and so on."
          },
          "LessonTitle": {
            "type": "string",
            "description": "Short descriptive title for the lesson that clearly reflects the focus concept (e.g., 'Exploring Our Solar System'). Do NOT include emojis here; emojis are handled by the renderer."
          },
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
            "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description, e.g. 'ESS1-1: Develop and use a model of the Earth-sun-moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons. Do not add NGSS prefix'"
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
          },
          "Question": {
            "type": "object",
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Word for Word - Purpose: Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation."
              },
              "Materials": {
                "type": "array",
                "description": "",
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
                "description": "",
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
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Word for word: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
              },
              "Materials": {
                "type": "array",
                "description": "",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": ""
              },
              "AnticipatedMisconceptions": {
                "type": "array",
                "description": "",
                "items": {
                  "type": "object",
                  "description": "",
                  "properties": {
                    "Misconception": {
                      "type": "string",
                      "description": ""
                    },
                    "TeacherResponse": {
                      "type": "string",
                      "description": ""
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
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Word for Word: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
              },
              "Materials": {
                "type": "array",
                "description": "",
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
                "description": "",
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
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Word for word: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
              },
              "Materials": {
                "type": "array",
                "description": "",
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
                "description": ""
              },
              "AccommodationsAndModifications": {
                "type": "string",
                "description": ""
              },
              "QuickCheck": {
                "type": "string",
                "description": ""
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
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Purpose: Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions."
              },
              "Materials": {
                "type": "array",
                "description": "",
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
            "description": "",
            "properties": {
              "Purpose": {
                "type": "string",
                "description": "Word for word: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
              },
              "Materials": {
                "type": "array",
                "description": "",
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
                "description": ""
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
            "description": "Full 'Review & Spaced Retrieval' section as plain text. This 5-minute activity must include in this exact order: 1. Materials List (often none needed) 2. Teacher Notes paragraph that explains: - How this review strategy enhances retention - Connection to prior learning concepts - How transcendent reflection deepens understanding 3. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 4. Correct Common Misconceptions block with: - Sample misconception statements - Teacher response scripts addressing each 5. Essential Question Connection including: - Teacher prompt linking to unit question - Expected Student Responses (2-3 examples) 6. Transcendent Thinking section with: - Real-world application prompt - Think time instruction - Expected Student Responses (2-3 examples) 7. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers. Return as plain text."
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
          "LessonNumber",
          "LessonTitle",
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
    }
  },
  "required": [
    "UnitTitle",
    "UnitDescription",
    "EssentialQuestions",
    "StudentLearningObjectives",
    "StandardsAligned",
    "Lessons"
  ],
  "additionalProperties": false
}
`;
