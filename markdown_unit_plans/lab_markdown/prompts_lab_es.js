window.prompts_lab_es = {
  STEP0_PROMPT_TEMPLATE: `Crea el esquema de la unidad y la estructura de las lecciones usando la información de abajo. NO escribas planes de lecciones completos.
                    
Basándote en la materia de la unidad, los estándares educativos, la descripción/instrucción de la unidad, el nivel de grado, la duración del período de clase (minutos) y el número solicitado de lecciones, genera una respuesta JSON que incluya una UnitDescription cohesionada y una lista no superpuesta de "contenedores" de lecciones.

Materia de la unidad:
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

Recursos/Medios para usar:
{{$MediaContext}}
	
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos de las preguntas esenciales:
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta, que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales ni definitorias.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Las preguntas DEBEN poder transferirse entre disciplinas y ser aplicables más allá de esta unidad.
- Las preguntas DEBEN reutilizarse textualmente en cada lección dentro de la unidad.

Qué generar:
- La salida DEBE ser JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa totalmente todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el enfoque central de la unidad y su recorrido narrativo.
  - "StudentLearningObjectives": Enumera de 3 a 5 objetivos de aprendizaje clave y medibles para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordan a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales que sigan las reglas anteriores.
- GENERA la lista "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice basado en 1), "lessonName" y "lessonDescription" (2–4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuencia lógica desde ideas fundamentales hasta modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente exacto y apropiado para la edad.

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco adicionales).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Crea UN plan de lección de LABORATORIO (NO un plan de unidad, NO múltiples lecciones) usando la información de abajo.
DEBES generar JSON válido que coincida exactamente con el esquema JSON proporcionado. No incluyas claves adicionales. Usa un formato JSON compacto (sin líneas en blanco extra).
Asignatura de la unidad:
{{$Subject}}
Nombre de la unidad:
{{$Name}}
Descripción/Instrucción de la unidad:
{{$UserPrompt}}
Nivel de grado:
{{$GradeLevel}}
Duración del período de clase en minutos
{{$ClassDuration}}
Recursos/Medios a usar:
{{$MediaContext}}
Contenido de la unidad:
{{$ParentUnitData}}
Estándares a los que alinearse:
{{$Standards}}
Contenido adjunto de la lección:
{{$AttachedLesson}}

Preguntas esenciales de la unidad (USA ESTAS VERBATIM):
{{$UnitEssentialQuestions}}

Si las Preguntas esenciales de la unidad arriba están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta, que termine con signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una asignatura.
- Las preguntas DEBEN poder transferirse entre disciplinas y aplicarse más allá de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBE usarse SOLO dentro de Experiment.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS IMPORTANTES DE CONTENIDO:
- Mantén la lección alineada con el enfoque de la unidad: desarrollar y usar modelos para describir la composición atómica de moléculas simples y/o estructuras extendidas.
- Incluye conexiones breves y de alto nivel con otros DCI relevantes cuando sea apropiado, pero mantén la lección centrada en el modelado y el razonamiento estructura-propiedad (sin matemáticas profundas, sin balancear ecuaciones a menos que los estándares lo requieran explícitamente).
- Asegúrate de que todas las partes de la lección reflejen el Alcance/Límites de la lección proporcionados en el contexto de la unidad; evita introducir nuevos conceptos principales que pertenezcan a otras lecciones.
- EssentialQuestions: DEBE ser exactamente igual a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: SOLO si LessonNumber == 1, escribe 150–250 palabras y sigue la estructura requerida en la descripción del esquema. Si LessonNumber != 1, devuelve "" (cadena vacía).
- Fases del laboratorio (Question, Research, Hypothesize, Experiment, Analyze, Share): Sigue los requisitos instruccionales específicos y las cadenas de "Purpose:" de cada fase tal como se definen en el esquema JSON.
- Experiment.AccommodationsAndModifications debe incluir apoyos generales seguidos del apoyo individual para cada estudiante proporcionado en {{$LearningPlans}}.
- StudentPractice DEBE incluir un párrafo TeacherNotes que comience con 'These tasks reinforce today's learning about ____ by ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, y el entrelazado si la asignatura es matemáticas.

REQUISITOS DE SALIDA:
- La salida DEBE ser JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser un SOLO plan de lección.
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
          "x-format": false,
          "type": "string",
          "description": "Descripción de la unidad como un solo párrafo de texto plano coherente (4–5 oraciones completas) escrita con una voz natural de docente que podrías decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional, pero seguir esta estructura (sin encabezados): (1) oración gancho que despierte curiosidad o haga un contraste sorprendente, (2) oración de 'En esta unidad, aprenderás...' sobre resultados de dominio, (3) oración de 'Fortalecerás tus habilidades en...' sobre capacidades de pensamiento/análisis, (4) oración de 'Esto se conecta con...' sobre relevancia en el mundo real, (5) oración de 'Entender esto importa porque...' sobre importancia más amplia o impacto a largo plazo."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Crea preguntas esenciales que se centren solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. No menciones términos, procesos, vocabulario o ejemplos específicos de ninguna materia. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las ideas grandes, no en el contenido de la materia.",
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
          "description": "Enumera todos los estándares educativos únicos usados en cualquier parte de esta unidad y sus lecciones. No agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, por ejemplo, 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Sección completa de 'Vocabulario Clave' como una lista de cadenas. Cada cadena debe ser un solo término con la definición separada por un guion/guion medio. Ejemplo: 'Gravedad - La fuerza que atrae a los objetos entre sí'. Todas las definiciones deben ser breves, apropiadas para la edad y directamente relacionadas con el contenido de la lección.",
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
        "StandardsAligned",
        "KeyVocabulary"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "x-format": false,
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
            "description": "Título breve de la lección como texto plano."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 oraciones que describan el alcance, el enfoque y los límites de la lección para evitar solapamientos con otras lecciones."
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
  "title": "LabUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Pega solo todas las preguntas esenciales que se generan a nivel de unidad en el mismo orden.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Sección completa de 'Objetivos de Aprendizaje del Estudiante' como texto plano. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis, por ejemplo, 'Modelar cómo la rotación de la Tierra sobre su eje causa el día y la noche (DOK 2).'",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "x-format": "- {value}\n",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Sección completa de 'Estándares Alineados' como texto plano para esta lección. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos usados en la Unidad. Por ejemplo, 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Selecciona textualmente el vocabulario clave para esta lección del vocabulario a nivel de unidad proporcionado en el prompt. No inventes nuevas palabras. Debes reutilizar la redacción exacta de Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Sección de Evaluación de Conocimientos Previos. SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER NULL u OMITIR este campo. Para la Lección 1, la estructura debe incluir: 1. Incluye esta sección solo en la primera lección de la unidad. 2. Asegúrate de usar preguntas DOK 1-3. 3. Incluye habilidades prerrequisito necesarias para los objetivos de aprendizaje del estudiante. 4. Elige una modalidad de esta lista y desarróllala por completo: cuestionamiento, K-W-L, visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, valoraciones de vocabulario. 5. Indicación inicial del docente con 'Di:'. 6. Instrucciones claras y plantilla/estructura para la modalidad elegida. 7. Sección de 'Respuestas Esperadas de los Estudiantes'. 8. Cierre del docente con indicación 'Di:'. 9. Después de desarrollar por completo una modalidad, proporciona 2 opciones breves alternativas.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Instrucciones claras y plantilla/estructura para la modalidad elegida. Ej.: 'Di: \"Antes de comenzar...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Respuestas anticipadas o conceptos erróneos comunes para la modalidad elegida.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Cierre del docente con indicación 'Di:' que valide el pensamiento de los estudiantes y anticipe la investigación de la unidad."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 opciones breves alternativas que un docente podría elegir.",
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
    "Question": {
      "x-format": "### {green}({loc.LabQuestionTitle})\n\n**{loc.Purpose}:** {loc.LabQuestionPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guía al docente para que los estudiantes observen un fenómeno, identifiquen algo que les resulte desconcertante y generen una pregunta significativa que guiará la investigación.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Palabra por palabra - Propósito: Observar un fenómeno, identificar algo desconcertante y generar una pregunta significativa que guiará la investigación."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista de materiales necesarios (p. ej., ayudas visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}\n\n{value.FinalInvestigationQuestion}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instrucciones paso a paso para el docente, acciones y indicaciones de 'Diga:' para presentar un fenómeno e invitar preguntas."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 preguntas o ideas esperadas de los estudiantes sobre el fenómeno."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "El paso final en las instrucciones del docente. Comience esta cadena con el siguiente número secuencial que siga a las instrucciones anteriores (p. ej., '8. Paso final: Diga: ...') y exprese la gran pregunta que se investigará hoy."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses",
            "FinalInvestigationQuestion"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Research": {
      "x-format": "### {green}({loc.LabResearchTitle})\n\n**{loc.Purpose}:** {loc.LabResearchPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guíe al docente para que los estudiantes aprendan información de fondo, vocabulario y conocimientos previos necesarios para comprender el tema.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Palabra por palabra: Propósito: Recopilar información de fondo, vocabulario y conocimientos previos necesarios para comprender el tema y prepararse para una investigación informada."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista de materiales necesarios (p. ej., ayudas visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.AnticipatedMisconceptions}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instrucciones paso a paso para el docente, acciones y indicaciones de 'Diga:' para explicar conocimientos de fondo, vocabulario y modelar el fenómeno."
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Idea errónea del estudiante"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Lo que el docente debe decir para corregirla"
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "Instructions",
            "AnticipatedMisconceptions"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Hypothesize": {
      "x-format": "### {green}({loc.LabHypothesizeTitle})\n\n**{loc.Purpose}:** {loc.LabHypothesizePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guíe al docente para que los estudiantes elaboren una predicción comprobable.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Palabra por palabra: Propósito: Elaborar una predicción o afirmación comprobable basada en su investigación y razonamiento, estableciendo una expectativa clara de lo que creen que sucederá."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instrucciones para el docente. Incluya indicaciones de 'Diga:'. Proporcione una instrucción específica como 'Escriba en la pizarra:' seguida de una lista con viñetas en formato markdown de 4-5 marcos de oraciones para la hipótesis."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 ejemplos de hipótesis esperadas."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Experiment": {
      "x-format": "### {green}({loc.LabExperimentTitle})\n\n**{loc.Purpose}:** {loc.LabExperimentPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guíe al docente para que los estudiantes realicen una investigación estructurada.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Palabra por palabra: Propósito: Llevar a cabo una investigación estructurada, práctica, simulada o analítica, para poner a prueba su hipótesis y recopilar evidencia mediante observación o medición."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Instrucciones paso a paso para el docente para organizar el experimento, dar indicaciones y circular."
            },
            "QuickCheck": {
              "x-format": "✔️**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "properties": {
                "Question": {
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
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
              "properties": {
                "LanguageLearners": {
                  "x-format": "**{loc.LanguageLearners}**\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdditionalScaffolding": {
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}**\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "GoDeeper": {
                  "x-format": "**{loc.GoDeeper}**\n\n{value.Challenges}\n\n{value.ExpectedStudentResponses}",
                  "type": "object",
                  "properties": {
                    "Challenges": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "ExpectedStudentResponses": {
                      "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Para respuestas de Go Deeper."
                    }
                  },
                  "required": [
                    "Challenges",
                    "ExpectedStudentResponses"
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
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfóquese en el acceso, no en reducir la rigurosidad.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Estrategias no específicas para estudiantes que mejoran el acceso para todos los aprendices (p. ej., apoyos visuales, notas previamente completadas, glosario digital, instrucciones fragmentadas). Proporcione 2-4 viñetas."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumere a CADA estudiante individualmente; no agrupe a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar de un vistazo.",
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
                        "description": "El plan formal proporcionado para este estudiante en el enunciado. Analice el plan en una lista clara. Puede parafrasearlo para mejorar el formato, pero no omita ni añada ninguna información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Herramientas/indicadores/recursos visuales/organizadores concretos para esta tarea."
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
            "Instructions",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Analyze": {
      "x-format": "### {green}({loc.LabAnalyzeTitle})\n\n**{loc.Purpose}:** {loc.LabAnalyzePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guíe a los docentes para que los estudiantes interpreten los datos que recopilaron.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Propósito: Interpretar los datos que recopilaron, identificar patrones, evaluar su hipótesis y construir conclusiones basadas en evidencia."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista de materiales requeridos (p. ej., apoyos visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "El texto de la instrucción del docente (p. ej., 'Proporcione iniciadores de oraciones:'). No incluya numeración; se maneja automáticamente."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Viñetas opcionales. DEBE proporcionar una lista de 4-5 iniciadores de oraciones cuando el paso lo pida. DEBE proporcionar una lista de 4-5 indicaciones de circulación cuando el paso lo pida. De lo contrario, proporcione una matriz vacía."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Instrucciones paso a paso para el docente. DEBE incluir exactamente un paso específicamente para iniciadores de oraciones y completar su matriz 'Bullets'. DEBE incluir exactamente un paso específicamente para indicaciones de circulación y completar su matriz 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Respuestas esperadas o completaciones de marcos de oraciones por parte de los estudiantes."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Share": {
      "x-format": "### {green}({loc.LabShareTitle})\n\n**{loc.Purpose}:** {loc.LabSharePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guíe a los docentes para que los estudiantes comuniquen claramente sus hallazgos.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Palabra por palabra: Propósito: Comunicar claramente sus hallazgos a otros, usando evidencia para explicar lo que descubrieron, por qué importa y cómo contribuye a una comprensión más profunda."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "El texto de la instrucción del docente (p. ej., 'Escriba en la pizarra:'). No incluya numeración; se maneja automáticamente."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Viñetas opcionales. DEBE proporcionar una lista de 4-5 puntos cuando el paso proporcione una estructura para compartir. DEBE proporcionar una lista de 4-5 preguntas de los docentes cuando el paso lo pida. De lo contrario, proporcione una matriz vacía."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Instrucciones paso a paso para el docente. DEBE incluir exactamente un paso específicamente para proporcionar una estructura para compartir y completar su matriz 'Bullets'. DEBE incluir exactamente un paso específicamente para preguntas del docente y completar su matriz 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Ideas esperadas compartidas por los estudiantes."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Purpose",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Sección completa de 'Repaso y recuperación espaciada'.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Pedir a los estudiantes que recuerden el NUEVO aprendizaje de la lección DE HOY.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "La indicación del docente que comienza con 'Diga: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
        "EssentialQuestionConnection": {
          "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Indicador del docente vinculado a la pregunta de la unidad.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "El indicador del docente que comienza con 'Diga: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
          "description": "Pedir a los estudiantes que conecten el aprendizaje con otros escenarios del mundo real.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "El indicador del docente que comienza con 'Diga: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
          "x-format": "⏳ **{loc.SpacedRetrieval}**\n\n{value.PriorLearningContext} {value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Recordar de una lección/unidad previa específica.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Frase de contexto como 'Earlier in this lesson, students learned...'"
            },
            "Say": {
              "type": "string",
              "description": "El indicador del docente que comienza con 'Diga: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}:**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "PriorLearningContext",
            "Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
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
      "description": "Exactamente 4 indicadores de Evaluación Formativa, uno para cada nivel de DOK.",
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
            "description": "El texto exacto de la pregunta."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 respuestas de muestra que demuestren dominio."
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
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
      "type": "object",
      "description": "Práctica para la tarea fuera de clase.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Notas del docente que explican cómo estas tareas de práctica refuerzan el aprendizaje de hoy y fortalecen la retención a largo plazo."
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
                "description": "p. ej., '(DOK 2) Esta noche, sal afuera y escribe 3-4 oraciones...'"
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
              "description": "p. ej., 'Reflexión: Escribe 2-3 oraciones respondiendo a una de las indicaciones:'"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Exactamente 4 opciones de preguntas de reflexión."
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
    "StudentLearningObjectives",
    "StandardsAligned",
    "KeyVocabulary",
    "AssessPriorKnowledge",
    "Question",
    "Research",
    "Hypothesize",
    "Experiment",
    "Analyze",
    "Share",
    "ReviewAndSpacedRetrieval",
    "FormativeAssessment",
    "StudentPractice"
  ],
  "additionalProperties": false,
  "x-removablePaths": {
    "EssentialQuestions": [
      "EssentialQuestions"
    ],
    "StandardsAligned": [
      "StandardsAligned"
    ],
    "AssessPriorKnowledge": [
      "AssessPriorKnowledge"
    ],
    "FormativeAssessment": [
      "FormativeAssessment"
    ]
  }
},
};
