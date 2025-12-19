
import React, { useState } from 'react';
import { Clock, EyeOff, Volume2, VolumeX, PauseCircle, PlayCircle, RotateCcw, Power, Menu } from 'lucide-react';
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

  const isLowTime = timeRemaining < 300; 

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm flex-shrink-0 z-30 relative select-none">
      
      {/* Left: Menu & Identity */}
      <div className="flex items-center gap-6">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="p-3 bg-gray-100 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </motion.button>

        <div className="h-10 w-px bg-gray-200 hidden md:block"></div>

        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Candidate</span>
          <span className="text-base font-bold text-gray-900">John Doe</span>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Number</span>
          <span className="text-base font-bold text-gray-900">12345678</span>
        </div>
      </div>

      {/* Center: Timer */}
      <div className="flex items-center justify-center flex-1">
        <AnimatePresence mode="wait">
          {appMode === 'exam' && !isTimerHidden && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`flex items-center gap-3 px-6 py-2 rounded-full ${isLowTime && !isPaused ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-900 border border-blue-100'}`}
            >
              <Clock className={`w-5 h-5 ${isLowTime && !isPaused ? 'animate-ping' : ''}`} />
              <motion.span 
                key={timeRemaining}
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-mono font-bold w-[100px] text-center"
              >
                {formatTime(timeRemaining)}
              </motion.span>
              <span className="text-xs font-black uppercase tracking-widest opacity-60 hidden sm:inline">Time Left</span>
            </motion.div>
          )}
          {appMode === 'practice' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-bold flex items-center gap-3 bg-indigo-600 px-6 py-2 rounded-full shadow-lg shadow-indigo-200"
            >
               <span className="text-sm uppercase tracking-[0.2em]">Practice Mode</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-3">
        {appMode === 'exam' && (
          <>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPauseToggle}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm
                ${isPaused 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                }`}
            >
              {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              <span className="hidden lg:inline">{isPaused ? "Resume" : "Pause"}</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#F3F4F6" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if(window.confirm("Are you sure you want to restart the test? All progress will be lost.")) {
                  onRestart();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-bold shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden lg:inline">Restart</span>
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "#FEF2F2", color: "#DC2626" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if(window.confirm("Are you sure you want to stop and submit the test?")) {
                  onStop();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-red-500 text-sm font-bold shadow-sm"
            >
              <Power className="w-4 h-4" />
              <span className="hidden lg:inline">Stop</span>
            </motion.button>

            <div className="w-px h-8 bg-gray-200 mx-1 hidden lg:block"></div>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsTimerHidden(!isTimerHidden)}
              className="hidden lg:flex p-3 rounded-xl hover:bg-gray-100 text-gray-500"
              title={isTimerHidden ? "Show Timer" : "Hide Timer"}
            >
              <EyeOff className="w-5 h-5" />
            </motion.button>
          </>
        )}
        
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-3 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </motion.button>
      </div>
    </header>
  );
};

export default ExamHeader;
