namespace SharedGeneratorApi.Models.Pbl;

public class GenerateRequest
{
    public string UnitTitle { get; set; } = "";
    public string PblJson { get; set; } = "";
    public string Language { get; set; } = "en";
}
