
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { PracticeModule, DragDropItem } from '../types';
import { 
  ChevronRight, Lock, Trophy, Star, Sparkles, 
  Mic, Volume2, CheckCircle2, AlertCircle, RefreshCcw, ArrowRight, Flame, Brain, GripVertical
} from 'lucide-react';
import SpeakingRecorder from './SpeakingRecorder';

interface LanguagePracticeViewerProps {
  module: PracticeModule;
}

// --- SOUND UTILITY (Mocked) ---
const useAudio = () => {
  const playSound = (type: 'success' | 'error' | 'unlock' | 'levelUp') => {
    // console.log(`Audio: ${type}`); // Placeholder
  };
  return { playSound };
};

const LanguagePracticeViewer: React.FC<LanguagePracticeViewerProps> = ({ module }) => {
  // --- GLOBAL STATE ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedIndex, setUnlockedIndex] = useState(0); // Checkpoint system
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { playSound } = useAudio();
  const [feedback, setFeedback] = useState<'idle' | 'success' | 'error'>('idle');

  // --- TASK SPECIFIC STATE ---
  // Drag & Drop
  const [bankItems, setBankItems] = useState<DragDropItem[]>([]);
  const [buckets, setBuckets] = useState<Record<string, DragDropItem[]>>({});
  
  // Sentence Builder
  const [sentenceBank, setSentenceBank] = useState<string[]>([]); // Words available
  const [builtSentence, setBuiltSentence] = useState<string[]>([]); // Words placed

  // Quiz
  const [quizSelection, setQuizSelection] = useState<number | null>(null);

  // Load lesson data when index changes
  useEffect(() => {
    const lesson = module.microLessons[currentIndex];
    setFeedback('idle');
    
    if (lesson?.type === 'DRAG_DROP' && lesson.data) {
       setBankItems([...lesson.data.items].sort(() => Math.random() - 0.5));
       const initialBuckets: Record<string, DragDropItem[]> = {};
       lesson.data.targets.forEach((t: any) => initialBuckets[t.id] = []);
       setBuckets(initialBuckets);
    }
    
    if (lesson?.type === 'SENTENCE_BUILDER' && lesson.data) {
      setSentenceBank([...lesson.data.sentenceParts].sort(() => Math.random() - 0.5));
      setBuiltSentence([]);
    }
    
    if (lesson?.type === 'QUIZ') {
      setQuizSelection(null);
    }
  }, [currentIndex, module]);

  const currentLesson = module.microLessons[currentIndex];
  const isCompleted = unlockedIndex > currentIndex;

  // --- HANDLERS ---

  const handleCheck = () => {
    let isCorrect = false;

    if (currentLesson.type === 'CONCEPT' || currentLesson.type === 'TIMELINE' || currentLesson.type === 'SPEAKING') {
      isCorrect = true; // Passive consumption or self-graded
    } 
    else if (currentLesson.type === 'QUIZ') {
      isCorrect = quizSelection === currentLesson.data.correct;
    }
    else if (currentLesson.type === 'SENTENCE_BUILDER') {
      const currentString = builtSentence.join(' ');
      const correctString = currentLesson.data.correctOrder.join(' ');
      isCorrect = currentString === correctString;
    }
    else if (currentLesson.type === 'DRAG_DROP') {
      // Check if all items are in correct buckets
      // simplified: check if buckets contain the expected IDs
      let allCorrect = true;
      currentLesson.data.targets.forEach((target: any) => {
        const bucketItems = buckets[target.id] || [];
        // Check if every expected ID is in this bucket
        const bucketIds = bucketItems.map(i => i.id);
        const hasAllExpected = target.expectedIds.every((id: string) => bucketIds.includes(id));
        // Check if bucket has extras
        if (!hasAllExpected || bucketItems.length !== target.expectedIds.length) {
          allCorrect = false;
        }
      });
      isCorrect = allCorrect;
    }

    if (isCorrect) {
      setFeedback('success');
      playSound('success');
      if (unlockedIndex <= currentIndex) {
        setUnlockedIndex(prev => prev + 1);
        setXp(prev => prev + currentLesson.xpReward);
        setStreak(prev => prev + 1);
      }
    } else {
      setFeedback('error');
      playSound('error');
      setStreak(0); // Harsh gamification!
    }
  };

  const handleNext = () => {
    if (currentIndex < module.microLessons.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowLevelUp(true);
      playSound('levelUp');
    }
  };

  // --- DRAG & DROP LOGIC (Click-to-move for accessibility/ease) ---
  const handleItemClick = (item: DragDropItem, source: 'bank' | string) => {
    if (isCompleted) return; 

    if (source === 'bank') {
      // Move to first empty bucket or cycle? Let's just move to first bucket for simplicity in this UI
      // Or better: selected bucket logic. 
      // Simplest for this demo: Round robin or just first bucket.
      const targetIds = currentLesson.data.targets.map((t: any) => t.id);
      const targetId = targetIds[0]; // Default to first
      
      // Better: Open a mini menu or just cycle through buckets? 
      // Let's do Cycle: Bank -> Bucket 1 -> Bucket 2 -> Bank
      
      const nextBucketId = targetIds[0];
      setBankItems(prev => prev.filter(i => i.id !== item.id));
      setBuckets(prev => ({...prev, [nextBucketId]: [...(prev[nextBucketId] || []), item]}));
    } else {
      // Source is a bucket ID
      // Move to next bucket or back to bank?
      const targetIds = currentLesson.data.targets.map((t: any) => t.id);
      const currentBucketIndex = targetIds.indexOf(source);
      
      if (currentBucketIndex < targetIds.length - 1) {
        // Move to next bucket
        const nextBucket = targetIds[currentBucketIndex + 1];
        setBuckets(prev => ({
          ...prev, 
          [source]: prev[source].filter(i => i.id !== item.id),
          [nextBucket]: [...(prev[nextBucket] || []), item]
        }));
      } else {
        // Move back to bank
        setBuckets(prev => ({
          ...prev, 
          [source]: prev[source].filter(i => i.id !== item.id)
        }));
        setBankItems(prev => [...prev, item]);
      }
    }
  };

  // --- RENDERERS ---

  const renderTimeline = () => (
    <div className="w-full overflow-x-auto pb-8 pt-4 px-4 snap-x">
      <div className="flex items-center gap-4 min-w-max">
        {module.mfp.timeline?.map((event, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className="relative snap-center"
          >
            {/* Connector Line */}
            {i !== module.mfp.timeline!.length - 1 && (
              <div className="absolute top-8 left-1/2 w-full h-1 bg-gray-200 z-0" />
            )}
            
            <div className="w-64 p-6 bg-white rounded-2xl shadow-lg border-2 border-indigo-50 relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mb-4 shadow-md text-xs">
                {event.year}
              </div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">{event.label}</h3>
              <p className="text-sm text-gray-500">{event.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDragDrop = () => (
    <LayoutGroup>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentLesson.data.targets.map((target: any) => (
          <div key={target.id} className="bg-indigo-50 rounded-2xl p-4 min-h-[150px] border-2 border-indigo-200 border-dashed">
             <h4 className="text-center font-bold text-indigo-900 mb-4 uppercase text-sm tracking-wider">{target.label}</h4>
             <div className="flex flex-col gap-2">
                {buckets[target.id]?.map(item => (
                  <motion.button
                    layoutId={item.id}
                    key={item.id}
                    onClick={() => handleItemClick(item, target.id)}
                    className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100 text-sm font-bold text-indigo-700 hover:bg-red-50"
                  >
                    {item.content}
                  </motion.button>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 rounded-2xl p-6 min-h-[100px]">
        <h4 className="text-xs font-bold text-gray-400 uppercase mb-4">Item Bank (Tap to Move)</h4>
        <div className="flex flex-wrap gap-2">
          {bankItems.map(item => (
            <motion.button
              layoutId={item.id}
              key={item.id}
              onClick={() => handleItemClick(item, 'bank')}
              className="bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200 font-medium text-gray-700 hover:scale-105 active:scale-95 transition-transform"
            >
              {item.content}
            </motion.button>
          ))}
        </div>
      </div>
    </LayoutGroup>
  );

  const renderSentenceBuilder = () => (
    <div className="flex flex-col gap-8">
      {/* Target Area */}
      <div className="bg-white p-6 rounded-2xl border-2 border-blue-100 min-h-[100px] flex flex-wrap gap-2 items-center justify-center shadow-inner">
         {builtSentence.length === 0 && <span className="text-gray-300 italic">Tap words below to build sentence...</span>}
         <LayoutGroup>
           {builtSentence.map((word, i) => (
             <motion.button
                layoutId={`word-${word}-${i}`} // Unique ID issue if duplicate words, simple fix implies unique words for demo
                key={`${word}-${i}`} 
                onClick={() => {
                  if (isCompleted) return;
                  const newBuilt = [...builtSentence];
                  newBuilt.splice(i, 1);
                  setBuiltSentence(newBuilt);
                  setSentenceBank(prev => [...prev, word]);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-red-500 transition-colors"
             >
               {word}
             </motion.button>
           ))}
         </LayoutGroup>
      </div>

      {/* Source Bank */}
      <div className="flex flex-wrap gap-3 justify-center">
         <LayoutGroup>
            {sentenceBank.map((word, i) => (
              <motion.button
                layoutId={`word-${word}-bank-${i}`} 
                key={`${word}-bank-${i}`}
                onClick={() => {
                  if (isCompleted) return;
                  setSentenceBank(prev => {
                    const next = [...prev];
                    next.splice(i, 1);
                    return next;
                  });
                  setBuiltSentence(prev => [...prev, word]);
                }}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium shadow-sm hover:scale-110 transition-transform"
              >
                {word}
              </motion.button>
            ))}
         </LayoutGroup>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col font-sans overflow-hidden relative">
      
      {/* --- HEADER: GAMIFICATION --- */}
      <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-20 shrink-0">
        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><RefreshCcw size={20} /></button>
        
        {/* Progress Bar */}
        <div className="flex-1 mx-8 h-3 bg-gray-100 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / module.microLessons.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-orange-500 font-black">
            <Flame className="fill-current" size={20} />
            <span>{streak}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-black">
            <Star className="fill-current" size={20} />
            <span>{xp}</span>
          </div>
        </div>
      </div>

      {/* --- MAIN STAGE --- */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="w-full max-w-2xl"
          >
             {/* Dynamic Content Rendering */}
             <div className="text-center mb-8">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                   {currentLesson.type === 'TIMELINE' && <ArrowRight size={16} />}
                   {currentLesson.type === 'DRAG_DROP' && <GripVertical size={16} />}
                   {currentLesson.type === 'QUIZ' && <Brain size={16} />}
                   {currentLesson.type}
                </h2>
                <h1 className="text-3xl font-black text-gray-800">{currentLesson.title}</h1>
                {currentLesson.content && <p className="mt-4 text-xl text-gray-600 leading-relaxed">{currentLesson.content}</p>}
                {currentLesson.data?.instruction && <p className="mt-4 text-lg text-gray-500">{currentLesson.data.instruction}</p>}
             </div>

             {/* Interactive Area */}
             <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-sm border border-white">
                {currentLesson.type === 'TIMELINE' && renderTimeline()}
                {currentLesson.type === 'DRAG_DROP' && renderDragDrop()}
                {currentLesson.type === 'SENTENCE_BUILDER' && renderSentenceBuilder()}
                {currentLesson.type === 'SPEAKING' && (
                   <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold text-gray-900 mb-6">"{currentLesson.data.prompt}"</div>
                      <div className="transform scale-125"><SpeakingRecorder /></div>
                   </div>
                )}
                {currentLesson.type === 'QUIZ' && (
                  <div className="grid gap-3">
                    {currentLesson.data.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        disabled={isCompleted} // Lock if already done
                        onClick={() => setQuizSelection(i)}
                        className={`p-4 rounded-xl font-bold text-left border-2 transition-all ${
                          quizSelection === i 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        } ${feedback === 'success' && i === currentLesson.data.correct ? 'border-green-500 bg-green-100' : ''}
                        ${feedback === 'error' && i === quizSelection ? 'border-red-500 bg-red-100' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
             </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- FOOTER CONTROL --- */}
      <div className={`h-24 border-t px-6 flex items-center justify-between shrink-0 transition-colors duration-300
         ${feedback === 'success' ? 'bg-green-100 border-green-200' : 
           feedback === 'error' ? 'bg-red-100 border-red-200' : 'bg-white border-gray-200'}`
      }>
         
         {/* Feedback Message */}
         <div className="flex items-center gap-4">
            {feedback === 'success' && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-3 text-green-700 font-black text-xl">
                 <div className="p-2 bg-white rounded-full"><CheckCircle2 size={32} /></div>
                 <span>Excellent!</span>
               </motion.div>
            )}
            {feedback === 'error' && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-3 text-red-700 font-black text-xl">
                 <div className="p-2 bg-white rounded-full"><AlertCircle size={32} /></div>
                 <span>Try Again</span>
               </motion.div>
            )}
         </div>

         {/* Action Button */}
         {isCompleted ? (
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleNext}
             className="px-8 py-3 bg-green-600 text-white font-bold rounded-2xl shadow-[0_4px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
           >
             Continue <ChevronRight size={24} />
           </motion.button>
         ) : (
           <motion.button
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={handleCheck}
             className={`px-8 py-3 font-bold rounded-2xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2
               ${feedback === 'idle' ? 'bg-gray-900 text-white' : 
                 feedback === 'error' ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
             `}
           >
             {currentLesson.type === 'CONCEPT' || currentLesson.type === 'TIMELINE' ? 'Got it' : 'Check'}
           </motion.button>
         )}
      </div>

      {/* --- LEVEL UP OVERLAY --- */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center"
          >
             <motion.div 
               initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-3xl p-12 text-center max-w-sm w-full mx-4"
             >
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative">
                  <Trophy size={64} className="text-yellow-700" />
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-white/50 rounded-full" 
                  />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Lesson Complete!</h2>
                <div className="flex justify-center gap-4 mb-8">
                   <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                      <Star size={20} className="fill-current" /> +{xp} XP
                   </div>
                   <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                      <Flame size={20} className="fill-current" /> {streak} Streak
                   </div>
                </div>
                <button 
                  onClick={() => setShowLevelUp(false)} // In real app, navigate back
                  className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:scale-105 transition-transform"
                >
                  Return to Menu
                </button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LanguagePracticeViewer;
    