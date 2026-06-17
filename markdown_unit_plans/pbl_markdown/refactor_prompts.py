import re
import json

with open("prompts_pbl.js", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove all HtmlPrompt definitions
# These start with const xxxHtmlPrompt = ` and end with `;\n
content = re.sub(r'const\s+\w+HtmlPrompt\s*=\s*`.*?`;\n', '', content, flags=re.DOTALL)

# 2. Remove the array of HtmlPrompts at the bottom
content = re.sub(r'const\s+pblHtmlPrompts\s*=\s*\[.*?\];', '', content, flags=re.DOTALL)

# 3. Modify window.pblPrompts_en export
content = re.sub(r'return\s*\{.*?\};', '''return {
    STEP0_PROMPT_TEMPLATE: defaultPrompt,
    PER_LESSON_PROMPT_TEMPLATE: perLessonPrompt,
    STEP0_SCHEMA: pblResponseSchema,
    PER_LESSON_SCHEMA: pblLessonSchema
  };''', content, flags=re.DOTALL)

# Now for x-format logic, we need to add it to the JSON schemas inside the file.
# Since it's stringified JSON inside JS, it's easier to inject x-format using regex on known properties.

def inject_x_format(text, prop_name, x_format_str):
    pattern = r'("' + prop_name + r'":\s*\{\n\s+"type":\s*"(string|object|array)",)'
    replacement_str = json.dumps(x_format_str)
    return re.sub(pattern, lambda m: m.group(1) + '\n        "x-format": ' + replacement_str + ',', text, count=1)

# UnitDescription
content = inject_x_format(content, "UnitDescription", "{value}")
# AssessPriorKnowledge
content = inject_x_format(content, "AssessPriorKnowledge", "## 💡 {loc.AssessPriorKnowledge}\n\n{value}")
# UnitOverview
content = inject_x_format(content, "UnitOverview", "## 🎯 {loc.UnitOverview}\n\n### {loc.TaskStatement}\n{value.TaskStatement}\n\n### {loc.DrivingQuestion}\n{value.DrivingQuestion}\n\n### {loc.Mission}\n{value.Mission}\n\n### {loc.ProjectContextAndStakeholders}\n{value.ProjectContextAndStakeholders}\n\n### {loc.FinalDeliverableRequirements}\n{value.FinalDeliverableRequirements}\n\n### {loc.ClosingCallToAction}\n{value.ClosingCallToAction}")
# DesiredOutcomes
content = inject_x_format(content, "DesiredOutcomes", "## 🏆 {loc.DesiredOutcomes}\n\n### {loc.StandardsAligned}\n{value.StandardsAligned}\n\n### {loc.BigIdeasAndEssentialQuestions}\n{value.BigIdeasAndEssentialQuestions}\n\n### {loc.LearningObjectives}\n**{loc.StudentsWillUnderstandThat}**\n{value.LearningObjectives.StudentsWillUnderstandThat}\n\n**{loc.StudentsWillKnowThat}**\n{value.LearningObjectives.StudentsWillKnowThat}\n\n**{loc.StudentsWillBeAbleTo}**\n{value.LearningObjectives.StudentsWillBeAbleTo}")
# FramingTheLearning
content = inject_x_format(content, "FramingTheLearning", "## 🖼️ {loc.FramingTheLearning}\n\n### {loc.DrivingQuestion}\n{value.DrivingQuestion}\n\n### {loc.Problem}\n{value.Problem}\n\n### {loc.Project}\n{value.Project}\n\n### {loc.Place}\n{value.Place.PlaceOverview}\n\n**{loc.Sites}**\n{value.Place.Sites}\n\n*{value.Place.PlaceMattersReminder}*\n\n### {loc.KeyVocabulary}\n{value.KeyVocabulary.VocabularyRationale}\n\n{value.KeyVocabulary.Tiers}")
# AssessmentPlan
content = inject_x_format(content, "AssessmentPlan", "## 📝 {loc.AssessmentPlan}\n\n### {loc.AuthenticAudience}\n{value.AuthenticAudience.PrimaryAudienceDescription}\n\n{value.AuthenticAudience.WhyThisAudienceIsQualified}\n\n{value.AuthenticAudience.HowThisAudienceElevatesTheProject}\n\n{value.AuthenticAudience.StudentParticipationInAudienceSelection}\n\n### {loc.FormativeAssessmentTable}\n{value.FormativeAssessmentTable}\n\n### {loc.AnalyticRubric}\n{value.AnalyticRubric}")

# LearningPlan
content = inject_x_format(content, "LearningPlan", "## 📅 {loc.LearningPlan}\n\n{value.LearningPlanOverview}\n\n### {loc.ProjectPhases}\n{value.ProjectPhases}\n\n### {loc.ProjectGoals}\n{value.ProjectGoals}\n\n### {loc.CommunicationToAuthenticAudienceExpectations}\n{value.CommunicationToAuthenticAudienceExpectations}\n\n### {loc.FinalDeliverableSummary}\n{value.FinalDeliverableSummary}\n\n### {loc.GroupSuggestions}\n**{loc.GroupSize}**: {value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n*{value.GroupSuggestions.TeacherGroupingStrategyPrompt}*\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}")

# UnitPreparationAndConsiderations
content = inject_x_format(content, "UnitPreparationAndConsiderations", "## ⚙️ {loc.UnitPreparationAndConsiderations}\n\n### {loc.ClassroomMaterialsAndEquipment}\n{value.ClassroomMaterialsAndEquipment}\n\n### {loc.LocalAndCommunityBasedResources}\n{value.LocalAndCommunityBasedResources}\n\n### {loc.DigitalToolsAndOnlineResources}\n{value.DigitalToolsAndOnlineResources}\n\n### {loc.TechnologyToDeepenInquiry}\n{value.TechnologyToDeepenInquiry}\n\n### {loc.TechnologyForModeling}\n{value.TechnologyForModeling}\n\n### {loc.TechnologyForCollaboration}\n{value.TechnologyForCollaboration}\n\n### {loc.TechnologyForCreatingFinalProduct}\n{value.TechnologyForCreatingFinalProduct}\n\n### {loc.EquityAndAccessibilityConsiderations}\n{value.EquityAndAccessibilityConsiderations}")

# Teacher Guidance Phases 1, 2, 3
for phase in [1, 2, 3]:
    p = str(phase)
    content = inject_x_format(content, f"TeacherGuidancePhase{p}", 
        "## 🧑‍🏫 {loc.TeacherGuidancePhase" + p + "}\n\n### {value.Phase" + p + "_Title}\n\n**Focus Statement**\n{value.Phase" + p + "_FocusStatement}\n\n**Collaborative Activities**\n{value.Phase" + p + "_CollaborativeActivities}\n\n**Guiding Questions**\n{value.Phase" + p + "_GuidingQuestions}\n\n**🪜 Differentiation**\n- **Language Learners:** {value.Phase" + p + "_Differentiation_LanguageLearners}\n- **Scaffolding:** {value.Phase" + p + "_Differentiation_Scaffolding}\n- **Go Deeper:** {value.Phase" + p + "_Differentiation_GoDeeper}\n\n**🤝 Accommodations & Modifications**\n- **General Support:** {value.Phase" + p + "_Accommodations_General}\n- **Individual Support:**\n{value.Phase" + p + "_Accommodations_IndividualSupport}\n\n**❗ Anticipated Misconceptions**\n{value.Phase" + p + "_AnticipatedMisconceptions}\n\n**🌍 Transcendent Thinking**\n{value.Phase" + p + "_TranscendentThinkingPrompts}\n\n**✔ Quick Checks**\n{value.Phase" + p + "_QuickChecks}\n\n**⏳ Spaced Retrieval**\n{value.Phase" + p + "_SpacedRetrieval}\n\n**🖊 Student Practice**\n{value.Phase" + p + "_StudentPractice_TeacherNotes}\n{value.Phase" + p + "_StudentPractice_Tasks}\n\n**🔎 Reflection**\n{value.Phase" + p + "_ReflectionPrompt.Introduction}\n{value.Phase" + p + "_ReflectionPrompt.Prompts}")

# Lesson Schema X-Formats
content = inject_x_format(content, "LessonTitle", "### 📚 {value}")
content = inject_x_format(content, "LessonOutline", "**{loc.LessonOutline}**: {value}\n\n---")
content = inject_x_format(content, "LessonObjectives", "### 🎯 {loc.LessonObjectives}\n\n{value}")
content = inject_x_format(content, "Assessment", "### 📝 {loc.Assessment}\n\n**{loc.FormativeAssessment}**: {value.FormativeAssessment}\n**{loc.SummativeAssessment}**: {value.SummativeAssessment}")

with open("prompts_pbl.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Done!")
