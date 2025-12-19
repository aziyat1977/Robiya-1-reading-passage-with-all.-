import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types';
import { Flag } from 'lucide-react';

interface QuestionViewerProps {
  questions: Question[];
  answers: Record<number, string>;
  flagged: Set<number>;
  targetQuestionId: number | null;
  onAnswer: (questionId: number, answer: string) => void;
  onFlag: (questionId: number) => void;
}

const QuestionViewer: React.FC<QuestionViewerProps> = ({ 
  questions, 
  answers, 
  flagged,
  targetQuestionId,
  onAnswer,
  onFlag
}) => {
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (targetQuestionId && questionRefs.current[targetQuestionId]) {
      questionRefs.current[targetQuestionId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [targetQuestionId, questions]);

  return (
    <div className="h-full bg-white overflow-y-auto p-8 scroll-smooth">
      <AnimatePresence mode="popLayout">
        <div className="space-y-12 max-w-3xl mx-auto pb-20">
          {questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className={`group rounded-xl p-6 transition-colors duration-300 ${targetQuestionId === q.id ? 'bg-blue-50/50 ring-2 ring-blue-100' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <motion.span 
                    layout
                    className={`font-bold w-10 h-10 flex items-center justify-center rounded-lg text-lg shadow-sm transition-colors
                      ${answers[q.id] ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}
                    `}
                  >
                    {q.id}
                  </motion.span>
                  <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">
                    Select one option
                  </span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFlag(q.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors border
                    ${flagged.has(q.id) 
                      ? 'text-red-700 bg-red-50 border-red-200' 
                      : 'text-gray-400 bg-white border-gray-200 hover:text-gray-600 hover:border-gray-300'
                    }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged.has(q.id) ? 'fill-current' : ''}`} />
                  {flagged.has(q.id) ? 'FLAGGED' : 'FLAG'}
                </motion.button>
              </div>

              <p className="text-gray-900 font-medium text-lg md:text-xl mb-6 leading-snug">
                {q.text}
              </p>

              <div className="space-y-3 pl-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.label;
                  return (
                    <motion.label 
                      key={opt.label} 
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors duration-200 relative overflow-hidden
                        ${isSelected 
                          ? 'border-blue-500 shadow-md' 
                          : 'bg-white border-gray-100 hover:border-blue-200'
                        }
                      `}
                    >
                      <div className="relative flex-shrink-0 z-10">
                        <input 
                          type="radio" 
                          name={`question-${q.id}`} 
                          value={opt.label}
                          checked={isSelected}
                          onChange={() => onAnswer(q.id, opt.label)}
                          className="peer sr-only"
                        />
                        <motion.div 
                          initial={false}
                          animate={{
                            backgroundColor: isSelected ? "#2563EB" : "#FFFFFF",
                            borderColor: isSelected ? "#2563EB" : "#D1D5DB",
                            scale: isSelected ? 1.1 : 1
                          }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        >
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" 
                            />
                          )}
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="flex-1 z-10"
                        animate={{ x: isSelected ? 6 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <span className={`font-bold mr-3 transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-400'}`}>{opt.label}</span>
                        <span className={`transition-colors ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{opt.text}</span>
                      </motion.div>
                      
                      {isSelected && (
                        <motion.div 
                          layoutId={`highlight-${q.id}`}
                          className="absolute inset-0 bg-blue-50 z-0"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionViewer;