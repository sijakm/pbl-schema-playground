console.log("schema.js loading");
window.masterSchema = `
{
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
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
            "UnitSubject": {
              "type": "string",
              "description": "Subject/discipline as provided. No emojis."
            },
            "UnitName": {
              "type": "string",
              "description": "Unit name/title as provided. No emojis."
            },
            "GradeLevel": {
              "type": "string",
              "description": "Grade level label as provided."
            },
            "ClassDurationMinutes": {
              "type": "integer",
              "minimum": 10,
              "description": "Length of one class period in minutes."
            },
            "ProjectDurationDays": {
              "type": "integer",
              "minimum": 1,
              "description": "How many days the project lasts. Must influence pacing, milestones, retrieval, and student practice."
            },
            "ZipCode": {
              "type": "string",
              "description": "Zip code used to localize examples, sites, stakeholders, and audiences."
            },
            "Location": {
              "type": "object",
              "description": "General geographic context used to localize examples, stakeholders, audiences, and place-based learning. This should reflect a real-world setting without including exact addresses or sensitive location details.",
              "additionalProperties": false,
              "required": [
                "City",
                "Region",
                "Country"
              ],
              "properties": {
                "City": {
                  "type": "string"
                },
                "Region": {
                  "type": "string"
                },
                "Country": {
                  "type": "string"
                }
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
              "items": {
                "type": "string"
              },
              "description": "Written to the students, generate a Deliverable section that clearly describes the final product students will create to demonstrate their learning. The section must begin with a general summary sentence of what students will produce and who the authentic audience will be. Must include the following four required components, each with its exact header and corresponding description:\n\n1. Concept & Purpose Plan\n\nMust describe what students will create to communicate the purpose or vision behind their solution or design. This must include:\n\nA visual or written representation of their idea (e.g., drawing, model, prototype, digital design).\n\nAn explanation of what the design or solution represents and why it matters to the community, user, or context of the project.\n\n2. Evidence-Based Justification\n\nMust describe the analytical or investigative component of the deliverable. This must include:\n\nA requirement for students to analyze at least two key factors, variables, or components relevant to the project.\n\nAn expectation that students explain their choices using evidence from research, data, experimentation, or observation.\n\nA clear description of what kinds of evidence students must use to justify the feasibility or effectiveness of their proposed solution.\n\n3. Model or Representation\n\nMust explain what type of model students must create to show how or why their solution works. This model may be conceptual, visual, mathematical, physical, or digital. The description must include:\n\nWhat the model represents.\n\nHow the model helps explain the underlying mechanism, structure, or reasoning.\n\nAny required distinctions (e.g., components, relationships, classifications) needed to demonstrate accurate understanding.\n\n4. The Verdict\n\nMust end with a required conclusion section in which students:\n\nMake a final, evidence-backed argument explaining why their proposed solution is effective, feasible, or meaningful.\n\nSummarize the reasoning, evidence, and models that support their choice.\n\nCommunicate the value of their work to the intended authentic audience.\n\n\n\nDescribe these four components as requirements students must meet. The final paragraph must explain that completing the deliverable requires students to apply core disciplinary knowledge, use evidence, model complex ideas, and explain real-world implications of their design or solution."
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
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              },
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
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string"
                  },
                  "EssentialQuestion": {
                    "type": "string"
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective ends with '(DOK X)'. (Big Ideas / Enduring Understandings — conceptual, transferable insights)\nCleo must generate 3–5 conceptual, long-term ideas that:\n\nexpress why the learning matters beyond the unit,\n\nhighlight patterns, relationships, or principles that apply across contexts,\n\nexplain how or why something works, not just what it is,\n\nare written as full declarative statements beginning with a verb,\n\neach labeled with a Depth of Knowledge (DOK) level.\n\nThese enduring understandings should describe ideas that students can transfer to new situations, future units, or real-world decision-making."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective ends with '(DOK X)'. (Facts / Core content knowledge)\nCleo must generate 3–5 discipline-specific facts, terms, or foundational pieces of knowledge that:\n\nrepresent the essential information students must remember,\n\nare concrete and factual (not conceptual),\n\nsupport the unit’s standards and performance tasks,\n\nuse clear academic vocabulary appropriate to the subject,\n\ninclude a DOK label (typically DOK 1–2).\n\nThese statements must complete the stem Students will know that and start with a verb."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective ends with '(DOK X)'. (Skills / Practices aligned to the discipline)\nCleo must generate 4–7 skills-based statements that describe what students will do, such as:\n\nanalyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate,\n\nalign with discipline-specific practices,\n\nconnect directly to the project deliverable or performance task,\n\nare measurable and observable,\n\neach labeled with the appropriate DOK level (DOK 2–4).\n\nThese statements must complete the stem Students will be able to and start with a verb."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "Problem",
            "Project",
            "Place"
          ],
          "properties": {
            "DrivingQuestion": {
              "type": "string",
              "description": "MUST match UnitOverview.DrivingQuestion verbatim."
            },
            "Problem": {
              "type": "string",
              "description": "Required Structure for the Problem Description:\n\nReal-World Problem Overview\n\nDescribe a real, observable challenge that exists in a community, system, or environment.\n\nExplain why this problem matters and what consequences occur if it is not addressed.\n\nThe problem should be complex enough to require analysis, reasoning, and evidence—not a simple recall task.\n\nWhy the Problem Exists\n\nIdentify the underlying factors that contribute to the problem.\n\nThese may include scientific, historical, mathematical, civic, artistic, technological, or social components—depending on the unit’s discipline.\n\nThe description must highlight how misunderstanding, lack of information, or overlooked variables contribute to the issue.\n\nWhat Students Must Do to Address the Problem\n\nClearly outline the intellectual and practical tasks students will undertake.\n\nThese tasks must require applying disciplinary knowledge, analyzing evidence, constructing models or explanations, and designing or evaluating potential solutions.\n\nTasks should be authentic to the field (e.g., scientific analysis, mathematical modeling, historical interpretation, engineering design, artistic conceptualization).\n\nConnection to Unit Learning Outcomes\n\nState how solving the problem will require students to use the core concepts, skills, and reasoning practices the unit is designed to teach.\n\nShow that the problem naturally demands mastery of these outcomes—not as add-ons, but as essential tools for solving it.\n\nDriving Question Alignment\n\nThe problem description must point toward a clear, compelling driving question that captures the essence of the challenge.\n\nThe question should be open-ended, require evidence-based reasoning, and be answerable through the project work.\n\nRequired Components of the Student Response\n\nList the elements that students must include in their final solution, such as:\n\nA model, design, proposal, argument, explanation, or performance\n\nUse of evidence, data, research, or analysis\n\nVisuals, representations, or demonstrations of thinking\n\nA concluding statement or recommendation supported by reasoning\n\nComponents must align to the discipline and the final audience.\n\nConnection to Authentic Audience\n\nExplain who needs the solution and why.\n\nThe audience should be real, relevant, and positioned to use or evaluate the students’ work."
            },
            "Project": {
              "type": "string",
              "description": "Narrative of how learning builds across the multi-day project (inquiry → apply → refine → present). Not a day-by-day schedule."
            },
            "Place": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "PlaceOverview",
                "Sites",
                "PlaceMattersReminder"
              ],
              "properties": {
                "PlaceOverview": {
                  "type": "string",
                  "description": "How local context shapes problem, question, product."
                },
                "Sites": {
                  "type": "array",
                  "minItems": 3,
                  "maxItems": 4,
                  "description": "must include 3–5 Place-Based Sites of Engagement, each structured with the following three labeled components:\n\n1. The Site\n\nDescribe a meaningful physical or community location relevant to the unit’s problem or context.\nSites may include:\n\nSchool buildings or outdoor areas\n\nLocal organizations, agencies, or businesses\n\nCommunity spaces (libraries, parks, cultural centers)\n\nVirtual or digital community spaces (archives, expert hubs)\n\nIndustry or discipline-specific sites (labs, studios, civic offices)\n\n2. Engagement\n\nExplain what students will do at or with this site to support inquiry.\nExamples include:\n\nObservations, measurements, surveys, or documentation\n\nInterviews or Q&A with site experts\n\nAnalysis of artifacts, records, or environmental features\n\nVirtual tours, data reviews, or remote expert interactions\n\nHands-on exploration or guided field tasks\n\nEngagement activities must be authentic, purposeful, and tied to the real-world problem.\n\n3. Relevance\n\nExplain why this site matters to the unit.\nThis description must:\n\nConnect site characteristics to the real-world problem\n\nShow how the site provides evidence, insight, or expertise students need\n\nClarify how learning from the site helps students design solutions, build models, or draw conclusions\n\nHighlight local or community-specific factors that make the site meaningful\n\nAdditional Requirements\n\nSites must represent a range of perspectives or contexts, not all from the same type of location.\n\nAt least one site must involve community expertise (e.g., professionals, artists, scientists, civic employees, historians, engineers).\n\nAt least one site must involve direct observation or physical context, even if virtual access is used.\n\nDescriptions must be non–subject-specific: teachers will later customize them to their discipline, but the schema must guide how the structure is built.\n\nThe Place section should clearly show how students’ own community is part of the learning ecosystem.",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "TheSite",
                      "Engagement",
                      "Relevance"
                    ],
                    "properties": {
                      "TheSite": {
                        "type": "string"
                      },
                      "Engagement": {
                        "type": "string"
                      },
                      "Relevance": {
                        "type": "string"
                      }
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
          "required": [
            "VocabularyRationale",
            "Tiers"
          ],
          "properties": {
            "VocabularyRationale": {
              "type": "string",
              "description": "Provide a short, universal statement explaining the purpose of the unit’s vocabulary. The statement must describe that the vocabulary terms are intentionally selected to support core understanding, connect to real-world application, and reinforce accurate academic communication throughout the project. It should also indicate that vocabulary is organized into tiers to prioritize essential terms, support differentiation, and strengthen students’ ability to use disciplinary language effectively."
            },
            "Tiers": {
              "type": "array",
              "minItems": 4,
              "maxItems": 4,
              "description": "Create a Tiered Academic Vocabulary section organized into four labeled tiers. Each tier title must include the tier name and the standards it aligns to (e.g., “Core Concepts Vocabulary (Standards: _______)”). Each tier must begin with a brief statement explaining the purpose of that tier. Provide vocabulary terms appropriate for the unit along with student-friendly definitions. Standards shown in the tier title must match the unit’s learning standards. The required tiers are:\n\nTier 1 – Core Concepts Vocabulary (Standards: ___)\nPurpose statement: Terms essential for foundational understanding of the unit’s core ideas.\nInclude:\n\nTerm\n\nSimple definition\n\nOptional “Standards Connection” note\n\nTier 2 – Applied Knowledge Vocabulary (Standards: ___)\nPurpose statement: Terms students will use to apply, analyze, or interpret concepts during inquiry, tasks, or problem solving.\nInclude:\n\nTerm\n\nSimple definition\n\nOptional “Standards Connection” note\n\nTier 3 – Analytical & Process Vocabulary (Standards: ___)\nPurpose statement: Terms that help students describe processes, models, reasoning steps, interactions, mechanisms, or system behaviors.\nInclude:\n\nTerm\n\nSimple definition\n\nOptional “Standards Connection” note\n\nDifferentiation Tier – Enrichment / Extension Vocabulary (Standards: ___)\nPurpose statement: Advanced or nuanced terms that extend learning for students who are ready for deeper analysis, interdisciplinary connections, or more sophisticated explanations.\nInclude:\n\nTerm\n\nSimple definition\n\nOptional “Standards Connection” note\n\nAll tier statements, definitions, and standards labels must appear exactly in the final output. Vocabulary should prioritize clarity, accurate academic usage, and accessibility for students.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "TierTitle",
                  "TierWhyItMatters",
                  "Terms"
                ],
                "properties": {
                  "TierTitle": {
                    "type": "string",
                    "description": "MUST be exactly one of these: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                  },
                  "TierWhyItMatters": {
                    "type": "string"
                  },
                  "Terms": {
                    "type": "array",
                    "minItems": 3,
                    "items": {
                      "type": "object",
                      "additionalProperties": false,
                      "required": [
                        "Term",
                        "Definition",
                        "StandardsConnection"
                      ],
                      "properties": {
                        "Term": {
                          "type": "string"
                        },
                        "Definition": {
                          "type": "string"
                        },
                        "StandardsConnection": {
                          "type": "string",
                          "description": "Format: 'Standards Connection: ...'."
                        }
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
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric"
          ],
          "properties": {
            "FormativeAssessmentTable": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "string"
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Formative Assessment Rubric\n– MUST use the exact column headers:\nCriteria for Success (Student Learning Objective)\nSuccess Criteria\nPoint of Demonstration\n\nAnalytic Rubric\n– MUST use the exact column headers:\nCriteria, Novice, Apprentice, Practitioner, Expert\n\nThis schema does not contain content—only instructions for how the model must structure the output.\n\n✅ Schema Instructions for Rubrics (Universal)\n\nCreate an “Assessment Rubrics” section containing two required rubric formats. The model must keep the exact column headers word-for-word. No substitutions are allowed.\n\n1️⃣ Formative Assessment Rubric — Schema Requirements\n\nThe rubric must be produced as a table with exactly three columns labeled:\n\nCriteria for Success (Student Learning Objective)\n\nSuccess Criteria\n\nPoint of Demonstration\n\nInstructions for model:\n\nPopulate each row with a specific, measurable learning objective, its aligned success criteria, and where the evidence will appear (e.g., task, checkpoint, performance moment).\n\nThe number of rows should match the number of learning objectives in the unit.\n\nUse clear, student-friendly language.\n\nEnsure alignment between objective → criteria → evidence point.\n\nKeep the column headers exactly as written.\n\nRequired Output Structure Example (structure only, not content):\n\nCriteria for Success (Student Learning Objective)\tSuccess Criteria\tPoint of Demonstration\n…\t…\t…\n…\t…\t…\n2️⃣ A"
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "minItems": 4,
              "description": "The rubric must be produced as a table with exactly the following column headers in this order:\n\nCriteria\n\nNovice\n\nApprentice\n\nPractitioner\n\nExpert\n\nInstructions for model:\n\nEach row represents one evaluated skill, competency, or dimension of the final project.\n\n“Novice → Expert” must reflect a developmental progression, increasing in sophistication without using deficit-based language (e.g., do NOT use “fails,” “lacks,” “missing”).\n\nThe Expert column must build on the Practitioner level with deeper insight, precision, or complexity.\n\nKeep the column headers exactly as written.\n\nNumber of rows should match the number of major competencies required by the project.\n\nRequired Output Structure Example (structure only, not content):\n\nCriteria\tNovice\tApprentice\tPractitioner\tExpert\n…\t…\t…\t…\t…\n…\t…\t…\t…\t…",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Criterion",
                  "Novice",
                  "Apprentice",
                  "Practitioner",
                  "Expert"
                ],
                "properties": {
                  "Criterion": {
                    "type": "string"
                  },
                  "Novice": {
                    "type": "string"
                  },
                  "Apprentice": {
                    "type": "string"
                  },
                  "Practitioner": {
                    "type": "string"
                  },
                  "Expert": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "AuthenticAudience": {
          "type": "object",
          "description": "Required Output Structure\n\nThe model must generate three components in this order:\n\n1️⃣ Description of the Authentic Audience\n\nIdentify a real stakeholder group(s) connected to the unit’s problem or context.\n\nDescribe why this audience is relevant and how it is positioned at the intersection of key domains (e.g., science, public service, engineering, business, civic planning, history, art, environment).\n\nEmphasize that students are preparing professional-quality work intended for real review, not just a classroom exercise.\n\n2️⃣ Rationale for Their Expertise\n\nThe model must:\n\nExplain what knowledge, experience, or decision-making authority this audience holds that makes them an ideal evaluator.\n\nDescribe the types of insights the audience brings to the students’ work (e.g., technical, cultural, environmental, ethical, practical, community-based).\n\nInclude at least two different domains of expertise (e.g., practitioners + community members, technical experts + cultural experts).\n\nHighlight how their authentic perspective raises the stakes and increases student motivation and purpose.\n\n3️⃣ Impact on Student Learning\n\nThe model must explain how presenting to this audience requires students to:\n\nJustify decisions with evidence.\n\nCommunicate clearly to both experts and non-experts.\n\nApply disciplinary concepts to real-world constraints and expectations.\n\nRecognize the broader impact, purpose, and consequences of their work.\n\nThe narrative must also:\n\nShow how the authentic audience transforms the project from “schoolwork” into a professional challenge.\n\nInclude a concluding message about how partnership with authentic stakeholders gives students a sense of contribution, responsibility, and real-world relevance.\n\nAdditional Schema Requirements\n\nThe authentic audience must be contextually relevant to the project topic, problem, and deliverable.\n\nThe model must keep the section explanatory, narrative, and professional, not bulleted unless embedded in the schema.\n\nThe language should remain discipline-neutral so it fits any subject (e.g., science, ELA, social studies, engineering, arts, CTE).",
          "additionalProperties": false,
          "required": [
            "PrimaryAudienceDescription",
            "WhyThisAudienceIsQualified",
            "HowThisAudienceElevatesTheProject",
            "StudentParticipationInAudienceSelection"
          ],
          "properties": {
            "PrimaryAudienceDescription": {
              "type": "string",
              "description": "Clear description of who the primary audience is (individuals, organizations, or groups) and their relationship to the project’s context or problem."
            },
            "WhyThisAudienceIsQualified": {
              "type": "string",
              "description": "Explanation of why this audience has relevant expertise, lived experience, or authority related to the project topic."
            },
            "HowThisAudienceElevatesTheProject": {
              "type": "string",
              "description": "How the presence of this audience increases authenticity, rigor, motivation, or real-world impact for students."
            },
            "StudentParticipationInAudienceSelection": {
              "type": "string",
              "description": "Description of how students are involved in identifying, refining, or understanding the authentic audience."
            }
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
            "LearningPlanOverview": {
              "type": "string",
              "description": "The output must include:\n\nA clear statement of the total number of instructional days, based on whatever value the teacher provides.\n\nA short description of how the project unfolds across phases (early, middle, final) rather than fixed dates.\n\nA 2–4 sentence summary describing how learning progresses across the unit.\n\nImportant:\n❗ The model must NOT assume specific day ranges (e.g., Days 1–3).\n❗ Instead, it must divide the learning into three phases using flexible language: “Early Phase,” “Middle Phase,” and “Final Phase.”\n\n2️⃣ Phase Breakdown (Required; Flexible Timeline)\n\nThe model must replace specific day numbers with generic phase labels:\n\nEarly Phase (Beginning of the Unit)\n\nMust describe:\n\nBuilding foundational knowledge\n\nIntroducing core concepts, tools, or skills\n\nConducting exploratory investigations or guided practice\n\nPreparing students for deeper inquiry\n\nMiddle Phase (Majority of the Unit)\n\nMust describe:\n\nApplying core concepts to the central problem or challenge\n\nConducting analyses, investigations, or research\n\nDeveloping drafts, prototypes, models, or design ideas\n\nGathering and interpreting evidence needed for the final deliverable\n\nFinal Phase (Last Days of the Unit)\n\nMust describe:\n\nRefining the final product\n\nSynthesizing learning into clear explanations\n\nPreparing visuals, models, arguments, or presentations\n\nPresenting to the authentic audience\n\nThe model must not assign fixed number of days to any phase.\nIt must allow any duration the teacher inputs."
            },
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
                  "PhaseTitle": {
                    "type": "string"
                  },
                  "PhaseDescription": {
                    "type": "string"
                  },
                  "ConceptsOrSkills": {
                    "type": "string"
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string"
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "minItems": 3,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "minItems": 3,
              "description": "3️⃣ Project Goals (Required)\n\nThe output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs.\nThey must follow this structure:\n\nGoal 1: Apply Disciplinary Content to a Real-World Problem\n\nStudents use discipline-specific knowledge to analyze or solve an authentic challenge.\n\nList 4–6 core concepts or principles students will apply.\n\nShow how these ideas connect to real-world conditions or constraints.\n\nGoal 2: Solve a Real, Developmentally Appropriate Design or Inquiry Problem\n\nDescribe the authentic challenge students must address.\n\nList what students will create, model, compare, analyze, evaluate, or justify.\n\nInclude processes such as modeling, predicting, comparing, evaluating, and decision-making.\n\nGoal 3: Communicate Findings to a Real Audience\n\nStudents prepare a polished, professional-quality final product.\n\nThey tailor communication to needs of a real stakeholder group.\n\nProvide universal examples of authentic audiences:\n\nLocal experts\n\nCommunity organizations\n\nIndustry professionals\n\nSchool leadership\n\nFamilies or community members",
              "items": {
                "type": "string"
              }
            },
            "CollaborativeStructuresAndArtifacts": {
              "type": "object",
              "additionalProperties": false,
              "description": "The output must provide a list describing what the final deliverable will contain.\nThis list should include 5–7 items such as:\n\nA discipline-accurate analysis tied to core concepts\n\nA model, diagram, or representation of key ideas\n\nAn evaluation or assessment based on authentic constraints\n\nA visual or structural representation of the proposed solution or findings\n\nA written or oral justification supported by evidence\n\nA formal presentation to an authentic audience\n\nThese should mirror the structure of the original example, but with subject-neutral language.",
              "required": [
                "HowGroupsShareAndCompareIdeas",
                "HowThinkingIsDocumented",
                "WhereArtifactsAreCollected",
                "HowTeachersMonitorAndFacilitateDiscourse"
              ],
              "properties": {
                "HowGroupsShareAndCompareIdeas": {
                  "type": "string",
                  "description": "Protocols or routines students use to share, compare, and refine ideas within and across groups."
                },
                "HowThinkingIsDocumented": {
                  "type": "string",
                  "description": "Ways students make their thinking visible over time (e.g., notebooks, models, drafts, diagrams, digital tools)."
                },
                "WhereArtifactsAreCollected": {
                  "type": "string",
                  "description": "Physical or digital spaces where student work and learning artifacts are stored and revisited."
                },
                "HowTeachersMonitorAndFacilitateDiscourse": {
                  "type": "string",
                  "description": "Teacher strategies for observing collaboration, prompting deeper thinking, and guiding productive discussion."
                }
              }
            },
            "MilestonesAndIndicators": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "MilestoneName",
                  "Checkpoint",
                  "ObservableIndicators",
                  "HowIndicatorsAdjustWork"
                ],
                "properties": {
                  "MilestoneName": {
                    "type": "string"
                  },
                  "Checkpoint": {
                    "type": "string"
                  },
                  "ObservableIndicators": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  },
                  "HowIndicatorsAdjustWork": {
                    "type": "string"
                  }
                }
              }
            },
            "VerticalAlignment": {
              "type": "string"
            },
            "CommunicationToAuthenticAudienceExpectations": {
              "type": "string"
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
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
                "GroupSize": {
                  "type": "string"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "string"
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
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
            "Phase1_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 1 – Launch'."
            },
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Provide a short statement describing how this phase builds curiosity, introduces the real-world problem, and activates early reasoning.\nThe Focus Statement must include:\n\nCuriosity-building about the core phenomenon or problem\n\nEarly observation and exploration\n\nStudent-driven noticing and questioning\n\nA connection to the unit’s Driving Question\n\nExample wording to be included (paraphrased for any project):\n“In this launch phase, students build curiosity and begin uncovering the scientific or conceptual problem at the center of the project. Through observation, exploration, and early modeling attempts, students gather firsthand evidence that connects their initial thinking to the Driving Question.”"
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
            "Phase1_Differentiation_LanguageLearners": {
              "type": "string"
            },
            "Phase1_Differentiation_Scaffolding": {
              "type": "string"
            },
            "Phase1_Differentiation_GoDeeper": {
              "type": "string"
            },
            "Phase1_Accommodations_General": {
              "type": "string"
            },
            "Phase1_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "description": "Exactly the provided students (if any). If none provided, return empty array.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string"
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string"
                  },
                  "CorrectionLanguage": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Prompts designed to extend student thinking beyond the immediate task, encouraging transfer, abstraction, or connection to broader ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Brief formative checks used during the phase to monitor understanding and inform instructional decisions.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Retrieval prompts that intentionally revisit prior learning to strengthen memory and connections over time.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
                  "DrawsFrom": {
                    "type": "string"
                  },
                  "Question": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "integer",
                    "minimum": 2,
                    "maximum": 4
                  },
                  "ExpectedResponseOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Structured practice tasks that allow students to apply learning from this phase. Tasks should align to the phase focus and expected depth of knowledge.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "TaskTitle",
                  "DOK",
                  "TeacherNote",
                  "StudentDirections",
                  "ExpectedAnswerOrSuccessCriteria"
                ],
                "properties": {
                  "TaskTitle": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "string"
                  },
                  "TeacherNote": {
                    "type": "string"
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "ExpectedAnswerOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
            },
            "Phase1_StudentPractice_Reflection": {
              "type": "string"
            },
            "Phase1_ReflectionPrompt": {
              "type": "string"
            },
            "Phase2_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'."
            },
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Write a 1–3 sentence Focus Statement that (1) summarizes the purpose of the phase, (2) explains how students will build understanding through inquiry-based work, (3) explicitly connects the phase to the unit’s Driving Question or real-world problem, and (4) describes how this phase moves students closer to producing their final deliverable. The statement must always be written as a single short paragraph and must be customized to the project details provided by the user."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
            "Phase2_Differentiation_LanguageLearners": {
              "type": "string"
            },
            "Phase2_Differentiation_Scaffolding": {
              "type": "string"
            },
            "Phase2_Differentiation_GoDeeper": {
              "type": "string"
            },
            "Phase2_Accommodations_General": {
              "type": "string"
            },
            "Phase2_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string"
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string"
                  },
                  "CorrectionLanguage": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Prompts designed to extend student thinking beyond the immediate task, encouraging transfer, abstraction, or connection to broader ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Brief formative checks used during the phase to monitor understanding and inform instructional decisions.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Retrieval prompts that intentionally revisit prior learning to strengthen memory and connections over time.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "DrawsFrom": {
                    "type": "string"
                  },
                  "Question": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "integer",
                    "minimum": 2,
                    "maximum": 4
                  },
                  "ExpectedResponseOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Structured practice tasks that allow students to apply learning from this phase. Tasks should align to the phase focus and expected depth of knowledge.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "TaskTitle",
                  "DOK",
                  "TeacherNote",
                  "StudentDirections",
                  "ExpectedAnswerOrSuccessCriteria"
                ],
                "properties": {
                  "TaskTitle": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "string"
                  },
                  "TeacherNote": {
                    "type": "string"
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "ExpectedAnswerOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string"
            },
            "Phase2_StudentPractice_Reflection": {
              "type": "string"
            },
            "Phase2_ReflectionPrompt": {
              "type": "string"
            },
            "Phase3_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'."
            },
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "To generate a 2–4 sentence Focus Statement that clearly communicates the purpose of Phase 3 and its role in moving students toward the final product.\n\nSchema Rules for the Focus Statement\n\nThe model must produce a Focus Statement that includes ALL of the following:\n\n1. Phase Intent\n\nA clear explanation that Phase 3 is about:\n\nrefining ideas\n\napplying learning\n\nstrengthening evidence\n\npreparing culminating products\n\nengaging in deeper reasoning and revision\n\n2. Connection to the Real-World Problem\n\nThe statement must explicitly show:\n\nhow Phase 3 advances the project’s authentic challenge\n\nhow students use evidence to improve solutions\n\nhow work in this phase prepares them for an authentic audience\n\n3. Intellectual Work of the Phase\n\nThe focus must include verbs such as:\n\nrefine\n\nrevise\n\nsynthesize\n\nevaluate\n\njustify\n\nfinalize\n\ncommunicate\n\n4. Relationship to the Final Deliverable\n\nThe statement must indicate how Phase 3 helps students:\n\nfinalize models, products, explanations, or proposals\n\nprepare presentations or public showcases\n\nreflect on learning and strengthen reasoning"
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
            "Phase3_Differentiation_LanguageLearners": {
              "type": "string"
            },
            "Phase3_Differentiation_Scaffolding": {
              "type": "string"
            },
            "Phase3_Differentiation_GoDeeper": {
              "type": "string"
            },
            "Phase3_Accommodations_General": {
              "type": "string"
            },
            "Phase3_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string"
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string"
                  },
                  "CorrectionLanguage": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Prompts designed to extend student thinking beyond the immediate task, encouraging transfer, abstraction, or connection to broader ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Brief formative checks used during the phase to monitor understanding and inform instructional decisions.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Retrieval prompts that intentionally revisit prior learning to strengthen memory and connections over time.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "DrawsFrom": {
                    "type": "string"
                  },
                  "Question": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "integer",
                    "minimum": 2,
                    "maximum": 4
                  },
                  "ExpectedResponseOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Structured practice tasks that allow students to apply learning from this phase. Tasks should align to the phase focus and expected depth of knowledge.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "TaskTitle",
                  "DOK",
                  "TeacherNote",
                  "StudentDirections",
                  "ExpectedAnswerOrSuccessCriteria"
                ],
                "properties": {
                  "TaskTitle": {
                    "type": "string"
                  },
                  "DOK": {
                    "type": "string"
                  },
                  "TeacherNote": {
                    "type": "string"
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "ExpectedAnswerOrSuccessCriteria": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string"
            },
            "Phase3_StudentPractice_Reflection": {
              "type": "string"
            },
            "Phase3_ReflectionPrompt": {
              "type": "string"
            }
          }
        },
        "UnitPreparationAndConsiderations": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "MaterialsEquipmentAndKeyResources",
            "TechnologyIntegration"
          ],
          "properties": {
            "MaterialsEquipmentAndKeyResources": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "ClassroomMaterialsAndEquipment",
                "LocalCommunityBasedResources",
                "DigitalToolsAndOnlineResources"
              ],
              "properties": {
                "ClassroomMaterialsAndEquipment": {
                  "type": "array",
                  "minItems": 6,
                  "items": {
                    "type": "string"
                  }
                },
                "LocalCommunityBasedResources": {
                  "type": "array",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "Location",
                      "HowStudentsEngage",
                      "WhyRelevant"
                    ],
                    "properties": {
                      "Location": {
                        "type": "string"
                      },
                      "HowStudentsEngage": {
                        "type": "string"
                      },
                      "WhyRelevant": {
                        "type": "string"
                      }
                    }
                  }
                },
                "DigitalToolsAndOnlineResources": {
                  "type": "array",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
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
                "TechnologyForResearchAndInformation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForModelingAndVisualRepresentation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCollaborationAndDiscourse": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCreatingAndPresentingFinalProduct": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "EquityAndAccessibilityConsiderations": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
