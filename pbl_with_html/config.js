window.PLAYGROUND_CONFIG = {
    title: "PBL Unit Plan Schema Playground",
    subtitle: "Edit prompt + schema descriptions, stream JSON, then render HTML sections.",
    pillText: "Streaming",
  
    schemaResponseName: "PBLUnitPlanResponse",
    masterSchema: window.masterSchema,
    defaultPrompt: window.defaultPrompt,
  
    // kao u tvom “prvom app.js”: strože (bez newline/tab/non-ascii)
    invalidCharRules: {
      allowNewlines: false,
      allowTabs: false,
      allowNonASCII: false
    },
  
    htmlPrompts: [
      { key: "p1",  name: "Unit Description",                  build: window.buildUnitDescription },
      { key: "p2",  name: "Assess Prior Knowledge",            build: window.buildAssessPriorKnowledge },
      { key: "p3",  name: "Unit Overview",                     build: window.buildUnitOverview },
      { key: "p4",  name: "Desired Outcomes",                  build: window.buildDesiredOutcomes },
      { key: "p5",  name: "Framing the Learning",              build: window.buildFramingTheLearning },
      { key: "p6",  name: "Assessment Plan",                   build: window.buildAssessmentPlan },
      { key: "p7",  name: "Learning Plan",                     build: window.buildLearningPlan },
      { key: "p8",  name: "Teacher Guidance – Phase 1",        build: window.buildTeacherGuidancePhase1 },
      { key: "p9",  name: "Teacher Guidance – Phase 2",        build: window.buildTeacherGuidancePhase2 },
      { key: "p10", name: "Teacher Guidance – Phase 3",        build: window.buildTeacherGuidancePhase3 },
      { key: "p11", name: "Unit Preparation & Considerations", build: window.buildUnitPreparationAndConsiderations }
    ]
  };
  