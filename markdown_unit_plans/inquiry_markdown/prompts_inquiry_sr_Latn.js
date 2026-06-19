window.prompts_inquiry_sr_Latn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte SAMO nacrt INKVAJRI jedinice (Korak 0) koristeći informacije u nastavku. Ne kreirajte kompletan plan jedinice i ne pišite potpune planove časova.

MORATE izvesti validan JSON koji tačno odgovara datoj JSON šemi: UnitPlanResponse. Ne uključujte nikakve dodatne ključeve. Koristite kompaktno JSON formatiranje (bez dodatnih praznih redova ili razmaka između JSON svojstava). Bez HTML-a. Bez emodžija. Običan tekst unutar string polja.

Predmet jedinice: {{$Subject}}
Naziv jedinice: {{$Name}}
Opis/Uputstvo jedinice: {{$UserPrompt}}
Nivo razreda: {{$GradeLevel}}
Trajanje časa u minutima: {{$ClassDuration}}
Traženi broj časova: {{$NumberOfItems}}
Standardi sa kojima treba uskladiti (koristite doslovno ako su prisutni; nemojte dodavati nove standarde): {{$Standards}}
Učenici sa individualizovanom podrškom (samo kontekst): {{$LearningPlans}}
Resursi/mediji za upotrebu: {{$MediaContext}}
Sadržaj jedinice: {{$AttachedUnit}}
Priloženi sadržaj časa (ako postoji): {{$AttachedLesson}}

ZAHTEVI ZA INKVAJRI NACRT:
- Ovo je zasnovano na istraživanju. Časovi MORAJU napredovati kroz ovaj niz:
  (1) fenomen/iskustvo + uočavanje/zapitanost,
  (2) izbor pitanja + planiranje istraživanja,
  (3) prikupljanje dokaza + uočavanje obrazaca,
  (4) izgradnja modela + revizija koristeći dokaze,
  (5) objašnjenje/argumentacija + komunikacija + transfer.
- Održavajte stvaranje značenja kroz otkrivanje: učenici grade i revidiraju modele koristeći posmatranja i jednostavne podatke; naglasite dokaze, obrazlaganje i komunikaciju.
- Održavajte usklađenost SAMO sa datim standardima. Ne dodajte nikakve nove standarde ili okvire.
- Kulturna relevantnost i inkluzija: uključite kratke kontekste ili perspektive relevantne za zajednicu bez stereotipa.
- Umešavanje i transfer: vraćajte se veštinama kroz časove (posmatranje, modelovanje, argumentovanje na osnovu dokaza, komunikacija).
- Časovi MORAJU biti nepreklapajući sa jasnim granicama.

OGRANIČENJA ZA NIZ ČASOVA:
- Niz Lessons MORA da sadrži tačno {{$NumberOfItems}} časova.
- lessonNumber počinje od 1 i strogo raste za 1.
- Obezbedite logičan sled od osnovnih istraživačkih poteza ka složenijem modelovanju i objašnjavanju.
- Raspored mora da odgovara časovima od {{$ClassDuration}} minuta za nivo {{$GradeLevel}}.

PRAVILO ZA IZLAZ:
Vratite SAMO JSON koji je validan prema šemi UnitPlanResponse.

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Kreirajte JEDAN plan časa po istraživačkom pristupu (NE plan jedinice, NE više časova) koristeći informacije ispod. MORATE izlaziti sa važećim JSON-om koji tačno odgovara datoj JSON šemi: InquiryUnitPlanResponse. Nemojte uključivati nikakve dodatne ključeve. Koristite kompaktan JSON format (bez dodatnih praznih redova ili belina između JSON svojstava). Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.

Predmet jedinice: {{$Subject}}
Naziv jedinice: {{$Name}}
Opis/uputstvo jedinice: {{$UserPrompt}}
Nivo razreda: {{$GradeLevel}}
Trajanje časa u minutima: {{$ClassDuration}}
Standardi kojima treba uskladiti (koristite doslovno ako su prisutni; NE dodajite nove standarde): {{$Standards}}
Učenici sa individualizovanom podrškom (MORAJU se koristiti SAMO unutar InvestigationPhase.AccommodationsAndModifications; koristite imena/planove učenika tačno onako kako su napisani): {{$LearningPlans}}
Resursi/mediji za korišćenje: {{$MediaContext}}
Sadržaj jedinice: {{$AttachedUnit}}

Elementi jedinice i časa iz koraka 0 (koristite doslovno):
{{$ParentUnitData}}
- UnitDescription.EssentialQuestions (tačno kako je navedeno; ponovo koristite doslovno gde je relevantno): {{$UnitEssentialQuestions}}

Priložen sadržaj časa (ako postoji): {{$AttachedLesson}}

ZAHTEVI TOKA ISTRAŽIVAČKOG ČASA:
- Ovaj čas mora pratiti istraživački tok i biti usklađen sa granicama nacrta časa: Orijentacija → Konceptualizacija → Istraživanje → Zaključak → Diskusija.
- Održavajte smisleno učenje kroz otkrivanje: učenici grade i revidiraju ideje kroz posmatranja i jednostavne podatke; naglasite dokaze, obrazloženje i komunikaciju.
- Kulturna relevantnost i inkluzija: uključite kratke kontekste ili perspektive relevantne za zajednicu bez stereotipa.
- Ne uvodite velike nove koncepte koji pripadaju drugim časovima; ostanite u okviru i granicama ovog nacrta časa.
- Održavajte usklađenost SAMO sa datim standardima. Ne dodajite nikakve nove standarde ili okvire.
- Nastavničke intervencije treba da usmeravaju razmišljanje bez direktnog davanja naučnih objašnjenja.

PRAVILA SPECIFIČNA ZA POLJA (mapirajte na šemu):
- AssessPriorKnowledge: SAMO ako je broj časa 1, napišite 150–250 reči i pratite obaveznu strukturu u opisu šeme; u suprotnom vratite "".
- InvestigationPhase.AccommodationsAndModifications:
  - General: uključite opšte podrške.
  - IndividualSupport: niz mora sadržati tačno navedene učenike i njihove planove (ista imena/planovi; bez dodatnih učenika; bez izostavljenih učenika).

PRAVILO IZLAZA:
Vratite SAMO JSON koji validira prema šemi InquiryUnitPlanResponse.

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
          "description": "Opis jedinice kao jedan koherentan odlomak u običnom tekstu (4–5 potpunih rečenica) napisan prirodnim glasom nastavnika koji možete direktno reći učenicima. Bez HTML-a, bez emodžija, bez nabrajanja. Mora da teče razgovorno, ali da prati ovu strukturu (bez naslova): (1) uvodna rečenica koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovoj jedinici ćete...” o ishodima ovladavanja, (3) rečenica „Ojačaćete svoje veštine u...” o veštinama mišljenja/analize, (4) rečenica „Ovo se povezuje sa...” o značaju u stvarnom svetu, (5) rečenica „Razumevanje ovoga je važno zato što...” o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Kreirajte suštinska pitanja koja se fokusiraju isključivo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Nemojte pominjati bilo kakve termine, procese, vokabular ili primere specifične za predmet. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguće ih je odgovoriti učenjem sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, ne na sadržaj predmeta.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Potpuna sekcija 'Ciljevi učenja učenika' za celu ovu jedinicu. Svaka stavka liste mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se oznakom DOK u zagradama",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Navedite sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim lekcijama. Nemojte dodavati standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži kod standarda i opis, npr. 'MS-ESS1-1: Razvijte i koristite model sistema Zemlja–Sunce–Mesec da biste opisali ciklične obrasce mesečevih mena, pomračenja i godišnjih doba.'",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Potpuna sekcija 'Ključni vokabular' kao lista stringova. Svaki string treba da bude jedan termin sa definicijom odvojenom crticom/kosanom crtom. Primer: 'Gravitacija - Sila koja privlači objekte jedne ka drugima'. Sve definicije moraju biti kratke, prilagođene uzrastu i direktno povezane sa sadržajem lekcije.",
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
      "description": "Lista kontejnera za lekcije za ovu jedinicu (samo pregled). Svaka stavka mora biti nepokrivajuća i jasno obuhvaćena tako da se sadržaj lekcije ne ponavlja kroz lekcije.",
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
            "description": "2–4 rečenice koje opisuju obuhvat lekcije, fokus i granice kako bi se sprečilo preklapanje sa drugim lekcijama."
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
  "title": "InquiryUnitPlanResponse",
  "type": "object",
  "x-format": "{value.AssessPriorKnowledge}\n\n{value.EssentialQuestions}\n\n{value.KeyVocabulary}\n\n{value.StudentLearningObjectives}\n\n{value.StandardsAligned}\n\n{value.OrientationPhase}\n\n{value.ConceptualizationPhase}\n\n{value.InvestigationPhase}\n\n{value.ConclusionPhase}\n\n{value.DiscussionPhase}\n\n{value.ReviewAndSpacedRetrieval}\n\n{value.FormativeAssessment}\n\n{value.StudentPractice}",
  "properties": {
    "AssessPriorKnowledge": {
      "x-format": "### 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Sekcija Procena predznanja. SAMO Lekcija 1 treba da sadrži detaljan blok; SVE DRUGE LEKCIJE MORAJU VRATITI NULL ili izostaviti ovo polje. Za Lekciju 1, struktura mora da uključuje ActivityInstructions, ExpectedStudentResponses, ClosingTeacherPrompt i AlternateOptions.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Jasna uputstva i šablon/struktura za izabrani modalitet. Npr. 'Recite: \"Pre nego što počnemo da gradimo...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Predviđeni odgovori ili uobičajene zablude za izabrani modalitet.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Završni nastavnički podsticaj (nemojte uključivati prefiks 'Recite:') koji potvrđuje razmišljanje učenika i najavljuje istraživanje jedinice."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "Dve kratke alternativne opcije koje nastavnik može da izabere.",
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
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Samo nalepite sva suštinska pitanja na nivou jedinice istim redosledom ako su data. Ako nisu data, generišite tačno 3 konceptualna pitanja koja se fokusiraju isključivo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Nemojte pominjati bilo kakve termine, procese, vokabular ili primere specifične za predmet. Pitanja moraju biti otvorenog tipa, prenosiva kroz sve discipline i nemoguće ih je odgovoriti učenjem sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, ne na sadržaj predmeta.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Izaberite doslovno ključni vokabular za ovu lekciju iz vokabulara na nivou jedinice koji je dat u promptu. Nemojte izmišljati nove reči. Morate ponovo koristiti tačan tekst iz Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Izaberite doslovno specifične ciljeve učenja učenika za ovu lekciju iz ciljeva na nivou jedinice koji su dati u promptu. Nemojte izmišljati nove ciljeve. Morate ponovo koristiti tačan tekst iz Step 0 UnitDescription.StudentLearningObjectives.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StandardsAligned": {
      "x-format": "### 📏 {loc.StandardsAligned}\n\n{items}",
      "type": "array",
      "description": "Navedite samo jedinstvene obrazovne standarde obrađene u ovoj konkretnoj lekciji. Svaki standard mora da sadrži kod standarda i opis i mora biti potpuno isti kao u jedinici. npr. 'MS-ESS1-1: Razvijte i koristite model sistema Zemlja–Sunce–Mesec da biste opisali ciklične obrasce mesečevih mena, pomračenja i godišnjih doba.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "OrientationPhase": {
      "x-format": "### {green}({loc.OrientationPhase})\n\n{loc.OrientationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "Engage": {
              "type": "object",
              "x-format": "**{loc.EngageTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte skript za uvođenje fenomena. Pobrinite se da se fokusira na podsticanje radoznalosti bez davanja naučnih objašnjenja."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Generišite 2-3 konkretna pedagoška poteza koji usmeravaju tiho posmatranje i deljenje u paru. Uključite skripte (nemojte uključivati prefiks „Say:“, npr. „Take 30 seconds to look silently...“). Fokusirajte se na hvatanje i organizovanje zapažanja učenika u smislenе kategorije i podsticanje više perspektiva.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Generišite 2-3 konkretna podsticaja kao jedan string koji će pomoći učenicima da identifikuju detalje, uoče obrasce i iznesu početna pitanja. Podstaknite učenike da objasne zašto određeni detalji deluju važni i da nadograđuju ili suprotstavljaju zapažanja jedni drugih."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "Connect": {
              "type": "object",
              "x-format": "**{loc.ConnectTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte konkretnu nastavničku skriptu (nemojte uključivati prefiks „Say:“) koja pomaže učenicima da svoje opservacije fenomena pretvore u istraživačka pitanja ili probleme, dok grupišu ideje u ključne teme."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Obezbedite 2-3 konkretna podsticaja koji će pomoći učenicima da povežu zapažanja sa temeljnim izazovima, opravdaju razmišljanje dokazima i odrede koje ideje najviše vrede istražiti."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Predložite 2-3 poteza za podršku učenicima u preciziranju i grupisanju njihovih ideja, uz insistiranje da objasne svoje obrazloženje. Uključite uputstva da se ponavljajuća pitanja zabeleže i istaknu bez odgovaranja na njih.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Activate": {
              "type": "object",
              "x-format": "**{loc.ActivateTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Razvijte instrukciju koju vodi nastavnik (nemojte uključivati prefiks „Say:“) kako biste olakšali diskusiju u paru ili grupi koja generiše konkretne ideje, objašnjenja ili rešenja koristeći dostupne informacije i ograničenja. Podstaknite poređenje i obrazlaganje."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Navedite 2-3 podsticaja koji će ohrabriti učenike da predlažu ideje, objašnjavaju obrazloženje, razmatraju alternativne pristupe i procenjuju koji su delovi njihovog razmišljanja najjači ili najsigurniji."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Opišite 2-3 poteza kretanja kroz razred koji će slušati obrazloženje, insistirati na jasnoći/opravdanju i istaknuti različite pristupe bez procenjivanja koji je tačan.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves"
              ],
              "additionalProperties": false
            },
            "Probe": {
              "type": "object",
              "x-format": "**{loc.ProbeTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}\n\n{value.Closing}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte skriptu koja podstiče učenike da preciziraju i testiraju svoje ideje ispitivanjem pretpostavki, razmatranjem različitih uslova i identifikovanjem ključnih faktora ove lekcije."
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Predložite 2-3 konkretna podsticaja da se ideje testiraju u odnosu na nove uslove, identifikuju slabosti i revidira razmišljanje koristeći dokaze za fenomene ove lekcije."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Obezbedite 2-3 konkretna poteza koji će podstaći učenike da se vrate svojim početnim idejama i revidiraju ih na osnovu dokaza, kao i da opravdaju promene u svom razmišljanju.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Closing": {
                  "type": "string",
                  "description": "Završna instrukcija koja podstiče učenike da testiraju i revidiraju svoje ideje, razmotre dugoročne efekte i promenljive uslove, i koriste dokaze iz opservacija da ojačaju ili ospore svoje razmišljanje."
                }
              },
              "required": [
                "Prompt",
                "PromptingOptions",
                "FacilitationMoves",
                "Closing"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "Engage",
            "Connect",
            "Activate",
            "Probe"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "ConceptualizationPhase": {
      "x-format": "### {green}({loc.ConceptualizationPhase})\n\n{loc.ConceptualizationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Lista potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "GuideQuestionGeneration": {
              "type": "object",
              "x-format": "**{loc.GuideQuestionGenerationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte nastavničku skriptu (nemojte uključivati prefiks „Say:“) za uvođenje sesije generisanja pitanja. Fokusirajte se na prelazak od individualnog razmišljanja ka deljenju u paru kako bi se ideje proširile."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Generišite 2-3 konkretna poteza za podršku generisanju pitanja kod učenika. Uključite vreme za razmišljanje, javno beleženje svih pitanja i podsticanje učenika da preciziraju, kombinuju ili prošire pitanja bez evaluacije zasnovane na procenjivanju.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Generišite 2-3 konkretna podsticaja koji će pomoći učenicima da iznesu radoznalost, identifikuju šta žele da razumeju i usmere se na ključne aspekte sistema ili dizajna."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "IdentifyResearchQuestion": {
              "type": "object",
              "x-format": "**{loc.IdentifyResearchQuestionTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte skriptu (nemojte uključivati prefiks „Say:“) koja vodi učenike u odabiru pitanja koje bi im najviše pomoglo da uče iz testabilnog modela."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Predložite 2-3 poteza koji će usmeriti učenike u razvrstavanje pitanja u teme i poređenje ideja na osnovu testabilnosti. Uključite poteze koji podržavaju učenike da široka pitanja preciziraju u jasna istraživanja identifikovanjem varijabli.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Generišite 2-3 podsticaja koji će pomoći učenicima da procene pitanja na osnovu testabilnosti, jasnoće, usmerenosti na varijable i potencijala da generišu korisne dokaze."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CreateAnActionPlan": {
              "type": "object",
              "x-format": "**{loc.CreateAnActionPlanTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte scenario (nemojte uključiti prefiks 'Say:') da podstaknete učenike da definišu šta će posmatrati, šta će menjati i šta će prikupljati kao dokaz."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Opišite 2-3 koraka za podršku učenicima u osmišljavanju plana istraživanja i identifikovanju varijabli. Uključite korake koji podstiču učenike da planove učine preciznim i proverljivim, i obezbedite da imaju jasan način da utvrde uspeh.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Dajte 2-3 konkretna podsticaja da pomognete učenicima da razjasne šta će menjati, šta će zadržati isto i kako će uporediti rezultate."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "GuideQuestionGeneration",
            "IdentifyResearchQuestion",
            "CreateAnActionPlan"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "InvestigationPhase": {
      "x-format": "### {green}({loc.InvestigationPhase})\n\n{loc.InvestigationPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n{value.AnticipatedMisconceptions}\n\n{value.Differentiation}\n\n{value.AccommodationsAndModifications}\n\n{value.QuickCheck}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Spisak potrebnih materijala (npr. vizuelna pomagala, markeri itd.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "properties": {
            "LaunchInvestigation": {
              "type": "object",
              "x-format": "**{loc.LaunchTheInvestigationTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte nastavnikova uputstva za uvođenje zbunjujuće situacije ili modela. Prvo navedite radnju u zagradama kao [Prikažite model, situaciju, demonstraciju ili kratku priču koja uključuje manu, neefikasnost ili neočekivan rezultat kako biste podstakli radoznalost], a zatim navedite razgovorni scenario (nemojte uključiti prefiks 'Say:')."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Generišite 2-3 koraka za vođenje uvoda. Jasno navedite nastavne radnje bez prefiksiranja sa 'Say:'. Uključite davanje učenicima vremena da posmatraju pre delovanja, podsticanje višestrukih tumačenja i naglašavanje da može postojati više validnih ideja.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Generišite 2-3 konkretna podsticaja da pomognete učenicima da uoče važne ili neočekivane osobine, generišu moguća objašnjenja i opravdaju razmišljanje dokazima."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CollaborationExpectations": {
              "type": "object",
              "x-format": "**{loc.CollaborationExpectationsTitle}**\n\n**{loc.Say}:** {value.Prompt}\n\n{loc.FacilitationMovesLabel}\n\n{value.FacilitationMoves}\n- **{loc.PromptWithQuestionsSuchAs}:** {value.PromptingOptions}",
              "properties": {
                "Prompt": {
                  "type": "string",
                  "description": "Kreirajte izgovoreni scenario (nemojte uključiti prefiks 'Say:') da zadatak postavite kao međuzavisan i naglasite zajedničku odgovornost. Uključite uputstva za učenike da koriste početke rečenica (npr. 'Mislim... zato što...') i strukture učešća kao što su žetoni za govor."
                },
                "FacilitationMoves": {
                  "type": "array",
                  "description": "Navedite 3-5 konkretnih koraka ili ponašanja učenika koja treba pratiti tokom rada u grupi (npr. prepoznavanje obrazaca, beleženje u zajedničkim tabelama podataka, upoređivanje tumačenja). Nemojte prefiksirati ove radnje sa 'Say:'. Pobrinite se da budu usmerene na to da svi učenici doprinose posmatranju i dorađivanju ideja.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "PromptingOptions": {
                  "type": "string",
                  "description": "Dajte 2-3 podsticaja da ohrabrite učenike da podele zapažanja, uporede tumačenja, opravdaju tvrdnje dokazima i zajednički revidiraju ideje."
                }
              },
              "required": [
                "Prompt",
                "FacilitationMoves",
                "PromptingOptions"
              ],
              "additionalProperties": false
            },
            "CirculationPrompts": {
              "type": "object",
              "x-format": "**{loc.CirculationPromptsTitle}**\n\n**{loc.ConceptualPromptsTitle}**\n\n{value.Conceptual}\n\n**{loc.ReasoningPromptsTitle}**\n\n{value.Reasoning}\n\n**{loc.CollaborationPromptsTitle}**\n\n{value.Collaboration}",
              "description": "Konkretni podsticaji koje će nastavnik koristiti dok se kreće između grupa.",
              "properties": {
                "Conceptual": {
                  "type": "array",
                  "description": "2-3 podsticaja usmerena na ključne naučne ili nastavne koncepte (npr. 'Koji dokaz pokazuje da ovo funkcioniše?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Reasoning": {
                  "type": "array",
                  "description": "2-3 podsticaja za insistiranje na opravdanju i logici (npr. 'Kako ovaj pokušaj menja vaše mišljenje?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Collaboration": {
                  "type": "array",
                  "description": "2-3 podsticaja da se obezbedi uključivanje svih glasova (npr. 'Ko još nije doprineo?').",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "Conceptual",
                "Reasoning",
                "Collaboration"
              ],
              "additionalProperties": false
            }
          },
          "required": [
            "LaunchInvestigation",
            "CollaborationExpectations",
            "CirculationPrompts"
          ],
          "additionalProperties": false
        },
        "AnticipatedMisconceptions": {
          "type": "array",
          "x-format": "### ⚠️ {loc.AnticipatedMisconceptions}{items}",
          "description": "Generišite 2-3 uobičajene zablude učenika koje će verovatno nastati tokom ove lekcije. Svaka stavka mora da se fokusira na specifično pogrešno shvatanje i skriptu odgovora nastavnika.",
          "items": {
            "type": "object",
            "x-format": "\n\n{value.Misconception}\n\n- {value.TeacherResponse}",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "Opišite zabludu u 1 rečenici, počevši sa 'Students may think...'. NE koristite podebljavanje niti jake oznake."
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Jasna skripta odgovora za nastavnika (počinje sa 'Teacher Response: ') koja pokazuje kako odgovoriti u tom trenutku sa konkretnim podsticajem (nemojte uključiti prefiks 'Say:'). NE koristite podebljavanje niti jake oznake."
              }
            },
            "required": [
              "Misconception",
              "TeacherResponse"
            ],
            "additionalProperties": false
          }
        },
        "Differentiation": {
          "type": "object",
          "x-format": "### 🪜 {loc.Differentiation}\n\n{value.LanguageLearners}\n\n{value.AdditionalScaffolding}\n\n{value.GoDeeper}",
          "properties": {
            "LanguageLearners": {
              "type": "object",
              "x-format": "**{loc.LanguageLearners}:**\n\n{value.Strategies}\n\nUse sentence frames to support explanation and reasoning:\n\n{value.SentenceStarters}",
              "properties": {
                "Strategies": {
                  "type": "array",
                  "description": "Generišite 2-3 podrške specifične za lekciju (vizuali, banke reči, geste) kako biste učenicima koji uče jezik pomogli da pristupe idejama i izraze ih.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "SentenceStarters": {
                  "type": "array",
                  "description": "Generišite 3-4 početka rečenica koji pomažu učenicima da opišu, objasne i komuniciraju svoje razmišljanje za ovu konkretnu lekciju.",
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
                  "description": "Generišite 2-3 koraka podrške po koracima (strukturirani alati, modelirani primeri, razmišljanje naglas) i tačno uputstvo kako biste pomogli učenicima da završe zadatak.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "Checklist": {
                  "type": "array",
                  "description": "Generišite 3-4 kontrolna pitanja koja će usmeravati učenike da razumeju smisao svog učenja tokom istraživanja.",
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
                  "description": "Generišite 2-3 proširenja koja povećavaju složenost (specifični izazovi, prepoznavanje obrazaca) kako biste pomogli učenicima da prodube ili poboljšaju svoje razmišljanje koristeći dokaze.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                },
                "AdvancedQuestion": {
                  "type": "string",
                  "description": "Generišite jedan složen podsticaj (ne uključujte prefiks 'Say:')/pitanje koje će podstaći dublje konceptualno razumevanje."
                },
                "ExpectedResponses": {
                  "type": "array",
                  "description": "Generišite 3-4 konkretna primera visokokvalitetnih odgovora učenika na napredno pitanje.",
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
        "AccommodationsAndModifications": {
          "x-format": "### 🤝 {loc.AccommodationsAndModifications}\n\n**{loc.GeneralSupport}:**\n{value.General}\n\n**{loc.IndividualSupport}:**\n{value.IndividualSupport}",
          "type": "object",
          "description": "Ovaj odeljak mora da uključuje dve vrste podrške: Opšta podrška i Individualizovana podrška. Fokusirajte se na pristup, a ne na smanjenje rigoroznosti.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Strategije koje nisu specifične za učenika i koje poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, podeljena uputstva na manje celine). Navedite 2-4 stavke u listi."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Specifična prilagođavanja i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; ne grupišite učenike zajedno. Podrška za svakog učenika treba da bude u listi koja se lako pregledava.",
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
                    "description": "Formalni plan naveden za ovog učenika u zadatku. Pretvorite plan u jasnu listu. Možete parafrazirati da biste poboljšali formatiranje, ali nemojte izostaviti niti dodati bilo koju informaciju."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Konkretni alati/polazne rečenice/vizuali/organizatori za ovaj zadatak."
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
        "QuickCheck": {
          "type": "object",
          "x-format": "### ✔ {loc.QuickCheck}\n\n{value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedResponses}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Generišite jedno konkretno pitanje (ne uključujte prefiks 'Say:') za proveru razumevanja učenika tokom ili na kraju istraživanja."
            },
            "ExpectedResponses": {
              "type": "array",
              "description": "Generišite 3-4 očekivana odgovora učenika koji pokazuju savladanost koncepta lekcije.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Question",
            "ExpectedResponses"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "AnticipatedMisconceptions",
        "Differentiation",
        "AccommodationsAndModifications",
        "QuickCheck"
      ],
      "additionalProperties": false
    },
    "ConclusionPhase": {
      "x-format": "### {green}({loc.ConclusionPhase})\n\n{loc.ConclusionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "description": "",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Spisak potrebnih materijala (npr. vizuelna pomagala, markeri, itd.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}\n\n{value.WritingPrompt}\n\n{value.CollaborationInstruction}\n\n*{value.Guardrail}*",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Izjava (ne uključujte prefiks 'Say:') koja će učenike vratiti na istraživačko pitanje i izneti na videlo nove ideje o tome kako dizajn funkcioniše."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 pedagoška poteza koji će učenicima dati vremena da pregledaju podatke, identifikuju obrasce i uporede rezultate kroz diskusiju.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 konkretna pitanja koja će podstaći učenike da objasne obrasce, obrazlože odluke dokazima i opišu uzročno-posledične odnose.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            },
            "WritingPrompt": {
              "type": "string",
              "description": "Izjava (ne uključujte prefiks 'Say:') koja navodi šta njihov pisani odgovor mora da sadrži (sadržinski specifične komponente) i podsetnik da koriste podatke kao dokaz."
            },
            "CollaborationInstruction": {
              "type": "string",
              "description": "Uputstvo za učenike da prvo rade samostalno, a zatim podele sa partnerom ili grupom kako bi unapredili svoje obrazloženje."
            },
            "Guardrail": {
              "type": "string",
              "description": "Podsetnik da nastavnik NE treba da pruži naučno objašnjenje, već da podstakne učenike da ukažu na podatke."
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions",
            "WritingPrompt",
            "CollaborationInstruction",
            "Guardrail"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "3-4 odgovora koji direktno odgovaraju na istraživačko pitanje koristeći dokaze i rezonovanje uzroka i posledice (npr. „kada smo promenili ___, desilo se ___”).",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "DiscussionPhase": {
      "x-format": "### {green}({loc.DiscussionPhase})\n\n{loc.DiscussionPhasePurpose}\n\n**📚 {loc.Materials}**\n\n{value.Materials}\n\n**📋 {loc.InstructionsForTeachers}**\n\n{value.InstructionsForTeachers}\n\n**🌍 {loc.TranscendentThinking}:**\n\n{value.TranscendentThinking}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
      "type": "object",
      "properties": {
        "Materials": {
          "x-format": "{items}",
          "type": "array",
          "description": "Spisak potrebnog materijala (npr. vizuelna pomagala, markeri itd.)",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "**{loc.Say}:** {value.OpeningScript}\n\n{value.FacilitationMoves}\n\n**{loc.PromptWithQuestionsSuchAs}:**\n\n{value.ProbingQuestions}",
          "properties": {
            "OpeningScript": {
              "type": "string",
              "description": "Izjava (ne uključujte prefiks „Say:”) koja podstiče učenike da razmisle o širim implikacijama svojih dokaza van učionice."
            },
            "FacilitationMoves": {
              "type": "array",
              "description": "2-3 pedagoška poteza za podsticanje učenika da razgovaraju sa partnerima/grupama i osmisle sopstvene primere uticaja na stvarni svet.",
              "items": {
                "x-format": "{value}\n\n",
                "type": "string"
              }
            },
            "ProbingQuestions": {
              "type": "array",
              "description": "3-4 konkretna pitanja koja povezuju rezultate istraživanja sa svakodnevnim životom, problemima u zajednici ili redizajnom sistema.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "OpeningScript",
            "FacilitationMoves",
            "ProbingQuestions"
          ],
          "additionalProperties": false
        },
        "TranscendentThinking": {
          "type": "object",
          "x-format": "{value.Question}",
          "properties": {
            "Question": {
              "type": "string",
              "description": "Generišite 1 pitanje transcendentalnog mišljenja koje zahteva od učenika da primene učenje izvan sebe na realne kontekste (zajednice, globalni izazovi). Fokusirajte se na to zašto je učenje važno na velikoj skali (bezbednost, održivost, inovacije itd.). Izbegavajte fokus samo na ličnom/školskom nivou."
            }
          },
          "required": [
            "Question"
          ],
          "additionalProperties": false
        },
        "ExpectedStudentResponses": {
          "type": "array",
          "description": "4-5 odgovora koji ilustruju kako učenici mogu primeniti svoje razumevanje u autentičnim, stvarnim kontekstima ili u rešavanju problema usmerenih na budućnost.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        }
      },
      "required": [
        "Materials",
        "InstructionsForTeachers",
        "TranscendentThinking",
        "ExpectedStudentResponses"
      ],
      "additionalProperties": false
    },
    "ReviewAndSpacedRetrieval": {
      "x-format": "### 🧠 {loc.ReviewAndSpacedRetrieval}\n\n**{loc.TeacherNotes}:** {value.TeacherNotes}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Potpuna sekcija „Review & Spaced Retrieval“. Ova aktivnost od 5 minuta mora da uključuje: 1. Uputstva za nastavnike koja sadrže: - prompt za aktivno prisećanje uz deljenje sa partnerom/grupom - očekivane odgovore učenika (2-3 primera u bullet listi) 2. Povezivanje sa suštinskim pitanjem 3. Deo o transcendentalnom mišljenju 4. Komponentu razmaknutog prisećanja koja sadrži: - jasno upućivanje na konkretan prethodni čas - pitanje koje povezuje prošle + sadašnje koncepte - detaljne kriterijume uspeha / očekivane odgovore Sve sekcije moraju sadržati direktne nastavničke upute bez prefiksa „Say:” i jasno označene „Expected Student Responses” sa 2-3 primera odgovora.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Napomene za nastavnika koje objašnjavaju kako ova strategija za pregled jača pamćenje kroz aktivno prisećanje i povezuje istraživanje sa ključnim naučnim idejama."
        },
        "InstructionsForTeachers": {
          "type": "object",
          "x-format": "{value.ActiveRecall}\n\n{value.EssentialQuestionConnection}\n\n{value.SpacedRetrieval}",
          "description": "Korak-po-korak uputstva za nastavnika za 5-minutnu sesiju pregleda i razmaknutog prisećanja.",
          "properties": {
            "ActiveRecall": {
              "type": "object",
              "x-format": "### 🔁 {loc.ActiveRecall}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Podstaknite učenike da se prisete ključnog učenja sa današnjeg časa koristeći samo dokaze iz istraživanja.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Specifičan nastavnički tekst (ne uključujte prefiks „Say:”) koji podstiče učenike da razmisle o današnjem istraživanju i o tome šta je ono otkrilo o sistemu."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "3-4 primera kvalitetnih odgovora učenika koji jasno koriste dokaze.",
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
            "EssentialQuestionConnection": {
              "type": "object",
              "x-format": "### 💭 {loc.EssentialQuestionConnection}\n\n**{loc.Say}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Pomozite učenicima da povežu današnje konkretne dokaze sa širim suštinskim pitanjima jedinice.",
              "properties": {
                "Question": {
                  "type": "string",
                  "description": "Nastavnički tekst (ne uključujte prefiks „Say:”) koji povezuje današnje nalaze sa jednim od suštinskih pitanja jedinice."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "2-3 primera kako učenici opravdavaju tu vezu koristeći dokaze.",
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
            "SpacedRetrieval": {
              "type": "object",
              "x-format": "### ⏳ {loc.SpacedRetrieval}\n\n**{loc.Say}:** {value.TeacherSay}\n\n✅ {loc.ExpectedStudentResponses}\n\n{value.ExpectedStudentResponses}",
              "description": "Ponovo obradite koncept iz prethodne jedinice ili časa kako biste ojačali kumulativno pamćenje.",
              "properties": {
                "TeacherSay": {
                  "type": "string",
                  "description": "Nastavnički tekst (ne uključujte prefiks „Say:”) koji eksplicitno povezuje koncept iz prethodnog časa sa današnjim radom. Mora da sadrži meta-referencu (npr. „(Preuzeto iz Jedinice 1, Časa 2.)”) direktno u tekstu."
                },
                "ExpectedStudentResponses": {
                  "type": "array",
                  "description": "1-2 primera kvalitetnih odgovora učenika koji jasno pokazuju prisećanje dokaza iz prethodnog učenja.",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  }
                }
              },
              "required": [
                "TeacherSay",
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
        }
      },
      "required": [
        "TeacherNotes",
        "InstructionsForTeachers"
      ],
      "additionalProperties": false
    },
    "FormativeAssessment": {
      "x-format": "### ✅ {loc.FormativeAssessment}\n\n{items}",
      "type": "array",
      "description": "Tačno 4 podsticaja za formativnu procenu, po jedan za svaki DOK nivo.",
      "items": {
        "x-format": "\n\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "npr. „Podsticaj 1 (DOK 1)“"
          },
          "Question": {
            "type": "string",
            "description": "Tačan tekst pitanja, npr. „Zašto planete ostaju u orbiti umesto da odlete u svemir?“"
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1–2 primera odgovora koji pokazuju savladanost."
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
      "x-format": "### 🖋️ {loc.StudentPractice}\n\n**{loc.TeacherNotes}:** {loc.StudentPracticeNotes}\n\n{value.Tasks}\n\n**🔎 {loc.Reflection}:**\n\n{value.Reflection}",
      "type": "object",
      "description": "Kompletna sekcija „Učenikova vežba“ za domaći zadatak / vežbu van časa.",
      "properties": {
        "Tasks": {
          "type": "array",
          "description": "Generišite 3 zadatka koji pokrivaju DOK nivoe 2 i 3.",
          "items": {
            "type": "object",
            "x-format": "\n\n**{value.TaskTitle}**\n\n{value.Instruction}\n\n{value.SuccessCriteria}",
            "properties": {
              "TaskTitle": {
                "type": "string",
                "description": "npr. „1. (DOK 2)“"
              },
              "Instruction": {
                "type": "string",
                "description": "Jasna, korak-po-korak uputstva za učenike za zadatak."
              },
              "SuccessCriteria": {
                "type": "array",
                "description": "4–5 konkretnih, dokazima potkrepljenih stavki u vidu nabrajanja koje pokazuju kako izgleda savladanost za ovaj zadatak. KRITIČNO: Svaki kriterijum MORA počinjati glagolom radnje (npr. „Opisuje“, „Objašnjava“, „Koristi“).",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                }
              }
            },
            "required": [
              "TaskTitle",
              "Instruction",
              "SuccessCriteria"
            ],
            "additionalProperties": false
          }
        },
        "Reflection": {
          "type": "object",
          "description": "Završite refleksijama o samoregulaciji ili transcendentnom razmišljanju.",
          "properties": {
            "Instruction": {
              "type": "string",
              "description": "Uputstvo za sekciju refleksije (npr. „Napišite 2–3 rečenice odgovarajući na jedan podsticaj:“)."
            },
            "Prompts": {
              "type": "array",
              "description": "4–5 konkretnih podsticaja za refleksiju koji povezuju današnje istraživanje sa stvarnim životom, budućim alatima ili ličnim učenjem.",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              }
            }
          },
          "required": [
            "Instruction",
            "Prompts"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "Tasks",
        "Reflection"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "AssessPriorKnowledge",
    "EssentialQuestions",
    "KeyVocabulary",
    "StudentLearningObjectives",
    "StandardsAligned",
    "OrientationPhase",
    "ConceptualizationPhase",
    "InvestigationPhase",
    "ConclusionPhase",
    "DiscussionPhase",
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
    "SpacedLearningAndRetrieval": [
      "ReviewAndSpacedRetrieval"
    ],
    "FormativeAssessment": [
      "FormativeAssessment"
    ],
    "AccommodationsAndModifications": [
      "InvestigationPhase.AccommodationsAndModifications"
    ]
  }
},
};
