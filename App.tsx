
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PASSAGES, EXAM_DURATION_SECONDS } from './constants';
import ExamHeader from './components/ExamHeader';
import FooterNav from './components/FooterNav';
import PassageViewer from './components/PassageViewer';
import QuestionViewer from './components/QuestionViewer';
import LanguagePracticeViewer from './components/LanguagePracticeViewer';
import ResultsModal from './components/ResultsModal';
import ReviewModal from './components/ReviewModal';
import SidebarMenu from './components/SidebarMenu';
import { Lock, PlayCircle, Layout } from 'lucide-react';

type AppMode = 'landing' | 'exam' | 'practice';
type ViewState = 'exam' | 'review' | 'result';

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 0.3, ease: 'easeInOut' } }
};

const App: React.FC = () => {
  // Navigation & Mode State
  const [appMode, setAppMode] = useState<AppMode>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Exam/Passage State
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [viewState, setViewState] = useState<ViewState>('exam');
  const [isPaused, setIsPaused] = useState(false);
  
  // Resizer state (Only used in Exam Mode)
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Question scrolling state
  const [targetQuestionId, setTargetQuestionId] = useState<number | null>(null);

  // Timer logic - only runs in 'exam' mode
  useEffect(() => {
    if (appMode !== 'exam' || viewState === 'result' || isPaused) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [appMode, viewState, isPaused]);

  // Resizing Logic
  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback((e: MouseEvent) => {
    if (isResizing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidthPct(newLeftWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const handleAnswer = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleFlag = (qId: number) => {
    setFlagged(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleNavigate = (passageIdx: number, questionId: number) => {
    setCurrentPassageIndex(passageIdx);
    setTargetQuestionId(questionId);
    setViewState('exam');
  };

  const handleNavigateFromReview = (questionId: number) => {
    const passageIdx = PASSAGES.findIndex(p => p.questions.some(q => q.id === questionId));
    if (passageIdx !== -1) {
      handleNavigate(passageIdx, questionId);
    }
  };

  const handleSubmit = () => {
    setIsPaused(false);
    setViewState('result');
  };

  const handleRestart = () => {
    setCurrentPassageIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeLeft(EXAM_DURATION_SECONDS);
    setViewState('exam');
    setIsPaused(false);
    setTargetQuestionId(null);
  };

  const handleModeSelect = (mode: AppMode, passageIndex?: number) => {
    setAppMode(mode);
    setIsMenuOpen(false);
    
    // Reset specific states based on mode
    if (mode === 'landing') {
      setIsPaused(false);
    } else if (mode === 'exam') {
      handleRestart(); // Reset exam
    } else if (mode === 'practice') {
      if (passageIndex !== undefined) {
        setCurrentPassageIndex(passageIndex);
      }
      setIsPaused(false);
    }
  };

  const currentPassage = PASSAGES[currentPassageIndex];

  // Render Content Switcher
  const renderMainContent = () => {
    if (appMode === 'landing') {
      return (
        <motion.div 
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-gray-400 absolute inset-0 z-10"
          >
             <motion.div 
               initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
               animate={{ scale: 1, opacity: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
               className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl border-4 border-gray-100"
             >
                <Layout className="w-16 h-16 text-blue-500" />
             </motion.div>
             <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-black text-gray-800 mb-4 tracking-tight"
             >
               CD IELTS SIMULATOR 2025
             </motion.h1>
             <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl text-gray-500 font-light"
             >
               Tap the menu <span className="font-bold text-gray-800">top-left</span> to begin.
             </motion.p>
          </motion.div>
      );
    }

    if (appMode === 'practice') {
      // Full Screen Practice Mode (No Split)
      return (
         <motion.div 
           key="practice"
           variants={pageVariants}
           initial="initial"
           animate="animate"
           exit="exit"
           className="flex-1 w-full h-full bg-slate-50 relative overflow-hidden absolute inset-0 z-10"
         >
             <AnimatePresence mode="wait">
               {currentPassage.practiceModule ? (
                 <LanguagePracticeViewer key={`practice-${currentPassageIndex}`} module={currentPassage.practiceModule} />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p>No practice module available for this passage.</p>
                 </div>
               )}
             </AnimatePresence>
         </motion.div>
      );
    }

    // Exam Mode (Split Screen)
    return (
      <motion.div
        key="exam"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit" 
        className="flex-1 flex w-full h-full absolute inset-0 z-10"
      >
        {/* Left Pane: Passage */}
        <div style={{ width: `${leftWidthPct}%` }} className="h-full relative z-0 flex flex-col bg-slate-50 border-r border-gray-300">
          <div className="flex-1 overflow-hidden relative">
            <PassageViewer passage={currentPassage} />
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          onMouseDown={startResizing}
          className="w-2 bg-gray-200 hover:bg-blue-400 active:bg-blue-600 h-full cursor-col-resize z-20 flex items-center justify-center transition-colors shadow-[0_0_10px_rgba(0,0,0,0.1)] absolute"
          style={{ left: `${leftWidthPct}%`, transform: 'translateX(-50%)' }}
        >
            <div className="h-12 w-1.5 bg-gray-400 rounded-full pointer-events-none" />
        </div>

        {/* Right Pane: Questions */}
        <div style={{ width: `${100 - leftWidthPct}%` }} className="h-full bg-white relative z-0">
            <QuestionViewer 
              questions={currentPassage.questions}
              answers={answers}
              flagged={flagged}
              targetQuestionId={targetQuestionId}
              onAnswer={handleAnswer}
              onFlag={handleFlag}
            />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 selection:bg-blue-200 selection:text-blue-900 font-sans">
      <SidebarMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSelectMode={handleModeSelect} 
      />

      <ExamHeader 
        timeRemaining={timeLeft} 
        isPaused={isPaused}
        appMode={appMode}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
        onStop={handleSubmit}
        onMenuClick={() => setIsMenuOpen(true)}
      />

      {/* Main Content Area */}
      <main 
        ref={containerRef}
        className={`flex-1 flex overflow-hidden relative ${isResizing && appMode === 'exam' ? 'cursor-col-resize select-none' : ''}`}
      >
        <AnimatePresence mode="wait">
          {renderMainContent()}
        </AnimatePresence>

        {/* Pause Overlay (Only for Exam Mode) */}
        <AnimatePresence>
          {isPaused && appMode === 'exam' && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(15px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-50 bg-gray-900/60 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.5, y: 50, rotateX: 45 }}
                animate={{ scale: 1, y: 0, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 100 }}
                className="bg-white rounded-3xl p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] max-w-sm w-full text-center border border-white/20"
              >
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Lock className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Test Paused</h2>
                <p className="text-gray-500 mb-8 font-medium">Timer stopped. Take a breath.</p>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPaused(false)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30"
                >
                  <PlayCircle className="w-6 h-6" />
                  Resume Test
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer only in Exam Mode */}
      <AnimatePresence>
        {appMode === 'exam' && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="z-50"
          >
            <FooterNav 
              currentPassageIndex={currentPassageIndex}
              answers={answers}
              flagged={flagged}
              onNavigate={handleNavigate}
              onReview={() => setViewState('review')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewState === 'review' && appMode === 'exam' && (
          <ReviewModal 
            answers={answers}
            flagged={flagged}
            onNavigate={handleNavigateFromReview}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {viewState === 'result' && appMode === 'exam' && (
          <ResultsModal 
            answers={answers} 
            onClose={handleRestart} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
