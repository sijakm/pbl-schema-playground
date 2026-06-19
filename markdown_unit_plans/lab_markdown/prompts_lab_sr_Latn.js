window.prompts_lab_sr_Latn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte okvir jedinice i strukturu časa koristeći informacije ispod. NE pišite kompletne planove časa.
                    
Na osnovu predmeta jedinice, obrazovnih standarda, opisa/instrukcije jedinice, razreda, trajanja časa (u minutima) i traženog broja časova, generišite JSON odgovor koji uključuje kohezivan UnitDescription i nenadovezujuću listu „kontejnera“ za časove.

Predmet jedinice:
{{$Subject}}

Naziv jedinice:
{{$Name}}

Opis/instrukcija jedinice:
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
- Svako pitanje MORA počinjati sa „How” ili „Why”.
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU da se fokusiraju na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva kroz discipline i primenljiva van ove jedinice.
- Pitanja MORAJU biti korišćena doslovno u svakom času unutar jedinice.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: U potpunosti popunite sva svojstva unutar objekta "UnitDescription":
  - "Description": Napišite pasus od 4–5 rečenica koji opisuje središnji fokus jedinice i narativno putovanje.
  - "StudentLearningObjectives": Navedite 3–5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedite sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja koja prate gore navedena pravila.
- GENERIŠITE listu "Lessons" koja sadrži tačno {{$NumberOfItems}} časova.
  - Svaki čas mora da uključuje "lessonNumber" (indeks počev od 1), "lessonName" i "lessonDescription" (2–4 rečenice koje opisuju obim časa).

Ograničenja:
- Održite jedinicu i svaki čas usklađenim sa fokusom jedinice.
- Obezbedite logičan redosled od osnovnih ideja ka složenijem modelovanju.
- Tačnost: Sav sadržaj mora biti naučno tačan i primeren uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristite kompaktan format (bez dodatnih praznih linija).`,
  PER_LESSON_PROMPT_TEMPLATE: `Kreirajte JEDAN plan časa za LABORATORIJU (NE plan nastavne jedinice, NE više časova) koristeći informacije ispod.
MORATE da izbacite validan JSON koji tačno odgovara dostavljenoj JSON šemi. Ne uključujte nikakve dodatne ključeve. Koristite kompaktan JSON format (bez dodatnih praznih redova).
Predmet nastavne jedinice:
{{$Subject}}
Naziv nastavne jedinice:
{{$Name}}
Opis/uputstvo nastavne jedinice:
{{$UserPrompt}}
Nivo razreda:
{{$GradeLevel}}
Trajanje časa u minutima
{{$ClassDuration}}
Resursi/mediji za korišćenje:
{{$MediaContext}}
Sadržaj nastavne jedinice:
{{$ParentUnitData}}
Standardi sa kojima treba uskladiti:
{{$Standards}}
Priloženi sadržaj časa:
{{$AttachedLesson}}

Ključna pitanja nastavne jedinice (KORISTITE OVA TAČNO KAKVA JESU):
{{$UnitEssentialQuestions}}

Ako gornja ključna pitanja nastavne jedinice nisu popunjena, generišite tačno 3 konceptualna pitanja prema sledećim pravilima:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA počinjati sa ili „How” ili „Why”.
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definicijska.
- Pitanja MORAJU da se fokusiraju na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva između disciplina i primenljiva van ove nastavne jedinice.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORA se koristiti SAMO unutar Experiment.AccommodationsAndModifications; koristite imena planova učenika tačno kako su napisana):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA:
- Držite čas usklađen sa fokusom nastavne jedinice: razvijanje i korišćenje modela za opisivanje atomske strukture prostih molekula i/ili proširenih struktura.
- Uključite kratke, visokorangirane veze sa drugim relevantnim DCI-jevima gde je prikladno, ali zadržite čas fokusiranim na modelovanje i rezonovanje o strukturi i svojstvima (bez duboke matematike, bez balansiranja jednačina osim ako to standardi izričito zahtevaju).
- Uverite se da svi delovi časa odražavaju Opseg/ograničenja časa navedene u kontekstu nastavne jedinice; izbegavajte uvođenje novih velikih koncepata koji pripadaju drugim časovima.
- EssentialQuestions: MORAJU tačno biti jednaka ključnim pitanjima na nivou nastavne jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako LessonNumber == 1, napišite 150–250 reči i sledite traženu strukturu iz opisa šeme. Ako LessonNumber != 1, vratite "" (prazan string).
- Faze laboratorije (Question, Research, Hypothesize, Experiment, Analyze, Share): Pratite specifične nastavne zahteve i stringove „Purpose:” za svaku fazu, kao što je definisano u JSON šemi.
- Experiment.AccommodationsAndModifications mora da sadrži opštu podršku, a zatim individualnu podršku za svakog učenika navedenog u {{$LearningPlans}}.
- StudentPractice MORA da uključuje pasus TeacherNotes koji počinje sa 'These tasks reinforce today's learning about ____ by ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, i međusobno smenjivanje ako je predmet matematika.

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji tačno odgovara dostavljenoj šemi.
- Izlaz MORA biti SAMO jedan plan časa.
- Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.`,
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
          "description": "Opis jedinice kao jedan koherentan odeljak u običnom tekstu od 4–5 potpunih rečenica, napisan prirodnim glasom nastavnika koji možete direktno reći učenicima. Bez HTML-a, bez emotikona, bez nabrajanja. Mora da teče razgovorno, ali da prati ovu strukturu (bez naslova): (1) uvodna rečenica koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovoj jedinici, vi ćete...” o ishodima ovladavanja, (3) rečenica „Ojačaćete svoje veštine u...” o sposobnostima mišljenja/analize, (4) rečenica „Ovo se povezuje sa...” o značaju u stvarnom svetu, (5) rečenica „Razumevanje ovoga je važno zato što...” o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Kreirajte suštinska pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Ne pominjite nikakve pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorenog tipa, primenljiva u svim disciplinama i nemoguća za odgovor samo učenjem sadržaja časa ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Potpuna sekcija 'Student Learning Objectives' za celu ovu jedinicu. Svaka stavka liste mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradi",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Navedite sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim časovima. Ne dodajte standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži kod standarda i opis, na primer 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Potpuna sekcija 'Key Vocabulary' kao lista stringova. Svaki string treba da bude jedan termin sa definicijom odvojenom crtom/crticom. Primer: 'Gravity - Sila koja privlači objekte jedne ka drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem časa.",
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
      "description": "Lista kontejnera lekcija za ovu jedinicu (samo okvir). Svaka stavka mora biti nepreklapajuća i jasno obuhvaćena tako da se sadržaj lekcija ne ponavlja između časova.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Redni broj lekcije. Na osnovu 1."
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
      "description": "Samo nalepite sva suštinska pitanja koja su generisana na nivou jedinice istim redosledom.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Potpuna sekcija 'Student Learning Objectives' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradi, npr. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'.",
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
      "description": "Potpuna sekcija 'Standards Aligned' kao običan tekst za ovu lekciju. Svaki standard mora da sadrži kod standarda i opis, a kod i opis moraju biti potpuno isti kao oni korišćeni na nivou jedinice. npr. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Izaberite doslovno ključni rečnik za ovu lekciju iz vokabulara na nivou jedinice navedenog u promptu. Ne izmišljajte nove reči. Morate ponovo upotrebiti tačan tekst iz Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Sekcija Procena prethodnog znanja. SAMO 1. lekcija treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU VRATITI NULL ili izostaviti ovo polje. Za 1. lekciju, struktura mora da obuhvati: 1. Uključite ovu sekciju samo u prvu lekciju jedinice. 2. Obezbedite da se koriste DOK 1-3 podsticaji. 3. Uključite predznanja potrebna za ishode učenja učenika. 4. Izaberite jedan modalitet iz ove liste i potpuno ga razvijte: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Početni nastavnički podsticaj sa 'Say:' izjavom. 6. Jasna uputstva i šablon/strukturu za izabrani modalitet. 7. Sekciju 'Expected Student Responses'. 8. Završni nastavnički podsticaj 'Say:'. 9. Nakon potpunog razvoja jednog modaliteta, navedite 2 kratke alternativne opcije.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Jasna uputstva i šablon/strukturu za izabrani modalitet. Npr. 'Say: \"Pre nego što počnemo...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Očekivani odgovori učenika ili česte zablude za izabrani modalitet.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Završni nastavnički podsticaj 'Say:' koji potvrđuje razmišljanje učenika i najavljuje istraživanje jedinice."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 kratke alternativne opcije koje bi nastavnik mogao izabrati.",
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
      "description": "Vodite nastavnika tako da učenici posmatraju fenomen, identifikuju nešto što zbunjuje i formulišu smisleno pitanje koje će voditi istraživanje.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Reč po reč - Svrha: Posmatrati fenomen, identifikovati nešto što zbunjuje i formulisati smisleno pitanje koje će voditi istraživanje."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
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
              "description": "Instrukcije za nastavnika korak po korak, radnje i 'Say:' podsticaji za predstavljanje fenomena i pozivanje na pitanja."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 očekivana pitanja ili ideje učenika o fenomenu."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "Završni korak u instrukcijama za nastavnika. Započnite ovaj niz sledećim rednim brojem nakon prethodnih instrukcija (npr. '8. Final Step: Say: ...') i navedite veliko pitanje koje će se danas istraživati."
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
      "description": "Vodite nastavnika da učenici nauče osnovne informacije, vokabular i prethodno znanje potrebno za razumevanje teme.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Reč po reč: Svrha: Prikupiti osnovne informacije, vokabular i prethodno znanje potrebno za razumevanje teme i pripremiti za informisano istraživanje."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
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
              "description": "Instrukcije za nastavnika korak po korak, radnje i 'Say:' podsticaji za objašnjavanje osnovnog znanja, vokabulara i modelovanje fenomena."
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
                    "description": "Zabluda učenika"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "Šta bi nastavnik trebalo da kaže da to ispravi"
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
      "description": "Vodite nastavnika da učenici razviju proverljivu predikciju.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Reč po reč: Svrha: Razviti proverljivu predikciju ili tvrdnju zasnovanu na njihovom istraživanju i razmišljanju, postavljajući jasan očekivani rezultat onoga što veruju da će se dogoditi."
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
              "description": "Instrukcije za nastavnika. Uključite 'Say:' podsticaje. Dajte konkretnu instrukciju kao što je 'Write on the board:' nakon čega sledi markdown lista sa 4-5 okvirnih rečenica za hipotezu sa nabrajanjima."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 očekivana primera hipoteze."
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
      "description": "Vodite nastavnika da učenici sprovedu strukturisano istraživanje.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Reč po reč: Svrha: Sprovesti strukturisano istraživanje - praktično, simulirano ili analitičko - kako bi testirali svoju hipotezu i prikupili dokaze posmatranjem ili merenjem."
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
              "description": "Instrukcije za nastavnika korak po korak za organizovanje eksperimenta, davanje uputstava i obilazak učenika."
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
                      "description": "Za odgovore Idi dublje."
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
              "description": "Ovaj odeljak mora da uključuje dve vrste podrške: Opštu podršku i Individualizovanu podršku. Fokusirajte se na pristup, a ne na smanjenje zahtevnosti.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategije koje nisu specifične za učenike, a poboljšavaju pristup za sve učenike (npr. vizuelni materijali, unapred popunjene beleške, digitalni rečnik, podeljena uputstva na manje celina). Navedite 2-4 stavke u obliku nabrajanja."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specifična prilagođavanja i izmene za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; nemojte grupisati učenike zajedno. Podrška za svakog učenika treba da bude laka za pregled u obliku liste.",
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
                        "description": "Formalni plan predviđen za ovog učenika u zadatku. Razložite plan u jasnu listu. Možete ga parafrazirati radi boljeg formatiranja, ali nemojte izostaviti niti dodati bilo kakve informacije."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "KonkretnI alati/započeci/reprezentacije/organizatori za ovaj zadatak."
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
      "description": "Usmerite nastavnike tako da učenici tumače podatke koje su prikupili.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Svrha: Tumače podatke koje su prikupili, identifikuju obrasce, procenjuju svoju hipotezu i izvode zaključke zasnovane na dokazima."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
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
                    "description": "Tekst nastavničkog uputstva (npr. 'Provide sentence starters:'). Nemojte uključivati numeraciju; ona se obrađuje automatski."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Opcione stavke u listi. MORATE obezbediti listu od 4-5 početaka rečenica kada korak to traži. MORATE obezbediti listu od 4-5 podsticaja za kretanje kroz učionicu kada korak to traži. U suprotnom, obezbedite praznu listu."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Uputstva nastavnika korak po korak. MORATE uključiti tačno jedan korak posebno za početke rečenica i popuniti njegov niz 'Bullets'. MORATE uključiti tačno jedan korak posebno za podsticaje za kretanje kroz učionicu i popuniti njegov niz 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Očekivani odgovori ili dovršavanja rečeničnih okvira od strane učenika."
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
      "description": "Usmerite nastavnike tako da učenici jasno saopšte svoja otkrića.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Reč za reč: Svrha: Jasno saopštavaju svoja otkrića drugima, koristeći dokaze da objasne šta su otkrili, zašto je to važno i kako doprinosi dubljem razumevanju."
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
                    "description": "Tekst nastavničkog uputstva (npr. 'Write on board:'). Nemojte uključivati numeraciju; ona se obrađuje automatski."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Opcione stavke u listi. MORATE obezbediti listu od 4-5 stavki kada korak pruža strukturu za deljenje. MORATE obezbediti listu od 4-5 nastavničkih podsticaja (pitanja) kada korak to traži. U suprotnom, obezbedite praznu listu."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Uputstva nastavnika korak po korak. MORATE uključiti tačno jedan korak posebno za pružanje strukture za deljenje i popuniti njegov niz 'Bullets'. MORATE uključiti tačno jedan korak posebno za nastavničke podsticaje i popuniti njegov niz 'Bullets'."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Očekivane ideje koje učenici iznose."
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
      "description": "Ceo odeljak 'Review & Spaced Retrieval'.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Podsticanje učenika da se prisete NOVOG gradiva sa DANAŠNJEG časa.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Nastavnikov podsticaj koji počinje sa 'Say: '."
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
          "description": "Učiteljski podsticaj povezan sa pitanjem jedinice.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Učiteljski podsticaj koji počinje sa 'Say: '."
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
          "description": "Traženje od učenika da povežu učenje sa drugim scenarijima iz stvarnog sveta.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Učiteljski podsticaj koji počinje sa 'Say: '."
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
          "description": "Podsećanje na određeni prethodni čas/jedinicu.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Rečenični kontekst poput 'Ranije u ovom času, učenici su naučili...'"
            },
            "Say": {
              "type": "string",
              "description": "Učiteljski podsticaj koji počinje sa 'Say: '."
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
      "description": "Tačno 4 podsticaja za formativnu procenu, po jedan za svaki DOK nivo.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "npr. 'Podsticaj 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "Tačan tekst pitanja."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 primerena odgovora koji pokazuju savladanost."
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
      "description": "Domaći zadatak/praktikovanje van časa.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Napomene za nastavnika koje objašnjavaju kako ovi zadaci za vežbu osnažuju današnje učenje i jačaju dugoročno pamćenje."
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
                "description": "npr. '(DOK 2) Večeras izađi napolje i napiši 3-4 rečenice...'"
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
          "description": "Zadatak za refleksiju za učenike.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "npr. 'Refleksija: Napiši 2-3 rečenice kao odgovor na jedan podsticaj:'"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Tačno 4 opcije pitanja za refleksiju."
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
},
};
