"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Camera,
  Smartphone,
  Watch,
  Wifi,
  WifiOff,
  Play,
  Pause,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VitalSigns {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  temperature: number;
  respiratoryRate: number;
  timestamp: Date;
}

interface HealthAlert {
  id: string;
  type: 'warning' | 'critical';
  message: string;
  vital: string;
  value: number;
  timestamp: Date;
}

interface MonitoringSession {
  id: string;
  startTime: Date;
  duration: number;
  isActive: boolean;
  vitals: VitalSigns[];
}

export default function HealthMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentVitals, setCurrentVitals] = useState<VitalSigns | null>(null);
  const [vitalsHistory, setVitalsHistory] = useState<VitalSigns[]>([]);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [session, setSession] = useState<MonitoringSession | null>(null);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [monitoringMethod, setMonitoringMethod] = useState<'camera' | 'device' | 'manual'>('camera');
  const [error, setError] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const monitoringIntervalRef = useRef<NodeJS.Timeout>();
  const heartRateDetectionRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, []);

  const startMonitoring = async () => {
    try {
      if (monitoringMethod === 'camera') {
        await initializeCameraMonitoring();
      } else if (monitoringMethod === 'device') {
        await initializeDeviceMonitoring();
      } else {
        await initializeManualMonitoring();
      }

      const newSession: MonitoringSession = {
        id: Date.now().toString(),
        startTime: new Date(),
        duration: 0,
        isActive: true,
        vitals: []
      };

      setSession(newSession);
      setIsMonitoring(true);
      startVitalsCollection();

    } catch (error) {
      console.error('Failed to start monitoring:', error);
      
      // Provide more specific error messages
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';
        
      if (errorMessage.includes('Permission denied')) {
        setError('Camera and microphone permissions are required for monitoring. Please allow access and try again.');
      } else if (errorMessage.includes('NotFoundError')) {
        setError('No camera or microphone found. Please check your device connections.');
      } else {
        setError(`Failed to start monitoring: ${errorMessage}. Please try again.`);
      }
    }
  };

  const initializeCameraMonitoring = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 30 }
      },
      audio: false
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    setCameraAccess(true);
    setDeviceConnected(true);
  };

  const initializeDeviceMonitoring = async () => {
    // Simulate Bluetooth device connection
    // In real implementation, this would connect to actual health devices
    await new Promise(resolve => setTimeout(resolve, 2000));
    setDeviceConnected(true);
  };

  const initializeManualMonitoring = async () => {
    // Manual monitoring doesn't require device connection
    setDeviceConnected(true);
  };

  const startVitalsCollection = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }

    monitoringIntervalRef.current = setInterval(() => {
      if (monitoringMethod === 'camera') {
        detectVitalsFromCamera();
      } else if (monitoringMethod === 'device') {
        collectVitalsFromDevice();
      } else {
        generateMockVitals();
      }
    }, 1000); // Collect vitals every second
  };

  const detectVitalsFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas for analysis
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Get image data for heart rate detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Simplified heart rate detection using color changes
    // Real implementation would use more sophisticated algorithms
    const avgRed = calculateAverageRed(imageData);
    heartRateDetectionRef.current.push(avgRed);
    
    // Keep only last 300 samples (30 seconds at 10 Hz)
    if (heartRateDetectionRef.current.length > 300) {
      heartRateDetectionRef.current.shift();
    }

    // Calculate heart rate from the red channel variations
    const heartRate = calculateHeartRateFromSignal(heartRateDetectionRef.current);
    
    // Generate other vitals (mock data for demo)
    const newVitals: VitalSigns = {
      heartRate: heartRate || Math.floor(Math.random() * (100 - 60) + 60),
      bloodPressureSystolic: Math.floor(Math.random() * (140 - 110) + 110),
      bloodPressureDiastolic: Math.floor(Math.random() * (90 - 70) + 70),
      oxygenSaturation: Math.floor(Math.random() * (100 - 95) + 95),
      temperature: Math.random() * (99.5 - 97.5) + 97.5,
      respiratoryRate: Math.floor(Math.random() * (20 - 12) + 12),
      timestamp: new Date()
    };

    updateVitals(newVitals);
  };

  const calculateAverageRed = (imageData: ImageData): number => {
    let totalRed = 0;
    let pixelCount = 0;
    
    // Sample every 4th pixel for performance
    for (let i = 0; i < imageData.data.length; i += 16) {
      totalRed += imageData.data[i]; // Red channel
      pixelCount++;
    }
    
    return totalRed / pixelCount;
  };

  const calculateHeartRateFromSignal = (signal: number[]): number | null => {
    if (signal.length < 60) return null;
    
    // Simple peak detection algorithm
    // Real implementation would use FFT or autocorrelation
    let peaks = 0;
    const threshold = signal.reduce((a, b) => a + b) / signal.length;
    
    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i - 1] && 
          signal[i] > signal[i + 1] && 
          signal[i] > threshold) {
        peaks++;
      }
    }
    
    // Convert to BPM (assuming 10 Hz sampling rate)
    const minutes = (signal.length / 10) / 60;
    return Math.round(peaks / minutes);
  };

  const collectVitalsFromDevice = () => {
    // Simulate reading from connected health devices
    const newVitals: VitalSigns = {
      heartRate: Math.floor(Math.random() * (100 - 60) + 60),
      bloodPressureSystolic: Math.floor(Math.random() * (140 - 110) + 110),
      bloodPressureDiastolic: Math.floor(Math.random() * (90 - 70) + 70),
      oxygenSaturation: Math.floor(Math.random() * (100 - 95) + 95),
      temperature: Math.random() * (99.5 - 97.5) + 97.5,
      respiratoryRate: Math.floor(Math.random() * (20 - 12) + 12),
      timestamp: new Date()
    };

    updateVitals(newVitals);
  };

  const generateMockVitals = () => {
    // Generate realistic mock vitals for demonstration
    const baseHeartRate = 72;
    const variation = Math.sin(Date.now() / 10000) * 10;
    
    const newVitals: VitalSigns = {
      heartRate: Math.round(baseHeartRate + variation + (Math.random() - 0.5) * 5),
      bloodPressureSystolic: Math.floor(Math.random() * (130 - 110) + 110),
      bloodPressureDiastolic: Math.floor(Math.random() * (85 - 70) + 70),
      oxygenSaturation: Math.floor(Math.random() * (100 - 96) + 96),
      temperature: 98.6 + (Math.random() - 0.5) * 1,
      respiratoryRate: Math.floor(Math.random() * (18 - 14) + 14),
      timestamp: new Date()
    };

    updateVitals(newVitals);
  };

  const updateVitals = (newVitals: VitalSigns) => {
    setCurrentVitals(newVitals);
    setVitalsHistory(prev => [...prev.slice(-299), newVitals]); // Keep last 5 minutes

    // Check for alerts
    checkVitalAlerts(newVitals);

    // Update session
    if (session) {
      const updatedSession = {
        ...session,
        duration: Date.now() - session.startTime.getTime(),
        vitals: [...session.vitals.slice(-59), newVitals] // Keep last minute for session
      };
      setSession(updatedSession);
    }
  };

  const checkVitalAlerts = (vitals: VitalSigns) => {
    const newAlerts: HealthAlert[] = [];

    // Heart rate alerts
    if (vitals.heartRate > 100) {
      newAlerts.push({
        id: Date.now() + '-hr-high',
        type: vitals.heartRate > 120 ? 'critical' : 'warning',
        message: 'Heart rate elevated',
        vital: 'Heart Rate',
        value: vitals.heartRate,
        timestamp: new Date()
      });
    } else if (vitals.heartRate < 60) {
      newAlerts.push({
        id: Date.now() + '-hr-low',
        type: vitals.heartRate < 50 ? 'critical' : 'warning',
        message: 'Heart rate low',
        vital: 'Heart Rate',
        value: vitals.heartRate,
        timestamp: new Date()
      });
    }

    // Blood pressure alerts
    if (vitals.bloodPressureSystolic > 140 || vitals.bloodPressureDiastolic > 90) {
      newAlerts.push({
        id: Date.now() + '-bp-high',
        type: 'warning',
        message: 'Blood pressure elevated',
        vital: 'Blood Pressure',
        value: vitals.bloodPressureSystolic,
        timestamp: new Date()
      });
    }

    // Oxygen saturation alerts
    if (vitals.oxygenSaturation < 95) {
      newAlerts.push({
        id: Date.now() + '-o2-low',
        type: vitals.oxygenSaturation < 90 ? 'critical' : 'warning',
        message: 'Oxygen saturation low',
        vital: 'O₂ Saturation',
        value: vitals.oxygenSaturation,
        timestamp: new Date()
      });
    }

    // Temperature alerts
    if (vitals.temperature > 100.4) {
      newAlerts.push({
        id: Date.now() + '-temp-high',
        type: vitals.temperature > 102 ? 'critical' : 'warning',
        message: 'Temperature elevated',
        vital: 'Temperature',
        value: vitals.temperature,
        timestamp: new Date()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]); // Keep last 10 alerts
    }
  };

  const stopMonitoring = () => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current);
    }

    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    setIsMonitoring(false);
    setSession(prev => prev ? { ...prev, isActive: false } : null);
    setCameraAccess(false);
    setDeviceConnected(false);
  };

  const getVitalStatus = (vital: string, value: number): 'normal' | 'warning' | 'critical' => {
    switch (vital) {
      case 'heartRate':
        if (value > 120 || value < 50) return 'critical';
        if (value > 100 || value < 60) return 'warning';
        return 'normal';
      case 'bloodPressure':
        if (value > 140) return 'warning';
        return 'normal';
      case 'oxygenSaturation':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'normal';
      case 'temperature':
        if (value > 102) return 'critical';
        if (value > 100.4) return 'warning';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    }
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Health Monitor</h2>
          <p className="text-gray-600 mt-1">Real-time vital signs monitoring</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isMonitoring && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">LIVE</span>
            </div>
          )}
          
          <Badge className={deviceConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
            {deviceConnected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
            {deviceConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
      </div>

      {/* Monitoring Method Selection */}
      {!isMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle>Choose Monitoring Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMonitoringMethod('camera')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  monitoringMethod === 'camera' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Camera className="w-6 h-6 mb-2 text-blue-600" />
                <h3 className="font-semibold">Camera Detection</h3>
                <p className="text-sm text-gray-600">Use camera for heart rate detection</p>
              </button>

              <button
                onClick={() => setMonitoringMethod('device')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  monitoringMethod === 'device' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Watch className="w-6 h-6 mb-2 text-blue-600" />
                <h3 className="font-semibold">Connected Devices</h3>
                <p className="text-sm text-gray-600">Bluetooth health devices</p>
              </button>

              <button
                onClick={() => setMonitoringMethod('manual')}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  monitoringMethod === 'manual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Smartphone className="w-6 h-6 mb-2 text-blue-600" />
                <h3 className="font-semibold">Manual Entry</h3>
                <p className="text-sm text-gray-600">Enter vitals manually</p>
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Monitoring Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Panel */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isMonitoring ? (
                <Button onClick={startMonitoring} size="lg" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-5 h-5 mr-2" />
                  Start Monitoring
                </Button>
              ) : (
                <Button onClick={stopMonitoring} size="lg" variant="destructive">
                  <Square className="w-5 h-5 mr-2" />
                  Stop Monitoring
                </Button>
              )}
            </div>

            {session && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Session Duration</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatDuration(session.duration)}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Camera Feed (if using camera method) */}
      {monitoringMethod === 'camera' && isMonitoring && (
        <Card>
          <CardHeader>
            <CardTitle>Camera Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full max-w-md rounded-lg"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="hidden"
                width={320}
                height={240}
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                Heart Rate Detection Active
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Vitals */}
      {currentVitals && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="font-medium">Heart Rate</span>
                </div>
                <Badge className={getStatusColor(getVitalStatus('heartRate', currentVitals.heartRate))}>
                  {getVitalStatus('heartRate', currentVitals.heartRate)}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentVitals.heartRate}
                <span className="text-lg font-normal text-gray-500 ml-1">bpm</span>
              </div>
              <Progress 
                value={(currentVitals.heartRate / 150) * 100} 
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Blood Pressure</span>
                </div>
                <Badge className={getStatusColor(getVitalStatus('bloodPressure', currentVitals.bloodPressureSystolic))}>
                  {getVitalStatus('bloodPressure', currentVitals.bloodPressureSystolic)}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentVitals.bloodPressureSystolic}/{currentVitals.bloodPressureDiastolic}
                <span className="text-lg font-normal text-gray-500 ml-1">mmHg</span>
              </div>
              <Progress 
                value={(currentVitals.bloodPressureSystolic / 200) * 100} 
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-500" />
                  <span className="font-medium">O₂ Saturation</span>
                </div>
                <Badge className={getStatusColor(getVitalStatus('oxygenSaturation', currentVitals.oxygenSaturation))}>
                  {getVitalStatus('oxygenSaturation', currentVitals.oxygenSaturation)}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentVitals.oxygenSaturation}
                <span className="text-lg font-normal text-gray-500 ml-1">%</span>
              </div>
              <Progress 
                value={currentVitals.oxygenSaturation} 
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-orange-500" />
                  <span className="font-medium">Temperature</span>
                </div>
                <Badge className={getStatusColor(getVitalStatus('temperature', currentVitals.temperature))}>
                  {getVitalStatus('temperature', currentVitals.temperature)}
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentVitals.temperature.toFixed(1)}
                <span className="text-lg font-normal text-gray-500 ml-1">°F</span>
              </div>
              <Progress 
                value={((currentVitals.temperature - 95) / 10) * 100} 
                className="w-full"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="font-medium">Respiratory Rate</span>
                </div>
                <Badge className="text-green-600 bg-green-50 border-green-200">
                  normal
                </Badge>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {currentVitals.respiratoryRate}
                <span className="text-lg font-normal text-gray-500 ml-1">rpm</span>
              </div>
              <Progress 
                value={(currentVitals.respiratoryRate / 30) * 100} 
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 border rounded-lg ${
                    alert.type === 'critical' 
                      ? 'border-red-200 bg-red-50' 
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {alert.type === 'critical' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          alert.type === 'critical' ? 'text-red-900' : 'text-yellow-900'
                        }`}>
                          {alert.message}
                        </p>
                        <p className={`text-sm ${
                          alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {alert.vital}: {alert.value}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs ${
                      alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}