import React, { useState } from 'react';
import { Clock, HelpCircle, EyeOff, Volume2, VolumeX, PauseCircle, PlayCircle, RotateCcw, Power, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamHeaderProps {
  timeRemaining: number;
  isPaused: boolean;
  appMode: 'landing' | 'exam' | 'practice';
  onPauseToggle: () => void;
  onRestart: () => void;
  onStop: () => void;
  onMenuClick: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  timeRemaining, 
  isPaused,
  appMode,
  onPauseToggle,
  onRestart,
  onStop,
  onMenuClick
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTimerHidden, setIsTimerHidden] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemaining < 300; // Red alert under 5 mins

  return (
    <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-4 shadow-sm flex-shrink-0 z-20 relative select-none">
      
      {/* Left: Menu & Identity */}
      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        <div className="h-8 w-px bg-gray-300 hidden md:block"></div>

        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Candidate Name</span>
          <span className="text-sm font-bold text-gray-800">John Doe</span>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Candidate Number</span>
          <span className="text-sm font-bold text-gray-800">12345678</span>
        </div>
      </div>

      {/* Center: Timer (Only in Exam Mode) */}
      <div className="flex items-center justify-center flex-1">
        <AnimatePresence mode="wait">
          {appMode === 'exam' && !isTimerHidden && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-2 ${isLowTime && !isPaused ? 'text-red-600' : 'text-blue-900'}`}
            >
              <Clock className={`w-5 h-5 ${isLowTime && !isPaused ? 'animate-pulse' : ''}`} />
              <motion.span 
                key={timeRemaining}
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-mono font-bold w-[90px] text-center"
              >
                {formatTime(timeRemaining)}
              </motion.span>
              <span className="text-xs font-semibold uppercase ml-1 hidden sm:inline">Time left</span>
            </motion.div>
          )}
          {appMode === 'practice' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-indigo-600 font-bold flex items-center gap-2 bg-indigo-50 px-4 py-1.5 rounded-full"
            >
               <span className="text-sm uppercase tracking-wider">Practice Mode</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {appMode === 'exam' && (
          <>
            <button 
              onClick={onPauseToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors
                ${isPaused 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                }`}
              title={isPaused ? "Resume Test" : "Pause Test"}
            >
              {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              <span className="hidden lg:inline">{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button 
              onClick={() => {
                if(window.confirm("Are you sure you want to restart the test? All progress will be lost.")) {
                  onRestart();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
              title="Restart Test"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden lg:inline">Restart</span>
            </button>

            <button 
              onClick={() => {
                if(window.confirm("Are you sure you want to stop and submit the test?")) {
                  onStop();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-red-50 active:bg-red-100 text-red-600 text-sm font-medium transition-colors"
              title="Stop & Submit"
            >
              <Power className="w-4 h-4" />
              <span className="hidden lg:inline">Stop</span>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 hidden lg:block"></div>

            <button 
              onClick={() => setIsTimerHidden(!isTimerHidden)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              {isTimerHidden ? 'Show' : 'Hide'}
            </button>
          </>
        )}
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
          title="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

export default ExamHeader;