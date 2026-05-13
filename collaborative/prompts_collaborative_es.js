window.promptsES = {
  STEP0_PROMPT_TEMPLATE: `
Crea un esquema de la unidad y una estructura de lecciones utilizando la información a continuación. NO escribas planes de lecciones completos.
                    
Basándote en el tema de la unidad (Unit Subject), los estándares educativos, la descripción/instrucciones de la unidad (Unit Description/Instruction), el nivel de grado (Grade Level), la duración del período de clase en minutos (Duration of class period) y el número de lecciones solicitado (Number of Lessons), genera una respuesta JSON que incluya una descripción cohesiva de la unidad (UnitDescription) y una lista de "contenedores" de lecciones (Lessons) que no se superpongan.

Tema de la unidad (Unit Subject):
{{$Subject}}

Nombre de la unidad (Unit Name):
{{$Name}}

Descripción/Instrucciones de la unidad (Unit Description/Instruction):
{{$UserPrompt}}

Nivel de grado (Grade Level):
{{$GradeLevel}}

Duración del período de clase en minutos:
{{$ClassDuration}}
  
Estándares para la alineación:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/Medios para usar:
{{$MediaContext}}
  
Contenido de la unidad:
{{$AttachedUnit}}

Requisitos para las Preguntas Esenciales (Essential Questions):
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta y que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "¿Cómo?" o "¿Por qué?".
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales ni de definición.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en el contenido específico de la materia.
- Las preguntas DEBEN ser aplicables en diferentes disciplinas y fuera de esta unidad.
- Las preguntas DEBEN repetirse textualmente en cada lección de la unidad.

Qué generar:
- La salida DEBE ser un JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el núcleo del enfoque de la unidad y el viaje narrativo.
  - "StudentLearningObjectives": Enumera de 3 a 5 objetivos de aprendizaje medibles clave para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordan durante la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales siguiendo las reglas anteriores.
- GENERA una lista de "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice que comienza en 1), "lessonTitle" y "lessonOutline" (2 a 4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuencia lógica desde las ideas fundamentales hasta el modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente preciso y apropiado para la edad.

La salida DEBE ser un JSON válido que coincida con el esquema. Utiliza un formato compacto (sin líneas en blanco adicionales).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Crea UN plan de lección de estilo colaborativo (NO un plan de unidad, NO varias lecciones) utilizando la información a continuación.

DEBES emitir un JSON válido que coincida exactamente con el esquema JSON proporcionado (LessonPlanResponse con un objeto "LessonPlan"). No incluyas claves adicionales. Utiliza un formato JSON compacto (sin líneas en blanco adicionales).

CONTEXTO DE LA UNIDAD (solo lectura para coherencia):
Tema de la unidad:
{{$Subject}}

Contenido de la unidad: 
{{$ParentUnitData}}

Descripción/Instrucciones de la unidad: Crea la unidad utilizando los siguientes estándares:
{{$Standards}}

Nivel de grado:
{{$GradeLevel}}

Recursos/Medios para usar: 
{{$MediaContext}}

Duración de la clase en minutos:
{{$ClassDuration}}

Título de la lección:
{{$Name}}

Descripción/Instrucciones de la unidad: 
{{$UserPrompt}}

Preguntas Esenciales de la unidad (ÚSALAS TEXTUALMENTE):
{{$UnitEssentialQuestions}}

Si las Preguntas Esenciales anteriores están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa, gramaticalmente correcta y que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "¿Cómo?" o "¿Por qué?".
- Las preguntas DEBEN ser conceptuales y exploratorias, no factuales, procedimentales ni de definición.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en el contenido específico de la materia.
- Las preguntas DEBEN ser aplicables en diferentes disciplinas y fuera de esta unidad.

ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBEN usarse SOLO dentro de CollaborativeActivities.AccommodationsAndModifications; usa los nombres de los estudiantes/planes exactamente como están escritos):
{{$LearningPlans}}

REGLAS DE CONTENIDO IMPORTANTES (Estilo colaborativo):
- Mantén la lección alineada con el enfoque de la unidad y el marco/límites de la lección anteriores; evita introducir nuevos conceptos importantes que pertenezcan a otras lecciones.
- Relevancia cultural e inclusión: incluye múltiples perspectivas; conéctate con diversas comunidades; evita estereotipos; muestra los impactos en todos los involucrados.
- Transferencia: incorpora la aplicación al mundo real y el razonamiento en toda la lección.
- Intercalado (Interleaving): cuando los estudiantes practiquen/apliquen, mezcla estrategias o conceptos (no práctica en bloque). Si la lección contiene algún razonamiento matemático, incluye al menos un elemento de intercalado de nivel DOK 3–4 que mezcle el contenido actual con un concepto de una lección anterior y requiera que los estudiantes justifiquen la elección de la estrategia.

REGLAS ESPECÍFICAS POR CAMPO:
- EssentialQuestions: DEBEN ser totalmente idénticas a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: Si esta sección es obligatoria (p. ej., para la Lección 1 o al introducir nuevos conceptos principales), escribe de 150 a 250 palabras siguiendo la estructura obligatoria en la descripción del esquema. De lo contrario, devuelve "" (cadena vacía).
- Instruction:
  - Esta es la misma estructura que en la Presentación Directa, pero con otro nombre.
  - La estructura debe fluir naturalmente con las indicaciones: Decir (Say)/Hacer (Do)/Preguntar (Ask)/Escuchar para (Listen for)/Escribir (Write).
  - IMPORTANTE: NO incluyas encabezados en mayúsculas (como HOOK, INTRODUCCIÓN, etc.) para las secciones.
  - IMPORTANTE: NO incluyas la duración del tiempo para indicaciones o pasos individuales.
  - TranscendentThinking: Proporciona una pregunta de aplicación al mundo real que conecte el aprendizaje con el propósito/significado, seguida de la etiqueta 'Respuestas esperadas de los estudiantes:' y 2 a 3 ejemplos.
- GroupStructureAndRoles (3–4 minutos):
  - La salida DEBE estar dirigida al docente y DEBE seguir exactamente esta estructura y etiquetas (mismo orden, mismos emojis/caracteres):
  
  FORMATO OBLIGATORIO (títulos/etiquetas exactos):
  Tamaño del grupo: [uno de: parejas / tríadas / 4–5 estudiantes]
  
  📋 Instrucciones para docentes
  Decir: "[1–2 oraciones: explica que los roles son importantes y que modelarás cómo se ve cada rol]"
  
  Roles:
  Facilitador: [mantiene al grupo enfocado en la tarea; fomenta la participación; asegura que todos hablen al menos una vez]
  Secretario: [escribe las etiquetas y el razonamiento del grupo; registra la evidencia/consenso]
  Gestor de materiales: [recoge/distribuye los materiales; verifica la devolución de los materiales; apoya el manejo seguro]
  Controlador del tiempo: [monitorea el tiempo de cada fase; da advertencias cuando queda 1 minuto]
  Presentador: [comparte el modelo y la explicación del grupo; usa marcos de oraciones]
  
  Rotación:
  - Incluye una oración que especifique cuándo rotan los roles en ESTA lección (p. ej., "Roten los roles después de la Fase A y nuevamente antes de la caminata por la galería").
  
  Restricciones:
  - Los roles deben ser exactamente estos cinco nombres (Facilitador, Secretario, Gestor de materiales, Controlador del tiempo, Presentador) y cada uno debe tener una tarea concreta relacionada con las CollaborativeActivities de la lección.
  - El tamaño del grupo debe coincidir con la estructura de la tarea (p. ej., si se usa jigsaw, preferiblemente 4 a 5; si es una construcción y uso compartido rápidos, tríadas/parejas).
  - Longitud total aproximada de 120 a 180 palabras.
- CollaborationGuidelines:
  - Duración aproximada de 5 minutos.
  - Devuelve una cadena vacía para este campo ya que por ahora tengo un texto fijo.
- CollaborativeActivities:
  - Crea una actividad colaborativa interdependiente (reemplazo colaborativo de la práctica guiada) alineada con el alcance de esta lección.
  - Cada estudiante debe contribuir y los grupos deben producir un producto o decisión conjunta.
  - Incluye marcas de tiempo, guion de "Decir:" para el docente, indicaciones de circulación + respuestas esperadas, y una comprobación rápida donde TODOS los estudiantes respondan + respuestas esperadas.
  - Incluye Diferenciación (3 niveles) y AccommodationsAndModifications (apoyo General + Individualizado exactamente según los datos).
  - Si esta es una clase de matemáticas, incluye un problema de intercalado de nivel DOK 3–4 que mezcle el contenido actual con una lección/unidad anterior y explica por qué se incluye; de lo contrario, omite el intercalado.
- ReflectionOnGroupDynamics:
  - Duración aproximada de 5 minutos.
  - Incluye de 2 a 4 preguntas de reflexión para los estudiantes (p. ej., qué salió bien, desafíos, si se escuchó su voz).
  - Proporciona movimientos de facilitación del docente (boleto de salida de escritura rápida, autoevaluación grupal de 1 a 5, o discusión de 2 minutos), con indicaciones del docente y respuestas esperadas de los estudiantes.
  - Vincula la reflexión explícitamente con las CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Misma estructura y requisitos que en la versión de instrucción directa (ver descripción del esquema).
  - Debe incluir una comprobación de recuperación (retrieval check) que se vincule con UN concepto de una lección anterior (menciona el número de la lección anterior).
- StudentPractice:
  - Tarea / práctica fuera de clase.
  - Debe seguir el formato obligatorio exacto en la descripción del esquema (incluyendo los marcadores ✅Respuestas esperadas de los estudiantes).

REQUISITOS DE SALIDA:
- La salida DEBE ser un JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser solo UN plan de lección.
- Sin HTML. Sin emojis. Sin markdown. Texto plano dentro de los campos de cadena.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `
Recibirás UN objeto JSON que sigue estrictamente el esquema LessonPlanResponse (ya validado por mi parte). Tu trabajo es transformar este JSON en un HTML limpio y legible que un docente pueda usar directamente en clase.

FORMATO DE ENTRADA
Te enviaré un objeto JSON de esta manera:

JSON DEL PLAN DE LECCIÓN:
{{{JsonResponse}}}

Considera todo lo que sigue a la línea "JSON DEL PLAN DE LECCIÓN:" como el objeto JSON exacto. NO lo expliques ni lo comentes; simplemente analízalo y renderízalo.

REGLAS GLOBALES
- La salida DEBE ser exclusivamente HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
- Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
- NO uses ninguna otra etiqueta (nada de <main>, <section>, <header>, <div>, <h4>, etc.).
- El HTML debe tener una sangría adecuada y ser fácil de leer.
- En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca pongas <p>, <span>, <ul>, <ol> ni ninguna otra etiqueta dentro de la lista como hijo directo.
- NO inventes contenido instructivo nuevo; usa solo lo que está en los campos JSON.
- Mantén el orden lógico implícito en el esquema.
- Si un campo de cadena está vacío (""), OMITE esa subsección y su etiqueta.
- Si una matriz está vacía, omite su título y el <ul> o <ol> correspondiente.
- Siempre que el texto forme claramente una lista de indicaciones/preguntas/declaraciones/respuestas, usa <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, usa <p>.
- Siempre que renderices respuestas modelo/esperadas de los estudiantes, usa este patrón:
  - Primero: <p>✅ Respuestas esperadas de los estudiantes</p>
  - Luego: <ul><li>…</li></ul> (o <ol> si están ordenadas)
  - NO anides listas dentro de <li>.

INICIO DE PÁGINA
- NO incluyas el título de la lección (no uses <h2>); comienza tu salida directamente con la sección <h3>💭 Preguntas Esenciales</h3> y continúa desde allí.

PREGUNTAS ESENCIALES (ESSENTIAL QUESTIONS)
- <h3>💭 Preguntas Esenciales</h3>
- <ul> donde cada elemento de LessonPlan.EssentialQuestions es un <li>.

VOCABULARIO CLAVE (KEY VOCABULARY)
- <h3>🔤 Vocabulario clave</h3>
- <ol> donde cada elemento de KeyVocabulary es un <li>, manteniendo la estructura "Término – Definición":
  <li><strong>Término</strong> – Definición</li>

OBJETIVOS DE APRENDIZAJE (STUDENT LEARNING OBJECTIVES)
- <h3>🎯 Objetivos de aprendizaje</h3>
- <ul> con cada elemento de LessonPlan.StudentLearningObjectives como <li>.

ESTÁNDARES ALINEADOS (STANDARDS ALIGNED) - REGLA ESTRICTA: SIEMPRE RENDERIZAR
- <h3>📏 Estándares alineados</h3>
- <ul> con cada cadena de StandardsAligned como <li>.
- Ubicación: justo después de los objetivos.

EVALUAR CONOCIMIENTOS PREVIOS (ASSESS PRIOR KNOWLEDGE)
    - Esta subsección SOLO aparece si la propiedad "AssessPriorKnowledge" existe en el JSON y no es una cadena vacía.
    - Colócala justo después del bloque <h3>🎯 Objetivos de aprendizaje</h3> de esa lección.

    Renderizado:
        - <h3>💡 Evaluar conocimientos previos</h3>
        - Renderiza el siguiente párrafo: <p><strong>Nota para el docente: </strong>Activar los conocimientos previos de los estudiantes no es solo un calentamiento, es la neurociencia en acción. Este proceso activa las vías neuronales existentes, lo que facilita que el cerebro conecte la información nueva con lo que ya se sabe. Esta técnica, llamada codificación elaborativa, ayuda a los estudiantes a transferir el conocimiento a la memoria a largo plazo de manera más rápida y eficiente, mejorando tanto la comprensión como la retención. </p>
        - Resumen:
            - Renderiza cualquier párrafo introductorio del guion del docente que presente la actividad como uno o más bloques <p> antes de cualquier lista.
        - Instrucciones:
            - Renderiza las instrucciones del docente como una lista de viñetas (<ul>) donde cada instrucción se convierte en un <li> con texto plano (NO incluyas HTML dentro de <li>).
            - NO anides listas dentro de ningún <li>; todas las listas deben ser de nivel superior y contener solo <li>.
        - Plantilla/Estructura:
            - Renderiza el texto de Plantilla/Estructura como un párrafo <p> que contenga el guion del docente (p. ej., Decir: ... Hacer: ...), manteniendo las palabras y la puntuación exactas.
            - Inmediatamente después de ese <p>, si se proporcionan respuestas esperadas de los estudiantes, renderiza:
            <p>✅ Respuestas esperadas de los estudiantes</p>
            seguido de un <ul> donde cada respuesta sea un <li> con texto plano.
            - NO coloques estas listas de respuestas dentro de ningún otro <li> o lista.
        - Líneas de cierre:
            - Cualquier oración final del docente proporcionada como un párrafo separado debe renderizarse como su propio <p> después de las listas.
    - Opciones alternativas:
        - Coloca esto DESPUÉS del </ol> de cierre de la lista numerada principal.
        - Primera salida: <p><strong>Opciones alternativas</strong></p>
        - Luego renderiza una lista numerada de nivel superior independiente <ol> donde cada opción sea un <li> con texto plano.

INSTRUCCIÓN (INSTRUCTION)
- <h3><span style="color: rgb(115, 191, 39);">Instrucción</span></h3>
- Materiales:
  <p><strong>📚 Materiales</strong></p>
  <ul>...</ul>
- Instrucciones para docentes:
  <p><strong>📋 Instrucciones para docentes</strong></p>
  Renderiza Instruction.InstructionsForTeachers como bloques <p> legibles. Cuando el texto contenga listas (como las viñetas de Listen for:), usa listas <ul> separadas en el nivel superior después del <p> relacionado. No anides listas dentro de <li>.
- Conceptos erróneos anticipados:
  <p><strong>⚠️ Conceptos erróneos anticipados</strong></p>
  Usa <p> y/o <ul> de nivel superior (solo <li> de texto plano).
- Pensamiento trascendente:
  - <h3>🌍 Pensamiento trascendente</h3>
  - Renderiza la pregunta como un párrafo introductorio (<p>).
  - Luego renderiza cualquier respuesta modelo/esperada de los estudiantes usando el patrón global <p>✅ Respuestas esperadas de los estudiantes</p> seguido de una lista de viñetas (<ul>) fuera de cualquier elemento de lista.
- Comprobación rápida (Quick Check):
  <p><strong>Comprobación rápida</strong></p>
  Renderiza como <p> más el patrón ✅ si existen respuestas.

ESTRUCTURA Y ROLES DEL GRUPO (GROUP STRUCTURE & ROLES)
- <h3><span style="color: rgb(115, 191, 39);">Estructura y roles del grupo (3–4 min)</span></h3>
- Después de esto, renderiza exactamente el siguiente párrafo:
  <p><strong>Determinen el propósito: </strong>¿Cuál es el propósito principal de su agrupación en esta actividad —apoyo de compañeros, una discusión enriquecedora, un desafío o eficiencia? Una vez que conozcan el propósito, elijan el mejor método de agrupación: habilidades mixtas, basado en intereses, basado en habilidades o al azar. </p>

REGLAS ESTRICTAS (sin anidamiento, seguro para la interfaz de usuario):
- NO DEBES poner ningún <ul> o <ol> dentro de un <li>. No debe haber listas anidadas en esta sección.
- Si LessonPlan.GroupStructureAndRoles contiene subsecciones como "Roles:" y "Rotación:", DEBES aplanarlas en:
  A) Bloques <p> separados, O
  B) Un solo <ul> de nivel superior donde CADA elemento sea su propio <li>.

PATRÓN DE RENDERIZADO OBLIGATORIO (preferido):
1) Renderiza "Tamaño del grupo:" como su propio <p> (texto plano).
2) Renderiza "📋 Instrucciones para docentes" como <p><strong>📋 Instrucciones para docentes</strong></p> si están presentes.
3) Renderiza las líneas "Decir:" como uno o más bloques <p> (texto plano).
4) Renderiza los roles como UN solo <ul> de nivel superior con exactamente cinco elementos <li>, usando solo <strong> en línea (sin listas anidadas):
   <ul>
     <li><strong>Facilitador:</strong> ...</li>
     <li><strong>Secretario:</strong> ...</li>
     <li><strong>Gestor de materiales:</strong> ...</li>
     <li><strong>Controlador del tiempo:</strong> ...</li>
     <li><strong>Presentador:</strong> ...</li>
   </ul>
5) Renderiza "Rotación:" como su propia línea <p> (texto plano). Si la rotación tiene varias oraciones/pasos, mantenlos como bloques <p> separados (NO una lista).
6) Si aparece texto explicativo adicional (p. ej., "Restricciones:"), renderízalo como <p> (texto plano), NO como una lista.

PAUTAS DE COLABORACIÓN (COLLABORATION GUIDELINES)
- <h3><span style="color: rgb(115, 191, 39);">Pautas de colaboración (5 min)</span></h3>
- Después de esto, renderiza EXACTAMENTE lo siguiente:
<p>Usa las siguientes indicaciones para guiar a los grupos de estudiantes hacia la creación de sus propias normas grupales.</p>
<ul>
  <li>¿Qué necesitan unos de otros para que esto se sienta justo, respetuoso y productivo?</li>
  <li>Hagan una lista corta de 3 a 5 normas grupales que todos acepten seguir. Pregúntense: ¿Cómo nos aseguraremos de que se escuche la voz de todos? ¿Cómo manejaremos los desacuerdos?</li>
  <li>Imaginen que alguien nuevo se une a su grupo. ¿Qué reglas o acuerdos le explicarían para que sepa cómo colabora su grupo? Escríbanlas como sus normas.</li>
  <li>Voltéense y hablen: ¿Qué ayudó a que su última actividad grupal saliera bien? ¿Qué la hizo frustrante? Conviertan esas ideas en normas de ‘Hacer’ y ‘No hacer’ para este grupo.</li>
  <li>Creen una oración que comience con ‘En nuestro grupo, siempre vamos a…’ y otra que comience con ‘En nuestro grupo, no vamos a…’. Úsenlas para construir su conjunto completo de normas.</li>
</ul>

ACTIVIDADES COLABORATIVAS (COLLABORATIVE ACTIVITIES)
- <h3><span style="color: rgb(115, 191, 39);">Actividades colaborativas (25 min)</span></h3>

Materiales:
- <p><strong>📚 Materiales</strong></p>
- Renderiza LessonPlan.CollaborativeActivities.Materials como UN solo <ul> de nivel superior.
- REGLA ESTRICTA: Sin listas anidadas. Si una línea de materiales contiene una etiqueta como "Kit de corrección:", seguida de subelementos, APLÁNALA escribiendo elementos <li> separados que comiencen con el prefijo de la etiqueta, p. ej.:
  <li>Kit de corrección — Cuerda/cordel para ajustar las trayectorias orbitales</li>

Instrucciones para docentes:
- <p><strong>📋 Instrucciones para docentes</strong></p>
- Renderiza las indicaciones del docente como UNA sola lista numerada <ol>.
- Divide el texto original en pasos numerados. Si el texto ya tiene numeración (1), 1., 1), etc., cada uno se convierte en un <li>.
- REGLA ESTRICTA: Sin listas anidadas en ningún lugar dentro de un <li>. Para representar subpuntos o respuestas esperadas, APLÁNALOS en elementos <li> secuenciales adicionales en la MISMA lista <ol>.
- Para las respuestas esperadas de los estudiantes:
  - Renderiza la etiqueta "Respuesta esperada del estudiante:" (o similar) una vez como su propio <li>.
  - Renderiza cada respuesta/viñeta subsiguiente como elementos <li> separados con un estilo de sangría: <li style="padding-left: 2em; list-style-type: none;">✅ ...</li>
- Las indicaciones de circulación deben renderizarse como un <li> numerado en la secuencia. O si se proporcionan varias respuestas, sigue el patrón de "Respuesta esperada del estudiante:" anterior.

Comprobación rápida:
- Si la fuente incluye una comprobación rápida, renderízala como:
  <li>Comprobación rápida — …</li>
  luego cada respuesta esperada como líneas <li> separadas:
  <li>✅ Respuesta esperada del estudiante — …</li>
- Diferenciación:
  <p><strong>🪜 Diferenciación</strong></p>
  Usa bloques <p> para el texto de la sección. Para las subsecciones etiquetadas como "Estudiantes que aprenden el idioma", "Estudiantes que necesitan apoyo adicional", "Estudiantes avanzados", renderiza:
    <p><strong>Etiqueta</strong></p>
    <ul><li>...</li></ul>
- Adaptaciones y modificaciones:
  <p><strong>🤝 Adaptaciones y modificaciones</strong></p>
  - General:
    <p><strong>Apoyo general:</strong></p>
    Renderiza cada elemento de apoyo general como un elemento de lista dentro de un <ul> de nivel superior. Cada <li> debe ser texto plano.
  - Apoyo individualizado:
    <p><strong>Apoyo individualizado:</strong></p>
    Para cada estudiante en la matriz IndividualSupport:
      - Renderiza el nombre del estudiante como un <p> con texto en rojo: <p><span style="color: rgb(204, 0, 0);">Nombre del estudiante</span></p>.
      - Luego renderiza un <ul> que contenga exactamente dos elementos <li>:
          <li>{PlanProvided}</li>
          <li>{PlanImplementation}</li>
      - Repite este patrón para cada estudiante.

REFLEXIÓN SOBRE LA DINÁMICA DE GRUPO (REFLECTION ON GROUP DYNAMICS)
- <h3><span style="color: rgb(115, 191, 39);">Reflexión sobre la dinámica de grupo (5 min)</span></h3>

- LessonPlan.ReflectionOnGroupDynamics es una cadena que puede contener segmentos etiquetados como:
  "Teacher facilitation moves:", "Prompts for students:", "Teacher moves:", "Expected student answers:", "Link back ..."

1) Materiales:
   - <p><strong>📚 Materiales</strong></p>
   - Analiza todo después de "Materiales:". Si es "None", renderiza <ul><li>Ninguno</li></ul>, de lo contrario divídelo en UN <ul> de nivel superior.

2) Notas para el docente:
   - Renderiza: <p><strong>Notas para el docente</strong></p>
   - Luego el texto completo de las notas (que explica por qué/cómo ayuda la estrategia) como uno o más bloques <p>.

3) Recuerdo activo:
   - Renderiza:
     <p><strong>📋 Instrucciones para docentes</strong></p>
     <p><strong>Recuerdo activo</strong></p>
   - Renderiza 2 a 3 indicaciones de recuerdo como una lista numerada de nivel superior <ol>.
   - Elimina cualquier duración de tiempo (p. ej., "(30 seg)") del texto.
   - Para cualquier respuesta esperada de los estudiantes, usa el patrón ✅ (p + ul) inmediatamente después de la indicación.

4) Corregir conceptos erróneos comunes:
   - Renderiza: <p><strong>Corregir conceptos erróneos comunes</strong></p>
   - Esto DEBE aparecer justo debajo de la sección de Recuerdo activo.
   - Renderiza como un <ul> donde cada elemento sea un <li> de texto plano.

5) Vínculo con la pregunta esencial + Pensamiento trascendente + Recuerdo espaciado:
   - Renderiza cada uno con su icono y etiqueta específicos:
     <p><strong>💭 Vínculo con la pregunta esencial</strong></p>
     <p><strong>🌍 Pensamiento trascendente</strong></p>
     <p><strong>⏳ Recuerdo espaciado</strong></p>
   - Luego renderiza su contenido respectivo como <p>.

EVALUACIÓN FORMATIVA
- <p><strong>✅ Evaluación formativa</strong></p>
- Renderiza el párrafo introductorio (si está presente).
- Luego abre UN solo <ul> de nivel superior.
- Crea DOS elementos <li> de texto plano (uno para la indicación, otro para la respuesta) para CADA una de las 4 indicaciones en el contenido JSON, manteniéndolas en la misma lista <ul> plana:
  - <li>Indicación X (DOK Y) — "Texto de la pregunta"</li>
  - <li>✅ Respuesta esperada del estudiante — Texto de la respuesta</li>
- NO uses listas anidadas. NO uses <p> dentro de <li>.

PRÁCTICA DEL ESTUDIANTE (STUDENT PRACTICE)
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Práctica del estudiante</span></h3>
    - <p><strong>Notas para el docente:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>
    - Para cada tarea enumerada en StudentPractice.StudentPractice_Tasks (Numerada 1, 2, 3...):
    - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
    - <p><strong>Criterios de éxito</strong></p>
    - <ul> con cada elemento de SuccessCriteria como <li>.
    - Si StudentPractice.StudentPractice_InterleavingIfMath no está vacío:
    - <p><strong>Intercalado (opción de Matemáticas)</strong></p>
    - Proporciona el contenido de intercalado como uno o varios bloques <p>.
`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `
Recibirás UN objeto JSON que sigue estrictamente el esquema UnitPlanResponse (ya validado por mi parte). Tu trabajo es transformar este JSON en un HTML limpio y legible que un docente pueda usar directamente en clase.

FORMATO DE ENTRADA
Te enviaré un objeto JSON de esta manera:

JSON DEL ESQUEMA DE LA UNIDAD:
{{{JsonResponse}}}

Considera todo lo que sigue a la línea "JSON DEL ESQUEMA DE LA UNIDAD:" como el objeto JSON exacto. NO lo expliques ni lo comentes; simplemente analízalo y renderízalo.

REGLAS GLOBALES
    - La salida DEBE ser exclusivamente HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO uses ninguna otra etiqueta (nada de <main>, <section>, <header>, <div>, <h4>, etc.).
    - El HTML debe tener una sangría adecuada y ser fácil de leer.
    - En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca pongas <p>, <span>, <ul>, <ol> ni ninguna otra etiqueta dentro de la lista como hijo directo.
    - NO inventes contenido instructivo nuevo; usa solo lo que está en los campos JSON.
    - Mantén el orden lógico implícito en el esquema:
        1. Información a nivel de unidad (título, descripción, preguntas esenciales, objetivos, estándares)
        2. Luego las lecciones en orden ascendente de LessonNumber
        3. Dentro de cada lección, sigue el orden de los campos del esquema.
    - Si un campo de cadena está vacío (""), OMITE esa subsección y su etiqueta.
    - Si una matriz está vacía, omite su título y el <ul> o <ol> correspondiente.
    - Siempre que el texto forme claramente una lista de indicaciones/preguntas/declaraciones/respuestas, usa <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, usa <p>.
    - Siempre que renderices respuestas modelo/esperadas de los estudiantes en CUALQUIER sección (cada vez que el esquema o el texto indiquen claramente "Expected Student Responses", "Model responses", "Sample answers" o similar), usa este patrón:
    - Primero: <p>✅ Respuestas esperadas de los estudiantes</p>
    - Luego la lista de respuestas:
    - <ul><li>…</li></ul> para respuestas sin un orden específico.
    - <ol><li>…</li></ol> cuando el texto esté claramente numerado u ordenado (p. ej., 1., 2., 3.).


- En la parte superior de la página:
    - <h1> con el Unit Plan Title.
    - Un <p> para la UnitDescription.Description.

- Preguntas esenciales (Essential Questions):
    - <h2>💭 Preguntas esenciales</h2>
    - <ul> con cada elemento de EssentialQuestions como <li>.

- Objetivos de aprendizaje de los estudiantes (Student Learning Objectives):
    - <h2>🎯 Objetivos de aprendizaje</h2>
    - <ul> con cada elemento de StudentLearningObjectives como <li>.

- Estándares (Standards):
    - <h2>📏 Estándares alineados</h2>
    - <ul> con cada cadena de StandardsAligned como <li>.
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
            "description": "Descripción de la unidad como un único párrafo cohesivo de texto plano (4 a 5 oraciones completas) escrito con una voz natural de docente que podría decirse directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional pero siguiendo esta estructura (sin títulos): (1) oración de 'gancho' que despierte la curiosidad o cree un contraste sorprendente, (2) oración 'En esta unidad, van a...' sobre los resultados de dominio, (3) oración 'Fortalecerán sus habilidades en...' sobre las capacidades de pensamiento/análisis, (4) oración 'Esto se conecta con...' sobre la relevancia en el mundo real, (5) oración 'Entender esto es importante porque...' sobre el significado más amplio o el impacto a largo plazo."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Crea preguntas esenciales que se centren exclusivamente en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. NO menciones términos técnicos de materias específicas, procesos, vocabulario ni ejemplos. Las preguntas deben ser abiertas, transferibles entre disciplinas e imposibles de responder simplemente aprendiendo el contenido de la lección o unidad. Céntrate solo en las grandes ideas, no en la materia en sí.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Sección completa de 'Objetivos de aprendizaje de los estudiantes' para toda esta unidad. Cada elemento de la lista debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "array",
            "description": "Enumera todos los estándares educativos únicos utilizados en cualquier lugar de esta unidad y sus lecciones. NO agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, p. ej., 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-Sol-Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'.",
            "items": {
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
        "type": "array",
        "description": "Lista de contenedores de lecciones para esta unidad (solo esquema). Cada elemento debe ser sin superposiciones y estar claramente delimitado para que el contenido de las lecciones no se repita a lo largo de las mismas.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Número secuencial de la lección. Comienza en 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Título corto de la lección como texto plano."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2 a 4 oraciones que describan el alcance de la lección, el enfoque y los límites para evitar la superposición con otras lecciones."
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
          "LessonNumber": {
            "type": "integer",
            "description": "Número secuencial de la lección dentro de la unidad (índice que comienza en 1)."
          },
          "LessonTitle": {
            "type": "string",
            "description": "Título descriptivo corto para la lección. NO incluyas emojis aquí."
          },
          "EssentialQuestions": {
            "type": "array",
            "description": "Pega textualmente las preguntas esenciales del nivel de unidad en el mismo orden si se proporcionan. Si no se proporcionan, crea preguntas esenciales que se centren exclusivamente en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. NO menciones términos técnicos de materias específicas, procesos, vocabulario ni ejemplos. Las preguntas deben ser abiertas, transferibles entre disciplinas e imposibles de responder simplemente aprendiendo el contenido de la lección o unidad. Céntrate solo en las grandes ideas, no en la materia en sí.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Lista de cadenas en formato 'Término - Definición'. Las definiciones deben ser breves, apropiadas para la edad y relacionadas con esta lección.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "2 a 3 objetivos medibles, cada uno terminando con una etiqueta DOK entre paréntesis.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "string",
            "description": "Estándares educativos alineados para esta lección. Deben coincidir exactamente con los estándares de la unidad en cuanto a código y descripción."
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Sección completa de 'Evaluar conocimientos previos' como texto plano (total de 150-250 palabras). SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER UNA CADENA VACÍA para este campo. Para la Lección 1, la estructura debe incluir: 1. Incluye esta sección solo en la primera lección de la unidad, colocada justo después de los objetivos de aprendizaje de los estudiantes. 2. Asegúrate de que se utilicen indicaciones de niveles DOK 1-3. 3. Incluye las habilidades de prerrequisito necesarias para los objetivos de aprendizaje de los estudiantes. 4. Elige una modalidad de esta lista y desarróllala completamente: encuesta, K-W-L, visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, calificación de vocabulario. 5. Indicación inicial del docente con la oración 'Decir:' que introduzca la modalidad elegida y explique cómo los estudiantes demostrarán su comprensión actual. 6. Instrucciones claras y una plantilla/estructura para la modalidad elegida. 7. Sección de 'Respuestas esperadas de los estudiantes' que muestre las respuestas anticipadas o conceptos erróneos comunes para la modalidad elegida. 8. Oración de cierre del docente 'Decir:' que valide el pensamiento de los estudiantes y anuncie la exploración de la unidad. 9. Después de desarrollar completamente una modalidad, proporciona 2 opciones alternativas cortas que el docente pueda elegir."
          },
          "Instruction": {
            "type": "object",
            "description": "Sección de 'Instrucción' de la lección colaborativa (equivalente a la Presentación Directa).",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Lista de materiales.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Guion del docente con indicaciones de Decir/Hacer/Preguntar/Escuchar para/Escribir. NO uses títulos en mayúsculas para las secciones y NO incluyas la duración del tiempo para los pasos individuales."
              },
              "AnticipatedMisconceptions": {
                "type": "string",
                "description": "Conceptos erróneos comunes y lenguaje preciso para corregir cada uno de ellos."
              },
              "TranscendentThinking": {
                "type": "string",
                "description": "Pregunta de aplicación al mundo real que conecte el aprendizaje con el propósito/significado, con 2 a 3 respuestas esperadas de los estudiantes que demuestren una comprensión profunda."
              },
              "QuickCheck": {
                "type": "string",
                "description": "Pregunta final de comprobación de la comprensión con 2 a 3 respuestas esperadas de los estudiantes."
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
            "type": "string",
            "description": "Configuración de 3 a 4 minutos para el tamaño del grupo + roles rotativos + tareas + indicación del docente sobre la estrategia de agrupación."
          },
          "CollaborationGuidelines": {
            "type": "string",
            "description": "~5 minutos. 3 a 5 normas, indicaciones del docente para normas creadas por los estudiantes (completas + cortas) y apoyos para una participación equitativa."
          },
          "CollaborativeActivities": {
            "type": "object",
            "description": "Trabajo grupal interdependiente (reemplazo colaborativo de la práctica guiada). Centrado en el docente, altamente estructurado y diseñado para que los estudiantes no puedan completar la tarea solos. Debe incluir: (a) interdependencia clara (jigsaw, logro de consenso, caminata por la galería, desafío de resolución de problemas estructurado o similar), (b) tiempo explícito para cada fase (p. ej., '8 minutos de discusión, 2 minutos de preparación de la respuesta'), (c) guía del docente con guion usando declaraciones de 'Decir:' en todo momento, (d) producto grupal compartido (afirmación, modelo, cuadro, conjunto de soluciones, artefacto para la galería, etc.), (e) indicaciones de circulación con respuestas esperadas de los estudiantes, (f) al menos una comprobación de la respuesta de TODOS los estudiantes (pizarras blancas, escritura rápida, encuesta, pulgares hacia arriba, etc.) con respuestas esperadas, (g) pregunta de comprobación rápida + respuestas esperadas, (h) diferenciación de tres niveles centrada en la instrucción (no en las adaptaciones), e (i) adaptaciones y modificaciones (AccommodationsAndModifications) divididas en apoyo general y apoyo individualizado que coincida exactamente con los estudiantes/planes proporcionados. Asegura la relevancia cultural y la inclusión invitando múltiples perspectivas y asegurando una participación equitativa.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Lista completa de materiales para docentes + estudiantes utilizados en esta actividad colaborativa. Incluye cualquier elemento preparado (tarjetas de indicaciones, marcos de oraciones, tarjetas de roles, listas de verificación, rúbricas, hojas para la caminata por la galería, pizarras blancas, temporizadores, visuales, bancos de palabras, etc.). Un elemento por elemento de la matriz; sin marcadores de posición.",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Guion dirigido al docente para la actividad colaborativa de 25 minutos. DEBE ser conciso y ajustarse al marco de tiempo (apunta a un total de 6 a 10 pasos numerados). NO uses títulos en mayúsculas (p. ej., CONFIGURACIÓN, MODELADO). NO incluyas la duración del tiempo para los pasos individuales. Las indicaciones de circulación deben integrarse como tareas numeradas individuales (p. ej., '5. Indicación de circulación: ...'). Las respuestas esperadas de los estudiantes deben seguir a la tarea relevante: escribe 'Respuesta esperada del estudiante:' una vez como un paso numerado, luego enumera cada respuesta con sangría en una nueva línea comenzando con una marca de verificación (✅). Ejemplo:\n5. Indicación de circulación: [pregunta]\n6. Respuesta esperada del estudiante:\n7. ✅ Respuesta 1\n8. ✅ Respuesta 2"
              },
              "Differentiation": {
                "type": "string",
                "description": "EXCLUSIVAMENTE diferenciación instructiva (no adaptaciones/modificaciones). Debe organizarse en tres niveles etiquetados exactamente en este orden: 'Estudiantes que aprenden el idioma:', 'Estudiantes que necesitan apoyo adicional:', 'Para estudiantes avanzados:'. Cada nivel debe incluir movimientos de enseñanza concretos (2 a 3 estrategias para los primeros dos niveles; 1 a 2 tareas de extensión para 'Para estudiantes avanzados') alineados con los mismos objetivos de aprendizaje. Incluye al menos una respuesta esperada del estudiante/ejemplo por nivel que muestre cómo se ve el éxito. Mantén el nivel de rigor; varía la complejidad, el apoyo y las demandas del discurso."
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Apoyos de acceso para esta actividad, divididos en (1) apoyo general para todos los estudiantes y (2) apoyo individualizado (IndividualSupport) para estudiantes con planes. Céntrate en el acceso sin reducir el rigor. Para cada apoyo, incluye herramientas concretas (inicios de oraciones exactos, diseño del organizador, descripción visual, pasos de la lista de verificación, etc.). IndividualSupport DEBE incluir exactamente a los estudiantes proporcionados en la indicación (mismos nombres, mismo texto de PlanProvided) y debe agregar una PlanImplementation específica para ESTA actividad.",
                "properties": {
                  "General": {
                    "type": "string",
                    "description": "Apoyo general para toda la clase durante esta actividad colaborativa (no específico para un estudiante). Debe ser concreto y utilizable (p. ej., marcos de oraciones exactos, lista de verificación de 3 pasos, póster/anclaje de pared descrito, banco de palabras proporcionado, tarjetas de tareas desglosadas, plantillas pre-marcadas). No reduzcas el rigor; mejora el acceso."
                  },
                  "IndividualSupport": {
                    "type": "array",
                    "minItems": 0,
                    "description": "Exactamente los estudiantes proporcionados (ni más ni menos). StudentName y PlanProvided deben coincidir exactamente con la indicación. PlanImplementation debe proporcionar un apoyo concreto para ESTA actividad (marcos de oraciones, organizador parcialmente completado, etiquetas bilingües, flujo de trabajo de voz a texto, etc.).",
                    "items": {
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string"
                        },
                        "PlanProvided": {
                          "type": "string"
                        },
                        "PlanImplementation": {
                          "type": "string",
                          "description": "Herramientas concretas/inicios de oraciones/visuales/organizadores para esta tarea."
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
            "type": "string",
            "description": "~5 minutos. Reflexión estructurada sobre cómo trabajó el grupo + movimientos de facilitación del docente + respuestas esperadas de los estudiantes; vinculación con las normas."
          },
          "ReviewAndSpacedRetrieval": {
            "type": "string",
            "description": "Sección completa de 'Revisión y recuerdo espaciado' como texto plano (400-600 palabras). DEBE incluir estos componentes por orden: (1) Lista de materiales, (2) Notas para el docente: Un párrafo que explique el 'porqué' y el 'cómo' (teoría/ciencia), no indicaciones para el docente. Usa este inicio: 'Nota para el docente: Esta estrategia promueve la retención a través del recuerdo activo y conecta las ideas de hoy sobre [tema] con conceptos previos de [concepto]. El recuerdo espaciado ayuda a los estudiantes a reconocer cómo [tema] impacta en [gran idea]...', (3) Recuerdo activo: 2 a 3 elementos numerados que pidan a los estudiantes recordar el NUEVO aprendizaje de la lección de HOY (NO completar espacios, SIN boleto de salida, SIN reflexión sobre la mejora), (4) Corregir conceptos erróneos comunes: Colocado justo debajo del Recuerdo activo y alineado con las preguntas planteadas, (5) Vínculo con la pregunta esencial: Indicación del docente que conecte con la pregunta de la unidad + respuestas esperadas, (6) Pensamiento trascendente: Pregunta de aplicación al mundo real + respuestas esperadas, (7) Recuerdo espaciado: Recuerdo de una lección/unidad previa específica (mencionando el número de lección). Para todas las indicaciones, incluye 'Respuesta esperada del estudiante:' con 2 a 3 ejemplos concretos."
          },
          "FormativeAssessment": {
            "type": "string",
            "description": "Sección completa de 'Evaluación formativa' como texto plano. Esta DEBE contener exactamente 4 indicaciones de preguntas etiquetadas como 'Indicación 1 (DOK 1):', 'Indicación 2 (DOK 2):', 'Indicación 3 (DOK 3):' e 'Indicación 4 (DOK 4):'. Para cada indicación: - Pregunta que evalúe la comprensión en el nivel DOK especificado - Título '✅ Respuestas esperadas de los estudiantes' - 1 a 2 muestras de respuestas que demuestren el dominio. NO incluyas la sección 'Reflexión'. Ejemplo de formato: Indicación 1 (DOK 1): '¿Por qué los planetas permanecen en órbita?' ✅ Respuestas esperadas de los estudiantes - 'La gravedad y el movimiento hacia adelante.' [Continuar para las indicaciones 2-4]"
          },
          "StudentPractice": {
            "type": "string",
            "description": "Tarea / práctica fuera de clase. Debe seguir el mismo formato obligatorio que la instrucción directa, incluyendo ✅ Respuestas esperadas de los estudiantes."
          }
        },
        "required": [
          "LessonNumber",
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
        "CollaborativeActivities.AccommodationsAndModifications"
      ]
    }
  }
};
