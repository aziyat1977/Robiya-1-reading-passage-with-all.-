import React from 'react';
import { motion } from 'framer-motion';
import { PASSAGES } from '../constants';
import { Flag, CheckCircle, Circle, ArrowLeft, Send } from 'lucide-react';

interface ReviewModalProps {
  answers: Record<number, string>;
  flagged: Set<number>;
  onNavigate: (questionId: number) => void;
  onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ answers, flagged, onNavigate, onSubmit }) => {
  const allQuestions = PASSAGES.flatMap((p) => p.questions);
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const unansweredCount = allQuestions.length - answeredCount;

  return (
    <div className="absolute inset-0 bg-gray-100 z-50 flex flex-col overflow-hidden">
      <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="w-2 h-8 bg-blue-600 rounded-full"/>
          Review Your Answers
        </h1>
        <div className="flex gap-6 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600" />
            <span className="text-gray-600">Answered ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">Flagged ({flaggedCount})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border border-gray-400" />
            <span className="text-gray-600">Unanswered ({unansweredCount})</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allQuestions.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = flagged.has(q.id);
            
            return (
              <motion.button
                key={q.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => onNavigate(q.id)}
                className={`
                  relative h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all group
                  ${isAnswered 
                    ? 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md' 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <span className={`
                  text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center
                  ${isAnswered ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-500'}
                `}>
                  {q.id}
                </span>
                <span className="text-xs text-gray-400 font-medium">Passage {Math.floor(idx/5) + 1}</span>
                
                {isFlagged && (
                  <div className="absolute top-2 right-2 text-red-500">
                    <Flag className="w-4 h-4 fill-current" />
                  </div>
                )}
                {isAnswered && !isFlagged && (
                  <div className="absolute top-2 right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <footer className="h-24 bg-white border-t border-gray-200 px-8 flex items-center justify-between shrink-0">
        <button 
          onClick={() => onNavigate(1)} // Default back to start if cancelling review
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Exam
        </button>
        
        <button 
          onClick={onSubmit}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 shadow-lg hover:scale-105 transition-all"
        >
          Submit Exam
          <Send className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default ReviewModal;