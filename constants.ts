
import { Passage, PracticeModule } from './types';

export const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes

// Helper to create practice modules
const createPracticeModule = (
  topic: string, 
  meaning: string, 
  form: string, 
  pronunciation: string,
  visuals: any[],
  examples: string[],
  quizzes: any[],
  tests: any[],
  gapFills: any[],
  speaking: string[]
): PracticeModule => ({
  grammarTopic: topic,
  mfp: { meaning, form, pronunciation, visualData: visuals },
  examples,
  quizzes,
  tests,
  gapFills,
  kahootLinks: [
    { title: "Kahoot Challenge 1", url: "#" },
    { title: "Kahoot Challenge 2", url: "#" },
    { title: "Kahoot Challenge 3", url: "#" }
  ],
  speakingQuestions: speaking
});

const PASSAGE_1_PRACTICE = createPracticeModule(
  "Comparative Structures & Modifiers",
  "Used to compare differences between the two objects they modify (larger, smaller, faster, higher). In this passage, we compare human species.",
  "Noun (subject) + verb + comparative adjective + than + noun (object).",
  "Stress usually falls on the adjective. Weak form of 'than' /ðən/.",
  [{ label: "H. sapiens", value: 82 }, { label: "Neanderthal", value: 88 }, { label: "H. juluensis", value: 106 }],
  [
    "It significantly exceeds that of contemporary Neanderthals.",
    "Unlike the more gracile Homo sapiens...",
    "A cranial capacity larger than that of both Neanderthals and modern humans."
  ],
  [
    { question: "Choose the correct form: H. juluensis was ___ than H. sapiens.", options: ["more robust", "robuster", "most robust"], correct: 0 },
    { question: "The braincase was ___ broad ___ high.", options: ["more / than", "as / as", "more / as"], correct: 0 },
    { question: "It is ___ distinct species found so far.", options: ["the most", "more", "most"], correct: 0 }
  ],
  [
    { question: "Identify the modifier: 'Significantly exceeds'", options: ["Significantly", "Exceeds", "None"], correct: 0 },
    { question: "Which is incorrect? 'More larger'", options: ["Correct", "Incorrect"], correct: 1 },
    { question: "Opposite of 'Gracile' in this context?", options: ["Robust", "Small", "Weak"], correct: 0 }
  ],
  [
    { sentence: "The skull is _____ (large) than a modern human's.", answer: "larger" },
    { sentence: "It is the _____ (striking) characteristic of the fossil.", answer: "most striking" },
    { sentence: "Evolution is _____ (complex) than we thought.", answer: "more complex" }
  ],
  [
    "Describe the physical differences between modern humans and the species described in the text.",
    "Do you think size is the most important factor in evolution? Why or why not?",
    "Compare the 'Out of Africa' theory with the findings in this passage."
  ]
);

const PASSAGE_2_PRACTICE = createPracticeModule(
  "Present Participles (-ing clauses)",
  "Used to describe the result of an action or a simultaneous action. Common in scientific explanations.",
  "Verb + -ing. Often follows a comma.",
  "Smooth linking between the main verb and the participle. No pause required if defining.",
  [{ label: "Detection", value: 30 }, { label: "Analysis", value: 40 }, { label: "Prediction", value: 30 }],
  [
    "The system analyses the canopy, pinpointing specific levels of nitrogen.",
    "Shifting conservation from reactive rescue missions to proactive management.",
    "Researchers use sensors... focusing on the spectral signatures."
  ],
  [
    { question: "Combine: 'They analyzed the data. They found a pattern.'", options: ["Analyzing the data, they found a pattern.", "Analyzed the data, they found a pattern.", "Analyze the data, they found a pattern."], correct: 0 },
    { question: "Function of 'pinpointing' in the text?", options: ["Past action", "Result/Elaboration", "Future plan"], correct: 1 },
    { question: "Select the participle: 'The drone flew over, scanning the trees.'", options: ["flew", "scanning", "trees"], correct: 1 }
  ],
  [
    { question: "Rewrite: 'The fire spread and destroyed the habitat.' using -ing.", options: ["The fire spread, destroying the habitat.", "The fire spreading, destroyed the habitat.", "Spreading the fire, destroyed the habitat."], correct: 0 },
    { question: "Is this correct? 'Walking to the lab, the samples were dropped.'", options: ["Yes", "No (Dangling modifier)"], correct: 1 },
    { question: "'Feeding this data' acts as:", options: ["A noun phrase", "A verb", "An adjective"], correct: 0 }
  ],
  [
    { sentence: "The machine processes data, _____ (predict) future outcomes.", answer: "predicting" },
    { sentence: "_____ (focus) on light wavelengths, the camera sees more.", answer: "Focusing" },
    { sentence: "They released the koalas, _____ (hope) for their survival.", answer: "hoping" }
  ],
  [
    "Explain how the technology in the passage works using cause and effect language.",
    "Discuss the benefits of 'proactive' vs 'reactive' conservation.",
    "Describe a time you used technology to solve a difficult problem."
  ]
);

const PASSAGE_3_PRACTICE = createPracticeModule(
  "Passive Voice in Academic Writing",
  "Used to emphasize the action or the object rather than the agent. Essential for objective scientific reporting.",
  "Be + Past Participle (+ by agent).",
  "Stress on the main verb participle. 'Was/Were' are often weak.",
  [{ label: "Active", value: 20 }, { label: "Passive", value: 80 }, { label: "Stative", value: 0 }],
  [
    "The 'frustrated magnet' problem has been bedevilled...",
    "The resulting state is a chaotic web...",
    "This acceleration is believed to be driven by chronic inflammation."
  ],
  [
    { question: "Change to Passive: 'AI solved the problem.'", options: ["The problem was solved by AI.", "The problem solved AI.", "AI was solved by the problem."], correct: 0 },
    { question: "Why is passive used here?", options: ["To hide the author", "To focus on the discovery", "To sound fancy"], correct: 1 },
    { question: "Identify: 'The code was cracked.'", options: ["Active", "Passive", "Future"], correct: 1 }
  ],
  [
    { question: "Active or Passive? 'Researchers fed an AI model...'", options: ["Active", "Passive"], correct: 0 },
    { question: "Complete: 'It _____ (believe) that...'", options: ["is believed", "believes", "believing"], correct: 0 },
    { question: "Which tone does passive create?", options: ["Personal", "Objective", "Aggressive"], correct: 1 }
  ],
  [
    { sentence: "The experiment _____ (conduct) yesterday.", answer: "was conducted" },
    { sentence: "The results _____ (publish) in the next issue.", answer: "will be published" },
    { sentence: "It _____ (know) as the 'frustrated magnet' problem.", answer: "is known" }
  ],
  [
    "Summarize the breakthrough at Brookhaven using the passive voice where appropriate.",
    "Do you think AI should be considered a 'collaborator'? Why?",
    "Describe a scientific process (e.g., the water cycle) using passive structures."
  ]
);

export const PASSAGES: Passage[] = [
  {
    id: 1,
    title: "Passage 1: Paleoanthropology",
    headline: "The Discovery of Homo juluensis",
    practiceModule: PASSAGE_1_PRACTICE,
    content: `The human family tree has grown yet another branch, complicating the already tangled narrative of our origins. Researchers working at the Xujiayao site in northern China have identified a distinct hominin species, tentatively named Homo juluensis, which inhabited the region approximately 200,000 years ago. Unlike the more gracile Homo sapiens or the robust Neanderthals of Europe, this species exhibits a "mosaic" of morphological features that defies easy categorization. The most striking characteristic is the cranium size: with a capacity ranging between 103 and 109 cubic inches, it significantly exceeds that of contemporary Neanderthals (88 cubic inches) and modern humans (82 cubic inches).

This gigantism in cranial capacity is paired with unusually large dentition and a broad, low braincase, suggesting a distinct evolutionary path isolated from the genetic exchange sweeping across Eurasia at the time. The study challenges the "Out of Africa" model's simplicity, implying that East Asia was not merely a passive recipient of migrating populations but a dynamic crucible of independent evolution. Critics, however, urge caution, noting that without full genomic sequencing, it remains possible that H. juluensis is a regional variant of the Denisovans rather than a completely novel species.`,
    questions: [
      {
        id: 1,
        text: "What is the most distinguishing feature of *Homo juluensis* mentioned in the text?",
        options: [
          { label: "A", text: "Its incredibly small stature compared to modern humans." },
          { label: "B", text: "The absence of wisdom teeth in adult specimens." },
          { label: "C", text: "A cranial capacity larger than that of both Neanderthals and modern humans." },
          { label: "D", text: "Its exclusive diet of large megafauna." }
        ],
        correctAnswer: "C"
      },
      {
        id: 2,
        text: "The writer uses the term \"mosaic\" to describe the species because:",
        options: [
          { label: "A", text: "The fossils were found in a fragmented condition." },
          { label: "B", text: "The species displays a mix of features that do not fit a single existing category." },
          { label: "C", text: "The bones were discovered alongside ancient artistic tiles." },
          { label: "D", text: "The species is a genetic hybrid of three different hominins." }
        ],
        correctAnswer: "B"
      },
      {
        id: 3,
        text: "What does the discovery suggest about the \"Out of Africa\" model?",
        options: [
          { label: "A", text: "It remains the only valid explanation for human evolution." },
          { label: "B", text: "It is too simple to account for the independent evolution occurring in East Asia." },
          { label: "C", text: "It correctly predicted the presence of *Homo juluensis* in China." },
          { label: "D", text: "It should be completely discarded in favour of a multiregional theory." }
        ],
        correctAnswer: "B"
      },
      {
        id: 4,
        text: "Why do some critics advise caution regarding the classification of this new species?",
        options: [
          { label: "A", text: "The dating of the fossils may be inaccurate by thousands of years." },
          { label: "B", text: "The fossils might actually be a variant of the Denisovans." },
          { label: "C", text: "The researchers have not yet published their findings in a peer-reviewed journal." },
          { label: "D", text: "The cranial measurements were taken using outdated equipment." }
        ],
        correctAnswer: "B"
      },
      {
        id: 5,
        text: "According to the text, *Homo juluensis* lived in northern China approximately:",
        options: [
          { label: "A", text: "50,000 years ago." },
          { label: "B", text: "100,000 years ago." },
          { label: "C", text: "200,000 years ago." },
          { label: "D", text: "350,000 years ago." }
        ],
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 2,
    title: "Passage 2: Environmental Technology",
    headline: "Hyperspectral Imaging and Koala Conservation",
    practiceModule: PASSAGE_2_PRACTICE,
    content: `In the eucalyptus forests of Australia, conservationists are deploying a new weapon in the fight to save the koala: hyperspectral airborne imagery. Known as "Project Airbear," this initiative moves beyond simple visual surveys, which are often hampered by the koala's cryptic nature and dense canopy cover. Instead, researchers use sensors that detect light wavelengths invisible to the human eye, specifically focusing on the spectral signatures of tree leaves. The technology does not look for the animals themselves, but rather for "high-quality" habitat.

The system analyses the chemical composition of the canopy, pinpointing specific levels of nitrogen and water content—key indicators of the nutritious leaves koalas prefer. By feeding this data into machine learning models, the team can predict with high accuracy where koala populations are likely to thrive. This "landscape-scale" approach allows land managers to identify prime release sites for rehabilitated koalas and prioritize areas for protection, shifting conservation from reactive rescue missions to proactive habitat management.`,
    questions: [
      {
        id: 6,
        text: "What is the primary limitation of traditional visual surveys mentioned in the text?",
        options: [
          { label: "A", text: "They are too expensive to conduct over large areas." },
          { label: "B", text: "Koalas are difficult to spot due to their secretive nature and dense leaves." },
          { label: "C", text: "They require large teams of volunteers which are hard to recruit." },
          { label: "D", text: "They damage the trees that koalas rely on for food." }
        ],
        correctAnswer: "B"
      },
      {
        id: 7,
        text: "\"Project Airbear\" works by detecting:",
        options: [
          { label: "A", text: "The body heat of koalas hiding in the trees." },
          { label: "B", text: "The movement of branches caused by koalas." },
          { label: "C", text: "The spectral signatures of nitrogen and water in tree leaves." },
          { label: "D", text: "The specific sound frequencies of koala mating calls." }
        ],
        correctAnswer: "C"
      },
      {
        id: 8,
        text: "How does machine learning contribute to this project?",
        options: [
          { label: "A", text: "It pilots the drones that capture the images." },
          { label: "B", text: "It predicts which areas contain the most nutritious habitat." },
          { label: "C", text: "It identifies individual koalas by their facial features." },
          { label: "D", text: "It calculates the fastest route for rescue teams to reach injured animals." }
        ],
        correctAnswer: "B"
      },
      {
        id: 9,
        text: "The text implies that this technology marks a shift towards:",
        options: [
          { label: "A", text: "Breeding koalas in captivity rather than the wild." },
          { label: "B", text: "Reactive rescue missions after bushfires." },
          { label: "C", text: "Proactive management of habitat quality." },
          { label: "D", text: "Relying solely on satellite data rather than fieldwork." }
        ],
        correctAnswer: "C"
      },
      {
        id: 10,
        text: "Which chemical element is specifically mentioned as a key indicator of leaf quality?",
        options: [
          { label: "A", text: "Carbon." },
          { label: "B", text: "Phosphorus." },
          { label: "C", text: "Nitrogen." },
          { label: "D", text: "Potassium." }
        ],
        correctAnswer: "C"
      }
    ]
  },
  {
    id: 3,
    title: "Passage 3: Physics & AI",
    headline: "Solving the 'Frustrated Magnet' Problem",
    practiceModule: PASSAGE_3_PRACTICE,
    content: `For decades, the "frustrated magnet" problem has bedevilled theoretical physicists. In these complex materials, electron spins cannot "agree" on an orientation because competing magnetic forces pull them in opposing directions. The resulting state is a chaotic, infinite web of possibilities that defies standard computational modeling. However, a recent breakthrough at Brookhaven National Laboratory has cracked the code using a surprising partner: artificial intelligence.

During a "Science Jam" event, researchers fed an AI model the parameters of the "1D frustrated Potts model," a theoretical system with infinite spin orientations. Unlike traditional algorithms which brute-force a solution, the AI derived a new, elegant mathematical equation that generalizes the behavior of these magnets. The physicist leading the study noted that the AI did not merely regurgitate training data; it produced a novel mathematical proof equivalent to, yet more refined than, human derivation. This marks a paradigm shift where AI transitions from a data-processing tool to a theoretical collaborator capable of high-level abstract reasoning.`,
    questions: [
      {
        id: 11,
        text: "What characterizes a \"frustrated magnet\"?",
        options: [
          { label: "A", text: "It loses its magnetic properties at high temperatures." },
          { label: "B", text: "Its electron spins are pulled in opposing directions, preventing a settled orientation." },
          { label: "C", text: "It is a magnet that fails to attract iron due to rust." },
          { label: "D", text: "It generates infinite energy when placed in a vacuum." }
        ],
        correctAnswer: "B"
      },
      {
        id: 12,
        text: "Why have traditional computational methods failed to solve this problem?",
        options: [
          { label: "A", text: "The computers used were not powerful enough." },
          { label: "B", text: "The problem involves infinite possibilities that cannot be brute-forced." },
          { label: "C", text: "The data was corrupted by background radiation." },
          { label: "D", text: "Physicists refused to use digital tools for theoretical work." }
        ],
        correctAnswer: "B"
      },
      {
        id: 13,
        text: "What was the output of the AI model in the Brookhaven study?",
        options: [
          { label: "A", text: "A visual simulation of the electron spins." },
          { label: "B", text: "A list of all possible electron orientations." },
          { label: "C", text: "A novel mathematical equation generalizing the magnet's behavior." },
          { label: "D", text: "A prediction of when the magnet would demagnetize." }
        ],
        correctAnswer: "C"
      },
      {
        id: 14,
        text: "The writer suggests this breakthrough is significant because:",
        options: [
          { label: "A", text: "It proves that AI can replace human physicists entirely." },
          { label: "B", text: "It shows AI acting as a theoretical collaborator rather than just a tool." },
          { label: "C", text: "It allows for the production of cheaper refrigerator magnets." },
          { label: "D", text: "It solves the problem of nuclear fusion." }
        ],
        correctAnswer: "B"
      },
      {
        id: 15,
        text: "The \"Potts model\" mentioned in the text is described as:",
        options: [
          { label: "A", text: "A system with infinite spin orientations." },
          { label: "B", text: "A physical prototype built in the laboratory." },
          { label: "C", text: "A failed theory from the 19th century." },
          { label: "D", text: "A software program used to train the AI." }
        ],
        correctAnswer: "A"
      }
    ]
  },
  {
    id: 4,
    title: "Passage 4: Neuroscience",
    headline: "Obesity Accelerates Alzheimer's Biomarkers",
    content: `The link between metabolic health and neurodegeneration has been strengthened by a disturbing new study. Researchers analyzing long-term plasma data have found that obesity does not merely correlate with Alzheimer's disease; it actively accelerates the accumulation of its pathological hallmarks. The study focused on specific blood biomarkers—proteins that signal the breakdown of neurons and the buildup of amyloid plaques.

The results showed that in obese individuals, these biomarkers rise at a rate significantly faster than in their lean counterparts, effectively "aging" the brain by several years. This acceleration is believed to be driven by chronic systemic inflammation, which degrades the blood-brain barrier and allows harmful molecules to infiltrate neural tissue. The findings suggest that weight management interventions in midlife could be a critical, yet overlooked, strategy for delaying the onset of dementia in later years.`,
    questions: [
      {
        id: 16,
        text: "The study found that obesity affects Alzheimer's biomarkers by:",
        options: [
          { label: "A", text: "Stopping them from forming entirely." },
          { label: "B", text: "Accelerating the rate at which they accumulate." },
          { label: "C", text: "Changing their chemical composition into harmless proteins." },
          { label: "D", text: "Hiding them from standard blood tests." }
        ],
        correctAnswer: "B"
      },
      {
        id: 17,
        text: "What mechanism is believed to drive this acceleration?",
        options: [
          { label: "A", text: "A lack of physical exercise." },
          { label: "B", text: "High sugar consumption affecting insulin levels." },
          { label: "C", text: "Chronic systemic inflammation degrading the blood-brain barrier." },
          { label: "D", text: "The excessive production of dopamine in obese individuals." }
        ],
        correctAnswer: "C"
      },
      {
        id: 18,
        text: "The phrase \"aging the brain\" in the text refers to:",
        options: [
          { label: "A", text: "The biological age of the brain increasing faster than chronological age." },
          { label: "B", text: "The patient feeling mentally tired more often." },
          { label: "C", text: "The physical shrinkage of the brain's volume." },
          { label: "D", text: "The loss of childhood memories." }
        ],
        correctAnswer: "A"
      },
      {
        id: 19,
        text: "What implication does the study have for preventative medicine?",
        options: [
          { label: "A", text: "All individuals over 50 should take anti-inflammatory drugs." },
          { label: "B", text: "Weight management in midlife is crucial for delaying dementia." },
          { label: "C", text: "Surgery is the only effective option for preventing Alzheimer's." },
          { label: "D", text: "Alzheimer's is entirely genetic and cannot be prevented." }
        ],
        correctAnswer: "B"
      },
      {
        id: 20,
        text: "The biomarkers analyzed in the study signal:",
        options: [
          { label: "A", text: "The level of cholesterol in the blood." },
          { label: "B", text: "The breakdown of neurons and buildup of plaques." },
          { label: "C", text: "The amount of fat stored in the body." },
          { label: "D", text: "The efficiency of the heart." }
        ],
        correctAnswer: "B"
      }
    ]
  },
  {
    id: 5,
    title: "Passage 5: Nanotechnology",
    headline: "The 'Impossible' LED",
    content: `Conventional wisdom in photonics holds that insulating nanoparticles cannot conduct electricity well enough to generate light. However, a team of scientists has shattered this rule by creating a hybrid "antenna" system. They coated insulating nanoparticles with organic molecules that function like tiny antennas, capable of capturing and focusing electrical energy.

When a current is applied, these organic molecules funnel energy into the nanoparticle, causing it to emit an extremely pure form of near-infrared light. This breakthrough bypasses the need for expensive semiconductors usually required for such emission. The resulting light is ideal for medical diagnostics, as near-infrared waves can penetrate deep into biological tissue without damaging it. This "impossible" LED represents a leap in materials science, turning inert insulators into active photonic devices.`,
    questions: [
      {
        id: 21,
        text: "Why was this LED previously considered \"impossible\"?",
        options: [
          { label: "A", text: "Because organic molecules usually destroy nanoparticles." },
          { label: "B", text: "Because insulating nanoparticles typically cannot conduct electricity to generate light." },
          { label: "C", text: "Because the light produced was too dim to be useful." },
          { label: "D", text: "Because the materials required were too rare to mine." }
        ],
        correctAnswer: "B"
      },
      {
        id: 22,
        text: "What role do the organic molecules play in this system?",
        options: [
          { label: "A", text: "They act as insulation to prevent overheating." },
          { label: "B", text: "They change the color of the light to blue." },
          { label: "C", text: "They function as antennas to focus electrical energy." },
          { label: "D", text: "They harden the nanoparticle to make it durable." }
        ],
        correctAnswer: "C"
      },
      {
        id: 23,
        text: "The light emitted by this new device is described as:",
        options: [
          { label: "A", text: "Ultra-violet and harmful to the eyes." },
          { label: "B", text: "Pure near-infrared light." },
          { label: "C", text: "Visible white light similar to the sun." },
          { label: "D", text: "Fluorescent green." }
        ],
        correctAnswer: "B"
      },
      {
        id: 24,
        text: "A key advantage of this technology mentioned in the text is:",
        options: [
          { label: "A", text: "It does not require expensive semiconductors." },
          { label: "B", text: "It can run on solar power alone." },
          { label: "C", text: "It is biodegradable." },
          { label: "D", text: "It produces heat that can warm a room." }
        ],
        correctAnswer: "A"
      },
      {
        id: 25,
        text: "Why is near-infrared light useful for medical diagnostics?",
        options: [
          { label: "A", text: "It kills bacteria on contact." },
          { label: "B", text: "It can penetrate deep into tissue without causing damage." },
          { label: "C", text: "It is easily visible to the naked eye." },
          { label: "D", text: "It helps bones heal faster." }
        ],
        correctAnswer: "B"
      }
    ]
  }
];
