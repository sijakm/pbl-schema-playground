using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Localization;
using Newtonsoft.Json.Linq;
using SharedGeneratorApi.Services; // Now JsonSchema is in this namespace

namespace SharedGeneratorApi.Services;

public class MarkdownGeneratorService
{
    private readonly string _step0Schema;
    private readonly string _lessonSchema;

    public MarkdownGeneratorService(string schemaJsFileName)
    {
        string[] possiblePaths = {
            Path.Combine(Directory.GetCurrentDirectory(), "..", "markdown_unit_plans", "collaborative_markdown", schemaJsFileName),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "markdown_unit_plans", "direct_instructions_markdown", schemaJsFileName),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "markdown_unit_plans", "inquiry_markdown", schemaJsFileName),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "markdown_unit_plans", "lab_markdown", schemaJsFileName),
            Path.Combine(Directory.GetCurrentDirectory(), "..", "markdown_unit_plans", "lecture_markdown", schemaJsFileName),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "markdown_unit_plans", "collaborative_markdown", schemaJsFileName),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "markdown_unit_plans", "direct_instructions_markdown", schemaJsFileName),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "markdown_unit_plans", "inquiry_markdown", schemaJsFileName),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "markdown_unit_plans", "lab_markdown", schemaJsFileName),
            Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "markdown_unit_plans", "lecture_markdown", schemaJsFileName)
        };

        string jsPath = null;
        foreach(var path in possiblePaths)
        {
            if (File.Exists(path))
            {
                jsPath = path;
                break;
            }
        }
        
        if (jsPath != null)
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
            Console.WriteLine($"WARNING: Schema file {schemaJsFileName} not found!");
            _step0Schema = "{}";
            _lessonSchema = "{}";
        }
    }

    public string GenerateMarkdown(string unitTitle, string step0Json, List<string> lessonJsons, string language = "en")
    {
        var sb = new StringBuilder();
        sb.Append(GenerateStep0Markdown(unitTitle, step0Json, language));
        sb.Append(GenerateLessonsMarkdown(lessonJsons, language));
        return sb.ToString();
    }

    public string GenerateStep0Markdown(string unitTitle, string step0Json, string language = "en")
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
                var localizer = new JsonLocalizer(language);
                var cache = new Dictionary<string, string>();

                string formatted = schema.FormatJson(JObject.Parse(step0Json), localizer, cache);
                Console.WriteLine("\n=== REZULTAT POSLE KOLEGINOG KODA (STEP 0) ===");
                Console.WriteLine(formatted);
                Console.WriteLine("==============================================\n");
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

    public string GenerateLessonsMarkdown(List<string> lessonJsons, string language = "en")
    {
        var sb = new StringBuilder();

        if (lessonJsons != null && lessonJsons.Count > 0)
        {
            var localizer = new JsonLocalizer(language);
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
                    Console.WriteLine($"\n=== REZULTAT POSLE KOLEGINOG KODA (LEKCIJA {i + 1}) ===");
                    Console.WriteLine(formatted);
                    Console.WriteLine("===================================================\n");
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

public class JsonLocalizer : IStringLocalizer
{
    private readonly JObject _translations;
    private readonly string _language;

    public JsonLocalizer(string language)
    {
        _language = language ?? "en";
        string path = Path.Combine(Directory.GetCurrentDirectory(), "translations.json");
        if (!File.Exists(path))
        {
            path = Path.Combine(AppContext.BaseDirectory, "translations.json");
        }
        
        if (File.Exists(path))
        {
            _translations = JObject.Parse(File.ReadAllText(path));
        }
        else
        {
            _translations = new JObject();
        }
    }

    public LocalizedString this[string name]
    {
        get
        {
            string translated = null;
            if (_translations.TryGetValue(_language, out var langToken) && langToken is JObject langObj)
            {
                if (langObj.TryGetValue(name, out var val))
                {
                    translated = val.ToString();
                }
            }

            if (translated == null && _language != "en")
            {
                if (_translations.TryGetValue("en", out var enToken) && enToken is JObject enObj)
                {
                    if (enObj.TryGetValue(name, out var val))
                    {
                        translated = val.ToString();
                    }
                }
            }

            if (translated == null)
            {
                translated = AddSpaces(name);
            }

            return new LocalizedString(name, translated);
        }
    }

    public LocalizedString this[string name, params object[] arguments] => this[name];
    public IEnumerable<LocalizedString> GetAllStrings(bool includeParentCultures) => [];
    
    private string AddSpaces(string text) {
        if (string.IsNullOrWhiteSpace(text)) return "";
        return Regex.Replace(text, "([A-Z])", " $1").Trim();
    }
}
