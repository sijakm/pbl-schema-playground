window.prompts_pbl_sr_Cyrl = {
  STEP0_PROMPT_TEMPLATE: `Направите план јединице и лекције засноване на пројекту користећи информације испод:  
Предмет јединице:
{{$Subject}}
Назив јединице:
{{$Name}}
Опис/инструкција јединице:
{{$UserPrompt}}
Ниво разреда:
{{$GradeLevel}}
Колико ће пројекат трајати у данима
{{$NumberOfDays}}
Локација:
{{$Location}}
Ресурси/медији за употребу:
{{$MediaContext}}, 
Садржај јединице: 
{{$AttachedUnit}} 
Планови учења ученика:
{{$LearningPlans}}
Стандарди за усклађивање:
{{$Standards}}
Ваш задатак је да осмислите детаљну јединицу засновану на пројекту користећи принципе когнитивне науке. Ваш излаз МОРA да прати тачан редослед одељака, наслова и правила садржаја испод. Ако недостаје било који одељак или је ван редоследа, поново генеришите све док сви услови не буду испуњени. 
Општа правила за излаз (примењују се на све) Пратите тачан редослед одељака и наслове приказане испод. Не додавајте додатне одељке нити преименујте наслове. Реални проблеми треба да буду релевантни за ученике овог нивоа разреда. Избегавајте теме које могу бити осетљиве у погледу развојне примерености, као и осетљиве теме као што су сиромаштво, стамбена несигурност, раса итд., или контроверзне теме као што је еволуција. Укључите следеће компоненте у дизајн пројекта јединице.  
Културна релевантност и инклузија: Укључите више перспектива и размислите о утицајима на све укључене. Садржај треба да се повезује са ученицима из различитих средина и заједница како би се створиле културно релевантне и културно одговорне лекције. Избегавајте стереотипе. 
ВАЖНО: одговор мора бити на {{$ResponseLanguage}}

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
      "description": "Вратите комплетан план јединице засноване на пројектном учењу (PBL). Немојте додавати додатна кључна поља. Попуните свако обавезно поље. Мора да ради за БИЛО КОЈИ предмет. Локализујте заинтересоване стране/аудиторијум/ресурсе према наведеном поштанском броју/локацији без измишљања тачних адреса/телефонских бројева.",
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
          "description": "Одељак Процена претходног знања. 1. Уверите се да се користе DOK 1-3 подстицаји. 2. Укључите предзнања и вештине потребне за исходе учења ученика. 3. Изаберите један модалитет са ове листе и у потпуности га разрадите: постављање питања, K-W-L, визуелни прикази, концептуалне мапе, рефлексивно писање, уводни водичи, оцењивање вокабулара. 4. Почетни наставников подстицај са изјавом 'Реците:'. 5. Јасна упутства и шаблон/структура за изабрани модалитет. 6. Одељак 'Очекивани одговори ученика'. 7. Завршни наставников подстицај 'Реците:'. 8. Након што у потпуности разрадите један модалитет, наведите 2 кратке алтернативне опције.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Јасна упутства и шаблон/структура за изабрани модалитет. На пример: 'Реците: \"Before we begin...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Очекивани одговори ученика или уобичајене заблуде за изабрани модалитет. ВАЖНО: Немојте укључивати набрајане ставке, цртице или бројеве на почетку низова.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Завршни наставников подстицај 'Реците:' који потврђује размишљање ученика и најављује истраживање јединице."
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
              "description": "Наслов поруке за покретање која је намењена ученицима (нпр. Порука од Coconut Creek STEM Innovation Team)."
            },
            "LetterGreeting": {
              "type": "string",
              "description": "Почетни поздрав за поруку намењену ученицима (нпр. 'Hello engineers-in-training,')."
            },
            "LetterBody": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              },
              "description": "Главни пасуси поруке намењене ученицима (3-5 пасуса) написани као да их пише веродостојна локална организација или особа. Морају укључити јасну везу са проблемом, водеће питање, захтеве за коначни производ и инспиративан позив на акцију. Хитно, значајно, аутентично. Немојте укључивати наслов, поздрав, завршну формулу (нпр. 'Sincerely,') или име пошиљаоца овде. Само садржај пасуса."
            },
            "LetterSignOff": {
              "type": "string",
              "description": "Фраза за завршетак поруке (нпр. 'Sincerely,'). Наведите само фразу за завршетак, ништа више."
            },
            "LetterSender": {
              "type": "string",
              "description": "Име веродостојне локалне организације или особе која шаље поруку (нпр. 'Coconut Creek STEM Innovation Team'). Немојте овде укључивати завршну формулу (нпр. 'Sincerely')."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "Једно снажно, отворено водеће питање засновано на месту и потреби заинтересованих страна. Ово питање такође мора бити уткaно у LetterBody. МОРА се користити дословно у FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Пасус који почиње са 'Your task is to...' и описује шта ће ученици креирати/урадити и зашто је то важно за заједницу/аудиторијум."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Кратка нарација: ко је погођен, зашто је то сада локално важно и које заинтересоване стране/аудиторијуми су заинтересовани."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 5,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "description": "Написано за ученике, опишите коначан производ који ће креирати и аутентични аудиторијум коме служи. Форматирајте сваку ставку са подебљаним насловом (нпр. **Summary:** ...). Немојте укључивати нумерацију (као 1., 2.) или набрајане ставке на почетку ваших низова; почните директно са подебљаним насловом. Мора укључити барем кратак сажетак, затим четири компоненте: (1) Concept & Purpose Plan који објашњава идеју кроз визуелни или писани приказ и зашто је важна за заједницу или контекст; (2) Evidence-Based Justification која захтева анализу најмање два релевантна фактора и објашњење избора уз коришћење доказа из истраживања, података, експериментисања или посматрања; (3) Model or Representation који описује врсту модела који је креиран, шта представља, како функционише и како открива силу, стабилност, ефикасност или систем иза идеје; и (4) The Verdict, закључни аргумент поткрепљен доказима који објашњава зашто је решење ефикасно, изводљиво или значајно, сумирајући размишљање, доказе и модел, и комуницирајући вредност дизајна аутентичном аудиторијуму. Ваша завршна изјава треба да покаже да можете применити дисциплинско знање, користити доказе, моделирати сложене идеје и објаснити последице у стварном свету."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Инспиративан завршетак: заједница/аудиторијум рачуна на креативне мислиоце који могу да претворе доказе у акцију. Нагласите да древне идеје могу да инспиришу савремена решења."
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
              "description": "Стандарди наведени дословно када су дати, у формату 'CODE: description'. Немојте укључивати набрајане ставке на почетку ваших низова."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 4,
              "description": "Генеришите 3-4 пара велике идеје и суштинског питања који успостављају трајне, преносиве концепте који су темељ целе јединице, воде истраживање и дизајн процене, и обезбеђују свеобухватан концептуални оквир који повезује све задатке, вештине и активности у смислено разумевање.",
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
                    "description": "Широка, концептуална изјава трајног разумевања која објашњава основни принцип који лежи у основи јединице, повезује све задатке и процене, подржава преносиво учење изван конкретног контекста и одражава суштинско дисциплинско мишљење, а не изоловане чињенице."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Креирајте суштинска питања која се фокусирају искључиво на широке, универзалне концепте као што су промена, доказ, обрасци, односи, системи или резоновање. Немојте помињати термине, процесе, вокабулар или примере специфичне за предмет. Питања морају бити отворена, преносива кроз све дисциплине и немогућа за одговор само учењем садржаја лекције или јединице. Фокусирајте се само на велике идеје, а не на садржај предмета."
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
                  "description": "Сваки циљ мора да се завршава са (ДОК X) и да представља Велике идеје или трајна разумевања тако што ће генерисати 3 до 5 концептуалних, дугорочних исказа који објашњавају зашто је учење важно изван јединице, истичу преносиве обрасце, односе или принципе кроз различите контексте, и објашњавају како или зашто нешто функционише, а не само шта је то. Напишите циљеве као директне наставке фразе 'Ученици ће разумети да...'. Немојте понављати фразу 'Ученици ће разумети да', и немојте почињати глаголима попут 'Објаснити да' или 'Описати да' (нпр. једноставно напишите 'инжењерски дизајни се побољшавају када...'). НЕ укључујте било какво нумерисање, тачке илиCrte на почетку ваших низова."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Сваки циљ мора да се завршава са (ДОК X) и да представља чињенице или основна садржајна знања тако што ће генерисати 3 до 5 чињеница специфичних за дисциплину, појмова или исказа основног знања који идентификују суштинске информације које ученици морају да запамте, да остану конкретни и чињенични уместо концептуални, да подржавају стандарде јединице и задатке учинка, да користе јасан академски речник одговарајући предмету, и да укључују одговарајућу ДОК ознаку обично на нивоу 1 или 2. Напишите циљеве као директне наставке фразе 'Ученици ће знати да...'. Немојте понављати фразу 'Ученици ће знати да', и немојте почињати глаголима попут 'Идентификовати да' или 'Дефинисати' (нпр. једноставно напишите 'полиuga има крак силе...'). НЕ укључујте било какво нумерисање, тачке или crte на почетку ваших низова."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Сваки циљ мора да се завршава са (ДОК X) и да представља вештине или праксе усаглашене са дисциплином тако што ће генерисати 4 до 7 вештински заснованих исказа који описују шта ће ученици радити; усагласите их са праксама специфичним за дисциплину; повежите их директно са пројектним производом или задатком учинка; останите мерљиви и уочљиви; и укључите одговарајући ДОК ниво између 2 и 4. Напишите циљеве као директне наставке фразе 'Ученици ће бити способни да...'. Почните директно мерљивим акционним глаголом (нпр. анализирати, упоређивати, дизајнирати, моделовати, решити). Немојте понављати префикс 'Ученици ће бити способни да'. НЕ укључујте било какво нумерисање, тачке или crte на почетку ваших низова."
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
              "description": "МОРа да се поклапа са UnitOverview.DrivingQuestion дословно. Наведите стварно водеће питање (нпр. 'Како можемо да дизајнирамо изум инспирисан иновацијама древног Египта да решимо стварни проблем у нашој заједници у КокоНат Крику?')."
            },
            "ProblemDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Параграфи описа проблема који објашњавају стварни изазов. Објасните зашто је проблем важан и које су последице ако се не решава, идентификујући основне факторе који доприносе проблем. Показите како неразумевање, недостајуће информације или превидени варијабли доприносе проблему. Објасните како решење служи стварној, релевантној аутентичној публика. НЕ укључујте било какво нумерисање или тачке на почетку ваших низова.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "ProjectDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Наративни пасуси о томе како учење расте кроз вишедневни пројекат (истраживање -> примена -> дотеривање -> представљање). Објасните како ученици почињу истраживањем примера, примећују обрасце, примењују научна знања кроз практична тестирања, а затим користе те налазе да развију оригиналан изум. Објасните како ревидирају прототипове и представљају идеје аутентичној публици. НЕ укључујте било какво нумерисање или тачке на почетку ваших низова.",
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
              "description": "МОРа да укључује 3 до 5 локација за ангажовање заснованих на месту. Осигурајте да локације представљају различите контексте и јасно покажу како је локална заједница део екосистема учења.",
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
                    "description": "Значајно физичко, заједничко, виртуелно или предметно специјализовано место релевантно за контекст јединице (нпр. 'Кампус средње школе КокоНат Крик (примарна истраживачка локација)')."
                  },
                  "StudentEngagement": {
                    "type": "string",
                    "description": "Објашњавање аутентичних истраживачких активности које ученици изводе на локацији или уз њу, као што су посматрање, прикупљање података, интервјуи, анализа, виртуелно истраживање или вођени теренски задаци повезани са стварним проблемом."
                  },
                  "Relevance": {
                    "type": "string",
                    "description": "Објашњавање зашто је локација важна тако што је повезује са проблемом, показује како обезбеђује доказе или стручност, појашњава како подржава дизајн или моделирање решења и истиче локални или заједници својствен значај."
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
                  "description": "Креирајте оделак Зачетног академског вокабулара са тачно четири означена нивоа.",
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
                        "description": "МОРа да буде тачно једно од следећег: 'Ниво 1: Основни / кључни вокабулар', 'Ниво 2: Вокабулар примене, моделирања или процеса', 'Ниво 3: Вокабулар из стварног света или пројекта', 'Ниво 4: Вокабулар за проширење и напредовање'."
                      },
                      "TierWhyItMatters": {
                        "type": "string",
                        "description": "Кратка курсивна реченица која објашњава како ови термини помажу ученицима у контексту пројекта (нпр. 'Ови појмови помажу ученицима да именују најважније идеје и објекте које ће видети, градити и о којима ће разговарати током пројекта.')."
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "x-format": "\n\n{items}",
                        "description": "Наведите вокабулар одговарајући јединици са дефиницијама разумљивим ученицима.",
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
                              "description": "Реч из вокабулара (нпр. 'сила'). Не укључујте никакво нумерисање или тачке."
                            },
                            "Definition": {
                              "type": "string",
                              "description": "Дефиниција разумљива ученицима."
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
              "description": "Идентификујте и ангажујте аутентичну публику изван учионице.",
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
                        "description": "Назив одређене групе аутентичне публике (нпр. 'Обор за одрживост и еколошко саветовање града КокоНат Крика'). Не укључујте тачке или нумерисање."
                      },
                      "PrimaryAudienceDescription": {
                        "type": "string",
                        "description": "Јасан опис ко је ова публика (појединци, организације или групе) и њихов однос према контексту или проблему пројекта. Мора бити детаљно, најмање 2-3 реченице."
                      },
                      "WhyThisAudienceIsQualified": {
                        "type": "string",
                        "description": "Објашњење зашто ова публика има релевантну стручност, искуство из прве руке или ауторитет у вези са темом пројекта. Мора бити детаљно, најмање 2-3 реченице."
                      },
                      "HowThisAudienceElevatesTheProject": {
                        "type": "string",
                        "description": "Како присуство ове публике повећава аутентичност, строгост, мотивацију или утицај на стварни свет за ученике. Мора бити детаљно, најмање 2-3 реченице."
                      }
                    }
                  }
                },
                "StudentParticipation": {
                  "type": "string",
                  "description": "Пасус који објашњава како ученици помажу у идентификовању која публика најбоље одговара њиховом изуму тако што разговарају о томе ко би имао користи од решења или ко би га процењивао."
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
                    "description": "Мерљиви циљ учења ученика који се завршава DOK нивоом. Не укључујте набрајање или нумерисање."
                  },
                  "SuccessCriteria": {
                    "type": "string",
                    "description": "Специфични критеријуми успеха који објашњавају шта ће ученик урадити да би показао учење. Не укључујте набрајање или нумерисање."
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Где ће се појавити докази, одвојено у изјавама Formative: и Summative:. Не укључујте набрајање или нумерисање."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "description": "Аналитичка рубрика која детаљно описује компетенције које пројекат захтева. Сваки ред представља једну оцењену вештину. Прелаз од Novice до Expert мора одражавати све већу софистицираност.",
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
                    "description": "Оцењена вештина, компетенција или димензија завршног пројекта. Не укључујте набрајање или нумерисање."
                  },
                  "Novice": {
                    "type": "string",
                    "description": "Опис перформанси на нивоу novicе. Не сме да користи језик заснован на дефициту као што су не успева, нема или недостаје. Не укључујте набрајање или нумерисање."
                  },
                  "Apprentice": {
                    "type": "string",
                    "description": "Опис перформанси на нивоу apprentice. Не укључујте набрајање или нумерисање."
                  },
                  "Practitioner": {
                    "type": "string",
                    "description": "Опис перформанси на нивоу practitioner. Не укључујте набрајање или нумерисање."
                  },
                  "Expert": {
                    "type": "string",
                    "description": "Опис перформанси на нивоу expert. Мора да се надовезује на ниво Practitioner са дубљим увидом, прецизношћу или сложеношћу. Не укључујте набрајање или нумерисање."
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
              "description": "Сажетак од 2-4 реченице који објашњава како је пројекат организован у три флексибилне фазе (Phase 1, Phase 2, Phase 3) уместо у фиксни број дана. Укратко опишите шта ученици раде у свакој фази (нпр. у Phase 1 граде базично знање; у Phase 2 примењују научне идеје кроз истраживања; у Phase 3 усавршавају прототипе и представљају аутентичној публици). Не користите набрајање или нумерисање."
            },
            "ProjectPhases": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 3,
              "description": "Три фазе пројекта. Укупно трајање током све 3 фазе МОРА тачно да буде једнако укупном броју дана тражених за пројекат.",
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
                    "description": "Назив и трајање фазе (нпр. 'Phase 1: 1-2 days' или 'Phase 3: 2 days'). ВАЖНО: Трајање мора бити изричито наведено у наслову, а збир максималног броја дана у свим фазама мора тачно да одговара укупно траженом трајању пројекта. Не укључујте набрајање или нумерисање."
                  },
                  "PhaseDescription": {
                    "type": "string",
                    "description": "Кратак пасус од 1-2 реченице који описује шта ученици раде током ове фазе да би продубили разумевање или синтетисали учење."
                  },
                  "ConceptsOrSkills": {
                    "type": "string",
                    "description": "Зарезима одвојена листа кључних појмова или вештина наглашених у овој фази (нпр. 'Посматрање, постављање питања, моделовање, системи полуга, стабилност структуре'). Не укључујте набрајање или нумерисање."
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string",
                    "description": "Реченица која објашњава како ученици сарађују и чине своје размишљање видљивим у овој фази (нпр. 'Ученици користе think-pair-share, скицирне белешке и брза групна поређења да би своје размишљање учинили видљивим.'). Не укључујте набрајање или нумерисање."
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "x-format": "{items}",
                    "minItems": 3,
                    "description": "Листа специфичних активности учења или задатака у овој фази.",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}",
                      "description": "Специфична активност учења (нпр. 'Израда и тестирање шадуфа'). Не укључујте никакво нумерисање или набрајање на почетку ваших стрингова."
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "description": "Излаз мора да садржи тачно три циља пројекта, сваки изражен као концептуална категорија праћена детаљним набрајањима или кратким пасусима. Циљ 1, Примена дисциплинског садржаја на проблем из стварног света, захтева од ученика да користе знање специфично за дисциплину да анализирају или реше аутентичан изазов, наведу 4-6 кључних појмова или принципа које ће применити и покажу како се ове идеје повезују са стварним условима или ограничењима. Циљ 2, Решавање стварног, развојно примереног дизајнерског или истраживачког проблема, захтева опис аутентичног изазова који ученици морају да адресирају, навођење шта ће ученици креирати, моделирати, поредити, анализирати, процењивати или оправдавати, и укључивање процеса као што су моделовање, предвиђање, поређење, процењивање и доношење одлука. Циљ 3, Комуникација налаза стварној публици, захтева од ученика да припреме углађен, професионалан завршни производ, прилагоде комуникацију потребама стварне групе заинтересованих страна и упуте на аутентичне публике као што су локални стручњаци, друштвене организације, стручњаци из индустрије, школско руководство, породице или чланови заједнице.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n",
                "description": "Специфичан пројектни циљ форматиран са подебљаним ознакама (нпр. '**Циљ 1: Применити садржај предмета на проблем из стварног света** Искористите знање...')"
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
              "description": "Описује величину групе, улоге и дужности наставника.",
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
                  "description": "Излаз мора навести препоручену величину групе, као што је 3 до 4 ученика, и мора пружити образложење које објашњава како ова величина подржава продуктивну дискусију, заједнички ангажман и управљиву расподелу задатака. Пример: 'Величина групе од 3 до 4 ученика је идеална зато што...'"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Излаз мора да пружи листу улога форматирану као 'Назив улоге: опис дужности'. Листа мора да садржи најмање четири улоге (Фасилитатор, Бележник, Задужени за материјале, Презентер/Комуникатор) и очекивања од наставника на крају.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Модел мора да прикаже тачно ова два низа: 1) '\"Која је главна сврха формирања група у овој активности — вршњачка подршка, богата дискусија, изазов или ефикасност? Када наведете сврху, који приступ формирању група јој најбоље одговара: мешовите способности, по интересовањима, по вештинама или насумично?\"' 2) 'Ово питање подстиче наставнике да бирају методе формирања група које се подударају са наставним циљевима, уместо да се ослањају на практичност или навику.'",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Модел мора да прикаже тачне препоруке за стратегију груписања форматиране са подебљаним ознакама (нпр. '**Групе мешовитих способности:** Најбоље када...'). Стратегије које треба укључити: Групе мешовитих способности, Групе по интересовањима, Групе по вештинама, Насумично формиране групе.",
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
          "description": "Прва фаза наставничког вођења",
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
              "description": "Наведите кратку изјаву која описује како ова фаза гради радозналост, уводи проблем из стварног света и активира рано резоновање. Изјава фокуса мора да укључи грађење радозналости око кључног феномена или проблема, рано посматрање и истраживање, уочавање и постављање питања од стране ученика, и јасну везу са водећим питањем јединице. Формулација треба да одражава да у овој уводној фази ученици граде радозналост и почињу да откривају научни или концептуални проблем у средишту пројекта, и да кроз посматрање, истраживање и ране покушаје моделовања прикупљају непосредне доказе који повезују њихово почетно размишљање са водећим питањем."
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
                      "description": "Генеришите 2-3 подршке специфичне за лекцију (визуелни прикази, листе кључних речи, гестови) како бисте помогли ученицима који уче језик да приступе и изразе идеје. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Генеришите 3-4 почетне реченице које помажу ученицима да опишу, објасне и комуницирају своје размишљање за ову конкретну лекцију. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "Генеришите 2-3 подршке корак по корак (структурирани алати, моделовани примери, размишљање наглас) и прецизна упутства која ће помоћи ученицима да заврше задатак. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Генеришите 3-4 питања са контролне листе која ће усмеравати ученике у разумевању сопственог учења током истраживања. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "Генеришите 2-3 проширења која повећавају сложеност (конкретни изазови, идентификација образаца) како бисте помогли ученицима да продубе или унапреде своје размишљање користећи доказе. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Генеришите један сложен подстицај (НЕ укључујте префикс 'Реците:')/питање које подстиче дубље концептуално разумевање."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Генеришите 3-4 конкретна примера висококвалитетних одговора ученика на напредно питање. НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
              "description": "Овај одељак мора да укључи две врсте подршке: Опште подршке и Индивидуализоване подршке. Фокус је на приступу, а не на снижавању захтева.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Нестудентски специфичне стратегије које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, инструкције у деловима). Наведите 2-4 ставке као набрајање."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Специфичне адаптације и модификације за именоване ученике са званичним плановима. Наведите СВАКОГ ученика појединачно; НЕ групишите ученике заједно. Подршке за сваког ученика треба да буду лако прегледна листа.",
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
                        "description": "Званични план дат за овог ученика у упутству. Претворите план у јасан списак. Можете парафразирати ради бољег форматирања, али НЕ изостављајте нити додаћите било какве информације."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретни алати/стабљике/визуелни прикази/организатори за овај задатак."
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
              "description": "Генеришите 2-3 уобичајене заблуде ученика које ће вероватно настати током ове фазе. Свака ставка мора да се фокусира на одређено погрешно разумевање и сценарио одговора наставника.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуду у 1 реченици, почевши са 'Ученици могу мислити...'. НЕ користите подебљавање нити strong ознаке."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Јасан сценарио одговора за наставника (почиње са 'Одговор наставника: ') који показује како да се реагује у том тренутку уз конкретан подстицај (не укључујте префикс 'Реците:'). НЕ користите подебљавање нити strong ознаке."
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
                  "description": "Генеришите 1 питање за трансцендентно размишљање које захтева од ученика да примене учење изван себе, у реалне контексте (заједнице, глобални изазови). Усредсредите се на то зашто је учење важно на већој скали (безбедност, одрживост, иновације итд.). Избегавајте лични/школски фокус."
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
              "description": "Завршно питање за проверу разумевања са 2-3 очекивана ученичка одговора који показују савладавање",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
              "description": "Модел мора да креира компоненту размаченог присећања која захтева од ученика да се присете кључног концепта из одређене претходне јединице или лекције без позивања на било какве претходне активности, радне листове, моделе, ознаке или кораке специфичне за задатак. Сценарио наставника мора да почиње са Реците: и може да се односи само на тему претходног учења, а не на оно што су ученици о њој научили. Питање за присећање мора да подстакне ученике да понове или примене претходно научено концептуално разумевање (као што је како систем функционише, како су променљиве повезане, или како се процес одвија) у потпуности из памћења, без да наставник даје наговештаје или делимична објашњења. Излаз мора да се заврши са Очекивани одговори ученика који приказује 2-3 примера који тачно одражавају концептуално присећање, показујући да су ученици — а не упит — изнели запамћене идеје.",
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
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ започињите ставке знаковима за набрајање, цртицама или бројевима. Само напишите обичан текст.",
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
              "description": "Један пасус који објашњава знање и вештине које се вежбају кроз све задатке у овој фази. Пасус МОРА да почиње са 'These tasks reinforce today's learning about ____ by ______.' при чему се празнине попуњавају релевантним садржајем пројекта, након чега следи објашњење како ови задаци јачају дугорочно памћење."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задаци треба да буду усклађени са фокусом фазе и очекиваном дубином знања. Користите само DOK 2, 3 или 4.",
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
                    "description": "Ниво дубине знања за задатак. МОРА бити ЈЕДНО од: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 је строго забрањен."
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
              "description": "Ако је И САМО АКО предмет математика: укључите задатак интерливинга + наставников подстицај + очекиване одговоре + напомену наставника. У супротном, празан стринг."
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
                  "description": "Кратак увод за ученике у рефлексију, нпр. 'Напишите 2-3 реченице као одговор на један подстицај:'"
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
          "description": "Друга фаза упутства за наставника",
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
              "description": "Напишите Focus Statement од 1-3 реченице која сумира сврху фазе, објашњава како ученици граде разумевање кроз рад заснован на истраживању, изричито повезује фазу са Driving Question јединице или реалним проблемом и описује како ова фаза помера ученике ближе изради коначног производа. Изјава мора увек бити написана као један кратак пасус и мора бити прилагођена специфичним детаљима пројекта које је навео корисник."
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
                      "description": "Генеришите 2-3 подршке специфичне за лекцију (визуелни прикази, банке речи, гестови) како бисте помогли ученицима који уче језик да приступе и изразе идеје. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Генеришите 3-4 почетне реченице које помажу ученицима да опишу, објасне и саопште своје размишљање за ову конкретну лекцију. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
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
                      "description": "Генеришите 2-3 подршке корак по корак (структурирани алати, моделирани примери, размишљање наглас) и прецизна упутства како бисте помогли ученицима да заврше задатак. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Генеришите 3-4 питања са контролне листе која ће усмеравати ученике у разумевању сопственог учења током истраживања. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
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
                      "description": "Генеришите 2-3 проширења која повећавају сложеност (специфични изазови, препознавање образаца) како бисте помогли ученицима да продубе или унапреде своје размишљање користећи доказе. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Генеришите један сложен подстицај (немојте укључити префикс 'Реците:')/питање које подстиче дубље концептуално разумевање."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Генеришите 3-4 конкретна примера висококвалитетних ученичких одговора на напредно питање. НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
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
              "description": "Овај одељак мора да укључи две врсте подршке: Опште подршке и Индивидуализоване подршке. Фокусирајте се на приступ, а не на смањивање захтева.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Стратегије које нису специфичне за појединачне ученике и које побољшавају приступ за све ученике (нпр. визуелни прикази, унапред попуњене белешке, дигитални речник, инструкције у деловима). Наведите 2-4 ставке."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Специфични смештаји и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика појединачно; НЕ групишите ученике заједно. Подршке за сваког ученика треба да буду лако прегледна листа.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Име и презиме појединачног ученика који прима ове подршке."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Формални план наведен за овог ученика у упиту. Разложите план у јасну листу. Можете га парафразирати ради бољег форматирања, али НЕ изостављајте и не додајте никакве информације."
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
            },
            "Phase2_AnticipatedMisconceptions": {
              "type": "array",
              "x-format": "### {violet}(⚠️ {loc.AnticipatedMisconceptions}){items}",
              "description": "Генеришите 2-3 уобичајене ученичке заблуде које би вероватно могле да се појаве током ове фазе. Свака ставка мора да се усредсреди на конкретно погрешно разумевање и на скрипту одговора наставника.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуду у 1 реченици, почевши са 'Ученици могу мислити...'. НЕ користите ниједно подебљавање нити јаке ознаке."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Јасна скрипта одговора за наставника (почевши са 'Одговор наставника: ') која моделује како да се реагује у том тренутку са конкретним подстицајем (немојте укључити префикс 'Реците:'). НЕ користите ниједно подебљавање нити јаке ознаке."
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
                  "description": "Генеришите 1 трансцендентно питање које захтева од ученика да примене учење изван себе на стварне контексте (заједнице, глобални изазови). Усредсредите се на то зашто је учење важно у ширем обиму (безбедност, одрживост, иновације итд.). Избегавајте лични/школски фокус."
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
              "description": "Завршно питање за проверу разумевања са 2-3 очекивана ученичка одговора који показују овладавање",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке тачкама, цртама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
              "description": "Модел мора да креира компоненту размакнутог понављања која захтева од ученика да се присете кључног концепта из одређене претходне јединице или лекције, без позивања на било какве прошле активности, радне листове, моделе, ознаке или кораке специфичне за задатак. Наставников сценарио мора да почиње са Reci: и може да се односи само на тему претходног учења, а не на оно што су ученици о њој научили. Питање за присећање мора да подстакне ученике да поново изнесу или примене претходно научено концептуално разумевање (као што је како систем функционише, како су променљиве повезане или како се процес одвија) у потпуности из сећања, без тога да наставник даје наговештаје или делимична објашњења. Излаз мора да се заврши са Очекивани одговори ученика који показују 2-3 примера која тачно одражавају концептуално присећање, показујући да су ученици — а не сам подстицај — предложили запамћене идеје.",
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
                      "description": "НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
                      "description": "НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
                      "description": "НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
              "description": "Један пасус који објашњава знања и вештине увежбане кроз све задатке у овој фази. Пасус МОРА да почиње са 'These tasks reinforce today's learning about ____ by ______.' где су празнине попуњене релевантним садржајем пројекта, након чега следи објашњење како ови задаци јачају дугорочно памћење."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задаци треба да буду усклађени са фокусом фазе и очекиваном дубином знања. Користите само DOK 2, 3 или 4.",
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
                    "description": "Ниво дубине знања за задатак. МОРА бити ЈЕДАН од: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 је строго забрањен."
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
              "description": "Само ако је предмет математика: укључи задатак са интерливингом + наставников подстицај + очекиване одговоре + белешку за наставника. У супротном празан стринг."
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
                  "description": "Кратак увод за ученика у рефлексију, нпр. 'Напиши 2-3 реченице одговарајући на један подстицај:'"
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
          "description": "Трећа фаза наставничког вођења",
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
              "description": "Направи Фокус изјава од 2-4 реченице који јасно саопштава сврху Фазе 3 и њену улогу у вођењу ученика ка финалном производу. Изјава мора објаснити да се Фаза 3 фокусира на прецизирање идеја, примену учења, јачање доказа, припрему завршних производа и укључивање у дубље резоновање и ревизију. Мора изричито показати како Фаза 3 унапређује аутентичан реални изазов пројекта, како ученици користе доказе да побољшају решења и како их овај рад припрема за аутентичну публику. Изјава мора да укључује интелектуални рад као што су прецизирање, ревидирање, синтетисање, вредновање, оправдавање, финализовање и комуницирање, и мора да означи како ученици финализују моделе, производе, објашњења или предлоге, припремају презентације или јавне приказе и размишљају о учењу како би ојачали своје резоновање."
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
                      "description": "Направи 2-3 подршке специфичне за лекцију (визуали, речници, гестови) како би ученици који уче језик могли да приступе идејама и изразе их. НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Направи 3-4 почетне реченице које помажу ученицима да опишу, објасне и саопште своје размишљање за ову конкретну лекцију. НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
                      "description": "Направи 2-3 подршке корак по корак (структурисани алати, моделирани примери, think-alouds) и тачно упутство како би ученици завршили задатак. НЕ почињи ставке набрајањем, цртицама или бројевima. Само напиши обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Направи 3-4 питања са листе за проверу која ће водити ученике у разумевању њиховог учења током истраживања. НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
                      "description": "Направи 2-3 проширења која повећавају сложеност (специфични изазови, препознавање образаца) како би помогла ученицима да продубе или побољшају своје размишљање користећи доказе. НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Направи један сложен подстицај (НЕ укључуј префикс 'Reci:')/питање да подстакнеш дубље концептуално разумевање."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Направи 3-4 конкретна примера висококвалитетних ученичких одговора на напредно питање. НЕ почињи ставке набрајањем, цртицама или бројевима. Само напиши обичан текст.",
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
              "description": "Овај одељак мора да садржи две врсте подршке: Опште подршке и Индивидуализоване подршке. Фокус је на приступу, а не на снижавању захтева.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Нестудентски специфичне стратегије које побољшавају приступ за све ученике (нпр. визуели, унапред попуњене белешке, дигитални речник, инструкције подељене на мање целине). Наведите 2–4 ставки у виду набрајања."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Специфичне адаптације и модификације за именоване ученике са формалним плановима. Наведите СВАКОГ ученика појединачно; НЕ групишите ученике заједно. Подршка за сваког ученика треба да буде списак који се лако прегледа.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Име и презиме појединог ученика који прима ове подршке."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Формални план дат за овог ученика у упиту. Разложите план у јасан списак. Можете парафразирати ради бољег форматирања, али НЕ изостављајте нити додајте било какве информације."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Конкретни алати/почеци реченица/визуелни материјали/организатори за овај задатак."
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
              "description": "Генеришите 2–3 уобичајене ученичке заблуде које ће вероватно настати током ове фазе. Свака ставка мора да се усредсреди на конкретно погрешно схватање и сценарио одговора наставника.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Опишите заблуду у 1 реченици, која почиње са 'Ученци могу мислити...'. НЕ користите подебљавање нити ознаке за наглашавање."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Јасан сценарио одговора за наставника (који почиње са 'Наставнички одговор: ') који показује како да се одговори у тренутку помоћу конкретног подстицаја (НЕ укључивати префикс 'Реците:'). НЕ користите подебљавање нити ознаке за наглашавање."
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
                  "description": "Генеришите 1 питање за трансцендентно мишљење које захтева од ученика да примене учење изван себе, на контексте из стварног света (заједнице, глобални изазови). Усредсредите се на то зашто је учење важно у већем обиму (безбедност, одрживост, иновације итд.). Избегавајте лични/школски фокус."
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
              "description": "Питање за завршну проверу разумевања са 2–3 очекивана ученичка одговора који показују савладавање",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
              "description": "Модел мора да креира компоненту Размакнутог присећања која захтева од ученика да се присете кључног појма из конкретне претходне јединице или часа без позивања на било какве претходне активности, радне листове, моделе, ознаке или кораке специфичне за задатак. Сценарио наставника мора да почиње са Реците: и може да се односи само на тему претходног учења, а не на то шта су ученици о њој научили. Питање за присећање мора да подстакне ученике да поново изнесу или примене раније научено концептуално разумевање (као што је како систем функционише, како су променљиве повезане или како се процес одвија) у потпуности из сећања, без да наставник даје наговештаје или делимична објашњења. Излаз мора да се заврши са Очекивани ученички одговори који показују 2–3 примера који тачно одражавају концептуално присећање, демонстрирајући да су ученици—а не упит—изнели запамћене идеје.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
                      "description": "НЕ ПОЧИЊИТЕ ставке набрајањем, цртицама или бројевима. Само напишите обичан текст.",
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
              "description": "Један пасус који објашњава знања и вештине које се вежбају кроз све задатке у овој фази. Пасус МОРА да почиње са 'Ови задаци јачају данашње учење о ____ тако што ______.' при чему су празнине попуњене релевантним садржајем пројекта, након чега следи објашњење како ови задаци јачају дугорочно памћење."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Задаци треба да буду усклађени са фокусом фазе и очекиваном дубином знања. Користите само DOK 2, 3 или 4.",
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
                    "description": "Ниво дубине знања за задатак. МОРА бити ЈЕДНА ОД: 'DOK 2', 'DOK 3' или 'DOK 4'. DOK 1 је строго забрањен."
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
              "description": "Ако и ИСКЉУЧИВО ако је предмет математика: укључите проблем са уметањем + наставников подстицај + очекиване одговоре + наставникову напомену. У супротном, празан низ."
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
                  "description": "Кратак увод за ученика у рефлексију, нпр. „Напиши 2-3 реченице као одговор на један подстицај:“"
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
}
};
