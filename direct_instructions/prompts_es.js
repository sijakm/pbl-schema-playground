window.promptsES = {
  STEP0_PROMPT_TEMPLATE: `
Crea el esquema de la unidad y la estructura de las lecciones utilizando la información a continuación. NO escribas planes de lecciones completos.
                    
Basándote en el Tema de la Unidad, los estándares educativos, la Descripción/Instrucción de la Unidad, el Nivel de Grado, la Duración del período de clase (minutos) y el Número de Lecciones solicitado, genera una respuesta JSON que incluya una UnitDescription cohesiva y una lista de "contenedores" de lecciones que no se superpongan.

Tema de la Unidad:
{{$Subject}}

Nombre de la Unidad:
{{$Name}}

Descripción/Instrucción de la Unidad:
{{$UserPrompt}}

Nivel de Grado:
{{$GradeLevel}}

Duración del período de clase en minutos:
{{$ClassDuration}}
  
Estándares a Alinear:
{{$Standards}}
    
Estudiantes con apoyo individualizado:
{{$LearningPlans}}

Recursos/Medios a utilizar:
{{$MediaContext}}
  
Contenido de la Unidad:
{{$AttachedUnit}}

Requisitos para las Preguntas Esenciales (Essential Questions):
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "¿Cómo" o "¿Por qué".
- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales o de definición.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en el contenido específico de la materia.
- Las preguntas DEBEN ser transferibles a través de las disciplinas y aplicables más allá de esta unidad.
- Las preguntas DEBEN reutilizarse textualmente en cada lección de la unidad.

Qué generar:
- La salida DEBE ser un JSON válido que coincida con el esquema.
- OBLIGATORIO: Completa todas las propiedades dentro del objeto "UnitDescription":
  - "Description": Escribe un párrafo de 4 a 5 oraciones que describa el enfoque central de la unidad y el recorrido narrativo.
  - "StudentLearningObjectives": Enumera de 3 a 5 objetivos de aprendizaje clave y medibles para la unidad.
  - "StandardsAligned": Enumera todos los estándares que se abordan a lo largo de la unidad.
  - "EssentialQuestions": Exactamente 3 preguntas conceptuales siguiendo las reglas anteriores.
- GENERA la lista de "Lessons" que contenga exactamente {{$NumberOfItems}} lecciones.
  - Cada lección debe incluir "lessonNumber" (índice basado en 1), "lessonName" y "lessonDescription" (2 a 4 oraciones que describan el alcance de la lección).

Restricciones:
- Mantén la unidad y cada lección alineadas con el enfoque de la unidad.
- Asegura una secuencia lógica desde las ideas fundamentales hasta el modelado más complejo.
- Precisión: Todo el contenido debe ser científicamente preciso y apropiado para la edad.

La salida DEBE ser un JSON válido que coincida con el esquema. Utiliza un formato compacto (sin líneas en blanco adicionales).
`,
  PER_LESSON_PROMPT_TEMPLATE: `
Crea UN plan de lección (NO un plan de unidad, NO varias lecciones) utilizando la información a continuación.
DEBES generar un JSON válido que coincida exactamente con el esquema JSON proporcionado (LessonPlanResponse con un solo objeto "LessonPlan"). No incluyas claves adicionales. Utiliza un formato JSON compacto (sin líneas en blanco adicionales).

Tema de la Unidad: 
{{$Subject}}
Nombre de la Unidad: 
{{$Name}}
Descripción/Instrucción de la Unidad: 
{{$UserPrompt}}
Nivel de Grado: 
{{$GradeLevel}}
Duración del período de clase en minutos:
{{$ClassDuration}}
Recursos/Medios a utilizar: 
{{$MediaContext}}
Contenido de la Unidad: 
{{$ParentUnitData}}
Estándares a Alinear:
{{$Standards}}
Contenido de la Lección Adjunto: 
{{$AttachedLesson}}

Preguntas Esenciales de la Unidad (ÚSALAS TEXTUALMENTE):
{{$UnitEssentialQuestions}}

Si las Preguntas Esenciales de la Unidad anteriores están vacías, genera exactamente 3 preguntas conceptuales siguiendo estas reglas:
- Cada pregunta DEBE ser una oración completa y gramaticalmente correcta que termine con un signo de interrogación.
- Cada pregunta DEBE comenzar con "¿Cómo" o "¿Por qué".
- Las preguntas DEBEN ser conceptuales y exploratorias, no fácticas, procedimentales o de definición.
- Las preguntas DEBEN centrarse en ideas amplias y universales (como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento), no en el contenido específico de la materia.
- Las preguntas DEBEN ser transferibles a través de las disciplinas y aplicables más allá de esta unidad.


ESTUDIANTES CON APOYO INDIVIDUALIZADO (DEBEN usarse ÚNICAMENTE dentro de GuidedPractice.AccommodationsAndModifications; usa los nombres/planes de los estudiantes exactamente como están escritos):
{{$LearningPlans}}

REGLAS DE CONTENIDO IMPORTANTES:
- Mantén la lección alineada con el enfoque de la unidad: desarrollar y usar modelos para describir la composición atómica de moléculas simples y/o estructuras extendidas.
- Incluye conexiones breves y de alto nivel con otros DCI relevantes cuando sea apropiado, pero mantén la lección centrada en el modelado y el razonamiento de estructura-propiedad (sin matemáticas profundas, sin balanceo de ecuaciones a menos que los estándares lo requieran explícitamente).
- Asegúrate de que todas las partes de la lección reflejen el Alcance/Límites de la Lección anteriores; evita introducir nuevos conceptos importantes que pertenezcan a otras lecciones.
- EssentialQuestions: DEBEN ser exactamente iguales a las preguntas esenciales a nivel de unidad (mismo texto, mismo orden).
- AssessPriorKnowledge: SOLO si LessonNumber == 1, escribe de 150 a 250 palabras y sigue la estructura requerida en la descripción del esquema. Si LessonNumber != 1, devuelve "" (cadena vacía).
- DirectPresentation debe durar ≤10 minutos en total y DEBE seguir el formato HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT requerido con Say/Do/Ask/✅ Expected Student Responses/Write, y las respuestas esperadas de los estudiantes como puntos (NO incluyas los encabezados/títulos de las secciones en la cadena).
- GuidedPractice.InstructionsForTeachers debe tener al menos 700 palabras e incluir los componentes requeridos enumerados en la descripción del esquema.
- GuidedPractice.AccommodationsAndModifications debe incluir:
  - General: apoyos generales
  - IndividualSupport: matriz con exactamente los estudiantes proporcionados y sus planes (mismos nombres/planes; sin estudiantes adicionales).
- StudentPractice DEBE incluir un párrafo de TeacherNotes que comience con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.', una lista de 2-3 tareas con DOK 2-4 y criterios de éxito, e interleaving (entrelazado) si la materia es matemáticas.

REQUISITOS DE SALIDA:
- La salida DEBE ser un JSON válido que coincida exactamente con el esquema proporcionado.
- La salida DEBE ser un plan de lección ÚNICO solamente.
- Sin HTML. Sin emojis. Sin markdown. Texto sin formato dentro de los campos de cadena.
`,
  HTML_LESSON_PROMPT_TEMPLATE: `
Recibirás UN objeto JSON que sigue estrictamente el esquema UnitPlanResponse (ya validado de mi lado). Tu trabajo es transformar este JSON en un HTML limpio y legible que un profesor pueda usar directamente en clase.

FORMATO DE ENTRADA
Te enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trata todo lo que aparezca después de la línea "UNIT PLAN JSON:" como el objeto JSON exacto. NO lo expliques ni comentes; solo analízalo y renderízalo.

REGLAS GLOBALES
    - Salida ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    - Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, 
    - (envuelto dentro de <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    - NO uses ninguna otra etiqueta (nada de <main>, <section>, <header>, <div>, <h4>, etc.).
    - El HTML debe estar bien sangrado y ser fácil de leer.
    - En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca coloques <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    - NO inventes contenido educativo nuevo; usa solo lo que existe en los campos JSON.
    - Preserva el orden lógico implícito en el esquema:
    - Dentro de cada lección, sigue el orden de los campos del esquema.
    - Si un campo de cadena está vacío (""), OMITE esa subsección y su etiqueta.
    - Si una matriz está vacía, omite su encabezado y la <ul> o <ol> correspondiente.
    - Siempre que el texto forme claramente una lista de avisos/preguntas/declaraciones/respuestas, usa <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, usa <p>.
    - Siempre que renderices respuestas modelo/esperadas de los estudiantes en CUALQUIER sección, usa este patrón:
        - Primero: <p>✅ Respuestas esperadas de los estudiantes</p> (sin puntos en esta línea)
        - Luego una lista <ul> o <ol> que contenga las respuestas (una respuesta por <li>).
    - Siempre que renderices un Chequeo Rápido (Quick Check):
        - Usa este encabezado exacto: <p><strong>✔Chequeo Rápido</strong></p>
        - Renderiza la pregunta o tarea inmediatamente después del encabezado como un párrafo que asigne a CADA estudiante demostrar su comprensión (no solo un estudiante en un chequeo verbal).
        - Usa el patrón global de ✅ Respuestas esperadas de los estudiantes para las respuestas.

Para esta lección:
    - Preguntas Esenciales de la Lección (si las hay):
    - <h3>💭 Preguntas Esenciales</h3>
    - <ul> con cada elemento en Lesson.EssentialQuestions como <li>.
    - Vocabulario Clave (si lo hay):
    - <h3>🔤 Vocabulario Clave</h3>
    - <ol> donde cada elemento de KeyVocabulary sea un <li>, manteniendo la estructura "Término – Definición":
    - <strong>Término</strong> – Definición
    - Objetivos de Aprendizaje del Estudiante (si los hay):
    - <h3>🎯 Objetivos de Aprendizaje del Estudiante</h3>
    - <ul> con cada elemento de Lesson.StudentLearningObjectives como <li>.
    - Estándares para la lección:
    - <h3>📏 Estándares Alineados</h3>
    - <ul> que contenga Lesson.StandardsAligned como <li>.
    Regla estricta — Estándares Alineados siempre debe renderizarse:
    Si Lesson.StandardsAligned contiene al menos un elemento no vacío, DEBES renderizar el bloque "📏 Estándares Alineados" exactamente una vez para esa lección. No lo omitas por ningún motivo.
    Ubicación: renderízalo inmediatamente después de "🎯 Objetivos de Aprendizaje del Estudiante"; si se renderiza "💡 Evaluación de conocimientos previos", entonces renderiza "📏 Estándares Alineados" inmediatamente después del bloque Evaluación de conocimientos previos.

EVALUACIÓN DE CONOCIMIENTOS PREVIOS (ASSESS PRIOR KNOWLEDGE)
    - Esta subsección aparece SOLO si la propiedad "AssessPriorKnowledge" existe en el JSON y es una cadena no vacía.
    - Colócala inmediatamente después del bloque <h3>🎯 Objetivos de Aprendizaje del Estudiante</h3> de esa lección.

    Renderización:
        - <h3>💡 Evaluación de conocimientos previos</h3>
        - Renderiza el siguiente párrafo: <p><strong>Nota para el profesor: </strong>Activar los conocimientos previos de los estudiantes no es solo un calentamiento, es neurociencia en acción. Este proceso activa las vías neuronales existentes, facilitando que el cerebro asocie la nueva información con lo que ya se conoce. Esta técnica, llamada codificación elaborativa, ayuda a los estudiantes a trasladar el conocimiento a la memoria a largo plazo de manera más rápida y efectiva, mejorando tanto la comprensión como la retención. </p>
        - Descripción general:
            - Renderiza cualquier párrafo del guion inicial del profesor que introduzca la actividad como uno o más bloques <p> antes de cualquier lista.
        - Instrucciones:
            - Renderiza las instrucciones del profesor como una lista con viñetas (<ul>) donde cada instrucción se convierta en un <li> de texto sin formato (NO incluyas HTML dentro de <li>).
            - NO anides listas dentro de ningún <li>; todas las listas deben ser de nivel superior y contener solo <li>.
        - Plantilla/Estructura:
            - Renderiza el texto de la Plantilla/Estructura como un solo párrafo <p> que contenga el guion del profesor (p. ej., Diga: ... Haga: ...), preservando la redacción y puntuación exactas.
            - Inmediatamente después de ese <p>, si se proporcionan las respuestas esperadas de los estudiantes, renderiza:
            <p>✅ Respuestas esperadas de los estudiantes</p>
            seguido de una <ul> donde cada respuesta sea un <li> de texto sin formato.
            - NO coloques estas listas de respuestas dentro de ningún otro <li> o lista.
        - Líneas de cierre:
            - Cualquier oración de cierre del profesor proporcionada como un párrafo separado debe renderizarse como su propio <p> después de las listas.
        - Restricciones:
            - Preserva la redacción exacta de la fuente; no inventes ni resumas contenido.
            - Usa solo las etiquetas permitidas; las listas solo pueden contener <li> como hijos directos; no hay listas anidadas dentro de <li>.
            - Asegura una sangría legible y que todos los elementos <li> sean solo texto sin formato.
        - Opciones Alternativas:
            - Coloca esto DESPUÉS del cierre de la </ol> de la lista ordenada principal.
            - Primera salida: <p><strong>Opciones Alternativas</strong></p>
            - Luego renderiza una lista ordenada independiente de nivel superior <ol> donde cada opción sea un <li> de texto sin formato.

No inventes contenido; solo reestructura lo que existe dentro de Lesson.AssessPriorKnowledge.

PRESENTACIÓN DIRECTA (DIRECT PRESENTATION)
    - Renderiza la sección Presentación Directa (si está presente para esa lección) como:

    - <h3><span style="color: rgb(115, 191, 39);">Presentación Directa (10 min)</span></h3>
    - Materiales (si los hay):
    - <p><strong>📚 Materiales</strong></p>
    - <ul> con elementos <li> de DirectPresentation.Materials.
    - Instrucciones para los profesores:
    - <p><strong>📋 Instrucciones para los profesores</strong></p>
    - Renderiza el guion dirigido al profesor como una secuencia de bloques <p>. Cada indicación u oración del profesor que comience con etiquetas como "Diga:", "Haga:", "Pregunte:", "Escriba:" o "Dibuje/Muestre:" debe ser su propio <p> numerado cuando sea explicativo o de ambientación (por ejemplo: Diga: "…", Haga: Muestre …).
    - IMPORTANTE: Siempre que encuentres respuestas de los estudiantes (p. ej., "✅ Respuestas esperadas de los estudiantes:"), NO las incluyas dentro de ningún bloque <p>. En su lugar, RENDERÍZALAS SIEMPRE como una <ul> independiente de nivel superior inmediatamente después del <p> anterior. Cada respuesta individual DEBE ser su propio <li>. NO combines varias respuestas en un solo <li>. Cada <li> debe comenzar con la etiqueta "✅ Respuestas esperadas de los estudiantes — ".
    - Si en su lugar eliges renderizar la secuencia de pasos PRINCIPALES como una lista, usa una <ul> de nivel superior donde cada paso PRINCIPAL sea un <li>. Cada uno de estos <li> DEBE contener solo texto sin formato (sin etiquetas HTML dentro del <li>). Preserva las indicaciones del profesor como texto sin formato dentro de esos <li>.
    - NO anides <ul>, <ol>, <p>, <span> o cualquier otro HTML dentro de un <li>. Para representar subpuntos, avisos, preguntas, respuestas modelo o subpasos ordenados, APLÁNALOS como entradas <li> de nivel superior consecutivas adicionales inmediatamente después del paso principal, usando un prefijo claro que los vincule con el paso principal. Ejemplos de prefijos requeridos:
        - "Relacionado con el paso anterior: …"
        - "Del paso 2: …"
        - "Paso 3.a — …"
    - Las respuestas esperadas de los estudiantes que normalmente estarían anidadas DEBEN aplanarse en elementos <li> de nivel superior individuales. Cada uno de estos <li> debe comenzar con la etiqueta de texto sin formato:
        ✅ Respuestas esperadas de los estudiantes — [Texto de la respuesta]
           - Mantén una respuesta por <li>.

        7) Formato estricto y seguridad:
           - Usa solo las etiquetas permitidas (<p>, <h1>, <h2>, <h3>, <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>).
           - Las listas solo pueden contener <li> como hijos directos. No hay listas anidadas dentro de un <li>.
           - Preserva la redacción exacta del profesor del JSON; no inventes ni resumas.
           - Asegura una sangría legible.

        APLICA ESTAS REGLAS DE MAPEO:
      (Una respuesta por <li>; SEPÁRALAS SIEMPRE; no las combines con guiones ni las combines en un <li>).
    - Para los Chequeos Rápidos que se incrustarían en la secuencia, usa el patrón global de ✔Chequeo Rápido y ✅ Respuestas esperadas de los estudiantes.
    - Después del paso final o del último bloque <p>/<ul>, CIERRA la etiqueta <ul> si abriste una para los pasos PRINCIPALES y continúa con el siguiente bloque o sección etiquetados según sea necesario.
    - Ideas Erróneas Anticipadas (si las hay):
    - <p><strong>⚠️ Ideas Erróneas Anticipadas</strong></p>
    - Renderiza las ideas erróneas como uno o más <p> o como <ul><li>…</li></ul>. No coloques listas anidadas adicionales dentro de <li>—mantén las listas solo como <ul> de nivel superior donde cada <li> sea texto sin formato.
    - Pensamiento Trascendente (si lo hay):
    - <p><strong>🌍 Pensamiento Trascendente</strong></p>
    - Usa <p> para el texto explicativo y <ul><li>…</li></ul> para los ejemplos. Mantén cada <li> como texto sin formato.
    - Si se proporcionan ejemplos/modelos, usa el patrón global para las respuestas:
    - <p>✅ Respuestas esperadas de los estudiantes</p> seguido de la lista apropiada colocada fuera de cualquier <li> (ya sea como una <ul> de nivel superior o como entradas <li> aplanadas en la <ol> principal), para que no se produzca anidamiento HTML dentro de los elementos de la lista.
    - Chequeo Rápido (si lo hay):
    - Usa el encabezado global ✔Chequeo Rápido seguido de la tarea y el patrón ✅ Respuestas esperadas de los estudiantes.

PRÁCTICA GUIADA (GUIDED PRACTICE)
    - Renderiza la Práctica Guiada (si está presente) como:

    - <h3><span style="color: rgb(115, 191, 39);">Práctica Guiada</span></h3>
    - Materiales (si los hay):
    - <p><strong>📚 Materiales</strong></p>
    - <ul> con elementos <li> de GuidedPractice.Materials.</ul>

    - Instrucciones para los profesores:
    - <p><strong>📋 Instrucciones para los profesores</strong></p>
    - Renderiza el guion dirigido al profesor como una secuencia de bloques <p>.
    - Cada paso numerado del JSON (1., 2., 3...) debe comenzar su propio <p>.
    - Si un paso incluye subavisos (como los avisos de circulación del Paso 6):
        - Renderiza cada aviso como su propio bloque <p> (p. ej., "Aviso 1: '...'").
        - Renderiza "✅ Respuestas esperadas de los estudiantes" como su propio bloque <p>.
        - Renderiza las respuestas de ejemplo adjuntas como una lista de viñetas <ul> con cada respuesta en su propio <li>.
    - Para el Chequeo Rápido al final:
        - Renderiza <p><strong>Chequeo Rápido</strong> "{TaskText}"</p>
        - Renderiza <p>✅ Respuestas esperadas de los estudiantes</p>
        - Renderiza las respuestas como una lista <ul><li>.
    - Reglas de presentación adicionales (se aplican a la opción anterior):
      - Para el Trabajo en Grupo/Pareja, Roles, Rotaciones y líneas de Configuración: renderiza cada oración clara como su propio <p>, preservando los nombres de los roles y los tiempos exactamente como se proporcionan.
      - NO inventes ni resumas contenido; solo reestructura lo que existe en el JSON.
      - Mantén los patrones de ejemplo exactamente al renderizar respuestas modelo/esperadas y chequeos rápidos.

    -  Diferenciación (si la hay):
    -  <p><strong>🪜 Diferenciación</strong></p>
    -  Usa bloques <p> para el texto explicativo.
    -  Para subsecciones etiquetadas como "Estudiantes del Idioma", "Andamiaje Adicional", "Profundizar" (o similares):
        - Usa <p><strong>Etiqueta</strong></p> para cada etiqueta.
        - Debajo de cada etiqueta, usa una <ul> de nivel superior con elementos <li> de texto sin formato (no anides listas dentro de los elementos de la lista).

    -  Adaptaciones y Modificaciones (si las hay):
    -  <p><strong>🤝 Adaptaciones y Modificaciones</strong></p>
    -  Comienza con una línea para los apoyos generales como su propio párrafo, p. ej., <p><strong>Apoyo general:</strong></p>
    -  Luego renderiza cada elemento de apoyo general como un elemento de lista dentro de una <ul> de nivel superior. Cada <li> debe ser texto sin formato.
    -  Después de los apoyos generales, renderiza los apoyos individuales:
        - Usa una etiqueta de párrafo: <p><strong>Apoyo individual:</strong></p>
        - Para cada estudiante en la matriz IndividualSupport:
            - Renderiza el nombre del estudiante como un <p> con texto en rojo: <p><span style="color: rgb(204, 0, 0);">Nombre del Estudiante</span></p>.
            - Luego renderiza una <ul> que contenga exactamente dos elementos <li>:
                - <li>{PlanProvided}</li>
                - <li>{PlanImplementation}</li>
            - Repite este patrón para cada estudiante.
    -  Usa ÚNICAMENTE los nombres y planes de los estudiantes proporcionados en el JSON (lista IndividualSupport); no inventes ni agregues estudiantes adicionales.

    Notas (resumen de reglas de compatibilidad):
    - Nunca coloques etiquetas HTML dentro de los elementos <li> utilizados para la lista ordenada de instrucciones principal; esos <li> deben ser solo texto sin formato.
    - Representa cualquier estructura anidada aplanándola en entradas <li> de nivel superior adicionales con prefijos claros (como en Evaluación de conocimientos previos).
    - Usa etiquetas de párrafo (<p><strong>…</strong></p>) y listas de nivel superior (<ul>, <ol>) fuera de esos elementos <li> de texto sin formato para encabezados, materiales, diferenciación y adaptaciones.

PRÁCTICA INDEPENDIENTE (INDEPENDENT PRACTICE)
    - Renderiza la Práctica Independiente (si está presente) como:

    <h3><span style="color: rgb(115, 191, 39);">Práctica Independiente</span></h3>
    - Materiales (si los hay):
    - <p><strong>📚 Materiales</strong></p>
    - <ul> con elementos <li> de IndependentPractice.Materials.</ul>
    - <p><strong>Propósito:</strong></p>
    - Usa <p> para el texto del propósito.

    - Instrucciones para los profesores:
    - Renderiza cada tarea del profesor como un solo encabezado de párrafo en este patrón exacto:
      <p><strong>Tarea N (DOK X):</strong> Notas del Profesor: [texto de las notas]. Diga: "…"</p>
      - Reemplaza N con el número de tarea en orden ascendente y X con el nivel de DOK proporcionado.
      - Incluye cualquier etiqueta del guion del profesor (Diga:, Haga:, Pregunte:, Escriba:, Dibuje/Muestre:, Escuche por:) textualmente dentro del párrafo.
      - Si el texto del párrafo de la tarea está vacío, omite esa tarea por completo.
    - Si existen Respuestas Esperadas de los Estudiantes para una tarea, renderízalas inmediatamente después de ese párrafo de tarea:
      <p>✅ Respuestas esperadas de los estudiantes</p>
      <ul><li>Respuesta 1</li><li>Respuesta 2</li></ul>
      - Usa <ul> o <ol> basándote en si las respuestas están claramente ordenadas. Cada respuesta es un <li>. No anides listas dentro de <li>.
    - Si existen Criterios de Éxito para una tarea, renderiza:
      <p>Criterios de Éxito</p>
      <ul><li>Criterio 1</li><li>Criterio 2</li></ul>
      - Omite este bloque si la matriz de criterios está vacía.
    - Si existen avisos de Reflexión para el bloque de tareas, renderiza:
      <p><strong>Reflexión:</strong></p>
      - Luego renderiza cada oración o aviso de reflexión como su propio <p>. Usa <p> separados para los avisos de autorregulación y los avisos trascendentes si se proporcionan.
    - Renderiza las tareas en orden ascendente de tareas. Omite cualquier subsección cuya cadena o matriz de origen esté vacía.
    - Usa solo las etiquetas permitidas y asegura que el HTML permanezca bien sangrado y legible.
    - NO aplanes estos bloques de párrafo de tarea + lista en la regla de <ol> aplanada de Evaluación de conocimientos previos / Presentación Directa; este bloque es el formato alternativo para las tareas del profesor y debe seguir exactamente la estructura del ejemplo.

REPASO Y RECUPERACIÓN ESPACIADA (REVIEW & SPACED RETRIEVAL) (5 min)
    - <h3><span style="color: rgb(115, 191, 39);">Repaso y Recuperación Espaciada (5 min)</span></h3>
    - Renderiza el contenido de la cadena ReviewAndSpacedRetrieval siguiendo estas reglas de mapeo:
        - Encabezado 📚 Materiales: Sigue con una lista de elementos.
        - Etiqueta Notas del Profesor: Renderiza como <p><strong>Notas del Profesor:</strong> [texto de las notas]</p>.
        - Encabezado 📋 Instrucciones para los profesores: Renderiza como <p><strong>📋 Instrucciones para los profesores</strong></p>.
        - Subencabezado Recuerdo Activo (Active Recall): Renderiza como <p><strong>Recuerdo Activo</strong></p>. Sigue con elementos numerados y el guion Diga:.
        - Usa el patrón global de ✅ Respuestas esperadas de los estudiantes para todas las respuestas de ejemplo.
        - Subencabezado Corregir Ideas Erróneas Comunes: En negrita. Renderiza como <ul> con cada "Si el estudiante dice... responda:..." como <li>.
        - Subencabezado 💭Conexión con la Pregunta Esencial: En negrita.
        - Subencabezado 🌍Pensamiento Trascendente: En negrita.
        - Subencabezado ⌛Recuperación Espaciada: En negrita.
        - Asegura que cada sección de subencabezado siga la estructura de la imagen (Acciones numeradas, guiones Diga:, viñetas).

EVALUACIÓN FORMATIVA (Renderizada como parte del capítulo de Repaso)
    - <h3><span style="color: rgb(115, 191, 39);">✅Evaluación Formativa</span></h3>
    - Renderiza el párrafo de introducción (si está presente).
    - Para cada Aviso N (DOK X):
        - <p><strong>Aviso N (DOK X):</strong> {QuestionText}</p>
        - Renderiza "✅ Respuestas esperadas de los estudiantes" como su propio <p>. Usa el símbolo global ✅.
        - Renderiza las respuestas adjuntas como una lista de viñetas <ul> con cada respuesta en su propio <li>.

Reglas estrictas (seguro para la interfaz de usuario, sin anidamiento):
    - Avisos:
       - Para CADA aviso en orden ascendente, agrega UN <li> de texto sin formato que contenga ÚNICAMENTE:
    Aviso X (DOK Y) — "Texto de la pregunta"
    - NO coloques ninguna etiqueta HTML dentro de este <li>.
    - NO coloques <p> dentro de <li>.
    - Respuestas esperadas (intercaladas, sin sublistas):
    -  Inmediatamente DESPUÉS del <li> del aviso, si ese MISMO aviso tiene respuestas esperadas/modelo/del estudiante, renderiza cada respuesta como su propio <li> de texto sin formato (aún dentro de la MISMA <ul> de nivel superior), cada una comenzando exactamente con:
    ✅ Respuesta esperada del estudiante — Texto de la respuesta
        - Una respuesta por <li>.
        - NO crees ninguna <ul> o <ol> anidada en ninguna parte de la Evaluación Formativa.
        - CIERRA la <ul> después de todos los elementos <li> del aviso y sus elementos <li> de respuesta esperada intercalados.

Reflexión:
    - Después de la <ul> cerrada, renderiza la reflexión solo como párrafos:
    - <p><strong>Reflexión:</strong></p>
    - <p>Avisos de autorregulación: ...</p>
    - <p>Avisos trascendentes: ...</p>

PRÁCTICA DEL ESTUDIANTE (STUDENT PRACTICE)
    - <h3><span style="color: rgb(115, 191, 39);">🖊 Práctica del Estudiante</span></h3>
    - <p><strong>Notas del Profesor:</strong> {StudentPractice.StudentPractice_TeacherNotes}</p>

    - Para cada tarea en StudentPractice.StudentPractice_Tasks (Numerada 1, 2, 3...):
        - <p><strong>{Number}. ({DOK})</strong> {StudentDirections}</p>
        - <p><strong>Criterios de Éxito</strong></p>
        - <ul> con cada elemento de SuccessCriteria como un <li>.
    - Si StudentPractice.StudentPractice_InterleavingIfMath no está vacío:
        - <p><strong>Interleaving (Solo matemáticas)</strong></p>
        - Renderiza el contenido de interleaving como uno o más bloques <p>.


INSTRUCCIONES FINALES
    - Salida ÚNICAMENTE HTML usando las etiquetas permitidas enumeradas en las REGLAS GLOBALES.
    - NO uses ninguna otra etiqueta HTML.
    - Asegúrate de que la estructura y el orden reflejen el esquema JSON y los patrones descritos anteriormente.
    - NO incluyas el título de la lección (no uses <h2>); comienza tu salida directamente con la sección <h3>💭 Preguntas Esenciales</h3> y continúa desde allí.
`,
  UNIT_COMMON_HTML_PROMPT_TEMPLATE: `
Recibirás UN objeto JSON que sigue estrictamente el esquema UnitPlanResponse (ya validado de mi lado). Tu trabajo es transformar este JSON en un HTML limpio y legible que un profesor pueda usar directamente en clase.
                   
FORMATO DE ENTRADA
Te enviaré el objeto JSON de esta manera:

UNIT PLAN JSON:
{{{JsonResponse}}}

Trata todo lo que aparezca después de la línea "UNIT PLAN JSON:" como el objeto JSON exacto. NO lo expliques ni comentes; solo analízalo y renderízalo.

REGLAS GLOBALES
    -  Salida ÚNICAMENTE HTML válido (sin markdown, sin comillas invertidas, sin explicaciones en prosa).
    -  Etiquetas permitidas: <p>, <h1>, <h2>, <h3>, 
    -  (envuelto dentro de <p>), <strong>, <em>, <u>, <s>, <sup>, <sub>, <span>, <ol>, <ul>, <li>, <a>, <img>.
    -  NO se deben usar otras etiquetas (nada de <main>, <section>, <header>, <div>, <h4>, etc.).
    -  El HTML debe estar bien sangrado y ser fácil de leer.
    -  En cualquier <ol> o <ul>, usa ÚNICAMENTE elementos <li> como hijos directos. Nunca coloques <p>, <span>, <ul>, <ol> o cualquier otra etiqueta como hijo de una lista.
    -  NO inventes contenido educativo nuevo; usa solo lo que existe en los campos JSON.
    -  Preserva el orden lógico implícito en el esquema:
        1. Información a nivel de unidad (título, descripción, preguntas esenciales, objetivos, estándares)
        2. Luego las Lecciones en orden ascendente de LessonNumber
        3. Dentro de cada lección, sigue el orden de los campos del esquema.
    -  Si un campo de cadena está vacío (""), OMITE esa subsección y su etiqueta.
    -  Si una matriz está vacía, omite su encabezado y la <ul> o <ol> correspondiente.
    -  Siempre que el texto forme claramente una lista de avisos/preguntas/declaraciones/respuestas, usa <ul><li>…</li></ul> o <ol><li>…</li></ol>. De lo contrario, usa <p>.
    -  Siempre que renderices respuestas modelo/esperadas de los estudiantes en CUALQUIER sección (siempre que el esquema o el texto indiquen claramente "Expected Student Responses", "Model responses", "Sample answers" o similares), usa este patrón:
    -  Primero: <p>✅ Respuestas esperadas de los estudiantes</p>
    -  Luego una lista de respuestas:
    -  <ul><li>…</li></ul> para respuestas sin un orden específico.
    -  <ol><li>…</li></ol> cuando el texto esté claramente numerado u ordenado (p. ej., 1., 2., 3.).


- En la parte superior de la página:
    -  <h1> con UnitTitle.
    -  Un <p> para UnitDescription.

- Preguntas Esenciales (si las hay):
    -  <h2>💭 Preguntas Esenciales</h2>
    -  <ul> con cada elemento de EssentialQuestions como <li>.

- Objetivos de Aprendizaje del Estudiante (si los hay):
    -  <h2>🎯 Objetivos de Aprendizaje del Estudiante</h2>
    -  <ul> con cada elemento de StudentLearningObjectives como <li>.

- Estándares (si los hay):
    -  <h2>📏 Estándares Alineados</h2>
    -  <ul> con cada cadena de StandardsAligned como <li>.
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
            "description": "Descripción de la unidad como un párrafo cohesivo de texto sin formato (4 a 5 oraciones completas) escrito con la voz natural de un profesor que podrías decir directamente a los estudiantes. Sin HTML, sin emojis, sin viñetas. Debe fluir de manera conversacional pero seguir esta estructura (sin titulares): (1) oración de enganche que despierte la curiosidad o cree un contraste sorprendente, (2) oración 'En esta unidad, aprenderás...' sobre los resultados del dominio, (3) oración 'Fortalecerás tus habilidades en...' sobre las capacidades de pensamiento/análisis, (4) oración 'Esto se conecta con...' sobre la relevancia en el mundo real, (5) oración 'Entender esto es importante porque...' sobre la importancia más amplia o el impacto a largo plazo."
          },
          "EssentialQuestions": {
            "type": "array",
            "minItems": 3,
            "maxItems": 3,
            "description": "Crea preguntas esenciales que se centren únicamente en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. NO menciones términos, procesos, vocabulario o ejemplos específicos de la materia. Las preguntas deben ser abiertas, transferibles a través de todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Céntrate solo en las grandes ideas, no en la materia en sí.",
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
            "description": "Enumera todos los estándares educativos únicos utilizados en cualquier parte de esta unidad y sus lecciones. NO agregues estándares que no aparezcan en el contenido de la unidad. Cada estándar debe incluir el código del estándar y la descripción, p. ej., 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-Sol-Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'.",
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
        "description": "Lista de contenedores de lecciones para esta unidad (solo esquema). Cada elemento debe ser no superpuesto y estar claramente delimitado para que el contenido de la lección no se repita en las lecciones.",
        "items": {
          "type": "object",
          "properties": {
            "lessonNumber": {
              "type": "integer",
              "description": "Número de orden de una lección. Basado en 1."
            },
            "lessonTitle": {
              "type": "string",
              "description": "Título corto de la lección como texto sin formato."
            },
            "lessonOutline": {
              "type": "string",
              "description": "2 a 4 oraciones que describan el alcance, el enfoque y los límites de la lección para evitar que se superponga con otras lecciones."
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
          "EssentialQuestions": {
            "type": "array",
            "description": "Simplemente pega todas las preguntas esenciales a nivel de unidad en el mismo orden si se proporcionan. Si no se proporcionan, genera exactamente 3 preguntas conceptuales que se centren únicamente en conceptos amplios y universales como el cambio, la evidencia, los patrones, las relaciones, los sistemas o el razonamiento. NO menciones términos, procesos, vocabulario o ejemplos específicos de la materia. Las preguntas deben ser abiertas, transferibles a través de todas las disciplinas e imposibles de responder aprendiendo el contenido de la lección o la unidad. Céntrate solo en las grandes ideas, no en la materia en sí.",
            "items": {
              "type": "string"
            }
          },
          "KeyVocabulary": {
            "type": "array",
            "description": "Sección completa de 'Vocabulario clave' como una lista de cadenas. Cada cadena debe ser un solo término con su definición separada por un guion. Ejemplo: 'Gravedad - La fuerza que atrae los objetos entre sí'. Todas las definiciones deben ser cortas, apropiadas para la edad y estar directamente relacionadas con el contenido de la lección.",
            "items": {
              "type": "string"
            }
          },
          "StudentLearningObjectives": {
            "type": "array",
            "description": "Sección completa de 'Objetivos de aprendizaje del estudiante' como texto sin formato. Cada elemento debe ser un objetivo claro y medible que comience con un verbo medible y termine con una etiqueta DOK entre paréntesis, p. ej., 'Modelar cómo la rotación de la Tierra sobre su eje causa el día y la noche (DOK 2)'.",
            "items": {
              "type": "string"
            }
          },
          "StandardsAligned": {
            "type": "string",
            "description": "Sección completa de 'Estándares alineados' como texto sin formato para esta lección. Cada estándar debe incluir el código del estándar y la descripción, y el código y la descripción deben ser exactamente los mismos que los utilizados en la Unidad. p. ej., 'MS-ESS1-1: Desarrollar y usar un modelo del sistema Tierra-Sol-Luna para describir los patrones cíclicos de las fases lunares, los eclipses y las estaciones'."
          },
          "AssessPriorKnowledge": {
            "type": "string",
            "description": "Sección completa de 'Evaluación de conocimientos previos' como texto sin formato (150-250 palabras en total). SOLO la Lección 1 debe contener un bloque detallado; TODAS LAS DEMÁS LECCIONES DEBEN DEVOLVER UNA CADENA VACÍA para este campo. Para la Lección 1, la estructura debe incluir: 1. Incluye esta sección solo en la primera lección de la unidad, ubicada inmediatamente después de los Objetivos de aprendizaje del estudiante. 2. Asegúrate de usar avisos DOK 1-3. 3. Incluye las habilidades previas necesarias para los objetivos de aprendizaje de los estudiantes. 4. Elige una modalidad de esta lista y desarróllala por completo: cuestionamiento, K-W-L, visuales, mapas conceptuales, escritura reflexiva, guías de anticipación, clasificaciones de vocabulario. 5. Aviso inicial del profesor con una declaración 'Diga:' que introduzca la modalidad elegida y explique cómo los estudiantes sacarán a la luz su comprensión actual. 6. Instrucciones claras y plantilla/estructura para la modalidad elegida. 7. Sección 'Expected Student Responses' que muestre las respuestas anticipadas o las ideas erróneas comunes para la modalidad elegida. 8. Aviso de cierre del profesor 'Diga:' que valide el pensamiento del estudiante y anticipe la investigación de la unidad. 9. Después de desarrollar por completo una modalidad, proporciona 2 opciones alternativas breves que un profesor podría elegir."
          },
          "DirectPresentation": {
            "type": "object",
            "description": "Sección completa de 'Presentación directa' como texto sin formato. Esta es la PRIMERA actividad en clase y no debe durar MÁS DE 10 minutos.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Lista de materiales requeridos (p. ej., ayudas visuales, marcadores, etc.)",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "Instrucciones para el profesor paso a paso siguiendo EXACTAMENTE esta secuencia: (1) HOOK (1-2 min), (2) INTRODUCTION (1-2 min), (3) DIRECT TEACHING (4-5 min) y (4) GUIDED ENGAGEMENT (2-3 min). IMPORTANTE: NO incluyas los encabezados '1. HOOK (1-2 min)', '2. INTRODUCTION (1-2 min)', '3. DIRECT TEACHING (4-5 min)' o '4. GUIDED ENGAGEMENT (2-3 min)' en la cadena final. En su lugar, proporciona el contenido de cada sección directamente comenzando con el primer aviso del profesor (Diga:, Haga:, etc.). Cada componente debe incluir el habla del profesor (Diga:/Pregunte:), las acciones del profesor (Haga:/Escriba:/Dibuje/Muestre:) y las respuestas de los estudiantes (✅ Expected Student Responses: - con viñetas). Todo el contenido debe ser científicamente preciso y apropiado para la edad."
              },
              "AnticipatedMisconceptions": {
                "type": "string",
                "description": "Ideas erróneas comunes y el lenguaje de corrección exacto para abordar cada una"
              },
              "TranscendentThinking": {
                "type": "string",
                "description": "Preguntas de aplicación en el mundo real que conecten el aprendizaje con el propósito/significado/grandes ideas, con respuestas esperadas de los estudiantes que muestren una comprensión más profunda"
              },
              "QuickCheck": {
                "type": "string",
                "description": "Una comprobación final de la comprensión de un objetivo de aprendizaje del estudiante ya declarado en la lección. Esta DEBE ser una tarea individual para que CADA estudiante la complete (no solo una pregunta verbal a la clase), p. ej., 'Tómate 2 minutos para dibujar X en tu cuaderno' o 'En un papel borrador, explica por qué Y...'. Incluye 2-3 respuestas esperadas de los estudiantes específicas."
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
          "GuidedPractice": {
            "type": "object",
            "description": "Sección de Práctica guiada estructurada con campos separados para materiales, instrucciones, diferenciación y adaptaciones opcionales.",
            "properties": {
              "Materials": {
                "type": "array",
                "description": "Artículos físicos requeridos para esta actividad de práctica guiada (p. ej., 'Bolas de poliestireno, cuerda, marcadores') formateados como una lista",
                "items": {
                  "type": "string"
                }
              },
              "InstructionsForTeachers": {
                "type": "string",
                "description": "400–600 palabras. Formato como una lista numerada estricta de acciones del profesor (1, 2, 3...). Cada paso debe combinar acciones del profesor (Muestre:, En la pizarra, escriba:, Demuestre:) y el guion del profesor (Diga:). El Paso 6 DEBE ser 'Mientras los estudiantes trabajan, circule y use estas indicaciones:' seguido de 2-4 avisos de circulación, cada uno con su propia etiqueta 'Expected Student Responses' y ejemplos de respuestas con viñetas. Termina la sección con un encabezado en negrita 'Chequeo rápido', la tarea individual y las respuestas de ejemplo."
              },
              "Differentiation": {
                "type": "string",
                "description": "Estrategias de diferenciación en tres partes que incluyen: (1) Apoyo para estudiantes del idioma (2-3 estrategias), (2) Apoyo de andamiaje adicional (2-3 estrategias), (3) Extensiones para profundizar (1-2 actividades con respuestas esperadas)"
              },
              "AccommodationsAndModifications": {
                "type": "object",
                "description": "Adaptaciones generales para la clase más planes de apoyo individuales para los estudiantes. El modelo DEBE usar ÚNICAMENTE los nombres y planes de los estudiantes proporcionados en el aviso.",
                "properties": {
                  "General": {
                    "type": "string",
                    "description": "Apoyos y modificaciones generales en el aula que se aplican a la mayoría o a todos los estudiantes durante esta actividad."
                  },
                  "IndividualSupport": {
                    "type": "array",
                    "description": "Exactamente los estudiantes proporcionados. PlanProvided debe coincidir exactamente con el del aviso. Agrega una implementación concreta en PlanImplementation.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "StudentName": {
                          "type": "string"
                        },
                        "PlanProvided": {
                          "type": "string",
                          "description": "DEBE coincidir exactamente con el texto del plan del aviso."
                        },
                        "PlanImplementation": {
                          "type": "string",
                          "description": "Herramientas/marcos/visuales/organizadores concretos para esta tarea (p. ej., marcos de oraciones exactos, diseño del organizador, etiquetas)."
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
          "IndependentPractice": {
            "type": "string",
            "description": "Sección completa de 'Práctica independiente' como texto sin formato. La estructura debe seguir este formato: Comienza con el encabezado 'Materiales' y una lista simple de viñetas de los elementos necesarios. Un párrafo de 'Propósito' que explique cómo la práctica fortalece la comprensión y la transferencia. 3 a 4 tareas numeradas secuencialmente etiquetadas como 'Tarea 1 (nivel DOK):', 'Tarea 2 (nivel DOK):', etc. Para cada tarea: - 'Notas del profesor:' breves que expliquen la conexión con la lección/objetivos. - Declaración 'Diga:' requerida con el aviso exacto del profesor. - 'Respuestas esperadas de los estudiantes' con respuestas de ejemplo. - 'Criterios de éxito' que enumeren de 2 a 4 elementos que muestren el dominio. Sección de 'Reflexión' con: - 2 avisos de autorregulación sobre la gestión del aprendizaje. - 2 preguntas trascendentes sobre el impacto/futuro más amplio. Tarea de extensión para los que terminen pronto que: - Use los mismos conceptos básicos a mayor profundidad. - Enumere elementos específicos que los estudiantes deben abordar. - Requiera aplicar principios de contenido precisos. Consulta el ejemplo del sistema solar para ver un modelo de formato detallado."
          },
          "ReviewAndSpacedRetrieval": {
            "type": "string",
            "description": "Sección completa de 'Repaso y recuperación espaciada' como texto sin formato. Esta actividad de 5 minutos debe incluir en este orden EXACTO: 1. Lista de materiales (a menudo no se necesitan) 2. Párrafo de Notas del Profesor que explique: - Cómo esta estrategia de repaso mejora la retención - Conexión con conceptos de aprendizaje previos - Cómo la reflexión trascendente profundiza la comprensión 3. Instrucciones para los profesores que contengan: - Aviso de Recuerdo Activo (Active Recall) usando el intercambio en parejas/grupos - Respuestas esperadas de los estudiantes (2 a 3 ejemplos con viñetas) 4. Bloque de Corregir Ideas Erróneas Comunes con: - Ejemplos de declaraciones de ideas erróneas - Guiones de respuesta del profesor que aborden cada una 5. Conexión con la Pregunta Esencial que incluya: - Aviso del profesor vinculándolo con la pregunta de la unidad - Respuestas esperadas de los estudiantes (2 a 3 ejemplos) 6. Sección de Pensamiento Trascendente con: - Aviso de aplicación en el mundo real - Instrucción de tiempo para pensar - Respuestas esperadas de los estudiantes (2 a 3 ejemplos) 7. Componente de Recuperación Espaciada que contenga: - Referencia clara a una lección previa específica - Pregunta que conecte conceptos pasados + actuales - Criterios de éxito detallados / respuestas esperadas Todas las secciones deben usar declaraciones 'Diga:' para los avisos del profesor y 'Respuestas esperadas de los estudiantes' claramente etiquetadas que muestren 2 a 3 respuestas de ejemplo. Devolver como texto sin formato."
          },
          "FormativeAssessment": {
            "type": "string",
            "description": "Sección completa de 'Evaluación formativa' como texto sin formato. Esta DEBE contener exactamente 4 avisos de preguntas etiquetados como 'Aviso 1 (DOK 1):', 'Aviso 2 (DOK 2):', 'Aviso 3 (DOK 3):' y 'Aviso 4 (DOK 4):'. Para cada aviso: - Pregunta que evalúe la comprensión al nivel DOK establecido - Encabezado '✅ Respuestas esperadas de los estudiantes' - 1 a 2 respuestas de ejemplo que muestren el dominio. NO incluyas una sección de 'Reflexión'. Ejemplo de formato: Aviso 1 (DOK 1): '¿Por qué los planetas permanecen en órbita?' ✅ Respuestas esperadas de los estudiantes - 'La gravedad y el movimiento hacia adelante'. [Continuar para los avisos 2-4]"
          },
          "StudentPractice": {
            "type": "object",
            "additionalProperties": false,
            "required": [
              "StudentPractice_TeacherNotes",
              "StudentPractice_Tasks",
              "StudentPractice_InterleavingIfMath"
            ],
            "properties": {
              "StudentPractice_TeacherNotes": {
                "type": "string",
                "description": "Un párrafo que explique los conocimientos y habilidades practicados en todas las tareas de esta lección. El párrafo DEBE comenzar con 'Estas tareas refuerzan el aprendizaje de hoy sobre ____ mediante ______.', donde los espacios en blanco se completan con el contenido relevante de la lección, seguido de una explicación de cómo estas tareas fortalecen la retención a largo plazo."
              },
              "StudentPractice_Tasks": {
                "type": "array",
                "minItems": 2,
                "maxItems": 3,
                "description": "Las tareas deben alinearse con el enfoque de la lección y la profundidad de conocimiento esperada. Usa solo DOK 2, 3 o 4.",
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
                      "description": "Nivel de profundidad de conocimiento (Depth of Knowledge) para la tarea. DEBE ser UNO DE: 'DOK 2', 'DOK 3' o 'DOK 4'. El DOK 1 está estrictamente prohibido."
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
              "StudentPractice_InterleavingIfMath": {
                "type": "string",
                "description": "Si y SOLO SI la materia es matemáticas: incluye un problema de entrelazado (interleaving) + aviso del profesor + respuestas esperadas + nota del profesor. De lo contrario, cadena vacía."
              }
            }
          }
        },
        "required": [
          "EssentialQuestions",
          "KeyVocabulary",
          "StudentLearningObjectives",
          "StandardsAligned",
          "AssessPriorKnowledge",
          "DirectPresentation",
          "GuidedPractice",
          "IndependentPractice",
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
        "GuidedPractice.AccommodationsAndModifications"
      ]
    }
  }
};
