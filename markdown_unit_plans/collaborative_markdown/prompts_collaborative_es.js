window.promptses = {
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

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco adicionales).`,
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
- Sin HTML. Sin emojis. Sin markdown. Texto plano dentro de los campos de cadena.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Unit description as one cohesive plain-text paragraph (4–5 complete sentences) written in natural teacher voice that you could say directly to students. No HTML, no emojis, no bullet points. Must flow conversationally but follow this structure (without headlines): (1) hook sentence that sparks curiosity or makes a surprising contrast, (2) 'In this unit, you will...' sentence about mastery outcomes, (3) 'You'll strengthen your skills in...' sentence about thinking/analysis abilities, (4) 'This connects to...' sentence about real-world relevance, (5) 'Understanding this matters because...' sentence about broader significance or long-term impact."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
      "description": "List of lesson containers for this unit (outline only). Each item must be non-overlapping and scoped clearly so lesson content does not repeat across lessons.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Ordering number of a lesson. 1 Based."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Short lesson title as plain text."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 sentences describing the lesson scope, focus, and boundaries to prevent overlap with other lessons."
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
          "description": "Short descriptive title for the lesson. Do NOT include emojis here."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Just paste all the unit-level essential questions in the same order if provided. If not provided, generate exactly 3 conceptual questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "List of 'Term - Definition' strings. Definitions must be short, age-appropriate, and tied to this lesson.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 measurable objectives, each ending with a DOK label in parentheses.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Aligned educational standards for this lesson. Must match unit standards exactly in code + description.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Assess Prior Knowledge section. ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN NULL or OMIT this field. For Lesson 1, structure must include ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt, and AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Clear instructions and template/structure for the chosen modality. E.g. 'Say: \"Before we build...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Anticipated answers or common misconceptions for the chosen modality.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 brief alternate options a teacher could choose.",
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
          "description": "Collaborative lesson's 'Instruction' section (equivalent to Direct Presentation).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Materials list.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Teacher script organized into sequential steps. These steps must collectively act as a thorough guide to help the teacher deliver new content. It must include how to introduce the new subject content (hooks, guiding questions, transitions), and content/script for the teacher to teach directly (definitions, examples, key points, explanations). Instructions should be thorough and include all new learning for the lesson with explanations for how to teach it. Be precise. Do NOT use all-caps headers for sections and do NOT include time markers.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "The teacher action, e.g. Say: '...', Do: '...', Ask: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Anticipated answers if the instruction was a question. Return an empty array if not applicable.",
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
              "description": "List of common misconceptions and exact correction language for addressing each one.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "The misconception description."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "The correction language starting with 'Say: '."
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
              "description": "Real-world application question connecting learning to purpose/meaning.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 expected student responses showing deeper understanding.",
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
              "description": "Final comprehension check question.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 expected student responses.",
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
          "description": "Group size, teacher script, defined roles, and rotation.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "e.g. 'pairs', 'triads', or '4-5 students'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Teacher script explaining roles."
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
              "description": "Sentence specifying when roles rotate."
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
          "description": "Prompts to help groups create their own collaboration norms.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Interdependent group work (collaborative replacement for Guided Practice). Teacher-facing, highly structured, and designed so students cannot complete the task alone. Must include: (a) clear interdependence (jigsaw, consensus-building, gallery walk, structured problem-solving challenge, or similar), (b) explicit timing for each phase (e.g., '8 minutes discussion, 2 minutes prepare response'), (c) scripted teacher facilitation using 'Say:' statements throughout, (d) a shared group product (claim, model, chart, solution set, gallery artifact, etc.), (e) circulation prompts with expected student responses, (f) at least one ALL-student response check (whiteboards, quick write, polling, thumbs, etc.) with expected responses, (g) quick check question + expected responses, (h) Differentiation in three tiers focused on instruction (not accommodations), and (i) AccommodationsAndModifications separated into General supports and IndividualSupport exactly matching the provided students/plans. Ensure cultural relevance and inclusion by inviting multiple perspectives and ensuring equitable participation.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Complete list of teacher + student materials used in this collaborative activity. Include any prepared items (prompt cards, sentence frames, role cards, checklists, rubrics, gallery walk sheets, whiteboards, timers, visuals, word banks, etc.). One item per array element; no placeholders.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Teacher script for the collaborative activity (aim for 6-8 numbered steps). Ensure one step is explicitly 'Circulation Prompts:' which includes specific questions to ask groups as they work.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "The specific teacher action, starting with 'Say: ', 'Do: ', or exactly 'Circulation Prompts:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "ONLY populate this if the Instruction is 'Circulation Prompts:'. List specific questions to ask groups while circulating. OMIT this property if not applicable.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "The question to ask the group."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Expected answers to this specific circulation prompt. OMIT this property if none.",
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
                    "description": "Anticipated answers if the Instruction was a direct question to the class. OMIT this property if not applicable.",
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
              "description": "Labeled with three clearly labeled tiers: Language Learners, Students in Need of Additional Scaffolding, Go Deeper. Requirements: The content must differentiate instruction, not provide accommodations or modifications (those are addressed elsewhere). Strategies should focus on how to teach, not how to simplify materials. Activities should vary in complexity and depth, aligned to the same learning objectives. Each tier must promote active engagement, language development, and conceptual understanding. Use clear, teacher-facing language and make supports realistic for classroom use.",
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
                      "description": "Provide 2-3 concrete teaching strategies for language learners. Examples: providing specific visuals (e.g., 'Planet Fact Sheet'), using sentence frames (e.g., 'This is placed here because...'), or asking students to gesture/point before explaining verbally. Focus on active engagement and language development."
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
                      "description": "Provide 2-3 concrete teaching strategies for scaffolding. Examples: providing pre-drawn organizers/templates, using a simplified checklist with specific guiding questions, or modeling a think-aloud process (e.g., 'Watch how I match...'). Focus on how to teach and vary complexity without simplifying materials."
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
                      "description": "Provide 1-2 extension tasks that deepen conceptual understanding. Include specific challenges (e.g., 'Adjust spacing to show...') or higher-order questions (e.g., 'How would you model... accurately?'). Must align to the same learning objectives."
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
              "description": "This section must include two types of supports: General Supports and Individualized Supports. Focus on access, not lowering rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions). Provide 2-4 bullet points."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specific accommodations and modifications for named students with formal plans. List EACH student individually; do NOT group students together. The supports for each student should be an easy-to-scan list.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "First and last name of the individual student receiving these supports."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "The formal plan provided for this student in the prompt. Parse the plan into a clear list. You may paraphrase it to improve formatting, but do NOT omit or add any information."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Concrete tools/stems/visuals/organizers for this task."
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
          "description": "Students evaluate how well the group worked together. MUST contain exactly 3 segments in order: a debrief prompt, facilitation options, and a closing prompt linking to norms.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "A short debrief prompt for students after collaboration.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "The exact wording the teacher says, e.g., 'Say: \"Take two minutes to reflect: What did our group do well today?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Expected student answers (2-3 examples)."
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
              "description": "Exactly 3 teacher facilitation moves to choose from (e.g., Quick-write exit slip, 1-5 group collaboration rating, 2-minute whole-group share). Just the options, no expected responses."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "A final teacher prompt linking reflections back to the collaboration guidelines. e.g., 'Say: \"Which of your norms helped the most today?\"'"
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
          "description": "Full 'Review & Spaced Retrieval' section.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Materials list (e.g. ['None'] or ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Short note explaining how the retrieval practice supports retention."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Asking students to recall NEW learning from TODAY'S lesson.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "The teacher prompt."
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
                  "description": "1-2 misconceptions and how to correct them."
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
              "description": "Teacher prompt linking to unit question.",
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
              "description": "Real-world application prompt.",
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
              "description": "Recall from a specific prior lesson/unit.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "The prior lesson referenced, e.g. 'Draws from Unit 2, Lesson 3'"
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
          "description": "Exactly 4 Formative Assessment prompts, one for each DOK level.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "e.g., 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "The exact question text, e.g., 'Why do planets stay in orbit instead of flying off into space?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 sample responses showing mastery (wrapped in quotes)."
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
          "description": "Homework/out-of-class practice.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Short explanation of the practice goals, e.g., 'These tasks reinforce today's learning about [topic] by asking students to observe real-world patterns and explain them using the concepts introduced in class...'"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Exactly 3 practice tasks (DOK 2 or DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "e.g., '(DOK 2) Tonight, go outside and write 3-4 sentences...'"
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
              "description": "A reflection task for the students.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "e.g., 'Reflection: Write 2-3 sentences responding to one prompt:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Exactly 4 reflection question options in quotes."
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
