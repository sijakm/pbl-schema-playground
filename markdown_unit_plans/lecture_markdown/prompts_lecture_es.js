window.lecturePromptses = {
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
- Cada pregunta DEBE comenzar con "How" o "Why".
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

La salida DEBE ser JSON válido que coincida con el esquema. Usa formato compacto (sin líneas en blanco extra).`,
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
- Cada pregunta DEBE comenzar con “How” o “Why”.
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
- Cuando sugieras "sentence frames" o "sentence starters" en cualquier parte del plan de la lección (especialmente en Individualized Supports), DEBES proporcionar las frases iniciales específicas y reales adaptadas al contenido de la lección para que el docente pueda usarlas directamente.
- StudentPractice DEBE incluir un párrafo de TeacherNotes que comience con 'These tasks reinforce today's learning about ____ by ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, e intercalado si la asignatura es matemáticas.

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
  "title": "LectureUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Just paste all the essential questions that are generated in unit level in same order.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "List of vocabulary terms with definitions. (e.g. 'Solar System – The Sun and all...'). ONLY include terms that are actively used in this specific lesson.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses.",
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
      "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**Say:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**Say:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**Say:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Full 'Assess Prior Knowledge' section. CRITICAL: Look at the 'lessonNumber' in the Attached Lesson Content. IF this is Lesson 1, populate this object fully. IF this is Lesson 2, 3, or any other lesson, YOU MUST RETURN AN EMPTY OBJECT {} with NO properties. Do not populate this for any lesson other than Lesson 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "What the teacher says to introduce the activity."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "List of statements to project or read, containing both accurate ideas and common misconceptions."
        },
        "SayInstructions": {
          "type": "string",
          "description": "What the teacher says to instruct students on what to do with the statements."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Expected student responses/markings for each statement."
        },
        "SayConclusion": {
          "type": "string",
          "description": "What the teacher says to wrap up."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Teacher action to conclude (e.g., drawing a diagram)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "List of alternate options for the activity."
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
      "description": "Create an Objective section that clearly states the student learning goals for the lesson.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(2-3 min)')"
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
                "description": "Teacher step or script."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Optional list of bullet points for this step. For the first step, include the actual learning objectives here."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Must include: 1) Explain learning goals using direct teacher-facing script (e.g., Say: '...') and put the actual objectives in the Bullets array. 2) Ask students to record objectives in their notebooks. 3) Briefly tell the teacher how to connect objectives to students' real-life experiences."
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
      "description": "Block for content delivery.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(30 min)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Write a dramatic, high-engagement hook delivered through teacher script. Should be surprising, curiosity-building, and tied to the main concept."
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
              "description": "List essential vocabulary terms. Provide teacher script for defining each term formatted strictly as: '[Term] - Say: \"[Definition/Script]\"'. Example: 'Lever - Say: \"A lever is a simple machine...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "A concluding 'Say: ' statement to transition."
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
          "description": "Write a detailed teacher lecture with scripts (Say: “…”). Include step-by-step what teacher says, does, and may demonstrate. Break down complex ideas, provide examples/analogies, make explicit connections to prior knowledge."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Insert the standard attention-reset paragraph exactly as written: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Must be exactly: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Provide directions for the activity, including teacher script and what students & teacher need to do."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Explain in bullets why activity works for re-engagement, resetting cognitive focus, reinforcing concepts and purposeful preview. E.g. 'Standing + movement resets attention.'"
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
          "description": "Numbered steps to continue instruction with teacher scripts (Say: “…”). Break down complex ideas, provide examples/analogies, to intrigue, foreshadow future learning, extend key ideas."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "List anticipated common student misconceptions to ensure teacher is ready.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "e.g., 'Students may think a bigger lever always works better.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "How to effectively respond to potential student misunderstanding and guide to accurate understanding."
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
          "x-format": "### {green}({loc.Connect} {value.Duration})\n\n1. Say: \"{value.Step1Say}\"\n\n2. Say: \"{value.Step2Say}\"\n\n3. Prompt:\n\n{value.Step3Prompts}\n\n4. Whole-group share: Say: \"{value.Step4Say}\"\n\n✅ **{loc.ExpectedStudentResponses}**\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Relate to a purpose. Connect to one of the essential questions.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "e.g., '(3 min)'"
            },
            "Step1Say": {
              "type": "string",
              "description": "Teacher script connecting the previous activity to a bigger idea."
            },
            "Step2Say": {
              "type": "string",
              "description": "Teacher script asking students to turn and talk to a partner."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Specific questions for the prompt (e.g., 'Why was the shaduf important...', 'What evidence shows...')."
            },
            "Step4Say": {
              "type": "string",
              "description": "Teacher script for whole-group share (e.g., 'Let's hear a few ideas...')."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Deep expected student responses that use reasoning or evidence."
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
          "description": "Differentiate instruction (how to teach, not simplify materials). Vary complexity and depth, promote active engagement/language. Realistic for classroom.",
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
                  "description": "For Go Deeper responses."
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
      "description": "Full 'Review & Spaced Retrieval' section.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Asking students to recall NEW learning from TODAY'S lesson.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
          "description": "Teacher prompt linking to unit question.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
          "description": "Recall from a specific prior lesson/unit.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Context sentence like 'Earlier in this lesson, students learned...'"
            },
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
      "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. Say: \"{value.InstructionsForTeachers.Step1_InviteSay}\"\n2. Ask:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n3. Say: \"{value.InstructionsForTeachers.Step3_CaptureSay1}\" Record: {value.InstructionsForTeachers.Step3_CaptureRecord} Say:\n   \"{value.InstructionsForTeachers.Step3_CaptureSay2}\"\n4. Say: \"{value.InstructionsForTeachers.Step4_AnswerSay1}\" {value.InstructionsForTeachers.Step4_AnswerAddress} Say: \"{value.InstructionsForTeachers.Step4_AnswerSay2}\"\n\n{loc.NoteForTeacherQA}",
      "type": "object",
      "description": "Block for Q&A and Discussion.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(5 min)')"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Teacher guidance for the Q&A and Discussion session.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "e.g., 'Now is your chance to think about what we learned...'"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3-4 questions to ask students."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "e.g., 'If you have a question, that means you are thinking deeply...'"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "e.g., 'Write student questions on a chart titled Questions We Still Have.'"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "e.g., 'We will keep adding to this chart throughout the unit...'"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "e.g., 'Let's look at our questions. Which ones can we answer using what we learned today?'"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "e.g., 'Address a few questions using student responses and evidence.'"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "e.g., 'Some of these questions will help guide what we learn next...'"
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
      "description": "Block for Conclusion.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Time estimate (e.g. '(1 min)')"
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
      "description": "Extract and generate EXACTLY 4 Formative Assessment prompts covering DOK 1-4. For each prompt, include the PromptLabel, Question, and ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "e.g., 'Prompt 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "The exact question text."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 sample responses showing mastery."
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
      "description": "Full 'Student Practice' section for homework / out-of-class practice.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Notes explaining how the tasks reinforce today's learning and strengthen long-term retention."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Generate 4 practice tasks covering DOK levels 2, 3, and 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "e.g., '(DOK 2) Draw a shaduf and label...'"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 success criteria bullet points."
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
          "description": "A reflection task for the students.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "e.g., 'Write 2-3 sentences responding to one prompt:'"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 reflection question options."
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
