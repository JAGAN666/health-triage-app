"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Phone,
  MapPin,
  Clock,
  Zap,
  Heart,
  Shield,
  Navigation,
  Wifi,
  WifiOff,
  CheckCircle,
  X,
  Volume2,
  Mic,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  timestamp: Date;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface EmergencyAlertProps {
  type: 'medical' | 'panic' | 'fall' | 'medication';
  onDismiss?: () => void;
  autoCall?: boolean;
}

export default function EmergencyAlert({ 
  type, 
  onDismiss,
  autoCall = false 
}: EmergencyAlertProps) {
  const [alertActive, setAlertActive] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [callingEMS, setCallingEMS] = useState(false);
  const [contactingFamily, setContactingFamily] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const countdownRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (alertActive && autoCall) {
      startCountdown();
    }
    
    getLocation();
    loadEmergencyContacts();
    
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [alertActive, autoCall]);

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          callEmergencyServices();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date()
        };

        try {
          // Reverse geocoding to get address
          const response = await fetch(
            `https://api.openstreetmap.org/reverse?format=json&lat=${locationData.latitude}&lon=${locationData.longitude}`
          );
          const data = await response.json();
          locationData.address = data.display_name;
        } catch (error) {
          console.warn('Failed to get address:', error);
        }

        setLocation(locationData);
        setLocationError('');
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
      },
      options
    );
  };

  const loadEmergencyContacts = () => {
    // Mock emergency contacts - in real app, load from API
    const mockContacts: EmergencyContact[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        relationship: 'Spouse',
        isPrimary: true
      },
      {
        id: '2',
        name: 'Michael Johnson',
        phone: '+1 (555) 987-6543',
        relationship: 'Son',
        isPrimary: false
      }
    ];
    
    setEmergencyContacts(mockContacts);
  };

  const callEmergencyServices = async () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setCallingEMS(true);
    
    try {
      // Send emergency alert to backend
      const alertData = {
        type,
        location,
        timestamp: new Date().toISOString(),
        autoTriggered: autoCall,
        emergencyContacts: emergencyContacts.map(c => c.id)
      };

      const response = await fetch('/api/emergency-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });

      if (response.ok) {
        setAlertSent(true);
        // Actual phone call to emergency services
        window.open('tel:911');
        
        // Contact family members
        contactFamilyMembers();
      }
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
    }
    
    setCallingEMS(false);
  };

  const contactFamilyMembers = async () => {
    setContactingFamily(true);
    
    // Send alerts to emergency contacts
    for (const contact of emergencyContacts.filter(c => c.isPrimary)) {
      try {
        await fetch('/api/emergency-contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contactId: contact.id,
            alertType: type,
            location,
            message: `Emergency alert: ${getAlertMessage()}. Location: ${location?.address || 'Location unavailable'}`
          }),
        });
      } catch (error) {
        console.error(`Failed to contact ${contact.name}:`, error);
      }
    }
    
    setContactingFamily(false);
  };

  const getAlertMessage = () => {
    switch (type) {
      case 'medical':
        return 'Medical emergency detected';
      case 'panic':
        return 'Panic button activated';
      case 'fall':
        return 'Fall detected';
      case 'medication':
        return 'Medication emergency';
      default:
        return 'Emergency alert activated';
    }
  };

  const getAlertColor = () => {
    switch (type) {
      case 'medical':
        return 'from-red-500 to-pink-600';
      case 'panic':
        return 'from-orange-500 to-red-600';
      case 'fall':
        return 'from-yellow-500 to-orange-600';
      case 'medication':
        return 'from-purple-500 to-blue-600';
      default:
        return 'from-red-500 to-pink-600';
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'medical':
        return <Heart className="w-8 h-8" />;
      case 'panic':
        return <AlertTriangle className="w-8 h-8" />;
      case 'fall':
        return <Zap className="w-8 h-8" />;
      case 'medication':
        return <Shield className="w-8 h-8" />;
      default:
        return <AlertTriangle className="w-8 h-8" />;
    }
  };

  const dismissAlert = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    setAlertActive(false);
    onDismiss?.();
  };

  if (!alertActive) {
    return null;
  }

  if (alertSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <Card className="w-full max-w-md bg-green-50 border-green-200">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-xl font-bold text-green-900 mb-2">
              Emergency Alert Sent
            </h3>
            <p className="text-green-800 mb-4">
              Emergency services have been contacted and your family members have been notified.
            </p>
            <div className="space-y-2 text-sm text-green-700">
              <p>✓ 911 Emergency Services called</p>
              <p>✓ Location shared with responders</p>
              <p>✓ Emergency contacts notified</p>
            </div>
            <Button
              onClick={dismissAlert}
              className="mt-4 bg-green-600 hover:bg-green-700"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg"
        >
          <Card className={`bg-gradient-to-br ${getAlertColor()} border-0 shadow-2xl text-white`}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="p-4 bg-white/20 rounded-full backdrop-blur-sm"
                >
                  {getAlertIcon()}
                </motion.div>
              </div>
              <CardTitle className="text-2xl font-bold mb-2">
                EMERGENCY ALERT
              </CardTitle>
              <p className="text-lg opacity-90">{getAlertMessage()}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Countdown */}
              {autoCall && countdown > 0 && (
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{countdown}</div>
                  <p className="text-sm opacity-80">
                    Calling 911 automatically in {countdown} seconds
                  </p>
                  <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                    <motion.div
                      className="bg-white rounded-full h-2"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(countdown / 30) * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">Your Location</span>
                </div>
                {location ? (
                  <div className="space-y-1 text-sm">
                    <p>📍 {location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}</p>
                    <p className="opacity-80">Accuracy: ±{Math.round(location.accuracy)}m</p>
                  </div>
                ) : locationError ? (
                  <p className="text-sm text-red-200">⚠️ {locationError}</p>
                ) : (
                  <p className="text-sm opacity-80">📡 Getting your location...</p>
                )}
              </div>

              {/* Emergency Contacts */}
              {emergencyContacts.length > 0 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5" />
                    <span className="font-semibold">Emergency Contacts</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    {emergencyContacts.slice(0, 2).map(contact => (
                      <p key={contact.id}>
                        {contact.name} ({contact.relationship})
                        {contact.isPrimary && <Badge className="ml-2 bg-white/20 text-xs">Primary</Badge>}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={callEmergencyServices}
                  disabled={callingEMS}
                  className="w-full bg-white text-red-600 hover:bg-gray-100 font-bold py-4 text-lg"
                >
                  {callingEMS ? (
                    <>
                      <Volume2 className="w-5 h-5 mr-2 animate-pulse" />
                      Calling 911...
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Call 911 Now
                    </>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={contactFamilyMembers}
                    disabled={contactingFamily}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
                  >
                    {contactingFamily ? 'Contacting...' : 'Alert Family'}
                  </Button>
                  <Button
                    onClick={dismissAlert}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/30 text-white"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex justify-center gap-4 text-xs opacity-75">
                <div className="flex items-center gap-1">
                  {location ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  GPS {location ? 'Active' : 'Searching'}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}