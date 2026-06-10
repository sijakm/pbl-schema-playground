using System.Text;
using System.Text.Json;
using DotNetGeneratorApi.Models;

namespace DotNetGeneratorApi.Services;

public class DirectInstructionsMarkdownService
{
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
                var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                var step0 = JsonSerializer.Deserialize<Step0Response>(step0Json, options);

                if (step0?.UnitDescription != null)
                {
                    var ud = step0.UnitDescription;

                    if (!string.IsNullOrWhiteSpace(unitTitle))
                    {
                        sb.AppendLine($"# {unitTitle}");
                        sb.AppendLine();
                    }

                    if (!string.IsNullOrWhiteSpace(ud.Description))
                    {
                        sb.AppendLine(ud.Description);
                        sb.AppendLine();
                    }

                    if (ud.EssentialQuestions != null && ud.EssentialQuestions.Count > 0)
                    {
                        sb.AppendLine("**Essential Questions & Student Learning Objectives**");
                        sb.AppendLine();
                        sb.AppendLine("## 💭 Essential Questions");
                        sb.AppendLine();
                        foreach (var eq in ud.EssentialQuestions)
                        {
                            sb.AppendLine($"- {eq}");
                        }
                        sb.AppendLine();
                    }

                    if (ud.StudentLearningObjectives != null && ud.StudentLearningObjectives.Count > 0)
                    {
                        sb.AppendLine("## 🎯 Student Learning Objectives");
                        sb.AppendLine();
                        foreach (var slo in ud.StudentLearningObjectives)
                        {
                            sb.AppendLine($"- {slo}");
                        }
                        sb.AppendLine();
                    }

                    if (ud.StandardsAligned != null && ud.StandardsAligned.Count > 0)
                    {
                        sb.AppendLine("## 📏 Standards Aligned");
                        sb.AppendLine();
                        foreach (var std in ud.StandardsAligned)
                        {
                            sb.AppendLine($"- {std}");
                        }
                        sb.AppendLine();
                    }
                }
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
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            for (int i = 0; i < lessonJsons.Count; i++)
            {
                try
                {
                    var lessonResp = JsonSerializer.Deserialize<LessonResponse>(lessonJsons[i], options);
                    if (lessonResp?.LessonDescription != null)
                    {
                        var ld = lessonResp.LessonDescription;

                        sb.AppendLine($"## Lesson {ld.LessonNumber}: {ld.LessonTitle}");
                        sb.AppendLine();

                        if (ld.EssentialQuestions != null && ld.EssentialQuestions.Count > 0)
                        {
                            sb.AppendLine("### 💭 Essential Questions");
                            foreach (var eq in ld.EssentialQuestions) sb.AppendLine($"- {eq}");
                            sb.AppendLine();
                        }

                        if (ld.KeyVocabulary != null && ld.KeyVocabulary.Count > 0)
                        {
                            sb.AppendLine("### 🔤 Key Vocabulary");
                            foreach (var kv in ld.KeyVocabulary) sb.AppendLine($"1. {kv}");
                            sb.AppendLine();
                        }

                        if (ld.StudentLearningObjectives != null && ld.StudentLearningObjectives.Count > 0)
                        {
                            sb.AppendLine("### 🎯 Student Learning Objectives");
                            foreach (var slo in ld.StudentLearningObjectives) sb.AppendLine($"- {slo}");
                            sb.AppendLine();
                        }

                        if (ld.StandardsAligned != null && ld.StandardsAligned.Count > 0)
                        {
                            sb.AppendLine("### 📏 Standards Aligned");
                            foreach (var std in ld.StandardsAligned) sb.AppendLine($"- {std}");
                            sb.AppendLine();
                        }

                        if (ld.LessonNumber == 1 && ld.AssessPriorKnowledge != null && (ld.AssessPriorKnowledge.ActivityInstructions?.Count > 0))
                        {
                            var apk = ld.AssessPriorKnowledge;
                            sb.AppendLine("### 💡 Assess Prior Knowledge");
                            sb.AppendLine();
                            sb.AppendLine("**Teacher Note:** Activating students' prior knowledge isn't just a warm-up—it's neuroscience in action. This process activates existing neural pathways, making it easier for the brain to attach new information to what is already known. This technique, called *elaborative encoding*, helps students move knowledge into long-term memory faster and more effectively, improving both understanding and retention.");
                            sb.AppendLine();

                            int stepNum = 1;
                            if (apk.ActivityInstructions != null)
                            {
                                foreach(var inst in apk.ActivityInstructions)
                                {
                                    sb.AppendLine($"{stepNum}. {inst}");
                                    stepNum++;
                                }
                            }

                            if (apk.ExpectedStudentResponses != null && apk.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("✅Expected Student Responses");
                                int subStepNum = 1;
                                foreach(var resp in apk.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"   {subStepNum}. {resp}");
                                    subStepNum++;
                                }
                            }

                            if (apk.ClosingTeacherPrompt != null)
                            {
                                foreach(var prompt in apk.ClosingTeacherPrompt)
                                {
                                    sb.AppendLine($"{stepNum}. {prompt}");
                                    stepNum++;
                                }
                            }

                            if (apk.AlternateOptions != null && apk.AlternateOptions.Count > 0)
                            {
                                sb.AppendLine("**Alternate Options**");
                                int altNum = 1;
                                foreach(var alt in apk.AlternateOptions)
                                {
                                    sb.AppendLine($"   {altNum}. {alt}");
                                    altNum++;
                                }
                            }
                            sb.AppendLine();
                        }

                        if (ld.DirectPresentation != null)
                        {
                            sb.AppendLine("### {green}(Direct Presentation (10 min))");

                            if (ld.DirectPresentation.Materials != null && ld.DirectPresentation.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚 Materials**");
                                foreach (var mat in ld.DirectPresentation.Materials) sb.AppendLine($"   - {mat}");
                            }

                            if (ld.DirectPresentation.InstructionsForTeachers != null && ld.DirectPresentation.InstructionsForTeachers.Count > 0)
                            {
                                sb.AppendLine("**📋 Instructions for Teachers**");
                                for (int j = 0; j < ld.DirectPresentation.InstructionsForTeachers.Count; j++)
                                {
                                    var step = ld.DirectPresentation.InstructionsForTeachers[j];
                                    sb.AppendLine($"{j + 1}. {step.Instruction}");
                                    
                                    if (step.ExpectedStudentResponses != null && step.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in step.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }
                            }

                            if (ld.DirectPresentation.AnticipatedMisconceptions != null && ld.DirectPresentation.AnticipatedMisconceptions.Count > 0)
                            {
                                sb.AppendLine("**Anticipated Misconceptions**");
                                for (int j = 0; j < ld.DirectPresentation.AnticipatedMisconceptions.Count; j++)
                                {
                                    var misc = ld.DirectPresentation.AnticipatedMisconceptions[j];
                                    sb.AppendLine($"{j + 1}. {misc.Misconception}");
                                    sb.AppendLine($"   - {misc.Correction}");
                                }
                            }

                            if (ld.DirectPresentation.TranscendentThinking != null && !string.IsNullOrWhiteSpace(ld.DirectPresentation.TranscendentThinking.Question))
                            {
                                sb.AppendLine($"**🌍Transcendent Thinking** \"{ld.DirectPresentation.TranscendentThinking.Question}\"");
                                if (ld.DirectPresentation.TranscendentThinking.ExpectedStudentResponses != null && ld.DirectPresentation.TranscendentThinking.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in ld.DirectPresentation.TranscendentThinking.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }

                            if (ld.DirectPresentation.QuickCheck != null && !string.IsNullOrWhiteSpace(ld.DirectPresentation.QuickCheck.Question))
                            {
                                sb.AppendLine($"**Quick Check** \"{ld.DirectPresentation.QuickCheck.Question}\"");
                                if (ld.DirectPresentation.QuickCheck.ExpectedStudentResponses != null && ld.DirectPresentation.QuickCheck.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in ld.DirectPresentation.QuickCheck.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }
                            sb.AppendLine();
                        }

                        if (ld.GuidedPractice != null)
                        {
                            sb.AppendLine("### {green}(Guided Practice (15 min))");

                            if (ld.GuidedPractice.Materials != null && ld.GuidedPractice.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚 Materials**");
                                foreach (var mat in ld.GuidedPractice.Materials) sb.AppendLine($"   - {mat}");
                            }

                            if (ld.GuidedPractice.InstructionsForTeachers != null && ld.GuidedPractice.InstructionsForTeachers.Count > 0)
                            {
                                sb.AppendLine("**📋 Instructions for Teachers**");
                                for (int j = 0; j < ld.GuidedPractice.InstructionsForTeachers.Count; j++)
                                {
                                    var step = ld.GuidedPractice.InstructionsForTeachers[j];
                                    sb.AppendLine($"{j + 1}. {step.Instruction}");
                                    
                                    if (step.ExpectedStudentResponses != null && step.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in step.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }
                            }

                            if (ld.GuidedPractice.QuickCheck != null && !string.IsNullOrWhiteSpace(ld.GuidedPractice.QuickCheck.Question))
                            {
                                sb.AppendLine($"**Quick Check** \"{ld.GuidedPractice.QuickCheck.Question}\"");
                                if (ld.GuidedPractice.QuickCheck.ExpectedStudentResponses != null && ld.GuidedPractice.QuickCheck.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in ld.GuidedPractice.QuickCheck.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }

                            if (ld.GuidedPractice.Differentiation != null)
                            {
                                var diff = ld.GuidedPractice.Differentiation;
                                sb.AppendLine("**🪜 Differentiation**");
                                
                                if (diff.LanguageLearners != null && diff.LanguageLearners.Strategies.Count > 0)
                                {
                                    sb.AppendLine("Language Learners");
                                    foreach (var strategy in diff.LanguageLearners.Strategies)
                                    {
                                        sb.AppendLine($"   - {strategy}");
                                    }
                                    if (diff.LanguageLearners.ExpectedStudentResponses != null && diff.LanguageLearners.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in diff.LanguageLearners.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }

                                if (diff.AdditionalScaffolding != null && diff.AdditionalScaffolding.Strategies.Count > 0)
                                {
                                    sb.AppendLine("Students in Need of Additional Scaffolding");
                                    foreach (var strategy in diff.AdditionalScaffolding.Strategies)
                                    {
                                        sb.AppendLine($"   - {strategy}");
                                    }
                                    if (diff.AdditionalScaffolding.ExpectedStudentResponses != null && diff.AdditionalScaffolding.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in diff.AdditionalScaffolding.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }

                                if (diff.GoDeeper != null && diff.GoDeeper.Strategies.Count > 0)
                                {
                                    sb.AppendLine("Go Deeper");
                                    foreach (var strategy in diff.GoDeeper.Strategies)
                                    {
                                        sb.AppendLine($"   - {strategy}");
                                    }
                                    if (diff.GoDeeper.ExpectedStudentResponses != null && diff.GoDeeper.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in diff.GoDeeper.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }
                            }

                            if (ld.GuidedPractice.AccommodationsAndModifications != null)
                            {
                                var acc = ld.GuidedPractice.AccommodationsAndModifications;
                                if ((acc.General != null && acc.General.Count > 0) || (acc.IndividualSupport != null && acc.IndividualSupport.Count > 0))
                                {
                                    sb.AppendLine("**🤝 Accommodations & Modifications**");
                                    sb.AppendLine();

                                    if (acc.General != null && acc.General.Count > 0)
                                    {
                                        sb.AppendLine("**General support:**");
                                        sb.AppendLine();
                                        foreach (var g in acc.General)
                                        {
                                            sb.AppendLine($"- {g}");
                                        }
                                        sb.AppendLine();
                                    }

                                    if (acc.IndividualSupport != null && acc.IndividualSupport.Count > 0)
                                    {
                                        sb.AppendLine("**Individual support:**");
                                        sb.AppendLine();
                                        foreach (var ind in acc.IndividualSupport)
                                        {
                                            sb.AppendLine($"{{red}}({ind.StudentName})");
                                            sb.AppendLine();
                                            if (!string.IsNullOrWhiteSpace(ind.PlanProvided))
                                            {
                                                sb.AppendLine($"- {ind.PlanProvided}");
                                            }
                                            if (ind.PlanImplementation != null && ind.PlanImplementation.Count > 0)
                                            {
                                                foreach (var impl in ind.PlanImplementation)
                                                {
                                                    sb.AppendLine($"- {impl}");
                                                }
                                            }
                                            sb.AppendLine();
                                        }
                                    }
                                }
                            }
                        }

                        if (ld.IndependentPractice != null)
                        {
                            sb.AppendLine("### {green}(Independent Practice (10 min))");

                            if (ld.IndependentPractice.Materials != null && ld.IndependentPractice.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚Materials**");
                                foreach (var mat in ld.IndependentPractice.Materials) sb.AppendLine($"   - {mat}");
                            }

                            if (!string.IsNullOrWhiteSpace(ld.IndependentPractice.Purpose))
                            {
                                sb.AppendLine($"**Purpose:** {ld.IndependentPractice.Purpose}");
                            }

                            if (ld.IndependentPractice.InstructionsForTeachers != null && ld.IndependentPractice.InstructionsForTeachers.Count > 0)
                            {
                                sb.AppendLine("**📋 Instructions for Teachers**");
                                foreach (var task in ld.IndependentPractice.InstructionsForTeachers)
                                {
                                    sb.AppendLine($"**{task.TaskName} ({task.DOKLevel})**");
                                    if (!string.IsNullOrWhiteSpace(task.TeacherNotes))
                                    {
                                        sb.AppendLine($"**Teacher Notes:** {task.TeacherNotes}");
                                    }
                                    sb.AppendLine($"1. {task.Instruction}");
                                    if (task.ExpectedStudentResponses != null && task.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in task.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                    if (task.SuccessCriteria != null && task.SuccessCriteria.Count > 0)
                                    {
                                        sb.AppendLine("   Success Criteria");
                                        foreach (var sc in task.SuccessCriteria)
                                        {
                                            sb.AppendLine($"   - {sc}");
                                        }
                                    }
                                }
                            }

                            if (ld.IndependentPractice.Reflection != null && ld.IndependentPractice.Reflection.Count > 0)
                            {
                                sb.AppendLine("**🔎Reflection**");
                                foreach (var refl in ld.IndependentPractice.Reflection)
                                {
                                    sb.AppendLine($"   - \"{refl.Question}\" ({refl.ReflectionType})");
                                }
                            }

                            if (ld.IndependentPractice.EarlyFinishers != null && !string.IsNullOrWhiteSpace(ld.IndependentPractice.EarlyFinishers.Prompt))
                            {
                                sb.AppendLine("**Early Finishers**");
                                sb.AppendLine(ld.IndependentPractice.EarlyFinishers.Prompt);
                                if (ld.IndependentPractice.EarlyFinishers.Requirements != null && ld.IndependentPractice.EarlyFinishers.Requirements.Count > 0)
                                {
                                    foreach (var req in ld.IndependentPractice.EarlyFinishers.Requirements)
                                    {
                                        sb.AppendLine($"   - {req}");
                                    }
                                }
                                if (!string.IsNullOrWhiteSpace(ld.IndependentPractice.EarlyFinishers.Justification))
                                {
                                    sb.AppendLine(ld.IndependentPractice.EarlyFinishers.Justification);
                                }
                            }
                            sb.AppendLine();
                        }
                        if (ld.ReviewAndSpacedRetrieval != null)
                        {
                            var rsr = ld.ReviewAndSpacedRetrieval;
                            sb.AppendLine("### {green}(Review & Spaced Retrieval (5 min))");

                            if (rsr.Materials != null && rsr.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚Materials**");
                                foreach (var mat in rsr.Materials) sb.AppendLine($"   - {mat}");
                            }

                            if (!string.IsNullOrWhiteSpace(rsr.TeacherNotes))
                            {
                                sb.AppendLine($"**Teacher Notes:** {rsr.TeacherNotes}");
                            }

                            sb.AppendLine("**📋 Instructions for Teachers**");
                            
                            if (rsr.ActiveRecall != null && !string.IsNullOrWhiteSpace(rsr.ActiveRecall.Instruction))
                            {
                                sb.AppendLine("**Active Recall**");
                                sb.AppendLine($"1. {rsr.ActiveRecall.Instruction}");
                                if (rsr.ActiveRecall.ExpectedStudentResponses != null && rsr.ActiveRecall.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in rsr.ActiveRecall.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                                if (rsr.ActiveRecall.CorrectCommonMisconceptions != null && rsr.ActiveRecall.CorrectCommonMisconceptions.Count > 0)
                                {
                                    sb.AppendLine("   2. Correct Common Misconceptions");
                                    foreach (var misc in rsr.ActiveRecall.CorrectCommonMisconceptions)
                                    {
                                        sb.AppendLine($"      - {misc}");
                                    }
                                }
                            }

                            if (rsr.EssentialQuestionConnection != null && !string.IsNullOrWhiteSpace(rsr.EssentialQuestionConnection.Question))
                            {
                                sb.AppendLine("**💭Essential Question Connection**");
                                sb.AppendLine($"   - {rsr.EssentialQuestionConnection.Question}");
                                if (rsr.EssentialQuestionConnection.ExpectedStudentResponses != null && rsr.EssentialQuestionConnection.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in rsr.EssentialQuestionConnection.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }

                            if (rsr.TranscendentThinking != null && !string.IsNullOrWhiteSpace(rsr.TranscendentThinking.Question))
                            {
                                sb.AppendLine("**🌍Transcendent Thinking**");
                                sb.AppendLine($"1. {rsr.TranscendentThinking.Question}");
                                if (rsr.TranscendentThinking.ExpectedStudentResponses != null && rsr.TranscendentThinking.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in rsr.TranscendentThinking.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }

                            if (rsr.SpacedRetrieval != null && !string.IsNullOrWhiteSpace(rsr.SpacedRetrieval.HeaderTitle))
                            {
                                sb.AppendLine($"**⏳{rsr.SpacedRetrieval.HeaderTitle}**");
                                sb.AppendLine($"1. {rsr.SpacedRetrieval.Instruction}");
                                if (rsr.SpacedRetrieval.ExpectedStudentResponses != null && rsr.SpacedRetrieval.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in rsr.SpacedRetrieval.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }
                            sb.AppendLine();
                        }

                        if (ld.FormativeAssessment != null && ld.FormativeAssessment.Count > 0)
                        {
                            sb.AppendLine("### {green}(✅Formative Assessment)");
                            foreach (var prompt in ld.FormativeAssessment)
                            {
                                sb.AppendLine($"{prompt.PromptName}: \"{prompt.Question}\"");
                                if (prompt.ExpectedStudentResponses != null && prompt.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("   ✅Expected Student Responses");
                                    foreach (var resp in prompt.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"   - {resp}");
                                    }
                                }
                            }
                            sb.AppendLine();
                        }

                        if (ld.StudentPractice != null)
                        {
                            var sp = ld.StudentPractice;
                            sb.AppendLine("### 🖊️ {green}(Student Practice)");

                            if (!string.IsNullOrWhiteSpace(sp.TeacherNotes))
                            {
                                sb.AppendLine($"**Teacher Notes:** {sp.TeacherNotes}");
                            }
                            
                            sb.AppendLine();
                            int taskCounter = 1;

                            if (sp.PracticeTasks != null && sp.PracticeTasks.Count > 0)
                            {
                                foreach (var task in sp.PracticeTasks)
                                {
                                    sb.AppendLine($"{taskCounter}. {task.TaskDescription}");
                                    if (task.SuccessCriteria != null && task.SuccessCriteria.Count > 0)
                                    {
                                        sb.AppendLine("   **Success Criteria**");
                                        foreach (var crit in task.SuccessCriteria)
                                        {
                                            sb.AppendLine($"   - {crit}");
                                        }
                                    }
                                    taskCounter++;
                                }
                            }

                            if (sp.Reflection != null && !string.IsNullOrWhiteSpace(sp.Reflection.Prompt))
                            {
                                sb.AppendLine($"🔎**Reflection:** {sp.Reflection.Prompt}");
                                if (sp.Reflection.ReflectionOptions != null && sp.Reflection.ReflectionOptions.Count > 0)
                                {
                                    foreach (var opt in sp.Reflection.ReflectionOptions)
                                    {
                                        sb.AppendLine($"   - \"{opt}\"");
                                    }
                                }
                            }
                            sb.AppendLine();
                        }
                    }
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
