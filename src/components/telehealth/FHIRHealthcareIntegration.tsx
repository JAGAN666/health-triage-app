"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Database,
  Share2,
  Shield,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Link2,
  Server,
  FileText,
  Clock,
  Users,
  Stethoscope,
  Activity,
  Building,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FHIRResource {
  resourceType: string;
  id: string;
  status: 'active' | 'inactive' | 'pending' | 'error';
  lastUpdated: string;
  source: string;
  data: any;
}

interface HL7Message {
  messageType: string;
  version: string;
  timestamp: string;
  sender: string;
  receiver: string;
  status: 'sent' | 'received' | 'processed' | 'error';
  content: string;
}

interface IntegrationStatus {
  epic: 'connected' | 'disconnected' | 'pending';
  cerner: 'connected' | 'disconnected' | 'pending';
  allscripts: 'connected' | 'disconnected' | 'pending';
  hl7: 'active' | 'inactive' | 'error';
  fhir: 'r4' | 'r5' | 'stu3' | 'none';
}

export default function FHIRHealthcareIntegration() {
  const [fhirResources, setFhirResources] = useState<FHIRResource[]>([]);
  const [hl7Messages, setHl7Messages] = useState<HL7Message[]>([]);
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    epic: 'disconnected',
    cerner: 'disconnected', 
    allscripts: 'disconnected',
    hl7: 'inactive',
    fhir: 'none'
  });
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedResource, setSelectedResource] = useState<FHIRResource | null>(null);

  useEffect(() => {
    initializeHealthcareIntegration();
  }, []);

  const initializeHealthcareIntegration = async () => {
    setIsInitializing(true);
    
    // Simulate FHIR/HL7 system initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock FHIR resources
    const mockFhirResources: FHIRResource[] = [
      {
        resourceType: 'Patient',
        id: 'patient-123',
        status: 'active',
        lastUpdated: new Date().toISOString(),
        source: 'Epic MyChart',
        data: {
          name: [{ given: ['John'], family: 'Doe' }],
          gender: 'male',
          birthDate: '1985-03-15',
          identifier: [{ system: 'http://hospital.org/patient-ids', value: 'MRN-12345' }]
        }
      },
      {
        resourceType: 'Observation',
        id: 'obs-vital-signs-456',
        status: 'active',
        lastUpdated: new Date(Date.now() - 3600000).toISOString(),
        source: 'Cerner PowerChart',
        data: {
          status: 'final',
          category: [{ coding: [{ code: 'vital-signs' }] }],
          code: { coding: [{ code: '8867-4', display: 'Heart rate' }] },
          valueQuantity: { value: 72, unit: '/min' },
          effectiveDateTime: new Date().toISOString()
        }
      },
      {
        resourceType: 'DiagnosticReport',
        id: 'report-lab-789',
        status: 'active',
        lastUpdated: new Date(Date.now() - 7200000).toISOString(),
        source: 'Allscripts Professional',
        data: {
          status: 'final',
          category: [{ coding: [{ code: 'LAB' }] }],
          code: { coding: [{ code: 'CBC', display: 'Complete Blood Count' }] },
          subject: { reference: 'Patient/patient-123' },
          effectiveDateTime: new Date().toISOString(),
          result: [
            { reference: 'Observation/hemoglobin-result' },
            { reference: 'Observation/white-blood-cell-count' }
          ]
        }
      },
      {
        resourceType: 'MedicationStatement',
        id: 'med-statement-101',
        status: 'active',
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        source: 'Epic MyChart',
        data: {
          status: 'active',
          medicationCodeableConcept: {
            coding: [{ code: 'lisinopril', display: 'Lisinopril 10mg' }]
          },
          subject: { reference: 'Patient/patient-123' },
          dosage: [{ text: 'One tablet daily' }]
        }
      }
    ];
    
    // Mock HL7 messages
    const mockHl7Messages: HL7Message[] = [
      {
        messageType: 'ADT^A08',
        version: '2.5',
        timestamp: new Date().toISOString(),
        sender: 'Epic EMR',
        receiver: 'HealthTriage AI',
        status: 'processed',
        content: 'MSH|^~\\&|EPIC|UCSF|HEALTHTRIAGE|CLOUD|20240824120000||ADT^A08^ADT_A01|123456|P|2.5'
      },
      {
        messageType: 'ORM^O01',
        version: '2.5',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        sender: 'Cerner PowerChart',
        receiver: 'HealthTriage AI',
        status: 'received',
        content: 'MSH|^~\\&|CERNER|HOSPITAL|HEALTHTRIAGE|CLOUD|20240824113000||ORM^O01^ORM_O01|789012|P|2.5'
      }
    ];
    
    setFhirResources(mockFhirResources);
    setHl7Messages(mockHl7Messages);
    setIntegrationStatus({
      epic: 'connected',
      cerner: 'connected',
      allscripts: 'pending',
      hl7: 'active',
      fhir: 'r4'
    });
    setIsInitializing(false);
  };

  const exportToFHIR = async (resourceType: string) => {
    // Simulate FHIR export
    console.log(`Exporting ${resourceType} to FHIR format...`);
    
    const exportData = {
      resourceType: 'Bundle',
      id: 'healthtriage-export-' + Date.now(),
      type: 'collection',
      timestamp: new Date().toISOString(),
      total: fhirResources.filter(r => r.resourceType === resourceType).length,
      entry: fhirResources
        .filter(r => r.resourceType === resourceType)
        .map(resource => ({
          resource: {
            resourceType: resource.resourceType,
            id: resource.id,
            ...resource.data
          }
        }))
    };

    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fhir-${resourceType.toLowerCase()}-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendHL7Message = async (messageType: string) => {
    const newMessage: HL7Message = {
      messageType,
      version: '2.5',
      timestamp: new Date().toISOString(),
      sender: 'HealthTriage AI',
      receiver: 'Healthcare System',
      status: 'sent',
      content: `MSH|^~\\&|HEALTHTRIAGE|CLOUD|HOSPITAL|EMR|${new Date().toISOString().replace(/[-:T.Z]/g, '')}||${messageType}|${Date.now()}|P|2.5`
    };
    
    setHl7Messages(prev => [newMessage, ...prev.slice(0, 9)]);
    
    // Simulate processing
    setTimeout(() => {
      setHl7Messages(prev => 
        prev.map(msg => 
          msg === newMessage ? { ...msg, status: 'processed' } : msg
        )
      );
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'processed':
      case 'r4':
      case 'r5':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'sent':
      case 'received':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disconnected':
      case 'inactive':
      case 'error':
      case 'none':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'Patient': return <Users className="w-4 h-4" />;
      case 'Observation': return <Activity className="w-4 h-4" />;
      case 'DiagnosticReport': return <FileText className="w-4 h-4" />;
      case 'MedicationStatement': return <Stethoscope className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
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
          <div className="p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              FHIR/HL7 Healthcare Integration
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                FHIR R4 Compatible
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Link2 className="w-3 h-3 mr-1" />
                HL7 v2.5 Support
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Shield className="w-3 h-3 mr-1" />
                HIPAA Compliant
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Enterprise-grade healthcare data interoperability using FHIR and HL7 standards for seamless EHR integration
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
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Server className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <span className="font-bold text-blue-900">Initializing Healthcare Integration...</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Establishing FHIR/HL7 connections with healthcare systems
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Integration Status Dashboard */}
      {!isInitializing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Building className="w-6 h-6" />
                Healthcare System Integration Status
              </CardTitle>
              <p className="text-gray-600">Real-time connectivity with major EHR systems</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Epic Integration */}
                <div className={`p-4 rounded-xl border-2 ${
                  integrationStatus.epic === 'connected' ? 'bg-green-50 border-green-200' :
                  integrationStatus.epic === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5 text-gray-600" />
                      <span className="font-bold">Epic MyChart</span>
                    </div>
                    <Badge className={getStatusColor(integrationStatus.epic)}>
                      {integrationStatus.epic.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Patient records, medications, lab results
                  </p>
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                {/* Cerner Integration */}
                <div className={`p-4 rounded-xl border-2 ${
                  integrationStatus.cerner === 'connected' ? 'bg-green-50 border-green-200' :
                  integrationStatus.cerner === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Server className="w-5 h-5 text-gray-600" />
                      <span className="font-bold">Cerner PowerChart</span>
                    </div>
                    <Badge className={getStatusColor(integrationStatus.cerner)}>
                      {integrationStatus.cerner.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Clinical documentation, orders
                  </p>
                  <div className="text-xs text-gray-500">
                    Last sync: {new Date(Date.now() - 300000).toLocaleTimeString()}
                  </div>
                </div>

                {/* Allscripts Integration */}
                <div className={`p-4 rounded-xl border-2 ${
                  integrationStatus.allscripts === 'connected' ? 'bg-green-50 border-green-200' :
                  integrationStatus.allscripts === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-gray-600" />
                      <span className="font-bold">Allscripts</span>
                    </div>
                    <Badge className={getStatusColor(integrationStatus.allscripts)}>
                      {integrationStatus.allscripts.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Practice management, billing
                  </p>
                  <div className="text-xs text-gray-500">
                    Connecting...
                  </div>
                </div>

                {/* Standards Status */}
                <div className="p-4 rounded-xl border-2 bg-blue-50 border-blue-200">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">FHIR</span>
                      <Badge className={getStatusColor(integrationStatus.fhir)}>
                        {integrationStatus.fhir.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">HL7</span>
                      <Badge className={getStatusColor(integrationStatus.hl7)}>
                        {integrationStatus.hl7.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* FHIR Resources */}
      {!isInitializing && fhirResources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="w-6 h-6" />
                    FHIR Resources
                  </CardTitle>
                  <p className="text-gray-600">Healthcare data in FHIR R4 standard format</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => exportToFHIR('Patient')}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Patient
                  </Button>
                  <Button
                    onClick={() => exportToFHIR('Observation')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Vitals
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {fhirResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/70 transition-colors cursor-pointer"
                    onClick={() => setSelectedResource(resource)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getResourceIcon(resource.resourceType)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{resource.resourceType}</h4>
                          <p className="text-sm text-gray-600">ID: {resource.id}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(resource.status)}>
                        {resource.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{resource.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-medium">
                          {new Date(resource.lastUpdated).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* HL7 Message Exchange */}
      {!isInitializing && hl7Messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Share2 className="w-6 h-6" />
                    HL7 Message Exchange
                  </CardTitle>
                  <p className="text-gray-600">Real-time healthcare data messaging</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => sendHL7Message('ADT^A04')}
                    className="bg-purple-500 hover:bg-purple-600 text-white rounded-2xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Send ADT
                  </Button>
                  <Button
                    onClick={() => sendHL7Message('ORM^O01')}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Send Order
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hl7Messages.slice(0, 5).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Link2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{message.messageType}</h4>
                          <p className="text-sm text-gray-600">
                            {message.sender} → {message.receiver}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(message.status)}>
                          {message.status.toUpperCase()}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(message.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <code className="text-xs text-gray-700 font-mono break-all">
                        {message.content}
                      </code>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Integration Actions */}
      {!isInitializing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="w-6 h-6" />
                Integration Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => exportToFHIR('Bundle')}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 text-blue-700 rounded-2xl"
                >
                  <Download className="w-6 h-6" />
                  <span className="font-semibold">Export Complete Bundle</span>
                </Button>
                
                <Button
                  onClick={() => sendHL7Message('QRY^A19')}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-green-50 hover:bg-green-100 border-2 border-green-200 text-green-700 rounded-2xl"
                >
                  <Share2 className="w-6 h-6" />
                  <span className="font-semibold">Query Patient Data</span>
                </Button>
                
                <Button
                  onClick={() => initializeHealthcareIntegration()}
                  className="h-20 flex flex-col items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 text-purple-700 rounded-2xl"
                >
                  <Server className="w-6 h-6" />
                  <span className="font-semibold">Refresh Connections</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Compliance Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="bg-amber-50 border border-amber-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Healthcare Compliance & Security</p>
                <ul className="text-xs space-y-1">
                  <li>• HIPAA compliant data handling and transmission</li>
                  <li>• End-to-end encryption for all healthcare communications</li>
                  <li>• Audit logging for all FHIR/HL7 transactions</li>
                  <li>• Role-based access control for patient data</li>
                  <li>• This is a demonstration of healthcare interoperability standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FHIR Resource Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">FHIR Resource Details</h3>
                <Button
                  onClick={() => setSelectedResource(null)}
                  variant="ghost"
                  className="rounded-xl"
                >
                  ×
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(selectedResource, null, 2)}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}