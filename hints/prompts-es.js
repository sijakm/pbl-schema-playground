const HINTS_PROMPT_ES = `Eres un asistente educativo de IA. Tu tarea es generar exactamente 3 niveles de pistas (Inicial, Seguimiento, Refuerzo) para CADA pregunta proporcionada, que ayuden a un estudiante a resolver la pregunta sin revelar directamente la respuesta.

Las pistas deben seguir una progresión pedagógica desde un concepto amplio hasta una comprensión más profunda de la lógica de la pregunta.

Cumple estrictamente con las instrucciones detalladas y los requisitos de longitud de caracteres definidos en el esquema JSON.

Contexto de la lección: {{$lesson_context}}
Nombre de la lección: {{$lesson_name}}
Descripción de la lección: {{$lesson_description}}
Materia: {{$subject}}
Nivel de grado: {{$grade_level}}
Datos de la pregunta: {{$question_data}}`;
const HINTS_SCHEMA_ES = {
    "title": "HintsResponse",
    "type": "object",
    "properties": {
        "hints": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "initial_hint": {
                        "type": "string",
                        "description": "Pista 1: Concepto amplio (muy general). NO incluyas métodos, objetos o sistemas específicos utilizados en la respuesta. Concéntrate únicamente en el tema científico o histórico de alto nivel."
                    },
                    "follow_up_hint": {
                        "type": "string",
                        "description": "Pista 2: Pista más específica que añade un detalle útil. Reduce las posibilidades, pero aún se aplica a varias respuestas posibles. No lo hagas obvio ni uses partes de la respuesta correcta."
                    },
                    "reteach_hint": {
                        "type": "string",
                        "minLength": 500,
                        "description": "Pista 3: Comprensión guiada y explicación lógica. Esta sección DEBE SER MUY DETALLADA Y COMPLETA (MÍNIMO 500 CARACTERES). Debe explicar el razonamiento central, cómo conectar diferentes piezas de evidencia y los pasos lógicos que el estudiante debe seguir para llegar a la respuesta sin indicarla directamente."
                    }
                },
                "required": [
                    "initial_hint",
                    "follow_up_hint",
                    "reteach_hint"
                ],
                "additionalProperties": false
            }
        }
    },
    "required": [
        "hints"
    ],
    "additionalProperties": false
};
const META_ES = {
    workItemTitle: "Rastros de un gigante: El asteroide que cambió la Tierra",
    subject: "Ciencia / Historia de la Tierra",
    gradeLevel: "Grado 7-8",
    lessonDescription: "Evidencia de impactos de asteroides pasados en la superficie de la Tierra y sus consecuencias globales."
};
const LABELS_ES = {
    correctAnswer: "Respuesta correcta (para validación):"
};
const LESSON_CONTEXT_ES = `Introducción
Imagina que eres un detective, pero en lugar de resolver un crimen, estás resolviendo un misterio que ocurrió hace 66 millones de años. Eso es lo que hacen los científicos cuando estudian las colisiones de asteroides. No pueden presenciarlo, pero pueden buscar pistas dejadas en rocas, fósiles y cráteres para contar la historia de lo que sucedió hace mucho tiempo.

En esta lección, aprenderás cómo los científicos recopilan e interpretan la evidencia de los impactos de asteroides para comprender cómo estas colisiones masivas remodelaron la vida en la Tierra. Estudiarás los signos de destrucción —cráteres, escombros, fósiles— y aprenderás cómo cada uno ayuda a explicar la cadena de eventos que siguieron.
Al final de la lección, pensarás como un geólogo e historiador combinado, conectando hechos del espacio y la historia de la Tierra para comprender uno de los eventos naturales más poderosos jamás registrados. ¿Listo para rastrear la evidencia del asteroide que cambió todo? ¡Empecemos.

Vocabulario clave
Asteroide
Cráter de impacto
Extinción
Registro fósil
Onda de choque
Nube de escombros
Cráter de Chicxulub
Extinción masiva
Cambio climático (post-impacto)
Evidencia

🎯Objetivos de aprendizaje del estudiante
Identificar tipos de evidencia científica que respaldan impactos de asteroides pasados (Nivel de conocimiento de la dimensión de la tarea - DOK 2).
Analizar cómo las capas de fósiles y sedimentos revelan cambios a lo largo del tiempo (DOK 3).
Interpretar datos visuales y textuales para formar explicaciones sobre eventos históricos de asteroides (DOK 3).

📘Conceptos principales
Descubriendo pistas de impacto en la Tierra

Cuando un asteroide golpea la Tierra, no solo deja una marca, cambia todo a su alrededor. La explosión envía ondas de choque a través del suelo, lanza escombros al aire y altera el clima del planeta. Estos efectos dejan evidencia clara que los científicos pueden estudiar millones de años después.
Los principales tipos de evidencia que los científicos buscan son:
Cráteres de impacto – Estas abolladuras masivas marcan dónde golpeó el asteroide. Con el tiempo, algunos se llenan de agua o sedimentos, ocultando su forma de la superficie.
Registros fósiles – Las capas de fósiles muestran desapariciones repentinas de especies, señalando eventos de extinción.
Capas de iridio y nubes de escombros – Después de una colisión, una capa delgada de polvo rica en iridio (un metal común en los asteroides) se deposita en todo el mundo.
Capas de sedimentos – Las capas de roca actúan como una línea de tiempo, ayudando a los científicos a determinar exactamente cuándo ocurrió el impacto.
Conclusiones clave:
Los impactos de asteroides dejan pistas geológicas y biológicas duraderas.
Los fósiles y las capas de roca sirven como la “memoria” de la Tierra de los desastres antiguos.
Los científicos usan estas pistas para reconstruir lo que sucedió hace millones de años.
¿Sabías? La capa de iridio que marca el evento de extinción de los dinosaurios se puede encontrar en rocas de todos los continentes, ¡incluso en la Antártida!
Reflexiona y responde: ¿Qué evidencia —cráter, fósiles o iridio— crees que proporciona la prueba más convincente de una colisión de asteroide pasada? ¿Por qué?

El Cráter de Chicxulub: La huella de un gigante
Uno de los descubrimientos más importantes de la ciencia moderna es el Cráter de Chicxulub en México. Está enterrado profundamente bajo tierra y agua, pero su forma circular y composición coinciden con todo lo que los científicos esperan de un sitio de impacto importante.
Hace unos 66 millones de años, un asteroide masivo —de unos 10 kilómetros de ancho— golpeó la Tierra aquí. La energía que liberó fue más poderosa que miles de millones de bombas atómicas. La colisión lanzó escombros a la atmósfera, provocó terremotos y tsunamis, y causó un invierno global que bloqueó la luz solar durante meses. ¿El resultado? Una extinción masiva que aniquiló al 75% de la vida en la Tierra, incluidos la mayoría de los dinosaurios.
🎥Mira por qué murieron los dinosaurios
Conclusiones clave:
El Cráter de Chicxulub proporciona evidencia sólida del impacto del asteroide que puso fin a la era de los dinosaurios.
El impacto causó ondas de choque, incendios y cambios climáticos a largo plazo.
Los científicos utilizan la forma del cráter, el contenido mineral y la evidencia fósil cercana para confirmar el evento.
¿Sabías? Si el asteroide hubiera aterrizado en un lugar diferente, como en lo profundo del océano, los efectos globales podrían haber sido menos graves.
Reflexiona y responde: ¿Cómo crees que podrían haber cambiado los ecosistemas del planeta si el asteroide de Chicxulub hubiera golpeado una parte diferente del mundo?
 
Lectura del registro fósil
El registro fósil es como una línea de tiempo de la vida en la Tierra. Cuando los científicos comparan fósiles de antes y después del impacto, notan cambios drásticos. En muchas capas, los fósiles de plantas desaparecen repentinamente, lo que demuestra que la luz solar fue bloqueada por la nube de escombros. En las capas oceánicas, los pequeños organismos marinos desaparecen, lo que sugiere que los cambios en la temperatura y la química dificultaron la supervivencia.
 
Al unir esto, los científicos pueden vincular el registro fósil con el impacto del asteroide, mostrando cómo un evento causó cambios duraderos en la vida en la Tierra. Estos hallazgos ayudan a los científicos a comprender no solo qué sucedió con los dinosaurios, sino cómo la vida evoluciona y se adapta después de una catástrofe.
Conclusiones clave:
El registro fósil ayuda a los científicos a comprender cómo los impactos de asteroides cambiaron los ecosistemas.
Las extinciones masivas muestran patrones tanto de destrucción como de recuperación.
El estudio de eventos pasados ayuda a predecir cómo los cambios climáticos actuales podrían afectar la vida hoy.
¿Sabías? Después de que el asteroide aniquiló a los dinosaurios, los mamíferos comenzaron a evolucionar rápidamente, ¡lo que eventualmente llevó a los humanos!
Reflexiona y responde: ¿Por qué crees que la vida en la Tierra pudo recuperarse después de un evento de extinción tan masivo?

🧠 Lo que esto significa
La evidencia de pasadas colisiones de asteroides nos recuerda que la Tierra siempre está cambiando, a veces repentinamente, a veces durante millones de años. Estos desastres naturales han moldeado el clima, los paisajes y los tipos de vida que existen hoy.
Al estudiar los cráteres, los fósiles y los cambios climáticos, los científicos no solo miran hacia atrás, sino que se preparan para el futuro. Comprender estos eventos antiguos ayuda a la humanidad a proteger la Tierra de posibles futuras colisiones y a gestionar mejor los cambios ambientales. Cada capa de roca y cada fósil es una página del libro de historia de la Tierra, esperando a que mentes curiosas la lean.`;
const SAMPLE_QUESTIONS_ES = [
    {
        "question": "¿Qué evidencia directa utilizan los científicos para determinar la línea de tiempo exacta de un impacto de asteroide?",
        "questionType": 1,
        "answers": ["Cráteres de impacto", "Capas de sedimento", "Registros climáticos", "Pinturas rupestres"],
        "correctAnswers": [1],
        "correctAnswerText": "Capas de sedimento"
    },
    {
        "question": "¿Qué pasó con la luz solar después de que el asteroide de Chicxulub golpeara la Tierra?",
        "questionType": 1,
        "answers": ["Se volvió mucho más brillante", "Se mantuvo igual", "Estuvo bloqueada durante meses por una nube de escombros global", "Se puso roja"],
        "correctAnswers": [2],
        "correctAnswerText": "Estuvo bloqueada durante meses por una nube de escombros global"
    },
    {
        "question": "Verdadero o falso: El cráter de Chicxulub se encontró fácilmente en la superficie debido a su forma circular perfecta.",
        "questionType": 4,
        "answers": ["Verdadero", "Falso"],
        "correctAnswers": [1],
        "correctAnswerText": "Falso"
    },
    {
        "question": "Explica por qué los fósiles de plantas a menudo desaparecen repentinamente en las capas de roca correspondientes al período del impacto.",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "La nube de escombros bloqueó la luz solar, impidiendo la fotosíntesis y matando a muchas plantas, lo que se refleja en el registro fósil."
    },
    {
        "question": "¿Cómo benefició indirectamente el impacto del asteroide a la evolución de los mamíferos?",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "Al eliminar a los dinosaurios dominantes, el impacto despejó nichos ecológicos, lo que permitió a los mamíferos evolucionar rápidamente y eventualmente conducir a los humanos."
    }
];
