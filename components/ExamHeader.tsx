import React, { useState } from 'react';
import { Clock, HelpCircle, EyeOff, Volume2, VolumeX, PauseCircle, PlayCircle, RotateCcw, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamHeaderProps {
  timeRemaining: number;
  isPaused: boolean;
  onPauseToggle: () => void;
  onRestart: () => void;
  onStop: () => void;
}

const ExamHeader: React.FC<ExamHeaderProps> = ({ 
  timeRemaining, 
  isPaused,
  onPauseToggle,
  onRestart,
  onStop
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
    <header className="h-16 bg-white border-b border-gray-300 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-20 relative select-none">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Candidate Name</span>
          <span className="text-sm font-bold text-gray-800">John Doe</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Candidate Number</span>
          <span className="text-sm font-bold text-gray-800">12345678</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <AnimatePresence mode="wait">
          {!isTimerHidden && (
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
              <span className="text-xs font-semibold uppercase ml-1">Time left</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        {/* Playback Controls */}
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
          {isPaused ? "Resume" : "Pause"}
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
          Restart
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
          Stop
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <button 
          onClick={() => setIsTimerHidden(!isTimerHidden)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
        >
          <EyeOff className="w-4 h-4" />
          {isTimerHidden ? 'Show Time' : 'Hide Time'}
        </button>
        
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-gray-100 active:bg-gray-200 text-gray-600 text-sm font-medium transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          Sound
        </button>
      </div>
    </header>
  );
};

export default ExamHeader;