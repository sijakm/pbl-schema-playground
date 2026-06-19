window.prompts_lecture_sr_Latn = {
  STEP0_PROMPT_TEMPLATE: `Kreirajte obris nastavne jedinice i strukturu časa koristeći informacije u nastavku. Nemojte pisati kompletne planove časova.
                    
Na osnovu predmeta jedinice, obrazovnih standarda, opisa/uputstva za jedinicu, razreda, trajanja časa (u minutima) i traženog broja časova, generišite JSON odgovor koji uključuje koherentnu UnitDescription i neusaglašenu listu lekcija kao „kontejnere“.

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
	
Standardi sa kojima treba uskladiti:
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
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva kroz discipline i primenljiva van ove jedinice.
- Pitanja MORAJU biti korišćena doslovno u svakoj lekciji unutar jedinice.

Šta treba generisati:
- Izlaz MORA biti validan JSON koji odgovara šemi.
- OBAVEZNO: Potpuno popunite sva svojstva unutar objekta "UnitDescription":
  - "Description": Napišite pasus od 4–5 rečenica koji opisuje osnovni fokus jedinice i narativni tok.
  - "StudentLearningObjectives": Navedite 3–5 ključnih merljivih ciljeva učenja za jedinicu.
  - "StandardsAligned": Navedite sve standarde koji se obrađuju tokom jedinice.
  - "EssentialQuestions": Tačno 3 konceptualna pitanja koja prate gore navedena pravila.
- GENERIŠITE listu "Lessons" koja sadrži tačno {{$NumberOfItems}} lekcija.
  - Svaka lekcija mora da uključuje "lessonNumber" (indeks od 1), "lessonName" i "lessonDescription" (2–4 rečenice koje opisuju obim lekcije).

Ograničenja:
- Održavajte usklađenost jedinice i svake lekcije sa fokusom jedinice.
- Obezbedite logičan redosled od osnovnih ideja ka složenijem modelovanju.
- Tačnost: Sav sadržaj mora biti naučno tačan i primeren uzrastu.

Izlaz MORA biti validan JSON koji odgovara šemi. Koristite kompaktan format (bez dodatnih praznih linija).

CRITICAL LANGUAGE INSTRUCTION: ALL generated text and JSON values MUST be strictly written in the language of this prompt's instructions. You MUST translate any English input content (like MediaContext or Standards) into this target language. Do not output English unless specifically requested.`,
  PER_LESSON_PROMPT_TEMPLATE: `Kreirajte JEDAN NASTAVNI PLAN za LECTURE čas (NE plan jedinice, NE više časova) koristeći informacije ispod.
MORATE da iznesete validan JSON koji tačno odgovara datoj JSON šemi. Ne uključujte nikakve dodatne ključeve. Koristite kompaktno JSON formatiranje (bez dodatnih praznih linija).
Predmet jedinice: 
{{$Subject}}
Naziv jedinice: 
{{$Name}}
Opis/Uputstvo jedinice: 
{{$UserPrompt}}
Nivo razreda: 
{{$GradeLevel}}
Trajanje časa u minutima 
{{$ClassDuration}}
Resursi/mediji za upotrebu: 
{{$MediaContext}}
Sadržaj jedinice: 
{{$ParentUnitData}}
Standardi za usklađivanje:
{{$Standards}}
Priloženi sadržaj časa: 
{{$AttachedLesson}}

Ključna pitanja jedinice (KORISTITE OVA REČ PO REČ):
{{$UnitEssentialQuestions}}

Ako su ključna pitanja jedinice iznad prazna, generišite tačno 3 konceptualna pitanja prema sledećim pravilima:
- Svako pitanje MORA biti potpuna, gramatički ispravna rečenica koja se završava znakom pitanja.
- Svako pitanje MORA počinjati sa „Kako” ili „Zašto”.

- Pitanja MORAJU biti konceptualna i istraživačka, a ne činjenična, proceduralna ili definiciona.
- Pitanja MORAJU biti usmerena na široke, univerzalne ideje (kao što su promena, dokazi, obrasci, odnosi, sistemi ili zaključivanje), a ne na sadržaj specifičan za predmet.
- Pitanja MORAJU biti prenosiva između disciplina i primenljiva izvan ove jedinice.

UČENICI SA INDIVIDUALIZOVANOM PODRŠKOM (MORA da se koristi ISKLJUČIVO unutar ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications; koristite imena učenika/planove tačno onako kako su napisani):
{{$LearningPlans}}

VAŽNA PRAVILA O SADRŽAJU:
- Ostanite usklađeni sa fokusom jedinice: razvijanje i korišćenje modela za opisivanje atomske kompozicije prostih molekula i/ili proširenih struktura.
- Uključite kratke, visokog nivoa veze sa drugim relevantnim DCI gde je prikladno, ali lekcija treba da ostane usredsređena na modelovanje i rezonovanje o strukturi i svojstvima (bez duboke matematike, bez balansiranja jednačina osim ako to standardi izričito zahtevaju).
- Pobrinite se da svi delovi lekcije odražavaju opseg/granice lekcije date u kontekstu jedinice; izbegavajte uvođenje novih glavnih pojmova koji pripadaju drugim časovima.
- EssentialQuestions: MORAJU biti potpuno jednaka pitanjima na nivou jedinice (isti tekst, isti redosled).
- AssessPriorKnowledge: SAMO ako je LessonNumber == 1, popunite objekat onako kako je definisano u šemi. Za SVE OSTALE LEKCIJE, MORATE vratiti prazan objekat {} bez ijednog ključa unutra. NEMOJTE koristiti zamene poput "N/A", "none" ili prazne nizove.
- ContentDeliveryAndInteractiveActivities.AccommodationsAndModifications mora uključivati opštu podršku praćenu individualnom podrškom za svakog učenika navedenog u {{$LearningPlans}}.
- Kada bilo gde u planu lekcije predlažete "sentence frames" ili "sentence starters" (posebno u Individualized Supports), MORATE dati stvarne, konkretne rečenične obrasce prilagođene sadržaju lekcije tako da ih nastavnik može direktno koristiti.
- StudentPractice MORA uključivati paragraf TeacherNotes koji počinje sa 'These tasks reinforce today's learning about ____ by ______.', listu od 2-3 zadatka sa DOK 2-4 i kriterijumima uspeha, i interleaving ako je predmet matematika.

ZAHTEVI ZA IZLAZ:
- Izlaz MORA biti validan JSON koji tačno odgovara datoj šemi.
- Izlaz MORA biti SAMO JEDAN plan lekcije.
- Bez HTML-a. Bez emodžija. Bez markdown-a. Običan tekst unutar string polja.

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
          "description": "Opis jedinice kao jedna koherentna pasusna celina u običnom tekstu (4–5 celih rečenica) napisana prirodnim glasom nastavnika koji možete direktno reći učenicima. Bez HTML-a, bez emodžija, bez nabrajanja. Mora teći razgovorno, ali pratiti ovu strukturu (bez naslova): (1) uvodna rečenica koja budi radoznalost ili pravi iznenađujući kontrast, (2) rečenica „U ovoj jedinici ćete...” o ishodima ovladavanja, (3) rečenica „Učvrstićete svoje veštine u...” o misaonim/analitičkim sposobnostima, (4) rečenica „Ovo se povezuje sa...” o značaju u stvarnom svetu, (5) rečenica „Razumevanje ovoga je važno zato što...” o širem značaju ili dugoročnom uticaju."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Kreirajte suštinska pitanja koja se fokusiraju samo na široke, univerzalne koncepte kao što su promena, dokazi, obrasci, odnosi, sistemi ili rezonovanje. Ne pominjite nikakve termine specifične za predmet, procese, vokabular ili primere. Pitanja moraju biti otvorena, prenosiva kroz sve discipline i nemoguća za odgovor bez učenja sadržaja lekcije ili jedinice. Fokusirajte se samo na velike ideje, a ne na sadržaj predmeta.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Ceo odeljak 'Student Learning Objectives' za celu ovu jedinicu. Svaka stavka liste mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradama",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "Navedite sve jedinstvene obrazovne standarde korišćene bilo gde u ovoj jedinici i njenim lekcijama. Ne dodajte standarde koji se ne pojavljuju u sadržaju jedinice. Svaki standard mora da sadrži kod standarda i opis, npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja–Sunce–Mesec da bi se opisali ciklični obrasci mesečevih mena, pomračenja i godišnjih doba.",
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
      "description": "Lista kontejnera lekcija za ovu jedinicu (samo okvirno). Svaka stavka mora biti nepreklapajuća i jasno ograničena tako da sadržaj lekcije ne ponavlja sadržaj drugih lekcija.",
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
  "title": "LectureUnitPlanResponse",
  "type": "object",
  "properties": {
    "EssentialQuestions": {
      "x-format": "### 💭 {loc.EssentialQuestions}\n\n{items}",
      "type": "array",
      "description": "Samo nalepite sva suštinska pitanja koja su generisana na nivou jedinice, istim redosledom.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Lista vokabularskih pojmova sa definicijama. (npr. 'Solarni sistem – Sunce i sve...'). Uključite SAMO termine koji se aktivno koriste u ovoj konkretnoj lekciji.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Ceo odeljak 'Student Learning Objectives' kao običan tekst. Svaka stavka mora biti jasan, merljiv cilj koji počinje merljivim glagolom i završava se DOK oznakom u zagradama.",
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
      "description": "Ceo odeljak 'Standards Aligned' kao običan tekst za ovu lekciju. Svaki standard mora da sadrži kod standarda i opis, a kod i opis moraju biti potpuno isti kao u Jedinici. npr. 'MS-ESS1-1: Razviti i koristiti model sistema Zemlja–Sunce–Mesec da bi se opisali ciklični obrasci mesečevih mena, pomračenja i godišnjih doba.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.AssessPriorKnowledgeLectureTeacherNote}\n\n**{loc.Say}:** \"{value.SayIntroduction}\"\n\n**{loc.ProjectOrRead}:**\n{value.StatementsToProject}\n\n**{loc.Say}:** \"{value.SayInstructions}\"\n\n{value.ExpectedStudentResponses}\n\n**{loc.Say}:** \"{value.SayConclusion}\"\n\n{value.ActionConclusion}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Ceo odeljak 'Assess Prior Knowledge'. KRITIČNO: Pogledajte 'lessonNumber' u priloženom sadržaju lekcije. AKO je ovo Lekcija 1, popunite ovaj objekat u potpunosti. AKO je ovo Lekcija 2, 3 ili bilo koja druga lekcija, MORATE V RATITI PRAZAN OBJEKAT {} BEZ IKAKVIH SVOJSTAVA. Ne popunjavajte ovo za bilo koju lekciju osim Lekcije 1.",
      "properties": {
        "SayIntroduction": {
          "type": "string",
          "description": "Šta nastavnik kaže da uvede aktivnost."
        },
        "StatementsToProject": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Lista izjava koje treba projektovati ili pročitati, koje sadrže i tačne ideje i uobičajene zablude."
        },
        "SayInstructions": {
          "type": "string",
          "description": "Šta nastavnik kaže da uputi učenike šta da rade sa izjavama."
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Očekivani odgovori učenika/označavanja za svaku izjavu."
        },
        "SayConclusion": {
          "type": "string",
          "description": "Šta nastavnik kaže da zaokruži."
        },
        "ActionConclusion": {
          "type": "string",
          "description": "Akcija nastavnika za završetak (npr. crtanje dijagrama)."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          },
          "description": "Lista alternativnih opcija za aktivnost."
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
      "description": "Kreirajte odeljak Cilj koji jasno navodi ciljeve učenja učenika za lekciju.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Procena vremena (npr. '(2-3 min)')"
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
                "description": "Korak nastavnika ili skripta."
              },
              "Bullets": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "Opcionalna lista tačaka za ovaj korak. Za prvi korak, ovde uključite stvarne ciljeve učenja."
              }
            },
            "required": [
              "Step",
              "Bullets"
            ],
            "additionalProperties": false
          },
          "description": "Mora da uključuje: 1) Objasnite ciljeve učenja koristeći direktnu skriptu namenjenu nastavniku (npr. Recite: '...') i stavite stvarne ciljeve u Bullets niz. 2) Zamolite učenike da zapišu ciljeve u svoje sveske. 3) Ukratko recite nastavniku kako da poveže ciljeve sa stvarnim životnim iskustvima učenika."
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
      "description": "Blok za izlaganje sadržaja.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Procena vremena (npr. '(30 min)')"
        },
        "Hook": {
          "x-format": "{items}",
          "type": "array",
          "items": {
            "x-format": "{value}\n\n",
            "type": "string"
          },
          "description": "Napišite dramatičan, snažan uvodni sadržaj koji privlači pažnju i izgovara se kroz nastavničku skriptu. Treba da bude iznenađujuć, da budi radoznalost i da bude povezan sa glavnim konceptom."
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
              "description": "Navedite osnovne vokabularne termine. Za svaki termin obezbedite nastavničku skriptu za definisanje u striktno sledećem formatu: '[Termin] - Recite: \"[Definicija/Skripta]\"'. Primer: 'Poluga - Recite: \"Poluga je jednostavna mašina...\"'."
            },
            "ConclusionSay": {
              "type": "string",
              "description": "Završna izjava tipa 'Recite: ' za prelaz."
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
          "description": "Napišite detaljno predavanje nastavnika sa skriptama (Recite: “…”). Uključite korak po korak šta nastavnik kaže, radi i eventualno demonstrira. Raščlanite složene ideje, navedite primere/analogije, i uspostavite eksplicitne veze sa prethodnim znanjem."
        },
        "AttentionReset": {
          "type": "object",
          "description": "Umetnite standardni pasus za ponovno usmeravanje pažnje tačno onako kako je napisan: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview.'",
          "properties": {
            "StandardParagraph": {
              "type": "string",
              "description": "Mora biti tačno: 'This activity re-engages attention, resets cognitive focus, and reinforces the concept with movement + novelty while providing a purposeful preview. (word for word)'"
            },
            "Directions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "{index}. {value}",
                "type": "string"
              },
              "description": "Obezbedite uputstva za aktivnost, uključujući nastavničku skriptu i šta učenici i nastavnik treba da rade."
            },
            "WhyThisWorks": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Objasnite u tačkama zašto aktivnost funkcioniše za ponovno angažovanje, resetovanje kognitivnog fokusa, jačanje koncepata i svrhoviti pregled unapred. Npr. 'Stajanje + kretanje resetuje pažnju.'"
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
          "description": "Navedite korake sa brojevima za nastavak nastave sa nastavničkim skriptama (Recite: “…”). Raščlanite složene ideje, navedite primere/analogije, da biste zaintrigirali, nagovestili buduće učenje i proširili ključne ideje."
        },
        "AnticipatedMisconceptions": {
          "x-format": "{items}",
          "type": "array",
          "description": "Navedite očekivane česte zablude učenika kako bi nastavnik bio spreman.",
          "items": {
            "x-format": "\n\n{value.Misconception}\n- {loc.TeacherResponse}: {value.TeacherResponse}",
            "type": "object",
            "properties": {
              "Misconception": {
                "type": "string",
                "description": "npr. 'Učenici mogu misliti da uvek veća poluga bolje funkcioniše.'"
              },
              "TeacherResponse": {
                "type": "string",
                "description": "Kako efikasno odgovoriti na moguće nerazumevanje učenika i usmeriti ih ka tačnom razumevanju."
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
          "description": "Povežite sa svrhom. Povežite sa jednim od ključnih pitanja.",
          "properties": {
            "Duration": {
              "type": "string",
              "description": "npr. „(3 min)“"
            },
            "Step1Say": {
              "type": "string",
              "description": "Skripta za nastavnika koja povezuje prethodnu aktivnost sa širom idejom."
            },
            "Step2Say": {
              "type": "string",
              "description": "Skripta za nastavnika koja traži od učenika da se okrenu i razgovaraju sa partnerom."
            },
            "Step3Prompts": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- \"{value}\"",
                "type": "string"
              },
              "description": "Određena pitanja za prompt (npr. „Zašto je šaduf bio važan...“, „Koji dokaz pokazuje...“)."
            },
            "Step4Say": {
              "type": "string",
              "description": "Skripta za nastavnika za deljenje u celom odeljenju (npr. „Hajde da čujemo nekoliko ideja...“)."
            },
            "ExpectedStudentResponses": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Duboki očekivani odgovori učenika koji koriste rasuđivanje ili dokaze."
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
          "description": "Diferenciraj nastavu (kako predavati, a ne pojednostavljivati materijale). Varirajte složenost i dubinu, podstičite aktivno angažovanje/jezik. Realistično za učionicu.",
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
                  "description": "Za odgovore za „Idi dublje“."
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
          "description": "Ovaj odeljak mora da sadrži dve vrste podrške: Opštu podršku i Individualizovanu podršku. Fokusirajte se na pristup, a ne na smanjivanje rigoroznosti.",
          "properties": {
            "General": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Nestrudent-specifične strategije koje poboljšavaju pristup za sve učenike (npr. vizuali, unapred popunjene beleške, digitalni rečnik, podeljena uputstva na manje celina). Navedite 2-4 stavke u obliku nabrajanja."
            },
            "IndividualSupport": {
              "x-format": "{items}",
              "type": "array",
              "description": "Specifične prilagodbe i modifikacije za imenovane učenike sa formalnim planovima. Navedite SVAKOG učenika pojedinačno; NE grupišite učenike zajedno. Podrške za svakog učenika treba da budu lako pregledna lista.",
              "items": {
                "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                "type": "object",
                "properties": {
                  "StudentName": {
                    "type": "string",
                    "description": "Ime i prezime pojedinačnog učenika koji prima ove podrške."
                  },
                  "PlanProvided": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Formalni plan naveden za ovog učenika u promptu. Razložite plan u jasnu listu. Možete parafrazirati radi boljeg formatiranja, ali NE izostavljajte niti dodajte bilo kakve informacije."
                  },
                  "PlanImplementation": {
                    "type": "array",
                    "items": {
                      "x-format": "- {value}",
                      "type": "string"
                    },
                    "description": "Konkretnim alatima/podsetnicima/vizualima/organizatorima za ovaj zadatak."
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
      "description": "Pun odeljak „Pregled i razmaknuto prisećanje“.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Traženje od učenika da se prisete NOVOG učenja sa ČASOVA OD DANAS.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt za nastavnika koji počinje sa „Recite: “."
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
          "description": "Prompt za nastavnika koji povezuje sa pitanjem jedinice.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "Prompt za nastavnika koji počinje sa „Recite: “."
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
          "description": "Prisjećanje iz određene prethodne lekcije/jedinice.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Kontekstualna rečenica poput „Ranije u ovom času, učenici su naučili...“"
            },
            "Say": {
              "type": "string",
              "description": "Nastavnikov podsticaj koji počinje sa „Recite: “."
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
      "description": "Blok za pitanja i odgovore i diskusiju.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Procena vremena (npr. „(5 min)“)"
        },
        "InstructionsForTeachers": {
          "type": "object",
          "description": "Uputstvo za nastavnika za sesiju pitanja i odgovora i diskusije.",
          "properties": {
            "Step1_InviteSay": {
              "type": "string",
              "description": "npr. „Sada je vaša prilika da razmislite o tome šta smo naučili...“"
            },
            "Step2_AskQuestions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "   - \"{value}\"",
                "type": "string"
              },
              "description": "3-4 pitanja koja treba postaviti učenicima."
            },
            "Step3_CaptureSay1": {
              "type": "string",
              "description": "npr. „Ako imate pitanje, to znači da duboko razmišljate...“"
            },
            "Step3_CaptureRecord": {
              "type": "string",
              "description": "npr. „Zapišite pitanja učenika na tablu pod naslovom Pitanja koja još imamo.“"
            },
            "Step3_CaptureSay2": {
              "type": "string",
              "description": "npr. „Nastavićemo da dopunjavamo ovu tablu tokom cele nastavne jedinice...“"
            },
            "Step4_AnswerSay1": {
              "type": "string",
              "description": "npr. „Pogledajmo naša pitanja. Na koja možemo da odgovorimo koristeći ono što smo danas naučili?“"
            },
            "Step4_AnswerAddress": {
              "type": "string",
              "description": "npr. „Obradite nekoliko pitanja koristeći odgovore učenika i dokaze.“"
            },
            "Step4_AnswerSay2": {
              "type": "string",
              "description": "npr. „Neka od ovih pitanja pomoći će da usmerimo ono što ćemo sledeće učiti...“"
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
      "description": "Blok za zaključak.",
      "properties": {
        "Duration": {
          "type": "string",
          "description": "Procena vremena (npr. „(1 min)“)"
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
      "description": "Izvucite i generišite TAČNO 4 formativna zadatka za proveru znanja koji pokrivaju DOK 1-4. Za svaki zadatak uključite PromptLabel, Question i ExpectedStudentResponses.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n✅ {loc.ExpectedStudentResponses}\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "npr. „Zadatak 1 (DOK 1)“"
          },
          "Question": {
            "type": "string",
            "description": "Tačan tekst pitanja."
          },
          "ExpectedStudentResponses": {
            "x-format": "{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 primer odgovora koji pokazuju savladanost."
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
      "description": "Kompletan odeljak „Vežba učenika“ za domaći zadatak / vežbu van časa.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Napomene koje objašnjavaju kako zadaci učvršćuju današnje učenje i jačaju dugoročno pamćenje."
        },
        "Tasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Generiši 4 zadatka za vežbu koji pokrivaju nivoe DOK 2, 3 i 4.",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{loc.SuccessCriteria}\n\n{value.SuccessCriteria}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "npr., '(DOK 2) Nacrtaj šaduf i označi...'"
              },
              "SuccessCriteria": {
                "x-format": "{items}",
                "type": "array",
                "items": {
                  "x-format": "- {value}",
                  "type": "string"
                },
                "description": "3 stavke sa kriterijumima uspeha."
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
          "description": "Zadatak za refleksiju za učenike.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "npr., 'Napiši 2-3 rečenice kao odgovor na jedan podsticaj:'"
            },
            "ReflectionOptions": {
              "x-format": "{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 opcije za pitanje za refleksiju."
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
},
};
