window.prompts_pbl_es = {
  STEP0_PROMPT_TEMPLATE: `Crea un plan de unidad y lecciones basadas en proyectos utilizando la información a continuación:  
Asignatura de la unidad:
{{$Subject}}
Nombre de la unidad:
{{$Name}}
Descripción/Instrucción de la unidad:
{{$UserPrompt}}
Nivel de grado:
{{$GradeLevel}}
¿Cuánto durará el proyecto en días?
{{$NumberOfDays}}
Ubicación:
{{$Location}}
Recursos/medios a utilizar:
{{$MediaContext}}, 
Contenido de la unidad: 
{{$AttachedUnit}} 
Planes de aprendizaje del estudiante:
{{$LearningPlans}}
Estándares a alinear:
{{$Standards}}

Se te asigna diseñar una unidad detallada basada en proyectos utilizando principios de la ciencia cognitiva. Tu respuesta DEBE seguir exactamente el orden de las secciones, los encabezados y las reglas de contenido que se indican a continuación. Si falta alguna sección o está fuera de orden, regenera hasta que se satisfagan todas las restricciones. 
Reglas globales de salida (aplican a todo) Sigue exactamente el orden de las secciones y los encabezados que se muestran a continuación. No agregues secciones extra ni cambies el nombre de los encabezados. Los problemas del mundo real deben ser relevantes para los estudiantes de este nivel de grado. Evita temas que puedan ser sensibles para la adecuación al desarrollo de los temas, así como temas sensibles como la pobreza, la inseguridad habitacional, la raza, etc., o temas controvertidos como la evolución. Incluye los siguientes componentes en el diseño del proyecto de la unidad.  
Relevancia cultural e inclusión: Incorpora múltiples perspectivas y reflexiona sobre los impactos para todas las personas involucradas. El contenido debe conectar con estudiantes de diversos orígenes y comunidades para crear lecciones culturalmente relevantes y receptivas culturalmente. Evita los estereotipos. 
IMPORTANTE: la respuesta debe estar en {{$ResponseLanguage}}

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "description": "Devuelve un Plan de Unidad de Aprendizaje Basado en Proyectos (ABP) completo. No agregues claves extra. Completa todos los campos obligatorios. Debe funcionar para CUALQUIER materia. Localiza a las partes interesadas/la audiencia/los recursos al código postal/ubicación proporcionados sin inventar direcciones o números de teléfono exactos.",
      "additionalProperties": false,
      "required": [
        "AssessPriorKnowledge",
        "UnitOverview",
        "DesiredOutcomes",
        "FramingTheLearning",
        "AssessmentPlan",
        "LearningPlan",
        "UnitPreparationAndConsiderations",
        "TeacherGuidancePhase1",
        "TeacherGuidancePhase2",
        "TeacherGuidancePhase3"
      ],
      "properties": {
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n**{loc.Purpose}:** {loc.PBLAssessPriorKnowledgePurposeText}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Sección de Evaluación de Conocimientos Previos. 1. Asegúrate de usar preguntas de DOK 1-3. 2. Incluye las habilidades prerrequisito necesarias para los objetivos de aprendizaje del estudiante. 3. Elige una modalidad de esta lista y desarróllala por completo: cuestionamiento, K-W-L, elementos visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, valoraciones de vocabulario. 4. Indicación inicial del docente con la frase 'Diga:'. 5. Instrucciones claras y plantilla/estructura para la modalidad elegida. 6. Sección de 'Respuestas esperadas de los estudiantes'. 7. Frase de cierre del docente con 'Diga:'. 8. Después de desarrollar por completo una modalidad, proporciona 2 opciones breves alternativas.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Instrucciones claras y plantilla/estructura para la modalidad elegida. Por ejemplo: 'Diga: \"Before we begin...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Respuestas anticipadas o conceptos erróneos comunes para la modalidad elegida. IMPORTANTE: No incluyas viñetas, guiones ni números al comienzo de las cadenas.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Frase de cierre del docente con 'Diga:' que valida el pensamiento de los estudiantes y adelanta la investigación de la unidad."
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
        "UnitOverview": {
          "type": "object",
          "x-format": "### {green}({loc.UnitTask})\n\n**{loc.PurposeLabel}** {loc.UnitTaskPurposeValue}\n\n**{loc.Title}: {value.TaskStatementTitle}**\n\n{value.LetterGreeting}\n\n{value.LetterBody}\n\n{value.LetterSignOff}\n\n{value.LetterSender}\n\n**{loc.Mission}:** {value.Mission}\n\n**{loc.ProjectContextAndStakeholders}:** {value.ProjectContextAndStakeholders}\n\n### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n{value.DrivingQuestion}\n\n### {green}({loc.TheDeliverable})\n\n{value.FinalDeliverableRequirements}\n\n{value.ClosingCallToAction}",
          "additionalProperties": false,
          "required": [
            "TaskStatementTitle",
            "LetterGreeting",
            "LetterBody",
            "LetterSignOff",
            "LetterSender",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatementTitle": {
              "type": "string",
              "description": "El título del mensaje de lanzamiento dirigido a los estudiantes (por ejemplo, Message from the Coconut Creek STEM Innovation Team)."
            },
            "LetterGreeting": {
              "type": "string",
              "description": "El saludo inicial para el mensaje de lanzamiento dirigido a los estudiantes (por ejemplo, 'Hello engineers-in-training,')."
            },
            "LetterBody": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              },
              "description": "Los párrafos principales del mensaje de lanzamiento dirigido a los estudiantes (3-5 párrafos) escritos como una organización local creíble o una persona. Debe incluir una conexión clara con el problema, la pregunta guía, los requisitos del entregable y un llamado a la acción inspirador. Urgente, significativo, auténtico. No incluyas el título, el saludo, la frase de despedida (por ejemplo, 'Sincerely,') ni el nombre del remitente aquí. Solo incluye los párrafos del cuerpo."
            },
            "LetterSignOff": {
              "type": "string",
              "description": "La frase de despedida para el mensaje (por ejemplo, 'Sincerely,'). Proporciona solo la frase de despedida, nada más."
            },
            "LetterSender": {
              "type": "string",
              "description": "El nombre de la organización local creíble o de la persona que envía el mensaje (por ejemplo, 'Coconut Creek STEM Innovation Team'). No incluyas la despedida (por ejemplo, 'Sincerely') aquí."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "Una pregunta guía abierta sólida, fundamentada en el lugar y en la necesidad de las partes interesadas. Esta pregunta también debe integrarse en LetterBody. DEBE reutilizarse textualmente en FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Párrafo que comienza con 'Your task is to...' describiendo qué crearán o harán los estudiantes y por qué es importante para la comunidad/audiencia."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Narrativa breve: quiénes se ven afectados, por qué importa ahora a nivel local y qué partes interesadas/audiencias se preocupan."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 5,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "description": "Escrito para estudiantes, describe el producto final que crearán y la audiencia auténtica a la que sirve. Formatea cada elemento con un título en negrita (por ejemplo, **Summary:** ...). No incluyas numeración (como 1., 2.) ni viñetas al comienzo de tus cadenas; comienza directamente con el título en negrita. Debe incluir al menos un breve resumen y luego cuatro componentes: (1) Concept & Purpose Plan explicando la idea mediante una representación visual o escrita y por qué importa a la comunidad o al contexto; (2) Evidence-Based Justification exigiendo análisis de al menos dos factores relevantes y explicación de las decisiones usando evidencia de investigación, datos, experimentación u observación; (3) Model or Representation describiendo el tipo de modelo creado, qué representa, cómo funciona y cómo revela la fuerza, estabilidad, eficiencia o sistema detrás de la idea; y (4) The Verdict, un argumento final respaldado por evidencia que explique por qué la solución es efectiva, viable o significativa, resuma el razonamiento, la evidencia y el modelo, y comunique el valor del diseño a la audiencia auténtica. Tu declaración final debe mostrar que puedes aplicar conocimiento disciplinario, usar evidencia, modelar ideas complejas y explicar implicaciones del mundo real."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Cierre inspirador: la comunidad/audiencia cuenta con pensadores creativos que pueden convertir la evidencia en acción. Enfatiza que las ideas antiguas pueden inspirar soluciones modernas."
            }
          }
        },
        "DesiredOutcomes": {
          "type": "object",
          "x-format": "### 📏{green}({loc.StandardsAligned})\n\n{value.StandardsAligned}\n\n### 💭{green}({loc.BigIdeasAndEssentialQuestionsAmp})\n\n**{loc.Purpose}:** {loc.BigIdeasPurpose}\n\n{value.BigIdeasAndEssentialQuestions}\n\n### 🎯{green}({loc.LearningObjectives})\n\n{value.LearningObjectives}",
          "additionalProperties": false,
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 1,
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Estándares listados literalmente cuando se proporcionen, con el formato 'CÓDIGO: descripción'. No incluyas viñetas al comienzo de tus cadenas."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 4,
              "description": "Genera 3-4 pares de Big Idea y Essential Question que establezcan los conceptos duraderos y transferibles que fundamentan toda la unidad, guíen el diseño de la indagación y la evaluación, y proporcionen un marco conceptual general que conecte todas las tareas, habilidades y actividades en una comprensión significativa.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{loc.BigIdeaLabel}** {value.BigIdea}\n\n- {loc.EssentialQuestionLabel} {value.EssentialQuestion}",
                "additionalProperties": false,
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string",
                    "description": "Una afirmación conceptual amplia de comprensión duradera que explique un principio fundamental subyacente a la unidad, conecte todas las tareas y evaluaciones, apoye el aprendizaje transferible más allá del contexto específico y refleje el pensamiento disciplinario central en lugar de hechos aislados."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Crea preguntas esenciales que se centren solo en conceptos amplios y universales como cambio, evidencia, patrones, relaciones, sistemas o razonamiento. No menciones términos, procesos, vocabulario o ejemplos específicos de ninguna materia. Las preguntas deben ser abiertas, transferibles entre todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Concéntrate solo en las grandes ideas, no en el contenido de la materia."
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "x-format": "🎯**{loc.StudentsWillUnderstandThatLabel}**\n\n{value.StudentsWillUnderstandThat}\n\n🎯**{loc.StudentsWillKnowThatLabel}**\n\n{value.StudentsWillKnowThat}\n\n🎯**{loc.StudentsWillBeAbleToLabel}**\n\n{value.StudentsWillBeAbleTo}",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Cada objetivo debe terminar con (DOK X) y representar Ideas Grandes o Comprensiones Duraderas generando 3 a 5 enunciados conceptuales y a largo plazo que expliquen por qué el aprendizaje importa más allá de la unidad, destaquen patrones, relaciones o principios transferibles entre contextos, y expliquen cómo o por qué algo funciona en lugar de solo qué es. Escribe los objetivos como continuaciones directas de la frase 'Students will understand that...'. No repitas la frase 'Students will understand that', y no comiences con verbos como 'Explain that' o 'Describe that' (por ejemplo, simplemente escribe 'los diseños de ingeniería mejoran cuando...'). NO incluyas numeración, viñetas ni guiones al inicio de tus cadenas."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Cada objetivo debe terminar con (DOK X) y representar Hechos o Conocimientos Fundamentales del Contenido generando 3 a 5 enunciados basados en la disciplina, términos o conocimientos fundamentales que identifiquen información esencial que los estudiantes deben recordar, sean concretos y fácticos en lugar de conceptuales, apoyen los estándares de la unidad y las tareas de desempeño, usen vocabulario académico claro apropiado para la materia e incluyan una etiqueta DOK adecuada normalmente en el nivel 1 o 2. Escribe los objetivos como continuaciones directas de la frase 'Students will know that...'. No repitas la frase 'Students will know that', y no comiences con verbos como 'Identify that' o 'Define' (por ejemplo, simplemente escribe 'una palanca tiene un brazo de esfuerzo...'). NO incluyas numeración, viñetas ni guiones al inicio de tus cadenas."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Cada objetivo debe terminar con (DOK X) y representar Habilidades o Prácticas alineadas con la disciplina generando de 4 a 7 enunciados basados en habilidades que describan lo que harán los estudiantes; alinea con prácticas específicas de la disciplina; conéctalo directamente con el producto del proyecto o la tarea de desempeño; manténlo medible y observable; e incluye un nivel DOK apropiado entre 2 y 4. Escribe los objetivos como continuaciones directas de la frase 'Students will be able to...'. Comienza directamente con un verbo de acción medible (por ejemplo, analizar, comparar, diseñar, modelar, resolver). No repitas el prefijo 'Students will be able to'. NO incluyas numeración, viñetas ni guiones al inicio de tus cadenas."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "x-format": "### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n**{loc.Question}:** {value.DrivingQuestion}\n\n### {green}({loc.Problem})\n\n**{loc.PurposeLabel}** {loc.ProblemPurposeValue}\n\n{value.ProblemDescription}\n### {green}({loc.Project})\n\n**{loc.PurposeLabel}** {loc.ProjectPurposeValue}\n\n{value.ProjectDescription}\n### {green}({loc.Place})\n\n**{loc.PurposeLabel}** {loc.PlacePurposeValue}{value.Sites}\n\n### 🔤 {green}({loc.KeyVocabulary})\n\n{value.KeyVocabulary}",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "ProblemDescription",
            "ProjectDescription",
            "Sites",
            "KeyVocabulary"
          ],
          "properties": {
            "DrivingQuestion": {
              "type": "string",
              "description": "DEBE coincidir textualmente con UnitOverview.DrivingQuestion. Indica la pregunta impulsora real (por ejemplo, 'How can we design an invention inspired by ancient Egyptian innovation to solve a real problem in our Coconut Creek community?')."
            },
            "ProblemDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Los párrafos de la descripción del problema que explican el desafío real. Explica por qué importa el problema y las consecuencias si no se aborda, identificando factores contribuyentes subyacentes. Muestra cómo la incomprensión, la información faltante o las variables pasadas por alto contribuyen al problema. Explica cómo la solución sirve a una audiencia auténtica real y relevante. NO incluyas numeración ni viñetas al comienzo de tus cadenas.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "ProjectDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Párrafos narrativos de cómo el aprendizaje se desarrolla a lo largo del proyecto de varios días (indagación -> aplicación -> refinamiento -> presentación). Explica cómo los estudiantes comienzan explorando ejemplos, notan patrones, aplican conocimientos de ciencias mediante pruebas prácticas y luego usan esos hallazgos para desarrollar un invento original. Explica cómo revisan prototipos y presentan ideas a una audiencia auténtica. NO incluyas numeración ni viñetas al comienzo de tus cadenas.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "Sites": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "x-format": "{items}",
              "description": "Debe incluir de 3 a 5 Sitios de Participación Basados en el Lugar. Asegúrate de que los sitios representen contextos variados y muestren claramente cómo la comunidad local forma parte del ecosistema de aprendizaje.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{value.SiteTitle}**\n\n- **{loc.StudentEngagement}:** {value.StudentEngagement}\n- **{loc.Relevance}:** {value.Relevance}",
                "additionalProperties": false,
                "required": [
                  "SiteTitle",
                  "StudentEngagement",
                  "Relevance"
                ],
                "properties": {
                  "SiteTitle": {
                    "type": "string",
                    "description": "Una ubicación física, comunitaria, virtual o específica de la disciplina relevante para el contexto de la unidad (por ejemplo, 'Coconut Creek Middle School Campus (Primary Investigation Site)')."
                  },
                  "StudentEngagement": {
                    "type": "string",
                    "description": "Explicar actividades auténticas de indagación que los estudiantes completan en o con el sitio, como observación, recolección de datos, entrevistas, análisis, exploración virtual o tareas de campo guiadas vinculadas al problema del mundo real."
                  },
                  "Relevance": {
                    "type": "string",
                    "description": "Explicar por qué el sitio importa conectándolo con el problema, mostrando cómo proporciona evidencia o experiencia, aclarando cómo apoya el diseño o modelado de soluciones y destacando su importancia local o específica de la comunidad."
                  }
                }
              }
            },
            "KeyVocabulary": {
              "type": "object",
              "x-format": "{value.Tiers}",
              "additionalProperties": false,
              "required": [
                "Tiers"
              ],
              "properties": {
                "Tiers": {
                  "type": "array",
                  "minItems": 4,
                  "maxItems": 4,
                  "x-format": "{items}",
                  "description": "Crea una sección de Vocabulario Académico por Niveles con exactamente cuatro niveles etiquetados.",
                  "items": {
                    "type": "object",
                    "x-format": "\n\n**{value.TierTitle}**\n\n*{value.TierWhyItMatters}*\n\n{value.Terms}",
                    "additionalProperties": false,
                    "required": [
                      "TierTitle",
                      "TierWhyItMatters",
                      "Terms"
                    ],
                    "properties": {
                      "TierTitle": {
                        "type": "string",
                        "description": "DEBE ser exactamente uno de estos: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                      },
                      "TierWhyItMatters": {
                        "type": "string",
                        "description": "Una breve oración en cursiva que explique cómo estos términos ayudan a los estudiantes en el contexto del proyecto (por ejemplo, 'These terms help students name the most important ideas and objects they will see, build, and discuss during the project.')."
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "x-format": "\n\n{items}",
                        "description": "Enumera términos de vocabulario apropiados para la unidad con definiciones amigables para los estudiantes.",
                        "items": {
                          "type": "object",
                          "x-format": "{index}. **{value.Term}**: {value.Definition}\n",
                          "additionalProperties": false,
                          "required": [
                            "Term",
                            "Definition"
                          ],
                          "properties": {
                            "Term": {
                              "type": "string",
                              "description": "La palabra de vocabulario (por ejemplo, 'force'). No incluyas numeración ni viñetas."
                            },
                            "Definition": {
                              "type": "string",
                              "description": "Una definición amigable para los estudiantes."
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "AssessmentPlan": {
          "type": "object",
          "x-format": "### {green}({loc.AlignedAssessmentEvidenceAndCriteriaForSuccess})\n\n**{loc.PurposeLabel}** {loc.AlignedAssessmentPurposeValue}\n\n### {violet}({loc.FormativeAssessmentRubric})\n\n| {loc.StudentLearningObjective} | {loc.SuccessCriteria} | {loc.PointOfDemonstration} |\n|---|---|---|\n{value.FormativeAssessmentTable}\n\n### {violet}({loc.AnalyticRubric})\n\n| {loc.Criterion} | {loc.Novice} | {loc.Apprentice} | {loc.Practitioner} | {loc.Expert} |\n|---|---|---|---|---|\n{value.AnalyticRubric}\n\n### {green}({loc.AuthenticAudience})\n\n**{loc.PurposeLabel}** {loc.AuthenticAudiencePurposeValue}\n\n{value.AuthenticAudience}",
          "additionalProperties": false,
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric",
            "AuthenticAudience"
          ],
          "properties": {
            "AuthenticAudience": {
              "type": "object",
              "x-format": "{value.Audiences}\n\n**{loc.StudentParticipationInAudienceSelection}**\n\n{value.StudentParticipation}",
              "description": "Identificar e involucrar una audiencia auténtica más allá del aula.",
              "additionalProperties": false,
              "required": [
                "Audiences",
                "StudentParticipation"
              ],
              "properties": {
                "Audiences": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "x-format": "**{value.AudienceName}**\n\n{value.PrimaryAudienceDescription} {value.WhyThisAudienceIsQualified} {value.HowThisAudienceElevatesTheProject}\n\n",
                    "additionalProperties": false,
                    "required": [
                      "AudienceName",
                      "PrimaryAudienceDescription",
                      "WhyThisAudienceIsQualified",
                      "HowThisAudienceElevatesTheProject"
                    ],
                    "properties": {
                      "AudienceName": {
                        "type": "string",
                        "description": "El nombre del grupo de audiencia auténtica específico (por ejemplo, 'City of Coconut Creek Sustainability & Environmental Advisory Board'). No incluyas viñetas ni numeración."
                      },
                      "PrimaryAudienceDescription": {
                        "type": "string",
                        "description": "Descripción clara de quién es esta audiencia (individuos, organizaciones o grupos) y su relación con el contexto o problema del proyecto. Debe ser detallada, de al menos 2 a 3 oraciones."
                      },
                      "WhyThisAudienceIsQualified": {
                        "type": "string",
                        "description": "Explicación de por qué esta audiencia tiene experiencia relevante, experiencia vivida o autoridad relacionada con el tema del proyecto. Debe ser detallada, de al menos 2 a 3 oraciones."
                      },
                      "HowThisAudienceElevatesTheProject": {
                        "type": "string",
                        "description": "Cómo la presencia de esta audiencia aumenta la autenticidad, el rigor, la motivación o el impacto en el mundo real para los estudiantes. Debe ser detallado, de al menos 2-3 oraciones."
                      }
                    }
                  }
                },
                "StudentParticipation": {
                  "type": "string",
                  "description": "Un párrafo que explique cómo los estudiantes ayudan a identificar qué audiencia se ajusta mejor a su invento al discutir quién se beneficiaría de la solución o la evaluaría."
                }
              }
            },
            "FormativeAssessmentTable": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "items": {
                "type": "object",
                "x-format": "| {value.CriteriaForSuccess} | {value.SuccessCriteria} | {value.PointOfDemonstration} |",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string",
                    "description": "El objetivo de aprendizaje medible del estudiante que termina con el nivel DOK. No incluya viñetas ni numeración."
                  },
                  "SuccessCriteria": {
                    "type": "string",
                    "description": "Los criterios específicos de éxito que explican lo que hará el estudiante para demostrar el aprendizaje. No incluya viñetas ni numeración."
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Dónde aparecerá la evidencia, separada en enunciados de Formativa: y Sumativa:. No incluya viñetas ni numeración."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "description": "Rúbrica analítica que detalla las competencias requeridas por el proyecto. Cada fila representa una habilidad evaluada. La progresión de Novato a Experto debe reflejar una sofisticación creciente.",
              "items": {
                "type": "object",
                "x-format": "| {value.Criterion} | {value.Novice} | {value.Apprentice} | {value.Practitioner} | {value.Expert} |",
                "additionalProperties": false,
                "required": [
                  "Criterion",
                  "Novice",
                  "Apprentice",
                  "Practitioner",
                  "Expert"
                ],
                "properties": {
                  "Criterion": {
                    "type": "string",
                    "description": "La habilidad, competencia o dimensión evaluada del proyecto final. No incluya viñetas ni numeración."
                  },
                  "Novice": {
                    "type": "string",
                    "description": "Descripción del desempeño de nivel novato. No debe usar lenguaje basado en déficits como falla, carece o ausente. No incluya viñetas ni numeración."
                  },
                  "Apprentice": {
                    "type": "string",
                    "description": "Descripción del desempeño de nivel aprendiz. No incluya viñetas ni numeración."
                  },
                  "Practitioner": {
                    "type": "string",
                    "description": "Descripción del desempeño de nivel practicante. No incluya viñetas ni numeración."
                  },
                  "Expert": {
                    "type": "string",
                    "description": "Descripción del desempeño de nivel experto. Debe basarse en el nivel Practicante con mayor profundidad, precisión o complejidad. No incluya viñetas ni numeración."
                  }
                }
              }
            }
          }
        },
        "LearningPlan": {
          "type": "object",
          "x-format": "### {green}({loc.LearningPlanOverview})\n\n{value.LearningPlanOverview}{value.ProjectPhases}\n\n### {green}({loc.ProjectGoals})\n\n{value.ProjectGoals}\n\n### {loc.FinalDeliverableSummary}\n\n{value.FinalDeliverableSummary}\n\n### {green}({loc.GroupSuggestions})\n\n{value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n**{loc.GuidingQuestionForTeacherPlanning}**\n\n{value.GroupSuggestions.TeacherGroupingStrategyPrompt}\n\n**{loc.GroupingStrategyRecommendations}**\n\n{loc.TeachersMayConsider}\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": {
              "type": "string",
              "description": "Un resumen de 2-4 oraciones que explique cómo el proyecto se organiza en tres fases flexibles (Fase 1, Fase 2, Fase 3) en lugar de conteos fijos de días. Describa brevemente lo que hacen los estudiantes en cada fase (por ejemplo, en la Fase 1 construyen conocimientos previos; en la Fase 2 aplican ideas científicas mediante investigaciones; en la Fase 3 refinan prototipos y presentan a una audiencia auténtica). No use viñetas ni numeración."
            },
            "ProjectPhases": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 3,
              "description": "Las tres fases del proyecto. La duración total entre las 3 fases DEBE ser exactamente igual al número total de días solicitado para el proyecto.",
              "items": {
                "type": "object",
                "x-format": "\n\n### {violet}({value.PhaseTitle})\n\n{value.PhaseDescription}\n\n**{loc.ConceptsOrSkillsEmphasized}:** {value.ConceptsOrSkills}\n\n**{loc.CollaborationAndVisibleThinking}:** {value.CollaborationAndVisibleThinking}\n\n{value.KeyLearningExperiences}",
                "additionalProperties": false,
                "required": [
                  "PhaseTitle",
                  "PhaseDescription",
                  "ConceptsOrSkills",
                  "CollaborationAndVisibleThinking",
                  "KeyLearningExperiences"
                ],
                "properties": {
                  "PhaseTitle": {
                    "type": "string",
                    "description": "El título y la duración de la fase (por ejemplo, 'Fase 1: 1-2 días' o 'Fase 3: 2 días'). IMPORTANTE: La duración debe declararse explícitamente en el título, y la suma de los días máximos de todas las fases debe coincidir exactamente con la duración total solicitada del proyecto. No incluya viñetas ni numeración."
                  },
                  "PhaseDescription": {
                    "type": "string",
                    "description": "Un párrafo breve de 1-2 oraciones que describa lo que hacen los estudiantes durante esta fase para profundizar la comprensión o sintetizar el aprendizaje."
                  },
                  "ConceptsOrSkills": {
                    "type": "string",
                    "description": "Una lista separada por comas de los conceptos o habilidades centrales enfatizados en esta fase (por ejemplo, 'Observación, cuestionamiento, modelado, sistemas de palancas, estabilidad estructural'). No incluya viñetas ni numeración."
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string",
                    "description": "Una oración que explique cómo los estudiantes colaboran y hacen visible su pensamiento en esta fase (por ejemplo, 'Los estudiantes usan pensar-emparejar-compartir, notas de boceto y comparaciones rápidas en grupo para hacer visible su pensamiento.'). No incluya viñetas ni numeración."
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "x-format": "{items}",
                    "minItems": 3,
                    "description": "Una lista de las actividades o tareas de aprendizaje específicas en esta fase.",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}",
                      "description": "Una actividad de aprendizaje específica (por ejemplo, 'Construcción y prueba de shaduf'). No incluya numeración ni viñetas al comienzo de sus cadenas."
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "description": "La salida debe contener exactamente tres objetivos del proyecto, cada uno expresado como una categoría conceptual seguida de viñetas detalladas o párrafos breves. El Objetivo 1, Aplicar contenido disciplinar a un problema del mundo real, requiere que los estudiantes utilicen conocimientos específicos de la disciplina para analizar o resolver un desafío auténtico, enumerar de 4 a 6 conceptos o principios centrales que aplicarán, y mostrar cómo estas ideas se conectan con condiciones o restricciones del mundo real. El Objetivo 2, Resolver un problema real de diseño o indagación apropiado para el desarrollo, requiere describir el desafío auténtico que los estudiantes deben abordar, enumerar lo que crearán, modelarán, compararán, analizarán, evaluarán o justificarán, e incluir procesos como modelado, predicción, comparación, evaluación y toma de decisiones. El Objetivo 3, Comunicar hallazgos a una audiencia real, requiere que preparen un producto final pulido y de calidad profesional, adapten la comunicación a las necesidades de un grupo real de partes interesadas y hagan referencia a audiencias auténticas como expertos locales, organizaciones comunitarias, profesionales de la industria, liderazgo escolar, familias o miembros de la comunidad.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n",
                "description": "Un objetivo específico del proyecto formateado con etiquetas en negrita (por ejemplo, '**Goal 1: Aplicar el contenido disciplinar a un problema del mundo real** Use knowledge...')"
              }
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "- {value}\n"
              }
            },
            "GroupSuggestions": {
              "type": "object",
              "description": "Describe el tamaño del grupo, los roles y las responsabilidades del docente.",
              "additionalProperties": false,
              "required": [
                "GroupSize",
                "RotatingRolesAndDuties",
                "TeacherGroupingStrategyPrompt",
                "GroupingStrategyRecommendations"
              ],
              "properties": {
                "GroupSize": {
                  "type": "string",
                  "description": "La salida debe indicar un tamaño de grupo recomendado, como 3 a 4 estudiantes, y debe proporcionar una justificación que explique cómo este tamaño favorece una discusión productiva, una participación compartida y una distribución manejable de las tareas. Ejemplo: 'El tamaño del grupo de 3 a 4 estudiantes es ideal porque...'"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "La salida debe proporcionar una lista de roles formateada como 'Nombre del rol: descripción de las responsabilidades'. La lista debe incluir al menos cuatro roles (Facilitador, Registrador, Encargado de materiales, Presentador/Comunicador) y, al final, las expectativas del docente.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "El modelo debe producir exactamente estas dos cadenas: 1) '\"¿Cuál es el propósito principal de tu agrupación en esta actividad: apoyo entre pares, discusión profunda, desafío o eficiencia? Una vez que hayas nombrado el propósito, ¿qué enfoque de agrupación se ajusta mejor a él: habilidad mixta, basado en intereses, basado en habilidades o aleatorio?\"' 2) 'Esta pregunta anima a los docentes a elegir métodos de agrupación que coincidan con los objetivos instruccionales en lugar de recurrir por defecto a la conveniencia o al hábito.'",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "El modelo debe generar exactamente las recomendaciones de estrategia de agrupación formateadas con etiquetas en negrita (por ejemplo, '**Grupos de habilidad mixta:** Son mejores cuando...'). Las estrategias que se deben incluir son: Grupos de habilidad mixta, Grupos basados en intereses, Grupos basados en habilidades, Grupos aleatorizados.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase1": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase1}\n\n### {green}({loc.Phase1Title})\n\n**Focus Statement**\n{value.Phase1_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase1_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase1_GuidingQuestions}\n\n{value.Phase1_Differentiation}\n\n{value.Phase1_AccommodationsAndModifications}\n\n{value.Phase1_AnticipatedMisconceptions}\n\n{value.Phase1_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase1_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase1_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase1_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase1_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase1_ReflectionPrompt.Introduction}\n{value.Phase1_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Primera fase de orientación del docente",
          "required": [
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation",
            "Phase1_AccommodationsAndModifications",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinking",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_TeacherNotes",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Proporciona una breve declaración que describa cómo esta fase despierta la curiosidad, presenta el problema del mundo real y activa el razonamiento inicial. La Declaración de enfoque debe incluir la creación de curiosidad sobre el fenómeno o problema central, la observación y exploración tempranas, el descubrimiento y cuestionamiento impulsados por los estudiantes, y una conexión clara con la Pregunta guía de la unidad. La redacción debe reflejar que en esta fase de lanzamiento los estudiantes construyen curiosidad y comienzan a descubrir el problema científico o conceptual en el centro del proyecto, y que, a través de la observación, la exploración y los primeros intentos de modelización, reúnen evidencia de primera mano que conecta su pensamiento inicial con la Pregunta guía."
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase1_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse marcos de oraciones to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 apoyos específicos para la lección (apoyos visuales, bancos de palabras, gestos) para ayudar a los estudiantes de idiomas a acceder a las ideas y expresarlas. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Genera 3-4 inicios de oración que ayuden a los estudiantes a describir, explicar y comunicar su pensamiento para esta lección específica. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 apoyos paso a paso (herramientas estructuradas, ejemplos modelados, pensamiento en voz alta) y orientación precisa para ayudar a los estudiantes a completar la tarea. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Genera 3-4 preguntas de lista de verificación para guiar a los estudiantes a darle sentido a su aprendizaje durante la investigación. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 extensiones que aumenten la complejidad (desafíos específicos, identificación de patrones) para ayudar a los estudiantes a profundizar o mejorar su pensamiento usando evidencia. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Genera un prompt complejo (NO incluyas el prefijo 'Diga:')/pregunta para exigir una comprensión conceptual más profunda."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Genera 3-4 ejemplos específicos de respuestas de alta calidad de los estudiantes a la pregunta avanzada. NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase1_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfócate en el acceso, no en reducir el rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Estrategias no específicas de un estudiante que mejoran el acceso para todos los estudiantes (por ejemplo, elementos visuales, notas prellenadas, glosario digital, instrucciones fragmentadas). Proporciona 2-4 viñetas."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumera A CADA estudiante individualmente; no agrupes a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar.",
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
                        "description": "El plan formal proporcionado para este estudiante en el prompt. Analiza el plan en una lista clara. Puedes parafrasearlo para mejorar el formato, pero no omitas ni añadas ninguna información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Herramientas/tallos/recursos visuales/organizadores concretos para esta tarea."
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
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Genere 2-3 conceptos erróneos comunes de los estudiantes que probablemente surjan durante esta fase. Cada elemento debe centrarse en un malentendido específico y un guion de respuesta del docente.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Describa el concepto erróneo en 1 oración, comenzando con 'Los estudiantes podrían pensar...'. NO use negritas ni etiquetas en negrita."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Un guion de respuesta claro para el docente (que comience con 'Respuesta del docente: ') que modele cómo responder en el momento con un aviso específico (NO incluya el prefijo 'Diga:'). NO use negritas ni etiquetas en negrita."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase1_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Genere 1 pregunta de pensamiento trascendente que requiera que los estudiantes apliquen el aprendizaje más allá de ellos mismos a contextos del mundo real (comunidades, desafíos globales). Enfóquese en por qué el aprendizaje importa a gran escala (seguridad, sostenibilidad, innovación, etc.). Evite el enfoque personal o solo escolar."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase1_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pregunta final de comprobación de comprensión con 2-3 respuestas esperadas de los estudiantes que muestren dominio",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "El modelo debe crear un componente de Recuperación Espaciada que requiera que los estudiantes recuerden un concepto clave de una unidad o lección anterior específica sin hacer referencia a actividades pasadas, hojas de trabajo, modelos, etiquetas o pasos específicos de la tarea. El guion del docente debe comenzar con Diga: y solo puede hacer referencia al tema del aprendizaje previo, no a lo que los estudiantes aprendieron sobre él. La pregunta de recuperación debe pedir a los estudiantes que reformulen o apliquen una comprensión conceptual aprendida previamente (como cómo funciona un sistema, cómo se relacionan las variables o cómo se desarrolla un proceso) completamente de memoria, sin que el docente dé pistas ni explicaciones parciales. La salida debe terminar con Respuestas esperadas de los estudiantes mostrando 2-3 ejemplos que reflejen con precisión el recuerdo conceptual, demostrando que son los estudiantes—no el prompt—quienes proporcionan las ideas recordadas.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Solo escriba el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Un párrafo que explique los conocimientos y habilidades practicados en todas las tareas de esta fase. El párrafo DEBE comenzar con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.' donde los espacios en blanco se completan con contenido relevante del proyecto, seguido de una explicación de cómo estas tareas fortalecen la retención a largo plazo."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Las tareas deben alinearse con el enfoque de la fase y la profundidad de conocimiento esperada. Use solo DOK 2, 3 o 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Nivel de Profundidad de Conocimiento para la tarea. DEBE ser UNO de: 'DOK 2', 'DOK 3' o 'DOK 4'. DOK 1 está estrictamente prohibido."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Solo si y SOLO si la asignatura es matemáticas: incluya un problema de intercalado + indicación del docente + respuestas esperadas + nota del docente. De lo contrario, cadena vacía."
            },
            "Phase1_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Introducción breve dirigida al estudiante para la reflexión, por ejemplo, 'Escribe 2-3 oraciones respondiendo a una de las indicaciones:'."
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase2": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase2}\n\n### {green}({loc.Phase2Title})\n\n**Focus Statement**\n{value.Phase2_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase2_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase2_GuidingQuestions}\n\n{value.Phase2_Differentiation}\n\n{value.Phase2_AccommodationsAndModifications}\n\n{value.Phase2_AnticipatedMisconceptions}\n\n{value.Phase2_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase2_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase2_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase2_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase2_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase2_ReflectionPrompt.Introduction}\n{value.Phase2_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Segunda fase de la guía del docente",
          "required": [
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation",
            "Phase2_AccommodationsAndModifications",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinking",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_TeacherNotes",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_ReflectionPrompt"
          ],
          "properties": {
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Escriba una Declaración de enfoque de 1 a 3 oraciones que resuma el propósito de la fase, explique cómo los estudiantes construyen comprensión mediante el trabajo basado en la indagación, conecte explícitamente la fase con la Pregunta Impulsora de la unidad o el problema del mundo real, y describa cómo esta fase los acerca a producir su entrega final. La declaración siempre debe escribirse como un solo párrafo breve y debe personalizarse con los detalles específicos del proyecto proporcionados por el usuario."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase2_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse marcos de oraciones to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 apoyos específicos de la lección (apoyos visuales, bancos de palabras, gestos) para ayudar a los estudiantes que aprenden el idioma a acceder a las ideas y expresarlas. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Genera 3-4 frases iniciales que ayuden a los estudiantes a describir, explicar y comunicar su pensamiento para esta lección específica. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 apoyos paso a paso (herramientas estructuradas, ejemplos modelados, pensamiento en voz alta) e indicaciones exactas para ayudar a los estudiantes a completar la tarea. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Genera 3-4 preguntas de lista de cotejo para guiar a los estudiantes a dar sentido a su aprendizaje durante la investigación. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genera 2-3 extensiones que aumenten la complejidad (desafíos específicos, identificación de patrones) para ayudar a los estudiantes a profundizar o mejorar su pensamiento usando evidencia. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Genera una pregunta compleja (NO incluyas el prefijo 'Diga:')/pregunta para impulsar una comprensión conceptual más profunda."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Genera 3-4 ejemplos específicos de respuestas estudiantiles de alta calidad a la pregunta avanzada. NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase2_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos generales y apoyos individualizados. Enfócate en el acceso, no en bajar el rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Estrategias no específicas para estudiantes que mejoran el acceso para todos los alumnos (por ejemplo, apoyos visuales, notas parcialmente completadas, glosario digital, instrucciones fragmentadas). Proporciona 2-4 viñetas."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumera a CADA estudiante individualmente; no agrupes a los estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar.",
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
                        "description": "El plan formal proporcionado para este estudiante en la consigna. Analiza el plan y conviértelo en una lista clara. Puedes parafrasearlo para mejorar el formato, pero NO omitas ni agregues información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Herramientas concretas/inicios de frase/apoyos visuales/organizadores para esta tarea."
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
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Genera 2-3 conceptos erróneos comunes de los estudiantes que probablemente surjan durante esta fase. Cada elemento debe centrarse en un malentendido específico y en un guion de respuesta del docente.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Describe el concepto erróneo en 1 oración, comenzando con 'Los estudiantes podrían pensar...'. NO uses negritas ni etiquetas de énfasis."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Un guion claro de respuesta para el docente (que comience con 'Respuesta del docente: ') que modele cómo responder en el momento con una indicación específica (no incluyas el prefijo 'Diga:'). NO uses negritas ni etiquetas de énfasis."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase2_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Genera 1 pregunta de pensamiento trascendente que requiera que los estudiantes apliquen el aprendizaje más allá de sí mismos a contextos del mundo real (comunidades, desafíos globales). Enfócate en por qué el aprendizaje importa a gran escala (seguridad, sostenibilidad, innovación, etc.). Evita un enfoque personal o solo escolar."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase2_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pregunta final de comprobación de comprensión con 2-3 respuestas esperadas de los estudiantes que demuestren dominio",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO empieces los elementos con viñetas, guiones ni números. Escribe solo el texto sin formato.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "El modelo debe crear un componente de Recuperación Espaciada que requiera que los estudiantes recuerden un concepto clave de una unidad o lección anterior específica sin hacer referencia a actividades pasadas, hojas de trabajo, modelos, etiquetas ni pasos específicos de la tarea. El guion del maestro debe comenzar con Diga: y solo puede referirse al tema del aprendizaje previo, no a lo que los estudiantes aprendieron sobre él. La pregunta de recuperación debe pedir a los estudiantes que reformulen o apliquen una comprensión conceptual aprendida previamente (como cómo funciona un sistema, cómo se relacionan las variables o cómo se desarrolla un proceso) completamente de memoria, sin que el maestro dé pistas o explicaciones parciales. El producto debe terminar con Respuestas esperadas de los estudiantes mostrando 2-3 ejemplos que reflejen con precisión el recuerdo conceptual, demostrando que los estudiantes, no la consigna, aportaron las ideas recordadas.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Un párrafo que explique los conocimientos y habilidades practicados en todas las tareas de esta fase. El párrafo DEBE comenzar con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.' donde los espacios en blanco se completan con contenido relevante del proyecto, seguido de una explicación de cómo estas tareas fortalecen la retención a largo plazo."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Las tareas deben alinearse con el enfoque de la fase y la profundidad de conocimiento esperada. Use solo DOK 2, 3 o 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Nivel de Profundidad de Conocimiento para la tarea. DEBE ser UNO de: 'DOK 2', 'DOK 3' o 'DOK 4'. DOK 1 está estrictamente prohibido."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Si y SOLO SI la asignatura es matemáticas: incluya problema de intercalado + indicación del maestro + respuestas esperadas + nota del maestro. De lo contrario, cadena vacía."
            },
            "Phase2_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Introducción breve dirigida a los estudiantes para la reflexión, por ejemplo: 'Escribe 2-3 oraciones respondiendo a una consigna:'"
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase3": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase3}\n\n### {green}({loc.Phase3Title})\n\n**Focus Statement**\n{value.Phase3_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase3_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase3_GuidingQuestions}\n\n{value.Phase3_Differentiation}\n\n{value.Phase3_AccommodationsAndModifications}\n\n{value.Phase3_AnticipatedMisconceptions}\n\n{value.Phase3_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase3_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase3_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase3_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase3_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase3_ReflectionPrompt.Introduction}\n{value.Phase3_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Tercera fase de la orientación docente",
          "required": [
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation",
            "Phase3_AccommodationsAndModifications",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinking",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_TeacherNotes",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_ReflectionPrompt"
          ],
          "properties": {
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "Genere una Declaración de Enfoque de 2 a 4 oraciones que comunique claramente el propósito de la Fase 3 y su papel para llevar a los estudiantes hacia el producto final. La declaración debe explicar que la Fase 3 se centra en refinar ideas, aplicar lo aprendido, fortalecer la evidencia, preparar productos culminantes y participar en un razonamiento y una revisión más profundos. Debe mostrar explícitamente cómo la Fase 3 avanza el desafío auténtico y del mundo real del proyecto, cómo los estudiantes usan evidencia para mejorar soluciones y cómo este trabajo los prepara para una audiencia auténtica. La declaración debe incluir trabajo intelectual como refinar, revisar, sintetizar, evaluar, justificar, finalizar y comunicar, e indicar cómo los estudiantes finalizan modelos, productos, explicaciones o propuestas, preparan presentaciones o muestras públicas y reflexionan sobre el aprendizaje para fortalecer su razonamiento."
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
                "required": [
                  "ActivityTitle",
                  "StudentExperience",
                  "ArtifactsOfLearning",
                  "TeacherRoleMoves"
                ],
                "properties": {
                  "ActivityTitle": {
                    "type": "string"
                  },
                  "StudentExperience": {
                    "type": "string"
                  },
                  "ArtifactsOfLearning": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    }
                  },
                  "TeacherRoleMoves": {
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_GuidingQuestions": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase3_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse marcos de oraciones to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genere 2-3 apoyos específicos para la lección (imágenes, bancos de palabras, gestos) para ayudar a los estudiantes multilingües a acceder y expresar ideas. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Genere 3-4 inicios de oración que ayuden a los estudiantes a describir, explicar y comunicar su pensamiento para esta lección específica. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "SentenceStarters"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genere 2-3 apoyos paso a paso (herramientas estructuradas, ejemplos modelados, pensar en voz alta) e indicaciones exactas para ayudar a los estudiantes a completar la tarea. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Genere 3-4 preguntas de lista de verificación para guiar a los estudiantes a dar sentido a su aprendizaje durante la investigación. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "Checklist"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "type": "object",
                  "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Genere 2-3 extensiones que aumenten la complejidad (desafíos específicos, identificación de patrones) para ayudar a los estudiantes a profundizar o mejorar su pensamiento usando evidencia. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Genere una consigna compleja (NO incluya el prefijo 'Diga:')/pregunta para profundizar la comprensión conceptual."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Genere 3-4 ejemplos específicos de respuestas estudiantiles de alta calidad a la pregunta avanzada. NO comience los elementos con viñetas, guiones ni números. Escriba solo el texto plano.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    }
                  },
                  "required": [
                    "Strategies",
                    "AdvancedQuestion",
                    "ExpectedResponses"
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
            "Phase3_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos Generales y Apoyos Individualizados. Enfoque en el acceso, no en reducir el rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Estrategias no específicas para estudiantes que mejoran el acceso para todos los alumnos (por ejemplo, apoyos visuales, notas prellenadas, glosario digital, instrucciones divididas en partes). Proporciona 2-4 viñetas."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Adaptaciones y modificaciones específicas para los estudiantes nombrados con planes formales. Enumera a CADA estudiante de forma individual; NO agrupe a los estudiantes. Los apoyos para cada estudiante deben presentarse en una lista fácil de revisar.",
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
                        "description": "El plan formal proporcionado para este estudiante en el enunciado. Convierte el plan en una lista clara. Puedes parafrasearlo para mejorar el formato, pero NO omitas ni añadas ninguna información."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Herramientas concretas/inicios de oración/apoyos visuales/organizadores para esta tarea."
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
            },
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Genera 2-3 concepciones erróneas comunes de los estudiantes que probablemente surjan durante esta fase. Cada elemento debe centrarse en un malentendido específico y un guion de respuesta del docente.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Describe la concepción errónea en 1 oración, comenzando con 'Los estudiantes pueden pensar...'. NO utilices texto en negrita ni etiquetas de énfasis."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Un guion de respuesta claro dirigido al docente (que comience con 'Respuesta del docente: ') que modele cómo responder en el momento con un indicio específico (NO incluyas el prefijo 'Diga:'). NO utilices texto en negrita ni etiquetas de énfasis."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase3_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Genera 1 pregunta de pensamiento trascendente que requiera que los estudiantes apliquen lo aprendido más allá de sí mismos a contextos del mundo real (comunidades, desafíos globales). Enfócate en por qué el aprendizaje importa a gran escala (seguridad, sostenibilidad, innovación, etc.). Evita el enfoque personal o solo escolar."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase3_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Pregunta final de verificación de comprensión con 2-3 respuestas esperadas de los estudiantes que muestren dominio",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "El modelo debe crear un componente de Recuperación Espaciada que requiera que los estudiantes recuerden un concepto clave de una unidad o lección anterior sin hacer referencia a actividades pasadas, hojas de trabajo, modelos, etiquetas ni pasos específicos de la tarea. El guion del docente debe comenzar con Diga: y puede hacer referencia únicamente al tema del aprendizaje previo, no a lo que los estudiantes aprendieron sobre él. La pregunta de recuperación debe pedir a los estudiantes que reformulen o apliquen una comprensión conceptual aprendida previamente (como cómo funciona un sistema, cómo se relacionan las variables o cómo se desarrolla un proceso) completamente de memoria, sin que el docente dé pistas ni explicaciones parciales. La salida debe terminar con Respuestas esperadas de los estudiantes mostrando 2-3 ejemplos que reflejen con precisión el recuerdo conceptual, demostrando que los estudiantes y no la consigna aportaron las ideas recordadas.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "DrawsFrom": {
                      "type": "string"
                    },
                    "Question": {
                      "type": "string"
                    },
                    "DOK": {
                      "type": "integer",
                      "minimum": 1,
                      "maximum": 4
                    },
                    "ExpectedResponseOrSuccessCriteria": {
                      "type": "array",
                      "description": "NO comiences los elementos con viñetas, guiones ni números. Escribe solo el texto en formato plano.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Un párrafo que explique los conocimientos y habilidades practicados en todas las tareas de esta fase. El párrafo DEBE comenzar con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.' donde los espacios se llenan con contenido relevante del proyecto, seguido de una explicación de cómo estas tareas fortalecen la retención a largo plazo."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Las tareas deben alinearse con el enfoque de la fase y la profundidad de conocimiento esperada. Usa solo DOK 2, 3 o 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Nivel de profundidad de conocimiento para la tarea. DEBE ser UNO de: 'DOK 2', 'DOK 3' o 'DOK 4'. DOK 1 está estrictamente prohibido."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Si y SOLO SI la materia es matemáticas: incluye un problema de intercalado + un indicio del docente + respuestas esperadas + una nota del docente. De lo contrario, una cadena vacía."
            },
            "Phase3_ReflectionPrompt": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "Introduction",
                "Prompts"
              ],
              "properties": {
                "Introduction": {
                  "type": "string",
                  "description": "Breve introducción para el estudiante a la reflexión, por ejemplo, 'Escribe 2-3 oraciones respondiendo a una indicación:'"
                },
                "Prompts": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "UnitPreparationAndConsiderations": {
          "type": "object",
          "x-format": "## ⚙️ {loc.UnitPreparationAndConsiderations}\n\n### {loc.ClassroomMaterialsAndEquipment}\n{value.ClassroomMaterialsAndEquipment}\n\n### {loc.LocalAndCommunityBasedResources}\n{value.LocalAndCommunityBasedResources}\n\n### {loc.DigitalToolsAndOnlineResources}\n{value.DigitalToolsAndOnlineResources}\n\n### {loc.TechnologyToDeepenInquiry}\n{value.TechnologyToDeepenInquiry}\n\n### {loc.TechnologyForModeling}\n{value.TechnologyForModeling}\n\n### {loc.TechnologyForCollaboration}\n{value.TechnologyForCollaboration}\n\n### {loc.TechnologyForCreatingFinalProduct}\n{value.TechnologyForCreatingFinalProduct}\n\n### {loc.EquityAndAccessibilityConsiderations}\n{value.EquityAndAccessibilityConsiderations}",
          "additionalProperties": false,
          "required": [
            "MaterialsEquipmentAndKeyResources",
            "TechnologyIntegration"
          ],
          "properties": {
            "MaterialsEquipmentAndKeyResources": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "ClassroomMaterialsAndEquipment",
                "LocalCommunityBasedResources",
                "DigitalToolsAndOnlineResources"
              ],
              "properties": {
                "ClassroomMaterialsAndEquipment": {
                  "type": "array",
                  "minItems": 6,
                  "items": {
                    "type": "string"
                  }
                },
                "LocalCommunityBasedResources": {
                  "type": "array",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "Location",
                      "HowStudentsEngage",
                      "WhyRelevant"
                    ],
                    "properties": {
                      "Location": {
                        "type": "string"
                      },
                      "HowStudentsEngage": {
                        "type": "string"
                      },
                      "WhyRelevant": {
                        "type": "string"
                      }
                    }
                  }
                },
                "DigitalToolsAndOnlineResources": {
                  "type": "array",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
              }
            },
            "TechnologyIntegration": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "TechnologyForResearchAndInformation",
                "TechnologyForModelingAndVisualRepresentation",
                "TechnologyForCollaborationAndDiscourse",
                "TechnologyForCreatingAndPresentingFinalProduct",
                "EquityAndAccessibilityConsiderations"
              ],
              "properties": {
                "TechnologyForResearchAndInformation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForModelingAndVisualRepresentation": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCollaborationAndDiscourse": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "TechnologyForCreatingAndPresentingFinalProduct": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "ToolName",
                      "HowStudentsUseIt",
                      "ConnectionToProject",
                      "ISTEStandard"
                    ],
                    "properties": {
                      "ToolName": {
                        "type": "string"
                      },
                      "HowStudentsUseIt": {
                        "type": "string"
                      },
                      "ConnectionToProject": {
                        "type": "string"
                      },
                      "ISTEStandard": {
                        "type": "string"
                      }
                    }
                  }
                },
                "EquityAndAccessibilityConsiderations": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    }
  },
  "x-removablePaths": {
    "AssessPriorKnowledge": [
      "UnitPlan.AssessPriorKnowledge"
    ],
    "FormativeAssessment": [
      "UnitPlan.AssessmentPlan.FormativeAssessmentTable"
    ],
    "StandardsAligned": [
      "UnitPlan.FramingTheLearning.KeyVocabulary.Tiers.Terms.StandardsConnection",
      "UnitPlan.DesiredOutcomes.StandardsAligned"
    ],
    "AccommodationsAndModifications": [
      "UnitPlan.TeacherGuidancePhase1.Phase1_Accommodations_IndividualSupport",
      "UnitPlan.TeacherGuidancePhase2.Phase2_Accommodations_IndividualSupport",
      "UnitPlan.TeacherGuidancePhase3.Phase3_Accommodations_IndividualSupport"
    ],
    "EssentialQuestions": [
      "UnitPlan.DesiredOutcomes.BigIdeasAndEssentialQuestions.EssentialQuestion"
    ],
    "SpacedLearningAndRetrieval": [
      "UnitPlan.TeacherGuidancePhase1.Phase1_SpacedRetrieval",
      "UnitPlan.TeacherGuidancePhase2.Phase2_SpacedRetrieval",
      "UnitPlan.TeacherGuidancePhase3.Phase3_SpacedRetrieval"
    ]
  }
},
};
