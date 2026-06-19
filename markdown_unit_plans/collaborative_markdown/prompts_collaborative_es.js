window.prompts_collaborative_es = {
  STEP0_PROMPT_TEMPLATE: `Crea el esquema de la unidad y la estructura de las lecciones usando la información de abajo. NO escribas planes completos de lección.
                    
Basándote en el tema de la unidad, los estándares educativos, la descripción/instrucción de la unidad, el nivel de grado, la duración del periodo de clase (minutos) y el número solicitado de lecciones, genera una respuesta JSON que incluya una UnitDescription coherente y una lista no superpuesta de “contenedores” de lecciones.

Tema de la unidad:
{{$Subject}}

Nombre de la unidad:
{{$Name}}

Descripción/Instrucción de la unidad:
{{$UserPrompt}}

Nivel de grado:
{{$GradeLevel}}

Duración del periodo de clase en minutos:
{{$ClassDuration}}
	
Estándares a los que alinearse:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/Medios para usar:
{{$MediaContext}}
	
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos de las Preguntas Esenciales:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con “How” o “Why”.
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Las preguntas DEBEN ser transferibles entre disciplinas y aplicables más allá de esta unidad.
- Las preguntas DEBEN reutilizarse textualmente en cada lección dentro de la unidad.

Qué generar:
- La salida DEBE ser JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa por completo todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el enfoque central de la unidad y su recorrido narrativo.
  - "StudentLearningObjectives": Enumera de 3 a 5 metas de aprendizaje clave y medibles para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordan a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales que sigan las reglas anteriores.
- GENERA la lista "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice basado en 1), "lessonName" y "lessonDescription" (2 a 4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuenciación lógica desde ideas fundamentales hasta un modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente exacto y apropiado para la edad.

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco adicionales).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Crea UN plan de clase de estilo colaborativo (NO un plan de unidad, NO varias lecciones) usando la información de abajo.

DEBES entregar JSON válido que coincida exactamente con el esquema JSON proporcionado (LessonPlanResponse con un único objeto "LessonPlan"). No incluyas claves اضافales. Usa formato JSON compacto (sin líneas en blanco extra).

CONTEXTO DE LA UNIDAD (contexto de solo lectura para coherencia):
Asignatura de la unidad:
{{$Subject}}

Contenido de la unidad: 
{{$ParentUnitData}}

Descripción/Instrucción de la unidad: Crea una unidad usando los siguientes Estándares:
{{$Standards}}

Nivel de grado:
{{$GradeLevel}}

Recursos/medios a usar: 
{{$MediaContext}}

Duración del periodo de clase en minutos:
{{$ClassDuration}}

Título de la lección:
{{$Name}}

Descripción/Instrucción de la unidad: 
{{$UserPrompt}}

Preguntas esenciales de la unidad (USA ESTAS TEXTUALMENTE):
{{$UnitEssentialQuestions}}

Si las Preguntas esenciales de la unidad arriba están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "How" o "Why".
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Deben poder transferirse entre disciplinas y aplicarse más allá de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBE usarse SOLO dentro de CollaborativeActivities.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS IMPORTANTES DE CONTENIDO (Estilo colaborativo):
- Mantén la lección alineada con el enfoque de la unidad y el Alcance/Límites de la lección arriba; evita introducir conceptos nuevos principales que pertenezcan a otras lecciones.
- Relevancia cultural e inclusión: incorpora múltiples perspectivas; conecta con diversas comunidades; evita estereotipos; muestra impactos para todas las personas involucradas.
- Transferencia: integra aplicación y razonamiento en el mundo real a lo largo de toda la lección.
- Intercalado: cuando los estudiantes practiquen/apliquen, mezcla estrategias o conceptos (no práctica bloqueada). Si la lección contiene algún razonamiento tipo matemático, incluye al menos un elemento intercalado DOK 3–4 que mezcle el contenido actual con un concepto de una lección anterior y que requiera justificar la elección de la estrategia.

REGLAS ESPECÍFICAS DE LOS CAMPOS:
- EssentialQuestions: DEBEN coincidir exactamente con las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: Si esta sección es requerida (por ejemplo, para la primera lección o cuando se introducen nuevos conceptos principales), escribe entre 150 y 250 palabras siguiendo la estructura requerida en la descripción del esquema. De lo contrario, devuelve "" (cadena vacía).
- Instruction:
  - InstructionsForTeachers: Estos pasos deben ser exhaustivos e incluir todo el aprendizaje nuevo de la lección con explicaciones de cómo enseñarlo. Sé preciso.
  - Debe incluir cómo introducir el nuevo contenido de la materia (ganchos, preguntas guía, transiciones).
  - Debe incluir el contenido y el guion para que el docente enseñe el contenido de manera directa (definiciones, ejemplos, puntos clave, explicaciones).
  - La estructura debe fluir de manera natural con indicaciones de Say/Do/Ask/Listen for/Write.
  - IMPORTANTE: No incluyas encabezados en mayúsculas (como HOOK, INTRODUCTION, etc.) para las secciones.
  - IMPORTANTE: No incluyas duraciones de tiempo para instrucciones o pasos individuales.
  - TranscendentThinking: Proporciona una pregunta de aplicación al mundo real que conecte el aprendizaje con propósito/significado, seguida de la etiqueta 'Expected Student Responses:' y 2–3 ejemplos.
- GroupStructureAndRoles:
  - La salida DEBE estar dirigida al docente.
  - GroupSize: especifica 'pairs', 'triads' o '4-5 students'.
  - TeacherSay: 1-2 oraciones explicando que los roles importan y que modelarás cómo se ve cada rol.
  - Roles: Debe definir exactamente estos cinco roles (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) con funciones concretas ligadas a las CollaborativeActivities de la lección.
  - Rotation: Una oración que especifique cuándo rotan los roles en ESTA lección (por ejemplo, "Rotate roles after Phase A and again before the gallery walk.").

CollaborativeActivities:
- Crea una actividad colaborativa interdependiente (reemplazo colaborativo para Guided Practice) alineada con el alcance de esta lección.
- Cada estudiante debe contribuir y los grupos deben producir un producto o decisión compartida.
- Incluye señales de tiempo, guion del docente para Say:, prompts de circulación + respuestas esperadas, y una verificación rápida en la que TODOS los estudiantes respondan + respuestas esperadas.
- Incluye Differentiation (3 niveles) y AccommodationsAndModifications (General + IndividualSupport exactamente como se proporciona).
- Si esta es una lección de matemáticas, incluye un problema intercalado DOK 3–4 que mezcle el contenido actual con una lección/unidad previa y explica por qué se incluye; de lo contrario, omite el intercalado.
- ReflectionOnGroupDynamics:
  - Debe durar aproximadamente 5 minutos.
  - Incluye 2–4 preguntas de debrief para estudiantes (por ejemplo, qué salió bien, desafío, si se escuchó su voz).
  - Proporciona acciones de facilitación del docente (exit slip de escritura rápida, autoevaluación grupal 1–5, o discusión de 2 minutos), con preguntas del docente y respuestas esperadas de los estudiantes.
  - Vincula explícitamente la reflexión con CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Misma estructura y requisitos que la versión de Instrucción Directa (ver descripción del esquema).
  - Debe incluir una comprobación de recuperación que conecte con UN concepto de una lección previa (nombra el número de la lección anterior).
- StudentPractice:
  - Práctica para casa/fuera de clase.
  - Debe seguir el formato exacto requerido en la descripción del esquema (incluyendo los marcadores ✅Expected Student Responses).

REQUISITOS DE SALIDA:
- La salida DEBE ser JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser un ÚNICO plan de lección solamente.
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
          "description": "Descripción de la unidad como un solo párrafo coherente de texto plano de 4–5 oraciones completas, escrito con una voz natural de docente que podrías decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional, pero seguir esta estructura (sin encabezados): (1) oración de gancho que despierte curiosidad o haga un contraste sorprendente, (2) oración con \"En esta unidad, aprenderás...\" sobre resultados de dominio, (3) oración con \"Fortalecerás tus habilidades en...\" sobre capacidades de pensamiento/análisis, (4) oración con \"Esto se conecta con...\" sobre relevancia en el mundo real, (5) oración con \"Entender esto importa porque...\" sobre importancia más amplia o impacto a largo plazo."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Crea preguntas esenciales que se centren solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. NO menciones términos, procesos, vocabulario ni ejemplos específicos de ninguna materia. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las grandes ideas, no en el contenido de la materia.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Sección completa de 'Objetivos de Aprendizaje del Estudiante' para toda esta unidad. Cada elemento de la lista debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Enumera todos los estándares educativos únicos usados en cualquier parte de esta unidad y sus lecciones. NO agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código y la descripción del estándar, por ejemplo: 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra–Sol–Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
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
      "x-format": false,
      "type": "array",
      "description": "Lista de contenedores de lecciones para esta unidad (solo esquema). Cada elemento debe no superponerse y tener un alcance claramente definido para que el contenido de las lecciones no se repita entre ellas.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Número de orden de una lección. Basado en 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Título corto de la lección como texto plano."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 oraciones que describan el alcance, el enfoque y los límites de la lección para evitar superposición con otras lecciones."
          }
        },
        "required": [
          "lessonNumber",
          "lessonTitle",
          "lessonOutline"
        ],
        "additionalProperties": false
      }
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
        "LessonTitle": {
          "x-format": "# {value}",
          "type": "string",
          "description": "Título descriptivo corto para la lección. No incluyas emojis aquí."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Pega simplemente todas las preguntas esenciales de la unidad en el mismo orden si se proporcionaron. Si no se proporcionaron, genera exactamente 3 preguntas conceptuales que se centren solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. No menciones términos, procesos, vocabulario ni ejemplos específicos de ninguna materia. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las grandes ideas, no en el contenido de la materia.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Lista de cadenas 'Término - Definición'. Las definiciones deben ser breves, apropiadas para la edad y estar vinculadas a esta lección.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 objetivos medibles, cada uno terminando con una etiqueta DOK entre paréntesis.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Estándares educativos alineados para esta lección. Deben coincidir exactamente con los estándares de la unidad en código + descripción.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Sección de Conocimientos Previos del Estudiante. SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS OTRAS LECCIONES DEBEN DEVOLVER NULL u omitir este campo. Para la Lección 1, la estructura debe incluir ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt y AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Instrucciones claras y plantilla/estructura para la modalidad elegida. Por ejemplo: 'Di: \"Antes de construir...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Respuestas anticipadas o ideas erróneas comunes para la modalidad elegida.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Indicador final del docente que diga: 'Di:' y valide el pensamiento de los estudiantes y anticipe la investigación de la unidad."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 breves opciones alternativas que un docente podría elegir.",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "ActivityInstructions",
            "ExpectedStudentResponses",
            "ClosingTeacherPrompt",
            "AlternateOptions"
          ],
          "additionalProperties": false
        },
        "Instruction": {
          "x-format": "### {green}({loc.Instruction})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}",
          "type": "object",
          "description": "Sección 'Instrucción' de la lección colaborativa (equivalente a Presentación Directa).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Lista de materiales.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Guion del docente organizado en pasos secuenciales. Estos pasos deben actuar colectivamente como una guía exhaustiva para ayudar al docente a impartir contenido nuevo. Debe incluir cómo introducir el contenido del nuevo tema (ganchos, preguntas guía, transiciones), y contenido/guion para que el docente enseñe directamente (definiciones, ejemplos, puntos clave, explicaciones). Las instrucciones deben ser completas e incluir todo el aprendizaje nuevo para la lección con explicaciones sobre cómo enseñarlo. Sea preciso. No incluya encabezados en mayúsculas para las secciones y no incluya marcas de tiempo.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "La acción del docente, por ejemplo: Di: '...', Haz: '...', Pregunta: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Respuestas anticipadas si la instrucción era una pregunta. Devuelva un arreglo vacío si no aplica.",
                    "items": {
                      "x-format": "  - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "description": "Lista de concepciones erróneas comunes y el lenguaje exacto de corrección para abordar cada una.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "La descripción de la concepción errónea."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "El lenguaje de corrección que comienza con 'Di: '."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false
              }
            },
            "TranscendentThinking": {
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Pregunta de aplicación en el mundo real que conecte el aprendizaje con el propósito/significado.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 respuestas esperadas de los estudiantes que muestren una comprensión más profunda.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "QuickCheck": {
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Pregunta final de comprobación de comprensión.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 respuestas esperadas de los estudiantes.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false
        },
        "GroupStructureAndRoles": {
          "x-format": "### {green}({loc.GroupStructureAndRoles})\n\n{loc.DetermineThePurpose}\n\n{value.GroupSize}\n\n**📋 {loc.InstructionsForTeachers}**\n{value.TeacherSay}\n\n{value.Roles}\n\n{value.Rotation}",
          "type": "object",
          "description": "Tamaño del grupo, guion del docente, roles definidos y rotación.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "por ejemplo, 'parejas', 'ternas' o '4-5 estudiantes'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Guion del docente explicando los roles."
            },
            "Roles": {
              "x-format": "{value.Facilitator}\n{value.Recorder}\n{value.MaterialsManager}\n{value.Timekeeper}\n{value.Presenter}",
              "type": "object",
              "properties": {
                "Facilitator": {
                  "x-format": "- **{loc.Facilitator}:** {value}",
                  "type": "string"
                },
                "Recorder": {
                  "x-format": "- **{loc.Recorder}:** {value}",
                  "type": "string"
                },
                "MaterialsManager": {
                  "x-format": "- **{loc.MaterialsManager}:** {value}",
                  "type": "string"
                },
                "Timekeeper": {
                  "x-format": "- **{loc.Timekeeper}:** {value}",
                  "type": "string"
                },
                "Presenter": {
                  "x-format": "- **{loc.Presenter}:** {value}",
                  "type": "string"
                }
              },
              "required": [
                "Facilitator",
                "Recorder",
                "MaterialsManager",
                "Timekeeper",
                "Presenter"
              ],
              "additionalProperties": false
            },
            "Rotation": {
              "x-format": "{loc.Rotation}:\n- {value}",
              "type": "string",
              "description": "Oración que especifique cuándo rotan los roles."
            }
          },
          "required": [
            "GroupSize",
            "TeacherSay",
            "Roles",
            "Rotation"
          ],
          "additionalProperties": false
        },
        "CollaborationGuidelines": {
          "x-format": "### {green}({loc.CollaborationGuidelines})\n\n{loc.CollaborationGuidelinesIntro}\n\n{items}",
          "type": "array",
          "description": "Indicaciones para ayudar a los grupos a crear sus propias normas de colaboración.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Trabajo grupal interdependiente (sustituto colaborativo para la Práctica Guiada). Dirigido al docente, altamente estructurado y diseñado para que los estudiantes no puedan completar la tarea por sí solos. Debe incluir: (a) interdependencia clara (rompecabezas, construcción de consenso, recorrido por galerías, desafío estructurado de resolución de problemas o similar), (b) tiempo explícito para cada fase (por ejemplo, '8 minutos de discusión, 2 minutos para preparar la respuesta'), (c) facilitación guionizada por el docente usando en todo momento enunciados con 'Di:', (d) un producto grupal compartido (afirmación, modelo, tabla, conjunto de soluciones, artefacto de galería, etc.), (e) indicaciones de circulación con respuestas esperadas de los estudiantes, (f) al menos una comprobación de respuesta de TODO EL GRUPO (pizarras blancas, escritura rápida, votación, pulgares, etc.) con respuestas esperadas, (g) pregunta de comprobación rápida + respuestas esperadas, (h) diferenciación en tres niveles centrada en la instrucción (no en adaptaciones), y (i) AccommodationsAndModifications separadas en apoyos generales y soporte individual exactamente coincidentes con los estudiantes/planes proporcionados. Asegure la relevancia cultural y la inclusión invitando a múltiples perspectivas y garantizando una participación equitativa.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Lista completa de materiales del docente y de los estudiantes utilizados en esta actividad colaborativa. Incluya cualquier elemento preparado (tarjetas de consignas, marcos de oración, tarjetas de roles, listas de verificación, rúbricas, hojas para recorrido por galerías, pizarras blancas, temporizadores, apoyos visuales, bancos de palabras, etc.). Un elemento por cada elemento del arreglo; sin marcadores de posición.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Guion del docente para la actividad colaborativa (apunte a 6-8 pasos numerados). Asegúrese de que un paso sea explícitamente 'Circulation Prompts:' y que incluya preguntas específicas para hacer a los grupos mientras trabajan.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "La acción específica del docente, comenzando con 'Di: ', 'Haz: ', o exactamente 'Circulation Prompts:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "SOLO complete esto si la instrucción es 'Circulation Prompts:'. Enumere preguntas específicas para hacer a los grupos mientras circula. OMITA esta propiedad si no aplica.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "La pregunta que hacer al grupo."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Respuestas esperadas a este indicio de circulación específico. OMITE esta propiedad si no hay ninguna.",
                          "items": {
                            "x-format": "       - {value}",
                            "type": "string"
                          }
                        }
                      },
                      "required": [
                        "Prompt",
                        "ExpectedStudentResponses"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "\n   ✅ {loc.ExpectedStudentResponses}\n{items}",
                    "type": "array",
                    "description": "Respuestas anticipadas si la Instrucción fue una pregunta directa a la clase. OMITE esta propiedad si no aplica.",
                    "items": {
                      "x-format": "     - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "CirculationPrompts",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
              "description": "Etiquetado con tres niveles claramente identificados: Estudiantes de idiomas, Estudiantes que necesitan andamiaje adicional, Profundizar más. Requisitos: El contenido debe diferenciar la instrucción, no proporcionar apoyos ni modificaciones (eso se aborda en otra parte). Las estrategias deben centrarse en cómo enseñar, no en cómo simplificar los materiales. Las actividades deben variar en complejidad y profundidad, alineadas con los mismos objetivos de aprendizaje. Cada nivel debe promover la participación activa, el desarrollo del lenguaje y la comprensión conceptual. Usa un lenguaje claro, dirigido al docente, y haz que los apoyos sean realistas para el uso en el aula.",
              "properties": {
                "LanguageLearners": {
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Proporciona 2-3 estrategias de enseñanza concretas para estudiantes de idiomas. Ejemplos: proporcionar elementos visuales específicos (p. ej., 'Planet Fact Sheet'), usar marcos de oración (p. ej., 'Esto se coloca aquí porque...') o pedir a los estudiantes que gesticulen/señalen antes de explicar verbalmente. Enfócate en la participación activa y el desarrollo del lenguaje."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Proporciona 2-3 estrategias de enseñanza concretas para el andamiaje. Ejemplos: proporcionar organizadores/plantillas ya dibujados, usar una lista de verificación simplificada con preguntas guía específicas, o modelar un proceso de pensar en voz alta (p. ej., 'Mira cómo hago coincidir...'). Enfócate en cómo enseñar y variar la complejidad sin simplificar los materiales."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Proporciona 1-2 tareas de extensión que profundicen la comprensión conceptual. Incluye desafíos específicos (p. ej., 'Ajusta el espaciado para mostrar...') o preguntas de orden superior (p. ej., '¿Cómo modelarías... con precisión?'). Deben alinearse con los mismos objetivos de aprendizaje."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "LanguageLearners",
                "AdditionalScaffolding",
                "GoDeeper"
              ],
              "additionalProperties": false
            },
            "AccommodationsAndModifications": {
              "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfócate en el acceso, no en reducir el rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Estrategias no específicas de estudiantes que mejoran el acceso para todos los aprendices (p. ej., recursos visuales, notas precargadas, glosario digital, instrucciones fragmentadas). Proporciona 2-4 viñetas."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumera CADA estudiante individualmente; NO agrupes a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Nombre y apellido del estudiante individual que recibe estos apoyos."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "El plan formal proporcionado para este estudiante en el indicio. Analiza el plan en una lista clara. Puedes parafrasearlo para mejorar el formato, pero NO omitas ni añadas ninguna información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Herramientas/contenedores/frases iniciales/organizadores concretos para esta tarea."
                      }
                    },
                    "required": [
                      "StudentName",
                      "PlanProvided",
                      "PlanImplementation"
                    ],
                    "additionalProperties": false
                  }
                }
              },
              "required": [
                "General",
                "IndividualSupport"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false
        },
        "ReflectionOnGroupDynamics": {
          "x-format": "### {green}({loc.ReflectionOnGroupDynamics})\n\n{value.DebriefPrompt}\n\n{value.TeacherFacilitationOptions}\n\n{value.ClosingPrompt}",
          "type": "object",
          "description": "Los estudiantes evalúan qué tan bien trabajó el grupo en conjunto. DEBE contener exactamente 3 segmentos en orden: una consigna de reflexión, opciones de facilitación y una consigna de cierre que vincule con las normas.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Una breve consigna de reflexión para los estudiantes después de colaborar.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "El texto exacto que dice el docente, por ejemplo, 'Di: \"Tómense dos minutos para reflexionar: ¿Qué hizo bien hoy nuestro grupo?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Respuestas esperadas de los estudiantes (2-3 ejemplos)."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "TeacherFacilitationOptions": {
              "x-format": "**2.** {loc.TeacherFacilitationOptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Exactamente 3 opciones de movimientos de facilitación docente para elegir (por ejemplo, salida con escritura rápida, valoración de 1 a 5 de la colaboración del grupo, intercambio de 2 minutos en grupo completo). Solo las opciones, sin respuestas esperadas."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "Una consigna final del docente que vincule las reflexiones de vuelta a las pautas de colaboración. por ejemplo, 'Di: \"¿Qué norma les ayudó más hoy?\"'"
            }
          },
          "required": [
            "DebriefPrompt",
            "TeacherFacilitationOptions",
            "ClosingPrompt"
          ],
          "additionalProperties": false
        },
        "ReviewAndSpacedRetrieval": {
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
          "type": "object",
          "description": "Sección completa de 'Repaso y recuperación espaciada'.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Lista de materiales (p. ej., ['None'] o ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Breve nota que explique cómo la práctica de recuperación favorece la retención."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Pedir a los estudiantes que recuerden el APRENDIZAJE NUEVO de la lección de HOY.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "La indicación del docente."
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "CorrectCommonMisconceptions": {
                  "x-format": "⚠️ {loc.CorrectCommonMisconceptions}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "1-2 conceptos erróneos y cómo corregirlos."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false
            },
            "EssentialQuestionConnection": {
              "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Indicación del docente vinculada a la pregunta de la unidad.",
              "properties": {
                "Say": {
                  "type": "string"
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
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "TranscendentThinking": {
              "x-format": "🌍 **{loc.TranscendentThinking}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Indicación de aplicación al mundo real.",
              "properties": {
                "Say": {
                  "type": "string"
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
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "SpacedRetrieval": {
              "x-format": "⏳ **{loc.SpacedRetrieval} ({value.DrawsFrom})**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Recordatorio de una lección/unidad anterior específica.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "La lección anterior a la que se hace referencia, por ejemplo, 'Draws from Unit 2, Lesson 3'"
                },
                "Say": {
                  "type": "string"
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
                "DrawsFrom",
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
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
          "additionalProperties": false
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Exactamente 4 indicaciones de Evaluación Formativa, una para cada nivel DOK.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "p. ej., 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "El texto exacto de la pregunta, p. ej., 'Why do planets stay in orbit instead of flying off into space?'"
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
          "description": "Práctica de tarea/fuera del aula.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Breve explicación de los objetivos de la práctica, por ejemplo, 'These tasks reinforce today's learning about [topic] by asking students to observe real-world patterns and explain them using the concepts introduced in class...'"
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
                    "description": "p. ej., '(DOK 2) Tonight, go outside and write 3-4 sentences...'"
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
                  "description": "p. ej., 'Reflection: Write 2-3 sentences responding to one prompt:'"
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
        "LessonTitle",
        "EssentialQuestions",
        "KeyVocabulary",
        "StudentLearningObjectives",
        "StandardsAligned",
        "AssessPriorKnowledge",
        "Instruction",
        "GroupStructureAndRoles",
        "CollaborationGuidelines",
        "CollaborativeActivities",
        "ReflectionOnGroupDynamics",
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
      "LessonDescription.CollaborativeActivities.AccommodationsAndModifications"
    ]
  }
},
};
