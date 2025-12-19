
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
import { Lock, PlayCircle, BookOpen, GraduationCap } from 'lucide-react';

type ViewState = 'exam' | 'review' | 'result';
type LeftPanelMode = 'passage' | 'practice';

const App: React.FC = () => {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [viewState, setViewState] = useState<ViewState>('exam');
  const [isPaused, setIsPaused] = useState(false);
  const [leftPanelMode, setLeftPanelMode] = useState<LeftPanelMode>('passage');
  
  // Resizer state
  const [leftWidthPct, setLeftWidthPct] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Question scrolling state
  const [targetQuestionId, setTargetQuestionId] = useState<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (viewState === 'result' || isPaused) return;
    
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
  }, [viewState, isPaused]);

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
    setLeftPanelMode('passage'); // Reset to passage view on navigation
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
    setLeftPanelMode('passage');
  };

  const currentPassage = PASSAGES[currentPassageIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100 selection:bg-blue-200 selection:text-blue-900 font-sans">
      <ExamHeader 
        timeRemaining={timeLeft} 
        isPaused={isPaused}
        onPauseToggle={() => setIsPaused(!isPaused)}
        onRestart={handleRestart}
        onStop={handleSubmit}
      />

      {/* Main Split Screen Area */}
      <main 
        ref={containerRef}
        className={`flex-1 flex overflow-hidden relative ${isResizing ? 'cursor-col-resize select-none' : ''}`}
      >
        {/* Left Pane: Passage OR Practice */}
        <div style={{ width: `${leftWidthPct}%` }} className="h-full relative z-0 flex flex-col bg-slate-50 border-r border-gray-300">
          
          {/* Mode Toggle Header */}
          {currentPassage.practiceModule && (
             <div className="h-12 flex-shrink-0 border-b border-gray-200 bg-white flex">
                <button 
                  onClick={() => setLeftPanelMode('passage')}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${leftPanelMode === 'passage' ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <BookOpen className="w-4 h-4" /> Reading Text
                </button>
                <button 
                  onClick={() => setLeftPanelMode('practice')}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors ${leftPanelMode === 'practice' ? 'text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <GraduationCap className="w-4 h-4" /> Language Practice
                </button>
             </div>
          )}

          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {leftPanelMode === 'passage' ? (
                <motion.div 
                  key="passage"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <PassageViewer passage={currentPassage} />
                </motion.div>
              ) : (
                currentPassage.practiceModule && (
                  <motion.div 
                    key="practice"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <LanguagePracticeViewer module={currentPassage.practiceModule} />
                  </motion.div>
                )
              )}
            </AnimatePresence>
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

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && (
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

      <FooterNav 
        currentPassageIndex={currentPassageIndex}
        answers={answers}
        flagged={flagged}
        onNavigate={handleNavigate}
        onReview={() => setViewState('review')} 
      />

      {viewState === 'review' && (
        <ReviewModal 
          answers={answers}
          flagged={flagged}
          onNavigate={handleNavigateFromReview}
          onSubmit={handleSubmit}
        />
      )}

      {viewState === 'result' && (
        <ResultsModal 
          answers={answers} 
          onClose={handleRestart} 
        />
      )}
    </div>
  );
};

export default App;
