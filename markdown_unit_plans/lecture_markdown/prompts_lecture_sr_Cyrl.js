window.prompts_lecture_sr_Cyrl = {
  STEP0_PROMPT_TEMPLATE: `Направи преглед јединице и структуру часа користећи информације испод. НЕ пиши пуне планове часа.
                    
На основу Предмета јединице, образовних стандарда, Описа/упутства за јединицу, Нивоа разреда, Трајања школског часа (у минутима) и траженог Броја часова, генериши JSON одговор који укључује кохерентан UnitDescription и непоклапајућу листу „контејнера“ за часове.

Предмет јединице:
{{$Subject}}

Назив јединице:
{{$Name}}

Опис/упутство за јединицу:
{{$UserPrompt}}

Ниво разреда:
{{$GradeLevel}}

Трајање школског часа у минутима:
{{$ClassDuration}}
	
Стандарди за усклађивање:
{{$Standards}}
    
Ученик/ци са индивидуализованом подршком:
{{$LearningPlans}}

Ресурси/медији за употребу:
{{$MediaContext}}
	
Садржај јединице:
{{$AttachedUnit}}

Захтеви за суштинска питања:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава знаком питања.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефинициона.
- Питања МОРАЈУ бити усмерена на шире, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива изван ове јединице.
- Питања МОРАЈУ бити поново употребљена дословно у сваком часу у оквиру јединице.

Шта треба генерисати:
- Излаз МОРА бити валидан JSON који одговара шеми.
- ОБАВЕЗНО: Потпуно попуни сва својства унутар објекта „UnitDescription“:
  - „Description“: Напиши пасус од 4–5 реченица који описује кључни фокус јединице и наративно путовање.
  - „StudentLearningObjectives“: Наведи 3–5 кључних мерљивих циљева учења за јединицу.
  - „StandardsAligned“: Наведи све стандарде који се обрађују током јединице.
  - „EssentialQuestions“: Тачно 3 концептуална питања која прате горња правила.
- ГЕНЕРИШИ листу „Lessons“ која садржи тачно {{$NumberOfItems}} часова.
  - Сваки час мора да укључује „lessonNumber“ (индекс почев од 1), „lessonName“ и „lessonDescription“ (2–4 реченице које описују опсег часа).

Ограничења:
- Задржи јединицу и сваки час у складу са фокусом јединице.
- Обезбеди логичан редослед од темељних идеја ка сложенијем моделовању.
- Тачност: сав садржај мора бити научно тачан и примерен узрасту.

Излаз МОРА бити валидан JSON који одговара шеми. Користи компактно форматирање (без додатних празних редова).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Направите ЈЕДАН НАСТАВНИ час (НЕ план јединице, НЕ више часова) користећи информације испод.
МОРАМЕТЕ да изађете у ваљаном JSON формату који тачно одговара достављеној JSON шеми. Немојте укључивати никакве додатне кључеве. Користите компактно JSON форматирање (без додатних празних линија).
Предмет јединице: 
{{$Subject}}
Назив јединице: 
{{$Name}}
Опис/инструкција јединице: 
{{$UserPrompt}}
Ниво разреда: 
{{$GradeLevel}}
Трајање часа у минутима 
{{$ClassDuration}}
Ресурси/медији за употребу: 
{{$MediaContext}}
Садржај јединице: 
{{$ParentUnitData}}
Стандарди за усклађивање:
{{$Standards}}
Прикачени садржај часа: 
{{$AttachedLesson}}

Кључна питања јединице (КОРИСТИТИ ОВА ЈЕ АПСОЛУТНО ИСТОВЕТНО):
{{$UnitEssentialQuestions}}

Ако је кључна питања јединице горе празно, генеришите тачно 3 концептуална питања према овим правилима:
- Свако питање МОРА бити потпуна, граматички исправна реченица која се завршава упитником.
- Свако питање МОРА почињати са „Како” или „Зашто”.

- Питања МОРАЈУ бити концептуална и истраживачка, а не чињенична, процедурална или дефиницијска.
- Питања МОРАЈУ бити усмерена на широке, универзалне идеје (као што су промена, докази, обрасци, односи, системи или резоновање), а не на садржај специфичан за предмет.
- Питања МОРАЈУ бити преносива кроз дисциплине и применљива ван ове јединице.

УЧЕНИЦИ СА ИНДИВИДУАЛИЗОВАНОМ ПОДРШКОМ (МОРАЈУ се користити САМО у ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; користите имена ученика/планове тачно онако како су написани):
{{$LearningPlans}}

ВАЖНА ПРАВИЛА САДРЖАЈА:
- Држите час усклађен са фокусом јединице: развијање и коришћење модела за описивање атомског састава једноставних молекула и/или проширених структура.
- Укључите кратке, на високом нивоу, везе са другим релевантним DCI-јевима где је прикладно, али задржите час усмерен на моделирање и резоновање о структури и особинама (без дубоке математике, без балансирања једначина осим ако стандарди то изричито захтевају).
- Уверите се да сви делови часа одражавају Обим/Границе часа дате у контексту јединице; избегавајте увођење нових главних концепата који припадају другим часовима.
- EssentialQuestions: МОРАЈУ тачно бити једнака кључним питањима на нивоу јединице (исти текст, исти редослед).
- AssessPriorKnowledge: САМО ако је LessonNumber == 1, попуните објекат како је дефинисано у шеми. За СВЕ ОСТАЛЕ ЧАСОВЕ, МОРАМЕТЕ вратити празан објекат {} без иједног кључа унутра. НЕ користите чиниоце као што су „N/A”, „none” или празне низове.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications мора да садржи општу подршку праћену индивидуалном подршком за сваког ученика наведеног у {{$LearningPlans}}.
- Када било где у плану часа предлажете „sentence frames” или „sentence starters” (посебно у Individualized Supports), МОРАМЕТЕ дати стварне, конкретне реченичне оквире прилагођене садржају часа тако да их наставник може директно користити.
- StudentPractice МОРА да садржи пасус TeacherNotes који почиње са 'These tasks reinforce today's learning about ____ by ______.', листу од 2-3 задатка са DOK 2-4 и критеријумима успеха, и међуповезивање ако је предмет математика.

ЗАХТЕВИ ЗА ИЗЛАЗ:
- Излаз МОРА бити ваљан JSON који тачно одговара достављеној шеми.
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
          "description": "Опис јединице као један кохезиван пасус обичног текста од 4–5 потпуних реченица, написан природним учитељским тоном који бисте могли директно да изговорите ученицима. Без HTML-а, без емоџија, без набројавања. Мора да тече разговорно, али да прати ову структуру (без наслова): (1) уводна реченица која буди радозналост или прави изненађујући контраст, (2) реченица „У овој јединици ћете...” о исходима овладавања, (3) реченица „Ојачаћете своје вештине у...” о способностима мишљења/анализе, (4) реченица „Ово се повезује са...” о значају у стварном свету, (5) реченица „Разумевање овога је важно јер...” о ширем значају или дугорочном утицају."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Направите суштинска питања која се фокусирају само на широке, универзалне појмове као што су промена, докази, обрасци, односи, системи или закључивање. Немојте помињати термине, процесе, вокабулар или примере специфичне за предмет. Питања морају бити отворена, преносива кроз све дисциплине и немогућа за одговорити учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на предметну материју.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Пун одељак „Циљеви учења ученика“ за целу ову јединицу. Свака ставка на листи мора бити јасан, мерљив циљ који почиње мерљивим глаголом и завршава се ознаком DOK у загради",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Наведите све јединствене образовне стандарде који се користе било где у овој јединици и њеним лекцијама. Немојте додавати стандарде који се не појављују у садржају јединице. Сваки стандард мора да садржи шифру стандарда и опис, нпр. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
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
      "description": "Списак контејнера лекција за ову јединицу (само оквирно). Свака ставка мора бити непоклапајућа и јасно обухваћена тако да се садржај лекција не понавља између лекција.",
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
      "description": "Само налепите сва суштинска питања која су генерисана на нивоу јединице истим редоследом.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Списак вокабуларних термина са дефиницијама. (нпр. 'Solar System – Sunce и све...'). Укључите САМО термине који се активно користе у овој конкретној лекцији.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Пун одељак „Циљеви учења ученика“ као обичан текст. Свака ставка мора бити јасан, мерљив циљ који почиње мерљивим глаголом и завршава се ознаком DOK у загради.",
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
      "description": "Пун одељак „Усклађено са стандардима“ као обичан текст за ову лекцију. Сваки стандард мора да садржи шифру стандарда и опис, а шифра и опис морају бити потпуно исти као они коришћени у јединици. нпр. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**{loc.Say}:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**{loc.Say}:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**{loc.Say}:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Пун одељак „Процена претходног знања“. КРИТИЧНО: Погледајте 'lessonNumber' у приложеном садржају лекције. АКО је ово Лекција 1, попуните овај објекат у потпуности. АКО је ово Лекција 2, 3 или било која друга лекција, МОРАЈТЕ ВРАТИТИ ПРАЗАН ОБЈЕКАТ {} без ИКАКВИХ својстава. Не попуњавајте ово ни за једну лекцију осим Лекције 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "Шта наставник каже да уведе активност."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Списак изјава које треба пројектовати или прочитати, који садржи и тачне идеје и честе заблуде."
        },
        "SayInstructions": {
          "type": "string",
          "description": "Шта наставник каже да упути ученике шта да раде са изјавама."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Очекивани одговори/обележавања ученика за сваку изјаву."
        },
        "SayConclusion": {
          "type": "string",
          "description": "Шта наставник каже да заврши."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Наставникова радња за закључивање (нпр. цртање дијаграма)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Списак алтернативних опција за активност."
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
      "description": "Направите одељак Циљеви који јасно наводи ученичке циљеве учења за лекцију.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Процењено време (нпр. „(2-3 мин)“)"
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
                "description": "Корак наставника или сценарио."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Опционална листа ставки у облику набрајања за овај корак. За први корак овде укључите стварне циљеве учења."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Мора да садржи: 1) Објасните циљеве учења користећи директан сценарио намењен наставнику (нпр. Реците: „...“) и ставите стварне циљеве у низ Буллетс. 2) Замолите ученике да забележе циљеве у своје свеске. 3) Укратко реците наставнику како да повеже циљеве са стварним животним искуствима ученика."
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
      "description": "Одељак за излагање садржаја.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Процењено време (нпр. „(30 мин)“)"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Напишите драматичан, веома ангажујући увод који се изводи кроз сценарио наставника. Треба да буде изненађујући, да гради радозналост и да буде повезан са главним појмом."
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
              "description": "Наведите основне термине из речника. Обезбедите сценарио наставника за дефинисање сваког термина, строго форматиран као: '[Термин] - Реците: \"[Дефиниција/Сценарио]\"'. Пример: 'Полуга - Реците: \"Полуга је проста машина...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "Завршна изјава „Реците:“ за прелаз."
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
          "description": "Напишите детаљно предавање наставника са сценаријима (Реците: “…”). Укључите корак по корак шта наставник каже, ради и евентуално демонстрира. Разложите сложене идеје, наведите примере/аналогije, и јасно повежите са претходним знањем."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Уметните стандардни пасус за поновно усмеравање пажње тачно онако како је написан: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Мора бити тачно: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Обезбедите упутства за активност, укључујући сценарио наставника и шта ученици и наставник треба да ураде."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Објасните у ставкама зашто активност функционише за поновно ангажовање, ресетовање когнитивног фокуса, учвршћивање концепата и сврсисходан преглед. Нпр. 'Стајање + кретање ресетује пажњу.'"
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
          "description": "Нумерисани кораци за наставак наставе са сценаријима наставника (Реците: “…”). Разложите сложене идеје, наведите примере/аналогije, да побудите интересовање, наговестите будуће учење и проширите кључне идеје."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "Наведите очекиване уобичајене заблуде ученика како би наставник био спреман.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "нпр. 'Ученици могу мислити да је увек боља већа полуга.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Како ефикасно одговорити на могуће ученичко неразумевање и усмерити их ка тачном разумевању."
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
          "x-format": "### {green}({loc.Connect} {value.Duration})\n\n1. {loc.Say}: \"{value.Step1Say}\"\n\n2. {loc.Say}: \"{value.Step2Say}\"\n\n3. {loc.Prompt}:\n\n{value.Step3Prompts}\n\n4. Whole-group share: {loc.Say}: \"{value.Step4Say}\"\n\n✅ **{loc.ExpectedStudentResponses}**\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Повежите са сврхом. Повежите са једним од суштинских питања.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "нпр., „(3 мин)“"
            },
            "Step1Say": {
              "type": "string",
              "description": "Наставникова скрипта која повезује претходну активност са широм идејом."
            },
            "Step2Say": {
              "type": "string",
              "description": "Наставникова скрипта која од ученика тражи да се окрену и поразговарају са партнером."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Конкретна питања за подстицај (нпр. „Зашто је шадуф био важан...“, „Који докази показују...“)."
            },
            "Step4Say": {
              "type": "string",
              "description": "Наставникова скрипта за дељење у целом одељењу (нпр. „Хајде да чујемо неколико идеја...“)."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Дубоки очекивани одговори ученика који користе образложење или доказе."
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
          "description": "Диференцирајте наставу (како подучавати, а не поједностављивати материјале). Мењајте сложеност и дубину, подстичите активно ангажовање/језик. Реалистично за учионицу.",
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
                  "description": "За одговоре „Иди дубље“."
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
          "description": "Овај одељак мора да садржи две врсте подршке: општу подршку и индивидуализовану подршку. Фокусирајте се на приступ, а не на смањивање захтева.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Стратегије које нису везане за појединачног ученика, а које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, инструкције у деловима). Наведите 2-4 ставки у облику набрајања."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Конкретна прилагођавања и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика посебно; НЕ групишите ученике заједно. Подршка за сваког ученика треба да буде лако прегледна листа.",
              "items": {
                "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                "type": "object",
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Име и презиме појединачног ученика који добија ову подршку."
                  },
                  "PlanProvided": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Формални план дат за овог ученика у подстицају. Претворите план у јасну листу. Можете парафразирати ради бољег форматирања, али немојте изоставити нити додати било какве информације."
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
      "description": "Пун одељак „Провера знања и размакнуто призивање у сећање“.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Тражите од ученика да се присете НОВОГ градива из ДАНАШЊЕ лекције.",
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
        "SpacedRetrieval": {
          "x-format": "⏳ **{loc.SpacedRetrieval}**\n\n{value.PriorLearningContext} {value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Присећање на одређену претходну лекцију/јединицу.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Контекстуална реченица као што је „Раније у овој лекцији, ученици су научили...“"
            },
            "Say": {
              "type": "string",
              "description": "Учитељев подстицај који почиње са „Реци: “."
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
      "x-format": "### {green}({loc.QAndAAndDiscussion} {value.Duration})\n\n**📋 {loc.InstructionsForTeachers}**\n\n1. {loc.Say}: \"{value.InstructionsForTeachers.Step1_InviteSay}\"\n2. {loc.AskLabel}:\n{value.InstructionsForTeachers.Step2_AskQuestions}\n3. {loc.Say}: \"{value.InstructionsForTeachers.Step3_CaptureSay1}\" {loc.RecordLabel}: {value.InstructionsForTeachers.Step3_CaptureRecord} {loc.Say}:\n   \"{value.InstructionsForTeachers.Step3_CaptureSay2}\"\n4. {loc.Say}: \"{value.InstructionsForTeachers.Step4_AnswerSay1}\" {value.InstructionsForTeachers.Step4_AnswerAddress} {loc.Say}: \"{value.InstructionsForTeachers.Step4_AnswerSay2}\"\n\n{loc.NoteForTeacherQA}",
      "type": "object",
      "description": "Одељак за питања и одговоре и дискусију.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Процена времена (нпр. „(5 мин)“)"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Упутства за наставника за сесију питања и одговора и дискусије.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "нпр. „Сада је ваша прилика да размислите о ономе што смо научили...“"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3–4 питања која треба поставити ученицима."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "нпр. „Ако имате питање, то значи да дубоко размишљате...“"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "нпр. „Запишите ученичка питања на таблу под насловом Питања која још увек имамо.“"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "нпр. „Додаваћемо ову таблу током целе јединице...“"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "нпр. „Погледајмо наша питања. На која можемо да одговоримо користећи оно што смо данас научили?“"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "нпр. „Покријте неколико питања користећи ученичке одговоре и доказе.“"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "нпр. „Нека од ових питања ће помоћи да усмере оно што ћемо следеће учити...“"
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
      "description": "Одељак за Закључак.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Процена времена (нпр. „(1 мин)“)"
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
      "description": "Издвојте и генеришите ТАЧНО 4 формативна задатка за процену који покривају DOK 1–4. За сваки задатак укључите PromptLabel, Question и ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "нпр. „Задатак 1 (DOK 1)“"
          },
          "Question": {
            "type": "string",
            "description": "Тачан текст питања."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1–2 примера одговора који показују савладање."
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
      "description": "Пун одељак „Самостална вежба ученика“ за домаћи задатак / вежбу ван часа.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Белешке које објашњавају како задаци учвршћују данашње учење и јачају дугорочно памћење."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Генериши 4 задатка за вежбу који покривају нивое DOK 2, 3 и 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "нпр. „(DOK 2) Нацртај шадуф и означи...“"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 ставке са критеријумима успеха."
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
          "description": "Задатак за размишљање за ученике.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "нпр. „Напиши 2–3 реченице као одговор на један подстицај:“"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3–4 опције за питања за размишљање."
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
}
};
