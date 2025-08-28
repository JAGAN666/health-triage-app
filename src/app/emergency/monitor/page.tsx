"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HealthMonitor from "@/components/monitoring/HealthMonitor";
import EmergencyAlert from "@/components/emergency/EmergencyAlert";
import { 
  AlertTriangle,
  Shield,
  Phone,
  MapPin,
  Activity,
  Heart,
  Bell,
  Settings,
  Clock,
  Users,
  Zap,
  CheckCircle,
  Play,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  autoCall: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
}

interface MonitoringStatus {
  isActive: boolean;
  startTime?: Date;
  duration?: number;
  emergencyTriggered: boolean;
  alertsCount: number;
  lastVitalCheck?: Date;
}

export default function EmergencyMonitorPage() {
  const [monitoringStatus, setMonitoringStatus] = useState<MonitoringStatus>({
    isActive: false,
    emergencyTriggered: false,
    alertsCount: 0
  });
  
  const [emergencyAlert, setEmergencyAlert] = useState<{
    active: boolean;
    type: 'medical' | 'panic' | 'fall' | 'medication';
  } | null>(null);

  const [protocols, setProtocols] = useState<EmergencyProtocol[]>([
    {
      id: 'heart-rate-critical',
      name: 'Critical Heart Rate',
      description: 'Triggers when heart rate exceeds 150 BPM or drops below 40 BPM',
      triggerConditions: ['Heart rate > 150 BPM', 'Heart rate < 40 BPM'],
      autoCall: true,
      priority: 'critical',
      enabled: true
    },
    {
      id: 'blood-pressure-high',
      name: 'Hypertensive Crisis',
      description: 'Triggers for systolic BP > 180 or diastolic BP > 120',
      triggerConditions: ['Systolic BP > 180 mmHg', 'Diastolic BP > 120 mmHg'],
      autoCall: true,
      priority: 'critical',
      enabled: true
    },
    {
      id: 'oxygen-low',
      name: 'Low Oxygen Saturation',
      description: 'Triggers when oxygen saturation drops below 88%',
      triggerConditions: ['O₂ Saturation < 88%'],
      autoCall: true,
      priority: 'high',
      enabled: true
    },
    {
      id: 'fall-detection',
      name: 'Fall Detection',
      description: 'Uses device sensors to detect sudden falls',
      triggerConditions: ['Sudden acceleration detected', 'No movement after impact'],
      autoCall: false,
      priority: 'high',
      enabled: true
    },
    {
      id: 'medication-missed',
      name: 'Missed Medication',
      description: 'Alerts when critical medications are missed',
      triggerConditions: ['Medication overdue > 2 hours'],
      autoCall: false,
      priority: 'medium',
      enabled: true
    }
  ]);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  useEffect(() => {
    // Get user's location for emergency services
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Get address
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Could not get location:', error);
        }
      );
    }
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      if (location) {
        setLocation(prev => ({
          ...prev!,
          address: data.display_name
        }));
      }
    } catch (error) {
      console.warn('Could not get address:', error);
    }
  };

  const triggerEmergencyAlert = (type: 'medical' | 'panic' | 'fall' | 'medication') => {
    setEmergencyAlert({ active: true, type });
    setMonitoringStatus(prev => ({ 
      ...prev, 
      emergencyTriggered: true,
      alertsCount: prev.alertsCount + 1
    }));
  };

  const dismissEmergencyAlert = () => {
    setEmergencyAlert(null);
    setMonitoringStatus(prev => ({ 
      ...prev, 
      emergencyTriggered: false
    }));
  };

  const toggleProtocol = (protocolId: string) => {
    setProtocols(prev => prev.map(protocol => 
      protocol.id === protocolId 
        ? { ...protocol, enabled: !protocol.enabled }
        : protocol
    ));
  };

  const startMonitoring = () => {
    setMonitoringStatus({
      isActive: true,
      startTime: new Date(),
      duration: 0,
      emergencyTriggered: false,
      alertsCount: 0,
      lastVitalCheck: new Date()
    });
  };

  const stopMonitoring = () => {
    setMonitoringStatus({
      isActive: false,
      emergencyTriggered: false,
      alertsCount: 0
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50 text-red-700';
      case 'high': return 'border-orange-500 bg-orange-50 text-orange-700';
      case 'medium': return 'border-yellow-500 bg-yellow-50 text-yellow-700';
      case 'low': return 'border-blue-500 bg-blue-50 text-blue-700';
      default: return 'border-gray-500 bg-gray-50 text-gray-700';
    }
  };

  const formatDuration = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Emergency Alert Overlay */}
      <AnimatePresence>
        {emergencyAlert?.active && (
          <EmergencyAlert
            type={emergencyAlert.type}
            onDismiss={dismissEmergencyAlert}
            autoCall={protocols.find(p => p.id.includes(emergencyAlert.type))?.autoCall}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Emergency Monitor</h1>
                <p className="text-gray-600">Real-time health monitoring and emergency response</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {monitoringStatus.isActive && (
                <Badge className="bg-red-100 text-red-800 border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  MONITORING ACTIVE
                </Badge>
              )}
              
              {location && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <MapPin className="w-3 h-3 mr-1" />
                  Location: ON
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monitoring Status</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringStatus.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  monitoringStatus.isActive ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Activity className={`w-6 h-6 ${
                    monitoringStatus.isActive ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Protocols</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {protocols.filter(p => p.enabled).length}/{protocols.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alerts Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringStatus.alertsCount}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  monitoringStatus.alertsCount > 0 ? 'bg-yellow-100' : 'bg-gray-100'
                }`}>
                  <Bell className={`w-6 h-6 ${
                    monitoringStatus.alertsCount > 0 ? 'text-yellow-600' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Session Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {monitoringStatus.startTime && monitoringStatus.isActive 
                      ? formatDuration(Date.now() - monitoringStatus.startTime.getTime())
                      : '--'
                    }
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Emergency Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Emergency Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  onClick={() => triggerEmergencyAlert('medical')}
                  variant="destructive"
                  className="h-16 text-left"
                >
                  <div>
                    <Heart className="w-5 h-5 mb-1" />
                    <div className="text-sm font-semibold">Medical</div>
                    <div className="text-xs opacity-80">Emergency</div>
                  </div>
                </Button>

                <Button
                  onClick={() => triggerEmergencyAlert('panic')}
                  variant="destructive"
                  className="h-16 text-left bg-orange-600 hover:bg-orange-700"
                >
                  <div>
                    <AlertTriangle className="w-5 h-5 mb-1" />
                    <div className="text-sm font-semibold">Panic</div>
                    <div className="text-xs opacity-80">Button</div>
                  </div>
                </Button>

                <Button
                  onClick={() => triggerEmergencyAlert('fall')}
                  variant="destructive"
                  className="h-16 text-left bg-yellow-600 hover:bg-yellow-700"
                >
                  <div>
                    <Zap className="w-5 h-5 mb-1" />
                    <div className="text-sm font-semibold">Fall</div>
                    <div className="text-xs opacity-80">Detected</div>
                  </div>
                </Button>

                <Button
                  onClick={() => window.open('tel:911')}
                  variant="destructive"
                  className="h-16 text-left bg-red-800 hover:bg-red-900"
                >
                  <div>
                    <Phone className="w-5 h-5 mb-1" />
                    <div className="text-sm font-semibold">Call 911</div>
                    <div className="text-xs opacity-80">Direct</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="monitor" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="monitor">Health Monitor</TabsTrigger>
              <TabsTrigger value="protocols">Emergency Protocols</TabsTrigger>
              <TabsTrigger value="location">Location & Contacts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="monitor" className="space-y-6">
              <HealthMonitor />
            </TabsContent>

            <TabsContent value="protocols" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Response Protocols</CardTitle>
                  <p className="text-gray-600">Configure automatic emergency responses based on health conditions</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {protocols.map(protocol => (
                      <div 
                        key={protocol.id} 
                        className={`border rounded-lg p-4 ${getPriorityColor(protocol.priority)}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={protocol.enabled}
                                onChange={() => toggleProtocol(protocol.id)}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                              <h3 className="font-semibold">{protocol.name}</h3>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {protocol.priority}
                            </Badge>
                            {protocol.autoCall && (
                              <Badge className="bg-red-100 text-red-800">
                                Auto-Call 911
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm mb-3">{protocol.description}</p>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Trigger Conditions:</h4>
                          <ul className="text-sm space-y-1">
                            {protocol.triggerConditions.map((condition, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3" />
                                {condition}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="location" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Current Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {location ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-600 mb-1">📍 Location Active</p>
                          <p className="text-sm font-mono text-gray-700">
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                          </p>
                          {location.address && (
                            <p className="text-sm text-gray-600 mt-2">
                              {location.address}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          This location will be shared with emergency services when needed.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          Location access not available. Emergency services may not be able to locate you automatically.
                        </p>
                        <Button size="sm" className="mt-2" onClick={() => window.location.reload()}>
                          Enable Location
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-sm text-gray-600">Spouse • Primary Contact</p>
                            <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dr. Michael Chen</p>
                            <p className="text-sm text-gray-600">Primary Care Physician</p>
                            <p className="text-sm text-gray-500">+1 (555) 987-6543</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/emergency/contacts">
                      <Button variant="outline" className="w-full mt-4">
                        Manage Emergency Contacts
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Monitoring Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Auto-Emergency Response</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span>Enable automatic 911 calling for critical alerts</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span>Send location data to emergency services</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span>Notify emergency contacts automatically</span>
                        </label>
                      </div>
                    </div>

                    <hr />

                    <div>
                      <h3 className="font-medium mb-3">Monitoring Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span>Continuous heart rate monitoring</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4" />
                          <span>Fall detection (requires compatible device)</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span>Medication reminders with emergency alerts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}