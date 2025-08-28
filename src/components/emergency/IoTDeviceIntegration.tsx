"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Smartphone,
  Watch,
  Activity,
  Heart,
  Bluetooth,
  Wifi,
  Zap,
  CheckCircle,
  XCircle,
  RefreshCw,
  Settings,
  Battery,
  Signal,
  Thermometer,
  Footprints,
  Moon,
  Sun,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Target,
  Calendar,
  Clock,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface IoTDevice {
  id: string;
  name: string;
  type: 'smartwatch' | 'fitness_tracker' | 'smart_scale' | 'blood_pressure_monitor' | 'glucose_monitor' | 'pulse_oximeter' | 'thermometer';
  brand: string;
  model: string;
  connectionType: 'bluetooth' | 'wifi' | 'cellular';
  status: 'connected' | 'disconnected' | 'syncing' | 'low_battery' | 'error';
  batteryLevel?: number;
  signalStrength?: number;
  lastSync: Date;
  capabilities: string[];
  currentData?: {
    [key: string]: any;
  };
  historicalData?: {
    timestamp: Date;
    metrics: { [key: string]: any };
  }[];
}

interface HealthMetric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  source: string;
  timestamp: Date;
  target?: {
    min?: number;
    max?: number;
    optimal?: number;
  };
}

interface SyncSession {
  deviceId: string;
  startTime: Date;
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  errors: string[];
  status: 'active' | 'completed' | 'failed';
}

export default function IoTDeviceIntegration() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [syncSessions, setSyncSessions] = useState<SyncSession[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [dataRetention, setDataRetention] = useState(90); // days

  const scanTimeoutRef = useRef<NodeJS.Timeout>();
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeIoTDevices();
    startPeriodicSync();
    return () => {
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  const initializeIoTDevices = async () => {
    // Mock IoT devices
    const mockDevices: IoTDevice[] = [
      {
        id: 'apple-watch-001',
        name: 'Apple Watch Series 9',
        type: 'smartwatch',
        brand: 'Apple',
        model: 'Series 9 GPS',
        connectionType: 'bluetooth',
        status: 'connected',
        batteryLevel: 78,
        signalStrength: 85,
        lastSync: new Date(Date.now() - 300000), // 5 minutes ago
        capabilities: [
          'Heart Rate Monitoring',
          'ECG Recording',
          'Blood Oxygen',
          'Sleep Tracking',
          'Activity Tracking',
          'Fall Detection',
          'Irregular Rhythm Alerts'
        ],
        currentData: {
          heartRate: 72,
          bloodOxygen: 98,
          steps: 8456,
          caloriesBurned: 342,
          activeMinutes: 67,
          sleepScore: 85
        },
        historicalData: [
          {
            timestamp: new Date(Date.now() - 86400000),
            metrics: { heartRate: 75, bloodOxygen: 97, steps: 7892 }
          }
        ]
      },
      {
        id: 'fitbit-001',
        name: 'Fitbit Sense 2',
        type: 'fitness_tracker',
        brand: 'Fitbit',
        model: 'Sense 2',
        connectionType: 'bluetooth',
        status: 'connected',
        batteryLevel: 45,
        signalStrength: 92,
        lastSync: new Date(Date.now() - 600000), // 10 minutes ago
        capabilities: [
          'Heart Rate Variability',
          'Stress Management',
          'Skin Temperature',
          'SpO2 Monitoring',
          'Sleep Stages',
          'Active Zone Minutes'
        ],
        currentData: {
          heartRate: 68,
          stressLevel: 23,
          skinTemp: 97.8,
          steps: 9234,
          activeZoneMinutes: 45
        }
      },
      {
        id: 'garmin-001',
        name: 'Garmin Venu 3',
        type: 'smartwatch',
        brand: 'Garmin',
        model: 'Venu 3',
        connectionType: 'bluetooth',
        status: 'syncing',
        batteryLevel: 92,
        signalStrength: 78,
        lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
        capabilities: [
          'Advanced Sleep Coaching',
          'HRV Status',
          'Training Readiness',
          'Body Battery Energy',
          'Pulse Ox',
          'GPS Tracking'
        ],
        currentData: {
          bodyBattery: 68,
          trainingReadiness: 'Good',
          vo2Max: 42
        }
      },
      {
        id: 'withings-scale-001',
        name: 'Withings Body+',
        type: 'smart_scale',
        brand: 'Withings',
        model: 'Body+ (WBS05)',
        connectionType: 'wifi',
        status: 'connected',
        batteryLevel: 88,
        signalStrength: 95,
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        capabilities: [
          'Weight Tracking',
          'Body Composition',
          'BMI Calculation',
          'Muscle Mass',
          'Bone Mass',
          'Water Percentage'
        ],
        currentData: {
          weight: 165.2,
          bmi: 23.4,
          bodyFat: 18.5,
          muscleMass: 132.1,
          boneMass: 6.8,
          waterPercentage: 58.3
        }
      },
      {
        id: 'omron-bp-001',
        name: 'Omron HeartGuide',
        type: 'blood_pressure_monitor',
        brand: 'Omron',
        model: 'HeartGuide BP8000M',
        connectionType: 'bluetooth',
        status: 'low_battery',
        batteryLevel: 12,
        signalStrength: 67,
        lastSync: new Date(Date.now() - 7200000), // 2 hours ago
        capabilities: [
          'Oscillometric BP Measurement',
          'EKG Recording',
          'Activity Tracking',
          'Sleep Monitoring'
        ],
        currentData: {
          systolic: 118,
          diastolic: 76,
          pulse: 71
        }
      }
    ];

    // Generate mock health metrics from device data
    const mockMetrics: HealthMetric[] = [
      {
        id: 'metric-001',
        name: 'Resting Heart Rate',
        value: 72,
        unit: 'BPM',
        status: 'normal',
        trend: 'stable',
        source: 'Apple Watch Series 9',
        timestamp: new Date(),
        target: { min: 60, max: 80, optimal: 70 }
      },
      {
        id: 'metric-002',
        name: 'Blood Oxygen',
        value: 98,
        unit: '%',
        status: 'normal',
        trend: 'up',
        source: 'Apple Watch Series 9',
        timestamp: new Date(),
        target: { min: 95, max: 100, optimal: 98 }
      },
      {
        id: 'metric-003',
        name: 'Daily Steps',
        value: 8456,
        unit: 'steps',
        status: 'normal',
        trend: 'up',
        source: 'Apple Watch Series 9',
        timestamp: new Date(),
        target: { min: 8000, optimal: 10000 }
      },
      {
        id: 'metric-004',
        name: 'Sleep Score',
        value: 85,
        unit: 'score',
        status: 'normal',
        trend: 'stable',
        source: 'Apple Watch Series 9',
        timestamp: new Date(),
        target: { min: 70, optimal: 85 }
      },
      {
        id: 'metric-005',
        name: 'Stress Level',
        value: 23,
        unit: '%',
        status: 'normal',
        trend: 'down',
        source: 'Fitbit Sense 2',
        timestamp: new Date(),
        target: { max: 30, optimal: 20 }
      },
      {
        id: 'metric-006',
        name: 'Body Weight',
        value: 165.2,
        unit: 'lbs',
        status: 'normal',
        trend: 'stable',
        source: 'Withings Body+',
        timestamp: new Date(),
        target: { min: 160, max: 170, optimal: 165 }
      },
      {
        id: 'metric-007',
        name: 'Blood Pressure',
        value: '118/76',
        unit: 'mmHg',
        status: 'normal',
        trend: 'stable',
        source: 'Omron HeartGuide',
        timestamp: new Date(),
        target: { optimal: 120 }
      }
    ];

    setDevices(mockDevices);
    setHealthMetrics(mockMetrics);
  };

  const startPeriodicSync = () => {
    if (autoSync) {
      syncTimeoutRef.current = setTimeout(() => {
        syncAllDevices();
        startPeriodicSync(); // Schedule next sync
      }, 300000); // Every 5 minutes
    }
  };

  const scanForDevices = async () => {
    setIsScanning(true);
    
    // Simulate device scanning
    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
      // Could add new devices here in real implementation
    }, 3000);
  };

  const connectDevice = async (deviceId: string) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId
          ? { ...device, status: 'syncing' }
          : device
      )
    );

    // Simulate connection process
    setTimeout(() => {
      setDevices(prev =>
        prev.map(device =>
          device.id === deviceId
            ? { ...device, status: 'connected', lastSync: new Date() }
            : device
        )
      );
    }, 2000);
  };

  const disconnectDevice = async (deviceId: string) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId
          ? { ...device, status: 'disconnected' }
          : device
      )
    );
  };

  const syncDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    const syncSession: SyncSession = {
      deviceId,
      startTime: new Date(),
      progress: 0,
      recordsProcessed: 0,
      totalRecords: Math.floor(Math.random() * 100) + 50,
      errors: [],
      status: 'active'
    };

    setSyncSessions(prev => [...prev.filter(s => s.deviceId !== deviceId), syncSession]);

    setDevices(prev =>
      prev.map(d => d.id === deviceId ? { ...d, status: 'syncing' } : d)
    );

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setSyncSessions(prev =>
        prev.map(s => s.deviceId === deviceId ? {
          ...s,
          progress: i,
          recordsProcessed: Math.floor((i / 100) * s.totalRecords)
        } : s)
      );
    }

    // Complete sync
    setSyncSessions(prev =>
      prev.map(s => s.deviceId === deviceId ? { ...s, status: 'completed' } : s)
    );

    setDevices(prev =>
      prev.map(d => d.id === deviceId ? { 
        ...d, 
        status: 'connected',
        lastSync: new Date()
      } : d)
    );

    setTimeout(() => {
      setSyncSessions(prev => prev.filter(s => s.deviceId !== deviceId));
    }, 2000);
  };

  const syncAllDevices = async () => {
    const connectedDevices = devices.filter(d => d.status === 'connected');
    for (const device of connectedDevices) {
      await syncDevice(device.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Stagger syncs
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low_battery': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'low_battery': return <Battery className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'disconnected': return <XCircle className="w-4 h-4 text-gray-600" />;
      default: return <Signal className="w-4 h-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartwatch': return <Watch className="w-5 h-5" />;
      case 'fitness_tracker': return <Activity className="w-5 h-5" />;
      case 'smart_scale': return <Target className="w-5 h-5" />;
      case 'blood_pressure_monitor': return <Heart className="w-5 h-5" />;
      case 'glucose_monitor': return <Plus className="w-5 h-5" />;
      case 'pulse_oximeter': return <Activity className="w-5 h-5" />;
      case 'thermometer': return <Thermometer className="w-5 h-5" />;
      default: return <Smartphone className="w-5 h-5" />;
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-blue-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
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
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <Watch className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              IoT Device Integration
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Bluetooth className="w-3 h-3 mr-1" />
                Multi-Device
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <RefreshCw className="w-3 h-3 mr-1" />
                Real-time Sync
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Heart className="w-3 h-3 mr-1" />
                Health Tracking
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Comprehensive integration with smartwatches, fitness trackers, and health monitoring devices
        </p>
      </motion.div>

      {/* Device Management Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Settings className="w-6 h-6" />
                Device Management
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={scanForDevices}
                  disabled={isScanning}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                >
                  {isScanning ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Bluetooth className="w-4 h-4 mr-2" />}
                  {isScanning ? 'Scanning...' : 'Scan Devices'}
                </Button>
                <Button
                  onClick={syncAllDevices}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={autoSync}
                    onChange={(e) => setAutoSync(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Auto-sync every 5 minutes</span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Data retention:</span>
                <Input
                  type="number"
                  value={dataRetention}
                  onChange={(e) => setDataRetention(parseInt(e.target.value))}
                  className="w-20"
                  min="7"
                  max="365"
                />
                <span className="text-sm text-gray-600">days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Connected Devices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Smartphone className="w-6 h-6" />
              Connected Devices ({devices.filter(d => d.status === 'connected').length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              {devices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedDevice(device)}
                >
                  {/* Device Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                        {getDeviceIcon(device.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{device.name}</h4>
                        <p className="text-sm text-gray-600">{device.brand} {device.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(device.status)}
                      <Badge className={getStatusColor(device.status)}>
                        {device.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Device Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {device.batteryLevel && (
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Battery className={`w-4 h-4 mx-auto mb-1 ${
                          device.batteryLevel > 50 ? 'text-green-600' : 
                          device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                        <div className="text-xs font-medium">{device.batteryLevel}%</div>
                      </div>
                    )}
                    {device.signalStrength && (
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <Signal className={`w-4 h-4 mx-auto mb-1 ${
                          device.signalStrength > 70 ? 'text-green-600' : 
                          device.signalStrength > 40 ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                        <div className="text-xs font-medium">{device.signalStrength}%</div>
                      </div>
                    )}
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      {device.connectionType === 'bluetooth' ? <Bluetooth className="w-4 h-4 mx-auto mb-1 text-blue-600" /> : 
                       device.connectionType === 'wifi' ? <Wifi className="w-4 h-4 mx-auto mb-1 text-green-600" /> :
                       <Signal className="w-4 h-4 mx-auto mb-1 text-purple-600" />}
                      <div className="text-xs font-medium capitalize">{device.connectionType}</div>
                    </div>
                  </div>

                  {/* Last Sync */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>Last sync: {device.lastSync.toLocaleTimeString()}</span>
                    <span>{device.capabilities.length} features</span>
                  </div>

                  {/* Sync Progress */}
                  {syncSessions.find(s => s.deviceId === device.id) && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-blue-900">Syncing...</span>
                        <span className="text-sm text-blue-700">
                          {syncSessions.find(s => s.deviceId === device.id)?.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${syncSessions.find(s => s.deviceId === device.id)?.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {device.status === 'connected' && (
                      <>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            syncDevice(device.id);
                          }}
                          size="sm"
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                          disabled={syncSessions.some(s => s.deviceId === device.id)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Sync
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            disconnectDevice(device.id);
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl"
                        >
                          Disconnect
                        </Button>
                      </>
                    )}
                    {(device.status === 'disconnected' || device.status === 'error') && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          connectDevice(device.id);
                        }}
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Metrics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Activity className="w-6 h-6" />
              Live Health Metrics
            </CardTitle>
            <p className="text-gray-600">Real-time data from connected IoT devices</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthMetrics.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    metric.status === 'normal' ? 'bg-green-50 border-green-200' :
                    metric.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 text-sm">{metric.name}</h5>
                    {getTrendIcon(metric.trend)}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-2xl font-bold ${getMetricStatusColor(metric.status)}`}>
                      {metric.value}
                    </span>
                    <span className="text-sm text-gray-600">{metric.unit}</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    From {metric.source}
                  </div>
                  
                  {metric.target && (
                    <div className="text-xs text-gray-600">
                      Target: {metric.target.optimal ? `${metric.target.optimal} ${metric.unit}` : 
                              `${metric.target.min || 0}-${metric.target.max || '∞'} ${metric.unit}`}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {metric.timestamp.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Device Details Modal */}
      <AnimatePresence>
        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDevice(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl text-white">
                    {getDeviceIcon(selectedDevice.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedDevice.name}</h3>
                    <p className="text-gray-600">{selectedDevice.brand} {selectedDevice.model}</p>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedDevice(null)}
                  variant="ghost"
                  className="rounded-xl"
                >
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Device Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Device Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedDevice.status)}>
                        {selectedDevice.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Connection:</span>
                      <span className="font-medium capitalize">{selectedDevice.connectionType}</span>
                    </div>
                    {selectedDevice.batteryLevel && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Battery:</span>
                        <span className="font-medium">{selectedDevice.batteryLevel}%</span>
                      </div>
                    )}
                    {selectedDevice.signalStrength && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Signal:</span>
                        <span className="font-medium">{selectedDevice.signalStrength}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium">{selectedDevice.lastSync.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Current Data */}
                {selectedDevice.currentData && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Current Readings</h4>
                    <div className="space-y-2">
                      {Object.entries(selectedDevice.currentData).map(([key, value]) => (
                        <div key={key} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Capabilities */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-3">Capabilities</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedDevice.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-blue-50 border border-blue-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">IoT Health Device Integration Platform</p>
                <ul className="text-xs space-y-1">
                  <li>• Multi-protocol device support (Bluetooth, WiFi, Cellular)</li>
                  <li>• Real-time health metric synchronization and trend analysis</li>
                  <li>• Battery and connectivity monitoring for reliable data collection</li>
                  <li>• Automated data validation and anomaly detection</li>
                  <li>• HIPAA-compliant secure device communication and data storage</li>
                  <li>• Integration with Apple Health, Google Fit, and major health platforms</li>
                  <li>• DEMO: This showcases comprehensive IoT health ecosystem management</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}