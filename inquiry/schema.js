console.log("schema.js loading");
window.masterSchema = `
{
  "title": "InquiryUnitPlanResponse",
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
      "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
      "items": {
        "type": "string"
      }
    },
    "StandardsAligned": {
      "type": "array",
      "description": "List all unique standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'NGSS MS-ESS1-1: Develop and use a model of the Earth-sun-moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
    "AssessPriorKnowledge": {
      "type": "string",
      "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
    },
    "OrientationPhase": {
      "type": "object",
      "properties": {
        "Purpose": {
          "type": "string",
          "description": "Word for Word: 'Purpose: Students are introduced to a real mystery that sparks curiosity and motivates investigation. They recognize the problem and activate prior knowledge to prepare for deeper inquiry.'"
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
          "description": "Step-by-step teacher instructions following this EXACT format for the intro and each activity component: The model must include the following four sections with headers and definition. These are in (). (Engage- Introduce the phenomenon in a way that sparks curiosity without explaining it.) Provide a teacher script that draws attention to the phenomenon. Include observation-based questions without revealing explanations. Facilitation moves must encourage noticing, wondering, and curiosity. (Connect- Help students link their observations to the broader mystery that will anchor the investigation.) Include prompts that help students turn observations into questions. Facilitation moves cluster student ideas and highlight emerging patterns. Must guide teachers to build the anchor problem without giving content. (Activate- Shift students into collaborative sensemaking.) Include partner or small group discussion prompts. Students share initial hypotheses without evaluation. Teacher circulates asking open, evidence-seeking questions. (Probe- Encourage refinement of thinking by pushing students to examine assumptions.) Include probing questions that disrupt simplistic reasoning. Teacher challenges students to justify ideas or test predictions. Example moves- What makes you say that? What would happen if that assumption were wrong?"
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ConceptualizationPhase": {
      "type": "object",
      "description": "",
      "properties": {
        "Purpose": {
          "type": "string",
          "description": "Word for word 'Purpose: Students generate meaningful research questions, select a central question to investigate, and create an action plan that will guide their inquiry process.'"
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
          "description": "The model must include these three required section headers with definitions. These are in (). (Guide Question Generation - Introduce the inquiry by prompting curiosity, not delivering content.) Students brainstorm questions based on the phenomenon. Teacher records all questions publicly without judging them. (Identify Research Question - Help students collaboratively decide which question is most useful for investigation.) Students sort questions, compare them, and select the one with the highest investigative potential. Teacher prompts must help refine questions into testable forms. (Create an Action Plan - Support students in designing their own investigation rather than giving them the plan.) The output must guide students to define: what they will observe, what they will test or compare, and what evidence they need to collect. Teacher facilitation moves must support planning without providing the investigation steps directly."
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
          "description": "Write word for word: Purpose: Students actively explore the phenomenon through observation, model analysis, and evidence collection, building a data set they will later use to form conclusions"
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
          "description": "The model must include the following sections with headers and definition. These are in ().(Launch the Investigation - Introduce the investigation task without explaining content so students uncover ideas through exploration and evidence-gathering.) The model must show that the teacher sets up materials and expectations and that students run tests, trials, or observations without being told the scientific explanation. (Collaboration Expectations - Guide students to work interdependently with shared responsibility.) The model must produce a paragraph that instructs teachers on how to establish collaboration expectations during group investigations, ensuring all tasks require shared responsibility and equal participation. Do not create 'roles'. The paragraph must explicitly direct the model to include a list of required student actions presented as general investigation behaviors, not subject-specific outcomes. These required actions must include: identifying inaccuracies or mismatches in a the project; recording observations and evidence in a structured data table; comparing their work to a reference example and justifying claims with evidence; using sentence starters to explain reasoning (such as 'I think _ because _'); and using participation structures (such as talking chips) to ensure every student contributes. The schema must emphasize that teachers support collaboration by reinforcing norms, monitoring engagement, and prompting evidence-based discussion without supplying  explanations.(Circulation Prompts - Use these only while circulating, each prompt supports thinking, not answers.) Prompts must be categorized into Conceptual (example: 'What evidence tells you this is happening?'), Reasoning (example: 'How does this trial change your thinking?'), and Collaboration (example: 'Who has not contributed yet? How can you include them?'). The model must clearly state that the teacher must not give away scientific explanations."
        },
        "AnticipatedMisconceptions": {
          "type": "string",
          "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding."
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
          "description": "Write word for word: Purpose: Students analyze their collected data and use evidence to answer the research question, forming a clear explanation based on their findings."
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
          "description": "The Instructions for Teachers must follow this structure: teachers prompt students to revisit the research question, review collected data, identify patterns, refine ideas through group discussion, and justify explanations with evidence. Teachers must guide but never provide scientific explanations. The model must include scripted teacher prompts such as Review your notes and data, What patterns do you notice, What evidence supports this idea, and Use your data to support your claim. The Instructions must require students to write an explanation independently and then share with a partner or group. Expected Student Responses must demonstrate evidence-based reasoning in a general way, without domain-specific examples. The entire output must remain content-neutral."
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
          "description": "Write word for word: Purpose: Help students shift from what they figured out to why it matters."
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
          "description": "The model must generate a paragraph that instructs teachers on how to facilitate a discussion phase in which students move beyond simply reporting findings and begin exploring the broader significance, applications, and implications of their learning. The paragraph must direct teachers to prompt students to connect their investigation results to real-world situations, future scenarios, or larger conceptual ideas. It should require the model to include guidance for partner or group discussion, teacher-led questioning that encourages students to extend and apply their reasoning, and facilitation moves that support students in generating their own examples rather than relying on teacher-provided ones. The schema must also require the model to output a set of expected student responses illustrating how learners might apply their understanding to authentic or future-oriented contexts."
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
      "description": "Full 'Review & Spaced Retrieval' section as plain text. This 5-minute activity must include in this exact order: 1. Materials List (often none needed) 2. Teacher Notes paragraph that explains: - How this review strategy enhances retention - Connection to prior learning concepts - How transcendent reflection deepens understanding 3. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 4. Correct Common Misconceptions block with: - Sample misconception statements - Teacher response scripts addressing each 5. Essential Question Connection including: - Teacher prompt linking to unit question - Expected Student Responses (2-3 examples) 6. Transcendent Thinking section with: - Real-world application prompt - Think time instruction - Expected Student Responses (2-3 examples) 7. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must use 'Say:' statements for teacher prompts and clearly labeled 'Expected Student Responses' showing 2-3 sample answers. Return as plain text.",
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
              "description": "Must include a clear reference to specific prior lesson next to the Spaced Retrieval title and note it like this: '(Draws from Unit 3, Lesson 2.)'  Must use active recall question connecting past and current concepts. Must not require students using notes or resources to answer.",
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
