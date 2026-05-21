(() => {
/**
 * Prompt Template for Student Report Feedback
 * Cleo: AI Assistant for generating feedback.
 */

const STUDENT_REPORT_PROMPT_TEMPLATE = `
Genera un informe de retroalimentación con no más de 300 caracteres utilizando los datos proporcionados. (Utilizarás esta información: calificaciones y comentarios del profesor sobre las evaluaciones, respuestas de los alumnos a las evaluaciones, asistencia.)

La retroalimentación debe:
-Escribirse como si hablaras directamente al alumno.  
- Resumir la participación general y las tendencias de rendimiento (por ejemplo, progreso constante, mejora reciente o declive).
- Destacar un punto fuerte o un área de éxito específica del curso.
- Identificar un área de crecimiento o dar consejos prácticos para la mejora o el éxito continuo.

Requisitos de salida:
- Sin formato HTML.
- Solo texto plano.
- Límite estricto de 300 caracteres.

INFORMACIÓN DEL ALUMNO:
{{$StudentInfo}}

CONTEXTO DEL SISTEMA DE CALIFICACIÓN:
{{$GradingSystem}}

REGISTRO DE ASISTENCIA:
{{$AttendanceData}}

CALIFICACIONES Y COMENTARIOS DEL PROFESOR:
{{$GradesData}}
`;

const STUDENT_REPORT_SCHEMA = {
    type: "object",
    properties: {
        feedback: {
            type: "string",
            description: "El comentario de retroalimentación generado, máx 300 caracteres."
        }
    },
    required: ["feedback"],
    additionalProperties: false
};

window.studentReportPromptsEs = {
    STUDENT_REPORT_PROMPT_TEMPLATE,
    STUDENT_REPORT_SCHEMA
};
})();
