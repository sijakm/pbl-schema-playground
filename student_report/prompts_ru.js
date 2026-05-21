(() => {
/**
 * Prompt Template for Student Report Feedback
 * Cleo: AI Assistant for generating feedback.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE = `
Напишите отзыв объемом не более 300 символов, используя предоставленные данные. (Вы будете использовать эту информацию — оценки и комментарии учителя по оценкам, ответы ученика на оценки, посещаемость.)

Отзыв должен:
- Быть написан в форме обращения к ученику.  
- Отражать общую успеваемость и тенденции успеваемости (например, устойчивый прогресс, недавнее улучшение или снижение).
- Выделить одну сильную сторону или область успеха, специфичную для курса.
- Определить одну область роста или дать действенный совет для улучшения или дальнейшего успеха.

Требования к выводу:
- Без HTML форматирования.
- Только обычный текст.
- Строгое ограничение в 300 символов.

ИНФОРМАЦИЯ ОБ УЧЕНИКЕ:
{{$StudentInfo}}

КОНТЕКСТ СИСТЕМЫ ОЦЕНИВАНИЯ:
{{$GradingSystem}}

ЗАПИСЬ О ПОСЕЩАЕМОСТИ:
{{$AttendanceData}}

ОЦЕНКИ И КОММЕНТАРИИ УЧИТЕЛЯ:
{{$GradesData}}
`;

const STUDENT_REPORT_SCHEMA = {
    type: "object",
    properties: {
        feedback: {
            type: "string",
            description: "Сгенерированный комментарий обратной связи от Cleo, не более 300 символов."
        }
    },
    required: ["feedback"],
    additionalProperties: false
};

window.studentReportPromptsRu = {
    STUDENT_REPORT_PROMPT_TEMPLATE,
    STUDENT_REPORT_SCHEMA
};
})();
