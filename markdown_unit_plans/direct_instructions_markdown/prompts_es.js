window.promptses = {
  STEP0_PROMPT_TEMPLATE: `Crea el esquema de la unidad y la estructura de las lecciones usando la información de abajo. NO escribas planes de clase completos.
                    
Basándote en el tema de la unidad, los estándares educativos, la descripción/instrucción de la unidad, el nivel de grado, la duración del período de clase (minutos) y el Número de Lecciones solicitado, genera una respuesta en JSON que incluya una UnitDescription coherente y una lista no superpuesta de “contenedores” de lecciones.

Tema de la unidad:
{{$Subject}}

Nombre de la unidad:
{{$Name}}

Descripción/Instrucción de la unidad:
{{$UserPrompt}}

Nivel de grado:
{{$GradeLevel}}

Duración del período de clase en minutos:
{{$ClassDuration}}
	
Estándares a alinear:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/Medios a utilizar:
{{$MediaContext}}
	
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos para las Preguntas Esenciales:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Las preguntas DEBEN poder transferirse entre disciplinas y aplicarse más allá de esta unidad.
- Las preguntas DEBEN reutilizarse textualmente en cada lección dentro de la unidad.

Qué generar:
- La salida DEBE ser JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa por completo todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el enfoque central de la unidad y su recorrido narrativo.
  - "StudentLearningObjectives": Enumera 3 a 5 objetivos de aprendizaje clave y medibles para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordan a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales que sigan las reglas anteriores.
- GENERA la lista "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice comenzando en 1), "lessonName" y "lessonDescription" (2 a 4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuencia lógica desde ideas fundamentales hasta modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente exacto y apropiado para la edad.

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco extra).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Crea UNA planificación de lección (NO un plan de unidad, NO varias lecciones) usando la información de abajo.
DEBES generar JSON válido que coincida exactamente con el esquema JSON proporcionado (LessonPlanResponse con un único objeto "LessonPlan"). No incluyas claves adicionales. Usa un formato JSON compacto (sin líneas en blanco extra).
Asignatura de la unidad: 
{{$Subject}}
Nombre de la unidad: 
{{$Name}}
Descripción/Instrucción de la unidad: 
{{$UserPrompt}}
Nivel de grado: 
{{$GradeLevel}}
Duración del periodo de clase en minutos 
{{$ClassDuration}}
Recursos/medios a usar: 
{{$MediaContext}}
Contenido de la unidad: 
{{$ParentUnitData}}
Estándares a alinear:
{{$Standards}}
Contenido de la lección adjunta: 
{{$AttachedLesson}}

Preguntas esenciales de la unidad (USA ESTAS TEXTUALMENTE):
{{$UnitEssentialQuestions}}

Si las Preguntas esenciales de la unidad arriba están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta, que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una asignatura.
- Las preguntas DEBEN poder transferirse entre disciplinas y aplicarse más allá de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBE usarse SOLO dentro de GuidedPractice.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS IMPORTANTES DE CONTENIDO:
- Mantén la lección alineada con el enfoque de la unidad: desarrollar y usar modelos para describir la composición atómica de moléculas simples y/o estructuras extendidas.
- Incluye conexiones breves y de alto nivel con otros DCI relevantes cuando corresponda, pero mantén la lección centrada en el modelado y el razonamiento estructura-propiedad (sin matemáticas profundas, sin balancear ecuaciones a menos que los estándares lo exijan explícitamente).
- Asegúrate de que todas las partes de la lección reflejen los límites/alcance de la lección indicados arriba; evita introducir nuevos conceptos principales que pertenezcan a otras lecciones.
- EssentialQuestions: DEBE ser exactamente igual a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: SOLO si LessonNumber == 1, escribe 150–250 palabras y sigue la estructura requerida en la descripción del esquema. Si LessonNumber != 1, devuelve "" (cadena vacía).
- DirectPresentation debe ser ≤10 minutos en total y debe seguir el formato requerido HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT con Say/Do/Ask/✅ Expected Student Responses/Write, y las respuestas esperadas de los estudiantes deben estar como viñetas (NO incluyas los encabezados/títulos de sección dentro de la cadena).
- GuidedPractice.InstructionsForTeachers debe tener al menos 700 palabras e incluir los componentes requeridos que se enumeran en la descripción del esquema.
- GuidedPractice.AccommodationsAndModifications debe incluir:
  - General: apoyos generales
  - IndividualSupport: arreglo con exactamente los estudiantes y sus planes proporcionados (mismos nombres/planes; sin estudiantes adicionales).
- StudentPractice DEBE incluir un párrafo TeacherNotes que comience con 'These tasks reinforce today’s learning about ____ by ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, e intercalado si la asignatura es matemáticas.

REQUISITOS DE SALIDA:
- La salida DEBE ser JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser UNA SOLA planificación de lección.
- Sin HTML. Sin emojis. Sin markdown. Texto plano dentro de los campos de cadena.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Descripción de la unidad como un párrafo coherente de texto sin formato (4–5 oraciones completas) escrito con una voz natural de docente que podrías decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional, pero seguir esta estructura (sin encabezados): (1) oración gancho que despierte curiosidad o establezca un contraste sorprendente, (2) oración de \"En esta unidad, tú...\" sobre resultados de dominio, (3) oración de \"Fortalecerás tus habilidades en...\" sobre capacidades de pensamiento/análisis, (4) oración de \"Esto se conecta con...\" sobre relevancia en el mundo real, (5) oración de \"Entender esto importa porque...\" sobre importancia más amplia o impacto a largo plazo."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Crea preguntas esenciales que se centren solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. No menciones ningún término, proceso, vocabulario o ejemplo específico del tema. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las grandes ideas, no en el contenido del tema.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' para toda esta unidad. Cada elemento de la lista debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Enumera todos los estándares educativos únicos utilizados en cualquier parte de esta unidad y sus lecciones. No agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, por ejemplo, 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra–Sol–Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}"
        }
      },
      "required": [
        "Description",
        "EssentialQuestions",
        "StudentLearningObjectives",
        "StandardsAligned"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "type": "array",
      "description": "Lista de contenedores de lecciones para esta unidad (solo esquema). Cada elemento debe no superponerse y estar claramente delimitado para que el contenido de las lecciones no se repita entre lecciones.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Número de orden de una lección. Basado en 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Título breve de la lección como texto sin formato."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 oraciones que describan el alcance de la lección, el enfoque y los límites para evitar superposición con otras lecciones."
          }
        },
        "required": [
          "lessonNumber",
          "lessonTitle",
          "lessonOutline"
        ],
        "additionalProperties": false
      },
      "x-format": false
    }
  },
  "required": [
    "UnitDescription",
    "Lessons"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "UnitDescription.EssentialQuestions"
    ],
    "StandardsAligned": [
      "UnitDescription.StandardsAligned"
    ]
  }
},
  PER_LESSON_SCHEMA: {
  "title": "LessonPlanResponse",
  "type": "object",
  "properties": {
    "LessonDescription": {
      "type": "object",
      "properties": {
        "EssentialQuestions": {
          "type": "array",
          "description": "Solo pega todas las preguntas esenciales a nivel de unidad en el mismo orden si se proporcionaron. Si no se proporcionaron, genera exactamente 3 preguntas conceptuales que se centren solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. No menciones ningún término, proceso, vocabulario o ejemplo específico del tema. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las grandes ideas, no en el contenido del tema.",
          "items": {
            "type": "string"
          },
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Sección completa de 'Vocabulario clave' como una lista de cadenas. Cada cadena debe ser un término único con la definición separada por un guion. Ejemplo: 'Gravedad - La fuerza que atrae los objetos entre sí'. Todas las definiciones deben ser cortas, apropiadas para la edad y directamente relacionadas con el contenido de la lección.",
          "items": {
            "type": "string",
            "x-format": "{index}. {value}"
          },
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' como texto sin formato. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK, por ejemplo, 'Modelar cómo la rotación de la Tierra sobre su eje causa el día y la noche (DOK 2)'.",
          "items": {
            "type": "string",
            "x-format": "- {value}\n"
          },
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Sección completa de 'Alineados a los estándares' para esta lección como una lista. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos que se usaron en la Unidad. Por ejemplo, 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra–Sol–Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
        },
        "AssessPriorKnowledge": {
          "type": "object",
          "description": "Sección de Evaluar conocimientos previos. SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER ARREGLOS VACÍOS para todos los campos. Para la Lección 1, la estructura debe incluir ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt y AlternateOptions. 1. Asegúrate de usar preguntas DOK 1-3. 2. Incluye habilidades prerrequisito. 3. Elige una modalidad y desarróllala completamente. 4. Proporciona indicaciones iniciales del docente, instrucciones, respuestas esperadas, preguntas de cierre y 2 opciones alternativas.",
          "properties": {
            "ActivityInstructions": {
              "type": "array",
              "description": "Pasos secuenciales (por ejemplo, 'Di: ...', 'Proyecta o lee...') para iniciar la actividad.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "ExpectedStudentResponses": {
              "type": "array",
              "description": "Respuestas anticipadas o conceptos erróneos comunes para la modalidad elegida.",
              "items": {
                "type": "string",
                "x-format": "  - {value}"
              },
              "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
            },
            "ClosingTeacherPrompt": {
              "type": "array",
              "description": "Pasos y preguntas de cierre del docente que validen el pensamiento de los estudiantes y anticipen la investigación de la unidad.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "AlternateOptions": {
              "type": "array",
              "description": "2 opciones alternativas breves que un docente podría elegir.",
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "x-format": "**{loc.AlternateOptions}**\n\n{items}"
            }
          },
          "required": [
            "ActivityInstructions",
            "ExpectedStudentResponses",
            "ClosingTeacherPrompt",
            "AlternateOptions"
          ],
          "additionalProperties": false,
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}"
        },
        "DirectPresentation": {
          "type": "object",
          "description": "Sección completa de 'Presentación directa'. Esta es la PRIMERA actividad en clase y no debe durar MÁS DE 10 minutos.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Lista de materiales requeridos (por ejemplo, apoyos visuales, marcadores, etc.)",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Guion del docente organizado en pasos secuenciales siguiendo esta secuencia EXACTA: (1) GANCHO (1–2 min), (2) INTRODUCCIÓN (1–2 min), (3) ENSEÑANZA DIRECTA (4–5 min) y (4) PARTICIPACIÓN GUIADA (2–3 min). No incluyas los encabezados en las cadenas. Cada paso debe incluir el habla del docente (Di:/Pregunta:), las acciones del docente (Haz:/Escribe:/Dibuja:/Muestra:), y, si aplica, respuestas esperadas de los estudiantes.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "La acción específica del docente, comenzando con 'Di: ', 'Haz: ', etc."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Respuestas previstas si la instrucción era una pregunta. Devuelve un arreglo vacío si no aplica.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "AnticipatedMisconceptions": {
              "type": "array",
              "description": "Lista de conceptos erróneos comunes y el lenguaje de corrección exacto para abordar cada uno.",
              "items": {
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "La descripción del concepto erróneo."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "El lenguaje de corrección comenzando con 'Di: '."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}"
              },
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Pregunta de aplicación en el mundo real que conecte el aprendizaje con el propósito/el significado/las ideas grandes.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "Respuestas esperadas de los estudiantes que muestran una comprensión más profunda.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Una verificación final de comprensión para un estudiante que aprende un objetivo de aprendizaje ya declarado en la lección. Esto DEBE ser una tarea individual para CADA estudiante a completar.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "p. ej., 'Toma 2 minutos para dibujar X en tu cuaderno' o 'En un papel borrador, explica por qué Y...'"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 respuestas esperadas específicas de los estudiantes.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.DirectPresentation})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}"
        },
        "GuidedPractice": {
          "type": "object",
          "description": "Sección estructurada de Práctica Guiada con campos separados para materiales, instrucciones, diferenciación y adaptaciones opcionales.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Objetos físicos necesarios requeridos para esta actividad de práctica guiada (p. ej., 'pelotas de poliestireno, hilo, marcadores') formateados como una lista",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Guion del docente organizado en pasos secuenciales. Cada paso debe combinar las acciones del docente y el guion. Termina con indicaciones para circular.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "La acción específica del docente, comenzando con 'Di: ', 'Haz: ', etc."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Respuestas previstas si la instrucción era una pregunta. Devuelve un arreglo vacío si no aplica.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Pregunta final de comprobación de comprensión para la práctica guiada.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 respuestas esperadas de los estudiantes.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "Differentiation": {
              "type": "object",
              "description": "Etiquetado con tres niveles claramente identificados: Estudiantes de Lengua, Estudiantes que Necesitan Andamiaje Adicional, Ir Más Allá. Requisitos: El contenido debe diferenciar la instrucción, no proporcionar adaptaciones ni modificaciones (eso se aborda en otra parte). Las estrategias deben centrarse en cómo enseñar, no en cómo simplificar los materiales. Las actividades deben variar en complejidad y profundidad, alineadas con los mismos objetivos de aprendizaje. Cada nivel debe promover la participación activa, el desarrollo del lenguaje y la comprensión conceptual. Usa un lenguaje claro, dirigido al docente, y haz que los apoyos sean realistas para el uso en el aula.",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Proporciona 2-3 estrategias de enseñanza concretas para estudiantes de lengua. Ejemplos: proporcionar recursos visuales específicos (p. ej., 'Hoja de datos del planeta'), usar marcos de oraciones (p. ej., 'Esto se coloca aquí porque...') o pedir a los estudiantes que hagan gestos/señalen antes de explicar verbalmente. Enfócate en la participación activa y el desarrollo del lenguaje.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}"
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Proporciona 2-3 estrategias de enseñanza concretas para el andamiaje. Ejemplos: proporcionar organizadores/plantillas previamente dibujados, usar una lista de verificación simplificada con preguntas guía específicas o modelar un proceso de pensamiento en voz alta (p. ej., 'Mira cómo yo combino...'). Enfócate en cómo enseñar y variar la complejidad sin simplificar los materiales.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}"
                },
                "GoDeeper": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Propón 1-2 tareas de extensión que profundicen la comprensión conceptual. Incluye desafíos específicos (p. ej., 'Ajusta el espaciado para mostrar...') o preguntas de orden superior (p. ej., '¿Cómo modelarías... con precisión?'). Debe alinearse con los mismos objetivos de aprendizaje.",
                      "x-format": "{items}"
                    },
                    "ExpectedStudentResponses": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Respuestas esperadas de los estudiantes que muestran cómo luce el éxito. Devuelve un arreglo vacío si no aplica.",
                      "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                    }
                  },
                  "required": [
                    "Strategies",
                    "ExpectedStudentResponses"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}\n\n{value.ExpectedStudentResponses}"
                }
              },
              "required": [
                "LanguageLearners",
                "AdditionalScaffolding",
                "GoDeeper"
              ],
              "additionalProperties": false,
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}"
            },
            "AccommodationsAndModifications": {
              "type": "object",
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfócate en el acceso, no en reducir el rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Estrategias no específicas de un estudiante que mejoran el acceso para todos los alumnos (p. ej., apoyos visuales, notas con espacios ya completados, glosario digital, instrucciones fragmentadas). Proporciona 2-4 viñetas.",
                  "x-format": "{items}"
                },
                "IndividualSupport": {
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumera CADA estudiante de forma individual; NO agrupes a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nombre y apellido del estudiante individual que recibe estos apoyos."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "El plan formal proporcionado para este estudiante en el prompt. Divide el plan en una lista clara. Puedes parafrasearlo para mejorar el formato, pero NO omitas ni añadas ninguna información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Herramientas/estructuras/apoyos visuales/organizadores concretos para esta tarea.",
                        "x-format": "{items}"
                      }
                    },
                    "required": [
                      "StudentName",
                      "PlanProvided",
                      "PlanImplementation"
                    ],
                    "additionalProperties": false,
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}"
                  },
                  "x-format": "{items}"
                }
              },
              "required": [
                "General",
                "IndividualSupport"
              ],
              "additionalProperties": false,
              "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.GuidedPractice})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}"
        },
        "IndependentPractice": {
          "type": "object",
          "description": "Sección estructurada de práctica independiente.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Materiales necesarios.",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "Purpose": {
              "type": "string",
              "description": "Propósito de la práctica independiente."
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Tareas secuenciales para la práctica independiente.",
              "items": {
                "type": "object",
                "properties": {
                  "TaskName": {
                    "type": "string"
                  },
                  "DOKLevel": {
                    "type": "string",
                    "description": "p. ej., 'DOK 3' o 'DOK 3-4'"
                  },
                  "TeacherNotes": {
                    "type": "string",
                    "description": "Explicación que conecta la tarea con la presentación/los objetivos."
                  },
                  "Instruction": {
                    "type": "string",
                    "description": "La instrucción específica o el enunciado 'Di:'."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "Respuestas de ejemplo.",
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "2-4 elementos que muestren dominio.",
                    "x-format": "- {loc.SuccessCriteria}\n\n{items}"
                  }
                },
                "required": [
                  "TaskName",
                  "DOKLevel",
                  "TeacherNotes",
                  "Instruction",
                  "ExpectedStudentResponses",
                  "SuccessCriteria"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{loc.Task} {index}:** {value.TaskName} ({value.DOKLevel})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.SuccessCriteria}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "Reflection": {
              "type": "array",
              "description": "Preguntas de autorregulación y trascendencia.",
              "items": {
                "type": "object",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ReflectionType": {
                    "type": "string",
                    "description": "p. ej., 'Autorregulación' o 'Trascendencia'"
                  }
                },
                "required": [
                  "Question",
                  "ReflectionType"
                ],
                "additionalProperties": false,
                "x-format": "- **{value.ReflectionType}:** {value.Question}"
              },
              "x-format": "**{loc.Reflection}**\n\n{items}"
            },
            "EarlyFinishers": {
              "type": "object",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "El prompt/la descripción de la tarea para quienes terminan primero."
                },
                "Requirements": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Elementos específicos que los estudiantes deben abordar.",
                  "x-format": "{items}"
                },
                "Justification": {
                  "type": "string",
                  "description": "Oración de cierre sobre el uso de principios precisos."
                }
              },
              "required": [
                "Prompt",
                "Requirements",
                "Justification"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.EarlyFinishers}**\n\n**{loc.Prompt}:** {value.Prompt}\n\n**{loc.Requirements}:**\n{value.Requirements}\n\n**{loc.Justification}:** {value.Justification}"
            }
          },
          "required": [
            "Materials",
            "Purpose",
            "InstructionsForTeachers",
            "Reflection",
            "EarlyFinishers"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.IndependentPractice})\n\n{value.Materials}\n\n**{loc.Purpose}:** {value.Purpose}\n\n{value.InstructionsForTeachers}\n\n{value.Reflection}\n\n{value.EarlyFinishers}"
        },
        "ReviewAndSpacedRetrieval": {
          "type": "object",
          "description": "Sección de Repaso Estructurado y Recuperación Espaciada. Esta actividad de 5 minutos refuerza conceptos previos y los conecta con el aprendizaje actual.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Materiales requeridos (a menudo no se necesita ninguno).",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "TeacherNotes": {
              "type": "string",
              "description": "Párrafo de Notas para el Docente que explica: cómo esta estrategia de repaso mejora la retención, la conexión con conceptos de aprendizaje previos y cómo la reflexión trascendente profundiza la comprensión.",
              "x-format": "**{loc.TeacherNotes}:** {value}"
            },
            "ActiveRecall": {
              "type": "object",
              "description": "Instrucciones para los Docentes que contienen un estímulo de Recuperación Activa.",
              "properties": {
                "Instruction": {
                  "type": "string",
                  "description": "Estímulo de Recuperación Activa usando compartir en pareja/grupo. Debe usar una afirmación de 'Di:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respuestas Esperadas de los Estudiantes (2-3 ejemplos en viñetas).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                },
                "CorrectCommonMisconceptions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Ejemplos de afirmaciones de ideas erróneas comunes y guiones de respuesta del docente que aborden cada una (por ejemplo, 'Si un estudiante dice X, responde Y').",
                  "x-format": "**{loc.CorrectCommonMisconceptions}**\n\n{items}"
                }
              },
              "required": [
                "Instruction",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}"
            },
            "EssentialQuestionConnection": {
              "type": "object",
              "description": "Conexión con la pregunta esencial de la unidad.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Indicador del docente que vincula con la pregunta de la unidad. Debe usar una afirmación de 'Di:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respuestas Esperadas de los Estudiantes (2-3 ejemplos).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**💭 {loc.EssentialQuestionConnection}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Reflexión sobre la aplicación en el mundo real o el impacto más amplio.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Indicador de aplicación en el mundo real. Debe incluir una instrucción de tiempo para pensar (por ejemplo, 'Tómate 30 segundos para pensar en silencio, luego comparte:') y usar una afirmación de 'Di:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Respuestas Esperadas de los Estudiantes (2-3 ejemplos).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "SpacedRetrieval": {
              "type": "object",
              "description": "Recuerdo de conceptos específicos de aprendizaje previo.",
              "properties": {
                "HeaderTitle": {
                  "type": "string",
                  "description": "Referencia clara a la lección previa específica (por ejemplo, 'Recuperación Espaciada (Se basa en la Unidad 2, Lección 3)')."
                },
                "Instruction": {
                  "type": "string",
                  "description": "Pregunta que conecta conceptos pasados y actuales. Debe usar una afirmación de 'Di:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Criterios de éxito detallados o respuestas esperadas de los estudiantes (2-3 ejemplos).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "HeaderTitle",
                "Instruction",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**⏳ {value.HeaderTitle}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}"
            }
          },
          "required": [
            "Materials",
            "TeacherNotes",
            "ActiveRecall",
            "EssentialQuestionConnection",
            "TranscendentThinking",
            "SpacedRetrieval"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}"
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Exactamente 4 indicaciones de Evaluación Formativa, una para cada nivel de DOK.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "por ejemplo, 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "El texto exacto de la pregunta, por ejemplo, '¿Por qué los planetas permanecen en órbita en lugar de salir volando al espacio?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 respuestas de ejemplo que muestren dominio (entre comillas)."
              }
            },
            "required": [
              "PromptLabel",
              "Question",
              "ExpectedStudentResponses"
            ],
            "additionalProperties": false
          },
          "minItems": 4,
          "maxItems": 4
        },
        "StudentPractice": {
          "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n{value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
          "type": "object",
          "description": "Práctica para la tarea/en casa.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Breve explicación de los objetivos de la práctica, por ejemplo, 'Estas tareas refuerzan el aprendizaje de hoy sobre [topic] al pedir a los estudiantes que observen patrones del mundo real y los expliquen usando los conceptos introducidos en clase...'"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Exactamente 3 tareas de práctica (DOK 2 o DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "por ejemplo, '(DOK 2) Esta noche, sal afuera y escribe 3-4 oraciones...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "TaskDescription",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "minItems": 3,
              "maxItems": 3
            },
            "Reflection": {
              "x-format": "{value.Prompt}\n\n{value.ReflectionOptions}",
              "type": "object",
              "description": "Una tarea de reflexión para los estudiantes.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "por ejemplo, 'Reflexión: Escribe 2-3 oraciones respondiendo a una de las indicaciones:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Exactamente 4 opciones de preguntas de reflexión entre comillas."
                }
              },
              "required": [
                "Prompt",
                "ReflectionOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "TeacherNotes",
            "PracticeTasks",
            "Reflection"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "EssentialQuestions",
        "KeyVocabulary",
        "StudentLearningObjectives",
        "StandardsAligned",
        "AssessPriorKnowledge",
        "DirectPresentation",
        "GuidedPractice",
        "IndependentPractice",
        "ReviewAndSpacedRetrieval",
        "FormativeAssessment",
        "StudentPractice"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "LessonDescription"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "LessonDescription.EssentialQuestions"
    ],
    "StandardsAligned": [
      "LessonDescription.StandardsAligned"
    ],
    "AssessPriorKnowledge": [
      "LessonDescription.AssessPriorKnowledge"
    ],
    "SpacedLearningAndRetrieval": [
      "LessonDescription.ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "LessonDescription.FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "GuidedPractice.AccommodationsAndModifications"
    ]
  }
},
};
