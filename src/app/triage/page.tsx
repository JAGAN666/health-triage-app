"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, AlertTriangle, Shield, Phone, Mic, Bot, User, Heart, MapPin, Clock, Volume2 } from "lucide-react";
import Link from "next/link";
import RiskAssessment from "@/components/triage/RiskAssessment";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/common/LanguageSelector";
import AnimationErrorBoundary from "@/components/common/AnimationErrorBoundary";
import { useAnimationFallback } from "@/hooks/useAnimationFallback";
import VoiceInput from "@/components/triage/VoiceInput";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TriageResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  actionPlan: string[];
  emergency?: boolean;
  confidence?: number;
}

const SYMPTOM_CHIPS = [
  "Fever", "Cough", "Headache", "Chest pain", "Difficulty breathing",
  "Abdominal pain", "Nausea", "Dizziness", "Fatigue", "Anxiety",
  "Depression", "Back pain", "Joint pain"
];

export default function TriagePage() {
  const { language, t } = useLanguage();
  const { animationFallbackActive, preferReducedMotion } = useAnimationFallback();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial-fallback',
      content: 'Fallback message: Chat interface is loading...',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [animationFallback, setAnimationFallback] = useState(false);
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting message in selected language
  useEffect(() => {
    console.log('Initializing triage greeting message...');
    console.log('Current language:', language);
    console.log('Translation function available:', typeof t);
    
    const greeting = t('triage.greeting') || "Hello! I'm your AI health triage assistant. I can help assess your symptoms and provide guidance on next steps. Please describe what you're experiencing.";
    const disclaimer = t('triage.disclaimer') || "⚠️ **Important Limitations**:\n• This is NOT medical advice or diagnosis\n• AI assessments may be incomplete or incorrect\n• Cannot replace professional medical evaluation\n• In emergencies, call 911 immediately\n• Confidence scores show AI certainty, not medical accuracy";
    
    console.log('Greeting text:', greeting);
    console.log('Disclaimer text:', disclaimer);
    
    if (!greeting || !disclaimer) {
      console.error('Translation failed!', { greeting, disclaimer, language });
    }
    
    const initialMessage = {
      id: '1',
      content: `${greeting}\n\n${disclaimer}`,
      sender: 'ai' as const,
      timestamp: new Date()
    };
    
    console.log('Setting initial message:', initialMessage);
    setMessages([initialMessage]);
    
    // Verify the state was actually set
    setTimeout(() => {
      console.log('Messages state after setting - checking via DOM');
    }, 100);
  }, [language, t]);

  // Check for pre-filled symptoms from symptom checker
  useEffect(() => {
    const symptomDescription = sessionStorage.getItem('symptomDescription');
    if (symptomDescription) {
      setInputValue(symptomDescription);
      sessionStorage.removeItem('symptomDescription');
    }
  }, []);

  // Animation fallback timeout - ensure interface is visible even if animations fail
  useEffect(() => {
    const animationTimeoutId = setTimeout(() => {
      console.log('Animation timeout triggered - enabling fallback mode');
      setAnimationFallback(true);
    }, 2000); // 2 second timeout

    // Clear timeout if component unmounts
    return () => clearTimeout(animationTimeoutId);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const addSymptomChip = (symptom: string) => {
    setInputValue(prev => prev ? `${prev}, ${symptom}` : symptom);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate API call to OpenAI
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (data.triageResult) {
        setTriageResult(data.triageResult);
        
        // Save session to localStorage for history
        const session = {
          id: Date.now().toString(),
          symptoms: userMessage.content,
          riskLevel: data.triageResult.riskLevel,
          rationale: data.triageResult.rationale,
          actionPlan: data.triageResult.actionPlan,
          messages: [...messages, userMessage, aiMessage],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          const existingSessions = JSON.parse(localStorage.getItem('triageSessions') || '[]');
          const updatedSessions = [session, ...existingSessions].slice(0, 50); // Keep last 50 sessions
          localStorage.setItem('triageSessions', JSON.stringify(updatedSessions));
        } catch (error) {
          console.error('Failed to save session to localStorage:', error);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again, or if this is an emergency, call 911 immediately.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoiceTranscription = (transcription: string) => {
    setInputValue(transcription);
    setShowVoiceInput(false);
    
    // Optionally auto-send the voice input
    setTimeout(() => {
      if (transcription.trim()) {
        // Add voice indicator to the message
        const userMessage: Message = {
          id: Date.now().toString(),
          content: `🎤 ${transcription}`,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        
        // Send to AI for processing
        sendMessageToAI(transcription);
      }
    }, 500);
  };

  // Separate function to handle AI processing (extracted from sendMessage)
  const sendMessageToAI = async (content: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          language: language
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      if (data.triageResult) {
        setTriageResult(data.triageResult);
        
        // Save session to localStorage for history
        const session = {
          id: Date.now().toString(),
          symptoms: content,
          riskLevel: data.triageResult.riskLevel,
          rationale: data.triageResult.rationale,
          actionPlan: data.triageResult.actionPlan,
          messages: messages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        try {
          const existingSessions = JSON.parse(localStorage.getItem('triageSessions') || '[]');
          const updatedSessions = [session, ...existingSessions].slice(0, 50);
          localStorage.setItem('triageSessions', JSON.stringify(updatedSessions));
        } catch (error) {
          console.error('Failed to save session to localStorage:', error);
        }
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again, or if this is an emergency, call 911 immediately.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-red-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Modern Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 shadow-lg"
        style={{ opacity: 1 }} // CSS fallback to ensure visibility
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </motion.div>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-blue-900">
                    {t('triage.title')}
                  </h1>
                  <p className="text-sm text-gray-600">{t('triage.subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Alert */}
      {triageResult?.emergency && (
        <div className="bg-red-600 text-white p-4">
          <div className="container mx-auto flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div className="flex-1">
              <p className="font-semibold">EMERGENCY SITUATION DETECTED</p>
              <p className="text-sm">Please call emergency services immediately</p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => window.open('tel:911')}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 911
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modern Chat Interface */}
          <div className="lg:col-span-2">
            <AnimationErrorBoundary>
              <motion.div
              initial={animationFallbackActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={animationFallbackActive ? { duration: 0 } : { duration: 0.6 }}
              style={{ 
                opacity: animationFallbackActive ? 1 : undefined, 
                transform: animationFallbackActive ? 'translateY(0px)' : undefined 
              }} // Comprehensive fallback system
              className={animationFallbackActive ? 'opacity-100 transform-none' : ''}
            >
              <Card className="h-[700px] flex flex-col bg-white/60 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
                {/* Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {console.log('Rendering messages:', messages.length, messages)}
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ opacity: 1, transform: 'translateY(0px)' }} // CSS fallback
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar */}
                          <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                              : 'bg-gradient-to-r from-purple-500 to-pink-500'
                          }`}>
                            {message.sender === 'user' ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>
                          
                          {/* Message Bubble */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`relative p-4 rounded-3xl shadow-lg ${
                              message.sender === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                                : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800'
                            }`}
                          >
                            {/* Message tail */}
                            <div className={`absolute bottom-4 w-0 h-0 ${
                              message.sender === 'user' 
                                ? 'right-[-8px] border-l-[12px] border-l-blue-500 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                                : 'left-[-8px] border-r-[12px] border-r-white/80 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent'
                            }`}></div>
                            
                            <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                              {message.content}
                            </div>
                            <div className={`text-xs mt-2 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              {message.timestamp.toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex justify-start"
                    >
                      <div className="flex items-end gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm border border-gray-200/50 p-4 rounded-3xl shadow-lg">
                          <div className="flex items-center gap-2 text-gray-600">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                              className="w-2 h-2 bg-pink-400 rounded-full"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                            <span className="ml-2 text-sm font-medium">AI is analyzing...</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Modern Input Area */}
                <div className="border-t border-gray-200/20 bg-gray-50/50 backdrop-blur-sm p-6">
                  {/* Symptom Chips */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ opacity: 1, transform: 'translateY(0px)' }} // CSS fallback
                    className="mb-4"
                  >
                    <p className="text-sm text-gray-600 font-medium mb-3">Quick symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOM_CHIPS.slice(0, 6).map((symptom, index) => (
                        <motion.div
                          key={symptom}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          style={{ opacity: 1, transform: 'scale(1)' }} // CSS fallback
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs bg-white/60 hover:bg-white/80 border-gray-200/50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300 rounded-full"
                            onClick={() => addSymptomChip(symptom)}
                          >
                            {symptom}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Enhanced Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{ opacity: 1, transform: 'translateY(0px)' }} // CSS fallback
                    className="flex gap-3"
                  >
                    <div className="flex-1 relative">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('triage.placeholder')}
                        disabled={isLoading}
                        className="w-full bg-white/80 backdrop-blur-sm border-gray-200/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 rounded-2xl py-4 px-5 text-sm font-medium placeholder:text-gray-400 transition-all duration-300"
                      />
                      <motion.button
                        onClick={() => setShowVoiceInput(!showVoiceInput)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 ${
                          showVoiceInput 
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-600' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
                        }`}
                        title="AI Voice Input (OpenAI Whisper)"
                        disabled={isLoading}
                      >
                        {showVoiceInput ? <Volume2 className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </motion.button>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Voice Input Component */}
                  <AnimatePresence>
                    {showVoiceInput && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-200/20">
                          <VoiceInput
                            onTranscriptionReceived={handleVoiceTranscription}
                            disabled={isLoading}
                            placeholder="Describe your symptoms using voice..."
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
              </motion.div>
            </AnimationErrorBoundary>
          </div>

          {/* Modern Sidebar */}
          <div className="space-y-6">
            {/* Safety Disclaimer */}
            <AnimationErrorBoundary>
              <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ opacity: 1, transform: 'translateX(0px)' }} // CSS fallback
            >
              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900 mb-2 text-lg">Medical Disclaimer</h3>
                      <p className="text-sm text-amber-800 font-medium leading-relaxed">
                        This is <span className="font-black">informational only</span>, NOT medical advice. 
                        Call <span className="font-black text-red-700">911</span> for emergencies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </AnimationErrorBoundary>

            {/* Enhanced Triage Results */}
            {triageResult && (
              <AnimationErrorBoundary>
                <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ opacity: 1, transform: 'translateX(0px)' }} // CSS fallback
              >
                <RiskAssessment
                  riskLevel={triageResult.riskLevel}
                  rationale={triageResult.rationale}
                  actionPlan={triageResult.actionPlan}
                  emergency={triageResult.emergency}
                  confidence={triageResult.confidence}
                  timestamp={new Date()}
                  onExportPDF={() => {
                    // TODO: Implement PDF export
                    alert('PDF export functionality coming soon!');
                  }}
                />
                </motion.div>
              </AnimationErrorBoundary>
            )}

            {/* Quick Actions */}
            <AnimationErrorBoundary>
              <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ opacity: 1, transform: 'translateX(0px)' }} // CSS fallback
            >
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/mental-health">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="w-full justify-start bg-white/60 hover:bg-white/80 border-pink-200 hover:border-pink-300 text-pink-700 hover:text-pink-800 rounded-2xl py-3">
                          <Heart className="w-4 h-4 mr-2" />
                          Mental Health Check
                        </Button>
                      </motion.div>
                    </Link>
                    
                    <Link href="/resources">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="w-full justify-start bg-white/60 hover:bg-white/80 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 rounded-2xl py-3">
                          <MapPin className="w-4 h-4 mr-2" />
                          Find Resources
                        </Button>
                      </motion.div>
                    </Link>
                    
                    <Link href="/history">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" className="w-full justify-start bg-white/60 hover:bg-white/80 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 rounded-2xl py-3">
                          <Clock className="w-4 h-4 mr-2" />
                          View History
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              </motion.div>
            </AnimationErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}