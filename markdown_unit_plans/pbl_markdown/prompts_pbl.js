window.pblPrompts_en = (function () {
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
                            "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n**{loc.Purpose}:** {loc.PBLAssessPriorKnowledgePurposeText}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
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
                                    "description": "Anticipated answers or common misconceptions for the chosen modality. IMPORTANT: Do not include bullet points, dashes, or numbers at the beginning of the strings.",
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
                            "x-format": "### {green}({loc.UnitTask})\n\n**{loc.Purpose}:** {loc.UnitTaskPurposeValue}\n\n**{loc.Title}: {value.TaskStatementTitle}**\n\n{value.LetterGreeting}\n\n{value.LetterBody}\n\n{value.LetterSignOff}\n\n{value.LetterSender}\n\n**{loc.Mission}:** {value.Mission}\n\n**{loc.ProjectContextAndStakeholders}:** {value.ProjectContextAndStakeholders}\n\n### {green}({loc.DrivingQuestion})\n\n{value.DrivingQuestion}\n\n### {green}({loc.TheDeliverable})\n\n{value.FinalDeliverableRequirements}\n\n{value.ClosingCallToAction}",
                            "additionalProperties": false,
                            "required": [
                                "TaskStatementTitle",
                                "LetterGreeting",
                                "LetterBody",
                                "LetterSignOff",
                                "LetterSender",
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
                                "LetterGreeting": {
                                    "type": "string",
                                    "description": "The opening greeting for the student-facing launch message (e.g., 'Hello engineers-in-training,')."
                                },
                                "LetterBody": {
                                    "x-format": "{items}",
                                    "type": "array",
                                    "items": {
                                        "x-format": "{value}\n\n",
                                        "type": "string"
                                    },
                                    "description": "The main paragraphs of the student-facing launch message (3-5 paragraphs) written like a credible local organization or person. Must include a clear connection to the problem, the driving question, the deliverable requirements, and an inspiring call to action. Urgent, meaningful, authentic. Do NOT include the title, greeting, or sign-off here."
                                },
                                "LetterSignOff": {
                                    "type": "string",
                                    "description": "The sign-off phrase for the message (e.g., 'Sincerely,')."
                                },
                                "LetterSender": {
                                    "type": "string",
                                    "description": "The name of the credible local organization or person sending the message (e.g., 'Coconut Creek STEM Innovation Team')."
                                },
                                "DrivingQuestion": {
                                    "type": "string",
                                    "description": "One strong open-ended Driving Question grounded in place and stakeholder need. This question must also be woven into the LetterBody. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
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
                                    "x-format": "{items}",
                                    "minItems": 5,
                                    "items": {
                                        "type": "string",
                                        "x-format": "{index}. {value}"
                                    },
                                    "description": "Written for students, describe the final deliverable they will create and the authentic audience it serves. Format each item with a bolded title (e.g. **Summary:** ...). Do NOT include any numbering (like 1., 2.) or bullet points at the beginning of your strings; start directly with the bolded title. Must include at least a brief summary, then four components: (1) Concept & Purpose Plan explaining the idea through a visual or written representation and why it matters to the community or context; (2) Evidence-Based Justification requiring analysis of at least two relevant factors and explanation of choices using evidence from research, data, experimentation, or observation; (3) Model or Representation describing the type of model created, what it represents, how it functions, and how it reveals the force, stability, efficiency, or system behind the idea; and (4) The Verdict, a concluding, evidence-backed argument explaining why the solution is effective, feasible, or meaningful, summarizing reasoning, evidence, and model, and communicating the value of the design to the authentic audience. Your final statement should show that you can apply disciplinary knowledge, use evidence, model complex ideas, and explain real-world implications."
                                },
                                "ClosingCallToAction": {
                                    "type": "string",
                                    "description": "Inspiring close: the community/audience is counting on creative thinkers who can turn evidence into action. Emphasize that ancient ideas can inspire modern solutions."
                                }
                            }
                        },
                        "DesiredOutcomes": {
                            "type": "object",
                            "x-format": "### 📏{green}({loc.StandardsAligned})\n\n{value.StandardsAligned}\n\n### 💭{green}({loc.BigIdeasAndEssentialQuestionsAmp})\n\n**{loc.Purpose}:** {loc.BigIdeasPurpose}\n\n{value.BigIdeasAndEssentialQuestions}\n\n### 🎯{green}({loc.LearningObjectives})\n\n🎯**{loc.StudentsWillUnderstandThatLabel}**\n\n{value.LearningObjectives.StudentsWillUnderstandThat}\n\n🎯**{loc.StudentsWillKnowThatLabel}**\n\n{value.LearningObjectives.StudentsWillKnowThat}\n\n🎯**{loc.StudentsWillBeAbleToLabel}**\n\n{value.LearningObjectives.StudentsWillBeAbleTo}",
                            "additionalProperties": false,
                            "required": [
                                "StandardsAligned",
                                "BigIdeasAndEssentialQuestions",
                                "LearningObjectives"
                            ],
                            "properties": {
                                "StandardsAligned": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 1,
                                    "items": {
                                        "type": "string",
                                        "x-format": "- {value}"
                                    },
                                    "description": "Standards listed verbatim when provided, format 'CODE: description'. Do NOT include bullet points at the beginning of your strings."
                                },
                                "BigIdeasAndEssentialQuestions": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 3,
                                    "maxItems": 4,
                                    "description": "Generate 3-4 Big Idea and Essential Question pairs that establish the enduring, transferable concepts anchoring the entire unit, guide inquiry and assessment design, and provide an overarching conceptual framework connecting all tasks, skills, and activities into meaningful understanding.",
                                    "items": {
                                        "type": "object",
                                        "x-format": "\n\n**{loc.BigIdeaLabel}** {value.BigIdea}\n\n- {loc.EssentialQuestionLabel} {value.EssentialQuestion}",
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
                                            "x-format": "{items}",
                                            "minItems": 2,
                                            "items": {
                                                "type": "string",
                                                "x-format": "{index}. {value}"
                                            },
                                            "description": "Each objective must end with (DOK X) and represent Big Ideas or Enduring Understandings by generating 3 to 5 conceptual, long-term statements that explain why the learning matters beyond the unit, highlight transferable patterns, relationships, or principles across contexts, explain how or why something works rather than just what it is, are written as full declarative sentences beginning with a verb, and are each labeled with an appropriate Depth of Knowledge level, emphasizing ideas students can transfer to new situations, future units, and real-world decision making. Do NOT include any numbering or bullet points at the beginning of your strings."
                                        },
                                        "StudentsWillKnowThat": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "minItems": 2,
                                            "items": {
                                                "type": "string",
                                                "x-format": "{index}. {value}"
                                            },
                                            "description": "Each objective must end with (DOK X) and represent Facts or Core Content Knowledge by generating 3 to 5 discipline-specific facts, terms, or foundational knowledge statements that identify essential information students must remember, remain concrete and factual rather than conceptual, support the unit standards and performance tasks, use clear academic vocabulary appropriate to the subject, include an appropriate DOK label typically at level 1 or 2, and complete the stem Students will know that while beginning with a verb. Do NOT include any numbering or bullet points at the beginning of your strings."
                                        },
                                        "StudentsWillBeAbleTo": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "minItems": 2,
                                            "items": {
                                                "type": "string",
                                                "x-format": "{index}. {value}"
                                            },
                                            "description": "Each objective must end with (DOK X) and represent Skills or Practices aligned to the discipline by generating 4 to 7 skills-based statements describing what students will do, such as analyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate; align with discipline-specific practices; connect directly to the project deliverable or performance task; remain measurable and observable; include an appropriate DOK level between 2 and 4; and complete the stem Students will be able to while beginning with a verb. Do NOT include any numbering or bullet points at the beginning of your strings."
                                        }
                                    }
                                }
                            }
                        },
                        "FramingTheLearning": {
                            "type": "object",
                            "x-format": "### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n**{loc.Question}:** {value.DrivingQuestion}\n\n### {green}({loc.Problem})\n\n**{loc.PurposeLabel}** {loc.ProblemPurposeValue}\n\n{value.ProblemDescription}\n### {green}({loc.Project})\n\n**{loc.PurposeLabel}** {loc.ProjectPurposeValue}\n\n{value.ProjectDescription}\n### {green}({loc.Place})\n\n**{loc.PurposeLabel}** {loc.PlacePurposeValue}{value.Sites}\n\n### 🔤 {green}({loc.KeyVocabulary})\n\n{value.KeyVocabulary}",
                            "additionalProperties": false,
                            "required": [
                                "DrivingQuestion",
                                "ProblemDescription",
                                "ProjectDescription",
                                "Sites",
                                "KeyVocabulary"
                            ],
                            "properties": {
                                "DrivingQuestion": {
                                    "type": "string",
                                    "description": "MUST match UnitOverview.DrivingQuestion verbatim. State the actual driving question (e.g. 'How can we design an invention inspired by ancient Egyptian innovation to solve a real problem in our Coconut Creek community?')."
                                },
                                "ProblemDescription": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "description": "The problem description paragraphs explaining the real challenge. Explain why the problem matters and the consequences if it is not addressed, identifying underlying contributing factors. Show how misunderstanding, missing information, or overlooked variables contribute to the issue. Explain how the solution serves a real, relevant authentic audience. Do NOT include any numbering or bullet points at the beginning of your strings.",
                                    "items": {
                                        "type": "string",
                                        "x-format": "{value}\n\n"
                                    }
                                },
                                "ProjectDescription": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "description": "Narrative paragraphs of how learning builds across the multi-day project (inquiry -> apply -> refine -> present). Explain how students begin by exploring examples, notice patterns, apply science knowledge through hands-on tests, then use those findings to develop an original invention. Explain how they revise prototypes and present ideas to an authentic audience. Do NOT include any numbering or bullet points at the beginning of your strings.",
                                    "items": {
                                        "type": "string",
                                        "x-format": "{value}\n\n"
                                    }
                                },
                                "Sites": {
                                    "type": "array",
                                    "minItems": 3,
                                    "maxItems": 5,
                                    "x-format": "{items}",
                                    "description": "Must include 3 to 5 Place-Based Sites of Engagement. Ensure sites represent varied contexts and clearly show how the local community is part of the learning ecosystem.",
                                    "items": {
                                        "type": "object",
                                        "x-format": "\n\n**{value.SiteTitle}**\n\n- **{loc.StudentEngagement}:** {value.StudentEngagement}\n- **{loc.Relevance}:** {value.Relevance}",
                                        "additionalProperties": false,
                                        "required": [
                                            "SiteTitle",
                                            "StudentEngagement",
                                            "Relevance"
                                        ],
                                        "properties": {
                                            "SiteTitle": {
                                                "type": "string",
                                                "description": "A meaningful physical, community, virtual, or discipline-specific location relevant to the unit's context (e.g., 'Coconut Creek Middle School Campus (Primary Investigation Site)')."
                                            },
                                            "StudentEngagement": {
                                                "type": "string",
                                                "description": "Explaining authentic inquiry activities students complete at or with the site such as observation, data collection, interviews, analysis, virtual exploration, or guided field tasks tied to the real-world problem."
                                            },
                                            "Relevance": {
                                                "type": "string",
                                                "description": "Explaining why the site matters by connecting it to the problem, showing how it provides evidence or expertise, clarifying how it supports solution design or modeling, and highlighting local or community-specific significance."
                                            }
                                        }
                                    }
                                },
                                "KeyVocabulary": {
                                    "type": "object",
                                    "x-format": "{value.Tiers}",
                                    "additionalProperties": false,
                                    "required": [
                                        "Tiers"
                                    ],
                                    "properties": {
                                        "Tiers": {
                                            "type": "array",
                                            "minItems": 4,
                                            "maxItems": 4,
                                            "x-format": "{items}",
                                            "description": "Create a Tiered Academic Vocabulary section with exactly four labeled tiers.",
                                            "items": {
                                                "type": "object",
                                                "x-format": "\n\n**{value.TierTitle}**\n\n*{value.TierWhyItMatters}*\n\n{value.Terms}",
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
                                                        "type": "string",
                                                        "description": "A brief italicized sentence explaining how these terms help students in the project context (e.g. 'These terms help students name the most important ideas and objects they will see, build, and discuss during the project.')."
                                                    },
                                                    "Terms": {
                                                        "type": "array",
                                                        "minItems": 3,
                                                        "x-format": "\n\n{items}",
                                                        "description": "List unit-appropriate vocabulary terms with student-friendly definitions.",
                                                        "items": {
                                                            "type": "object",
                                                            "x-format": "{index}. **{value.Term}**: {value.Definition}\n",
                                                            "additionalProperties": false,
                                                            "required": [
                                                                "Term",
                                                                "Definition"
                                                            ],
                                                            "properties": {
                                                                "Term": {
                                                                    "type": "string",
                                                                    "description": "The vocabulary word (e.g., 'force'). Do NOT include any numbering or bullet points."
                                                                },
                                                                "Definition": {
                                                                    "type": "string",
                                                                    "description": "A student-friendly definition."
                                                                }
                                                            }
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
                            "x-format": "### {green}({loc.AlignedAssessmentEvidenceAndCriteriaForSuccess})\n\n**{loc.PurposeLabel}** {loc.AlignedAssessmentPurposeValue}\n\n### {violet}({loc.FormativeAssessmentRubric})\n\n| {loc.StudentLearningObjective} | {loc.SuccessCriteria} | {loc.PointOfDemonstration} |\n|---|---|---|\n{value.FormativeAssessmentTable}\n\n### {violet}({loc.AnalyticRubric})\n\n| {loc.Criterion} | {loc.Novice} | {loc.Apprentice} | {loc.Practitioner} | {loc.Expert} |\n|---|---|---|---|---|\n{value.AnalyticRubric}\n\n### {green}({loc.AuthenticAudience})\n\n**{loc.PurposeLabel}** {loc.AuthenticAudiencePurposeValue}\n\n{value.AuthenticAudience}",
                            "additionalProperties": false,
                            "required": [
                                "FormativeAssessmentTable",
                                "AnalyticRubric",
                                "AuthenticAudience"
                            ],
                            "properties": {
                                "AuthenticAudience": {
                                    "type": "object",
                                    "x-format": "{value.Audiences}\n\n**{loc.StudentParticipationInAudienceSelection}**\n\n{value.StudentParticipation}",
                                    "description": "Identify and engage an authentic audience beyond the classroom.",
                                    "additionalProperties": false,
                                    "required": [
                                        "Audiences",
                                        "StudentParticipation"
                                    ],
                                    "properties": {
                                        "Audiences": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "minItems": 3,
                                            "items": {
                                                "type": "object",
                                                "x-format": "**{value.AudienceName}**\n\n{value.PrimaryAudienceDescription} {value.WhyThisAudienceIsQualified} {value.HowThisAudienceElevatesTheProject}\n\n",
                                                "additionalProperties": false,
                                                "required": [
                                                    "AudienceName",
                                                    "PrimaryAudienceDescription",
                                                    "WhyThisAudienceIsQualified",
                                                    "HowThisAudienceElevatesTheProject"
                                                ],
                                                "properties": {
                                                    "AudienceName": {
                                                        "type": "string",
                                                        "description": "The name of the specific authentic audience group (e.g. 'City of Coconut Creek Sustainability & Environmental Advisory Board'). Do NOT include bullet points or numbering."
                                                    },
                                                    "PrimaryAudienceDescription": {
                                                        "type": "string",
                                                        "description": "Clear description of who this audience is (individuals, organizations, or groups) and their relationship to the project's context or problem. Must be detailed, at least 2-3 sentences."
                                                    },
                                                    "WhyThisAudienceIsQualified": {
                                                        "type": "string",
                                                        "description": "Explanation of why this audience has relevant expertise, lived experience, or authority related to the project topic. Must be detailed, at least 2-3 sentences."
                                                    },
                                                    "HowThisAudienceElevatesTheProject": {
                                                        "type": "string",
                                                        "description": "How the presence of this audience increases authenticity, rigor, motivation, or real-world impact for students. Must be detailed, at least 2-3 sentences."
                                                    }
                                                }
                                            }
                                        },
                                        "StudentParticipation": {
                                            "type": "string",
                                            "description": "A paragraph explaining how students help identify which audience best fits their invention by discussing who would benefit from or evaluate the solution."
                                        }
                                    }
                                },
                                "FormativeAssessmentTable": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 3,
                                    "items": {
                                        "type": "object",
                                        "x-format": "| {value.CriteriaForSuccess} | {value.SuccessCriteria} | {value.PointOfDemonstration} |",
                                        "additionalProperties": false,
                                        "required": [
                                            "CriteriaForSuccess",
                                            "SuccessCriteria",
                                            "PointOfDemonstration"
                                        ],
                                        "properties": {
                                            "CriteriaForSuccess": {
                                                "type": "string",
                                                "description": "The measurable student learning objective ending with DOK level. Do NOT include bullet points or numbering."
                                            },
                                            "SuccessCriteria": {
                                                "type": "string",
                                                "description": "The specific success criteria explaining what the student will do to demonstrate learning. Do NOT include bullet points or numbering."
                                            },
                                            "PointOfDemonstration": {
                                                "type": "string",
                                                "description": "Where the evidence will appear, separated into Formative: and Summative: statements. Do NOT include bullet points or numbering."
                                            }
                                        }
                                    }
                                },
                                "AnalyticRubric": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 4,
                                    "description": "Analytic Rubric detailing the competencies required by the project. Each row represents one evaluated skill. The Novice to Expert progression must reflect increasing sophistication.",
                                    "items": {
                                        "type": "object",
                                        "x-format": "| {value.Criterion} | {value.Novice} | {value.Apprentice} | {value.Practitioner} | {value.Expert} |",
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
                                                "type": "string",
                                                "description": "The evaluated skill, competency, or dimension of the final project. Do NOT include bullet points or numbering."
                                            },
                                            "Novice": {
                                                "type": "string",
                                                "description": "Description of novice level performance. Must not use deficit-based language such as fails, lacks, or missing. Do NOT include bullet points or numbering."
                                            },
                                            "Apprentice": {
                                                "type": "string",
                                                "description": "Description of apprentice level performance. Do NOT include bullet points or numbering."
                                            },
                                            "Practitioner": {
                                                "type": "string",
                                                "description": "Description of practitioner level performance. Do NOT include bullet points or numbering."
                                            },
                                            "Expert": {
                                                "type": "string",
                                                "description": "Description of expert level performance. Must build on the Practitioner level with deeper insight, precision, or complexity. Do NOT include bullet points or numbering."
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "LearningPlan": {
                            "type": "object",
                            "x-format": "### {green}({loc.LearningPlanOverview})\n\n{value.LearningPlanOverview}{value.ProjectPhases}\n\n### {green}({loc.ProjectGoals})\n\n{value.ProjectGoals}\n\n### {loc.FinalDeliverableSummary}\n\n{value.FinalDeliverableSummary}\n\n### {green}({loc.GroupSuggestions})\n\n{value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n**{loc.GuidingQuestionForTeacherPlanning}**\n\n{value.GroupSuggestions.TeacherGroupingStrategyPrompt}\n\n**{loc.GroupingStrategyRecommendations}**\n\n{loc.TeachersMayConsider}\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}",
                            "additionalProperties": false,
                            "required": [
                                "LearningPlanOverview",
                                "ProjectPhases",
                                "ProjectGoals",
                                "FinalDeliverableSummary",
                                "GroupSuggestions"
                            ],
                            "properties": {
                                "LearningPlanOverview": {
                                    "type": "string",
                                    "description": "A 2-4 sentence summary explaining how the project is organized into three flexible phases (Phase 1, Phase 2, Phase 3) rather than fixed day counts. Briefly describe what students do in each phase (e.g., in Phase 1 they build background knowledge; in Phase 2 they apply science ideas through investigations; in Phase 3 they refine prototypes and present to an authentic audience). Do not use bullet points or numbering."
                                },
                                "ProjectPhases": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 3,
                                    "maxItems": 3,
                                    "description": "The three phases of the project. The total duration across all 3 phases MUST exactly equal the total number of days requested for the project.",
                                    "items": {
                                        "type": "object",
                                        "x-format": "\n\n### {violet}({value.PhaseTitle})\n\n{value.PhaseDescription}\n\n**{loc.ConceptsOrSkillsEmphasized}:** {value.ConceptsOrSkills}\n\n**{loc.CollaborationAndVisibleThinking}:** {value.CollaborationAndVisibleThinking}\n\n{value.KeyLearningExperiences}",
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
                                                "type": "string",
                                                "description": "The title and duration of the phase (e.g., 'Phase 1: 1-2 days' or 'Phase 3: 2 days'). IMPORTANT: The duration must be explicitly stated in the title, and the sum of maximum days across all phases must exactly match the total requested project length. Do NOT include bullet points or numbering."
                                            },
                                            "PhaseDescription": {
                                                "type": "string",
                                                "description": "A short 1-2 sentence paragraph describing what students do during this phase to deepen understanding or synthesize learning."
                                            },
                                            "ConceptsOrSkills": {
                                                "type": "string",
                                                "description": "A comma-separated list of the core concepts or skills emphasized in this phase (e.g. 'Observation, questioning, modeling, lever systems, structure stability'). Do NOT include bullet points or numbering."
                                            },
                                            "CollaborationAndVisibleThinking": {
                                                "type": "string",
                                                "description": "A sentence explaining how students collaborate and make their thinking visible in this phase (e.g. 'Students use think-pair-share, sketch notes, and quick group comparisons to make their thinking visible.'). Do NOT include bullet points or numbering."
                                            },
                                            "KeyLearningExperiences": {
                                                "type": "array",
                                                "x-format": "{items}",
                                                "minItems": 3,
                                                "description": "A list of the specific learning activities or tasks in this phase.",
                                                "items": {
                                                    "type": "string",
                                                    "x-format": "- {value}",
                                                    "description": "A specific learning activity (e.g. 'Shaduf build and test'). Do NOT include any numbering or bullet points at the beginning of your strings."
                                                }
                                            }
                                        }
                                    }
                                },
                                "ProjectGoals": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 3,
                                    "description": "The output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs. Goal 1, Apply Disciplinary Content to a Real-World Problem, requires students to use discipline-specific knowledge to analyze or solve an authentic challenge, list 4-6 core concepts or principles they will apply, and show how these ideas connect to real-world conditions or constraints. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, requires describing the authentic challenge students must address, listing what students will create, model, compare, analyze, evaluate, or justify, and including processes such as modeling, predicting, comparing, evaluating, and decision-making. Goal 3, Communicate Findings to a Real Audience, requires students to prepare a polished, professional-quality final product, tailor communication to the needs of a real stakeholder group, and reference authentic audiences such as local experts, community organizations, industry professionals, school leadership, families, or community members.",
                                    "items": {
                                        "type": "string",
                                        "x-format": "{value}\n\n",
                                        "description": "A specific project goal formatted with bold labels (e.g. '**Goal 1: Apply Disciplinary Content to a Real-World Problem** Use knowledge...')"
                                    }
                                },
                                "FinalDeliverableSummary": {
                                    "type": "array",
                                    "x-format": "{items}",
                                    "minItems": 4,
                                    "items": {
                                        "type": "string",
                                        "x-format": "- {value}\n"
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
                                            "description": "The output must state a recommended group size such as 3 to 4 students and must provide a rationale explaining how this size supports productive discussion, shared engagement, and manageable task distribution. Example: 'Group Size 3 to 4 students is ideal because...'"
                                        },
                                        "RotatingRolesAndDuties": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "description": "The output must provide a list of roles formatted as 'Role Name: description of duties'. The list must include at least four roles (Facilitator, Recorder, Materials Manager, Presenter/Communicator) and Teacher expectations at the end.",
                                            "minItems": 4,
                                            "items": {
                                                "type": "string",
                                                "x-format": "- {value}\n"
                                            }
                                        },
                                        "TeacherGroupingStrategyPrompt": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "description": "The model must output exactly these two strings: 1) '\"What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?\"' 2) 'This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit.'",
                                            "items": {
                                                "type": "string",
                                                "x-format": "- {value}\n"
                                            }
                                        },
                                        "GroupingStrategyRecommendations": {
                                            "type": "array",
                                            "x-format": "{items}",
                                            "description": "The model must output the exact grouping strategy recommendations formatted with bold labels (e.g. '**Mixed-ability Groups:** Best when...'). Strategies to include: Mixed-ability Groups, Interest-based Groups, Skills-based Groups, Randomized Groups.",
                                            "minItems": 4,
                                            "items": {
                                                "type": "string",
                                                "x-format": "- {value}\n"
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