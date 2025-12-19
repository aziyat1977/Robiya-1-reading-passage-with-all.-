
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap, PlayCircle, Home, Zap } from 'lucide-react';
import { PASSAGES } from '../constants';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: 'landing' | 'exam' | 'practice', passageIndex?: number) => void;
}

const sidebarVariants = {
  closed: { 
    x: "-100%", 
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    transition: { type: "spring", stiffness: 400, damping: 40 }
  },
  open: { 
    x: 0, 
    boxShadow: "50px 0 100px -20px rgba(0,0,0,0.5)",
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      staggerChildren: 0.08,
      delayChildren: 0.1
    } 
  }
};

const itemVariants = {
  closed: { x: -50, opacity: 0, scale: 0.8 },
  open: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, onSelectMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(5px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40 cursor-pointer"
          />
          
          {/* Menu Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 bottom-0 w-80 bg-gray-900 z-50 overflow-y-auto border-r border-gray-800"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-gray-800/50">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="w-3 h-8 bg-blue-500 rounded-full" />
                <h2 className="text-white font-black text-2xl tracking-tight">MENU</h2>
              </motion.div>
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.2, color: "#EF4444" }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* Home */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectMode('landing')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left text-gray-100 transition-all group border border-transparent hover:border-gray-700"
              >
                <div className="p-3 bg-gray-800 rounded-xl text-gray-400 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                  <Home className="w-6 h-6" />
                </div>
                <span className="font-bold text-lg">Home</span>
              </motion.button>

              {/* Exam Mode */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-yellow-500" /> Assessment
                </h3>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSelectMode('exam')}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-left bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 text-blue-100 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-lg block">Full Mock Exam</span>
                    <span className="text-xs text-blue-300 font-medium">Timed Mode • Real Simulation</span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Practice Modules */}
              <motion.div variants={itemVariants}>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-2">Language Practice</h3>
                <div className="space-y-3">
                  {PASSAGES.map((p, idx) => (
                    <motion.button
                      key={p.id}
                      variants={itemVariants}
                      whileHover={{ x: 5, scale: 1.02, backgroundColor: "rgba(255,255,255,0.03)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectMode('practice', idx)}
                      className={`w-full flex items-center gap-4 p-3 rounded-xl text-left transition-all border border-transparent
                        ${p.practiceModule ? 'text-gray-200 hover:border-gray-700 cursor-pointer' : 'text-gray-600 cursor-not-allowed opacity-50'}
                      `}
                      disabled={!p.practiceModule}
                    >
                      <div className={`p-2 rounded-lg ${p.practiceModule ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-600'}`}>
                        {p.practiceModule ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-bold text-sm">Passage {p.id}</div>
                         <div className="text-[11px] text-gray-500 truncate font-medium">{p.practiceModule?.grammarTopic || "Coming soon"}</div>
                      </div>
                      {p.practiceModule && <div className="w-2 h-2 bg-indigo-500 rounded-full" />}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

            </div>
            
            {/* Animated Footer */}
            <motion.div 
               variants={itemVariants}
               className="p-6 border-t border-gray-800 mt-4 bg-gray-900/50 backdrop-blur-sm"
            >
               <div className="flex items-center gap-3 text-gray-500 text-xs font-mono">
                 <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                 </span>
                 v2.5.0 • SYSTEM ACTIVE
               </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidebarMenu;
