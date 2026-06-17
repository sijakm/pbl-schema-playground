window.pblPrompts_en = (function() {
const defaultPrompt = `
Create unit plan and project-based lessons using info below:  
Unit Subject:
{{$Subject}}
Unit Name:
{{$Name}}
Unit Description/Instruction:
{{$UserPrompt}}
Grade Level:
{{$GradeLevel}}
How long will the project be in days
{{$NumberOfDays}}
Location:
{{$Location}}
Resources/Media to use:
{{$MediaContext}}, 
Unit Content: 
{{$AttachedUnit}} 
Student Learning Plans:
{{$LearningPlans}}
Standards to Align:
{{$Standards}}
You are tasked with designing a detailed project-based unit using cognitive science principles. Your output MUST follow the exact section order, headings, and content rules below. If any section is missing or out of order, regenerate until all constraints are satisfied. 
Global Output Rules (apply to everything) Follow the exact section order and headings shown below. Do not add extra sections or rename headings. Real-world problems should be relevant to students in this grade level. Avoid topics that may be sensitive to the developmental appropriateness of topics as well as sensitive topics such as poverty, housing insecurity, race, etc, or controversial topics such as evolution. Include the following components in the design of the unit project.  
Cultural Relevance & Inclusion: Incorporate multiple perspectives and reflect on the impacts for all involved.Content should connect with students from varied backgrounds and communities to create culturally relevant and culturally responsive lessons Avoid stereotypes. 
IMPORTANT: the response must be in {{$ResponseLanguage}}
`;












  return {
    STEP0_PROMPT_TEMPLATE: defaultPrompt,
    STEP0_SCHEMA: {
    "title": "PBLUnitPlanResponse",
    "type": "object",
    "additionalProperties": false,
    "required": [
        "UnitPlan"
    ],
    "properties": {
        "UnitPlan": {
            "type": "object",
            "description": "Return a complete Project-Based Learning (PBL) Unit Plan. Do NOT add extra keys. Populate every required field. Must work for ANY subject. Localize stakeholders/audience/resources to provided zip/location without inventing exact addresses/phone numbers.",
            "additionalProperties": false,
            "required": [
                "AssessPriorKnowledge",
                "UnitOverview",
                "DesiredOutcomes",
                "FramingTheLearning",
                "AssessmentPlan",
                "LearningPlan",
                "UnitPreparationAndConsiderations",
                "TeacherGuidancePhase1",
                "TeacherGuidancePhase2",
                "TeacherGuidancePhase3"
            ],
            "properties": {
                "AssessPriorKnowledge": {
        "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
                    "type": "object",
                    "description": "Assess Prior Knowledge section. 1. Ensure DOK 1-3 prompts are used. 2. Include prerequisite skills needed for the student learning objectives. 3. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 4. Initial teacher prompt with 'Say:' statement. 5. Clear instructions and template/structure for the chosen modality. 6. 'Expected Student Responses' section. 7. Closing teacher 'Say:' prompt. 8. After fully developing one modality, provide 2 brief alternate options.",
                    "properties": {
                        "ActivityInstructions": {
                            "type": "string",
                            "description": "Clear instructions and template/structure for the chosen modality. E.g. 'Say: \"Before we begin...\"'"
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
                "UnitOverview": {
                    "type": "object",
        "x-format": "### {green}Unit Task\n\n**{loc.Purpose}:** To introduce students to an engaging, real-world design challenge that sparks curiosity, grounds learning in authentic applications, presents the driving question, and clearly defines the mission and final deliverable that will guide inquiry throughout the unit.\n\n**{loc.Title}: {value.TaskStatementTitle}**\n\n{value.TaskStatement}\n\n**{loc.Mission}:** {value.Mission}\n\n**{loc.ProjectContextAndStakeholders}:** {value.ProjectContextAndStakeholders}\n\n### 🎯 {loc.DrivingQuestion}\n**{value.DrivingQuestion}**\n\n### 🎯 {loc.TheDeliverable}\n{value.FinalDeliverableRequirements}\n\n{value.ClosingCallToAction}",
                    "additionalProperties": false,
                    "required": [
                        "TaskStatementTitle",
                        "TaskStatement",
                        "DrivingQuestion",
                        "Mission",
                        "ProjectContextAndStakeholders",
                        "FinalDeliverableRequirements",
                        "ClosingCallToAction"
                    ],
                    "properties": {
                        "TaskStatementTitle": {
                            "type": "string",
                            "description": "The title of the student-facing launch message (e.g. Message from the Coconut Creek STEM Innovation Team)."
                        },
                        "TaskStatement": {
                            "type": "string",
                            "description": "Student-facing launch message (400-600 words) written like a credible local organization/person. Urgent, meaningful, authentic. No standards/rubrics/pacing. Do NOT include the title here."
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "One strong open-ended Driving Question grounded in place and stakeholder need. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
                        },
                        "Mission": {
                            "type": "string",
                            "description": "Paragraph starting with 'Your task is to...' describing what students will create/do and why it matters to the community/audience."
                        },
                        "ProjectContextAndStakeholders": {
                            "type": "string",
                            "description": "Short narrative: who is impacted, why it matters now locally, and which stakeholders/audiences care."
                        },
                        "FinalDeliverableRequirements": {
                            "type": "array",
                            "minItems": 4,
                            "items": {
                                "type": "string",
                                "x-format": "- {value}"
                            },
                            "description": "Written for students, describe the final deliverable they will create and the authentic audience it serves. Format each item with a bolded title (e.g. **Summary:** ...). Must include at least a brief summary, then four components: (1) Concept & Purpose Plan explaining the idea through a visual or written representation and why it matters to the community or context; (2) Evidence-Based Justification requiring analysis of at least two relevant factors and explanation of choices using evidence from research, data, experimentation, or observation; (3) Model or Representation describing the type of model created, what it represents, how it explains underlying mechanisms or reasoning, and required distinctions; and (4) The Verdict, a concluding, evidence-backed argument explaining why the solution is effective, feasible, or meaningful, summarizing reasoning, evidence, and models, and communicating value to the authentic audience, with a final statement emphasizing application of disciplinary knowledge, use of evidence, modeling of complex ideas, and real-world implications."
                        },
                        "ClosingCallToAction": {
                            "type": "string",
                            "description": "Inspiring close: the community/audience is counting on students; emphasize impact."
                        }
                    }
                },
                "DesiredOutcomes": {
                    "type": "object",
        "x-format": "## 🏆 {loc.DesiredOutcomes}\n\n### {loc.StandardsAligned}\n{value.StandardsAligned}\n\n### {loc.BigIdeasAndEssentialQuestions}\n{value.BigIdeasAndEssentialQuestions}\n\n### {loc.LearningObjectives}\n**{loc.StudentsWillUnderstandThat}**\n{value.LearningObjectives.StudentsWillUnderstandThat}\n\n**{loc.StudentsWillKnowThat}**\n{value.LearningObjectives.StudentsWillKnowThat}\n\n**{loc.StudentsWillBeAbleTo}**\n{value.LearningObjectives.StudentsWillBeAbleTo}",
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
                            "description": "Generate 3-4 Big Idea and Essential Question pairs that establish the enduring, transferable concepts anchoring the entire unit, guide inquiry and assessment design, and provide an overarching conceptual framework connecting all tasks, skills, and activities into meaningful understanding.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "BigIdea",
                                    "EssentialQuestion"
                                ],
                                "properties": {
                                    "BigIdea": {
                                        "type": "string",
                                        "description": "A broad, conceptual statement of enduring understanding that explains a fundamental principle underlying the unit, connects all tasks and assessments, supports transferable learning beyond the specific context, and reflects core disciplinary thinking rather than isolated facts."
                                    },
                                    "EssentialQuestion": {
                                        "type": "string",
                                        "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter."
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
                                    "description": "Each objective must end with (DOK X) and represent Big Ideas or Enduring Understandings by generating 3 to 5 conceptual, long-term statements that explain why the learning matters beyond the unit, highlight transferable patterns, relationships, or principles across contexts, explain how or why something works rather than just what it is, are written as full declarative sentences beginning with a verb, and are each labeled with an appropriate Depth of Knowledge level, emphasizing ideas students can transfer to new situations, future units, and real-world decision making."
                                },
                                "StudentsWillKnowThat": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Each objective must end with (DOK X) and represent Facts or Core Content Knowledge by generating 3 to 5 discipline-specific facts, terms, or foundational knowledge statements that identify essential information students must remember, remain concrete and factual rather than conceptual, support the unit standards and performance tasks, use clear academic vocabulary appropriate to the subject, include an appropriate DOK label typically at level 1 or 2, and complete the stem Students will know that while beginning with a verb."
                                },
                                "StudentsWillBeAbleTo": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Each objective must end with (DOK X) and represent Skills or Practices aligned to the discipline by generating 4 to 7 skills-based statements describing what students will do, such as analyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate; align with discipline-specific practices; connect directly to the project deliverable or performance task; remain measurable and observable; include an appropriate DOK level between 2 and 4; and complete the stem Students will be able to while beginning with a verb."
                                }
                            }
                        }
                    }
                },
                "FramingTheLearning": {
                    "type": "object",
        "x-format": "## 🖼️ {loc.FramingTheLearning}\n\n### {loc.DrivingQuestion}\n{value.DrivingQuestion}\n\n### {loc.Problem}\n{value.Problem}\n\n### {loc.Project}\n{value.Project}\n\n### {loc.Place}\n{value.Place.PlaceOverview}\n\n**{loc.Sites}**\n{value.Place.Sites}\n\n*{value.Place.PlaceMattersReminder}*\n\n### {loc.KeyVocabulary}\n{value.KeyVocabulary.VocabularyRationale}\n\n{value.KeyVocabulary.Tiers}",
                    "additionalProperties": false,
                    "required": [
                        "DrivingQuestion",
                        "Problem",
                        "Project",
                        "Place",
                        "KeyVocabulary"
                    ],
                    "properties": {
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
                                    "description": "Provide a short, universal statement explaining that the unit's vocabulary is intentionally selected to support core understanding, connect learning to real-world application, and reinforce accurate academic communication, and that terms are organized into tiers to prioritize essentials, support differentiation, and strengthen students' effective use of disciplinary language."
                                },
                                "Tiers": {
                                    "type": "array",
                                    "minItems": 4,
                                    "maxItems": 4,
                                    "description": "Create a Tiered Academic Vocabulary section with four labeled tiers, where each tier title includes the tier name and aligned standards, begins with a brief purpose statement, and lists unit-appropriate vocabulary terms with student-friendly definitions and an optional Standards Connection note; required tiers are Tier 1 Core Concepts Vocabulary for foundational understanding, Tier 2 Applied Knowledge Vocabulary for applying and analyzing concepts, Tier 3 Analytical and Process Vocabulary for describing processes, models, and reasoning, and a Differentiation Enrichment or Extension Tier for advanced or nuanced terms; standards in tier titles must match unit standards, all labels must appear exactly as specified, and vocabulary must prioritize clarity, accurate academic usage, and accessibility for students.",
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
                                                            "description": "List the standard that aligns with the vocabulary word. Example: Connection: MS-PS1-4 Develop a model to describe that substances are made of particles too small to be seen."
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "DrivingQuestion": {
                            "type": "string",
                            "description": "MUST match UnitOverview.DrivingQuestion verbatim."
                        },
                        "Problem": {
                            "type": "string",
                            "description": "The problem description must present a real, observable challenge in a community, system, or environment; explain why the problem matters and the consequences if it is not addressed; ensure the problem requires analysis, reasoning, and evidence rather than simple recall; identify underlying contributing factors such as scientific, historical, mathematical, civic, artistic, technological, or social elements; show how misunderstanding, missing information, or overlooked variables contribute to the issue; clearly outline the intellectual and practical tasks students must complete using disciplinary knowledge, evidence analysis, modeling, explanation, design, or evaluation of solutions; demonstrate how solving the problem requires mastery of the unit's core concepts, skills, and reasoning practices; align explicitly with a clear, open-ended driving question that can be answered through project work; specify required student response components such as a model or design, evidence-based analysis, visual or representational thinking, and a reasoned conclusion; and explain how the solution serves a real, relevant authentic audience positioned to use or evaluate the work."
                        },
                        "Project": {
                            "type": "string",
                            "description": "Narrative of how learning builds across the multi-day project (inquiry -> apply -> refine -> present). Not a day-by-day schedule."
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
                                    "description": "The model must explain how the local context shapes the real-world problem students are solving, how it influences the driving question they will investigate, and how it determines the form and expectations of the final product. The output must clearly describe the local environments, stakeholders, or community needs that make the project meaningful and show how those elements inform student work, required evidence, and authentic impact."
                                },
                                "Sites": {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 4,
                                    "description": "Must include 3 to 5 Place-Based Sites of Engagement, each structured with three labeled components: The Site, describing a meaningful physical, community, virtual, or discipline-specific location relevant to the unit's context; Engagement, explaining authentic inquiry activities students complete at or with the site such as observation, data collection, interviews, analysis, virtual exploration, or guided field tasks tied to the real-world problem; and Relevance, explaining why the site matters by connecting it to the problem, showing how it provides evidence or expertise, clarifying how it supports solution design or modeling, and highlighting local or community-specific significance; sites must represent varied contexts, include at least one involving community expertise, include at least one involving direct observation or physical context even if virtual, remain subject-neutral, and clearly show how the local community is part of the learning ecosystem.",
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
                "AssessmentPlan": {
                    "type": "object",
        "x-format": "## 📝 {loc.AssessmentPlan}\n\n### {loc.AuthenticAudience}\n{value.AuthenticAudience.PrimaryAudienceDescription}\n\n{value.AuthenticAudience.WhyThisAudienceIsQualified}\n\n{value.AuthenticAudience.HowThisAudienceElevatesTheProject}\n\n{value.AuthenticAudience.StudentParticipationInAudienceSelection}\n\n### {loc.FormativeAssessmentTable}\n{value.FormativeAssessmentTable}\n\n### {loc.AnalyticRubric}\n{value.AnalyticRubric}",
                    "additionalProperties": false,
                    "required": [
                        "FormativeAssessmentTable",
                        "AnalyticRubric",
                        "AuthenticAudience"
                    ],
                    "properties": {
                        "AuthenticAudience": {
                            "type": "object",
                            "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
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
                                    "description": "Clear description of who the primary audience is (individuals, organizations, or groups) and their relationship to the project's context or problem."
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
                                        "description": "Formative Assessment Rubric MUST use the exact column headers Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration. Analytic Rubric MUST use the exact column headers Criteria, Novice, Apprentice, Practitioner, and Expert. This schema does not contain content and only provides instructions for how the model must structure the output. Create an Assessment Rubrics section containing two required rubric formats and keep the exact column headers word for word with no substitutions. For the Formative Assessment Rubric, produce a table with exactly three columns labeled Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration, and populate each row with a specific measurable learning objective, its aligned success criteria, and where the evidence will appear such as a task, checkpoint, or performance moment. The number of rows must match the number of learning objectives in the unit, language must be clear and student friendly, and alignment between objective, criteria, and evidence point must be maintained. Keep the column headers exactly as written. The structure example is provided for format only and not for content."
                                    }
                                }
                            }
                        },
                        "AnalyticRubric": {
                            "type": "array",
                            "minItems": 4,
                            "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
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
                "LearningPlan": {
                    "type": "object",
        "x-format": "## 📅 {loc.LearningPlan}\n\n{value.LearningPlanOverview}\n\n### {loc.ProjectPhases}\n{value.ProjectPhases}\n\n### {loc.ProjectGoals}\n{value.ProjectGoals}\n\n### {loc.CommunicationToAuthenticAudienceExpectations}\n{value.CommunicationToAuthenticAudienceExpectations}\n\n### {loc.FinalDeliverableSummary}\n{value.FinalDeliverableSummary}\n\n### {loc.GroupSuggestions}\n**{loc.GroupSize}**: {value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n*{value.GroupSuggestions.TeacherGroupingStrategyPrompt}*\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}",
                    "additionalProperties": false,
                    "required": [
                        "LearningPlanOverview",
                        "ProjectPhases",
                        "ProjectGoals",
                        "CommunicationToAuthenticAudienceExpectations",
                        "FinalDeliverableSummary",
                        "GroupSuggestions"
                    ],
                    "properties": {
                        "LearningPlanOverview": {
                            "type": "string",
                            "description": "The output must include a clear statement of the total number of instructional days based on the value provided by the teacher, a short description of how the project unfolds across phases rather than fixed dates, and a 2-4 sentence summary explaining how learning progresses across the unit. The model must not assume specific day ranges such as Days 1-3 and must instead divide learning into three flexible phases labeled Early Phase, Middle Phase, and Final Phase. The Early Phase must describe building foundational knowledge, introducing core concepts, tools, or skills, conducting exploratory investigations or guided practice, and preparing students for deeper inquiry. The Middle Phase must describe applying core concepts to the central problem, conducting analyses or research, developing drafts, prototypes, models, or design ideas, and gathering and interpreting evidence for the final deliverable. The Final Phase must describe refining the final product, synthesizing learning into clear explanations, preparing visuals, models, arguments, or presentations, and presenting to the authentic audience. The model must not assign a fixed number of days to any phase and must allow any duration provided by the teacher."
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
                            "description": "The output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs. Goal 1, Apply Disciplinary Content to a Real-World Problem, requires students to use discipline-specific knowledge to analyze or solve an authentic challenge, list 4-6 core concepts or principles they will apply, and show how these ideas connect to real-world conditions or constraints. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, requires describing the authentic challenge students must address, listing what students will create, model, compare, analyze, evaluate, or justify, and including processes such as modeling, predicting, comparing, evaluating, and decision-making. Goal 3, Communicate Findings to a Real Audience, requires students to prepare a polished, professional-quality final product, tailor communication to the needs of a real stakeholder group, and reference authentic audiences such as local experts, community organizations, industry professionals, school leadership, families, or community members.",
                            "items": {
                                "type": "string"
                            }
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
                            "description": "Outlines group size, roles and teacher duties.",
                            "additionalProperties": false,
                            "required": [
                                "GroupSize",
                                "RotatingRolesAndDuties",
                                "TeacherGroupingStrategyPrompt",
                                "GroupingStrategyRecommendations"
                            ],
                            "properties": {
                                "GroupSize": {
                                    "type": "string",
                                    "description": "The output must state a recommended group size such as 3 to 4 students and must provide a rationale explaining how this size supports productive discussion, shared engagement, and manageable task distribution."
                                },
                                "RotatingRolesAndDuties": {
                                    "type": "array",
                                    "description": "The output must provide a list of roles formatted as Role Name: description of duties. The list must include at least four roles, and the required functional categories are Facilitator who guides discussion and ensures full participation, Recorder who documents group thinking, Materials Manager who handles tools and resources safely, and Presenter or Communicator who shares group findings. Optional roles may also appear such as Researcher, Data Analyst, Model Builder, or Timekeeper. Third, Teacher Expectations for Role Implementation: The output must state that teachers introduce and model each role at the start of the project, establish clear norms for how roles function during group work, and require that students rotate roles across activities so all learners practice multiple collaborative skills.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "TeacherGroupingStrategyPrompt": {
                                    "type": "string",
                                    "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: To help teachers make intentional grouping decisions, include this planning prompt: 'What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?' This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit. The model must not add additional explanation, examples, or commentary."
                                },
                                "GroupingStrategyRecommendations": {
                                    "type": "array",
                                    "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: Teachers may consider: Mixed-ability Groups: Best when tasks require reasoning, evidence comparison, or scaffolding across readiness levels (e.g., particle-model brainstorming). Interest-based Groups: Ideal during sculpture concept development, allowing students to collaborate based on themes or artistic styles they are drawn to. Skills-based Groups: Useful when tasks require technical precision (e.g., particle diagrams, environmental stress modeling). Randomized Groups: Helpful during early exploration tasks to build community and reduce over-reliance on predictable partnerships. The model must not add additional explanation, examples, or commentary.",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase1": {
                    "type": "object",
        "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase1}\n\n### {value.Phase1_Title}\n\n**Focus Statement**\n{value.Phase1_FocusStatement}\n\n**Collaborative Activities**\n{value.Phase1_CollaborativeActivities}\n\n**Guiding Questions**\n{value.Phase1_GuidingQuestions}\n\n**🪜 Differentiation**\n- **Language Learners:** {value.Phase1_Differentiation_LanguageLearners}\n- **Scaffolding:** {value.Phase1_Differentiation_Scaffolding}\n- **Go Deeper:** {value.Phase1_Differentiation_GoDeeper}\n\n**🤝 Accommodations & Modifications**\n- **General Support:** {value.Phase1_Accommodations_General}\n- **Individual Support:**\n{value.Phase1_Accommodations_IndividualSupport}\n\n**❗ Anticipated Misconceptions**\n{value.Phase1_AnticipatedMisconceptions}\n\n**🌍 Transcendent Thinking**\n{value.Phase1_TranscendentThinkingPrompts}\n\n**✔ Quick Checks**\n{value.Phase1_QuickChecks}\n\n**⏳ Spaced Retrieval**\n{value.Phase1_SpacedRetrieval}\n\n**🖊 Student Practice**\n{value.Phase1_StudentPractice_TeacherNotes}\n{value.Phase1_StudentPractice_Tasks}\n\n**🔎 Reflection**\n{value.Phase1_ReflectionPrompt.Introduction}\n{value.Phase1_ReflectionPrompt.Prompts}",
                    "additionalProperties": false,
                    "description": "First phase of teacher guidance",
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
                        "Phase1_StudentPractice_TeacherNotes",
                        "Phase1_StudentPractice_Tasks",
                        "Phase1_StudentPractice_InterleavingIfMath",
                        "Phase1_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase1_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 1 - Launch'."
                        },
                        "Phase1_FocusStatement": {
                            "type": "string",
                            "description": "Provide a short statement describing how this phase builds curiosity, introduces the real-world problem, and activates early reasoning. The Focus Statement must include curiosity-building about the core phenomenon or problem, early observation and exploration, student-driven noticing and questioning, and a clear connection to the unit's Driving Question. The wording should reflect that in this launch phase students build curiosity and begin uncovering the scientific or conceptual problem at the center of the project, and that through observation, exploration, and early modeling attempts they gather firsthand evidence that connects their initial thinking to the Driving Question."
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
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase1_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase1_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase1_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
                        },
                        "Phase1_Accommodations_IndividualSupport": {
                            "type": "array",
                            "minItems": 0,
                            "description": "List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt.",
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
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase1_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
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
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase1_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
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
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
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
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
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
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase1_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase1_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase1_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase2": {
                    "type": "object",
        "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase2}\n\n### {value.Phase2_Title}\n\n**Focus Statement**\n{value.Phase2_FocusStatement}\n\n**Collaborative Activities**\n{value.Phase2_CollaborativeActivities}\n\n**Guiding Questions**\n{value.Phase2_GuidingQuestions}\n\n**🪜 Differentiation**\n- **Language Learners:** {value.Phase2_Differentiation_LanguageLearners}\n- **Scaffolding:** {value.Phase2_Differentiation_Scaffolding}\n- **Go Deeper:** {value.Phase2_Differentiation_GoDeeper}\n\n**🤝 Accommodations & Modifications**\n- **General Support:** {value.Phase2_Accommodations_General}\n- **Individual Support:**\n{value.Phase2_Accommodations_IndividualSupport}\n\n**❗ Anticipated Misconceptions**\n{value.Phase2_AnticipatedMisconceptions}\n\n**🌍 Transcendent Thinking**\n{value.Phase2_TranscendentThinkingPrompts}\n\n**✔ Quick Checks**\n{value.Phase2_QuickChecks}\n\n**⏳ Spaced Retrieval**\n{value.Phase2_SpacedRetrieval}\n\n**🖊 Student Practice**\n{value.Phase2_StudentPractice_TeacherNotes}\n{value.Phase2_StudentPractice_Tasks}\n\n**🔎 Reflection**\n{value.Phase2_ReflectionPrompt.Introduction}\n{value.Phase2_ReflectionPrompt.Prompts}",
                    "additionalProperties": false,
                    "description": "Second phase of teacher guidance",
                    "required": [
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
                        "Phase2_StudentPractice_TeacherNotes",
                        "Phase2_StudentPractice_Tasks",
                        "Phase2_StudentPractice_InterleavingIfMath",
                        "Phase2_ReflectionPrompt"
                    ],
                    "properties": {
                        "Phase2_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'."
                        },
                        "Phase2_FocusStatement": {
                            "type": "string",
                            "description": "Write a 1-3 sentence Focus Statement that summarizes the purpose of the phase, explains how students build understanding through inquiry-based work, explicitly connects the phase to the unit's Driving Question or real-world problem, and describes how this phase moves students closer to producing their final deliverable. The statement must always be written as a single short paragraph and must be customized to the specific project details provided by the user."
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
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase2_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase2_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase2_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
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
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase2_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
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
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase2_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
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
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
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
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
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
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase2_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase2_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase2_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase2_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "TeacherGuidancePhase3": {
                    "type": "object",
        "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase3}\n\n### {value.Phase3_Title}\n\n**Focus Statement**\n{value.Phase3_FocusStatement}\n\n**Collaborative Activities**\n{value.Phase3_CollaborativeActivities}\n\n**Guiding Questions**\n{value.Phase3_GuidingQuestions}\n\n**🪜 Differentiation**\n- **Language Learners:** {value.Phase3_Differentiation_LanguageLearners}\n- **Scaffolding:** {value.Phase3_Differentiation_Scaffolding}\n- **Go Deeper:** {value.Phase3_Differentiation_GoDeeper}\n\n**🤝 Accommodations & Modifications**\n- **General Support:** {value.Phase3_Accommodations_General}\n- **Individual Support:**\n{value.Phase3_Accommodations_IndividualSupport}\n\n**❗ Anticipated Misconceptions**\n{value.Phase3_AnticipatedMisconceptions}\n\n**🌍 Transcendent Thinking**\n{value.Phase3_TranscendentThinkingPrompts}\n\n**✔ Quick Checks**\n{value.Phase3_QuickChecks}\n\n**⏳ Spaced Retrieval**\n{value.Phase3_SpacedRetrieval}\n\n**🖊 Student Practice**\n{value.Phase3_StudentPractice_TeacherNotes}\n{value.Phase3_StudentPractice_Tasks}\n\n**🔎 Reflection**\n{value.Phase3_ReflectionPrompt.Introduction}\n{value.Phase3_ReflectionPrompt.Prompts}",
                    "additionalProperties": false,
                    "description": "Third phase of teacher guidance",
                    "required": [
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
                        "Phase3_StudentPractice_TeacherNotes",
                        "Phase3_StudentPractice_Tasks",
                        "Phase3_StudentPractice_InterleavingIfMath",
                        "Phase3_ReflectionPrompt",
                        "Phase3_Title"
                    ],
                    "properties": {
                        "Phase3_Title": {
                            "type": "string",
                            "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'."
                        },
                        "Phase3_FocusStatement": {
                            "type": "string",
                            "description": "Generate a 2-4 sentence Focus Statement that clearly communicates the purpose of Phase 3 and its role in moving students toward the final product. The statement must explain that Phase 3 focuses on refining ideas, applying learning, strengthening evidence, preparing culminating products, and engaging in deeper reasoning and revision. It must explicitly show how Phase 3 advances the project's authentic real-world challenge, how students use evidence to improve solutions, and how this work prepares them for an authentic audience. The statement must include intellectual work such as refining, revising, synthesizing, evaluating, justifying, finalizing, and communicating, and it must indicate how students finalize models, products, explanations, or proposals, prepare presentations or public showcases, and reflect on learning to strengthen their reasoning."
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
                            "type": "string",
                            "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
                        },
                        "Phase3_Differentiation_Scaffolding": {
                            "type": "string",
                            "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
                        },
                        "Phase3_Differentiation_GoDeeper": {
                            "type": "string",
                            "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
                        },
                        "Phase3_Accommodations_General": {
                            "type": "string",
                            "description": "General classroom supports and modifications that apply to most or all students during this activity."
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
                                        "type": "string",
                                        "description": "Full name of the student exactly as provided in the prompt."
                                    },
                                    "PlanProvided": {
                                        "type": "string"
                                    },
                                    "PlanImplementation": {
                                        "type": "string",
                                        "description": "Short description of the individualized accommodation or modification for this student."
                                    }
                                }
                            }
                        },
                        "Phase3_AnticipatedMisconceptions": {
                            "type": "array",
                            "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
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
                                        "type": "string",
                                        "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                                    },
                                    "CorrectionLanguage": {
                                        "type": "string",
                                        "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                                    }
                                }
                            }
                        },
                        "Phase3_TranscendentThinkingPrompts": {
                            "type": "array",
                            "minItems": 1,
                            "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
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
                            "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
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
                            "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
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
                                        "minimum": 1,
                                        "maximum": 4
                                    },
                                    "ExpectedResponseOrSuccessCriteria": {
                                        "type": "string"
                                    }
                                }
                            }
                        },
                        "Phase3_StudentPractice_TeacherNotes": {
                            "type": "string",
                            "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
                        },
                        "Phase3_StudentPractice_Tasks": {
                            "type": "array",
                            "minItems": 2,
                            "maxItems": 3,
                            "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
                            "items": {
                                "type": "object",
                                "additionalProperties": false,
                                "required": [
                                    "DOK",
                                    "StudentDirections",
                                    "SuccessCriteria"
                                ],
                                "properties": {
                                    "DOK": {
                                        "type": "string",
                                        "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                                    },
                                    "StudentDirections": {
                                        "type": "string"
                                    },
                                    "SuccessCriteria": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "Phase3_StudentPractice_InterleavingIfMath": {
                            "type": "string",
                            "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
                        },
                        "Phase3_ReflectionPrompt": {
                            "type": "object",
                            "additionalProperties": false,
                            "required": ["Introduction", "Prompts"],
                            "properties": {
                                "Introduction": {
                                    "type": "string",
                                    "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
                                },
                                "Prompts": {
                                    "type": "array",
                                    "minItems": 2,
                                    "items": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                },
                "UnitPreparationAndConsiderations": {
                    "type": "object",
        "x-format": "## ⚙️ {loc.UnitPreparationAndConsiderations}\n\n### {loc.ClassroomMaterialsAndEquipment}\n{value.ClassroomMaterialsAndEquipment}\n\n### {loc.LocalAndCommunityBasedResources}\n{value.LocalAndCommunityBasedResources}\n\n### {loc.DigitalToolsAndOnlineResources}\n{value.DigitalToolsAndOnlineResources}\n\n### {loc.TechnologyToDeepenInquiry}\n{value.TechnologyToDeepenInquiry}\n\n### {loc.TechnologyForModeling}\n{value.TechnologyForModeling}\n\n### {loc.TechnologyForCollaboration}\n{value.TechnologyForCollaboration}\n\n### {loc.TechnologyForCreatingFinalProduct}\n{value.TechnologyForCreatingFinalProduct}\n\n### {loc.EquityAndAccessibilityConsiderations}\n{value.EquityAndAccessibilityConsiderations}",
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
    },
    "x-removablePaths": {
        "AssessPriorKnowledge": [
            "UnitPlan.AssessPriorKnowledge"
        ],
        "FormativeAssessment": [
            "UnitPlan.AssessmentPlan.FormativeAssessmentTable"
        ],
        "StandardsAligned": [
            "UnitPlan.FramingTheLearning.KeyVocabulary.Tiers.Terms.StandardsConnection",
            "UnitPlan.DesiredOutcomes.StandardsAligned"
        ],
        "AccommodationsAndModifications": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase2.Phase2_Accommodations_IndividualSupport",
            "UnitPlan.TeacherGuidancePhase3.Phase3_Accommodations_IndividualSupport"
        ],
        "EssentialQuestions": [
            "UnitPlan.DesiredOutcomes.BigIdeasAndEssentialQuestions.EssentialQuestion"
        ],
        "SpacedLearningAndRetrieval": [
            "UnitPlan.TeacherGuidancePhase1.Phase1_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase2.Phase2_SpacedRetrieval",
            "UnitPlan.TeacherGuidancePhase3.Phase3_SpacedRetrieval"
        ]
    }
  }
  };
})();