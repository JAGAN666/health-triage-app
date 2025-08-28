"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Phone, 
  Smartphone, 
  Speaker, 
  Watch, 
  Home, 
  Users,
  Volume2,
  Bell,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CriticalAlertBypass from "./CriticalAlertBypass";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  priority: number;
  devices?: string[];
  preferredNotificationTime?: string;
  location?: string;
  responseStatus?: 'pending' | 'delivered' | 'acknowledged' | 'responded' | 'failed';
}

interface NotificationMethod {
  id: string;
  name: string;
  type: 'audio' | 'visual' | 'haptic' | 'network' | 'iot';
  bypassesSilentMode: boolean;
  effectiveness: number; // 0-100
  description: string;
  icon: React.ComponentType<any>;
  status: 'available' | 'unavailable' | 'testing' | 'active';
}

interface EmergencyEscalation {
  contactId: string;
  attempts: number;
  methods: string[];
  lastAttempt: Date;
  nextEscalation?: Date;
  responseReceived: boolean;
}

export default function SilentModeBypass() {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      phone: '+1-555-0123',
      relationship: 'Primary Care Physician',
      priority: 1,
      devices: ['iPhone', 'iPad', 'Apple Watch'],
      preferredNotificationTime: 'anytime',
      location: 'Metro Hospital',
      responseStatus: 'pending'
    },
    {
      id: '2', 
      name: 'John Smith',
      phone: '+1-555-0124',
      relationship: 'Emergency Contact (Spouse)',
      priority: 2,
      devices: ['Android Phone', 'Smart Home System'],
      preferredNotificationTime: 'anytime',
      location: 'Home',
      responseStatus: 'pending'
    },
    {
      id: '3',
      name: 'Maria Rodriguez',
      phone: '+1-555-0125',
      relationship: 'Neighbor & Backup Contact',
      priority: 3,
      devices: ['iPhone', 'Smart Speaker'],
      preferredNotificationTime: '6AM-11PM',
      location: 'Next Door',
      responseStatus: 'pending'
    }
  ]);

  const [bypassMethods, setBypassMethods] = useState<NotificationMethod[]>([
    {
      id: 'critical-alerts',
      name: 'Critical Alert Bypass',
      type: 'audio',
      bypassesSilentMode: true,
      effectiveness: 95,
      description: 'iOS/Android emergency override that bypasses Do Not Disturb mode',
      icon: Bell,
      status: 'available'
    },
    {
      id: 'escalating-volume',
      name: 'Progressive Volume Alert',
      type: 'audio', 
      bypassesSilentMode: true,
      effectiveness: 85,
      description: 'Starts quiet and gradually increases to maximum volume over 30 seconds',
      icon: Volume2,
      status: 'available'
    },
    {
      id: 'multi-device',
      name: 'Multi-Device Synchronization',
      type: 'network',
      bypassesSilentMode: true,
      effectiveness: 90,
      description: 'Simultaneously alerts phone, tablet, laptop, and smartwatch',
      icon: Smartphone,
      status: 'available'
    },
    {
      id: 'smart-home',
      name: 'Smart Home Integration',
      type: 'iot',
      bypassesSilentMode: true,
      effectiveness: 88,
      description: 'Triggers smart speakers, lights, and connected home devices',
      icon: Home,
      status: 'testing'
    },
    {
      id: 'haptic-wake',
      name: 'Continuous Haptic Wake',
      type: 'haptic',
      bypassesSilentMode: true,
      effectiveness: 75,
      description: 'Strong continuous vibration pattern designed to wake deep sleepers',
      icon: Watch,
      status: 'available'
    },
    {
      id: 'community-network',
      name: 'Local Community Network',
      type: 'network',
      bypassesSilentMode: true,
      effectiveness: 80,
      description: 'Alerts nearby app users who can physically check on contacts',
      icon: Users,
      status: 'unavailable'
    }
  ]);

  const [escalationStatus, setEscalationStatus] = useState<EmergencyEscalation[]>([]);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [testingMethod, setTestingMethod] = useState<string | null>(null);

  // Simulate emergency contact escalation
  const startEmergencyEscalation = useCallback(async (emergencyData: any) => {
    setIsEmergencyActive(true);
    
    // Initialize escalation tracking for all contacts
    const initialEscalations = emergencyContacts.map(contact => ({
      contactId: contact.id,
      attempts: 0,
      methods: [],
      lastAttempt: new Date(),
      responseReceived: false
    }));
    
    setEscalationStatus(initialEscalations);

    // Start with highest priority contacts
    const sortedContacts = [...emergencyContacts].sort((a, b) => a.priority - b.priority);
    
    for (const contact of sortedContacts.slice(0, 2)) { // Start with top 2 priority
      await attemptContactNotification(contact, emergencyData);
      
      // Wait 30 seconds before next contact if this is 3:30 AM scenario
      const currentHour = new Date().getHours();
      const isNightTime = currentHour >= 22 || currentHour <= 6;
      
      if (isNightTime) {
        // Use maximum bypass methods during night hours
        await new Promise(resolve => setTimeout(resolve, 1000)); // Faster escalation at night
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }, [emergencyContacts]);

  const attemptContactNotification = async (contact: EmergencyContact, emergencyData: any) => {
    console.log(`🚨 CRITICAL: Attempting to wake ${contact.name} - Silent Mode Bypass Activated`);
    
    // Update contact status
    setEmergencyContacts(prev => 
      prev.map(c => c.id === contact.id ? { ...c, responseStatus: 'delivered' } : c)
    );

    // Simulate multiple notification methods
    const methods = ['critical-alerts', 'escalating-volume', 'multi-device', 'haptic-wake'];
    
    if (contact.devices?.includes('Smart Home System')) {
      methods.push('smart-home');
    }

    try {
      // Call the enhanced emergency contact API
      const response = await fetch('/api/emergency-contact-bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact,
          emergencyData,
          bypassMethods: methods,
          timestamp: new Date().toISOString(),
          isNightTime: isNightTimeEmergency(),
          escalationLevel: 'MAXIMUM' // For silent mode bypass
        })
      });

      if (response.ok) {
        console.log(`✅ Emergency bypass notification sent to ${contact.name}`);
        
        // Simulate response after delay (in real world, this would be actual response)
        setTimeout(() => {
          setEmergencyContacts(prev => 
            prev.map(c => c.id === contact.id ? { ...c, responseStatus: 'acknowledged' } : c)
          );
        }, Math.random() * 10000 + 5000); // 5-15 seconds response time
      }
    } catch (error) {
      console.error(`Failed to contact ${contact.name}:`, error);
      
      setEmergencyContacts(prev => 
        prev.map(c => c.id === contact.id ? { ...c, responseStatus: 'failed' } : c)
      );
    }
  };

  const isNightTimeEmergency = () => {
    const hour = new Date().getHours();
    return hour >= 22 || hour <= 6; // 10 PM to 6 AM
  };

  const testBypassMethod = async (methodId: string) => {
    setTestingMethod(methodId);
    
    const method = bypassMethods.find(m => m.id === methodId);
    if (!method) return;

    try {
      // Simulate testing the bypass method
      const response = await fetch('/api/test-bypass-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          methodId,
          methodName: method.name,
          testMode: true,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setBypassMethods(prev => 
          prev.map(m => m.id === methodId ? { ...m, status: 'active' } : m)
        );
        
        console.log(`✅ ${method.name} test successful - Silent mode bypass confirmed`);
      }
    } catch (error) {
      console.error(`Test failed for ${method.name}:`, error);
      setBypassMethods(prev => 
        prev.map(m => m.id === methodId ? { ...m, status: 'unavailable' } : m)
      );
    }
    
    setTimeout(() => {
      setTestingMethod(null);
      setBypassMethods(prev => 
        prev.map(m => m.id === methodId ? { ...m, status: 'available' } : m)
      );
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'acknowledged': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMethodStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'testing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
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
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
            Silent Mode Emergency Bypass
          </h2>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Advanced notification system designed to reach emergency contacts even when their devices are on silent mode during critical nighttime emergencies
        </p>
        
        {/* Real-world Problem Statement */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-bold text-red-900 mb-2">Real-World Problem This Solves</h3>
                <p className="text-sm text-red-800 mb-3">
                  <strong>Scenario:</strong> 3:30 AM car accident - Emergency contacts miss critical notifications because phones are on silent mode. 
                  Officers can't reach family members during the golden hour when immediate response could save lives.
                </p>
                <p className="text-sm text-red-700 font-medium">
                  <strong>Solution:</strong> Multi-layered bypass system ensures emergency contacts are woken up and notified regardless of device settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Silent Mode Bypass Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-6 h-6" />
              Emergency Bypass Technologies
            </CardTitle>
            <p className="text-sm text-gray-600">
              These methods work even when devices are on silent, Do Not Disturb, or sleep mode
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {bypassMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl border-2 ${
                      method.status === 'available' ? 'bg-green-50 border-green-200' :
                      method.status === 'active' ? 'bg-blue-50 border-blue-200' :
                      method.status === 'testing' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${
                          method.status === 'available' ? 'text-green-600' :
                          method.status === 'active' ? 'text-blue-600' :
                          method.status === 'testing' ? 'text-yellow-600' :
                          'text-red-600'
                        }`} />
                        <div>
                          <p className="font-semibold text-sm">{method.name}</p>
                          <Badge className={`text-xs ${getMethodStatusColor(method.status)}`}>
                            {method.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs font-bold ${
                          method.effectiveness >= 90 ? 'text-green-600' :
                          method.effectiveness >= 80 ? 'text-blue-600' :
                          method.effectiveness >= 70 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {method.effectiveness}% Effective
                        </div>
                        {method.bypassesSilentMode && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            ✓ Bypasses Silent Mode
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-700 mb-3">{method.description}</p>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testBypassMethod(method.id)}
                      disabled={testingMethod === method.id || method.status === 'unavailable'}
                      className="w-full text-xs"
                    >
                      {testingMethod === method.id ? 'Testing...' : 'Test Method'}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Contacts with Response Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Users className="w-6 h-6" />
              Emergency Contacts with Bypass Capabilities
            </CardTitle>
            <p className="text-sm text-gray-600">
              Contacts will be notified using silent mode bypass methods during emergencies
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyContacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        contact.responseStatus === 'responded' ? 'bg-green-500' :
                        contact.responseStatus === 'acknowledged' ? 'bg-yellow-500' :
                        contact.responseStatus === 'delivered' ? 'bg-blue-500' :
                        contact.responseStatus === 'failed' ? 'bg-red-500' :
                        'bg-gray-300'
                      }`}>
                        {contact.responseStatus === 'responded' && <CheckCircle className="w-6 h-6 text-white" />}
                        {contact.responseStatus === 'acknowledged' && <Clock className="w-6 h-6 text-white" />}
                        {contact.responseStatus === 'delivered' && <Bell className="w-6 h-6 text-white" />}
                        {contact.responseStatus === 'failed' && <AlertTriangle className="w-6 h-6 text-white" />}
                        {contact.responseStatus === 'pending' && <Phone className="w-6 h-6 text-white" />}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-semibold text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.relationship}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {contact.location} • {contact.phone}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <p className="text-xs text-gray-500">Devices:</p>
                        {contact.devices?.map((device, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                            {device}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${getStatusColor(contact.responseStatus || 'pending')} font-semibold`}>
                      Priority {contact.priority}
                    </Badge>
                    <div className="mt-2">
                      <Badge className={getStatusColor(contact.responseStatus || 'pending')}>
                        {(contact.responseStatus || 'pending').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Demo Emergency Scenario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                DEMO
              </div>
              <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                SIMULATED
              </div>
            </div>
            <CardTitle className="text-2xl text-red-900">3:30 AM Emergency Scenario Test</CardTitle>
            <p className="text-sm text-red-700 mt-2">
              Simulate the real-world car accident scenario where emergency contacts need to be woken up immediately
            </p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => startEmergencyEscalation({
                scenario: '3:30 AM Car Accident',
                severity: 'CRITICAL',
                location: 'Highway 101, Mile Marker 47',
                medicalStatus: 'Unconscious adult, conscious child',
                timeOfEmergency: '3:30 AM'
              })}
              disabled={isEmergencyActive}
              className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 text-lg font-bold"
            >
              {isEmergencyActive ? 'Emergency Bypass Active...' : '🚨 Test Silent Mode Emergency Bypass'}
            </Button>
            
            {isEmergencyActive && (
              <div className="mt-4 p-4 bg-red-100 rounded-xl">
                <p className="text-sm font-bold text-red-900 mb-2">Emergency Bypass Sequence Activated</p>
                <p className="text-xs text-red-800">
                  All emergency contacts are being notified using silent mode bypass methods.
                  This simulation demonstrates how the system would wake family members at 3:30 AM.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Critical Alert Bypass Technical Implementation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <CriticalAlertBypass />
      </motion.div>
    </div>
  );
}