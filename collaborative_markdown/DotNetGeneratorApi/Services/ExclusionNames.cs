namespace CheckItLabs.CheckItLearning.AiCore.JsonSchema;

/// <summary>
/// Provides constant identifiers for sections of the LLM response schema that can be excluded.
/// </summary>
public static class ExclusionNames
{
    /// <summary>
    /// Identifier for the AssessPriorKnowledge section to exclude`.
    /// </summary>
    public const string AssessPriorKnowledge = "AssessPriorKnowledge";

    /// <summary>
    /// Identifier for the FormativeAssessments section to exclude.
    /// </summary>
    public const string FormativeAssessments = "FormativeAssessments";

    /// <summary>
    /// Identifier for the EssentialQuestions section to exclude.
    /// </summary>
    public const string EssentialQuestions = "EssentialQuestions";

    /// <summary>
    /// Identifier for the SpacedLearningAndRetrieval section to exclude.
    /// </summary>
    public const string SpacedLearningAndRetrieval = "SpacedLearningAndRetrieval";

    /// <summary>
    /// Identifier for the AccommodationsAndModifications section to exclude.
    /// </summary>
    public const string AccommodationsAndModifications = "AccommodationsAndModifications";

    /// <summary>
    /// Identifier for the StandardsAligned section to exclude.
    /// </summary>
    public const string StandardsAligned = "StandardsAligned";
}
