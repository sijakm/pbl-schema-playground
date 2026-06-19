window.promptsru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план раздела и структуру уроков, используя информацию ниже. НЕ пишите полные планы уроков.
                    
На основе темы раздела, образовательных стандартов, описания/инструкции к разделу, уровня класса, продолжительности урока (в минутах) и запрошенного количества уроков сгенерируйте JSON-ответ, который включает связное описание раздела UnitDescription и непересекающийся список «контейнеров» уроков.

Тема раздела:
{{$Subject}}

Название раздела:
{{$Name}}

Описание/инструкция к разделу:
{{$UserPrompt}}

Уровень класса:
{{$GradeLevel}}

Продолжительность урока в минутах:
{{$ClassDuration}}
	
Стандарты для согласования:
{{$Standards}}
    
Студенты, которым требуется индивидуализированная поддержка:
{{$LearningPlans}}

Ресурсы/медиа для использования:
{{$MediaContext}}
	
Содержание раздела:
{{$AttachedUnit}}

Требования к ключевым вопросам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически корректным предложением, оканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с "How", либо с "Why".
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ фокусироваться на широких, универсальных идеях (таких как изменение, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами данного раздела.
- Вопросы ДОЛЖНЫ использоваться дословно в каждом уроке внутри раздела.

Что нужно сгенерировать:
- Результат ДОЛЖЕН быть корректным JSON, соответствующим схеме.
- ОБЯЗАТЕЛЬНО: Полностью заполните все свойства объекта "UnitDescription":
  - "Description": Напишите абзац из 4–5 предложений, который описывает основной фокус раздела и его содержательную траекторию.
  - "StudentLearningObjectives": Перечислите 3–5 ключевых измеримых учебных целей для раздела.
  - "StandardsAligned": Перечислите все стандарты, которые охватываются в течение раздела.
  - "EssentialQuestions": Ровно 3 концептуальных вопроса, соответствующих правилам выше.
- СГЕНЕРИРУЙТЕ список "Lessons", содержащий ровно {{$NumberOfItems}} уроков.
  - Каждый урок должен включать "lessonNumber" (индекс, начиная с 1), "lessonName" и "lessonDescription" (2–4 предложения, описывающие содержание урока).

Ограничения:
- Сохраняйте соответствие раздела и каждого урока фокусу раздела.
- Обеспечьте логическую последовательность от базовых идей к более сложному моделированию.
- Точность: весь контент должен быть научно корректным и соответствующим возрасту.

Результат ДОЛЖЕН быть корректным JSON, соответствующим схеме. Используйте компактное форматирование (без лишних пустых строк).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока (НЕ план раздела, НЕ несколько уроков), используя информацию ниже.
ВЫ ДОЛЖНЫ вывести корректный JSON, который в точности соответствует предоставленной схеме JSON (LessonPlanResponse с единственным объектом "LessonPlan"). Не включайте никаких дополнительных ключей. Используйте компактное форматирование JSON (без лишних пустых строк).
Предмет раздела: 
{{$Subject}}
Название раздела: 
{{$Name}}
Описание/инструкция раздела: 
{{$UserPrompt}}
Уровень класса: 
{{$GradeLevel}}
Продолжительность урока в минутах 
{{$ClassDuration}}
Ресурсы/медиа для использования: 
{{$MediaContext}}
Содержание раздела: 
{{$ParentUnitData}}
Стандарты, с которыми нужно согласовать:
{{$Standards}}
Прикреплённое содержание урока: 
{{$AttachedLesson}}

Ключевые вопросы раздела (ИСПОЛЬЗУЙТЕ ИХ ДОСЛОВНО):
{{$UnitEssentialQuestions}}

Если указанные выше Ключевые вопросы раздела пусты, сгенерируйте ровно 3 концептуальных вопроса, следуя этим правилам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением и заканчиваться вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с "How", либо с "Why".
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменение, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами этого раздела.


УЧАЩИЕСЯ С ИНДИВИДУАЛИЗИРОВАННОЙ ПОДДЕРЖКОЙ (ДОЛЖНО использоваться ТОЛЬКО внутри GuidedPractice.AccommodationsAndModifications; используйте имена учащихся/планы в точности так, как они написаны):
{{$LearningPlans}}

ВАЖНЫЕ ПРАВИЛА СОДЕРЖАНИЯ:
- Сохраняйте урок в соответствии с фокусом раздела: развитие и использование моделей для описания атомного состава простых молекул и/или протяжённых структур.
- При необходимости включайте краткие, общие связи с другими соответствующими DCI, но сохраняйте центральное внимание урока на моделировании и рассуждении о связи «структура–свойства» (без глубокой математики, без уравнивания/балансировки уравнений, если это не требуется стандартами).
- Убедитесь, что все части урока отражают указанные выше рамки/ограничения урока; не вводите новых крупных понятий, относящихся к другим урокам.
- EssentialQuestions: ДОЛЖНЫ в точности совпадать с вопросами на уровне раздела (тот же текст, тот же порядок).
- AssessPriorKnowledge: ТОЛЬКО если LessonNumber == 1, напишите 150–250 слов и следуйте требуемой структуре, описанной в схеме. Если LessonNumber != 1, верните "" (пустую строку).
- DirectPresentation должен длиться ≤10 минут в сумме и должен следовать требуемому формату HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT с Say/Do/Ask/✅ Expected Student Responses/Write, а ожидаемые ответы учащихся должны быть в виде маркированных пунктов (НЕ включайте заголовки/названия разделов в строку).
- GuidedPractice.InstructionsForTeachers должен быть не менее 700 слов и должен включать требуемые компоненты, перечисленные в описании схемы.
- GuidedPractice.AccommodationsAndModifications должен включать:
  - General: общие меры поддержки
  - IndividualSupport: массив ровно с указанными учащимися и их планами (те же имена/планы; без дополнительных учащихся).
- StudentPractice ДОЛЖЕН включать абзац TeacherNotes, начинающийся с 'These tasks reinforce today’s learning about ____ by ______.', список из 2-3 заданий с DOK 2-4 и критериями успеха, а также перемежение, если предмет — математика.

ТРЕБОВАНИЯ К ВЫВОДУ:
- Вывод ДОЛЖЕН быть корректным JSON, точно соответствующим предоставленной схеме.
- Вывод ДОЛЖЕН быть ТОЛЬКО одним планом урока.
- Без HTML. Без эмодзи. Без markdown. Обычный текст внутри строковых полей.

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
          "description": "Описание раздела как один цельный абзац простого текста (4–5 полных предложений), написанный естественным голосом учителя, который вы могли бы сказать ученикам напрямую. Без HTML, без эмодзи, без маркеров. Текст должен звучать разговорно, но следовать этой структуре (без заголовков): (1) предложение-завязка, которое пробуждает любопытство или создает удивительный контраст, (2) предложение «В этом разделе вы будете...» о результатах освоения, (3) предложение «Вы укрепите свои навыки в...» о навыках мышления/анализа, (4) предложение «Это связано с...» о практической значимости, (5) предложение «Понимание этого важно, потому что...» о более широком значении или долгосрочном влиянии."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Создайте ключевые вопросы, которые сосредоточены только на широких, универсальных концепциях, таких как изменения, доказательства, закономерности, взаимосвязи, системы или рассуждение. Не упоминайте какие-либо предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми между всеми дисциплинами и невозможными для ответа только на основе изучения материала урока или раздела. Сосредоточьтесь только на больших идеях, а не на содержании предмета.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Полный раздел «Учебные цели учащихся» для всего этого раздела. Каждый пункт списка должен быть четкой, измеримой целью, начинающейся с измеримого глагола и заканчивающейся меткой DOK в скобках",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Перечислите все уникальные образовательные стандарты, используемые где-либо в этом разделе и его уроках. Не добавляйте стандарты, которые не встречаются в содержании раздела. Каждый стандарт должен включать код стандарта и описание, например, 'MS-ESS1-1: Разработать и использовать модель системы Земля–Солнце–Луна, чтобы описать циклические закономерности фаз Луны, затмений и времен года.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}"
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
      "description": "Список контейнеров уроков для этого раздела (только план). Каждый элемент должен не пересекаться с другими и быть четко ограничен, чтобы содержание уроков не повторялось между уроками.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Порядковый номер урока. На основе 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Краткое название урока в виде простого текста."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 предложения, описывающие объем, фокус и границы урока, чтобы избежать пересечения с другими уроками."
          }
        },
        "required": [
          "lessonNumber",
          "lessonTitle",
          "lessonOutline"
        ],
        "additionalProperties": false
      },
      "x-format": false
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
          "description": "Просто вставьте все ключевые вопросы раздела в том же порядке, если они предоставлены. Если нет, сгенерируйте ровно 3 концептуальных вопроса, которые сосредоточены только на широких, универсальных концепциях, таких как изменения, доказательства, закономерности, взаимосвязи, системы или рассуждение. Не упоминайте какие-либо предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми между всеми дисциплинами и невозможными для ответа только на основе изучения материала урока или раздела. Сосредоточьтесь только на больших идеях, а не на содержании предмета.",
          "items": {
            "type": "string"
          },
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Полный раздел «Ключевая лексика» в виде списка строк. Каждая строка должна содержать один термин с определением, разделенным тире/дефисом. Пример: 'Гравитация - Сила, которая притягивает объекты друг к другу'. Все определения должны быть короткими, соответствующими возрасту учащихся и напрямую связанными с содержанием урока.",
          "items": {
            "type": "string",
            "x-format": "{index}. {value}"
          },
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Полный раздел «Учебные цели учащихся» в виде простого текста. Каждый пункт должен быть четкой, измеримой целью, начинающейся с измеримого глагола и заканчивающейся меткой DOK в скобках, например, 'Моделировать, как вращение Земли вокруг своей оси вызывает день и ночь (DOK 2).'.",
          "items": {
            "type": "string",
            "x-format": "- {value}\n"
          },
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Полный раздел «Стандарты в соответствии» для этого урока в виде списка. Каждый стандарт должен включать код стандарта и описание, причем код и описание должны быть точно такими же, как в разделе «Раздел». Например, 'MS-ESS1-1: Разработать и использовать модель системы Земля–Солнце–Луна, чтобы описать циклические закономерности фаз Луны, затмений и времен года.'.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
        },
        "AssessPriorKnowledge": {
          "type": "object",
          "description": "Раздел оценки предварительных знаний. ТОЛЬКО УРОК 1 должен содержать подробный блок; ВСЕ ОСТАЛЬНЫЕ УРОКИ ДОЛЖНЫ ВОЗВРАЩАТЬ ПУСТЫЕ МАССИВЫ для всех полей. Для Урока 1 структура должна включать ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt и AlternateOptions. 1. Используйте подсказки DOK 1–3. 2. Включите базовые навыки. 3. Выберите один формат и полностью его разработайте. 4. Предоставьте начальные подсказки учителя, инструкции, ожидаемые ответы, заключительные подсказки и 2 альтернативных варианта.",
          "properties": {
            "ActivityInstructions": {
              "type": "array",
              "description": "Последовательные шаги (например, 'Скажите: ...', 'Покажите или прочитайте...') для начала активности.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "ExpectedStudentResponses": {
              "type": "array",
              "description": "Предполагаемые ответы или распространенные заблуждения для выбранного формата.",
              "items": {
                "type": "string",
                "x-format": "  - {value}"
              },
              "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
            },
            "ClosingTeacherPrompt": {
              "type": "array",
              "description": "Заключительные действия и подсказки учителя, которые подтверждают мышление учащихся и предваряют исследование раздела.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "AlternateOptions": {
              "type": "array",
              "description": "2 кратких альтернативных варианта, которые учитель может выбрать.",
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "x-format": "**{loc.AlternateOptions}**\n\n{items}"
            }
          },
          "required": [
            "ActivityInstructions",
            "ExpectedStudentResponses",
            "ClosingTeacherPrompt",
            "AlternateOptions"
          ],
          "additionalProperties": false,
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}"
        },
        "DirectPresentation": {
          "type": "object",
          "description": "Полный раздел «Прямое изложение». Это ПЕРВАЯ очная активность, и она должна длиться НЕ БОЛЕЕ 10 минут.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Сценарий учителя, организованный в последовательные шаги по ЭТОЙ ТОЧНОЙ последовательности: (1) ЗАЦЕПКА (1–2 мин), (2) ВВЕДЕНИЕ (1–2 мин), (3) ПРЯМОЕ ОБУЧЕНИЕ (4–5 мин) и (4) РУКОВОДИМОЕ ВОВЛЕЧЕНИЕ (2–3 мин). Не включайте заголовки в строки. Каждый шаг должен включать речь учителя (Say:/Ask:), действия учителя (Do:/Write:/Draw/Show:) и, если применимо, ожидаемые ответы учащихся.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Конкретное действие учителя, начиная с «Say: », «Do: » и т. д."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Предполагаемые ответы, если инструкция была вопросом. Верните пустой массив, если не применимо.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "AnticipatedMisconceptions": {
              "type": "array",
              "description": "Список распространённых заблуждений и точные формулировки исправления для устранения каждого из них.",
              "items": {
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Описание заблуждения."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Формулировка исправления, начинающаяся с «Say: »."
                  }
                },
                "required": [
                  "Misconception",
                  "Correction"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}"
              },
              "x-format": "⚠️ {loc.AnticipatedMisconceptions}\n\n{items}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Вопрос о применении в реальной жизни, связывающий обучение с целью/смыслом/большими идеями.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "Ожидаемые ответы учащихся, показывающие более глубокое понимание.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Итоговая проверка понимания для учащегося, чья учебная цель уже объявлена в уроке. Это ДОЛЖНО быть индивидуальным заданием, которое КАЖДЫЙ учащийся должен выполнить.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "например, «Потратьте 2 минуты, чтобы набросать X в своей тетради» или «На черновике объясните, почему Y...»"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 конкретных ожидаемых ответа учащихся.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "AnticipatedMisconceptions",
            "TranscendentThinking",
            "QuickCheck"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.DirectPresentation})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}"
        },
        "GuidedPractice": {
          "type": "object",
          "description": "Раздел структурированной совместной практики с отдельными полями для материалов, инструкций, дифференциации и необязательных приспособлений.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Необходимые физические предметы, нужные для этого задания совместной практики (например, «шарики из пенопласта, нить, маркеры»), оформленные в виде списка",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Сценарий учителя, организованный в последовательные шаги. Каждый шаг должен сочетать действия учителя и реплики. Завершайте подсказками для обхода класса.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Конкретное действие учителя, начиная с «Say: », «Do: » и т. д."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Предполагаемые ответы, если инструкция была вопросом. Верните пустой массив, если не применимо.",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  }
                },
                "required": [
                  "Instruction",
                  "ExpectedStudentResponses"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "QuickCheck": {
              "type": "object",
              "description": "Заключительный вопрос для проверки понимания в рамках совместной практики.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 ожидаемых ответа учащихся.",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.QuickCheck}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "Differentiation": {
              "type": "object",
              "description": "Обозначено тремя чётко подписанными уровнями: Изучающие английский язык, Учащиеся, нуждающиеся в дополнительной поддержке, Идите глубже. Требования: Содержание должно дифференцировать обучение, а не предоставлять приспособления или модификации (они рассматриваются в другом месте). Стратегии должны быть сосредоточены на том, как обучать, а не на том, как упрощать материалы. Деятельность должна различаться по сложности и глубине и быть согласованной с теми же целями обучения. Каждый уровень должен поощрять активное вовлечение, развитие языка и концептуальное понимание. Используйте ясный, ориентированный на учителя язык и делайте поддержку реалистичной для использования в классе.",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Предоставьте 2-3 конкретные стратегии преподавания для изучающих язык. Примеры: предоставление определённых визуальных материалов (например, «Лист фактов о планете»), использование речевых шаблонов (например, «Это помещено здесь, потому что...»), или просьба к учащимся сначала показать жестом/указать, прежде чем объяснять устно. Сосредоточьтесь на активном вовлечении и развитии языка.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.LanguageLearners}\n\n{value.Strategies}"
                },
                "AdditionalScaffolding": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Предоставьте 2-3 конкретные стратегии преподавания для поддержки. Примеры: предоставление заранее нарисованных органайзеров/шаблонов, использование упрощённого чек-листа с конкретными наводящими вопросами или моделирование процесса «think-aloud» (например, «Посмотрите, как я сопоставляю...»). Сосредоточьтесь на том, как обучать, и варьируйте сложность без упрощения материалов.",
                      "x-format": "{items}"
                    }
                  },
                  "required": [
                    "Strategies"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.StudentsInNeedOfAdditionalScaffolding}\n\n{value.Strategies}"
                },
                "GoDeeper": {
                  "type": "object",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Предложите 1–2 дополнительных задания, которые углубляют концептуальное понимание. Включите конкретные вызовы (например, «Отрегулируйте расстояние, чтобы показать...») или вопросы более высокого порядка (например, «Как бы вы смоделировали... точно?»). Должны соответствовать тем же целям обучения.",
                      "x-format": "{items}"
                    },
                    "ExpectedStudentResponses": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Ожидаемые ответы учащихся, показывающие, как выглядит успех. Верните пустой массив, если это неприменимо.",
                      "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                    }
                  },
                  "required": [
                    "Strategies",
                    "ExpectedStudentResponses"
                  ],
                  "additionalProperties": false,
                  "x-format": "{loc.GoDeeper}\n\n{value.Strategies}\n\n{value.ExpectedStudentResponses}"
                }
              },
              "required": [
                "LanguageLearners",
                "AdditionalScaffolding",
                "GoDeeper"
              ],
              "additionalProperties": false,
              "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}"
            },
            "AccommodationsAndModifications": {
              "type": "object",
              "description": "Этот раздел должен включать два типа поддержки: Общая поддержка и Индивидуализированная поддержка. Сосредоточьтесь на доступности, а не на снижении требований.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Неспецифичные для отдельных учащихся стратегии, которые улучшают доступ для всех учащихся (например, визуальные материалы, заранее заполненные заметки, цифровой глоссарий, инструкции, разбитые на части). Предоставьте 2–4 пункта списка.",
                  "x-format": "{items}"
                },
                "IndividualSupport": {
                  "type": "array",
                  "description": "Конкретные приспособления и модификации для названных учащихся с официальными планами. Укажите КАЖДОГО учащегося отдельно; НЕ объединяйте учащихся вместе. Поддержка для каждого учащегося должна быть в виде легко просматриваемого списка.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Имя и фамилия отдельного учащегося, получающего эту поддержку."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Официальный план, предоставленный для этого учащегося в подсказке. Разбейте план на понятный список. Вы можете перефразировать его, чтобы улучшить форматирование, но НЕ упускайте и не добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Конкретные инструменты/начальные фразы/визуальные материалы/организаторы для этого задания.",
                        "x-format": "{items}"
                      }
                    },
                    "required": [
                      "StudentName",
                      "PlanProvided",
                      "PlanImplementation"
                    ],
                    "additionalProperties": false,
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}"
                  },
                  "x-format": "{items}"
                }
              },
              "required": [
                "General",
                "IndividualSupport"
              ],
              "additionalProperties": false,
              "x-format": "**🤝 {loc.AccommodationsAndModifications}**\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}"
            }
          },
          "required": [
            "Materials",
            "InstructionsForTeachers",
            "QuickCheck",
            "Differentiation",
            "AccommodationsAndModifications"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.GuidedPractice})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.QuickCheck}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}"
        },
        "IndependentPractice": {
          "type": "object",
          "description": "Раздел структурированной самостоятельной практики.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Необходимые материалы.",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "Purpose": {
              "type": "string",
              "description": "Цель самостоятельной практики."
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Последовательные задания для самостоятельной практики.",
              "items": {
                "type": "object",
                "properties": {
                  "TaskName": {
                    "type": "string"
                  },
                  "DOKLevel": {
                    "type": "string",
                    "description": "например, «DOK 3» или «DOK 3–4»"
                  },
                  "TeacherNotes": {
                    "type": "string",
                    "description": "Объяснение, связывающее задание с презентацией/целями."
                  },
                  "Instruction": {
                    "type": "string",
                    "description": "Конкретная инструкция или формулировка «Скажи:»."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "Примеры ответов.",
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "2–4 элемента, показывающие овладение материалом.",
                    "x-format": "- {loc.SuccessCriteria}\n\n{items}"
                  }
                },
                "required": [
                  "TaskName",
                  "DOKLevel",
                  "TeacherNotes",
                  "Instruction",
                  "ExpectedStudentResponses",
                  "SuccessCriteria"
                ],
                "additionalProperties": false,
                "x-format": "\n\n**{loc.Task} {index}:** {value.TaskName} ({value.DOKLevel})\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.SuccessCriteria}"
              },
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}"
            },
            "Reflection": {
              "type": "array",
              "description": "Вопросы на саморегуляцию и трансценденцию.",
              "items": {
                "type": "object",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ReflectionType": {
                    "type": "string",
                    "description": "например, «Саморегуляция» или «Трансценденция»"
                  }
                },
                "required": [
                  "Question",
                  "ReflectionType"
                ],
                "additionalProperties": false,
                "x-format": "- **{value.ReflectionType}:** {value.Question}"
              },
              "x-format": "**{loc.Reflection}**\n\n{items}"
            },
            "EarlyFinishers": {
              "type": "object",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Задание/описание для учащихся, завершающих раньше других."
                },
                "Requirements": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Конкретные элементы, которые учащиеся должны затронуть.",
                  "x-format": "{items}"
                },
                "Justification": {
                  "type": "string",
                  "description": "Заключительное предложение о применении точных принципов."
                }
              },
              "required": [
                "Prompt",
                "Requirements",
                "Justification"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.EarlyFinishers}**\n\n**{loc.Prompt}:** {value.Prompt}\n\n**{loc.Requirements}:**\n{value.Requirements}\n\n**{loc.Justification}:** {value.Justification}"
            }
          },
          "required": [
            "Materials",
            "Purpose",
            "InstructionsForTeachers",
            "Reflection",
            "EarlyFinishers"
          ],
          "additionalProperties": false,
          "x-format": "### {green}({loc.IndependentPractice})\n\n{value.Materials}\n\n**{loc.Purpose}:** {value.Purpose}\n\n{value.InstructionsForTeachers}\n\n{value.Reflection}\n\n{value.EarlyFinishers}"
        },
        "ReviewAndSpacedRetrieval": {
          "type": "object",
          "description": "Раздел «Структурированный обзор и интервальное извлечение из памяти». Это 5-минутное задание закрепляет ранее изученные понятия и связывает их с текущим обучением.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Необходимые материалы (часто не требуются).",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "TeacherNotes": {
              "type": "string",
              "description": "Абзац «Заметки для учителя», в котором объясняется: как эта стратегия повторения улучшает запоминание, связь с ранее изученными понятиями и как трансцендентная рефлексия углубляет понимание.",
              "x-format": "**{loc.TeacherNotes}:** {value}"
            },
            "ActiveRecall": {
              "type": "object",
              "description": "Инструкции для учителей, содержащие подсказку для активного припоминания.",
              "properties": {
                "Instruction": {
                  "type": "string",
                  "description": "Подсказка для активного припоминания с использованием обмена в паре/группе. Должно использовать утверждение «Скажите:»."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Ожидаемые ответы учащихся (2–3 примера в виде маркеров).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                },
                "CorrectCommonMisconceptions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Примеры возможных заблуждений и сценарии ответа учителя, адресующие каждое из них (например, «Если учащийся говорит X, ответьте Y»).",
                  "x-format": "**{loc.CorrectCommonMisconceptions}**\n\n{items}"
                }
              },
              "required": [
                "Instruction",
                "ExpectedStudentResponses",
                "CorrectCommonMisconceptions"
              ],
              "additionalProperties": false,
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}"
            },
            "EssentialQuestionConnection": {
              "type": "object",
              "description": "Связь с ключевым вопросом модуля.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Подсказка учителя, связывающая с вопросом модуля. Должно использовать утверждение «Скажите:»."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Ожидаемые ответы учащихся (2–3 примера).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**💭 {loc.EssentialQuestionConnection}**\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "TranscendentThinking": {
              "type": "object",
              "description": "Рефлексия о применении в реальном мире или более широком влиянии.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Подсказка о применении в реальном мире. Должна включать указание времени на обдумывание (например, «Потратьте 30 секунд на молчаливое обдумывание, затем поделитесь:») и использовать утверждение «Скажите:»."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Ожидаемые ответы учащихся (2–3 примера).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "Question",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "### 🌍 {loc.TranscendentThinking}\n\n{value.Question}\n\n{value.ExpectedStudentResponses}"
            },
            "SpacedRetrieval": {
              "type": "object",
              "description": "Воспроизведение конкретных ранее изученных понятий.",
              "properties": {
                "HeaderTitle": {
                  "type": "string",
                  "description": "Чёткая ссылка на конкретный предыдущий урок (например, «Интервальное извлечение из памяти (основано на Модуле 2, Урок 3)»)."
                },
                "Instruction": {
                  "type": "string",
                  "description": "Вопрос, связывающий прошлые и текущие понятия. Должно использовать утверждение «Скажите:»."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Подробные критерии успеха или ожидаемые ответы учащихся (2–3 примера).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                }
              },
              "required": [
                "HeaderTitle",
                "Instruction",
                "ExpectedStudentResponses"
              ],
              "additionalProperties": false,
              "x-format": "**⏳ {value.HeaderTitle}**\n\n{value.Instruction}\n\n{value.ExpectedStudentResponses}"
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
          "additionalProperties": false,
          "x-format": "### {green}({loc.ReviewAndSpacedRetrieval})\n\n{value.Materials}\n\n{value.TeacherNotes}\n\n📋 **{loc.InstructionsForTeachers}**\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.TranscendentThinking}\n\n{value.SpacedRetrieval}"
        },
        "FormativeAssessment": {
          "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
          "type": "array",
          "description": "Точно 4 формирующих оценочных вопроса, по одному для каждого уровня DOK.",
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
                "description": "Точный текст вопроса, например, 'Почему планеты остаются на орбите вместо того, чтобы улетать в космос?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 примера ответов, демонстрирующих владение материалом (в кавычках)."
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
          "description": "Домашняя / внеурочная практика.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Краткое объяснение целей практики, например, 'Эти задания закрепляют сегодняшнее изучение [topic], предлагая учащимся наблюдать закономерности в реальном мире и объяснять их с помощью понятий, представленных на уроке...'"
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
},
};
