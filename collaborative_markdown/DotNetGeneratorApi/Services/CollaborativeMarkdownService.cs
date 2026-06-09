using System.Text;
using System.Text.Json;
using DotNetGeneratorApi.Models;

namespace DotNetGeneratorApi.Services;

public class CollaborativeMarkdownService
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

                        if (ld.LessonNumber == 1 && ld.AssessPriorKnowledge != null && !string.IsNullOrWhiteSpace(ld.AssessPriorKnowledge.ActivityInstructions))
                        {
                            var apk = ld.AssessPriorKnowledge;
                            sb.AppendLine("### 💡 Assess Prior Knowledge");
                            sb.AppendLine();
                            
                            sb.AppendLine("**Teacher note:** Activating students’ prior knowledge isn’t just a warm-up—it’s neuroscience in action. This process activates existing neural pathways, making it easier for the brain to attach new information to what is already known. This technique, called elaborative encoding, helps students move knowledge into long-term memory faster and more effectively, improving both understanding and retention.");
                            sb.AppendLine();
                            
                            if (!string.IsNullOrWhiteSpace(apk.ActivityInstructions))
                            {
                                sb.AppendLine(apk.ActivityInstructions);
                                sb.AppendLine();
                            }
                            
                            if (apk.ExpectedStudentResponses != null && apk.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("✅ Expected Student Responses");
                                sb.AppendLine();
                                foreach (var resp in apk.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"- {resp}");
                                }
                                sb.AppendLine();
                            }
                            
                            if (!string.IsNullOrWhiteSpace(apk.ClosingTeacherPrompt))
                            {
                                sb.AppendLine(apk.ClosingTeacherPrompt);
                                sb.AppendLine();
                            }
                            
                            if (apk.AlternateOptions != null && apk.AlternateOptions.Count > 0)
                            {
                                sb.AppendLine("**Alternate Options**");
                                sb.AppendLine();
                                for (int j = 0; j < apk.AlternateOptions.Count; j++)
                                {
                                    sb.AppendLine($"{j + 1}. {apk.AlternateOptions[j]}");
                                }
                                sb.AppendLine();
                            }
                        }

                        if (ld.Instruction != null)
                        {
                            sb.AppendLine("### {green}(Instruction)");
                            if (ld.Instruction.Materials != null && ld.Instruction.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚 Materials**");
                                foreach (var mat in ld.Instruction.Materials) sb.AppendLine($"- {mat}");
                                sb.AppendLine();
                            }
                            if (ld.Instruction.InstructionsForTeachers != null && ld.Instruction.InstructionsForTeachers.Count > 0)
                            {
                                sb.AppendLine("**📋 Instructions for Teachers**");
                                for (int j = 0; j < ld.Instruction.InstructionsForTeachers.Count; j++)
                                {
                                    var step = ld.Instruction.InstructionsForTeachers[j];
                                    sb.AppendLine($"{j + 1}. {step.Instruction}");
                                    
                                    if (step.ExpectedStudentResponses != null && step.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅ Expected Student Responses");
                                        foreach (var resp in step.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"   - {resp}");
                                        }
                                    }
                                }
                                sb.AppendLine();
                            }
                            if (ld.Instruction.AnticipatedMisconceptions != null && ld.Instruction.AnticipatedMisconceptions.Count > 0)
                            {
                                sb.AppendLine("**⚠️ Anticipated Misconceptions**");
                                for (int j = 0; j < ld.Instruction.AnticipatedMisconceptions.Count; j++)
                                {
                                    var misc = ld.Instruction.AnticipatedMisconceptions[j];
                                    sb.AppendLine($"{j + 1}. {misc.Misconception}");
                                    sb.AppendLine($"   - {misc.Correction}");
                                }
                                sb.AppendLine();
                            }
                            if (ld.Instruction.TranscendentThinking != null && !string.IsNullOrWhiteSpace(ld.Instruction.TranscendentThinking.Question))
                            {
                                sb.AppendLine("### 🌍 Transcendent Thinking");
                                sb.AppendLine();
                                sb.AppendLine(ld.Instruction.TranscendentThinking.Question);
                                sb.AppendLine();
                                if (ld.Instruction.TranscendentThinking.ExpectedStudentResponses != null && ld.Instruction.TranscendentThinking.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("✅ Expected Student Responses");
                                    sb.AppendLine();
                                    foreach (var resp in ld.Instruction.TranscendentThinking.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"- {resp}");
                                    }
                                    sb.AppendLine();
                                }
                            }
                            if (ld.Instruction.QuickCheck != null && !string.IsNullOrWhiteSpace(ld.Instruction.QuickCheck.Question))
                            {
                                sb.AppendLine("**Quick Check**");
                                sb.AppendLine();
                                sb.AppendLine(ld.Instruction.QuickCheck.Question);
                                sb.AppendLine();
                                if (ld.Instruction.QuickCheck.ExpectedStudentResponses != null && ld.Instruction.QuickCheck.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("✅ Expected Student Responses");
                                    sb.AppendLine();
                                    foreach (var resp in ld.Instruction.QuickCheck.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"- {resp}");
                                    }
                                    sb.AppendLine();
                                }
                            }
                        }

                        if (ld.GroupStructureAndRoles != null && !string.IsNullOrWhiteSpace(ld.GroupStructureAndRoles.GroupSize))
                        {
                            var gsr = ld.GroupStructureAndRoles;
                            sb.AppendLine("### {green}(Group Structure & Roles (3–4 min))");
                            sb.AppendLine();
                            sb.AppendLine("**Determine the Purpose:** What is the main purpose of your grouping in this activity—peer support, rich discussion, challenge, or efficiency? Once you know the purpose, choose the best grouping method: mixed-ability, interest-based, skills-based, or random.");
                            sb.AppendLine();
                            sb.AppendLine($"Group Size: {gsr.GroupSize}");
                            sb.AppendLine();
                            sb.AppendLine("📋 Instructions for Teachers");
                            sb.AppendLine();
                            if (!string.IsNullOrWhiteSpace(gsr.TeacherSay))
                            {
                                sb.AppendLine($"Say: \"{gsr.TeacherSay.Trim('\"')}\"");
                                sb.AppendLine();
                            }
                            if (gsr.Roles != null)
                            {
                                if (!string.IsNullOrWhiteSpace(gsr.Roles.Facilitator)) sb.AppendLine($"- **Facilitator:** {gsr.Roles.Facilitator}");
                                if (!string.IsNullOrWhiteSpace(gsr.Roles.Recorder)) sb.AppendLine($"- **Recorder:** {gsr.Roles.Recorder}");
                                if (!string.IsNullOrWhiteSpace(gsr.Roles.MaterialsManager)) sb.AppendLine($"- **Materials Manager:** {gsr.Roles.MaterialsManager}");
                                if (!string.IsNullOrWhiteSpace(gsr.Roles.Timekeeper)) sb.AppendLine($"- **Timekeeper:** {gsr.Roles.Timekeeper}");
                                if (!string.IsNullOrWhiteSpace(gsr.Roles.Presenter)) sb.AppendLine($"- **Presenter:** {gsr.Roles.Presenter}");
                                sb.AppendLine();
                            }
                            if (!string.IsNullOrWhiteSpace(gsr.Rotation))
                            {
                                sb.AppendLine("Rotation:");
                                sb.AppendLine();
                                sb.AppendLine(gsr.Rotation.StartsWith("-") ? gsr.Rotation : $"- {gsr.Rotation}");
                                sb.AppendLine();
                            }
                        }

                        // Hardcoded Collaboration Guidelines
                        sb.AppendLine("### {green}(Collaboration Guidelines (5 min))");
                        sb.AppendLine();
                        sb.AppendLine("Use prompts below to guide student groups to create their own group norms.");
                        sb.AppendLine();
                        sb.AppendLine("- What do you need from each other so this feels fair, respectful, and productive?");
                        sb.AppendLine("- Make a short list of 3–5 group norms you all agree to follow. Ask yourselves: How will we make sure everyone is heard? How will we handle disagreement?");
                        sb.AppendLine("- Imagine someone new joined your group. What rules or agreements would you explain so they know how your group works together? Write those as your norms.");
                        sb.AppendLine("- Turn and talk: What helped your last group activity go well? What made it frustrating? Turn those ideas into ‘Do’ and ‘Don’t’ norms for this group.");
                        sb.AppendLine("- Create one sentence that starts with ‘In our group, we will always…’ and one that starts with ‘In our group, we will not…’. Use these to build your full set of norms.");
                        sb.AppendLine();

                        if (ld.CollaborativeActivities != null)
                        {
                            sb.AppendLine("### {green}(Collaborative Activities (25 min))");
                            if (ld.CollaborativeActivities.Materials != null && ld.CollaborativeActivities.Materials.Count > 0)
                            {
                                sb.AppendLine("**📚 Materials**");
                                foreach (var mat in ld.CollaborativeActivities.Materials) sb.AppendLine($"- {mat}");
                                sb.AppendLine();
                            }
                            if (ld.CollaborativeActivities.InstructionsForTeachers != null && ld.CollaborativeActivities.InstructionsForTeachers.Count > 0)
                            {
                                sb.AppendLine("📋 Instructions for Teachers");
                                sb.AppendLine();
                                int stepCounter = 1;
                                foreach (var step in ld.CollaborativeActivities.InstructionsForTeachers)
                                {
                                    sb.AppendLine($"{stepCounter}. {step.Instruction}");
                                    if (step.ExpectedStudentResponses != null && step.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var response in step.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"     - {response}");
                                        }
                                    }
                                    stepCounter++;
                                }
                                sb.AppendLine();
                            }
                            if (ld.CollaborativeActivities.Differentiation != null)
                            {
                                var diff = ld.CollaborativeActivities.Differentiation;
                                if ((diff.LanguageLearners != null && diff.LanguageLearners.Strategies.Count > 0) ||
                                    (diff.AdditionalScaffolding != null && diff.AdditionalScaffolding.Strategies.Count > 0) ||
                                    (diff.GoDeeper != null && diff.GoDeeper.Strategies.Count > 0))
                                {
                                    sb.AppendLine("**🪜 Differentiation**");
                                    sb.AppendLine();
                                    
                                    if (diff.LanguageLearners != null && diff.LanguageLearners.Strategies.Count > 0)
                                    {
                                        sb.AppendLine("Language Learners");
                                        foreach (var strat in diff.LanguageLearners.Strategies) sb.AppendLine($"- {strat}");
                                        if (diff.LanguageLearners.ExpectedStudentResponses != null && diff.LanguageLearners.ExpectedStudentResponses.Count > 0)
                                        {
                                            sb.AppendLine("  ✅ Expected Student Responses");
                                            foreach (var resp in diff.LanguageLearners.ExpectedStudentResponses) sb.AppendLine($"  - {resp}");
                                        }
                                        sb.AppendLine();
                                    }
                                    
                                    if (diff.AdditionalScaffolding != null && diff.AdditionalScaffolding.Strategies.Count > 0)
                                    {
                                        sb.AppendLine("Students in Need of Additional Scaffolding");
                                        foreach (var strat in diff.AdditionalScaffolding.Strategies) sb.AppendLine($"- {strat}");
                                        if (diff.AdditionalScaffolding.ExpectedStudentResponses != null && diff.AdditionalScaffolding.ExpectedStudentResponses.Count > 0)
                                        {
                                            sb.AppendLine("  ✅ Expected Student Responses");
                                            foreach (var resp in diff.AdditionalScaffolding.ExpectedStudentResponses) sb.AppendLine($"  - {resp}");
                                        }
                                        sb.AppendLine();
                                    }
                                    
                                    if (diff.GoDeeper != null && diff.GoDeeper.Strategies.Count > 0)
                                    {
                                        sb.AppendLine("Go Deeper");
                                        foreach (var strat in diff.GoDeeper.Strategies) sb.AppendLine($"- {strat}");
                                        if (diff.GoDeeper.ExpectedStudentResponses != null && diff.GoDeeper.ExpectedStudentResponses.Count > 0)
                                        {
                                            sb.AppendLine("  ✅ Expected Student Responses");
                                            foreach (var resp in diff.GoDeeper.ExpectedStudentResponses) sb.AppendLine($"  - {resp}");
                                        }
                                        sb.AppendLine();
                                    }
                                }
                            }

                            var acc = ld.CollaborativeActivities.AccommodationsAndModifications;
                            if (acc != null)
                            {
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
                                            if (ind.PlanImplementation != null)
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

                        if (ld.ReflectionOnGroupDynamics != null && !string.IsNullOrWhiteSpace(ld.ReflectionOnGroupDynamics.ClosingPrompt))
                        {
                            var refSection = ld.ReflectionOnGroupDynamics;
                            sb.AppendLine("### {green}(Reflection on Group Dynamics (5 min))");
                            
                            sb.AppendLine($"1. {refSection.DebriefPrompt.Say}");
                            if (refSection.DebriefPrompt.ExpectedStudentResponses != null && refSection.DebriefPrompt.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine($"   ✅Expected Student Responses");
                                foreach (var resp in refSection.DebriefPrompt.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"     - {resp}");
                                }
                            }
                            
                            sb.AppendLine("2. Teacher Facilitation Options");
                            if (refSection.TeacherFacilitationOptions != null)
                            {
                                foreach (var opt in refSection.TeacherFacilitationOptions)
                                {
                                    sb.AppendLine($"   - {opt}");
                                }
                            }
                            
                            sb.AppendLine($"3. {refSection.ClosingPrompt}");
                            sb.AppendLine();
                        }

                        if (ld.ReviewAndSpacedRetrieval != null)
                        {
                            var rs = ld.ReviewAndSpacedRetrieval;
                            sb.AppendLine("### {green}(Review & Spaced Retrieval (5 min))");
                            sb.AppendLine();
                            sb.AppendLine("📚 **Materials**");
                            if (rs.Materials != null && rs.Materials.Count > 0)
                            {
                                foreach (var mat in rs.Materials)
                                {
                                    sb.AppendLine($"   - {mat}");
                                }
                            }
                            else
                            {
                                sb.AppendLine("   - None");
                            }
                            sb.AppendLine();
                            
                            sb.AppendLine("**Teacher Notes:** This strategy boosts retention through active recall and links today's ideas about structural stability to prior force concepts. The transcendent reflection helps students recognize how pyramid design influences everyday thinking about safety, balance, and problem solving. Retrieval practice strengthens memory because students must pull ideas from long-term memory, compare them, and explain them in their own words instead of just rereading notes. The quick comparison also helps students notice patterns in how shape changes performance across different conditions.");
                            sb.AppendLine();
                            
                            sb.AppendLine("📋 **Instructions for Teachers**");
                            
                            sb.AppendLine("   **Active Recall**");
                            sb.AppendLine($"   1. {rs.ActiveRecall.Say}");
                            if (rs.ActiveRecall.ExpectedStudentResponses != null && rs.ActiveRecall.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("      ✅Expected Student Responses");
                                foreach (var resp in rs.ActiveRecall.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"      - {resp}");
                                }
                            }
                            sb.AppendLine("   2. Correct Common Misconceptions");
                            if (rs.ActiveRecall.CorrectCommonMisconceptions != null)
                            {
                                foreach (var mis in rs.ActiveRecall.CorrectCommonMisconceptions)
                                {
                                    sb.AppendLine($"      - {mis}");
                                }
                            }
                            
                            sb.AppendLine("   🔗 **Essential Question Connection**");
                            sb.AppendLine($"   1. {rs.EssentialQuestionConnection.Say}");
                            if (rs.EssentialQuestionConnection.ExpectedStudentResponses != null && rs.EssentialQuestionConnection.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("      ✅Expected Student Responses");
                                foreach (var resp in rs.EssentialQuestionConnection.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"      - {resp}");
                                }
                            }
                            
                            sb.AppendLine("   🌍 **Transcendent Thinking**");
                            sb.AppendLine($"   1. {rs.TranscendentThinking.Say}");
                            if (rs.TranscendentThinking.ExpectedStudentResponses != null && rs.TranscendentThinking.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("      ✅Expected Student Responses");
                                foreach (var resp in rs.TranscendentThinking.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"      - {resp}");
                                }
                            }
                            
                            sb.AppendLine($"   ⏳ **Spaced Retrieval ({rs.SpacedRetrieval.DrawsFrom})**");
                            sb.AppendLine($"   1. {rs.SpacedRetrieval.Say}");
                            if (rs.SpacedRetrieval.ExpectedStudentResponses != null && rs.SpacedRetrieval.ExpectedStudentResponses.Count > 0)
                            {
                                sb.AppendLine("      ✅Expected Student Responses");
                                foreach (var resp in rs.SpacedRetrieval.ExpectedStudentResponses)
                                {
                                    sb.AppendLine($"      - {resp}");
                                }
                            }
                            
                            sb.AppendLine();
                        }

                        if (ld.FormativeAssessment != null && ld.FormativeAssessment.Count > 0)
                        {
                            sb.AppendLine("### ✅ {green}(Formative Assessment)");
                            foreach (var item in ld.FormativeAssessment)
                            {
                                sb.AppendLine($"   {item.PromptLabel}: \"{item.Question}\"");
                                if (item.ExpectedStudentResponses != null && item.ExpectedStudentResponses.Count > 0)
                                {
                                    sb.AppendLine("      ✅Expected Student Responses");
                                    foreach (var resp in item.ExpectedStudentResponses)
                                    {
                                        sb.AppendLine($"        - {resp}");
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

                            if (sp.PracticeTasks != null)
                            {
                                foreach (var task in sp.PracticeTasks)
                                {
                                    sb.AppendLine($"{taskCounter}. {task.TaskDescription}");
                                    if (task.ExpectedStudentResponses != null && task.ExpectedStudentResponses.Count > 0)
                                    {
                                        sb.AppendLine("   ✅Expected Student Responses");
                                        foreach (var resp in task.ExpectedStudentResponses)
                                        {
                                            sb.AppendLine($"     - {resp}");
                                        }
                                    }
                                    taskCounter++;
                                }
                            }

                            if (sp.Reflection != null && !string.IsNullOrWhiteSpace(sp.Reflection.Prompt))
                            {
                                sb.AppendLine($"{taskCounter}. {sp.Reflection.Prompt}");
                                if (sp.Reflection.ReflectionOptions != null && sp.Reflection.ReflectionOptions.Count > 0)
                                {
                                    foreach (var opt in sp.Reflection.ReflectionOptions)
                                    {
                                        sb.AppendLine($"     - \"{opt}\"");
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
