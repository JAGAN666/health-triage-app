"use client";

import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Eye, AlertTriangle, CheckCircle, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHealthData } from "@/contexts/HealthDataContext";

interface VisualAnalysisResult {
  analysis: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendations: string[];
  urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
  confidence: number;
  error?: boolean;
}

interface AnalysisHistory {
  id: string;
  imageUrl: string;
  result: VisualAnalysisResult;
  timestamp: Date;
  description?: string;
}

export default function VisualSymptomAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisualAnalysisResult | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [description, setDescription] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { addVisualAnalysis } = useHealthData();

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    try {
      console.log('Starting image analysis...'); // Debug log
      
      const response = await fetch('/api/visual-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          description: description || 'Visual symptom analysis'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API response not ok:', response.status, errorData);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result: VisualAnalysisResult = await response.json();
      console.log('Analysis completed:', {
        hasError: !!result.error,
        confidence: result.confidence,
        analysisLength: result.analysis?.length || 0
      });

      setAnalysisResult(result);
      
      // Only add successful analyses to history (not errors)
      if (!result.error) {
        const historyItem: AnalysisHistory = {
          id: Date.now().toString(),
          imageUrl: selectedImage,
          result,
          timestamp: new Date(),
          description
        };
        
        setAnalysisHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
        
        // Add to health data context for dynamic scoring
        addVisualAnalysis(result.riskLevel, result.confidence);
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Provide detailed error feedback
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      let userFriendlyMessage = "I'm sorry, I couldn't analyze this image right now.";
      let errorRecommendations = ["Try taking a clearer photo", "Check your internet connection", "Try again in a few moments"];

      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('network')) {
        userFriendlyMessage = "Unable to connect to the analysis service. Please check your internet connection.";
        errorRecommendations = ["Check your internet connection", "Try again in a few moments", "If the issue persists, try refreshing the page"];
      } else if (errorMessage.includes('500') || errorMessage.includes('503')) {
        userFriendlyMessage = "The analysis service is temporarily unavailable.";
        errorRecommendations = ["Try again in a few minutes", "If urgent, consult a healthcare professional directly", "The service should be back online shortly"];
      }

      setAnalysisResult({
        analysis: `${userFriendlyMessage} ${error instanceof Error ? `(Error: ${error.message})` : ''} Please try again or consult with a healthcare professional if you have concerns.`,
        riskLevel: 'MEDIUM',
        recommendations: [...errorRecommendations, "Consult with a healthcare provider if you have health concerns"],
        urgency: 'ROUTINE',
        confidence: 0,
        error: true
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setDescription('');
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'ROUTINE': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'URGENT': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'EMERGENCY': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Eye className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Visual Symptom AI
          </h2>
          <motion.div
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced AI analysis of visual symptoms using cutting-edge computer vision technology
        </p>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Camera className="w-6 h-6" />
              Capture or Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedImage ? (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Camera Capture */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl flex flex-col items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Camera className="w-8 h-8" />
                    <span className="text-lg font-semibold">Take Photo</span>
                    <span className="text-sm opacity-90">Use your camera</span>
                  </Button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.div>

                {/* File Upload */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-purple-400 bg-white/50 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-white/70 transition-all duration-300"
                  >
                    <Upload className="w-8 h-8 text-gray-600" />
                    <span className="text-lg font-semibold text-gray-700">Upload Image</span>
                    <span className="text-sm text-gray-500">From your device</span>
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Selected for analysis"
                    className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                  />
                  <Button
                    onClick={clearAnalysis}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you're experiencing (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., 'Rash appeared 2 days ago, itchy and red'"
                    className="w-full p-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Analyze Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-4 text-lg font-semibold"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.div>
                        Analyzing with AI...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Analyze with AI Vision
                      </div>
                    )}
                  </Button>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-3xl ${
              analysisResult.error ? 'border-2 border-red-200' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    {analysisResult.error ? (
                      <AlertTriangle className="w-6 h-6 text-red-500" />
                    ) : (
                      getUrgencyIcon(analysisResult.urgency)
                    )}
                    {analysisResult.error ? 'Analysis Error' : 'AI Analysis Results'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {analysisResult.error ? (
                      <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold">
                        ERROR
                      </Badge>
                    ) : (
                      <Badge className={`${getRiskColor(analysisResult.riskLevel)} font-semibold`}>
                        {analysisResult.riskLevel} RISK
                      </Badge>
                    )}
                    {analysisResult.confidence > 0 && !analysisResult.error && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {Math.round(analysisResult.confidence * 100)}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                    {analysisResult.error ? 'Error Details' : 'Visual Analysis'}
                  </h4>
                  <p className={`text-gray-700 leading-relaxed p-4 rounded-xl ${
                    analysisResult.error ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                  }`}>
                    {analysisResult.analysis}
                  </p>
                  
                  {/* Success State - Confidence Interpretation */}
                  {analysisResult.confidence > 0 && !analysisResult.error && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-sm font-medium text-blue-900">
                          AI Confidence: {Math.round(analysisResult.confidence * 100)}%
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-bold ${
                          analysisResult.confidence >= 0.8 ? 'bg-green-500 text-white' :
                          analysisResult.confidence >= 0.6 ? 'bg-blue-500 text-white' :
                          analysisResult.confidence >= 0.4 ? 'bg-yellow-500 text-black' : 
                          'bg-red-500 text-white'
                        }`}>
                          {analysisResult.confidence >= 0.8 ? 'High' :
                           analysisResult.confidence >= 0.6 ? 'Moderate' :
                           analysisResult.confidence >= 0.4 ? 'Low' : 'Very Low'}
                        </div>
                      </div>
                      <p className="text-xs text-blue-800">
                        {analysisResult.confidence >= 0.8 
                          ? 'AI is relatively confident in this analysis, but medical verification still recommended.'
                          : analysisResult.confidence >= 0.6
                            ? 'AI has moderate confidence. Consider seeking professional medical opinion.'
                            : 'AI has low confidence in this analysis. Professional medical consultation strongly recommended.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Error State - Retry Information */}
                  {analysisResult.error && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <div className="text-sm font-medium text-yellow-800">
                          Analysis Temporarily Unavailable
                        </div>
                      </div>
                      <p className="text-xs text-yellow-700">
                        You can try uploading the image again, or if you have immediate health concerns, 
                        please consult with a healthcare professional directly.
                      </p>
                    </div>
                  )}
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                    {analysisResult.error ? 'Next Steps' : 'Recommendations'}
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-start gap-3 p-3 rounded-xl ${
                          analysisResult.error 
                            ? 'bg-orange-50 border border-orange-200' 
                            : 'bg-blue-50'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          analysisResult.error ? 'bg-orange-500' : 'bg-blue-500'
                        }`}></div>
                        <span className={`font-medium ${
                          analysisResult.error ? 'text-orange-900' : 'text-blue-900'
                        }`}>
                          {rec}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Error state - Add retry button */}
                  {analysisResult.error && (
                    <div className="mt-4 text-center">
                      <Button
                        onClick={() => {
                          setAnalysisResult(null);
                          setTimeout(() => analyzeImage(), 100);
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6"
                      >
                        Try Analysis Again
                      </Button>
                    </div>
                  )}
                </div>

                {/* Emergency Warning */}
                {analysisResult.urgency === 'EMERGENCY' && (
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-red-100 border border-red-300 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 text-red-800">
                      <AlertTriangle className="w-6 h-6" />
                      <div>
                        <p className="font-bold text-lg">Emergency Situation Detected</p>
                        <p>Please seek immediate medical attention or call emergency services.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {analysisHistory.slice(0, 3).map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt="Analysis history"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${getRiskColor(item.result.riskLevel)} text-xs`}>
                          {item.result.riskLevel}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {item.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.description || item.result.analysis}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">AI Visual Analysis Disclaimer</p>
                <p className="mb-2">
                  This AI visual analysis uses GPT-4V computer vision but has significant limitations:
                </p>
                <ul className="text-xs space-y-1 ml-3">
                  <li>• Cannot replace dermatologist or physician examination</li>
                  <li>• May miss subtle signs or misinterpret common conditions</li>
                  <li>• Confidence scores reflect AI certainty, not medical accuracy</li>
                  <li>• Cannot diagnose internal conditions from external images</li>
                  <li>• Always seek professional medical evaluation for health concerns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}