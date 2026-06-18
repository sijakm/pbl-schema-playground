window.prompts_collaborative_sr_Latn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte pregled jedinice i strukturu časa koristeći informacije ispod. NE pišite kompletne planove časova.
                    
Na osnovu predmeta jedinice, obrazovnih standarda, opisa/instrukcije jedinice, razreda, trajanja školskog časa (u minutima) i traženog broja časova, generišite JSON odgovor koji uključuje koherentan UnitDescription i nenadovezujuću listu lekcijskih „kontejnera“.

Predmet jedinice:
{{$Subject}}

Naziv jedinice:
{{$Name}}

Opis/instrukcija jedinice:
{{$UserPrompt}}

Razred:
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
- Svako pitanje MORA počinjati sa ili "How" ili "Why".
- Pitanja MORAJU biti konceptualna i istraživačka, ne činjenična, proceduralna ili definicijska.
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rasuđivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva kroz discipline i primenljiva izvan ove jedinice.
- Pitanja MORAJU biti ponovo korišćena doslovno u svakoj lekciji unutar jedinice.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: U potpunosti popunite sva svojstva unutar objekta "UnitDescription":
  - "Description": Napišite pasus od 4–5 rečenica koji opisuje glavni fokus jedinice i narativno putovanje.
  - "StudentLearningObjectives": Navedite 3–5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedite sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja koja slede gore navedena pravila.
- GENERIŠITE listu "Lessons" koja sadrži tačno {{$NumberOfItems}} lekcija.
  - Svaka lekcija mora da sadrži "lessonNumber" (indeks počevši od 1), "lessonName" i "lessonDescription" (2–4 rečenice koje opisuju obim lekcije).

Ograničenja:
- Zadržite jedinicu i svaku lekciju usklađene sa fokusom jedinice.
- Osigurajte logičan redosled od osnovnih ideja ka složenijem modelovanju.
- Tačnost: Sav sadržaj mora biti naučno tačan i primeren uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristite kompaktno formatiranje (bez dodatnih praznih linija).`,
  PER_LESSON_PROMPT_TEMPLATE: `Kreirajte JEDAN plan časa u kolaborativnom stilu (NE plan jedinice, NE više časova) koristeći informacije ispod.

MORATE dati važeći JSON koji tačno odgovara priloženoj JSON šemi (LessonPlanResponse sa jednim objektom "LessonPlan"). Ne uključujte nikakve dodatne ključeve. Koristite kompaktno JSON formatiranje (bez dodatnih praznih redova).

KONTEKST JEDINICE (kontekst samo za čitanje radi koherentnosti):
Predmet jedinice:
{{$Subject}}

Sadržaj jedinice: 
{{$ParentUnitData}}

Opis/Uputstvo za jedinicu: Kreirajte jedinicu koristeći sledeće standarde:
{{$Standards}}

Nivo razreda:
{{$GradeLevel}}

Resursi/mediji koje treba koristiti: 
{{$MediaContext}}

Trajanje školskog časa u minutima:
{{$ClassDuration}}

Naziv časa:
{{$Name}}

Opis/Uputstvo za jedinicu: 
{{$UserPrompt}}

Ključna pitanja jedinice (KORISTITE OVA DOSLOVNO):
{{$UnitEssentialQuestions}}

Ako je gore navedena sekcija Ključna pitanja jedinice prazna, generišite tačno 3 konceptualna pitanja prema sledećim pravilima:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA počinjati sa ili "How" ili "Why".
- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva između disciplina i primenljiva van ove jedinice.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORAJU se koristiti SAMO unutar CollaborativeActivities.AccommodationsAndModifications; koristite imena/planove učenika tačno kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA SADRŽAJA (kolaborativni stil):
- Održite čas usklađen sa fokusom jedinice i gornjim obimom/granicama časa; izbegavajte uvođenje novih glavnih pojmova koji pripadaju drugim časovima.
- Kulturna relevantnost i inkluzija: uključite više perspektiva; povežite sa različitim zajednicama; izbegavajte stereotipe; pokažite uticaje na sve uključene.
- Prenos: ugrađujte primenu u stvarnom svetu i rezonovanje tokom celog časa.
- Mešanje sadržaja: kada učenici vežbaju/primenjuju, mešajte strategije ili koncepte (ne blokovska vežba). Ako čas sadrži bilo kakvo rezonovanje nalik matematičkom, uključite najmanje jednu DOK 3–4 mešanu stavku koja spaja trenutni sadržaj sa konceptom iz ranijeg časa i zahteva da učenici obrazlože izbor strategije.

PRAVILA PO POLJIMA:
- EssentialQuestions: MORAJU tačno biti jednaka ključnim pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: Ako je ovaj deo obavezan (npr. za prvi čas ili kada se uvode novi glavni pojmovi), napišite 150–250 reči poštujući traženu strukturu u opisu šeme. U suprotnom, vratite "" (prazan string).
- Instruction:
  - InstructionsForTeachers: Ovi koraci moraju biti detaljni i uključivati svo novo učenje za čas uz objašnjenja kako da se ono podučava. Budite precizni.
  - Mora uključivati kako predstaviti novi sadržaj (hookovi, vodeća pitanja, prelazi).
  - Mora uključivati sadržaj i skriptu za nastavnika da direktno poučava sadržaj (definicije, primeri, ključne tačke, objašnjenja).
  - Struktura mora prirodno teći kroz Say/Do/Ask/Listen for/Write podsticaje.
  - VAŽNO: Ne uključujte NASLOVE U VELIKIM SLOVIMA (kao HOOK, INTRODUCTION, itd.) za sekcije.
  - VAŽNO: Ne uključujte trajanje po minutima za pojedinačna uputstva ili korake.
  - TranscendentThinking: Dajte jedno pitanje za primenu u stvarnom svetu koje povezuje učenje sa svrhom/meaning, zatim oznaku 'Expected Student Responses:' i 2–3 primera.
- GroupStructureAndRoles:
  - Izlaz MORA biti namenjen nastavniku.
  - GroupSize: navedite 'pairs', 'triads' ili '4-5 students'.
  - TeacherSay: 1–2 rečenice koje objašnjavaju da su uloge važne i da ćete modelovati kako svaka uloga izgleda.
  - Roles: Moraju biti definisane tačno sledećih pet uloga (Facilitator, Recorder, MaterialsManager, Timekeeper, Presenter) sa konkretnim dužnostima povezanim sa CollaborativeActivities časa.
  - Rotation: Jedna rečenica koja precizira kada se uloge rotiraju u OVOM času (npr. "Rotate roles after Phase A and again before the gallery walk.").

CollaborativeActivities:
- Kreirajte međuzavisnu kolaborativnu aktivnost (kolaborativna zamena za Guided Practice) usklađenu sa obimom ovog časa.
- Svaki učenik mora doprineti i grupe moraju proizvesti zajednički proizvod ili odluku.
- Uključite vremenske naznake, scripting za teacher Say, promptove za obilazak/kretnju po učionici + očekivane odgovore, i brzu proveru gde SVI učenici odgovaraju + očekivane odgovore.
- Uključite Differentiation (3 nivoa) i AccommodationsAndModifications (General + IndividualSupport tačno kako je dato).
- Ako je ovo čas iz matematike, uključite jednu DOK 3–4 mešanu problematiku koja spaja trenutni sadržaj sa prethodnim časom/jedinicom i objasnite zašto je uključena; u suprotnom izostavite mešanje.
- ReflectionOnGroupDynamics:
  - Mora biti oko 5 minuta.
  - Uključite 2–4 podsticaja za studentski razgovor/debrief (npr. šta je dobro funkcionisalo, izazov, čiji je glas bio saslušan).
  - Obezbedite poteze za facilitaciju nastavnika (kratak pisani izlazni slip, samoprocenjivanje grupe 1–5, ili 2-minutna diskusija), sa promptovima za nastavnika i očekivanim odgovorima učenika.
  - Eksplicitno povežite refleksiju sa CollaborationGuidelines.
- ReviewAndSpacedRetrieval:
  - Ista struktura i isti zahtevi kao Direct Instruction verzija (vidi opis šeme).
  - Mora uključiti retrieval proveru koja se povezuje sa JEDNIM prethodnim pojmom iz ranijeg časa (navedite broj tog prethodnog časa).
- StudentPractice:
  - Domaći/vežba van časa.
  - Mora pratiti tačan traženi format u opisu šeme (uključujući ✅Expected Student Responses markere).

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji tačno odgovara priloženoj šemi.
- Izlaz MORA biti SAMO jedan plan časa.
- Bez HTML-a. Bez emoji-ja. Bez markdowna. Običan tekst unutar string polja.`,
  STEP0_SCHEMA: {
  "title": "UnitPlanResponse",
  "type": "object",
  "properties": {
    "UnitDescription": {
      "type": "object",
      "properties": {
        "Description": {
          "type": "string",
          "description": "Opis jedinice kao jedan kohezivan, običan tekstualni pasus (4–5 potpunih rečenica) napisan prirodnim učiteljskim glasom koji biste mogli direktno da kažete učenicima. Bez HTML-a, bez emotikona, bez nabrajanja. Mora da teče razgovorno, ali da prati ovu strukturu (bez naslova): (1) uvodna rečenica koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica 'U ovoj jedinici ćete...' o ishodima savladavanja, (3) rečenica 'Razvićete svoje veštine u...' o misaonim/analitičkim sposobnostima, (4) rečenica 'Ovo je povezano sa...' o stvarnoj primenljivosti, (5) rečenica 'Razumevanje ovoga je važno zato što...' o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Kreirajte suštinska pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Ne pominjite nikakve pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguće ih je odgovoriti učenjem sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Puni odeljak 'Ciljevi učenja učenika' za celu ovu jedinicu. Svaka stavka liste mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradama",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Navedite sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim lekcijama. Ne dodajte standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži kod standarda i opis, npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja–Sunce–Mesec da bi se opisali ciklični obrasci Mesečevih mena, pomračenja i godišnjih doba.'",
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
      "description": "Lista kontejnera lekcija za ovu jedinicu (samo okvir). Svaka stavka mora biti nepreklapajuća i jasno obuhvaćena tako da se sadržaj lekcija ne ponavlja između lekcija.",
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
          "description": "Kratak opisni naslov za lekciju. Ne uključujte emotikone ovde."
        },
        "EssentialQuestions": {
          "x-format": "### 💭 {loc.EssentialQuestions}\n\n{cache.EssentialQuestions}",
          "type": "array",
          "description": "Samo nalepite sva suštinska pitanja na nivou jedinice u istom redosledu ako su data. Ako nisu data, generišite tačno 3 konceptualna pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Ne pominjite nikakve pojmove specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguće ih je odgovoriti učenjem sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Lista stringova u formatu 'Termin - Definicija'. Definicije moraju biti kratke, prilagođene uzrastu i vezane za ovu lekciju.",
          "items": {
            "x-format": "{index}. {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "2–3 merljiva cilja, od kojih se svaki završava DOK oznakom u zagradama.",
          "items": {
            "x-format": "- {value}\n",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Usklađeni obrazovni standardi za ovu lekciju. Moraju se tačno poklapati sa standardima jedinice u kodu i opisu.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "AssessPriorKnowledge": {
          "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
          "type": "object",
          "description": "Odeljak Procena prethodnog znanja. SAMO 1. lekcija treba da sadrži detaljan blok; SVE OSTALE LEKCIJE MORAJU vratiti NULL ili izostaviti ovo polje. Za 1. lekciju, struktura mora da sadrži ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt i AlternateOptions.",
          "properties": {
            "ActivityInstructions": {
              "type": "string",
              "description": "Jasna uputstva i šablon/strukturu za izabranu modalnost. Npr. 'Recite: \"Pre nego što počnemo da gradimo...\"'"
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "description": "Predviđeni odgovori ili uobičajene zablude za izabranu modalnost.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "ClosingTeacherPrompt": {
              "type": "string",
              "description": "Završni nastavnički prompt 'Recite:' koji potvrđuje razmišljanje učenika i najavljuje istraživanje jedinice."
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
        "Instruction": {
          "x-format": "### {green}({loc.Instruction})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.TranscendentThinking}\n\n{value.QuickCheck}",
          "type": "object",
          "description": "Sekcija 'Instruction' za kolaborativnu lekciju (ekvivalent Direktnoj prezentaciji).",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Spisak materijala.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Scenarijo za nastavnika organizovan u sledećim uzastopnim koracima. Ovi koraci moraju zajedno da deluju kao sveobuhvatan vodič koji pomaže nastavniku da iznese novi sadržaj. Mora da uključuje kako da se uvede nova tema/sadržaj (uvodne „kuke“, vođena pitanja, prelazi), kao i sadržaj/scenarijo za nastavnika za neposredno poučavanje (definicije, primeri, ključne tačke, objašnjenja). Uputstva treba da budu detaljna i da obuhvate sve novo gradivo za čas, uz objašnjenja kako da se ono predaje. Budite precizni. Ne koristite naslove u SVE VELIKIM SLOVIMA za odeljke i ne uključujte vremenske oznake.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}\n\n{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Postupak nastavnika, npr. Recite: '...', Uradite: '...', Pitajte: '...'"
                  },
                  "ExpectedStudentResponses": {
                    "x-format": "- ✅ {loc.ExpectedStudentResponses}\n\n{items}",
                    "type": "array",
                    "description": "Očekivani odgovori ako je uputstvo bilo pitanje. Vratite prazan niz ako nije primenljivo.",
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
              "description": "Spisak uobičajenih zabluda i tačan jezik za ispravku za svaku od njih.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Misconception}\n  - {value.Correction}",
                "type": "object",
                "properties": {
                  "Misconception": {
                    "type": "string",
                    "description": "Opis zablude."
                  },
                  "Correction": {
                    "type": "string",
                    "description": "Jezik za ispravku koji počinje sa 'Recite: '."
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
              "description": "Pitanje o primeni u stvarnom svetu koje povezuje učenje sa svrhom/značenjem.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 očekivana odgovora učenika koji pokazuju dublje razumevanje.",
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
              "description": "Završno pitanje za proveru razumevanja.",
              "properties": {
                "Question": {
                  "type": "string"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "description": "2-3 očekivana odgovora učenika.",
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
          "description": "Veličina grupe, scenarijo nastavnika, definisane uloge i rotacija.",
          "properties": {
            "GroupSize": {
              "x-format": "{loc.GroupSize}: {value}",
              "type": "string",
              "description": "npr. 'parovi', 'trojke' ili '4-5 učenika'"
            },
            "TeacherSay": {
              "type": "string",
              "description": "Scenarijo nastavnika koji objašnjava uloge."
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
              "description": "Rečenica koja navodi kada se uloge rotiraju."
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
          "description": "Poticaji koji pomažu grupama da kreiraju sopstvene norme saradnje.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "CollaborativeActivities": {
          "x-format": "### {green}({loc.CollaborativeActivities})\n\n{value.Materials}\n\n{value.InstructionsForTeachers}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}",
          "type": "object",
          "description": "Uzajamno zavisni grupni rad (kolaborativna zamena za vođenu vežbu). Usmeren ka nastavniku, visoko strukturisan i osmišljen tako da učenici ne mogu da završe zadatak sami. Mora da sadrži: (a) jasnu međuzavisnost (džigso, izgradnju konsenzusa, galerijska šetnja, strukturisani izazov rešavanja problema ili slično), (b) eksplicitno vreme za svaku fazu (npr. '8 minuta diskusije, 2 minuta za pripremu odgovora'), (c) vođeno delovanje nastavnika kroz skriptovane 'Recite:' izjave tokom celog dela, (d) zajednički grupni proizvod (tvrdnja, model, tabela, skup rešenja, galerijski artefakt itd.), (e) poticaje za obilazak sa očekivanim odgovorima učenika, (f) najmanje jednu proveru odgovora svih učenika (tablice za brisanje, kratko pisanje, glasanje, palac gore/dole itd.) sa očekivanim odgovorima, (g) brzo kontrolno pitanje + očekivane odgovore, (h) diferencijaciju u tri nivoa usmerenu na nastavu (ne na prilagođavanja), i (i) AccommodationsAndModifications odvojeno na General supports i IndividualSupport, tačno usklađeno sa dostavljenim učenicima/planovima. Obezbedite kulturnu relevantnost i inkluziju tako što ćete pozvati više perspektiva i obezbediti ravnopravno učešće.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "description": "Kompletna lista nastavnih i učeničkih materijala korišćenih u ovoj kolaborativnoj aktivnosti. Uključite sve pripremljene stavke (kartice sa poticajima, rečenične okvire, kartice sa ulogama, kontrolne liste, rubrike, listove za galerijsku šetnju, tablice za brisanje, tajmere, vizuale, rečnike, itd.). Jedna stavka po elementu niza; bez čuvara mesta.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "InstructionsForTeachers": {
              "x-format": "**📋 {loc.InstructionsForTeachers}**\n\n{items}",
              "type": "array",
              "description": "Scenarijo nastavnika za kolaborativnu aktivnost (cilj je 6-8 numerisanih koraka). Obavezno obezbedite da jedan korak bude eksplicitno 'Circulation Prompts:' i da uključuje konkretna pitanja koja treba postavljati grupama dok rade.",
              "items": {
                "x-format": "\n\n**{index}.** {value.Instruction}{value.CirculationPrompts}{value.ExpectedStudentResponses}",
                "type": "object",
                "properties": {
                  "Instruction": {
                    "type": "string",
                    "description": "Konkretna nastavnikova aktivnost, koja počinje sa 'Recite: ', 'Uradite: ' ili tačno 'Circulation Prompts:'."
                  },
                  "CirculationPrompts": {
                    "x-format": "\n{items}",
                    "type": "array",
                    "description": "POPUNITE OVO SAMO ako je Instruction 'Circulation Prompts:'. Navedite konkretna pitanja koja treba postavljati grupama tokom obilaska. Izostavite ovo svojstvo ako nije primenljivo.",
                    "items": {
                      "x-format": "   - {value.Prompt}{value.ExpectedStudentResponses}",
                      "type": "object",
                      "properties": {
                        "Prompt": {
                          "type": "string",
                          "description": "Pitanje koje treba postaviti grupi."
                        },
                        "ExpectedStudentResponses": {
                          "x-format": "\n     ✅ {loc.ExpectedStudentResponses}\n{items}",
                          "type": "array",
                          "description": "Očekivani odgovori na ovaj konkretan prompt za cirkulisanje. IZOSTAVITE ovo svojstvo ako ga nema.",
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
                    "description": "Očekivani odgovori ako je Instrukcija bila direktno pitanje za razred. IZOSTAVITE ovo svojstvo ako nije primenljivo.",
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
              "description": "Označeno sa tri jasno označena nivoa: Učenici jezika, Učenici kojima je potrebna dodatna potpora, Idite dublje. Zahtevi: Sadržaj mora da diferencira nastavu, a ne da pruža prilagođavanja ili modifikacije (to se obrađuje drugde). Strategije treba da se fokusiraju na to kako predavati, a ne kako pojednostaviti materijale. Aktivnosti treba da se razlikuju po složenosti i dubini, usklađene sa istim ciljevima učenja. Svaki nivo mora da podstiče aktivno angažovanje, razvoj jezika i konceptualno razumevanje. Koristite jasan, nastavniku namenjen jezik i neka podrška bude realna za upotrebu u učionici.",
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
                      "description": "Navedite 2-3 konkretne nastavne strategije za učenike jezika. Primeri: obezbeđivanje specifičnih vizuala (npr. 'Planet Fact Sheet'), korišćenje jezičkih obrazaca (npr. 'Ovo je postavljeno ovde zato što...'), ili zamoliti učenike da gestikuliraju/pokažu pre nego što usmeno objasne. Fokusirajte se na aktivno angažovanje i razvoj jezika."
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
                      "description": "Navedite 2-3 konkretne nastavne strategije za potporu. Primeri: obezbeđivanje unapred nacrtanih organizatora/šablona, korišćenje pojednostavljene kontrolne liste sa specifičnim vodećim pitanjima, ili modelovanje procesa razmišljanja naglas (npr. 'Pogledajte kako ja usklađujem...'). Fokusirajte se na to kako predavati i menjati složenost bez pojednostavljivanja materijala."
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
                      "description": "Navedite 1-2 zadatka za proširenje koji produbljuju konceptualno razumevanje. Uključite konkretne izazove (npr. 'Podesite razmak da pokažete...') ili pitanja višeg reda (npr. 'Kako biste modelovali... tačno?'). Mora biti usklađeno sa istim ciljevima učenja."
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
              "description": "Ovaj odeljak mora da obuhvati dve vrste podrške: Opšta podrška i Individualizovana podrška. Fokus je na pristupu, ne na smanjenju zahteva.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Strategije koje nisu specifične za učenike, a poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, uputstva podeljena u manje celine). Navedite 2-4 stavke u formi liste."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specifična prilagođavanja i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; nemojte grupisati učenike zajedno. Podrška za svakog učenika treba da bude lista koja se lako pregledava.",
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
                        "description": "Formalni plan naveden za ovog učenika u promptu. Razložite plan u jasnu listu. Možete parafrazirati da biste poboljšali formatiranje, ali nemojte izostaviti niti dodati bilo kakvu informaciju."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Konkretni alati/šabloni/vizuali/organizatori za ovaj zadatak."
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
          "description": "Učenici procenjuju koliko je grupa dobro radila zajedno. MORA da sadrži tačno 3 segmenta redom: prompt za debrifing, opcije za facilitaciju i završni prompt koji povezuje sa normama.",
          "properties": {
            "DebriefPrompt": {
              "x-format": "**1.** {value.Say}\n\n{value.ExpectedStudentResponses}",
              "type": "object",
              "description": "Kratak prompt za debrifing za učenike nakon saradnje.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Tačna formulacija koju nastavnik izgovara, npr. 'Recite: \"Odvojite dva minuta da razmislite: Šta je naša grupa danas dobro uradila?\"'"
                },
                "ExpectedStudentResponses": {
                  "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Očekivani odgovori učenika (2-3 primera)."
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
              "description": "Tačno 3 poteza nastavnika za facilitaciju iz kojih treba izabrati (npr. kratko pisanje na izlaznom listiću, ocena grupne saradnje od 1-5, dvominutno deljenje sa celom grupom). Samo opcije, bez očekivanih odgovora."
            },
            "ClosingPrompt": {
              "x-format": "**3.** {value}",
              "type": "string",
              "description": "Završni nastavnikov prompt koji povezuje refleksije sa smernicama za saradnju. npr. 'Recite: \"Koja od vaših normi vam je danas najviše pomogla?\"'"
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
          "description": "Potpuni odeljak 'Pregled i razmaknuto prisećanje'.",
          "properties": {
            "Materials": {
              "x-format": "**📚 {loc.Materials}**\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Lista materijala (npr. ['None'] ili ['Whiteboards'])."
            },
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Kratka napomena koja objašnjava kako vežba prisjećanja podržava dugoročno pamćenje."
            },
            "ActiveRecall": {
              "x-format": "**{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}\n\n{value.CorrectCommonMisconceptions}",
              "type": "object",
              "description": "Traženje od učenika da se prisete NOVOG gradiva sa ČASA OD DANAS.",
              "properties": {
                "Say": {
                  "type": "string",
                  "description": "Učiteljev podsticaj."
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
                  "description": "1-2 zablude i kako ih ispraviti."
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
              "description": "Učiteljev podsticaj koji povezuje sa pitanjem jedinice.",
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
              "description": "Podsticaj za primenu u stvarnom svetu.",
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
              "description": "Prisjećanje iz konkretne prethodne lekcije/jedinice.",
              "properties": {
                "DrawsFrom": {
                  "type": "string",
                  "description": "Prethodna lekcija na koju se poziva, npr. 'Crpi iz Jedinice 2, Lekcije 3'"
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
          "description": "Tačno 4 podsticaja za formativno ocenjivanje, po jedan za svaki DOK nivo.",
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
                "description": "Tačan tekst pitanja, npr. 'Zašto planete ostaju u orbiti umesto da odlete u svemir?'"
              },
              "ExpectedStudentResponses": {
                "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "1-2 primera odgovora koji pokazuju ovladavanje gradivom (u navodnicima)."
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
          "description": "Domaći zadatak/praktična vežba van časa.",
          "properties": {
            "TeacherNotes": {
              "x-format": "**{loc.TeacherNotes}:** {value}",
              "type": "string",
              "description": "Kratko objašnjenje ciljeva vežbe, npr. 'Ovi zadaci učvršćuju današnje učenje o [topic] tako što od učenika traže da posmatraju obrasce iz stvarnog sveta i objasne ih koristeći koncepte uvedene na času...'"
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
                    "description": "npr. '(DOK 2) Večeras izađite napolje i napišite 3-4 rečenice...'"
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
                  "description": "npr. 'Refleksija: Napišite 2-3 rečenice kao odgovor na jedan podsticaj:'"
                },
                "ReflectionOptions": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Tačno 4 opcije za refleksiona pitanja u navodnicima."
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
},
};
