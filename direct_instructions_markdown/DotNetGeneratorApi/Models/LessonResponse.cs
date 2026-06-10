namespace DotNetGeneratorApi.Models
{
    public class LessonResponse
    {
        public LessonDescription LessonDescription { get; set; } = new();
    }

    public class LessonDescription
    {
        public int LessonNumber { get; set; }
        public string LessonTitle { get; set; } = "";
        public List<string> EssentialQuestions { get; set; } = new();
        public List<string> KeyVocabulary { get; set; } = new();
        public List<string> StudentLearningObjectives { get; set; } = new();
        public List<string> StandardsAligned { get; set; } = new();
        
        public AssessPriorKnowledgeSection AssessPriorKnowledge { get; set; } = new();
        public DirectPresentationSection DirectPresentation { get; set; } = new();
        public GuidedPracticeSection GuidedPractice { get; set; } = new();
        public IndependentPracticeSection IndependentPractice { get; set; } = new();
        public ReviewAndSpacedRetrievalSection ReviewAndSpacedRetrieval { get; set; } = new();
        public List<FormativeAssessmentPrompt> FormativeAssessment { get; set; } = new();
        public StudentPracticeSection StudentPractice { get; set; } = new();
    }

    public class DirectPresentationSection
    {
        public List<string> Materials { get; set; } = new();
        public List<TeacherInstructionStep> InstructionsForTeachers { get; set; } = new();
        public List<MisconceptionItem> AnticipatedMisconceptions { get; set; } = new();
        public QuestionPrompt TranscendentThinking { get; set; } = new();
        public QuestionPrompt QuickCheck { get; set; } = new();
    }

    public class TeacherInstructionStep
    {
        public string Instruction { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class MisconceptionItem
    {
        public string Misconception { get; set; } = "";
        public string Correction { get; set; } = "";
    }

    public class QuestionPrompt
    {
        public string Question { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class GuidedPracticeSection
    {
        public List<string> Materials { get; set; } = new();
        public List<TeacherInstructionStep> InstructionsForTeachers { get; set; } = new();
        public QuestionPrompt QuickCheck { get; set; } = new();
        public DifferentiationSection Differentiation { get; set; } = new();
        public AccommodationsAndModificationsSection AccommodationsAndModifications { get; set; } = new();
    }

    public class DifferentiationSection
    {
        public DifferentiationTier LanguageLearners { get; set; } = new();
        public DifferentiationTier AdditionalScaffolding { get; set; } = new();
        public DifferentiationTier GoDeeper { get; set; } = new();
    }

    public class DifferentiationTier
    {
        public List<string> Strategies { get; set; } = new();
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class AccommodationsAndModificationsSection
    {
        public List<string> General { get; set; } = new();
        public List<IndividualSupportItem> IndividualSupport { get; set; } = new();
    }

    public class IndividualSupportItem
    {
        public string StudentName { get; set; } = "";
        public string PlanProvided { get; set; } = "";
        public List<string> PlanImplementation { get; set; } = new();
    }

    public class IndependentPracticeSection
    {
        public List<string> Materials { get; set; } = new();
        public string Purpose { get; set; } = "";
        public List<IndependentPracticeTask> InstructionsForTeachers { get; set; } = new();
        public List<ReflectionPrompt> Reflection { get; set; } = new();
        public EarlyFinishersTask EarlyFinishers { get; set; } = new();
    }

    public class IndependentPracticeTask
    {
        public string TaskName { get; set; } = "";
        public string DOKLevel { get; set; } = "";
        public string TeacherNotes { get; set; } = "";
        public string Instruction { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
        public List<string> SuccessCriteria { get; set; } = new();
    }

    public class ReflectionPrompt
    {
        public string Question { get; set; } = "";
        public string ReflectionType { get; set; } = "";
    }

    public class EarlyFinishersTask
    {
        public string Prompt { get; set; } = "";
        public List<string> Requirements { get; set; } = new();
        public string Justification { get; set; } = "";
    }

    public class ReviewAndSpacedRetrievalSection
    {
        public List<string> Materials { get; set; } = new();
        public string TeacherNotes { get; set; } = "";
        public ActiveRecallTask ActiveRecall { get; set; } = new();
        public QuestionPrompt EssentialQuestionConnection { get; set; } = new();
        public QuestionPrompt TranscendentThinking { get; set; } = new();
        public SpacedRetrievalTask SpacedRetrieval { get; set; } = new();
    }

    public class ActiveRecallTask
    {
        public string Instruction { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
        public List<string> CorrectCommonMisconceptions { get; set; } = new();
    }

    public class SpacedRetrievalTask
    {
        public string HeaderTitle { get; set; } = "";
        public string Instruction { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class FormativeAssessmentPrompt
    {
        public string PromptName { get; set; } = "";
        public string Question { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class StudentPracticeSection
    {
        public string TeacherNotes { get; set; } = "";
        public List<StudentPracticeTaskItem> PracticeTasks { get; set; } = new();
        public ReflectionTask Reflection { get; set; } = new();
    }

    public class StudentPracticeTaskItem
    {
        public string TaskDescription { get; set; } = "";
        public List<string> SuccessCriteria { get; set; } = new();
    }

    public class ReflectionTask
    {
        public string Prompt { get; set; } = "";
        public List<string> ReflectionOptions { get; set; } = new();
    }

    public class AssessPriorKnowledgeSection
    {
        public List<string> ActivityInstructions { get; set; } = new();
        public List<string> ExpectedStudentResponses { get; set; } = new();
        public List<string> ClosingTeacherPrompt { get; set; } = new();
        public List<string> AlternateOptions { get; set; } = new();
    }
}
