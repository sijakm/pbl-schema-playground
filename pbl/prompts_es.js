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

const pblResponseSchema = {};

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
