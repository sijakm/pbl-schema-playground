window.labPromptsru = {
  STEP0_PROMPT_TEMPLATE: `Создайте план модуля и структуру уроков, используя информацию ниже. НЕ пишите полные планы уроков.
                    
На основе учебного предмета модуля, образовательных стандартов, описания/инструкции по модулю, уровня класса, продолжительности занятия (в минутах) и запрошенного количества уроков сгенерируйте JSON-ответ, который включает связное UnitDescription и непересекающийся список «контейнеров» уроков.

Учебный предмет модуля:
{{$Subject}}

Название модуля:
{{$Name}}

Описание/инструкция по модулю:
{{$UserPrompt}}

Уровень класса:
{{$GradeLevel}}

Продолжительность занятия в минутах:
{{$ClassDuration}}
	
Стандарты для соотнесения:
{{$Standards}}
    
Ученики с индивидуализированной поддержкой:
{{$LearningPlans}}

Ресурсы/медиа для использования:
{{$MediaContext}}
	
Содержание модуля:
{{$AttachedUnit}}

Требования к ключевым вопросам:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, оканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с «How», либо с «Why».
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактологическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменение, доказательства, закономерности, взаимосвязи, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми за пределами этого модуля.
- Вопросы ДОЛЖНЫ использоваться дословно в каждом уроке внутри модуля.

Что нужно сгенерировать:
- Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме.
- ОБЯЗАТЕЛЬНО: Полностью заполните все свойства внутри объекта "UnitDescription":
  - "Description": Напишите абзац из 4–5 предложений, который описывает основной фокус модуля и его повествовательную траекторию.
  - "StudentLearningObjectives": Перечислите 3–5 ключевых измеримых целей обучения для модуля.
  - "StandardsAligned": Перечислите все стандарты, которые охватываются в ходе модуля.
  - "EssentialQuestions": Ровно 3 концептуальных вопроса, соответствующих правилам выше.
- СГЕНЕРИРУЙТЕ список "Lessons", содержащий ровно {{$NumberOfItems}} уроков.
  - Каждый урок должен включать "lessonNumber" (индекс, начиная с 1), "lessonName" и "lessonDescription" (2–4 предложения, описывающих содержание урока).

Ограничения:
- Сохраняйте соответствие между модулем и каждым уроком общему фокусу модуля.
- Обеспечьте логическую последовательность от базовых идей к более сложному моделированию.
- Точность: весь контент должен быть научно корректным и соответствующим возрасту.

Вывод ДОЛЖЕН быть корректным JSON, соответствующим схеме. Используйте компактное форматирование (без лишних пустых строк).`,
  PER_LESSON_PROMPT_TEMPLATE: `Создайте ОДИН план урока ЛАБОРАТОРНОЙ работы (НЕ план модуля, НЕ несколько уроков), используя информацию ниже.
ВЫ ДОЛЖНЫ вывести корректный JSON, который точно соответствует предоставленной JSON-схеме. Не включайте никаких дополнительных ключей. Используйте компактное форматирование JSON (без лишних пустых строк).
Предмет модуля:
{{$Subject}}
Название модуля:
{{$Name}}
Описание/инструкция модуля:
{{$UserPrompt}}
Класс:
{{$GradeLevel}}
Продолжительность урока в минутах
{{$ClassDuration}}
Ресурсы/медиа для использования:
{{$MediaContext}}
Содержание модуля:
{{$ParentUnitData}}
Стандарты, с которыми нужно согласовать:
{{$Standards}}
Прикрепленное содержание урока:
{{$AttachedLesson}}

Ключевые вопросы модуля (ИСПОЛЬЗУЙТЕ ИХ ДОСЛОВНО):
{{$UnitEssentialQuestions}}

Если приведенные выше Ключевые вопросы модуля пусты, сгенерируйте ровно 3 концептуальных вопроса, соблюдая следующие правила:
- Каждый вопрос ДОЛЖЕН быть полным, грамматически правильным предложением, оканчивающимся вопросительным знаком.
- Каждый вопрос ДОЛЖЕН начинаться либо с "How", либо с "Why".
- Вопросы ДОЛЖНЫ быть концептуальными и исследовательскими, а не фактологическими, процедурными или определительными.
- Вопросы ДОЛЖНЫ быть сосредоточены на широких, универсальных идеях (таких как изменение, доказательства, закономерности, отношения, системы или рассуждение), а не на содержании, специфичном для предмета.
- Вопросы ДОЛЖНЫ быть переносимыми между дисциплинами и применимыми вне данного модуля.


УЧАЩИЕСЯ С ИНДИВИДУАЛИЗИРОВАННОЙ ПОДДЕРЖКОЙ (ДОЛЖНЫ использоваться ТОЛЬКО внутри Experiment.AccommodationsAndModifications; используйте имена учащихся/планы в точности так, как они написаны):
{{$LearningPlans}}

ВАЖНЫЕ ПРАВИЛА СОДЕРЖАНИЯ:
- Сохраняйте урок в рамках темы модуля: развитие и использование моделей для описания атомного состава простых молекул и/или сложных структур.
- При необходимости включайте краткие, общие связи с другими соответствующими DCI, но держите урок сосредоточенным на моделировании и рассуждении о связи «структура–свойство» (без глубокой математики, без уравнивания балансов, если это прямо не требуется стандартами).
- Убедитесь, что все части урока отражают Scope/Boundaries урока, указанные в контексте модуля; не вводите новые крупные понятия, относящиеся к другим урокам.
- EssentialQuestions: ДОЛЖНЫ в точности равняться ключевым вопросам на уровне модуля (тот же текст, тот же порядок).
- AssessPriorKnowledge: ТОЛЬКО если LessonNumber == 1, напишите 150–250 слов и следуйте требуемой структуре, описанной в схеме. Если LessonNumber != 1, верните "" (пустую строку).
- Фазы Lab (Question, Research, Hypothesize, Experiment, Analyze, Share): следуйте конкретным инструктивным требованиям и строкам "Purpose:" для каждой фазы, как они определены в JSON-схеме.
- Experiment.AccommodationsAndModifications должен включать общую поддержку, а затем индивидуальную поддержку для каждого учащегося, указанного в {{$LearningPlans}}.
- StudentPractice ДОЛЖЕН включать абзац TeacherNotes, начинающийся с 'These tasks reinforce today's learning about ____ by ______.', список из 2–3 заданий с DOK 2–4 и критериями успеха, а также интерливинг, если предмет — математика.

ТРЕБОВАНИЯ К ВЫВОДУ:
- Вывод ДОЛЖЕН быть корректным JSON, точно соответствующим предоставленной схеме.
- Вывод ДОЛЖЕН представлять ТОЛЬКО ОДИН план урока.
- Никакого HTML. Никаких эмодзи. Никакой разметки markdown. Обычный текст внутри строковых полей.`,
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
          "description": "Unit description as one cohesive plain-text paragraph (4–5 complete sentences) written in natural teacher voice that you could say directly to students. No HTML, no emojis, no bullet points. Must flow conversationally but follow this structure (without headlines): (1) hook sentence that sparks curiosity or makes a surprising contrast, (2) 'In this unit, you will...' sentence about mastery outcomes, (3) 'You'll strengthen your skills in...' sentence about thinking/analysis abilities, (4) 'This connects to...' sentence about real-world relevance, (5) 'Understanding this matters because...' sentence about broader significance or long-term impact."
        },
        "EssentialQuestions": {
          "x-format": "### 💭{loc.EssentialQuestions}\n\n{items}",
          "x-cache": true,
          "type": "array",
          "minItems": 3,
          "maxItems": 3,
          "description": "Create essential questions that focus only on broad, universal concepts such as change, evidence, patterns, relationships, systems, or reasoning. Do NOT mention any subject-specific terms, processes, vocabulary, or examples. The questions must be open-ended, transferable across all disciplines, and impossible to answer by learning the lesson or unit content. Focus only on the big ideas, not the subject matter.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StudentLearningObjectives": {
          "x-format": "### 🎯{loc.StudentLearningObjectives}\n\n{items}",
          "type": "array",
          "description": "Full 'Student Learning Objectives' section for this whole unit. Each list item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "StandardsAligned": {
          "x-format": "### 📏{loc.StandardsAligned}\n\n{items}",
          "type": "array",
          "description": "List all unique educational standards used anywhere in this unit and its lessons. Do NOT add standards that do not appear in the unit content. Each standard must include standard code and description, e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "KeyVocabulary": {
          "x-format": "### 🔤{loc.KeyVocabulary}\n\n{items}",
          "type": "array",
          "description": "Full 'Key Vocabulary' section as a list of strings. Each string should be a single term with definition separated by dash/hyphen. Example: 'Gravity - The force that pulls objects toward each other'. All definitions must be short, age-appropriate, and directly related to the lesson's content.",
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
      "description": "List of lesson containers for this unit (outline only). Each item must be non-overlapping and scoped clearly so lesson content does not repeat across lessons.",
      "items": {
        "type": "object",
        "properties": {
          "lessonNumber": {
            "type": "integer",
            "description": "Ordering number of a lesson. 1 Based."
          },
          "lessonTitle": {
            "type": "string",
            "description": "Short lesson title as plain text."
          },
          "lessonOutline": {
            "type": "string",
            "description": "2–4 sentences describing the lesson scope, focus, and boundaries to prevent overlap with other lessons."
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
      "description": "Just paste all the essential questions that are generated in unit level in same order.",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "StudentLearningObjectives": {
      "x-format": "### 🎯 {loc.StudentLearningObjectives}\n\n{items}",
      "type": "array",
      "description": "Full 'Student Learning Objectives' section as plain text. Each item must be a clear, measurable objective that starts with a measurable verb and ends with a DOK label in parentheses, e.g. 'Model how Earth's rotation on its axis causes day and night (DOK 2).'",
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
      "description": "Full 'Standards Aligned' section as plain text for this lesson. Each standard must include standard code and description and code and description must be exactly the same used in Unit. e.g. 'MS-ESS1-1: Develop and use a model of the Earth–sun–moon system to describe the cyclic patterns of lunar phases, eclipses, and seasons.'",
      "items": {
        "x-format": "- {value}",
        "type": "string"
      }
    },
    "KeyVocabulary": {
      "x-format": "### 🔤 {loc.KeyVocabulary}\n\n{items}",
      "type": "array",
      "description": "Select verbatim the key vocabulary for this lesson from the unit-level vocabulary provided in the prompt. Do NOT invent new words. You must reuse the exact wording from the Step 0 UnitDescription.KeyVocabulary.",
      "items": {
        "x-format": "{index}. {value}",
        "type": "string"
      }
    },
    "AssessPriorKnowledge": {
      "x-format": "## 💡 {loc.AssessPriorKnowledge}\n\n{loc.TeacherNote}\n\n{value.ActivityInstructions}\n\n{value.ExpectedStudentResponses}\n\n{value.ClosingTeacherPrompt}\n\n{value.AlternateOptions}",
      "type": "object",
      "description": "Assess Prior Knowledge section. ONLY Lesson 1 should contain a detailed block; ALL OTHER LESSONS MUST RETURN NULL or OMIT this field. For Lesson 1, structure must include: 1. Include this section only in the first lesson of the unit. 2. Ensure DOK 1-3 prompts are used. 3. Include prerequisite skills needed for the student learning objectives. 4. Pick one modality from this list and fully develop it: questioning, K-W-L, visuals, concept maps, reflective writing, anticipation guides, vocabulary ratings. 5. Initial teacher prompt with 'Say:' statement. 6. Clear instructions and template/structure for the chosen modality. 7. 'Expected Student Responses' section. 8. Closing teacher 'Say:' prompt. 9. After fully developing one modality, provide 2 brief alternate options.",
      "properties": {
        "ActivityInstructions": {
          "type": "string",
          "description": "Clear instructions and template/structure for the chosen modality. E.g. 'Say: \"Before we begin...\"'"
        },
        "ExpectedStudentResponses": {
          "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
          "type": "array",
          "description": "Anticipated answers or common misconceptions for the chosen modality.",
          "items": {
            "x-format": "- {value}",
            "type": "string"
          }
        },
        "ClosingTeacherPrompt": {
          "type": "string",
          "description": "Closing teacher 'Say:' prompt that validates student thinking and previews unit investigation."
        },
        "AlternateOptions": {
          "x-format": "**{loc.AlternateOptions}**\n\n{items}",
          "type": "array",
          "description": "2 brief alternate options a teacher could choose.",
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
      "x-format": "### {green}(Question (5 min))\n\n**{loc.Purpose}:** Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teacher so students will observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Word for Word - Purpose: Observe a phenomenon, identify something puzzling, and generate a meaningful question that will guide the investigation."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "List of required materials (e.g. visual aids, markers, etc.)",
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
              "description": "Step-by-step teacher instructions, actions, and 'Say:' prompts to present a phenomenon and invite questions."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 expected student questions or ideas about the phenomenon."
            },
            "FinalInvestigationQuestion": {
              "type": "string",
              "description": "The final step in the teacher instructions. Start this string with the next sequential number following the previous instructions (e.g., '8. Final Step: Say: ...') and state the big question to investigate today."
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
      "x-format": "### {green}(Research (5 min))\n\n**{loc.Purpose}:** Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teacher so students learn background information, vocabulary, and prior knowledge needed to understand the topic.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Word for word: Purpose: Gather background information, vocabulary, and prior knowledge needed to understand the topic and prepare for informed investigation."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "List of required materials (e.g. visual aids, markers, etc.)",
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
              "description": "Step-by-step teacher instructions, actions, and 'Say:' prompts to explain background knowledge, vocabulary, and model the phenomenon."
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
                    "description": "Student misconception"
                  },
                  "TeacherResponse": {
                    "type": "string",
                    "description": "What the teacher should say to correct it"
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
      "x-format": "### {green}(Hypothesize (5 min))\n\n**{loc.Purpose}:** Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teacher so students develop a testable prediction.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Word for Word: Purpose: Develop a testable prediction or claim based on their research and reasoning, setting a clear expectation for what they believe will happen."
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
              "description": "Teacher instructions. Include 'Say:' prompts. Provide a specific instruction like 'Write on the board:' followed by a markdown bulleted list of 4-5 hypothesis sentence frames."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "3-4 expected hypothesis examples."
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
      "x-format": "### {green}(Experiment (20 min))\n\n**{loc.Purpose}:** Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teacher so students carry out a structured investigation.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Word for word: Purpose: Carry out a structured investigation- hands-on, simulated, or analytical- to test their hypothesis and gather evidence through observation or measurement."
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
              "description": "Step-by-step teacher instructions to organize the experiment, give directions, and circulate."
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
                      "description": "For Go Deeper responses."
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
              "description": "This section must include two types of supports: General Supports and Individualized Supports. Focus on access, not lowering rigor.",
              "properties": {
                "General": {
                  "type": "array",
                  "items": {
                    "x-format": "- {value}",
                    "type": "string"
                  },
                  "description": "Non-student-specific strategies that improve access for all learners (e.g., visuals, pre-filled notes, digital glossary, chunked instructions). Provide 2-4 bullet points."
                },
                "IndividualSupport": {
                  "x-format": "{items}",
                  "type": "array",
                  "description": "Specific accommodations and modifications for named students with formal plans. List EACH student individually; do NOT group students together. The supports for each student should be an easy-to-scan list.",
                  "items": {
                    "x-format": "### {red}({value.StudentName})\n\n**{loc.PlanProvided}:**\n{value.PlanProvided}\n\n**{loc.PlanImplementation}:**\n{value.PlanImplementation}",
                    "type": "object",
                    "properties": {
                      "StudentName": {
                        "type": "string",
                        "description": "First and last name of the individual student receiving these supports."
                      },
                      "PlanProvided": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "The formal plan provided for this student in the prompt. Parse the plan into a clear list. You may paraphrase it to improve formatting, but do NOT omit or add any information."
                      },
                      "PlanImplementation": {
                        "type": "array",
                        "items": {
                          "x-format": "- {value}",
                          "type": "string"
                        },
                        "description": "Concrete tools/stems/visuals/organizers for this task."
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
      "x-format": "### {green}(Analyze (5 min))\n\n**{loc.Purpose}:** Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teachers so students interpret the data they collected.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Purpose: Interpret the data they collected, identify patterns, evaluate their hypothesis, and construct evidence-based conclusions."
        },
        "Materials": {
          "x-format": "**📚 {loc.Materials}**\n\n{items}",
          "type": "array",
          "description": "List of required materials (e.g. visual aids, markers, etc.)",
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
                    "description": "The teacher instruction text (e.g. 'Provide sentence starters:'). Do NOT include numbering, it is handled automatically."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Optional bullet points. You MUST provide a list of 4-5 sentence starters when the step asks for them. You MUST provide a list of 4-5 circulation prompts when the step asks for them. Otherwise, provide an empty array."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Step-by-step teacher instructions. You MUST include exactly one step specifically for sentence starters and fill its 'Bullets' array. You MUST include exactly one step specifically for circulation prompts and fill its 'Bullets' array."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Expected answers or sentence frame completions from students."
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
      "x-format": "### {green}(Share (5 min))\n\n**{loc.Purpose}:** Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding.\n\n{value.Materials}\n\n{value.InstructionsForTeachers}",
      "type": "object",
      "description": "Guide teachers so students communicate their findings clearly.",
      "properties": {
        "Purpose": {
          "x-format": false,
          "type": "string",
          "description": "Word for word: Purpose: Communicate their findings clearly to others, using evidence to explain what they discovered, why it matters, and how it contributes to deeper understanding."
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
                    "description": "The teacher instruction text (e.g. 'Write on board:'). Do NOT include numbering, it is handled automatically."
                  },
                  "Bullets": {
                    "type": "array",
                    "x-format": "{items}",
                    "items": {
                      "type": "string",
                      "x-format": "- {value}"
                    },
                    "description": "Optional bullet points. You MUST provide a list of 4-5 points when the step provides a structure for sharing. You MUST provide a list of 4-5 teacher prompts (questions) when the step asks for them. Otherwise, provide an empty array."
                  }
                },
                "required": [
                  "Step",
                  "Bullets"
                ],
                "additionalProperties": false
              },
              "description": "Step-by-step teacher instructions. You MUST include exactly one step specifically for providing a structure for sharing and fill its 'Bullets' array. You MUST include exactly one step specifically for teacher prompts and fill its 'Bullets' array."
            },
            "ExpectedStudentResponses": {
              "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Expected ideas shared by students."
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
      "description": "Full 'Review & Spaced Retrieval' section.",
      "properties": {
        "ActiveRecall": {
          "x-format": "🔄 **{loc.ActiveRecall}**\n\n{value.Say}\n\n{value.ExpectedStudentResponses}",
          "type": "object",
          "description": "Asking students to recall NEW learning from TODAY'S lesson.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
          "description": "Teacher prompt linking to unit question.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
          "description": "Asking students to connect the learning to other real-world scenarios.",
          "properties": {
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
          "description": "Recall from a specific prior lesson/unit.",
          "properties": {
            "PriorLearningContext": {
              "type": "string",
              "description": "Context sentence like 'Earlier in this lesson, students learned...'"
            },
            "Say": {
              "type": "string",
              "description": "The teacher prompt starting with 'Say: '."
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
      "description": "Exactly 4 Formative Assessment prompts, one for each DOK level.",
      "items": {
        "x-format": "\n**{value.PromptLabel}:** {value.Question}\n\n{value.ExpectedStudentResponses}\n",
        "type": "object",
        "properties": {
          "PromptLabel": {
            "type": "string",
            "description": "e.g., 'Prompt 1 (DOK 1)'"
          },
          "Question": {
            "type": "string",
            "description": "The exact question text."
          },
          "ExpectedStudentResponses": {
            "x-format": "✅ {loc.ExpectedStudentResponses}\n\n{items}",
            "type": "array",
            "items": {
              "x-format": "- {value}",
              "type": "string"
            },
            "description": "1-2 sample responses showing mastery."
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
      "description": "Homework/out-of-class practice.",
      "properties": {
        "TeacherNotes": {
          "type": "string",
          "description": "Teacher notes explaining how these practice tasks reinforce today's learning and strengthen long-term retention."
        },
        "PracticeTasks": {
          "x-format": "{items}",
          "type": "array",
          "description": "Exactly 3 practice tasks (DOK 2 or DOK 3).",
          "items": {
            "x-format": "\n\n**{index}.** {value.TaskDescription}\n\n{value.ExpectedStudentResponses}",
            "type": "object",
            "properties": {
              "TaskDescription": {
                "type": "string",
                "description": "e.g., '(DOK 2) Tonight, go outside and write 3-4 sentences...'"
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
          "description": "A reflection task for the students.",
          "properties": {
            "Prompt": {
              "type": "string",
              "description": "e.g., 'Reflection: Write 2-3 sentences responding to one prompt:'"
            },
            "ReflectionOptions": {
              "type": "array",
              "items": {
                "x-format": "- {value}",
                "type": "string"
              },
              "description": "Exactly 4 reflection question options."
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
