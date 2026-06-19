window.prompts_lecture_es = {
  STEP0_PROMPT_TEMPLATE: `Crea el esquema de la unidad y la estructura de las lecciones usando la información de abajo. NO escribas planes de lección completos.
                    
Basándote en el tema de la unidad, los estándares educativos, la descripción/instrucción de la unidad, el nivel de grado, la duración del periodo de clase (minutos) y el número solicitado de lecciones, genera una respuesta en JSON que incluya una UnitDescription cohesiva y una lista no superpuesta de "contenedores" de lecciones.

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
	
Estándares a los que se debe alinear:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/medios a utilizar:
{{$MediaContext}}
	
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos de las Preguntas Esenciales:
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta, que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales ni definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Las preguntas DEBEN poder transferirse entre disciplinas y ser aplicables más allá de esta unidad.
- Las preguntas DEBEN reutilizarse textualmente en cada lección dentro de la unidad.

Qué generar:
- La salida DEBE ser JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa totalmente todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el enfoque central de la unidad y su recorrido narrativo.
  - "StudentLearningObjectives": Enumera de 3 a 5 objetivos de aprendizaje clave y medibles para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordarán a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales siguiendo las reglas anteriores.
- GENERA la lista "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice basado en 1), "lessonName" y "lessonDescription" (2–4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuencia lógica desde ideas fundamentales hasta modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente exacto y apropiado para la edad.

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco extra).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Crea UN plan de lección de UNA CLASE MAGISTRAL (NO un plan de unidad, NO múltiples lecciones) usando la información de abajo.
DEBES devolver JSON válido que coincida exactamente con el esquema JSON proporcionado. No incluyas claves अतिरिक्त. Usa formato JSON compacto (sin líneas en blanco extra).
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
Recursos/medios para usar: 
{{$MediaContext}}
Contenido de la unidad: 
{{$ParentUnitData}}
Estándares a los que alinearse:
{{$Standards}}
Contenido adjunto de la lección: 
{{$AttachedLesson}}

Preguntas esenciales de la unidad (USA ESTAS TAL CUAL):
{{$UnitEssentialQuestions}}

Si las Preguntas esenciales de la unidad anteriores están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".

- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales ni definitorias.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como cambio, evidencia, patrones, relaciones, sistemas o razonamiento), no en contenido específico de una materia.
- Las preguntas DEBEN ser transferibles entre disciplinas y aplicables más allá de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBE usarse SOLO dentro de ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS IMPORTANTES DE CONTENIDO:
- Mantén la lección alineada con el enfoque de la unidad: desarrollar y usar modelos para describir la composición atómica de moléculas simples y/o estructuras extendidas.
- Incluye breves conexiones de alto nivel con otros DCI relevantes cuando sea apropiado, pero mantén la lección centrada en el modelado y el razonamiento estructura–propiedad (sin matemáticas avanzadas, sin balancear ecuaciones a menos que los estándares lo requieran explícitamente).
- Asegúrate de que todas las partes de la lección reflejen el Alcance/Límites de la lección proporcionados en el contexto de la unidad; evita introducir nuevos conceptos importantes que pertenezcan a otras lecciones.
- EssentialQuestions: DEBE ser exactamente igual a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: SOLO si LessonNumber == 1, completa el objeto como se define en el esquema. Para TODAS LAS DEMÁS LECCIONES, DEBES devolver un objeto vacío {} sin claves dentro. NO uses marcadores como "N/A", "none" ni matrices vacías.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications debe incluir apoyos generales seguidos del apoyo individual para cada estudiante proporcionado en {{$LearningPlans}}.
- Cuando sugieras "marcos de oraciones" o "iniciadores de oraciones" en cualquier parte del plan de la lección (especialmente en Individualized Supports), DEBES proporcionar las frases iniciales específicas y reales adaptadas al contenido de la lección para que el docente pueda usarlas directamente.
- StudentPractice DEBE incluir un párrafo de TeacherNotes que comience con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, e intercalado si la asignatura es matemáticas.

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
          "description": "Descripción de la unidad como un único párrafo de texto continuo y coherente (4–5 oraciones completas) escrito con una voz natural de docente que puedas decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional pero seguir esta estructura (sin encabezados): (1) oración gancho que despierte curiosidad o marque un contraste sorprendente, (2) oración de “En esta unidad, vas a…” sobre los resultados de dominio, (3) oración de “Fortalecerás tus habilidades en…” sobre capacidades de pensamiento/análisis, (4) oración de “Esto se conecta con…” sobre relevancia en el mundo real, (5) oración de “Entender esto importa porque…” sobre significado más amplio o impacto a largo plazo."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Crea preguntas esenciales que se enfoquen solo en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. No menciones términos, procesos, vocabulario ni ejemplos específicos del tema. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Enfócate solo en las ideas principales, no en el contenido temático.",
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
          "description": "Enumera todos los estándares educativos únicos usados en cualquier parte de esta unidad y sus lecciones. No agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, por ejemplo, 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'",
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
  "title": "LectureUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Pega todas las preguntas esenciales que se generaron a nivel de unidad en el mismo orden.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Lista de términos de vocabulario con definiciones. (p. ej. 'Sistema solar – El Sol y todo...'). SOLO incluye términos que se usan activamente en esta lección específica.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Sección completa de 'Objetivos de Aprendizaje del Estudiante' como texto plano. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis.",
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
      "description": "Sección completa de 'Alineados con los Estándares' como texto plano para esta lección. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos usados en la Unidad. p. ej. 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**{loc.Say}:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**{loc.Say}:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**{loc.Say}:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Sección completa de 'Evaluación de Conocimientos Previos'. CRÍTICO: Observa el 'lessonNumber' en el Contenido de la Lección Adjunta. SI esta es la Lección 1, completa este objeto por completo. SI esta es la Lección 2, 3 o cualquier otra lección, DEBES DEVOLVER UN OBJETO VACÍO {} sin propiedades. No completes esto para ninguna lección que no sea la Lección 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "Lo que dice el docente para introducir la actividad."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Lista de afirmaciones para proyectar o leer, que contengan tanto ideas correctas como conceptos erróneos comunes."
        },
        "SayInstructions": {
          "type": "string",
          "description": "Lo que dice el docente para indicar a los estudiantes qué hacer con las afirmaciones."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Respuestas/marcaciones esperadas de los estudiantes para cada afirmación."
        },
        "SayConclusion": {
          "type": "string",
          "description": "Lo que dice el docente para cerrar."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Acción del docente para concluir (p. ej., dibujar un diagrama)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Lista de opciones alternativas para la actividad."
        }
      },
      "required": [
        "SayIntroduction",
        "StatementsToProject",
        "SayInstructions",
        "ExpectedStudentResponses",
        "SayConclusion",
        "ActionConclusion",
        "AlternateOptions"
      ],
      "additionalProperties": false
    },
    "Objective": {
      "x-format": "### {green}({loc.Objective} {value.Duration})\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Crea una sección de Objetivo que establezca claramente las metas de aprendizaje del estudiante para la lección.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Estimación de tiempo (p. ej., '(2-3 min)')"
        },
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "type": "object",
            "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
            "properties": {
              "Step": {
                "type": "string",
                "description": "Paso o guion del docente."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Lista opcional de viñetas para este paso. Para el primer paso, incluye aquí los objetivos de aprendizaje reales."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Debe incluir: 1) Explica las metas de aprendizaje usando un guion directo para el docente (p. ej., Di: '...') y coloca los objetivos reales en el arreglo de Viñetas. 2) Pide a los estudiantes que registren los objetivos en sus cuadernos. 3) Explica brevemente al docente cómo conectar los objetivos con las experiencias de vida real de los estudiantes."
        }
      },
      "required": [
        "Duration",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ContentDeliveryAndInteractiveActivities": {
      "x-format": "### {green}({loc.ContentDeliveryAndInteractiveActivities} {value.Duration})\n\n**1. {loc.Hook}** {value.Hook}\n\n**2. {loc.Vocabulary}**\n\n{value.Vocabulary.Bullets}\n\n{value.Vocabulary.ConclusionSay}\n\n**3. {loc.NewConceptsAndKnowledge}**\n\n{value.NewConceptsAndKnowledge}\n\n### ⚡ {loc.AttentionReset}\n\n**{loc.Purpose}:** {value.AttentionReset.StandardParagraph}\n\n{value.AttentionReset.Directions}\n\n{loc.WhyThisWorks}:\n\n{value.AttentionReset.WhyThisWorks}\n\n### {loc.ContinueInstructionAfterActivity}\n\n{value.ContinueInstruction}\n\n### ⚠️ {loc.AnticipatedMisconceptions}\n\n{value.AnticipatedMisconceptions}\n\n{value.Connect}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
      "type": "object",
      "description": "Bloque para la presentación del contenido.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Estimación de tiempo (p. ej., '(30 min)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Escribe un gancho dramático y de alto impacto, entregado mediante el guion del docente. Debe ser sorprendente, generar curiosidad y estar vinculado con el concepto principal."
        },
        "Vocabulary": {
          "type": "object",
          "properties": {
            "Bullets": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Enumera los términos esenciales de vocabulario. Proporciona un guion del docente para definir cada término, formateado estrictamente como: '[Término] - Di: \"[Definición/Guion]\"'. Ejemplo: 'Palanca - Di: \"Una palanca es una máquina simple...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "Una declaración final de 'Di: ' para hacer la transición."
            }
          },
          "required": [
            "Bullets",
            "ConclusionSay"
          ],
          "additionalProperties": false
        },
        "NewConceptsAndKnowledge": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Escribe una lección detallada del docente con guiones (Di: “…”). Incluye paso a paso lo que el docente dice, hace y puede demostrar. Desglosa ideas complejas, proporciona ejemplos/analogías y haz conexiones explícitas con conocimientos previos."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Inserta el párrafo estándar de reinicio de atención exactamente como está escrito: 'Esta actividad vuelve a captar la atención, reinicia el enfoque cognitivo y refuerza el concepto con movimiento + novedad, al tiempo que proporciona una vista previa con propósito.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Debe ser exactamente: 'Esta actividad vuelve a captar la atención, reinicia el enfoque cognitivo y refuerza el concepto con movimiento + novedad, al tiempo que proporciona una vista previa con propósito. (palabra por palabra)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Proporciona instrucciones para la actividad, incluyendo el guion del docente y lo que los estudiantes y el docente necesitan hacer."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Explica en viñetas por qué la actividad funciona para volver a captar la atención, reiniciar el enfoque cognitivo, reforzar los conceptos y proporcionar una vista previa con propósito. Por ejemplo: 'Ponerse de pie + movimiento reinicia la atención.'"
            }
          },
          "required": [
            "StandardParagraph",
            "Directions",
            "WhyThisWorks"
          ],
          "additionalProperties": false
        },
        "ContinueInstruction": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{index}. {value}\n\n",
            "type": "string"
          },
          "description": "Pasos numerados para continuar la instrucción con guiones del docente (Di: “…”). Desglosa ideas complejas, proporciona ejemplos/analogías, para intrigar, anticipar el aprendizaje futuro, ampliar ideas clave."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "Enumera las ideas erróneas comunes anticipadas de los estudiantes para asegurar que el docente esté preparado.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponseLabel}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "p. ej., 'Los estudiantes pueden pensar que una palanca más grande siempre funciona mejor.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Cómo responder de manera efectiva a posibles malentendidos de los estudiantes y guiarlos hacia una comprensión precisa."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Connect": {
          "x-format": "### {green}({loc.Connect} {value.Duration})\n\n1. {loc.Say}: \"{value.Step1Say}\"\n\n2. {loc.Say}: \"{value.Step2Say}\"\n\n3. {loc.Prompt}:\n\n{value.Step3Prompts}\n\n4. Whole-group share: {loc.Say}: \"{value.Step4Say}\"\n\n✅ **{loc.ExpectedStudentResponses}**\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Vincúlalo con un propósito. Conéctalo con una de las preguntas esenciales.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "p. ej., '(3 min)'"
            },
            "Step1Say": {
              "type": "string",
              "description": "Guion del docente que conecta la actividad anterior con una idea más amplia."
            },
            "Step2Say": {
              "type": "string",
              "description": "Guion del docente para pedir a los estudiantes que se giren y hablen con un compañero."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Preguntas específicas para la consigna (p. ej., '¿Por qué era importante el shaduf...', '¿Qué evidencia muestra...')."
            },
            "Step4Say": {
              "type": "string",
              "description": "Guion del docente para compartir con todo el grupo (p. ej., 'Escuchemos algunas ideas...')."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Respuestas estudiantiles esperadas y profundas que usan razonamiento o evidencia."
            }
          },
          "required": [
            "Duration",
            "Step1Say",
            "Step2Say",
            "Step3Prompts",
            "Step4Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        },
        "Differentiation": {
          "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "type": "object",
          "description": "Diferenciar la instrucción (cómo enseñar, no simplificar los materiales). Varíe la complejidad y la profundidad, promueva la participación activa y el lenguaje. Realista para el aula.",
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
                  "description": "Para las respuestas de Go Deeper."
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
          "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfoque en el acceso, no en reducir el rigor.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Estrategias no específicas para estudiantes que mejoran el acceso para todos los aprendices (p. ej., apoyos visuales, notas prellenadas, glosario digital, instrucciones fragmentadas). Proporcione 2-4 viñetas."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumere CADA estudiante individualmente; NO agrupe a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar.",
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
                    "description": "El plan formal proporcionado para este estudiante en la consigna. Analice el plan en una lista clara. Puede parafrasearlo para mejorar el formato, pero NO omita ni añada ninguna información."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Herramientas concretas/oraciones guía/apoyos visuales/organizadores para esta tarea."
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
        "Duration",
        "Hook",
        "Vocabulary",
        "NewConceptsAndKnowledge",
        "AttentionReset",
        "ContinueInstruction",
        "AnticipatedMisconceptions",
        "Connect",
        "Differentiation",
        "AccommodationsAndModifications"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Sección completa de 'Repaso y Recuperación Espaciada'.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Pedir a los estudiantes que recuerden NUEVO aprendizaje de la lección de HOY.",
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
          "description": "Indicación del docente que vincula con la pregunta de la unidad.",
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
        "SpacedRetrieval": {
          "x-format": "⏳ **{loc.SpacedRetrieval}**\n\n{value.PriorLearningContext} {value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Recordatorio de una lección/unidad anterior específica.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Frase de contexto como 'Antes en esta lección, los estudiantes aprendieron...'"
            },
            "Say": {
              "type": "string",
              "description": "La indicación del docente que comienza con 'Di: '."
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
        "SpacedRetrieval"
      ],
      "additionalProperties": false
    },
    "QAndAAndDiscussion": {
      "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. {loc.Say}: \"{value.InstructionsForTeachers.Step1_InviteSay}\"\n2. {loc.AskLabel}:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n3. {loc.Say}: \"{value.InstructionsForTeachers.Step3_CaptureSay1}\" {loc.RecordLabel}: {value.InstructionsForTeachers.Step3_CaptureRecord} {loc.Say}:\n   \"{value.InstructionsForTeachers.Step3_CaptureSay2}\"\n4. {loc.Say}: \"{value.InstructionsForTeachers.Step4_AnswerSay1}\" {value.InstructionsForTeachers.Step4_AnswerAddress} {loc.Say}: \"{value.InstructionsForTeachers.Step4_AnswerSay2}\"\n\n{loc.NoteForTeacherQA}",
      "type": "object",
      "description": "Bloque para Preguntas y Respuestas y Discusión.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Estimación de tiempo (p. ej., '(5 min)')"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Orientación para el docente para la sesión de Preguntas y Respuestas y Discusión.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "p. ej., 'Ahora es tu oportunidad de pensar en lo que hemos aprendido...'"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3-4 preguntas para hacer a los estudiantes."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "p. ej., 'Si tienes una pregunta, eso significa que estás pensando profundamente...'"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "p. ej., 'Escribe las preguntas de los estudiantes en una tabla titulada Preguntas que aún tenemos.'"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "p. ej., 'Seguiremos añadiendo a esta tabla a lo largo de la unidad...'"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "p. ej., 'Veamos nuestras preguntas. ¿Cuáles podemos responder usando lo que aprendimos hoy?'"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "p. ej., 'Aborda algunas preguntas usando las respuestas de los estudiantes y la evidencia.'"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "p. ej., 'Algunas de estas preguntas ayudarán a guiar lo que aprendamos a continuación...'"
            }
          },
          "required": [
            "Step1_InviteSay",
            "Step2_AskQuestions",
            "Step3_CaptureSay1",
            "Step3_CaptureRecord",
            "Step3_CaptureSay2",
            "Step4_AnswerSay1",
            "Step4_AnswerAddress",
            "Step4_AnswerSay2"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Duration",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Conclusion": {
      "x-format": "### {green}({loc.Conclusion} {value.Duration})\n\n{value.BuildCuriosity}",
      "type": "object",
      "description": "Bloque para la Conclusión.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Estimación de tiempo (p. ej., '(1 min)')"
        },
        "BuildCuriosity": {
          "type": "string"
        }
      },
      "required": [
        "Duration",
        "BuildCuriosity"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
      "type": "array",
      "description": "Extrae y genera EXACTAMENTE 4 indicaciones de Evaluación Formativa que cubran DOK 1-4. Para cada indicación, incluye PromptLabel, Question y ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "p. ej., 'Indicación 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "El texto exacto de la pregunta."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 respuestas de ejemplo que demuestren dominio."
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
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**Teacher Notes:** {value.TeacherNotes}\n\n{value.Tasks}\n\n🔎 **{loc.Reflection}:** {value.Reflection.Prompt}\n\n{value.Reflection.ReflectionOptions}",
      "type": "object",
      "description": "Sección completa de 'Práctica del estudiante' para la tarea / práctica fuera de clase.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Notas que explican cómo las tareas refuerzan el aprendizaje de hoy y fortalecen la retención a largo plazo."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Genera 4 tareas de práctica que cubran los niveles DOK 2, 3 y 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "p. ej., '(DOK 2) Dibuja un shaduf y etiqueta...'"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 viñetas de criterios de éxito."
              }
            },
            "required": [
              "TaskDescription",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          },
          "minItems": 4,
          "maxItems": 4
        },
        "Reflection": {
          "type": "object",
          "description": "Una tarea de reflexión para los estudiantes.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "p. ej., 'Escribe 2-3 oraciones respondiendo a un estímulo:'"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 opciones de preguntas de reflexión."
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
        "Tasks",
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
    "Objective",
    "ContentDeliveryAndInteractiveActivities",
    "ReviewAndSpacedRetrieval",
    "QAndAAndDiscussion",
    "Conclusion",
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
