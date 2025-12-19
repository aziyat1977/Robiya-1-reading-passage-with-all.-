import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap, PlayCircle, Home } from 'lucide-react';
import { PASSAGES } from '../constants';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'landing' | 'exam' | 'practice', passageIndex?: number) => void;
}

const menuVariants = {
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  open: { 
    x: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.05,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  closed: { x: -20, opacity: 0 },
  open: { x: 0, opacity: 1 }
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, onSelectMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
          
          {/* Menu Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 bottom-0 w-80 bg-gray-900 z-50 shadow-2xl overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white font-bold text-xl tracking-wider">MENU</h2>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Home */}
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectMode('landing')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl text-left text-gray-100 transition-colors"
                >
                  <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="font-bold">Home</span>
                </motion.button>

                {/* Exam Mode */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Assessment</h3>
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(37, 99, 235, 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('exam')}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-left bg-blue-600/10 border border-blue-500/30 text-blue-100 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all group"
                  >
                    <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold block">Full Mock Exam</span>
                      <span className="text-xs text-blue-300">Timed • All Passages</span>
                    </div>
                  </motion.button>
                </motion.div>

                {/* Practice Modules */}
                <motion.div variants={itemVariants}>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 ml-2">Language Practice</h3>
                  <div className="space-y-3">
                    {PASSAGES.map((p, idx) => (
                      <motion.button
                        key={p.id}
                        variants={itemVariants}
                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectMode('practice', idx)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors border border-transparent
                          ${p.practiceModule ? 'text-gray-200 hover:border-gray-700' : 'text-gray-600 cursor-not-allowed'}
                        `}
                        disabled={!p.practiceModule}
                      >
                        <div className={`p-1.5 rounded-md ${p.practiceModule ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-600'}`}>
                          {p.practiceModule ? <GraduationCap className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="font-medium truncate text-sm">Passage {p.id}</div>
                           <div className="text-[10px] text-gray-500 truncate">{p.practiceModule?.grammarTopic || "No practice available"}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-800 mt-4">
               <div className="flex items-center gap-3 text-gray-500 text-xs">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 System Online
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarMenu;