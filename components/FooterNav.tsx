
import React from 'react';
import { PASSAGES } from '../constants';
import { motion } from 'framer-motion';

interface FooterNavProps {
  currentPassageIndex: number;
  answers: Record<number, string>;
  flagged: Set<number>;
  onNavigate: (passageIndex: number, questionId: number) => void;
  onReview: () => void;
}

const FooterNav: React.FC<FooterNavProps> = ({ 
  currentPassageIndex, 
  answers, 
  flagged,
  onNavigate,
  onReview
}) => {
  
  const allQuestions = PASSAGES.flatMap((p, pIdx) => 
    p.questions.map(q => ({ ...q, passageIndex: pIdx }))
  );

  return (
    <footer className="h-20 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-6 flex-shrink-0 z-30 text-white shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 w-40">
        <span className="text-sm font-bold text-gray-400 tracking-wider uppercase">Palette</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 flex-1 justify-center py-2">
        {allQuestions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrentPassage = q.passageIndex === currentPassageIndex;
          const isFlagged = flagged.has(q.id);

          return (
            <motion.button
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.2, y: -5, zIndex: 10 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => onNavigate(q.passageIndex, q.id)}
              className={`
                w-9 h-9 rounded-lg text-xs font-bold flex items-center justify-center relative transition-colors duration-200
                ${isCurrentPassage 
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-900' 
                  : isAnswered 
                    ? 'bg-gray-100 text-gray-900 hover:bg-white' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }
                ${isFlagged ? 'ring-2 ring-red-500' : ''}
              `}
              title={`Go to Question ${q.id}`}
            >
              {q.id}
              {isFlagged && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900 z-10" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 w-40 justify-end">
        <motion.button 
           whileHover={{ scale: 1.05, backgroundColor: "#3B82F6" }}
           whileTap={{ scale: 0.95 }}
           onClick={onReview}
           className="px-6 py-2.5 bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg transition-colors"
        >
          Review All
        </motion.button>
      </div>
    </footer>
  );
};

export default FooterNav;
