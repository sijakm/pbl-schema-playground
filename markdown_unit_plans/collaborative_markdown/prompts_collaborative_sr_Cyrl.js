window.prompts_collaborative_sr_Cyrl = {
  STEP0_PROMPT_TEMPLATE: `Направи нацрт јединице и структуру часа користећи информације испод. НЕ пиши пуне планове часа.
                    
На основу Предмета јединице, образовних стандарда, Описа/упутства за јединицу, Разреда, Трајања школског часа (у минутима) и траженог Броја часова, генериши JSON одговор који укључује кохерентан UnitDescription и непоклапајућу листу „контејнера“ за часове.

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

Захтеви за суштинска питања:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефинициона.
- Питања МОРАЈУ бити усмерена на шире, универзалне идеје (као што су промена, докази, обрасци, односи, системи или закључивање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива између дисциплина и применљива ван ове јединице.
- Питања МОРАЈУ бити поново употребљена дословно у сваком часу у оквиру јединице.

Шта треба генерисати:
- Излаз МОРА бити важећи JSON који одговара шеми.
- ОБАВЕЗНО: Потпуно попуни сва својства унутар објекта "UnitDescription":
  - "Description": Напиши пасус од 4–5 реченица који описује основни фокус јединице и њено наративно путовање.
  - "StudentLearningObjectives": Наведи 3–5 кључних мерљивих циљева учења за јединицу.
  - "StandardsAligned": Наведи све стандарде који се обрађују током јединице.
  - "EssentialQuestions": Тачно 3 концептуална питања која прате горенаведена правила.
- ГЕНЕРИШИ листу "Lessons" која садржи тачно {{$NumberOfItems}} часова.
  - Сваки час мора да садржи "lessonNumber" (индекс који почиње од 1), "lessonName" и "lessonDescription" (2–4 реченице које описују обим часа).

Ограничења:
- Одржи усклађеност јединице и сваког часа са фокусом јединице.
- Обезбеди логичко низaње од темељних идеја ка сложенијем моделовању.
- Тачност: Сав садржај мора бити научно тачан и примерен узрасту.

Излаз МОРА бити важећи JSON који одговара шеми. Користи компактно форматирање (без додатних празних линија).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Направите ЈЕДАН план часа у стилу сарадничког учења (НЕ план целе наставне целине, НЕ више часова) користећи информације испод.

МОРАЈТЕ да излаз буде валидан JSON који тачно одговара датом JSON шеми (LessonPlanResponse са једним објектом „LessonPlan“). Не укључујте никакве додатне кључеве. Користите компактно JSON форматирање (без додатних празних редова).

КОНТЕКСТ НАСТАВНЕ ЦЕЛИНЕ (контекст само за читање ради кохерентности):
Предмет наставне целине:
{{$Subject}}

Садржај наставне целине:
{{$ParentUnitData}}

Опис/упутство наставне целине: Направите наставну целину користећи следеће стандарде:
{{$Standards}}

Разред:
{{$GradeLevel}}

Ресурси/медији за коришћење:
{{$MediaContext}}

Трајање часа у минутима:
{{$ClassDuration}}

Наслов часа:
{{$Name}}

Опис/упутство наставне целине:
{{$UserPrompt}}

Кључна питања наставне целине (КОРИСТИТЕ ИХ ИСТОВЕТНО):
{{$UnitEssentialQuestions}}

Ако горња кључна питања наставне целине нису попуњена, генеришите тачно 3 концептуална питања према овим правилима:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефиницијска.
- Питања МОРАЈУ бити усмерена на широке, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива изван ове наставне целине.

УЧЕНИЦИ СА ИНДИВИДУАЛИЗОВАНОМ ПОДРШКОМ (МОРАЈУ се користити САМО унутар CollaborativeActivities.AccommodationsAndModifications; користите имена/планове ученика тачно онако како су написани):
{{$LearningPlans}}

ВАЖНА ПРАВИЛА САДРЖАЈА (Сараднички стил):
- Одржите час у складу са фокусом наставне целине и горњим оквиром/ограничењима часа; избегавајте увођење нових главних концепата који припадају другим часовима.
- Културна релевантност и инклузија: укључите више перспектива; повежите са различитим заједницама; избегавајте стереотипе; прикажите утицаје на све укључене.
- Преносивост: уградите примену у стварном свету и резоновање током целог часа.
- Унакрсно повезивање: када ученици увежбавају/примењују, мешајте стратегије или концепте (не блокирано увежбавање). Ако час садржи било какво математичко резоновање, укључите најмање једну DOK 3–4 унакрсно повезану ставку која меша садашњи садржај са концептом из ранијег часа и захтева да се оправда избор стратегије.

ПРАВИЛА ПО ПОЉИМА:
- EssentialQuestions: МОРА тачно да буде једнако кључним питањима на нивоу целине (исти текст, исти редослед).
- AssessPriorKnowledge: Ако је овај део обавезан (нпр. за први час или када се уводе нови главни концепти), напишите 150–250 речи пратећи тражену структуру из описа шеме. У супротном, вратите "" (празан стринг).
- Instruction:
  - InstructionsForTeachers: Ови кораци морају бити детаљни и морају обухватити сво ново учење за час са објашњењима како да се оно предаје. Будите прецизни.
  - Морају укључити како да се уведе нови садржај предмета (уводне активности, водећа питања, прелази).
  - Морају укључити садржај и скрипту за наставника да директно предаје садржај (дефиниције, примери, кључне тачке, објашњења).
  - Структура мора природно да тече са ознакама Say/Do/Ask/Listen for/Write.
  - ВАЖНО: Не укључујте наслове великим словима (као HOOK, INTRODUCTION итд.) за одељке.
  - ВАЖНО: Не укључујте трајања у минутима за појединачне упуте или кораке.
  - TranscendentThinking: Наведите једно питање за примену у стварном свету које повезује учење са сврхом/смислом, затим ознаку 'Expected Student Responses:' и 2–3 примера.
- GroupStructureAndRoles:
  - Излаз МОРА бити усмерен ка наставнику.
  - GroupSize: наведите 'pairs', 'triads' или '4-5 students'.
  - TeacherSay: 1–2 реченице које објашњавају да су улоге важне и да ћете моделovati како свака улога изгледа.
  - Roles: Морају бити дефинисане тачно ових пет улога (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) са конкретним дужностима повезаним са CollaborativeActivities часа.
  - Rotation: Једна реченица која наводи када се улоге ротирају у ОВОМ часу (нпр. „Rotate roles after Phase A and again before the gallery walk.”).

CollaborativeActivities:
- Направите међузависну сарадничку активност (сарадничка замена за вођену вежбу) усклађену са оквиром овог часа.
- Сваки ученик мора да допринесе и групе морају да произведу заједнички производ или одлуку.
- Укључите временске оријентире, teacher Say: скрипту, промптове за обилазак/праћење рада + очекиване одговоре, и брзу проверу где СВИ ученици одговарају + очекиване одговоре.
- Укључите Differentiation (3 нивоа) и AccommodationsAndModifications (General + IndividualSupport тачно како је наведено).
- Ако је ово час математике, укључите један DOK 3–4 унакрсно повезан проблем који меша садашњи садржај са претходним часом/целином и објасните зашто је укључен; у супротном, изоставите унакрсно повезивање.
- ReflectionOnGroupDynamics:
  - Мора бити око 5 минута.
  - Укључите 2–4 питања за ученичко промишљање (нпр. шта је добро функционисало, изазов, да ли је глас свакога био чујан).
  - Обезбедите потезе за вођење наставника (брзи излазни запис, самопроцена групе 1–5, или двоминутна дискусија), са наставничким питањима и очекиваним одговорима.
  - Изричито повежите промишљање назад са CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Иста структура и захтеви као и Direct Instruction верзија (види опис шеме).
  - Мора да садржи проверу призивања знања која се повезује са ЈЕДНИМ претходним концептом из часа, уз навођење броја тог претходног часа.
- StudentPractice:
  - Домаћи/ванчасовна вежба.
  - Мора да прати тачан тражени формат из описа шеме (укључујући ознаке ✅Expected Student Responses).

ЗАХТЕВИ ЗА ИЗЛАЗ:
- Излаз МОРА бити валидан JSON који тачно одговара датом шеми.
- Излаз МОРА бити САМО један план часа.
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
          "description": "Јединица је као прича која почиње једним неочекиваним питањем и води вас ка дубљем разумевању. У овој јединици ћете овладати кључним знањима и умењима која ће вам помоћи да повезујете идеје и објашњавате их јасно. Ојачаћете своје вештине у размишљању, анализи и доношењу закључака на основу онога што примећујете. Ово је важно јер се оно што учите повезује са стварним ситуацијама, одлукама и проблемима са којима се људи сусрећу сваког дана. Разумевање овога је значајно зато што вам помаже да градите трајно знање које можете да користите и сада и касније."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Направите суштинска питања која се фокусирају само на шире, универзалне појмове као што су промена, доказ, обрасци, односи, системи или закључивање. НЕ помињите никакве термине, процесе, вокабулар или примере специфичне за предмет. Питања морају бити отвореног типа, преносива кроз све дисциплине и немогућа за одговорити само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на сам садржај предмета.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Потпуни одељак „Исходи учења ученика“ за целу ову јединицу. Свака ставка листе мора бити јасан, мерљив исход који почиње мерљивим глаголом и завршава се ознаком DOK у заглади.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Наведите све јединствене образовне стандарде који се користе било где у овој јединици и њеним лекцијама. НЕ додавајте стандарде који се не појављују у садржају јединице. Сваки стандард мора да садржи шифру и опис стандарда, нпр. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
      "description": "Листа контејнера за лекције за ову јединицу (само оквирно). Свака ставка мора бити не-преклапајућа и јасно обухваћена тако да садржај лекције не понавља садржај других лекција.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Редни број лекције. 1 Based."
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
          "description": "Кратак описни наслов за лекцију. НЕ укључујте емоџије овде."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Само налепите сва суштинска питања на нивоу јединице истим редоследом ако су наведена. Ако нису наведена, генеришите тачно 3 концептуална питања која се фокусирају само на шире, универзалне појмове као што су промена, доказ, обрасци, односи, системи или закључивање. НЕ помињите никакве термине, процесе, вокабулар или примере специфичне за предмет. Питања морају бити отвореног типа, преносива кроз све дисциплине и немогућа за одговорити само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на сам садржај предмета.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Листа стрингова у формату „Термин - Дефиниција“. Дефиниције морају бити кратке, примерене узрасту и повезане са овом лекцијом.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 мерљива исхода, од којих се сваки завршава ознаком DOK у заглади.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Усклађени образовни стандарди за ову лекцију. Морају се тачно поклапати са стандардима јединице у коду и опису.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Одељак Процена претходног знања. САМО Лекција 1 треба да садржи детаљан блок; СВЕ ОСТАЛЕ ЛЕКЦИЈЕ МОРАЈУ ВРАТИТИ NULL или изоставити ово поље. За Лекцију 1, структура мора да садржи ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt и AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Јасна упутства и шаблон/структуру за изабрану модалност. Нпр. 'Реците: \"Пре него што почнемо да градимо...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Очекивани одговори ученика или честе заблуде за изабрану модалност.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Завршни наставников подстицај у облику „Реците:“ који потврђује размишљање ученика и најављује истраживање јединице."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 кратке алтернативне опције које наставник може да изабере.",
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
          "description": "Одељак „Упутство“ за колаборативну лекцију (еквивалентно директном излагању).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Листа материјала.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Скрипт за наставника организован у узастопне кораке. Ови кораци морају заједно да делују као свеобухватан водич који помаже наставнику да испоручи нови садржај. Мора да укључује како да се уведе нови садржај теме (уводи, вођена питања, прелази), као и садржај/скрипт за наставника за директно поучавање (дефиниције, примери, кључне тачке, објашњења). Упутства треба да буду детаљна и да обухвате све ново градиво за час са објашњењима како да се оно предаје. Будите прецизни. Не користите НАСЛОВЕ СВИХ ВЕЛИКИХ СЛОВА за одељке и не укључујте временске ознаке.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Акција наставника, нпр. Реците: '...', Урадите: '...', Питајте: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Очекивани одговори ако је упутство било питање. Вратите празан низ ако није применљиво.",
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
              "description": "Списак уобичајених заблуда и тачан језик за исправљање сваке од њих.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опис заблуде."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Језик за исправљање који почиње са 'Реците: '."
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
              "description": "Питање о примени у стварном свету које повезује учење са сврхом/значењем.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 очекивана одговора ученика који показују дубље разумевање.",
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
              "description": "Завршно питање за проверу разумевања.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 очекивана одговора ученика.",
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
          "description": "Величина групе, скрипт наставника, дефинисане улоге и ротирање.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "нпр. 'парови', 'тројке' или '4-5 ученика'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Скрипт наставника који објашњава улоге."
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
              "description": "Реченица која наводи када се улоге ротирају."
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
          "description": "Подстицаји који помажу групама да креирају сопствене норме сарадње.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Међузависни групни рад (колаборативна замена за Вођену вежбу). Усмерен ка наставнику, високо структуриран и осмишљен тако да ученици не могу сами да заврше задатак. Мора да укључи: (а) јасну међузависност (џигсо, изградњу консензуса, галеријску шетњу, структурисани изазов за решавање проблема или слично), (б) експлицитно време за сваку фазу (нпр. '8 минута дискусије, 2 минута припреме одговора'), (в) скриптирану наставничку фасилитацију користећи 'Реците:' изјаве током целог процеса, (г) заједнички групни производ (тврдња, модел, табела, сет решења, галеријски артефакт итд.), (д) подстицаје за циркулацију са очекиваним одговорима ученика, (ђ) најмање једну проверу одговора свих ученика (таблице за писање, брзо писање, гласање, палчеви итд.) са очекиваним одговорима, (е) кратко питање за проверу + очекиване одговоре, (ж) диференцијацију у три нивоа усмерену на инструкцију (не на прилагођавања), и (з) ПрилагођавањаИМодификације раздвојене на Општа подршка и ИндивидуалнаПодршка, тачно у складу са датим ученицима/плановима. Обезбедите културну релевантност и инклузију позивањем на више перспектива и осигурањем равноправног учешћа.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Комплетна листа наставничког и ученичког материјала који се користе у овој колаборативној активности. Укључите све припремљене ставке (картице са подстицајима, оквире реченица, картице са улогама, чек-листе, рубрике, листове за галеријску шетњу, табле за писање, тајмере, визуелне материјале, листе речи итд.). По једна ставка по елементу низа; без места за попуњавање.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Скрипт наставника за колаборативну активност (циљ је 6-8 нумерисаних корака). Осигурајте да је један корак изричито 'Подстицаји за циркулацију:' и да садржи конкретна питања која треба поставити групама док раде.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Одређена акција наставника, која почиње са 'Реците: ', 'Урадите: ', или тачно 'Подстицаји за циркулацију:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "ПОПУНИТИ ОВО САМО ако је инструкција 'Подстицаји за циркулацију:'. Наведите конкретна питања која треба поставити групама током циркулације. ИЗОСТАВИТЕ ово својство ако није применљиво.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "Питање које треба поставити групи."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Очекивани одговори на овај конкретан позив за размену. ИЗОСТАВИТЕ ово својство ако га нема.",
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
                    "description": "Очекивани одговори ако је Упутство било директно питање целом разреду. ИЗОСТАВИТЕ ово својство ако није применљиво.",
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
              "description": "Означено са три јасно означена нивоа: Ученици који уче језик, Ученици којима је потребна додатна подршка, Идемо даље. Захтеви: Садржај мора да буде диференциран, а не да пружа адаптације или модификације (то се решава на другом месту). Стратегије треба да се усредсреде на то како се подучава, а не на то како се материјали поједностављују. Активности треба да варирају у сложености и дубини, усклађене са истим циљевима учења. Сваки ниво мора да подстиче активно ангажовање, развој језика и концептуално разумевање. Користите јасан језик усмерен ка наставнику и обезбедите да подршка буде реалистична за употребу у учионици.",
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
                      "description": "Пружите 2-3 конкретне наставне стратегије за ученике који уче језик. Примери: пружање конкретних визуелних подршки (нпр. 'Лист са чињеницама о планети'), коришћење реченичних оквира (нпр. 'Ово је постављено овде зато што...'), или тражење од ученика да гестом/показивањем покажу пре него што усмено објасне. Фокусирајте се на активно ангажовање и развој језика."
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
                      "description": "Пружите 2-3 конкретне наставне стратегије за скелетну подршку. Примери: пружање унапред нацртаних организатора/шаблона, коришћење поједностављене контролне листе са конкретним усмеравајућим питањима, или моделовање процеса размишљања наглас (нпр. 'Погледајте како ја усклађујем...'). Фокусирајте се на то како да подучавате и да варирате сложеност без поједностављивања материјала."
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
                      "description": "Пружите 1-2 проширена задатка који продубљују концептуално разумевање. Укључите конкретне изазове (нпр. 'Подесите размак да бисте показали...') или питања вишег реда (нпр. 'Како бисте моделовали... тачно?'). Морају бити усклађени са истим циљевима учења."
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
              "description": "Овај одељак мора да садржи две врсте подршке: Опште подршке и Индивидуализоване подршке. Фокус је на приступу, а не на смањењу захтевности.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Стратегије које нису специфичне за ученика и које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, инструкције подељене у делове). Наведите 2-4 тачке."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Конкретне адаптације и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика појединачно; НЕ групишите ученике заједно. Подршке за сваког ученика треба да буду лаке за преглед у облику листе.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Име и презиме појединачног ученика који добија ове подршке."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Формални план наведен за овог ученика у упутству. Разложите план у јасну листу. Можете парафразирати да бисте побољшали формат, али НЕ изостављајте нити додајте било какве информације."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретни алати/реченични оквири/визуелни прикази/организатори за овај задатак."
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
          "description": "Ученици процењују колико је група добро радила заједно. МОРА да садржи тачно 3 секмента редом: подстицај за кратку анализу, опције за вођење разговора и завршни подстицај који повезује са нормама.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Кратак подстицај за анализу за ученике након сарадње.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Тачан текст који наставник изговара, нпр. 'Реците: \"Одвојте два минута да размислите: Шта је наша група данас добро урадила?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Очекивани одговори ученика (2-3 примера)."
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
              "description": "Тачно 3 наставничка корака за вођење разговора из којих се бира (нпр. Брзи излазни запис, оцена групне сарадње од 1-5, двоминутно дељење у целом разреду). Само опције, без очекиваних одговора."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "Завршни наставнички подстицај који повезује размишљања са смерницама за сарадњу. нпр. 'Реците: \"Која је ваша норма данас највише помогла?\"'"
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
          "description": "Комплетан одељак 'Преглед и распоређено враћање на научено'.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Листа материјала (нпр. ['None'] или ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Кратка напомена која објашњава како вежба присећања подржава задржавање знања."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Подстицање ученика да се присете НОВОГ градива са ДАНАШЊЕГ часа.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Наставнички подстицај."
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
                  "description": "1-2 заблуде и како их исправити."
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
              "description": "Наставнички подстицај који повезује са питањем јединице.",
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
              "description": "Подстицај за примену у стварном свету.",
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
              "description": "Присећање из одређеног претходног часа/јединице.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "Претходни час на који се позива, нпр. 'Draws from Unit 2, Lesson 3'"
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
          "description": "Тачно 4 подстицаја за формативно оцењивање, по један за сваки DOK ниво.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "нпр. 'Prompt 1 (DOK 1)'"
              },
              "Question": {
                "type": "string",
                "description": "Тачан текст питања, нпр. 'Why do planets stay in orbit instead of flying off into space?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 примерна одговора који показују савладаност (стављена у наводнике)."
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
              "description": "Кратко објашњење циљева вежбања, нпр. 'These tasks reinforce today's learning about [topic] by asking students to observe real-world patterns and explain them using the concepts introduced in class...'"
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
                    "description": "нпр. '(DOK 2) Вечерас, изађи напоље и напиши 3-4 реченице...'"
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
              "description": "Задатак за рефлексију за ученице.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "нпр. 'Reflection: Write 2-3 sentences responding to one prompt:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Тачно 4 опције питања за рефлексију у наводницима."
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
}
};
