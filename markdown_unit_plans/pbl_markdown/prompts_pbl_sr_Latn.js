window.prompts_pbl_sr_Latn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte plan jedinice i časove zasnovane na projektu koristeći informacije ispod:  
Predmet jedinice:
{{$Subject}}
Naziv jedinice:
{{$Name}}
Opis/Uputstvo za jedinicu:
{{$UserPrompt}}
Nivo razreda:
{{$GradeLevel}}
Koliko će projekat trajati u danima
{{$NumberOfDays}}
Lokacija:
{{$Location}}
Resursi/mediji za upotrebu:
{{$MediaContext}}, 
Sadržaj jedinice: 
{{$AttachedUnit}} 
Planovi učenja učenika:
{{$LearningPlans}}
Standardi sa kojima treba uskladiti:
{{$Standards}}
Vaš zadatak je da osmislite detaljnu jedinicu zasnovanu na projektu koristeći principe kognitivne nauke. Vaš izlaz MORA pratiti tačan redosled sekcija, naslova i pravila sadržaja navedenih ispod. Ako bilo koja sekcija nedostaje ili je van redosleda, generišite ponovo dok svi uslovi ne budu ispunjeni. 
Globalna pravila izlaza (primenjuju se na sve) Pratite tačan redosled sekcija i naslove prikazane ispod. Ne dodajte dodatne sekcije niti preimenujte naslove. Problemi iz stvarnog sveta treba da budu relevantni za učenike ovog nivoa razreda. Izbegavajte teme koje mogu biti osetljive u pogledu razvojne prikladnosti, kao i osetljive teme kao što su siromaštvo, stambena nesigurnost, rasa itd., ili kontroverzne teme kao što je evolucija. U dizajn jedinice projekta uključite sledeće komponente.  
Kulturna relevantnost i uključivost: Uključite više perspektiva i razmotrite uticaje na sve uključene. Sadržaj treba da se poveže sa učenicima iz različitih sredina i zajednica kako bi se kreirali kulturno relevantni i kulturno odgovorni časovi. Izbegavajte stereotipe. 
VAŽNO: odgovor mora biti na {{$ResponseLanguage}}

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
      "description": "Vrati kompletan plan jedinice za Project-Based Learning (PBL). Ne dodaj dodatne ključeve. Popuni svako obavezno polje. Mora da funkcioniše za BILO KOJI predmet. Lokalizuj zainteresovane strane/audijenciju/resurse prema datom poštanskom broju/lokaciji bez izmišljanja tačnih adresa/brojeva telefona.",
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
          "description": "Sekcija Procena prethodnog znanja. 1. Uveri se da se koriste DOK 1-3 podsticaji. 2. Uključi veštine predznanja potrebne za ciljeve učenja učenika. 3. Izaberi jedan modalitet sa ove liste i u potpunosti ga razvij: postavljanje pitanja, K-W-L, vizuelni prikazi, koncept mape, reflektivno pisanje, vodiči za anticipaciju, ocenjivanje vokabulara. 4. Početni učiteljev podsticaj sa izjavom 'Reci:'. 5. Jasna uputstva i šablon/struktura za izabrani modalitet. 6. Sekcija 'Očekivani odgovori učenika'. 7. Završni učiteljev podsticaj 'Reci:'. 8. Nakon što u potpunosti razviješ jedan modalitet, navedi 2 kratke alternativne opcije.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Jasna uputstva i šablon/struktura za izabrani modalitet. Npr. 'Reci: \"Pre nego što počnemo...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Predviđeni odgovori ili uobičajene zablude za izabrani modalitet. VAŽNO: Ne uključuj nabrajanja, crtice ili brojeve na početku stringova.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Završni učiteljev podsticaj 'Reci:' koji potvrđuje učeničko razmišljanje i najavljuje istraživanje jedinice."
            },
            "AlternateOptions": {
              "x-format": "**{loc.AlternateOptions}**\n\n{items}",
              "type": "array",
              "description": "2 kratke alternativne opcije koje nastavnik može izabrati.",
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
              "description": "Naslov poruke za pokretanje namenjene učenicima (npr. Poruka od Coconut Creek STEM Innovation Team)."
            },
            "LetterGreeting": {
              "type": "string",
              "description": "Uvodni pozdrav za poruku namenjenu učenicima (npr. 'Zdravo, budući inženjeri,')."
            },
            "LetterBody": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              },
              "description": "Glavni pasusi poruke namenjene učenicima (3-5 pasusa) napisani kao kredibilna lokalna organizacija ili osoba. Mora da sadrži jasnu vezu sa problemom, vodeće pitanje, zahteve za isporučivi proizvod i inspirativan poziv na akciju. Hitno, značajno, autentično. Ne uključuj naslov, pozdrav, završnu frazu (npr. 'Srdačno,') niti ime pošiljaoca ovde. Samo telo poruke u pasusima."
            },
            "LetterSignOff": {
              "type": "string",
              "description": "Završna fraza za poruku (npr. 'Srdačno,'). Navedite samo završnu frazu, ništa drugo."
            },
            "LetterSender": {
              "type": "string",
              "description": "Ime kredibilne lokalne organizacije ili osobe koja šalje poruku (npr. 'Coconut Creek STEM Innovation Team'). Ne uključuj završnu frazu (npr. 'Srdačno') ovde."
            },
            "DrivingQuestion": {
              "type": "string",
              "description": "Jedno snažno, otvoreno vodeće pitanje zasnovano na mestu i potrebama zainteresovanih strana. Ovo pitanje mora takođe biti utkano u telo pisma. MORA se ponovo koristiti doslovno u FramingTheLearning.DrivingQuestion."
            },
            "Mission": {
              "type": "string",
              "description": "Pasus koji počinje sa 'Vaš zadatak je da...' i opisuje šta će učenici stvoriti/uraditi i zašto je to važno za zajednicu/audijenciju."
            },
            "ProjectContextAndStakeholders": {
              "type": "string",
              "description": "Kratka narativna celina: ko je pogođen, zašto je to sada lokalno važno i koje zainteresovane strane/audijencije su zainteresovane."
            },
            "FinalDeliverableRequirements": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 5,
              "items": {
                "type": "string",
                "x-format": "{index}. {value}"
              },
              "description": "Napisano za učenike, opiši konačni isporučivi proizvod koji će kreirati i autentičnu publiku kojoj je namenjen. Formatiraj svaku stavku sa podebljanim naslovom (npr. **Sažetak:** ...). Ne koristi nikakvo numerisanje (kao 1., 2.) niti nabrajanja na početku stringova; počni direktno podebljanim naslovom. Mora da uključi bar kratak sažetak, zatim četiri komponente: (1) Plan koncepta i svrhe koji objašnjava ideju kroz vizuelni ili pisani prikaz i zašto je važna za zajednicu ili kontekst; (2) Argument zasnovan na dokazima koji zahteva analizu najmanje dva relevantna faktora i objašnjenje izbora uz korišćenje dokaza iz istraživanja, podataka, eksperimentisanja ili posmatranja; (3) Model ili predstavu koja opisuje vrstu modela koji je napravljen, šta predstavlja, kako funkcioniše i kako otkriva silu, stabilnost, efikasnost ili sistem iza ideje; i (4) Presudu, završni argument zasnovan na dokazima koji objašnjava zašto je rešenje efikasno, izvodljivo ili značajno, sažima rezonovanje, dokaze i model, i komunicira vrednost dizajna autentičnoj publici. Tvoja završna izjava treba da pokaže da možeš da primeniš disciplinarno znanje, koristiš dokaze, modeluješ složene ideje i objasniš implikacije u stvarnom svetu."
            },
            "ClosingCallToAction": {
              "type": "string",
              "description": "Inspirativan završetak: zajednica/audijencija računa na kreativne mislioce koji mogu da pretvore dokaze u akciju. Naglasi da drevne ideje mogu da inspirišu savremena rešenja."
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
              "description": "Standardi navedeni doslovno kada su dati, u formatu 'KOD: opis'. Ne uključuj nabrajanja na početku stringova."
            },
            "BigIdeasAndEssentialQuestions": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 4,
              "description": "Generiši 3-4 para Velika ideja i Ključno pitanje koji uspostavljaju trajne, prenosive koncepte koji oslanjaju celu jedinicu, usmeravaju istraživanje i dizajn procene, i pružaju sveobuhvatan konceptualni okvir koji povezuje sve zadatke, veštine i aktivnosti u smisleno razumevanje.",
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
                    "description": "Široka, konceptualna tvrdnja trajnog razumevanja koja objašnjava fundamentalni princip koji stoji iza jedinice, povezuje sve zadatke i procene, podržava prenosivo učenje izvan specifičnog konteksta i odražava osnovno disciplinarno mišljenje, a ne izolovane činjenice."
                  },
                  "EssentialQuestion": {
                    "type": "string",
                    "description": "Kreiraj ključna pitanja koja se fokusiraju isključivo na široke, univerzalne pojmove kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Ne pominji nikakve pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorena, prenosiva kroz sve discipline i nemoguća za odgovor učenjem lekcije ili sadržaja jedinice. Fokusiraj se samo na velike ideje, ne na sadržaj predmeta."
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
                  "description": "Svaki cilj mora da se završava sa (DOK X) i da predstavlja Velike ideje ili Trajna razumevanja tako što će generisati 3 do 5 konceptualnih, dugoročnih tvrdnji koje objašnjavaju zašto je učenje važno izvan jedinice, ističu prenosive obrasce, odnose ili principe kroz različite kontekste, i objašnjavaju kako ili zašto nešto funkcioniše, a ne samo šta je to. Napišite ciljeve kao direktne nastavke fraze 'Učenici će razumeti da...'. Ne ponavljajte frazu 'Učenici će razumeti da', i ne počinjite glagolima kao što su 'Objasniti da' ili 'Opisati da' (npr. jednostavno napišite 'inženjerski dizajni se poboljšavaju kada...'). NE uključujte nikakvo numerisanje, stavke sa nabrajanjima ili crtice na početku vaših nizova."
                },
                "StudentsWillKnowThat": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Svaki cilj mora da se završava sa (DOK X) i da predstavlja Činjenice ili Ključna sadržajna znanja tako što će generisati 3 do 5 disciplinarno specifičnih činjenica, termina ili osnovnih tvrdnji znanja koje identifikuju suštinske informacije koje učenici treba da zapamte, da ostanu konkretne i činjenične, a ne konceptualne, da podržavaju standarde jedinice i zadatke učinka, da koriste jasan akademski rečnik primeren predmetu i da uključe odgovarajuću DOK oznaku, obično na nivou 1 ili 2. Napišite ciljeve kao direktne nastavke fraze 'Učenici će znati da...'. Ne ponavljajte frazu 'Učenici će znati da', i ne počinjite glagolima kao što su 'Identifikovati da' ili 'Definisati' (npr. jednostavno napišite 'poluga ima krak sile...'). NE uključujte nikakvo numerisanje, stavke sa nabrajanjima ili crtice na početku vaših nizova."
                },
                "StudentsWillBeAbleTo": {
                  "type": "array",
                  "x-format": "{items}",
                  "minItems": 2,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Svaki cilj mora da se završava sa (DOK X) i da predstavlja Veštine ili Prakse usklađene sa disciplinom tako što će generisati 4 do 7 tvrdnji zasnovanih na veštinama koje opisuju šta će učenici raditi; uskladite ih sa disciplinarno specifičnim praksama; povežite ih direktno sa projektnim isporučivim proizvodom ili zadatkom učinka; neka budu merljive i uočljive; i uključite odgovarajući DOK nivo između 2 i 4. Napišite ciljeve kao direktne nastavke fraze 'Učenici će biti u stanju da...'. Počnite direktno merljivim glagolom radnje (npr. analizirati, uporediti, dizajnirati, modelovati, rešiti). Ne ponavljajte prefiks 'Učenici će biti u stanju da'. NE uključujte nikakvo numerisanje, stavke sa nabrajanjima ili crtice na početku vaših nizova."
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
              "description": "MORA da se poklapa sa UnitOverview.DrivingQuestion doslovno. Navedite stvarno vodeće pitanje (npr. 'Kako možemo da osmislimo pronalazak inspirisan inovacijama drevnog Egipta da bismo rešili stvarni problem u našoj zajednici u Koko Kriuku?')."
            },
            "ProblemDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Opis problema u paragrafima koji objašnjavaju stvarni izazov. Objasnite zašto je problem važan i kakve su posledice ako se ne reši, identifikujući osnovne doprinoseće faktore. Pokažite kako pogrešno razumevanje, nedostajuće informacije ili prevideni faktori doprinose problemu. Objasnite kako rešenje služi stvarnoj, relevantnoj autentičnoj publici. NE uključujte nikakvo numerisanje ili stavke sa nabrajanjem na početku vaših nizova.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n"
              }
            },
            "ProjectDescription": {
              "type": "array",
              "x-format": "{items}",
              "description": "Narativni paragrafi o tome kako se učenje razvija tokom višednevnog projekta (istraživanje -> primena -> usavršavanje -> predstavljanje). Objasnite kako učenici počinju istraživanjem primera, uočavaju obrasce, primenjuju naučna znanja kroz praktična testiranja, a zatim koriste ta saznanja da razviju originalan pronalazak. Objasnite kako revidiraju prototipe i predstavljaju ideje autentičnoj publici. NE uključujte nikakvo numerisanje ili stavke sa nabrajanjem na početku vaših nizova.",
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
              "description": "MORA da uključuje 3 do 5 lokacija za angažovanje zasnovanih na mestu. Obezbedite da lokacije predstavljaju različite kontekste i jasno pokažu kako je lokalna zajednica deo ekosistema učenja.",
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
                    "description": "Značajna fizička, društvena, virtuelna ili disciplinarno specifična lokacija relevantna za kontekst jedinice (npr. 'Kampus srednje škole Coconut Creek (primarno mesto istraživanja)')."
                  },
                  "StudentEngagement": {
                    "type": "string",
                    "description": "Objašnjavanje autentičnih istraživačkih aktivnosti koje učenici obavljaju na lokaciji ili uz nju, kao što su posmatranje, prikupljanje podataka, intervjui, analiza, virtuelno istraživanje ili vođeni terenski zadaci povezani sa stvarnim problemom."
                  },
                  "Relevance": {
                    "type": "string",
                    "description": "Objašnjavanje zašto je lokacija važna povezivanjem sa problemom, pokazujući kako obezbeđuje dokaze ili stručno znanje, pojašnjavajući kako podržava dizajn rešenja ili modelovanje i ističući lokalni ili zajednički značaj."
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
                  "description": "Napravite odeljak sa akademskim rečnikom po nivoima sa tačno četiri označena nivoa.",
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
                        "description": "MORA biti tačno jedno od sledećeg: 'Nivo 1: Osnovni / ključni rečnik', 'Nivo 2: Rečnik primene, modelovanja ili procesa', 'Nivo 3: Rečnik iz stvarnog sveta ili vezan za projekat', 'Nivo 4: Rečnik za obogaćivanje i proširenje'."
                      },
                      "TierWhyItMatters": {
                        "type": "string",
                        "description": "Kratka kurzivom napisana rečenica koja objašnjava kako ovi termini pomažu učenicima u kontekstu projekta (npr. 'Ovi termini pomažu učenicima da imenuju najvažnije ideje i objekte koje će videti, graditi i o kojima će razgovarati tokom projekta.')."
                      },
                      "Terms": {
                        "type": "array",
                        "minItems": 3,
                        "x-format": "\n\n{items}",
                        "description": "Navedite vokabular primeren jedinici sa definicijama razumljivim učenicima.",
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
                              "description": "Reč iz vokabulara (npr. 'sila'). Ne uključujte nikakvo numerisanje ili stavke sa nabrajanjem."
                            },
                            "Definition": {
                              "type": "string",
                              "description": "Definicija razumljiva učenicima."
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
              "description": "Identifikujte i uključite autentičnu publiku izvan učionice.",
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
                        "description": "Naziv određene grupe autentične publike (npr. 'Savet za održivost i zaštitu životne sredine grada Coconut Creek'). Ne uključujte stavke sa nabrajanjem ili numerisanje."
                      },
                      "PrimaryAudienceDescription": {
                        "type": "string",
                        "description": "Jasan opis ko je ta publika (pojedinci, organizacije ili grupe) i kakav je njihov odnos prema kontekstu ili problemu projekta. Mora biti detaljno, najmanje 2-3 rečenice."
                      },
                      "WhyThisAudienceIsQualified": {
                        "type": "string",
                        "description": "Objašnjenje zašto ova publika ima relevantnu stručnost, iskustvo iz stvarnog života ili autoritet vezan za temu projekta. Mora biti detaljno, najmanje 2-3 rečenice."
                      },
                      "HowThisAudienceElevatesTheProject": {
                        "type": "string",
                        "description": "Kako prisustvo ove publike povećava autentičnost, rigoroznost, motivaciju ili uticaj u stvarnom svetu za učenike. Mora biti detaljno, najmanje 2-3 rečenice."
                      }
                    }
                  }
                },
                "StudentParticipation": {
                  "type": "string",
                  "description": "Pasus koji objašnjava kako učenici pomažu da se identifikuje koja publika najbolje odgovara njihovom izumu tako što razgovaraju o tome ko bi imao koristi od rešenja ili ko bi ga ocenio."
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
                    "description": "Merljivi ishod učenja učenika koji se završava DOK nivoom. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "SuccessCriteria": {
                    "type": "string",
                    "description": "Specifični kriterijumi uspeha koji objašnjavaju šta će učenik uraditi da pokaže učenje. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "PointOfDemonstration": {
                    "type": "string",
                    "description": "Gde će se dokaz pojaviti, odvojen izjavama Formativno: i Sumativno:. Ne uključujte nabrajanje ni numerisanje."
                  }
                }
              }
            },
            "AnalyticRubric": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 4,
              "description": "Analitička rubrika koja detaljno opisuje kompetencije potrebne za projekat. Svaki red predstavlja jednu procenjenu veštinu. Napredovanje od Početnika do Eksperta mora odražavati sve veću sofisticiranost.",
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
                    "description": "Procena veština, kompetencije ili dimenzije završnog projekta. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "Novice": {
                    "type": "string",
                    "description": "Opis performansi na nivou početnika. Ne sme koristiti jezik zasnovan na deficitu, kao što su ne uspeva, nedostaje ili odsustvuje. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "Apprentice": {
                    "type": "string",
                    "description": "Opis performansi na nivou šegrta. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "Practitioner": {
                    "type": "string",
                    "description": "Opis performansi na nivou praktičara. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "Expert": {
                    "type": "string",
                    "description": "Opis performansi na nivou eksperta. Mora se nadograđivati na nivo praktičara sa dubljim uvidom, preciznošću ili složenošću. Ne uključujte nabrajanje ni numerisanje."
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
              "description": "Sažetak od 2-4 rečenice koji objašnjava kako je projekat organizovan u tri fleksibilne faze (Faza 1, Faza 2, Faza 3) umesto u fiksan broj dana. Ukratko opišite šta učenici rade u svakoj fazi (npr. u Fazi 1 grade predznanje; u Fazi 2 primenjuju naučne ideje kroz istraživanja; u Fazi 3 dorađuju prototipe i predstavljaju autentičnoj publici). Ne koristite nabrajanje ni numerisanje."
            },
            "ProjectPhases": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "maxItems": 3,
              "description": "Tri faze projekta. Ukupno trajanje kroz sve 3 faze MORA tačno da bude jednako ukupnom broju dana traženom za projekat.",
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
                    "description": "Naziv i trajanje faze (npr. 'Faza 1: 1-2 dana' ili 'Faza 3: 2 dana'). VAŽNO: Trajanje mora biti izričito navedeno u nazivu, a zbir maksimalnih dana kroz sve faze mora tačno odgovarati ukupnoj traženoj dužini projekta. Ne uključujte nabrajanje ni numerisanje."
                  },
                  "PhaseDescription": {
                    "type": "string",
                    "description": "Kratak pasus od 1-2 rečenice koji opisuje šta učenici rade tokom ove faze kako bi produbili razumevanje ili sintetisali učenje."
                  },
                  "ConceptsOrSkills": {
                    "type": "string",
                    "description": "Lista osnovnih pojmova ili veština, odvojenih zarezima, na koje se u ovoj fazi stavlja naglasak (npr. 'Posmatranje, postavljanje pitanja, modelovanje, polužni sistemi, stabilnost strukture'). Ne uključujte nabrajanje ni numerisanje."
                  },
                  "CollaborationAndVisibleThinking": {
                    "type": "string",
                    "description": "Rečenica koja objašnjava kako učenici sarađuju i čine svoje razmišljanje vidljivim u ovoj fazi (npr. 'Učenici koriste think-pair-share, skicirane beleške i brza grupna poređenja da bi svoje razmišljanje učinili vidljivim.'). Ne uključujte nabrajanje ni numerisanje."
                  },
                  "KeyLearningExperiences": {
                    "type": "array",
                    "x-format": "{items}",
                    "minItems": 3,
                    "description": "Lista specifičnih aktivnosti ili zadataka učenja u ovoj fazi.",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}",
                      "description": "Specifična aktivnost učenja (npr. 'Izrada i testiranje šadufa'). Ne uključujte numerisanje ni nabrajanje na početku svojih stringova."
                    }
                  }
                }
              }
            },
            "ProjectGoals": {
              "type": "array",
              "x-format": "{items}",
              "minItems": 3,
              "description": "Izlaz mora da sadrži tačno tri cilja projekta, od kojih je svaki izražen kao konceptualna kategorija praćena detaljnim nabrajanjima ili kratkim pasusima. Cilj 1, Primena disciplinskog sadržaja na problem iz stvarnog sveta, zahteva da učenici koriste znanje specifično za disciplinu da analiziraju ili reše autentični izazov, navedu 4-6 osnovnih pojmova ili principa koje će primeniti i pokažu kako se te ideje povezuju sa uslovima ili ograničenjima iz stvarnog sveta. Cilj 2, Rešavanje stvarnog, razvojno primerenog problemskog zadatka ili istraživačkog problema, zahteva opis autentičnog izazova na koji učenici moraju da odgovore, navođenje onoga što će kreirati, modelovati, uporediti, analizirati, proceniti ili opravdati, i uključivanje procesa kao što su modelovanje, predviđanje, poređenje, procenjivanje i donošenje odluka. Cilj 3, Saopštavanje nalaza stvarnoj publici, zahteva da učenici pripreme uglađen, profesionalno kvalitetan završni proizvod, prilagode komunikaciju potrebama stvarne zainteresovane grupe i navedu autentične publike kao što su lokalni stručnjaci, organizacije zajednice, stručnjaci iz industrije, školsko rukovodstvo, porodice ili članovi zajednice.",
              "items": {
                "type": "string",
                "x-format": "{value}\n\n",
                "description": "Specifičan cilj projekta formatiran podebljanim oznakama (npr. '**Goal 1: Apply Disciplinary Content to a Real-World Problem** Use knowledge...')"
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
              "description": "Opisuje veličinu grupe, uloge i dužnosti nastavnika.",
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
                  "description": "Izlaz mora navesti preporučenu veličinu grupe, kao što je 3 do 4 učenika, i mora pružiti obrazloženje koje objašnjava kako ova veličina podržava produktivnu diskusiju, zajedničko angažovanje i upravljivu raspodelu zadataka. Primer: 'Veličina grupe od 3 do 4 učenika je idealna zato što...'"
                },
                "RotatingRolesAndDuties": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Izlaz mora navesti listu uloga formatiranu kao 'Naziv uloge: opis dužnosti'. Lista mora da sadrži najmanje četiri uloge (Facilitator, Recorder, Materials Manager, Presenter/Communicator) i očekivanja od nastavnika na kraju.",
                  "minItems": 4,
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "TeacherGroupingStrategyPrompt": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Model mora da izbaci tačno ova dva niza: 1) '\"What is the main purpose of your grouping in this activity-peer support, rich discussion, challenge, or efficiency? Once you have named the purpose, which grouping approach best fits it: mixed-ability, interest-based, skills-based, or random?\"' 2) 'Ovo pitanje podstiče nastavnike da izaberu metode grupisanja koje odgovaraju nastavnim ciljevima, umesto da se oslanjaju na praktičnost ili naviku.'",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}\n"
                  }
                },
                "GroupingStrategyRecommendations": {
                  "type": "array",
                  "x-format": "{items}",
                  "description": "Model mora da izbaci tačne preporuke za strategiju grupisanja formatirane podebljanim oznakama (npr. '**Mixed-ability Groups:** Najbolje kada...'). Strategije koje treba uključiti: Mixed-ability Groups, Interest-based Groups, Skills-based Groups, Randomized Groups.",
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
          "description": "Prva faza nastavničkog vođenja",
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
              "description": "Obezbedite kratku izjavu koja opisuje kako ova faza gradi radoznalost, uvodi problem iz stvarnog sveta i aktivira rano rezonovanje. Izjava fokusa mora da uključuje podsticanje radoznalosti o osnovnom fenomenu ili problemu, rano posmatranje i istraživanje, zapažanja i pitanja koja dolaze od učenika, kao i jasnu vezu sa vodećim pitanjem jedinice. Formulacija treba da odražava da u ovoj uvodnoj fazi učenici grade radoznalost i počinju da otkrivaju naučni ili konceptualni problem u srži projekta, i da kroz posmatranje, istraživanje i rane pokušaje modelovanja prikupljaju neposredne dokaze koji povezuju njihovo početno razmišljanje sa vodećim pitanjem."
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
                      "description": "Generišite 2-3 podrške specifične za lekciju (vizuelni prikazi, rečnici, gestovi) kako biste pomogli učenicima koji uče jezik da pristupe idejama i izraze ih. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Generišite 3-4 početne rečenice koje pomažu učenicima da opišu, objasne i saopšte svoje razmišljanje za ovu specifičnu lekciju. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "Generišite 2-3 podrške korak po korak (strukturisani alati, modeli primera, glasno razmišljanje) i precizne smernice koje će pomoći učenicima da završe zadatak. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Generišite 3-4 pitanja sa kontrolne liste koja će voditi učenike u razumevanju sopstvenog učenja tokom istraživanja. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "Generišite 2-3 proširenja koja povećavaju složenost (specifični izazovi, identifikacija obrazaca) kako biste pomogli učenicima da prodube ili poboljšaju svoje razmišljanje koristeći dokaze. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Generišite jedan složen podsticaj/pitanje (ne uključujte prefiks 'Recite:') za podsticanje dubljeg konceptualnog razumevanja."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Generišite 3-4 konkretna primera visokokvalitetnih odgovora učenika na napredno pitanje. NE počinjite stavke tačkama, crticama ili brojevima. Samo napišite običan tekst.",
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
              "description": "Ovaj odeljak mora da sadrži dve vrste podrške: Opšte podrške i Individualizovane podrške. Fokus je na pristupu, a ne na smanjenju rigoroznosti.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Nestručne strategije specifične za učenike koje poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, podeljena uputstva na delove). Dajte 2-4 stavke u formi nabrajanja."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specifične adaptacije i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; ne grupišite učenike zajedno. Podrške za svakog učenika treba da budu lako pregledna lista.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Ime i prezime pojedinačnog učenika koji prima ovu podršku."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Formalni plan dat za ovog učenika u promptu. Raščlanite plan u jasnu listu. Možete parafrazirati radi boljeg formata, ali nemojte izostaviti niti dodati bilo kakve informacije."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Konkretni alati/stabljike/vizuali/organizatori za ovaj zadatak."
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
              "description": "Generišite 2-3 uobičajene zablude učenika koje će verovatno iskrsnuti tokom ove faze. Svaka stavka mora da se fokusira na konkretno nerazumevanje i na skriptu odgovora nastavnika.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Opišite zabludu u 1 rečenici, počevši sa 'Učenici možda misle...'. NE koristite nikakvo podebljavanje ili strong tagove."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Jasna skripta odgovora usmerena ka nastavniku (koja počinje sa 'Odgovor nastavnika: ') koja modeluje kako odgovoriti u datom trenutku uz konkretan podsticaj (ne uključujte prefiks 'Recite:'). NE koristite nikakvo podebljavanje ili strong tagove."
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
                  "description": "Generišite 1 transcendentalno pitanje za razmišljanje koje od učenika zahteva da primene učenje izvan sebe, na kontekste iz stvarnog sveta (zajednice, globalni izazovi). Fokusirajte se na to zašto je učenje važno na velikoj skali (bezbednost, održivost, inovacije itd.). Izbegavajte lični/fokus samo na školu."
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
              "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju savladanost",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
              "description": "Model mora da kreira komponentu Razmaknutog prisećanja koja od učenika zahteva da se sete ključnog pojma iz određene prethodne jedinice ili časa bez pozivanja na bilo kakve prethodne aktivnosti, radne listove, modele, oznake ili korake specifične za zadatak. Skripta nastavnika mora početi sa Recite: i može da se odnosi samo na temu prethodnog učenja, a ne na ono što su učenici o tome naučili. Pitanje za prisećanje mora da podstakne učenike da ponovo iznesu ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako su varijable povezane ili kako se proces odvija) isključivo iz pamćenja, bez toga da nastavnik daje tragove ili delimična objašnjenja. Izlaz mora da se završi sa Očekivanim odgovorima učenika, prikazujući 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici — a ne prompt — izneli zapamćene ideje.",
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
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke sa nabrajanjem, crticama ili brojevima. Samo napišite običan tekst.",
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
              "description": "Jedan pasus koji objašnjava znanje i veštine koje se vežbaju kroz sve zadatke u ovoj fazi. Pasus MORA da počinje sa 'Ovi zadaci učvršćuju današnje učenje o ____ kroz ______.' pri čemu se praznine popunjavaju relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
            },
            "Phase1_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Zadaci treba da budu usklađeni sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                    "description": "Nivo dubine znanja za zadatak. MORA biti JEDAN od: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je strogo zabranjen."
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
              "description": "Ako i samo ako je predmet matematika: uključite problem međusobnog preplitanja + nastavnikov podsticaj + očekivane odgovore + nastavnikovu napomenu. U suprotnom prazan string."
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
                  "description": "Kratak uvod za učenike u refleksiju, npr. 'Napiši 2-3 rečenice odgovarajući na jedan podsticaj:'"
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
          "description": "Druga faza nastavničkih smernica",
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
              "description": "Napišite Focus Statement od 1-3 rečenice koji sažima svrhu faze, objašnjava kako učenici grade razumevanje kroz rad zasnovan na istraživanju, izričito povezuje fazu sa Pokretačkim pitanjem jedinice ili realnim problemom i opisuje kako ova faza približava učenike stvaranju njihovog konačnog proizvoda. Izjava uvek mora biti napisana kao jedan kratak pasus i mora biti prilagođena specifičnim detaljima projekta koje je korisnik naveo."
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
                      "description": "Generiši 2-3 podrške specifične za lekciju (vizuali, banke reči, gestovi) koje će pomoći učenicima jezika da pristupe idejama i izraze ih. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Generiši 3-4 početne rečenice koje pomažu učenicima da opišu, objasne i saopšte svoje razmišljanje za ovu konkretnu lekciju. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "Generiši 2-3 podrške korak po korak (strukturirani alati, modeli primera, razmišljanje naglas) i tačno vođenje kako bi pomogao učenicima da završe zadatak. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Generiši 3-4 pitanja sa kontrolne liste koja će voditi učenike da razumeju svoje učenje tokom istraživanja. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "Generiši 2-3 proširenja koja povećavaju složenost (specifični izazovi, identifikacija obrazaca) kako bi pomogla učenicima da prodube ili unaprede svoje razmišljanje koristeći dokaze. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Generiši jedno složeno pitanje/prompt (NE uključuj prefiks 'Recite:') koje podstiče dublje konceptualno razumevanje."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Generiši 3-4 konkretna primera visokokvalitetnih odgovora učenika na napredno pitanje. NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
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
              "description": "Ovaj odeljak mora da uključuje dve vrste podrške: Opšte podrške i Individualizovane podrške. Fokusiraj se na pristup, a ne na smanjenje rigoroznosti.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategije koje nisu specifične za učenike i koje poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, instrukcije podeljene u korake). Navedi 2-4 stavke pod tačkama."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specifične prilagodbe i modifikacije za imenovane učenike sa formalnim planovima. NavedI SVAKOG učenika pojedinačno; NE grupiši učenike zajedno. Podrška za svakog učenika treba da bude lista koja se lako pregleda.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Ime i prezime pojedinačnog učenika koji dobija ove podrške."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Formalni plan naveden za ovog učenika u promptu. Raščlani plan u jasnu listu. Možeš parafrazirati radi boljeg formatiranja, ali NEMOJ da izostaviš ili dodaš bilo koju informaciju."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Konkretni alati/početne formulacije/vizuali/organizeri za ovaj zadatak."
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
              "description": "Generiši 2-3 uobičajene zablude učenika koje bi verovatno mogle da se pojave tokom ove faze. Svaka stavka mora da se fokusira na određeno nerazumevanje i skriptu odgovora nastavnika.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Opiši zabludu u 1 rečenici, počevši sa 'Students may think...'. NE koristi podebljavanje niti jake oznake."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Jasna skripta odgovora za nastavnika (počevši sa 'Odgovor nastavnika: ') koja pokazuje kako da se reaguje u trenutku uz konkretan podsticaj (ne uključuj prefiks 'Recite:'). NE koristi podebljavanje niti jake oznake."
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
                  "description": "Generiši 1 transcendentno pitanje za razmišljanje koje zahteva od učenika da primene učenje izvan sebe, u stvarnim kontekstima (zajednice, globalni izazovi). Fokusiraj se na to zašto je učenje važno na velikoj skali (bezbednost, održivost, inovacija itd.). Izbegavaj lični/školski fokus."
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
              "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju ovladanost",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "NEMOJ da započinješ stavke pod tačkama, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
              "description": "Model mora da kreira komponentu za razmaknuto prisećanje koja zahteva od učenika da se prisete ključnog koncepta iz određene prethodne jedinice ili lekcije bez pozivanja na bilo koje prethodne aktivnosti, radne listove, modele, oznake ili korake specifične za zadatak. Nastavnički scenario mora početi sa Recite: i može se odnositi samo na temu prethodnog učenja, a ne na ono što su učenici o tome naučili. Pitanje za prisećanje mora podstaći učenike da ponovo izraze ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako su promenljive povezane ili kako se proces odvija) isključivo iz sećanja, bez davanja nagoveštaja ili delimičnih objašnjenja od strane nastavnika. Izlaz mora da se završi sa Očekivani odgovori učenika i da sadrži 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici, a ne prompt, izneli zapamćene ideje.",
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
                      "description": "NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
              "description": "Jedan pasus koji objašnjava znanje i veštine koje se vežbaju kroz sve zadatke u ovoj fazi. Pasus MORA da počne sa 'These tasks reinforce today's learning about ____ by ______.' pri čemu su praznine popunjene relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
            },
            "Phase2_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Zadaci treba da budu usklađeni sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                    "description": "Nivo dubine znanja za zadatak. MORA biti JEDNO od sledećeg: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je strogo zabranjen."
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
              "description": "Ako i SAMO AKO je predmet matematika: uključite interleaving problem + nastavnički podsticaj + očekivane odgovore + nastavničku napomenu. U suprotnom prazna niska."
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
                  "description": "Kratak uvod namenjen učenicima za refleksiju, npr. 'Napiši 2-3 rečenice kao odgovor na jedan podsticaj:'"
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
          "description": "Treća faza nastavničkog usmeravanja",
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
              "description": "Generiši fokusnu izjavu od 2-4 rečenice koja jasno saopštava svrhu Faze 3 i njenu ulogu u vođenju učenika ka konačnom proizvodu. Izjava mora objasniti da se Faza 3 fokusira na dorađivanje ideja, primenu učenja, jačanje dokaza, pripremu završnih proizvoda i uključivanje u dublje rezonovanje i reviziju. Mora izričito pokazati kako Faza 3 unapređuje autentičan stvarni izazov projekta, kako učenici koriste dokaze da poboljšaju rešenja i kako ih ovaj rad priprema za autentičnu publiku. Izjava mora sadržati intelektualni rad kao što su dorađivanje, revizija, sintetisanje, procenjivanje, opravdavanje, finalizovanje i komunikacija, i mora ukazivati na to kako učenici finalizuju modele, proizvode, objašnjenja ili predloge, pripremaju prezentacije ili javna prikazivanja i razmišljaju o učenju kako bi ojačali svoje rezonovanje."
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
                      "description": "Generiši 2-3 podrške specifične za lekciju (vizuali, banke reči, gestovi) kako bi se učenicima koji uče jezik olakšao pristup i izražavanje ideja. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "SentenceStarters": {
                      "type": "array",
                      "description": "Generiši 3-4 početka rečenica koji pomažu učenicima da opišu, objasne i saopšte svoje razmišljanje za ovu specifičnu lekciju. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "Generiši 2-3 podrške korak po korak (strukturisani alati, modeli primera, razmišljanje naglas) i tačno uputstvo koje pomaže učenicima da završe zadatak. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "Checklist": {
                      "type": "array",
                      "description": "Generiši 3-4 pitanja sa kontrolne liste koja vode učenike da razumeju svoje učenje tokom istraživanja. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
                      "description": "Generiši 2-3 proširenja koja povećavaju složenost (specifični izazovi, identifikacija obrazaca) kako bi se učenicima pomoglo da prodube ili unaprede svoje razmišljanje koristeći dokaze. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
                      "items": {
                        "x-format": "- {value}",
                        "type": "string"
                      }
                    },
                    "AdvancedQuestion": {
                      "type": "string",
                      "description": "Generiši jedan složen podsticaj (ne uključuj prefiks 'Recite:')/pitanje koje će podstaći dublje konceptualno razumevanje."
                    },
                    "ExpectedResponses": {
                      "type": "array",
                      "description": "Generiši 3-4 konkretna primera kvalitetnih odgovora učenika na napredno pitanje. NE POČINjI stavke sa nabrajanjem, crticama ili brojevima. Samo napiši običan tekst.",
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
              "description": "Ovaj odeljak mora da sadrži dve vrste podrške: Opštu podršku i Individualizovanu podršku. Fokus je na pristupu, a ne na smanjenju rigoroznosti.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategije koje nisu specifične za određenog učenika, a poboljšavaju pristup za sve učenike (npr. vizuelni prikazi, unapred popunjene beleške, digitalni rečnik, instrukcije podeljene na manje delove). Navedite 2-4 stavke u formatu bullet points."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specifične prilagodbe i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; NE grupišite učenike zajedno. Podrška za svakog učenika treba da bude lista koju je lako pregledati.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Ime i prezime pojedinačnog učenika koji prima ovu podršku."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Formalni plan koji je za ovog učenika dat u promptu. Razložite plan u jasnu listu. Možete parafrazirati radi boljeg formatiranja, ali NE izostavljajte niti dodajte bilo kakve informacije."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Konkretni alati/starteri/vizuelni prikazi/organizatori za ovaj zadatak."
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
              "description": "Generišite 2-3 česte zablude učenika koje bi se verovatno javile tokom ove faze. Svaka stavka mora da se fokusira na određenu pogrešnu pretpostavku i na skriptu za odgovor nastavnika.",
              "items": {
                "type": "object",
                "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Opišite zabludu u 1 rečenici, počevši sa 'Students may think...'. NE koristite podebljavanje niti strong tagove."
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Jasna skripta za odgovor nastavnika namenjena nastavniku (počinje sa 'Odgovor nastavnika: ') koja pokazuje kako odgovoriti u trenutku uz konkretan podsticaj (ne uključujte prefiks 'Recite:'). NE koristite podebljavanje niti strong tagove."
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
                  "description": "Generišite 1 transcendentno pitanje za razmišljanje koje zahteva od učenika da primene učenje izvan sebe, u kontekstima stvarnog sveta (zajednice, globalni izazovi). Fokusirajte se na to zašto je učenje važno na velikoj skali (bezbednost, održivost, inovacije itd.). Izbegavajte lični/školski fokus."
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
              "description": "Završno pitanje za proveru razumevanja sa 2-3 očekivana odgovora učenika koji pokazuju savladanost",
              "properties": {
                "BeginningOfPhase": {
                  "type": "object",
                  "properties": {
                    "Prompt": {
                      "type": "string"
                    },
                    "SuccessCriteriaOrExpectedResponses": {
                      "type": "array",
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
              "description": "Model mora da kreira komponentu Razmaknuto prisećanje koja zahteva od učenika da se prisete ključnog koncepta iz određene prethodne jedinice ili lekcije bez pozivanja na bilo kakve prethodne aktivnosti, radne listove, modele, oznake ili korake specifične za zadatak. Skripta nastavnika mora početi sa Recite: i može se odnositi samo na temu prethodnog učenja, a ne na ono što su učenici o tome naučili. Pitanje za prisećanje mora da podstakne učenike da ponovo iznesu ili primene prethodno naučeno konceptualno razumevanje (kao što je kako sistem funkcioniše, kako su promenljive povezane ili kako se proces odvija) potpuno iz memorije, bez davanja nagoveštaja ili delimičnih objašnjenja. Izlaz mora da se završi sa Očekivani odgovori učenika koji prikazuje 2-3 primera koji tačno odražavaju konceptualno prisećanje, pokazujući da su učenici — a ne prompt — izneli zapamćene ideje.",
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
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
                      "description": "NE počinjite stavke bullet pointovima, crticama ili brojevima. Samo napišite običan tekst.",
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
              "description": "Jedan pasus koji objašnjava znanja i veštine koje se vežbaju kroz sve zadatke u ovoj fazi. Pasus MORA da počne sa 'These tasks reinforce today's learning about ____ by ______.' pri čemu se prazna mesta popunjavaju relevantnim sadržajem projekta, nakon čega sledi objašnjenje kako ovi zadaci jačaju dugoročno pamćenje."
            },
            "Phase3_StudentPractice_Tasks": {
              "type": "array",
              "minItems": 2,
              "maxItems": 3,
              "description": "Zadaci treba da budu usklađeni sa fokusom faze i očekivanom dubinom znanja. Koristite samo DOK 2, 3 ili 4.",
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
                    "description": "Nivo dubine znanja za zadatak. MORA biti JEDNO od: 'DOK 2', 'DOK 3' ili 'DOK 4'. DOK 1 je strogo zabranjen."
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
              "description": "Ako i SAMO AKO je predmet matematika: uključite smenjivanje zadataka + nastavnikov podsticaj + očekivane odgovore + nastavnikovu napomenu. U suprotnom prazna niska."
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
                  "description": "Kratak uvod za učenike u refleksiju, npr. 'Napiši 2-3 rečenice kao odgovor na jedan podsticaj:'"
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
