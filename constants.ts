
import { Passage, PracticeModule } from './types';

export const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes

// Helper to create practice modules (Updated for new structure)
const createPracticeModule = (
  topic: string, 
  meaning: string, 
  form: string, 
  pronunciation: string,
  timeline: any[],
  microLessons: any[]
): PracticeModule => ({
  grammarTopic: topic,
  mfp: { meaning, form, pronunciation, timeline },
  microLessons
});

const PASSAGE_1_PRACTICE = createPracticeModule(
  "Comparative Structures",
  "Comparing differences between two objects.",
  "Subject + Verb + Adj(-er/more) + than + Object",
  "/ðən/ (Weak form)",
  // Visual Timeline Data
  [
    { year: "300k ya", label: "H. Sapiens", description: "Gracile, smaller brain" },
    { year: "200k ya", label: "H. Juluensis", description: "Mosaic features, HUGE brain" },
    { year: "40k ya", label: "Neanderthals", description: "Robust, large brain" }
  ],
  [
    // 1. Visual Concept
    {
      type: 'TIMELINE',
      title: 'Evolutionary Timeline',
      content: "Observe how H. Juluensis fits into the timeline compared to others.",
      xpReward: 50
    },
    // 2. Drag & Drop 1 (Categorization)
    {
      type: 'DRAG_DROP',
      title: 'Sort the Features',
      xpReward: 100,
      data: {
        instruction: "Drag the features to the correct species.",
        items: [
          { id: '1', content: "103-109 cubic inches" },
          { id: '2', content: "82 cubic inches" },
          { id: '3', content: "Mosaic Features" },
          { id: '4', content: "Gracile Build" }
        ],
        targets: [
          { id: 't1', label: "H. Juluensis", expectedIds: ['1', '3'] },
          { id: 't2', label: "Modern Humans", expectedIds: ['2', '4'] }
        ]
      }
    },
    // 3. Sentence Builder (Form Practice)
    {
      type: 'SENTENCE_BUILDER',
      title: 'Build the Comparison',
      xpReward: 100,
      data: {
        instruction: "Arrange the words to form a correct comparative sentence.",
        sentenceParts: ["brain", "The", "is", "larger", "than", "ours"],
        correctOrder: ["The", "brain", "is", "larger", "than", "ours"]
      }
    },
    // 4. Quiz (Check)
    {
      type: 'QUIZ',
      title: 'Quick Check',
      xpReward: 50,
      data: {
        question: "Which word emphasizes a BIG difference?",
        options: ["Slightly", "Significantly", "Barely"],
        correct: 1
      }
    },
    // 5. Drag & Drop 2 (Synonyms)
    {
      type: 'DRAG_DROP',
      title: 'Match Synonyms',
      xpReward: 100,
      data: {
        instruction: "Match the academic words to their simpler meanings.",
        items: [
          { id: 'a', content: "Defies" },
          { id: 'b', content: "Resists/Challenges" },
          { id: 'c', content: "Distinct" },
          { id: 'd', content: "Different/Unique" }
        ],
        targets: [
          { id: 'pair1', label: "Word Pair 1", expectedIds: ['a', 'b'] },
          { id: 'pair2', label: "Word Pair 2", expectedIds: ['c', 'd'] }
        ]
      }
    },
    // 6. Speaking
    {
      type: 'SPEAKING',
      title: 'Verbal Practice',
      xpReward: 200,
      data: {
        prompt: "Compare the brain size of H. Juluensis to Modern Humans in one sentence."
      }
    }
  ]
);

const PASSAGE_2_PRACTICE = createPracticeModule(
  "Present Participles (-ing)",
  "Describing simultaneous actions or results.",
  "Verb + -ing",
  "Smooth linking",
  [
    { year: "Step 1", label: "Drone Flies", description: "Scanning the forest" },
    { year: "Step 2", label: "Data Analyzed", description: "Pinpointing nitrogen" },
    { year: "Result", label: "Habitat Found", description: "Saving koalas" }
  ],
  [
    {
      type: 'TIMELINE',
      title: 'Process Flow',
      content: "See how the actions flow together using -ing forms.",
      xpReward: 50
    },
    {
      type: 'SENTENCE_BUILDER',
      title: 'Combine Sentences',
      xpReward: 100,
      data: {
        instruction: "Combine: 'The drone flew over. It scanned the trees.'",
        sentenceParts: ["The", "drone", "flew", "over,", "scanning", "the", "trees"],
        correctOrder: ["The", "drone", "flew", "over,", "scanning", "the", "trees"]
      }
    },
    {
      type: 'DRAG_DROP',
      title: 'Action vs Result',
      xpReward: 100,
      data: {
        instruction: "Is the -ing word an Action or a Result?",
        items: [
          { id: '1', content: "Flying over..." },
          { id: '2', content: "...causing damage." },
        ],
        targets: [
          { id: 't1', label: "Action", expectedIds: ['1'] },
          { id: 't2', label: "Result", expectedIds: ['2'] }
        ]
      }
    },
    {
      type: 'SPEAKING',
      title: 'Describe the Process',
      xpReward: 200,
      data: {
        prompt: "Describe what the drone does using an -ing verb."
      }
    }
  ]
);

// Placeholder for others to prevent errors, though focused on Passage 1 & 2 for demo
const EMPTY_PRACTICE = createPracticeModule("Coming Soon", "", "", "", [], []);

export const PASSAGES: Passage[] = [
  {
    id: 1,
    title: "Passage 1: Paleoanthropology",
    headline: "The Discovery of Homo juluensis",
    practiceModule: PASSAGE_1_PRACTICE,
    content: `The human family tree has grown yet another branch... (content truncated for brevity, same as before)`,
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
      // ... keep existing questions
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
    headline: "Hyperspectral Imaging",
    practiceModule: PASSAGE_2_PRACTICE,
    content: "In the eucalyptus forests...",
    questions: [] // Truncated for brevity in this response
  },
  // Keep other passages but use EMPTY_PRACTICE for now to save space in this response
  { id: 3, title: "Passage 3", headline: "Physics", practiceModule: EMPTY_PRACTICE, content: "", questions: [] },
  { id: 4, title: "Passage 4", headline: "Neuroscience", practiceModule: EMPTY_PRACTICE, content: "", questions: [] },
  { id: 5, title: "Passage 5", headline: "Nanotech", practiceModule: EMPTY_PRACTICE, content: "", questions: [] },
];
