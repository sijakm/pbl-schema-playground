window.prompts_inquiry = {
  STEP0_PROMPT_TEMPLATE: `Create ONLY the INQUIRY unit outline (Step 0) using the info below. Do NOT create a full unit plan and do NOT write full lesson plans.

You MUST output valid JSON that matches the provided JSON schema exactly: UnitPlanResponse. Do not include any extra keys. Use compact JSON formatting (no extra blank lines or whitespace between JSON properties). No HTML. No emojis. Plain text inside string fields.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period in minutes: {{$ClassDuration}}
Requested Number of Lessons: {{$NumberOfItems}}
Standards to Align (use verbatim if present; do NOT add new standards): {{$Standards}}
Students with individualized support (context only): {{$LearningPlans}}
Resources/Media to use: {{$MediaContext}}
Unit Content: {{$AttachedUnit}}
Attached Lesson Content (if any): {{$AttachedLesson}}

INQUIRY OUTLINE REQUIREMENTS:
- This is inquiry-first. Lessons MUST progress through this arc:
  (1) phenomenon/experience + noticing/wondering,
  (2) selecting questions + planning investigations,
  (3) evidence collection + pattern-finding,
  (4) model-building + revision using evidence,
  (5) explanation/argument + communication + transfer.
- Maintain sensemaking through discovery: students build and revise models using observations and simple data; emphasize evidence, reasoning, and communication.
- Keep alignment ONLY to the provided standards. Do NOT add any new standards or frameworks.
- Cultural relevance & inclusion: include brief community-relevant contexts or perspectives without stereotypes.
- Interleaving & transfer: revisit skills across lessons (observing, modeling, arguing from evidence, communicating).
- Lessons MUST be non-overlapping with clear boundaries.

LESSONS ARRAY CONSTRAINTS:
- The Lessons array MUST contain exactly {{$NumberOfItems}} lessons.
- lessonNumber is 1-based and strictly increasing by 1.
- Ensure logical sequencing from foundational inquiry moves to more complex modeling and explanation.
- Pacing must fit {{$ClassDuration}} minute class periods at grade {{$GradeLevel}}.

OUTPUT RULE:
Return ONLY JSON that validates against the UnitPlanResponse schema.`,

  PER_LESSON_PROMPT_TEMPLATE: `Create ONE inquiry lesson plan (NOT a unit plan, NOT multiple lessons) using the info below. You MUST output valid JSON that matches the provided JSON schema exactly: InquiryUnitPlanResponse. Do not include any extra keys. Use compact JSON formatting (no extra blank lines or whitespace between JSON properties). No HTML. No emojis. No markdown. Plain text inside string fields.

Unit Subject: {{$Subject}}
Unit Name: {{$Name}}
Unit Description/Instruction: {{$UserPrompt}}
Grade Level: {{$GradeLevel}}
Duration of class period in minutes: {{$ClassDuration}}
Standards to Align (use verbatim if present; do NOT add new standards): {{$Standards}}
Students with individualized support (MUST be used ONLY inside InvestigationPhase.AccommodationsAndModifications; use the student names/plans exactly as written): {{$LearningPlans}}
Resources/Media to use: {{$MediaContext}}
Unit Content: {{$AttachedUnit}}

Unit and Lesson Elements from Step 0 (use verbatim):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (exactly as provided; reuse verbatim where relevant): {{$UnitEssentialQuestions}}

Attached Lesson Content (if any): {{$AttachedLesson}}

INQUIRY LESSON FLOW REQUIREMENTS:
- This lesson must follow the inquiry arc and be aligned to the lesson outline boundaries: Orientation → Conceptualization → Investigation → Conclusion → Discussion.
- Maintain sensemaking through discovery: students build and revise ideas using observations and simple data; emphasize evidence, reasoning, and communication.
- Cultural relevance & inclusion: include brief community-relevant contexts or perspectives without stereotypes.
- Do NOT introduce major new concepts that belong to other lessons; stay within the scope and boundaries of this lesson’s outline.
- Keep alignment ONLY to the provided standards. Do NOT add any new standards or frameworks.
- Teacher moves must guide thinking without giving scientific explanations directly.

FIELD-SPECIFIC RULES (map to schema):
- AssessPriorKnowledge: ONLY if lesson number is 1, write 150–250 words and follow the required structure in the schema description; otherwise return "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: include general supports.
  - IndividualSupport: array must include exactly the provided students and their plans (same names/plans; no extra students; no missing students).

OUTPUT RULE:
Return ONLY JSON that validates against the InquiryUnitPlanResponse schema.`,


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
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "StudentLearningObjectives": {
            "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
            "type": "array",
            "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "StandardsAligned": {
            "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
            "type": "array",
            "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "KeyVocabulary": {
            "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
            "type": "array",
            "description": "Full 'Key Vocabulary' section as a list of strings. Each string should be a single term with definition separated by dash/hyphen. Example: 'Gravity - The force that pulls objects toward each other'. All definitions must be short, age-appropriate, and directly related to the lesson's content.",
            "items": { "x-format": "- {value}", "type": "string" }
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
    "title": "InquiryUnitPlanResponse",
    "type": "object",
    "x-format": "{value.AssessPriorKnowledge}\n\n{value.EssentialQuestions}\n\n{value.KeyVocabulary}\n\n{value.StudentLearningObjectives}\n\n{value.StandardsAligned}\n\n{value.OrientationPhase}\n\n{value.ConceptualizationPhase}\n\n{value.InvestigationPhase}\n\n{value.ConclusionPhase}\n\n{value.DiscussionPhase}\n\n{value.ReviewAndSpacedRetrieval}\n\n{value.FormativeAssessment}\n\n{value.StudentPractice}",
    "properties": {
      "AssessPriorKnowledge": {
        "x-format": "### 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
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
            "description": "Closing teacher prompt (do NOT include the 'Say:' prefix) that validates student thinking and previews unit investigation."
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
      "EssentialQuestions": {
        "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
        "type": "array",
        "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
        "items": { "x-format": "- {value}", "type": "string" }
      },
      "KeyVocabulary": {
        "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
        "type": "array",
        "description": "Select verbatim the key vocabulary for this lesson from the unit-level vocabulary provided in the prompt. Do NOT invent new words. You must reuse the exact wording from the Step 0 UnitDescription.KeyVocabulary.",
        "items": { "x-format": "- {value}", "type": "string" }
      },
      "StudentLearningObjectives": {
        "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
        "type": "array",
        "description": "Select verbatim the specific student learning objectives for this lesson from the unit-level objectives provided in the prompt. Do NOT invent new objectives. You must reuse the exact wording from the Step 0 UnitDescription.StudentLearningObjectives.",
        "items": { "x-format": "- {value}", "type": "string" }
      },
      "StandardsAligned": {
        "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
        "type": "array",
        "description": "List only the unique educational standards addressed in this specific lesson. Each standard must include standard code and description and must be exactly the same used in the Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
        "items": { "x-format": "- {value}", "type": "string" }
      },
      "OrientationPhase": {
        "x-format": "### {green}({loc.OrientationPhase})\n\n{loc.OrientationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "properties": {
          "Materials": {
            "x-format": "{items}",
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Engage": {
                "type": "object",
                "x-format": "**{loc.EngageTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script to introduce the phenomenon. Ensure it focuses on sparking curiosity without giving scientific explanations." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 specific pedagogical moves that guide silent observation and partner sharing. Include scripts (do NOT include the 'Say:' prefix, e.g., 'Take 30 seconds to look silently...'). Focus on capturing and organizing student observations into meaningful categories and encouraging multiple perspectives.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts as a single string to help students identify details, notice patterns, and surface initial wonderings. Encourage students to explain why certain details feel important and to build on or contrast each other’s observations." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "Connect": {
                "type": "object",
                "x-format": "**{loc.ConnectTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a specific teacher script (do NOT include the 'Say:' prefix) that helps students turn their observations of the phenomenon into research questions or problems while clustering ideas into key themes." },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 specific prompts to help students connect observations to underlying challenges, justify thinking with evidence, and prioritize which ideas are most worth investigating." },
                  "FacilitationMoves": { "type": "array", "description": "Suggest 2-3 moves to support students in refining and grouping their ideas, while pressing them to explain their reasoning. Include instructions to record and highlight recurring questions without answering them.", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Activate": {
                "type": "object",
                "x-format": "**{loc.ActivateTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Develop a teacher-led instruction (do NOT include the 'Say:' prefix) to facilitate partner or group discussion that generates specific ideas, explanations, or solutions using available information and constraints. Encourage comparison and reasoning." },
                  "PromptingOptions": { "type": "string", "description": "List 2-3 prompts to encourage students to propose ideas, explain reasoning, consider alternative approaches, and evaluate which parts of their thinking are strongest or most uncertain." },
                  "FacilitationMoves": { "type": "array", "description": "Describe 2-3 circulation moves to listen for reasoning, press for clarity/justification, and highlight diverse approaches without evaluating which is correct.", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Probe": {
                "type": "object",
                "x-format": "**{loc.ProbeTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\n\n{value.Closing}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script to push students to refine and test their ideas by examining assumptions, considering different conditions, and identifying key factors of this lesson." },
                  "PromptingOptions": { "type": "string", "description": "Suggest 2-3 specific prompts to test ideas against new conditions, identify weaknesses, and revise thinking using evidence for this lesson's phenomena." },
                  "FacilitationMoves": { "type": "array", "description": "Provide 2-3 specific moves to encourage students to revisit and revise their initial ideas based on evidence and justify changes in their thinking.", "items": { "x-format": "- {value}", "type": "string" } },
                  "Closing": { "type": "string", "description": "A final instruction to push students to test and revise their ideas, consider long-term effects and changing conditions, and use evidence from observations to strengthen or challenge their thinking." }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves", "Closing"],
                "additionalProperties": false
              }
            },
            "required": ["Engage", "Connect", "Activate", "Probe"],
            "additionalProperties": false
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "ConceptualizationPhase": {
        "x-format": "### {green}({loc.ConceptualizationPhase})\n\n{loc.ConceptualizationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "",
        "properties": {
          "Materials": {
            "x-format": "{items}",
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "GuideQuestionGeneration": {
                "type": "object",
                "x-format": "**{loc.GuideQuestionGenerationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a teacher script (do NOT include the 'Say:' prefix) to introduce the question brainstorming session. Focus on moving from individual to partner sharing to expand ideas." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 specific moves to support student generation of questions. Include providing think time, capturing all questions publicly, and encouraging students to refine, combine, or expand questions without judgmental evaluation.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts to help students surface curiosities, identify what they want to understand, and focus on key aspects of the system or design." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "IdentifyResearchQuestion": {
                "type": "object",
                "x-format": "**{loc.IdentifyResearchQuestionTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script (do NOT include the 'Say:' prefix) to guide students in selecting a question that would help them learn the most from a testable model." },
                  "FacilitationMoves": { "type": "array", "description": "Suggest 2-3 moves to guide students in sorting questions into themes and comparing ideas based on testability. Include moves to support students in refining broad questions into clear investigations by identifying variables.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 prompts to help students evaluate questions based on testability, clarity, focus on variables, and potential to generate useful evidence." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CreateAnActionPlan": {
                "type": "object",
                "x-format": "**{loc.CreateAnActionPlanTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a script (do NOT include the 'Say:' prefix) to prompt students to define what they will observe, change, and collect as evidence." },
                  "FacilitationMoves": { "type": "array", "description": "Describe 2-3 moves to support students in designing an investigation plan and identifying variables. Include moves to press students to make plans specific and testable, and ensure they have a clear way to determine success.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 specific prompts to help students clarify what they will change, keep the same, and how they will compare results." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              }
            },
            "required": ["GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan"],
            "additionalProperties": false
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers"
        ],
        "additionalProperties": false
      },
      "InvestigationPhase": {
        "x-format": "### {green}({loc.InvestigationPhase})\n\n{loc.InvestigationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}\n\n{value.QuickCheck}",
        "type": "object",
        "description": "",
        "properties": {
          "Materials": {
            "x-format": "{items}",
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "LaunchInvestigation": {
                "type": "object",
                "x-format": "**{loc.LaunchTheInvestigationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create teacher instructions to introduce a puzzling scenario or model. First provide a bracketed action like [Display a model, scenario, demonstration, or short story that includes a flaw, inefficiency, or unexpected result to spark curiosity], then provide the conversational script (do NOT include the 'Say:' prefix)." },
                  "FacilitationMoves": { "type": "array", "description": "Generate 2-3 moves to guide the launch. State the instructional actions clearly without prefixing them with 'Say:'. Include giving students time to observe before acting, encouraging multiple interpretations, and reinforcing that there may be multiple valid ideas.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Generate 2-3 specific prompts to help students notice important or unexpected features, generate possible explanations, and justify thinking with evidence." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CollaborationExpectations": {
                "type": "object",
                "x-format": "**{loc.CollaborationExpectationsTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
                "properties": {
                  "Prompt": { "type": "string", "description": "Create a spoken script (do NOT include the 'Say:' prefix) to frame the task as interdependent and emphasize shared responsibility. Include instructions for students to use sentence starters (e.g., 'I think... because...') and participation structures like talking chips." },
                  "FacilitationMoves": { "type": "array", "description": "List 3-5 specific moves or student behaviors to monitor during group work (e.g., identifying patterns, recording in shared data tables, comparing interpretations). Do not prefix these actions with 'Say:'. Ensure they focus on all students contributing to observing and refining ideas.", "items": { "x-format": "- {value}", "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Provide 2-3 prompts to encourage students to share observations, compare interpretations, justify claims with evidence, and collaboratively revise ideas." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CirculationPrompts": {
                "type": "object",
                "x-format": "**{loc.CirculationPromptsTitle}**\n\n**{loc.ConceptualPromptsTitle}**\n\n{value.Conceptual}\n\n**{loc.ReasoningPromptsTitle}**\n\n{value.Reasoning}\n\n**{loc.CollaborationPromptsTitle}**\n\n{value.Collaboration}",
                "description": "Specific prompts to be used by the teacher while circulating between groups.",
                "properties": {
                  "Conceptual": { "type": "array", "description": "2-3 prompts focusing on key scientific or lesson concepts (e.g., 'What evidence shows this is working?').", "items": { "x-format": "- {value}", "type": "string" } },
                  "Reasoning": { "type": "array", "description": "2-3 prompts to press for justification and logic (e.g., 'How does this trial change your thinking?').", "items": { "x-format": "- {value}", "type": "string" } },
                  "Collaboration": { "type": "array", "description": "2-3 prompts to ensure all voices are included (e.g., 'Who has not contributed yet?').", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Conceptual", "Reasoning", "Collaboration"],
                "additionalProperties": false
              }
            },
            "required": ["LaunchInvestigation", "CollaborationExpectations", "CirculationPrompts"],
            "additionalProperties": false
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "x-format": "### ⚠️ {loc.AnticipatedMisconceptions}{items}",
            "description": "Generate 2-3 common student misconceptions likely to arise during this lesson. Each item must focus on a specific misunderstanding and a teacher response script.",
            "items": {
              "type": "object",
              "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponseLabel}: {value.TeacherResponse}",
              "properties": {
                "Misconception": { "type": "string", "description": "Describe the misconception in 1 sentence, starting with 'Students may think...'. DO NOT use any bolding or strong tags." },
                "TeacherResponse": { "type": "string", "description": "A clear teacher-facing response script that models how to respond in the moment with a specific prompt (do NOT include the 'Say:' prefix). DO NOT use any bolding or strong tags." }
              },
              "required": ["Misconception", "TeacherResponse"],
              "additionalProperties": false
            }
          },
          "Differentiation": {
            "type": "object",
            "x-format": "### 🪜 {loc.Differentiation}\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
            "properties": {
              "LanguageLearners": {
                "type": "object",
                "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 lesson-specific supports (visuals, word banks, gestures) to help language learners access and express ideas.", "items": { "x-format": "- {value}", "type": "string" } },
                  "SentenceStarters": { "type": "array", "description": "Generate 3-4 sentence starters that help students describe, explain, and communicate their thinking for this specific lesson.", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Strategies", "SentenceStarters"],
                "additionalProperties": false
              },
              "AdditionalScaffolding": {
                "type": "object",
                "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 step-by-step supports (structured tools, modeled examples, think-alouds) and exact guidance to help students complete the task.", "items": { "x-format": "- {value}", "type": "string" } },
                  "Checklist": { "type": "array", "description": "Generate 3-4 checklist questions to guide students in making sense of their learning during the investigation.", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Strategies", "Checklist"],
                "additionalProperties": false
              },
              "GoDeeper": {
                "type": "object",
                "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                "properties": {
                  "Strategies": { "type": "array", "description": "Generate 2-3 extensions that increase complexity (specific challenges, pattern identification) to help students deepen or improve their thinking uses evidence.", "items": { "x-format": "- {value}", "type": "string" } },
                  "AdvancedQuestion": { "type": "string", "description": "Generate one complex prompt (do NOT include the 'Say:' prefix)/question to press for deeper conceptual understanding." },
                  "ExpectedResponses": { "type": "array", "description": "Generate 3-4 specific examples of high-quality student responses to the advanced question.", "items": { "x-format": "- {value}", "type": "string" } }
                },
                "required": ["Strategies", "AdvancedQuestion", "ExpectedResponses"],
                "additionalProperties": false
              }
            },
            "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
            "additionalProperties": false
          },
          "AccommodationsAndModifications": {
            "x-format": "### 🤝 {loc.AccommodationsAndModifications}\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
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
          },
          "QuickCheck": {
            "type": "object",
            "x-format": "### ✔ {loc.QuickCheck}\n\n{value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
            "properties": {
              "Question": { "type": "string", "description": "Generate one specific question (do NOT include the 'Say:' prefix) to check for student understanding during or at the end of the investigation." },
              "ExpectedResponses": { "type": "array", "description": "Generate 3-4 Expected Student Responses that show mastery of the lesson concept.", "items": { "x-format": "- {value}", "type": "string" } }
            },
            "required": ["Question", "ExpectedResponses"],
            "additionalProperties": false
          }
        },
        "required": [
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
        "x-format": "### {green}({loc.ConclusionPhase})\n\n{loc.ConclusionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "description": "",
        "properties": {
          "Materials": {
            "x-format": "{items}",
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "x-format": "{value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}\n\n{value.WritingPrompt}\n\n{value.CollaborationInstruction}\n\n*{value.Guardrail}*",
            "properties": {
              "OpeningScript": { "type": "string", "description": "A statement (do NOT include the 'Say:' prefix) to bring students back to the research question and surfacing emerging ideas about how the design works." },
              "FacilitationMoves": { "type": "array", "description": "2-3 pedagogical moves to give students time to review data, identify patterns, and compare results through discussion.", "items": { "x-format": "{value}\n\n", "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 specific questions to push students to explain patterns, justify decisions with evidence, and describe cause-and-effect relationships.", "items": { "x-format": "- {value}", "type": "string" } },
              "WritingPrompt": { "type": "string", "description": "A statement (do NOT include the 'Say:' prefix) outlining what their written explanation must include (content-specific components) and a reminder to use data as evidence." },
              "CollaborationInstruction": { "type": "string", "description": "Instruction for students to write independently then share with a partner or group to refine their reasoning." },
              "Guardrail": { "type": "string", "description": "A firm reminder that the teacher should NOT provide the scientific explanation, but instead press students to point to data." }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions", "WritingPrompt", "CollaborationInstruction", "Guardrail"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "3-4 responses that directly answer the research question using evidence and cause-and-effect reasoning (e.g., 'when we changed ___, ___ happened').",
            "items": { "x-format": "- {value}", "type": "string" }
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "DiscussionPhase": {
        "x-format": "### {green}({loc.DiscussionPhase})\n\n{loc.DiscussionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n**🌍 {loc.TranscendentThinking}:**\n\n{value.TranscendentThinking}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "properties": {
          "Materials": {
            "x-format": "{items}",
            "type": "array",
            "description": "List of required materials (e.g. visual aids, markers, etc.)",
            "items": { "x-format": "- {value}", "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "x-format": "**{loc.Say}:** {value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}",
            "properties": {
              "OpeningScript": { "type": "string", "description": "A statement (do NOT include the 'Say:' prefix) to prompt students to think about the broader implications of their evidence beyond the classroom." },
              "FacilitationMoves": { "type": "array", "description": "2-3 pedagogical moves to encourage students to discuss with partners/groups and generate their own examples of real-world impact.", "items": { "x-format": "{value}\n\n", "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 specific questions to connect the investigation results to everyday life, community issues, or system redesign.", "items": { "x-format": "- {value}", "type": "string" } }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions"],
            "additionalProperties": false
          },
          "TranscendentThinking": {
            "type": "object",
            "x-format": "{value.Question}",
            "properties": {
              "Question": { "type": "string", "description": "Generate 1 transcendent thinking question that requires students to apply learning beyond themselves to real-world contexts (communities, global challenges). Focus on why learning matters at scale (safety, sustainability, innovation, etc.). Avoid personal/school-only focus." }
            },
            "required": ["Question"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "4-5 responses illustrating how students might apply their understanding to authentic, real-world contexts or future-oriented problem solving.",
            "items": { "x-format": "- {value}", "type": "string" }
          }
        },
        "required": [
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.InstructionsForTeachers}",
        "type": "object",
        "description": "Full 'Review & Spaced Retrieval' section. This 5-minute activity must include: 1. Instructions for Teachers containing: - Active Recall prompt using partner/group sharing - Expected Student Responses (2-3 bulleted examples) 2. Essential Question Connection 3. Transcendent Thinking section 4. Spaced Retrieval component containing: - Clear reference to specific prior lesson - Question connecting past + current concepts - Detailed success criteria / expected responses All sections must provide direct teacher prompts without the 'Say:' prefix and clearly labeled 'Expected Student Responses' showing 2-3 sample answers.",
        "properties": {
          "TeacherNotes": {
            "type": "string",
            "description": "Teacher notes explaining how this review strategy strengthens retention through active recall and connects the investigation to core science ideas."
          },
          "InstructionsForTeachers": {
            "type": "object",
            "x-format": "{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
            "description": "Step-by-step teacher guidance for the 5-minute review and spaced retrieval session.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "x-format": "### 🔁 {loc.ActiveRecall}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
                "description": "Prompt students to retrieve key learning from today's lesson using only evidence from the investigation.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A specific teacher script (do NOT include the 'Say:' prefix) that prompts students to reflect on today's investigation and what it revealed about the system."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 examples of high-quality student responses showing clear use of evidence.",
                    "items": { "x-format": "- {value}", "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "x-format": "### 💭 {loc.EssentialQuestionConnection}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
                "description": "Help students connect today's specific evidence to the broader unit essential questions.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "A teacher script (do NOT include the 'Say:' prefix) that links today's findings to one of the unit's essential questions."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 examples of how students justify the connection using evidence.",
                    "items": { "x-format": "- {value}", "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "x-format": "### ⏳ {loc.SpacedRetrieval}\n\n**{loc.Say}:** {value.TeacherSay}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
                "description": "Revisit a concept from a previous unit or lesson to strengthen cumulative retention.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "A teacher script (do NOT include the 'Say:' prefix) that explicitly connects a concept from a prior lesson to today's work. Must include the meta-reference (e.g., '(Draws from Unit 1, Lesson 2.)') directly in the text."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "1-2 examples of high-quality student responses showing clear recall of evidence from prior learning.",
                    "items": { "x-format": "- {value}", "type": "string" }
                  }
                },
                "required": ["TeacherSay", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["ActiveRecall", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["TeacherNotes", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "x-format": "### ✅ {loc.FormativeAssessment}\n\n{items}",
        "type": "array",
        "description": "Exactly 4 Formative Assessment prompts, one for each DOK level.",
        "items": {
          "x-format": "\n\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}",
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
              "description": "1-2 sample responses showing mastery."
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
        "x-format": "### 🖋️ {loc.StudentPractice}\n\n**{loc.TeacherNotes}:** {loc.StudentPracticeNotes}\n\n{value.Tasks}\n\n**🔎 {loc.Reflection}:**\n\n{value.Reflection}",
        "type": "object",
        "description": "Full 'Student Practice' section for homework / out-of-class practice.",
        "properties": {
          "Tasks": {
            "type": "array",
            "description": "Generate 3 tasks covering DOK levels 2 and 3.",
            "items": {
              "type": "object",
              "x-format": "\n\n**{value.TaskTitle}**\n\n{value.Instruction}\n\n{value.SuccessCriteria}",
              "properties": {
                "TaskTitle": { "type": "string", "description": "e.g., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Clear step-by-step student directions for the task." },
                "SuccessCriteria": { "type": "array", "description": "4-5 specific, evidence-based bullet points showing what mastery looks like for this task. CRITICAL: Every criterion MUST start with an action verb (e.g., 'Describes', 'Explains', 'Uses').", "items": { "x-format": "- {value}", "type": "string" } }
              },
              "required": ["TaskTitle", "Instruction", "SuccessCriteria"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "description": "End with self-regulation or transcendent thinking reflections.",
            "properties": {
              "Instruction": { "type": "string", "description": "Instruction for the reflection section (e.g., 'Write 2–3 sentences responding to one prompt:')." },
              "Prompts": { "type": "array", "description": "4-5 specific reflection prompts connecting today's inquiry to real life, future tools, or personal learning.", "items": { "x-format": "- {value}", "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "AssessPriorKnowledge",
      "EssentialQuestions",
      "KeyVocabulary",
      "StudentLearningObjectives",
      "StandardsAligned",
      "OrientationPhase",
      "ConceptualizationPhase",
      "InvestigationPhase",
      "ConclusionPhase",
      "DiscussionPhase",
      "ReviewAndSpacedRetrieval",
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
      "SpacedLearningAndRetrieval": [
        "ReviewAndSpacedRetrieval"
      ],
      "FormativeAssessment": [
        "FormativeAssessment"
      ],
      "AccommodationsAndModifications": [
        "InvestigationPhase.AccommodationsAndModifications"
      ]
    }
  }
};
