window.prompts_pbl_ru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план модуля и уроки на основе проектного обучения, используя информацию ниже:  
Предмет модуля:
{{$Subject}}
Название модуля:
{{$Name}}
Описание/инструкция к модулю:
{{$UserPrompt}}
Уровень класса:
{{$GradeLevel}}
Сколько дней будет длиться проект
{{$NumberOfDays}}
Местоположение:
{{$Location}}
Ресурсы/медиа для использования:
{{$MediaContext}}, 
Содержание модуля: 
{{$AttachedUnit}} 
Индивидуальные планы обучения учащихся:
{{$LearningPlans}}
Стандарты для согласования:
{{$Standards}}
Ваша задача — разработать подробный модуль на основе проектного обучения, используя принципы когнитивной науки. Ваш ответ ДОЛЖЕН строго следовать точному порядку разделов, заголовкам и правилам содержания, приведённым ниже. Если какой-либо раздел отсутствует или расположен не по порядку, сгенерируйте ответ заново, пока все требования не будут выполнены. 
Глобальные правила оформления ответа (применяются ко всему): Следуйте точному порядку разделов и заголовкам, указанным ниже. Не добавляйте дополнительных разделов и не переименовывайте заголовки. Реальные проблемы должны быть актуальны для учащихся этого уровня класса. Избегайте тем, которые могут быть чувствительными с точки зрения возрастной уместности, а также чувствительных тем, таких как бедность, жилищная нестабильность, раса и т. д., или спорных тем, таких как эволюция. Включите в дизайн проекта модуля следующие компоненты.  
Культурная значимость и инклюзивность: включайте несколько точек зрения и учитывайте последствия для всех участников. Содержание должно быть связано с учащимися из разных слоёв общества и сообществ, чтобы создавать культурно значимые и культурно отзывчивые уроки. Избегайте стереотипов. 
ВАЖНО: ответ должен быть на {{$ResponseLanguage}}

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  STEP0_SCHEMA: {
  "title": "PBLUnitPlanResponse",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "UnitPlan"
  ],
  "properties": {
    "UnitPlan": {
      "type": "object",
      "description": "Предоставьте полный план модуля проектного обучения (PBL). НЕ добавляйте лишних ключей. Заполните каждое обязательное поле. Должно работать для ЛЮБОГО предмета. Локализуйте заинтересованные стороны/аудиторию/ресурсы под указанный почтовый индекс/местоположение, не выдумывая точные адреса/номера телефонов.",
      "additionalProperties": false,
      "required": [
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
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n**{loc.Purpose}:** {loc.PBLAssessPriorKnowledgePurposeText}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Раздел «Оценка предыдущих знаний». 1. Убедитесь, что используются запросы DOK 1-3. 2. Включите навыки-предпосылки, необходимые для целей обучения учащегося. 3. Выберите один формат из этого списка и полностью его разработайте: опрос, K-W-L, визуальные материалы, концептуальные карты, рефлексивное письмо, антиципационные таблицы, оценки словарного запаса. 4. Начальный инструктаж учителя со строкой 'Say:'. 5. Чёткие инструкции и шаблон/структура для выбранного формата. 6. Раздел 'Ожидаемые ответы учащихся'. 7. Завершающий инструктаж учителя с пометкой 'Say:'. 8. После полного развития одного формата предложите 2 кратких альтернативных варианта.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Чёткие инструкции и шаблон/структура для выбранного формата. Например: 'Say: \"Before we begin...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Предполагаемые ответы или распространённые заблуждения для выбранного формата. ВАЖНО: не включайте маркеры, тире или цифры в начале строк.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Завершающая реплика учителя с пометкой 'Say:', которая подтверждает ход мыслей учащихся и предваряет исследование модуля."
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
        "UnitOverview": {
          "type": "object",
          "x-format": "### {green}({loc.UnitTask})\n\n**{loc.PurposeLabel}** {loc.UnitTaskPurposeValue}\n\n**{loc.Title}: {value.TaskStatementTitle}**\n\n{value.LetterGreeting}\n\n{value.LetterBody}\n\n{value.LetterSignOff}\n\n{value.LetterSender}\n\n**{loc.Mission}:** {value.Mission}\n\n**{loc.ProjectContextAndStakeholders}:** {value.ProjectContextAndStakeholders}\n\n### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n{value.DrivingQuestion}\n\n### {green}({loc.TheDeliverable})\n\n{value.FinalDeliverableRequirements}\n\n{value.ClosingCallToAction}",
          "additionalProperties": false,
          "required": [
            "TaskStatementTitle",
            "LetterGreeting",
            "LetterBody",
            "LetterSignOff",
            "LetterSender",
            "DrivingQuestion",
            "Mission",
            "ProjectContextAndStakeholders",
            "FinalDeliverableRequirements",
            "ClosingCallToAction"
          ],
          "properties": {
            "TaskStatementTitle": {
              "type": "string",
              "description": "Название приветственного сообщения для учащихся (например, Message from the Coconut Creek STEM Innovation Team)."
            },
            "LetterGreeting": {
              "type": "string",
              "description": "Приветствие в начале приветственного сообщения для учащихся (например, 'Hello engineers-in-training,')."
            },
            "LetterBody": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              },
              "description": "Основные абзацы приветственного сообщения для учащихся (3–5 абзацев), написанные так, будто это достоверная местная организация или человек. Должна быть чёткая связь с проблемой, направляющим вопросом, требованиями к итоговому продукту и вдохновляющим призывом к действию. Срочно, значимо, аутентично. НЕ включайте здесь заголовок, приветствие, прощальную формулу (например, 'Sincerely,') или имя отправителя. Только основной текст абзацев."
            },
            "LetterSignOff": {
              "type": "string",
              "description": "Прощальная формула для сообщения (например, 'Sincerely,'). Укажите только саму формулу прощания, больше ничего."
            },
            "LetterSender": {
              "type": "string",
              "description": "Имя достоверной местной организации или человека, отправляющего сообщение (например, 'Coconut Creek STEM Innovation Team'). НЕ включайте здесь прощальную формулу (например, 'Sincerely')."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "Один сильный открытый направляющий вопрос, основанный на местоположении и потребности заинтересованной стороны. Этот вопрос также должен быть вплетён в текст письма. ДОЛЖЕН использоваться дословно в FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Абзац, начинающийся с 'Your task is to...', описывающий, что учащиеся будут создавать/делать и почему это важно для сообщества/аудитории."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Краткий рассказ: кто затронут, почему это важно сейчас на местном уровне и каких заинтересованных сторон/аудиторий это касается."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 5,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "description": "Для учащихся: опишите конечный продукт, который они создадут, и подлинную аудиторию, для которой он предназначен. Форматируйте каждый пункт с жирным заголовком (например, **Summary:** ...). НЕ используйте нумерацию (например, 1., 2.) или маркеры в начале строк; начинайте сразу с жирного заголовка. Должно обязательно включать как минимум краткое резюме, затем четыре компонента: (1) Concept & Purpose Plan — объяснение идеи через визуальное или письменное представление и того, почему это важно для сообщества или контекста; (2) Evidence-Based Justification — анализ как минимум двух релевантных факторов и объяснение выбора с использованием доказательств из исследований, данных, экспериментов или наблюдений; (3) Model or Representation — описание типа созданной модели, того, что она представляет, как она функционирует и как она раскрывает силу, устойчивость, эффективность или систему, стоящую за идеей; и (4) The Verdict — заключительный, подкреплённый доказательствами аргумент, объясняющий, почему решение эффективно, осуществимо или значимо, подытоживающий рассуждение, доказательства и модель и передающий ценность разработки для подлинной аудитории. Ваше итоговое утверждение должно показать, что вы можете применять предметные знания, использовать доказательства, моделировать сложные идеи и объяснять последствия для реального мира."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Вдохновляющее завершение: сообщество/аудитория рассчитывает на творческих мыслителей, которые смогут превратить доказательства в действия. Подчеркните, что древние идеи могут вдохновлять современные решения."
            }
          }
        },
        "DesiredOutcomes": {
          "type": "object",
          "x-format": "### 📏{green}({loc.StandardsAligned})\n\n{value.StandardsAligned}\n\n### 💭{green}({loc.BigIdeasAndEssentialQuestionsAmp})\n\n**{loc.Purpose}:** {loc.BigIdeasPurpose}\n\n{value.BigIdeasAndEssentialQuestions}\n\n### 🎯{green}({loc.LearningObjectives})\n\n{value.LearningObjectives}",
          "additionalProperties": false,
          "required": [
            "StandardsAligned",
            "BigIdeasAndEssentialQuestions",
            "LearningObjectives"
          ],
          "properties": {
            "StandardsAligned": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 1,
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Стандарты, указанные дословно, если они предоставлены; формат: 'CODE: description'. Не добавляйте маркеры в начале строк."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 4,
              "description": "Сгенерируйте 3–4 пары «Большая идея и ключевой вопрос», которые задают устойчивые, переносимые концепции, лежащие в основе всего модуля, направляют исследование и разработку оценивания и обеспечивают общую концептуальную рамку, связывающую все задания, навыки и виды деятельности в осмысленное понимание.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{loc.BigIdeaLabel}** {value.BigIdea}\n\n- {loc.EssentialQuestionLabel} {value.EssentialQuestion}",
                "additionalProperties": false,
                "required": [
                  "BigIdea",
                  "EssentialQuestion"
                ],
                "properties": {
                  "BigIdea": {
                    "type": "string",
                    "description": "Широкое, концептуальное утверждение об устойчивом понимании, которое объясняет фундаментальный принцип, лежащий в основе модуля, связывает все задания и оценивания, поддерживает переносимое обучение за пределы конкретного контекста и отражает ключевое предметное мышление, а не изолированные факты."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Создавайте ключевые вопросы, которые фокусируются только на широких, универсальных концепциях, таких как изменение, доказательства, закономерности, отношения, системы или рассуждение. НЕ упоминайте какие-либо предметные термины, процессы, лексику или примеры. Вопросы должны быть открытыми, переносимыми в любые дисциплины и невозможными для ответа после изучения содержания урока или модуля. Сосредоточьтесь только на больших идеях, а не на содержании предмета."
                  }
                }
              }
            },
            "LearningObjectives": {
              "type": "object",
              "x-format": "🎯**{loc.StudentsWillUnderstandThatLabel}**\n\n{value.StudentsWillUnderstandThat}\n\n🎯**{loc.StudentsWillKnowThatLabel}**\n\n{value.StudentsWillKnowThat}\n\n🎯**{loc.StudentsWillBeAbleToLabel}**\n\n{value.StudentsWillBeAbleTo}",
              "additionalProperties": false,
              "required": [
                "StudentsWillUnderstandThat",
                "StudentsWillKnowThat",
                "StudentsWillBeAbleTo"
              ],
              "properties": {
                "StudentsWillUnderstandThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Каждая цель должна заканчиваться на (DOK X) и представлять Big Ideas или Enduring Understandings, генерируя 3–5 концептуальных, долгосрочных утверждений, которые объясняют, почему обучение важно за пределами модуля, подчеркивают переносимые закономерности, отношения или принципы в разных контекстах и объясняют, как или почему что-то работает, а не просто что это такое. Пишите цели как прямое продолжение фразы 'Students will understand that...'. Не повторяйте фразу 'Students will understand that' и не начинайте с глаголов вроде 'Explain that' или 'Describe that' (например, просто напишите 'engineering designs improve when...'). НЕ включайте никакой нумерации, маркированных списков или тире в начале ваших строк."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Каждая цель должна заканчиваться на (DOK X) и представлять Facts or Core Content Knowledge, генерируя 3–5 предметно-специфических фактов, терминов или базовых утверждений знаний, которые определяют важную информацию, которую учащиеся должны помнить, остаются конкретными и фактическими, а не концептуальными, поддерживают стандарты модуля и итоговые задания, используют четкую академическую лексику, соответствующую предмету, и включают соответствующую метку DOK, обычно на уровне 1 или 2. Пишите цели как прямое продолжение фразы 'Students will know that...'. Не повторяйте фразу 'Students will know that' и не начинайте с глаголов вроде 'Identify that' или 'Define' (например, просто напишите 'a lever has an effort arm...'). НЕ включайте никакой нумерации, маркированных списков или тире в начале ваших строк."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Каждая цель должна заканчиваться на (DOK X) и представлять Skills or Practices, соответствующие дисциплине, генерируя 4–7 утверждений, основанных на навыках, которые описывают, что будут делать учащиеся; согласуйте их с дисциплинарно-специфическими практиками; напрямую связывайте их с итоговым проектным продуктом или заданием на выполнение; сохраняйте измеримость и наблюдаемость; и включайте соответствующий уровень DOK между 2 и 4. Пишите цели как прямое продолжение фразы 'Students will be able to...'. Начинайте непосредственно с измеримого глагола действия (например, analyze, compare, design, model, solve). Не повторяйте префикс 'Students will be able to'. НЕ включайте никакой нумерации, маркированных списков или тире в начале ваших строк."
                }
              }
            }
          }
        },
        "FramingTheLearning": {
          "type": "object",
          "x-format": "### {green}({loc.DrivingQuestion})\n\n**{loc.PurposeLabel}** {loc.DrivingQuestionPurposeValue}\n\n**{loc.Question}:** {value.DrivingQuestion}\n\n### {green}({loc.Problem})\n\n**{loc.PurposeLabel}** {loc.ProblemPurposeValue}\n\n{value.ProblemDescription}\n### {green}({loc.Project})\n\n**{loc.PurposeLabel}** {loc.ProjectPurposeValue}\n\n{value.ProjectDescription}\n### {green}({loc.Place})\n\n**{loc.PurposeLabel}** {loc.PlacePurposeValue}{value.Sites}\n\n### 🔤 {green}({loc.KeyVocabulary})\n\n{value.KeyVocabulary}",
          "additionalProperties": false,
          "required": [
            "DrivingQuestion",
            "ProblemDescription",
            "ProjectDescription",
            "Sites",
            "KeyVocabulary"
          ],
          "properties": {
            "DrivingQuestion": {
              "type": "string",
              "description": "ДОЛЖНО точно соответствовать UnitOverview.DrivingQuestion дословно. Укажите фактический driving question (например, 'How can we design an invention inspired by ancient Egyptian innovation to solve a real problem in our Coconut Creek community?')."
            },
            "ProblemDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Абзацы с описанием проблемы, объясняющие реальный вызов. Объясните, почему проблема важна и каковы последствия, если ее не решить, определяя лежащие в основе способствующие факторы. Покажите, как непонимание, недостающая информация или упущенные переменные способствуют возникновению проблемы. Объясните, как решение служит реальной, значимой, аутентичной аудитории. НЕ включайте никакой нумерации или маркированных списков в начале ваших строк.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "ProjectDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Повествовательные абзацы о том, как обучение выстраивается на протяжении многодневного проекта (inquiry -> apply -> refine -> present). Объясните, как учащиеся начинают с изучения примеров, замечают закономерности, применяют научные знания через практические испытания, а затем используют эти выводы для разработки оригинального изобретения. Объясните, как они дорабатывают прототипы и представляют идеи аутентичной аудитории. НЕ включайте никакой нумерации или маркированных списков в начале ваших строк.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "Sites": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "x-format": "{items}",
              "description": "ДОЛЖНО включать 3–5 Place-Based Sites of Engagement. Убедитесь, что sites представляют разнообразные контексты и ясно показывают, что местное сообщество является частью учебной экосистемы.",
              "items": {
                "type": "object",
                "x-format": "\n\n**{value.SiteTitle}**\n\n- **{loc.StudentEngagement}:** {value.StudentEngagement}\n- **{loc.Relevance}:** {value.Relevance}",
                "additionalProperties": false,
                "required": [
                  "SiteTitle",
                  "StudentEngagement",
                  "Relevance"
                ],
                "properties": {
                  "SiteTitle": {
                    "type": "string",
                    "description": "Место физическое, общественное, виртуальное или предметно-специфическое, релевантное контексту модуля (например, 'Coconut Creek Middle School Campus (Primary Investigation Site)')."
                  },
                  "StudentEngagement": {
                    "type": "string",
                    "description": "Объяснение аутентичных исследовательских действий, которые учащиеся выполняют в этом месте или с его помощью, таких как наблюдение, сбор данных, интервью, анализ, виртуальное исследование или направленные полевые задания, связанные с реальной проблемой."
                  },
                  "Relevance": {
                    "type": "string",
                    "description": "Объяснение того, почему это место важно, путем связи с проблемой, демонстрации того, как оно предоставляет доказательства или экспертные знания, разъяснения того, как оно поддерживает проектирование решения или моделирование, и подчеркивания местной или общественной значимости."
                  }
                }
              }
            },
            "KeyVocabulary": {
              "type": "object",
              "x-format": "{value.Tiers}",
              "additionalProperties": false,
              "required": [
                "Tiers"
              ],
              "properties": {
                "Tiers": {
                  "type": "array",
                  "minItems": 4,
                  "maxItems": 4,
                  "x-format": "{items}",
                  "description": "Создайте раздел Tiered Academic Vocabulary, состоящий ровно из четырех размеченных tiers.",
                  "items": {
                    "type": "object",
                    "x-format": "\n\n**{value.TierTitle}**\n\n*{value.TierWhyItMatters}*\n\n{value.Terms}",
                    "additionalProperties": false,
                    "required": [
                      "TierTitle",
                      "TierWhyItMatters",
                      "Terms"
                    ],
                    "properties": {
                      "TierTitle": {
                        "type": "string",
                        "description": "ДОЛЖНО быть точно одним из следующих: 'Tier 1: Essential / Core Vocabulary', 'Tier 2: Application, Modeling, or Process Vocabulary', 'Tier 3: Real-World or Project-Specific Vocabulary', 'Tier 4: Enrichment & Extension Vocabulary'."
                      },
                      "TierWhyItMatters": {
                        "type": "string",
                        "description": "Короткое курсивное предложение, объясняющее, как эти термины помогают учащимся в контексте проекта (например, 'These terms help students name the most important ideas and objects they will see, build, and discuss during the project.')."
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "x-format": "\n\n{items}",
                        "description": "Перечислите соответствующие уровню модуля термины словаря со понятными для учащихся определениями.",
                        "items": {
                          "type": "object",
                          "x-format": "{index}. **{value.Term}**: {value.Definition}\n",
                          "additionalProperties": false,
                          "required": [
                            "Term",
                            "Definition"
                          ],
                          "properties": {
                            "Term": {
                              "type": "string",
                              "description": "Словарное слово (например, 'force'). Не включайте никакой нумерации или маркированных списков."
                            },
                            "Definition": {
                              "type": "string",
                              "description": "Понятное для учащихся определение."
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "AssessmentPlan": {
          "type": "object",
          "x-format": "### {green}({loc.AlignedAssessmentEvidenceAndCriteriaForSuccess})\n\n**{loc.PurposeLabel}** {loc.AlignedAssessmentPurposeValue}\n\n### {violet}({loc.FormativeAssessmentRubric})\n\n| {loc.StudentLearningObjective} | {loc.SuccessCriteria} | {loc.PointOfDemonstration} |\n|---|---|---|\n{value.FormativeAssessmentTable}\n\n### {violet}({loc.AnalyticRubric})\n\n| {loc.Criterion} | {loc.Novice} | {loc.Apprentice} | {loc.Practitioner} | {loc.Expert} |\n|---|---|---|---|---|\n{value.AnalyticRubric}\n\n### {green}({loc.AuthenticAudience})\n\n**{loc.PurposeLabel}** {loc.AuthenticAudiencePurposeValue}\n\n{value.AuthenticAudience}",
          "additionalProperties": false,
          "required": [
            "FormativeAssessmentTable",
            "AnalyticRubric",
            "AuthenticAudience"
          ],
          "properties": {
            "AuthenticAudience": {
              "type": "object",
              "x-format": "{value.Audiences}\n\n**{loc.StudentParticipationInAudienceSelection}**\n\n{value.StudentParticipation}",
              "description": "Определите и вовлеките аутентичную аудиторию за пределами класса.",
              "additionalProperties": false,
              "required": [
                "Audiences",
                "StudentParticipation"
              ],
              "properties": {
                "Audiences": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 3,
                  "items": {
                    "type": "object",
                    "x-format": "**{value.AudienceName}**\n\n{value.PrimaryAudienceDescription} {value.WhyThisAudienceIsQualified} {value.HowThisAudienceElevatesTheProject}\n\n",
                    "additionalProperties": false,
                    "required": [
                      "AudienceName",
                      "PrimaryAudienceDescription",
                      "WhyThisAudienceIsQualified",
                      "HowThisAudienceElevatesTheProject"
                    ],
                    "properties": {
                      "AudienceName": {
                        "type": "string",
                        "description": "Название конкретной аутентичной аудитории (например, 'City of Coconut Creek Sustainability & Environmental Advisory Board'). Не включайте маркированные списки или нумерацию."
                      },
                      "PrimaryAudienceDescription": {
                        "type": "string",
                        "description": "Четкое описание того, кто эта аудитория (отдельные люди, организации или группы) и как они связаны с контекстом или проблемой проекта. Должно быть подробно, не менее 2–3 предложений."
                      },
                      "WhyThisAudienceIsQualified": {
                        "type": "string",
                        "description": "Объяснение того, почему эта аудитория обладает соответствующей экспертизой, опытом жизни или полномочиями, связанными с темой проекта. Должно быть подробно, не менее 2–3 предложений."
                      },
                      "HowThisAudienceElevatesTheProject": {
                        "type": "string",
                        "description": "Как присутствие этой аудитории повышает подлинность, строгость, мотивацию или реальное влияние для учащихся. Должно быть подробно, не менее 2-3 предложений."
                      }
                    }
                  }
                },
                "StudentParticipation": {
                  "type": "string",
                  "description": "Абзац, объясняющий, как учащиеся помогают определить, какая аудитория лучше всего подходит для их изобретения, обсуждая, кто выиграет от решения или будет его оценивать."
                }
              }
            },
            "FormativeAssessmentTable": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "items": {
                "type": "object",
                "x-format": "| {value.CriteriaForSuccess} | {value.SuccessCriteria} | {value.PointOfDemonstration} |",
                "additionalProperties": false,
                "required": [
                  "CriteriaForSuccess",
                  "SuccessCriteria",
                  "PointOfDemonstration"
                ],
                "properties": {
                  "CriteriaForSuccess": {
                    "type": "string",
                    "description": "Измеримая учебная цель учащихся, заканчивающаяся уровнем DOK. Не включайте маркированные списки или нумерацию."
                  },
                  "SuccessCriteria": {
                    "type": "string",
                    "description": "Конкретные критерии успеха, объясняющие, что будет делать учащийся, чтобы продемонстрировать обучение. Не включайте маркированные списки или нумерацию."
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Где будет появляться доказательство, разделённое на утверждения Formative: и Summative:. Не включайте маркированные списки или нумерацию."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "description": "Аналитическая рубрика, подробно описывающая компетенции, требуемые проектом. Каждая строка представляет один оцениваемый навык. Переход от Novice к Expert должен отражать возрастающую сложность.",
              "items": {
                "type": "object",
                "x-format": "| {value.Criterion} | {value.Novice} | {value.Apprentice} | {value.Practitioner} | {value.Expert} |",
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
                    "type": "string",
                    "description": "Оцениваемый навык, компетенция или аспект итогового проекта. Не включайте маркированные списки или нумерацию."
                  },
                  "Novice": {
                    "type": "string",
                    "description": "Описание уровня Novice. Не используйте язык дефицита, такой как fails, lacks или missing. Не включайте маркированные списки или нумерацию."
                  },
                  "Apprentice": {
                    "type": "string",
                    "description": "Описание уровня Apprentice. Не включайте маркированные списки или нумерацию."
                  },
                  "Practitioner": {
                    "type": "string",
                    "description": "Описание уровня Practitioner. Не включайте маркированные списки или нумерацию."
                  },
                  "Expert": {
                    "type": "string",
                    "description": "Описание уровня Expert. Должно опираться на уровень Practitioner, добавляя более глубокое понимание, точность или сложность. Не включайте маркированные списки или нумерацию."
                  }
                }
              }
            }
          }
        },
        "LearningPlan": {
          "type": "object",
          "x-format": "### {green}({loc.LearningPlanOverview})\n\n{value.LearningPlanOverview}{value.ProjectPhases}\n\n### {green}({loc.ProjectGoals})\n\n{value.ProjectGoals}\n\n### {loc.FinalDeliverableSummary}\n\n{value.FinalDeliverableSummary}\n\n### {green}({loc.GroupSuggestions})\n\n{value.GroupSuggestions.GroupSize}\n\n**{loc.RotatingRolesAndDuties}**\n\n{value.GroupSuggestions.RotatingRolesAndDuties}\n\n**{loc.GuidingQuestionForTeacherPlanning}**\n\n{value.GroupSuggestions.TeacherGroupingStrategyPrompt}\n\n**{loc.GroupingStrategyRecommendations}**\n\n{loc.TeachersMayConsider}\n\n{value.GroupSuggestions.GroupingStrategyRecommendations}",
          "additionalProperties": false,
          "required": [
            "LearningPlanOverview",
            "ProjectPhases",
            "ProjectGoals",
            "FinalDeliverableSummary",
            "GroupSuggestions"
          ],
          "properties": {
            "LearningPlanOverview": {
              "type": "string",
              "description": "Краткое резюме из 2-4 предложений, объясняющее, как проект организован в три гибкие фазы (Phase 1, Phase 2, Phase 3), а не по фиксированному количеству дней. Кратко опишите, что учащиеся делают на каждой фазе (например, в Phase 1 они формируют базовые знания; в Phase 2 они применяют научные идеи через исследования; в Phase 3 они дорабатывают прототипы и представляют их подлинной аудитории). Не используйте маркированные списки или нумерацию."
            },
            "ProjectPhases": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 3,
              "description": "Три фазы проекта. Общая продолжительность всех 3 фаз ДОЛЖНА в точности равняться общему количеству дней, запрошенному для проекта.",
              "items": {
                "type": "object",
                "x-format": "\n\n### {violet}({value.PhaseTitle})\n\n{value.PhaseDescription}\n\n**{loc.ConceptsOrSkillsEmphasized}:** {value.ConceptsOrSkills}\n\n**{loc.CollaborationAndVisibleThinking}:** {value.CollaborationAndVisibleThinking}\n\n{value.KeyLearningExperiences}",
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
                    "type": "string",
                    "description": "Название и длительность фазы (например, 'Phase 1: 1-2 days' или 'Phase 3: 2 days'). ВАЖНО: длительность должна быть явно указана в названии, а сумма максимального числа дней по всем фазам должна в точности соответствовать общему запрошенному сроку проекта. Не включайте маркированные списки или нумерацию."
                  },
                  "PhaseDescription": {
                    "type": "string",
                    "description": "Краткий абзац из 1-2 предложений, описывающий, что учащиеся делают на этой фазе, чтобы углубить понимание или синтезировать обучение."
                  },
                  "ConceptsOrSkills": {
                    "type": "string",
                    "description": "Список через запятую основных понятий или навыков, акцентируемых на этой фазе (например, 'Observation, questioning, modeling, lever systems, structure stability'). Не включайте маркированные списки или нумерацию."
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string",
                    "description": "Предложение, объясняющее, как учащиеся сотрудничают и делают своё мышление видимым на этой фазе (например, 'Students use think-pair-share, sketch notes, and quick group comparisons to make their thinking visible.'). Не включайте маркированные списки или нумерацию."
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "x-format": "{items}",
                    "minItems": 3,
                    "description": "Список конкретных учебных действий или задач на этой фазе.",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}",
                      "description": "Конкретное учебное действие (например, 'Shaduf build and test'). Не включайте нумерацию или маркированные списки в начале строк."
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "description": "Выходные данные должны содержать ровно три цели проекта, каждая из которых выражена как концептуальная категория, за которой следуют подробные маркеры или короткие абзацы. Goal 1, Apply Disciplinary Content to a Real-World Problem, требует, чтобы учащиеся использовали предметно-специфические знания для анализа или решения подлинной задачи, перечислили 4-6 основных понятий или принципов, которые они будут применять, и показали, как эти идеи связаны с реальными условиями или ограничениями. Goal 2, Solve a Real, Developmentally Appropriate Design or Inquiry Problem, требует описания подлинной задачи, которую учащиеся должны решить, перечисления того, что они будут создавать, моделировать, сравнивать, анализировать, оценивать или обосновывать, и включения таких процессов, как моделирование, прогнозирование, сравнение, оценка и принятие решений. Goal 3, Communicate Findings to a Real Audience, требует, чтобы учащиеся подготовили отшлифованный, профессионально качественный итоговый продукт, адаптировали сообщение к потребностям реальной группы заинтересованных лиц и ссылались на подлинные аудитории, такие как местные эксперты, общественные организации, специалисты отрасли, руководство школы, семьи или члены сообщества.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n",
                "description": "Конкретная цель проекта, оформленная с выделенными жирным шрифтом подзаголовками (например, '**Цель 1: Применить предметный материал к реальной проблеме** Используйте знания...')"
              }
            },
            "FinalDeliverableSummary": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "items": {
                "type": "string",
                "x-format": "- {value}\n"
              }
            },
            "GroupSuggestions": {
              "type": "object",
              "description": "Определяет размер группы, роли и обязанности учителя.",
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
                  "description": "Выходной текст должен указывать рекомендуемый размер группы, например 3–4 учащихся, и должен содержать обоснование, объясняющее, как такой размер способствует продуктивному обсуждению, совместной вовлеченности и управляемому распределению задач. Пример: 'Размер группы 3–4 учащихся идеален, потому что...'"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Выходной текст должен содержать список ролей, оформленный как 'Название роли: описание обязанностей'. Список должен включать как минимум четыре роли (Фасилитатор, Секретарь, Ответственный за материалы, Презентатор/Коммуникатор) и ожидания к учителю в конце.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Модель должна выдать ровно эти две строки: 1) '\"В чем основная цель вашего объединения в этой деятельности — поддержка сверстников, содержательное обсуждение, вызов или эффективность? После того как вы назовете цель, какой подход к объединению лучше всего ей соответствует: смешанные по уровню, по интересам, по навыкам или случайные?\"' 2) 'Этот вопрос побуждает учителей выбирать методы объединения, соответствующие учебным целям, а не полагаться по умолчанию на удобство или привычку.'",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Модель должна вывести точные рекомендации по стратегии объединения, оформленные с жирными подзаголовками (например, '**Группы смешанного уровня:** Лучше всего, когда...'). Включить следующие стратегии: Группы смешанного уровня, Группы по интересам, Группы по навыкам, Случайно сформированные группы.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                }
              }
            }
          }
        },
        "TeacherGuidancePhase1": {
          "type": "object",
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase1}\n\n### {green}({loc.Phase1Title})\n\n**Focus Statement**\n{value.Phase1_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase1_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase1_GuidingQuestions}\n\n{value.Phase1_Differentiation}\n\n{value.Phase1_AccommodationsAndModifications}\n\n{value.Phase1_AnticipatedMisconceptions}\n\n{value.Phase1_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase1_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase1_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase1_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase1_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase1_ReflectionPrompt.Introduction}\n{value.Phase1_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Первая фаза руководства для учителя",
          "required": [
            "Phase1_FocusStatement",
            "Phase1_CollaborativeActivities",
            "Phase1_GuidingQuestions",
            "Phase1_Differentiation",
            "Phase1_AccommodationsAndModifications",
            "Phase1_AnticipatedMisconceptions",
            "Phase1_TranscendentThinking",
            "Phase1_QuickChecks",
            "Phase1_SpacedRetrieval",
            "Phase1_StudentPractice_TeacherNotes",
            "Phase1_StudentPractice_Tasks",
            "Phase1_StudentPractice_InterleavingIfMath",
            "Phase1_ReflectionPrompt"
          ],
          "properties": {
            "Phase1_FocusStatement": {
              "type": "string",
              "description": "Предоставьте краткое утверждение, описывающее, как этот этап пробуждает любопытство, знакомит с реальной проблемой и активирует раннее мышление. Формулировка фокуса должна включать пробуждение любопытства к основному явлению или проблеме, раннее наблюдение и исследование, самостоятельные замечания и вопросы учащихся, а также четкую связь с Ведущим вопросом модуля. Формулировка должна отражать, что на этом стартовом этапе учащиеся пробуждают любопытство и начинают раскрывать научную или концептуальную проблему, лежащую в центре проекта, и что через наблюдение, исследование и ранние попытки моделирования они собирают непосредственные доказательства, связывающие их первоначальные представления с Ведущим вопросом."
            },
            "Phase1_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
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
                      "type": "string",
                      "x-format": "  - {value}"
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
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase1_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Сгенерируйте 2–3 поддержки, специфичные для урока (визуальные материалы, словари, жесты), чтобы помочь изучающим язык учащимся понимать и выражать идеи. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Сгенерируйте 3–4 начала предложений, которые помогают учащимся описывать, объяснять и передавать свои мысли по этому конкретному уроку. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Сгенерируйте 2–3 пошаговые поддержки (структурированные инструменты, примеры с моделированием, «think-aloud») и точные указания, чтобы помочь учащимся выполнить задание. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Сгенерируйте 3–4 контрольных вопроса, чтобы помочь учащимся осмыслить свое обучение во время исследования. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Сгенерируйте 2–3 расширения, повышающие сложность (конкретные вызовы, выявление закономерностей), чтобы помочь учащимся углубить или улучшить свое мышление, используя доказательства. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Сформулируйте один сложный запрос/вопрос (НЕ включайте префикс 'Say:') для более глубокого концептуального понимания."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Сгенерируйте 3–4 конкретных примера высококачественных ответов учащихся на продвинутый вопрос. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
            "Phase1_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Этот раздел должен включать два типа поддержек: Общие поддержки и Индивидуализированные поддержки. Делайте акцент на доступности, а не на снижении сложности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Неспецифичные для учащихся стратегии, которые улучшают доступ для всех обучающихся (например, визуальные материалы, заранее заполненные заметки, цифровой глоссарий, фрагментированные инструкции). Предоставьте 2–4 пункта списка."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Конкретные адаптации и модификации для названных учащихся с официальными планами. Перечислите КАЖДОГО учащегося отдельно; НЕ объединяйте учащихся в группы. Поддержки для каждого учащегося должны быть легко просматриваемым списком.",
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
                        "description": "Официальный план, предоставленный для этого учащегося в запросе. Разбейте план на понятный список. Вы можете перефразировать его для улучшения форматирования, но НЕ опускайте и НЕ добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретные инструменты/стебли/визуальные материалы/организаторы для этой задачи."
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
            "Phase1_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Сгенерируйте 2–3 распространённых заблуждения учащихся, которые, вероятно, возникнут на этом этапе. Каждый пункт должен быть сосредоточен на конкретном непонимании и сценарии ответа учителя.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуждение в 1 предложении, начиная с «Students may think...». НЕ используйте жирное выделение или теги strong."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Чёткий сценарий ответа учителя, ориентированный на преподавателя (начиная с «Teacher Response: »), который показывает, как реагировать в моменте с конкретной подсказкой (не включайте префикс «Say:»). НЕ используйте жирное выделение или теги strong."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase1_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Сгенерируйте 1 вопрос на трансцендентное мышление, который требует от учащихся применять обучение за пределами себя в реальных контекстах (сообщества, глобальные вызовы). Сосредоточьтесь на том, почему обучение важно в масштабах (безопасность, устойчивость, инновации и т. д.). Избегайте личного/школьного фокуса."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase1_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Итоговый вопрос на проверку понимания с 2–3 ожидаемыми ответами учащихся, демонстрирующими освоение материала",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Модель должна создать компонент пространственного извлечения, который требует от учащихся вспомнить ключевое понятие из конкретного предыдущего блока или урока без ссылки на какие-либо прошлые активности, рабочие листы, модели, подписи или шаги, связанные с заданием. Сценарий учителя должен начинаться с Say: и может ссылаться только на тему предыдущего обучения, а не на то, чему учащиеся о ней научились. Вопрос на извлечение должен побуждать учащихся переформулировать или применить ранее изученное концептуальное понимание (например, как работает система, как связаны переменные или как разворачивается процесс) полностью по памяти, без подсказок или частичных объяснений со стороны учителя. Вывод должен заканчиваться Expected Student Responses, показывая 2–3 примера, которые точно отражают концептуальное воспроизведение, демонстрируя, что именно учащиеся, а не подсказка, предоставили вспомненные идеи.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто пишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase1_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Один абзац, объясняющий знания и навыки, отработанные во всех заданиях на этом этапе. Абзац ДОЛЖЕН начинаться с «Эти задания укрепляют сегодняшнее обучение о ____ by ______.», где пропуски заполнены соответствующим содержанием проекта, после чего следует объяснение того, как эти задания укрепляют долгосрочное запоминание."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задания должны соответствовать фокусу этапа и ожидаемой глубине знаний. Используйте только DOK 2, 3 или 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Уровень глубины знаний для задания. ДОЛЖЕН БЫТЬ РОВНО ОДНИМ ИЗ: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 строго запрещён."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase1_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Если и ТОЛЬКО ЕСЛИ предмет — математика: включите задачу на интерливинг + подсказку учителя + ожидаемые ответы + заметку учителя. В противном случае — пустая строка."
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
                  "description": "Краткое вступление для учащихся к рефлексии, например: «Напишите 2–3 предложения, отвечая на один из вопросов:»"
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
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase2}\n\n### {green}({loc.Phase2Title})\n\n**Focus Statement**\n{value.Phase2_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase2_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase2_GuidingQuestions}\n\n{value.Phase2_Differentiation}\n\n{value.Phase2_AccommodationsAndModifications}\n\n{value.Phase2_AnticipatedMisconceptions}\n\n{value.Phase2_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase2_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase2_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase2_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase2_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase2_ReflectionPrompt.Introduction}\n{value.Phase2_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Вторая фаза руководства учителя",
          "required": [
            "Phase2_FocusStatement",
            "Phase2_CollaborativeActivities",
            "Phase2_GuidingQuestions",
            "Phase2_Differentiation",
            "Phase2_AccommodationsAndModifications",
            "Phase2_AnticipatedMisconceptions",
            "Phase2_TranscendentThinking",
            "Phase2_QuickChecks",
            "Phase2_SpacedRetrieval",
            "Phase2_StudentPractice_TeacherNotes",
            "Phase2_StudentPractice_Tasks",
            "Phase2_StudentPractice_InterleavingIfMath",
            "Phase2_ReflectionPrompt"
          ],
          "properties": {
            "Phase2_FocusStatement": {
              "type": "string",
              "description": "Напишите краткое утверждение Focus Statement из 1–3 предложений, которое подводит итог цели фазы, объясняет, как учащиеся строят понимание через исследовательскую работу, явно связывает фазу с Driving Question или реальной проблемой модуля и описывает, как эта фаза приближает их к созданию итогового продукта. Утверждение всегда должно быть оформлено как один короткий абзац и должно быть адаптировано к конкретным деталям проекта, предоставленным пользователем."
            },
            "Phase2_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
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
                      "type": "string",
                      "x-format": "  - {value}"
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
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase2_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Сгенерируйте 2-3 поддерживающих средства, специфичных для урока (визуалы, наборы слов, жесты), чтобы помочь изучающим язык понимать и выражать идеи. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Сгенерируйте 3-4 начала предложений, которые помогают учащимся описывать, объяснять и передавать свои мысли для этого конкретного урока. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Сгенерируйте 2-3 пошаговые поддержки (структурированные инструменты, моделируемые примеры, размышление вслух) и точные указания, которые помогут учащимся выполнить задание. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Сгенерируйте 3-4 контрольных вопроса, чтобы помочь учащимся осмыслить своё обучение во время исследования. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Сгенерируйте 2-3 расширения, повышающие сложность (конкретные вызовы, выявление закономерностей), чтобы помочь учащимся углубить или улучшить своё мышление, используя доказательства. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Сгенерируйте один сложный вопрос (не включайте префикс 'Say:')/вопрос, чтобы подтолкнуть к более глубокому концептуальному пониманию."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Сгенерируйте 3-4 конкретных примера высококачественных ответов учащихся на продвинутый вопрос. НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
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
            "Phase2_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Этот раздел должен включать два типа поддержки: Общие поддержки и Индивидуализированные поддержки. Делайте акцент на доступе, а не на снижении сложности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Стратегии, не привязанные к конкретным учащимся, которые повышают доступ для всех учеников (например, визуалы, заранее заполненные заметки, цифровой глоссарий, разбитые на части инструкции). Предоставьте 2-4 пункта."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Специальные приспособления и модификации для названных учащихся с формальными планами. Укажите КАЖДОГО учащегося отдельно; НЕ объединяйте учащихся в группы. Поддержка для каждого учащегося должна быть в форме списка, который легко просмотреть.",
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
                        "description": "Формальный план, предоставленный для этого учащегося в запросе. Разбейте план на понятный список. Вы можете перефразировать его, чтобы улучшить форматирование, но НЕ опускайте и НЕ добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретные инструменты/начальные фразы/визуалы/органайзеры для этого задания."
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
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Сгенерируйте 2-3 распространённых заблуждения учащихся, которые, вероятно, возникнут на этом этапе. Каждый пункт должен быть сосредоточен на конкретном неверном понимании и скрипте ответа учителя.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуждение в 1 предложении, начиная с 'Students may think...'. НЕ используйте никакого выделения жирным или strong-тегов."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Чёткий скрипт ответа учителя (начинающийся с 'Teacher Response: '), который показывает, как реагировать в данный момент с конкретной подсказкой (не включайте префикс 'Say:'). НЕ используйте никакого выделения жирным или strong-тегов."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase2_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Сгенерируйте 1 вопрос, побуждающий к выходу за пределы собственного опыта, который требует от учащихся применять знания в реальных контекстах (сообщества, глобальные вызовы). Сосредоточьтесь на том, почему обучение важно в масштабах общества (безопасность, устойчивость, инновации и т. д.). Избегайте личного или школьного фокуса."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase2_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Итоговый вопрос для проверки понимания с 2-3 ожидаемыми ответами учащихся, демонстрирующими освоение материала",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте элементы с маркированных пунктов, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Модель должна создать компонент Spaced Retrieval, который требует от учащихся вспомнить ключевое понятие из конкретного предыдущего модуля или урока, не ссылаясь ни на какие прошлые активности, рабочие листы, модели, ярлыки или шаги, специфичные для задания. Сценарий учителя должен начинаться с Say: и может ссылаться только на тему предыдущего обучения, а не на то, чему учащиеся о нём узнали. Вопрос на извлечение должен побуждать учащихся пересказать или применить ранее изученное концептуальное понимание (например, как работает система, как связаны переменные или как протекает процесс) исключительно по памяти, без подсказок или частичных объяснений со стороны учителя. Вывод должен заканчиваться Expected Student Responses с 2-3 примерами, которые точно отражают концептуальное воспроизведение, показывая, что именно учащиеся, а не подсказка, выдали вспомненные идеи.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase2_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Один абзац, объясняющий знания и навыки, отрабатываемые во всех заданиях на этом этапе. Абзац ДОЛЖЕН начинаться с 'These tasks reinforce today's learning about ____ by ______.' , где пропуски заполняются содержанием проекта, после чего следует объяснение того, как эти задания укрепляют долгосрочное запоминание."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задания должны соответствовать фокусу этапа и ожидаемой глубине знаний. Используйте только DOK 2, 3 или 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Уровень глубины знаний для задания. ДОЛЖЕН БЫТЬ ОДНИМ ИЗ: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 строго запрещён."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase2_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Если И ТОЛЬКО ЕСЛИ предмет — математика: включите interleaving problem + teacher prompt + expected responses + teacher note. В противном случае пустая строка."
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
                  "description": "Краткое введение для учащихся к рефлексии, например: 'Напишите 2-3 предложения, отвечая на один вопрос:'"
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
          "x-format": "## 🧑‍🏫 {loc.TeacherGuidancePhase3}\n\n### {green}({loc.Phase3Title})\n\n**Focus Statement**\n{value.Phase3_FocusStatement}\n\n### {violet}({loc.CollaborativeActivities})\n\n{value.Phase3_CollaborativeActivities}\n\n### {violet}({loc.GuidingQuestions})\n\n{value.Phase3_GuidingQuestions}\n\n{value.Phase3_Differentiation}\n\n{value.Phase3_AccommodationsAndModifications}\n\n{value.Phase3_AnticipatedMisconceptions}\n\n{value.Phase3_TranscendentThinking}\n\n### {violet}(✔ {loc.QuickCheck})\n\n{value.Phase3_QuickChecks}\n\n### {violet}(⏳ {loc.SpacedRetrieval})\n\n{value.Phase3_SpacedRetrieval}\n\n### {green}(🖊 {loc.StudentPractice})\n\n**{loc.TeacherNotes}:**\n{value.Phase3_StudentPractice_TeacherNotes}\n\n**{loc.PracticeTasks}:**\n{value.Phase3_StudentPractice_Tasks}\n\n**🔎 {loc.Reflection}**\n{value.Phase3_ReflectionPrompt.Introduction}\n{value.Phase3_ReflectionPrompt.Prompts}",
          "additionalProperties": false,
          "description": "Третий этап педагогического руководства",
          "required": [
            "Phase3_FocusStatement",
            "Phase3_CollaborativeActivities",
            "Phase3_GuidingQuestions",
            "Phase3_Differentiation",
            "Phase3_AccommodationsAndModifications",
            "Phase3_AnticipatedMisconceptions",
            "Phase3_TranscendentThinking",
            "Phase3_QuickChecks",
            "Phase3_SpacedRetrieval",
            "Phase3_StudentPractice_TeacherNotes",
            "Phase3_StudentPractice_Tasks",
            "Phase3_StudentPractice_InterleavingIfMath",
            "Phase3_ReflectionPrompt"
          ],
          "properties": {
            "Phase3_FocusStatement": {
              "type": "string",
              "description": "Создайте Focus Statement из 2-4 предложений, чётко передающее цель Phase 3 и его роль в продвижении учащихся к итоговому продукту. В заявлении должно быть объяснено, что Phase 3 сосредоточен на уточнении идей, применении изученного, усилении доказательств, подготовке итоговых продуктов и вовлечении в более глубокое рассуждение и пересмотр. Оно должно явно показывать, как Phase 3 продвигает аутентичную реальную задачу проекта, как учащиеся используют доказательства для улучшения решений и как эта работа готовит их к аутентичной аудитории. Заявление должно включать интеллектуальную работу, такую как уточнение, пересмотр, синтез, оценивание, обоснование, завершение и представление, и оно должно указывать, как учащиеся завершают модели, продукты, объяснения или предложения, готовят презентации или публичные показы и осмысливают обучение, чтобы укрепить свои рассуждения."
            },
            "Phase3_CollaborativeActivities": {
              "type": "array",
              "minItems": 3,
              "maxItems": 5,
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "\n\n**{value.ActivityTitle}**\n- **{loc.StudentExperience}:** {value.StudentExperience}\n- **{loc.TeacherRole}:** {value.TeacherRoleMoves}\n- **{loc.ArtifactsOfLearning}:**\n{value.ArtifactsOfLearning}",
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
                      "type": "string",
                      "x-format": "  - {value}"
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
                "type": "string",
                "x-format": "{index}. {value}"
              }
            },
            "Phase3_Differentiation": {
              "type": "object",
              "x-format": "### {violet}(🪜 {loc.Differentiation})\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
              "properties": {
                "LanguageLearners": {
                  "type": "object",
                  "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
                  "properties": {
                    "Strategies": {
                      "type": "array",
                      "description": "Создайте 2-3 поддерживающих средства для урока (визуалы, банки слов, жесты), чтобы помочь изучающим язык получать доступ к идеям и выражать их. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Создайте 3-4 начала фраз, которые помогают учащимся описывать, объяснять и передавать свои мысли для этого конкретного урока. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Создайте 2-3 пошаговые опоры (структурированные инструменты, моделируемые примеры, think-alouds) и точные указания, которые помогут учащимся выполнить задание. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Создайте 3-4 контрольных вопроса, которые помогут учащимся осмыслить своё обучение во время исследования. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
                      "description": "Создайте 2-3 расширения, которые повышают сложность (конкретные вызовы, выявление закономерностей), чтобы помочь учащимся углубить или улучшить своё мышление, используя доказательства. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Создайте один сложный вопрос (не включайте префикс 'Say:')/вопрос, чтобы углубить концептуальное понимание."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Создайте 3-4 конкретных примера высококачественных ответов учащихся на продвинутый вопрос. НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
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
            "Phase3_AccommodationsAndModifications": {
              "x-format": "### {violet}(🤝 {loc.AccommodationsAndModifications})\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
              "type": "object",
              "description": "Этот раздел должен включать два типа поддержки: General Supports и Individualized Supports. Делайте упор на доступ, а не на снижение сложности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Нестуденто-специфичные стратегии, которые улучшают доступ для всех учащихся (например, визуальные опоры, предварительно заполненные заметки, цифровой глоссарий, инструкции, разбитые на части). Предоставьте 2–4 пункта."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Конкретные accommodations и modifications для указанных поимённо учащихся с официальными планами. Перечислите КАЖДОГО учащегося отдельно; НЕ объединяйте учащихся вместе. Поддержка для каждого учащегося должна быть в виде легко просматриваемого списка.",
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
                        "description": "Официальный план, предоставленный для этого учащегося в запросе. Разберите план в понятный список. Вы можете перефразировать его, чтобы улучшить форматирование, но НЕ опускайте и НЕ добавляйте никакой информации."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретные инструменты/основы фраз/визуальные опоры/организаторы для этого задания."
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
            "Phase3_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Сгенерируйте 2–3 распространённых заблуждения учащихся, которые, вероятно, возникнут на этом этапе. Каждый пункт должен быть сосредоточен на конкретном непонимании и сценарии ответа учителя.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуждение в 1 предложении, начиная с 'Students may think...'. НЕ используйте никакого выделения жирным шрифтом или сильных тегов."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Чёткий сценарий ответа учителя (начинающийся с 'Teacher Response: '), который моделирует, как отреагировать в моменте с конкретным запросом (НЕ включайте префикс 'Say:'). НЕ используйте никакого выделения жирным шрифтом или сильных тегов."
                  }
                },
                "required": [
                  "Misconception",
                  "TeacherResponse"
                ],
                "additionalProperties": false
              }
            },
            "Phase3_TranscendentThinking": {
              "type": "object",
              "x-format": "### {violet}(🌍 {loc.TranscendentThinking})\n\n{value.Question}",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Сгенерируйте 1 вопрос, побуждающий к трансцендентному мышлению, который требует от учащихся применять знания за пределами себя, в реальных контекстах (сообщества, глобальные вызовы). Сфокусируйтесь на том, почему обучение важно в масштабах (безопасность, устойчивость, инновации и т. д.). Избегайте фокуса только на личном опыте или школе."
                }
              },
              "required": [
                "Question"
              ],
              "additionalProperties": false
            },
            "Phase3_QuickChecks": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{value.BeginningOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.BeginningOfPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.MidPhase}**\n{value.MidPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.MidPhase.SuccessCriteriaOrExpectedResponses}\n\n**{loc.EndOfPhase}**\n{value.EndOfPhase.Prompt}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.EndOfPhase.SuccessCriteriaOrExpectedResponses}",
              "description": "Итоговый вопрос для проверки понимания с 2–3 ожидаемыми ответами учащихся, демонстрирующими владение материалом",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркеров, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "Prompt",
                    "SuccessCriteriaOrExpectedResponses"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_SpacedRetrieval": {
              "type": "object",
              "x-format": "**{loc.BeginningOfPhase}**\n{loc.DrawsFrom}: {value.BeginningOfPhase.DrawsFrom}\n{loc.Question}: {value.BeginningOfPhase.Question} ({loc.DOK} {value.BeginningOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.BeginningOfPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.MidPhase}**\n{loc.DrawsFrom}: {value.MidPhase.DrawsFrom}\n{loc.Question}: {value.MidPhase.Question} ({loc.DOK} {value.MidPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.MidPhase.ExpectedResponseOrSuccessCriteria}\n\n**{loc.EndOfPhase}**\n{loc.DrawsFrom}: {value.EndOfPhase.DrawsFrom}\n{loc.Question}: {value.EndOfPhase.Question} ({loc.DOK} {value.EndOfPhase.DOK})\n\n✅ {loc.ExpectedStudentResponses}:\n\n{value.EndOfPhase.ExpectedResponseOrSuccessCriteria}",
              "description": "Модель должна создать компонент Spaced Retrieval, который требует от учащихся вспомнить ключевое понятие из конкретного предыдущего модуля или урока, не ссылаясь на какие-либо прошлые занятия, рабочие листы, модели, подписи или шаги, специфичные для задания. Сценарий учителя должен начинаться с Say: и может ссылаться только на тему предыдущего обучения, а не на то, чему учащиеся о ней научились. Вопрос на извлечение должен побуждать учащихся воспроизвести или применить ранее изученное концептуальное понимание (например, как работает система, как соотносятся переменные или как разворачивается процесс) полностью по памяти, без подсказок или частичных объяснений со стороны учителя. Вывод должен заканчиваться Expected Student Responses с 2–3 примерами, которые точно отражают концептуальное воспроизведение, демонстрируя, что именно учащиеся, а не запрос, предоставили вспоминаемые идеи.",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркерами, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "MidPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркерами, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                },
                "EndOfPhase": {
                  "type": "object",
                  "properties": {
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
                      "type": "array",
                      "description": "НЕ начинайте пункты с маркерами, тире или цифр. Просто напишите обычный текст.",
                      "minItems": 2,
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      }
                    }
                  },
                  "required": [
                    "DrawsFrom",
                    "Question",
                    "DOK",
                    "ExpectedResponseOrSuccessCriteria"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "BeginningOfPhase",
                "MidPhase",
                "EndOfPhase"
              ],
              "additionalProperties": false
            },
            "Phase3_StudentPractice_TeacherNotes": {
              "type": "string",
              "description": "Один абзац, объясняющий знания и навыки, отрабатываемые во всех заданиях на этом этапе. Абзац ДОЛЖЕН начинаться с 'These tasks reinforce today's learning about ____ by ______.'; пропуски заполняются соответствующим содержанием проекта, после чего следует объяснение того, как эти задания укрепляют долговременное запоминание."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задания должны соответствовать фокусу этапа и ожидаемой глубине знаний. Используйте только DOK 2, 3 или 4.",
              "items": {
                "type": "object",
                "additionalProperties": false,
                "x-format": "**{value.DOK}**\n{value.StudentDirections}\n\n**{loc.SuccessCriteria}:**\n{value.SuccessCriteria}",
                "required": [
                  "DOK",
                  "StudentDirections",
                  "SuccessCriteria"
                ],
                "properties": {
                  "DOK": {
                    "type": "string",
                    "description": "Уровень Depth of Knowledge для задания. ДОЛЖЕН БЫТЬ ТОЛЬКО ОДНИМ из следующих: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 строго запрещён."
                  },
                  "StudentDirections": {
                    "type": "string"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    }
                  }
                }
              }
            },
            "Phase3_StudentPractice_InterleavingIfMath": {
              "type": "string",
              "description": "Если и ТОЛЬКО ЕСЛИ предмет — математика: включите задание на чередование + реплику учителя + ожидаемые ответы + заметку для учителя. В противном случае — пустая строка."
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
                  "description": "Краткое введение для ученика к рефлексии, например: «Напишите 2–3 предложения в ответ на один вопрос:»"
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
          "x-format": "## ⚙️ {loc.UnitPreparationAndConsiderations}\n\n### {loc.ClassroomMaterialsAndEquipment}\n{value.ClassroomMaterialsAndEquipment}\n\n### {loc.LocalAndCommunityBasedResources}\n{value.LocalAndCommunityBasedResources}\n\n### {loc.DigitalToolsAndOnlineResources}\n{value.DigitalToolsAndOnlineResources}\n\n### {loc.TechnologyToDeepenInquiry}\n{value.TechnologyToDeepenInquiry}\n\n### {loc.TechnologyForModeling}\n{value.TechnologyForModeling}\n\n### {loc.TechnologyForCollaboration}\n{value.TechnologyForCollaboration}\n\n### {loc.TechnologyForCreatingFinalProduct}\n{value.TechnologyForCreatingFinalProduct}\n\n### {loc.EquityAndAccessibilityConsiderations}\n{value.EquityAndAccessibilityConsiderations}",
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
},
};
