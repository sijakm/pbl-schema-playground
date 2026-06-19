window.prompts_lecture_ru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план раздела и структуру уроков, используя информацию ниже. НЕ пишите полные планы уроков.
                    
На основе учебного предмета раздела, образовательных стандартов, описания/инструкций по разделу, уровня класса, продолжительности урока (в минутах) и запрошенного количества уроков сгенерируйте ответ в формате JSON, который включает связное UnitDescription и непересекающийся список «контейнеров» уроков.

Учебный предмет раздела:
{{$Subject}}

Название раздела:
{{$Name}}

Описание/инструкция по разделу:
{{$UserPrompt}}

Уровень класса:
{{$GradeLevel}}

Продолжительность урока в минутах:
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
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, заканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться с «Как» или «Почему».

- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактологическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменения, доказательства, закономерности, взаимосвязи, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами данного раздела.
- Вопросы ДОЛЖНЫ повторяться дословно в каждом уроке внутри раздела.

Что нужно сгенерировать:
- Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме.
- ОБЯЗАТЕЛЬНО: Полностью заполните все свойства внутри объекта "UnitDescription":
  - "Description": Напишите абзац из 4–5 предложений, который описывает ключевой фокус раздела и его содержательное повествование.
  - "StudentLearningObjectives": Перечислите 3–5 ключевых измеримых учебных целей для раздела.
  - "StandardsAligned": Перечислите все стандарты, которые рассматриваются на протяжении всего раздела.
  - "EssentialQuestions": Ровно 3 концептуальных вопроса, соответствующих правилам выше.
- СГЕНЕРИРУЙТЕ список "Lessons", содержащий ровно {{$NumberOfItems}} уроков.
  - Каждый урок должен включать "lessonNumber" (индекс, начинающийся с 1), "lessonName" и "lessonDescription" (2–4 предложения, описывающие охват урока).

Ограничения:
- Сохраняйте соответствие между разделом и каждым уроком с фокусом раздела.
- Обеспечьте логическую последовательность от базовых идей к более сложному моделированию.
- Точность: весь контент должен быть научно корректным и соответствующим возрасту.

Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме. Используйте компактное форматирование (без лишних пустых строк).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока-ЛЕКЦИИ (НЕ план модуля, НЕ несколько уроков), используя информацию ниже.
ВЫ ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме. Не добавляйте никаких лишних ключей. Используйте компактное форматирование JSON (без лишних пустых строк).
Предмет модуля: 
{{$Subject}}
Название модуля: 
{{$Name}}
Описание/инструкция модуля: 
{{$UserPrompt}}
Уровень класса: 
{{$GradeLevel}}
Продолжительность урока в минутах 
{{$ClassDuration}}
Ресурсы/медиа для использования: 
{{$MediaContext}}
Содержание модуля: 
{{$ParentUnitData}}
Стандарты, которым нужно соответствовать:
{{$Standards}}
Прикреплённое содержание урока: 
{{$AttachedLesson}}

Ключевые вопросы модуля (ИСПОЛЬЗУЙТЕ ИХ ДОСЛОВНО):
{{$UnitEssentialQuestions}}

Если указанные выше ключевые вопросы модуля пусты, сгенерируйте ровно 3 концептуальных вопроса, следуя этим правилам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, заканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться с «Как» или «Почему».

- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ фокусироваться на широких, универсальных идеях (таких как изменение, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми вне этого модуля.

УЧАЩИЕСЯ С ИНДИВИДУАЛИЗИРОВАННОЙ ПОДДЕРЖКОЙ (ДОЛЖНО использоваться ТОЛЬКО внутри ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; используйте имена учащихся/планы точно в том виде, как они написаны):
{{$LearningPlans}}

ВАЖНЫЕ ПРАВИЛА СОДЕРЖАНИЯ:
- Сохраняйте урок в соответствии с фокусом модуля: разработка и использование моделей для описания атомного состава простых молекул и/или расширенных структур.
- При необходимости включайте краткие, общие связи с другими соответствующими DCI, но сохраняйте урок сосредоточенным на моделировании и рассуждении о связи структуры и свойств (без глубокой математики, без уравнивания/балансировки уравнений, если это прямо не требуется стандартами).
- Убедитесь, что все части урока отражают Scope/Boundaries урока, указанные в контексте модуля; не вводите новые крупные понятия, относящиеся к другим урокам.
- EssentialQuestions: ДОЛЖНЫ в точности равняться ключевым вопросам на уровне модуля (тот же текст, тот же порядок).
- AssessPriorKnowledge: ТОЛЬКО если LessonNumber == 1, заполните объект так, как определено в схеме. ДЛЯ ВСЕХ ДРУГИХ УРОКОВ вы ДОЛЖНЫ вернуть пустой объект {} без каких-либо ключей внутри. НЕ используйте заполнители вроде "N/A", "none" или пустые массивы.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications должен включать общие меры поддержки, а затем индивидуальную поддержку для каждого учащегося, указанного в {{$LearningPlans}}.
- Когда где-либо в плане урока предлагаются "sentence frames" или "sentence starters" (особенно в Individualized Supports), вы ДОЛЖНЫ предоставить реальные, конкретные речевые шаблоны, адаптированные к содержанию урока, чтобы учитель мог использовать их напрямую.
- StudentPractice ДОЛЖЕН включать абзац TeacherNotes, начинающийся с 'These tasks reinforce today's learning about ____ by ______.', список из 2–3 заданий с DOK 2–4 и критериями успешности, а также чередование (interleaving), если предмет — математика.

ТРЕБОВАНИЯ К ВЫВОДУ:
- Вывод ДОЛЖЕН быть корректным JSON, точно соответствующим предоставленной схеме.
- Вывод ДОЛЖЕН быть ТОЛЬКО ОДНИМ планом урока.
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
          "description": "Описание блока как одного связного абзаца обычного текста из 4–5 полных предложений, написанного естественным учительским тоном, который вы могли бы сказать ученикам напрямую. Без HTML, без эмодзи, без маркированных списков. Текст должен звучать разговорно, но следовать этой структуре (без заголовков): (1) предложение-зацепка, которое пробуждает любопытство или создаёт неожиданный контраст, (2) предложение «В этом блоке вы будете...» о результатах освоения, (3) предложение «Вы укрепите свои навыки в...» о навыках мышления/анализа, (4) предложение «Это связано с...» о значимости в реальной жизни, (5) предложение «Понимание этого важно, потому что...» о более широком значении или долгосрочном влиянии."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Создайте ключевые вопросы, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, взаимосвязи, системы или рассуждение. НЕ упоминайте какие-либо предметно-специфические термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми между всеми дисциплинами и невозможными для ответа путём изучения содержания урока или блока. Сосредоточьтесь только на больших идеях, а не на предметном содержании.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Цели обучения учащихся» для всего этого блока. Каждый пункт списка должен быть чёткой, измеримой целью, которая начинается с измеряемого глагола и заканчивается меткой DOK в скобках",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Перечислите все уникальные образовательные стандарты, используемые где-либо в этом блоке и его уроках. НЕ добавляйте стандарты, которые не встречаются в содержании блока. Каждый стандарт должен включать код стандарта и описание, например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна, чтобы описывать циклические закономерности фаз Луны, затмений и времён года.",
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
      "description": "Список контейнеров уроков для этого блока (только структура). Каждый пункт должен быть непересекающимся и чётко ограниченным, чтобы содержание уроков не повторялось между уроками.",
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
            "description": "2–4 предложения, описывающие объём, фокус и границы урока, чтобы предотвратить пересечение с другими уроками."
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
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Просто вставьте все ключевые вопросы, которые были сгенерированы на уровне блока, в том же порядке.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Список словарных терминов с определениями. (например, 'Солнечная система – Солнце и всё...'). ВКЛЮЧАЙТЕ только термины, которые активно используются в этом конкретном уроке.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Полный раздел «Цели обучения учащихся» в виде обычного текста. Каждый пункт должен быть чёткой, измеримой целью, которая начинается с измеряемого глагола и заканчивается меткой DOK в скобках.",
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
      "description": "Полный раздел «Соответствие стандартам» в виде обычного текста для этого урока. Каждый стандарт должен включать код стандарта и описание, а код и описание должны быть точно такими же, как в Блоке. Например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна, чтобы описывать циклические закономерности фаз Луны, затмений и времён года.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**Say:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**Say:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**Say:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Полный раздел «Оценка предварительных знаний». КРИТИЧНО: Посмотрите на 'lessonNumber' в прикреплённом содержимом урока. ЕСЛИ это Урок 1, заполните этот объект полностью. ЕСЛИ это Урок 2, 3 или любой другой урок, ВЫ ДОЛЖНЫ ВЕРНУТЬ ПУСТОЙ ОБЪЕКТ {} БЕЗ КАКИХ-ЛИБО СВОЙСТВ. Не заполняйте это для любого урока, кроме Урока 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "Что говорит учитель, чтобы представить задание."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Список утверждений для показа на экране или чтения, включающий как верные идеи, так и распространённые заблуждения."
        },
        "SayInstructions": {
          "type": "string",
          "description": "Что говорит учитель, чтобы объяснить учащимся, что делать с утверждениями."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Ожидаемые ответы/пометки учащихся для каждого утверждения."
        },
        "SayConclusion": {
          "type": "string",
          "description": "Что говорит учитель, чтобы подвести итог."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Действие учителя для завершения (например, рисование схемы)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Список альтернативных вариантов для задания."
        }
      },
      "required": [
        "SayIntroduction",
        "StatementsToProject",
        "SayInstructions",
        "ExpectedStudentResponses",
        "SayConclusion",
        "ActionConclusion",
        "AlternateOptions"
      ],
      "additionalProperties": false
    },
    "Objective": {
      "x-format": "### {green}({loc.Objective} {value.Duration})\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Создайте раздел Objective, который ясно формулирует учебные цели учащегося для урока.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Оценка времени (например, '(2-3 min)')"
        },
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "type": "object",
            "x-format": "\n\n**{index}.** {value.Step}\n{value.Bullets}",
            "properties": {
              "Step": {
                "type": "string",
                "description": "Шаг или сценарий учителя."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Необязательный список пунктов для этого шага. Для первого шага включите сюда фактические учебные цели."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Должно включать: 1) Объясните учебные цели, используя прямой сценарий для учителя (например, Say: '...'), и поместите фактические цели в массив Bullets. 2) Попросите учащихся записать цели в свои тетради. 3) Кратко объясните учителю, как связать цели с реальным жизненным опытом учащихся."
        }
      },
      "required": [
        "Duration",
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ContentDeliveryAndInteractiveActivities": {
      "x-format": "### {green}({loc.ContentDeliveryAndInteractiveActivities} {value.Duration})\n\n**1. {loc.Hook}** {value.Hook}\n\n**2. {loc.Vocabulary}**\n\n{value.Vocabulary.Bullets}\n\n{value.Vocabulary.ConclusionSay}\n\n**3. {loc.NewConceptsAndKnowledge}**\n\n{value.NewConceptsAndKnowledge}\n\n### ⚡ {loc.AttentionReset}\n\n**{loc.Purpose}:** {value.AttentionReset.StandardParagraph}\n\n{value.AttentionReset.Directions}\n\n{loc.WhyThisWorks}:\n\n{value.AttentionReset.WhyThisWorks}\n\n### {loc.ContinueInstructionAfterActivity}\n\n{value.ContinueInstruction}\n\n### ⚠️ {loc.AnticipatedMisconceptions}\n\n{value.AnticipatedMisconceptions}\n\n{value.Connect}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
      "type": "object",
      "description": "Блок для подачи содержания.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Оценка времени (например, '(30 min)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Напишите драматический, вызывающий высокий интерес хук, поданный через сценарий учителя. Он должен быть удивительным, вызывать любопытство и быть связанным с основной концепцией."
        },
        "Vocabulary": {
          "type": "object",
          "properties": {
            "Bullets": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Перечислите основные термины словаря. Для определения каждого термина предоставьте сценарий учителя в строго следующем формате: '[Термин] - Say: \"[Определение/Сценарий]\"'. Пример: 'Lever - Say: \"Рычаг — это простая машина...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "Заключительное утверждение 'Say: ' для перехода."
            }
          },
          "required": [
            "Bullets",
            "ConclusionSay"
          ],
          "additionalProperties": false
        },
        "NewConceptsAndKnowledge": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Напишите подробную лекцию учителя со сценариями (Say: “…”). Включите пошагово, что говорит, делает и, возможно, демонстрирует учитель. Разбейте сложные идеи, приведите примеры/аналогии, явно свяжите их с уже имеющимися знаниями."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Вставьте стандартный абзац для сброса внимания точно в таком виде, как он написан: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Должно быть точно: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Предоставьте инструкции для активности, включая сценарий учителя и то, что должны делать учащиеся и учитель."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Объясните в пунктах, почему активность работает для повторного вовлечения, сброса когнитивной фокусировки, закрепления концепций и целенаправленного предварительного ознакомления. Например: 'Standing + movement resets attention.'"
            }
          },
          "required": [
            "StandardParagraph",
            "Directions",
            "WhyThisWorks"
          ],
          "additionalProperties": false
        },
        "ContinueInstruction": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{index}. {value}\n\n",
            "type": "string"
          },
          "description": "Нумерованные шаги для продолжения обучения со сценариями учителя (Say: “…”). Разбейте сложные идеи, приведите примеры/аналогии, чтобы заинтриговать, намекнуть на будущие знания, расширить ключевые идеи."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "Перечислите ожидаемые распространённые заблуждения учащихся, чтобы учитель был готов.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "например, 'Students may think a bigger lever always works better.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Как эффективно реагировать на возможное непонимание учащихся и направлять к точному пониманию."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Connect": {
          "x-format": "### {green}({loc.Connect} {value.Duration})\n\n1. Say: \"{value.Step1Say}\"\n\n2. Say: \"{value.Step2Say}\"\n\n3. Prompt:\n\n{value.Step3Prompts}\n\n4. Whole-group share: Say: \"{value.Step4Say}\"\n\n✅ **{loc.ExpectedStudentResponses}**\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Свяжите с целью. Свяжите с одним из ключевых вопросов.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "например, «(3 мин)»"
            },
            "Step1Say": {
              "type": "string",
              "description": "Сценарий речи учителя, связывающий предыдущее задание с более широкой идеей."
            },
            "Step2Say": {
              "type": "string",
              "description": "Сценарий речи учителя, в котором ученикам предлагается повернуться и обсудить с партнёром."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Конкретные вопросы для задания (например, «Почему шадуф был важен...», «Какие доказательства показывают...»)."
            },
            "Step4Say": {
              "type": "string",
              "description": "Сценарий речи учителя для обсуждения со всем классом (например, «Давайте послушаем несколько идей...»)."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Глубокие ожидаемые ответы учеников, в которых используется рассуждение или доказательства."
            }
          },
          "required": [
            "Duration",
            "Step1Say",
            "Step2Say",
            "Step3Prompts",
            "Step4Say",
            "ExpectedStudentResponses"
          ],
          "additionalProperties": false
        },
        "Differentiation": {
          "x-format": "**🪜 {loc.Differentiation}**\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "type": "object",
          "description": "Дифференцируйте обучение (как преподавать, а не упрощать материалы). Меняйте сложность и глубину, поощряйте активное вовлечение/использование языка. Реалистично для класса.",
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
                  "description": "Для ответов Go Deeper."
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
          "description": "Этот раздел должен включать два типа поддержки: Общая поддержка и Индивидуализированная поддержка. Делайте акцент на доступности, а не на снижении уровня требований.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Неспецифичные для конкретных учеников стратегии, которые улучшают доступ для всех учащихся (например, визуальные материалы, заранее заполненные заметки, цифровой глоссарий, инструкции, разбитые на части). Предоставьте 2–4 пункта списком."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Конкретные приспособления и модификации для названных учеников с официальными планами. Перечислите КАЖДОГО ученика отдельно; НЕ объединяйте учеников в группы. Поддержка для каждого ученика должна быть легко просматриваемым списком.",
              "items": {
                "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                "type": "object",
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Имя и фамилия отдельного ученика, получающего эту поддержку."
                  },
                  "PlanProvided": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Официальный план, предоставленный для этого ученика в запросе. Разбейте план на понятный список. Вы можете перефразировать его для улучшения форматирования, но НЕ опускайте и не добавляйте никакой информации."
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
        "Duration",
        "Hook",
        "Vocabulary",
        "NewConceptsAndKnowledge",
        "AttentionReset",
        "ContinueInstruction",
        "AnticipatedMisconceptions",
        "Connect",
        "Differentiation",
        "AccommodationsAndModifications"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {green}({loc.ReviewAndSpacedRetrieval})\n\n{loc.ReviewAndSpacedRetrievalLabNotes}\n\n{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
      "type": "object",
      "description": "Полный раздел «Повторение и интервальное извлечение».",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Просить учеников вспомнить НОВОЕ, чему они научились СЕГОДНЯ на уроке.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Подсказка учителя, начинающаяся с «Скажите: »."
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
          "description": "Подсказка учителя, связывающая с вопросом модуля.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Подсказка учителя, начинающаяся с «Скажите: »."
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
          "description": "Вспомнить из конкретного предыдущего урока/модуля.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Контекстное предложение, например: «Ранее на этом уроке учащиеся узнали...»"
            },
            "Say": {
              "type": "string",
              "description": "Подсказка для учителя, начинающаяся с «Скажите: »."
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
        "SpacedRetrieval"
      ],
      "additionalProperties": false
    },
    "QAndAAndDiscussion": {
      "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. Say: \"{value.InstructionsForTeachers.Step1_InviteSay}\"\n2. Ask:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n3. Say: \"{value.InstructionsForTeachers.Step3_CaptureSay1}\" Record: {value.InstructionsForTeachers.Step3_CaptureRecord} Say:\n   \"{value.InstructionsForTeachers.Step3_CaptureSay2}\"\n4. Say: \"{value.InstructionsForTeachers.Step4_AnswerSay1}\" {value.InstructionsForTeachers.Step4_AnswerAddress} Say: \"{value.InstructionsForTeachers.Step4_AnswerSay2}\"\n\n{loc.NoteForTeacherQA}",
      "type": "object",
      "description": "Блок для вопросов и ответов и обсуждения.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Оценка времени (например, «(5 мин)»)"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Руководство для учителя по сеансу вопросов и ответов и обсуждения.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "например, «Сейчас у вас есть возможность подумать о том, что мы узнали...»"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3–4 вопроса, которые нужно задать учащимся."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "например, «Если у вас есть вопрос, это значит, что вы глубоко размышляете...»"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "например, «Запишите вопросы учащихся на таблице с заголовком „Вопросы, которые у нас ещё остались“.»"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "например, «Мы будем продолжать добавлять записи в эту таблицу на протяжении всего модуля...»"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "например, «Давайте посмотрим на наши вопросы. На какие из них мы можем ответить, используя то, что мы узнали сегодня?»"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "например, «Ответьте на несколько вопросов, используя ответы учащихся и доказательства.»"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "например, «Некоторые из этих вопросов помогут направлять то, чему мы будем учиться дальше...»"
            }
          },
          "required": [
            "Step1_InviteSay",
            "Step2_AskQuestions",
            "Step3_CaptureSay1",
            "Step3_CaptureRecord",
            "Step3_CaptureSay2",
            "Step4_AnswerSay1",
            "Step4_AnswerAddress",
            "Step4_AnswerSay2"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Duration",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "Conclusion": {
      "x-format": "### {green}({loc.Conclusion} {value.Duration})\n\n{value.BuildCuriosity}",
      "type": "object",
      "description": "Блок для заключения.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Оценка времени (например, «(1 мин)»)"
        },
        "BuildCuriosity": {
          "type": "string"
        }
      },
      "required": [
        "Duration",
        "BuildCuriosity"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {green}({loc.FormativeAssessment})\n\n{items}",
      "type": "array",
      "description": "Извлеките и сгенерируйте РОВНО 4 подсказки для формирующего оценивания, охватывающие DOK 1–4. Для каждой подсказки включите PromptLabel, Question и ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "например, «Подсказка 1 (DOK 1)»"
          },
          "Question": {
            "type": "string",
            "description": "Точный текст вопроса."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1–2 примера ответов, демонстрирующих освоение материала."
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
      "x-format": "### 🖊️ {green}({loc.StudentPractice})\n\n**Teacher Notes:** {value.TeacherNotes}\n\n{value.Tasks}\n\n🔎 **{loc.Reflection}:** {value.Reflection.Prompt}\n\n{value.Reflection.ReflectionOptions}",
      "type": "object",
      "description": "Полный раздел «Практика учащихся» для домашней / внеурочной практики.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Заметки, объясняющие, как задания закрепляют сегодняшний материал и укрепляют долгосрочное запоминание."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Сгенерируйте 4 практических задания, охватывающих уровни DOK 2, 3 и 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "например: «(DOK 2) Нарисуйте шадуф и подпишите...»"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 пункта с критериями успеха."
              }
            },
            "required": [
              "TaskDescription",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          },
          "minItems": 4,
          "maxItems": 4
        },
        "Reflection": {
          "type": "object",
          "description": "Задание на рефлексию для учащихся.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "например: «Напишите 2–3 предложения, отвечая на один из вопросов:»"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3–4 варианта вопросов для рефлексии."
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
        "Tasks",
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
    "Objective",
    "ContentDeliveryAndInteractiveActivities",
    "ReviewAndSpacedRetrieval",
    "QAndAAndDiscussion",
    "Conclusion",
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
