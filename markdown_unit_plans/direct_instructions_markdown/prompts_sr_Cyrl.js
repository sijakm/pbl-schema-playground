window.promptssrCyrl = {
  STEP0_PROMPT_TEMPLATE: `Направи оквир јединице и структуру часа користећи информације испод. НЕ пишите пуне планове часа.
                    
На основу предмета јединице, образовних стандарда, описа/упутства за јединицу, разреда, трајања школског часа (у минутима) и траженог броја часова, генеришите JSON одговор који укључује кохерентан UnitDescription и непоклапајућу листу „контејнера“ за часове.

Предмет јединице:
{{$Subject}}

Назив јединице:
{{$Name}}

Опис/упутство за јединицу:
{{$UserPrompt}}

Разред:
{{$GradeLevel}}

Трајање школског часа у минутима:
{{$ClassDuration}}
	
Стандарди за усклађивање:
{{$Standards}}
    
Ученици са индивидуализованом подршком:
{{$LearningPlans}}

Ресурси/медији за употребу:
{{$MediaContext}}
	
Садржај јединице:
{{$AttachedUnit}}

Захтеви за кључна питања:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава упитником.
- Свако питање МОРА почињати са „How” или „Why”.
- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефинициона.
- Питања МОРАЈУ да се фокусирају на шире, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива ван ове јединице.
- Питања МОРАЈУ бити поново употребљена дословно у сваком часу у оквиру јединице.

Шта треба генерисати:
- Излаз МОРА бити важећи JSON који одговара шеми.
- ОБАВЕЗНО: У потпуности попуните сва својства унутар објекта "UnitDescription":
  - "Description": Напишите пасус од 4–5 реченица који описује кључни фокус јединице и наративни ток.
  - "StudentLearningObjectives": Наведите 3–5 кључних мерљивих циљева учења за јединицу.
  - "StandardsAligned": Наведите све стандарде који се обрађују током јединице.
  - "EssentialQuestions": Тачно 3 концептуална питања која прате горња правила.
- ГЕНЕРИШИТЕ листу "Lessons" која садржи тачно {{$NumberOfItems}} часова.
  - Сваки час мора да садржи "lessonNumber" (индекс који почиње од 1), "lessonName" и "lessonDescription" (2–4 реченице које описују обим часа).

Ограничења:
- Задржите јединицу и сваки час усклађеним са фокусом јединице.
- Обезбедите логичко редоследно напредовање од основних идеја ка сложенијем моделовању.
- Тачност: Сав садржај мора бити научно тачан и примерен узрасту.

Излаз МОРА бити важећи JSON који одговара шеми. Користите компактно форматирање (без додатних празних редова).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Направите ЈЕДАН план часа (НЕ план јединице, НЕ више часова) користећи информације испод.
МОРАМ да избаците важећи JSON који тачно одговара достављеној JSON шеми (LessonPlanResponse са једним објектом "LessonPlan"). Не укључујте никакве додатне кључеве. Користите компактно JSON форматирање (без додатних празних редова).
Предмет јединице: 
{{$Subject}}
Назив јединице: 
{{$Name}}
Опис/упутство јединице: 
{{$UserPrompt}}
Ниво разреда: 
{{$GradeLevel}}
Трајање часа у минутима 
{{$ClassDuration}}
Ресурси/медији за употребу: 
{{$MediaContext}}
Садржај јединице: 
{{$ParentUnitData}}
Стандарди са којима треба ускладити:
{{$Standards}}
Приложени садржај часа: 
{{$AttachedLesson}}

Основна питања јединице (КОРИСТИТЕ ИХ БЕЗ ИКАКВИХ ИЗМЕНА):
{{$UnitEssentialQuestions}}

Ако је поље Основна питања јединице изнад празно, генеришите тачно 3 концептуална питања према овим правилима:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „How” или „Why”.
- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефиницијска.
- Питања МОРАЈУ бити усмерена на широке, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива између дисциплина и применљива ван ове јединице.


УЧЕНИЦИ СА ИНДИВИДУАЛИЗОВАНОМ ПОДРШКОМ (МОРАЈУ се користити САМО унутар GuidedPractice.AccommodationsAndModifications; користите имена/планове ученика тачно онако како су написани):
{{$LearningPlans}}

ВАЖНА ПРАВИЛА САДРЖАЈА:
- Држите час усклађеним са фокусом јединице: развијање и коришћење модела за описивање атомског састава једноставних молекула и/или проширених структура.
- Укључите кратке, високонивовске везе са другим релевантним DCI-јевима где је прикладно, али држите час усмерен на моделирање и резоновање о структури и својствима (без дубоке математике, без уравнотежевања једначина осим ако стандарди то изричито не захтевају).
- Уверите се да сви делови часа одражавају горе наведене границе/обим часа; избегавајте увођење нових великих појмова који припадају другим часовима.
- EssentialQuestions: МОРА тачно да буде једнако питањима на нивоу јединице (исти текст, исти редослед).
- AssessPriorKnowledge: САМО ако је LessonNumber == 1, напишите 150–250 речи и пратите тражену структуру у опису шеме. Ако LessonNumber != 1, вратите "" (празан стринг).
- DirectPresentation мора бити ≤10 минута укупно и мора следити тражени формат HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT са Say/Do/Ask/✅ Expected Student Responses/Write, а очекивани одговори ученика морају бити у облику булет листе (НЕ укључујте наслове/заглавља одељака у стринг).
- GuidedPractice.InstructionsForTeachers мора имати најмање 700 речи и мора укључивати тражене компоненте наведене у опису шеме.
- GuidedPractice.AccommodationsAndModifications мора да укључи:
  - General: опште подршке
  - IndividualSupport: низ са тачно наведеним ученицима и њиховим плановима (исти називи/планови; без додатних ученика).
- StudentPractice МОРА да садржи пасус TeacherNotes који почиње са 'Ови задаци појачавају данашње учење о ____ тако што ______.', листу од 2-3 задатка са DOK 2-4 и критеријумима успеха, и међусобно прожимање ако је предмет математика.

ЗАХТЕВИ ЗА ИЗЛАЗ:
- Излаз МОРА бити важећи JSON који тачно одговара достављеној шеми.
- Излаз МОРА бити ЈЕДАН једини план часа.
- Без HTML-а. Без емоџија. Без markdown-а. Обичан текст унутар стринг поља.

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
          "description": "Опис јединице као један повезан пасус у обичном тексту (4–5 потпуних реченица) написан природним гласом наставника који бисте могли директно да кажете ученицима. Без HTML-а, без емоџија, без набрајања ставки. Мора да тече разговорно, али да прати ову структуру (без наслова): (1) уводна реченица која буди радозналост или ствара изненађујући контраст, (2) реченица „У овој јединици ћете...” о исходима савладавања, (3) реченица „Унапредићете своје вештине у...” о начинима размишљања/анализе, (4) реченица „Ово је повезано са...” о значају у стварном свету, (5) реченица „Разумевање овога је важно зато што...” о ширем значају или дугорочном утицају."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Креирајте суштинска питања која се фокусирају само на широке, универзалне појмове као што су промена, докази, обрасци, односи, системи или резоновање. Не помињите никакве појмове специфичне за предмет, процесе, вокабулар или примере. Питања морају бити отвореног типа, преносива кроз све дисциплине и немогућа за одговорити само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на садржај предмета.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Потпуни одељак „Циљеви учења ученика” за целу ову јединицу. Свака ставка у листи мора бити јасан, мерљив циљ који почиње мерљивим глаголом и завршава се DOK ознаком у заградама",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Наведите све јединствене образовне стандарде који се користе било где у овој јединици и њеним лекцијама. Не додајте стандарде који се не појављују у садржају јединице. Сваки стандард мора да садржи код стандарда и опис, нпр. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
      "description": "Листа контејнера лекција за ову јединицу (само оквирно). Свака ставка мора бити не преклапајућа и јасно ограничена тако да садржај лекције не понавља садржај других лекција.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Редни број лекције. Засновано на 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Кратак наслов лекције као обичан текст."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 реченице које описују обим лекције, фокус и границе како би се спречило преклапање са другим лекцијама."
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
          "description": "Само налепите сва суштинска питања на нивоу јединице истим редоследом ако су наведена. Ако нису наведена, генеришите тачно 3 концептуална питања која се фокусирају само на широке, универзалне појмове као што су промена, докази, обрасци, односи, системи или резоновање. Не помињите никакве појмове специфичне за предмет, процесе, вокабулар или примере. Питања морају бити отвореног типа, преносива кроз све дисциплине и немогућа за одговорити само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на садржај предмета.",
          "items": {
            "type": "string"
          },
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Потпуни одељак „Кључни појмови” као листа стрингова. Сваки стринг треба да буде један појам са дефиницијом одвојеном цртом/цртицом. Пример: 'Gravity - The force that pulls objects toward each other'. Све дефиниције морају бити кратке, примерене узрасту и директно повезане са садржајем лекције.",
          "items": {
            "type": "string",
            "x-format": "{index}. {value}"
          },
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Потпуни одељак „Циљеви учења ученика” као обичан текст. Свака ставка мора бити јасан, мерљив циљ који почиње мерљивим глаголом и завршава се DOK ознаком у заградама, нпр. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
          "items": {
            "type": "string",
            "x-format": "- {value}\n"
          },
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Потпуни одељак „Усклађено са стандардима” за ову лекцију као листа. Сваки стандард мора да садржи код стандарда и опис, а код и опис морају бити потпуно исти као што су коришћени у јединици. нпр. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
        },
        "AssessPriorKnowledge": {
          "type": "object",
          "description": "Одељак за процену претходног знања. САМО Лекција 1 треба да садржи детаљан блок; СВЕ ОСТАЛЕ ЛЕКЦИЈЕ МОРАЈУ ВРАТИТИ ПРАЗНЕ НИЗОВЕ за сва поља. За Лекцију 1, структура мора да укључује ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt и AlternateOptions. 1. Осигурајте да се користе DOK 1-3 питања. 2. Укључите предусловне вештине. 3. Изаберите једну модалност и у потпуности је развијте. 4. Наведите почетне наставничке подстицаје, инструкције, очекиване одговоре, завршне подстицаје и 2 алтернативне опције.",
          "properties": {
            "ActivityInstructions": {
              "type": "array",
              "description": "Секвенцијални кораци (нпр. 'Реците: ...', 'Пројектујте или прочитајте...') за започињање активности.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "ExpectedStudentResponses": {
              "type": "array",
              "description": "Очекивани одговори ученика или уобичајене заблуде за изабрану модалност.",
              "items": {
                "type": "string",
                "x-format": "  - {value}"
              },
              "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
            },
            "ClosingTeacherPrompt": {
              "type": "array",
              "description": "Завршни наставнички кораци и подстицаји који потврђују размишљање ученика и најављују истраживање јединице.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "AlternateOptions": {
              "type": "array",
              "description": "2 кратке алтернативне опције које би наставник могао да изабере.",
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
          "description": "Потпуни одељак „Директно излагање”. Ово је ПРВА активност у учионици и не сме трајати ДУЖЕ од 10 минута.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Листа неопходних материјала (нпр. визуелна помагала, маркери, итд.)",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Наставнички сценарио организован у секвенцијалним корацима који прате ову ТАЧНУ секвенцу: (1) ПОЧЕТАК (1-2 мин), (2) УВОД (1-2 мин), (3) ДИРЕКТНО ПОУЧАВАЊЕ (4-5 мин), и (4) ВОЂЕНО УКЉУЧИВАЊЕ (2-3 мин). Не укључујте наслове у стринговима. Сваки корак мора да садржи наставнички говор (Реците:/Питајте:), наставничке радње (Урадите:/Напишите:/Нацртајте:/Прикажите:), и ако је применљиво, очекиване одговоре ученика.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Одређена наставничка радња, која почиње са „Реци: “, „Уради: “, итд."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Очекивани одговори ако је упутство било питање. Вратите празну листу ако није применљиво.",
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
              "description": "Листа уобичајених заблуда и тачног корективног језика за адресирање сваке од њих.",
              "items": {
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опис заблуде."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Корективни језик који почиње са „Реци: “."
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
              "description": "Питање за примену у стварном свету које повезује учење са сврхом/значењем/великим идејама.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "Очекивани одговори ученика који показују дубље разумевање.",
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
              "description": "Завршна провера разумевања за ученика који учи већ наведени исход учења. Ово МОРА бити индивидуални задатак који сваки ученик мора да заврши.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "нпр. „Узми 2 минута да скицираш X у свесци“ или „На папирићу, објасни зашто Y...“"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 конкретна очекивана одговора ученика.",
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
          "description": "Структурисани одељак за вођену вежбу са одвојеним пољима за материјале, упутства, диференцијацију и опционалне прилагодбе.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Потребни физички предмети за ову активност вођене вежбе (нпр. „стиропорне кугле, канап, маркери“) форматирани као листа",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Наставников сценарио организован у узастопне кораке. Сваки корак треба да комбинује наставникове радње и сценарио. Завршите са подстицајима за обилазак и праћење rada.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Одређена наставничка радња, која почиње са „Реци: “, „Уради: “, итд."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Очекивани одговори ако је упутство било питање. Вратите празну листу ако није применљиво.",
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
              "description": "Питање за завршну проверу разумевања за вођену вежбу.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 очекивана одговора ученика.",
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
              "description": "Означено са три јасно означена нивоа: Ученик у учењу језика, Ученици којима је потребна додатна подршка у усвајању, Идите даље. Захтеви: Садржај мора да диференцира наставу, а не да пружа прилагођавања или модификације (то је обрађено на другом месту). Стратегије треба да буду усмерене на то како подучавати, а не како поједноставити материјале. Активности треба да варирају по сложености и дубини, усклађене са истим циљевима учења. Сваки ниво мора да подстиче активно ангажовање, развој језика и концептуално разумевање. Користите јасан језик усмерен на наставника и учините подршке реалистичним за употребу у учионици.",
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
                      "description": "Пружите 2-3 конкретне наставне стратегије за ученике у учењу језика. Примери: пружање специфичних визуелних материјала (нпр. „Лист чињеница о планети“), употреба оквира за реченице (нпр. „Ово је постављено овде зато што...“), или тражење од ученика да гестикулирају/покажу пре него што усмено објасне. Фокусирајте се на активно ангажовање и развој језика.",
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
                      "description": "Пружите 2-3 конкретне наставне стратегије за подршку. Примери: пружање унапред нацртаних организатора/шаблона, коришћење поједностављене контролне листе са конкретним питањима за вођење, или моделовање процеса размишљања наглас (нпр. „Погледајте како ја повезујем...“). Фокусирајте се на то како да подучавате и мењате сложеност без поједностављивања материјала.",
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
                      "description": "Понудите 1-2 додатна задатка који продубљују концептуално разумевање. Укључите конкретне изазове (нпр. „Подесите размак како бисте показали...“) или питања вишег реда (нпр. „Како бисте прецизно моделовали...?“). Морају бити усклађени са истим циљевима учења.",
                      "x-format": "{items}"
                    },
                    "ExpectedStudentResponses": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Очекивани одговори ученика који показују како изгледа успех. Вратите празан низ ако није применљиво.",
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
              "description": "Овај одељак мора да садржи две врсте подршке: Опште подршке и Индивидуализоване подршке. Фокусирајте се на приступ, а не на смањење захтевности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Стратегије које нису специфичне за ученике, а које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, инструкције подељене на делове). Наведите 2-4 тачке.",
                  "x-format": "{items}"
                },
                "IndividualSupport": {
                  "type": "array",
                  "description": "Специфичне прилагодбе и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика појединачно; НЕ групишите ученице заједно. Подршка за сваког ученика треба да буде лако прегледна листа.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Име и презиме појединачног ученика који прима ове подршке."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Формални план наведен за овог ученика у упиту. Преуредите план у јасну листу. Можете га парафразирати ради бољег форматирања, али НЕ изостављајте нити додајте било какве информације."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Конкретни алати/почеци реченица/визуелни прикази/организатори за овај задатак.",
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
          "description": "Структурисани одељак за самосталну вежбу.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Потребни материјали.",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "Purpose": {
              "type": "string",
              "description": "Сврха самосталне вежбе."
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Секвенцијални задаци за самосталну вежбу.",
              "items": {
                "type": "object",
                "properties": {
                  "TaskName": {
                    "type": "string"
                  },
                  "DOKLevel": {
                    "type": "string",
                    "description": "нпр. „DOK 3“ или „DOK 3-4“"
                  },
                  "TeacherNotes": {
                    "type": "string",
                    "description": "Објашњење које повезује задатак са презентацијом/циљевима."
                  },
                  "Instruction": {
                    "type": "string",
                    "description": "Конкретна инструкција или изјава „Реците:“"
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "Примерни одговори.",
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "2-4 елемента који показују овладаност.",
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
              "description": "Питања за саморегулацију и трансценденцију.",
              "items": {
                "type": "object",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ReflectionType": {
                    "type": "string",
                    "description": "нпр. „Саморегулација“ или „Трансценденција“"
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
                  "description": "Задатак/опис за ученике који заврше раније."
                },
                "Requirements": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Одређени елементи на које ученици морају да се осврну.",
                  "x-format": "{items}"
                },
                "Justification": {
                  "type": "string",
                  "description": "Закључна реченица о примени тачних принципа."
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
          "description": "Одељак Структурисано понављање и распоређено призивање. Ова активност од 5 минута учвршћује претходне појмове и повезује их са тренутним учењем.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Потребни материјали (често нису потребни).",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "TeacherNotes": {
              "type": "string",
              "description": "Пасус са напоменама за наставника који објашњава: Како ова стратегија понављања унапређује задржавање, повезивање са појмовима претходног учења и како трансцендентно промишљање продубљује разумевање.",
              "x-format": "**{loc.TeacherNotes}:** {value}"
            },
            "ActiveRecall": {
              "type": "object",
              "description": "Упутства за наставнике која садрже подстицај за активно присећање.",
              "properties": {
                "Instruction": {
                  "type": "string",
                  "description": "Подстицај за активно присећање уз дељење у пару/групи. Мора да садржи изјаву „Реците:“."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Очекивани одговори ученика (2-3 наведена примера).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                },
                "CorrectCommonMisconceptions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Примери уобичајених заблуда и сценарији наставниковог одговора који се баве сваким од њих (нпр. „Ако ученик каже X, одговорите Y“).",
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
              "description": "Повезаност са суштинским питањем јединице.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Подстицај наставника који повезује са питањем јединице. Мора да садржи изјаву „Реците:“."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Очекивани одговори ученика (2-3 примера).",
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
              "description": "Размишљање о примени у стварном свету или ширем утицају.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Подстицај за примену у стварном свету. Мора да садржи упутство за време за размишљање (нпр. „Одвојте 30 секунди да тихо размислите, па поделите:“) и да користи изјаву „Реците:“."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Очекивани одговори ученика (2-3 примера).",
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
              "description": "Подсећање на конкретне претходно научене појмове.",
              "properties": {
                "HeaderTitle": {
                  "type": "string",
                  "description": "Јасна референца на претходни час (нпр. „Распоређено призивање (ослања се на Јединицу 2, Час 3)“)."
                },
                "Instruction": {
                  "type": "string",
                  "description": "Питање које повезује прошле и садашње појмове. Мора да садрži изјаву „Реците:“."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Детаљни критеријуми успеха или очекивани одговори ученика (2-3 примера).",
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
          "description": "Тачно 4 формативна питања за процену, по једно за сваки DOK ниво.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "нпр. „Prompt 1 (DOK 1)”"
              },
              "Question": {
                "type": "string",
                "description": "Тачно текст питања, нпр. „Зашто планете остају у орбити уместо да одлете у свемир?”"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1–2 примерна одговора који показују савладаност (наводници)."
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
          "description": "Домаћи задатак/вежба ван наставе.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Кратко објашњење циљева вежбе, нпр. „Ови задаци учвршћују данашње учење о [topic] тако што од ученика траже да посматрају обрасце из стварног света и објасне их користећи појмове уведене на часу...”"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Тачно 3 задатка за вежбу (DOK 2 или DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "нпр. „(DOK 2) Вечерас изађи напоље и напиши 3–4 реченице...”"
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
              "description": "Задатак за размишљање за ученике.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "нпр. „Размишљање: Напиши 2–3 реченице као одговор на један подстицај:”"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Тачно 4 опције питања за размишљање у наводницима."
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
}
};
