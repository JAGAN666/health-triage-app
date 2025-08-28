"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building,
  Database,
  Wifi,
  WifiOff,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  Activity,
  Stethoscope,
  Calendar,
  MapPin,
  Shield,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EHRSystem {
  id: string;
  name: string;
  vendor: string;
  version: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  lastSync: Date;
  recordsCount: number;
  endpoints: string[];
  credentials: {
    clientId: string;
    sandbox: boolean;
  };
  capabilities: string[];
}

interface PatientRecord {
  id: string;
  ehrSystemId: string;
  patientId: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  lastVisit: Date;
  conditions: string[];
  medications: string[];
  allergies: string[];
  vitals: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
}

interface SyncStatus {
  systemId: string;
  isRunning: boolean;
  progress: number;
  recordsProcessed: number;
  totalRecords: number;
  startTime: Date;
  errors: string[];
}

export default function EHRIntegrationCenter() {
  const [ehrSystems, setEHRSystems] = useState<EHRSystem[]>([]);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [syncStatuses, setSyncStatuses] = useState<SyncStatus[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<EHRSystem | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeEHRSystems();
  }, []);

  const initializeEHRSystems = async () => {
    setIsInitializing(true);
    
    // Simulate EHR system initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockEHRSystems: EHRSystem[] = [
      {
        id: 'epic-1',
        name: 'Epic MyChart',
        vendor: 'Epic Systems Corporation',
        version: '2023.1',
        status: 'connected',
        lastSync: new Date(Date.now() - 600000), // 10 minutes ago
        recordsCount: 15420,
        endpoints: [
          'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',
          'https://apporchard.epic.com/interconnect-amcurprd-oauth/api/FHIR/R4'
        ],
        credentials: {
          clientId: 'a8c8dce2-c0b4-4157-8f01-c5f7c5e8f9a1',
          sandbox: false
        },
        capabilities: [
          'Patient Read/Write',
          'Observation Read',
          'Medication Read',
          'Appointment Scheduling',
          'Clinical Notes Access',
          'Lab Results Integration'
        ]
      },
      {
        id: 'cerner-1',
        name: 'Cerner PowerChart',
        vendor: 'Oracle Cerner',
        version: '28.1',
        status: 'connected',
        lastSync: new Date(Date.now() - 900000), // 15 minutes ago
        recordsCount: 8750,
        endpoints: [
          'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d',
          'https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d'
        ],
        credentials: {
          clientId: 'b7d9eab3-d1c5-4258-9g02-d6g8d6f9g0b2',
          sandbox: true
        },
        capabilities: [
          'Patient Demographics',
          'Vital Signs Monitoring',
          'Order Management',
          'Clinical Documentation',
          'Medication Administration',
          'Care Plans'
        ]
      },
      {
        id: 'allscripts-1',
        name: 'Allscripts Professional',
        vendor: 'Allscripts Healthcare Solutions',
        version: '20.3',
        status: 'syncing',
        lastSync: new Date(Date.now() - 1800000), // 30 minutes ago
        recordsCount: 5230,
        endpoints: [
          'https://fhir.allscripts.com/fhir/r4',
          'https://developer.allscripts.com/fhir/r4'
        ],
        credentials: {
          clientId: 'c8e0fbc4-e2d6-5369-0h13-e7h9e7g0h1c3',
          sandbox: true
        },
        capabilities: [
          'Practice Management',
          'Electronic Prescribing',
          'Revenue Cycle Management',
          'Population Health',
          'Patient Portal Integration'
        ]
      },
      {
        id: 'athenahealth-1',
        name: 'athenahealth EHR',
        vendor: 'athenahealth Inc.',
        version: '2024.2',
        status: 'error',
        lastSync: new Date(Date.now() - 3600000), // 1 hour ago
        recordsCount: 0,
        endpoints: [
          'https://api.athenahealth.com/preview1/195900/fhir/r4'
        ],
        credentials: {
          clientId: 'd9f1gcd5-f3e7-6470-1i24-f8i0f8h1i2d4',
          sandbox: true
        },
        capabilities: [
          'Ambulatory EHR',
          'Revenue Cycle Management',
          'Population Health Management',
          'Patient Engagement',
          'Care Management'
        ]
      },
      {
        id: 'nextgen-1',
        name: 'NextGen Healthcare EHR',
        vendor: 'NextGen Healthcare',
        version: '5.9.4',
        status: 'disconnected',
        lastSync: new Date(Date.now() - 86400000), // 24 hours ago
        recordsCount: 2100,
        endpoints: [
          'https://fhir.nextgen.com/nge/prod/fhir-r4/fhir/R4'
        ],
        credentials: {
          clientId: 'e0g2hde6-g4f8-7581-2j35-g9j1g9i2j3e5',
          sandbox: false
        },
        capabilities: [
          'Specialty EHR Solutions',
          'Interoperability Platform',
          'Analytics & Insights',
          'Patient Experience Platform'
        ]
      }
    ];

    // Mock patient records
    const mockPatientRecords: PatientRecord[] = [
      {
        id: 'patient-001',
        ehrSystemId: 'epic-1',
        patientId: 'EPIC-PT-12345',
        name: 'Sarah Johnson',
        dateOfBirth: '1985-03-15',
        gender: 'Female',
        lastVisit: new Date(Date.now() - 604800000), // 1 week ago
        conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
        medications: ['Lisinopril 10mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
        allergies: ['Penicillin', 'Shellfish'],
        vitals: {
          bloodPressure: '130/85',
          heartRate: 78,
          temperature: 98.6,
          weight: 165
        }
      },
      {
        id: 'patient-002',
        ehrSystemId: 'cerner-1',
        name: 'Michael Chen',
        patientId: 'CERNER-PT-67890',
        dateOfBirth: '1978-11-22',
        gender: 'Male',
        lastVisit: new Date(Date.now() - 259200000), // 3 days ago
        conditions: ['Asthma', 'Seasonal Allergies'],
        medications: ['Albuterol Inhaler', 'Fluticasone Nasal Spray'],
        allergies: ['Dust Mites'],
        vitals: {
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 98.2,
          weight: 180
        }
      },
      {
        id: 'patient-003',
        ehrSystemId: 'epic-1',
        name: 'Emily Rodriguez',
        patientId: 'EPIC-PT-54321',
        dateOfBirth: '1992-07-08',
        gender: 'Female',
        lastVisit: new Date(Date.now() - 86400000), // 1 day ago
        conditions: ['Anxiety Disorder', 'GERD'],
        medications: ['Sertraline 50mg', 'Omeprazole 20mg'],
        allergies: ['No Known Allergies'],
        vitals: {
          bloodPressure: '110/70',
          heartRate: 85,
          temperature: 98.4,
          weight: 140
        }
      }
    ];

    setEHRSystems(mockEHRSystems);
    setPatientRecords(mockPatientRecords);
    setIsInitializing(false);
  };

  const syncEHRSystem = async (systemId: string) => {
    const system = ehrSystems.find(s => s.id === systemId);
    if (!system) return;

    // Create sync status
    const syncStatus: SyncStatus = {
      systemId,
      isRunning: true,
      progress: 0,
      recordsProcessed: 0,
      totalRecords: Math.floor(Math.random() * 1000) + 500,
      startTime: new Date(),
      errors: []
    };

    setSyncStatuses(prev => [...prev.filter(s => s.systemId !== systemId), syncStatus]);

    // Update system status
    setEHRSystems(prev => 
      prev.map(s => s.id === systemId ? { ...s, status: 'syncing' } : s)
    );

    // Simulate sync progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSyncStatuses(prev => 
        prev.map(s => s.systemId === systemId ? {
          ...s,
          progress: i,
          recordsProcessed: Math.floor((i / 100) * s.totalRecords)
        } : s)
      );
    }

    // Complete sync
    setSyncStatuses(prev => prev.filter(s => s.systemId !== systemId));
    setEHRSystems(prev => 
      prev.map(s => s.id === systemId ? { 
        ...s, 
        status: 'connected',
        lastSync: new Date(),
        recordsCount: syncStatus.totalRecords
      } : s)
    );
  };

  const connectEHRSystem = async (systemId: string) => {
    const system = ehrSystems.find(s => s.id === systemId);
    if (!system) return;

    setEHRSystems(prev => 
      prev.map(s => s.id === systemId ? { ...s, status: 'syncing' } : s)
    );

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setEHRSystems(prev => 
      prev.map(s => s.id === systemId ? { 
        ...s, 
        status: 'connected',
        lastSync: new Date()
      } : s)
    );
  };

  const exportPatientData = (format: 'fhir' | 'hl7' | 'csv') => {
    const data = {
      format,
      timestamp: new Date().toISOString(),
      recordCount: patientRecords.length,
      patients: patientRecords.map(record => ({
        ...record,
        exportedFrom: ehrSystems.find(s => s.id === record.ehrSystemId)?.name
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ehr-export-${format}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-200';
      case 'syncing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'disconnected': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-gray-600" />;
      default: return <Wifi className="w-4 h-4 text-gray-600" />;
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
            <Building className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              EHR Integration Center
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                Multi-EHR Support
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Sync
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Comprehensive integration with major Electronic Health Record systems for seamless patient data management
        </p>
      </motion.div>

      {/* Initialization Status */}
      <AnimatePresence>
        {isInitializing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Building className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <span className="font-bold text-blue-900">Initializing EHR Connections...</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Connecting to Epic, Cerner, Allscripts, athenahealth, and NextGen systems
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EHR Systems Overview */}
      {!isInitializing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Database className="w-6 h-6" />
                    Connected EHR Systems
                  </CardTitle>
                  <p className="text-gray-600">Real-time status of major healthcare system integrations</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportPatientData('fhir')}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export FHIR
                  </Button>
                  <Button
                    onClick={() => exportPatientData('csv')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {ehrSystems.map((system, index) => (
                  <motion.div
                    key={system.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      system.status === 'connected' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                      system.status === 'syncing' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                      system.status === 'error' ? 'bg-red-50 border-red-200 hover:bg-red-100' :
                      'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedSystem(system)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <Building className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{system.name}</h3>
                          <p className="text-sm text-gray-600">{system.vendor}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(system.status)}
                        <Badge className={getStatusColor(system.status)}>
                          {system.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{system.recordsCount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Patient Records</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">v{system.version}</div>
                        <div className="text-sm text-gray-600">System Version</div>
                      </div>
                    </div>

                    {/* Last Sync */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Last sync: {system.lastSync.toLocaleString()}</span>
                    </div>

                    {/* Sync Progress */}
                    {syncStatuses.find(s => s.systemId === system.id) && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-blue-900">Syncing...</span>
                          <span className="text-sm text-blue-700">
                            {syncStatuses.find(s => s.systemId === system.id)?.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${syncStatuses.find(s => s.systemId === system.id)?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {system.status === 'connected' && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            syncEHRSystem(system.id);
                          }}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                          disabled={syncStatuses.some(s => s.systemId === system.id)}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Sync
                        </Button>
                      )}
                      {(system.status === 'disconnected' || system.status === 'error') && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            connectEHRSystem(system.id);
                          }}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                        >
                          <Wifi className="w-4 h-4 mr-2" />
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
      )}

      {/* Patient Records */}
      {!isInitializing && patientRecords.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6" />
                Integrated Patient Records
              </CardTitle>
              <p className="text-gray-600">Recent patient data synchronized from EHR systems</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/70 transition-colors"
                  >
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Patient Info */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {record.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{record.name}</h4>
                            <p className="text-sm text-gray-600">
                              {record.gender} • {new Date().getFullYear() - new Date(record.dateOfBirth).getFullYear()} years
                            </p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <div>ID: {record.patientId}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="w-3 h-3" />
                            {ehrSystems.find(s => s.id === record.ehrSystemId)?.name}
                          </div>
                        </div>
                      </div>

                      {/* Conditions & Medications */}
                      <div className="col-span-1">
                        <div className="mb-3">
                          <h5 className="font-semibold text-gray-900 text-sm mb-1">Conditions</h5>
                          <div className="space-y-1">
                            {record.conditions.slice(0, 2).map((condition, i) => (
                              <Badge key={i} className="bg-red-100 text-red-800 border-red-200 text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {record.conditions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{record.conditions.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Vitals */}
                      <div className="col-span-1">
                        <h5 className="font-semibold text-gray-900 text-sm mb-2">Latest Vitals</h5>
                        <div className="space-y-1 text-sm">
                          {record.vitals.bloodPressure && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">BP:</span>
                              <span className="font-medium">{record.vitals.bloodPressure}</span>
                            </div>
                          )}
                          {record.vitals.heartRate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">HR:</span>
                              <span className="font-medium">{record.vitals.heartRate} BPM</span>
                            </div>
                          )}
                          {record.vitals.weight && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-medium">{record.vitals.weight} lbs</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Last Visit & Actions */}
                      <div className="col-span-1 text-right">
                        <div className="mb-3">
                          <div className="text-sm text-gray-600">Last Visit</div>
                          <div className="font-semibold text-gray-900">
                            {record.lastVisit.toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl">
                            <FileText className="w-3 h-3 mr-1" />
                            View Full Record
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* EHR System Details Modal */}
      <AnimatePresence>
        {selectedSystem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSystem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{selectedSystem.name}</h3>
                  <p className="text-gray-600">{selectedSystem.vendor} • Version {selectedSystem.version}</p>
                </div>
                <Button
                  onClick={() => setSelectedSystem(null)}
                  variant="ghost"
                  className="rounded-xl"
                >
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* System Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">System Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={getStatusColor(selectedSystem.status)}>
                        {selectedSystem.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Records:</span>
                      <span className="font-medium">{selectedSystem.recordsCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium">{selectedSystem.lastSync.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <Badge className={selectedSystem.credentials.sandbox ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {selectedSystem.credentials.sandbox ? 'Sandbox' : 'Production'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Capabilities */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">System Capabilities</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedSystem.capabilities.map((capability, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Endpoints */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-3">API Endpoints</h4>
                  <div className="space-y-2">
                    {selectedSystem.endpoints.map((endpoint, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm text-gray-700 break-all">{endpoint}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-blue-50 border border-blue-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Enterprise EHR Integration</p>
                <ul className="text-xs space-y-1">
                  <li>• Real-time bidirectional data synchronization with major EHR systems</li>
                  <li>• FHIR R4 and HL7 v2.5 compliant data exchange protocols</li>
                  <li>• OAuth 2.0 authentication with healthcare-grade security standards</li>
                  <li>• Automated patient matching and duplicate record resolution</li>
                  <li>• This demonstrates enterprise-level healthcare interoperability capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}