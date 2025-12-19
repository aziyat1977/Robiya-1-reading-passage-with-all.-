
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeModule } from '../types';
import { ChevronRight, ChevronLeft, BookOpen, CheckCircle2, Mic, BrainCircuit, ExternalLink, Activity, Layers, Trophy } from 'lucide-react';
import SpeakingRecorder from './SpeakingRecorder';

interface LanguagePracticeViewerProps {
  module: PracticeModule;
}

// Define the linear slide structure
type SlideType =
  | { type: 'INTRO' }
  | { type: 'MEANING' }
  | { type: 'FORM' }
  | { type: 'PRONUNCIATION' }
  | { type: 'VISUALS' }
  | { type: 'EXAMPLES' }
  | { type: 'QUIZ'; index: number }
  | { type: 'TEST'; index: number }
  | { type: 'GAP_FILL'; index: number }
  | { type: 'KAHOOT' }
  | { type: 'SPEAKING'; index: number }
  | { type: 'COMPLETION' };

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 45 : -45,
    filter: 'blur(10px)',
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 90,
        damping: 14
    }
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.8,
    rotateY: direction < 0 ? 45 : -45,
    filter: 'blur(10px)',
    transition: { duration: 0.5, ease: "easeInOut" }
  })
};

const contentVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3 + i * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  })
};

const LanguagePracticeViewer: React.FC<LanguagePracticeViewerProps> = ({ module }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [gapFillAnswers, setGapFillAnswers] = useState<Record<number, string>>({});

  const slides: SlideType[] = useMemo(() => [
    { type: 'INTRO' },
    { type: 'MEANING' },
    { type: 'FORM' },
    { type: 'PRONUNCIATION' },
    { type: 'VISUALS' },
    { type: 'EXAMPLES' },
    ...module.quizzes.map((_, i) => ({ type: 'QUIZ' as const, index: i })),
    ...module.tests.map((_, i) => ({ type: 'TEST' as const, index: i })),
    ...module.gapFills.map((_, i) => ({ type: 'GAP_FILL' as const, index: i })),
    { type: 'KAHOOT' },
    ...module.speakingQuestions.map((_, i) => ({ type: 'SPEAKING' as const, index: i })),
    { type: 'COMPLETION' }
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

  const renderSlideContent = () => {
    switch (currentSlide.type) {
      case 'INTRO':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="mb-12">
              <motion.span 
                 whileHover={{ scale: 1.1 }}
                 className="inline-block py-3 px-8 rounded-full bg-indigo-100 text-indigo-700 font-black text-xl tracking-[0.25em] uppercase mb-8 shadow-lg shadow-indigo-200/50"
              >
                Language Module
              </motion.span>
              <h1 className="text-7xl md:text-9xl font-black text-gray-900 leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-pulse">
                {module.grammarTopic}
              </h1>
              <p className="text-3xl text-gray-500 font-light max-w-4xl mx-auto">Swipe or click next to begin mastering this topic.</p>
            </motion.div>
          </div>
        );

      case 'MEANING':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12 p-10 bg-blue-100 rounded-full inline-block shadow-2xl shadow-blue-200">
                <BookOpen className="w-24 h-24 text-blue-600" />
             </motion.div>
             <motion.h2 custom={1} variants={contentVariants} initial="hidden" animate="visible" className="text-4xl font-black text-blue-500 uppercase tracking-widest mb-12">Meaning & Context</motion.h2>
             <motion.p custom={2} variants={contentVariants} initial="hidden" animate="visible" className="text-6xl md:text-7xl font-bold text-gray-800 leading-snug max-w-5xl">
               {module.mfp.meaning}
             </motion.p>
          </div>
        );

      case 'FORM':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12 p-10 bg-purple-100 rounded-full inline-block shadow-2xl shadow-purple-200">
                <Layers className="w-24 h-24 text-purple-600" />
             </motion.div>
             <motion.h2 custom={1} variants={contentVariants} initial="hidden" animate="visible" className="text-4xl font-black text-purple-500 uppercase tracking-widest mb-12">Grammatical Form</motion.h2>
             <motion.div custom={2} variants={contentVariants} initial="hidden" animate="visible" className="bg-gray-900 p-16 rounded-[3rem] shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <p className="text-5xl md:text-7xl font-mono font-bold text-green-400">
                  {module.mfp.form}
                </p>
             </motion.div>
          </div>
        );

      case 'PRONUNCIATION':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12 p-10 bg-pink-100 rounded-full inline-block shadow-2xl shadow-pink-200">
                <Mic className="w-24 h-24 text-pink-600" />
             </motion.div>
             <motion.h2 custom={1} variants={contentVariants} initial="hidden" animate="visible" className="text-4xl font-black text-pink-500 uppercase tracking-widest mb-12">Pronunciation</motion.h2>
             <motion.p custom={2} variants={contentVariants} initial="hidden" animate="visible" className="text-6xl md:text-8xl font-serif italic text-gray-800 leading-snug">
               "{module.mfp.pronunciation}"
             </motion.p>
          </div>
        );

      case 'VISUALS':
        return (
          <div className="flex flex-col items-center justify-center h-full w-full px-8">
             <motion.h2 custom={0} variants={contentVariants} initial="hidden" animate="visible" className="text-4xl font-black text-indigo-500 uppercase tracking-widest mb-20">Visual Analysis</motion.h2>
             <div className="flex items-end justify-center gap-16 h-[50vh] w-full max-w-6xl">
                {module.mfp.visualData.map((d, i) => (
                  <motion.div 
                    key={i} 
                    custom={i+1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col items-center gap-8 w-full h-full justify-end group"
                  >
                     <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${d.value}%` }}
                       transition={{ delay: 0.8 + i * 0.2, type: "spring", stiffness: 60 }}
                       className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-3xl shadow-2xl relative overflow-hidden group-hover:from-indigo-500 group-hover:to-cyan-300 transition-colors"
                     >
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                     </motion.div>
                     <div className="text-center">
                        <span className="block text-6xl font-black text-gray-900 mb-2">{d.value}%</span>
                        <span className="block text-2xl font-bold text-gray-500 uppercase tracking-wide">{d.label}</span>
                     </div>
                  </motion.div>
                ))}
             </div>
          </div>
        );

      case 'EXAMPLES':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <motion.h2 custom={0} variants={contentVariants} initial="hidden" animate="visible" className="text-4xl font-black text-orange-500 uppercase tracking-widest mb-16">Examples from Text</motion.h2>
            <div className="space-y-12 max-w-6xl w-full">
              {module.examples.map((ex, i) => (
                <motion.div 
                  key={i}
                  custom={i+1}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white p-10 rounded-[2rem] border-l-[1rem] border-orange-500 shadow-xl transform hover:scale-105 transition-transform"
                >
                  <p className="text-3xl md:text-4xl font-serif text-gray-800 italic leading-relaxed">
                    "{ex}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'QUIZ':
        const quizQ = module.quizzes[currentSlide.index];
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 max-w-7xl mx-auto w-full">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12 flex items-center gap-4">
                <span className="bg-yellow-100 text-yellow-700 px-6 py-2 rounded-full font-bold text-xl uppercase tracking-wider">Quiz Question {currentSlide.index + 1}</span>
             </motion.div>
             
             <motion.h3 custom={1} variants={contentVariants} initial="hidden" animate="visible" className="text-5xl md:text-7xl font-bold text-gray-900 mb-16 text-center leading-tight">
               {quizQ.question}
             </motion.h3>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
               {quizQ.options.map((opt, optIdx) => (
                 <motion.button
                   key={optIdx}
                   custom={2 + optIdx}
                   variants={contentVariants}
                   initial="hidden"
                   animate="visible"
                   whileHover={{ scale: 1.05, y: -10 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => setQuizAnswers(prev => ({ ...prev, [`quiz-${currentSlide.index}`]: optIdx }))}
                   className={`p-10 rounded-3xl text-3xl font-bold transition-all shadow-xl border-4
                     ${quizAnswers[`quiz-${currentSlide.index}`] === optIdx 
                        ? (optIdx === quizQ.correct 
                            ? 'bg-green-500 text-white border-green-600 shadow-green-500/50' 
                            : 'bg-red-500 text-white border-red-600 shadow-red-500/50')
                        : 'bg-white text-gray-700 border-gray-100 hover:border-blue-200'}
                   `}
                 >
                   {opt}
                 </motion.button>
               ))}
             </div>
          </div>
        );

      case 'TEST':
        const testQ = module.tests[currentSlide.index];
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 max-w-6xl mx-auto w-full">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12 flex items-center gap-4">
                <span className="bg-red-100 text-red-700 px-6 py-2 rounded-full font-bold text-xl uppercase tracking-wider">Test Question {currentSlide.index + 1}</span>
             </motion.div>
             
             <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="bg-white p-16 rounded-[3rem] shadow-2xl border border-gray-100 w-full text-center">
                <Activity className="w-20 h-20 text-red-500 mx-auto mb-8 animate-bounce" />
                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
                  {testQ.question}
                </h3>

                <div className="flex flex-col gap-6">
                  {testQ.options.map((opt, optIdx) => (
                    <motion.button
                      key={optIdx}
                      whileHover={{ scale: 1.02, x: 10 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setQuizAnswers(prev => ({ ...prev, [`test-${currentSlide.index}`]: optIdx }))}
                      className={`text-left p-8 rounded-2xl text-2xl font-bold transition-all
                        ${quizAnswers[`test-${currentSlide.index}`] === optIdx 
                           ? (optIdx === testQ.correct ? 'bg-green-100 text-green-800 ring-4 ring-green-300' : 'bg-red-100 text-red-800 ring-4 ring-red-300')
                           : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
             </motion.div>
          </div>
        );

      case 'GAP_FILL':
        const gf = module.gapFills[currentSlide.index];
        const isCorrect = gapFillAnswers[currentSlide.index] && checkGapFill(currentSlide.index, gapFillAnswers[currentSlide.index], gf.answer);
        return (
          <div className="flex flex-col items-center justify-center h-full px-8">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-16">
               <span className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold text-xl uppercase tracking-wider">Gap Fill {currentSlide.index + 1}</span>
             </motion.div>

             <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="bg-yellow-50 p-16 md:p-24 rounded-[3rem] shadow-xl border-4 border-yellow-200 w-full max-w-7xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-20 text-yellow-600">
                  <BrainCircuit className="w-64 h-64" />
                </div>
                
                <p className="text-5xl md:text-7xl font-medium text-gray-800 leading-relaxed relative z-10 text-center">
                  {gf.sentence.split('_____')[0]}
                  <span className="inline-block mx-4">
                    <input 
                      type="text" 
                      autoFocus
                      className="bg-white border-b-8 border-yellow-400 w-80 px-4 py-2 text-center font-bold text-yellow-700 focus:outline-none focus:border-yellow-600 rounded-t-xl shadow-inner placeholder-yellow-200"
                      placeholder="?"
                      value={gapFillAnswers[currentSlide.index] || ''}
                      onChange={(e) => setGapFillAnswers(prev => ({ ...prev, [currentSlide.index]: e.target.value }))}
                    />
                  </span>
                  {gf.sentence.split('_____')[1]}
                </p>

                <AnimatePresence>
                  {gapFillAnswers[currentSlide.index] && (
                    <motion.div 
                      initial={{ opacity: 0, y: 50, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring" }}
                      className="mt-12 text-center"
                    >
                       {isCorrect 
                         ? <span className="text-5xl font-bold text-green-600 flex items-center justify-center gap-4"><CheckCircle2 className="w-12 h-12"/> Perfect!</span> 
                         : <span className="text-4xl font-bold text-red-400">Hint: {gf.answer}</span>}
                    </motion.div>
                  )}
                </AnimatePresence>
             </motion.div>
          </div>
        );

      case 'KAHOOT':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-16">
                <span className="text-2xl font-black text-purple-500 tracking-[0.5em] uppercase">Gamification</span>
                <h1 className="text-8xl md:text-9xl font-black text-gray-900 mt-4 mb-8">Challenge Mode</h1>
             </motion.div>

             <div className="flex flex-col md:flex-row gap-8 w-full max-w-7xl justify-center">
                {module.kahootLinks.map((k, i) => (
                  <motion.a 
                    key={i}
                    custom={i+1}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    href={k.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -20, rotate: i % 2 === 0 ? 2 : -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 bg-purple-600 rounded-[3rem] p-12 shadow-2xl shadow-purple-500/30 flex flex-col items-center justify-center group relative overflow-hidden h-96"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 opacity-100" />
                     <div className="relative z-10">
                        <div className="bg-white text-purple-600 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg font-black text-3xl mx-auto">K!</div>
                        <h3 className="text-3xl font-bold text-white mb-2">{k.title}</h3>
                        <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                           <ExternalLink className="w-12 h-12 text-white mx-auto" />
                        </div>
                     </div>
                  </motion.a>
                ))}
             </div>
          </div>
        );

      case 'SPEAKING':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 max-w-6xl mx-auto w-full">
             <motion.div custom={0} variants={contentVariants} initial="hidden" animate="visible" className="mb-12">
               <span className="bg-red-100 text-red-600 px-6 py-2 rounded-full font-bold text-xl uppercase tracking-wider">Speaking Question {currentSlide.index + 1}</span>
             </motion.div>

             <motion.div custom={1} variants={contentVariants} initial="hidden" animate="visible" className="bg-white p-16 md:p-20 rounded-[4rem] shadow-2xl border border-gray-100 relative overflow-hidden w-full text-center">
                <div className="absolute top-0 left-0 w-full h-4 bg-red-500" />
                
                <h3 className="text-5xl md:text-7xl font-bold text-gray-800 mb-16 leading-tight">
                  "{module.speakingQuestions[currentSlide.index]}"
                </h3>

                <div className="flex justify-center transform scale-150 origin-center p-4">
                  <SpeakingRecorder />
                </div>
             </motion.div>
          </div>
        );

      case 'COMPLETION':
        return (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
             <motion.div 
               initial={{ scale: 0.5, opacity: 0 }}
               animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
               transition={{ type: "spring", delay: 0.2, duration: 1 }}
               className="bg-gradient-to-br from-green-400 to-emerald-600 p-20 rounded-full mb-12 shadow-2xl shadow-green-400/50"
             >
                <Trophy className="w-40 h-40 text-white" />
             </motion.div>
             <motion.h1 custom={1} variants={contentVariants} initial="hidden" animate="visible" className="text-8xl font-black text-gray-900 mb-8">Module Complete!</motion.h1>
             <motion.p custom={2} variants={contentVariants} initial="hidden" animate="visible" className="text-3xl text-gray-500 font-light max-w-3xl">
               You have successfully navigated through the grammar and vocabulary practice for this passage.
             </motion.p>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full bg-slate-50 relative overflow-hidden flex flex-col perspective-1000">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
           animate={{ 
             scale: [1, 1.2, 1],
             rotate: [0, 5, -5, 0],
             opacity: [0.3, 0.5, 0.3]
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-100/50 to-pink-100/50 blur-3xl" 
        />
        <motion.div 
           animate={{ 
             scale: [1, 1.5, 1],
             x: [0, -100, 0],
             opacity: [0.3, 0.4, 0.3]
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute top-[30%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-blue-100/50 to-green-100/50 blur-3xl" 
        />
      </div>

      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-3 bg-gray-100 z-50 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden perspective-1000">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlideIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full overflow-y-auto no-scrollbar"
            style={{ transformStyle: "preserve-3d" }}
          >
            {renderSlideContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="h-32 bg-white/80 backdrop-blur-xl border-t border-gray-200 flex items-center justify-between px-16 z-40 shrink-0 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]"
      >
         <motion.button
           onClick={() => paginate(-1)}
           disabled={currentSlideIndex === 0}
           whileHover={{ scale: 1.05, x: -10 }}
           whileTap={{ scale: 0.95 }}
           className={`flex items-center gap-4 text-xl font-bold px-10 py-5 rounded-full transition-all duration-300
             ${currentSlideIndex === 0 
                ? 'opacity-0 cursor-default' 
                : 'hover:bg-gray-100 text-gray-800'}
           `}
         >
           <ChevronLeft className="w-8 h-8" /> Previous
         </motion.button>

         <div className="text-sm font-bold text-gray-400 uppercase tracking-widest flex flex-col items-center gap-1">
            <span className="text-gray-900 font-black text-xl">{currentSlide.type.replace('_', ' ')}</span>
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
         </div>

         <motion.button
           onClick={() => paginate(1)}
           disabled={currentSlideIndex === slides.length - 1}
           whileHover={{ scale: 1.05, x: 10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
           whileTap={{ scale: 0.95 }}
           className={`flex items-center gap-4 text-xl font-bold px-12 py-5 rounded-full transition-all duration-300
             ${currentSlideIndex === slides.length - 1 
                ? 'opacity-30 cursor-not-allowed text-gray-400' 
                : 'bg-gray-900 text-white shadow-xl'}
           `}
         >
           Next <ChevronRight className="w-8 h-8" />
         </motion.button>
      </motion.div>
    </div>
  );
};

export default LanguagePracticeViewer;
