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
        
        public InstructionSection Instruction { get; set; } = new();
        
        public GroupStructureAndRolesSection GroupStructureAndRoles { get; set; } = new();
        
        public CollaborativeActivitiesSection CollaborativeActivities { get; set; } = new();
        
        public ReflectionOnGroupDynamicsSection ReflectionOnGroupDynamics { get; set; } = new();
        public ReviewAndSpacedRetrievalSection ReviewAndSpacedRetrieval { get; set; } = new();
        public List<FormativeAssessmentItem> FormativeAssessment { get; set; } = new();
        public StudentPracticeSection StudentPractice { get; set; } = new();
    }

    public class StudentPracticeSection
    {
        public string TeacherNotes { get; set; } = "";
        public List<PracticeTaskItem> PracticeTasks { get; set; } = new();
        public ReflectionTaskItem Reflection { get; set; } = new();
    }

    public class PracticeTaskItem
    {
        public string TaskDescription { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class ReflectionTaskItem
    {
        public string Prompt { get; set; } = "";
        public List<string> ReflectionOptions { get; set; } = new();
    }

    public class FormativeAssessmentItem
    {
        public string PromptLabel { get; set; } = "";
        public string Question { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class ReviewAndSpacedRetrievalSection
    {
        public List<string> Materials { get; set; } = new();
        public ActiveRecallItem ActiveRecall { get; set; } = new();
        public PromptWithResponsesItem EssentialQuestionConnection { get; set; } = new();
        public PromptWithResponsesItem TranscendentThinking { get; set; } = new();
        public SpacedRetrievalItem SpacedRetrieval { get; set; } = new();
    }

    public class ActiveRecallItem
    {
        public string Say { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
        public List<string> CorrectCommonMisconceptions { get; set; } = new();
    }

    public class PromptWithResponsesItem
    {
        public string Say { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class SpacedRetrievalItem : PromptWithResponsesItem
    {
        public string DrawsFrom { get; set; } = "";
    }

    public class ReflectionOnGroupDynamicsSection
    {
        public DebriefPromptItem DebriefPrompt { get; set; } = new();
        public List<string> TeacherFacilitationOptions { get; set; } = new();
        public string ClosingPrompt { get; set; } = "";
    }

    public class DebriefPromptItem
    {
        public string Say { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
    }

    public class GroupStructureAndRolesSection
    {
        public string GroupSize { get; set; } = "";
        public string TeacherSay { get; set; } = "";
        public GroupRoles Roles { get; set; } = new();
        public string Rotation { get; set; } = "";
    }

    public class GroupRoles
    {
        public string Facilitator { get; set; } = "";
        public string Recorder { get; set; } = "";
        public string MaterialsManager { get; set; } = "";
        public string Timekeeper { get; set; } = "";
        public string Presenter { get; set; } = "";
    }

    public class AssessPriorKnowledgeSection
    {
        public string ActivityInstructions { get; set; } = "";
        public List<string> ExpectedStudentResponses { get; set; } = new();
        public string ClosingTeacherPrompt { get; set; } = "";
        public List<string> AlternateOptions { get; set; } = new();
    }

    public class InstructionSection
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

    public class CollaborativeActivitiesSection
    {
        public List<string> Materials { get; set; } = new();
        public List<TeacherInstructionStep> InstructionsForTeachers { get; set; } = new();
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
}
