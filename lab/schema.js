window.masterSchema = `
{
 "title": "LabUnitPlanResponse",
 "type": "object",
 "description": "Generate a complete lab-based unit plan and lesson plans using the provided unit inputs (subject, unit name, grade level, class duration, resources/media, and any attached unit content). The output MUST strictly follow this JSON schema: do not omit required fields, do not add extra fields, and do not change field names. All narrative text must be teacher-ready, specific, and free of placeholders like 'e.g.' or 'TBD'. Apply cognitive science principles throughout: include an Attention Reset & Interactive Activity before introducing any new concept or phase, embed spaced retrieval across the unit with expanding intervals, mix/interleave skills and strategies where practice occurs, and consistently build transfer to real-world contexts. Ensure cultural relevance and inclusion by incorporating multiple perspectives, connecting to varied communities, and avoiding stereotypes.",
 "properties": {
  "UnitTitle": {
   "type": "string",
   "description": "Unit title as a single line of plain text, use exactly the Unit Name given in the prompt."
  },
  "UnitDescription": {
   "type": "string",
   "description": "Unit description as one cohesive plain-text paragraph (4–5 complete sentences) written in natural teacher voice that could be spoken directly to students. It must include a curiosity hook, learning goals, thinking skills, real-world relevance, and why the learning matters long-term."
  },
  "EssentialQuestions": {
   "type": "array",
   "minItems": 3,
   "maxItems": 3,
   "description": "Three broad, universal, open-ended questions focused on big ideas like change, evidence, systems, or reasoning. Questions must be transferable across disciplines and not reference subject-specific content.",
   "items": {
    "type": "string"
   }
  },
  "StudentLearningObjectives": {
   "type": "array",
   "description": "Clear, measurable unit-level learning objectives written in student-friendly language. Each objective must begin with a measurable verb and end with a DOK level in parentheses.",
   "items": {
    "type": "string"
   }
  },
  "StandardsAligned": {
   "type": "array",
   "description": "All unique NGSS standards used anywhere in this unit or its lessons. Only include standards that appear in lesson content.",
   "items": {
    "type": "string"
   }
  },
  "Lessons": {
   "type": "array",
   "minItems": 1,
   "maxItems": 30,
   "description": "Chronological list of all lab lessons in the unit. Each lesson is a complete investigation following the cycle: Question, Research, Hypothesize, Experiment, Analyze, Share, plus review, formative assessment, and student practice.",
   "items": {
    "type": "object",
    "description": "One complete lab lesson plan. This object is fully defined inline in later sections of the schema.",
    "properties": {},
    "additionalProperties": false
   }
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
  "LessonMaterials",
  "PlannedTotalMinutes",
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
 "additionalProperties": false,
 "LessonNumber": {
  "type": "integer",
  "description": "Sequential lesson number within the unit (1-based index). Lesson numbers must increase by 1 for each lesson."
 },
 "LessonTitle": {
  "type": "string",
  "description": "Short, descriptive title that clearly reflects the focus of the lesson."
 },
 "EssentialQuestions": {
  "type": "array",
  "description": "The same three unit-level essential questions, pasted in the same order for reference during the lesson.",
  "items": {
   "type": "string"
  }
 },
 "KeyVocabulary": {
  "type": "array",
  "description": "Key vocabulary terms used in this lesson. Each entry must include the term and a short, student-friendly definition separated by a hyphen.",
  "items": {
   "type": "string"
  }
 },
 "StudentLearningObjectives": {
  "type": "array",
  "minItems": 2,
  "maxItems": 3,
  "description": "Lesson-specific learning objectives. Each objective must begin with a measurable verb and end with a DOK level in parentheses.",
  "items": {
   "type": "string"
  }
 },
 "StandardsAligned": {
  "type": "string",
  "description": "NGSS standard(s) addressed in this lesson, including both the standard code and full description."
 },
 "AssessPriorKnowledge": {
  "type": "string",
  "description": "Assess Prior Knowledge section. ONLY Lesson 1 includes a fully written section. All other lessons must return an empty string."
 },
 "LessonMaterials": {
  "type": "array",
  "description": "Complete list of all unique materials needed for this lesson across all phases. Do not duplicate items.",
  "items": {
   "type": "string"
  }
 },
 "PlannedTotalMinutes": {
  "type": "integer",
  "minimum": 1,
  "description": "Total planned instructional minutes for the lesson, excluding attention reset seconds."
 },
 "Question": {
  "type": "object",
  "description": "Lab phase: Question. Students observe a phenomenon and generate the guiding investigation question.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 1
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "TeacherScript": {
    "type": "string"
   },
   "ExpectedStudentWonderings": {
    "type": "array",
    "minItems": 3,
    "maxItems": 8,
    "items": {
     "type": "string"
    }
   },
   "FinalInvestigationQuestion": {
    "type": "string"
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "TeacherScript",
   "ExpectedStudentWonderings",
   "FinalInvestigationQuestion"
  ],
  "additionalProperties": false
 },
 "Research": {
  "type": "object",
  "description": "Lab phase: Research. Students gather background knowledge and evidence.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 1
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "TeacherScript": {
    "type": "string"
   },
   "AnticipatedMisconceptions": {
    "type": "array",
    "minItems": 2,
    "items": {
     "type": "object",
     "properties": {
      "Misconception": {
       "type": "string"
      },
      "TeacherResponseScript": {
       "type": "string"
      }
     },
     "required": [
      "Misconception",
      "TeacherResponseScript"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "TeacherScript",
   "AnticipatedMisconceptions"
  ],
  "additionalProperties": false
 },
 "Hypothesize": {
  "type": "object",
  "description": "Lab phase: Hypothesize. Students generate a testable prediction.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 1
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "SentenceStarters": {
    "type": "array",
    "minItems": 3,
    "maxItems": 5,
    "items": {
     "type": "string"
    }
   },
   "TeacherSteps": {
    "type": "string"
   },
   "ExpectedStudentHypotheses": {
    "type": "array",
    "minItems": 3,
    "maxItems": 6,
    "items": {
     "type": "string"
    }
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "SentenceStarters",
   "TeacherSteps",
   "ExpectedStudentHypotheses"
  ],
  "additionalProperties": false
 },
 "Experiment": {
  "type": "object",
  "description": "Lab phase: Experiment. Students conduct the investigation and collect data.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 5
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "GroupRoles": {
    "type": "array",
    "items": {
     "type": "object",
     "properties": {
      "RoleName": {
       "type": "string"
      },
      "Responsibilities": {
       "type": "array",
       "items": {
        "type": "string"
       }
      }
     },
     "required": [
      "RoleName",
      "Responsibilities"
     ],
     "additionalProperties": false
    }
   },
   "DataTableColumns": {
    "type": "array",
    "minItems": 3,
    "items": {
     "type": "string"
    }
   },
   "ProcedureSteps": {
    "type": "array",
    "minItems": 5,
    "items": {
     "type": "object",
     "properties": {
      "StepNumber": {
       "type": "integer",
       "minimum": 1
      },
      "TeacherScript": {
       "type": "string"
      },
      "StudentAction": {
       "type": "string"
      },
      "WhatToObserveOrMeasure": {
       "type": "array",
       "items": {
        "type": "string"
       }
      }
     },
     "required": [
      "StepNumber",
      "TeacherScript",
      "StudentAction",
      "WhatToObserveOrMeasure"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "GroupRoles",
   "DataTableColumns",
   "ProcedureSteps"
  ],
  "additionalProperties": false
 },
 "Analyze": {
  "type": "object",
  "description": "Lab phase: Analyze. Students interpret data and draw conclusions.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 3
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "TeacherModelExample": {
    "type": "string"
   },
   "StudentAnalysisTask": {
    "type": "string"
   },
   "SentenceStarters": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "ExamplesOfHighQualityStudentAnalysis": {
    "type": "array",
    "items": {
     "type": "string"
    }
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "TeacherModelExample",
   "StudentAnalysisTask",
   "SentenceStarters",
   "ExamplesOfHighQualityStudentAnalysis"
  ],
  "additionalProperties": false
 },
 "Share": {
  "type": "object",
  "description": "Lab phase: Share. Students communicate findings.",
  "properties": {
   "AttentionResetAndInteractiveActivity": {
    "type": "object",
    "properties": {
     "DurationSeconds": {
      "type": "integer",
      "minimum": 20,
      "maximum": 45
     },
     "Materials": {
      "type": "array",
      "items": {
       "type": "string"
      }
     },
     "TeacherDirections": {
      "type": "string"
     },
     "ConnectionToUpcomingContent": {
      "type": "string"
     }
    },
    "required": [
     "DurationSeconds",
     "Materials",
     "TeacherDirections",
     "ConnectionToUpcomingContent"
    ],
    "additionalProperties": false
   },
   "TimeMinutes": {
    "type": "integer",
    "minimum": 3
   },
   "Purpose": {
    "type": "string"
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "TeacherDirections": {
    "type": "string"
   },
   "ShareOutStructure": {
    "type": "array",
    "items": {
     "type": "string"
    }
   }
  },
  "required": [
   "AttentionResetAndInteractiveActivity",
   "TimeMinutes",
   "Purpose",
   "Materials",
   "TeacherDirections",
   "ShareOutStructure"
  ],
  "additionalProperties": false
 },
 "ReviewAndSpacedRetrieval": {
  "type": "object",
  "description": "End-of-lesson review that consolidates learning and includes spaced retrieval.",
  "properties": {
   "TimeMinutes": {
    "type": "integer",
    "minimum": 3
   },
   "Materials": {
    "type": "array",
    "items": {
     "type": "string"
    }
   },
   "TeacherNotes": {
    "type": "string"
   },
   "ActiveRecall": {
    "type": "object",
    "properties": {
     "TeacherPrompt": {
      "type": "string"
     },
     "ExpectedStudentResponses": {
      "type": "array",
      "items": {
       "type": "string"
      }
     }
    },
    "required": [
     "TeacherPrompt",
     "ExpectedStudentResponses"
    ],
    "additionalProperties": false
   },
   "CorrectCommonMisconceptions": {
    "type": "array",
    "minItems": 1,
    "items": {
     "type": "object",
     "properties": {
      "Misconception": {
       "type": "string"
      },
      "TeacherResponseScript": {
       "type": "string"
      }
     },
     "required": [
      "Misconception",
      "TeacherResponseScript"
     ],
     "additionalProperties": false
    }
   },
   "EssentialQuestionConnection": {
    "type": "object",
    "properties": {
     "TeacherPrompt": {
      "type": "string"
     },
     "ExpectedStudentResponses": {
      "type": "array",
      "items": {
       "type": "string"
      }
     }
    },
    "required": [
     "TeacherPrompt",
     "ExpectedStudentResponses"
    ],
    "additionalProperties": false
   },
   "TranscendentThinking": {
    "type": "object",
    "properties": {
     "TeacherPrompt": {
      "type": "string"
     },
     "ExpectedStudentResponses": {
      "type": "array",
      "items": {
       "type": "string"
      }
     }
    },
    "required": [
     "TeacherPrompt",
     "ExpectedStudentResponses"
    ],
    "additionalProperties": false
   },
   "SpacedRetrievalTasks": {
    "type": "array",
    "minItems": 1,
    "items": {
     "type": "object",
     "properties": {
      "ScheduledLessonNumber": {
       "type": "integer",
       "minimum": 1
      },
      "ConceptTag": {
       "type": "string"
      },
      "DrawsFromLessons": {
       "type": "array",
       "items": {
        "type": "integer",
        "minimum": 1
       }
      },
      "DOKLevel": {
       "type": "integer",
       "enum": [
        2,
        3,
        4
       ]
      },
      "ActiveRecallFormat": {
       "type": "string"
      },
      "Prompt": {
       "type": "string"
      },
      "ExpectedStudentResponse": {
       "type": "string"
      },
      "SuccessCriteria": {
       "type": "array",
       "items": {
        "type": "string"
       }
      }
     },
     "required": [
      "ScheduledLessonNumber",
      "ConceptTag",
      "DrawsFromLessons",
      "DOKLevel",
      "ActiveRecallFormat",
      "Prompt",
      "ExpectedStudentResponse",
      "SuccessCriteria"
     ],
     "additionalProperties": false
    }
   }
  },
  "required": [
   "TimeMinutes",
   "Materials",
   "TeacherNotes",
   "ActiveRecall",
   "CorrectCommonMisconceptions",
   "EssentialQuestionConnection",
   "TranscendentThinking",
   "SpacedRetrievalTasks"
  ],
  "additionalProperties": false
 },
 "FormativeAssessment": {
  "type": "object",
  "properties": {
   "TeacherImplementationNotes": {
    "type": "string"
   },
   "Prompts": {
    "type": "array",
    "minItems": 4,
    "maxItems": 4,
    "items": {
     "type": "object",
     "properties": {
      "DOKLevel": {
       "type": "integer",
       "enum": [
        1,
        2,
        3,
        4
       ]
      },
      "Prompt": {
       "type": "string"
      },
      "ExpectedStudentResponses": {
       "type": "array",
       "items": {
        "type": "string"
       }
      }
     },
     "required": [
      "DOKLevel",
      "Prompt",
      "ExpectedStudentResponses"
     ],
     "additionalProperties": false
    }
   },
   "RecommendedStrategy": {
    "type": "string"
   }
  },
  "required": [
   "TeacherImplementationNotes",
   "Prompts",
   "RecommendedStrategy"
  ],
  "additionalProperties": false
 },
 "StudentPractice": {
  "type": "object",
  "properties": {
   "TeacherNotes": {
    "type": "string"
   },
   "Tasks": {
    "type": "array",
    "minItems": 2,
    "items": {
     "type": "object",
     "properties": {
      "DOKLevel": {
       "type": "integer",
       "enum": [
        2,
        3,
        4
       ]
      },
      "StudentDirections": {
       "type": "string"
      },
      "RealWorldConnection": {
       "type": "string"
      },
      "TeacherNotes": {
       "type": "string"
      },
      "ExpectedAnswersOrSuccessCriteria": {
       "type": "array",
       "items": {
        "type": "string"
       }
      },
      "InterleavingConnection": {
       "type": "string"
      }
     },
     "required": [
      "DOKLevel",
      "StudentDirections",
      "RealWorldConnection",
      "TeacherNotes",
      "ExpectedAnswersOrSuccessCriteria",
      "InterleavingConnection"
     ],
     "additionalProperties": false
    }
   },
   "ReflectionPrompt": {
    "type": "string"
   }
  },
  "required": [
   "TeacherNotes",
   "Tasks",
   "ReflectionPrompt"
  ],
  "additionalProperties": false
 }
}
`;
