"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield,
  Lock,
  Key,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Share2,
  Database,
  Fingerprint,
  Zap,
  Globe,
  Server,
  RefreshCw,
  Settings,
  Hash,
  Link,
  Verified,
  UserCheck,
  Building,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlockchainRecord {
  id: string;
  blockHash: string;
  previousHash: string;
  timestamp: Date;
  patientId: string;
  recordType: 'diagnosis' | 'prescription' | 'lab_result' | 'vital_signs' | 'imaging' | 'consultation' | 'vaccination' | 'allergy';
  data: {
    title: string;
    content: any;
    provider: string;
    confidentiality: 'public' | 'restricted' | 'confidential';
  };
  permissions: {
    patient: boolean;
    primaryPhysician: boolean;
    specialists: string[];
    emergencyAccess: boolean;
    researchConsent: boolean;
  };
  cryptographicProof: {
    merkleRoot: string;
    signature: string;
    publicKey: string;
  };
  validationStatus: 'pending' | 'validated' | 'disputed' | 'revoked';
  accessLog: {
    userId: string;
    userType: 'patient' | 'physician' | 'specialist' | 'researcher' | 'emergency';
    action: 'view' | 'create' | 'update' | 'share' | 'export';
    timestamp: Date;
    authorized: boolean;
  }[];
}

interface SmartContract {
  id: string;
  contractAddress: string;
  type: 'consent_management' | 'data_sharing' | 'access_control' | 'audit_trail' | 'emergency_override';
  status: 'active' | 'inactive' | 'pending' | 'expired';
  conditions: {
    [key: string]: any;
  };
  executionHistory: {
    timestamp: Date;
    trigger: string;
    result: 'success' | 'failed' | 'reverted';
    gasUsed: number;
  }[];
}

interface NetworkNode {
  id: string;
  type: 'hospital' | 'clinic' | 'lab' | 'pharmacy' | 'insurance' | 'research';
  name: string;
  location: string;
  status: 'online' | 'offline' | 'syncing';
  lastSync: Date;
  recordsContributed: number;
  validationsPerfomed: number;
  trustScore: number;
  stakingAmount: number;
}

interface PrivacyLayer {
  encryptionMethod: 'AES-256' | 'RSA-2048' | 'Elliptic-Curve';
  zkProofEnabled: boolean;
  homomorphicComputing: boolean;
  differentialPrivacy: boolean;
  accessRingSignature: string;
}

export default function BlockchainMedicalRecords() {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);
  const [networkNodes, setNetworkNodes] = useState<NetworkNode[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BlockchainRecord | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'physician' | 'specialist' | 'researcher' | 'emergency'>('patient');
  const [blockchainStats, setBlockchainStats] = useState({
    totalBlocks: 0,
    totalTransactions: 0,
    networkHashRate: 0,
    activeNodes: 0,
    averageBlockTime: 0,
    consensusAlgorithm: 'Proof of Authority'
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacyLayer>({
    encryptionMethod: 'AES-256',
    zkProofEnabled: true,
    homomorphicComputing: true,
    differentialPrivacy: true,
    accessRingSignature: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [showPrivateData, setShowPrivateData] = useState(false);

  const validationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeBlockchainSystem();
    startNetworkSimulation();
    return () => {
      if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current);
    };
  }, []);

  const initializeBlockchainSystem = async () => {
    // Mock blockchain medical records
    const mockRecords: BlockchainRecord[] = [
      {
        id: 'block-001',
        blockHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: new Date(Date.now() - 86400000),
        patientId: 'patient-12345',
        recordType: 'diagnosis',
        data: {
          title: 'Hypertension Diagnosis',
          content: {
            icd10Code: 'I10',
            diagnosis: 'Essential (primary) hypertension',
            severity: 'mild',
            notes: 'Patient presents with elevated blood pressure readings'
          },
          provider: 'Dr. Sarah Johnson, MD - UCSF Medical Center',
          confidentiality: 'restricted'
        },
        permissions: {
          patient: true,
          primaryPhysician: true,
          specialists: ['cardiology', 'nephrology'],
          emergencyAccess: true,
          researchConsent: false
        },
        cryptographicProof: {
          merkleRoot: '0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef123',
          signature: '0xsig123456789abcdef',
          publicKey: '0xpub987654321fedcba'
        },
        validationStatus: 'validated',
        accessLog: [
          {
            userId: 'dr-johnson-001',
            userType: 'physician',
            action: 'create',
            timestamp: new Date(Date.now() - 86400000),
            authorized: true
          },
          {
            userId: 'patient-12345',
            userType: 'patient',
            action: 'view',
            timestamp: new Date(Date.now() - 3600000),
            authorized: true
          }
        ]
      },
      {
        id: 'block-002',
        blockHash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1',
        previousHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        timestamp: new Date(Date.now() - 43200000),
        patientId: 'patient-12345',
        recordType: 'lab_result',
        data: {
          title: 'Complete Blood Count (CBC)',
          content: {
            testCode: 'CBC-85025',
            results: {
              wbc: '7.2 K/uL',
              rbc: '4.8 M/uL',
              hemoglobin: '14.2 g/dL',
              hematocrit: '42.1%'
            },
            referenceRanges: 'Within normal limits',
            labName: 'Quest Diagnostics'
          },
          provider: 'Dr. Sarah Johnson, MD - UCSF Medical Center',
          confidentiality: 'restricted'
        },
        permissions: {
          patient: true,
          primaryPhysician: true,
          specialists: ['hematology'],
          emergencyAccess: true,
          researchConsent: true
        },
        cryptographicProof: {
          merkleRoot: '0x456def789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef123456abc',
          signature: '0xsig456789abcdef123',
          publicKey: '0xpub654321fedcba987'
        },
        validationStatus: 'validated',
        accessLog: [
          {
            userId: 'lab-quest-001',
            userType: 'specialist',
            action: 'create',
            timestamp: new Date(Date.now() - 43200000),
            authorized: true
          }
        ]
      },
      {
        id: 'block-003',
        blockHash: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1b2',
        previousHash: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456a1',
        timestamp: new Date(Date.now() - 21600000),
        patientId: 'patient-12345',
        recordType: 'prescription',
        data: {
          title: 'Lisinopril Prescription',
          content: {
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            refills: 2,
            prescribingPhysician: 'Dr. Sarah Johnson, MD'
          },
          provider: 'UCSF Medical Center Pharmacy',
          confidentiality: 'restricted'
        },
        permissions: {
          patient: true,
          primaryPhysician: true,
          specialists: [],
          emergencyAccess: true,
          researchConsent: false
        },
        cryptographicProof: {
          merkleRoot: '0x789ghi012jkl345mno678pqr901stu234vwx567yz890abcdef123456abc456def',
          signature: '0xsig789abcdef123456',
          publicKey: '0xpub321fedcba987654'
        },
        validationStatus: 'validated',
        accessLog: [
          {
            userId: 'dr-johnson-001',
            userType: 'physician',
            action: 'create',
            timestamp: new Date(Date.now() - 21600000),
            authorized: true
          },
          {
            userId: 'pharmacy-ucsf-001',
            userType: 'specialist',
            action: 'view',
            timestamp: new Date(Date.now() - 18000000),
            authorized: true
          }
        ]
      }
    ];

    // Mock smart contracts
    const mockContracts: SmartContract[] = [
      {
        id: 'contract-consent',
        contractAddress: '0x123456789abcdef123456789abcdef123456789a',
        type: 'consent_management',
        status: 'active',
        conditions: {
          patientConsent: true,
          dataTypes: ['diagnosis', 'lab_result', 'prescription'],
          authorizedParties: ['primary_physician', 'specialists'],
          expirationDate: '2025-12-31'
        },
        executionHistory: [
          {
            timestamp: new Date(Date.now() - 86400000),
            trigger: 'consent_granted',
            result: 'success',
            gasUsed: 21000
          }
        ]
      },
      {
        id: 'contract-access',
        contractAddress: '0xabcdef123456789abcdef123456789abcdef123456',
        type: 'access_control',
        status: 'active',
        conditions: {
          roleBasedAccess: true,
          emergencyOverride: true,
          auditTrail: true,
          timeBasedAccess: false
        },
        executionHistory: [
          {
            timestamp: new Date(Date.now() - 3600000),
            trigger: 'access_request',
            result: 'success',
            gasUsed: 35000
          }
        ]
      }
    ];

    // Mock network nodes
    const mockNodes: NetworkNode[] = [
      {
        id: 'node-ucsf',
        type: 'hospital',
        name: 'UCSF Medical Center',
        location: 'San Francisco, CA',
        status: 'online',
        lastSync: new Date(Date.now() - 300000),
        recordsContributed: 1247,
        validationsPerfomed: 3456,
        trustScore: 98.5,
        stakingAmount: 50000
      },
      {
        id: 'node-stanford',
        type: 'hospital',
        name: 'Stanford Health Care',
        location: 'Stanford, CA',
        status: 'online',
        lastSync: new Date(Date.now() - 180000),
        recordsContributed: 892,
        validationsPerfomed: 2134,
        trustScore: 97.8,
        stakingAmount: 75000
      },
      {
        id: 'node-quest',
        type: 'lab',
        name: 'Quest Diagnostics',
        location: 'San Jose, CA',
        status: 'syncing',
        lastSync: new Date(Date.now() - 900000),
        recordsContributed: 5623,
        validationsPerfomed: 8901,
        trustScore: 99.2,
        stakingAmount: 100000
      },
      {
        id: 'node-cvs',
        type: 'pharmacy',
        name: 'CVS Health',
        location: 'Oakland, CA',
        status: 'online',
        lastSync: new Date(Date.now() - 120000),
        recordsContributed: 3456,
        validationsPerfomed: 5678,
        trustScore: 96.7,
        stakingAmount: 35000
      }
    ];

    setRecords(mockRecords);
    setSmartContracts(mockContracts);
    setNetworkNodes(mockNodes);

    // Update blockchain stats
    setBlockchainStats({
      totalBlocks: mockRecords.length,
      totalTransactions: mockRecords.reduce((sum, r) => sum + r.accessLog.length, 0),
      networkHashRate: 2.5, // TH/s
      activeNodes: mockNodes.filter(n => n.status === 'online').length,
      averageBlockTime: 15, // seconds
      consensusAlgorithm: 'Proof of Authority'
    });
  };

  const startNetworkSimulation = () => {
    // Simulate blockchain network activity
    setInterval(() => {
      setBlockchainStats(prev => ({
        ...prev,
        networkHashRate: prev.networkHashRate + (Math.random() - 0.5) * 0.1,
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5)
      }));
    }, 10000);
  };

  const createNewRecord = async (recordData: Partial<BlockchainRecord>) => {
    setIsValidating(true);

    // Simulate blockchain validation process
    validationTimeoutRef.current = setTimeout(async () => {
      const newRecord: BlockchainRecord = {
        id: `block-${Date.now()}`,
        blockHash: generateHash(),
        previousHash: records.length > 0 ? records[records.length - 1].blockHash : '0x0000000000000000000000000000000000000000000000000000000000000000',
        timestamp: new Date(),
        patientId: recordData.patientId || 'patient-12345',
        recordType: recordData.recordType || 'consultation',
        data: recordData.data || {
          title: 'New Medical Record',
          content: {},
          provider: 'Healthcare Provider',
          confidentiality: 'restricted'
        },
        permissions: recordData.permissions || {
          patient: true,
          primaryPhysician: true,
          specialists: [],
          emergencyAccess: true,
          researchConsent: false
        },
        cryptographicProof: {
          merkleRoot: generateHash(),
          signature: generateSignature(),
          publicKey: generatePublicKey()
        },
        validationStatus: 'validated',
        accessLog: [{
          userId: `${userRole}-${Date.now()}`,
          userType: userRole,
          action: 'create',
          timestamp: new Date(),
          authorized: true
        }]
      };

      setRecords(prev => [...prev, newRecord]);
      setBlockchainStats(prev => ({
        ...prev,
        totalBlocks: prev.totalBlocks + 1,
        totalTransactions: prev.totalTransactions + 1
      }));
      setIsValidating(false);
    }, 3000);
  };

  const validateRecord = async (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    setRecords(prev =>
      prev.map(r => r.id === recordId ? { ...r, validationStatus: 'pending' } : r)
    );

    // Simulate validation
    setTimeout(() => {
      setRecords(prev =>
        prev.map(r => r.id === recordId ? { ...r, validationStatus: 'validated' } : r)
      );
    }, 2000);
  };

  const shareRecord = async (recordId: string, recipientType: string) => {
    const record = records.find(r => r.id === recordId);
    if (!record) return;

    // Add to access log
    const newAccessEntry = {
      userId: `${recipientType}-${Date.now()}`,
      userType: recipientType as any,
      action: 'share' as const,
      timestamp: new Date(),
      authorized: true
    };

    setRecords(prev =>
      prev.map(r => r.id === recordId ? {
        ...r,
        accessLog: [...r.accessLog, newAccessEntry]
      } : r)
    );
  };

  const executeSmartContract = async (contractId: string) => {
    const contract = smartContracts.find(c => c.id === contractId);
    if (!contract) return;

    const newExecution = {
      timestamp: new Date(),
      trigger: 'manual_execution',
      result: 'success' as const,
      gasUsed: Math.floor(Math.random() * 50000) + 21000
    };

    setSmartContracts(prev =>
      prev.map(c => c.id === contractId ? {
        ...c,
        executionHistory: [...c.executionHistory, newExecution]
      } : c)
    );
  };

  const generateHash = () => {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generateSignature = () => {
    return '0xsig' + Array.from({ length: 15 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const generatePublicKey = () => {
    return '0xpub' + Array.from({ length: 15 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': case 'online': case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': case 'syncing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disputed': case 'failed': case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      case 'revoked': case 'expired': case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'validated': case 'online': case 'active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending': case 'syncing': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'disputed': case 'failed': case 'offline': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'revoked': case 'expired': case 'inactive': return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      default: return <RefreshCw className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return <Building className="w-4 h-4" />;
      case 'clinic': return <Building className="w-4 h-4" />;
      case 'lab': return <Activity className="w-4 h-4" />;
      case 'pharmacy': return <Database className="w-4 h-4" />;
      case 'insurance': return <Shield className="w-4 h-4" />;
      case 'research': return <BarChart3 className="w-4 h-4" />;
      default: return <Server className="w-4 h-4" />;
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
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Blockchain Medical Records
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
                <Lock className="w-3 h-3 mr-1" />
                Encrypted
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Verified className="w-3 h-3 mr-1" />
                Immutable
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Globe className="w-3 h-3 mr-1" />
                Decentralized
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Secure, immutable, and decentralized medical records with advanced cryptography and smart contracts
        </p>
      </motion.div>

      {/* Blockchain Network Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BarChart3 className="w-6 h-6" />
              Network Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">{blockchainStats.totalBlocks}</div>
                <div className="text-sm text-indigo-800">Total Blocks</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">{blockchainStats.totalTransactions}</div>
                <div className="text-sm text-purple-800">Transactions</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{blockchainStats.networkHashRate.toFixed(1)} TH/s</div>
                <div className="text-sm text-blue-800">Hash Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{blockchainStats.activeNodes}</div>
                <div className="text-sm text-green-800">Active Nodes</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="text-2xl font-bold text-yellow-600">{blockchainStats.averageBlockTime}s</div>
                <div className="text-sm text-yellow-800">Block Time</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-xs font-bold text-gray-600">{blockchainStats.consensusAlgorithm}</div>
                <div className="text-sm text-gray-800">Consensus</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Role Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <UserCheck className="w-6 h-6" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">Current Role:</span>
                <select 
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="patient">Patient</option>
                  <option value="physician">Primary Physician</option>
                  <option value="specialist">Specialist</option>
                  <option value="researcher">Researcher</option>
                  <option value="emergency">Emergency Personnel</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowPrivateData(!showPrivateData)}
                  variant="outline"
                  className="rounded-xl"
                >
                  {showPrivateData ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPrivateData ? 'Hide' : 'Show'} Private Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Medical Records */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6" />
                Medical Records Blockchain
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => createNewRecord({})}
                  disabled={isValidating}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl"
                >
                  {isValidating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {isValidating ? 'Validating...' : 'Add Record'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-gray-200/50 hover:bg-white/70 transition-colors cursor-pointer"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{record.data.title}</h4>
                        <p className="text-sm text-gray-600 capitalize">{record.recordType.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">{record.data.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.validationStatus)}
                      <Badge className={getStatusColor(record.validationStatus)}>
                        {record.validationStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Block Hash */}
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-3 h-3 text-gray-600" />
                      <span className="text-xs font-medium text-gray-700">Block Hash:</span>
                    </div>
                    <div className="text-xs font-mono text-gray-600 break-all">
                      {record.blockHash}
                    </div>
                  </div>

                  {/* Permissions & Access */}
                  <div className="grid md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Permissions</div>
                      <div className="flex flex-wrap gap-1">
                        {record.permissions.patient && <Badge className="text-xs bg-blue-100 text-blue-800">Patient</Badge>}
                        {record.permissions.primaryPhysician && <Badge className="text-xs bg-green-100 text-green-800">Primary MD</Badge>}
                        {record.permissions.emergencyAccess && <Badge className="text-xs bg-red-100 text-red-800">Emergency</Badge>}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Confidentiality</div>
                      <Badge className={`text-xs ${
                        record.data.confidentiality === 'public' ? 'bg-green-100 text-green-800' :
                        record.data.confidentiality === 'restricted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.data.confidentiality.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-gray-700 mb-1">Access Log</div>
                      <div className="text-xs text-gray-600">{record.accessLog.length} entries</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Created: {record.timestamp.toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          validateRecord(record.id);
                        }}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
                      >
                        <Verified className="w-3 h-3 mr-1" />
                        Validate
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareRecord(record.id, 'specialist');
                        }}
                        size="sm"
                        variant="outline"
                        className="rounded-xl"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Smart Contracts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="w-6 h-6" />
              Smart Contracts
            </CardTitle>
            <p className="text-gray-600">Automated healthcare data governance</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {smartContracts.map((contract, index) => (
                <motion.div
                  key={contract.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">{contract.type.replace('_', ' ')}</h4>
                      <p className="text-xs text-gray-500 font-mono">{contract.contractAddress}</p>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-1">Conditions</div>
                    <div className="space-y-1">
                      {Object.entries(contract.conditions).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span className="font-medium">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-700 mb-1">Recent Executions</div>
                    <div className="text-xs text-gray-600">
                      {contract.executionHistory.length} total executions
                    </div>
                  </div>

                  <Button
                    onClick={() => executeSmartContract(contract.id)}
                    size="sm"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl"
                  >
                    <Zap className="w-3 h-3 mr-2" />
                    Execute Contract
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Network Nodes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Globe className="w-6 h-6" />
              Network Nodes
            </CardTitle>
            <p className="text-gray-600">Decentralized healthcare network participants</p>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-4">
              {networkNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg text-white">
                        {getNodeTypeIcon(node.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{node.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{node.type}</p>
                        <p className="text-xs text-gray-500">{node.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(node.status)}
                      <Badge className={getStatusColor(node.status)}>
                        {node.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{node.recordsContributed.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Records</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">{node.validationsPerfomed.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Validations</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{node.trustScore}%</div>
                      <div className="text-xs text-gray-600">Trust Score</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">${node.stakingAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Staking</div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-600">
                    Last sync: {node.lastSync.toLocaleString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Record Details Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRecord(null)}
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
                  <h3 className="text-2xl font-bold">{selectedRecord.data.title}</h3>
                  <p className="text-gray-600">{selectedRecord.data.provider}</p>
                </div>
                <Button
                  onClick={() => setSelectedRecord(null)}
                  variant="ghost"
                  className="rounded-xl"
                >
                  ×
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Blockchain Info */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Blockchain Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Block Hash:</span>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                        {selectedRecord.blockHash}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Previous Hash:</span>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                        {selectedRecord.previousHash}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Validation Status:</span>
                      <Badge className={getStatusColor(selectedRecord.validationStatus)}>
                        {selectedRecord.validationStatus.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">{selectedRecord.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Proof */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">Cryptographic Proof</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 text-sm">Merkle Root:</span>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                        {selectedRecord.cryptographicProof.merkleRoot}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Digital Signature:</span>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                        {selectedRecord.cryptographicProof.signature}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Public Key:</span>
                      <div className="font-mono text-xs bg-gray-50 p-2 rounded mt-1 break-all">
                        {selectedRecord.cryptographicProof.publicKey}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Record Content */}
                {showPrivateData && (
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-lg mb-3">Medical Data</h4>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(selectedRecord.data.content, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Access Log */}
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-lg mb-3">Access Audit Trail</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRecord.accessLog.map((log, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div>
                          <span className="font-medium capitalize">{log.userType}</span>
                          <span className="text-gray-600 ml-2">• {log.action}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">{log.timestamp.toLocaleString()}</span>
                          {log.authorized ? 
                            <CheckCircle className="w-4 h-4 text-green-600" /> : 
                            <XCircle className="w-4 h-4 text-red-600" />
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blockchain Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="bg-indigo-50 border border-indigo-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div className="text-sm text-indigo-800">
                <p className="font-semibold mb-1">Blockchain Medical Records Platform</p>
                <ul className="text-xs space-y-1">
                  <li>• Immutable medical record storage with cryptographic proof</li>
                  <li>• Zero-knowledge proofs for privacy-preserving data sharing</li>
                  <li>• Smart contracts for automated consent and access management</li>
                  <li>• Decentralized network with proof-of-authority consensus</li>
                  <li>• HIPAA-compliant blockchain with differential privacy</li>
                  <li>• Interoperability with existing EHR systems and health networks</li>
                  <li>• DEMO: This showcases enterprise blockchain healthcare infrastructure</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}