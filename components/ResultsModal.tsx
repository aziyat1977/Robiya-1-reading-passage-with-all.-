import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PASSAGES } from '../constants';
import { Trophy, RotateCcw, XCircle } from 'lucide-react';

interface ResultsModalProps {
  answers: Record<number, string>;
  onClose: () => void;
}

const ResultsModal: React.FC<ResultsModalProps> = ({ answers, onClose }) => {
  const [displayScore, setDisplayScore] = useState(0);
  
  let score = 0;
  let total = 0;

  PASSAGES.forEach(p => {
    p.questions.forEach(q => {
      total++;
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });
  });

  const percentage = Math.round((score / total) * 100);

  let band = "N/A";
  if (percentage >= 88) band = "9.0";
  else if (percentage >= 80) band = "8.5";
  else if (percentage >= 75) band = "8.0";
  else if (percentage >= 70) band = "7.5";
  else if (percentage >= 65) band = "7.0";
  else if (percentage >= 60) band = "6.5";
  else if (percentage >= 50) band = "6.0";
  else if (percentage >= 40) band = "5.5";
  else band = "5.0 or lower";

  // Count up animation
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayScore(prev => {
        if (prev < score) return prev + 1;
        clearInterval(timer);
        return score;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white relative overflow-hidden">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm"
          >
            <Trophy className="w-10 h-10 text-yellow-300" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-1">Exam Completed</h2>
          <p className="text-blue-100">Performance Summary</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center"
            >
              <div className="text-5xl font-bold text-gray-900 mb-2">{displayScore}<span className="text-2xl text-gray-400">/{total}</span></div>
              <div className="text-xs uppercase font-bold text-gray-500 tracking-wider">Raw Score</div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-center"
            >
               <div className="text-5xl font-bold text-indigo-600 mb-2">{band}</div>
               <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">IELTS Band</div>
            </motion.div>
          </div>

          <div className="space-y-3">
             <button 
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              Start New Test
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsModal;