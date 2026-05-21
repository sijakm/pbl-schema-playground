window.labPromptsES = {
  STEP0_PROMPT_TEMPLATE: `
Cree el esquema de la unidad y la estructura de la lección utilizando la información a continuación. NO escriba planes de lecciones completos.
                    
Basándose en la Materia de la unidad, los estándares educativos, la Descripción/Instrucción de la unidad, el Nivel de grado, la Duración del período de clase (minutos) y el Número solicitado de lecciones, genere una respuesta JSON que incluya una descripción de unidad (UnitDescription) cohesiva y una lista no superpuesta de "contenedores" de lecciones.

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
	
Estándares para alinear:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/Medios a utilizar:
{{$MediaContext}}
	
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos de las preguntas esenciales:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales o definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en contenido específico de la materia.
- Las preguntas DEBEN ser transferibles entre disciplinas y aplicables más allá de esta unidad.
- Las preguntas DEBEN ser reutilizadas textualmente en cada lección dentro de la unidad.

Qué generar:
- La salida DEBE ser un JSON válido que coincida con el esquema.
- OBLIGATORIO: Complete por completo todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escriba un párrafo de 4-5 oraciones que describa el enfoque central de la unidad y su viaje narrativo.
  - "StudentLearningObjectives": Enumere de 3 a 5 objetivos clave de aprendizaje medibles para la unidad.
  - "StandardsAligned": Enumere todos los estándares que se abordan a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales siguiendo las reglas anteriores.
- GENERE la lista "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice basado en 1), "lessonName" y "lessonDescription" (2–4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantenga la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegure una secuencia lógica desde las ideas fundamentales hasta el modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente preciso y adecuado para la edad.

La salida DEBE ser un JSON válido que coincida con el esquema. Utilice un formato compacto (sin líneas en blanco adicionales).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Cree UN plan de lección de LABORATORIO (NO un plan de unidad, NO varias lecciones) utilizando la información a continuación.
DEBE generar un JSON válido que coincida exactamente con el esquema JSON proporcionado. No incluya claves adicionales. Utilice un formato JSON compacto (sin líneas en blanco adicionales).
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
Recursos/Medios a utilizar: 
{{$MediaContext}}
Contenido de la unidad: 
{{$ParentUnitData}}
Estándares para alinear:
{{$Standards}}
Contenido de la lección adjunto: 
{{$AttachedLesson}}

Preguntas esenciales de la unidad (UTILICE ESTAS TEXTUALMENTE):
{{$UnitEssentialQuestions}}

Si las Preguntas esenciales de la unidad anteriores están vacías, genere exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "Cómo" o "Por qué".
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales o definicionales.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en contenido específico de la materia.
- Las preguntas DEBEN ser transferibles entre disciplinas y aplicables más allá de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBEN usarse ÚNICAMENTE dentro de Experiment.AccommodationsAndModifications; use los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS DE CONTENIDO IMPORTANTES:
- Mantenga la lección alineada con el enfoque de la unidad: desarrollar y utilizar modelos para describir la composición atómica de moléculas simples y/o estructuras extendidas.
- Incluya conexiones breves y de alto nivel con otras DCI relevantes cuando sea apropiado, pero mantenga la lección centrada en el modelado y el razonamiento de estructura-propiedad (sin matemáticas profundas, sin balanceo de ecuaciones a menos que los estándares lo requieran explícitamente).
- Asegúrese de que todas las partes de la lección reflejen el Alcance/Límites de la lección proporcionados en el contexto de la unidad; evite introducir nuevos conceptos principales que pertenezcan a otras lecciones.
- EssentialQuestions: DEBE ser exactamente igual a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: SOLO si LessonNumber == 1, escriba entre 150 y 250 palabras y siga la estructura requerida en la descripción del esquema. Si LessonNumber != 1, devuelva "" (cadena vacía).
- Fases de laboratorio (Question, Research, Hypothesize, Experiment, Analyze, Share): Siga los requisitos de instrucción específicos y las cadenas "Purpose:" para cada fase según se define en el esquema JSON.
- Experiment.AccommodationsAndModifications debe incluir apoyos generales seguidos de apoyo individual para cada estudiante proporcionado en {{$LearningPlans}}.
- StudentPractice DEBE incluir un párrafo de TeacherNotes que comience con 'These tasks reinforce today’s learning about ____ by ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, y entrelazado si la materia es matemáticas.

REQUISITOS DE SALIDA:
- La salida DEBE ser un JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser un SOLO plan de lección.
- Sin HTML. Sin emojis. Sin markdown. Texto sin formato dentro de los campos de cadena.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Recibirá UN objeto JSON que sigue estrictamente el esquema LabUnitPlanResponse. Su trabajo es transformar este JSON en HTML limpio y legible para una sola lección.

FORMATO DE ENTRADA
Le enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trate todo lo que está después de la línea “UNIT PLAN JSON:” como el objeto JSON exacto. NO lo explique ni lo comente; simplemente analícelo y renderícelo.

REGLAS GLOBALES
    - Genere ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, <h4>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO utilice ninguna otra etiqueta (sin <main>, <section>, <header>, <div>, <h5>, etc.).
    - El HTML debe estar bien sangrado y ser fácil de leer.
    - En cualquier <ol> or <ul>, use ÚNICAMENTE elementos <li> como hijos directos. Nunca coloque <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    - NO invente nuevo contenido educativo; use solo lo que existe en los campos JSON.
    - Preserve el orden lógico implícito en el esquema:
    - Dentro de cada lección, siga el orden de campos del esquema.
    - Si un campo de cadena está vacío (""), OMITA esa subsección y su etiqueta.
    - Si una matriz está vacía, omita su encabezado y la <ul> o <ol> correspondiente.
    - Cuando el texto claramente forme una lista de consignas/preguntas/declaraciones/respuestas, use <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, use <p>.
    - Siempre que renderice respuestas del estudiante modelo/esperadas en CUALQUIER sección, use este patrón:
        - Primero: <p>✅ Respuestas esperadas de los estudiantes</p> (sin viñetas en esta línea)
        - Luego una lista <ul> o <ol> que contenga las respuestas (una respuesta por <li>).
    - Siempre que renderice una Comprobación rápida:
        - Use este encabezado exacto: <p><strong>✔Comprobación rápida</strong></p>
        - Renderice la pregunta o tarea inmediatamente después del encabezado como un párrafo que requiera que CADA estudiante demuestre su comprensión (no solo un estudiante en una verificación verbal).
        - Use el patrón global de ✅Respuestas esperadas de los estudiantes para las respuestas.
    - Use emojis si existen en las siguientes reglas de asignación.

REGLAS DE ASIGNACIÓN:

- <h3>💭 Preguntas esenciales</h3> (si están disponibles, lista UL de EssentialQuestions)
- <h3>🎯 Objetivos de aprendizaje del estudiante</h3> (lista UL de StudentLearningObjectives)
- <h3>📏 Estándares alineados</h3> (lista UL o párrafos de StandardsAligned)
- <h3>🔤 Vocabulario clave</h3>
<ul>
  - Renderice cada elemento de KeyVocabulary como un <li>.
</ul>

EVALUACIÓN DE CONOCIMIENTOS PREVIOS:
- Comience con este encabezado exacto:
<h3>💡 Evaluar conocimientos previos</h3>
- Inmediatamente después del encabezado, SIEMPRE renderice este texto de Propósito exactamente como está escrito:
<p><strong>Propósito:</strong> Activar los conocimientos previos de los estudiantes no es solo un calentamiento; es neurociencia en acción. Cuando los estudiantes recuerdan lo que ya creen o recuerdan sobre materiales, partículas o cambios químicos, activan las vías neuronales existentes. Esta "codificación elaborativa" facilita que el cerebro conecte nuevos conceptos de química con lo que ya se conoce, fortaleciendo la retención a largo plazo. Esta actividad le ayuda a descubrir ideas precisas, ideas parciales y conceptos erróneos que se convertirán en poderosos anclajes para el aprendizaje a lo largo del proyecto.</p>
- Renderice una sección "Diga:" dirigida al docente.
- Incluso si el texto de entrada NO contiene explícitamente "Say:" o "Diga:"
- Sintetice o refrasee el contenido existente en 1-2 párrafos claros de discurso del docente
- Comience con:
<p><strong>Diga:</strong></p>
- Siga con uno o más elementos <p>
- Cualquier tarea, consigna, declaración o instrucción para el estudiante:
- Renderice como <ol> o <ul>
- Cada elemento DEBE ser un solo <li>
- SIN <p> u otras etiquetas dentro de <li>
- Cuando aparezcan respuestas del estudiante esperadas o modelo:
- Renderice esta etiqueta EXACTA:
<p>✅ Respuestas esperadas de los estudiantes</p>
- Luego renderice todas las respuestas esperadas como un <ul> con <li> únicamente
- SIN listas anidadas
- SIN <p> dentro de <li>
- Si aparecen opciones alternativas o variaciones:
- Renderice:
<p><strong>Opciones alternativas:</strong></p>
- Luego un <ul> con elementos <li> breves

NO:
- Use etiquetas que no estén en la lista
- Anide listas
- Omita la sección de Propósito
- Invente nuevo contenido educativo, pero use todas las ideas proporcionadas


- <h3><span style="color: rgb(115, 191, 39);">Pregunta</span> (5 min)</h3>
El propósito debe ser palabra por palabra como en el JSON
  - <p><strong>Propósito:</strong> {Purpose}</p>
  luego renderice (con emojis si están disponibles en las etiquetas html)
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Respuestas esperadas de los estudiantes</strong></p> <ul>{ExpectedStudentResponses}</ul>
  - <p><strong>Pregunta final de investigación:</strong> {FinalInvestigationQuestion}</p>

- <h3><span style="color: rgb(115, 191, 39);">Istraživanje (5 min)</span></h3>
  - <p><strong>Propósito:</strong> {Purpose}</p>
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>
  - <h4>❗️ Conceptos erróneos anticipados</h4> (Itere AnticipatedMisconceptions: <p><strong>Concepto erróneo:</strong> {Misconception}</p> <p><strong>Respuesta del docente:</strong> {TeacherResponse}</p>)

- <h3><span style="color: rgb(115, 191, 39);">Hipótesis (5 min)</span></h3>
  - <p><strong>Propósito:</strong> {Purpose}</p>
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>
  - <p>✅ <strong>Respuestas esperadas de los estudiantes</strong></p> <ul>{ExpectedStudentResponses}</ul>

- <h3><span style="color: rgb(115, 191, 39);">Experimento (20 min)</span></h3>
  - <p><strong>Propósito:</strong> {Purpose}</p>
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>
  - <h4>✅ Comprobación rápida</h4> <p>{QuickCheck}</p>
  - <h4>🪜 Diferenciación</h4> <p>{Differentiation}</p>
  - <h4>🤝 Adaptaciones y modificaciones</h4> <p>{AccommodationsAndModifications}</p>

- <h3><span style="color: rgb(115, 191, 39);">Análisis (5 min)</span></h3>
  - <p><strong>Propósito:</strong> {Purpose}</p>
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>

- <h3><span style="color: rgb(115, 191, 39);">Compartir (5 min)</span></h3>
  - <p><strong>Propósito:</strong> {Purpose}</p>
  - <h4>📚 Materiales</h4> <ul>{Materials}</ul>
  - <h4>📋 Instrucciones para docentes</h4> <p>{InstructionsForTeachers}</p>

SECCIONES DE CIERRE:
- <h3>⏳ Repaso y recuperación espaciada (5 min)</h3>
  - (Formatee el texto de ReviewAndSpacedRetrieval asegurándose de que los encabezados como Notas para el docente, Recuperación activa, Conceptos erróneos, Pensamiento trascendente estén en negrita y sean fácilmente legibles)
- <h3>✅ Evaluación formativa</h3>
  - (Formatee el texto de FormativeAssessment, separando las preguntas y las respuestas esperadas claramente)
- <h3>🖊 Práctica del estudiante</h3>
  - (Formatee el texto de StudentPractice asegurándose de que los elementos y las respuestas esperadas estén estructurados limpiamente)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Recibirá UN objeto JSON que sigue estrictamente el esquema UnitPlanResponse (ya validado de mi parte). Su trabajo es transformar este JSON en HTML limpio y legible que un docente pueda usar directamente en clase.
                   
FORMATO DE ENTRADA
Le enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trate todo lo que está después de la línea “UNIT PLAN JSON:” como el objeto JSON exacto. NO lo explique ni lo comente; simplemente analícelo y renderícelo.

REGLAS GLOBALES
    - Genere ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, <h4>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO utilice ninguna otra etiqueta (sin <main>, <section>, <header>, <div>, <h5>, etc.).
    - El HTML debe estar bien sangrado y ser fácil de leer.
    - En cualquier <ol> o <ul>, use ÚNICAMENTE elementos <li> como hijos directos. Nunca coloque <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    - NO invente nuevo contenido educativo; use solo lo que existe en los campos JSON.
    - Preserve el orden lógico implícito en el esquema.

- En la parte superior:
    - <h2><strong>{{{UnitTitle}}}</strong></h2>
    - <p>{{{UnitDescription.Description}}}</p>
- Luego agregue una nueva línea con:
    <h3><span>Resumen de la unidad</span></h3>

- Preguntas esenciales:
    - <h3><span>💭 Preguntas esenciales</span></h3>
    - <ul> con cada elemento de UnitDescription.EssentialQuestions como <li>.

- Objetivos de aprendizaje del estudiante:
    - <h3><span>🎯 Objetivos de aprendizaje del estudiante</span></h3>
    - <ul> con cada elemento de UnitDescription.StudentLearningObjectives como <li>.

- Estándares:
    - <h3><span>📏 Estándares alineados</span></h3>
    - <ul> con cada cadena de UnitDescription.StandardsAligned como <li>.

- Vocabulario clave:
    - <h3><span>🔤 Vocabulario clave</span></h3>
    - <ul> con cada cadena de UnitDescription.KeyVocabulary como <li>.`,

  STEP0_SCHEMA: {
    "title": "UnitPlanResponse",
    "type": "object",
    "properties": {
      "UnitDescription": {
        "type": "object",
        "properties": {
          "Description": {
            "type": "string",
            "description": "Descripción de la unidad como un único párrafo coherente de texto sin formato (4-5 oraciones completas) escrito con una voz docente natural que se pueda decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional pero siguiendo esta estructura (sin encabezados): (1) oración gancho que despierte la curiosidad o cree un contraste sorprendente, (2) oración 'En esta unidad, usted...' sobre los resultados de aprendizaje, (3) oración 'Usted fortalecerá sus habilidades en...' sobre las capacidades de pensamiento/análisis, (4) oración 'Esto se conecta con...' sobre la relevancia en el mundo real, (5) oración 'Comprender esto es importante porque...' sobre el significado más amplio o el impacto a largo plazo."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Cree preguntas esenciales que se centren únicamente en conceptos universales amplios como el cambio, las pruebas, los patrones, las relaciones, los sistemas o el razonamiento. NO mencione ningún término, proceso, vocabulario o ejemplo específico de la materia. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder solo con el aprendizaje del contenido de la lección o la unidad. Céntrese únicamente en las grandes ideas, no en el tema en cuestión.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' para toda esta unidad. Cada elemento de la lista debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Enumere todos los estándares educativos únicos utilizados en cualquier parte de esta unidad y sus lecciones. NO agregue estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, por ejemplo, 'MS-ESS1-1: Desarrollar y utilizar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Sección completa de 'Vocabulario clave' como una lista de cadenas. Cada cadena debe ser un término único con una definición separada por un guion. Ejemplo: 'Gravedad - La fuerza que atrae a los objetos entre sí'. Todas las definiciones deben ser cortas, adecuadas para la edad y estar directamente relacionadas con el contenido de la lección.",
            "items": {
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
        "type": "array",
        "description": "Lista de contenedores de lecciones para esta unidad (solo esquema). Cada elemento debe ser no superpuesto y estar claramente delimitado para que el contenido de la lección no se repita en otras lecciones.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Número de orden de la lección. Basado en 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Título corto de la lección como texto sin formato."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2-4 oraciones que describan el alcance de la lección, el enfoque y los límites para evitar la superposición con otras lecciones."
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
        "type": "array",
        "description": "Simplemente pegue todas las preguntas esenciales de nivel de unidad en el mismo orden.",
        "items": {
          "type": "string"
        }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' como texto sin formato. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis, p. ej. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
        "minItems": 2,
        "maxItems": 3,
        "items": {
          "type": "string"
        }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Sección completa de 'Estándares alineados' como texto sin formato para esta lección. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos utilizados en la Unidad. p. ej. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'"
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Seleccione textualmente el vocabulario clave para esta lección a partir del vocabulario a nivel de unidad proporcionado en la consigna. NO invente nuevas palabras. Debe reutilizar la redacción exacta de Step 0 UnitDescription.KeyVocabulary.",
        "items": { "type": "string" }
      },
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Sección completa de 'Evaluar conocimientos previos' como texto sin formato (150-250 palabras en total). SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER una CADENA VACÍA para este campo. Para la Lección 1, la estructura debe incluir: 1. Incluya esta sección solo en la primera lección de la unidad, ubicada inmediatamente después de los Objetivos de aprendizaje del estudiante. 2. Asegúrese de que se utilicen consignas de nivel DOK 1-3. 3. Incluya las habilidades previas necesarias para los objetivos de aprendizaje del estudiante. 4. Elija una modalidad de esta lista y desarróllela completamente: cuestionamiento, S-Q-A, elementos visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, clasificaciones de vocabulario. 5. Consigna inicial del docente con la declaración 'Diga:' que introduzca la modalidad elegida y explique cómo los estudiantes sacarán a la luz su comprensión actual. 6. Instrucciones claras y plantilla/estructura para la modalidad elegida. 7. Sección de 'Respuestas esperadas de los estudiantes' que muestre las respuestas anticipadas o las ideas erróneas comunes para la modalidad elegida. 8. Consigna final del docente 'Diga:' que valide el pensamiento de los estudiantes y anticipe la investigación de la unidad. 9. Después de desarrollar completamente una modalidad, proporcione 2 opciones alternativas breves que un docente pueda elegir."
      },
      "Question": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes observen un fenómeno, identifiquen algo sorprendente y generen una pregunta significativa que guíe la investigación.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra - Purpose: Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation."
          },
          "Materials": {
            "type": "array",
            "description": "Lista de materiales requeridos (por ejemplo, ayudas visuales, marcadores, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones paso a paso para el docente, acciones y consignas 'Diga:' para presentar un fenómeno e invitar a hacer preguntas."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 preguntas o ideas esperadas de los estudiantes sobre el fenómeno."
              },
              "FinalInvestigationQuestion": {
                "type": "string",
                "description": "La consigna final del docente que sintetiza las ideas de los estudiantes en una gran pregunta para investigar hoy."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses", "FinalInvestigationQuestion"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Research": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes adquieran información de contexto, vocabulario y conocimientos previos necesarios para comprender el tema.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
          },
          "Materials": {
            "type": "array",
            "description": "Lista de materiales requeridos (por ejemplo, ayudas visuales, marcadores, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones paso a paso para el docente, acciones y consignas 'Diga:' para explicar los conocimientos previos, el vocabulario y modelar el fenómeno."
              },
              "AnticipatedMisconceptions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string", "description": "Concepto erróneo del estudiante" },
                    "TeacherResponse": { "type": "string", "description": "Qué debe decir el docente para corregirlo" }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              }
            },
            "required": ["Instructions", "AnticipatedMisconceptions"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Hypothesize": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes desarrollen una predicción comprobable.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones del docente, incluidas las consignas 'Diga:' para los marcos de oraciones de hipótesis."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "3-4 ejemplos de hipótesis esperadas."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Experiment": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes lleven a cabo una investigación estructurada.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones paso a paso para el docente para organizar el experimento, dar instrucciones y circular por la clase."
              },
              "QuickCheck": {
                "type": "object",
                "properties": {
                  "Question": { "type": "string" },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "AdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": { "type": "array", "items": { "type": "string" } },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Para respuestas de Profundizar." }
                },
                "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" } },
                  "IndividualSupports": { "type": "array", "items": { "type": "string" } }
                },
                "required": ["GeneralSupports", "IndividualSupports"],
                "additionalProperties": false
              }
            },
            "required": ["Instructions", "QuickCheck", "Differentiation", "AccommodationsAndModifications"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Analyze": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes interpreten los datos recopilados.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Purpose: Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions."
          },
          "Materials": {
            "type": "array",
            "description": "Lista de materiales requeridos (por ejemplo, ayudas visuales, marcadores, etc.)",
            "items": {
              "type": "string"
            }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones del docente y marcos de inicio de oraciones para el análisis."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Respuestas esperadas o completados de marcos de oraciones de los estudiantes."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Share": {
        "type": "object",
        "description": "Guíe al docente para que los estudiantes comuniquen sus hallazgos claramente.",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
          },
          "Materials": {
            "type": "array",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Instructions": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Instrucciones del docente para organizar el intercambio entre los estudiantes."
              },
              "ExpectedStudentResponses": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Ideas esperadas compartidas por los estudiantes."
              }
            },
            "required": ["Instructions", "ExpectedStudentResponses"],
            "additionalProperties": false
          }
        },
        "required": ["Purpose", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "string",
        "description": "Sección completa de 'Repaso y recuperación espaciada' como texto sin formato. Esta actividad de 5 minutos debe incluir en este orden exacto: 1. Párrafo de Notas para el docente que explique: - Cómo esta estrategia de repaso mejora la retención - Conexión con conceptos de aprendizaje previos - Cómo la reflexión trascendente profundiza la comprensión 2. Instrucciones para docentes que contengan: - Pregunta de recuperación activa utilizando el intercambio en parejas/grupos - Respuestas esperadas de los estudiantes (2-3 ejemplos en viñetas) 3. Bloque de Conceptos erróneos anticipados con: - Declaraciones de conceptos erróneos de muestra - Guiones de respuesta del docente para abordar cada uno 4. Conexión con la pregunta esencial que incluya: - Consigna del docente que conecte con la pregunta de la unidad - Respuestas esperadas de los estudiantes (2-3 ejemplos) 5. Sección de Pensamiento trascendente con: - Pregunta de aplicación en el mundo real - Instrucción de tiempo para pensar - Respuestas esperadas de los estudiantes (2-3 ejemplos) 6. Componente de Recuperación espaciada que contenga: Referencia clara a una lección previa específica. Ejemplo: (Draws from Unit 3, Lesson 2). Debe usar una pregunta de recuperación activa que conecte conceptos pasados y actuales. No debe requerir que los estudiantes usen notas o recursos para responder. - Criterios de éxito detallados / respuestas esperadas. Todas las secciones deben usar declaraciones 'Diga:' para las consignas del docente y etiquetas claras 'Expected Student Responses' o 'Respuestas esperadas de los estudiantes' que muestren 2-3 respuestas de muestra. Devolver como texto sin formato."
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Sección completa de 'Evaluación formativa' como texto sin formato. Debe seguir esta estructura: Un párrafo de introducción dirigido al docente que indique brevemente el propósito y cómo implementarlo. 4 consignas de preguntas requeridas etiquetadas como 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', etc., que cubran los niveles DOK 1-4. Para cada consigna: - Pregunta que evalúe la comprensión al nivel DOK indicado - Encabezado 'Expected Student Responses' o 'Respuestas esperadas de los estudiantes' (sin marcas de verificación/emojis) - 1-2 respuestas en oraciones completas que muestren el dominio. Termine con un párrafo corto que nombre una estrategia de evaluación formativa específica para usar (por ejemplo, 'Exit Ticket', 'Think-Pair-Share'). Ejemplo de formato: Prompt 1 (DOK 1): 'Why do planets stay in orbit instead of flying off into space?' Expected Student Responses 'Because their forward motion and the Sun's gravity work together to create a stable orbit.' [Continúe con los Prompts 2-4 siguiendo la misma estructura]"
      },
      "StudentPractice": {
        "type": "string",
        "description": "Sección completa de 'Práctica del estudiante' como texto sin formato. Esto es tarea / práctica fuera de clase. Siga este formato EXACTO para la respuesta: Teacher Notes: [1 párrafo que explique cómo la práctica refuerza el aprendizaje + construye conexiones con el mundo real] 1. (DOK 2) [Primer conjunto de instrucciones] Expected Student Responses [3-4 viñetas que muestren dominio] 2. (DOK 3) [Segundo conjunto de instrucciones] ✅Expected Student Responses [3-4 viñetas que muestren análisis/aplicación] 3. (DOK 3) [Tercer conjunto de instrucciones] Expected Student Responses [3-4 viñetas que muestren síntesis/evaluación] Reflection: Termine con una reflexión de autorregulación o pensamiento trascendente, como: 'What evidence of today's science concept can you find in your home or neighborhood?', 'How does what you learned today help you see the world differently?', 'What challenges did you face doing this at home, and how did you overcome them?', o 'How might this concept impact our community or future discoveries?'"
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
    "additionalProperties": false
  }
};
