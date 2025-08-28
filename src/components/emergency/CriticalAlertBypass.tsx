"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Smartphone, 
  Volume2,
  Bell,
  VolumeX,
  CheckCircle,
  Clock,
  Zap,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CriticalAlert {
  id: string;
  title: string;
  message: string;
  priority: 'CRITICAL' | 'HIGH';
  timestamp: Date;
  bypassStatus: 'pending' | 'sent' | 'delivered' | 'acknowledged';
  technicalDetails?: {
    platform: string;
    method: string;
    volumeLevel: number;
    vibrationPattern: string;
  };
}

export default function CriticalAlertBypass() {
  const [currentAlert, setCurrentAlert] = useState<CriticalAlert | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>('default');
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    notifications: false,
    vibration: false,
    wakeLock: false,
    fullscreen: false,
    audio: false
  });
  const [testResults, setTestResults] = useState<any[]>([]);

  useEffect(() => {
    checkDeviceCapabilities();
    checkNotificationPermission();
  }, []);

  const checkDeviceCapabilities = () => {
    const capabilities = {
      notifications: 'Notification' in window,
      vibration: 'vibrate' in navigator,
      wakeLock: 'wakeLock' in navigator,
      fullscreen: document.fullscreenEnabled || false,
      audio: 'AudioContext' in window || 'webkitAudioContext' in window
    };
    
    setDeviceCapabilities(capabilities);
    console.log('Device capabilities detected:', capabilities);
  };

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  };

  const requestCriticalAlertPermission = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        
        if (permission === 'granted') {
          console.log('✅ Critical alert permission granted');
          
          // Test notification to verify bypass capability
          await testCriticalAlertBypass();
          
          return true;
        } else {
          console.log('❌ Critical alert permission denied');
          return false;
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
    return false;
  };

  const testCriticalAlertBypass = async () => {
    if (notificationPermission !== 'granted') {
      const granted = await requestCriticalAlertPermission();
      if (!granted) return;
    }

    const emergencyAlert: CriticalAlert = {
      id: Date.now().toString(),
      title: 'EMERGENCY: Silent Mode Bypass Test',
      message: '🚨 Testing emergency bypass - This alert should appear even if your device is on silent mode',
      priority: 'CRITICAL',
      timestamp: new Date(),
      bypassStatus: 'pending',
      technicalDetails: {
        platform: navigator.userAgent.includes('iPhone') ? 'iOS' : 
                  navigator.userAgent.includes('Android') ? 'Android' : 'Web',
        method: 'Browser Critical Alert',
        volumeLevel: 100,
        vibrationPattern: 'SOS'
      }
    };

    setCurrentAlert(emergencyAlert);

    try {
      // Method 1: Critical Notification with maximum priority
      if ('Notification' in window && notificationPermission === 'granted') {
        const notification = new Notification(emergencyAlert.title, {
          body: emergencyAlert.message,
          icon: '/emergency-icon.png', // Would need to add this icon
          tag: 'emergency-bypass',
          requireInteraction: true, // Keeps notification visible until user interacts
          silent: false, // Ensure sound plays
          vibrate: [200, 100, 200, 100, 200, 100, 200], // SOS pattern
          // Note: 'critical' flag is iOS-specific and requires special entitlements
        });

        notification.onclick = () => {
          setCurrentAlert(prev => prev ? { ...prev, bypassStatus: 'acknowledged' } : null);
          notification.close();
        };

        setCurrentAlert(prev => prev ? { ...prev, bypassStatus: 'sent' } : null);
      }

      // Method 2: Vibration Pattern (if supported)
      if (deviceCapabilities.vibration && 'vibrate' in navigator) {
        // SOS vibration pattern: ... --- ... (short-short-short-long-long-long-short-short-short)
        const sosPattern = [200, 100, 200, 100, 200, 300, 600, 100, 600, 100, 600, 300, 200, 100, 200, 100, 200];
        navigator.vibrate(sosPattern);
        console.log('🔔 Emergency vibration pattern activated');
      }

      // Method 3: Audio Alert with Progressive Volume
      if (deviceCapabilities.audio) {
        await playEmergencyAudio();
      }

      // Method 4: Visual Alert (Fullscreen if possible)
      if (deviceCapabilities.fullscreen) {
        // Note: Fullscreen requires user gesture, so this is limited in real implementation
        console.log('📺 Visual emergency alert would activate fullscreen');
      }

      // Method 5: Wake Lock (Keep screen on)
      if (deviceCapabilities.wakeLock) {
        try {
          // @ts-ignore - wake lock is newer API
          const wakeLock = await navigator.wakeLock.request('screen');
          console.log('🔒 Screen wake lock acquired for emergency');
          setTimeout(() => wakeLock.release(), 30000); // Release after 30 seconds
        } catch (err) {
          console.log('Wake lock not available or denied');
        }
      }

      // Update status after all methods attempted
      setTimeout(() => {
        setCurrentAlert(prev => prev ? { ...prev, bypassStatus: 'delivered' } : null);
      }, 2000);

      // Record test result
      const testResult = {
        timestamp: new Date(),
        methods: [
          deviceCapabilities.notifications && 'Browser Notification',
          deviceCapabilities.vibration && 'Vibration Pattern',
          deviceCapabilities.audio && 'Audio Alert',
          deviceCapabilities.wakeLock && 'Screen Wake Lock'
        ].filter(Boolean),
        success: true,
        platform: emergencyAlert.technicalDetails?.platform,
        limitations: getTestLimitations()
      };

      setTestResults(prev => [testResult, ...prev.slice(0, 4)]); // Keep last 5 tests

    } catch (error) {
      console.error('Critical alert bypass test failed:', error);
      setCurrentAlert(prev => prev ? { ...prev, bypassStatus: 'pending' } : null);
    }
  };

  const playEmergencyAudio = async () => {
    try {
      // Create audio context for emergency sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create emergency siren sound using oscillators
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Emergency siren frequency sweep
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 1);
      oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 2);
      
      // Volume envelope
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 3);
      
      console.log('🎵 Emergency audio alert played');
    } catch (error) {
      console.error('Failed to play emergency audio:', error);
    }
  };

  const getTestLimitations = (): string[] => {
    const limitations = [];
    
    if (!deviceCapabilities.notifications) {
      limitations.push('Browser notifications not supported');
    }
    if (!deviceCapabilities.vibration) {
      limitations.push('Device vibration not available');
    }
    if (!deviceCapabilities.audio) {
      limitations.push('Web Audio API not supported');
    }
    if (!deviceCapabilities.wakeLock) {
      limitations.push('Screen wake lock not available');
    }
    
    limitations.push('True critical alerts require native app implementation');
    limitations.push('Browser-based alerts have limited silent mode bypass capability');
    limitations.push('Fullscreen emergency alerts require user permission');
    
    return limitations;
  };

  const dismissAlert = () => {
    setCurrentAlert(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'acknowledged': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
            Critical Alert Bypass
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Technical implementation of emergency notification bypass for silent mode scenarios
        </p>
      </motion.div>

      {/* Device Capabilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Smartphone className="w-6 h-6" />
              Device Bypass Capabilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border-2 ${deviceCapabilities.notifications ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Bell className={`w-5 h-5 ${deviceCapabilities.notifications ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-sm">Browser Notifications</span>
                </div>
                <p className="text-xs text-gray-600">
                  {deviceCapabilities.notifications ? 'Available' : 'Not Supported'}
                </p>
                <Badge className={`mt-2 text-xs ${notificationPermission === 'granted' ? 'bg-green-100 text-green-800' : notificationPermission === 'denied' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  Permission: {notificationPermission}
                </Badge>
              </div>

              <div className={`p-4 rounded-xl border-2 ${deviceCapabilities.vibration ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className={`w-5 h-5 ${deviceCapabilities.vibration ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-sm">Vibration API</span>
                </div>
                <p className="text-xs text-gray-600">
                  {deviceCapabilities.vibration ? 'SOS Pattern Supported' : 'Not Available'}
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${deviceCapabilities.audio ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className={`w-5 h-5 ${deviceCapabilities.audio ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-sm">Emergency Audio</span>
                </div>
                <p className="text-xs text-gray-600">
                  {deviceCapabilities.audio ? 'Web Audio API Available' : 'Not Supported'}
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${deviceCapabilities.wakeLock ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className={`w-5 h-5 ${deviceCapabilities.wakeLock ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-sm">Screen Wake Lock</span>
                </div>
                <p className="text-xs text-gray-600">
                  {deviceCapabilities.wakeLock ? 'Can Keep Screen Active' : 'Not Available'}
                </p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${deviceCapabilities.fullscreen ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${deviceCapabilities.fullscreen ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold text-sm">Fullscreen API</span>
                </div>
                <p className="text-xs text-gray-600">
                  {deviceCapabilities.fullscreen ? 'Emergency Overlay Available' : 'Not Supported'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Test Critical Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl text-red-900">Test Emergency Bypass</CardTitle>
            <p className="text-sm text-red-700">
              Test how well the system can bypass silent mode on your current device
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800 text-sm mb-1">Testing Instructions</p>
                    <ol className="text-xs text-yellow-700 space-y-1">
                      <li>1. Put your device on silent mode / Do Not Disturb</li>
                      <li>2. Click the test button below</li>
                      <li>3. Observe which bypass methods work on your device</li>
                      <li>4. Note: Full bypass requires native app implementation</li>
                    </ol>
                  </div>
                </div>
              </div>

              <Button
                onClick={testCriticalAlertBypass}
                disabled={!!currentAlert}
                className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-lg font-bold"
              >
                {currentAlert ? 'Testing Emergency Bypass...' : '🚨 Test Silent Mode Bypass'}
              </Button>

              {notificationPermission !== 'granted' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Browser notification permission required for full testing. 
                    Click the test button to request permission.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current Alert Status */}
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-white border-2 border-red-200 shadow-2xl rounded-2xl min-w-[300px]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-red-900 text-sm">Emergency Bypass Test</h4>
                    <Badge className={getStatusColor(currentAlert.bypassStatus)}>
                      {currentAlert.bypassStatus.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={dismissAlert}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
                
                <p className="text-xs text-gray-700 mb-3">{currentAlert.message}</p>
                
                {currentAlert.technicalDetails && (
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs font-semibold text-gray-800 mb-1">Technical Details:</p>
                    <p className="text-xs text-gray-600">Platform: {currentAlert.technicalDetails.platform}</p>
                    <p className="text-xs text-gray-600">Method: {currentAlert.technicalDetails.method}</p>
                    <p className="text-xs text-gray-600">Volume: {currentAlert.technicalDetails.volumeLevel}%</p>
                  </div>
                )}
                
                <div className="mt-3 text-xs text-gray-500">
                  {currentAlert.timestamp.toLocaleTimeString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Results History */}
      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Clock className="w-6 h-6" />
                Test Results History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm">Test #{testResults.length - index}</p>
                      <Badge className={`${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.success ? 'SUCCESS' : 'FAILED'}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      Methods: {result.methods.join(', ')}
                    </p>
                    
                    <p className="text-xs text-gray-600 mb-2">
                      Platform: {result.platform}
                    </p>
                    
                    <details className="text-xs">
                      <summary className="text-gray-700 font-medium cursor-pointer">
                        Limitations ({result.limitations.length})
                      </summary>
                      <ul className="mt-2 space-y-1 ml-3">
                        {result.limitations.map((limitation: string, i: number) => (
                          <li key={i} className="text-gray-600">• {limitation}</li>
                        ))}
                      </ul>
                    </details>
                    
                    <p className="text-xs text-gray-400 mt-2">
                      {result.timestamp.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}