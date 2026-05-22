const HINTS_PROMPT_EN = `You are an educational AI assistant. Your task is to generate exactly 3 tiered hints (Initial, Follow-up, Reteach) for EACH provided question, that help a student solve the question without directly revealing the answer.

The hints must follow a pedagogical progression from a broad concept to a deeper understanding of the question's logic.

Strictly adhere to the detailed instructions and character length requirements defined in the JSON schema.

Lesson Context: {{$lesson_context}}
Lesson Name: {{$lesson_name}}
Lesson Description: {{$lesson_description}}
Subject: {{$subject}}
Grade Level: {{$grade_level}}
Question Data: {{$question_data}}`;

const HINTS_SCHEMA_EN = {
    "title": "HintsResponse",
    "type": "object",
    "properties": {
        "hints": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "initial_hint": { 
                        "type": "string",
                        "description": "Hint 1: Broad concept (very general). Do NOT include specific methods, objects, or systems used in the answer. Focus solely on the high-level scientific or historical topic."
                    },
                    "follow_up_hint": { 
                        "type": "string",
                        "description": "Hint 2: Narrower clue that adds one useful detail. Narrow the possibilities but still apply to multiple possible answers. Do not make it obvious or use parts of the correct answer."
                    },
                    "reteach_hint": { 
                        "type": "string",
                        "minLength": 500,
                        "description": "Hint 3: Guided understanding and logic explanation. This section MUST BE HIGHLY DETAILED AND COMPREHENSIVE (MINIMUM 500 CHARACTERS). It should explain the core reasoning, how to connect different pieces of evidence, and the logical steps the student should follow to arrive at the answer without stating it directly."
                    }
                },
                "required": ["initial_hint", "follow_up_hint", "reteach_hint"],
                "additionalProperties": false
            }
        }
    },
    "required": ["hints"],
    "additionalProperties": false
};

const META_EN = {
    workItemTitle: "Traces of a Giant: The Asteroid That Changed Earth",
    subject: "Science / Earth History",
    gradeLevel: "Grade 7-8",
    lessonDescription: "Evidence of past asteroid impacts on Earth's surface and their global consequences."
};

const LABELS_EN = {
    correctAnswer: "Correct Answer (for validation):"
};

const LESSON_CONTEXT_EN = `Introduction
Imagine being a detective — but instead of solving a crime, you’re solving a mystery that happened 66 million years ago. That’s what scientists do when they study asteroid collisions. They can’t watch it happen, but they can look for clues left behind in rocks, fossils, and craters to tell the story of what happened long ago.
 
In this lesson, you’ll learn how scientists gather and interpret evidence from asteroid impacts to understand how these massive collisions reshaped life on Earth. You’ll study the signs of destruction — craters, debris, fossils — and learn how each one helps explain the chain of events that followed.
By the end of the lesson, you’ll think like a geologist and historian combined, connecting facts about space and Earth’s history to understand one of the most powerful natural events ever recorded. Ready to trace the evidence of the asteroid that changed everything? Let’s get started.
 
Key Vocabulary
Asteroid
Impact Crater
Extinction
Fossil Record
Shockwave
Debris Cloud
Chicxulub Crater
Mass Extinction
Climate Change (Post-Impact)
Evidence
 
🎯Student Learning Objectives
Identify types of scientific evidence that support past asteroid impacts (DOK 2).
Analyze how fossil and sediment layers reveal changes over time (DOK 3).
Interpret visual and textual data to form explanations about historical asteroid events (DOK 3).
 
📘Core Concepts
Uncovering Earth’s Impact Clues
 
When an asteroid strikes Earth, it doesn’t just leave a mark — it changes everything around it. The blast sends shockwaves through the ground, throws up debris into the air, and alters the planet’s climate. These effects leave behind clear evidence that scientists can study millions of years later.
The main types of evidence scientists look for are:
Impact Craters – These massive dents mark where the asteroid hit. Over time, some fill with water or sediment, hiding their shape from the surface.
Fossil Records – Layers of fossils show sudden disappearances of species, signaling extinction events.
Iridium Layers and Debris Clouds – After a collision, a thin layer of dust rich in iridium (a metal common in asteroids) settles across the globe.
Sediment Layers – Rock layers act like a timeline, helping scientists determine exactly when the impact occurred.
Key Takeaways:
Asteroid impacts leave behind long-lasting geological and biological clues.
Fosils and rock layers serve as Earth’s “memory” of ancient disasters.
Scientists use these clues to reconstruct what happened millions of years ago.
🤯 Did You Know? The iridium layer that marks the dinosaur extinction event can be found in rocks on every continent — even Antarctica!
🔎Reflect & Respond: Which piece of evidence — crater, fossils, or iridium — do you think provides the most convincing proof of a past asteroid collision? Why?
 
The Chicxulub Crater: A Giant’s Footprint
One of the most important discoveries in modern science is the Chicxulub Crater in Mexico. It’s buried deep underground and underwater, but its circular shape and composition match everything scientists expect from a major impact site.
About 66 million years ago, a massive asteroid — about 6 miles wide — struck Earth here. The energy it released was more powerful than billions of atomic bombs. The collision launched debris into the atmosphere, triggered earthquakes and tsunamis, and caused a global winter that blocked sunlight for months. The result? A mass extinction that wiped out 75% of life on Earth — including most dinosaurs.
🎥Watch Why the Dinosaurs Died
Key Takeaways:
The Chicxulub Crater provides strong evidence of the asteroid impact that ended the age of the dinosaurs.
The impact caused shockwaves, fires, and long-term climate change.
Scientists use the crater’s shape, mineral content, and fossil evidence nearby to confirm the event.
🤯 Did You Know? If the asteroid had landed in a different spot — like deep in the ocean — the global effects might have been less severe!
🔎Reflect & Respond: How do you think the planet’s ecosystems might have changed if the Chicxulub asteroid had hit a different part of the world?
 
Reading the Fossil Record
The fossil record is like a timeline of life on Earth. When scientists compare fossils from before and after the impact, they notice dramatic changes. In many layers, plant fossils vanish suddenly — showing that sunlight was blocked by the debris cloud. In ocean layers, small marine organisms disappear, suggesting that changes in temperature and chemistry made it hard to survive.
 
By piecing this together, scientists can link the fossil record to the asteroid impact, showing how one event caused long-lasting changes in life on Earth. These findings help scientists understand not just what happened to the dinosaurs, but how life evolves and adapts after catastrophe.
Key Takeaways:
The fossil record helps scientists understand how asteroid impacts changed ecosystems.
Mass extinctions show patterns of both destruction and recovery.
Studying past events helps predict how current climate changes might affect life today.
🤯 Did You Know? After the asteroid wiped out the dinosaurs, mammals began to evolve rapidly — eventually leading to humans!
🔎Reflect & Respond: Why do you think life on Earth was able to recover after such a massive extinction event?
 
🧠 What This Means
The evidence of past asteroid collisions reminds us that Earth is always changing — sometimes suddenly, sometimes over millions of years. These natural disasters have shaped the planet’s climate, landscapes, and the types of life that exist today.
By studying craters, fossils, and climate shifts, scientists aren’t just looking backward — they’re preparing for the future. Understanding these ancient events helps humanity protect Earth from possible future collisions and better handle environmental changes. Every layer of rock and every fossil is a page in Earth’s history book, waiting for curious minds to read it.`;

const SAMPLE_QUESTIONS_EN = [
    {
        "question": "What direct evidence do scientists use to determine the exact timeline of an asteroid impact?",
        "questionType": 1,
        "answers": ["Impact craters", "Sediment layers", "Climate records", "Cave paintings"],
        "correctAnswers": [1],
        "correctAnswerText": "Sediment layers"
    },
    {
        "question": "What happened to the sunlight after the Chicxulub asteroid hit Earth?",
        "questionType": 1,
        "answers": ["It became much brighter", "It stayed the same", "It was blocked for months by a global debris cloud", "It turned red"],
        "correctAnswers": [2],
        "correctAnswerText": "It was blocked for months by a global debris cloud"
    },
    {
        "question": "True or False: The Chicxulub crater was easily found on the surface because of its perfect circular shape.",
        "questionType": 4,
        "answers": ["True", "False"],
        "correctAnswers": [1],
        "correctAnswerText": "False"
    },
    {
        "question": "Explain why plant fossils often disappear suddenly in the rock layers corresponding to the impact period.",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "The debris cloud blocked sunlight, preventing photosynthesis and killing many plants, which is then reflected in the fossil record."
    },
    {
        "question": "How did the asteroid impact indirectly benefit the evolution of mammals?",
        "questionType": 0,
        "answers": [],
        "correctAnswers": [],
        "correctAnswerText": "By eliminating the dominant dinosaurs, the impact cleared ecological niches, which allowed mammals to evolve rapidly and eventually lead to humans."
    }
];
