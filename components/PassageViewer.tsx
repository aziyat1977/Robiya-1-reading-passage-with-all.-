
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
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 70, damping: 15 }
  }
};

const PassageViewer: React.FC<PassageViewerProps> = ({ passage }) => {
  return (
    <div className="h-full bg-slate-50 overflow-y-auto overflow-x-hidden p-8 md:p-12 border-r border-gray-300 shadow-[inset_-6px_0_12px_-4px_rgba(0,0,0,0.05)] scroll-smooth">
      <AnimatePresence mode="wait">
        <motion.div
          key={passage.id}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-10 border-b-2 border-gray-200 pb-8">
             <motion.span 
               initial={{ width: 0 }}
               animate={{ width: "100%" }}
               className="block h-1 bg-blue-600 mb-4 rounded-full"
             />
             <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.25em] mb-4">
               Reading Passage {passage.id}
             </h2>
             <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 leading-tight tracking-tight">
               {passage.headline}
             </h1>
          </motion.div>
          
          <div className="prose prose-slate prose-lg max-w-none text-gray-800 leading-relaxed font-serif">
            {passage.content.split('\n\n').map((para, idx) => (
              <motion.p 
                key={`${passage.id}-p-${idx}`} 
                variants={itemVariants}
                className="mb-8 indent-0 text-justify hyphens-auto"
              >
                {para}
              </motion.p>
            ))}
          </div>
          
          <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-gray-200 text-center">
            <span className="text-sm text-gray-400 italic font-medium">End of Passage {passage.id}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PassageViewer;
