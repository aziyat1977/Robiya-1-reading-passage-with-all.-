
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeModule } from '../types';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle2, Mic, BrainCircuit, ExternalLink, Activity, Layers, Trophy, Sparkles, Volume2 } from 'lucide-react';
import SpeakingRecorder from './SpeakingRecorder';

interface LanguagePracticeViewerProps {
  module: PracticeModule;
}

// Streamlined slide structure
type SlideType =
  | { type: 'MEANING' }        // Acts as Cover + Meaning
  | { type: 'FORM' }
  | { type: 'PRONUNCIATION' }
  | { type: 'VISUALS' }
  | { type: 'EXAMPLES' }
  | { type: 'QUIZ'; index: number }
  | { type: 'TEST'; index: number }
  | { type: 'GAP_FILL'; index: number }
  | { type: 'SPEAKING'; index: number };
  // Removed separate INTRO, KAHOOT (often distracting), and COMPLETION (redundant) for tighter flow

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1], // Custom ease for snappy feel
    },
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
    transition: { duration: 0.4, ease: "easeInOut" },
  }),
};

const LanguagePracticeViewer: React.FC<LanguagePracticeViewerProps> = ({ module }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [gapFillAnswers, setGapFillAnswers] = useState<Record<number, string>>({});

  const slides: SlideType[] = useMemo(() => [
    { type: 'MEANING' },
    { type: 'FORM' },
    { type: 'PRONUNCIATION' },
    { type: 'VISUALS' },
    { type: 'EXAMPLES' },
    ...module.quizzes.map((_, i) => ({ type: 'QUIZ' as const, index: i })),
    ...module.gapFills.map((_, i) => ({ type: 'GAP_FILL' as const, index: i })),
    ...module.tests.map((_, i) => ({ type: 'TEST' as const, index: i })),
    ...module.speakingQuestions.map((_, i) => ({ type: 'SPEAKING' as const, index: i })),
  ], [module]);

  const paginate = (newDirection: number) => {
    const nextIndex = currentSlideIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < slides.length) {
      setDirection(newDirection);
      setCurrentSlideIndex(nextIndex);
    }
  };

  const checkGapFill = (index: number, input: string, correct: string) => {
    return input.trim().toLowerCase() === correct.toLowerCase();
  };

  const currentSlide = slides[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / slides.length) * 100;

  // Render logic for each slide type
  const renderContent = () => {
    switch (currentSlide.type) {
      case 'MEANING':
        return (
          <div className="flex flex-col h-full w-full bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-12 relative overflow-hidden">
             {/* Background Decoration */}
             <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             
             <div className="flex-1 flex flex-col justify-center items-start z-10 max-w-5xl mx-auto w-full">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold tracking-widest uppercase mb-6 inline-block border border-white/10">
                    Topic Overview
                  </span>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-6xl md:text-8xl font-black mb-12 leading-tight tracking-tight"
                >
                  {module.grammarTopic}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="pl-8 border-l-8 border-white/30"
                >
                  <p className="text-3xl md:text-5xl font-medium leading-normal text-blue-100">
                    {module.mfp.meaning}
                  </p>
                </motion.div>
             </div>
          </div>
        );

      case 'FORM':
        return (
          <div className="flex flex-col h-full w-full bg-slate-900 text-white p-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
             
             <div className="flex-1 flex flex-col justify-center items-center z-10 w-full">
                <div className="mb-12 flex items-center gap-4 text-purple-400">
                   <Layers className="w-12 h-12" />
                   <span className="text-2xl font-bold uppercase tracking-widest">Structure & Form</span>
                </div>
                
                <motion.div 
                   className="bg-white/5 backdrop-blur-xl border border-white/10 p-16 md:p-24 rounded-[3rem] shadow-2xl text-center w-full max-w-6xl"
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ type: "spring", bounce: 0.4 }}
                >
                   <code className="text-5xl md:text-7xl font-mono text-green-400 font-bold leading-relaxed break-words">
                     {module.mfp.form}
                   </code>
                </motion.div>
             </div>
          </div>
        );

      case 'PRONUNCIATION':
        return (
          <div className="flex flex-col h-full w-full bg-pink-600 text-white p-12 relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-center items-center z-10 w-full text-center">
                <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} 
                   className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-12 shadow-2xl"
                >
                   <Volume2 className="w-16 h-16 text-pink-600" />
                </motion.div>
                
                <h2 className="text-2xl font-bold uppercase tracking-[0.3em] mb-12 text-pink-200">Pronunciation Focus</h2>
                
                <p className="text-6xl md:text-8xl font-serif italic font-medium leading-tight max-w-5xl">
                  "{module.mfp.pronunciation}"
                </p>
             </div>
          </div>
        );

      case 'VISUALS':
        return (
          <div className="flex flex-col h-full w-full bg-white text-gray-900 p-8 md:p-12 relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-gray-900 mb-16 uppercase tracking-tighter">Visual Analysis</h2>
                
                <div className="flex items-end justify-between gap-8 h-[50vh] w-full">
                   {module.mfp.visualData.map((d, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end group">
                         <div className="flex flex-col items-center gap-4">
                            <motion.div 
                               initial={{ height: 0 }}
                               animate={{ height: `${d.value}%` }}
                               transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 50 }}
                               className="w-full bg-gray-900 rounded-t-3xl relative overflow-hidden min-h-[10px]"
                            >
                               <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                               <span className="absolute top-4 left-0 right-0 text-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                 {d.value}%
                               </span>
                            </motion.div>
                            <span className="text-xl md:text-2xl font-bold text-gray-500 group-hover:text-blue-600 transition-colors text-center leading-tight">
                              {d.label}
                            </span>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'EXAMPLES':
        return (
          <div className="flex flex-col h-full w-full bg-amber-50 text-amber-900 p-8 md:p-12 relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-16 opacity-50">
                  <BookOpen className="w-8 h-8" />
                  <span className="text-xl font-bold uppercase tracking-widest">Contextual Examples</span>
                </div>

                <div className="space-y-12">
                   {module.examples.map((ex, i) => (
                      <motion.div 
                         key={i}
                         initial={{ x: -50, opacity: 0 }}
                         animate={{ x: 0, opacity: 1 }}
                         transition={{ delay: i * 0.15 }}
                         className="border-l-4 border-amber-900/20 pl-8 py-2"
                      >
                         <p className="text-3xl md:text-5xl font-serif leading-relaxed">
                           {ex}
                         </p>
                      </motion.div>
                   ))}
                </div>
             </div>
          </div>
        );

      case 'QUIZ': {
        const q = module.quizzes[currentSlide.index];
        const isAnswered = quizAnswers[`quiz-${currentSlide.index}`] !== undefined;
        return (
          <div className="flex flex-col h-full w-full bg-white p-8 md:p-12 relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
                <span className="text-amber-600 font-bold uppercase tracking-widest mb-8">Quick Check {currentSlide.index + 1}</span>
                
                <h3 className="text-4xl md:text-6xl font-bold text-gray-900 mb-16 leading-tight">
                  {q.question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {q.options.map((opt, i) => {
                      const selected = quizAnswers[`quiz-${currentSlide.index}`] === i;
                      const correct = i === q.correct;
                      const statusColor = selected 
                        ? (correct ? 'bg-green-600 border-green-600 text-white' : 'bg-red-500 border-red-500 text-white')
                        : 'bg-white border-gray-200 text-gray-900 hover:border-amber-400';

                      return (
                        <button
                           key={i}
                           onClick={() => setQuizAnswers(prev => ({ ...prev, [`quiz-${currentSlide.index}`]: i }))}
                           className={`p-8 rounded-2xl border-4 text-2xl font-bold transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 ${statusColor}`}
                        >
                           {opt}
                        </button>
                      );
                   })}
                </div>
             </div>
          </div>
        );
      }

      case 'GAP_FILL': {
        const gf = module.gapFills[currentSlide.index];
        const answer = gapFillAnswers[currentSlide.index] || '';
        const isCorrect = checkGapFill(currentSlide.index, answer, gf.answer);
        
        return (
          <div className="flex flex-col h-full w-full bg-teal-600 text-white p-8 md:p-12 relative overflow-hidden">
             <div className="flex-1 flex flex-col justify-center items-center max-w-7xl mx-auto w-full text-center">
                <div className="bg-white/10 backdrop-blur-lg p-16 md:p-24 rounded-[3rem] w-full border border-white/20 shadow-2xl">
                   <p className="text-4xl md:text-6xl font-medium leading-relaxed">
                      {gf.sentence.split('_____')[0]}
                      <span className="inline-block mx-4 relative top-2">
                         <input 
                            type="text" 
                            className="bg-transparent border-b-4 border-white/50 w-64 md:w-96 text-center text-white placeholder-white/30 focus:outline-none focus:border-white font-bold"
                            placeholder="type here"
                            value={answer}
                            onChange={(e) => setGapFillAnswers(prev => ({ ...prev, [currentSlide.index]: e.target.value }))}
                            autoFocus
                         />
                      </span>
                      {gf.sentence.split('_____')[1]}
                   </p>
                   
                   <div className="h-12 mt-12">
                      {answer && (
                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold flex items-center justify-center gap-3">
                            {isCorrect ? (
                               <><CheckCircle2 className="w-10 h-10" /> Excellent!</>
                            ) : (
                               <span className="text-teal-200">Hint: {gf.answer}</span>
                            )}
                         </motion.div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        );
      }
      
      case 'TEST': {
         const t = module.tests[currentSlide.index];
         return (
            <div className="flex flex-col h-full w-full bg-rose-50 p-8 md:p-12 relative overflow-hidden">
               <div className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full">
                  <div className="flex items-center gap-4 mb-8 text-rose-600">
                     <Activity className="w-8 h-8" />
                     <span className="font-bold uppercase tracking-widest">Knowledge Test {currentSlide.index + 1}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12">
                    {t.question}
                  </h3>
                  
                  <div className="space-y-4">
                     {t.options.map((opt, i) => (
                        <button
                           key={i}
                           onClick={() => setQuizAnswers(prev => ({ ...prev, [`test-${currentSlide.index}`]: i }))}
                           className={`w-full p-6 text-left text-xl md:text-2xl font-bold rounded-xl transition-all border-2 
                              ${quizAnswers[`test-${currentSlide.index}`] === i
                                 ? (i === t.correct ? 'bg-green-100 border-green-500 text-green-900' : 'bg-rose-100 border-rose-500 text-rose-900')
                                 : 'bg-white border-transparent hover:border-rose-200 text-gray-600 hover:bg-white/80'
                              }
                           `}
                        >
                           {opt}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         );
      }

      case 'SPEAKING': {
         const q = module.speakingQuestions[currentSlide.index];
         return (
            <div className="flex flex-col h-full w-full bg-gray-900 text-white p-8 md:p-12 relative overflow-hidden">
               <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full text-center">
                  <span className="text-red-400 font-bold uppercase tracking-[0.3em] mb-12">Speaking Practice</span>
                  
                  <h3 className="text-4xl md:text-6xl font-bold mb-16 leading-tight">
                    "{q}"
                  </h3>
                  
                  <div className="transform scale-150">
                     <SpeakingRecorder />
                  </div>
               </div>
            </div>
         );
      }

      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${currentSlide.type}-${currentSlideIndex}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Overlay */}
      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex items-end justify-between pointer-events-none z-50">
         {/* Left Button */}
         <button
            onClick={() => paginate(-1)}
            disabled={currentSlideIndex === 0}
            className={`pointer-events-auto w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white hover:text-black hover:scale-110 active:scale-95 disabled:opacity-0`}
         >
            <ChevronLeft className="w-8 h-8" />
         </button>

         {/* Progress Indicators */}
         <div className="flex gap-2 mb-6">
            {slides.map((_, i) => (
               <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlideIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30'}`} 
               />
            ))}
         </div>

         {/* Right Button */}
         <button
            onClick={() => paginate(1)}
            disabled={currentSlideIndex === slides.length - 1}
            className={`pointer-events-auto group flex items-center gap-4 pl-8 pr-4 py-4 rounded-full bg-white text-black font-bold text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale`}
         >
            {currentSlideIndex === slides.length - 1 ? 'Finish' : 'Next'}
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-90 transition-transform">
               <ChevronRight className="w-6 h-6" />
            </div>
         </button>
      </div>
      
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-white/20 w-full z-50">
         <motion.div 
            className="h-full bg-white shadow-[0_0_15px_white]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
         />
      </div>
    </div>
  );
};

export default LanguagePracticeViewer;
