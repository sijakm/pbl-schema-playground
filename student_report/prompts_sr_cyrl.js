(() => {
/**
 * Prompt Šablon za Izveštaj o Učeniku (Povratna Informacija)
 * Cleo: AI asistent za generisanje povratnih informacija.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE_SR = `
Направите повратну информацију од највише 300 карактера користећи дате податке. (Користићете ове информације – оцене и коментаре наставника о проценама, одговоре ученика на проценама, присуство.)

Повратна информација треба да:
-Буде написана као да се обраћа ученику.  
- Сумира опште ангажовање и трендове у извођењу (нпр. стабилан напредак, недавна побољшања или пад).
- Истакне једну снагу или област успеха специфичну за курс.
- Идентификује једну област за напредак или даје конкретан савет за побољшање или наставак успеха.

Захтеви за излаз:
- НИКАКВО ХТМЛ форматирање.
- Само обичан текст.
- Строго ограничење од 300 карактера.

ИНФОРМАЦИЈЕ О УЧЕНИКУ:
{{$StudentInfo}}

КОНТЕКСТ СИСТЕМА ОЦЕЊИВАЊА:
{{$GradingSystem}}

ЕВИДЕНЦИЈА ПРИСУСТВА:
{{$AttendanceData}}

ОЦЕНЕ И КОМЕНТАРИ НАСТАВНИКА:
{{$GradesData}}
`;

const STUDENT_REPORT_SCHEMA_SR = {
    type: "object",
    properties: {
        feedback: {
            type: "string",
            description: "Генерисани коментар повратне информације, највише 300 карактера."
        }
    },
    required: ["feedback"],
    additionalProperties: false
};

window.studentReportPromptsSRCyrl = {
    STUDENT_REPORT_PROMPT_TEMPLATE_SR,
    STUDENT_REPORT_SCHEMA_SR
};
})();
