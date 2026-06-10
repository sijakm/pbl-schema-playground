namespace DotNetGeneratorApi.Models;

public class Step0UnitDescription
{
    public string Description { get; set; } = "";
    public List<string> EssentialQuestions { get; set; } = new();
    public List<string> StudentLearningObjectives { get; set; } = new();
    public List<string> StandardsAligned { get; set; } = new();
}
