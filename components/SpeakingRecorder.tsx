
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Download, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const SpeakingRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'speaking_practice.webm';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
      {!audioBlob ? (
        !isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold shadow-md hover:bg-red-700"
          >
            <Mic className="w-4 h-4" /> Record Answer
          </motion.button>
        ) : (
          <motion.button
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
             onClick={stopRecording}
             className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-bold shadow-md hover:bg-gray-900"
          >
            <Square className="w-4 h-4 fill-current" /> Stop
          </motion.button>
        )
      ) : (
        <div className="flex items-center gap-2">
           <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={playAudio}
            className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
            title="Play"
           >
             <Play className="w-5 h-5 fill-current" />
           </motion.button>
           <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={downloadAudio}
            className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
            title="Download"
           >
             <Download className="w-5 h-5" />
           </motion.button>
           <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setAudioBlob(null)}
            className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-500"
            title="Delete & Retry"
           >
             <Trash2 className="w-5 h-5" />
           </motion.button>
           <span className="text-xs text-gray-500 font-medium ml-2">Recording saved</span>
        </div>
      )}
    </div>
  );
};

export default SpeakingRecorder;
