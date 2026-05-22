const PRACTICE_QUIZ_PROMPT_ES = `Tu tarea es crear un conjunto mixto de preguntas de práctica usando formatos de opción única (single-choice) y verdadero/falso (true/false).

Genera un total de {{$numberOfQuestions}} preguntas con una mezcla equilibrada de ambos tipos.

Nombre de la lección: {{$workItemTitle}}

Contenido de la lección: {{$context}}

Materia: {{$subject}}

Nivel educativo: {{$gradeLevel}}

Reglas generales:

Usa un lenguaje claro y apropiado para la edad

Concéntrate en los conceptos clave y los objetivos de aprendizaje

Incluye preguntas de recordatorio, aplicación y razonamiento

Evita la ambigüedad

Todo el contenido debe estar en el idioma: Español

Preguntas de opción múltiple (Multiple Choice):

Exactamente 4 opciones de respuesta

Solo 1 respuesta correcta

Cada pregunta evalúa un solo concepto

CRÍTICO: MÉTODO DE GENERACIÓN DE DISTRACTORES (DEBE SEGUIRSE)

Para CADA pregunta de opción múltiple:

Primero identifica la respuesta correcta

Luego genera 3 respuestas incorrectas usando esta estructura:

Una respuesta que sea parcialmente correcta pero incompleta

Una respuesta que esté lógicamente relacionada pero incorrecta en el razonamiento

Una respuesta que sea correcta en el tema pero incorrecta en la condición (por ejemplo, gradual frente a repentino, a largo plazo frente a corto plazo)

Todas las opciones de respuesta deben:

Basarse en el MISMO concepto y el MISMO tipo de evidencia

Responder a la pregunta de la misma manera

Ser similares en longitud y estructura

Ser científica o lógicamente creíbles

Las respuestas incorrectas deben:

Ser algo que un estudiante podría creer de manera realista

Estar cerca de la respuesta correcta pero diferir en una idea clave

Requerir pensamiento para ser eliminadas

Las respuestas incorrectas NO DEBEN:

Ser obviamente incorrectas

Estar sin relación con la pregunta

Ser de otro tema

Ser imposibles de medir o saber

Incluir afirmaciones extremas o exageradas

REVISIÓN ESTRICTA (REQUERIDA ANTES DE LA SALIDA)

Rechaza y reescribe la pregunta si:

Alguna respuesta puede eliminarse instantáneamente sin pensar

Alguna respuesta pertenece a otro tema

La respuesta correcta es obviamente más larga, más clara o más detallada

Todas las respuestas no son interpretaciones competitivas de la MISMA idea

Preguntas de Verdadero/Falso:

Evalúa el razonamiento y la comprensión (no la memorización)

Evita "siempre" o "nunca" a menos que sea preciso

Incluye una mezcla de declaraciones Verdaderas y Falsas

Las declaraciones deben ser claras

Para todos los tipos de preguntas:

Justificación / Retroalimentación para el estudiante:

Proporciona retroalimentación después de cada pregunta para reforzar el aprendizaje

Explica por qué la respuesta correcta es correcta

Aborda por qué los conceptos erróneos son incorrectos cuando sea útil

Toda la salida debe estar en el idioma: Español.

La respuesta DEBE ser un JSON con un conjunto de preguntas de verdadero/falso o de opción única basado en {{$numberOfQuestions}}.

Si {{$numberOfQuestions}} es par, genera exactamente la mitad de cada tipo.

Si {{$numberOfQuestions}} es impar, genera una menos en total (redondea hacia abajo al número par más cercano) y divídelas en partes iguales.

Estructura JSON:

La respuesta debe ser un objeto con un arreglo "questions".

Cada objeto de pregunta DEBE tener TODOS estos campos:

- "question": string

- "questionType": integer (1 para SingleChoice, 4 para TrueFalse)

- "rationale": string (Retroalimentación o justificación para el estudiante después de la pregunta)

- "answers": arreglo de strings

- "correctAnswers": arreglo de enteros

- "correctAnswer": string

Valores específicos para cada tipo:

Para SingleChoice (questionType: 1):

- "answers": arreglo de exactamente 4 strings

- "correctAnswers": arreglo de exactamente un entero (el índice de la respuesta correcta)

- "correctAnswer": DEBE ser "" (cadena vacía)

Para TrueFalse (questionType: 4):

- "answers": DEBE ser [] (arreglo vacío)

- "correctAnswers": DEBE ser [] (arreglo vacío)

- "correctAnswer": DEBE ser "True" o "False"
`;

const PRACTICE_QUIZ_SCHEMA_ES = {
    "title": "PracticeQuizResponse",
    "type": "object",
    "properties": {
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string"
                    },
                    "questionType": {
                        "type": "integer",
                        "enum": [1, 4]
                    },
                    "answers": {
                        "type": "array",
                        "items": { "type": "string" },
                        "description": "Proporcione exactamente 4 respuestas para el tipo 1. Para el tipo 4, proporcione un arreglo vacío."
                    },
                    "correctAnswers": {
                        "type": "array",
                        "items": { "type": "integer" },
                        "description": "Proporcione exactamente un índice para el tipo 1. Para el tipo 4, proporcione un arreglo vacío."
                    },
                    "correctAnswer": {
                        "type": "string",
                        "enum": ["True", "False", ""],
                        "description": "Proporcione 'True' o 'False' para el tipo 4. Para el tipo 1, proporcione una cadena vacía."
                    },
                    "rationale": {
                        "type": "string"
                    }
                },
                "required": ["question", "questionType", "answers", "correctAnswers", "correctAnswer", "rationale"],
                "additionalProperties": false
            }
        }
    },
    "required": ["questions"],
    "additionalProperties": false
};
