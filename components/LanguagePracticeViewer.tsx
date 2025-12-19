
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PracticeModule } from '../types';
import { ChevronDown, BookOpen, CheckCircle2, Mic, BrainCircuit, ExternalLink, Activity } from 'lucide-react';
import SpeakingRecorder from './SpeakingRecorder';

interface LanguagePracticeViewerProps {
  module: PracticeModule;
}

const Section: React.FC<{ 
  title: string; 
  icon: React.ReactNode; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
            {icon}
          </div>
          <span className="font-bold text-gray-800 text-lg">{title}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 border-t border-gray-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const LanguagePracticeViewer: React.FC<LanguagePracticeViewerProps> = ({ module }) => {
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number | null>>({});
  const [gapFillAnswers, setGapFillAnswers] = useState<Record<number, string>>({});

  const checkGapFill = (index: number, input: string, correct: string) => {
    const isCorrect = input.trim().toLowerCase() === correct.toLowerCase();
    return isCorrect;
  };

  return (
    <div className="h-full bg-slate-50 overflow-y-auto p-8 border-r border-gray-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="mb-8">
           <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Language Focus</span>
           <h1 className="text-3xl font-serif font-bold text-gray-900 mt-2">{module.grammarTopic}</h1>
        </div>

        {/* MFP Section */}
        <Section title="Meaning, Form & Pronunciation" icon={<BookOpen className="w-5 h-5" />} defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-2">Meaning</h4>
              <p className="text-sm text-blue-800 leading-relaxed">{module.mfp.meaning}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-900 mb-2">Form</h4>
              <p className="text-sm font-mono text-purple-800">{module.mfp.form}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-green-900 mb-2">Pronunciation</h4>
              <p className="text-sm text-green-800">{module.mfp.pronunciation}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-bold text-gray-700 mb-4">Visual Timeline / Chart</h4>
            <div className="h-32 flex items-end justify-around border-b border-gray-300 pb-2 gap-4">
               {module.mfp.visualData.map((d, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 w-full">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${d.value}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className="w-full bg-indigo-500 rounded-t-md opacity-80 hover:opacity-100 transition-opacity"
                    />
                    <span className="text-xs font-bold text-gray-600">{d.label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="mt-6 space-y-3">
             <h4 className="font-bold text-gray-700">Examples from Text</h4>
             {module.examples.map((ex, i) => (
               <div key={i} className="flex gap-3 items-start bg-white p-3 rounded border border-gray-100 shadow-sm">
                 <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">{i + 1}</div>
                 <p className="text-gray-700 italic">"{ex}"</p>
               </div>
             ))}
          </div>
        </Section>

        {/* Quizzes & Tests */}
        <Section title="Quick Quizzes" icon={<CheckCircle2 className="w-5 h-5" />}>
           <div className="space-y-6">
             {module.quizzes.map((q, i) => (
               <div key={`quiz-${i}`} className="bg-white p-4 rounded-lg border border-gray-100">
                 <p className="font-medium text-gray-900 mb-3">{i+1}. {q.question}</p>
                 <div className="flex flex-wrap gap-2">
                   {q.options.map((opt, optIdx) => (
                     <button
                       key={optIdx}
                       onClick={() => setQuizAnswers(prev => ({ ...prev, [`quiz-${i}`]: optIdx }))}
                       className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border
                         ${quizAnswers[`quiz-${i}`] === optIdx 
                            ? (optIdx === q.correct ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300')
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}
                       `}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </Section>

        <Section title="Practice Tests" icon={<Activity className="w-5 h-5" />}>
            <div className="space-y-6">
             {module.tests.map((q, i) => (
               <div key={`test-${i}`} className="bg-white p-4 rounded-lg border border-gray-100">
                 <p className="font-medium text-gray-900 mb-3">{i+1}. {q.question}</p>
                 <div className="flex flex-col gap-2">
                   {q.options.map((opt, optIdx) => (
                     <button
                       key={optIdx}
                       onClick={() => setQuizAnswers(prev => ({ ...prev, [`test-${i}`]: optIdx }))}
                       className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors border
                         ${quizAnswers[`test-${i}`] === optIdx 
                            ? (optIdx === q.correct ? 'bg-green-50 text-green-900 border-green-200' : 'bg-red-50 text-red-900 border-red-200')
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}
                       `}
                     >
                       {opt}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
           </div>
        </Section>

        {/* Gap Fills */}
        <Section title="Gap Fill Exercises" icon={<BrainCircuit className="w-5 h-5" />}>
           <div className="space-y-4">
              {module.gapFills.map((gf, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100">
                  <p className="text-gray-800 leading-loose">
                    {i+1}. {gf.sentence.split('_____')[0]}
                    <input 
                      type="text" 
                      className="border-b-2 border-gray-400 bg-transparent px-2 py-0.5 w-32 focus:outline-none focus:border-blue-600 text-center font-bold text-blue-700"
                      onChange={(e) => setGapFillAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                    />
                    {gf.sentence.split('_____')[1]}
                  </p>
                  {gapFillAnswers[i] && (
                    <div className="text-xs font-bold pl-4">
                       {checkGapFill(i, gapFillAnswers[i], gf.answer) 
                         ? <span className="text-green-600">Correct!</span> 
                         : <span className="text-red-500">Try again (Hint: {gf.answer})</span>}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </Section>

        {/* Kahoot Links */}
        <Section title="Kahoot Challenges" icon={<ExternalLink className="w-5 h-5" />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {module.kahootLinks.map((k, i) => (
                 <a 
                   key={i} 
                   href={k.url} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="flex flex-col items-center justify-center p-6 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition-transform hover:-translate-y-1 text-center group"
                 >
                    <span className="font-extrabold text-2xl mb-1 group-hover:scale-110 transition-transform">K!</span>
                    <span className="text-sm font-bold opacity-90">{k.title}</span>
                 </a>
               ))}
            </div>
        </Section>

        {/* Speaking */}
        <Section title="Speaking Practice" icon={<Mic className="w-5 h-5" />}>
           <div className="space-y-6">
             {module.speakingQuestions.map((q, i) => (
               <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                 <div className="flex gap-3 mb-3">
                    <span className="bg-red-100 text-red-600 font-bold px-2 py-1 rounded text-xs h-fit">Q{i+1}</span>
                    <p className="text-gray-900 font-medium text-lg">{q}</p>
                 </div>
                 <SpeakingRecorder />
               </div>
             ))}
           </div>
        </Section>

      </div>
    </div>
  );
};

export default LanguagePracticeViewer;
