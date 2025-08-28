"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin,
  AlertTriangle,
  Shield,
  Phone,
  Navigation,
  Clock,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Radio,
  Hospital,
  Car,
  Heart,
  Smartphone,
  Wifi,
  Satellite,
  Target,
  Bell,
  Settings,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GeofenceZone {
  id: string;
  name: string;
  type: 'hospital' | 'home' | 'work' | 'custom';
  coordinates: {
    latitude: number;
    longitude: number;
    radius: number; // in meters
  };
  emergencyContacts: string[];
  alertSettings: {
    enabled: boolean;
    autoNotify: boolean;
    escalationTime: number; // in minutes
  };
  lastTriggered?: Date;
}

interface EmergencyAlert {
  id: string;
  type: 'medical' | 'fall' | 'panic' | 'vital_signs' | 'manual';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
  };
  timestamp: Date;
  status: 'triggered' | 'acknowledged' | 'responding' | 'resolved';
  zone?: GeofenceZone;
  responseTime?: number;
  responders: {
    id: string;
    type: 'ems' | 'police' | 'fire' | 'contact' | 'hospital';
    name: string;
    distance: number;
    eta: number;
    status: 'notified' | 'dispatched' | 'en_route' | 'on_scene';
  }[];
  vitalSigns?: {
    heartRate: number;
    bloodPressure?: string;
    temperature?: number;
    oxygenSaturation?: number;
  };
}

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  heading?: number;
  speed?: number;
  address?: string;
}

export default function GeofencingEmergencySystem() {
  const [geofenceZones, setGeofenceZones] = useState<GeofenceZone[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<EmergencyAlert[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [isTracking, setIsTracking] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'limited'>('online');
  
  const watchIdRef = useRef<number>();
  const emergencyTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeGeofencingSystem();
    checkLocationPermission();
    initializeBatteryAPI();
    initializeNetworkStatus();
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
      }
    };
  }, []);

  const initializeGeofencingSystem = async () => {
    // Initialize mock geofence zones
    const mockZones: GeofenceZone[] = [
      {
        id: 'home',
        name: 'Home',
        type: 'home',
        coordinates: {
          latitude: 37.7749,
          longitude: -122.4194,
          radius: 100
        },
        emergencyContacts: ['spouse', 'family-doctor'],
        alertSettings: {
          enabled: true,
          autoNotify: true,
          escalationTime: 2
        }
      },
      {
        id: 'work',
        name: 'Workplace',
        type: 'work',
        coordinates: {
          latitude: 37.7849,
          longitude: -122.4094,
          radius: 200
        },
        emergencyContacts: ['emergency-contact', 'hr'],
        alertSettings: {
          enabled: true,
          autoNotify: true,
          escalationTime: 1
        }
      },
      {
        id: 'hospital',
        name: 'UCSF Medical Center',
        type: 'hospital',
        coordinates: {
          latitude: 37.7629,
          longitude: -122.4574,
          radius: 500
        },
        emergencyContacts: ['hospital-staff'],
        alertSettings: {
          enabled: true,
          autoNotify: false,
          escalationTime: 5
        }
      }
    ];

    setGeofenceZones(mockZones);
    
    // Simulate some historical alerts
    const mockAlerts: EmergencyAlert[] = [
      {
        id: 'alert-001',
        type: 'vital_signs',
        severity: 'high',
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
          address: '123 Main St, San Francisco, CA'
        },
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        status: 'resolved',
        zone: mockZones[0],
        responseTime: 8,
        responders: [
          {
            id: 'ems-001',
            type: 'ems',
            name: 'SFFD Medic 15',
            distance: 0.8,
            eta: 4,
            status: 'on_scene'
          }
        ],
        vitalSigns: {
          heartRate: 145,
          bloodPressure: '180/110',
          temperature: 99.2
        }
      }
    ];

    setActiveAlerts(mockAlerts);
  };

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
        
        permission.onchange = () => {
          setLocationPermission(permission.state);
        };
        
        if (permission.state === 'granted') {
          startLocationTracking();
        }
      } catch (error) {
        console.error('Permission API not supported');
        setLocationPermission('prompt');
      }
    }
  };

  const initializeBatteryAPI = async () => {
    try {
      // @ts-ignore - Battery API is not in TypeScript definitions
      const battery = await navigator.getBattery?.();
      if (battery) {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }
    } catch (error) {
      // Battery API not supported
    }
  };

  const initializeNetworkStatus = () => {
    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        // @ts-ignore - Connection API is experimental
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
          setNetworkStatus(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' ? 'limited' : 'online');
        } else {
          setNetworkStatus('online');
        }
      } else {
        setNetworkStatus('offline');
      }
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
  };

  const requestLocationPermission = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          updateLocation(position);
          startLocationTracking();
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  };

  const startLocationTracking = () => {
    if (locationPermission !== 'granted' || isTracking) return;

    setIsTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      (error) => {
        console.error('Location tracking error:', error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 10000
      }
    );
  };

  const stopLocationTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = undefined;
    }
    setIsTracking(false);
  };

  const updateLocation = async (position: GeolocationPosition) => {
    const location: LocationData = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading || undefined,
      speed: position.coords.speed || undefined
    };

    // Reverse geocoding simulation
    try {
      location.address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }

    setCurrentLocation(location);
    checkGeofenceViolations(location);
  };

  const checkGeofenceViolations = (location: LocationData) => {
    geofenceZones.forEach(zone => {
      if (!zone.alertSettings.enabled) return;

      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        zone.coordinates.latitude,
        zone.coordinates.longitude
      );

      if (distance <= zone.coordinates.radius) {
        // User is within the geofence
        console.log(`User entered zone: ${zone.name}`);
      }
    });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const triggerEmergencyAlert = async (type: EmergencyAlert['type'], severity: EmergencyAlert['severity']) => {
    if (!currentLocation) {
      alert('Location not available. Please enable location services.');
      return;
    }

    const nearestZone = findNearestZone(currentLocation);
    
    const newAlert: EmergencyAlert = {
      id: `alert-${Date.now()}`,
      type,
      severity,
      location: currentLocation,
      timestamp: new Date(),
      status: 'triggered',
      zone: nearestZone,
      responders: []
    };

    // Simulate finding nearby responders
    const responders = await findNearbyResponders(currentLocation, severity);
    newAlert.responders = responders;

    setActiveAlerts(prev => [newAlert, ...prev]);
    setEmergencyMode(true);

    // Auto-escalate if no response within escalation time
    if (nearestZone?.alertSettings.autoNotify) {
      emergencyTimeoutRef.current = setTimeout(() => {
        escalateAlert(newAlert.id);
      }, (nearestZone.alertSettings.escalationTime || 5) * 60 * 1000);
    }

    // Notify responders
    await notifyResponders(newAlert);
  };

  const findNearestZone = (location: LocationData): GeofenceZone | undefined => {
    let nearestZone: GeofenceZone | undefined;
    let minDistance = Infinity;

    geofenceZones.forEach(zone => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        zone.coordinates.latitude,
        zone.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    });

    return nearestZone;
  };

  const findNearbyResponders = async (location: LocationData, severity: string) => {
    // Mock responder data based on location and severity
    const mockResponders = [
      {
        id: 'ems-sf-001',
        type: 'ems' as const,
        name: 'SFFD Medic 12',
        distance: 1.2,
        eta: 5,
        status: 'notified' as const
      },
      {
        id: 'hospital-001',
        type: 'hospital' as const,
        name: 'UCSF Emergency',
        distance: 2.1,
        eta: 8,
        status: 'notified' as const
      },
      {
        id: 'contact-001',
        type: 'contact' as const,
        name: 'Emergency Contact',
        distance: 0.5,
        eta: 3,
        status: 'notified' as const
      }
    ];

    if (severity === 'critical') {
      mockResponders.push({
        id: 'police-001',
        type: 'police' as const,
        name: 'SFPD Unit 15',
        distance: 0.8,
        eta: 4,
        status: 'notified' as const
      });
    }

    return mockResponders;
  };

  const notifyResponders = async (alert: EmergencyAlert) => {
    console.log('Notifying responders for alert:', alert.id);
    
    // Simulate notification process
    alert.responders.forEach((responder, index) => {
      setTimeout(() => {
        updateResponderStatus(alert.id, responder.id, 'dispatched');
      }, (index + 1) * 2000);
    });
  };

  const updateResponderStatus = (alertId: string, responderId: string, status: EmergencyAlert['responders'][0]['status']) => {
    setActiveAlerts(prev =>
      prev.map(alert => {
        if (alert.id === alertId) {
          return {
            ...alert,
            responders: alert.responders.map(responder =>
              responder.id === responderId ? { ...responder, status } : responder
            )
          };
        }
        return alert;
      })
    );
  };

  const escalateAlert = (alertId: string) => {
    setActiveAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, severity: 'critical' as const }
          : alert
      )
    );
  };

  const resolveAlert = (alertId: string) => {
    setActiveAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: 'resolved' as const }
          : alert
      )
    );
    
    if (activeAlerts.filter(a => a.status !== 'resolved').length <= 1) {
      setEmergencyMode(false);
    }

    if (emergencyTimeoutRef.current) {
      clearTimeout(emergencyTimeoutRef.current);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'triggered': return 'bg-red-100 text-red-800 border-red-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
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
          <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
              Geofencing Emergency System
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <MapPin className="w-3 h-3 mr-1" />
                Location-Based
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                <Zap className="w-3 h-3 mr-1" />
                Auto-Response
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Shield className="w-3 h-3 mr-1" />
                24/7 Monitoring
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Advanced location-aware emergency response system with automated alerts and responder coordination
        </p>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className={`${emergencyMode ? 'bg-red-50 border-red-200' : 'bg-white/60'} backdrop-blur-sm border-0 shadow-xl rounded-3xl`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Navigation className="w-6 h-6" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Location Status */}
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin className={`w-5 h-5 ${locationPermission === 'granted' ? 'text-green-600' : 'text-red-600'}`} />
                  <span className="font-semibold">Location</span>
                </div>
                <div className={`text-sm ${locationPermission === 'granted' ? 'text-green-800' : 'text-red-800'}`}>
                  {locationPermission === 'granted' ? 'Active' : 'Inactive'}
                </div>
                {currentLocation && (
                  <div className="text-xs text-gray-600 mt-1">
                    ±{currentLocation.accuracy}m accuracy
                  </div>
                )}
              </div>

              {/* Tracking Status */}
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className={`w-5 h-5 ${isTracking ? 'text-green-600' : 'text-gray-600'}`} />
                  <span className="font-semibold">Tracking</span>
                </div>
                <div className={`text-sm ${isTracking ? 'text-green-800' : 'text-gray-800'}`}>
                  {isTracking ? 'Monitoring' : 'Standby'}
                </div>
              </div>

              {/* Network Status */}
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Wifi className={`w-5 h-5 ${
                    networkStatus === 'online' ? 'text-green-600' : 
                    networkStatus === 'limited' ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <span className="font-semibold">Network</span>
                </div>
                <div className={`text-sm ${
                  networkStatus === 'online' ? 'text-green-800' : 
                  networkStatus === 'limited' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {networkStatus.charAt(0).toUpperCase() + networkStatus.slice(1)}
                </div>
              </div>

              {/* Battery Level */}
              <div className="text-center p-4 bg-white/50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className={`w-5 h-5 ${
                    batteryLevel > 50 ? 'text-green-600' : 
                    batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                  }`} />
                  <span className="font-semibold">Battery</span>
                </div>
                <div className={`text-sm ${
                  batteryLevel > 50 ? 'text-green-800' : 
                  batteryLevel > 20 ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {batteryLevel}%
                </div>
              </div>
            </div>

            {/* Location Permission Request */}
            {locationPermission !== 'granted' && (
              <div className="mt-4 text-center">
                <Button
                  onClick={requestLocationPermission}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location Services
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Location access required for emergency geofencing
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Trigger Buttons */}
      {locationPermission === 'granted' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="w-6 h-6" />
                Emergency Triggers
              </CardTitle>
              <p className="text-gray-600">Instant emergency response activation</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button
                  onClick={() => triggerEmergencyAlert('medical', 'high')}
                  className="h-20 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl flex-col"
                >
                  <Heart className="w-6 h-6 mb-1" />
                  Medical Emergency
                </Button>
                
                <Button
                  onClick={() => triggerEmergencyAlert('fall', 'medium')}
                  className="h-20 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl flex-col"
                >
                  <AlertCircle className="w-6 h-6 mb-1" />
                  Fall Detected
                </Button>
                
                <Button
                  onClick={() => triggerEmergencyAlert('panic', 'high')}
                  className="h-20 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl flex-col"
                >
                  <Bell className="w-6 h-6 mb-1" />
                  Panic Button
                </Button>
                
                <Button
                  onClick={() => triggerEmergencyAlert('manual', 'medium')}
                  className="h-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl flex-col"
                >
                  <Phone className="w-6 h-6 mb-1" />
                  Manual Alert
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Radio className="w-6 h-6" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {alert.timestamp.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          <MapPin className="w-4 h-4 inline mr-1" />
                          {alert.location.address || `${alert.location.latitude.toFixed(4)}, ${alert.location.longitude.toFixed(4)}`}
                        </div>
                      </div>
                      
                      {alert.status !== 'resolved' && (
                        <Button
                          onClick={() => resolveAlert(alert.id)}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>

                    {/* Responders */}
                    {alert.responders.length > 0 && (
                      <div>
                        <h5 className="font-semibold text-gray-900 text-sm mb-2">Response Team</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {alert.responders.map((responder) => (
                            <div key={responder.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                {responder.type === 'ems' && <Car className="w-4 h-4 text-red-600" />}
                                {responder.type === 'hospital' && <Hospital className="w-4 h-4 text-blue-600" />}
                                {responder.type === 'contact' && <Users className="w-4 h-4 text-green-600" />}
                                {responder.type === 'police' && <Shield className="w-4 h-4 text-blue-800" />}
                                <div>
                                  <div className="text-sm font-medium">{responder.name}</div>
                                  <div className="text-xs text-gray-600">{responder.distance.toFixed(1)}km • ETA {responder.eta}min</div>
                                </div>
                              </div>
                              <Badge className={`text-xs ${
                                responder.status === 'on_scene' ? 'bg-green-100 text-green-800' :
                                responder.status === 'en_route' ? 'bg-blue-100 text-blue-800' :
                                responder.status === 'dispatched' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {responder.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Geofence Zones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Target className="w-6 h-6" />
              Geofence Zones
            </CardTitle>
            <p className="text-gray-600">Location-based emergency response zones</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {geofenceZones.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{zone.name}</h4>
                      <p className="text-sm text-gray-600 capitalize">{zone.type} zone</p>
                      <div className="text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {zone.coordinates.latitude.toFixed(4)}, {zone.coordinates.longitude.toFixed(4)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Radius: {zone.coordinates.radius}m
                      </div>
                    </div>
                    <Badge className={zone.alertSettings.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {zone.alertSettings.enabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>Auto-notify: {zone.alertSettings.autoNotify ? 'Yes' : 'No'}</div>
                    <div>Escalation time: {zone.alertSettings.escalationTime} min</div>
                    <div>Emergency contacts: {zone.emergencyContacts.length}</div>
                  </div>
                  
                  {zone.lastTriggered && (
                    <div className="mt-2 text-xs text-gray-500">
                      Last triggered: {zone.lastTriggered.toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-red-50 border border-red-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Geofencing Emergency Response System</p>
                <ul className="text-xs space-y-1">
                  <li>• Location-based automatic emergency detection and response</li>
                  <li>• Integration with local EMS, police, fire, and hospital systems</li>
                  <li>• Customizable geofence zones with location-aware alert settings</li>
                  <li>• Real-time responder coordination and ETA tracking</li>
                  <li>• Battery and network monitoring for reliable emergency coverage</li>
                  <li>• DEMO: This showcases advanced location-aware emergency management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}