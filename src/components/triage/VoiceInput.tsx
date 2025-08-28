"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause,
  Waves,
  Zap,
  AlertTriangle,
  Volume2,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceInputProps {
  onTranscriptionReceived: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function VoiceInput({ 
  onTranscriptionReceived, 
  disabled = false,
  placeholder = "Click to start recording your symptoms..."
}: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcription, setTranscription] = useState<string>("");
  const [error, setError] = useState<string>("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const animationRef = useRef<number>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for Whisper
        } 
      });
      
      streamRef.current = stream;

      // Set up audio analysis for visual feedback
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(Math.min(100, (average / 255) * 100));
          animationRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
        setAudioData(audioBlob);
        transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError("Unable to access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsRecording(false);
    setAudioLevel(0);
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      // Convert to the format expected by OpenAI Whisper
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      
      if (data.transcription) {
        setTranscription(data.transcription);
        onTranscriptionReceived(data.transcription);
      } else {
        throw new Error('No transcription received');
      }
      
    } catch (error) {
      console.error('Transcription error:', error);
      setError("Failed to transcribe audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Recording Interface */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-purple-200 rounded-3xl shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Header */}
            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">AI Voice Input</h3>
                <p className="text-sm text-gray-600">Powered by OpenAI Whisper</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                <Zap className="w-3 h-3 mr-1" />
                NEW
              </Badge>
            </div>

            {/* Recording Button */}
            <div className="relative">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled || isProcessing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-24 h-24 rounded-full border-4 transition-all duration-300 
                  ${isRecording 
                    ? 'bg-red-500 border-red-300 shadow-red-200' 
                    : 'bg-white border-purple-300 shadow-purple-200 hover:border-purple-400'
                  } 
                  shadow-xl hover:shadow-2xl
                  ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="animate-spin">
                        <Waves className="w-8 h-8 text-blue-600" />
                      </div>
                    </motion.div>
                  ) : isRecording ? (
                    <motion.div
                      key="recording"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Square className="w-8 h-8 text-white fill-current" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Mic className="w-8 h-8 text-purple-600" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Audio Level Indicator */}
                {isRecording && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-red-400"
                    animate={{ 
                      scale: [1, 1 + (audioLevel / 100) * 0.3, 1],
                      opacity: [0.3, 0.8, 0.3] 
                    }}
                    transition={{ 
                      duration: 0.5, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                )}
              </motion.button>
              
              {/* Recording Indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2">
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-blue-600"
                >
                  <div className="animate-spin">
                    <Waves className="w-4 h-4" />
                  </div>
                  <span className="font-medium">Processing with AI...</span>
                </motion.div>
              )}
              
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-red-600"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="font-medium">Recording {formatDuration(duration)}</span>
                </motion.div>
              )}
              
              {!isRecording && !isProcessing && (
                <p className="text-gray-600 text-sm">{placeholder}</p>
              )}
            </div>

            {/* Audio Level Visualization */}
            {isRecording && (
              <div className="flex justify-center">
                <div className="flex items-end gap-1 h-8">
                  {Array.from({ length: 12 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 bg-gradient-to-t from-blue-400 to-purple-400 rounded-full"
                      animate={{
                        height: [
                          8, 
                          Math.max(8, (audioLevel / 100) * 32 * Math.random() + 8), 
                          8
                        ]
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transcription Result */}
      <AnimatePresence>
        {transcription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-green-50 border-2 border-green-200 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-green-900">Voice Transcription</h4>
                      <Badge className="bg-green-100 text-green-800 border-green-300 text-xs">
                        AI Processed
                      </Badge>
                    </div>
                    <p className="text-green-800 leading-relaxed">"{transcription}"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Mic className="w-4 h-4" />
          Voice Input Tips
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Describe your symptoms in detail</li>
          <li>• Mention duration, severity, and location</li>
          <li>• Include any relevant medical history</li>
        </ul>
      </div>
    </div>
  );
}