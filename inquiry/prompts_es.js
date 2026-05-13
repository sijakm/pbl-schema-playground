window.promptsES = {
  STEP0_PROMPT_TEMPLATE: `Cree SOLO el esquema de la unidad de INDAGACIÓN (Paso 0) utilizando la información a continuación. NO cree un plan de unidad completo y NO escriba planes de lecciones completos.

DEBE generar un JSON válido que coincida exactamente con el esquema JSON proporcionado: UnitPlanResponse. No incluya claves adicionales. Utilice un formato JSON compacto (sin líneas en blanco adicionales ni espacios en blanco entre las propiedades JSON). Sin HTML. Sin emojis. Texto sin formato dentro de los campos de cadena.

Materia de la unidad: {{$Subject}}
Nombre de la unidad: {{$Name}}
Descripción/Instrucción de la unidad: {{$UserPrompt}}
Nivel de grado: {{$GradeLevel}}
Duración del período de clase en minutos: {{$ClassDuration}}
Número solicitado de lecciones: {{$NumberOfItems}}
Estándares para alinear (utilícelos textualmente si están presentes; NO agregue nuevos estándares): {{$Standards}}
Estudiantes con apoyo individualizado (solo contexto): {{$LearningPlans}}
Recursos/Medios a utilizar: {{$MediaContext}}
Contenido de la unidad: {{$AttachedUnit}}
Contenido de la lección adjunto (si lo hay): {{$AttachedLesson}}

REQUISITOS DEL ESQUEMA DE INDAGACIÓN:
- Este enfoque prioriza la indagación. Las lecciones DEBEN progresar a través de este arco:
  (1) fenómeno/experiencia + observación/asombro,
  (2) selección de preguntas + planificación de investigaciones,
  (3) recopilación de pruebas + búsqueda de patrones,
  (4) construcción de modelos + revisión utilizando pruebas,
  (5) explicación/argumento + comunicación + transferencia.
- Mantenga el sentido del aprendizaje a través del descubrimiento: los estudiantes construyen y revisan modelos utilizando observaciones y datos simples; enfatice las pruebas, el razonamiento y la comunicación.
- Mantenga la alineación SOLO con los estándares proporcionados. NO agregue nuevos estándares ni marcos de trabajo.
- Relevancia cultural e inclusión: incluya contextos o perspectivas breves y relevantes para la comunidad sin estereotipos.
- Entrelazado y transferencia: retome las habilidades a lo largo de las lecciones (observación, modelado, argumentación basada en pruebas, comunicación).
- Las lecciones DEBEN ser no superpuestas y tener límites claros.

RESTRICCIONES DEL ARREGLO DE LECCIONES:
- El arreglo Lessons DEBE contener exactamente {{$NumberOfItems}} lecciones.
- lessonNumber comienza en 1 y aumenta estrictamente de 1 en 1.
- Asegure una secuencia lógica desde los movimientos básicos de indagación hasta el modelado y la explicación más complejos.
- El ritmo debe ajustarse a períodos de clase de {{$ClassDuration}} minutos para el grado {{$GradeLevel}}.

REGLA DE SALIDA:
Devuelva SOLO el JSON que se valide contra el esquema UnitPlanResponse.`,

  PER_LESSON_PROMPT_TEMPLATE: `Cree UN plan de lección de indagación (NO un plan de unidad, NO varias lecciones) utilizando la información a continuación. DEBE generar un JSON válido que coincida exactamente con el esquema JSON proporcionado: InquiryUnitPlanResponse. No incluya claves adicionales. Utilice un formato JSON compacto (sin líneas en blanco adicionales ni espacios en blanco entre las propiedades JSON). Sin HTML. Sin emojis. Sin markdown. Texto sin formato dentro de los campos de cadena.

Materia de la unidad: {{$Subject}}
Nombre de la unidad: {{$Name}}
Descripción/Instrucción de la unidad: {{$UserPrompt}}
Nivel de grado: {{$GradeLevel}}
Duración del período de clase en minutos: {{$ClassDuration}}
Estándares para alinear (utilícelos textualmente si están presentes; NO agregue nuevos estándares): {{$Standards}}
Estudiantes con apoyo individualizado (DEBEN usarse SOLO dentro de InvestigationPhase.AccommodationsAndModifications; use los nombres/planes de los estudiantes exactamente como están escritos): {{$LearningPlans}}
Recursos/Medios a utilizar: {{$MediaContext}}
Contenido de la unidad: {{$AttachedUnit}}

Elementos de la unidad y de la lección del Paso 0 (usar textualmente):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (exactamente como se proporcionan; reutilizar textualmente donde sea relevante): {{$UnitEssentialQuestions}}

Contenido de la lección adjunto (si lo hay): {{$AttachedLesson}}

REQUISITOS DEL FLUJO DE LA LECCIÓN DE INDAGACIÓN:
- Esta lección debe seguir el arco de indagación y estar alineada con los límites del esquema de la lección: Orientación → Conceptualización → Investigación → Conclusión → Discusión.
- Mantenga el sentido del aprendizaje a través del descubrimiento: los estudiantes construyen y revisan ideas utilizando observaciones y datos simples; enfatice las pruebas, el razonamiento y la comunicación.
- Relevancia cultural e inclusión: incluya contextos o perspectivas breves y relevantes para la comunidad sin estereotipos.
- NO introduzca conceptos nuevos importantes que pertenezcan a otras lecciones; manténgase dentro del alcance y los límites del esquema de esta lección.
- Mantenga la alineación SOLO con los estándares proporcionados. NO agregue nuevos estándares ni marcos de trabajo.
- Las intervenciones del docente deben guiar el pensamiento sin dar explicaciones científicas directamente.

REGLAS ESPECÍFICAS DE LOS CAMPOS (mapear al esquema):
- AssessPriorKnowledge: SOLO si el número de lección es 1, escriba entre 150 y 250 palabras y siga la estructura requerida en la descripción del esquema; de lo contrario, devuelva "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: incluya apoyos generales.
  - IndividualSupport: el arreglo debe incluir exactamente a los estudiantes proporcionados y sus planes (mismos nombres/planes; sin estudiantes adicionales; sin estudiantes faltantes).

REGLA DE SALIDA:
Devuelva SOLO el JSON que se valide contra el esquema InquiryUnitPlanResponse.`,

  HTML_LESSON_PROMPT_TEMPLATE: `Usted es un formateador HTML de instrucción profesional que escribe para docentes de aula.

REGLAS CRÍTICAS
- Genere SOLO HTML válido.
- NO añada explicaciones ni comentarios.
- NO invente contenido.
- Etiquetas permitidas ÚNICAMENTE: <p>, <h3>, <strong>, <em>, <span>, <ul>, <li>
- Las listas solo pueden contener <li> como hijos directos.
- NO use listas anidadas.
- NO use <p> dentro de <li>.
- Mantenga el orden de las secciones EXACTAMENTE como se especifica a continuación. NO las reordene.

--------------------------------
JSON DE ENTRADA (InquiryUnitPlanResponse para UNA lección):
{{$LessonInquiryJson}}
--------------------------------

TAREA
Transforme el JSON DE ENTRADA en HTML para el docente utilizando ÚNICAMENTE las etiquetas permitidas y siguiendo las reglas de renderizado y estructuras exactas que se indican a continuación.

Primero renderice las preguntas esenciales y los estándares alineados:
<h3>💭 Preguntas esenciales</h3>
<ul>
  - Renderice cada elemento de EssentialQuestions como un <li>.
</ul>

<h3>🎯 Objetivos de aprendizaje del estudiante</h3>
<ul>
  - Renderice cada elemento de StudentLearningObjectives como un <li>.
</ul>

<h3>📏 Estándares alineados</h3>
<ul>
  - Renderice cada elemento de StandardsAligned como un <li>.
</ul>

<h3>🔤 Vocabulario clave</h3>
<ul>
  - Renderice cada elemento de KeyVocabulary como un <li>.
</ul>

==================================================
SECCIÓN 0: EVALUACIÓN DE CONOCIMIENTOS PREVIOS (CONDICIONAL)
==================================================
SOLO renderice esta sección si AssessPriorKnowledge NO es una cadena vacía.

ESTRUCTURA RÍGIDA (DEBE SEGUIRSE EXACTAMENTE):

<h3><span>💡 Evaluar conocimientos previos</span></h3>

<p><strong>Nota para el docente:</strong> Activar los conocimientos previos de los estudiantes no es solo un calentamiento, es neurociencia en acción. Este proceso activa las vías neuronales existentes, lo que facilita que el cerebro asocie la nueva información con lo que ya conoce. Esta técnica, llamada codificación elaborativa, ayuda a los estudiantes a trasladar el conocimiento a la memoria a largo plazo de forma más rápida y eficaz, mejorando tanto la comprensión como la retención.</p>

A continuación, renderice:

<p><strong>Diga:</strong></p>
- Uno o más elementos <p> que sinteticen el discurso del docente (aunque "Diga:" no aparezca explícitamente en la entrada).

Tareas / consignas / enunciados de los estudiantes:
- Renderice como <ul> (nota: <ol> NO es una etiqueta permitida, por lo que DEBE usar <ul>).
- Cada elemento debe ser UN <li>
- NO use otras etiquetas dentro de <li>

Respuestas esperadas:
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  <li>...</li>
</ul>

Opciones alternativas (si las hay):
<p><strong>Opciones alternativas:</strong></p>
<ul>
  <li>...</li>
</ul>

==================================================
SECCIÓN 1: FASE DE ORIENTACIÓN – DEFINIR EL PROBLEMA
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase de orientación – Definir el problema (5 min)</span></h3>

<p><strong>Propósito:</strong> Se presenta a los estudiantes un misterio real que despierta la curiosidad y motiva la investigación. Reconocen el problema y activan conocimientos previos para prepararse para una indagación más profunda.</p>

<p><strong>📚 Materiales:</strong></p>
<ul>
  - Renderice cada elemento de OrientationPhase.Materials como un <li>. Si está vacío, genere <li>Ninguno</li>.
</ul>

<p><strong>📋 Instrucciones para docentes</strong></p>

<p><strong>Motivar – Presente el fenómeno de una manera que despierte la curiosidad sin explicarlo.</strong></p>
<p><strong>Diga:</strong> {OrientationPhase.InstructionsForTeachers.Engage.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en OrientationPhase.InstructionsForTeachers.Engage.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {OrientationPhase.InstructionsForTeachers.Engage.PromptingOptions}</li>
</ul>

<p><strong>Conectar – Ayude a los estudiantes a vincular sus observaciones con el misterio más amplio que servirá de base para la investigación.</strong></p>
<p><strong>Diga:</strong> {OrientationPhase.InstructionsForTeachers.Connect.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  <li><strong>Anime con preguntas como:</strong> {OrientationPhase.InstructionsForTeachers.Connect.PromptingOptions}</li>
  - Para cada acción en OrientationPhase.InstructionsForTeachers.Connect.FacilitationMoves, renderícela como <li>.
</ul>

<p><strong>Activar – Oriente a los estudiantes hacia la construcción colaborativa de sentido.</strong></p>
<p><strong>Diga:</strong> {OrientationPhase.InstructionsForTeachers.Activate.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en OrientationPhase.InstructionsForTeachers.Activate.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {OrientationPhase.InstructionsForTeachers.Activate.PromptingOptions}</li>
</ul>

<p><strong>Sondear – Fomente el perfeccionamiento del pensamiento empujando a los estudiantes a examinar sus suposiciones.</strong></p>
<p><strong>Diga:</strong> {OrientationPhase.InstructionsForTeachers.Probe.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  <li><strong>Anime con preguntas como:</strong> {OrientationPhase.InstructionsForTeachers.Probe.PromptingOptions}</li>
  - Para cada acción en OrientationPhase.InstructionsForTeachers.Probe.FacilitationMoves, renderícela como <li>.
</ul>
<p>{OrientationPhase.InstructionsForTeachers.Probe.Closing}</p>

==================================================
SECCIÓN 2: FASE DE CONCEPTUALIZACIÓN – PREGUNTA DE INVESTIGACIÓN + PLAN DE ACCIÓN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase de conceptualización – Pregunta de investigación + Plan de acción (10 min)</span></h3>

<p><strong>Propósito:</strong> Los estudiantes generan preguntas de investigación significativas, seleccionan una pregunta central para investigar y crean un plan de acción que guiará su proceso de indagación.</p>

<p><strong>📚 Materiales:</strong></p>
<ul>
  - Renderice cada elemento de ConceptualizationPhase.Materials como un <li>. Si está vacío, genere <li>Ninguno</li>.
</ul>

<p><strong>📋 Instrucciones para docentes</strong></p>

<p><strong>Guiar la generación de preguntas – Introduzca la indagación fomentando la curiosidad, no impartiendo contenidos.</strong></p>
<p><strong>Diga:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {ConceptualizationPhase.InstructionsForTeachers.GuideQuestionGeneration.PromptingOptions}</li>
</ul>

<p><strong>Identificar la pregunta de investigación – Ayude a los estudiantes a decidir colaborativamente qué pregunta es más útil para la investigación.</strong></p>
<p><strong>Diga:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {ConceptualizationPhase.InstructionsForTeachers.IdentifyResearchQuestion.PromptingOptions}</li>
</ul>

<p><strong>Crear un plan de acción – Apoye a los estudiantes en el diseño de su propia investigación en lugar de darles el plan ya hecho.</strong></p>
<p><strong>Diga:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {ConceptualizationPhase.InstructionsForTeachers.CreateAnActionPlan.PromptingOptions}</li>
</ul>

==================================================
SECCIÓN 3: FASE DE INVESTIGACIÓN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase de investigación – Explorar + Investigar + Experimentar + Recopilar datos (15 min)</span></h3>

<p><strong>Propósito:</strong> Los estudiantes exploran activamente el fenómeno a través de la observación, el análisis de modelos y la recopilación de pruebas, construyendo un conjunto de datos que luego utilizarán para formar conclusiones.</p>

<p><strong>📚 Materiales:</strong></p>
<ul>
  - Renderice cada elemento de InvestigationPhase.Materials como un <li>. Si está vacío, genere <li>Ninguno</li>.
</ul>

<p><strong>📋 Instrucciones para docentes</strong></p>

<p><strong>Lanzar la investigación – Presente la tarea sin explicar el contenido.</strong></p>
<p><strong>Diga:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción en InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {InvestigationPhase.InstructionsForTeachers.LaunchInvestigation.PromptingOptions}</li>
</ul>

<p><strong>Expectativas de colaboración – Enmarque la tarea como interdependiente: cada estudiante contribuye al análisis compartido.</strong></p>
<p><strong>Diga:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.Prompt}</p>
<p>Acciones de facilitación:</p>
<ul>
  - Para cada acción/expectativa en InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.FacilitationMoves, renderícela como <li>.
  <li><strong>Anime con preguntas como:</strong> {InvestigationPhase.InstructionsForTeachers.CollaborationExpectations.PromptingOptions}</li>
</ul>

<p><strong>Consignas para la circulación – Utilícelas únicamente mientras circula entre los grupos.</strong></p>

<p><strong>Consignas conceptuales</strong></p>
<ul>
  - Para cada acción en InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Conceptual, renderícela como <li>.
</ul>

<p><strong>Consignas de razonamiento</strong></p>
<ul>
  - Para cada acción en InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Reasoning, renderícela como <li>.
</ul>

<p><strong>Consignas de colaboración</strong></p>
<ul>
  - Para cada acción en InvestigationPhase.InstructionsForTeachers.CirculationPrompts.Collaboration, renderícela como <li>.
</ul>

<p><strong>⚠️ Ideas erróneas anticipadas</strong></p>
- Para cada elemento en InvestigationPhase.AnticipatedMisconceptions:
<p>{item.Misconception} (Asegúrese de que NO se utilicen etiquetas de negrita/strong aquí)</p>
<ul>
  <li>{item.TeacherResponse} (Asegúrese de que NO se utilicen etiquetas de negrita/strong aquí)</li>
</ul>

<h3><span>🪜 Diferenciación</span></h3>

<p><strong>Estudiantes de idiomas:</strong></p>
- Para cada estrategia en InvestigationPhase.Differentiation.LanguageLearners.Strategies:
<p>{strategy}</p>
<p>Utilice marcos de oraciones para apoyar la explicación y el razonamiento:</p>
<ul>
  - Para cada inicio de oración en InvestigationPhase.Differentiation.LanguageLearners.SentenceStarters, renderícelo como <li>.
</ul>

<p><strong>Andamiaje adicional:</strong></p>
- Para cada estrategia en InvestigationPhase.Differentiation.AdditionalScaffolding.Strategies:
<p>{strategy}</p>
<p>Ofrezca una lista de verificación paso a paso para guiar la investigación:</p>
<ul>
  - Para cada elemento en InvestigationPhase.Differentiation.AdditionalScaffolding.Checklist, renderícelo como <li>.
</ul>

<p><strong>Profundizar:</strong></p>
- Para cada estrategia en InvestigationPhase.Differentiation.GoDeeper.Strategies:
<p>{strategy}</p>

<p>Pregunta de pensamiento avanzado:</p>
<ul>
  <li>Diga: "{InvestigationPhase.Differentiation.GoDeeper.AdvancedQuestion}"</li>
</ul>

<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  - Para cada respuesta en InvestigationPhase.Differentiation.GoDeeper.ExpectedResponses, renderícela como <li>.
</ul>

<h3><span>🤝 Adaptaciones y modificaciones</span></h3>

<p><strong>Apoyos generales:</strong></p>
<ul>
  <li>{Renderizar InvestigationPhase.AccommodationsAndModifications.General}</li>
</ul>

<p><strong>Apoyos individuales:</strong></p>
- Para cada elemento en InvestigationPhase.AccommodationsAndModifications.IndividualSupport renderice:
<p><strong><span style="color: rgb(240, 56, 40);">{StudentName}:</span></strong></p>
- Para cada entrada en InvestigationPhase.AccommodationsAndModifications.IndividualSupport.Plan:
<p>{entry.item}</p>
<ul>
  - Para cada subItem en entry.subItems, renderícelo como <li>.
</ul>

<h3><span>✔ Comprobación rápida</span></h3>
<p>{InvestigationPhase.QuickCheck.Question}</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  - Para cada respuesta en InvestigationPhase.QuickCheck.ExpectedResponses, renderícela como <li>.
</ul>

==================================================
SECCIÓN 4: FASE DE CONCLUSIÓN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase de conclusión – Analizar los hallazgos + Responder a la pregunta de investigación (5 min)</span></h3>

<p><strong>Propósito:</strong> Los estudiantes analizan los datos recopilados y utilizan pruebas para responder a la pregunta de investigación, formando una explicación clara basada en sus hallazgos.</p>

<p><strong>📚 Materiales:</strong></p>
<ul>
  - Renderice cada elemento de ConclusionPhase.Materials como un <li>. Si está vacío, genere <li>Ninguno</li>.
</ul>

<p><strong>📋 Instrucciones para docentes</strong></p>
<p>{ConclusionPhase.InstructionsForTeachers.OpeningScript}</p>
- Para cada acción en ConclusionPhase.InstructionsForTeachers.FacilitationMoves renderícela como un <p>:
<p>{move}</p>

<p><strong>Anime con preguntas como:</strong></p>
<ul>
  - Para cada pregunta en ConclusionPhase.InstructionsForTeachers.ProbingQuestions, renderícela como un <li>.
</ul>

- Para cada acción en ConclusionPhase.InstructionsForTeachers.FacilitationMoves (acciones adicionales si las hay), renderícela como un <p>.
<p>{ConclusionPhase.InstructionsForTeachers.WritingPrompt}</p>
<p>{ConclusionPhase.InstructionsForTeachers.CollaborationInstruction}</p>
<p><em>{ConclusionPhase.InstructionsForTeachers.Guardrail}</em></p>

<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  - Para cada respuesta en ConclusionPhase.ExpectedStudentResponses, renderícela como un <li>.
</ul>

==================================================
SECCIÓN 5: FASE DE DISCUSIÓN
==================================================

<h3><span style="color: rgb(115, 191, 39);">Fase de discusión – Implicaciones + Significado + Uso futuro (5 min)</span></h3>

<p><strong>Propósito:</strong> Ayudar a los estudiantes a pasar de lo que descubrieron a por qué es importante.</p>

<p><strong>📚 Materiales:</strong></p>
<ul>
  - Renderice cada elemento de DiscussionPhase.Materials como un <li>. Si está vacío, genere <li>Ninguno</li>.
</ul>

<p><strong>📋 Instrucciones para docentes</strong></p>
<p>{DiscussionPhase.InstructionsForTeachers.OpeningScript}</p>
- Para cada acción en DiscussionPhase.InstructionsForTeachers.FacilitationMoves, renderícela como un <p>:
<p>{move}</p>

<p><strong>Anime con preguntas como:</strong></p>
<ul>
  - Para cada pregunta en DiscussionPhase.InstructionsForTeachers.ProbingQuestions, renderícela como un <li>.
</ul>

<h3><span>🌍 Pensamiento trascendente</span></h3>
<p>{DiscussionPhase.TranscendentThinking.Question}</p>

<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  - Para cada respuesta en DiscussionPhase.ExpectedStudentResponses, renderícela como un <li>.
</ul>

==================================================
SECCIÓN 6: REPASO Y RECUPERACIÓN ESPACIADA
==================================================

Usted es un formateador HTML de instrucción profesional. Su objetivo es transformar los datos JSON en una guía limpia para el docente.

RESTRICCIONES DE HTML Y ESTILO:
- Genere SOLO HTML válido utilizando las etiquetas permitidas.
- Cada <li> debe estar dentro de un <ul>. Nunca ponga un <p> dentro de un <li>.
- Use emojis como marcadores de sección como se muestra en la plantilla.

REGLAS DE PROCESAMIENTO DE CONTENIDO:
- Regla de un solo "Diga": Asegúrese de que cada consigna del docente comience exactamente con un <strong>Diga:</strong>. Si el JSON ya contiene "Say:", elimínelo antes de envolverlo.
- Migración de metadatos: Para la recuperación espaciada, busque la información "(Draws from...)" en el JSON. Muévala al título <strong> y elimínela del cuerpo de "Diga:".
- Inteligencia: No se limite a copiar y pegar. Si el texto del JSON es confuso, parafraseélo para que sea profesional y claro para un docente SIN inventar ideas nuevas.

RENDICE ESTE ESQUEMA EXACTAMENTE (complete los marcadores de posición del JSON; si Materiales está vacío, genere <li>Ninguno</li>):

<h3><span>🧠 Repaso y recuperación espaciada (5 min)</span></h3>

<p><strong>Notas para el docente:</strong> Esta estrategia refuerza la retención a través de la recuperación activa y conecta la investigación de hoy con las ideas científicas fundamentales. La reflexión trascendente ayuda a los estudiantes a reconocer cómo los principios científicos permiten a las personas resolver problemas del mundo real de manera eficiente. Refuerza que el cambio de variables afecta los resultados en un sistema.</p>

<h3><span>🔁 Recuperación activa</span></h3>
<p>[Limpie y renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.Question utilizando la regla de un solo "Diga"]</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  [Renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.ActiveRecall.ExpectedStudentResponses como elementos <li>]
</ul>

<h3><span>💭 Conexión con la pregunta esencial</span></h3>
<p>[Limpie y renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.Question utilizando la regla de un solo "Diga"]</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  [Renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.EssentialQuestionConnection.ExpectedStudentResponses como elementos <li>]
</ul>

<h3><span>⏳ Recuperación espaciada</span></h3>
<p>[Limpie y renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.TeacherSay utilizando la migración de metadatos y la regla de un solo "Diga"]</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  [Renderice ReviewAndSpacedRetrieval.InstructionsForTeachers.SpacedRetrieval.ExpectedStudentResponses como elementos <li>]
</ul>

==================================================
SECCIÓN 7: EVALUACIÓN FORMATIVA
==================================================

<h3><span style="color: rgb(115, 191, 39);">✅ Evaluación formativa (5 min)</span></h3>

A partir del texto sin formato de FormativeAssessment, extraiga y renderice las consignas 1 a 4 en esta estructura exacta (no invente consignas; extráigalas del texto; limpie el formato):

<p><strong>Consigna 1 (DOK 1):</strong></p>
<p>{Pregunta de la consigna 1}</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  <li>{1 o 2 respuestas esperadas}</li>
</ul>

<p><strong>Consigna 2 (DOK 2):</strong></p>
<p>{Pregunta de la consigna 2}</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  <li>{1 o 2 respuestas esperadas}</li>
</ul>

<p><strong>Consigna 3 (DOK 3):</strong></p>
<p>{Pregunta de la consigna 3}</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  <li>{1 o 2 respuestas esperadas}</li>
</ul>

<p><strong>Consigna 4 (DOK 4):</strong></p>
<p>{Pregunta de la consigna 4}</p>
<p>✅ Respuestas esperadas de los estudiantes</p>
<ul>
  <li>{1 o 2 respuestas esperadas}</li>
</ul>

==================================================
SECCIÓN 8: PRÁCTICA DEL ESTUDIANTE
==================================================

ENCABEZADO DE SECCIÓN (OBLIGATORIO):
<h3><span style="color: rgb(115, 191, 39);">🖋️ Práctica del estudiante</span></h3>

<p><strong>Notas para el docente:</strong> Esta práctica ayuda a los estudiantes a ampliar la lección aplicando las habilidades de indagación a una situación nueva fuera de clase. Los estudiantes continuarán desarrollando el hábito de observar patrones, explicar sus elecciones con pruebas y considerar cómo los cambios en el diseño afectan a los resultados. Las tareas también conectan el aprendizaje con la resolución de problemas del mundo real.</p>

- Para cada tarea en StudentPractice.Tasks:
<p><strong>{task.TaskTitle}:</strong> {task.Instruction}</p>
<p>Criterios de éxito</p>
<ul>
  [Renderice {task.SuccessCriteria} como elementos <li>]
</ul>

<p><strong>🔎 Reflexión:</strong></p>
<p>[Limpie y renderice StudentPractice.Reflection.Instruction]</p>
<ul>
  [Renderice StudentPractice.Reflection.Prompts como elementos <li>]
</ul>

REGLA DE SALIDA FINAL:
Devuelva SOLO el HTML combinado de todas las secciones en orden. Sin texto envolvente adicional.`,

  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `Usted es un formateador HTML de instrucción profesional que escribe para docentes de aula.

Recibirá un paquete JSON estructurado que representa información de alto nivel de la unidad.

REGLAS CRÍTICAS
- Genere SOLO HTML válido.
- NO añada explicaciones ni comentarios.
- NO invente contenido.
- NO repita secciones.
- Etiquetas permitidas ÚNICAMENTE: <p>, <h2>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>
- Las listas solo pueden contener <li> como hijos directos.
- NO use listas anidadas.
- NO use <p> dentro de <li>.

--------------------------------
SECCIÓN 1: DESCRIPCIÓN DE LA UNIDAD
--------------------------------
Renderice utilizando la plantilla EXACTA:

<h2><strong>{UnitTitle}</strong></h2>
<p>{UnitDescription}</p>
<h3><span>Resumen de la unidad</span></h3>

--------------------------------
SECCIÓN 2: PREGUNTAS ESENCIALES
--------------------------------
<h3><span>💭 Preguntas esenciales</span></h3>
Renderice como una lista desordenada.

--------------------------------
SECCIÓN 3: OBJETIVOS DE APRENDIZAJE DEL ESTUDIANTE
--------------------------------
<h3><span>🎯 Objetivos de aprendizaje del estudiante</span></h3>
Renderice como una lista desordenada.

--------------------------------
SECCIÓN 4: ESTÁNDARES ALINEADOS
--------------------------------
<h3><span>📏 Estándares alineados</span></h3>
Renderice como una lista desordenada.

--------------------------------
SECCIÓN 5: VOCABULARIO CLAVE
--------------------------------
<h3><span>🔤 Vocabulario clave</span></h3>
Renderice como una lista ordenada.

--------------------------------
JSON DE ENTRADA:
{{$UnitCommonJson}}
`,

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
    "title": "InquiryUnitPlanResponse",
    "type": "object",
    "properties": {
      "AssessPriorKnowledge": {
        "type": "string",
        "description": "Sección completa de 'Evaluar conocimientos previos' como texto sin formato (150-250 palabras en total). SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER una CADENA VACÍA para este campo. Para la Lección 1, la estructura debe incluir: 1. Incluya esta sección solo en la primera lección de la unidad, ubicada inmediatamente después de los Objetivos de aprendizaje del estudiante. 2. Asegúrese de que se utilicen consignas de nivel DOK 1-3. 3. Incluya las habilidades previas necesarias para los objetivos de aprendizaje del estudiante. 4. Elija una modalidad de esta lista y desarróllela completamente: cuestionamiento, S-Q-A (Nota: si se elige S-Q-A, asegúrese de que la estructura sea explícitamente S: 'Lo que sé', Q: 'Lo que quiero saber' y A: 'Lo que aprendí', que se completará DESPUÉS del proceso de aprendizaje), elementos visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, clasificaciones de vocabulario. 5. Consigna inicial del docente con la declaración 'Diga:' que introduzca la modalidad elegida y explique cómo los estudiantes sacarán a la luz su comprensión actual. 6. Instrucciones claras y plantilla/estructura para la modalidad elegida. 7. Sección de 'Respuestas esperadas de los estudiantes' que muestre las respuestas anticipadas o las ideas erróneas comunes para la modalidad elegida. 8. Consigna final del docente 'Diga:' que valide el pensamiento de los estudiantes y anticipe la investigación de la unidad. 9. Después de desarrollar completamente una modalidad, proporcione 2 opciones alternativas breves que un docente pueda elegir."
      },
      "EssentialQuestions": {
        "type": "array",
        "description": "Simplemente pegue todas las preguntas esenciales de nivel de unidad en el mismo orden si se proporcionan. Si no se proporcionan, genere exactamente 3 preguntas conceptuales que se centren únicamente en conceptos universales amplios como el cambio, las pruebas, los patrones, las relaciones, los sistemas o el razonamiento. NO mencione ningún término, proceso, vocabulario o ejemplo específico de la materia. Las preguntas deben ser abiertas, transferibles a todas las disciplinas e imposibles de responder solo con el aprendizaje del contenido de la lección o la unidad. Céntrese únicamente en las grandes ideas, no en el tema en cuestión.",
        "items": { "type": "string" }
      },
      "StudentLearningObjectives": {
        "type": "array",
        "description": "Seleccione textualmente los objetivos de aprendizaje de los estudiantes específicos para esta lección a partir de los objetivos a nivel de unidad proporcionados en la consigna. NO invente nuevos objetivos. Debe reutilizar la redacción exacta de Step 0 UnitDescription.StudentLearningObjectives.",
        "items": { "type": "string" }
      },
      "StandardsAligned": {
        "type": "array",
        "description": "Enumere únicamente los estándares educativos únicos abordados en esta lección específica. Cada estándar debe incluir el código del estándar y la descripción y debe ser exactamente el mismo utilizado en la Unidad. p. ej. 'MS-ESS1-1: Desarrollar y utilizar un modelo del sistema Tierra-sol-luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'.",
        "items": { "type": "string" }
      },
      "KeyVocabulary": {
        "type": "array",
        "description": "Seleccione textualmente el vocabulario clave para esta lección a partir del vocabulario a nivel de unidad proporcionado en la consigna. NO invente nuevas palabras. Debe reutilizar la redacción exacta de Step 0 UnitDescription.KeyVocabulary.",
        "items": { "type": "string" }
      },
      "OrientationPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: 'Propósito: Se presenta a los estudiantes un misterio real que despierta la curiosidad y motiva la investigación. Reconocen el problema y activan conocimientos previos para prepararse para una indagación más profunda.'"
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
              "Engage": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion para presentar el fenómeno. Asegúrese de que se centre en despertar la curiosidad sin dar explicaciones científicas." },
                  "FacilitationMoves": { "type": "array", "description": "Genere 2-3 acciones pedagógicas específicas que guíen la observación silenciosa y el intercambio con los compañeros. Incluya guiones que comiencen con 'Diga:' (por ejemplo, 'Diga: Tómense 30 segundos para observar en silencio...'). Céntrese en capturar y organizar las observaciones de los estudiantes en categorías significativas y fomentar múltiples perspectivas.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Genere 2-3 consignas específicas como una sola cadena para ayudar a los estudiantes a identificar detalles, notar patrones y plantear preguntas iniciales. Anime a los estudiantes a explicar por qué ciertos detalles parecen importantes y a construir sobre las observaciones de los demás o contrastarlas." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "Connect": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion docente específico (que comience con 'Diga:') que ayude a los estudiantes a convertir sus observaciones del fenómeno en preguntas o problemas de investigación mientras agrupan las ideas en temas clave." },
                  "PromptingOptions": { "type": "string", "description": "Proporcione 2-3 consignas específicas para ayudar a los estudiantes a conectar las observaciones con los desafíos subyacentes, justificar el pensamiento con pruebas y priorizar qué ideas vale más la pena investigar." },
                  "FacilitationMoves": { "type": "array", "description": "Sugiera 2-3 acciones para apoyar a los estudiantes en el perfeccionamiento y la agrupación de sus ideas, mientras los insta a explicar su razonamiento. Incluya instrucciones para registrar y resaltar las preguntas recurrentes sin responderlas.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Activate": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Desarrolle una instrucción dirigida por el docente ('Diga:') para facilitar el debate en parejas o en grupo que genere ideas, explicaciones o soluciones específicas utilizando la información y las limitaciones disponibles. Fomente la comparación y el razonamiento." },
                  "PromptingOptions": { "type": "string", "description": "Enumere 2-3 consignas para animar a los estudiantes a proponer ideas, explicar el razonamiento, considerar enfoques alternativos y evaluar qué partes de su pensamiento son las más sólidas o las más inciertas." },
                  "FacilitationMoves": { "type": "array", "description": "Describa 2-3 acciones de circulación para escuchar el razonamiento, instar a la claridad/justificación y resaltar los diversos enfoques sin evaluar cuál es el correcto.", "items": { "type": "string" } }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves"],
                "additionalProperties": false
              },
              "Probe": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion para empujar a los estudiantes a refinar y probar sus ideas examinando las suposiciones, considerando diferentes condiciones e identificando los factores clave de esta lección." },
                  "PromptingOptions": { "type": "string", "description": "Sugiera 2-3 consignas específicas para probar las ideas frente a nuevas condiciones, identificar debilidades y revisar el pensamiento utilizando pruebas para los fenómenos de esta lección." },
                  "FacilitationMoves": { "type": "array", "description": "Proporcione 2-3 acciones específicas para animar a los estudiantes a volver a visitar y revisar sus ideas iniciales basándose en las pruebas y justificar los cambios en su pensamiento.", "items": { "type": "string" } },
                  "Closing": { "type": "string", "description": "Una instrucción final para empujar a los estudiantes a probar y revisar sus ideas, considerar los efectos a largo plazo y las condiciones cambiantes, y utilizar las pruebas de las observaciones para fortalecer o desafiar su pensamiento." }
                },
                "required": ["Prompt", "PromptingOptions", "FacilitationMoves", "Closing"],
                "additionalProperties": false
              }
            },
            "required": ["Engage", "Connect", "Activate", "Probe"],
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
      "ConceptualizationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Palabra por palabra: 'Propósito: Los estudiantes generan preguntas de investigación significativas, seleccionan una pregunta central para investigar y crean un plan de acción que guiará su proceso de indagación.'"
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
              "GuideQuestionGeneration": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion docente (que comience con 'Diga:') para presentar la sesión de lluvia de ideas sobre las preguntas. Céntrese en pasar del intercambio individual al intercambio con los compañeros para ampliar las ideas." },
                  "FacilitationMoves": { "type": "array", "description": "Genere 2-3 acciones específicas para apoyar la generación de preguntas por parte de los estudiantes. Incluya el proporcionar tiempo para pensar, registrar todas las preguntas públicamente y animar a los estudiantes a refinar, combinar o ampliar las preguntas sin una evaluación prejuiciosa.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Genere 2-3 consignas específicas para ayudar a los estudiantes a manifestar curiosidades, identificar qué quieren entender y centrarse en aspectos clave del sistema o del diseño." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "IdentifyResearchQuestion": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion ('Diga:') para guiar a los estudiantes en la selección de una pregunta que les ayude a aprender lo máximo posible de un modelo que se pueda probar." },
                  "FacilitationMoves": { "type": "array", "description": "Sugiera 2-3 acciones para guiar a los estudiantes en la clasificación de las preguntas en temas y en la comparación de ideas en función de la posibilidad de ser probadas. Incluya acciones para apoyar a los estudiantes en el perfeccionamiento de preguntas amplias en investigaciones claras mediante la identificación de variables.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Genere 2-3 consignas para ayudar a los estudiantes a evaluar las preguntas en función de su capacidad de prueba, claridad, enfoque en las variables y potencial para generar pruebas útiles." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CreateAnActionPlan": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion ('Diga:') para instar a los estudiantes a definir qué observarán, cambiarán y recopilarán como pruebas." },
                  "FacilitationMoves": { "type": "array", "description": "Describa 2-3 acciones para apoyar a los estudiantes en el diseño de un plan de investigación y la identificación de variables. Incluya acciones para instar a los estudiantes a que los planes sean específicos y se puedan probar, y asegúrese de que tengan una forma clara de determinar el éxito.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Proporcione 2-3 consignas específicas para ayudar a los estudiantes a aclarar qué cambiarán, qué mantendrán igual y cómo compararán los resultados." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              }
            },
            "required": ["GuideQuestionGeneration", "IdentifyResearchQuestion", "CreateAnActionPlan"],
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
      "InvestigationPhase": {
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Escriba palabra por palabra: Propósito: Los estudiantes exploran activamente el fenómeno a través de la observación, el análisis de modelos y la recopilación de pruebas, construyendo un conjunto de datos que luego utilizarán para formar conclusiones"
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
              "LaunchInvestigation": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree instrucciones para el docente para presentar un escenario o modelo desconcertante. Primero proporcione una acción entre corchetes como [Muestre un modelo, escenario, demostración o historia corta que incluya una falla, ineficiencia o resultado inesperado para despertar la curiosidad], luego proporcione el guion conversacional que comience con 'Diga:'." },
                  "FacilitationMoves": { "type": "array", "description": "Genere 2-3 acciones para guiar el lanzamiento. Indique claramente las acciones de instrucción sin anteponerles 'Diga:'. Incluya el dar tiempo a los estudiantes para observar antes de actuar, fomentar múltiples interpretaciones y reforzar que puede haber varias ideas válidas.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Genere 2-3 consignas específicas para ayudar a los estudiantes a notar características importantes o inesperadas, generar posibles explicaciones y justificar el pensamiento con pruebas." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CollaborationExpectations": {
                "type": "object",
                "properties": {
                  "Prompt": { "type": "string", "description": "Cree un guion hablado (que comience con 'Diga:') para enmarcar la tarea como interdependiente y enfatizar la responsabilidad compartida. Incluya instrucciones para que los estudiantes usen inicios de oraciones (p. ej., 'Creo... porque...') y estructuras de participación como fichas de conversación." },
                  "FacilitationMoves": { "type": "array", "description": "Enumere de 3 a 5 acciones específicas o comportamientos de los estudiantes para monitorear durante el trabajo en grupo (p. ej., identificar patrones, registrar en tablas de datos compartidas, comparar interpretaciones). No anteponga 'Diga:' a estas acciones. Asegúrese de que se centren en que todos los estudiantes contribuyan a observar y refinar las ideas.", "items": { "type": "string" } },
                  "PromptingOptions": { "type": "string", "description": "Proporcione 2-3 consignas para animar a los estudiantes a compartir observaciones, comparar interpretaciones, justificar afirmaciones con pruebas y revisar ideas de forma colaborativa." }
                },
                "required": ["Prompt", "FacilitationMoves", "PromptingOptions"],
                "additionalProperties": false
              },
              "CirculationPrompts": {
                "type": "object",
                "description": "Consignas específicas que utilizará el docente mientras circula entre los grupos.",
                "properties": {
                  "Conceptual": { "type": "array", "description": "2-3 consignas centradas en conceptos científicos o de la lección clave (p. ej., '¿Qué pruebas demuestran que esto está funcionando?').", "items": { "type": "string" } },
                  "Reasoning": { "type": "array", "description": "2-3 consignas para instar a la justificación y la lógica (p. ej., '¿Cómo cambia tu pensamiento este ensayo?').", "items": { "type": "string" } },
                  "Collaboration": { "type": "array", "description": "2-3 consignas para asegurar que se incluyan todas las voces (p. ej., '¿Quién no ha contribuido todavía?').", "items": { "type": "string" } }
                },
                "required": ["Conceptual", "Reasoning", "Collaboration"],
                "additionalProperties": false
              }
            },
            "required": ["LaunchInvestigation", "CollaborationExpectations", "CirculationPrompts"],
            "additionalProperties": false
          },
          "AnticipatedMisconceptions": {
            "type": "array",
            "description": "Genere 2-3 ideas erróneas comunes de los estudiantes que probablemente surjan durante esta lección. Cada elemento debe centrarse en un malentendido específico y un guion de respuesta del docente.",
            "items": {
              "type": "object",
              "properties": {
                "Misconception": { "type": "string", "description": "Describa la idea errónea en 1 oración, comenzando con 'Los estudiantes pueden pensar...'. NO use etiquetas de negrita ni de strong." },
                "TeacherResponse": { "type": "string", "description": "Un guion de respuesta claro para el docente (que comience con 'Respuesta del docente: ') que modele cómo responder en el momento con una consigna específica (que comience con 'Diga:'). NO use etiquetas de negrita ni de strong." }
              },
              "required": ["Misconception", "TeacherResponse"],
              "additionalProperties": false
            }
          },
          "Differentiation": {
            "type": "object",
            "properties": {
              "LanguageLearners": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Genere 2-3 apoyos específicos para la lección (elementos visuales, bancos de palabras, gestos) para ayudar a los estudiantes de idiomas a acceder a las ideas y expresarlas.", "items": { "type": "string" } },
                  "SentenceStarters": { "type": "array", "description": "Genere 3-4 inicios de oraciones que ayuden a los estudiantes a describir, explicar y comunicar su pensamiento para esta lección específica.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "SentenceStarters"],
                "additionalProperties": false
              },
              "AdditionalScaffolding": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Genere 2-3 apoyos paso a paso (herramientas estructuradas, ejemplos modelados, pensar en voz alta) y orientación exacta para ayudar a los estudiantes a completar la tarea.", "items": { "type": "string" } },
                  "Checklist": { "type": "array", "description": "Genere 3-4 preguntas de lista de verificación para guiar a los estudiantes a dar sentido a su aprendizaje durante la investigación.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "Checklist"],
                "additionalProperties": false
              },
              "GoDeeper": {
                "type": "object",
                "properties": {
                  "Strategies": { "type": "array", "description": "Genere 2-3 extensiones que aumenten la complejidad (desafíos específicos, identificación de patrones) para ayudar a los estudiantes a profundizar o mejorar su pensamiento utilizando pruebas.", "items": { "type": "string" } },
                  "AdvancedQuestion": { "type": "string", "description": "Genere una consigna/pregunta compleja que comience con 'Diga:' para instar a una comprensión conceptual más profunda." },
                  "ExpectedResponses": { "type": "array", "description": "Genere 3-4 ejemplos específicos de respuestas de estudiantes de alta calidad a la pregunta avanzada.", "items": { "type": "string" } }
                },
                "required": ["Strategies", "AdvancedQuestion", "ExpectedResponses"],
                "additionalProperties": false
              }
            },
            "required": ["LanguageLearners", "AdditionalScaffolding", "GoDeeper"],
            "additionalProperties": false
          },
          "AccommodationsAndModifications": {
            "type": "object",
            "description": "Adaptaciones generales para la clase más planes de apoyo individuales para los estudiantes. El modelo DEBE utilizar ÚNICAMENTE los nombres y planes de los estudiantes proporcionados en la consigna.",
            "properties": {
              "General": {
                "type": "string",
                "description": "Apoyos y modificaciones generales del aula que se aplican a la mayoría o a todos los estudiantes durante esta actividad."
              },
              "IndividualSupport": {
                "type": "array",
                "description": "Lista de adaptaciones específicas para los estudiantes. Cada entrada DEBE utilizar los nombres y planes de los estudiantes exactamente como se proporcionan en la consigna.",
                "items": {
                  "type": "object",
                  "properties": {
                    "StudentName": {
                      "type": "string",
                      "description": "Nombre completo del estudiante exactamente como se proporciona en la consigna."
                    },
                    "Plan": {
                      "type": "array",
                      "description": "Una mezcla de instrucciones y sublistas. Cada entrada tiene un 'item' (como párrafo) y 'subItems' opcionales (como viñetas) para cuando una tarea necesita desglosarse lógicamente.",
                      "items": {
                        "type": "object",
                        "properties": {
                          "item": { "type": "string", "description": "La instrucción principal o el encabezado de la lista." },
                          "subItems": { "type": "array", "description": "Pasos con viñetas opcionales o ejemplos específicos vinculados al elemento.", "items": { "type": "string" } }
                        },
                        "required": ["item", "subItems"],
                        "additionalProperties": false
                      }
                    }
                  },
                  "required": [
                    "StudentName",
                    "Plan"
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
            "properties": {
              "Question": { "type": "string", "description": "Genere una pregunta específica que comience con 'Diga:' para comprobar la comprensión de los estudiantes durante o al final de la investigación." },
              "ExpectedResponses": { "type": "array", "description": "Genere 3-4 respuestas esperadas de los estudiantes que muestren el dominio del concepto de la lección.", "items": { "type": "string" } }
            },
            "required": ["Question", "ExpectedResponses"],
            "additionalProperties": false
          }
        },
        "required": [
          "Purpose",
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
        "type": "object",
        "description": "",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Escriba palabra por palabra: Propósito: Los estudiantes analizan los datos recopilados y utilizan pruebas para responder a la pregunta de investigación, formando una explicación clara basada en sus hallazgos."
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
              "OpeningScript": { "type": "string", "description": "Una declaración que comience con 'Diga:' para que los estudiantes vuelvan a la pregunta de investigación y saquen a la luz las ideas emergentes sobre cómo funciona el diseño." },
              "FacilitationMoves": { "type": "array", "description": "2-3 acciones pedagógicas para dar tiempo a los estudiantes para revisar los datos, identificar patrones y comparar los resultados a través del debate.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 preguntas específicas para instar a los estudiantes a explicar los patrones, justificar las decisiones con pruebas y describir las relaciones de causa y efecto.", "items": { "type": "string" } },
              "WritingPrompt": { "type": "string", "description": "Una declaración que comience con 'Diga:' que describa lo que debe incluir su explicación escrita (componentes específicos del contenido) y un recordatorio para utilizar los datos como pruebas." },
              "CollaborationInstruction": { "type": "string", "description": "Instrucción para que los estudiantes escriban de forma independiente y luego compartan con un compañero o grupo para refinar su razonamiento." },
              "Guardrail": { "type": "string", "description": "Un recordatorio firme de que el docente NO debe proporcionar la explicación científica, sino instar a los estudiantes a que señalen los datos." }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions", "WritingPrompt", "CollaborationInstruction", "Guardrail"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "3-4 respuestas que respondan directamente a la pregunta de investigación utilizando pruebas y razonamiento de causa y efecto (p. ej., 'cuando cambiamos ___, sucedió ___').",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "DiscussionPhase": {
        "type": "object",
        "properties": {
          "Purpose": {
            "type": "string",
            "description": "Escriba palabra por palabra: Propósito: Ayudar a los estudiantes a pasar de lo que descubrieron a por qué es importante."
          },
          "Materials": {
            "type": "array",
            "description": "Lista de materiales requeridos (por ejemplo, ayudas visuales, marcadores, etc.)",
            "items": { "type": "string" }
          },
          "InstructionsForTeachers": {
            "type": "object",
            "properties": {
              "OpeningScript": { "type": "string", "description": "Una declaración que comience con 'Diga:' para instar a los estudiantes a pensar en las implicaciones más amplias de sus pruebas fuera del aula." },
              "FacilitationMoves": { "type": "array", "description": "2-3 acciones pedagógicas para animar a los estudiantes a debatir con compañeros/grupos y generar sus propios ejemplos de impacto en el mundo real.", "items": { "type": "string" } },
              "ProbingQuestions": { "type": "array", "description": "3-4 preguntas específicas para conectar los resultados de la investigación con la vida cotidiana, los problemas de la comunidad o el rediseño de sistemas.", "items": { "type": "string" } }
            },
            "required": ["OpeningScript", "FacilitationMoves", "ProbingQuestions"],
            "additionalProperties": false
          },
          "TranscendentThinking": {
            "type": "object",
            "properties": {
              "Question": { "type": "string", "description": "Genere 1 pregunta de pensamiento trascendente que requiera que los estudiantes apliquen el aprendizaje más allá de sí mismos a contextos del mundo real (comunidades, desafíos globales). Céntrese en por qué el aprendizaje es importante a escala (seguridad, sostenibilidad, innovación, etc.). Evite el enfoque personal/solo escolar." }
            },
            "required": ["Question"],
            "additionalProperties": false
          },
          "ExpectedStudentResponses": {
            "type": "array",
            "description": "4-5 respuestas que ilustren cómo los estudiantes podrían aplicar su comprensión a contextos auténticos del mundo real o a la resolución de problemas orientada al futuro.",
            "items": { "type": "string" }
          }
        },
        "required": [
          "Purpose",
          "Materials",
          "InstructionsForTeachers",
          "TranscendentThinking",
          "ExpectedStudentResponses"
        ],
        "additionalProperties": false
      },
      "ReviewAndSpacedRetrieval": {
        "type": "object",
        "description": "Sección completa de 'Repaso y recuperación espaciada'. Esta actividad de 5 minutos debe incluir: 1. Instrucciones para docentes que contengan: - Consigna de recuperación activa utilizando el intercambio en parejas/grupos - Respuestas esperadas de los estudiantes (2-3 ejemplos con viñetas) 2. Conexión con la pregunta esencial 3. Sección de pensamiento trascendente 4. Componente de recuperación espaciada que contenga: - Referencia clara a una lección anterior específica - Pregunta que conecte conceptos pasados y actuales - Criterios de éxito detallados / respuestas esperadas. Todas las secciones deben utilizar declaraciones 'Diga:' para las consignas del docente y etiquetas claras de 'Respuestas esperadas de los estudiantes' que muestren 2-3 ejemplos de respuestas.",
        "properties": {
          "InstructionsForTeachers": {
            "type": "object",
            "description": "Orientación paso a paso para el docente para la sesión de repaso y recuperación espaciada de 5 minutos.",
            "properties": {
              "ActiveRecall": {
                "type": "object",
                "description": "Incite a los estudiantes a recordar el aprendizaje clave de la lección de hoy utilizando únicamente pruebas de la investigación.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Un guion docente específico (que comience con 'Diga:') que inste a los estudiantes a reflexionar sobre la investigación de hoy y lo que reveló sobre el sistema."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "3-4 ejemplos de respuestas de estudiantes de alta calidad que muestren un uso claro de las pruebas.",
                    "items": { "type": "string" }
                  }
                },
                "required": ["Question", "ExpectedStudentResponses"],
                "additionalProperties": false
              },
              "EssentialQuestionConnection": {
                "type": "object",
                "description": "Ayude a los estudiantes a conectar las pruebas específicas de hoy con las preguntas esenciales de la unidad más amplias.",
                "properties": {
                  "Question": {
                    "type": "string",
                    "description": "Un guion docente (que comience con 'Diga:') que vincule los hallazgos de hoy con una de las preguntas esenciales de la unidad."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "2-3 ejemplos de cómo los estudiantes justifican la conexión utilizando pruebas.",
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
                    "description": "Un guion docente (que comience con 'Diga:') que conecte explícitamente un concepto de una lección anterior con el trabajo de hoy. Debe incluir la metarreferencia (p. ej., '(Draws from Unit 1, Lesson 2.)') directamente en el texto."
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
      "FormativeAssessment": {
        "type": "string",
        "description": "Sección completa de 'Evaluación formativa' como texto sin formato. Debe seguir esta estructura: Un párrafo de introducción para el docente que indique brevemente el propósito y cómo implementarlo. 4 consignas de preguntas requeridas etiquetadas como 'Consigna 1 (DOK 1):', 'Consigna 2 (DOK 2):', etc., que cubran los niveles DOK 1-4. Para cada consigna: - Pregunta que evalúe la comprensión al nivel DOK indicado - Encabezado 'Respuestas esperadas de los estudiantes' (sin marcas de verificación ni emojis) - 1-2 respuestas en oraciones completas que muestren el dominio Termine con un párrafo corto que nombre la estrategia de evaluación formativa específica a utilizar (p. ej., 'Ticket de salida', 'Pensar-Pareja-Compartir'). Ejemplo de formato: Consigna 1 (DOK 1): '¿Por qué los planetas permanecen en órbita en lugar de salir volando al espacio?' Respuestas esperadas de los estudiantes 'Porque su movimiento hacia adelante y la gravedad del Sol trabajan juntos para crear una órbita estable.' [Continúe con las Consignas 2-4 siguiendo la misma estructura]"
      },
      "StudentPractice": {
        "type": "object",
        "description": "Sección completa de 'Práctica del estudiante' para tareas / práctica fuera de clase.",
        "properties": {
          "Tasks": {
            "type": "array",
            "description": "Genere 3 tareas que cubran los niveles DOK 2 y 3.",
            "items": {
              "type": "object",
              "properties": {
                "TaskTitle": { "type": "string", "description": "p. ej., '1. (DOK 2)'" },
                "Instruction": { "type": "string", "description": "Instrucciones claras paso a paso para el estudiante para la tarea." },
                "SuccessCriteria": { "type": "array", "description": "4-5 puntos de prueba específicos que muestren cómo es el dominio para esta tarea. CRÍTICO: Cada criterio DEBE comenzar con un verbo de acción (p. ej., 'Describe', 'Explica', 'Utiliza').", "items": { "type": "string" } }
              },
              "required": ["TaskTitle", "Instruction", "SuccessCriteria"],
              "additionalProperties": false
            }
          },
          "Reflection": {
            "type": "object",
            "description": "Termine con reflexiones de autorregulación o pensamiento trascendente.",
            "properties": {
              "Instruction": { "type": "string", "description": "Instrucción para la sección de reflexión (p. ej., 'Escriba 2 o 3 oraciones respondiendo a una consigna:')." },
              "Prompts": { "type": "array", "description": "4-5 consignas de reflexión específicas que conecten la investigación de hoy con la vida real, herramientas futuras o el aprendizaje personal.", "items": { "type": "string" } }
            },
            "required": ["Instruction", "Prompts"],
            "additionalProperties": false
          }
        },
        "required": ["Tasks", "Reflection"],
        "additionalProperties": false
      }
    },
    "required": [
      "AssessPriorKnowledge",
      "OrientationPhase",
      "ConceptualizationPhase",
      "InvestigationPhase",
      "ConclusionPhase",
      "DiscussionPhase",
      "ReviewAndSpacedRetrieval",
      "FormativeAssessment",
      "StudentPractice",
      "EssentialQuestions",
      "StudentLearningObjectives",
      "StandardsAligned",
      "KeyVocabulary"
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
  }
};
