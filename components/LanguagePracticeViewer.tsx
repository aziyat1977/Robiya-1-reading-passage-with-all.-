
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeModule } from '../types';
import { 
  ChevronRight, ChevronLeft, CheckCircle2, XCircle, 
  Lightbulb, Sparkles, BrainCircuit, Activity, 
  Mic, Volume2, ArrowRight, Layers, Eye
} from 'lucide-react';
import SpeakingRecorder from './SpeakingRecorder';

interface LanguagePracticeViewerProps {
  module: PracticeModule;
}

// Logical Order Types
type SlideType =
  | { type: 'MEANING'; group: 'learn' }
  | { type: 'VISUALS'; group: 'learn' }
  | { type: 'FORM'; group: 'learn' }
  | { type: 'TEACHING_CHUNK'; index: number; group: 'learn' }
  | { type: 'PRONUNCIATION'; group: 'learn' }
  | { type: 'EXAMPLES'; group: 'learn' }
  | { type: 'WORD_FORMATION'; index: number; group: 'practice' }
  | { type: 'PARAPHRASING'; index: number; group: 'practice' }
  | { type: 'GAP_FILL'; index: number; group: 'practice' }
  | { type: 'QUIZ'; index: number; group: 'test' }
  | { type: 'TEST'; index: number; group: 'test' }
  | { type: 'SPEAKING'; index: number; group: 'test' };

const LanguagePracticeViewer: React.FC<LanguagePracticeViewerProps> = ({ module }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // State for interactivity
  const [quizState, setQuizState] = useState<Record<string, number | null>>({}); // selected index
  const [textInputs, setTextInputs] = useState<Record<string, string>>({}); // for gaps/word form
  const [hintsUsed, setHintsUsed] = useState<Record<string, number>>({}); // count of hints
  const [shake, setShake] = useState<string | null>(null); // ID of element to shake

  // 1. LOGICAL ORDERING: Input -> Scaffolding -> Practice -> Assessment
  const slides: SlideType[] = useMemo(() => {
    const deck: SlideType[] = [];
    
    // -- LEARN PHASE --
    deck.push({ type: 'MEANING', group: 'learn' });
    deck.push({ type: 'VISUALS', group: 'learn' });
    deck.push({ type: 'FORM', group: 'learn' });
    module.teachingChunks.forEach((_, i) => deck.push({ type: 'TEACHING_CHUNK', index: i, group: 'learn' }));
    deck.push({ type: 'PRONUNCIATION', group: 'learn' });
    deck.push({ type: 'EXAMPLES', group: 'learn' });

    // -- PRACTICE PHASE --
    module.wordFormation.forEach((_, i) => deck.push({ type: 'WORD_FORMATION', index: i, group: 'practice' }));
    module.paraphrasing.forEach((_, i) => deck.push({ type: 'PARAPHRASING', index: i, group: 'practice' }));
    module.gapFills.forEach((_, i) => deck.push({ type: 'GAP_FILL', index: i, group: 'practice' }));

    // -- TEST PHASE --
    module.quizzes.forEach((_, i) => deck.push({ type: 'QUIZ', index: i, group: 'test' }));
    module.tests.forEach((_, i) => deck.push({ type: 'TEST', index: i, group: 'test' }));
    module.speakingQuestions.forEach((_, i) => deck.push({ type: 'SPEAKING', index: i, group: 'test' }));

    return deck;
  }, [module]);

  const currentSlide = slides[currentSlideIndex];

  // Helper: Trigger Shake Animation
  const triggerShake = (id: string) => {
    setShake(id);
    setTimeout(() => setShake(null), 500);
  };

  // Helper: Get Hint for Word Formation
  const getHint = (id: string, correctWord: string) => {
    const currentHints = hintsUsed[id] || 0;
    if (currentHints < correctWord.length) {
      setHintsUsed(prev => ({ ...prev, [id]: currentHints + 1 }));
      setTextInputs(prev => ({ ...prev, [id]: correctWord.substring(0, currentHints + 1) }));
    }
  };

  const paginate = (newDirection: number) => {
    const nextIndex = currentSlideIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < slides.length) {
      setDirection(newDirection);
      setCurrentSlideIndex(nextIndex);
      setShake(null); // Reset shakes
    }
  };

  // --- RENDERERS ---

  const renderLearn = () => {
    switch (currentSlide.type) {
      case 'MEANING':
        return (
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
              <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase">
                Core Concept
              </span>
            </motion.div>
            <h1 className="text-6xl font-black text-gray-900 mb-8 tracking-tight leading-tight">
              {module.grammarTopic}
            </h1>
            <p className="text-3xl text-gray-600 font-medium leading-relaxed">
              {module.mfp.meaning}
            </p>
          </div>
        );
      
      case 'VISUALS':
        return (
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
             <h2 className="text-3xl font-bold text-gray-800 mb-12 uppercase tracking-wide">Usage Frequency</h2>
             <div className="flex items-end gap-12 h-64 w-full justify-center">
                {module.mfp.visualData.map((d, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: 0 }}
                     animate={{ height: `${d.value}%` }}
                     transition={{ delay: 0.2 + i * 0.1, type: "spring" }}
                     className="w-24 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-xl relative group"
                   >
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl font-bold text-gray-800">
                        {d.value}%
                      </div>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-500 uppercase whitespace-nowrap">
                        {d.label}
                      </div>
                   </motion.div>
                ))}
             </div>
          </div>
        );

      case 'FORM':
        return (
           <div className="max-w-5xl mx-auto text-center">
              <div className="mb-10 flex justify-center text-purple-600">
                <Layers size={64} />
              </div>
              <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Structural Form</h2>
              <motion.div 
                className="bg-gray-900 text-green-400 p-12 rounded-3xl shadow-xl font-mono text-4xl md:text-5xl font-bold leading-normal"
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
              >
                {module.mfp.form}
              </motion.div>
           </div>
        );

      case 'TEACHING_CHUNK':
        const chunk = module.teachingChunks[currentSlide.index];
        return (
          <div className="max-w-4xl mx-auto text-center">
             <motion.div 
               initial={{ scale: 0 }} animate={{ scale: 1 }}
               className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
             >
                <Lightbulb className="w-10 h-10 text-white" />
             </motion.div>
             <h2 className="text-5xl font-black text-gray-900 mb-8">{chunk.title}</h2>
             <p className="text-3xl text-gray-600 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
               {chunk.content}
             </p>
          </div>
        );

      case 'PRONUNCIATION':
        return (
           <div className="max-w-4xl mx-auto text-center">
              <motion.div 
                 animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                 className="inline-block p-6 bg-pink-100 rounded-full mb-8"
              >
                <Volume2 className="w-12 h-12 text-pink-600" />
              </motion.div>
              <h2 className="text-gray-400 font-bold uppercase tracking-widest mb-6">Listen & Repeat</h2>
              <p className="text-6xl font-serif italic text-gray-900 mb-8">"{module.mfp.pronunciation}"</p>
           </div>
        );
      
      case 'EXAMPLES':
         return (
            <div className="max-w-5xl mx-auto w-full space-y-6">
               <h2 className="text-center text-gray-400 font-bold uppercase tracking-widest mb-8">Contextual Examples</h2>
               {module.examples.map((ex, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm"
                  >
                     <p className="text-2xl text-gray-800 leading-relaxed">"{ex}"</p>
                  </motion.div>
               ))}
            </div>
         );
    }
  };

  const renderPractice = () => {
    switch (currentSlide.type) {
      case 'WORD_FORMATION':
        const wf = module.wordFormation[currentSlide.index];
        const wfId = `wf-${currentSlide.index}`;
        const inputVal = textInputs[wfId] || '';
        const isCorrect = inputVal.toLowerCase().trim() === wf.answer.toLowerCase();
        
        return (
           <div className="max-w-4xl mx-auto w-full text-center">
              <div className="bg-emerald-50 p-8 rounded-3xl border-2 border-emerald-100 mb-8">
                 <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Root Word</span>
                 <h2 className="text-5xl font-black text-emerald-800 mt-2">{wf.root}</h2>
              </div>

              <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
                 <p className="text-3xl text-gray-700 mb-8 leading-relaxed">
                    {wf.sentence.split('_____')[0]}
                    <span className={`inline-block border-b-4 px-2 min-w-[150px] font-bold transition-colors ${isCorrect ? 'border-green-500 text-green-600' : 'border-gray-300 text-blue-600'}`}>
                       {inputVal || "?"}
                    </span>
                    {wf.sentence.split('_____')[1]}
                 </p>

                 <motion.div 
                    animate={shake === wfId ? { x: [-10, 10, -10, 10, 0] } : {}}
                    className="flex gap-4 justify-center"
                 >
                    <input 
                       type="text" 
                       value={inputVal}
                       onChange={(e) => setTextInputs(prev => ({ ...prev, [wfId]: e.target.value }))}
                       className="border-2 border-gray-200 rounded-xl px-6 py-3 text-2xl w-full max-w-md focus:border-blue-500 focus:outline-none"
                       placeholder="Type here..."
                    />
                    <button 
                       onClick={() => getHint(wfId, wf.answer)}
                       className="p-3 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200"
                       title="Get Hint"
                    >
                       <Eye size={24} />
                    </button>
                 </motion.div>
                 
                 <AnimatePresence>
                   {isCorrect && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-green-500/90 flex items-center justify-center"
                      >
                         <div className="text-white text-4xl font-black flex items-center gap-4">
                            <CheckCircle2 size={48} /> Perfect!
                         </div>
                      </motion.div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        );

      case 'PARAPHRASING':
        const pq = module.paraphrasing[currentSlide.index];
        const pId = `para-${currentSlide.index}`;
        const selectedOpt = quizState[pId];

        return (
           <div className="max-w-5xl mx-auto w-full">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-gray-400 font-bold uppercase tracking-widest">Paraphrasing: {pq.technique}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="p-8 bg-gray-100 rounded-2xl border-l-4 border-gray-400">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Original</div>
                    <p className="text-2xl font-medium text-gray-800">"{pq.original}"</p>
                 </div>
                 <div className="p-8 bg-blue-50 rounded-2xl border-l-4 border-blue-500">
                    <div className="text-xs font-bold text-blue-400 uppercase mb-2">Target</div>
                    <p className="text-2xl font-bold text-blue-900">"{pq.paraphrase}"</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {pq.options.map((opt, i) => {
                    const isSelected = selectedOpt === i;
                    const isCorrect = i === pq.correct;
                    const showStatus = selectedOpt !== null && selectedOpt !== undefined;

                    return (
                       <button
                          key={i}
                          disabled={showStatus}
                          onClick={() => setQuizState(prev => ({ ...prev, [pId]: i }))}
                          className={`
                             p-6 rounded-xl text-xl font-bold border-2 transition-all
                             ${showStatus 
                                ? (isCorrect 
                                   ? 'bg-green-100 border-green-500 text-green-800' 
                                   : (isSelected ? 'bg-red-100 border-red-500 text-red-800' : 'opacity-50 grayscale'))
                                : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
                             }
                          `}
                       >
                          {opt}
                       </button>
                    );
                 })}
              </div>
           </div>
        );

      case 'GAP_FILL':
         const gf = module.gapFills[currentSlide.index];
         const gfId = `gf-${currentSlide.index}`;
         const gfVal = textInputs[gfId] || '';
         const gfCorrect = gfVal.toLowerCase().trim() === gf.answer.toLowerCase();

         return (
            <div className="max-w-4xl mx-auto text-center w-full">
               <h2 className="text-gray-400 font-bold uppercase tracking-widest mb-12">Complete the Sentence</h2>
               <div className="bg-white p-12 rounded-[2rem] shadow-2xl border border-gray-100 relative">
                  <p className="text-4xl text-gray-800 leading-relaxed font-medium">
                     {gf.sentence.split('_____')[0]}
                     <input 
                        autoFocus
                        type="text"
                        value={gfVal}
                        onChange={(e) => setTextInputs(prev => ({ ...prev, [gfId]: e.target.value }))}
                        className="bg-gray-50 border-b-4 border-blue-500 mx-3 px-2 py-1 text-center w-64 focus:outline-none focus:bg-blue-50 font-bold text-blue-700"
                        placeholder="?"
                     />
                     {gf.sentence.split('_____')[1]}
                  </p>
                  
                  <div className="h-12 mt-8 flex justify-center items-center">
                     <AnimatePresence>
                        {gfCorrect ? (
                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-600 font-bold text-2xl">
                              <Sparkles className="fill-current" /> Correct!
                           </motion.div>
                        ) : gfVal.length > 0 && (
                           <span className="text-gray-400 text-sm">Keep typing...</span>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
         );
    }
  }

  const renderTest = () => {
    switch (currentSlide.type) {
       case 'QUIZ':
       case 'TEST':
          const isTest = currentSlide.type === 'TEST';
          const qData = isTest ? module.tests[currentSlide.index] : module.quizzes[currentSlide.index];
          const qId = `${isTest ? 'test' : 'quiz'}-${currentSlide.index}`;
          const sel = quizState[qId];

          return (
             <div className="max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-3 mb-8">
                   <Activity className={isTest ? "text-red-500" : "text-amber-500"} />
                   <span className={`font-bold uppercase tracking-widest ${isTest ? "text-red-500" : "text-amber-500"}`}>
                      {isTest ? "Exam Simulation" : "Quick Check"}
                   </span>
                </div>
                
                <h3 className="text-4xl font-black text-gray-900 mb-12 leading-tight">
                   {qData.question}
                </h3>

                <div className="grid gap-4">
                   {qData.options.map((opt, i) => {
                      const isSelected = sel === i;
                      const isCorrect = i === qData.correct;
                      const revealed = sel !== null && sel !== undefined;

                      return (
                         <motion.button
                            key={i}
                            disabled={revealed}
                            whileHover={!revealed ? { scale: 1.02, x: 10 } : {}}
                            whileTap={!revealed ? { scale: 0.98 } : {}}
                            onClick={() => setQuizState(prev => ({ ...prev, [qId]: i }))}
                            className={`
                               w-full p-6 text-left rounded-xl text-xl font-bold border-2 transition-all
                               ${revealed 
                                  ? (isCorrect 
                                     ? 'bg-green-100 border-green-500 text-green-900' 
                                     : (isSelected ? 'bg-red-100 border-red-500 text-red-900' : 'opacity-40'))
                                  : 'bg-white border-gray-100 hover:border-gray-300'
                               }
                            `}
                         >
                            <div className="flex justify-between items-center">
                               {opt}
                               {revealed && isCorrect && <CheckCircle2 className="text-green-600" />}
                               {revealed && isSelected && !isCorrect && <XCircle className="text-red-500" />}
                            </div>
                         </motion.button>
                      );
                   })}
                </div>
             </div>
          );

       case 'SPEAKING':
          return (
             <div className="max-w-4xl mx-auto text-center w-full">
                <motion.div 
                  animate={{ boxShadow: ["0 0 0 0px rgba(239, 68, 68, 0)", "0 0 0 20px rgba(239, 68, 68, 0.1)", "0 0 0 0px rgba(239, 68, 68, 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-red-100"
                >
                   <Mic className="w-10 h-10 text-red-500" />
                </motion.div>
                
                <h2 className="text-red-500 font-bold uppercase tracking-widest mb-8">Speaking Task</h2>
                <h3 className="text-5xl font-black text-gray-900 mb-12 leading-tight">
                   "{module.speakingQuestions[currentSlide.index]}"
                </h3>

                <div className="transform scale-125 origin-center inline-block">
                   <SpeakingRecorder />
                </div>
             </div>
          );
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 flex flex-col overflow-hidden relative font-sans">
      
      {/* 4. ULTRA SIMPLE NAV - Progress Header */}
      <div className="h-2 flex w-full z-50">
         <div className={`h-full transition-all duration-500 ${currentSlide.group === 'learn' ? 'bg-blue-500 w-1/3' : 'bg-gray-200 w-1/3'}`} />
         <div className={`h-full transition-all duration-500 ${currentSlide.group === 'practice' ? 'bg-emerald-500 w-1/3' : 'bg-gray-200 w-1/3'}`} />
         <div className={`h-full transition-all duration-500 ${currentSlide.group === 'test' ? 'bg-red-500 w-1/3' : 'bg-gray-200 w-1/3'}`} />
      </div>

      <div className="absolute top-6 left-6 z-40">
         <span className={`
            px-4 py-2 rounded-lg font-black uppercase text-xs tracking-[0.2em] shadow-sm
            ${currentSlide.group === 'learn' ? 'bg-blue-100 text-blue-700' : 
              currentSlide.group === 'practice' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
         `}>
            {currentSlide.group} Phase
         </span>
      </div>

      {/* Main Content Stage */}
      <div className="flex-1 relative flex items-center justify-center p-8">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction < 0 ? 100 : -100, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="w-full h-full flex items-center justify-center"
          >
             {currentSlide.group === 'learn' && renderLearn()}
             {currentSlide.group === 'practice' && renderPractice()}
             {currentSlide.group === 'test' && renderTest()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Simple Footer Navigation */}
      <div className="h-24 bg-white border-t border-gray-100 flex items-center justify-between px-12 shrink-0">
         <button
            onClick={() => paginate(-1)}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-3 text-gray-400 hover:text-gray-900 disabled:opacity-0 transition-colors font-bold text-lg"
         >
            <ChevronLeft size={24} /> Back
         </button>

         <div className="flex gap-2">
            {slides.map((s, i) => (
               <div 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlideIndex ? 'bg-gray-800 scale-150' : 'bg-gray-200'}`}
               />
            ))}
         </div>

         <button
            onClick={() => paginate(1)}
            disabled={currentSlideIndex === slides.length - 1}
            className="flex items-center gap-3 bg-gray-900 text-white px-8 py-3 rounded-xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all font-bold text-lg shadow-lg disabled:opacity-50 disabled:grayscale"
         >
            Next <ArrowRight size={24} />
         </button>
      </div>

    </div>
  );
};

export default LanguagePracticeViewer;
