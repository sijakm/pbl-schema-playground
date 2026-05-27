window.labPromptsES = {
  STEP0_PROMPT_TEMPLATE: `
Cree el esquema de la unidad y la estructura de la lección utilizando la información a continuación. NO escriba planes de lecciones completos.
                    
Basándose en la Materia de la unidad (Unit Subject), los estándares educativos, la Descripción/Instrucción de la unidad (Unit Description/Instruction), el Nivel de grado (Grade Level), la Duración del período de clase en minutos (Duration of class period) y el Número solicitado de lecciones (Number of Lessons), genere una respuesta JSON que incluya una descripción de unidad (UnitDescription) cohesiva y una lista no superpuesta de "contenedores" de lecciones.

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

Requisitos de las preguntas esenciales (Essential Questions):
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
Cree UN plan de lección de CONFERENCIA/LECTURA (NO un plan de unidad, NO varias lecciones) utilizando la información a continuación.
DEBE generar un JSON válido que coincida exactamente con el esquema JSON proporcionado. No incluya claves adicionales. Utilice un formato JSON compacto (sin líneas en blanco adicionales).
Materia de la unidad: 
{{$Subject}}
Nombre de la unidad: 
{{$Name}}
Descripción/Instrucción de la unidad: 
{{$UserPrompt}}
Nivel de grado: 
{{$GradeLevel}}
Duración del período de clase en minutos 
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
- AssessPriorKnowledge: SOLO si LessonNumber == 1, complete el objeto como se define en el esquema. Para TODAS LAS DEMÁS LECCIONES, DEBE devolver un objeto vacío {} sin claves adentro. NO use marcadores de posición como "N/A", "ninguno" o matrices vacías.
- Fases de laboratorio (Question, Research, Hypothesize, Experiment, Analyze, Share): Siga los requisitos de instrucción específicos y las cadenas "Purpose:" para cada fase según se define en el esquema JSON.
- Experiment.AccommodationsAndModifications debe incluir apoyos generales seguidos de apoyo individual para cada estudiante proporcionado en {{$LearningPlans}}.
- Cuando sugiera "marcos de oraciones" (sentence frames) o "inicios de oraciones" (sentence starters) en cualquier parte del plan de lección (especialmente en Individualized Supports), DEBE proporcionar las oraciones completas y específicas adaptadas al contenido de la lección para que el docente pueda utilizarlas directamente.
- StudentPractice DEBE incluir un párrafo de TeacherNotes que comience con 'These tasks reinforce today’s learning about ____ by ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, y entrelazado (interleaving) si la materia es matemáticas.

REQUISITOS DE SALIDA:
- La salida DEBE ser un JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser un SOLO plan de lección.
- Sin HTML. Sin emojis. Sin markdown. Texto sin formato dentro de los campos de cadena.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `Recibirás UN objeto JSON que sigue estrictamente el esquema LabUnitPlanResponse. Tu trabajo es transformar este JSON en HTML limpio y legible para una sola lección.

FORMATO DE ENTRADA
Te enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trata todo lo que está después de la línea “UNIT PLAN JSON:” como el objeto JSON exacto. NO lo expliques ni lo comentes; simplemente analízalo y renderízalo.

REGLAS GLOBALES
    - Genera ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, 
    - (envuelto dentro de <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO utilices ninguna otra etiqueta (sin <main>, <section>, <header>, <div>, <h4>, etc.).
    - El HTML debe estar bien sangrado y ser fácil de leer.
    - En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca coloques <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    - NO inventes nuevo contenido educativo; usa solo lo que existe en los campos JSON.
    - Preserva el orden lógico implícito en el esquema:
    - Dentro de cada lección, sigue el orden de campos del esquema.
    - Si un campo de cadena está vacío (""), OMITA esa subsección y su etiqueta.
    - Si una matriz está vacía, omite su encabezado y la <ul> o <ol> correspondiente.
    - Cuando el texto claramente forme una lista de consignas/preguntas/declaraciones/respuestas, use <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, use <p>.
    - Siempre que renderices respuestas del estudiante modelo/esperadas en CUALQUIER sección, use este patrón:
        - Primero: <p>✅ Respuestas esperadas de los estudiantes</p> (sin viñetas en esta línea)
        - Luego una lista <ul> o <ol> que contenga las respuestas (una respuesta por <li>).
    - Siempre que renderices una Comprobación rápida:
        - Usa este encabezado exacto: <h3><span>✔ Comprobación rápida</span></h3>
        - Incluye la alineación de la estrategia y luego la pregunta/tarea entre comillas.
        - Usa el patrón global de ✅Respuestas esperadas de los estudiantes para las respuestas.
    - Usa emojis si existen en las siguientes reglas de asignación.

REGLAS DE ASIGNACIÓN:

PRIMERO, genera siempre estas 4 secciones introductorias si los datos están disponibles en el JSON:
- <h3>💭 Preguntas esenciales</h3> (si está disponible, lista UL de EssentialQuestions)
- <h3>🔤 Vocabulario clave</h3> (lista UL de KeyVocabulary)
- <h3>🎯 Objetivos de aprendizaje del estudiante</h3> (lista UL de StudentLearningObjectives)
- <h3>📏 Estándares alineados</h3> (lista UL de StandardsAligned. Aunque la entrada sea una sola cadena, analiza los estándares y renderízalos como una lista con viñetas <ul><li>...</li></ul>)

LUEGO, procede a la SECCIÓN 0:

SECCIÓN 0: EVALUAR CONOCIMIENTOS PREVIOS (CONDICIONAL)
==================================================
CONDICIÓN: Renderice esta sección SOLO si la lección actual es la Lección 1. Para todas las demás lecciones, omita esta sección completa (no renderice NADA, ni siquiera encabezados).

VERIFICACIÓN CRÍTICA: Antes de renderizar cualquier HTML para esta sección, mire el objeto AssessPriorKnowledge.
- Si AssessPriorKnowledge es {} (objeto vacío), O si SayIntroduction es "", null, " " o "N/A", OMITA ESTA SECCIÓN Y PROCEDA A LA SIGUIENTE. NO detenga la generación general.
- Para todas las demás lecciones (Lección 2, 3, etc.), DEBE omitir esta sección completa independientemente de su contenido.

SI (y solo si) la lección actual es la Lección 1 Y AssessPriorKnowledge contiene contenido real:
<h3>💡 Evaluar conocimientos previos</h3>
<p><strong>Nota para el profesor:</strong> Activar los conocimientos previos de los estudiantes no es solo un calentamiento, es neurociencia en acción. Este proceso activa las vías neurales existentes, facilitando que el cerebro vincule la nueva información con lo que ya se conoce. Esta técnica, llamada codificación elaborativa, ayuda a los estudiantes a trasladar el conocimiento a la memoria a largo plazo de manera más rápida y efectiva, mejorando tanto la comprensión como la retención.</p>
  - <p><strong>Decir:</strong> “{SayIntroduction}”</p>
  - <p>Proyectar o leer las siguientes afirmaciones una a la vez:</p>
  - <ul>{StatementsToProject}</ul> (cada elemento como <li>“Afirmación”</li>)
  - <p><strong>Decir:</strong> “{SayInstructions}”</p>
  - <p><strong>✅ Respuestas esperadas de los estudiantes</strong></p>
  - <ul>{ExpectedStudentResponses}</ul> (cada elemento como <li>“Afirmación” → Respuesta</li>)
  - <p><strong>Decir:</strong> “{SayConclusion}”</p>
  - <p>{ActionConclusion}</p>
  - <p><strong>Opciones alternativas</strong></p>
  - <ul>{AlternateOptions}</ul> (cada elemento como <li><strong>NombreDeLaOpcion:</strong> Descripción</li>)
- Si la lección actual NO es la Lección 1, omita esta sección completa (no renderice NADA para AssessPriorKnowledge).



- <h3><span style="color: rgb(115, 191, 39);">Objetivo {Duration}</span></h3>
  - <p><strong>Propósito:</strong> Observar un fenómeno, identificar algo desconcertante y generar una pregunta significativa que guiará la investigación.</p>
  - <p><strong>📚 Materiales</strong></p> <ul>{Materials}</ul> (cada elemento como <li>)
  - <p><strong>📋 Instrucciones para profesores</strong></p> <ol>{InstructionsForTeachers}</ol> (cada elemento como <li>)

- <h3><span style="color: rgb(115, 191, 39);">Entrega de contenido y actividades interactivas {Duration}</span></h3>
  - <p><strong>📚 Materiales</strong></p>
    - <p><strong>Materiales de uso exclusivo del profesor:</strong></p> <ul>{TeacherOnlyMaterials}</ul> (cada elemento como <li>)
    - <p><strong>Materiales del estudiante:</strong></p> <ul>{StudentMaterials}</ul> (cada elemento como <li>)
  - <p><strong>📋 Instrucciones para profesores</strong></p>
    - <p><strong>Gancho (Hook)</strong></p> <ul>{Hook}</ul> (cada elemento como <li>)
    - <p><strong>Vocabulario</strong></p> <ul>{Vocabulary}</ul> (cada elemento como <li>)
    - <p><strong>Clarificar objetivo</strong></p> <ul>{ClarifyObjective}</ul> (cada elemento como <li>)
    - <p><strong>Nuevos conceptos y conocimientos</strong></p> <ul>{NewConceptsAndKnowledge}</ul> (cada elemento como <li>)
    - <p><strong>⚡ Reinicio de atención y actividad interactiva (1-3 minutos)</strong></p>
      - <p>{StandardParagraph}</p>
      - <p><strong>Instrucciones:</strong></p> <ul>{Directions}</ul> (cada elemento como <li>)
      - <p><strong>Por qué funciona esto:</strong></p> <ul>{WhyThisWorks}</ul> (cada elemento como <li>)
    - <p><strong>Continuar con la instrucción después de la actividad</strong></p> <ul>{ContinueInstruction}</ul> (cada elemento como <li>)
- <p><strong>⚠️ Ideas erróneas anticipadas</strong></p>
      - Iterar sobre AnticipatedMisconceptions:
        <p>{Misconception} (Asegúrese de que NO se utilicen etiquetas bold/strong aquí)</p>
        <ul><li>{TeacherResponse} (Asegúrese de que NO se utilicen etiquetas bold/strong aquí)</li></ul>
- <h3><span style="color: rgb(115, 191, 39);">Conectar (3 min)</span></h3>
  - <p><strong>💭 Pregunta esencial:</strong> {EssentialQuestionVerbatim}</p>
  - <p><strong>Decir:</strong> “{ConnectToEQ.Say}”</p>
  - <p><strong>Preguntas guía (Prompts):</strong></p>
  - <ul>{ConnectToEQ.Prompts}</ul> (cada elemento como <li>)
  - <p>✅ Respuestas esperadas de los estudiantes</p>
  - <ul>{ExpectedStudentResponses}</ul> (cada elemento como <li>)

- <h3><span>🪜 Diferenciación</span></h3>
  - <p><strong>Estudiantes que aprenden el idioma</strong></p> <ul>{LanguageLearners}</ul> (cada elemento como <li>)
  - <p><strong>Estudiantes que necesitan apoyo (andamiaje) adicional</strong></p> <ul>{StudentsInNeedOfAdditionalScaffolding}</ul> (cada elemento como <li>)
  - <p><strong>Profundizar</strong></p>
    - <ul>{GoDeeper.Challenges}</ul> (cada elemento como <li>)
    - <p>✅ Respuestas esperadas de los estudiantes</p>
    - <ul>{GoDeeper.ExpectedStudentResponses}</ul> (cada elemento como <li>)

- <h3><span>🤝 Adaptaciones y modificaciones</span></h3>
  - <p><strong>Apoyos generales:</strong></p> <ul>{GeneralSupports}</ul> (cada elemento como <li>)
  - <p><strong>Apoyos individualizados:</strong></p> {IndividualizedSupports} (para cada estudiante, formatee su nombre como <p><strong><span style="color: rgb(240, 56, 40);">Nombre:</span></strong></p>. Divida sus apoyos específicos en viñetas distintas y coloque cada una en su propio <li> dentro de <ul>)

- <h3><span style="color: rgb(115, 191, 39);">🧠 Repaso y recuperación espaciada (5 min)</span></h3>
  - <p><strong>Nota para el profesor:</strong> [Genere un breve párrafo de notas para el docente que explique cómo esta estrategia de recuerdo activo fortalece la retención al pedirles a los estudiantes que recuerden ideas clave de la lección después de un breve retraso. Conéctelo con el aprendizaje específico de la lección de hoy e incluya una breve reflexión trascendente que ayude a los estudiantes a ver la aplicación/significado más amplio de estos conceptos en el mundo real.]</p>
  - <h3><span>🔁 Recuerdo activo</span></h3>
  - <p><strong>Decir:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question}”</p> (Asegúrese de que cada consigna del docente comience con exactamente un Decir. Si el JSON ya contiene "Diga:", elimínelo antes de envolverlo).
  - <p>✅ Respuestas esperadas de los estudiantes</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses}</ul> (cada elemento como <li>)
  - <h3><span>💭 Conexión con la pregunta esencial</span></h3>
  - <p><strong>Decir:</strong> “{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question}”</p> (Asegúrese de que cada consigna del docente comience con exactamente un Decir. Si el JSON ya contiene "Diga:", elimínelo antes de envolverlo).
  - <p>✅ Respuestas esperadas de los estudiantes</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses}</ul> (cada elemento como <li>)
  - <h3><span>⌛ Recuperación espaciada</span></h3>
  - <p>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay}</p> (Asegúrese de que cada consigna del docente comience con exactamente un Decir. Si el JSON ya contiene "Diga:", elimínelo antes de envolverlo. Mueva cualquier metadato "(Se extrae de...)" en el texto para que esté claramente estilizado al comienzo de la consigna)
  - <p>✅ Respuestas esperadas de los estudiantes</p>
  - <ul>{ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses}</ul> (cada elemento como <li>)

- <h3><span style="color: rgb(115, 191, 39);">Preguntas, respuestas y debate {Duration}</span></h3>
  - <p><strong>📋 Instrucciones para profesores</strong></p>
    - <p>1. {QAndAAndDiscussion.InstructionsForTeachers.Step1_Invite}</p> (Asegúrese de que cada consigna del docente comience con exactamente un Decir. Si el JSON ya contiene "Diga:", elimínelo antes de envolverlo).
    - <p>2. Preguntar:</p>
    - <ul>{QAndAAndDiscussion.InstructionsForTeachers.Step2_AskQuestions}</ul> (cada elemento como <li>)
    - <p>3. {QAndAAndDiscussion.InstructionsForTeachers.Step3_Capture}</p> (Asegúrese de que todas las consignas del docente como 'Diga:' o 'Registre:' en el texto estén estilizadas de manera limpia).
    - <p>4. {QAndAAndDiscussion.InstructionsForTeachers.Step4_Answer}</p> (Asegúrese de que todas las consignas del docente como 'Diga:' o 'Aborde:' en el texto estén estilizadas de manera limpia).
  - <p>Nota para el profesor:</p>
  - <ul>
      <li>Responder preguntas que se conecten directamente con el objetivo de hoy</li>
      <li>“Aparcar” preguntas más profundas o centradas en el futuro rodeándolas con un círculo o marcándolas con una estrella</li>
      <li>Retomar las preguntas aparcadas en las próximas lecciones para mostrar la continuidad del aprendizaje</li>
    </ul>

- <h3><span style="color: rgb(115, 191, 39);">Conclusión {Duration}</span></h3>
  - <p>{Conclusion.BuildCuriosity}</p> (Asegúrese de que cada consigna del docente comience con exactamente un Decir. Si el JSON ya contiene "Diga:", elimínelo antes de envolverlo).

- <h3><span style="color: rgb(115, 191, 39);">✅Evaluación formativa (5 min)</span></h3>
  - Del texto sin formato de FormativeAssessment, extraiga y renderice las preguntas/consignas 1-4 en esta estructura exacta (no invente preguntas; extraiga del texto; limpie el formato):
    - <p><strong>Pregunta 1 (DOK 1):</strong></p>
    - <p>{Prompt 1 question}</p>
    - <p>✅ Respuestas esperadas de los estudiantes</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pregunta 2 (DOK 2):</strong></p>
    - <p>{Prompt 2 question}</p>
    - <p>✅ Respuestas esperadas de los estudiantes</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pregunta 3 (DOK 3):</strong></p>
    - <p>{Prompt 3 question}</p>
    - <p>✅ Respuestas esperadas de los estudiantes</p> <ul><li>{1–2 expected responses}</li></ul>
    - <p><strong>Pregunta 4 (DOK 4):</strong></p>
    - <p>{Prompt 4 question}</p>
    - <p>✅ Respuestas esperadas de los estudiantes</p> <ul><li>{1–2 expected responses}</li></ul>

- <h3><span style="color: rgb(115, 191, 39);">🖋️ Práctica del estudiante</span></h3>
  - <p><strong>Nota para el profesor:</strong> {StudentPractice.TeacherNotes}</p>
  - Para cada tarea en StudentPractice.Tasks:
    - <p>{task.TaskTitle} {task.Instruction}</p>
    - <p>✅ Respuestas esperadas de los estudiantes</p>
    - <ul>{task.ExpectedStudentResponses}</ul> (cada elemento como <li>)
  - <p><strong>{StudentPractice.Reflection.Instruction}</strong></p>
  - <ul>{StudentPractice.Reflection.Prompts}</ul> (cada elemento como <li>)`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Recibirás UN objeto JSON que sigue estrictamente el esquema UnitPlanResponse (ya validado de mi parte). Tu trabajo es transformar este JSON en HTML limpio y legible que un docente pueda usar directamente en clase.
                   
FORMATO DE ENTRADA
Te enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trata todo lo que está después de la línea “UNIT PLAN JSON:” como el objeto JSON exacto. NO lo expliques ni lo comentes; simplemente analízalo y renderízalo.

REGLAS GLOBALES
    - Genera ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO utilices ninguna otra etiqueta (sin <main>, <section>, <header>, <div>, <h4>, etc.).
    - El HTML debe estar bien sangrado y ser fácil de leer.
    - En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca coloques <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    - NO inventes nuevo contenido educativo; usa solo lo que existe en los campos JSON.
    - Preserva el orden lógico implícito en el esquema.

- En la parte superior:
    - <h1>Resumen del plan de la unidad</h1>
    - <p>{{{UnitDescription.Description}}}</p>
- Luego agregue una nueva línea con:
    <h1>Resumen de la unidad</h1>

- Preguntas esenciales:
    - <h2>💭 Preguntas esenciales</h2>
    - <ul> con cada elemento de UnitDescription.EssentialQuestions como <li>.

- Objetivos de aprendizaje del estudiante:
    - <h2>🎯 Objetivos de aprendizaje del estudiante</h2>
    - <ul> con cada elemento de UnitDescription.StudentLearningObjectives como <li>.

- Estándares:
    - <h2>📏 Estándares alineados</h2>
    - <ul> con cada cadena de UnitDescription.StandardsAligned como <li>.

- Vocabulario clave:
    - <h2>🔤 Vocabulario clave</h2>
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
    "title": "LectureUnitPlanResponse",
    "type": "object",
    "properties": {
      "EssentialQuestions": {
        "type": "array",
        "description": "Simplemente pegue todas las preguntas esenciales de nivel de unidad en el mismo orden.",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Lista de vocabulario con definiciones (por ejemplo, 'Palanca - Diga: \"Una palanca es...\"'). ÚNICAMENTE incluya términos que se utilicen activamente en esta lección específica.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' como texto sin formato. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis.",
        "minItems": 2,
        "maxItems": 3,
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "string",
        "description": "Sección completa de 'Estándares alineados' como texto sin formato para esta lección. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos utilizados en la Unidad. p. ej. 'MS-ESS1-1: Desarrollar y utilizar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones.'"
      },
      "AssessPriorKnowledge": {
        "type": "object",
        "description": "Sección completa de 'Evaluar conocimientos previos'. CRÍTICO: Mire el 'lessonNumber' en el contenido de la lección adjunto. SI esta es la Lección 1, complete este objeto por completo. SI esta es la Lección 2, 3 o cualquier otra lección, DEBE DEVOLVER UN OBJETO VACÍO {} sin propiedades. No complete esto para ninguna lección que no sea la Lección 1. Para la Lección 1, la estructura debe incluir:",
        "properties": {
          "SayIntroduction": { "type": "string", "description": "Lo que el docente dice para presentar la actividad." },
          "StatementsToProject": { "type": "array", "items": { "type": "string" }, "description": "Lista de afirmaciones para proyectar o leer, que contienen tanto ideas correctas como conceptos erróneos comunes." },
          "SayInstructions": { "type": "string", "description": "Lo que el docente dice para instruir a los estudiantes sobre qué hacer con las afirmaciones." },
          "ExpectedStudentResponses": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Respuestas/marcas esperadas de los estudiantes para cada afirmación."
          },
          "SayConclusion": { "type": "string", "description": "Lo que el docente dice para concluir." },
          "ActionConclusion": { "type": "string", "description": "Acción del docente para concluir (por ejemplo, dibujar un diagrama)." },
          "AlternateOptions": {
            "type": "array",
            "items": { "type": "string" },
            "description": "Lista de opciones alternativas para la actividad."
          }
        },
        "required": ["SayIntroduction", "StatementsToProject", "SayInstructions", "ExpectedStudentResponses", "SayConclusion", "ActionConclusion", "AlternateOptions"],
        "additionalProperties": false
      },
      "Objective": {
        "type": "object",
        "description": "Cree una sección de Objetivo que establezca claramente las metas de aprendizaje de los estudiantes para la lección.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimación de tiempo (por ejemplo, '(2-3 min)')" },
          "Materials": { "type": "array", "items": { "type": "string" } },
          "InstructionsForTeachers": { "type": "array", "items": { "type": "string" }, "description": "Debe incluir: 1) Explicar las metas de aprendizaje utilizando un guión directo para el docente (por ejemplo, Diga: '...') en un lenguaje claro y amigable para los estudiantes. 2) Pedir a los estudiantes que registren los objetivos en sus cuadernos. 3) Decir brevemente al docente cómo conectar los objetivos con las experiencias de la vida real de los estudiantes." }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ContentDeliveryAndInteractiveActivities": {
        "type": "object",
        "description": "Bloque para la entrega de contenido.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimación de tiempo (por ejemplo, '(30 min)')" },
          "Materials": {
            "type": "object",
            "properties": {
              "TeacherOnlyMaterials": { "type": "array", "items": { "type": "string" } },
              "StudentMaterials": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["TeacherOnlyMaterials", "StudentMaterials"],
            "additionalProperties": false
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "Hook": { "type": "array", "items": { "type": "string" }, "description": "Escriba un gancho dramático y de alto compromiso entregado a través del guión del docente. Debe ser sorprendente, generador de curiosidad y conectado con el concepto principal." },
              "Vocabulary": { "type": "array", "items": { "type": "string" }, "description": "Enumere los términos esenciales de vocabulario. Proporcione el guión del docente para definir cada término con el formato estricto: '[Término] - Diga: \"[Definición/Guión]\"'. Ejemplo: 'Palanca - Diga: \"Una palanca es...\"'." },
              "ClarifyObjective": { "type": "array", "items": { "type": "string" }, "description": "Aclare el objetivo de aprendizaje del estudiante de hoy para esta lección específica compartiendo el guión para el docente." },
              "NewConceptsAndKnowledge": { "type": "array", "items": { "type": "string" }, "description": "Escriba una conferencia detallada del docente con guiones (Diga: “…”). Incluya paso a paso lo que el docente dice, hace y puede demostrar. Desglose ideas complejas, proporcione ejemplos/analogías, realice conexiones explícitas con conocimientos previos." },
              "AttentionReset": {
                "type": "object",
                "description": "Inserte el párrafo estándar de restablecimiento de atención exactamente como está escrito: 'Esta actividad vuelve a captar la atención, restablece el enfoque cognitivo y refuerza el concepto con movimiento + novedad, al tiempo que proporciona una vista previa con propósito.'",
                "properties": {
                  "StandardParagraph": { "type": "string", "description": "Debe ser exactamente: 'Esta actividad vuelve a captar la atención, restablece el enfoque cognitivo y refuerza el concepto con movimiento + novedad, al tiempo que proporciona una vista previa con propósito.'" },
                  "Directions": { "type": "array", "items": { "type": "string" }, "description": "Proporcione instrucciones para la actividad, incluyendo el guión del docente y lo que los estudiantes y el docente deben hacer." },
                  "WhyThisWorks": { "type": "array", "items": { "type": "string" }, "description": "Explique en viñetas por qué la actividad funciona para volver a comprometer la atención, restablecer el enfoque cognitivo, reforzar conceptos y proporcionar una vista previa con propósito. Por ejemplo, 'Estar de pie + rotar restablece la atención'." }
                },
                "required": ["StandardParagraph", "Directions", "WhyThisWorks"],
                "additionalProperties": false
              },
              "ContinueInstruction": { "type": "array", "items": { "type": "string" }, "description": "Conferencia detallada del docente con guiones (Diga: “…”). Desglose ideas complejas, proporcione ejemplos/analogías para intrigar, presagiar el aprendizaje futuro y extender las ideas clave." },
              "AnticipatedMisconceptions": {
                "type": "array",
                "description": "Enumere los conceptos erróneos comunes anticipados de los estudiantes para asegurarse de que el docente esté listo.",
                "items": {
                  "type": "object",
                  "properties": {
                    "Misconception": { "type": "string" },
                    "TeacherResponse": { "type": "string", "description": "Cómo responder eficazmente a los posibles malentendidos de los estudiantes y guiarlos hacia una comprensión precisa." }
                  },
                  "required": ["Misconception", "TeacherResponse"],
                  "additionalProperties": false
                }
              },
              "Connect": {
                "type": "object",
                "description": "Relacionar con un propósito. Conectar con una de las preguntas esenciales.",
                "properties": {
                  "EssentialQuestionVerbatim": { "type": "string", "description": "Use la pregunta esencial proporcionada textualmente." },
                  "ConnectToEQ": {
                    "type": "object",
                    "properties": {
                      "Say": { "type": "string", "description": "Guión del docente que conecta la actividad anterior con la Pregunta Esencial." },
                      "Prompts": { "type": "array", "items": { "type": "string" }, "description": "Consignas/preguntas específicas para los estudiantes." }
                    },
                    "required": ["Say", "Prompts"],
                    "additionalProperties": false
                  },
                  "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Respuestas profundas esperadas de los estudiantes que utilicen razonamiento o evidencia." }
                },
                "required": ["EssentialQuestionVerbatim", "ConnectToEQ", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "Differentiation": {
                "type": "object",
                "description": "Diferenciar la instrucción (cómo enseñar, no simplificar materiales). Varíe la complejidad y la profundidad, promueva el compromiso activo/lenguaje. Realista para el aula.",
                "properties": {
                  "LanguageLearners": { "type": "array", "items": { "type": "string" } },
                  "StudentsInNeedOfAdditionalScaffolding": { "type": "array", "items": { "type": "string" } },
                  "GoDeeper": {
                    "type": "object",
                    "properties": {
                      "Challenges": { "type": "array", "items": { "type": "string" } },
                      "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" } }
                    },
                    "required": ["Challenges", "ExpectedStudentResponses"],
                    "additionalProperties": false
                  }
                },
                "required": ["LanguageLearners", "StudentsInNeedOfAdditionalScaffolding", "GoDeeper"],
                "additionalProperties": false
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Enumere a todos los estudiantes con planes de aprendizaje en fuente roja. Agrupe a los estudiantes con apoyos compartidos. Enfoque en el acceso.",
                "properties": {
                  "GeneralSupports": { "type": "array", "items": { "type": "string" }, "description": "Estrategias no específicas del estudiante que mejoran el acceso para todos los estudiantes (por ejemplo, elementos visuales, notas precompletadas, glosario digital, instrucciones divididas)." },
                  "IndividualizedSupports": { "type": "array", "items": { "type": "string" }, "description": "Adecuaciones y modificaciones específicas para estudiantes designados con planes formales. Registre los nombres en fuente ROJA. Si un estudiante requiere marcos de oraciones/inicios, DEBE proporcionar los marcos/inicios de oraciones específicos y concretos adaptados al contenido de esta lección." }
                },
                "required": ["GeneralSupports", "IndividualizedSupports"],
                "additionalProperties": false
              }
            },
            "required": [
              "Hook", "Vocabulary", "ClarifyObjective", "NewConceptsAndKnowledge", "AttentionReset",
              "ContinueInstruction", "AnticipatedMisconceptions", "Connect",
              "Differentiation", "AccommodationsAndModifications"
            ],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "Materials", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Sección completa de 'Repaso y recuperación espaciada'. Esta actividad de 5 minutos debe incluir: 1. Instrucciones para docentes que contengan: - Consigna de Recuerdo Activo utilizando el intercambio en parejas/grupos - Respuestas esperadas de los estudiantes (2-3 ejemplos en viñetas) 2. Conexión con la Pregunta Esencial 3. Componente de Recuperación Espaciada que contenga: - Referencia clara a una lección previa específica - Pregunta que conecta conceptos pasados + actuales - Criterios de éxito detallados / respuestas esperadas. Todas las secciones deben usar declaraciones 'Diga:' para las consignas del docente y etiquetas claras 'Respuestas esperadas de los estudiantes' que muestren 2-3 respuestas de muestra.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Guía paso a paso para el docente para la sesión de repaso y recuperación espaciada de 5 minutos.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Pida a los estudiantes que recuerden el aprendizaje clave de la lección de hoy utilizando únicamente evidencia de la conferencia/actividades.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Un guión específico del docente (que comienza con 'Diga:') que pide a los estudiantes reflexionar sobre la lección de hoy y lo que reveló."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 ejemplos de respuestas de estudiantes de alta calidad que muestren una comprensión clara.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Ayude a los estudiantes a conectar el concepto específico de hoy con las preguntas esenciales más amplias de la unidad.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Un guión del docente (que comienza con 'Diga:') que vincula los hallazgos de hoy con una de las preguntas esenciales de la unidad."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 ejemplos de cómo los estudiantes justifican la conexión.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "SpacedRetrieval": {
                "type": "object",
                "description": "Vuelva a visitar un concepto de una unidad o lección anterior para fortalecer la retención acumulativa.",
                "properties": {
                  "TeacherSay": {
                    "type": "string",
                    "description": "Un guión del docente (que comienza con 'Diga:') que conecta explícitamente un concepto de una lección anterior con el trabajo de hoy. Debe incluir la metarreferencia (por ejemplo, '(Se extrae de la Unidad 1, Lección 2.)') directamente en el texto."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 ejemplos de respuestas esperadas.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["TeacherSay", "ExpectedStudentResponses"],
                "additionalProperties": false
              }
            },
            "required": ["ActiveRecall", "EssentialQuestionConnection", "SpacedRetrieval"],
            "additionalProperties": false
          }
        },
        "required": ["InstructionsForTeachers"],
        "additionalProperties": false
      },
      "QAndAAndDiscussion": {
        "type": "object",
        "description": "Bloque para preguntas y respuestas y discusión.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimación de tiempo (por ejemplo, '(5 min)')" },
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Orientación del docente para la sesión de preguntas y respuestas y discusión.",
            "properties": {
              "Step1_Invite": {
                "type": "string",
                "description": "Invite a preguntas de los estudiantes, comenzando con 'Diga:' (por ejemplo, 'Diga: “Ahora es su oportunidad de pensar en lo que aprendimos e identificar cualquier cosa que todavía parezca importante explorar.”')"
              },
              "Step2_AskQuestions": {
                "type": "array",
                "description": "3-4 preguntas del docente que se conectan con la lección de hoy, evitando las palabras 'confundido' o 'no entiendo' pero revelando incertidumbre.",
                "items": { "type": "string" }
              },
              "Step3_Capture": {
                "type": "string",
                "description": "Instrucciones para registrar preguntas que incluyan 'Diga:', 'Registre:' y otra declaración de 'Diga:' (por ejemplo, 'Diga: “Si tienen una pregunta, eso significa que están pensando profundamente. Registremos esas ideas.” Registre: Escriba las preguntas de los estudiantes en un cartel titulado “Preguntas que aún tenemos.” Diga: “Seguiremos agregando a este cartel a lo largo de la unidad. Algunas preguntas las responderemos hoy y otras las investigaremos en lecciones futuras.”')"
              },
              "Step4_Answer": {
                "type": "string",
                "description": "Instrucciones para responder preguntas que incluyan 'Diga:', 'Aborde:' y otra declaración de 'Diga:' (por ejemplo, 'Diga: “Miremos nuestras preguntas. ¿Cuáles podemos responder usando lo que aprendimos hoy?” Aborde: Aborde algunas preguntas usando respuestas y evidencia de los estudiantes. Diga: “Algunas de estas preguntas ayudarán a guiar lo que aprendamos a continuación. Los científicos no responden todo a la vez; siguen construyendo comprensión con el tiempo.”')"
              }
            },
            "required": ["Step1_Invite", "Step2_AskQuestions", "Step3_Capture", "Step4_Answer"],
            "additionalProperties": false
          }
        },
        "required": ["Duration", "InstructionsForTeachers"],
        "additionalProperties": false
      },
      "Conclusion": {
        "type": "object",
        "description": "Bloque para la conclusión.",
        "properties": {
          "Duration": { "type": "string", "description": "Estimación de tiempo (por ejemplo, '(1 min)')" },
          "BuildCuriosity": {
            "type": "string",
            "description": "Una vista previa de la próxima lección que construya curiosidad y cree suspenso, comenzando con 'Diga:'. Debe tener al menos 3-4 oraciones de largo (o más si tiene sentido para construir una curiosidad más profunda)."
          }
        },
        "required": ["Duration", "BuildCuriosity"],
        "additionalProperties": false
      },
      "FormativeAssessment": {
        "type": "string",
        "description": "Sección completa de 'Evaluación formativa' como texto sin formato. Debe seguir esta estructura: Un párrafo de introducción dirigido al docente que indique brevemente el propósito y cómo implementarlo. 4 preguntas requeridas etiquetadas como 'Prompt 1 (DOK 1):', 'Prompt 2 (DOK 2):', etc., que cubran los niveles DOK 1-4. Para cada consigna: - Pregunta que evalúe la comprensión al nivel DOK indicado - Encabezado 'Respuestas esperadas de los estudiantes' (sin marcas de verificación/emojis) - 1-2 respuestas en oraciones completas que muestren el dominio. Termine con un párrafo corto que nombre una estrategia de evaluación formativa específica para usar (por ejemplo, 'Exit Ticket', 'Think-Pair-Share'). Ejemplo de formato: Prompt 1 (DOK 1): '¿Por qué los planetas permanecen en órbita en lugar de salir despedidos al espacio?' Respuestas esperadas de los estudiantes 'Porque su movimiento hacia adelante y la gravedad del Sol trabajan juntos para crear una órbita estable.' [Continúe con los Prompts 2-4 siguiendo la misma estructura]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Sección completa de 'Práctica del estudiante' para tareas / práctica fuera de clase.",
        "properties": {
          "TeacherNotes": {
            "type": "string",
            "description": "Debe seguir esta plantilla exactamente, completando la parte entre corchetes: 'Estas tareas de práctica refuerzan el aprendizaje de hoy sobre [insertar conceptos de la lección] al pedir a los estudiantes que observen patrones del mundo real y los expliquen utilizando los conceptos presentados en clase. Al aplicar las ideas del aula de forma independiente, los estudiantes fortalecen la retención a largo plazo y desarrollan la capacidad de transferir el pensamiento científico a las experiencias cotidianas.'"
          },
          "Tasks": {
            "type": "array",
            "description": "Genere 3 tareas que cubran los niveles DOK 2 y 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "p. ej., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Instrucciones claras y paso a paso para el estudiante para la tarea." },
                "ExpectedStudentResponses": { "type": "array", "items": { "type": "string" }, "description": "Respuestas esperadas de los estudiantes. NO incluya marcas de verificación/emojis." }
              },
              "required": ["TaskTitle", "Instruction", "ExpectedStudentResponses"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "properties": {
              "Instruction": { "type": "string", "description": "p. ej., '4. Reflexión: Escriba 2-3 oraciones respondiendo a una consigna:'" },
              "Prompts": { "type": "array", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["TeacherNotes", "Tasks", "Reflection"],
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
    "additionalProperties": false
  }
};
