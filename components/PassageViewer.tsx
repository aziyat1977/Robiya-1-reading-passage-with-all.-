import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Passage } from '../types';

interface PassageViewerProps {
  passage: Passage;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 50, damping: 20 }
  }
};

const PassageViewer: React.FC<PassageViewerProps> = ({ passage }) => {
  return (
    <div className="h-full bg-slate-50 overflow-y-auto overflow-x-hidden p-8 border-r border-gray-300 shadow-[inset_-6px_0_12px_-4px_rgba(0,0,0,0.05)] scroll-smooth">
      <AnimatePresence mode="wait">
        <motion.div
          key={passage.id}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-8 border-b-2 border-gray-200 pb-6">
             <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em] mb-3">
               Reading Passage {passage.id}
             </h2>
             <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight tracking-tight">
               {passage.headline}
             </h1>
          </motion.div>
          
          <div className="prose prose-slate max-w-none text-gray-800 leading-relaxed font-serif text-lg md:text-xl">
            {passage.content.split('\n\n').map((para, idx) => (
              <motion.p 
                key={`${passage.id}-p-${idx}`} 
                variants={itemVariants}
                className="mb-6 indent-0 text-justify hyphens-auto"
              >
                {para}
              </motion.p>
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="mt-12 pt-6 border-t border-gray-200 text-center">
            <span className="text-sm text-gray-400 italic">End of Passage {passage.id}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PassageViewer;