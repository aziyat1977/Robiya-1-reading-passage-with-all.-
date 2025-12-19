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
    <footer className="h-16 bg-gray-900 border-t border-gray-700 flex items-center justify-between px-4 flex-shrink-0 z-30 text-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-4 w-32">
        <span className="text-sm font-medium text-gray-300">Question Palette</span>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 flex-1 justify-center py-2">
        {allQuestions.map((q) => {
          const isAnswered = !!answers[q.id];
          const isCurrentPassage = q.passageIndex === currentPassageIndex;
          const isFlagged = flagged.has(q.id);

          return (
            <motion.button
              key={q.id}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(q.passageIndex, q.id)}
              className={`
                w-8 h-8 rounded-sm text-xs font-bold flex items-center justify-center relative transition-colors duration-200
                ${isCurrentPassage 
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-gray-900' 
                  : isAnswered 
                    ? 'bg-gray-200 text-gray-900 hover:bg-white' 
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }
                ${isFlagged ? 'rounded-full' : ''}
              `}
              title={`Go to Question ${q.id}`}
            >
              {q.id}
              {isFlagged && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-gray-900 z-10" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 w-32 justify-end">
        <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={onReview}
           className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded shadow-lg transition-colors"
        >
          Review
        </motion.button>
      </div>
    </footer>
  );
};

export default FooterNav;