window.prompts_lab_sr_Cyrl = {
  STEP0_PROMPT_TEMPLATE: `Направи оквир јединице и структуру часа користећи информације испод. НЕ пиши пуне планове часа.
                    
На основу Предмета јединице, образовних стандарда, описа/инструкције јединице, разреда, трајања школског часа (у минутима) и траженог броја часова, генериши JSON одговор који укључује кохерентан UnitDescription и не-преклапајућу листу „контејнера“ часова.

Предмет јединице:
{{$Subject}}

Назив јединице:
{{$Name}}

Опис/инструкција јединице:
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
- Свако питање МОРА бити пуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефиницијска.
- Питања МОРАЈУ бити усмерена на широке, универзалне идеје (као што су промена, докази, обрасци, односи, системи или закључивање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива ван ове јединице.
- Питања МОРАЈУ бити поново употребљена дословно у сваком часу у оквиру јединице.

Шта треба генерисати:
- Излаз МОРА бити валидан JSON који одговара шеми.
- ОБАВЕЗНО: У потпуности попуни сва својства унутар објекта „UnitDescription“:
  - „Description“: Напиши пасус од 4–5 реченица који описује кључни фокус јединице и њено наративно путовање.
  - „StudentLearningObjectives“: Наведи 3–5 кључних мерљивих циљева учења за јединицу.
  - „StandardsAligned“: Наведи све стандарде који се обрађују током јединице.
  - „EssentialQuestions“: Тачно 3 концептуална питања која прате правила изнад.
- ГЕНЕРИШИ листу „Lessons“ која садржи тачно {{$NumberOfItems}} часова.
  - Сваки час мора да садржи „lessonNumber“ (индекс од 1), „lessonName“ и „lessonDescription“ (2–4 реченице које описују обим часа).

Ограничења:
- Одржи јединицу и сваки час усклађеним са фокусом јединице.
- Обезбеди логичан редослед од основних идеја ка сложенијем моделовању.
- Тачност: сав садржај мора бити научно тачан и примерен узрасту.

Излаз МОРА бити валидан JSON који одговара шеми. Користи компактно форматирање (без празних редова).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Направите ЈЕДАН план лабораторијског часа (НЕ план целе јединице, НЕ више часова) користећи информације испод.
МОРАМАТЕ избацити важећи JSON који тачно одговара достављеној JSON шеми. Не укључујте никакве додатне кључеве. Користите компактно JSON форматирање (без додатних празних редова).
Предмет јединице:
{{$Subject}}
Назив јединице:
{{$Name}}
Опис/упутство јединице:
{{$UserPrompt}}
Разред:
{{$GradeLevel}}
Трајање часа у минутима
{{$ClassDuration}}
Ресурси/медији за употребу:
{{$MediaContext}}
Садржај јединице:
{{$ParentUnitData}}
Стандарди са којима се усклађује:
{{$Standards}}
Приложени садржај часа:
{{$AttachedLesson}}

Кључна питања јединице (КОРИСТИТЕ ИХ РЕЧ ПО РЕЧ):
{{$UnitEssentialQuestions}}

Ако је горње поље за Кључна питања јединице празно, генеришите тачно 3 концептуална питања према овим правилима:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефиницијска.
- Питања МОРАЈУ бити усмерена на шире, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива ван ове јединице.

УЧЕНИЦИ СА ИНДИВИДУАЛИЗОВАНОМ ПОДРШКОМ (МОРАЈУ се користити САМО унутар Experiment.AccommodationsAndModifications; користите имена ученика/планове тачно онако како су написани):
{{$LearningPlans}}

ВАЖНА ПРАВИЛА САДРЖАЈА:
- Држите час усклађен са фокусом јединице: развијање и коришћење модела за описивање атомског састава једноставних молекула и/или проширених структура.
- Укључите кратке, високонивoвске везе са другим релевантним DCI где је прикладно, али задржите час усредсређен на моделовање и резоновање о структури и својствима (без дубоке математике, без балансирања једначина осим ако стандарди то изричито захтевају).
- Обезбедите да сви делови часа одражавају Опсег/Ограничења часа наведене у контексту јединице; избегавајте увођење нових главних концепата који припадају другим часовима.
- EssentialQuestions: МОРАЈУ тачно бити једнака кључним питањима на нивоу јединице (исти текст, исти редослед).
- AssessPriorKnowledge: САМО ако је LessonNumber == 1, напишите 150–250 речи и пратите обавезну структуру у опису шеме. Ако LessonNumber != 1, вратите "" (празан стринг).
- Фазе лабораторије (Question, Research, Hypothesize, Experiment, Analyze, Share): Пратите специфичне наставне захтеве и стрингове „Purpose:“ за сваку фазу како су дефинисани у JSON шеми.
- Experiment.AccommodationsAndModifications мора да укључи општу подршку, а затим индивидуалну подршку за сваког ученика наведеног у {{$LearningPlans}}.
- StudentPractice МОРА да садржи пасус TeacherNotes који почиње са 'These tasks reinforce today's learning about ____ by ______.', листу од 2–3 задатка са DOK 2-4 и критеријумима успеха, и међусобно преплитање ако је предмет математика.

ЗАХТЕВИ ЗА ИЗЛАЗ:
- Излаз МОРА бити важећи JSON који тачно одговара достављеној шеми.
- Излаз МОРА бити САМО ЈЕДАН план часа.
- Без HTML-а. Без емоџија. Без markdown-а. Обичан текст унутар string поља.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
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
          "description": "Опис јединице као једна целовита проза пасусна целина у природном наставничком тону од 4–5 потпуних реченица коју бисте могли директно да изговорите ученицима. Без HTML-а, без емодџија, без набрајања. Мора да тече разговорно, али да прати ову структуру (без наслова): (1) уводна реченица која буди радозналост или прави изненађујући контраст, (2) реченица са „У овој јединици ћете...” о исходима усвајања, (3) реченица са „Развићете своје вештине у...” о мисаоним/аналитичким способностима, (4) реченица са „Ово је повезано са...” о значају за стварни свет, (5) реченица са „Разумевање овога је важно јер...” о ширем значају или дугорочном утицају."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Креирајте суштинска питања која се фокусирају само на широке, универзалне појмове као што су промена, докази, обрасци, односи, системи или закључивање. Не помињите ниједне појмове специфичне за предмет, процесе, вокабулар или примере. Питања морају бити отвореног типа, применљива у свим дисциплинама и немогућа за одговор само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на предметну материју.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Комплетан оделак 'Учникови исходи учења' за целу ову јединицу. Свакa ставка листе мора бити јасан, мерљив исход који почиње мерљивим глаголом и завршава ознаком ДOK у заградама",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Наведите све јединствене образовне стандарде коришћене било где у овој јединици и њеним лекцијама. Не додајте стандарде који се не појављују у садржају јединице. Свак стандарда мора да садржи код стандарда и опис, нпр. 'МС-ЕСС1-1: Развијте и користите модел система Земља–Сунце–Месец да бисте описали цикличне обрасце месечевих мена, помрачења и годишњих доба.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Комплетан оделак 'Кључни вокабулар' као листа стрингова. Свакa стринг треба да буде један термин са дефиницијом одвојеном цртичком/косом цртом. Пример: 'Гравитација - Сила која привлачи тела једно ка другом'. Све дефиниције морају бити кратке, прилагођене узрасту и директно повезане са садржајем лекције.",
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
      "description": "Списак организационих целина лекција за ову јединицу (само оквир). Свакa ставка мора бити непоклапајућа и јасно обухваћена тако да се садржај лекција не понавља између лекција.",
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
            "description": "2–4 реченице које описују обим лекције, фокус и границе како би се спречило поклапање са другим лекцијама."
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
      "description": "Само налепите сва суштинска питања која су генерисана на нивоу јединице истим редоследом.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Комплетан оделак 'Учникови исходи учења' као обичан текст. Свакa ставка мора бити јасан, мерљив исход који почиње мерљивим глаголом и завршава ознаком ДOK у заградама, нпр. 'Моделујте како Земљина ротација око своје осе узрокује дан и ноћ (ДOK 2).'",
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
      "description": "Комплетан оделак 'Усклађено са стандардима' као обичан текст за ову лекцију. Свак стандарда мора да садржи код стандарда и опис, а код и опис морају бити потпуно исти као у јединици. нпр. 'МС-ЕСС1-1: Развијте и користите модел система Земља–Сунце–Месец да бисте описали цикличне обрасце месечевих мена, помрачења и годишњих доба.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Изаберите дословно кључни вокабулар за ову лекцију из вокабулара на нивоу јединице наведеног у промпту. Не измишљајте нове речи. Морате поново искористити тачно оригинално наводење из Степ 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Одељак Процена предзнања. САМО Лекција 1 треба да садржи детаљан блок; СВЕ ОСТАЛЕ ЛЕКЦИЈЕ МОРАЈУ Вратити NULL или изостaviti ово поље. За Лекцију 1, структура мора да укључује: 1. Овај одељак укључите само у прву лекцију јединице. 2. Осигурајте да се користе ДOK 1-3 подстицаји. 3. Укључите предуслове вештина потребне за исходе учења ученика. 4. Изаберите један модалитет са ове листе и потпуно га разрадите: постављање питања, K-W-L, визуали, концепт мапе, рефлексивно писање, антипативни водичи, оцењивање вокабулара. 5. Почетни наставников подстицај са 'Реците:' изјавом. 6. Јасна упутства и шаблон/структура за изабрани модалитет. 7. Одељак 'Очекивани одговори ученика'. 8. Завршни наставников 'Реците:' подстицај. 9. Након потпуне разраде једног модалитета, обезбедите 2 кратке алтернативне опције.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Јасна упутства и шаблон/структура за изабрани модалитет. Нпр. 'Реците: \"Пре него што почнемо...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Предвиђени одговори ученика или честе заблуде за изабрани модалитет.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Завршни наставников 'Реците:' подстицај који потврђује разматрање ученика и најављује истраживање јединице."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 кратке алтернативне опције које би наставник могао да изабере.",
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
      "x-format": "### {green}({loc.LabQuestionTitle})\n\n**{loc.Purpose}:** {loc.LabQuestionPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Водите наставника тако да ученици посматрају феномен, идентификују нешто збуњујуће и поставе смислено питање које ће водити истраживање.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Дословно - Сврха: Посматрати феномен, идентификовати нешто збуњујуће и поставити смислено питање које ће водити истраживање."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Списак потребних материјала (нпр. визуелна помагала, маркери итд.)",
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
              "description": "Корак-по-корак наставникова упутства, радње и „Реци:“ подстицаји за представљање феномена и позивање на питања."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 очекивана ученичка питања или идеје о феномену."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "Последњи корак у наставниковим упутствима. Започните овај низ следећим редним бројем који долази после претходних упутстава (нпр. „8. Завршни корак: Реци: ...“) и наведите велико питање које ћемо данас истраживати."
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
      "x-format": "### {green}({loc.LabResearchTitle})\n\n**{loc.Purpose}:** {loc.LabResearchPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Усмерите наставника тако да ученици науче основне информације, речник и претходно знање потребно за разумевање теме.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Реч по реч: Сврха: Прикупити основне информације, речник и претходно знање потребно за разумевање теме и припремити се за информисано истраживање."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Списак потребних материјала (нпр. визуелна помагала, маркери итд.)",
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
              "description": "Корак-по-корак наставникова упутства, радње и „Реци:“ подстицаји за објашњавање основног знања, речника и моделовање феномена."
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
                    "description": "Ученичка заблуда"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Шта наставник треба да каже да би je исправио"
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
      "x-format": "### {green}({loc.LabHypothesizeTitle})\n\n**{loc.Purpose}:** {loc.LabHypothesizePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Усмерите наставника тако да ученици развију проверљиву прогнозу.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Реч по реч: Сврха: Развити проверљиву прогнозу или тврдњу засновану на њиховом истраживању и образложењу, постављајући јасно очекивање о томе шта верују да ће се десити."
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
              "description": "Наставникова упутства. Укључите „Реци:“ подстицаје. Дајте конкретно упутство као што је „Запишите на табли:“ праћено markdown набрајаном листом од 4-5 почетних формулација хипотезе."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 примера очекиваних хипотеза."
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
      "x-format": "### {green}({loc.LabExperimentTitle})\n\n**{loc.Purpose}:** {loc.LabExperimentPurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Усмерите наставника тако да ученици спроведу структурисано истраживање.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Реч по реч: Сврха: Спровести структурисано истраживање – практично, симулирано или аналитичко – како би се тестирала њихова хипотеза и прикупили докази посматрањем или мерењем."
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
              "description": "Корак-по-корак наставникова упутства за организовање експеримента, давање упутстава и обилазак током рада."
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
                      "description": "За одговоре „Иди даље“."
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
              "description": "Овај одељак мора да садржи две врсте подршке: опште подршке и индивидуализоване подршке. Фокусирајте се на приступ, а не на снижавање захтева.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Стратегије које нису специфичне за појединачне ученике, а које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, подељена упутства). Наведите 2-4 ставке у набрајаној листи."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Посебне прилагодбе и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика појединачно; немојте груписати ученике заједно. Подршка за сваког ученика треба да буде лако прегледна листа.",
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
                        "description": "Формални план достављен за овог ученика у задатку. Рашчланите план у јасну листу. Можете парафразирати да бисте побољшали формат, али немојте изоставити или додати било какве информације."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретни алати/почеци реченица/визуелни прикази/организатори за овај задатак."
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
      "x-format": "### {green}({loc.LabAnalyzeTitle})\n\n**{loc.Purpose}:** {loc.LabAnalyzePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Усмерите наставнике тако да ученици тумаче податке које су прикупили.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Сврха: Тумаче податке које су прикупили, идентификују обрасце, процењују своју хипотезу и састављају закључке засноване на доказима."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Листа потребних материјала (нпр. визуелна помагала, маркери итд.)",
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
                    "description": "Наставников инструкцијски текст (нпр. „Наведите почетке реченица:“). Немојте укључивати нумерацију; она се обрађује аутоматски."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Опционе тачке. МОРАМ да обезбедите листу од 4-5 почетака реченица када корак то тражи. МОРАМ да обезбедите листу од 4-5 подстицаја за обилазак учионице када корак то тражи. У супротном, наведите празну листу."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Корак-по-корак наставникова упутства. МОРАМ да укључим тачно један корак који је посебно за почетке реченица и попуните његов низ „Bullets“. МОРАМ да укључим тачно један корак који је посебно за подстицаје за обилазак учионице и попуните његов низ „Bullets“."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Очекивани одговори или довршавања шаблона реченица од стране ученика."
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
      "x-format": "### {green}({loc.LabShareTitle})\n\n**{loc.Purpose}:** {loc.LabSharePurpose}\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Усмерите наставнике тако да ученици јасно комуницирају своја открића.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Реч по реч: Сврха: Јасно комуницирају своја открића другима, користећи доказе да објасне шта су открили, зашто је то важно и како доприноси дубљем разумевању."
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
                    "description": "Наставников инструкцијски текст (нпр. „Напишите на табли:“). Немојте укључивати нумерацију; она се обрађује аутоматски."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Опционе тачке. МОРАМ да обезбедите листу од 4-5 ставки када корак пружа структуру за дељење. МОРАМ да обезбедите листу од 4-5 наставничких подстицаја (питања) када корак то тражи. У супротном, наведите празну листу."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Корак-по-корак наставникова упутства. МОРАМ да укључим тачно један корак који је посебно за обезбеђивање структуре за дељење и попуните његов низ „Bullets“. МОРАМ да укључим тачно један корак који је посебно за наставничке подстицаје и попуните његов низ „Bullets“."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Очекиване идеје које ученици деле."
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
      "description": "Пун одељак „Понављање и распоређено дозивање из меморије“.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Постављање ученицима да се присете НОВОГ градива из ДАНАШЊЕ лекције.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Наставников подстицај који почиње са „Реците:“."
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
          "description": "Наставников подстицај који повезује са питањем јединице.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Наставников подстицај који почиње са „Реци: “."
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
          "description": "Питање које ученике подстиче да повежу учење са другим сценаријима из стварног света.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Наставников подстицај који почиње са „Реци: “."
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
          "description": "Подсетник из конкретне претходне лекције/јединице.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Контекстуална реченица попут „Раније у овој лекцији, ученици су научили...“"
            },
            "Say": {
              "type": "string",
              "description": "Наставников подстицај који почиње са „Реци: “."
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
      "description": "Тачно 4 подстицаја за формативно оцењивање, по један за сваки DOK ниво.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "нпр. „Подстицај 1 (DOK 1)“"
          },
          "Question": {
            "type": "string",
            "description": "Тачан текст питања."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1–2 примера одговора који показују савладаност."
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
      "description": "Домаћи задатак/вежбање ван наставе.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Напомене за наставника које објашњавају како ови задаци за вежбање учвршћују данашње учење и јачају дугорочно памћење."
        },
        "PracticeTasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Тачно 3 задатка за вежбање (DOK 2 или DOK 3).",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "нпр. „(DOK 2) Вечерас изађи напоље и напиши 3–4 реченице...“"
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
              "description": "нпр. „Размишљање: Напиши 2–3 реченице као одговор на један подстицај:“"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Тачно 4 опције за питања за размишљање."
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
}
};
