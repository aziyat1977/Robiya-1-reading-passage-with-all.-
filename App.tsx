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
import { Lock, PlayCircle, BookOpen, GraduationCap, Layout } from 'lucide-react';

type AppMode = 'landing' | 'exam' | 'practice';
type ViewState = 'exam' | 'review' | 'result';

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
  
  // Resizer state
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
        className={`flex-1 flex overflow-hidden relative ${isResizing && appMode !== 'landing' ? 'cursor-col-resize select-none' : ''}`}
      >
        {appMode === 'landing' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-gray-400"
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6"
             >
                <Layout className="w-10 h-10 text-gray-400" />
             </motion.div>
             <h1 className="text-2xl font-bold text-gray-600 mb-2">Welcome to CD IELTS Simulator</h1>
             <p className="text-gray-400">Open the menu in the top-left to begin.</p>
          </motion.div>
        ) : (
          <>
            {/* Left Pane */}
            <div style={{ width: `${leftWidthPct}%` }} className="h-full relative z-0 flex flex-col bg-slate-50 border-r border-gray-300">
              <div className="flex-1 overflow-hidden relative">
                {appMode === 'exam' && (
                  <PassageViewer passage={currentPassage} />
                )}
                {appMode === 'practice' && currentPassage.practiceModule && (
                  <LanguagePracticeViewer module={currentPassage.practiceModule} />
                )}
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

            {/* Right Pane */}
            <div style={{ width: `${100 - leftWidthPct}%` }} className="h-full bg-white relative z-0">
               {appMode === 'exam' ? (
                 <QuestionViewer 
                   questions={currentPassage.questions}
                   answers={answers}
                   flagged={flagged}
                   targetQuestionId={targetQuestionId}
                   onAnswer={handleAnswer}
                   onFlag={handleFlag}
                 />
               ) : (
                 // In Practice Mode, show Passage for context on right
                 <PassageViewer passage={currentPassage} />
               )}
            </div>
          </>
        )}

        {/* Pause Overlay (Only for Exam Mode) */}
        <AnimatePresence>
          {isPaused && appMode === 'exam' && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-50 bg-gray-900/60 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full text-center"
              >
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Paused</h2>
                <p className="text-gray-500 mb-8">The exam timer has been stopped. The content is hidden while paused.</p>
                
                <button 
                  onClick={() => setIsPaused(false)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/20"
                >
                  <PlayCircle className="w-5 h-5" />
                  Resume Test
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer only in Exam Mode */}
      {appMode === 'exam' && (
        <FooterNav 
          currentPassageIndex={currentPassageIndex}
          answers={answers}
          flagged={flagged}
          onNavigate={handleNavigate}
          onReview={() => setViewState('review')} 
        />
      )}

      {viewState === 'review' && appMode === 'exam' && (
        <ReviewModal 
          answers={answers}
          flagged={flagged}
          onNavigate={handleNavigateFromReview}
          onSubmit={handleSubmit}
        />
      )}

      {viewState === 'result' && appMode === 'exam' && (
        <ResultsModal 
          answers={answers} 
          onClose={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;