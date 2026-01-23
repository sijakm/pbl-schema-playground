console.log("schema.js loading");
window.masterSchema = `
{
  "title": "InquiryUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitTitle",
    "UnitDescription",
    "EssentialQuestions",
    "StudentLearningObjectives",
    "StandardsAligned",
    "KeyVocabulary",
    "AssessPriorKnowledge",
    "InquiryPhases",
    "FormativeAssessment",
    "StudentPractice",
    "ReflectionAndTranscendentThinking",
    "SpacedRetrieval"
  ],
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
      "minItems": 3,
      "maxItems": 3,
      "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
      "items": { "type": "string" }
    },

    "StudentLearningObjectives": {
      "type": "array",
      "description": "Full 'Student Learning Objectives' section for this inquiry unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses.",
      "items": { "type": "string" }
    },

    "StandardsAligned": {
      "type": "array",
      "description": "List all unique standards used anywhere in this inquiry unit. Do NOT add standards that do not appear in the unit content.",
      "items": { "type": "string" }
    },

    "KeyVocabulary": {
      "type": "array",
      "description": "Key vocabulary required to engage in the inquiry. Each entry must include a term and a concise, age-appropriate definition.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": ["Term", "Definition"],
        "properties": {
          "Term": { "type": "string" },
          "Definition": { "type": "string" }
        }
      }
    },

    "AssessPriorKnowledge": {
      "type": "string",
      "description": "Full 'Assess Prior Knowledge' section as plain text. This section appears ONLY at the beginning of the unit. It must surface student ideas and misconceptions using questioning, anticipation guides, modeling, or movement. Include teacher 'Say:' prompts, expected student responses, and at least two alternate approaches."
    },

    "InquiryPhases": {
      "type": "array",
      "minItems": 4,
      "description": "Sequential inquiry phases that guide students from defining a problem through investigation, sensemaking, and reflection.",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "required": [
          "PhaseTitle",
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "FacilitationMoves",
          "ExpectedStudentResponses"
        ],
        "properties": {
          "PhaseTitle": {
            "type": "string",
            "description": "Name of the inquiry phase (e.g., Orientation, Conceptualization, Investigation, Conclusion, Discussion)."
          },
          "Purpose": {
            "type": "string",
            "description": "Explanation of why this phase exists and what kind of student thinking it is designed to develop."
          },
          "Materials": {
            "type": "array",
            "description": "List of materials or resources needed for this phase.",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "string",
            "description": "Step-by-step teacher guidance written in facilitative language that supports inquiry without explaining the science directly."
          },
          "FacilitationMoves": {
            "type": "array",
            "description": "Questions, prompts, and discourse strategies teachers use to deepen student reasoning.",
            "items": { "type": "string" }
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "Likely student ideas, hypotheses, or reasoning that may emerge during this phase.",
            "items": { "type": "string" }
          }
        }
      }
    },

    "FormativeAssessment": {
      "type": "string",
      "description": "Full 'Formative Assessment' section as plain text. Must include 3–4 prompts across DOK levels with expected student responses showing understanding."
    },

    "StudentPractice": {
      "type": "string",
      "description": "Full 'Student Practice' section as plain text. Includes independent or at-home tasks that reinforce inquiry concepts, with expected student responses and reflection."
    },

    "ReflectionAndTranscendentThinking": {
      "type": "string",
      "description": "Prompt that asks students to explain why the inquiry matters beyond the classroom, including implications for future learning, society, or human understanding."
    },

    "SpacedRetrieval": {
      "type": "string",
      "description": "Spaced retrieval prompt that explicitly connects this inquiry to prior units or lessons."
    }

  }
}
`;
