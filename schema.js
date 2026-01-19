const masterSchema = `{
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": ["UnitPlan"],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "additionalProperties": false,
      "description": "Return a complete Project-Based Learning (PBL) Unit Plan. Do NOT add extra keys. Populate every required field. Must work for ANY subject. Localize stakeholders/audience/resources to provided zip/location without inventing exact addresses/phone numbers.",
      "required": [
        "UnitMeta",
        "UnitDescription",
        "AssessPriorKnowledge",
        "UnitOverview",
        "DesiredOutcomes",
        "FramingTheLearning",
        "KeyVocabulary",
        "AssessmentPlan",
        "AuthenticAudience",
        "LearningPlan",
        "TeacherGuidancePhasesFlat",
        "UnitPreparationAndConsiderations"
      ],
      "properties": {
        "UnitMeta": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "UnitSubject",
            "UnitName",
            "GradeLevel",
            "ClassDurationMinutes",
            "ProjectDurationDays",
            "Location",
            "ZipCode"
          ],
          "properties": {
            "UnitSubject": { "type": "string", "description": "Subject/discipline as provided. No emojis." },
            "UnitName": { "type": "string", "description": "Unit name/title as provided. No emojis." },
            "GradeLevel": { "type": "string", "description": "Grade level label as provided." },
            "ClassDurationMinutes": { "type": "integer", "minimum": 10, "description": "Length of one class period in minutes." },
            "ProjectDurationDays": { "type": "integer", "minimum": 1, "description": "How many days the project lasts. Must influence pacing, milestones, retrieval, and student practice." },
            "ZipCode": { "type": "string", "description": "Zip code used to localize examples, sites, stakeholders, and audiences." },
            "Location": {
              "type": "object",
              "additionalProperties": false,
              "required": ["City", "Region", "Country"],
              "properties": {
                "City": { "type": "string" },
                "Region": { "type": "string" },
                "Country": { "type": "string" }
              }
            }
          }
        },

        "UnitDescription": {
          "type": "string",
          "description": "ONE cohesive paragraph (4–5 complete sentences): hook, mastery outcomes, skills/transfer, real-world relevance, purpose/impact; must reference the local community naturally."
        },

        "AssessPriorKnowledge": {
          "type": "string",
          "description": "If this is the FIRST entry-point for the unit: include DOK 1–3 diagnostic prompts + modality + 2 alternate options. Otherwise return empty string."
        },

        "UnitOverview": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "TaskStatement",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatement": {
              "type": "string",
              "description": "Student-facing launch message (400–600 words) written like a credible local organization/person. Urgent, meaningful, authentic. No standards/rubrics/pacing."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "One strong open-ended Driving Question grounded in place and stakeholder need. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Paragraph starting with 'Your task is to…' describing what students will create/do and why it matters to the community/audience."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Short narrative: who is impacted, why it matters now locally, and which stakeholders/audiences care."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "minItems": 4,
              "items": { "type": "string" },
              "description": "Bulleted list of what the final product must include (format + evidence + components). No rubric language."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Inspiring close: the community/audience is counting on students; emphasize impact."
            }
          }
        },

        "DesiredOutcomes": {
          "type": "object",
          "additionalProperties": false,
          "required": ["StandardsAligned", "BigIdeasAndEssentialQuestions", "LearningObjectives"],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "minItems": 1,
              "items": { "type": "string" },
              "description": "Standards listed verbatim when provided, format 'CODE: description'."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "description": "3–4 entries. Each entry has one BigIdea sentence and one EssentialQuestion.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["BigIdea", "EssentialQuestion"],
                "properties": {
                  "BigIdea": { "type": "string" },
                  "EssentialQuestion": { "type": "string" }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "additionalProperties": false,
              "required": ["StudentsWillUnderstandThat", "StudentsWillKnowThat", "StudentsWillBeAbleTo"],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": { "type": "string" },
                  "description": "Each objective ends with '(DOK X)'."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": { "type": "string" },
                  "description": "Each objective ends with '(DOK X)'."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "minItems": 2,
                  "items": { "type": "string" },
                  "description": "Each objective ends with '(DOK X)'."
                }
              }
            }
          }
        },

        "FramingTheLearning": {
          "type": "object",
          "additionalProperties": false,
          "required": ["DrivingQuestion", "Problem", "Project", "Place"],
          "properties": {
            "DrivingQuestion": {
              "type": "string",
              "description": "MUST match UnitOverview.DrivingQuestion verbatim."
            },
            "Problem": {
              "type": "string",
              "description": "2–3 student-facing paragraphs defining ONE focused, solvable real-world problem; why it matters now locally; consequences; likely causes."
            },
            "Project": {
              "type": "string",
              "description": "Narrative of how learning builds across the multi-day project (inquiry → apply → refine → present). Not a day-by-day schedule."
            },
            "Place": {
              "type": "object",
              "additionalProperties": false,
              "required": ["PlaceOverview", "Sites", "PlaceMattersReminder"],
              "properties": {
                "PlaceOverview": { "type": "string", "description": "How local context shapes problem, question, product." },
                "Sites": {
                  "type": "array",
                  "minItems": 3,
                  "maxItems": 4,
                  "description": "3–4 place-specific sites (no exact addresses).",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["TheSite", "Engagement", "Relevance"],
                    "properties": {
                      "TheSite": { "type": "string" },
                      "Engagement": { "type": "string" },
                      "Relevance": { "type": "string" }
                    }
                  }
                },
                "PlaceMattersReminder": {
                  "type": "string",
                  "description": "Reminder: local geography/history/culture/infrastructure must meaningfully affect student decisions and solutions."
                }
              }
            }
          }
        },

        "KeyVocabulary": {
          "type": "object",
          "additionalProperties": false,
          "required": ["VocabularyRationale", "Tiers"],
          "properties": {
            "VocabularyRationale": { "type": "string", "description": "Why vocab matters + how tiering supports differentiation." },
            "Tiers": {
              "type": "array",
              "minItems": 4,
              "maxItems": 4,
              "description": "Exactly 4 tiers; titles must be exactly the 4 specified tier titles written in TierTitle.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["TierTitle", "TierWhyItMatters", "Terms"],
                "properties": {
                  "TierTitle": {
                    "type": "string",
                    "description": "MUST be exactly one of these: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                  },
                  "TierWhyItMatters": { "type": "string" },
                  "Terms": {
                    "type": "array",
                    "minItems": 3,
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "required": ["Term", "Definition", "StandardsConnection"],
                      "properties": {
                        "Term": { "type": "string" },
                        "Definition": { "type": "string" },
                        "StandardsConnection": { "type": "string", "description": "Format: 'Standards Connection: ...'." }
                      }
                    }
                  }
                }
              }
            }
          }
        },

        "AssessmentPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": ["FormativeAssessmentTable", "AnalyticRubric"],
          "properties": {
            "FormativeAssessmentTable": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["CriteriaForSuccess", "SuccessCriteria", "PointOfDemonstration"],
                "properties": {
                  "CriteriaForSuccess": { "type": "string" },
                  "SuccessCriteria": { "type": "string" },
                  "PointOfDemonstration": { "type": "string" }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "minItems": 4,
              "description": "4-level analytic rubric: Novice/Apprentice/Practitioner/Expert.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["Criterion", "Novice", "Apprentice", "Practitioner", "Expert"],
                "properties": {
                  "Criterion": { "type": "string" },
                  "Novice": { "type": "string" },
                  "Apprentice": { "type": "string" },
                  "Practitioner": { "type": "string" },
                  "Expert": { "type": "string" }
                }
              }
            }
          }
        },

        "AuthenticAudience": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "PrimaryAudienceDescription",
            "WhyThisAudienceIsQualified",
            "HowThisAudienceElevatesTheProject",
            "StudentParticipationInAudienceSelection"
          ],
          "properties": {
            "PrimaryAudienceDescription": { "type": "string" },
            "WhyThisAudienceIsQualified": { "type": "string" },
            "HowThisAudienceElevatesTheProject": { "type": "string" },
            "StudentParticipationInAudienceSelection": { "type": "string" }
          }
        },

        "LearningPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "CollaborativeStructuresAndArtifacts",
            "MilestonesAndIndicators",
            "VerticalAlignment",
            "CommunicationToAuthenticAudienceExpectations",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": { "type": "string" },
            "ProjectPhases": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "PhaseTitle",
                  "PhaseDescription",
                  "ConceptsOrSkills",
                  "CollaborationAndVisibleThinking",
                  "KeyLearningExperiences"
                ],
                "properties": {
                  "PhaseTitle": { "type": "string" },
                  "PhaseDescription": { "type": "string" },
                  "ConceptsOrSkills": { "type": "string" },
                  "CollaborationAndVisibleThinking": { "type": "string" },
                  "KeyLearningExperiences": { "type": "array", "minItems": 3, "items": { "type": "string" } }
                }
              }
            },
            "ProjectGoals": { "type": "array", "minItems": 3, "items": { "type": "string" } },
            "CollaborativeStructuresAndArtifacts": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "HowGroupsShareAndCompareIdeas",
                "HowThinkingIsDocumented",
                "WhereArtifactsAreCollected",
                "HowTeachersMonitorAndFacilitateDiscourse"
              ],
              "properties": {
                "HowGroupsShareAndCompareIdeas": { "type": "string" },
                "HowThinkingIsDocumented": { "type": "string" },
                "WhereArtifactsAreCollected": { "type": "string" },
                "HowTeachersMonitorAndFacilitateDiscourse": { "type": "string" }
              }
            },
            "MilestonesAndIndicators": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["MilestoneName", "Checkpoint", "ObservableIndicators", "HowIndicatorsAdjustWork"],
                "properties": {
                  "MilestoneName": { "type": "string" },
                  "Checkpoint": { "type": "string" },
                  "ObservableIndicators": { "type": "array", "minItems": 2, "items": { "type": "string" } },
                  "HowIndicatorsAdjustWork": { "type": "string" }
                }
              }
            },
            "VerticalAlignment": { "type": "string" },
            "CommunicationToAuthenticAudienceExpectations": { "type": "string" },
            "FinalDeliverableSummary": { "type": "array", "minItems": 4, "items": { "type": "string" } },
            "GroupSuggestions": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "GroupSize",
                "RotatingRolesAndDuties",
                "TeacherGroupingStrategyPrompt",
                "GroupingStrategyRecommendations"
              ],
              "properties": {
                "GroupSize": { "type": "string" },
                "RotatingRolesAndDuties": { "type": "array", "minItems": 4, "items": { "type": "string" } },
                "TeacherGroupingStrategyPrompt": { "type": "string" },
                "GroupingStrategyRecommendations": { "type": "array", "minItems": 4, "items": { "type": "string" } }
              }
            }
          }
        },

        "TeacherGuidancePhasesFlat": {
          "type": "object",
          "additionalProperties": false,
          "description": "Flat structure for exactly 3 phases. IMPORTANT: The PhaseTitle strings MUST be exactly: (1) 'Phase 1 – Launch' (2) 'Phase 2 - Exploration, Investigation, and Development; Refinement' (3) 'Phase 3 - Development; Refinement, Culmination, and Reflection'. If any differs, regenerate.",
          "required": [
            "Phase1_Title",
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation_LanguageLearners",
            "Phase1_Differentiation_Scaffolding",
            "Phase1_Differentiation_GoDeeper",
            "Phase1_Accommodations_General",
            "Phase1_Accommodations_IndividualSupport",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinkingPrompts",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_StudentPractice_Reflection",
            "Phase1_ReflectionPrompt",

            "Phase2_Title",
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation_LanguageLearners",
            "Phase2_Differentiation_Scaffolding",
            "Phase2_Differentiation_GoDeeper",
            "Phase2_Accommodations_General",
            "Phase2_Accommodations_IndividualSupport",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinkingPrompts",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_StudentPractice_Reflection",
            "Phase2_ReflectionPrompt",

            "Phase3_Title",
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation_LanguageLearners",
            "Phase3_Differentiation_Scaffolding",
            "Phase3_Differentiation_GoDeeper",
            "Phase3_Accommodations_General",
            "Phase3_Accommodations_IndividualSupport",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinkingPrompts",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_StudentPractice_Reflection",
            "Phase3_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_Title": { "type": "string", "description": "MUST be exactly: 'Phase 1 – Launch'." },
            "Phase1_FocusStatement": { "type": "string" },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["ActivityTitle", "StudentExperience", "ArtifactsOfLearning", "TeacherRoleMoves"],
                "properties": {
                  "ActivityTitle": { "type": "string" },
                  "StudentExperience": { "type": "string" },
                  "ArtifactsOfLearning": { "type": "array", "minItems": 2, "items": { "type": "string" } },
                  "TeacherRoleMoves": { "type": "string" }
                }
              }
            },
            "Phase1_GuidingQuestions": { "type": "array", "minItems": 4, "items": { "type": "string" } },
            "Phase1_Differentiation_LanguageLearners": { "type": "string" },
            "Phase1_Differentiation_Scaffolding": { "type": "string" },
            "Phase1_Differentiation_GoDeeper": { "type": "string" },
            "Phase1_Accommodations_General": { "type": "string" },
            "Phase1_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "description": "Exactly the provided students (if any). If none provided, return empty array.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["StudentName", "PlanProvided", "PlanImplementation"],
                "properties": {
                  "StudentName": { "type": "string" },
                  "PlanProvided": { "type": "string" },
                  "PlanImplementation": { "type": "string" }
                }
              }
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["Misconception", "CorrectionLanguage"],
                "properties": {
                  "Misconception": { "type": "string" },
                  "CorrectionLanguage": { "type": "string" }
                }
              }
            },
            "Phase1_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["Prompt", "ExpectedStudentResponses"],
                "properties": {
                  "Prompt": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } }
                }
              }
            },
            "Phase1_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["Timing", "Prompt", "SuccessCriteriaOrExpectedResponses"],
                "properties": {
                  "Timing": { "type": "string", "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'." },
                  "Prompt": { "type": "string" },
                  "SuccessCriteriaOrExpectedResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } }
                }
              }
            },
            "Phase1_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["Timing", "DrawsFrom", "Question", "DOK", "ExpectedResponseOrSuccessCriteria"],
                "properties": {
                  "Timing": { "type": "string", "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'." },
                  "DrawsFrom": { "type": "string" },
                  "Question": { "type": "string" },
                  "DOK": { "type": "integer", "minimum": 2, "maximum": 4 },
                  "ExpectedResponseOrSuccessCriteria": { "type": "string" }
                }
              }
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": ["TaskTitle", "DOK", "TeacherNote", "StudentDirections", "ExpectedAnswerOrSuccessCriteria"],
                "properties": {
                  "TaskTitle": { "type": "string" },
                  "DOK": { "type": "string" },
                  "TeacherNote": { "type": "string" },
                  "StudentDirections": { "type": "string" },
                  "ExpectedAnswerOrSuccessCriteria": { "type": "string" }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
            },
            "Phase1_StudentPractice_Reflection": { "type": "string" },
            "Phase1_ReflectionPrompt": { "type": "string" },

            "Phase2_Title": { "type": "string", "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'." },
            "Phase2_FocusStatement": { "type": "string" },
            "Phase2_CollaborativeActivities": { "type": "array", "minItems": 3, "maxItems": 5, "items": { "type": "object", "additionalProperties": false, "required": ["ActivityTitle", "StudentExperience", "ArtifactsOfLearning", "TeacherRoleMoves"], "properties": { "ActivityTitle": { "type": "string" }, "StudentExperience": { "type": "string" }, "ArtifactsOfLearning": { "type": "array", "minItems": 2, "items": { "type": "string" } }, "TeacherRoleMoves": { "type": "string" } } } },
            "Phase2_GuidingQuestions": { "type": "array", "minItems": 4, "items": { "type": "string" } },
            "Phase2_Differentiation_LanguageLearners": { "type": "string" },
            "Phase2_Differentiation_Scaffolding": { "type": "string" },
            "Phase2_Differentiation_GoDeeper": { "type": "string" },
            "Phase2_Accommodations_General": { "type": "string" },
            "Phase2_Accommodations_IndividualSupport": { "type": "array", "minItems": 0, "items": { "type": "object", "additionalProperties": false, "required": ["StudentName", "PlanProvided", "PlanImplementation"], "properties": { "StudentName": { "type": "string" }, "PlanProvided": { "type": "string" }, "PlanImplementation": { "type": "string" } } } },
            "Phase2_AnticipatedMisconceptions": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["Misconception", "CorrectionLanguage"], "properties": { "Misconception": { "type": "string" }, "CorrectionLanguage": { "type": "string" } } } },
            "Phase2_TranscendentThinkingPrompts": { "type": "array", "minItems": 1, "items": { "type": "object", "additionalProperties": false, "required": ["Prompt", "ExpectedStudentResponses"], "properties": { "Prompt": { "type": "string" }, "ExpectedStudentResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } } } } },
            "Phase2_QuickChecks": { "type": "array", "minItems": 3, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["Timing", "Prompt", "SuccessCriteriaOrExpectedResponses"], "properties": { "Timing": { "type": "string" }, "Prompt": { "type": "string" }, "SuccessCriteriaOrExpectedResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } } } } },
            "Phase2_SpacedRetrieval": { "type": "array", "minItems": 3, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["Timing", "DrawsFrom", "Question", "DOK", "ExpectedResponseOrSuccessCriteria"], "properties": { "Timing": { "type": "string" }, "DrawsFrom": { "type": "string" }, "Question": { "type": "string" }, "DOK": { "type": "integer", "minimum": 2, "maximum": 4 }, "ExpectedResponseOrSuccessCriteria": { "type": "string" } } } },
            "Phase2_StudentPractice_Tasks": { "type": "array", "minItems": 2, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["TaskTitle", "DOK", "TeacherNote", "StudentDirections", "ExpectedAnswerOrSuccessCriteria"], "properties": { "TaskTitle": { "type": "string" }, "DOK": { "type": "string" }, "TeacherNote": { "type": "string" }, "StudentDirections": { "type": "string" }, "ExpectedAnswerOrSuccessCriteria": { "type": "string" } } } },
            "Phase2_StudentPractice_InterleavingIfMath": { "type": "string" },
            "Phase2_StudentPractice_Reflection": { "type": "string" },
            "Phase2_ReflectionPrompt": { "type": "string" },

            "Phase3_Title": { "type": "string", "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'." },
            "Phase3_FocusStatement": { "type": "string" },
            "Phase3_CollaborativeActivities": { "type": "array", "minItems": 3, "maxItems": 5, "items": { "type": "object", "additionalProperties": false, "required": ["ActivityTitle", "StudentExperience", "ArtifactsOfLearning", "TeacherRoleMoves"], "properties": { "ActivityTitle": { "type": "string" }, "StudentExperience": { "type": "string" }, "ArtifactsOfLearning": { "type": "array", "minItems": 2, "items": { "type": "string" } }, "TeacherRoleMoves": { "type": "string" } } } },
            "Phase3_GuidingQuestions": { "type": "array", "minItems": 4, "items": { "type": "string" } },
            "Phase3_Differentiation_LanguageLearners": { "type": "string" },
            "Phase3_Differentiation_Scaffolding": { "type": "string" },
            "Phase3_Differentiation_GoDeeper": { "type": "string" },
            "Phase3_Accommodations_General": { "type": "string" },
            "Phase3_Accommodations_IndividualSupport": { "type": "array", "minItems": 0, "items": { "type": "object", "additionalProperties": false, "required": ["StudentName", "PlanProvided", "PlanImplementation"], "properties": { "StudentName": { "type": "string" }, "PlanProvided": { "type": "string" }, "PlanImplementation": { "type": "string" } } } },
            "Phase3_AnticipatedMisconceptions": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["Misconception", "CorrectionLanguage"], "properties": { "Misconception": { "type": "string" }, "CorrectionLanguage": { "type": "string" } } } },
            "Phase3_TranscendentThinkingPrompts": { "type": "array", "minItems": 1, "items": { "type": "object", "additionalProperties": false, "required": ["Prompt", "ExpectedStudentResponses"], "properties": { "Prompt": { "type": "string" }, "ExpectedStudentResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } } } } },
            "Phase3_QuickChecks": { "type": "array", "minItems": 3, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["Timing", "Prompt", "SuccessCriteriaOrExpectedResponses"], "properties": { "Timing": { "type": "string" }, "Prompt": { "type": "string" }, "SuccessCriteriaOrExpectedResponses": { "type": "array", "minItems": 2, "items": { "type": "string" } } } } },
            "Phase3_SpacedRetrieval": { "type": "array", "minItems": 3, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["Timing", "DrawsFrom", "Question", "DOK", "ExpectedResponseOrSuccessCriteria"], "properties": { "Timing": { "type": "string" }, "DrawsFrom": { "type": "string" }, "Question": { "type": "string" }, "DOK": { "type": "integer", "minimum": 2, "maximum": 4 }, "ExpectedResponseOrSuccessCriteria": { "type": "string" } } } },
            "Phase3_StudentPractice_Tasks": { "type": "array", "minItems": 2, "maxItems": 3, "items": { "type": "object", "additionalProperties": false, "required": ["TaskTitle", "DOK", "TeacherNote", "StudentDirections", "ExpectedAnswerOrSuccessCriteria"], "properties": { "TaskTitle": { "type": "string" }, "DOK": { "type": "string" }, "TeacherNote": { "type": "string" }, "StudentDirections": { "type": "string" }, "ExpectedAnswerOrSuccessCriteria": { "type": "string" } } } },
            "Phase3_StudentPractice_InterleavingIfMath": { "type": "string" },
            "Phase3_StudentPractice_Reflection": { "type": "string" },
            "Phase3_ReflectionPrompt": { "type": "string" }
          }
        },

        "UnitPreparationAndConsiderations": {
          "type": "object",
          "additionalProperties": false,
          "required": ["MaterialsEquipmentAndKeyResources", "TechnologyIntegration"],
          "properties": {
            "MaterialsEquipmentAndKeyResources": {
              "type": "object",
              "additionalProperties": false,
              "required": ["ClassroomMaterialsAndEquipment", "LocalCommunityBasedResources", "DigitalToolsAndOnlineResources"],
              "properties": {
                "ClassroomMaterialsAndEquipment": { "type": "array", "minItems": 6, "items": { "type": "string" } },
                "LocalCommunityBasedResources": {
                  "type": "array",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["Location", "HowStudentsEngage", "WhyRelevant"],
                    "properties": {
                      "Location": { "type": "string" },
                      "HowStudentsEngage": { "type": "string" },
                      "WhyRelevant": { "type": "string" }
                    }
                  }
                },
                "DigitalToolsAndOnlineResources": { "type": "array", "minItems": 4, "items": { "type": "string" } }
              }
            },
            "TechnologyIntegration": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "TechnologyForResearchAndInformation",
                "TechnologyForModelingAndVisualRepresentation",
                "TechnologyForCollaborationAndDiscourse",
                "TechnologyForCreatingAndPresentingFinalProduct",
                "EquityAndAccessibilityConsiderations"
              ],
              "properties": {
                "TechnologyForResearchAndInformation": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["ToolName", "HowStudentsUseIt", "ConnectionToProject", "ISTEStandard"], "properties": { "ToolName": { "type": "string" }, "HowStudentsUseIt": { "type": "string" }, "ConnectionToProject": { "type": "string" }, "ISTEStandard": { "type": "string" } } } },
                "TechnologyForModelingAndVisualRepresentation": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["ToolName", "HowStudentsUseIt", "ConnectionToProject", "ISTEStandard"], "properties": { "ToolName": { "type": "string" }, "HowStudentsUseIt": { "type": "string" }, "ConnectionToProject": { "type": "string" }, "ISTEStandard": { "type": "string" } } } },
                "TechnologyForCollaborationAndDiscourse": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["ToolName", "HowStudentsUseIt", "ConnectionToProject", "ISTEStandard"], "properties": { "ToolName": { "type": "string" }, "HowStudentsUseIt": { "type": "string" }, "ConnectionToProject": { "type": "string" }, "ISTEStandard": { "type": "string" } } } },
                "TechnologyForCreatingAndPresentingFinalProduct": { "type": "array", "minItems": 2, "items": { "type": "object", "additionalProperties": false, "required": ["ToolName", "HowStudentsUseIt", "ConnectionToProject", "ISTEStandard"], "properties": { "ToolName": { "type": "string" }, "HowStudentsUseIt": { "type": "string" }, "ConnectionToProject": { "type": "string" }, "ISTEStandard": { "type": "string" } } } },
                "EquityAndAccessibilityConsiderations": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}
';
