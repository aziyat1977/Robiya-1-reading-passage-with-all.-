
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
    <div className="h-full bg-white overflow-y-auto p-8 md:p-12 scroll-smooth">
      <AnimatePresence mode="popLayout">
        <motion.div 
           initial="hidden"
           animate="visible"
           variants={{
             visible: { transition: { staggerChildren: 0.1 } }
           }}
           className="space-y-12 max-w-3xl mx-auto pb-20"
        >
          {questions.map((q, idx) => (
            <motion.div 
              key={q.id}
              ref={(el) => (questionRefs.current[q.id] = el)}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
              }}
              className={`group rounded-2xl p-8 transition-all duration-500 ${targetQuestionId === q.id ? 'bg-blue-50/50 ring-2 ring-blue-100 shadow-lg' : 'hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <motion.span 
                    layout
                    className={`font-black w-12 h-12 flex items-center justify-center rounded-xl text-xl shadow-lg transition-all
                      ${answers[q.id] ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-gray-800 text-white shadow-gray-500/30'}
                    `}
                  >
                    {q.id}
                  </motion.span>
                  <span className="text-xs uppercase font-black text-gray-400 tracking-[0.1em]">
                    Select One Option
                  </span>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onFlag(q.id)}
                  className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-colors border-2
                    ${flagged.has(q.id) 
                      ? 'text-red-700 bg-red-50 border-red-200' 
                      : 'text-gray-400 bg-white border-gray-100 hover:border-gray-300 hover:text-gray-600'
                    }`}
                >
                  <Flag className={`w-3.5 h-3.5 ${flagged.has(q.id) ? 'fill-current' : ''}`} />
                  {flagged.has(q.id) ? 'FLAGGED' : 'FLAG'}
                </motion.button>
              </div>

              <p className="text-gray-900 font-bold text-xl md:text-2xl mb-8 leading-snug">
                {q.text}
              </p>

              <div className="space-y-4 pl-2">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.label;
                  return (
                    <motion.label 
                      key={opt.label} 
                      whileHover={{ scale: 1.01, x: 5 }}
                      whileTap={{ scale: 0.99 }}
                      className={`
                        flex items-center gap-5 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden group/label
                        ${isSelected 
                          ? 'border-blue-500 shadow-lg shadow-blue-500/10' 
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
                            borderColor: isSelected ? "#2563EB" : "#E5E7EB",
                            scale: isSelected ? 1.1 : 1
                          }}
                          className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors"
                        >
                          {isSelected && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                              className="w-3 h-3 bg-white rounded-full shadow-sm" 
                            />
                          )}
                        </motion.div>
                      </div>
                      
                      <motion.div 
                        className="flex-1 z-10"
                        animate={{ x: isSelected ? 4 : 0 }}
                      >
                        <span className={`font-black mr-3 text-lg transition-colors ${isSelected ? 'text-blue-700' : 'text-gray-300 group-hover/label:text-blue-400'}`}>{opt.label}</span>
                        <span className={`text-lg transition-colors ${isSelected ? 'text-gray-900 font-bold' : 'text-gray-600 font-medium'}`}>{opt.text}</span>
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
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionViewer;
