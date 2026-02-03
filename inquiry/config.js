window.PLAYGROUND_CONFIG = {
    title: "Inquiry Schema Playground",
    subtitle: "Edit prompt + schema descriptions, stream JSON, then render HTML sections.",
    pillText: "Streaming",
  
    schemaResponseName: "InquiryUnitPlanResponse",
    masterSchema: window.masterSchema,
    defaultPrompt: window.defaultPrompt,
  
    // kao u tvom “drugom app.js”: newline/tab OK, non-ascii ne
    invalidCharRules: {
      allowNewlines: true,
      allowTabs: true,
      allowNonASCII: false
    },
  
    htmlPrompts: [
      { key: "p1", name: "Unit Description",            build: window.unitDescriptionPrompt },
      { key: "p2", name: "Orientation Phase",          build: window.buildOrientationPhasePrompt },
      { key: "p3", name: "Conceptualization Phase",    build: window.buildConceptualizationPhase },
      { key: "p4", name: "Investigation Phase",        build: window.buildInvestigationPhasePrompt },
      { key: "p5", name: "Conclusion Phase",           build: window.buildConclusionPhasePrompt },
      { key: "p6", name: "Discussion Phase",           build: window.buildDiscussionPhasePrompt },
      { key: "p7", name: "Review and Spaced Retrieval",build: window.buildReviewAndSpacedRetrievalPrompt },
      { key: "p8", name: "Formative Assessment",       build: window.buildFormativeAssessmentPrompt },
      { key: "p9", name: "Student Practice",           build: window.buildStudentPracticePrompt }
    ]
  };
  