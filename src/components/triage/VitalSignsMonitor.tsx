"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Activity, Zap, Play, Pause, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PPGProcessor, HeartRateResult } from "@/utils/photoplethysmography";
import { useHealthData } from "@/contexts/HealthDataContext";

interface VitalSigns {
  heartRate: number | null;
  breathingRate: number | null;
  stressLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  heartRateVariability: number | null;
  timestamp: Date;
  confidence?: number;
  signalQuality?: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  recommendations?: string[];
}

interface MeasurementSession {
  id: string;
  vitals: VitalSigns;
  duration: number;
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export default function VitalSignsMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null);
  const [measurementHistory, setMeasurementHistory] = useState<MeasurementSession[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [measurementPhase, setMeasurementPhase] = useState<'IDLE' | 'PREPARING' | 'MEASURING' | 'PROCESSING'>('IDLE');
  const [realTimeHeartRate, setRealTimeHeartRate] = useState<number[]>([]);
  const [ppgResult, setPpgResult] = useState<HeartRateResult | null>(null);
  const { addVitalSigns } = useHealthData();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const ppgProcessorRef = useRef<PPGProcessor | null>(null);

  // Real photoplethysmography processing using camera
  const analyzeVideoFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || measurementPhase !== 'MEASURING') return;
    if (!ppgProcessorRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Get full frame image data for PPG processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      // Add sample to PPG processor
      ppgProcessorRef.current.addSample(imageData);
      
      // Calculate heart rate from accumulated samples
      const result = ppgProcessorRef.current.calculateHeartRate();
      setPpgResult(result);
      
      // Update real-time display if we have a valid heart rate
      if (result.heartRate && result.confidence > 0.3) {
        setRealTimeHeartRate(prev => [...prev.slice(-30), result.heartRate!]);
      }
      
    } catch (error) {
      console.error('PPG processing error:', error);
    }
    
    if (isMonitoring && measurementPhase === 'MEASURING') {
      animationFrameRef.current = requestAnimationFrame(analyzeVideoFrame);
    }
  }, [isMonitoring, measurementPhase]);

  const startCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use rear camera for better finger detection
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (error) {
      console.error('Camera access failed:', error);
      return false;
    }
  };

  const stopCameraAccess = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startMeasurement = async () => {
    setMeasurementPhase('PREPARING');
    setRealTimeHeartRate([]);
    setPpgResult(null);
    
    // Initialize PPG processor
    ppgProcessorRef.current = new PPGProcessor();
    
    const cameraStarted = await startCameraAccess();
    if (!cameraStarted) {
      alert('Camera access is required for vital signs monitoring. Please allow camera access.');
      setMeasurementPhase('IDLE');
      return;
    }

    // Countdown before measurement starts
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setMeasurementPhase('MEASURING');
          setIsMonitoring(true);
          startActualMeasurement();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startActualMeasurement = () => {
    // Start video analysis
    analyzeVideoFrame();
    
    // Measurement duration (30 seconds)
    intervalRef.current = setTimeout(() => {
      finishMeasurement();
    }, 30000);
  };

  const finishMeasurement = async () => {
    setIsMonitoring(false);
    setMeasurementPhase('PROCESSING');
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }

    // Final PPG calculation with all accumulated data
    let finalPpgResult: HeartRateResult | null = null;
    if (ppgProcessorRef.current) {
      finalPpgResult = ppgProcessorRef.current.calculateHeartRate();
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Use PPG results if available and confident, otherwise use fallback
    const heartRate = finalPpgResult && finalPpgResult.heartRate && finalPpgResult.confidence > 0.5
      ? finalPpgResult.heartRate
      : realTimeHeartRate.length > 0 
        ? Math.round(realTimeHeartRate.reduce((a, b) => a + b, 0) / realTimeHeartRate.length)
        : null;

    // Note: Breathing rate and HRV cannot be accurately measured via smartphone camera PPG
    const breathingRate = null; // Breathing rate detection not supported
    const hrv = null; // HRV calculation not supported
    
    let stressLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (heartRate && heartRate > 100) stressLevel = 'HIGH';
    else if (heartRate && heartRate > 90) stressLevel = 'MEDIUM';

    const newVitals: VitalSigns = {
      heartRate,
      breathingRate,
      stressLevel,
      heartRateVariability: hrv,
      timestamp: new Date(),
      confidence: finalPpgResult?.confidence || 0,
      signalQuality: finalPpgResult?.quality || 'POOR',
      recommendations: finalPpgResult?.recommendations
    };

    // Quality assessment based on PPG results and data availability
    const quality = finalPpgResult?.quality || 
                   (realTimeHeartRate.length > 20 ? 'GOOD' : 
                    realTimeHeartRate.length > 10 ? 'FAIR' : 'POOR');

    const session: MeasurementSession = {
      id: Date.now().toString(),
      vitals: newVitals,
      duration: 30,
      quality
    };

    setCurrentVitals(newVitals);
    setMeasurementHistory(prev => [session, ...prev.slice(0, 9)]);
    setMeasurementPhase('IDLE');
    
    // Add to health data context for dynamic scoring
    addVitalSigns(
      heartRate || undefined,
      breathingRate || undefined,
      stressLevel,
      hrv || undefined
    );
    
    stopCameraAccess();
  };

  const stopMeasurement = () => {
    setIsMonitoring(false);
    setMeasurementPhase('IDLE');
    setCountdown(0);
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    stopCameraAccess();
  };

  const resetMeasurement = () => {
    setCurrentVitals(null);
    setRealTimeHeartRate([]);
    setPpgResult(null);
    if (ppgProcessorRef.current) {
      ppgProcessorRef.current.clearSamples();
    }
  };

  const getVitalColor = (type: 'heartRate' | 'breathing' | 'stress', value: number | string | null) => {
    if (type === 'heartRate') {
      const hr = value as number | null;
      if (!hr) return 'text-gray-600';
      if (hr < 60 || hr > 100) return 'text-red-600';
      if (hr < 70 || hr > 90) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'breathing') {
      const br = value as number | null;
      if (!br) return 'text-gray-600';
      if (br < 12 || br > 20) return 'text-red-600';
      if (br < 14 || br > 18) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'stress') {
      const stress = value as string;
      if (stress === 'HIGH') return 'bg-red-100 text-red-800 border-red-200';
      if (stress === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'text-gray-600';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraAccess();
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">
            Vital Signs Monitor
          </h2>
          <motion.div
            animate={{ rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real photoplethysmography (PPG) implementation using smartphone camera with advanced signal processing algorithms
        </p>
      </motion.div>

      {/* Measurement Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Activity className="w-6 h-6" />
              Real-Time Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {measurementPhase === 'IDLE' && (
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                  <div className="space-y-3 text-left max-w-md mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <p className="text-gray-700">Cover rear camera completely with your fingertip</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <p className="text-gray-700">Keep your finger still for 30 seconds</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <p className="text-gray-700">Breathe normally and remain relaxed</p>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={startMeasurement}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8 py-4 text-lg font-semibold"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Start Vital Signs Monitoring
                  </Button>
                </motion.div>
              </div>
            )}

            {measurementPhase === 'PREPARING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl font-bold text-red-500"
                >
                  {countdown}
                </motion.div>
                <p className="text-lg text-gray-700">Place finger on camera now...</p>
                <Button
                  onClick={stopMeasurement}
                  variant="outline"
                  className="rounded-2xl"
                >
                  Cancel
                </Button>
              </motion.div>
            )}

            {measurementPhase === 'MEASURING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Camera Feed */}
                <div className="relative bg-gray-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-white text-sm font-medium mb-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    Monitoring Vital Signs...
                  </div>
                  
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-40 object-cover rounded-lg bg-gray-800"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="absolute inset-4 border-4 border-red-400 rounded-lg pointer-events-none animate-pulse"></div>
                  
                  {/* Real-time PPG Status */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-white text-sm mb-2">
                      <span>PPG Signal Analysis</span>
                      {ppgResult && (
                        <span className="font-bold">
                          {ppgResult.heartRate ? `${ppgResult.heartRate} BPM` : 'Analyzing...'}
                        </span>
                      )}
                    </div>
                    
                    {/* Signal Quality Indicator */}
                    {ppgResult && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-white/80 mb-1">
                          <span>Signal Quality</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            ppgResult.quality === 'EXCELLENT' ? 'bg-green-500' :
                            ppgResult.quality === 'GOOD' ? 'bg-blue-500' :
                            ppgResult.quality === 'FAIR' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {ppgResult.quality}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              ppgResult.quality === 'EXCELLENT' ? 'bg-green-500' :
                              ppgResult.quality === 'GOOD' ? 'bg-blue-500' :
                              ppgResult.quality === 'FAIR' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${ppgResult.confidence * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-white/60 mt-1">
                          Confidence: {Math.round(ppgResult.confidence * 100)}%
                        </div>
                      </div>
                    )}

                    {/* Real-time Heart Rate Waveform */}
                    {realTimeHeartRate.length > 0 && (
                      <div className="flex items-end gap-1 h-12 bg-gray-800 rounded p-2">
                        {realTimeHeartRate.slice(-20).map((rate, index) => (
                          <motion.div
                            key={index}
                            className="flex-1 bg-gradient-to-t from-red-500 to-pink-400 rounded-sm"
                            animate={{ height: `${Math.max(10, (rate - 40) / 80 * 100)}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Live Recommendations */}
                    {ppgResult && ppgResult.recommendations && ppgResult.recommendations.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-900/50 rounded text-xs text-yellow-200">
                        <div className="font-semibold mb-1">Tips for Better Signal:</div>
                        <ul className="space-y-1">
                          {ppgResult.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-700 mb-2">Keep your finger steady on the camera</p>
                  <Button
                    onClick={stopMeasurement}
                    variant="outline"
                    className="rounded-2xl"
                  >
                    Stop Measurement
                  </Button>
                </div>
              </motion.div>
            )}

            {measurementPhase === 'PROCESSING' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-12 h-12 text-red-500 mx-auto" />
                </motion.div>
                <p className="text-lg text-gray-700">Processing your vital signs...</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {currentVitals && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Heart className="w-6 h-6 text-red-600" />
                    Your Vital Signs
                  </CardTitle>
                  <Badge className={`${getVitalColor('stress', currentVitals.stressLevel)} font-semibold`}>
                    {currentVitals.stressLevel} STRESS
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Vital Signs Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Heart className="w-8 h-8 text-red-500" />
                      <h4 className="text-lg font-semibold text-gray-900">Heart Rate</h4>
                    </div>
                    <div className={`text-4xl font-bold ${getVitalColor('heartRate', currentVitals.heartRate)}`}>
                      {currentVitals.heartRate || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      BPM (Normal: 60-100)
                      {currentVitals.confidence !== undefined && (
                        <div className="text-xs text-blue-600 mt-1">
                          Confidence: {Math.round(currentVitals.confidence * 100)}%
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-blue-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Activity className="w-8 h-8 text-blue-500" />
                      <h4 className="text-lg font-semibold text-gray-900">Breathing Rate</h4>
                    </div>
                    <div className={`text-4xl font-bold ${getVitalColor('breathing', currentVitals.breathingRate)}`}>
                      {currentVitals.breathingRate || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      per min (Normal: 12-20)
                      {!currentVitals.breathingRate && (
                        <div className="text-xs text-amber-600 mt-1">
                          Not measurable via smartphone camera
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-purple-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-8 h-8 text-purple-500" />
                      <h4 className="text-lg font-semibold text-gray-900">Heart Rate Variability</h4>
                    </div>
                    <div className="text-4xl font-bold text-purple-600">
                      {currentVitals.heartRateVariability || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      ms (Higher is better)
                      {!currentVitals.heartRateVariability && (
                        <div className="text-xs text-amber-600 mt-1">
                          Requires advanced PPG analysis
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-amber-50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                      <h4 className="text-lg font-semibold text-gray-900">Overall Assessment</h4>
                    </div>
                    <div className="space-y-2">
                      <Badge className={`${getVitalColor('stress', currentVitals.stressLevel)} text-sm`}>
                        {currentVitals.stressLevel} Stress Level
                      </Badge>
                      {currentVitals.signalQuality && (
                        <Badge variant="outline" className={`text-xs ${
                          currentVitals.signalQuality === 'EXCELLENT' ? 'border-green-200 text-green-700' :
                          currentVitals.signalQuality === 'GOOD' ? 'border-blue-200 text-blue-700' :
                          currentVitals.signalQuality === 'FAIR' ? 'border-yellow-200 text-yellow-700' : 
                          'border-red-200 text-red-700'
                        }`}>
                          {currentVitals.signalQuality} Signal Quality
                        </Badge>
                      )}
                      <div className="text-sm text-gray-600">
                        Measured at {currentVitals.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recommendations */}
                <div className="bg-green-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-lg">Health Insights & PPG Analysis</h4>
                  <div className="space-y-2">
                    {/* Heart Rate Analysis */}
                    {!currentVitals.heartRate && (
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Unable to detect heart rate reliably</span>
                      </div>
                    )}
                    {currentVitals.heartRate && currentVitals.heartRate > 100 && (
                      <div className="text-orange-600 text-sm">Heart rate is elevated - ensure you're resting during measurement</div>
                    )}
                    {currentVitals.heartRate && currentVitals.heartRate >= 60 && currentVitals.heartRate <= 100 && currentVitals.stressLevel === 'LOW' && (
                      <div className="text-green-600 text-sm">✓ Heart rate appears within normal ranges</div>
                    )}

                    {/* Signal Quality Analysis */}
                    {currentVitals.signalQuality === 'POOR' && (
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Poor signal quality - measurement may be unreliable</span>
                      </div>
                    )}
                    {currentVitals.signalQuality === 'FAIR' && (
                      <div className="text-yellow-600 text-sm">Fair signal quality - consider re-measuring for better accuracy</div>
                    )}
                    {(currentVitals.signalQuality === 'GOOD' || currentVitals.signalQuality === 'EXCELLENT') && (
                      <div className="text-green-600 text-sm">✓ Good signal quality detected</div>
                    )}

                    {/* Confidence Score Analysis */}
                    {currentVitals.confidence !== undefined && currentVitals.confidence < 0.5 && (
                      <div className="text-orange-600 text-sm">Low confidence measurement - please try again with better finger placement</div>
                    )}

                    {/* PPG-specific recommendations */}
                    {currentVitals.recommendations && currentVitals.recommendations.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-2">PPG Measurement Tips:</div>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {currentVitals.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span className="text-blue-500">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Stress Level Analysis */}
                    {currentVitals.stressLevel === 'HIGH' && (
                      <>
                        <div className="flex items-center gap-2 text-red-700 mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Elevated stress indicators detected</span>
                        </div>
                        <div className="text-red-600 text-sm">Consider relaxation techniques or consult healthcare provider</div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={resetMeasurement}
                    variant="outline"
                    className="rounded-2xl px-6"
                  >
                    Clear Results
                  </Button>
                  <Button
                    onClick={startMeasurement}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-2xl px-6"
                  >
                    Measure Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Measurement History */}
      {measurementHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">Recent Measurements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {measurementHistory.slice(0, 3).map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="font-semibold text-red-600">
                          {session.vitals.heartRate || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-blue-600">
                          {session.vitals.breathingRate || 'N/A'}
                        </span>
                      </div>
                      <Badge className={`${getVitalColor('stress', session.vitals.stressLevel)} text-xs`}>
                        {session.vitals.stressLevel}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {session.vitals.timestamp.toLocaleDateString()}
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
        <Card className="bg-gradient-to-r from-red-50 to-amber-50 border-2 border-amber-300 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    IMPORTANT LIMITATIONS
                  </div>
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NOT MEDICAL DEVICE
                  </div>
                </div>
                <p className="font-semibold mb-2 text-red-900">⚠️ Smartphone PPG Vital Signs Limitations</p>
                <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                  <p className="text-xs font-semibold text-yellow-800 mb-1">CRITICAL ACCURACY NOTICE</p>
                  <p className="text-xs text-yellow-700">
                    This smartphone PPG implementation has significant accuracy limitations compared to medical-grade devices. 
                    Heart rate measurements may be inaccurate or unreliable.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-900">Technical Limitations:</h4>
                  <ul className="text-xs space-y-1 ml-3 text-amber-700">
                    <li>• <strong>Breathing rate and HRV cannot be measured</strong> via smartphone camera PPG</li>
                    <li>• Heart rate accuracy depends on proper finger placement, lighting, and camera quality</li>
                    <li>• Results may vary significantly between devices and environmental conditions</li>
                    <li>• Motion, ambient light, and skin tone can affect measurements</li>
                    <li>• No FDA approval or medical device certification</li>
                  </ul>
                </div>
                <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded">
                  <p className="text-xs font-bold text-red-800">
                    Use for educational/wellness tracking only. Never rely on these measurements for medical decisions. 
                    Consult healthcare professionals for accurate vital signs assessment.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}