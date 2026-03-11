import React, { useState, useRef } from 'react';
import Icon from '@/components/AppIcon';
import { transcribeAudio, summarizeClinicalNotes } from '@/api/ai/groq';

const VoiceRecorderButton = ({ onTranscriptionResult }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

      mediaRecorderRef.current.onstop = async () => {
        const mimeType = mediaRecorderRef.current.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const extension = mimeType.split('/')[1]?.split(';')[0] || 'webm';
        const audioFile = new File([audioBlob], `recording.${extension}`, { type: mimeType });
        processAudio(audioFile);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const processAudio = async (file) => {
    setIsProcessing(true);
    try {
      // 1. Transcribir
      const transcription = await transcribeAudio(file);
      
      // 2. Resumir
      const summary = await summarizeClinicalNotes(transcription);
      
      onTranscriptionResult(summary || transcription);
    } catch (err) {
      console.error("Error processing audio:", err);
      alert(`Error de IA: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`p-2 rounded-lg transition-all flex items-center justify-center ${
        isRecording 
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
          : 'bg-blue-50 text-[#0E39B1] hover:bg-blue-100'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isRecording ? "Detener grabación" : "Dictado por voz (AI)"}
    >
      {isProcessing ? (
        <Icon name="Loader2" size={18} className="animate-spin" />
      ) : (
        <Icon name={isRecording ? "MicOff" : "Mic"} size={18} />
      )}
    </button>
  );
};

export default VoiceRecorderButton;
