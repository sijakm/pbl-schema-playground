window.prompts_collaborative_ru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план раздела и структуру уроков, используя информацию ниже. НЕ пишите полные планы уроков.
                    
На основе темы раздела, образовательных стандартов, описания/инструкции к разделу, уровня класса, продолжительности занятия (в минутах) и запрошенного количества уроков сгенерируйте JSON-ответ, который включает целостный UnitDescription и непересекающийся список «контейнеров» уроков.

Тема раздела:
{{$Subject}}

Название раздела:
{{$Name}}

Описание/инструкция к разделу:
{{$UserPrompt}}

Уровень класса:
{{$GradeLevel}}

Продолжительность занятия в минутах:
{{$ClassDuration}}
	
Стандарты для согласования:
{{$Standards}}
    
Учащиеся, которым требуется индивидуализированная поддержка:
{{$LearningPlans}}

Ресурсы/медиа для использования:
{{$MediaContext}}
	
Содержание раздела:
{{$AttachedUnit}}

Требования к ключевым вопросам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением и заканчиваться вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с «Как», либо с «Почему».
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ фокусироваться на широких, универсальных идеях (таких как изменение, доказательства, закономерности, взаимосвязи, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами этого раздела.
- Вопросы ДОЛЖНЫ использоваться дословно в каждом уроке внутри раздела.

Что нужно сгенерировать:
- Вывод ДОЛЖЕН быть валидным JSON, соответствующим схеме.
- ОБЯЗАТЕЛЬНО: Полностью заполните все свойства внутри объекта "UnitDescription":
  - "Description": Напишите абзац из 4–5 предложений, который описывает основную тему раздела и его повествовательную траекторию.
  - "StudentLearningObjectives": Перечислите 3–5 ключевых измеримых целей обучения для раздела.
  - "StandardsAligned": Перечислите все стандарты, которые рассматриваются в течение раздела.
  - "EssentialQuestions": Ровно 3 концептуальных вопроса, соответствующих правилам выше.
- СГЕНЕРИРУЙТЕ список "Lessons", содержащий ровно {{$NumberOfItems}} уроков.
  - Каждый урок должен включать "lessonNumber" (индекс, начиная с 1), "lessonName" и "lessonDescription" (2–4 предложения, описывающие охват урока).

Ограничения:
- Сохраняйте соответствие раздела и каждого урока общей теме раздела.
- Обеспечьте логическую последовательность от базовых идей к более сложному моделированию.
- Точность: весь контент должен быть научно точным и соответствовать возрасту учащихся.

Вывод ДОЛЖЕН быть валидным JSON, соответствующим схеме. Используйте компактное форматирование (без пустых строк).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока в стиле совместного обучения (НЕ план раздела, НЕ несколько уроков), используя информацию ниже.

Вы ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме (LessonPlanResponse с единственным объектом "LessonPlan"). Не включайте никаких лишних ключей. Используйте компактное форматирование JSON (без лишних пустых строк).

КОНТЕКСТ РАЗДЕЛА (контекст только для чтения, для согласованности):
Предмет раздела:
{{$Subject}}

Содержание раздела: 
{{$ParentUnitData}}

Описание/инструкция к разделу: Создайте раздел, используя следующие стандарты:
{{$Standards}}

Класс/уровень:
{{$GradeLevel}}

Ресурсы/медиа для использования: 
{{$MediaContext}}

Продолжительность урока в минутах:
{{$ClassDuration}}

Название урока:
{{$Name}}

Описание/инструкция к разделу: 
{{$UserPrompt}}

Основные вопросы раздела (ИСПОЛЬЗУЙТЕ ИХ БУКВАЛЬНО):
{{$UnitEssentialQuestions}}

Если основные вопросы раздела выше пусты, сгенерируйте ровно 3 концептуальных вопроса, следуя этим правилам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, которое заканчивается вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться с «Как» или «Почему».

- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ фокусироваться на широких, универсальных идеях (таких как изменения, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами этого раздела.

УЧАЩИЕСЯ С ИНДИВИДУАЛИЗИРОВАННОЙ ПОДДЕРЖКОЙ (ДОЛЖНЫ использоваться ТОЛЬКО внутри CollaborativeActivities.AccommodationsAndModifications; используйте имена/планы учащихся точно в том виде, в каком они написаны):
{{$LearningPlans}}

ВАЖНЫЕ ПРАВИЛА ПО СОДЕРЖАНИЮ (стиль совместного обучения):
- Сохраняйте соответствие урока фокусу раздела и указанным выше границам Scope/Boundaries урока; избегайте введения новых крупных понятий, относящихся к другим урокам.
- Культурная релевантность и инклюзия: включайте несколько точек зрения; связывайте с разными сообществами; избегайте стереотипов; показывайте влияние на всех вовлечённых.
- Перенос: встраивайте реальное применение и рассуждение на протяжении всего урока.
- Интерливинг: когда учащиеся практикуются/применяют знания, смешивайте стратегии или понятия (не блокированная практика). Если урок включает какое-либо математическое рассуждение, включите как минимум один интерливинговый пункт уровня DOK 3–4, который сочетает текущий материал с концептом из более раннего урока и требует от учащихся обосновать выбор стратегии.

ПРАВИЛА ДЛЯ ОТДЕЛЬНЫХ ПОЛЕЙ:
- EssentialQuestions: ДОЛЖНЫ в точности совпадать с вопросами на уровне раздела (тот же текст, тот же порядок).
- AssessPriorKnowledge: Если этот раздел требуется (например, для первого урока или при введении новых крупных понятий), напишите 150–250 слов, следуя требуемой структуре в описании схемы. Иначе верните "" (пустую строку).
- Instruction:
  - InstructionsForTeachers: Эти шаги должны быть подробными и включать всё новое обучение для урока с объяснениями того, как это преподавать. Будьте точны.
  - Они должны включать, как представить новый предметный материал (зацепки, направляющие вопросы, переходы).
  - Они должны включать содержание и сценарий для того, чтобы учитель напрямую преподавал материал (определения, примеры, ключевые моменты, объяснения).
  - Структура должна естественно перетекать с подсказками Скажите/Сделайте/Спросите/Послушайте/Напишите.
  - ВАЖНО: Не включайте заголовки В ВЕРХНЕМ РЕГИСТРЕ (например, ВВЕДЕНИЕ, ПРЕДСТАВЛЕНИЕ и т. п.) для разделов.
  - ВАЖНО: Не включайте временные длительности для отдельных инструкций или шагов.
  - TranscendentThinking: Дайте один вопрос о реальном применении, связывающий обучение с целью/смыслом, затем добавьте метку 'Ожидаемые ответы учащихся:' и 2–3 примера.
- GroupStructureAndRoles:
  - Вывод ДОЛЖЕН быть ориентирован на учителя.
  - GroupSize: укажите 'пары', 'тройки' или '4-5 учащихся'.
  - TeacherSay: 1–2 предложения, объясняющие, что роли важны, и что вы покажете, как выглядит каждая роль.
  - Roles: Должны быть определены ровно эти пять ролей (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) с конкретными обязанностями, связанными с CollaborativeActivities этого урока.
  - Rotation: Одно предложение, указывающее, когда роли меняются в ЭТОМ уроке (например, "Меняйте роли после Фазы А и снова перед галерейной прогулкой.").

CollaborativeActivities:
- Создайте взаимозависимую совместную деятельность (совместная замена Управляемую практику), соответствующую объёму этого урока.
- Каждый учащийся должен внести вклад, и группы должны создать общий продукт или принять общее решение.
- Включите временные ориентиры, сценарий сценарий Скажите:, подсказки для обхода групп + ожидаемые ответы, а также быструю проверку, где ОТВЕЧАЮТ ВСЕ учащиеся + ожидаемые ответы.
- Включите Differentiation (3 уровня) и AccommodationsAndModifications (General + IndividualSupport exactly as provided).
- Если это урок по математике, включите одну задачу уровня DOK 3–4 с интерливингом, смешивающую текущий материал с предыдущим уроком/разделом, и объясните, почему она включена; в противном случае не включайте интерливинг.
- ReflectionOnGroupDynamics:
  - Должен занимать примерно 5 минут.
  - Включите 2–4 вопроса для обсуждения учащимися (например, что прошло хорошо, в чём была трудность, был ли услышан голос).
  - Предоставьте действия учителя по фасилитации (быстрый письменный exit slip, самооценка группы по шкале 1–5 или двухминутное обсуждение), с подсказками учителя и ожидаемыми ответами учащихся.
  - Явно свяжите рефлексию с CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Та же структура и те же требования, что и у версии Direct Instruction (см. описание схемы).
  - Должна включать проверку на извлечение, которая связывает материал с ОДНИМ предыдущим уроком (назовите номер предыдущего урока).
- StudentPractice:
  - Домашняя/внеурочная практика.
  - Должна следовать точному требуемому формату из описания схемы (включая маркеры ✅Expected Student Responses).

ТРЕБОВАНИЯ К ВЫВОДУ:
- Вывод ДОЛЖЕН быть корректным JSON, точно соответствующим предоставленной схеме.
- Вывод ДОЛЖЕН содержать ТОЛЬКО один план урока.
- Без HTML. Без эмодзи. Без markdown. Только обычный текст внутри строковых полей.

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
          "description": "Описание юнита как единый связный абзац обычного текста из 4–5 полных предложений, написанный естественным тоном учителя, который можно напрямую сказать ученикам. Без HTML, без эмодзи, без маркированных списков. Текст должен звучать разговорно, но следовать этой структуре (без заголовков): (1) вводное предложение, которое вызывает любопытство или создает неожиданный контраст, (2) предложение «В этом юните вы будете...» о результатах освоения, (3) предложение «Вы укрепите свои навыки в...» о навыках мышления/анализа, (4) предложение «Это связано с...» о связи с реальной жизнью, (5) предложение «Понимание этого важно, потому что...» о более широком значении или долгосрочном влиянии."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Создайте ключевые вопросы, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. Не упоминайте никакие предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми во все дисциплины и невозможными для ответа только после изучения содержания урока или юнита. Сосредоточьтесь только на больших идеях, а не на предметном материале.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Student Learning Objectives» для всего этого юнита. Каждый пункт списка должен быть четкой, измеримой целью, которая начинается с измеримого глагола и заканчивается меткой DOK в скобках",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Перечислите все уникальные образовательные стандарты, использованные где-либо в этом юните и его уроках. Не добавляйте стандарты, которые не появляются в содержании юнита. Каждый стандарт должен включать код стандарта и описание, например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна, чтобы описать циклические закономерности фаз Луны, затмений и времен года.'",
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
        "StandardsAligned"
      ],
      "additionalProperties": false
    },
    "Lessons": {
      "x-format": false,
      "type": "array",
      "description": "Список контейнеров уроков для этого юнита (только структура). Каждый пункт должен быть непересекающимся и четко ограниченным, чтобы содержание уроков не повторялось между уроками.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Порядковый номер урока. Основано на 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Краткое название урока в виде обычного текста."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 предложения, описывающие охват, фокус и границы урока, чтобы избежать пересечения с другими уроками."
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
        "LessonTitle": {
          "x-format": "# {value}",
          "type": "string",
          "description": "Короткое описательное название для урока. Не включайте сюда эмодзи."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Просто вставьте все ключевые вопросы на уровне юнита в том же порядке, если они предоставлены. Если нет, сгенерируйте ровно 3 концептуальных вопроса, которые фокусируются только на широких, универсальных понятиях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. Не упоминайте никакие предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми во все дисциплины и невозможными для ответа только после изучения содержания урока или юнита. Сосредоточьтесь только на больших идеях, а не на предмете.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Список строк вида «Термин - Определение». Определения должны быть короткими, соответствующими возрасту и связанными с этим уроком.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 измеримые цели, каждая из которых заканчивается меткой DOK в скобках.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Согласованные образовательные стандарты для этого урока. Должны точно совпадать с юнит-стандартами по коду и описанию.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Раздел «Assess Prior Knowledge». ТОЛЬКО УРОК 1 должен содержать подробный блок; ВСЕ ДРУГИЕ УРОКИ ДОЛЖНЫ ВЕРНУТЬ NULL или ОПУСТИТЬ это поле. Для Урока 1 структура должна включать ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt и AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Четкие инструкции и шаблон/структура для выбранной модальности. Например: «Скажите: \"Before we build...\"»"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Ожидаемые ответы или распространенные заблуждения для выбранной модальности.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Заключительный запрос учителя в формате «Скажите:», который подтверждает мышление учеников и предваряет исследование юнита."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 коротких альтернативных варианта, которые учитель может выбрать.",
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
        "Instruction": {
          "x-format": "### {green}({loc.Instruction})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}",
          "type": "object",
          "description": "Раздел «Instruction» для совместного урока (эквивалент Direct Presentation).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Список материалов.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Сценарий учителя, организованный в последовательные шаги. Эти шаги должны в совокупности служить подробным руководством, помогающим учителю преподнести новый материал. Он должен включать, как вводить новое содержание темы (зацепки, направляющие вопросы, переходы), а также содержание/сценарий, по которому учитель будет вести прямое обучение (определения, примеры, ключевые моменты, объяснения). Инструкции должны быть подробными и включать все новое изучение для урока с объяснениями того, как это преподавать. Будьте точны. Не используйте ЗАГЛАВНЫЕ ЗАГОЛОВКИ для разделов и не включайте отметки времени.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Действие учителя, например: Скажите: '...', Do: '...', Спросите: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Ожидаемые ответы, если инструкция была вопросом. Верните пустой массив, если это неприменимо.",
                    "items": {
                      "x-format": "  - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "description": "Список распространённых заблуждений и точный язык корректировки для каждого из них.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Описание заблуждения."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Язык корректировки, начинающийся с 'Скажите: '."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false
              }
            },
            "TranscendentThinking": {
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Вопрос о применении в реальной жизни, связывающий обучение с целью/смыслом.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 ожидаемых ответа учащихся, показывающих более глубокое понимание.",
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
            "QuickCheck": {
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Итоговый вопрос для проверки понимания.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 ожидаемых ответа учащихся.",
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
          "x-format": "### {green}({loc.GroupStructureAndRoles})\n\n{loc.DetermineThePurpose}\n\n{value.GroupSize}\n\n**📋 {loc.InstructionsForTeachers}**\n{value.TeacherSay}\n\n{value.Roles}\n\n{value.Rotation}",
          "type": "object",
          "description": "Размер группы, сценарий учителя, определённые роли и ротация.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "например, 'пары', 'триады' или '4-5 учащихся'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Сценарий учителя, объясняющий роли."
            },
            "Roles": {
              "x-format": "{value.Facilitator}\n{value.Recorder}\n{value.MaterialsManager}\n{value.Timekeeper}\n{value.Presenter}",
              "type": "object",
              "properties": {
                "Facilitator": {
                  "x-format": "- **{loc.Facilitator}:** {value}",
                  "type": "string"
                },
                "Recorder": {
                  "x-format": "- **{loc.Recorder}:** {value}",
                  "type": "string"
                },
                "MaterialsManager": {
                  "x-format": "- **{loc.MaterialsManager}:** {value}",
                  "type": "string"
                },
                "Timekeeper": {
                  "x-format": "- **{loc.Timekeeper}:** {value}",
                  "type": "string"
                },
                "Presenter": {
                  "x-format": "- **{loc.Presenter}:** {value}",
                  "type": "string"
                }
              },
              "required": [
                "Facilitator",
                "Recorder",
                "MaterialsManager",
                "Timekeeper",
                "Presenter"
              ],
              "additionalProperties": false
            },
            "Rotation": {
              "x-format": "{loc.Rotation}:\n- {value}",
              "type": "string",
              "description": "Предложение, указывающее, когда роли меняются."
            }
          },
          "required": [
            "GroupSize",
            "TeacherSay",
            "Roles",
            "Rotation"
          ],
          "additionalProperties": false
        },
        "CollaborationGuidelines": {
          "x-format": "### {green}({loc.CollaborationGuidelines})\n\n{loc.CollaborationGuidelinesIntro}\n\n{items}",
          "type": "array",
          "description": "Подсказки, помогающие группам создать собственные нормы сотрудничества.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Взаимозависимая групповая работа (совместная замена для Управляемую практику). Ориентировано на учителя, строго структурировано и разработано так, чтобы учащиеся не могли выполнить задание в одиночку. Должно включать: (a) явную взаимозависимость (jigsaw, выработка консенсуса, gallery walk, структурированный проблемно-решающий вызов или аналогичное), (b) явное время для каждой фазы (например, '8 минут обсуждение, 2 минуты подготовка ответа'), (c) сценарий фасилитации учителя с использованием высказываний 'Скажите:' на протяжении всего задания, (d) общий групповой продукт (утверждение, модель, схема, набор решений, артефакт gallery walk и т. д.), (e) подсказки для обхода групп с ожидаемыми ответами учащихся, (f) как минимум один контроль ответа ВСЕХ учащихся (мини-доски, быстрый письменный ответ, голосование, поднятые пальцы и т. п.) с ожидаемыми ответами, (g) вопрос для быстрого контроля + ожидаемые ответы, (h) дифференциацию в трёх уровнях, ориентированную на обучение (а не на accommodations), и (i) AccommodationsAndModifications, разделённые на General supports и IndividualSupport, точно соответствующие предоставленным учащимся/планам. Обеспечьте культурную релевантность и инклюзивность, приглашая разные точки зрения и обеспечивая равноправное участие.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Полный список материалов для учителя и учащихся, используемых в этой совместной деятельности. Включите любые подготовленные материалы (карточки с заданиями, речевые шаблоны, карточки ролей, чек-листы, рубрики, листы для gallery walk, мини-доски, таймеры, визуальные материалы, банк слов и т. п.). По одному предмету на элемент массива; без заполнителей.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Сценарий учителя для совместной деятельности (приблизительно 6-8 пронумерованных шагов). Убедитесь, что один шаг явно называется 'Подсказки для обхода:' и включает конкретные вопросы, которые следует задавать группам.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Конкретное действие учителя, начинающееся с 'Скажите: ', 'Do: ' или ровно 'Подсказки для обхода:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "ЗАПОЛНЯЙТЕ ЭТО ТОЛЬКО ЕСЛИ Instruction — это 'Подсказки для обхода:'. Перечислите конкретные вопросы, которые следует задавать группам во время обхода. НЕ ВКЛЮЧАЙТЕ это свойство, если оно неприменимо.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "Вопрос, который нужно задать группе."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Ожидаемые ответы на этот конкретный циркуляционный вопрос. НЕ включайте это свойство, если оно отсутствует.",
                          "items": {
                            "x-format": "       - {value}",
                            "type": "string"
                          }
                        }
                      },
                      "required": [
                        "Prompt",
                        "ExpectedStudentResponses"
                      ],
                      "additionalProperties": false
                    }
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "\n   ✅ {loc.ExpectedStudentResponses}\n{items}",
                    "type": "array",
                    "description": "Ожидаемые ответы, если Instruction был прямым вопросом классу. НЕ включайте это свойство, если это неприменимо.",
                    "items": {
                      "x-format": "     - {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "Instruction",
                  "CirculationPrompts",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              }
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
              "description": "Помечено тремя чётко обозначенными уровнями: Language Learners, Students in Need of Additional Scaffolding, Go Deeper. Требования: содержание должно дифференцировать обучение, а не предоставлять accommodations или modifications (они рассматриваются в другом разделе). Стратегии должны быть сосредоточены на том, как преподавать, а не на том, как упрощать материалы. Деятельность должна различаться по сложности и глубине и быть согласована с теми же целями обучения. Каждый уровень должен поощрять активное участие, развитие языка и концептуальное понимание. Используйте ясный, ориентированный на учителя язык и обеспечьте реалистичность поддержек для использования в классе.",
              "properties": {
                "LanguageLearners": {
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Предоставьте 2-3 конкретные педагогические стратегии для изучающих язык. Примеры: использование конкретных визуальных материалов (например, 'Planet Fact Sheet'), использование речевых шаблонов (например, 'Это помещено здесь, потому что...'), или просьба к учащимся сначала показать жестом/указать, а затем объяснить устно. Сосредоточьтесь на активном участии и развитии языка."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "AdditionalScaffolding": {
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Предоставьте 2-3 конкретные педагогические стратегии для scaffolding. Примеры: предоставление заранее нарисованных органайзеров/шаблонов, использование упрощённого чек-листа с конкретными наводящими вопросами или моделирование процесса think-aloud (например, 'Смотрите, как я сопоставляю...'). Сосредоточьтесь на том, как преподавать, и варьируйте сложность без упрощения материалов."
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false
                },
                "GoDeeper": {
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}",
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Предоставьте 1-2 задания на расширение, которые углубляют концептуальное понимание. Включите конкретные вызовы (например, 'Отрегулируйте интервалы, чтобы показать...') или вопросы более высокого порядка (например, 'Как бы вы смоделировали... точно?'). Они должны соответствовать тем же целям обучения."
                    }
                  },
                  "required": [
                    "Strategies"
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
              "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Этот раздел должен включать два типа поддержек: General Supports и Individualized Supports. Сосредоточьтесь на доступе, а не на снижении требований.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Неспецифичные для отдельных учащихся стратегии, которые улучшают доступ для всех обучающихся (например, визуальные материалы, заранее заполненные заметки, цифровой глоссарий, инструкции, разбитые на части). Предоставьте 2-4 пункта в виде маркированного списка."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Конкретные accommodations и modifications для названных учащихся с официальными планами. Укажите КАЖДОГО учащегося отдельно; НЕ объединяйте учащихся вместе. Поддержки для каждого учащегося должны быть легко просматриваемым списком.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Имя и фамилия отдельного учащегося, получающего эти поддержки."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Официальный план, предоставленный для этого учащегося в prompt. Преобразуйте план в понятный список. Вы можете перефразировать его для улучшения форматирования, но НЕ опускайте и не добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретные инструменты/речевые шаблоны/визуальные материалы/органайзеры для этого задания."
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
          "x-format": "### {green}({loc.ReflectionOnGroupDynamics})\n\n{value.DebriefPrompt}\n\n{value.TeacherFacilitationOptions}\n\n{value.ClosingPrompt}",
          "type": "object",
          "description": "Учащиеся оценивают, насколько хорошо группа работала вместе. ДОЛЖНО содержать ровно 3 сегмента в следующем порядке: вопрос для обсуждения, варианты организации обсуждения и завершающий вопрос, связывающий с нормами.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Краткий вопрос для обсуждения для учащихся после совместной работы.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Точная формулировка, которую произносит учитель, например: 'Скажите: \"Take two minutes to reflect: What did our group do well today?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Ожидаемые ответы учащихся (2-3 примера)."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "TeacherFacilitationOptions": {
              "x-format": "**2.** {loc.TeacherFacilitationOptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Ровно 3 приёма организации обсуждения на выбор учителя (например, Quick-write exit slip, 1-5 group collaboration rating, 2-minute whole-group share). Только варианты, без ожидаемых ответов."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "Завершающий вопрос учителя, связывающий рефлексию с рекомендациями по совместной работе. например: 'Скажите: \"Which of your norms helped the most today?\"'"
            }
          },
          "required": [
            "DebriefPrompt",
            "TeacherFacilitationOptions",
            "ClosingPrompt"
          ],
          "additionalProperties": false
        },
        "ReviewAndSpacedRetrieval": {
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
          "type": "object",
          "description": "Полный раздел 'Review & Spaced Retrieval'.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Список материалов (например, ['None'] или ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Краткая заметка, объясняющая, как практика извлечения из памяти поддерживает запоминание."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Просьба к учащимся вспомнить НОВОЕ, изученное на СЕГОДНЯШНЕМ уроке.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Подсказка для учителя."
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "CorrectCommonMisconceptions": {
                  "x-format": "⚠️ {loc.CorrectCommonMisconceptions}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "1-2 заблуждения и как их исправить."
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false
            },
            "EssentialQuestionConnection": {
              "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Подсказка для учителя, связывающая с вопросом раздела.",
              "properties": {
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "TranscendentThinking": {
              "x-format": "🌍 **{loc.TranscendentThinking}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Подсказка для применения в реальной жизни.",
              "properties": {
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "SpacedRetrieval": {
              "x-format": "⏳ **{loc.SpacedRetrieval} ({value.DrawsFrom})**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Воспроизведение из конкретного предыдущего урока/раздела.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "Предыдущий урок, на который есть ссылка, например, 'Draws from Unit 2, Lesson 3'"
                },
                "Say": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "DrawsFrom",
                "Say",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Materials",
            "TeacherNotes",
            "ActiveRecall",
            "EssentialQuestionConnection",
            "TranscendentThinking",
            "SpacedRetrieval"
          ],
          "additionalProperties": false
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Ровно 4 подсказки для формативного оценивания, по одной для каждого уровня DOK.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "например, 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "Точный текст вопроса, например, 'Why do planets stay in orbit instead of flying off into space?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 примера ответов, демонстрирующих освоение материала (взятые в кавычки)."
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
          "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n{value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
          "type": "object",
          "description": "Домашняя/внеурочная практика.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Краткое объяснение целей практики, например, 'These tasks reinforce today's learning about [topic] by asking students to observe real-world patterns and explain them using the concepts introduced in class...'"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Ровно 3 практических задания (DOK 2 или DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "например, '(DOK 2) Tonight, go outside and write 3-4 sentences...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "TaskDescription",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false
              },
              "minItems": 3,
              "maxItems": 3
            },
            "Reflection": {
              "x-format": "{value.Prompt}\n\n{value.ReflectionOptions}",
              "type": "object",
              "description": "Задание на рефлексию для учащихся.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "например, 'Reflection: Write 2-3 sentences responding to one prompt:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Ровно 4 варианта вопросов для рефлексии в кавычках."
                }
              },
              "required": [
                "Prompt",
                "ReflectionOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "TeacherNotes",
            "PracticeTasks",
            "Reflection"
          ],
          "additionalProperties": false
        }
      },
      "required": [
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
      "LessonDescription.CollaborativeActivities.AccommodationsAndModifications"
    ]
  }
},
};
