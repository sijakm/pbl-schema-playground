window.prompts_lab_ru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план модуля и структуру уроков, используя информацию ниже. НЕ пишите полные планы уроков.
                    
На основе учебного предмета модуля, образовательных стандартов, описания/инструкции по модулю, уровня класса, продолжительности занятия (в минутах) и запрошенного количества уроков сгенерируйте JSON-ответ, который включает связное UnitDescription и непересекающийся список «контейнеров» уроков.

Учебный предмет модуля:
{{$Subject}}

Название модуля:
{{$Name}}

Описание/инструкция по модулю:
{{$UserPrompt}}

Уровень класса:
{{$GradeLevel}}

Продолжительность занятия в минутах:
{{$ClassDuration}}
	
Стандарты для соотнесения:
{{$Standards}}
    
Ученики с индивидуализированной поддержкой:
{{$LearningPlans}}

Ресурсы/медиа для использования:
{{$MediaContext}}
	
Содержание модуля:
{{$AttachedUnit}}

Требования к ключевым вопросам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, оканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с «How», либо с «Why».
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактологическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменение, доказательства, закономерности, взаимосвязи, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами этого модуля.
- Вопросы ДОЛЖНЫ использоваться дословно в каждом уроке внутри модуля.

Что нужно сгенерировать:
- Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме.
- ОБЯЗАТЕЛЬНО: Полностью заполните все свойства внутри объекта "UnitDescription":
  - "Description": Напишите абзац из 4–5 предложений, который описывает основной фокус модуля и его повествовательную траекторию.
  - "StudentLearningObjectives": Перечислите 3–5 ключевых измеримых целей обучения для модуля.
  - "StandardsAligned": Перечислите все стандарты, которые охватываются в ходе модуля.
  - "EssentialQuestions": Ровно 3 концептуальных вопроса, соответствующих правилам выше.
- СГЕНЕРИРУЙТЕ список "Lessons", содержащий ровно {{$NumberOfItems}} уроков.
  - Каждый урок должен включать "lessonNumber" (индекс, начиная с 1), "lessonName" и "lessonDescription" (2–4 предложения, описывающих содержание урока).

Ограничения:
- Сохраняйте соответствие между модулем и каждым уроком общему фокусу модуля.
- Обеспечьте логическую последовательность от базовых идей к более сложному моделированию.
- Точность: весь контент должен быть научно корректным и соответствующим возрасту.

Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме. Используйте компактное форматирование (без лишних пустых строк).`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока ЛАБОРАТОРНОЙ работы (НЕ план модуля, НЕ несколько уроков), используя информацию ниже.
ВЫ ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме. Не включайте никаких дополнительных ключей. Используйте компактное форматирование JSON (без лишних пустых строк).
Предмет модуля:
{{$Subject}}
Название модуля:
{{$Name}}
Описание/инструкция модуля:
{{$UserPrompt}}
Класс:
{{$GradeLevel}}
Продолжительность урока в минутах
{{$ClassDuration}}
Ресурсы/медиа для использования:
{{$MediaContext}}
Содержание модуля:
{{$ParentUnitData}}
Стандарты, с которыми нужно согласовать:
{{$Standards}}
Прикрепленное содержание урока:
{{$AttachedLesson}}

Ключевые вопросы модуля (ИСПОЛЬЗУЙТЕ ИХ ДОСЛОВНО):
{{$UnitEssentialQuestions}}

Если приведенные выше Ключевые вопросы модуля пусты, сгенерируйте ровно 3 концептуальных вопроса, соблюдая следующие правила:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, оканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с "How", либо с "Why".
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактологическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменение, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми вне данного модуля.


УЧАЩИЕСЯ С ИНДИВИДУАЛИЗИРОВАННОЙ ПОДДЕРЖКОЙ (ДОЛЖНЫ использоваться ТОЛЬКО внутри Experiment.AccommodationsAndModifications; используйте имена учащихся/планы в точности так, как они написаны):
{{$LearningPlans}}

ВАЖНЫЕ ПРАВИЛА СОДЕРЖАНИЯ:
- Сохраняйте урок в рамках темы модуля: развитие и использование моделей для описания атомного состава простых молекул и/или сложных структур.
- При необходимости включайте краткие, общие связи с другими соответствующими DCI, но держите урок сосредоточенным на моделировании и рассуждении о связи «структура–свойство» (без глубокой математики, без уравнивания балансов, если это прямо не требуется стандартами).
- Убедитесь, что все части урока отражают Scope/Boundaries урока, указанные в контексте модуля; не вводите новые крупные понятия, относящиеся к другим урокам.
- EssentialQuestions: ДОЛЖНЫ в точности равняться ключевым вопросам на уровне модуля (тот же текст, тот же порядок).
- AssessPriorKnowledge: ТОЛЬКО если LessonNumber == 1, напишите 150–250 слов и следуйте требуемой структуре, описанной в схеме. Если LessonNumber != 1, верните "" (пустую строку).
- Фазы Lab (Question, Research, Hypothesize, Experiment, Analyze, Share): следуйте конкретным инструктивным требованиям и строкам "Purpose:" для каждой фазы, как они определены в JSON-схеме.
- Experiment.AccommodationsAndModifications должен включать общую поддержку, а затем индивидуальную поддержку для каждого учащегося, указанного в {{$LearningPlans}}.
- StudentPractice ДОЛЖЕН включать абзац TeacherNotes, начинающийся с 'These tasks reinforce today's learning about ____ by ______.', список из 2–3 заданий с DOK 2–4 и критериями успеха, а также интерливинг, если предмет — математика.

ТРЕБОВАНИЯ К ВЫВОДУ:
- Вывод ДОЛЖЕН быть корректным JSON, точно соответствующим предоставленной схеме.
- Вывод ДОЛЖЕН представлять ТОЛЬКО ОДИН план урока.
- Никакого HTML. Никаких эмодзи. Никакой разметки markdown. Обычный текст внутри строковых полей.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "x-format": false,
          "type": "string",
          "description": "Описание модуля как единый связный абзац обычного текста (4–5 полных предложений), написанный естественным тоном учителя, который можно сказать ученикам напрямую. Без HTML, без эмодзи, без маркированных списков. Текст должен звучать разговорно, но следовать этой структуре (без заголовков): (1) вводное предложение, которое вызывает любопытство или создает неожиданный контраст, (2) предложение с фразой «В этом модуле вы...» о результатах освоения, (3) предложение с фразой «Вы укрепите свои навыки в...» о навыках мышления/анализа, (4) предложение с фразой «Это связано с...» о практической значимости, (5) предложение с фразой «Понимание этого важно, потому что...» о более широком значении или долгосрочном влиянии."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Создайте ключевые вопросы, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. НЕ упоминайте какие-либо предметные термины, процессы, словарный запас или примеры. Вопросы должны быть открытыми, применимыми ко всем дисциплинам и невозможными для ответа путем изучения содержания урока или модуля. Сосредоточьтесь только на больших идеях, а не на содержании предмета.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Учебные цели учащегося» для всего этого модуля. Каждый пункт списка должен быть четкой, измеримой целью, начинающейся с измеримого глагола и заканчивающейся меткой DOK в скобках",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Перечислите все уникальные образовательные стандарты, использованные где-либо в этом модуле и его уроках. НЕ добавляйте стандарты, которые не встречаются в содержании модуля. Каждый стандарт должен включать код стандарта и описание, например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна для описания циклических закономерностей фаз Луны, затмений и времен года.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Ключевая лексика» в виде списка строк. Каждая строка должна представлять собой один термин с определением, разделенным тире/дефисом. Пример: 'Гравитация - Сила, которая притягивает объекты друг к другу'. Все определения должны быть краткими, соответствующими возрасту и напрямую связанными с содержанием урока.",
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
      "description": "Список контейнеров уроков для этого модуля (только структура). Каждый пункт должен быть непересекающимся и четко определенным, чтобы содержание уроков не повторялось между уроками.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Порядковый номер урока. Основанный на 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Краткое название урока как обычный текст."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 предложения, описывающие объем, фокус и границы урока, чтобы предотвратить пересечение с другими уроками."
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
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Просто вставьте все ключевые вопросы, которые были созданы на уровне модуля, в том же порядке.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Полный раздел «Учебные цели учащегося» в виде обычного текста. Каждый пункт должен быть четкой, измеримой целью, начинающейся с измеримого глагола и заканчивающейся меткой DOK в скобках, например: «Смоделируйте, как вращение Земли вокруг своей оси вызывает день и ночь (DOK 2).»",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "x-format": "- {value}\n",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Полный раздел «Соответствие стандартам» в виде обычного текста для этого урока. Каждый стандарт должен включать код стандарта и описание, а код и описание должны быть в точности такими же, как использованные в модуле. Например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна для описания циклических закономерностей фаз Луны, затмений и времен года.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Выберите дословно ключевую лексику для этого урока из лексики уровня модуля, указанной в подсказке. НЕ придумывайте новые слова. Вы должны использовать точную формулировку из Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Раздел «Оценка предварительных знаний». ТОЛЬКО урок 1 должен содержать подробный блок; ВСЕ ОСТАЛЬНЫЕ УРОКИ ДОЛЖНЫ ВЕРНУТЬ NULL или НЕ ВКЛЮЧАТЬ ЭТОТ ПОЛЕ. Для урока 1 структура должна включать: 1. Включайте этот раздел только в первый урок модуля. 2. Убедитесь, что используются подсказки DOK 1–3. 3. Включите навыки, необходимые учащимся для достижения учебных целей. 4. Выберите один модальность из этого списка и полностью его разработайте: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Начальная реплика учителя с «Say:». 6. Четкие инструкции и шаблон/структура для выбранной модальности. 7. Раздел «Expected Student Responses». 8. Закрывающая реплика учителя «Say:». 9. После полного разработки одной модальности, предложите 2 кратких альтернативных варианта.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Четкие инструкции и шаблон/структура для выбранной модальности. Например: 'Say: \"Прежде чем мы начнем...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Предполагаемые ответы или распространенные заблуждения для выбранной модальности.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Закрывающая реплика учителя «Say:», которая подтверждает мышление учащихся и предваряет исследование модуля."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 кратких альтернативных варианта, которые мог бы выбрать учитель.",
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
    "Question": {
      "x-format": "### {green}(Question (5 min))\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Направьте учителя так, чтобы учащиеся наблюдали феномен, определяли то, что вызывает недоумение, и формулировали значимый вопрос, который будет направлять исследование.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Слово в слово - Цель: Наблюдать феномен, определить то, что вызывает недоумение, и сформулировать значимый вопрос, который будет направлять исследование."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}\n\n{value.FinalInvestigationQuestion}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Пошаговые инструкции для учителя, действия и подсказки «Скажите:», чтобы представить явление и пригласить к вопросам."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 ожидаемых вопроса или идеи учащихся о явлении."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "Заключительный шаг в инструкциях для учителя. Начните эту строку со следующего последовательного номера после предыдущих инструкций (например, «8. Заключительный шаг: Скажите: ...») и сформулируйте главный вопрос, который мы будем исследовать сегодня."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses",
            "FinalInvestigationQuestion"
          ],
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
    "Research": {
      "x-format": "### {green}(Research (5 min))\n\n**{loc.Purpose}:** Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Подскажите учителю, чтобы учащиеся узнали справочную информацию, лексику и имеющиеся знания, необходимые для понимания темы.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Слово в слово: Цель: Собрать справочную информацию, лексику и имеющиеся знания, необходимые для понимания темы и подготовки к осмысленному исследованию."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.AnticipatedMisconceptions}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Пошаговые инструкции для учителя, действия и подсказки «Скажите:», чтобы объяснить справочные знания, лексику и смоделировать явление."
            },
            "AnticipatedMisconceptions": {
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Заблуждение учащихся"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Что учитель должен сказать, чтобы это исправить"
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            }
          },
          "required": [
            "Instructions",
            "AnticipatedMisconceptions"
          ],
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
    "Hypothesize": {
      "x-format": "### {green}(Hypothesize (5 min))\n\n**{loc.Purpose}:** Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Подскажите учителю, чтобы учащиеся сформулировали проверяемое предсказание.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Слово в слово: Цель: Сформулировать проверяемое предсказание или утверждение на основе их исследований и рассуждений, задавая четкое ожидание относительно того, что, по их мнению, произойдет."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Инструкции для учителя. Включите подсказки «Скажите:». Дайте конкретную инструкцию, например «Напишите на доске:», после которой следует маркированный список из 4-5 шаблонов предложений для гипотез."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 ожидаемых примера гипотез."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
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
    "Experiment": {
      "x-format": "### {green}(Experiment (20 min))\n\n**{loc.Purpose}:** Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Подскажите учителю, чтобы учащиеся провели структурированное исследование.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Слово в слово: Цель: Провести структурированное исследование — практическое, смоделированное или аналитическое — чтобы проверить их гипотезу и собрать доказательства через наблюдение или измерение."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "\n\n{value}",
                "type": "string"
              },
              "description": "Пошаговые инструкции для учителя, чтобы организовать эксперимент, дать указания и перемещаться по классу."
            },
            "QuickCheck": {
              "x-format": "✔️**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "properties": {
                "Question": {
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
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false
            },
            "Differentiation": {
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "type": "object",
              "properties": {
                "LanguageLearners": {
                  "x-format": "**{loc.LanguageLearners}**\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdditionalScaffolding": {
                  "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}**\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "GoDeeper": {
                  "x-format": "**{loc.GoDeeper}**\n\n{value.Challenges}\n\n{value.ExpectedStudentResponses}",
                  "type": "object",
                  "properties": {
                    "Challenges": {
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "ExpectedStudentResponses": {
                      "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                      "type": "array",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      },
                      "description": "Для ответов «Углубиться дальше»."
                    }
                  },
                  "required": [
                    "Challenges",
                    "ExpectedStudentResponses"
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
              "description": "Этот раздел должен включать два типа поддержи: общую поддержку и индивидуализированную поддержку. Сосредоточьтесь на доступности, а не на снижении сложности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Стратегии, не привязанные к конкретному ученику, которые улучшают доступ для всех учащихся (например, визуальные материалы, заранее заполненные заметки, цифровой глоссарий, разбивка инструкций на части). Предоставьте 2-4 пункта маркированного списка."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Специальные приспособления и модификации для указанных учащихся с официальными планами. Перечислите КАЖДОГО учащегося отдельно; не объединяйте учащихся в группы. Поддержка для каждого учащегося должна быть в виде удобного для быстрого просмотра списка.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Имя и фамилия отдельного учащегося, получающего эту поддержку."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Официальный план, предоставленный для этого учащегося в задании. Преобразуйте план в понятный список. Вы можете перефразировать его, чтобы улучшить форматирование, но не опускайте и не добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретные инструменты/подсказки/визуальные материалы/органайзеры для этого задания."
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
            "Instructions",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
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
    "Analyze": {
      "x-format": "### {green}(Analyze (5 min))\n\n**{loc.Purpose}:** Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Помогите учителям так, чтобы учащиеся интерпретировали собранные ими данные.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Цель: Интерпретировать собранные ими данные, выявить закономерности, оценить свою гипотезу и сформулировать выводы, основанные на доказательствах."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "Текст инструкции для учителя (например, «Предоставьте начальные фразы для предложений:»). Не включайте нумерацию, она обрабатывается автоматически."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Необязательные пункты списка. Вы ДОЛЖНЫ предоставить список из 4–5 начальных фраз для предложений, когда шаг просит об этом. Вы ДОЛЖНЫ предоставить список из 4–5 подсказок для обхода/взаимодействия по классу, когда шаг просит об этом. В противном случае предоставьте пустой массив."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Пошаговые инструкции для учителя. Вы ДОЛЖНЫ включить ровно один шаг, специально предназначенный для начальных фраз для предложений, и заполнить его массив 'Bullets'. Вы ДОЛЖНЫ включить ровно один шаг, специально предназначенный для подсказок для обхода/взаимодействия по классу, и заполнить его массив 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Ожидаемые ответы или завершения фраз учащимися."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
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
    "Share": {
      "x-format": "### {green}(Share (5 min))\n\n**{loc.Purpose}:** Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Помогите учителям так, чтобы учащиеся ясно сообщали о своих выводах.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Дословно: Цель: Ясно сообщать другим о своих выводах, используя доказательства, чтобы объяснить, что они узнали, почему это важно и как это способствует более глубокому пониманию."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{value.Instructions}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "properties": {
            "Instructions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "type": "object",
                "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
                "properties": {
                  "Step": {
                    "type": "string",
                    "description": "Текст инструкции для учителя (например, «Напишите на доске:»). Не включайте нумерацию, она обрабатывается автоматически."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Необязательные пункты списка. Вы ДОЛЖНЫ предоставить список из 4–5 пунктов, когда шаг предусматривает структуру для представления. Вы ДОЛЖНЫ предоставить список из 4–5 вопросов-подсказок для учителя, когда шаг просит об этом. В противном случае предоставьте пустой массив."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Пошаговые инструкции для учителя. Вы ДОЛЖНЫ включить ровно один шаг, специально предназначенный для структуры представления, и заполнить его массив 'Bullets'. Вы ДОЛЖНЫ включить ровно один шаг, специально предназначенный для вопросов-подсказок для учителя, и заполнить его массив 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Ожидаемые идеи, которыми делятся учащиеся."
            }
          },
          "required": [
            "Instructions",
            "ExpectedStudentResponses"
          ],
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
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Полный раздел «Повторение и интервальное извлечение».",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Попросите учащихся вспомнить НОВОЕ, чему они научились СЕГОДНЯ на уроке.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Подсказка учителя, начинающаяся с «Скажи: »."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
        "EssentialQuestionConnection": {
          "x-format": "💭 **{loc.EssentialQuestionConnection}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Подсказка для учителя, связывающая с вопросом модуля.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Подсказка для учителя, начинающаяся с 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
          "description": "Попросить учащихся связать изучаемое с другими реальными ситуациями.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Подсказка для учителя, начинающаяся с 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}**\n\n{items}",
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
          "x-format": "⏳ **{loc.SpacedRetrieval}**\n\n{value.PriorLearningContext} {value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Вспомните из конкретного предыдущего урока/модуля.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Контекстное предложение, например: 'Ранее на этом уроке учащиеся узнали...'"
            },
            "Say": {
              "type": "string",
              "description": "Подсказка для учителя, начинающаяся с 'Say: '."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ **{loc.ExpectedStudentResponses}:**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "PriorLearningContext",
            "Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
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
      "description": "Точно 4 подсказки для формирующего оценивания, по одной для каждого уровня DOK.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "например, 'Подсказка 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "Точный текст вопроса."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 примера ответов, демонстрирующих владение материалом."
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
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.PracticeTasks}\n\n{value.Reflection}",
      "type": "object",
      "description": "Практика для домашнего задания/работы вне урока.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Заметки для учителя, объясняющие, как эти практические задания укрепляют сегодняшнее обучение и способствуют долгосрочному запоминанию."
        },
        "PracticeTasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Точно 3 практических задания (DOK 2 или DOK 3).",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "например, '(DOK 2) Сегодня вечером выйдите на улицу и напишите 3-4 предложения...'"
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
              "description": "например, 'Рефлексия: Напишите 2-3 предложения, отвечая на один из вопросов:'"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Точно 4 варианта вопросов для рефлексии."
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
    "FormativeAssessment": [
      "FormativeAssessment"
    ]
  }
},
};
