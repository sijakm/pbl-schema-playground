using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;
using CheckItLabs.CheckItLearning.AiCore.JsonSchema;

namespace DotNetGeneratorApi.Services;

public class CollaborativeMarkdownService
{
    private readonly string _step0Schema;
    private readonly string _lessonSchema;

    public CollaborativeMarkdownService()
    {
        string jsPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "prompts_collaborative.js");
        if (!File.Exists(jsPath))
        {
            jsPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "prompts_collaborative.js");
        }
        
        if (File.Exists(jsPath))
        {
            string jsContent = File.ReadAllText(jsPath);
            int step0Start = jsContent.IndexOf("STEP0_SCHEMA:") + "STEP0_SCHEMA:".Length;
            int perLessonStart = jsContent.IndexOf("PER_LESSON_SCHEMA:");
            
            _step0Schema = jsContent.Substring(step0Start, perLessonStart - step0Start).Trim().TrimEnd(',');
            
            int perLessonStart2 = perLessonStart + "PER_LESSON_SCHEMA:".Length;
            int end = jsContent.LastIndexOf("};");
            _lessonSchema = jsContent.Substring(perLessonStart2, end - perLessonStart2).Trim();
        }
        else
        {
            _step0Schema = "{}";
            _lessonSchema = "{}";
        }
    }

    public string GenerateMarkdown(string unitTitle, string step0Json, List<string> lessonJsons)
    {
        var sb = new StringBuilder();
        sb.Append(GenerateStep0Markdown(unitTitle, step0Json));
        sb.Append(GenerateLessonsMarkdown(lessonJsons));
        return sb.ToString();
    }

    public string GenerateStep0Markdown(string unitTitle, string step0Json)
    {
        var sb = new StringBuilder();

        if (!string.IsNullOrWhiteSpace(step0Json))
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(unitTitle))
                {
                    sb.AppendLine($"# {unitTitle}");
                    sb.AppendLine();
                }

                var schemaObj = JObject.Parse(_step0Schema);
                var schema = new JsonSchema(schemaObj);
                var localizer = new DummyLocalizer();
                var cache = new Dictionary<string, string>();

                string formatted = schema.FormatJson(JObject.Parse(step0Json), localizer, cache);
                sb.AppendLine(formatted);
            }
            catch (Exception ex)
            {
                sb.AppendLine("<!-- ERROR PARSING STEP0: " + ex.Message + " -->");
                sb.AppendLine(step0Json);
                sb.AppendLine();
            }
        }

        return sb.ToString();
    }

    public string GenerateLessonsMarkdown(List<string> lessonJsons)
    {
        var sb = new StringBuilder();

        if (lessonJsons != null && lessonJsons.Count > 0)
        {
            var localizer = new DummyLocalizer();
            var cache = new Dictionary<string, string>();

            try
            {
                var firstLesson = JObject.Parse(lessonJsons[0]);
                var eqs = firstLesson.SelectToken("LessonDescription.EssentialQuestions");
                if (eqs != null && eqs.Type == JTokenType.Array)
                {
                    var sbCache = new StringBuilder();
                    foreach (var eq in eqs)
                    {
                        sbCache.AppendLine($"- {eq}");
                    }
                    cache["EssentialQuestions"] = sbCache.ToString().Trim();
                }
            }
            catch { }

            var schemaObj = JObject.Parse(_lessonSchema);

            for (int i = 0; i < lessonJsons.Count; i++)
            {
                try
                {
                    var schema = new JsonSchema((JObject)schemaObj.DeepClone());
                    var lessonData = JObject.Parse(lessonJsons[i]);

                    string formatted = schema.FormatJson(lessonData, localizer, cache);
                    sb.AppendLine(formatted);
                }
                catch (Exception ex)
                {
                    sb.AppendLine($"<!-- GREŠKA PRI PARSIRANJU LEKCIJE {i + 1}: {ex.Message} -->");
                    sb.AppendLine(lessonJsons[i]);
                    sb.AppendLine();
                }
            }
        }

        return sb.ToString();
    }
}

public class DummyLocalizer : IStringLocalizer
{
    public LocalizedString this[string name] => new LocalizedString(name, AddSpaces(name));
    public LocalizedString this[string name, params object[] arguments] => this[name];
    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [];
    
    private string AddSpaces(string text) {
        if (string.IsNullOrWhiteSpace(text)) return "";
        return Regex.Replace(text, "([A-Z])", " $1").Trim();
    }
}
