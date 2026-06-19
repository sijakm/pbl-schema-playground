window.promptssrLatn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte pregled jedinice i strukturu časa koristeći informacije ispod. Nemojte pisati kompletne planove časova.
                    
Na osnovu predmeta jedinice, obrazovnih standarda, opisa/uputstva za jedinicu, razreda, trajanja časa (u minutima) i traženog broja časova, generišite JSON odgovor koji uključuje kohezivan UnitDescription i listu „kontejnera“ za časove koji se međusobno ne preklapaju.

Predmet jedinice:
{{$Subject}}

Naziv jedinice:
{{$Name}}

Opis/uputstvo za jedinicu:
{{$UserPrompt}}

Nivo razreda:
{{$GradeLevel}}

Trajanje časa u minutima:
{{$ClassDuration}}
	
Standardi za usklađivanje:
{{$Standards}}
    
Učenici sa individualizovanom podrškom:
{{$LearningPlans}}

Resursi/mediji za korišćenje:
{{$MediaContext}}
	
Sadržaj jedinice:
{{$AttachedUnit}}

Zahtevi za suštinska pitanja:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA počinjati sa „Kako” ili „Zašto”.

- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rasuđivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva kroz discipline i primenljiva izvan ove jedinice.
- Pitanja MORAJU biti korišćena doslovno u svakom času unutar jedinice.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: U potpunosti popunite sva svojstva unutar objekta "UnitDescription":
  - "Description": Napišite pasus od 4-5 rečenica koji opisuje osnovni fokus jedinice i narativni tok učenja.
  - "StudentLearningObjectives": Navedite 3-5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedite sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja koja prate gore navedena pravila.
- GENERIŠITE listu "Lessons" koja sadrži tačno {{$NumberOfItems}} časova.
  - Svaki čas mora uključivati "lessonNumber" (indeks počev od 1), "lessonName" i "lessonDescription" (2–4 rečenice koje opisuju obim časa).

Ograničenja:
- Držite jedinicu i svaki čas usklađene sa fokusom jedinice.
- Obezbedite logičan sled od osnovnih ideja ka složenijem modelovanju.
- Tačnost: Sav sadržaj mora biti naučno tačan i primeren uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristite kompaktno formatiranje (bez dodatnih praznih linija).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Kreirajte JEDAN plan časa (NE plan jedinice, NE više časova) koristeći informacije ispod.
MORATE da izbacite važeći JSON koji tačno odgovara datoj JSON šemi (LessonPlanResponse sa jednim objektom "LessonPlan"). Ne uključujte dodatne ključeve. Koristite kompaktno JSON formatiranje (bez dodatnih praznih linija).
Predmet jedinice: 
{{$Subject}}
Naziv jedinice: 
{{$Name}}
Opis/Uputstvo jedinice: 
{{$UserPrompt}}
Razred: 
{{$GradeLevel}}
Trajanje časa u minutima 
{{$ClassDuration}}
Resursi/mediji za upotrebu: 
{{$MediaContext}}
Sadržaj jedinice: 
{{$ParentUnitData}}
Standardi sa kojima treba uskladiti:
{{$Standards}}
Priloženi sadržaj časa: 
{{$AttachedLesson}}

Suštinska pitanja jedinice (KORISTITE OVA DOSLOVNO):
{{$UnitEssentialQuestions}}

Ako su Suštinska pitanja jedinice iznad prazna, generišite tačno 3 konceptualna pitanja prema sledećim pravilima:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA počinjati sa „Kako” ili „Zašto”.

- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definicijska.
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva između disciplina i primenljiva van ove jedinice.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORA se koristiti ISKLJUČIVO unutar GuidedPractice.AccommodationsAndModifications; koristite imena/planove učenika tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA:
- Održite čas usklađen sa fokusom jedinice: razvijanje i korišćenje modela za opisivanje atomske kompozicije prostih molekula i/ili proširenih struktura.
- Uključite kratke, visokog nivoa veze sa drugim relevantnim DCI gde je prikladno, ali zadržite čas usmeren na modelovanje i rezonovanje o strukturi i svojstvima (bez duboke matematike, bez balansiranja jednačina osim ako standardi to izričito zahtevaju).
- Osigurajte da svi delovi časa odražavaju gore navedeni obim/granice časa; izbegavajte unošenje novih glavnih pojmova koji pripadaju drugim časovima.
- EssentialQuestions: MORAJU tačno biti jednake suštinskim pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako je LessonNumber == 1, napišite 150–250 reči i pratite traženu strukturu u opisu šeme. Ako LessonNumber != 1, vratite "" (prazan string).
- DirectPresentation mora biti ≤10 minuta ukupno i mora pratiti traženi format HOOK/INTRODUCTION/DIRECT TEACHING/GUIDED ENGAGEMENT sa Say/Do/Ask/✅ Expected Student Responses/Write, a očekivani odgovori učenika treba da budu u vidu nabrajanja (NE uključujte zaglavlja/naslove odeljaka u string).
- GuidedPractice.InstructionsForTeachers mora imati najmanje 700 reči i mora sadržati tražene komponente navedene u opisu šeme.
- GuidedPractice.AccommodationsAndModifications mora da sadrži:
  - General: opšte podrške
  - IndividualSupport: niz sa tačno navedenim učenicima i njihovim planovima (ista imena/planovi; bez dodatnih učenika).
- StudentPractice MORA da sadrži TeacherNotes pasus koji počinje sa 'These tasks reinforce today’s learning about ____ by ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, i međusobno prožimanje ako je predmet matematika.

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji tačno odgovara datoj šemi.
- Izlaz MORA biti JEDAN jedini plan časa.
- Bez HTML-a. Bez emodžija. Bez markdowna. Običan tekst unutar string polja.

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
          "description": "Opis jedinice kao jedan povezan paragraf običnog teksta (4–5 potpunih rečenica) napisan prirodnim učiteljskim glasom koji biste mogli direktno reći učenicima. Bez HTML-a, bez emodžija, bez nabrajanja. Mora teći razgovorno, ali pratiti ovu strukturu (bez naslova): (1) uvodna rečenica koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovoj jedinici ćete...” o ishodima savladavanja, (3) rečenica „Ojačaćete svoje veštine u...” o misaonim/analitičkim sposobnostima, (4) rečenica „Ovo se povezuje sa...” o relevantnosti za stvarni svet, (5) rečenica „Razumevanje ovoga je važno zato što...” o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Napravite suštinska pitanja koja se fokusiraju samo na široke, univerzalne pojmove kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Nemojte pominjati nijedne pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorena, prenosiva preko svih disciplina i nemoguća za odgovor bez učenja sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Potpuna sekcija 'Student Learning Objectives' za celu ovu jedinicu. Svaka stavka liste mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava oznakom DOK u zagradi",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Navedite sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim lekcijama. Nemojte dodavati standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži šifru standarda i opis, npr. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
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
      "description": "Spisak kontejnera za lekcije za ovu jedinicu (samo pregled). Svaka stavka mora biti nepokrivajuća i jasno obuhvaćena tako da sadržaj lekcije ne bude ponavljan kroz lekcije.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Redni broj lekcije. Zasnovano na 1."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Kratak naslov lekcije kao običan tekst."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 rečenice koje opisuju obim lekcije, fokus i granice kako bi se sprečilo preklapanje sa drugim lekcijama."
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
          "description": "Samo nalepite sva suštinska pitanja na nivou jedinice istim redosledom ako su data. Ako nisu data, generišite tačno 3 konceptualna pitanja koja se fokusiraju samo na široke, univerzalne pojmove kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Nemojte pominjati nijedne pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorena, prenosiva preko svih disciplina i nemoguća za odgovor bez učenja sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "type": "string"
          },
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}"
        },
        "KeyVocabulary": {
          "type": "array",
          "description": "Potpuna sekcija 'Key Vocabulary' kao lista stringova. Svaki string treba da bude jedan termin sa definicijom odvojenom crticom. Primer: 'Gravity - Sila koja privlači objekte jedne ka drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
          "items": {
            "type": "string",
            "x-format": "{index}. {value}"
          },
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}"
        },
        "StudentLearningObjectives": {
          "type": "array",
          "description": "Potpuna sekcija 'Student Learning Objectives' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava oznakom DOK u zagradi, npr. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'.",
          "items": {
            "type": "string",
            "x-format": "- {value}\n"
          },
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}"
        },
        "StandardsAligned": {
          "type": "array",
          "description": "Potpuna sekcija 'Standards Aligned' za ovu lekciju kao lista. Svaki standard mora da uključuje šifru standarda i opis, a šifra i opis moraju biti potpuno isti kao u jedinici. npr. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
          "items": {
            "type": "string",
            "x-format": "- {value}"
          },
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}"
        },
        "AssessPriorKnowledge": {
          "type": "object",
          "description": "Sekcija Assess Prior Knowledge. SAMO Lekcija 1 treba da sadrži detaljan blok; SVE DRUGE LEKCIJE MORAJU VRAĆATI PRAZNE NIZOVE za sva polja. Za Lekciju 1, struktura mora da uključuje ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt i AlternateOptions. 1. Osigurajte da se koriste DOK 1-3 zadaci. 2. Uključite predznanja. 3. Izaberite jedan modalitet i potpuno ga razradite. 4. Obezbedite početne nastavničke podsticaje, uputstva, očekivane odgovore, završne podsticaje i 2 alternativne opcije.",
          "properties": {
            "ActivityInstructions": {
              "type": "array",
              "description": "Sekvencijalni koraci (npr. 'Say: ...', 'Project or read...') za početak aktivnosti.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "ExpectedStudentResponses": {
              "type": "array",
              "description": "Predviđeni odgovori ili uobičajene zablude za izabrani modalitet.",
              "items": {
                "type": "string",
                "x-format": "  - {value}"
              },
              "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
            },
            "ClosingTeacherPrompt": {
              "type": "array",
              "description": "Završni nastavnički koraci i podsticaji koji potvrđuju razmišljanje učenika i najavljuju istragu jedinice.",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "{items}"
            },
            "AlternateOptions": {
              "type": "array",
              "description": "2 kratke alternativne opcije koje bi nastavnik mogao da izabere.",
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
          "description": "Potpuna sekcija 'Direct Presentation'. Ovo je PRVA aktivnost u učionici i treba da traje NI DUŽE OD 10 minuta.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Spisak potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Nastavnički skript organizovan u sledećem TAČNOM redosledu: (1) HOOK (1–2 min), (2) INTRODUCTION (1–2 min), (3) DIRECT TEACHING (4–5 min), i (4) GUIDED ENGAGEMENT (2–3 min). Nemojte uključivati zaglavlja u stringovima. Svaki korak mora da uključi nastavnički govor (Say:/Ask:), nastavničke radnje (Do:/Write:/Draw/Show:), i ako je primenljivo, očekivane odgovore učenika.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Specifična akcija nastavnika, koja počinje sa „Say: “, „Do: “, itd."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Očekivani odgovori ako je uputstvo bilo pitanje. Vratite prazno polje ako nije primenljivo.",
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
              "description": "Navedite uobičajene zablude i tačan jezik za ispravljanje svake od njih.",
              "items": {
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Opis zablude."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Jezik za ispravljanje koji počinje sa „Say: “."
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
              "description": "Pitanje za primenu u stvarnom svetu koje povezuje učenje sa svrhom/značenjem/velikim idejama.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "Očekivani odgovori učenika koji pokazuju dublje razumevanje.",
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
              "description": "Završna provera razumevanja za učenika koji uči ishod, a koji je već naveden u času. Ovo MORA biti pojedinačni zadatak za SVAKOG učenika da ga završi.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "npr. „Odvojite 2 minuta da skicirate X u svoju svesku“ ili „Na papiru za beleške objasnite zašto Y...“"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 konkretna očekivana odgovora učenika.",
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
          "description": "Strukturisan odeljak za vođenu vežbu sa odvojenim poljima za materijale, uputstva, diferencijaciju i opcionalna prilagođavanja.",
          "properties": {
            "Materials": {
              "type": "array",
              "description": "Potrebni fizički predmeti za ovu aktivnost vođene vežbe (npr. „stiroporne lopte, kanap, markeri“) formatirani kao lista",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Skript nastavnika organizovan u uzastopne korake. Svaki korak treba da kombinuje akcije nastavnika i skript. Završite sa podsticajima za obilazak učionice.",
              "items": {
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Specifična akcija nastavnika, koja počinje sa „Say: “, „Do: “, itd."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "description": "Očekivani odgovori ako je uputstvo bilo pitanje. Vratite prazno polje ako nije primenljivo.",
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
              "description": "Završno pitanje za proveru razumevanja za vođenu vežbu.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 očekivana odgovora učenika.",
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
              "description": "Označeno sa tri jasno označena nivoa: Učenici koji uče jezik, Učenici kojima je potrebna dodatna podrška, Idi dublje. Zahtevi: Sadržaj mora da diferencira nastavu, a ne da obezbeđuje prilagođavanja ili modifikacije (to je obrađeno drugde). Strategije treba da se fokusiraju na to kako podučavati, a ne na to kako pojednostaviti materijale. Aktivnosti treba da se razlikuju po složenosti i dubini, usklađene sa istim ishodima učenja. Svaki nivo mora da podstiče aktivno učešće, razvoj jezika i konceptualno razumevanje. Koristite jasan jezik namenjen nastavniku i obezbedite da podrške budu realne za upotrebu u učionici.",
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
                      "description": "Obezbedite 2-3 konkretne nastavne strategije za učenike koji uče jezik. Primeri: obezbeđivanje specifičnih vizuala (npr. „Planet Fact Sheet“), korišćenje okvira za rečenice (npr. „Ovo je postavljeno ovde zato što...“), ili traženje od učenika da gestikuliraju/pokažu pre nego što usmeno objasne. Fokusirajte se na aktivno učešće i razvoj jezika.",
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
                      "description": "Obezbedite 2-3 konkretne nastavne strategije za podršku. Primeri: obezbeđivanje unapred nacrtanih organizatora/šablona, korišćenje pojednostavljene kontrolne liste sa konkretnim vodećim pitanjima, ili modelovanje procesa razmišljanja naglas (npr. „Posmatrajte kako usklađujem...“). Fokusirajte se na to kako podučavati i varirati složenost bez pojednostavljivanja materijala.",
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
                      "description": "Ponudite 1-2 dodatna zadatka koji produbljuju konceptualno razumevanje. Uključite konkretne izazove (npr. „Podesite razmak da pokažete...”) ili pitanja višeg reda (npr. „Kako biste tačno modelovali...?”). Moraju biti usklađeni sa istim ciljevima učenja.",
                      "x-format": "{items}"
                    },
                    "ExpectedStudentResponses": {
                      "type": "array",
                      "items": {
                        "type": "string",
                        "x-format": "- {value}"
                      },
                      "description": "Očekivani odgovori učenika koji pokazuju kako izgleda uspeh. Vratite prazan niz ako nije primenljivo.",
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
              "description": "Ovaj odeljak mora da sadrži dve vrste podrške: Opšte podrške i Individualizovane podrške. Fokus je na pristupu, a ne na smanjenju rigoroznosti.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Strategije koje nisu specifične za učenike, a koje poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, fragmentisana uputstva). Navedite 2-4 stavke u obliku nabrajanja.",
                  "x-format": "{items}"
                },
                "IndividualSupport": {
                  "type": "array",
                  "description": "Specifična prilagođavanja i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; nemojte grupisati učenike zajedno. Podrška za svakog učenika treba da bude laka za pregled.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "Ime i prezime pojedinačnog učenika koji prima ovu podršku."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Formalni plan dat za ovog učenika u zadatku. Raščlanite plan u jasan spisak. Možete parafrazirati da biste poboljšali formatiranje, ali ne smete izostaviti niti dodati bilo kakvu informaciju."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "x-format": "- {value}"
                        },
                        "description": "Konkretnи alati/podsetnici/vizuali/organizatori za ovaj zadatak.",
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
          "description": "Odeljak za strukturisanu samostalnu vežbu.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Potrebni materijali.",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "Purpose": {
              "type": "string",
              "description": "Svrha samostalne vežbe."
            },
            "InstructionsForTeachers": {
              "type": "array",
              "description": "Sekvencijalni zadaci za samostalnu vežbu.",
              "items": {
                "type": "object",
                "properties": {
                  "TaskName": {
                    "type": "string"
                  },
                  "DOKLevel": {
                    "type": "string",
                    "description": "npr. „DOK 3” ili „DOK 3-4”"
                  },
                  "TeacherNotes": {
                    "type": "string",
                    "description": "Objašnjenje koje povezuje zadatak sa prezentacijom/ciljevima."
                  },
                  "Instruction": {
                    "type": "string",
                    "description": "Specifično uputstvo ili izjava „Reci:”."
                  },
                  "ExpectedStudentResponses": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "Primeri odgovora.",
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}"
                  },
                  "SuccessCriteria": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "x-format": "  - {value}"
                    },
                    "description": "2-4 elementa koji pokazuju savladanost.",
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
              "description": "Pitanja za samoregulaciju i transcendenciju.",
              "items": {
                "type": "object",
                "properties": {
                  "Question": {
                    "type": "string"
                  },
                  "ReflectionType": {
                    "type": "string",
                    "description": "npr. „Samoregulacija” ili „Transcendencija”"
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
                  "description": "Zadatak/opis za učenike koji završe ranije."
                },
                "Requirements": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Specifični elementi koje učenici moraju da obuhvate.",
                  "x-format": "{items}"
                },
                "Justification": {
                  "type": "string",
                  "description": "Završna rečenica o korišćenju tačnih principa."
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
          "description": "Odsek Strukturisani pregled i raspoređeno prisećanje. Ova aktivnost od 5 minuta učvršćuje prethodne pojmove i povezuje ih sa trenutnim učenjem.",
          "properties": {
            "Materials": {
              "type": "array",
              "items": {
                "type": "string",
                "x-format": "- {value}"
              },
              "description": "Potrebni materijali (često nije ništa potrebno).",
              "x-format": "**📚 {loc.Materials}**\n\n{items}"
            },
            "TeacherNotes": {
              "type": "string",
              "description": "Pasus za napomene nastavnika koji objašnjava: kako ova strategija pregleda unapređuje zadržavanje gradiva, povezivanje sa prethodnim konceptima učenja i kako transcendentalna refleksija produbljuje razumevanje.",
              "x-format": "**{loc.TeacherNotes}:** {value}"
            },
            "ActiveRecall": {
              "type": "object",
              "description": "Uputstva za nastavnike koja sadrže podsticaj za aktivno prisećanje.",
              "properties": {
                "Instruction": {
                  "type": "string",
                  "description": "Podsticaj za aktivno prisećanje uz deljenje u paru/grupi. Mora da koristi izjavu 'Reci:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Očekivani odgovori učenika (2-3 primera u tačkama).",
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}"
                },
                "CorrectCommonMisconceptions": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Primeri pogrešnih shvatanja i skripte za odgovor nastavnika koje adresiraju svako od njih (npr. 'Ako učenik kaže X, odgovorite Y').",
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
              "description": "Povezanost sa suštinskim pitanjem jedinice.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Podsticaj nastavnika koji povezuje sa pitanjem jedinice. Mora da koristi izjavu 'Reci:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Očekivani odgovori učenika (2-3 primera).",
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
              "description": "Refleksija o primeni u stvarnom svetu ili širem uticaju.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Podsticaj za primenu u stvarnom svetu. Mora da uključuje uputstvo za vreme za razmišljanje (npr. 'Odvojite 30 sekundi da tiho razmislite, a zatim podelite:') i da koristi izjavu 'Reci:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Očekivani odgovori učenika (2-3 primera).",
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
              "description": "Prisećanje specifičnih prethodno naučenih pojmova.",
              "properties": {
                "HeaderTitle": {
                  "type": "string",
                  "description": "Jasna referenca na prethodnu lekciju (npr. 'Raspoređeno prisećanje (uzima iz Modula 2, Lekcija 3)')."
                },
                "Instruction": {
                  "type": "string",
                  "description": "Pitanje koje povezuje prošle i sadašnje koncepte. Mora da koristi izjavu 'Reci:'."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "x-format": "- {value}"
                  },
                  "description": "Detaljni kriterijumi uspeha ili očekivani odgovori učenika (2-3 primera).",
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
          "description": "Tačno 4 formativna pitanja za procenu, po jedno za svaki DOK nivo.",
          "items": {
            "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
            "type": "object",
            "properties": {
              "PromptLabel": {
                "type": "string",
                "description": "npr. „Prompt 1 (DOK 1)”"
              },
              "Question": {
                "type": "string",
                "description": "Tačan tekst pitanja, npr. „Zašto planete ostaju u orbiti umesto da odlete u svemir?”"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 primera odgovora koji pokazuju savladanost gradiva (u navodnicima)."
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
          "description": "Vežbanje za domaći/vanškolski rad.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Kratko objašnjenje ciljeva vežbe, npr. „Ovi zadaci učvršćuju današnje učenje o [topic] tako što od učenika traže da posmatraju obrasce iz stvarnog sveta i objasne ih pomoću pojmova uvedenih na času...”"
            },
            "PracticeTasks": {
              "x-format": "{items}",
              "type": "array",
              "description": "Tačno 3 zadatka za vežbu (DOK 2 ili DOK 3).",
              "items": {
                "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "TaskDescription": {
                    "type": "string",
                    "description": "npr. „(DOK 2) Večeras izađite napolje i napišite 3-4 rečenice...”"
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
              "description": "Zadatak za refleksiju učenika.",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "npr. „Refleksija: Napiši 2-3 rečenice kao odgovor na jedan podsticaj:”"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Tačno 4 opcije pitanja za refleksiju u navodnicima."
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
