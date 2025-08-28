"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Phone, MapPin, Clock, Users, Shield, Zap, Heart, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SilentModeBypass from "./SilentModeBypass";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
}

interface EmergencyAlert {
  id: string;
  riskLevel: 'HIGH' | 'CRITICAL';
  symptoms: string[];
  timestamp: Date;
  location?: LocationData;
  status: 'DETECTED' | 'CALLING_911' | 'CONTACTING_EMERGENCY_CONTACTS' | 'RESOLVED' | 'CANCELLED';
  aiRationale: string;
}

export default function EmergencyDetectionSystem() {
  const [currentAlert, setCurrentAlert] = useState<EmergencyAlert | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+1-555-0123',
      relationship: 'Primary Care Physician',
      priority: 1
    },
    {
      id: '2', 
      name: 'John Smith',
      phone: '+1-555-0124',
      relationship: 'Emergency Contact',
      priority: 2
    }
  ]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    camera: false,
    microphone: false
  });

  // Simulate emergency detection from other components
  const triggerEmergencyAlert = useCallback((symptoms: string[], riskLevel: 'HIGH' | 'CRITICAL', aiRationale: string) => {
    const alert: EmergencyAlert = {
      id: Date.now().toString(),
      riskLevel,
      symptoms,
      timestamp: new Date(),
      location: locationData || undefined,
      status: 'DETECTED',
      aiRationale
    };

    setCurrentAlert(alert);
    
    // Start 10-second countdown for automatic 911 call
    if (riskLevel === 'CRITICAL') {
      setCountdown(10);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            initiateEmergencyCall(alert);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [locationData]);

  // Get user location for emergency services
  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported by this browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const location: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      // Use coordinates as address for demo (in production, use real geocoding)
      location.address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)} (Demo coordinates)`;

      setLocationData(location);
      setPermissionsGranted(prev => ({ ...prev, location: true }));
      console.log('Location access granted successfully');
    } catch (error) {
      console.log('Location permission denied or unavailable - using demo mode');
      
      // For demo purposes, simulate location data
      const demoLocation: LocationData = {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        address: "San Francisco, CA (Demo Location)"
      };
      
      setLocationData(demoLocation);
      setPermissionsGranted(prev => ({ ...prev, location: false })); // Keep as false to show it's demo
    }
  }, []);

  // Check and request permissions
  const checkPermissions = useCallback(async () => {
    // Check location permission
    if (navigator.geolocation) {
      await getCurrentLocation();
    }

    // Check camera permission (used by Visual Analysis)
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(prev => ({ ...prev, camera: true }));
        console.log('Camera access granted successfully');
      } catch (error) {
        console.log('Camera permission not granted - some features may be limited');
        setPermissionsGranted(prev => ({ ...prev, camera: false }));
      }
    } else {
      console.log('Camera not supported by this browser');
    }

    // Check microphone permission (optional for this demo)
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionsGranted(prev => ({ ...prev, microphone: true }));
        console.log('Microphone access granted successfully');
      } catch (error) {
        console.log('Microphone permission not granted - voice features unavailable');
        setPermissionsGranted(prev => ({ ...prev, microphone: false }));
      }
    } else {
      console.log('Microphone not supported by this browser');
    }
  }, [getCurrentLocation]);

  const initiateEmergencyCall = useCallback(async (alert: EmergencyAlert) => {
    setCurrentAlert(prev => prev ? { ...prev, status: 'CALLING_911' } : null);

    // Simulate 911 call with location data
    const emergencyData = {
      location: alert.location,
      symptoms: alert.symptoms.join(', '),
      riskLevel: alert.riskLevel,
      timestamp: alert.timestamp.toISOString(),
      aiAssessment: alert.aiRationale
    };

    try {
      // In a real implementation, this would integrate with emergency services
      const response = await fetch('/api/emergency-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emergencyData)
      });

      if (response.ok) {
        // Simulate successful call
        setTimeout(() => {
          setCurrentAlert(prev => prev ? { ...prev, status: 'CONTACTING_EMERGENCY_CONTACTS' } : null);
          contactEmergencyContacts(alert);
        }, 3000);
      }
    } catch (error) {
      console.error('Emergency call failed:', error);
      // Fallback: Still try to contact emergency contacts
      contactEmergencyContacts(alert);
    }
  }, []);

  const contactEmergencyContacts = useCallback(async (alert: EmergencyAlert) => {
    // Sort contacts by priority and attempt to contact them
    const sortedContacts = [...emergencyContacts].sort((a, b) => a.priority - b.priority);

    for (const contact of sortedContacts) {
      try {
        const contactData = {
          contactId: contact.id,
          contactName: contact.name,
          emergencyDetails: {
            symptoms: alert.symptoms.join(', '),
            riskLevel: alert.riskLevel,
            location: alert.location,
            timestamp: alert.timestamp.toISOString()
          }
        };

        const response = await fetch('/api/emergency-contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contactData)
        });

        if (response.ok) {
          console.log(`Successfully contacted ${contact.name}`);
        }
      } catch (error) {
        console.error(`Failed to contact ${contact.name}:`, error);
      }

      // Small delay between contacts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Mark as resolved after contacting all
    setTimeout(() => {
      setCurrentAlert(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
    }, 2000);
  }, [emergencyContacts]);

  const cancelEmergencyAlert = useCallback(() => {
    setCurrentAlert(prev => prev ? { ...prev, status: 'CANCELLED' } : null);
    setCountdown(0);
    
    setTimeout(() => {
      setCurrentAlert(null);
    }, 2000);
  }, []);

  // Demo functions to trigger alerts
  const simulateHighRiskDetection = () => {
    triggerEmergencyAlert(
      ['Severe chest pain', 'Difficulty breathing', 'Rapid heart rate'],
      'CRITICAL',
      'Multiple critical symptoms detected including chest pain and breathing difficulties. This combination requires immediate emergency medical attention.'
    );
  };

  const simulateMediumRiskDetection = () => {
    triggerEmergencyAlert(
      ['Persistent headache', 'Dizziness', 'Nausea'],
      'HIGH',
      'Combination of neurological symptoms detected. While not immediately life-threatening, medical evaluation is strongly recommended.'
    );
  };

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DETECTED': return 'bg-red-100 text-red-800 border-red-200';
      case 'CALLING_911': return 'bg-red-100 text-red-800 border-red-200';
      case 'CONTACTING_EMERGENCY_CONTACTS': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
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
        {/* Demo Mode Banner */}
        <div className="mb-6">
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg"
          >
            <AlertTriangle className="w-5 h-5" />
            🚨 DEMO MODE - NOT REAL EMERGENCY SERVICES 🚨
          </motion.div>
          <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
            This is a demonstration system. No actual 911 calls will be made. In real emergencies, always call 911 directly.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-700">
            Emergency Detection AI
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Advanced AI system that automatically detects medical emergencies and coordinates immediate response
        </p>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-6 h-6" />
              System Status & Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className={`p-4 rounded-xl border-2 ${permissionsGranted.location ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <MapPin className={`w-5 h-5 ${permissionsGranted.location ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className="font-semibold text-sm">Location Access</p>
                    <p className={`text-xs ${permissionsGranted.location ? 'text-green-600' : 'text-red-600'}`}>
                      {permissionsGranted.location ? 'Granted' : 'Required'}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 ${permissionsGranted.camera ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <Zap className={`w-5 h-5 ${permissionsGranted.camera ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className="font-semibold text-sm">Camera Access</p>
                    <p className={`text-xs ${permissionsGranted.camera ? 'text-green-600' : 'text-red-600'}`}>
                      {permissionsGranted.camera ? 'Granted' : 'Required'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 bg-green-50 border-green-200">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm">AI Monitoring</p>
                    <p className="text-xs text-green-600">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {locationData && (
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">Current Location (for Emergency Services)</p>
                <p className="text-xs text-blue-700">
                  {locationData.address || `${locationData.latitude.toFixed(4)}, ${locationData.longitude.toFixed(4)}`}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Accuracy: ±{Math.round(locationData.accuracy)}m
                </p>
              </div>
            )}

            {!permissionsGranted.location && (
              <div className="text-center">
                <Button
                  onClick={checkPermissions}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-2xl px-6 py-3"
                >
                  Grant Emergency Permissions
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contacts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emergencyContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Priority {contact.priority}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Demo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-3xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                DEMO ONLY
              </div>
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                SIMULATED
              </div>
            </div>
            <CardTitle className="text-2xl text-orange-900">Emergency Detection Demo</CardTitle>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mt-3">
              <p className="text-sm font-semibold text-yellow-800 mb-1">⚠️ IMPORTANT DEMO NOTICE</p>
              <p className="text-xs text-yellow-700">
                This demonstration simulates emergency scenarios for educational purposes only. 
                <strong> No real emergency services will be contacted.</strong> All phone calls, location sharing, and emergency responses are simulated.
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={simulateHighRiskDetection}
                className="bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-left flex flex-col items-start"
                disabled={!!currentAlert}
              >
                <span className="font-bold mb-1">🎭 DEMO: CRITICAL Emergency</span>
                <span className="text-sm opacity-90">Simulated chest pain + breathing difficulty</span>
              </Button>

              <Button
                onClick={simulateMediumRiskDetection}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 text-left flex flex-col items-start"
                disabled={!!currentAlert}
              >
                <span className="font-bold mb-1">🎭 DEMO: HIGH Risk Detection</span>
                <span className="text-sm opacity-90">Simulated neurological symptoms</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Alert Modal */}
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="text-center space-y-4">
                {/* Demo Notice */}
                <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-3">
                  <p className="text-sm font-bold text-orange-800">🎭 DEMO SIMULATION</p>
                  <p className="text-xs text-orange-700">This is not a real emergency. No actual 911 call will be made.</p>
                </div>

                {/* Alert Header */}
                <div className="flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="p-4 bg-red-500 rounded-full"
                  >
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">
                    {currentAlert.riskLevel} RISK DETECTED
                  </h3>
                  <Badge className={getStatusColor(currentAlert.status)}>
                    {currentAlert.status.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Symptoms */}
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="font-medium text-red-900 mb-2">Detected Symptoms:</p>
                  <ul className="text-sm text-red-800 space-y-1">
                    {currentAlert.symptoms.map((symptom, index) => (
                      <li key={index}>• {symptom}</li>
                    ))}
                  </ul>
                </div>

                {/* AI Rationale */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="font-medium text-blue-900 mb-2">AI Assessment:</p>
                  <p className="text-sm text-blue-800">{currentAlert.aiRationale}</p>
                </div>

                {/* Countdown for Critical */}
                {currentAlert.riskLevel === 'CRITICAL' && countdown > 0 && currentAlert.status === 'DETECTED' && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="bg-red-100 rounded-xl p-4"
                  >
                    <p className="font-bold text-red-800 mb-2">Calling 911 in:</p>
                    <motion.div
                      className="text-4xl font-black text-red-600"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {countdown}
                    </motion.div>
                    <p className="text-sm text-red-700 mt-2">Press Cancel if this is a false alarm</p>
                  </motion.div>
                )}

                {/* Status Messages */}
                {currentAlert.status === 'CALLING_911' && (
                  <div className="bg-red-100 rounded-xl p-4">
                    <Phone className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <p className="font-bold text-red-800">🎭 SIMULATING: Calling Emergency Services...</p>
                    <p className="text-sm text-red-700">Demo: Location sharing simulation</p>
                    <p className="text-xs text-red-600 font-medium mt-1">No real 911 call is being made</p>
                  </div>
                )}

                {currentAlert.status === 'CONTACTING_EMERGENCY_CONTACTS' && (
                  <div className="bg-orange-100 rounded-xl p-4">
                    <Users className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="font-bold text-orange-800">🎭 SIMULATING: Contacting Emergency Contacts...</p>
                    <p className="text-sm text-orange-700">Demo: Healthcare provider notification simulation</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">No real contacts are being called</p>
                  </div>
                )}

                {currentAlert.status === 'RESOLVED' && (
                  <div className="bg-green-100 rounded-xl p-4">
                    <Check className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-green-800">🎭 DEMO: Emergency Response Simulated</p>
                    <p className="text-sm text-green-700">Demo completed - No real help was dispatched</p>
                    <p className="text-xs text-green-600 font-medium mt-1">This was a demonstration only</p>
                  </div>
                )}

                {currentAlert.status === 'CANCELLED' && (
                  <div className="bg-gray-100 rounded-xl p-4">
                    <X className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="font-bold text-gray-800">Demo Alert Cancelled</p>
                    <p className="text-sm text-gray-700">Simulation stopped</p>
                  </div>
                )}

                {/* Action Buttons */}
                {currentAlert.status === 'DETECTED' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={cancelEmergencyAlert}
                      variant="outline"
                      className="flex-1 rounded-2xl border-red-200 text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => initiateEmergencyCall(currentAlert)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl"
                    >
                      Call Now
                    </Button>
                  </div>
                )}

                {(currentAlert.status === 'RESOLVED' || currentAlert.status === 'CANCELLED') && (
                  <Button
                    onClick={() => setCurrentAlert(null)}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white rounded-2xl"
                  >
                    Close
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Silent Mode Emergency Bypass System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <SilentModeBypass />
      </motion.div>

      {/* Medical Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">AI Emergency Detection Limitations</p>
                <p className="mb-2">
                  This emergency detection system has important limitations:
                </p>
                <ul className="text-xs space-y-1 ml-3">
                  <li>• Cannot detect all emergency conditions or symptoms</li>
                  <li>• May produce false alarms or miss real emergencies</li>
                  <li>• Based on pattern recognition, not medical expertise</li>
                  <li>• Cannot assess vital signs or physical examination findings</li>
                  <li>• Emergency services and location sharing are simulated for demo</li>
                  <li>• <strong>Always call 911 directly for real emergencies</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}