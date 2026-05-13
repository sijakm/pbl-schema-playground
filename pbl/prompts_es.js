window.pblPrompts_es = (function() {
const defaultPrompt = `Cree un plan de unidad y lecciones basadas en proyectos utilizando la información a continuación:
Materia de la unidad:
{{$Subject}}
Nombre de la unidad:
{{$Name}}
Descripción/Instrucciones de la unidad:
{{$UserPrompt}}
Nivel de grado:
{{$GradeLevel}}
Duración del proyecto en días:
{{$NumberOfDays}}
Ubicación:
{{$Location}}
Recursos/Medios a utilizar:
{{$MediaContext}},
Contenido de la unidad:
{{$AttachedUnit}}
Planes de aprendizaje de los estudiantes:
{{$LearningPlans}}
Estándares a alinear:
{{$Standards}}
Su tarea es diseñar una unidad detallada basada en proyectos utilizando principios de la ciencia cognitiva. Su resultado DEBE seguir el orden exacto de las secciones, los encabezados y las reglas de contenido a continuación. Si falta alguna sección o está fuera de orden, regenere hasta que se cumplan todas las restricciones.
Reglas de salida globales (se aplican a todo): Siga el orden de las secciones y los encabezados exactos que se muestran a continuación. No añada secciones adicionales ni cambie el nombre de los encabezados. Los problemas del mundo real deben ser relevantes para los estudiantes de este nivel de grado. Evite temas que puedan ser sensibles a la adecuación del desarrollo de los temas, así como temas sensibles como la pobreza, la inseguridad en la vivienda, la raza, etc., o temas controvertidos como la evolución. Incluya los siguientes componentes en el diseño del proyecto de la unidad.
Relevancia cultural e inclusión: Incorpore múltiples perspectivas y reflexione sobre los impactos para todos los involucrados. El contenido debe conectar con estudiantes de diversos orígenes y comunidades para crear lecciones culturalmente relevantes y receptivas. Evite los estereotipos.
IMPORTANTE: la respuesta debe estar en {{$ResponseLanguage}}`;
const unitDescriptionHtmlPrompt = `Usted es un formateador HTML profesional.
Recibirá:
- UnitDescription (cadena)

Devuelva ÚNICAMENTE HTML.
NO añada explicaciones.
NO invente contenido.

Renderice el HTML utilizando EXACTAMENTE esta plantilla:

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

<p>UnitDescription</p>

DATOS:
{{{JsonResponse}}}`;
const assessPriorKnowledgeHtmlPrompt = `Usted es un formateador HTML educativo profesional que escribe para maestros de aula.
Recibirá UN campo de texto sin formato que describe una actividad de Evaluación de Conocimientos Previos (Assess Prior Knowledge).
PUEDE reorganizar y reformular el contenido proporcionado para que sea amigable para el maestro.
NO DEBE inventar nuevas actividades o ideas más allá de lo que está presente.

Devuelva ÚNICAMENTE HTML válido.
NO añada explicaciones ni comentarios.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

SOLO ETIQUETAS PERMITIDAS:
<p>, <h3>, <strong>, <em>, <span>, <ol>, <ul>, <li>

ESTRUCTURA RÍGIDA (DEBE SEGUIRSE):

1) Comience con este encabezado exacto:
<h3><span style="color: rgb(115, 191, 39);">💡 Evaluar conocimientos previos</span></h3>

2) Inmediatamente después del encabezado, SIEMPRE renderice este texto de Propósito exactamente como está escrito:
<p><strong>Propósito:</strong> Activar los conocimientos previos de los estudiantes no es solo un calentamiento; es neurociencia en acción. Cuando los estudiantes recuerdan lo que ya creen o recuerdan sobre materiales, partículas o cambios químicos, activan las vías neuronales existentes. Esta “codificación elaborativa” facilita que el cerebro conecte nuevos conceptos de química con lo que ya se sabe, fortaleciendo la retención a largo plazo. Esta actividad le ayuda a descubrir ideas precisas, ideas parciales y conceptos erróneos que se convertirán en anclas poderosas para el aprendizaje a lo largo del proyecto.</p>

3) Renderice una sección "Diga:" dirigida al maestro.
- Incluso si el texto de entrada NO contiene explícitamente "Diga:"
- Sintetice o reformule el contenido existente en 1 o 2 párrafos claros de discurso del maestro
- Comience con:
<p><strong>Diga:</strong></p>
- Siga con uno o más elementos <p>

4) Cualquier tarea, indicación, declaración o instrucción para el estudiante:
- Renderice como <ol> o <ul>
- Cada elemento DEBE ser un solo <li>
- NADA de <p> u otras etiquetas dentro de <li>

5) Cuando aparezcan respuestas esperadas o de modelo del estudiante:
- Renderice esta etiqueta EXACTA:
<p>✅ Respuestas esperadas de los estudiantes</p>
- Luego renderice todas las respuestas esperadas como una <ul> solo con <li>
- NADA de listas anidadas
- NADA de <p> dentro de <li>

6) Si aparecen opciones alternativas o variaciones:
- Renderice:
<p><strong>Opciones alternativas:</strong></p>
- Luego una <ul> con elementos <li> breves

NO:
- Use etiquetas que no estén en la lista
- Anide listas
- Omita la sección de Propósito
- Invente nuevo contenido educativo, pero use todas las ideas proporcionadas

TEXTO DE ENTRADA:
{{{JsonResponse}}}`;
const unitOverviewHtmlPrompt = `Usted es un formateador HTML educativo profesional que escribe un documento de lanzamiento de proyecto para estudiantes.
Recibirá contenido estructurado sobre la Descripción general de la unidad (Unit Overview).
PUEDE reorganizar y reformular ligeramente el contenido para mayor claridad y un flujo más natural.
NO DEBE inventar contenido nuevo.

Devuelva ÚNICAMENTE HTML válido.
NO incluya explicaciones en su respuesta.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

SOLO ETIQUETAS PERMITIDAS:
<p>, <h3>, <strong>, <span>, <ul>, <li>

ESTRUCTURA RÍGIDA (DEBE SEGUIRSE):

1) Encabezado de la sección:
<h3><span style="color: rgb(115, 191, 39);">Tarea de la unidad</span></h3>

2) Propósito (Purpose): renderice EXACTAMENTE como se escribe a continuación:
<p><strong>Propósito:</strong> Sumergir a los estudiantes en un desafío/problema del mundo real verdaderamente convincente que despierte la curiosidad, sitúe el aprendizaje en un contexto auténtico, presente la pregunta impulsora y defina claramente la misión y el producto final en el que trabajarán.</p>

3) Declaración de la tarea (Task Statement)
- Renderice como párrafos narrativos dirigidos directamente a los estudiantes
- Mantenga el tono original y la autenticidad

4) Misión (Mission)
- Debe comenzar con las palabras: "Su tarea es..."

5) Contexto del proyecto y partes interesadas (Stakeholders)
- Un párrafo narrativo

6) Pregunta impulsora (Driving Question)
<h3><span style="color: rgb(115, 191, 39);">Pregunta impulsora</span></h3>
- Renderice la pregunta en un párrafo independiente.

7) Requisitos del producto final (Final Deliverable Requirements)
<h3><span style="color: rgb(115, 191, 39);">Producto final</span></h3>
- Renderice como una lista <ul> exclusiva con elementos <li> individuales. Resalte en negrita los encabezados principales dentro del producto. Asegúrese de utilizar este texto de los requisitos (Resumen, Plan de concepto y propósito, Justificación, Modelo/Representación, Solución/Veredicto).

8) Llamado a la acción motivacional de cierre (Closing Call to Action)
- Párrafo motivador final en la parte inferior

PROHIBIDO:
- No incluya notas/sugerencias para el maestro
- No incluya estándares ni rúbricas de evaluación
- No use listas anidadas
- No use ninguna etiqueta HTML que no figure como permitida

CONTENIDO:
Declaración de la tarea:
{{{JsonResponse}}}`;
const desiredOutcomesHtmlPrompt = `Recibirá UN objeto JSON que representa la sección "Resultados deseados" (Desired Outcomes).
Su tarea es generar el HTML para esta sección utilizando la estructura EXACTA que se describe a continuación.

Reglas:
- Devuelva ÚNICAMENTE HTML válido.
- NO añada explicaciones ni comentarios.
- NO invente ni altere el contenido.
- Utilice ÚNICAMENTE la información proporcionada en el JSON.
- Utilice ÚNICAMENTE estas etiquetas:
<p>, <h3>, <strong>, <span>, <ul>, <ol>, <li>
- Dentro de <ul> o <ol>, solo los elementos <li> pueden ser hijos directos.
- NO anide <p>, <span>, <ul> o <ol> dentro de la etiqueta <li>.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

ESTRUCTURA HTML A RENDERIZAR (EN ESTE ORDEN EXACTO):

1) Encabezado "Estándares alineados":
<h3><span style="color: rgb(115, 191, 39);">📏 Estándares alineados</span></h3>
<ul>
<li>Cada estándar de StandardsAligned</li>
</ul>

2) Grandes ideas y preguntas esenciales:
<h3><span style="color: rgb(115, 191, 39);">💭 Grandes ideas y preguntas esenciales</span></h3>
<p><strong>Propósito:</strong> Establecer los conceptos amplios y duraderos que anclan los resultados de aprendizaje de la unidad, guían el desarrollo de preguntas esenciales y evaluaciones, y brindan a los estudiantes un marco general que conecta todas las tareas, habilidades y actividades en un entendimiento significativo y transferible.</p>

Para CADA elemento en BigIdeasAndEssentialQuestions, renderice:
<p><strong>Gran idea:</strong> {BigIdea}</p>
<ul>
<li><strong>Pregunta esencial:</strong> {EssentialQuestion}</li>
</ul>

3) Objetivos de aprendizaje:
<h3><span style="color: rgb(115, 191, 39);">🎯 Objetivos de aprendizaje</span></h3>

Renderice las siguientes TRES secciones EN ESTE ORDEN:

A) Los estudiantes comprenderán que...
<p><strong>🎯 Los estudiantes comprenderán que...</strong></p>
<ul>
<li>Cada elemento de StudentsWillUnderstandThat</li>
</ul>

B) Los estudiantes sabrán que...
<p><strong>🎯 Los estudiantes sabrán que...</strong></p>
<ul>
<li>Cada elemento de StudentsWillKnowThat</li>
</ul>

C) Los estudiantes podrán...
<p><strong>🎯 Los estudiantes podrán...</strong></p>
<ul>
<li>Cada elemento de StudentsWillBeAbleTo</li>
</ul>

ENTRADA JSON:
{{{JsonResponse}}}`;
const framingTheProjectHtmlPrompt = `Usted es un formateador HTML educativo profesional para documentación docente.
Recibirá UN objeto JSON que representa la sección "Enmarcar el aprendizaje" (Framing The Learning).

Devuelva ÚNICAMENTE HTML válido.
NO añada explicaciones.
NO invente contenido.
NO proporcione ningún resultado que no sea el código HTML.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

Etiquetas permitidas:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

REGLA PARA LISTAS (MUY IMPORTANTE):
- Dentro de <ul> o <ol>, solo <li> pueden ser hijos directos.
- NUNCA coloque <p>, <span>, <ul>, <ol> ni ninguna otra etiqueta dentro de la etiqueta <li>.

REGLA PARA COLORES:
Todos los ENCABEZADOS DE LAS SECCIONES PRINCIPALES deben representarse exactamente así:
<h3><span style="color: rgb(115, 191, 39);">ENCABEZADO</span></h3>

--------------------------------------------------
ORDEN Y ESTRUCTURA DE RENDERIZADO (REGLA ESTRICTA)
--------------------------------------------------

1 PREGUNTA IMPULSORA (ENCABEZADO VERDE)
<h3><span style="color: rgb(115, 191, 39);">Pregunta impulsora</span></h3>

Luego renderice este párrafo EXACTO palabra por palabra:
<p>
<strong>Propósito:</strong> Proporcionar un punto focal claro que se alinee estrictamente con el problema central de la unidad, dirigir las investigaciones de los estudiantes hacia los conocimientos y habilidades específicos que deben desarrollar y garantizar que todo el trabajo del proyecto —incluyendo la investigación, el modelado y la aplicación— contribuya de manera constante a responder una pregunta significativa del mundo real.
</p>

Luego renderice:
<p><strong>Pregunta:</strong> {{framing.DrivingQuestion}}</p>

--------------------------------------------------

2 PROBLEMA (ENCABEZADO VERDE)
<h3><span style="color: rgb(115, 191, 39);">Problema</span></h3>

Luego renderice este párrafo de Propósito EXACTO sobre el objetivo:
<p>
<strong>Propósito:</strong> Articular un problema del mundo real impactante y convincente que sea la base de la unidad, orientando a los estudiantes hacia la creación de soluciones significativas y permitiendo a los maestros identificar audiencias y contextos auténticos que transformen el proyecto de un ejercicio teórico en un trabajo útil y con un propósito real.
</p>

Luego renderice TODO el contenido de:
{{framing.Problem}}

PUEDE:
- Dividir en varios párrafos
- Usar <strong> para enfatizar
- Usar <ul><li> solo si la estructura del texto original lo requiere

NO DEBE omitir ninguna idea.

--------------------------------------------------

3 PROYECTO (ENCABEZADO VERDE)
<h3><span style="color: rgb(115, 191, 39);">Proyecto</span></h3>

Luego renderice este párrafo de Propósito EXACTO sobre el objetivo:
<p>
<strong>Propósito:</strong> Resaltar la manera en que los estudiantes abordarán activamente el problema definido claramente pero relevante localmente, a través de un flujo de proyecto estructurado pero flexible que equilibre la elección de los estudiantes con el flujo de trabajo y las tareas comunes, asegurando oportunidades constantes para hacer visible el pensamiento y proporcionando la instrucción necesaria para que los estudiantes creen, refinen e implementen sus propias soluciones basadas en evidencia.
</p>

Luego renderice TODO el contenido de:
{{framing.Project}}

--------------------------------------------------

4 LUGAR (ENCABEZADO VERDE)
<h3><span style="color: rgb(115, 191, 39);">Lugar (Entorno)</span></h3>

Luego renderice este párrafo de Propósito EXACTO sobre el objetivo:
<p>
<strong>Propósito:</strong> Identificar el contexto único de la comunidad local, reconociendo ubicaciones físicas y audiencias auténticas que añadirán importancia y validez a la tarea y profundizarán el compromiso del estudiante. Orientar experiencias de aprendizaje dirigidas —como trabajo de campo, asociaciones locales y presentaciones públicas— para que el proyecto permanezca arraigado en la realidad del lugar donde los estudiantes viven, aprenden y crean soluciones.
</p>

Luego renderice:
<p>{{framing.Place.PlaceOverview}}</p>

Luego, para cada sitio en Place.Sites, renderice en este orden:
<p><strong>Sitio / Ubicación: {TheSite}</strong></p>
<ul>
<li><strong>Participación:</strong> {Engagement}</li>
<li><strong>Relevancia:</strong> {Relevance}</li>
</ul>

Al final, renderice el último recordatorio debajo de la lista:
<p><em>{{framing.Place.PlaceMattersReminder}}</em></p>

--------------------------------------------------

5 VOCABULARIO CLAVE (ENCABEZADO VERDE)
<h3><span style="color: rgb(115, 191, 39);">🔤 Vocabulario clave</span></h3>
<p>{{framing.KeyVocabulary.VocabularyRationale}}</p>

Para cada nivel (Tier) en orden, renderice lo siguiente:
<p><strong>{TierTitle}</strong></p>
<p><em>{TierWhyItMatters}</em></p>
<ul>
<li><strong>TÉRMINO</strong>: Definición (StandardsConnection)</li>
</ul>

Cada término DEBE estar dentro de su propia etiqueta <li>.
NO anide listas.

DATOS JSON DE ENTRADA:
{{{JsonResponse}}}`;
const assesmentPlanHtmlPrompt = `Usted es un formateador HTML educativo profesional para documentación docente.
Recibirá UN objeto JSON que representa la sección "Plan de evaluación" (Assessment Plan).

Devuelva ÚNICAMENTE HTML válido.
NO añadir explicaciones.
NO inventar contenido.
NO proporcionar ningún resultado que no sea el código HTML.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

Etiquetas permitidas:
<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>

REGLA PARA LISTAS (MUY IMPORTANTE):
- Dentro de <ul> o <ol>, solo <li> pueden ser hijos directos.
- NUNCA coloque <p>, <span>, <ul>, <ol> ni ninguna otra etiqueta dentro de la etiqueta <li>.

REGLA PARA COLORES:
Todos los ENCABEZADOS VERDES deben representarse exactamente así:
<h3><span style="color: rgb(115, 191, 39);">ENCABEZADO</span></h3>

--------------------------------------------------
ESTRUCTURA DE RENDERIZADO (REGLA ESTRICTA)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Evaluación alineada / Evidencia y Criterios de éxito</span></h3>
Luego renderice este párrafo de Propósito EXACTO palabra por palabra:
<p>
<strong>Propósito:</strong> Garantizar que todas las evaluaciones y criterios de éxito estén alineados intencional y transparentemente con los objetivos de aprendizaje de la unidad. Al proporcionar medidas precisas de la comprensión de los estudiantes, se crean oportunidades para que los estudiantes construyan criterios junto con el maestro, lo que aumenta la claridad, el sentido de propiedad y la autorregulación de los estudiantes en el proceso de lograr resultados de alta calidad basados en estándares establecidos.
</p>

--------------------------------------------------
EVALUACIÓN FORMATIVA / CRITERIOS DE ÉXITO
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Rúbrica de evaluación formativa</span></h3>

Renderice CADA elemento de evaluación formativa (Formative Assessment) como un bloque vertical siguiendo la estructura a continuación.
Repita esta estructura completamente para cada elemento en el orden recibido.

ESTRUCTURA OBLIGATORIA:
<p><strong>Criterio de éxito:</strong> {CriteriaForSuccess}</p>
<p><strong>Indicadores de éxito:</strong> {SuccessCriteria}</p>
<p><strong>Punto de demostración:</strong> {PointOfDemonstration}</p>
<p>--------------------------------------------------</p>
NO combine diferentes elementos.
NO use listas.
NO omita ninguna línea.

--------------------------------------------------
RÚBRICA ANALÍTICA (ANALYTIC RUBRIC)
--------------------------------------------------

<h3><span style="color: rgb(145,56,230);">Rúbrica analítica</span></h3>

Para CADA fila en el campo AnalyticRubric, genere un bloque agrupado:
<p><strong>Criterio:</strong> {Criterion}</p>
<ul>
<li><strong>Novato:</strong> {Novice}</li>
<li><strong>Aprendiz:</strong> {Apprentice}</li>
<li><strong>Practicante:</strong> {Practitioner}</li>
<li><strong>Experto:</strong> {Expert}</li>
</ul>

--------------------------------------------------
AUDIENCIA AUTÉNTICA (AUTHENTIC AUDIENCE)
--------------------------------------------------

<h3><span style="color: rgb(115, 191, 39);">Audiencia auténtica</span></h3>
<p>
<strong>Propósito:</strong> Identificar e involucrar a una audiencia real fuera del aula, lo que profundiza la importancia y el realismo del compromiso de los estudiantes. Al mismo tiempo, se anima a los estudiantes a seleccionar ellos mismos a las partes interesadas, expertos o miembros de la comunidad, cuya participación refuerza el sentido de propiedad, la motivación y la calidad de los productos finales.
</p>

<p><strong>Audiencia primaria</strong></p>
<p>{{assessment.AuthenticAudience.PrimaryAudienceDescription}}</p>

<p><strong>Por qué esta audiencia está calificada</strong></p>
<p>{{assessment.AuthenticAudience.WhyThisAudienceIsQualified}}</p>

<p><strong>Cómo esta audiencia eleva el proyecto</strong></p>
<p>{{assessment.AuthenticAudience.HowThisAudienceElevatesTheProject}}</p>

<p><strong>Participación de los estudiantes en la selección de la audiencia</strong></p>
<p>{{assessment.AuthenticAudience.StudentParticipationInAudienceSelection}}</p>

DATOS JSON DE ENTRADA:
{{{JsonResponse}}}`;
const learningPlanHtmlPrompt = `Usted es un formateador HTML educativo profesional.
Recibirá UN objeto JSON que representa la sección del plan de lecciones "Plan de aprendizaje" (Learning Plan).
Su tarea es renderizar un código HTML limpio para maestros que explique claramente el flujo del proyecto por fases.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

REGLAS CRÍTICAS:
- Devuelva ÚNICAMENTE HTML válido.
- Etiquetas permitidas: <p>, <h2>, <h3>, <strong>, <ul>, <li>, <span>.
- NO use tablas, div, section, header u otras etiquetas no permitidas.
- NO invente contenido.
- NO omita información.
- Se permite un reformulado ligero ÚNICAMENTE para mejorar la claridad y organización del texto.
- Las listas SOLO se pueden usar donde el JSON ya presenta una lista de elementos.
- Nunca coloque <p>, <ul> o <span> dentro de las etiquetas <li>.

ESTRUCTURA DE SECCIONES (ORDEN OBLIGATORIO):

1. Encabezado verde: Descripción general del plan de aprendizaje (Learning Plan Overview)
- Renderice el resumen del plan ("LearningPlanOverview") como un párrafo normal.

2. Para CADA Fase (Phase):
- Encabezado de la fase en formato: <h3><span style="color: rgb(145,56,230);">ENCABEZADO DE LA FASE</span></h3>
- Descripción de la fase (como párrafo)
- Conceptos o habilidades clave (etiqueta en negrita + párrafo)
- Colaboración y pensamiento visible (etiqueta en negrita + párrafo)
- Experiencias de aprendizaje clave (como lista)

3. Encabezado en negrita: Objetivos del proyecto <h3><span style="color: rgb(145,56,230);">Objetivos del proyecto</span></h3>
- Renderice cada objetivo ("ProjectGoal") como un bloque de párrafo independiente con el nombre en negrita.

4. Encabezado en negrita: Resumen del producto final (Final Deliverable Summary)
- Renderice el resumen del producto exclusivamente en forma de lista <ul>.

5. Encabezado verde: Sugerencias de agrupación (Group Suggestions)
- Tamaño del grupo (texto en negrita al principio + párrafo)
- Roles y responsabilidades rotativos (lista)

<p><strong>Pregunta orientadora para la planificación docente</strong></p>
<p>Para ayudar a los maestros a tomar decisiones acertadas sobre la agrupación, SIEMPRE adjunte este mensaje a continuación dentro de la respuesta:</p>
<ul>
  <li>“¿Cuál es el propósito principal de su agrupación en la siguiente actividad: apoyo de pares, discusión enriquecedora, desafío o mera eficiencia operativa? Al nombrar el propósito real, pregúntese qué enfoque de agrupación se adapta mejor a su objetivo: habilidades mixtas, grupos basados en intereses, grupos basados en habilidades o simplemente asignación aleatoria”.</li>
  <li>Esta pregunta anima encarecidamente al maestro a elegir métodos de agrupación inteligentes que se alineen con los objetivos educativos en lugar de ceder al hábito.</li>
</ul>

<p><strong>Recomendaciones de estrategia de agrupación</strong></p>
<p>Además de las notas, los maestros pueden considerar las siguientes distinciones:</p>
<ul>
  <li><strong>Grupos de habilidades mixtas:</strong> Son más adecuados cuando las tareas requieren razonamiento, comparación de evidencia e intercambio entre diferentes niveles de preparación.</li>
  <li><strong>Grupos basados en intereses:</strong> Una apuesta segura para construir trabajos creativos. Permite a los estudiantes colaborar en temas que les apasionan, lo que lleva a una mejor conexión dentro del grupo.</li>
  <li><strong>Grupos basados en habilidades:</strong> Útiles cuando se requieren operaciones de trabajo que necesitan precisión técnica o repetición (por ejemplo, construir un modelo a partir de una plantilla).</li>
  <li><strong>Grupos aleatorios:</strong> Útiles al comienzo de los proyectos para construir la comunidad del aula y romper la dependencia de los mismos grupos.</li>
</ul>

FORMATO DE ENCABEZADO VERDE: <h3><span style="color: rgb(115, 191, 39);">ENCABEZADO</span></h3>
FORMATO DE ENCABEZADO EN NEGRITA: <p><strong>ENCABEZADO</strong></p>

JSON DEL PLAN DE APRENDIZAJE:
{{{JsonResponse}}}`;
const teacherGuidancePhase1HtmlPrompt = `Usted es un formateador HTML educativo profesional.
Recibirá UN objeto JSON que representa la sección TeacherGuidancePhase1.
Su tarea es renderizar un código HTML limpio para maestros que coincida con el horario de la lección.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

REGLAS CRÍTICAS:
- Devuelva ÚNICAMENTE HTML5 válido.
- Etiquetas permitidas ÚNICAMENTE: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NO invente contenido.
- NO omita información.
- NO coloque <p>, <ul> o <span> dentro de la etiqueta <li>.
- Las listas solo se pueden usar si el campo JSON es una matriz.
- Mantenga el orden lógico exactamente como se especifica a continuación.

ORDEN DE SECCIONES:
<h3><span style="color: rgb(115, 191, 39);">Fase 1 – Lanzamiento (Launch)</span></h3>

1. Declaración de enfoque (Focus Statement)
- Etiquete en negrita "Declaración de enfoque" y créela como un párrafo.
- Renderice Phase1_FocusStatement dentro del párrafo.

2. Actividades colaborativas (encabezado en negrita)
- Cada actividad debe contener:
  - Título de la actividad <h3><span style="color: rgb(145,56,230);">TÍTULO DE LA ACTIVIDAD</span></h3>
  - Rol del maestro (Teacher Role)
  - Experiencia del estudiante (Student Experience)
  - Artefactos de aprendizaje (Artifacts of Learning) — en forma de lista

3. Preguntas orientadoras (Guiding Questions)
- Título en color púrpura (rgb(145,56,230))
- Lista

4. Diferenciación (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferenciación</strong></p>
<ul>
<li><strong>Aprendices del idioma: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Estudiantes que necesitan apoyo adicional: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Para estudiantes avanzados: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Adaptaciones y modificaciones (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Adaptaciones y modificaciones</strong></p>
- Apoyo general:
  - Comience el párrafo con la etiqueta: <p><strong>Apoyo general:</strong></p>
  - Renderice cada elemento de {{{AccommodationsAndModifications_General}}} como un <li> dentro de una <ul>.
- Apoyo individualizado (OBLIGATORIO PARA CADA INDIVIDUO):
  - <p><strong>Apoyo individualizado:</strong></p>
  - Para cada estudiante en {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nombre del estudiante en color rojo: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Lista <ul> con dos <li>: {{PlanProvided}} y {{PlanImplementation}}.

6. Conceptos erróneos anticipados (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Conceptos erróneos anticipados</strong></p>
- Par: concepto erróneo + respuesta del maestro en forma de lista numerada.

7. Pensamiento trascendente (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pensamiento trascendente</strong></p>
- Pregunta / Indicación
- Respuestas esperadas de los estudiantes con el título <p>✅ Respuestas esperadas de los estudiantes:</p> y lista.

8. Comprobaciones rápidas (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Comprobaciones rápidas</strong></p>
- Momento (inicio -> mitad -> final de la fase)
- Pregunta
- Respuestas esperadas o Criterios de éxito en forma de lista.

9. Recuperación espaciada (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Recuperación espaciada</strong></p>
Para CADA entrada:
- <p><strong>Momento:</strong> {{Timing}}</p>
- <p><strong>Se basa en:</strong> {{DrawsFrom}}</p>
- <p><strong>Pregunta:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respuestas esperadas de los estudiantes:</p>
- Lista <ul> de respuestas (extraídas del bloque de texto largo).

10. Práctica del estudiante (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Práctica independiente</strong></p>
- <p><strong>Notas del maestro:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Para cada tarea: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Criterios de éxito</strong></p>
- Lista <ul>.

11. Reflexión (Reflection)
<p><strong>🔎 Reflexión: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Lista <ul> de indicaciones.

DATOS JSON:
{{{JsonResponse}}}`;
const teacherGuidancePhase2HtmlPrompt = `Usted es un formateador HTML educativo profesional.
Recibirá UN objeto JSON que representa la sección TeacherGuidancePhase2.
Su tarea es renderizar un código HTML limpio para maestros que coincida con el horario de la lección.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

REGLAS CRÍTICAS:
- Devuelva ÚNICAMENTE HTML5 válido.
- Etiquetas permitidas ÚNICAMENTE: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NO invente contenido.
- NO omita información.
- NO coloque <p>, <ul> o <span> dentro de la etiqueta <li>.
- Las listas solo se pueden usar si el campo JSON es una matriz.
- Mantenga el orden lógico exactamente como se especifica a continuación.

ORDEN DE SECCIONES:
<h3><span style="color: rgb(115, 191, 39);">Fase 2 – Exploración y desarrollo de soluciones (Explore & Develop)</span></h3>

1. Declaración de enfoque (Focus Statement)
- Etiquete en negrita "Declaración de enfoque" y créela como un párrafo.
- Renderice Phase1_FocusStatement dentro del párrafo.

2. Actividades colaborativas (encabezado en negrita)
- Cada actividad debe contener:
  - Título de la actividad <h3><span style="color: rgb(145,56,230);">TÍTULO DE LA ACTIVIDAD</span></h3>
  - Rol del maestro (Teacher Role)
  - Experiencia del estudiante (Student Experience)
  - Artefactos de aprendizaje (Artifacts of Learning) — en forma de lista

3. Preguntas orientadoras (Guiding Questions)
- Título en color púrpura (rgb(145,56,230))
- Lista

4. Diferenciación (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferenciación</strong></p>
<ul>
<li><strong>Aprendices del idioma: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Estudiantes que necesitan apoyo adicional: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Para estudiantes avanzados: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Adaptaciones y modificaciones (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Adaptaciones y modificaciones</strong></p>
- Apoyo general:
  - Comience el párrafo con la etiqueta: <p><strong>Apoyo general:</strong></p>
  - Renderice cada elemento de {{{AccommodationsAndModifications_General}}} como un <li> dentro de una <ul>.
- Apoyo individualizado (OBLIGATORIO PARA CADA INDIVIDUO):
  - <p><strong>Apoyo individualizado:</strong></p>
  - Para cada estudiante en {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nombre del estudiante en color rojo: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Lista <ul> con dos <li>: {{PlanProvided}} y {{PlanImplementation}}.

6. Conceptos erróneos anticipados (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Conceptos erróneos anticipados</strong></p>
- Par: concepto erróneo + respuesta del maestro en forma de lista numerada.

7. Pensamiento trascendente (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pensamiento trascendente</strong></p>
- Pregunta / Indicación
- Respuestas esperadas de los estudiantes con el título <p>✅ Respuestas esperadas de los estudiantes:</p> y lista.

8. Comprobaciones rápidas (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Comprobaciones rápidas</strong></p>
- Momento (inicio -> mitad -> final de la fase)
- Pregunta
- Respuestas esperadas o Criterios de éxito en forma de lista.

9. Recuperación espaciada (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Recuperación espaciada</strong></p>
Para CADA entrada:
- <p><strong>Momento:</strong> {{Timing}}</p>
- <p><strong>Se basa en:</strong> {{DrawsFrom}}</p>
- <p><strong>Pregunta:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respuestas esperadas de los estudiantes:</p>
- Lista <ul> de respuestas (extraídas del bloque de texto largo).

10. Práctica del estudiante (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Práctica independiente</strong></p>
- <p><strong>Notas del maestro:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Para cada tarea: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Criterios de éxito</strong></p>
- Lista <ul>.

11. Reflexión (Reflection)
<p><strong>🔎 Reflexión: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Lista <ul> de indicaciones.

DATOS JSON:
{{{JsonResponse}}}`;
const teacherGuidancePhase3HtmlPrompt = `Usted es un formateador HTML educativo profesional.
Recibirá UN objeto JSON que representa la sección TeacherGuidancePhase3.
Su tarea es renderizar un código HTML limpio para maestros que coincida con el horario de la lección.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

REGLAS CRÍTICAS:
- Devuelva ÚNICAMENTE HTML5 válido.
- Etiquetas permitidas ÚNICAMENTE: <p>, <h3>, <strong>, <ul>, <ol>, <li>, <span>.
- NO invente contenido.
- NO omita información.
- NO coloque <p>, <ul> o <span> dentro de la etiqueta <li>.
- Las listas solo se pueden usar si el campo JSON es una matriz.
- Mantenga el orden lógico exactamente como se especifica a continuación.

ORDEN DE SECCIONES:
<h3><span style="color: rgb(115, 191, 39);">Fase 3 – Presentación y reflexión (Present & Reflect)</span></h3>

1. Declaración de enfoque (Focus Statement)
- Etiquete en negrita "Declaración de enfoque" y créela como un párrafo.
- Renderice Phase1_FocusStatement dentro del párrafo.

2. Actividades colaborativas (encabezado en negrita)
- Cada actividad debe contener:
  - Título de la actividad <h3><span style="color: rgb(145,56,230);">TÍTULO DE LA ACTIVIDAD</span></h3>
  - Rol del maestro (Teacher Role)
  - Experiencia del estudiante (Student Experience)
  - Artefactos de aprendizaje (Artifacts of Learning) — en forma de lista

3. Preguntas orientadoras (Guiding Questions)
- Título en color púrpura (rgb(145,56,230))
- Lista

4. Diferenciación (Differentiation)
<p><strong style="color: rgb(145, 56, 230);">🪜 Diferenciación</strong></p>
<ul>
<li><strong>Aprendices del idioma: </strong>{{{Differentiation_LanguageLearners}}}</li>
<li><strong>Estudiantes que necesitan apoyo adicional: </strong>{{{Differentiation_Scaffolding}}}</li>
<li><strong>Para estudiantes avanzados: </strong>{{{Differentiation_GoDeeper}}}</li>
</ul>

5. Adaptaciones y modificaciones (Accommodations & Modifications)
<p><strong style="color: rgb(145, 56, 230);">🤝 Adaptaciones y modificaciones</strong></p>
- Apoyo general:
  - Comience el párrafo con la etiqueta: <p><strong>Apoyo general:</strong></p>
  - Renderice cada elemento de {{{AccommodationsAndModifications_General}}} como un <li> dentro de una <ul>.
- Apoyo individualizado (OBLIGATORIO PARA CADA INDIVIDUO):
  - <p><strong>Apoyo individualizado:</strong></p>
  - Para cada estudiante en {{{AccommodationsAndModifications_IndividualSupport}}}:
    - Nombre del estudiante en color rojo: <p><span style="color: rgb(204, 0, 0);">{{StudentName}}</span></p>
    - Lista <ul> con dos <li>: {{PlanProvided}} y {{PlanImplementation}}.

6. Conceptos erróneos anticipados (Anticipated Misconceptions)
<p><strong style="color: rgb(145, 56, 230);">❗ Conceptos erróneos anticipados</strong></p>
- Par: concepto erróneo + respuesta del maestro en forma de lista numerada.

7. Pensamiento trascendente (Transcendent Thinking)
<p><strong style="color: rgb(145, 56, 230);">🌍 Pensamiento trascendente</strong></p>
- Pregunta / Indicación
- Respuestas esperadas de los estudiantes con el título <p>✅ Respuestas esperadas de los estudiantes:</p> y lista.

8. Comprobaciones rápidas (Quick Checks)
<p><strong style="color: rgb(145, 56, 230);">✔ Comprobaciones rápidas</strong></p>
- Momento (inicio -> mitad -> final de la fase)
- Pregunta
- Respuestas esperadas o Criterios de éxito en forma de lista.

9. Recuperación espaciada (Spaced Retrieval)
<p><strong style="color: rgb(145, 56, 230);">⏳ Recuperación espaciada</strong></p>
Para CADA entrada:
- <p><strong>Momento:</strong> {{Timing}}</p>
- <p><strong>Se basa en:</strong> {{DrawsFrom}}</p>
- <p><strong>Pregunta:</strong> {{Question}} DOK: {{DOK}}</p>
- <p>✅ Respuestas esperadas de los estudiantes:</p>
- Lista <ul> de respuestas (extraídas del bloque de texto largo).

10. Práctica del estudiante (Student Practice)
<p><strong style="color: rgb(145, 56, 230);">🖊 Práctica independiente</strong></p>
- <p><strong>Notas del maestro:</strong> {{Phase1_StudentPractice_TeacherNotes}}</p>
- Para cada tarea: <p><strong>{{Number}}. (DOK {{DOK}})</strong> {{StudentDirections}}</p>
- <p><strong>Criterios de éxito</strong></p>
- Lista <ul>.

11. Reflexión (Reflection)
<p><strong>🔎 Reflexión: </strong>{{Phase1_ReflectionPrompt.Introduction}}</p>
- Lista <ul> de indicaciones.

DATOS JSON:
{{{JsonResponse}}}`;
const unitPreparationAndConsiderationsHtmlPrompt = `Usted es un formateador HTML educativo profesional.
Recibirá UN objeto JSON que representa UnitPreparationAndConsiderations.
Su tarea es renderizar un HTML limpio dirigido al maestro.

El contenido del HTML generado debe estar en {{{ResponseLanguage}}}

REGLAS CRÍTICAS
- Devuelva ÚNICAMENTE HTML válido.
- Etiquetas permitidas: <p>, <h3>, <strong>, <ul>, <li>, <span>.
- NO invente contenido.
- NO omita contenido.
- NO anide <p>, <ul> o <span> dentro de <li>.

ESTRUCTURA OBLIGATORIA

<p><strong><span style="color: rgb(115, 191, 39);">Materiales, equipo y recursos clave</span></strong></p>

1. Materiales y equipo del aula
- Renderice ClassroomMaterialsAndEquipment como una lista.

2. Recursos locales y de la comunidad
- Para cada recurso:
- Ubicación (en negrita)
- Cómo se involucran los estudiantes
- Por qué es relevante

3. Herramientas digitales y recursos en línea
- Renderice DigitalToolsAndOnlineResources como una lista.

<p><strong><span style="color: rgb(115, 191, 39);">Integración de tecnología</span></strong></p>

4. Tecnología para profundizar la investigación
5. Tecnología para modelado y representación visual
6. Tecnología para colaboración y discurso
7. Tecnología para crear y presentar el producto final

Para cada herramienta tecnológica:
- Nombre de la herramienta (en negrita)
- Cómo la usan los estudiantes
- Conexión con el proyecto
- Estándar ISTE

8. Consideraciones de equidad y accesibilidad
- Renderice como una lista.

JSON DE PREPARACIÓN DE LA UNIDAD:
{{{JsonResponse}}}
`;

const pblResponseSchema = {
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "description": "Return a complete Project-Based Learning (PBL) Unit Plan. Do NOT add extra keys. Populate every required field. Must work for ANY subject. Localize stakeholders/audience/resources to provided zip/location without inventing exact addresses/phone numbers.",
      "additionalProperties": false,
      "required": [
        "UnitDescription",
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
        "UnitDescription": {
          "type": "string",
          "description": "ONE cohesive paragraph (4-5 complete sentences): hook, mastery outcomes, skills/transfer, real-world relevance, purpose/impact; must reference the local community naturally. This paragraph must speak directly to the students."
        },
        "AssessPriorKnowledge": {
          "type": "string",
          "description": "Full 'Assess Prior Knowledge' section as plain text (150-250 words total). ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN an EMPTY STRING for this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit, placed immediately after the Student Learning Objectives. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement that introduces the chosen modality and explains how students will surface current understanding. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section showing anticipated answers or common misconceptions for the chosen modality. 8. Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation. 9. After fully developing one modality, provide 2 brief alternate options a teacher could choose."
        },
        "UnitOverview": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "TaskStatement",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatement": {
              "type": "string",
              "description": "Student-facing launch message (400-600 words) written like a credible local organization/person. Urgent, meaningful, authentic. No standards/rubrics/pacing. Title the student-facing message."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "One strong open-ended Driving Question grounded in place and stakeholder need. MUST be reused verbatim in FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Paragraph starting with 'Your task is to...' describing what students will create/do and why it matters to the community/audience."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Short narrative: who is impacted, why it matters now locally, and which stakeholders/audiences care."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              },
              "description": "Written for students, describe the final deliverable they will create and the authentic audience it serves, beginning with a brief summary, then require four components: (1) Concept & Purpose Plan explaining the idea through a visual or written representation and why it matters to the community or context; (2) Evidence-Based Justification requiring analysis of at least two relevant factors and explanation of choices using evidence from research, data, experimentation, or observation; (3) Model or Representation describing the type of model created, what it represents, how it explains underlying mechanisms or reasoning, and required distinctions; and (4) The Verdict, a concluding, evidence-backed argument explaining why the solution is effective, feasible, or meaningful, summarizing reasoning, evidence, and models, and communicating value to the authentic audience, with a final statement emphasizing application of disciplinary knowledge, use of evidence, modeling of complex ideas, and real-world implications."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Inspiring close: the community/audience is counting on students; emphasize impact."
            }
          }
        },
        "DesiredOutcomes": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "minItems": 1,
              "items": {
                "type": "string"
              },
              "description": "Standards listed verbatim when provided, format 'CODE: description'."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "description": "Generate 3-4 Big Idea and Essential Question pairs that establish the enduring, transferable concepts anchoring the entire unit, guide inquiry and assessment design, and provide an overarching conceptual framework connecting all tasks, skills, and activities into meaningful understanding.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string",
                    "description": "A broad, conceptual statement of enduring understanding that explains a fundamental principle underlying the unit, connects all tasks and assessments, supports transferable learning beyond the specific context, and reflects core disciplinary thinking rather than isolated facts."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter."
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Big Ideas or Enduring Understandings by generating 3 to 5 conceptual, long-term statements that explain why the learning matters beyond the unit, highlight transferable patterns, relationships, or principles across contexts, explain how or why something works rather than just what it is, are written as full declarative sentences beginning with a verb, and are each labeled with an appropriate Depth of Knowledge level, emphasizing ideas students can transfer to new situations, future units, and real-world decision making."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Facts or Core Content Knowledge by generating 3 to 5 discipline-specific facts, terms, or foundational knowledge statements that identify essential information students must remember, remain concrete and factual rather than conceptual, support the unit standards and performance tasks, use clear academic vocabulary appropriate to the subject, include an appropriate DOK label typically at level 1 or 2, and complete the stem Students will know that while beginning with a verb."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "minItems": 2,
                  "items": {
                    "type": "string"
                  },
                  "description": "Each objective must end with (DOK X) and represent Skills or Practices aligned to the discipline by generating 4 to 7 skills-based statements describing what students will do, such as analyze, compare, design, model, solve, justify, create, interpret, investigate, or communicate; align with discipline-specific practices; connect directly to the project deliverable or performance task; remain measurable and observable; include an appropriate DOK level between 2 and 4; and complete the stem Students will be able to while beginning with a verb."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "Problem",
            "Project",
            "Place",
            "KeyVocabulary"
          ],
          "properties": {
            "KeyVocabulary": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "VocabularyRationale",
                "Tiers"
              ],
              "properties": {
                "VocabularyRationale": {
                  "type": "string",
                  "description": "Provide a short, universal statement explaining that the unit's vocabulary is intentionally selected to support core understanding, connect learning to real-world application, and reinforce accurate academic communication, and that terms are organized into tiers to prioritize essentials, support differentiation, and strengthen students' effective use of disciplinary language."
                },
                "Tiers": {
                  "type": "array",
                  "minItems": 4,
                  "maxItems": 4,
                  "description": "Create a Tiered Academic Vocabulary section with four labeled tiers, where each tier title includes the tier name and aligned standards, begins with a brief purpose statement, and lists unit-appropriate vocabulary terms with student-friendly definitions and an optional Standards Connection note; required tiers are Tier 1 Core Concepts Vocabulary for foundational understanding, Tier 2 Applied Knowledge Vocabulary for applying and analyzing concepts, Tier 3 Analytical and Process Vocabulary for describing processes, models, and reasoning, and a Differentiation Enrichment or Extension Tier for advanced or nuanced terms; standards in tier titles must match unit standards, all labels must appear exactly as specified, and vocabulary must prioritize clarity, accurate academic usage, and accessibility for students.",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "TierTitle",
                      "TierWhyItMatters",
                      "Terms"
                    ],
                    "properties": {
                      "TierTitle": {
                        "type": "string",
                        "description": "MUST be exactly one of these: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                      },
                      "TierWhyItMatters": {
                        "type": "string"
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "items": {
                          "type": "object",
                          "additionalProperties": false,
                          "required": [
                            "Term",
                            "Definition",
                            "StandardsConnection"
                          ],
                          "properties": {
                            "Term": {
                              "type": "string"
                            },
                            "Definition": {
                              "type": "string"
                            },
                            "StandardsConnection": {
                              "type": "string",
                              "description": "List the standard that aligns with the vocabulary word. Example: Connection: MS-PS1-4 Develop a model to describe that substances are made of particles too small to be seen."
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "MUST match UnitOverview.DrivingQuestion verbatim."
            },
            "Problem": {
              "type": "string",
              "description": "The problem description must present a real, observable challenge in a community, system, or environment; explain why the problem matters and the consequences if it is not addressed; ensure the problem requires analysis, reasoning, and evidence rather than simple recall; identify underlying contributing factors such as scientific, historical, mathematical, civic, artistic, technological, or social elements; show how misunderstanding, missing information, or overlooked variables contribute to the issue; clearly outline the intellectual and practical tasks students must complete using disciplinary knowledge, evidence analysis, modeling, explanation, design, or evaluation of solutions; demonstrate how solving the problem requires mastery of the unit's core concepts, skills, and reasoning practices; align explicitly with a clear, open-ended driving question that can be answered through project work; specify required student response components such as a model or design, evidence-based analysis, visual or representational thinking, and a reasoned conclusion; and explain how the solution serves a real, relevant authentic audience positioned to use or evaluate the work."
            },
            "Project": {
              "type": "string",
              "description": "Narrative of how learning builds across the multi-day project (inquiry -> apply -> refine -> present). Not a day-by-day schedule."
            },
            "Place": {
              "type": "object",
              "additionalProperties": false,
              "required": [
                "PlaceOverview",
                "Sites",
                "PlaceMattersReminder"
              ],
              "properties": {
                "PlaceOverview": {
                  "type": "string",
                  "description": "The model must explain how the local context shapes the real-world problem students are solving, how it influences the driving question they will investigate, and how it determines the form and expectations of the final product. The output must clearly describe the local environments, stakeholders, or community needs that make the project meaningful and show how those elements inform student work, required evidence, and authentic impact."
                },
                "Sites": {
                  "type": "array",
                  "minItems": 3,
                  "maxItems": 4,
                  "description": "Must include 3 to 5 Place-Based Sites of Engagement, each structured with three labeled components: The Site, describing a meaningful physical, community, virtual, or discipline-specific location relevant to the unit's context; Engagement, explaining authentic inquiry activities students complete at or with the site such as observation, data collection, interviews, analysis, virtual exploration, or guided field tasks tied to the real-world problem; and Relevance, explaining why the site matters by connecting it to the problem, showing how it provides evidence or expertise, clarifying how it supports solution design or modeling, and highlighting local or community-specific significance; sites must represent varied contexts, include at least one involving community expertise, include at least one involving direct observation or physical context even if virtual, remain subject-neutral, and clearly show how the local community is part of the learning ecosystem.",
                  "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": [
                      "TheSite",
                      "Engagement",
                      "Relevance"
                    ],
                    "properties": {
                      "TheSite": {
                        "type": "string"
                      },
                      "Engagement": {
                        "type": "string"
                      },
                      "Relevance": {
                        "type": "string"
                      }
                    }
                  }
                },
                "PlaceMattersReminder": {
                  "type": "string",
                  "description": "Reminder: local geography/history/culture/infrastructure must meaningfully affect student decisions and solutions."
                }
              }
            }
          }
        },
        "AssessmentPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric",
            "AuthenticAudience"
          ],
          "properties": {
            "AuthenticAudience": {
              "type": "object",
              "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
              "additionalProperties": false,
              "required": [
                "PrimaryAudienceDescription",
                "WhyThisAudienceIsQualified",
                "HowThisAudienceElevatesTheProject",
                "StudentParticipationInAudienceSelection"
              ],
              "properties": {
                "PrimaryAudienceDescription": {
                  "type": "string",
                  "description": "Clear description of who the primary audience is (individuals, organizations, or groups) and their relationship to the project's context or problem."
                },
                "WhyThisAudienceIsQualified": {
                  "type": "string",
                  "description": "Explanation of why this audience has relevant expertise, lived experience, or authority related to the project topic."
                },
                "HowThisAudienceElevatesTheProject": {
                  "type": "string",
                  "description": "How the presence of this audience increases authenticity, rigor, motivation, or real-world impact for students."
                },
                "StudentParticipationInAudienceSelection": {
                  "type": "string",
                  "description": "Description of how students are involved in identifying, refining, or understanding the authentic audience."
                }
              }
            },
            "FormativeAssessmentTable": {
              "type": "array",
              "minItems": 3,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "string"
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Formative Assessment Rubric MUST use the exact column headers Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration. Analytic Rubric MUST use the exact column headers Criteria, Novice, Apprentice, Practitioner, and Expert. This schema does not contain content and only provides instructions for how the model must structure the output. Create an Assessment Rubrics section containing two required rubric formats and keep the exact column headers word for word with no substitutions. For the Formative Assessment Rubric, produce a table with exactly three columns labeled Criteria for Success (Student Learning Objective), Success Criteria, and Point of Demonstration, and populate each row with a specific measurable learning objective, its aligned success criteria, and where the evidence will appear such as a task, checkpoint, or performance moment. The number of rows must match the number of learning objectives in the unit, language must be clear and student friendly, and alignment between objective, criteria, and evidence point must be maintained. Keep the column headers exactly as written. The structure example is provided for format only and not for content."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "minItems": 4,
              "description": "The rubric must be produced as a table with exactly the following column headers in this order: Criteria, Novice, Apprentice, Practitioner, and Expert. Each row represents one evaluated skill, competency, or dimension of the final project. The Novice to Expert progression must reflect increasing sophistication and must not use deficit-based language such as fails, lacks, or missing. The Expert column must build on the Practitioner level with deeper insight, precision, or complexity. Keep the column headers exactly as written. The number of rows should match the number of major competencies required by the project. The required output structure example is provided for format only and not for content.",
              "items": {
                "type": "object",
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
                    "type": "string"
                  },
                  "Novice": {
                    "type": "string"
                  },
                  "Apprentice": {
                    "type": "string"
                  },
                  "Practitioner": {
                    "type": "string"
                  },
                  "Expert": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "LearningPlan": {
          "type": "object",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "CommunicationToAuthenticAudienceExpectations",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": {
              "type": "string",
              "description": "The output must include a clear statement of the total number of instructional days based on the value provided by the teacher, a short description of how the project unfolds across phases rather than fixed dates, and a 2-4 sentence summary explaining how learning progresses across the unit. The model must not assume specific day ranges such as Days 1-3 and must instead divide learning into three flexible phases labeled Early Phase, Middle Phase, and Final Phase. The Early Phase must describe building foundational knowledge, introducing core concepts, tools, or skills, conducting exploratory investigations or guided practice, and preparing students for deeper inquiry. The Middle Phase must describe applying core concepts to the central problem, conducting analyses or research, developing drafts, prototypes, models, or design ideas, and gathering and interpreting evidence for the final deliverable. The Final Phase must describe refining the final product, synthesizing learning into clear explanations, preparing visuals, models, arguments, or presentations, and presenting to the authentic audience. The model must not assign a fixed number of days to any phase and must allow any duration provided by the teacher."
            },
            "ProjectPhases": {
              "type": "array",
              "minItems": 3,
              "maxItems": 4,
              "items": {
                "type": "object",
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
                    "type": "string"
                  },
                  "PhaseDescription": {
                    "type": "string"
                  },
                  "ConceptsOrSkills": {
                    "type": "string"
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string"
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "minItems": 3,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "minItems": 3,
              "description": "The output must contain exactly three project goals, each expressed as a conceptual category followed by detailed bullets or short paragraphs. Goal 1, Apply Disciplinary Content to a Real-World Problem, requires students to use discipline-specific knowledge to analyze or solve an authentic challenge, list 4-6 core concepts or principles they will apply, and show how these ideas connect to real-world conditions or constraints. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, requires describing the authentic challenge students must address, listing what students will create, model, compare, analyze, evaluate, or justify, and including processes such as modeling, predicting, comparing, evaluating, and decision-making. Goal 3, Communicate Findings to a Real Audience, requires students to prepare a polished, professional-quality final product, tailor communication to the needs of a real stakeholder group, and reference authentic audiences such as local experts, community organizations, industry professionals, school leadership, families, or community members.",
              "items": {
                "type": "string"
              }
            },
            "CommunicationToAuthenticAudienceExpectations": {
              "type": "string"
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "minItems": 4,
              "items": {
                "type": "string"
              }
            },
            "GroupSuggestions": {
              "type": "object",
              "description": "Outlines group size, roles and teacher duties.",
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
                  "description": "The output must state a recommended group size such as 3 to 4 students and must provide a rationale explaining how this size supports productive discussion, shared engagement, and manageable task distribution."
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "description": "The output must provide a list of roles formatted as Role Name: description of duties. The list must include at least four roles, and the required functional categories are Facilitator who guides discussion and ensures full participation, Recorder who documents group thinking, Materials Manager who handles tools and resources safely, and Presenter or Communicator who shares group findings. Optional roles may also appear such as Researcher, Data Analyst, Model Builder, or Timekeeper. Third, Teacher Expectations for Role Implementation: The output must state that teachers introduce and model each role at the start of the project, establish clear norms for how roles function during group work, and require that students rotate roles across activities so all learners practice multiple collaborative skills.",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "string",
                  "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: To help teachers make intentional grouping decisions, include this planning prompt: 'What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?' This question encourages teachers to choose grouping methods that match instructional goals rather than defaulting to convenience or habit. The model must not add additional explanation, examples, or commentary."
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "description": "The model must output the following text exactly as written, without altering any words, punctuation, or phrasing: Teachers may consider: Mixed-ability Groups: Best when tasks require reasoning, evidence comparison, or scaffolding across readiness levels (e.g., particle-model brainstorming). Interest-based Groups: Ideal during sculpture concept development, allowing students to collaborate based on themes or artistic styles they are drawn to. Skills-based Groups: Useful when tasks require technical precision (e.g., particle diagrams, environmental stress modeling). Randomized Groups: Helpful during early exploration tasks to build community and reduce over-reliance on predictable partnerships. The model must not add additional explanation, examples, or commentary.",
                  "minItems": 4,
                  "items": {
                    "type": "string"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase1": {
          "type": "object",
          "additionalProperties": false,
          "description": "First phase of teacher guidance",
          "required": [
            "Phase1_Title",
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation_LanguageLearners",
            "Phase1_Differentiation_Scaffolding",
            "Phase1_Differentiation_GoDeeper",
            "Phase1_Accommodations_General",
            "Phase1_Accommodations_IndividualSupport",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinkingPrompts",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_TeacherNotes",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 1 - Launch'."
            },
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Provide a short statement describing how this phase builds curiosity, introduces the real-world problem, and activates early reasoning. The Focus Statement must include curiosity-building about the core phenomenon or problem, early observation and exploration, student-driven noticing and questioning, and a clear connection to the unit's Driving Question. The wording should reflect that in this launch phase students build curiosity and begin uncovering the scientific or conceptual problem at the center of the project, and that through observation, exploration, and early modeling attempts they gather firsthand evidence that connects their initial thinking to the Driving Question."
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase1_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase1_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase1_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase1_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase1_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "description": "List of specific student accommodations. Each entry MUST use the student names and plans exactly as provided in the prompt.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase1_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string",
                    "description": "Use: 'Beginning of Phase' or 'Mid-Phase' or 'End of Phase'."
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase1_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
          "additionalProperties": false,
          "description": "Second phase of teacher guidance",
          "required": [
            "Phase2_Title",
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation_LanguageLearners",
            "Phase2_Differentiation_Scaffolding",
            "Phase2_Differentiation_GoDeeper",
            "Phase2_Accommodations_General",
            "Phase2_Accommodations_IndividualSupport",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinkingPrompts",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_TeacherNotes",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_ReflectionPrompt"
          ],
          "properties": {
            "Phase2_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 2 - Exploration, Investigation, and Development; Refinement'."
            },
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Write a 1-3 sentence Focus Statement that summarizes the purpose of the phase, explains how students build understanding through inquiry-based work, explicitly connects the phase to the unit's Driving Question or real-world problem, and describes how this phase moves students closer to producing their final deliverable. The statement must always be written as a single short paragraph and must be customized to the specific project details provided by the user."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase2_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase2_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase2_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase2_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase2_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase2_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase2_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
          "additionalProperties": false,
          "description": "Third phase of teacher guidance",
          "required": [
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation_LanguageLearners",
            "Phase3_Differentiation_Scaffolding",
            "Phase3_Differentiation_GoDeeper",
            "Phase3_Accommodations_General",
            "Phase3_Accommodations_IndividualSupport",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinkingPrompts",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_TeacherNotes",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_ReflectionPrompt",
            "Phase3_Title"
          ],
          "properties": {
            "Phase3_Title": {
              "type": "string",
              "description": "MUST be exactly: 'Phase 3 - Development; Refinement, Culmination, and Reflection'."
            },
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "Generate a 2-4 sentence Focus Statement that clearly communicates the purpose of Phase 3 and its role in moving students toward the final product. The statement must explain that Phase 3 focuses on refining ideas, applying learning, strengthening evidence, preparing culminating products, and engaging in deeper reasoning and revision. It must explicitly show how Phase 3 advances the project's authentic real-world challenge, how students use evidence to improve solutions, and how this work prepares them for an authentic audience. The statement must include intellectual work such as refining, revising, synthesizing, evaluating, justifying, finalizing, and communicating, and it must indicate how students finalize models, products, explanations, or proposals, prepare presentations or public showcases, and reflect on learning to strengthen their reasoning."
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
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
                      "type": "string"
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
                "type": "string"
              }
            },
            "Phase3_Differentiation_LanguageLearners": {
              "type": "string",
              "description": "Instructional strategies designed specifically to support language development and conceptual understanding for language learners, using visual supports, structured language scaffolds, and opportunities for meaningful academic talk. Focus on how content is taught, not on modifying learning expectations."
            },
            "Phase3_Differentiation_Scaffolding": {
              "type": "string",
              "description": "Teaching strategies that provide additional instructional scaffolding for students who need structured support, while maintaining the same learning objectives. Supports should increase access to reasoning and engagement through guided practice, visual organization, and gradual release of responsibility."
            },
            "Phase3_Differentiation_GoDeeper": {
              "type": "string",
              "description": "Instructional extensions that deepen thinking for students ready for greater challenge by increasing conceptual complexity, abstraction, and reasoning demands, while remaining aligned to the same core learning goals."
            },
            "Phase3_Accommodations_General": {
              "type": "string",
              "description": "General classroom supports and modifications that apply to most or all students during this activity."
            },
            "Phase3_Accommodations_IndividualSupport": {
              "type": "array",
              "minItems": 0,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "StudentName",
                  "PlanProvided",
                  "PlanImplementation"
                ],
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Full name of the student exactly as provided in the prompt."
                  },
                  "PlanProvided": {
                    "type": "string"
                  },
                  "PlanImplementation": {
                    "type": "string",
                    "description": "Short description of the individualized accommodation or modification for this student."
                  }
                }
              }
            },
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "description": "A list of common student misconceptions likely to arise during this phase of instruction, paired with clear teacher-facing correction language that models how to respond in the moment to guide students toward accurate conceptual understanding.",
              "minItems": 2,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Misconception",
                  "CorrectionLanguage"
                ],
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "A concise description of a common or predictable misunderstanding students may have about the concepts addressed in this phase."
                  },
                  "CorrectionLanguage": {
                    "type": "string",
                    "description": "Specific teacher language or instructional moves-such as probing questions, prompts, or examples-that help students examine their thinking and move toward accurate understanding without directly giving the answer."
                  }
                }
              }
            },
            "Phase3_TranscendentThinkingPrompts": {
              "type": "array",
              "minItems": 1,
              "description": "Real-world application questions connecting learning to purpose/meaning/big ideas, with expected student responses showing deeper understanding",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Prompt",
                  "ExpectedStudentResponses"
                ],
                "properties": {
                  "Prompt": {
                    "type": "string"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_QuickChecks": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "Final comprehension check question with 2-3 expected student responses showing mastery",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "Prompt",
                  "SuccessCriteriaOrExpectedResponses"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
                  "Prompt": {
                    "type": "string"
                  },
                  "SuccessCriteriaOrExpectedResponses": {
                    "type": "array",
                    "minItems": 2,
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_SpacedRetrieval": {
              "type": "array",
              "minItems": 3,
              "maxItems": 3,
              "description": "The model must create a Spaced Retrieval component that requires students to recall a key concept from a specific prior unit or lesson without referencing any past activities, worksheets, models, labels, or task-specific steps. The teacher script must begin with Say: and may reference only the topic of the prior learning, not what students learned about it. The retrieval question must prompt students to restate or apply a previously learned conceptual understanding (such as how a system works, how variables relate, or how a process unfolds) entirely from memory, without the teacher giving hints or partial explanations. The output must end with Expected Student Responses showing 2-3 examples that accurately reflect conceptual recall, demonstrating that students-not the prompt-supplied the remembered ideas.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "Timing",
                  "DrawsFrom",
                  "Question",
                  "DOK",
                  "ExpectedResponseOrSuccessCriteria"
                ],
                "properties": {
                  "Timing": {
                    "type": "string"
                  },
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
                    "type": "string"
                  }
                }
              }
            },
            "Phase3_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "One paragraph explaining the knowledge and skills practiced across all tasks in this phase. The paragraph MUST start with 'These tasks reinforce today's learning about ____ by ______.' where the blanks are filled with relevant project content, followed by an explanation of how these tasks strengthen long-term retention."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Tasks should align to the phase focus and expected depth of knowledge. Use only DOK 2, 3, or 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Depth of Knowledge level for the task. MUST be ONE of: 'DOK 2', 'DOK 3', or 'DOK 4'. DOK 1 is strictly forbidden."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "If and ONLY IF subject is math: include interleaving problem + teacher prompt + expected responses + teacher note. Otherwise empty string."
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
                  "description": "Student-facing short introduction to the reflection, e.g., 'Write 2-3 sentences responding to one prompt:'"
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
};

  return {
    defaultPrompt,
    unitDescriptionHtmlPrompt,
    assessPriorKnowledgeHtmlPrompt,
    unitOverviewHtmlPrompt,
    desiredOutcomesHtmlPrompt,
    framingTheProjectHtmlPrompt,
    assesmentPlanHtmlPrompt,
    learningPlanHtmlPrompt,
    teacherGuidancePhase1HtmlPrompt,
    teacherGuidancePhase2HtmlPrompt,
    teacherGuidancePhase3HtmlPrompt,
    unitPreparationAndConsiderationsHtmlPrompt,
    pblResponseSchema,
  };
})();
