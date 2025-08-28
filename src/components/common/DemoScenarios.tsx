"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Clock, Users, 
  Heart, Brain, Eye, Shield, Database, Video, MapPin, Watch, 
  BarChart3, DollarSign, Target, Zap, AlertTriangle, CheckCircle2,
  Sparkles, Stethoscope, Activity, TrendingUp
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { usePerformanceMonitor } from '@/utils/performance';
import { AccessibleCard } from '@/components/common/AccessibleCard';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  category: 'ai-triage' | 'telemedicine' | 'analytics' | 'emergency' | 'integration';
  duration: number; // in seconds
  difficulty: 'basic' | 'intermediate' | 'advanced';
  features: string[];
  steps: DemoStep[];
  outcomes: string[];
}

interface DemoStep {
  id: string;
  title: string;
  description: string;
  action: string;
  expectedResult: string;
  component?: 'chat' | 'vision' | 'vitals' | 'emergency' | 'telemedicine' | 'analytics';
  data?: any;
  duration: number;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'comprehensive-health-assessment',
    title: 'Comprehensive AI Health Assessment',
    description: 'Complete end-to-end health assessment using multimodal AI including chat, vision analysis, and vital signs monitoring',
    category: 'ai-triage',
    duration: 180,
    difficulty: 'advanced',
    features: ['AI Chat Triage', 'Visual Analysis', 'Vital Signs', 'Voice Input', 'Risk Assessment', 'Action Plans'],
    steps: [
      {
        id: 'voice-symptom-input',
        title: 'Voice-Powered Symptom Description',
        description: 'Patient describes symptoms using voice-to-text with OpenAI Whisper',
        action: 'Activate voice input and speak symptoms',
        expectedResult: 'Real-time transcription with medical terminology optimization',
        component: 'chat',
        data: { symptoms: ['chest pain', 'shortness of breath', 'dizziness'], confidence: 0.95 },
        duration: 30
      },
      {
        id: 'ai-chat-analysis',
        title: 'AI Conversation & Triage',
        description: 'Intelligent follow-up questions and symptom analysis',
        action: 'Engage in AI-powered health conversation',
        expectedResult: 'Detailed symptom analysis with risk stratification',
        component: 'chat',
        data: { riskLevel: 'MEDIUM', confidence: 0.87, followUpQuestions: 5 },
        duration: 60
      },
      {
        id: 'visual-symptom-analysis',
        title: 'Computer Vision Analysis',
        description: 'Upload photos for AI-powered visual symptom detection',
        action: 'Take or upload photo of concerning area',
        expectedResult: 'Detailed visual analysis with confidence scores',
        component: 'vision',
        data: { findings: ['erythema', 'swelling'], confidence: 0.82, severity: 'moderate' },
        duration: 45
      },
      {
        id: 'vital-signs-monitoring',
        title: 'Real-Time Vital Signs',
        description: 'Camera-based PPG for heart rate and stress monitoring',
        action: 'Place finger on camera for vital signs measurement',
        expectedResult: 'Accurate heart rate and stress level detection',
        component: 'vitals',
        data: { heartRate: 98, stressLevel: 'elevated', breathingRate: 22 },
        duration: 45
      }
    ],
    outcomes: [
      'Comprehensive risk assessment completed',
      'Personalized action plan generated',
      'Emergency protocols triggered if needed',
      'Follow-up recommendations provided'
    ]
  },
  {
    id: 'telemedicine-consultation',
    title: 'Complete Telemedicine Experience',
    description: 'Full telemedicine workflow from booking to video consultation with EHR integration',
    category: 'telemedicine',
    duration: 240,
    difficulty: 'advanced',
    features: ['Provider Booking', 'Video Consultation', 'EHR Integration', 'Prescription Management', 'Follow-up Scheduling'],
    steps: [
      {
        id: 'provider-search',
        title: 'AI-Powered Provider Matching',
        description: 'Find and book appointments with relevant specialists',
        action: 'Search for cardiologist with immediate availability',
        expectedResult: 'List of available providers with ratings and specializations',
        component: 'telemedicine',
        data: { providers: 15, avgWaitTime: '12 minutes', specialties: ['cardiology', 'internal medicine'] },
        duration: 30
      },
      {
        id: 'ehr-integration',
        title: 'Electronic Health Records Sync',
        description: 'FHIR/HL7 integration with patient medical history',
        action: 'Sync medical records from multiple EHR systems',
        expectedResult: 'Complete medical history aggregated and formatted',
        component: 'telemedicine',
        data: { recordsSynced: 3, fhirCompliance: true, dataPoints: 847 },
        duration: 45
      },
      {
        id: 'video-consultation',
        title: 'HD Video Consultation',
        description: 'High-quality video call with advanced medical tools',
        action: 'Join video consultation with provider',
        expectedResult: 'Crystal clear video/audio with integrated medical tools',
        component: 'telemedicine',
        data: { quality: '1080p', latency: '45ms', duration: '15 minutes' },
        duration: 120
      },
      {
        id: 'prescription-management',
        title: 'Digital Prescription & Follow-up',
        description: 'Electronic prescribing with pharmacy integration',
        action: 'Receive and send prescription to preferred pharmacy',
        expectedResult: 'Prescription sent, follow-up scheduled automatically',
        component: 'telemedicine',
        data: { medications: 2, pharmacyPartners: 25, followUpDays: 7 },
        duration: 45
      }
    ],
    outcomes: [
      'Successful video consultation completed',
      'Prescriptions sent to pharmacy',
      'Follow-up appointments scheduled',
      'All interactions recorded in EHR'
    ]
  },
  {
    id: 'population-health-analytics',
    title: 'Advanced Population Health Intelligence',
    description: 'Comprehensive epidemiological analysis with predictive modeling and cost optimization',
    category: 'analytics',
    duration: 300,
    difficulty: 'advanced',
    features: ['Population Analytics', 'Predictive Modeling', 'Cost Prediction', 'Risk Stratification', 'Intervention Optimization'],
    steps: [
      {
        id: 'population-dashboard',
        title: 'Population Health Overview',
        description: 'Real-time population health metrics and trend analysis',
        action: 'Navigate to population health analytics dashboard',
        expectedResult: 'Comprehensive population health insights displayed',
        component: 'analytics',
        data: { population: 125000, riskDistribution: { high: 15, medium: 35, low: 50 }, trends: 'improving' },
        duration: 60
      },
      {
        id: 'outbreak-detection',
        title: 'AI-Powered Outbreak Detection',
        description: 'Machine learning algorithms identify potential disease outbreaks',
        action: 'Analyze recent symptom patterns for outbreak indicators',
        expectedResult: 'Early warning system alerts for potential outbreaks',
        component: 'analytics',
        data: { alertLevel: 'elevated', confidence: 0.76, affectedAreas: 3, timeToAlert: '2.3 hours' },
        duration: 45
      },
      {
        id: 'cost-prediction',
        title: 'Healthcare Cost Forecasting',
        description: 'AI models predict healthcare costs and optimize interventions',
        action: 'Generate cost predictions for high-risk patient cohorts',
        expectedResult: 'Detailed cost forecasts with intervention recommendations',
        component: 'analytics',
        data: { predictedCosts: 2.4, savings: 780000, interventions: 12, roi: 3.2 },
        duration: 75
      },
      {
        id: 'risk-stratification',
        title: 'Advanced Risk Stratification',
        description: 'Multi-dimensional risk assessment using validated clinical algorithms',
        action: 'Perform risk stratification analysis on patient population',
        expectedResult: 'Detailed risk profiles with evidence-based interventions',
        component: 'analytics',
        data: { algorithmsUsed: ['Framingham', 'ASCVD', 'QRISK'], patients: 10000, interventions: 45 },
        duration: 120
      }
    ],
    outcomes: [
      'Population health trends identified',
      'Cost optimization strategies developed',
      'Risk-based interventions prioritized',
      'Public health alerts generated'
    ]
  },
  {
    id: 'emergency-response-system',
    title: 'Comprehensive Emergency Response',
    description: 'Multi-layered emergency detection and response with geofencing and IoT integration',
    category: 'emergency',
    duration: 150,
    difficulty: 'advanced',
    features: ['Emergency Detection', 'Geofencing', 'IoT Integration', 'Silent Mode Bypass', 'Multi-Device Alerts'],
    steps: [
      {
        id: 'emergency-detection',
        title: 'AI Emergency Detection',
        description: 'Automatic detection of medical emergencies through AI analysis',
        action: 'Simulate critical symptoms requiring immediate attention',
        expectedResult: 'Emergency protocols activated automatically',
        component: 'emergency',
        data: { severity: 'critical', responseTime: 15, confidence: 0.94, alertsSent: 5 },
        duration: 30
      },
      {
        id: 'geofencing-alerts',
        title: 'Location-Based Emergency Response',
        description: 'Geofencing system alerts nearby responders and facilities',
        action: 'Trigger location-based emergency response',
        expectedResult: 'Nearby hospitals and responders notified with location',
        component: 'emergency',
        data: { nearbyHospitals: 3, responders: 12, eta: '8 minutes', coordinates: [37.7749, -122.4194] },
        duration: 45
      },
      {
        id: 'iot-integration',
        title: 'IoT Device Coordination',
        description: 'Integration with smartwatches and health monitors for continuous monitoring',
        action: 'Connect and coordinate with available IoT health devices',
        expectedResult: 'Real-time health monitoring from multiple devices',
        component: 'emergency',
        data: { devicesConnected: 4, vitalSigns: 'continuous', batteryLevel: 85, dataReliability: 0.92 },
        duration: 45
      },
      {
        id: 'silent-mode-bypass',
        title: 'Critical Alert Bypass System',
        description: 'Override device silent modes for critical health alerts',
        action: 'Demonstrate silent mode bypass for emergency notifications',
        expectedResult: 'Emergency alerts bypass all device restrictions',
        component: 'emergency',
        data: { devicesReached: 8, bypassSuccess: true, alertVolume: 'maximum', emergencyContacts: 5 },
        duration: 30
      }
    ],
    outcomes: [
      'Emergency responders alerted',
      'Location shared with relevant parties',
      'Continuous monitoring activated',
      'All devices coordinated for emergency response'
    ]
  },
  {
    id: 'blockchain-integration',
    title: 'Blockchain Medical Records & Integration',
    description: 'Secure, decentralized medical records with smart contracts and interoperability',
    category: 'integration',
    duration: 180,
    difficulty: 'advanced',
    features: ['Blockchain Records', 'Smart Contracts', 'Data Privacy', 'Interoperability', 'Audit Trail'],
    steps: [
      {
        id: 'blockchain-setup',
        title: 'Blockchain Medical Records',
        description: 'Create and secure medical records on blockchain',
        action: 'Initialize patient medical record on blockchain',
        expectedResult: 'Cryptographically secure medical record created',
        data: { blockHash: '0x1a2b3c', gasUsed: 45000, confirmations: 6, encryption: 'AES-256' },
        duration: 60
      },
      {
        id: 'smart-contracts',
        title: 'Healthcare Smart Contracts',
        description: 'Automated healthcare processes using smart contracts',
        action: 'Execute consent management and data sharing contracts',
        expectedResult: 'Automated compliance and data governance',
        data: { contractsDeployed: 3, gasCost: 0.024, executionTime: '2.1s', complianceScore: 100 },
        duration: 60
      },
      {
        id: 'interoperability',
        title: 'Cross-Platform Data Exchange',
        description: 'Seamless data exchange between healthcare systems',
        action: 'Demonstrate data sharing across different EHR systems',
        expectedResult: 'Unified patient view across all systems',
        data: { systemsConnected: 5, dataPoints: 1247, syncTime: '15s', fhirCompliance: true },
        duration: 60
      }
    ],
    outcomes: [
      'Secure medical records created',
      'Smart contracts deployed',
      'Interoperability achieved',
      'Complete audit trail maintained'
    ]
  }
];

export default function DemoScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [demoProgress, setDemoProgress] = useState(0);
  
  const { announceSuccess, announceProgress, createSafeAnimation } = useAccessibility();
  const { startMeasurement, endMeasurement } = usePerformanceMonitor();

  // Auto-advance demo steps when playing
  useEffect(() => {
    if (isPlaying && selectedScenario && currentStep < selectedScenario.steps.length) {
      const currentStepData = selectedScenario.steps[currentStep];
      const timer = setTimeout(() => {
        setCompletedSteps(prev => new Set(prev).add(currentStepData.id));
        announceSuccess(`Step completed: ${currentStepData.title}`);
        
        if (currentStep < selectedScenario.steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          announceProgress(currentStep + 2, selectedScenario.steps.length, selectedScenario.steps[currentStep + 1]?.title);
        } else {
          setIsPlaying(false);
          announceSuccess(`Demo scenario "${selectedScenario.title}" completed successfully!`);
        }
      }, currentStepData.duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, selectedScenario, currentStep, announceSuccess, announceProgress]);

  // Update progress
  useEffect(() => {
    if (selectedScenario) {
      const progress = (completedSteps.size / selectedScenario.steps.length) * 100;
      setDemoProgress(progress);
    }
  }, [completedSteps, selectedScenario]);

  const handleScenarioSelect = useCallback((scenario: DemoScenario) => {
    startMeasurement('scenarioSelect');
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setIsPlaying(false);
    setCompletedSteps(new Set());
    setDemoProgress(0);
    endMeasurement('scenarioSelect');
    announceSuccess(`Selected demo scenario: ${scenario.title}`);
  }, [startMeasurement, endMeasurement, announceSuccess]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      announceSuccess('Demo playback started');
    } else {
      announceSuccess('Demo playback paused');
    }
  }, [isPlaying, announceSuccess]);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setCompletedSteps(new Set());
    setDemoProgress(0);
    announceSuccess('Demo scenario reset');
  }, [announceSuccess]);

  const handleStepJump = useCallback((stepIndex: number) => {
    if (selectedScenario && stepIndex >= 0 && stepIndex < selectedScenario.steps.length) {
      setCurrentStep(stepIndex);
      setIsPlaying(false);
      announceSuccess(`Jumped to step: ${selectedScenario.steps[stepIndex].title}`);
    }
  }, [selectedScenario, announceSuccess]);

  const getCategoryIcon = useCallback((category: string) => {
    switch (category) {
      case 'ai-triage': return <Brain className="w-5 h-5" />;
      case 'telemedicine': return <Video className="w-5 h-5" />;
      case 'analytics': return <BarChart3 className="w-5 h-5" />;
      case 'emergency': return <AlertTriangle className="w-5 h-5" />;
      case 'integration': return <Database className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  }, []);

  const getCategoryColor = useCallback((category: string) => {
    switch (category) {
      case 'ai-triage': return 'bg-blue-100 text-blue-800';
      case 'telemedicine': return 'bg-purple-100 text-purple-800';
      case 'analytics': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'integration': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const containerMotion = createSafeAnimation({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  });

  const cardMotion = createSafeAnimation({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  });

  return (
    <motion.div className="space-y-6" {...containerMotion}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎯 Interactive Demo Scenarios
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Experience the full capabilities of HealthTriage AI through guided, interactive demonstrations 
          showcasing cutting-edge healthcare technology and AI-powered solutions.
        </p>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Choose a Demo Scenario</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {DEMO_SCENARIOS.map((scenario) => (
              <motion.div key={scenario.id} {...cardMotion}>
                <AccessibleCard
                  className="h-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300"
                  onClick={() => handleScenarioSelect(scenario)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select demo scenario: ${scenario.title}`}
                >
                  <div className="p-6 space-y-4">
                    {/* Category and Difficulty */}
                    <div className="flex items-center justify-between">
                      <Badge className={`${getCategoryColor(scenario.category)} flex items-center gap-1`}>
                        {getCategoryIcon(scenario.category)}
                        {scenario.category.replace('-', ' ')}
                      </Badge>
                      <Badge className={getDifficultyColor(scenario.difficulty)}>
                        {scenario.difficulty}
                      </Badge>
                    </div>

                    {/* Title and Description */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {scenario.description}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Featured Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {scenario.features.slice(0, 4).map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {scenario.features.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{scenario.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Duration and Steps */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(scenario.duration / 60)}:{(scenario.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <span>{scenario.steps.length} steps</span>
                    </div>
                  </div>
                </AccessibleCard>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        /* Demo Player */
        <div className="space-y-6">
          {/* Demo Header */}
          <div className="flex items-start justify-between">
            <div>
              <Button
                variant="ghost"
                onClick={() => setSelectedScenario(null)}
                className="mb-4"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Scenarios
              </Button>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {selectedScenario.title}
              </h2>
              <p className="text-gray-600 mb-4">{selectedScenario.description}</p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <motion.div 
                  className="bg-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${demoProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-gray-500">
                Progress: {completedSteps.size} of {selectedScenario.steps.length} steps completed
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePlayPause}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Demo Steps */}
          <div className="space-y-4">
            {selectedScenario.steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0.6 }}
                animate={{ 
                  opacity: index <= currentStep ? 1 : 0.6,
                  scale: index === currentStep ? 1.02 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className={`relative ${
                    index === currentStep 
                      ? 'border-blue-500 shadow-md' 
                      : completedSteps.has(step.id) 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`
                            flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                            ${index === currentStep 
                              ? 'bg-blue-600 text-white' 
                              : completedSteps.has(step.id)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }
                          `}>
                            {completedSteps.has(step.id) ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {step.title}
                          </h3>
                          {index === currentStep && isPlaying && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <Activity className="w-4 h-4 text-blue-600" />
                            </motion.div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">{step.description}</p>
                        
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Action:</span> {step.action}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">Expected Result:</span> {step.expectedResult}
                          </div>
                        </div>

                        {/* Step Data Visualization */}
                        {step.data && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <h5 className="text-sm font-medium text-gray-900 mb-2">Demo Data:</h5>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {Object.entries(step.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="text-gray-600">{key}:</span>
                                  <span className="font-mono text-gray-900">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline">
                          {step.duration}s
                        </Badge>
                        {step.component && (
                          <Badge className="bg-purple-100 text-purple-800">
                            {step.component}
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStepJump(index)}
                          disabled={isPlaying}
                        >
                          Jump to Step
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Expected Outcomes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Expected Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedScenario.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
        <p>
          🚀 <strong>Hackathon Demo System</strong> - Interactive demonstrations showcasing 
          cutting-edge healthcare AI technology with enterprise-grade features and accessibility compliance.
        </p>
      </div>
    </motion.div>
  );
}