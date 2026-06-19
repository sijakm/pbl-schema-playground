window.prompts_inquiry_ru = {
  STEP0_PROMPT_TEMPLATE: `Создайте ТОЛЬКО структуру единицы INQUIRY (Шаг 0), используя информацию ниже. НЕ создавайте полный план единицы и НЕ пишите полные планы уроков.

Вы ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме: UnitPlanResponse. Не включайте никаких дополнительных ключей. Используйте компактное JSON-форматирование (без лишних пустых строк или пробелов между JSON-свойствами). Без HTML. Без эмодзи. Обычный текст внутри строковых полей.

Предмет единицы: {{$Subject}}
Название единицы: {{$Name}}
Описание/инструкция единицы: {{$UserPrompt}}
Уровень класса: {{$GradeLevel}}
Длительность урока в минутах: {{$ClassDuration}}
Запрошенное количество уроков: {{$NumberOfItems}}
Стандарты, с которыми нужно соотнести (используйте дословно, если они указаны; НЕ добавляйте новые стандарты): {{$Standards}}
Ученики, которым требуется индивидуализированная поддержка (только контекст): {{$LearningPlans}}
Ресурсы/медиа для использования: {{$MediaContext}}
Содержание единицы: {{$AttachedUnit}}
Прикрепленное содержание урока (если есть): {{$AttachedLesson}}

ТРЕБОВАНИЯ К INQUIRY-ОБЗОРУ:
- Это inquiry-first. Уроки ДОЛЖНЫ развиваться по следующей дуге:
  (1) феномен/опыт + наблюдения/вопросы,
  (2) выбор вопросов + планирование исследований,
  (3) сбор доказательств + поиск закономерностей,
  (4) построение модели + ее пересмотр на основе доказательств,
  (5) объяснение/аргументация + коммуникация + перенос.
- Поддерживайте осмысление через открытие: учащиеся строят и пересматривают модели на основе наблюдений и простых данных; делайте акцент на доказательствах, рассуждениях и коммуникации.
- Сохраняйте соответствие ТОЛЬКО предоставленным стандартам. НЕ добавляйте никаких новых стандартов или рамок.
- Культурная релевантность и инклюзивность: включайте краткие контексты или точки зрения, связанные с сообществом, без стереотипов.
- Перекрестное использование навыков и перенос: возвращайтесь к навыкам на протяжении уроков (наблюдение, моделирование, аргументация на основе доказательств, коммуникация).
- Уроки ДОЛЖНЫ не пересекаться и иметь четкие границы.

ТРЕБОВАНИЯ К МАССИВУ LESSONS:
- Массив Lessons ДОЛЖЕН содержать ровно {{$NumberOfItems}} уроков.
- lessonNumber начинается с 1 и строго увеличивается на 1.
- Обеспечьте логическую последовательность от базовых шагов inquiry к более сложному моделированию и объяснению.
- Темп должен соответствовать {{$ClassDuration}}-минутным урокам в {{$GradeLevel}} классе.

ПРАВИЛО ВЫВОДА:
Возвращайте ТОЛЬКО JSON, который соответствует схеме UnitPlanResponse.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока по исследованию (НЕ план раздела, НЕ несколько уроков) на основе информации ниже. ВЫ ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме: InquiryUnitPlanResponse. Не добавляйте никаких лишних ключей. Используйте компактное форматирование JSON (без пустых строк и без пробелов между свойствами JSON). Без HTML. Без эмодзи. Без markdown. Обычный текст внутри строковых полей.

Предмет раздела: {{$Subject}}
Название раздела: {{$Name}}
Описание/инструкция раздела: {{$UserPrompt}}
Класс/уровень: {{$GradeLevel}}
Продолжительность урока в минутах: {{$ClassDuration}}
Стандарты для согласования (используйте дословно, если они есть; НЕ добавляйте новые стандарты): {{$Standards}}
Ученики, которым нужна индивидуализированная поддержка (ДОЛЖНЫ использоваться ТОЛЬКО внутри InvestigationPhase.AccommodationsAndModifications; используйте имена учащихся/планы точно так, как они написаны): {{$LearningPlans}}
Ресурсы/медиа для использования: {{$MediaContext}}
Содержание раздела: {{$AttachedUnit}}

Элементы раздела и урока из Шага 0 (используйте дословно):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (точно в представленном виде; при необходимости используйте дословно): {{$UnitEssentialQuestions}}

Прикреплённое содержание урока (если есть): {{$AttachedLesson}}

ТРЕБОВАНИЯ К ХОДУ УРОКА ПО ИССЛЕДОВАНИЮ:
- Этот урок должен следовать дуге inquiry и соответствовать границам структуры урока: Orientation → Conceptualization → Investigation → Conclusion → Discussion.
- Поддерживайте осмысление через открытие: ученики строят и пересматривают идеи, используя наблюдения и простые данные; делайте акцент на доказательствах, рассуждении и коммуникации.
- Культурная релевантность и инклюзивность: включайте краткие контексты или перспективы, связанные с сообществом, без стереотипов.
- Не вводите крупные новые понятия, относящиеся к другим урокам; оставайтесь в рамках и пределах плана этого урока.
- Согласование только с предоставленными стандартами. Не добавляйте никаких новых стандартов или рамок.
- Действия учителя должны направлять мышление, не давая напрямую научных объяснений.

ПРАВИЛА ДЛЯ КОНКРЕТНЫХ ПОЛЕЙ (соотнесите со схемой):
- AssessPriorKnowledge: ТОЛЬКО если номер урока 1, напишите 150–250 слов и следуйте требуемой структуре, указанной в описании схемы; в противном случае верните "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: включите общие поддержки.
  - IndividualSupport: массив должен содержать ровно указанных учащихся и их планы (те же имена/планы; без лишних учащихся; без пропущенных учащихся).

ПРАВИЛО ВЫВОДА:
Верните ТОЛЬКО JSON, который валиден согласно схеме InquiryUnitPlanResponse.

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
          "description": "Описание модуля как единый связный абзац обычного текста (4–5 полных предложений), написанный естественным голосом учителя, который вы могли бы сказать ученикам напрямую. Без HTML, без эмодзи, без маркированных списков. Текст должен звучать разговорно, но следовать этой структуре (без заголовков): (1) вводное предложение, которое пробуждает любопытство или создаёт неожиданный контраст, (2) предложение «В этом модуле вы будете...» о результатах освоения, (3) предложение «Вы укрепите свои навыки в...» о мышлении/аналитических способностях, (4) предложение «Это связано с...» о применимости в реальной жизни, (5) предложение «Понимание этого важно, потому что...» о более широком значении или долгосрочном влиянии."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Создайте основные вопросы, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. Не упоминайте никакие предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми между всеми дисциплинами и невозможными для ответа только после изучения материала урока или модуля. Сосредоточьтесь только на больших идеях, а не на содержании предмета.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Учебные цели учащихся» для всего этого модуля. Каждый пункт списка должен быть чёткой, измеримой целью, начинающейся с измеримого глагола и заканчивающейся меткой DOK в скобках",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Перечислите все уникальные образовательные стандарты, используемые в любом месте этого модуля и его уроков. Не добавляйте стандарты, которые не встречаются в содержании модуля. Каждый стандарт должен включать код стандарта и описание, например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна, чтобы описать циклические закономерности фаз Луны, затмений и времён года.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Полный раздел «Ключевая лексика» в виде списка строк. Каждая строка должна содержать один термин с определением, разделённым тире/дефисом. Пример: 'Гравитация - Сила, которая притягивает объекты друг к другу'. Все определения должны быть краткими, соответствующими возрасту и напрямую связанными с содержанием урока.",
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
      "description": "Список контейнеров уроков для этого модуля (только структура). Каждый пункт должен быть непересекающимся и чётко ограниченным, чтобы содержание уроков не повторялось между ними.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Порядковый номер урока. Основан на 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Короткое название урока как обычный текст."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 предложения, описывающие объём урока, фокус и границы, чтобы предотвратить пересечение с другими уроками."
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
  "x-format": "{value.AssessPriorKnowledge}\n\n{value.EssentialQuestions}\n\n{value.KeyVocabulary}\n\n{value.StudentLearningObjectives}\n\n{value.StandardsAligned}\n\n{value.OrientationPhase}\n\n{value.ConceptualizationPhase}\n\n{value.InvestigationPhase}\n\n{value.ConclusionPhase}\n\n{value.DiscussionPhase}\n\n{value.ReviewAndSpacedRetrieval}\n\n{value.FormativeAssessment}\n\n{value.StudentPractice}",
  "properties": {
    "AssessPriorKnowledge": {
      "x-format": "### 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Раздел «Оценка предварительных знаний». ТОЛЬКО УРОК 1 должен содержать подробный блок; ВСЕ ДРУГИЕ УРОКИ ДОЛЖНЫ ВОЗВРАЩАТЬ NULL или опускать это поле. Для Урока 1 структура должна включать ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt и AlternateOptions.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Чёткие инструкции и шаблон/структуру для выбранной модальности. Например: 'Скажите: \"Прежде чем мы начнём строить...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Ожидаемые ответы учащихся или распространённые заблуждения для выбранной модальности.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Заключительный вопрос учителя (не включайте префикс 'Скажите:') который подтверждает ход мыслей учащихся и предваряет исследование модуля."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 кратких альтернативных варианта, которые учитель может выбрать.",
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
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Просто вставьте все основные вопросы уровня модуля в том же порядке, если они предоставлены. Если нет, сгенерируйте ровно 3 концептуальных вопроса, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. Не упоминайте никакие предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми между всеми дисциплинами и невозможными для ответа только после изучения материала урока или модуля. Сосредоточьтесь только на больших идеях, а не на содержании предмета.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Выберите дословно ключевую лексику для этого урока из модульной лексики, предоставленной в запросе. Не придумывайте новых слов. Вы должны использовать точную формулировку из Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Выберите дословно конкретные учебные цели для этого урока из модульных целей, предоставленных в запросе. Не придумывайте новых целей. Вы должны использовать точную формулировку из Step 0 UnitDescription.StudentLearningObjectives.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Перечислите только уникальные образовательные стандарты, рассматриваемые в этом конкретном уроке. Каждый стандарт должен включать код стандарта и описание и должен быть точно таким же, как в модуле. Например: 'MS-ESS1-1: Разработайте и используйте модель системы Земля–Солнце–Луна, чтобы описать циклические закономерности фаз Луны, затмений и времён года.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "OrientationPhase": {
      "x-format": "### {green}({loc.OrientationPhase})\n\n{loc.OrientationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "Engage": {
              "type": "object",
              "x-format": "**{loc.EngageTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте сценарий для введения феномена. Убедитесь, что он вызывает любопытство, не давая научных объяснений."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 конкретных педагогических приёма, которые направляют молчаливое наблюдение и обмен мнениями в парах. Включите сценарии (не включайте префикс 'Скажите:', например, 'Потратьте 30 секунд на молчаливое рассматривание...'). Сосредоточьтесь на фиксации и организации наблюдений учащихся в значимые категории и поощрении различных точек зрения.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Сгенерируйте 2–3 конкретных подсказки в виде одной строки, чтобы помочь учащимся выявлять детали, замечать закономерности и формулировать первоначальные вопросы. Поощряйте их объяснять, почему определённые детали кажутся важными, и развивать или противопоставлять наблюдения друг друга."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "Connect": {
              "type": "object",
              "x-format": "**{loc.ConnectTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте конкретный сценарий учителя (не включайте префикс 'Скажите:') который помогает учащимся превратить свои наблюдения феномена в исследовательские вопросы или проблемы, группируя идеи по ключевым темам."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Предложите 2–3 конкретных подсказки, чтобы помочь учащимся связать наблюдения с лежащими в основе проблемами, обосновывать мышление доказательствами и определять, какие идеи наиболее стоит исследовать."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Предложите 2–3 приёма, чтобы помочь учащимся уточнять и группировать свои идеи, одновременно побуждая их объяснять свои рассуждения. Включите указания записывать и выделять повторяющиеся вопросы, не отвечая на них.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Activate": {
              "type": "object",
              "x-format": "**{loc.ActivateTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Разработайте инструкцию для учителя (не включайте префикс 'Скажите:') для организации обсуждения в парах или группах, которое порождает конкретные идеи, объяснения или решения с использованием доступной информации и ограничений. Поощряйте сравнение и рассуждение."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Перечислите 2–3 подсказки, чтобы побудить учащихся предлагать идеи, объяснять свои рассуждения, рассматривать альтернативные подходы и оценивать, какие части их мышления являются самыми сильными или наиболее неопределёнными."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Опишите 2–3 приёма обхода группы, чтобы выслушивать рассуждения, уточнять/требовать обоснования и подчёркивать различные подходы, не оценивая, какой из них правильный.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Probe": {
              "type": "object",
              "x-format": "**{loc.ProbeTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\n\n{value.Closing}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте сценарий, который подтолкнёт учащихся уточнять и проверять свои идеи, исследуя допущения, рассматривая разные условия и определяя ключевые факторы этого урока."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Предложите 2–3 конкретных подсказки, чтобы проверять идеи на новых условиях, выявлять слабые места и пересматривать мышление на основе доказательств для феноменов этого урока."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Предоставьте 2–3 конкретных приёма, чтобы побудить учащихся пересмотреть и изменить свои первоначальные идеи на основе доказательств и обосновать изменения в своих рассуждениях.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Closing": {
                  "type": "string",
                  "description": "Заключительная инструкция, побуждающая учащихся проверить и пересмотреть свои идеи, учесть долгосрочные эффекты и изменяющиеся условия, а также использовать доказательства из наблюдений, чтобы укрепить или поставить под сомнение своё мышление."
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves",
                "Closing"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Engage",
            "Connect",
            "Activate",
            "Probe"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ConceptualizationPhase": {
      "x-format": "### {green}({loc.ConceptualizationPhase})\n\n{loc.ConceptualizationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "GuideQuestionGeneration": {
              "type": "object",
              "x-format": "**{loc.GuideQuestionGenerationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте сценарий для учителя (не включайте префикс 'Скажите:') чтобы представить сессию генерирования вопросов. Сосредоточьтесь на переходе от индивидуального обдумывания к обмену в парах, чтобы расширить идеи."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 конкретных приёма, чтобы поддержать формулирование учащимися вопросов. Включите время на обдумывание, публичную фиксацию всех вопросов и поощрение уточнения, объединения или расширения вопросов без оценивания.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Сгенерируйте 2–3 конкретные подсказки, которые помогут учащимся выявить любопытство, определить, что они хотят понять, и сосредоточиться на ключевых аспектах системы или конструкции."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "IdentifyResearchQuestion": {
              "type": "object",
              "x-format": "**{loc.IdentifyResearchQuestionTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте сценарий (не включайте префикс 'Скажите:') чтобы направить учащихся в выборе вопроса, который поможет им узнать больше всего с помощью проверяемой модели."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Предложите 2–3 приёма, чтобы направлять учащихся в сортировке вопросов по темам и сравнении идей на основе возможности проверки. Включите приёмы, помогающие уточнять широкие вопросы до чётких исследований путём определения переменных.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Сгенерируйте 2–3 подсказки, которые помогут учащимся оценивать вопросы по проверяемости, ясности, фокусировке на переменных и потенциальной способности генерировать полезные доказательства."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CreateAnActionPlan": {
              "type": "object",
              "x-format": "**{loc.CreateAnActionPlanTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте сценарий (не включайте префикс «Say:») для того, чтобы побудить учащихся определить, что они будут наблюдать, что они будут изменять и что они будут собирать в качестве доказательств."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Опишите 2–3 педагогических приёма, чтобы поддержать учащихся в разработке плана исследования и определении переменных. Включите приёмы, побуждающие учащихся делать планы конкретными и проверяемыми, и убедитесь, что у них есть чёткий способ определить успешность.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Предоставьте 2–3 конкретные подсказки, чтобы помочь учащимся уточнить, что они будут менять, что оставят без изменений и как будут сравнивать результаты."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "GuideQuestionGeneration",
            "IdentifyResearchQuestion",
            "CreateAnActionPlan"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "InvestigationPhase": {
      "x-format": "### {green}({loc.InvestigationPhase})\n\n{loc.InvestigationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}\n\n{value.QuickCheck}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные материалы, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "LaunchInvestigation": {
              "type": "object",
              "x-format": "**{loc.LaunchTheInvestigationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте инструкции для учителя, чтобы ввести озадачивающую ситуацию или модель. Сначала предоставьте действие в квадратных скобках, например [Покажите модель, ситуацию, демонстрацию или короткую историю, которая содержит недостаток, неэффективность или неожиданный результат, чтобы вызвать любопытство], затем приведите разговорный сценарий (не включайте префикс «Say:»)."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 приёма, чтобы направить запуск урока. Чётко укажите учебные действия, не добавляя перед ними префикс «Say:». Включите предоставление учащимся времени на наблюдение перед действием, поощрение множественных интерпретаций и подчёркивание того, что может существовать несколько верных идей.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Сгенерируйте 2–3 конкретные подсказки, чтобы помочь учащимся заметить важные или неожиданные особенности, выдвинуть возможные объяснения и обосновать свои мысли доказательствами."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CollaborationExpectations": {
              "type": "object",
              "x-format": "**{loc.CollaborationExpectationsTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Создайте устный сценарий (не включайте префикс «Say:»), чтобы представить задание как взаимозависимое и подчеркнуть общую ответственность. Включите инструкции для учащихся использовать начала фраз (например, «Я думаю... потому что...») и структуры участия, такие как жетоны для высказываний."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Перечислите 3–5 конкретных приёмов или действий учащихся, за которыми следует наблюдать во время групповой работы (например, выявление закономерностей, запись в общих таблицах данных, сравнение интерпретаций). Не добавляйте перед этими действиями префикс «Say:». Убедитесь, что они ориентированы на участие всех учащихся в наблюдении и уточнении идей.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Предоставьте 2–3 подсказки, чтобы побудить учащихся делиться наблюдениями, сравнивать интерпретации, обосновывать утверждения доказательствами и совместно пересматривать идеи."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CirculationPrompts": {
              "type": "object",
              "x-format": "**{loc.CirculationPromptsTitle}**\n\n**{loc.ConceptualPromptsTitle}**\n\n{value.Conceptual}\n\n**{loc.ReasoningPromptsTitle}**\n\n{value.Reasoning}\n\n**{loc.CollaborationPromptsTitle}**\n\n{value.Collaboration}",
              "description": "Конкретные подсказки, которые будет использовать учитель, перемещаясь между группами.",
              "properties": {
                "Conceptual": {
                  "type": "array",
                  "description": "2–3 подсказки, сосредоточенные на ключевых научных или учебных понятиях (например, «Какие доказательства показывают, что это работает?»).",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Reasoning": {
                  "type": "array",
                  "description": "2–3 подсказки, чтобы побуждать к обоснованию и логике (например, «Как этот пробный вариант меняет ваше мышление?»).",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Collaboration": {
                  "type": "array",
                  "description": "2–3 подсказки, чтобы убедиться, что включены все голоса (например, «Кто ещё не вносил вклад?»).",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Conceptual",
                "Reasoning",
                "Collaboration"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "LaunchInvestigation",
            "CollaborationExpectations",
            "CirculationPrompts"
          ],
          "additionalProperties": false
        },
        "AnticipatedMisconceptions": {
          "type": "array",
          "x-format": "### ⚠️ {loc.AnticipatedMisconceptions}{items}",
          "description": "Сгенерируйте 2–3 распространённых заблуждения учащихся, которые, вероятно, возникнут во время этого урока. Каждый пункт должен быть сосредоточен на конкретном неверном понимании и на сценарии ответа учителя.",
          "items": {
            "type": "object",
            "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "Опишите заблуждение в 1 предложении, начиная с «Учащиеся могут думать...». НЕ используйте выделение жирным или сильные теги."
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Чёткий сценарий ответа для учителя (начинающийся с «Teacher Response: »), который моделирует, как реагировать в моменте с конкретной подсказкой (не включайте префикс «Say:»). НЕ используйте выделение жирным или сильные теги."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Differentiation": {
          "type": "object",
          "x-format": "### 🪜 {loc.Differentiation}\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "properties": {
            "LanguageLearners": {
              "type": "object",
              "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 поддерживающих средства, специфичных для урока (визуалы, банки слов, жесты), чтобы помочь изучающим язык получать доступ к идеям и выражать их.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "SentenceStarters": {
                  "type": "array",
                  "description": "Сгенерируйте 3–4 начала фраз, которые помогают учащимся описывать, объяснять и передавать свои мысли для этого конкретного урока.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Strategies",
                "SentenceStarters"
              ],
              "additionalProperties": false
            },
            "AdditionalScaffolding": {
              "type": "object",
              "x-format": "**{loc.StudentsInNeedOfAdditionalScaffolding}:**\n\n{value.Strategies}\n\nOffer a step-by-step checklist to guide the investigation:\n\n{value.Checklist}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 пошаговые поддержки (структурированные инструменты, пример-образец, think-aloud) и точные указания, чтобы помочь учащимся выполнить задание.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Checklist": {
                  "type": "array",
                  "description": "Сгенерируйте 3–4 вопроса-чеклиста, чтобы помочь учащимся осмыслить своё обучение во время исследования.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Strategies",
                "Checklist"
              ],
              "additionalProperties": false
            },
            "GoDeeper": {
              "type": "object",
              "x-format": "**{loc.GoDeeper}:**\n\n{value.Strategies}\n\n{loc.AdvancedThinkingQuestionTitle}:\n\n- {loc.Say}: \"{value.AdvancedQuestion}\"\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Сгенерируйте 2–3 расширения, которые повышают сложность (конкретные вызовы, выявление закономерностей), чтобы помочь учащимся углубить или улучшить своё мышление, используя доказательства.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdvancedQuestion": {
                  "type": "string",
                  "description": "Сгенерируйте один сложный вопрос/подсказку (не включайте префикс «Say:») для более глубокого концептуального понимания."
                },
                "ExpectedResponses": {
                  "type": "array",
                  "description": "Сгенерируйте 3–4 конкретных примера высококачественных ответов учащихся на продвинутый вопрос.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Strategies",
                "AdvancedQuestion",
                "ExpectedResponses"
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
          "x-format": "### 🤝 {loc.AccommodationsAndModifications}\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
          "type": "object",
          "description": "Этот раздел должен включать два типа поддержки: General Supports и Individualized Supports. Сосредоточьтесь на доступе, а не на снижении сложности.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Нестуденто-специфические стратегии, которые улучшают доступ для всех учащихся (например, визуальные материалы, предварительно заполненные заметки, цифровой глоссарий, инструкции, разбитые на части). Предоставьте 2–4 пункта списка."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Специальные приспособления и модификации для конкретно названных учащихся с официальными планами. Перечислите КАЖДОГО учащегося отдельно; не объединяйте учащихся в группы. Поддержка для каждого учащегося должна быть в виде списка, который легко просмотреть.",
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
                    "description": "Официальный план, предоставленный для этого учащегося в подсказке. Преобразуйте план в чёткий список. Вы можете перефразировать его для улучшения форматирования, но не опускайте и не добавляйте никакой информации."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Конкретные инструменты/начало фраз/визуальные материалы/органайзеры для этого задания."
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
        },
        "QuickCheck": {
          "type": "object",
          "x-format": "### ✔ {loc.QuickCheck}\n\n{value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Сгенерируйте один конкретный вопрос (не включайте префикс «Say:») для проверки понимания учащихся во время или в конце исследования."
            },
            "ExpectedResponses": {
              "type": "array",
              "description": "Сгенерируйте 3–4 ожидаемых ответа учащихся, которые показывают освоение концепции урока.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Question",
            "ExpectedResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
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
      "x-format": "### {green}({loc.ConclusionPhase})\n\n{loc.ConclusionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные материалы, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}\n\n{value.WritingPrompt}\n\n{value.CollaborationInstruction}\n\n*{value.Guardrail}*",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Утверждение (не включайте префикс «Say:»), чтобы вернуть учащихся к исследовательскому вопросу и обозначить возникающие идеи о том, как работает конструкция."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2–3 педагогических приёма, чтобы дать учащимся время просмотреть данные, выявить закономерности и сравнить результаты через обсуждение.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3–4 конкретных вопроса, чтобы побудить учащихся объяснять закономерности, обосновывать решения доказательствами и описывать причинно-следственные связи.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "WritingPrompt": {
              "type": "string",
              "description": "Утверждение (не включайте префикс «Say:»), описывающее, что должно включать их письменное объяснение (содержательные компоненты), и напоминание использовать данные как доказательства."
            },
            "CollaborationInstruction": {
              "type": "string",
              "description": "Инструкция для учащихся писать самостоятельно, а затем делиться с партнёром или группой, чтобы уточнить свои рассуждения."
            },
            "Guardrail": {
              "type": "string",
              "description": "Твёрдое напоминание о том, что учитель НЕ должен объяснять научное явление, а вместо этого должен побуждать учащихся указывать на данные."
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions",
            "WritingPrompt",
            "CollaborationInstruction",
            "Guardrail"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "3–4 ответа, которые напрямую отвечают на исследовательский вопрос, используя доказательства и причинно-следственные рассуждения (например, «когда мы изменили ___, ___ произошло»).",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "DiscussionPhase": {
      "x-format": "### {green}({loc.DiscussionPhase})\n\n{loc.DiscussionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n**🌍 {loc.TranscendentThinking}:**\n\n{value.TranscendentThinking}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Список необходимых материалов (например, наглядные пособия, маркеры и т. д.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "**{loc.Say}:** {value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Утверждение (НЕ включайте префикс «Say:»), чтобы побудить учащихся подумать о более широких последствиях своих доказательств за пределами класса."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2–3 педагогических приема, чтобы побудить учащихся обсуждать в парах/группах и приводить собственные примеры реального влияния.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3–4 конкретных вопроса, чтобы связать результаты исследования с повседневной жизнью, проблемами сообщества или перепроектированием систем.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions"
          ],
          "additionalProperties": false
        },
        "TranscendentThinking": {
          "type": "object",
          "x-format": "{value.Question}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Сгенерируйте 1 вопрос на трансцендентное мышление, который требует от учащихся применять знания за пределами самих себя к реальным контекстам (сообщества, глобальные вызовы). Сосредоточьтесь на том, почему обучение важно в масштабах (безопасность, устойчивость, инновации и т. д.). Избегайте фокуса только на личной жизни или школе."
            }
          },
          "required": [
            "Question"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "4–5 ответов, иллюстрирующих, как учащиеся могут применять свое понимание в подлинных, реальных контекстах или в ориентированном на будущее решении проблем.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "TranscendentThinking",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Полный раздел «Повторение и интервальное извлечение». Это 5-минутное задание должно включать: 1. Инструкции для учителя, содержащие: - побуждение к активному вспоминанию через обмен в парах/группах - ожидаемые ответы учащихся (2–3 примера в маркированном списке) 2. Связь с ключевым вопросом 3. Раздел трансцендентного мышления 4. Компонент интервального извлечения, содержащий: - четкую ссылку на конкретный предыдущий урок - вопрос, связывающий прошлые и текущие концепции - подробные критерии успеха / ожидаемые ответы Все разделы должны содержать прямые указания для учителя без префикса «Say:» и четко обозначенные «Ожидаемые ответы учащихся» с 2–3 примерами ответов.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Заметки для учителя, объясняющие, как эта стратегия повторения укрепляет запоминание через активное воспроизведение и связывает исследование с основными научными идеями."
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
          "description": "Пошаговое руководство для учителя по 5-минутному повторению и сеансу интервального извлечения.",
          "properties": {
            "ActiveRecall": {
              "type": "object",
              "x-format": "### 🔁 {loc.ActiveRecall}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Побудите учащихся извлечь ключевые знания из сегодняшнего урока, используя только доказательства из исследования.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Конкретная реплика учителя (НЕ включайте префикс «Say:»), которая побуждает учащихся поразмышлять о сегодняшнем исследовании и о том, что оно показало о системе."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "3–4 примера высококачественных ответов учащихся, демонстрирующих ясное использование доказательств.",
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
            "EssentialQuestionConnection": {
              "type": "object",
              "x-format": "### 💭 {loc.EssentialQuestionConnection}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Помогите учащимся связать сегодняшние конкретные доказательства с более широкими ключевыми вопросами модуля.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Реплика учителя (НЕ включайте префикс «Say:»), которая связывает сегодняшние выводы с одним из ключевых вопросов модуля."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2–3 примера того, как учащиеся обосновывают связь с помощью доказательств.",
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
            "SpacedRetrieval": {
              "type": "object",
              "x-format": "### ⏳ {loc.SpacedRetrieval}\n\n**{loc.Say}:** {value.TeacherSay}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Вернитесь к концепции из предыдущего модуля или урока, чтобы укрепить накопительное запоминание.",
              "properties": {
                "TeacherSay": {
                  "type": "string",
                  "description": "Реплика учителя (НЕ включайте префикс «Say:»), которая явно связывает концепцию из предыдущего урока с сегодняшней работой. В тексте обязательно должна быть метассылка (например, «(Взято из Модуля 1, Урока 2.)»)."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "1–2 примера высококачественных ответов учащихся, демонстрирующих чёткое воспроизведение доказательств из предыдущего обучения.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "TeacherSay",
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
        }
      },
      "required": [
        "TeacherNotes",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {loc.FormativeAssessment}\n\n{items}",
      "type": "array",
      "description": "Ровно 4 формирующих оценочных задания, по одному для каждого уровня DOK.",
      "items": {
        "x-format": "\n\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "например, «Задание 1 (DOK 1)»"
          },
          "Question": {
            "type": "string",
            "description": "Точный текст вопроса, например, «Почему планеты остаются на орбите, а не улетают в космос?»"
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
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
      "x-format": "### 🖋️ {loc.StudentPractice}\n\n**{loc.TeacherNotes}:** {loc.StudentPracticeNotes}\n\n{value.Tasks}\n\n**🔎 {loc.Reflection}:**\n\n{value.Reflection}",
      "type": "object",
      "description": "Полный раздел «Практика учащихся» для домашней / внеурочной практики.",
      "properties": {
        "Tasks": {
          "type": "array",
          "description": "Сгенерируйте 3 задания, охватывающих уровни DOK 2 и 3.",
          "items": {
            "type": "object",
            "x-format": "\n\n**{value.TaskTitle}**\n\n{value.Instruction}\n\n{value.SuccessCriteria}",
            "properties": {
              "TaskTitle": {
                "type": "string",
                "description": "например, «1. (DOK 2)»"
              },
              "Instruction": {
                "type": "string",
                "description": "Четкие пошаговые инструкции для учащихся к заданию."
              },
              "SuccessCriteria": {
                "type": "array",
                "description": "4–5 конкретных, основанных на доказательствах пунктов в маркированном списке, показывающих, как выглядит освоение этого задания. КРИТИЧНО: Каждый критерий ДОЛЖЕН начинаться с глагола действия (например, «Описывает», «Объясняет», «Использует»).",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              }
            },
            "required": [
              "TaskTitle",
              "Instruction",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          }
        },
        "Reflection": {
          "type": "object",
          "description": "Закончите рефлексией по саморегуляции или трансцендентному мышлению.",
          "properties": {
            "Instruction": {
              "type": "string",
              "description": "Инструкция для раздела рефлексии (например, «Напишите 2–3 предложения, отвечая на один из вопросов:»)."
            },
            "Prompts": {
              "type": "array",
              "description": "4–5 конкретных вопросов для рефлексии, связывающих сегодняшнее исследование с реальной жизнью, будущими инструментами или личным обучением.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Instruction",
            "Prompts"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Tasks",
        "Reflection"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "AssessPriorKnowledge",
    "EssentialQuestions",
    "KeyVocabulary",
    "StudentLearningObjectives",
    "StandardsAligned",
    "OrientationPhase",
    "ConceptualizationPhase",
    "InvestigationPhase",
    "ConclusionPhase",
    "DiscussionPhase",
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
},
};
