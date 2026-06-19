window.prompts_inquiry_es = {
  STEP0_PROMPT_TEMPLATE: `Crea SOLAMENTE el esquema de la unidad de INDAGACIÓN (Paso 0) usando la información de abajo. NO crees un plan de unidad completo y NO escribas planes de lección completos.

DEBES generar JSON válido que coincida exactamente con el esquema JSON proporcionado: UnitPlanResponse. No incluyas claves अतिरिक्त. Usa formato JSON compacto (sin líneas en blanco extra ni espacios en blanco entre propiedades JSON). Sin HTML. Sin emojis. Texto plano dentro de los campos de cadena.

Tema de la unidad: {{$Subject}}
Nombre de la unidad: {{$Name}}
Descripción/Instrucción de la unidad: {{$UserPrompt}}
Nivel de grado: {{$GradeLevel}}
Duración del período de clase en minutos: {{$ClassDuration}}
Número solicitado de lecciones: {{$NumberOfItems}}
Estándares a alinear (usa literalmente si están presentes; NO agregues estándares nuevos): {{$Standards}}
Estudiantes con apoyo individualizado (solo contexto): {{$LearningPlans}}
Recursos/medios a usar: {{$MediaContext}}
Contenido de la unidad: {{$AttachedUnit}}
Contenido de la lección adjunta (si lo hay): {{$AttachedLesson}}

REQUISITOS DEL ESQUEMA DE INDAGACIÓN:
- Esto es primero la indagación. Las lecciones DEBEN avanzar a través de este arco:
  (1) fenómeno/experiencia + observación/preguntas,
  (2) selección de preguntas + planificación de investigaciones,
  (3) recopilación de evidencias + búsqueda de patrones,
  (4) construcción de modelos + revisión usando evidencia,
  (5) explicación/argumento + comunicación + transferencia.
- Mantén la construcción de significado mediante el descubrimiento: los estudiantes construyen y revisan modelos usando observaciones y datos simples; enfatiza la evidencia, el razonamiento y la comunicación.
- Mantén la alineación SOLO con los estándares proporcionados. NO agregues estándares ni marcos nuevos.
- Relevancia cultural e inclusión: incluye breves contextos o perspectivas relevantes para la comunidad sin estereotipos.
- Intercalado y transferencia: retoma habilidades a lo largo de las lecciones (observar, modelar, argumentar con evidencia, comunicar).
- Las lecciones DEBEN no superponerse y tener límites claros.

RESTRICCIONES DEL ARREGLO DE LECCIONES:
- El arreglo de Lessons DEBE contener exactamente {{$NumberOfItems}} lecciones.
- lessonNumber es basado en 1 y estrictamente creciente de 1 en 1.
- Asegura una secuencia lógica desde movimientos de indagación fundamentales hasta modelado y explicación más complejos.
- La planificación debe encajar en períodos de clase de {{$ClassDuration}} minutos en el grado {{$GradeLevel}}.

REGLA DE SALIDA:
Devuelve SOLO JSON que valide contra el esquema UnitPlanResponse.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Crea UNA lección de indagación (NO un plan de unidad, NO múltiples lecciones) usando la información de abajo. DEBES generar JSON válido que coincida exactamente con el esquema JSON proporcionado: InquiryUnitPlanResponse. No incluyas claves adicionales. Usa formato JSON compacto (sin líneas en blanco extra ni espacios en blanco entre propiedades JSON). Sin HTML. Sin emojis. Sin markdown. Texto plano dentro de los campos de cadena.

Asignatura de la unidad: {{$Subject}}
Nombre de la unidad: {{$Name}}
Descripción/Instrucción de la unidad: {{$UserPrompt}}
Nivel de grado: {{$GradeLevel}}
Duración del período de clase en minutos: {{$ClassDuration}}
Estándares a alinear (usa literalmente si están presentes; NO agregues nuevos estándares): {{$Standards}}
Estudiantes con apoyo individualizado (DEBE usarse SOLO dentro de InvestigationPhase.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos): {{$LearningPlans}}
Recursos/medios a usar: {{$MediaContext}}
Contenido de la unidad: {{$AttachedUnit}}

Elementos de la unidad y la lección del Paso 0 (usar literalmente):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (exactamente como se proporciona; reutilízalas literalmente cuando sea relevante): {{$UnitEssentialQuestions}}

Contenido de la lección adjunta (si lo hay): {{$AttachedLesson}}

REQUISITOS DEL FLUJO DE LA LECCIÓN DE INDAGACIÓN:
- Esta lección debe seguir el arco de indagación y estar alineada con los límites del esquema de la lección: Orientación → Conceptualización → Investigación → Conclusión → Discusión.
- Mantén la construcción de significado mediante el descubrimiento: los estudiantes construyen y revisan ideas usando observaciones y datos simples; enfatiza la evidencia, el razonamiento y la comunicación.
- Relevancia cultural e inclusión: incluye contextos o perspectivas breves relevantes para la comunidad sin estereotipos.
- NO introduzcas conceptos nuevos importantes que pertenezcan a otras lecciones; mantente dentro del alcance y los límites del esquema de esta lección.
- Mantén la alineación SOLO con los estándares proporcionados. NO agregues estándares ni marcos nuevos.
- Las acciones del docente deben guiar el pensamiento sin dar explicaciones científicas directamente.

REGLAS ESPECÍFICAS DE CAMPOS (asignar al esquema):
- AssessPriorKnowledge: SOLO si el número de la lección es 1, escribe 150–250 palabras y sigue la estructura requerida en la descripción del esquema; de lo contrario, devuelve "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: incluye apoyos generales.
  - IndividualSupport: el arreglo debe incluir exactamente a los estudiantes proporcionados y sus planes (mismos nombres/planes; sin estudiantes extra; sin estudiantes faltantes).

REGLA DE SALIDA:
Devuelve SOLO JSON que valide contra el esquema InquiryUnitPlanResponse.

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
          "description": "Descripció de la unitat com un sol paràgraf cohesionat de text pla (4–5 oracions completes) escrit amb una veu natural de docent que podries dir directament als estudiants. Sense HTML, sense emojis, sense viñetes. Ha de fluir de manera conversacional però seguir aquesta estructura (sense encapçalaments): (1) oració ganxo que desperti curiositat o marqui un contrast sorprenent, (2) oració de 'En esta unitat, vosaltres...' sobre els resultats de domini, (3) oració de 'Fortalecerán sus habilidades en...' sobre les capacitats de pensament/anàlisi, (4) oració de 'Esto se conecta con...' sobre la rellevància en el món real, (5) oració de 'Entender esto importa porque...' sobre la importància més àmplia o l'impacte a llarg termini."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Crea preguntes essencials que se centrin només en conceptes amplis i universals com el canvi, l'evidència, els patrons, les relacions, els sistemes o el raonament. NO esmentis termes, processos, vocabulari o exemples específics del contingut. Les preguntes han de ser obertes, transferibles a totes les disciplines i impossibles de respondre aprenent la lliçó o el contingut de la unitat. Enfoca't només en les grans idees, no en el contingut temàtic.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Sección completa de 'Objectius d'aprenentatge de l'estudiant' per a tota aquesta unitat. Cada element de la llista ha de ser un objectiu clar i mesurable que comenci amb un verb mesurable i acabi amb una etiqueta DOK entre parèntesis",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Enumera tots els estàndards educatius únics usats en qualsevol part d'aquesta unitat i les seves lliçons. NO afegeixis estàndards que no apareguin en el contingut de la unitat. Cada estàndard ha d'incloure el codi i la descripció de l'estàndard, per exemple, 'MS-ESS1-1: Desenvolupar i usar un model del sistema Terra–Sol–Lluna per descriure els patrons cíclics de les fases lunars, eclipsi i estacions'.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Secció completa de 'Vocabulari clau' com una llista de cadenes. Cada cadena ha de ser un sol terme amb la seva definició separada per un guionet. Exemple: 'Gravetat - La força que atrau els objectes entre si'. Totes les definicions han de ser breus, apropiades per a l'edat i directament relacionades amb el contingut de la lliçó.",
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
      "description": "Llista de contenidors de lliçons per a aquesta unitat (només esquema). Cada element no s'ha de solapar i ha de tenir un abast clarament delimitat perquè el contingut de les lliçons no es repeteixi.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Número d'ordre d'una lliçó. Basat en 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Títol breu de la lliçó com a text pla."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 oracions que descriguin l'abast, l'enfocament i els límits de la lliçó per evitar solapament amb altres lliçons."
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
  "title": "InquiryUnitPlanResponse",
  "type": "object",
  "x-format": "{value.AssessPriorKnowledge}\n\n{value.EssentialQuestions}\n\n{value.KeyVocabulary}\n\n{value.StudentLearningObjectives}\n\n{value.StandardsAligned}\n\n{value.OrientationPhase}\n\n{value.ConceptualizationPhase}\n\n{value.InvestigationPhase}\n\n{value.ConclusionPhase}\n\n{value.DiscussionPhase}\n\n{value.ReviewAndSpacedRetrieval}\n\n{value.FormativeAssessment}\n\n{value.StudentPractice}",
  "properties": {
    "AssessPriorKnowledge": {
      "x-format": "### 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Secció d'Avaluar Coneixements Previs. NOMÉS la Lliçó 1 ha de contenir un bloc detallat; TOTES LES ALTRES LLIÇONS HAN DE RETORNAR NULL o Ometre aquest camp. Per a la Lliçó 1, l'estructura ha d'incloure ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt i AlternateOptions.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Instruccions clares i plantilla/estructura per a la modalitat triada. Per exemple: 'Digues: \"Antes de construir...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Respostes anticipades o conceptes erronis comuns per a la modalitat triada.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Pregunta de tancament del docent (NO incloguis el prefix 'Di:') que validi el pensament dels estudiants i anticipi la investigació de la unitat."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 opcions breus alternatives que un docent podria triar.",
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
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Enganxa literalment totes les preguntes essencials a nivell d'unitat en el mateix ordre si es van proporcionar. Si no, genera exactament 3 preguntes conceptuals que se centrin només en conceptes amplis i universals com el canvi, l'evidència, els patrons, les relacions, els sistemes o el raonament. NO esmentis termes, processos, vocabulari o exemples específics del contingut. Les preguntes han de ser obertes, transferibles a totes les disciplines i impossibles de respondre aprenent la lliçó o el contingut de la unitat. Enfoca't només en les grans idees, no en el contingut temàtic.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Selecciona textualment el vocabulari clau per a aquesta lliçó del vocabulari a nivell d'unitat proporcionat en l'avís. NO inventis paraules noves. Has de reutilitzar la redacció exacta de Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Selecciona textualment els objectius d'aprenentatge de l'estudiant específics per a aquesta lliçó dels objectius a nivell d'unitat proporcionats en l'avís. NO inventis objectius nous. Has de reutilitzar la redacció exacta de Step 0 UnitDescription.StudentLearningObjectives.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Enumera només els estàndards educatius únics abordats en aquesta lliçó específica. Cada estàndard ha d'incloure el codi i la descripció de l'estàndard i ha de ser exactament el mateix usat en la Unitat. per exemple, 'MS-ESS1-1: Desenvolupar i usar un model del sistema Terra–Sol–Lluna per descriure els patrons cíclics de les fases lunars, eclipsi i estacions.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "OrientationPhase": {
      "x-format": "### {green}({loc.OrientationPhase})\n\n{loc.OrientationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Llista de materials requerits (per exemple, suports visuals, marcadors, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "Engage": {
              "type": "object",
              "x-format": "**{loc.EngageTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guió per presentar el fenomen. Assegura't que se centri a despertar curiositat sense donar explicacions científiques."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Genera 2–3 movimientos pedagógicos específicos que guíen la observación silenciosa y la conversación en parejas. Incluye guiones (NO incluyas el prefijo 'Di:', por ejemplo, 'Tomen 30 segundos para mirar en silencio...'). Enfócate en capturar y organizar las observaciones de los estudiantes en categorías significativas y en fomentar múltiples perspectivas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Genera 2–3 indicaciones específicas como una sola cadena para ayudar a los estudiantes a identificar detalles, notar patrones y plantear curiosidades iniciales. Anima a los estudiantes a explicar por qué ciertos detalles parecen importantes y a construir sobre las observaciones de otros o contrastarlas."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "Connect": {
              "type": "object",
              "x-format": "**{loc.ConnectTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guion específico del docente (NO incluyas el prefijo 'Di:') que ayude a los estudiantes a convertir sus observaciones del fenómeno en preguntas o problemas de investigación mientras agrupan las ideas en temas clave."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Proporciona 2–3 indicaciones específicas para ayudar a los estudiantes a conectar las observaciones con desafíos subyacentes, justificar el pensamiento con evidencia y priorizar qué ideas vale más la pena investigar."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Sugiere 2–3 movimientos para apoyar a los estudiantes a refinar y agrupar sus ideas, mientras les pides que expliquen su razonamiento. Incluye instrucciones para registrar y resaltar preguntas recurrentes sin responderlas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Activate": {
              "type": "object",
              "x-format": "**{loc.ActivateTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Desarrolla una instrucción guiada por el docente (NO incluyas el prefijo 'Di:') para facilitar una discusión en parejas o grupos que genere ideas, explicaciones o soluciones específicas usando la información y las restricciones disponibles. Anima a comparar y razonar."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Enumera 2–3 indicaciones para animar a los estudiantes a proponer ideas, explicar su razonamiento, considerar enfoques alternativos y evaluar qué partes de su pensamiento son más fuertes o más inciertas."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Describe 2–3 movimientos de circulación para escuchar el razonamiento, pedir claridad/justificación y resaltar enfoques diversos sin evaluar cuál es correcto.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Probe": {
              "type": "object",
              "x-format": "**{loc.ProbeTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\n\n{value.Closing}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guion para impulsar a los estudiantes a refinar y probar sus ideas examinando supuestos, considerando diferentes condiciones e identificando factores clave de esta lección."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Sugiere 2–3 indicaciones específicas para probar ideas frente a nuevas condiciones, identificar debilidades y revisar el pensamiento usando evidencia para los fenómenos de esta lección."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Proporciona 2–3 movimientos específicos para animar a los estudiantes a revisar y corregir sus ideas iniciales a partir de la evidencia y justificar los cambios en su pensamiento.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Closing": {
                  "type": "string",
                  "description": "Una instrucción final para impulsar a los estudiantes a probar y revisar sus ideas, considerar efectos a largo plazo y condiciones cambiantes, y usar evidencia de las observaciones para fortalecer o desafiar su pensamiento."
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves",
                "Closing"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Engage",
            "Connect",
            "Activate",
            "Probe"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ConceptualizationPhase": {
      "x-format": "### {green}({loc.ConceptualizationPhase})\n\n{loc.ConceptualizationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista de materiales requeridos (por ejemplo, apoyos visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "GuideQuestionGeneration": {
              "type": "object",
              "x-format": "**{loc.GuideQuestionGenerationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guion del docente (NO incluyas el prefijo 'Di:') para presentar la sesión de lluvia de preguntas. Enfócate en pasar del trabajo individual al intercambio en parejas para ampliar las ideas."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Genera 2–3 movimientos específicos para apoyar la generación de preguntas por parte de los estudiantes. Incluye dar tiempo para pensar, registrar todas las preguntas públicamente y animar a refinar, combinar o ampliar preguntas sin evaluación juiciosa.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Genera 2–3 indicaciones específicas para ayudar a los estudiantes a hacer aflorar curiosidades, identificar qué quieren entender y centrarse en aspectos clave del sistema o diseño."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "IdentifyResearchQuestion": {
              "type": "object",
              "x-format": "**{loc.IdentifyResearchQuestionTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guion (NO incluyas el prefijo 'Di:') para guiar a los estudiantes en la selección de una pregunta que les ayude a aprender lo máximo de un modelo comprobable."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Sugiere 2–3 movimientos para guiar a los estudiantes a clasificar preguntas en temas y comparar ideas según su comprobabilidad. Incluye movimientos para apoyar a los estudiantes a refinar preguntas amplias en investigaciones claras identificando variables.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Genera 2–3 indicaciones para ayudar a los estudiantes a evaluar preguntas según su comprobabilidad, claridad, enfoque en variables y potencial para generar evidencia útil."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CreateAnActionPlan": {
              "type": "object",
              "x-format": "**{loc.CreateAnActionPlanTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crear un guion (no incluyas el prefijo 'Say:') para pedir a los estudiantes que definan qué observarán, qué cambiarán y qué recopilarán como evidencia."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Describe 2-3 acciones para apoyar a los estudiantes al diseñar un plan de investigación e identificar variables. Incluye acciones para presionar a los estudiantes a que hagan planes específicos y comprobables, y asegúrate de que tengan una manera clara de determinar el éxito.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Proporciona 2-3 indicaciones específicas para ayudar a los estudiantes a aclarar qué cambiarán, qué mantendrán igual y cómo compararán los resultados."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "GuideQuestionGeneration",
            "IdentifyResearchQuestion",
            "CreateAnActionPlan"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "InvestigationPhase": {
      "x-format": "### {green}({loc.InvestigationPhase})\n\n{loc.InvestigationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}\n\n{value.QuickCheck}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista de materiales requeridos (p. ej., ayudas visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "LaunchInvestigation": {
              "type": "object",
              "x-format": "**{loc.LaunchTheInvestigationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea instrucciones para el docente para presentar una situación o modelo desconcertante. Primero proporciona una acción entre corchetes como [Muestra un modelo, una situación, una demostración o una historia corta que incluya un defecto, una ineficiencia o un resultado inesperado para despertar la curiosidad], luego proporciona el guion conversacional (no incluyas el prefijo 'Say:')."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Genera 2-3 acciones para guiar el inicio. Expresa claramente las acciones instruccionales sin anteponerlas con 'Say:'. Incluye darles a los estudiantes tiempo para observar antes de actuar, fomentar múltiples interpretaciones y reforzar que puede haber varias ideas válidas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Genera 2-3 indicaciones específicas para ayudar a los estudiantes a notar características importantes o inesperadas, generar posibles explicaciones y justificar su pensamiento con evidencia."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CollaborationExpectations": {
              "type": "object",
              "x-format": "**{loc.CollaborationExpectationsTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Crea un guion oral (no incluyas el prefijo 'Say:') para enmarcar la tarea como interdependiente y enfatizar la responsabilidad compartida. Incluye instrucciones para que los estudiantes usen iniciadores de oraciones (p. ej., 'Creo... porque...') y estructuras de participación como fichas de conversación."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Enumera 3-5 acciones específicas o comportamientos de los estudiantes que se deben monitorear durante el trabajo en grupo (p. ej., identificar patrones, registrar en tablas de datos compartidas, comparar interpretaciones). No antepongas estas acciones con 'Say:'. Asegúrate de que se centren en que todos los estudiantes contribuyan a observar y refinar ideas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Proporciona 2-3 indicaciones para animar a los estudiantes a compartir observaciones, comparar interpretaciones, justificar afirmaciones con evidencia y revisar ideas de manera colaborativa."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CirculationPrompts": {
              "type": "object",
              "x-format": "**{loc.CirculationPromptsTitle}**\n\n**{loc.ConceptualPromptsTitle}**\n\n{value.Conceptual}\n\n**{loc.ReasoningPromptsTitle}**\n\n{value.Reasoning}\n\n**{loc.CollaborationPromptsTitle}**\n\n{value.Collaboration}",
              "description": "Indicaciones específicas para que use el docente mientras circula entre los grupos.",
              "properties": {
                "Conceptual": {
                  "type": "array",
                  "description": "2-3 indicaciones centradas en conceptos científicos o de la lección clave (p. ej., '¿Qué evidencia muestra que esto está funcionando?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Reasoning": {
                  "type": "array",
                  "description": "2-3 indicaciones para exigir justificación y lógica (p. ej., '¿Cómo cambia esta prueba tu forma de pensar?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Collaboration": {
                  "type": "array",
                  "description": "2-3 indicaciones para garantizar que todas las voces estén incluidas (p. ej., '¿Quién no ha contribuido todavía?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Conceptual",
                "Reasoning",
                "Collaboration"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "LaunchInvestigation",
            "CollaborationExpectations",
            "CirculationPrompts"
          ],
          "additionalProperties": false
        },
        "AnticipatedMisconceptions": {
          "type": "array",
          "x-format": "### ⚠️ {loc.AnticipatedMisconceptions}{items}",
          "description": "Genera 2-3 conceptos erróneos comunes de los estudiantes que probablemente surjan durante esta lección. Cada elemento debe centrarse en un malentendido específico y una respuesta del docente.",
          "items": {
            "type": "object",
            "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "Describe el concepto erróneo en 1 oración, comenzando con 'Los estudiantes pueden pensar...'. NO uses negritas ni etiquetas de énfasis."
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Un guion de respuesta claro dirigido al docente (que comience con 'Respuesta del docente: ') que modele cómo responder en el momento con una indicación específica (no incluyas el prefijo 'Say:'). NO uses negritas ni etiquetas de énfasis."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Differentiation": {
          "type": "object",
          "x-format": "### 🪜 {loc.Differentiation}\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "properties": {
            "LanguageLearners": {
              "type": "object",
              "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Genera 2-3 apoyos específicos para la lección (elementos visuales, bancos de palabras, gestos) para ayudar a los estudiantes multilingües a acceder y expresar ideas.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "SentenceStarters": {
                  "type": "array",
                  "description": "Genera 3-4 iniciadores de oraciones que ayuden a los estudiantes a describir, explicar y comunicar su pensamiento para esta lección específica.",
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
                  "description": "Genera 2-3 apoyos paso a paso (herramientas estructuradas, ejemplos modelados, pensar en voz alta) y orientación exacta para ayudar a los estudiantes a completar la tarea.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Checklist": {
                  "type": "array",
                  "description": "Genera 3-4 preguntas de lista de verificación para guiar a los estudiantes a dar sentido a su aprendizaje durante la investigación.",
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
                  "description": "Genera 2-3 extensiones que aumenten la complejidad (retos específicos, identificación de patrones) para ayudar a los estudiantes a profundizar o mejorar su pensamiento usando evidencia.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdvancedQuestion": {
                  "type": "string",
                  "description": "Genera una pregunta compleja (no incluyas el prefijo 'Say:') para exigir una comprensión conceptual más profunda."
                },
                "ExpectedResponses": {
                  "type": "array",
                  "description": "Genera 3-4 ejemplos específicos de respuestas estudiantiles de alta calidad a la pregunta avanzada.",
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
        "AccommodationsAndModifications": {
          "x-format": "### 🤝 {loc.AccommodationsAndModifications}\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
          "type": "object",
          "description": "Esta sección debe incluir dos tipos de apoyos: Apoyos Generales y Apoyos Individualizados. Céntrate en el acceso, no en reducir el rigor.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Estrategias no específicas para estudiantes que mejoran el acceso para todos los aprendices (p. ej., elementos visuales, notas parcialmente completadas, glosario digital, instrucciones fragmentadas). Proporciona 2-4 viñetas."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Acomodaciones y modificaciones específicas para estudiantes nombrados con planes formales. Enumera a CADA estudiante individualmente; no agrupar estudiantes. Los apoyos para cada estudiante deben ser una lista fácil de revisar rápidamente.",
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
                    "description": "El plan formal proporcionado para este estudiante en el enunciado. Analiza el plan en una lista clara. Puedes parafrasearlo para mejorar el formato, pero no omitas ni agregues ninguna información."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Herramientas/contenedores de oraciones/visualizaciones/organizadores concretos para esta tarea."
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
        "QuickCheck": {
          "type": "object",
          "x-format": "### ✔ {loc.QuickCheck}\n\n{value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Genera una pregunta específica (no incluyas el prefijo 'Say:') para comprobar la comprensión de los estudiantes durante o al final de la investigación."
            },
            "ExpectedResponses": {
              "type": "array",
              "description": "Genera 3-4 respuestas esperadas de los estudiantes que demuestren dominio del concepto de la lección.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Question",
            "ExpectedResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "AnticipatedMisconceptions",
        "Differentiation",
        "AccommodationsAndModifications",
        "QuickCheck"
      ],
      "additionalProperties": false
    },
    "ConclusionPhase": {
      "x-format": "### {green}({loc.ConclusionPhase})\n\n{loc.ConclusionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista de materiales requeridos (p. ej., ayudas visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}\n\n{value.WritingPrompt}\n\n{value.CollaborationInstruction}\n\n*{value.Guardrail}*",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Una declaración (no incluyas el prefijo 'Say:') para devolver a los estudiantes a la pregunta de investigación y hacer aflorar ideas emergentes sobre cómo funciona el diseño."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 acciones pedagógicas para dar a los estudiantes tiempo de revisar datos, identificar patrones y comparar resultados mediante la discusión.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 preguntas específicas para empujar a los estudiantes a explicar patrones, justificar decisiones con evidencia y describir relaciones de causa y efecto.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "WritingPrompt": {
              "type": "string",
              "description": "Una declaración (no incluyas el prefijo 'Say:') que describa lo que debe incluir su explicación escrita (componentes específicos del contenido) y un recordatorio para usar los datos como evidencia."
            },
            "CollaborationInstruction": {
              "type": "string",
              "description": "Instrucción para que los estudiantes escriban de manera independiente y luego compartan con un compañero o grupo para refinar su razonamiento."
            },
            "Guardrail": {
              "type": "string",
              "description": "Un recordatorio firme de que el docente NO debe proporcionar la explicación científica, sino más bien insistir en que los estudiantes señalen los datos."
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions",
            "WritingPrompt",
            "CollaborationInstruction",
            "Guardrail"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "3-4 respuestas que respondan directamente a la pregunta de investigación usando evidencia y razonamiento de causa y efecto (p. ej., 'cuando cambiamos ___, ___ ocurrió').",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "DiscussionPhase": {
      "x-format": "### {green}({loc.DiscussionPhase})\n\n{loc.DiscussionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n**🌍 {loc.TranscendentThinking}:**\n\n{value.TranscendentThinking}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista de materiales requeridos (p. ej., apoyos visuales, marcadores, etc.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "**{loc.Say}:** {value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Una declaración (NO incluyas el prefijo 'Say:') para invitar a los estudiantes a pensar en las implicaciones más amplias de su evidencia más allá del aula."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 acciones pedagógicas para animar a los estudiantes a conversar con parejas/grupos y generar sus propios ejemplos de impacto en el mundo real.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 preguntas específicas para conectar los resultados de la investigación con la vida cotidiana, los problemas de la comunidad o el rediseño de sistemas.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions"
          ],
          "additionalProperties": false
        },
        "TranscendentThinking": {
          "type": "object",
          "x-format": "{value.Question}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Genera 1 pregunta de pensamiento trascendente que requiera que los estudiantes apliquen lo aprendido más allá de sí mismos a contextos del mundo real (comunidades, desafíos globales). Enfócate en por qué aprender importa a gran escala (seguridad, sostenibilidad, innovación, etc.). Evita el enfoque personal o solo escolar."
            }
          },
          "required": [
            "Question"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "4-5 respuestas que ilustren cómo los estudiantes podrían aplicar su comprensión a contextos auténticos del mundo real o a la resolución de problemas orientada al futuro.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "TranscendentThinking",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Sección completa de 'Repaso y Recuperación Espaciada'. Esta actividad de 5 minutos debe incluir: 1. Instrucciones para el docente que contengan: - Indicador de Recuperación Activa usando intercambio con parejas/grupos - Respuestas esperadas de los estudiantes (2-3 ejemplos con viñetas) 2. Conexión con la Pregunta Esencial 3. Sección de Pensamiento Trascendente 4. Componente de Recuperación Espaciada que contenga: - Referencia clara a una lección previa específica - Pregunta que conecte conceptos pasados + actuales - Criterios de éxito / respuestas esperadas detalladas Todas las secciones deben proporcionar indicaciones directas para el docente sin el prefijo 'Say:' y tener claramente etiquetadas 'Respuestas Esperadas de los Estudiantes' mostrando 2-3 respuestas de ejemplo.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Notas para el docente que expliquen cómo esta estrategia de repaso fortalece la retención mediante la recuperación activa y conecta la investigación con las ideas científicas fundamentales."
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
          "description": "Orientación docente paso a paso para la sesión de repaso y recuperación espaciada de 5 minutos.",
          "properties": {
            "ActiveRecall": {
              "type": "object",
              "x-format": "### 🔁 {loc.ActiveRecall}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Pide a los estudiantes que recuperen el aprendizaje clave de la lección de hoy usando solo evidencia de la investigación.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Un guion específico para el docente (NO incluyas el prefijo 'Say:') que invite a los estudiantes a reflexionar sobre la investigación de hoy y lo que reveló sobre el sistema."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "3-4 ejemplos de respuestas estudiantiles de alta calidad que muestren un uso claro de la evidencia.",
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
            "EssentialQuestionConnection": {
              "type": "object",
              "x-format": "### 💭 {loc.EssentialQuestionConnection}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Ayuda a los estudiantes a conectar la evidencia específica de hoy con las preguntas esenciales más amplias de la unidad.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Un guion para el docente (NO incluyas el prefijo 'Say:') que conecte los hallazgos de hoy con una de las preguntas esenciales de la unidad."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 ejemplos de cómo los estudiantes justifican la conexión usando evidencia.",
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
            "SpacedRetrieval": {
              "type": "object",
              "x-format": "### ⏳ {loc.SpacedRetrieval}\n\n**{loc.Say}:** {value.TeacherSay}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Retoma un concepto de una unidad o lección anterior para fortalecer la retención acumulativa.",
              "properties": {
                "TeacherSay": {
                  "type": "string",
                  "description": "Un guion para el docente (NO incluyas el prefijo 'Say:') que conecte explícitamente un concepto de una lección previa con el trabajo de hoy. Debe incluir la metarreferencia (p. ej., '(Proviene de la Unidad 1, Lección 2.)') directamente en el texto."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "1-2 ejemplos de respuestas estudiantiles de alta calidad que muestren un recuerdo claro de la evidencia del aprendizaje previo.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "TeacherSay",
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
        }
      },
      "required": [
        "TeacherNotes",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {loc.FormativeAssessment}\n\n{items}",
      "type": "array",
      "description": "Exactamente 4 indicaciones de Evaluación Formativa, una para cada nivel de DOK.",
      "items": {
        "x-format": "\n\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "p. ej., 'Indicador 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "El texto exacto de la pregunta, p. ej., '¿Por qué los planetas permanecen en órbita en lugar de salir disparados al espacio?'"
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
      "x-format": "### 🖋️ {loc.StudentPractice}\n\n**{loc.TeacherNotes}:** {loc.StudentPracticeNotes}\n\n{value.Tasks}\n\n**🔎 {loc.Reflection}:**\n\n{value.Reflection}",
      "type": "object",
      "description": "Sección completa de 'Práctica del Estudiante' para tarea / práctica fuera del aula.",
      "properties": {
        "Tasks": {
          "type": "array",
          "description": "Genera 3 tareas que cubran los niveles DOK 2 y 3.",
          "items": {
            "type": "object",
            "x-format": "\n\n**{value.TaskTitle}**\n\n{value.Instruction}\n\n{value.SuccessCriteria}",
            "properties": {
              "TaskTitle": {
                "type": "string",
                "description": "p. ej., '1. (DOK 2)'"
              },
              "Instruction": {
                "type": "string",
                "description": "Instrucciones claras y paso a paso para que el estudiante realice la tarea."
              },
              "SuccessCriteria": {
                "type": "array",
                "description": "4-5 viñetas específicas, basadas en evidencia, que muestren cómo se ve el dominio para esta tarea. CRÍTICO: Cada criterio DEBE comenzar con un verbo de acción (p. ej., 'Describe', 'Explica', 'Usa').",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              }
            },
            "required": [
              "TaskTitle",
              "Instruction",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          }
        },
        "Reflection": {
          "type": "object",
          "description": "Termina con reflexiones de autorregulación o de pensamiento trascendente.",
          "properties": {
            "Instruction": {
              "type": "string",
              "description": "Instrucción para la sección de reflexión (p. ej., 'Escribe 2–3 oraciones respondiendo a una de las siguientes preguntas:')."
            },
            "Prompts": {
              "type": "array",
              "description": "4-5 indicaciones específicas de reflexión que conecten la investigación de hoy con la vida real, herramientas futuras o el aprendizaje personal.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Instruction",
            "Prompts"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Tasks",
        "Reflection"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "AssessPriorKnowledge",
    "EssentialQuestions",
    "KeyVocabulary",
    "StudentLearningObjectives",
    "StandardsAligned",
    "OrientationPhase",
    "ConceptualizationPhase",
    "InvestigationPhase",
    "ConclusionPhase",
    "DiscussionPhase",
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
    "SpacedLearningAndRetrieval": [
      "ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "InvestigationPhase.AccommodationsAndModifications"
    ]
  }
},
};
