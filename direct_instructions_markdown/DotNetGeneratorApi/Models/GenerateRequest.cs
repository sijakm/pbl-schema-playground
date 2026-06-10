namespace DotNetGeneratorApi.Models;

public class GenerateRequest
{
    public string UnitTitle { get; set; } = "";
    public string Step0Json { get; set; } = "";
    public List<string> LessonJsons { get; set; } = new();
}

public class GenerateStep0Request
{
    public string UnitTitle { get; set; } = "";
    public string Step0Json { get; set; } = "";
}

public class GenerateLessonsRequest
{
    public List<string> LessonJsons { get; set; } = new();
}
