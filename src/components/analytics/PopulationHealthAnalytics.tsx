"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  MapPin,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Target,
  Zap,
  Brain,
  Heart,
  Eye,
  Thermometer,
  Shield,
  Building,
  FileText,
  Settings,
  PieChart,
  LineChart,
  Map,
  Database,
  Search,
  Bell,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  category: 'chronic' | 'infectious' | 'mental' | 'preventive' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  affectedPopulation: number;
  demographicBreakdown: {
    ageGroups: { [key: string]: number };
    genderDistribution: { male: number; female: number; other: number };
    ethnicGroups: { [key: string]: number };
    socioeconomicStatus: { [key: string]: number };
  };
  geographicDistribution: {
    region: string;
    cases: number;
    incidenceRate: number;
  }[];
  timeSeriesData: {
    date: string;
    value: number;
    events?: string[];
  }[];
}

interface OutbreakAlert {
  id: string;
  condition: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  casesReported: number;
  incidenceRate: number;
  riskFactors: string[];
  recommendations: string[];
  status: 'active' | 'monitoring' | 'contained' | 'resolved';
  firstDetected: Date;
  lastUpdated: Date;
  affectedFacilities: string[];
  coordinatedResponse: {
    healthDepartment: boolean;
    cdc: boolean;
    who: boolean;
    localHospitals: boolean;
  };
}

interface PredictiveModel {
  id: string;
  name: string;
  type: 'epidemic_forecast' | 'resource_demand' | 'risk_stratification' | 'outcome_prediction';
  accuracy: number;
  confidence: number;
  lastTrained: Date;
  predictions: {
    timeframe: string;
    prediction: any;
    probability: number;
    factors: string[];
  }[];
  performanceMetrics: {
    sensitivity: number;
    specificity: number;
    ppv: number; // Positive Predictive Value
    npv: number; // Negative Predictive Value
    auc: number; // Area Under Curve
  };
}

interface CommunityIntervention {
  id: string;
  name: string;
  type: 'vaccination' | 'screening' | 'education' | 'policy' | 'environmental';
  targetPopulation: string;
  status: 'planning' | 'active' | 'completed' | 'paused';
  effectiveness: number;
  costEffectiveness: number;
  participationRate: number;
  outcomes: {
    reductionInIncidence: number;
    livesImpacted: number;
    costSavings: number;
  };
  timeline: {
    start: Date;
    end: Date;
    milestones: { date: Date; description: string; completed: boolean }[];
  };
}

interface HealthEquityMetric {
  condition: string;
  overallRate: number;
  disparityIndex: number;
  groupComparisons: {
    group: string;
    rate: number;
    riskRatio: number;
    confidenceInterval: [number, number];
  }[];
  socialDeterminants: {
    factor: string;
    impact: number;
    interventionPotential: number;
  }[];
}

export default function PopulationHealthAnalytics() {
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [outbreakAlerts, setOutbreakAlerts] = useState<OutbreakAlert[]>([]);
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [communityInterventions, setCommunityInterventions] = useState<CommunityIntervention[]>([]);
  const [healthEquityMetrics, setHealthEquityMetrics] = useState<HealthEquityMetric[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'urban' | 'suburban' | 'rural'>('all');
  const [selectedDemographic, setSelectedDemographic] = useState<'all' | 'age' | 'gender' | 'ethnicity' | 'income'>('all');
  const [alertThreshold, setAlertThreshold] = useState<number>(75);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeView, setActiveView] = useState<'overview' | 'outbreaks' | 'predictions' | 'interventions' | 'equity'>('overview');

  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializePopulationHealthData();
    startRealTimeMonitoring();
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, []);

  const initializePopulationHealthData = async () => {
    // Mock population health metrics
    const mockMetrics: HealthMetric[] = [
      {
        id: 'diabetes-prevalence',
        name: 'Type 2 Diabetes Prevalence',
        value: 11.3,
        unit: '%',
        trend: 'up',
        changePercent: 2.1,
        category: 'chronic',
        severity: 'high',
        affectedPopulation: 37300000,
        demographicBreakdown: {
          ageGroups: { '18-44': 4.2, '45-64': 17.5, '65+': 26.8 },
          genderDistribution: { male: 12.1, female: 10.5, other: 11.0 },
          ethnicGroups: { 'White': 9.5, 'Black': 16.4, 'Hispanic': 14.7, 'Asian': 9.2 },
          socioeconomicStatus: { 'Low income': 15.6, 'Middle income': 10.8, 'High income': 7.2 }
        },
        geographicDistribution: [
          { region: 'Southeast', cases: 8900000, incidenceRate: 14.2 },
          { region: 'Southwest', cases: 6200000, incidenceRate: 12.8 },
          { region: 'Midwest', cases: 7100000, incidenceRate: 11.5 },
          { region: 'Northeast', cases: 5800000, incidenceRate: 10.4 },
          { region: 'West', cases: 9200000, incidenceRate: 9.8 }
        ],
        timeSeriesData: [
          { date: '2024-01', value: 10.8, events: [] },
          { date: '2024-02', value: 10.9, events: [] },
          { date: '2024-03', value: 11.0, events: ['National Diabetes Prevention Program Launch'] },
          { date: '2024-04', value: 11.1, events: [] },
          { date: '2024-05', value: 11.2, events: [] },
          { date: '2024-06', value: 11.3, events: ['Summer Health Initiative'] }
        ]
      },
      {
        id: 'hypertension-prevalence',
        name: 'Hypertension Prevalence',
        value: 45.4,
        unit: '%',
        trend: 'stable',
        changePercent: 0.3,
        category: 'chronic',
        severity: 'high',
        affectedPopulation: 116800000,
        demographicBreakdown: {
          ageGroups: { '18-44': 22.4, '45-64': 54.5, '65+': 74.5 },
          genderDistribution: { male: 47.4, female: 43.1, other: 45.0 },
          ethnicGroups: { 'White': 43.6, 'Black': 58.0, 'Hispanic': 43.7, 'Asian': 39.9 },
          socioeconomicStatus: { 'Low income': 52.1, 'Middle income': 45.8, 'High income': 38.4 }
        },
        geographicDistribution: [
          { region: 'Southeast', cases: 28500000, incidenceRate: 52.3 },
          { region: 'Midwest', cases: 22100000, incidenceRate: 48.7 },
          { region: 'Southwest', cases: 18900000, incidenceRate: 46.2 },
          { region: 'Northeast', cases: 24200000, incidenceRate: 44.1 },
          { region: 'West', cases: 23100000, incidenceRate: 41.8 }
        ],
        timeSeriesData: [
          { date: '2024-01', value: 45.1, events: [] },
          { date: '2024-02', value: 45.2, events: [] },
          { date: '2024-03', value: 45.3, events: [] },
          { date: '2024-04', value: 45.4, events: ['Blood Pressure Awareness Month'] },
          { date: '2024-05', value: 45.4, events: [] },
          { date: '2024-06', value: 45.4, events: [] }
        ]
      },
      {
        id: 'flu-incidence',
        name: 'Influenza Incidence Rate',
        value: 8.2,
        unit: 'per 100k',
        trend: 'down',
        changePercent: -15.6,
        category: 'infectious',
        severity: 'medium',
        affectedPopulation: 27000000,
        demographicBreakdown: {
          ageGroups: { '0-17': 12.1, '18-64': 7.5, '65+': 9.8 },
          genderDistribution: { male: 8.0, female: 8.4, other: 8.2 },
          ethnicGroups: { 'White': 7.8, 'Black': 8.9, 'Hispanic': 8.5, 'Asian': 7.2 },
          socioeconomicStatus: { 'Low income': 10.1, 'Middle income': 8.0, 'High income': 6.4 }
        },
        geographicDistribution: [
          { region: 'Northeast', cases: 6800000, incidenceRate: 12.3 },
          { region: 'Midwest', cases: 5900000, incidenceRate: 10.1 },
          { region: 'Southeast', cases: 7200000, incidenceRate: 8.9 },
          { region: 'Southwest', cases: 3400000, incidenceRate: 7.8 },
          { region: 'West', cases: 3700000, incidenceRate: 6.4 }
        ],
        timeSeriesData: [
          { date: '2024-01', value: 12.8, events: ['Flu Season Peak'] },
          { date: '2024-02', value: 11.2, events: [] },
          { date: '2024-03', value: 9.7, events: [] },
          { date: '2024-04', value: 8.9, events: [] },
          { date: '2024-05', value: 8.4, events: [] },
          { date: '2024-06', value: 8.2, events: ['Summer Flu Decline'] }
        ]
      },
      {
        id: 'mental-health-prevalence',
        name: 'Mental Health Disorders',
        value: 26.2,
        unit: '%',
        trend: 'up',
        changePercent: 8.4,
        category: 'mental',
        severity: 'high',
        affectedPopulation: 86500000,
        demographicBreakdown: {
          ageGroups: { '18-25': 33.7, '26-49': 28.1, '50+': 20.6 },
          genderDistribution: { male: 21.4, female: 31.2, other: 28.9 },
          ethnicGroups: { 'White': 27.1, 'Black': 23.5, 'Hispanic': 24.8, 'Asian': 19.2 },
          socioeconomicStatus: { 'Low income': 32.7, 'Middle income': 25.4, 'High income': 19.8 }
        },
        geographicDistribution: [
          { region: 'West', cases: 22100000, incidenceRate: 28.9 },
          { region: 'Northeast', cases: 18900000, incidenceRate: 27.2 },
          { region: 'Midwest', cases: 16800000, incidenceRate: 26.1 },
          { region: 'Southwest', cases: 14200000, incidenceRate: 25.8 },
          { region: 'Southeast', cases: 14500000, incidenceRate: 23.4 }
        ],
        timeSeriesData: [
          { date: '2024-01', value: 24.1, events: ['Post-Holiday Depression Spike'] },
          { date: '2024-02', value: 24.8, events: [] },
          { date: '2024-03', value: 25.4, events: [] },
          { date: '2024-04', value: 25.9, events: ['Mental Health Awareness Month'] },
          { date: '2024-05', value: 26.1, events: [] },
          { date: '2024-06', value: 26.2, events: [] }
        ]
      }
    ];

    // Mock outbreak alerts
    const mockOutbreaks: OutbreakAlert[] = [
      {
        id: 'outbreak-001',
        condition: 'Norovirus Gastroenteritis',
        location: 'San Francisco Bay Area',
        severity: 'medium',
        casesReported: 127,
        incidenceRate: 8.4,
        riskFactors: ['Contaminated food service', 'Close contact transmission', 'Poor sanitation'],
        recommendations: [
          'Enhanced hygiene protocols in food establishments',
          'Public health advisory on handwashing',
          'Isolation of confirmed cases for 48 hours post-symptom resolution'
        ],
        status: 'active',
        firstDetected: new Date(Date.now() - 172800000), // 2 days ago
        lastUpdated: new Date(Date.now() - 3600000), // 1 hour ago
        affectedFacilities: ['3 restaurants', '2 schools', '1 nursing home'],
        coordinatedResponse: {
          healthDepartment: true,
          cdc: true,
          who: false,
          localHospitals: true
        }
      },
      {
        id: 'outbreak-002',
        condition: 'Respiratory Syncytial Virus (RSV)',
        location: 'Northeast Region',
        severity: 'high',
        casesReported: 892,
        incidenceRate: 15.2,
        riskFactors: ['Seasonal pattern', 'Pediatric vulnerability', 'Daycare transmission'],
        recommendations: [
          'Enhanced surveillance in pediatric facilities',
          'Early antiviral treatment protocols',
          'Respiratory isolation precautions'
        ],
        status: 'monitoring',
        firstDetected: new Date(Date.now() - 1209600000), // 2 weeks ago
        lastUpdated: new Date(Date.now() - 7200000), // 2 hours ago
        affectedFacilities: ['15 daycares', '8 pediatric clinics', '4 hospitals'],
        coordinatedResponse: {
          healthDepartment: true,
          cdc: true,
          who: true,
          localHospitals: true
        }
      }
    ];

    // Mock predictive models
    const mockPredictiveModels: PredictiveModel[] = [
      {
        id: 'epidemic-forecast-001',
        name: 'Seasonal Influenza Forecast',
        type: 'epidemic_forecast',
        accuracy: 87.3,
        confidence: 92.1,
        lastTrained: new Date(Date.now() - 604800000), // 1 week ago
        predictions: [
          {
            timeframe: 'Next 4 weeks',
            prediction: {
              peakWeek: 'Week 42 (Mid-October)',
              peakIntensity: 'Moderate',
              totalCases: 28500000,
              hospitalizations: 485000
            },
            probability: 0.89,
            factors: ['Historical seasonal patterns', 'Vaccination rates', 'Climate data', 'Travel patterns']
          },
          {
            timeframe: 'Full season (Oct-Mar)',
            prediction: {
              severity: 'Moderate to High',
              dominantStrain: 'H3N2',
              vaccineEffectiveness: 0.65,
              economicImpact: 14.2e9
            },
            probability: 0.76,
            factors: ['Strain circulation', 'Population immunity', 'Vaccine match']
          }
        ],
        performanceMetrics: {
          sensitivity: 0.84,
          specificity: 0.91,
          ppv: 0.78,
          npv: 0.94,
          auc: 0.89
        }
      },
      {
        id: 'resource-demand-001',
        name: 'Hospital Resource Demand Predictor',
        type: 'resource_demand',
        accuracy: 91.7,
        confidence: 95.2,
        lastTrained: new Date(Date.now() - 259200000), // 3 days ago
        predictions: [
          {
            timeframe: 'Next 7 days',
            prediction: {
              icuBedDemand: 1250,
              ventilatorNeed: 340,
              emergencyVisits: 45800,
              staffingRequirement: 'High'
            },
            probability: 0.95,
            factors: ['Current case trends', 'Historical utilization', 'Demographic factors', 'Seasonal patterns']
          }
        ],
        performanceMetrics: {
          sensitivity: 0.92,
          specificity: 0.88,
          ppv: 0.85,
          npv: 0.94,
          auc: 0.93
        }
      }
    ];

    // Mock community interventions
    const mockInterventions: CommunityIntervention[] = [
      {
        id: 'intervention-001',
        name: 'Community Diabetes Prevention Program',
        type: 'education',
        targetPopulation: 'Pre-diabetic adults aged 18-65',
        status: 'active',
        effectiveness: 78.5,
        costEffectiveness: 4.2, // $ saved per $ invested
        participationRate: 67.8,
        outcomes: {
          reductionInIncidence: 58.2,
          livesImpacted: 125000,
          costSavings: 42.7e6
        },
        timeline: {
          start: new Date('2024-01-01'),
          end: new Date('2024-12-31'),
          milestones: [
            { date: new Date('2024-03-01'), description: 'Program rollout complete', completed: true },
            { date: new Date('2024-06-01'), description: '50% participation target', completed: true },
            { date: new Date('2024-09-01'), description: 'Mid-program evaluation', completed: false },
            { date: new Date('2024-12-15'), description: 'Final outcomes assessment', completed: false }
          ]
        }
      },
      {
        id: 'intervention-002',
        name: 'Hypertension Screening Initiative',
        type: 'screening',
        targetPopulation: 'Adults 40+ in underserved communities',
        status: 'active',
        effectiveness: 84.1,
        costEffectiveness: 6.8,
        participationRate: 72.3,
        outcomes: {
          reductionInIncidence: 31.7,
          livesImpacted: 89000,
          costSavings: 28.4e6
        },
        timeline: {
          start: new Date('2024-02-01'),
          end: new Date('2025-01-31'),
          milestones: [
            { date: new Date('2024-04-01'), description: 'Mobile units deployed', completed: true },
            { date: new Date('2024-07-01'), description: '25,000 screenings milestone', completed: true },
            { date: new Date('2024-10-01'), description: '50,000 screenings milestone', completed: false },
            { date: new Date('2025-01-01'), description: 'Program completion', completed: false }
          ]
        }
      }
    ];

    // Mock health equity metrics
    const mockEquityMetrics: HealthEquityMetric[] = [
      {
        condition: 'Maternal Mortality',
        overallRate: 23.8,
        disparityIndex: 3.4,
        groupComparisons: [
          { group: 'White women', rate: 17.9, riskRatio: 1.0, confidenceInterval: [16.2, 19.8] },
          { group: 'Black women', rate: 55.3, riskRatio: 3.1, confidenceInterval: [51.2, 59.7] },
          { group: 'Hispanic women', rate: 18.2, riskRatio: 1.0, confidenceInterval: [16.8, 19.7] },
          { group: 'Asian women', rate: 13.5, riskRatio: 0.8, confidenceInterval: [11.9, 15.3] }
        ],
        socialDeterminants: [
          { factor: 'Access to prenatal care', impact: 0.68, interventionPotential: 0.85 },
          { factor: 'Insurance coverage', impact: 0.54, interventionPotential: 0.92 },
          { factor: 'Geographic proximity to hospitals', impact: 0.43, interventionPotential: 0.67 },
          { factor: 'Implicit bias in healthcare', impact: 0.71, interventionPotential: 0.78 }
        ]
      },
      {
        condition: 'Life Expectancy',
        overallRate: 78.9,
        disparityIndex: 4.8,
        groupComparisons: [
          { group: 'Highest income quintile', rate: 84.1, riskRatio: 1.0, confidenceInterval: [83.4, 84.8] },
          { group: 'Lowest income quintile', rate: 73.2, riskRatio: 0.87, confidenceInterval: [72.5, 73.9] },
          { group: 'College educated', rate: 82.7, riskRatio: 0.98, confidenceInterval: [82.1, 83.3] },
          { group: 'High school or less', rate: 75.8, riskRatio: 0.90, confidenceInterval: [75.2, 76.4] }
        ],
        socialDeterminants: [
          { factor: 'Income inequality', impact: 0.79, interventionPotential: 0.56 },
          { factor: 'Educational attainment', impact: 0.65, interventionPotential: 0.73 },
          { factor: 'Environmental factors', impact: 0.58, interventionPotential: 0.67 },
          { factor: 'Healthcare access', impact: 0.62, interventionPotential: 0.84 }
        ]
      }
    ];

    setHealthMetrics(mockMetrics);
    setOutbreakAlerts(mockOutbreaks);
    setPredictiveModels(mockPredictiveModels);
    setCommunityInterventions(mockInterventions);
    setHealthEquityMetrics(mockEquityMetrics);
  };

  const startRealTimeMonitoring = () => {
    // Simulate real-time updates
    setInterval(() => {
      setHealthMetrics(prev => 
        prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * 0.1,
          changePercent: metric.changePercent + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 30000); // Update every 30 seconds
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    
    analysisTimeoutRef.current = setTimeout(() => {
      // Simulate analysis completion
      setIsAnalyzing(false);
      
      // Could update predictions, alerts, etc. here
      // Advanced analysis completed (removed console.log for production)
    }, 5000);
  };

  const generateReport = (type: 'pdf' | 'csv' | 'json') => {
    // Mock report generation
    const reportData = {
      timestamp: new Date().toISOString(),
      type,
      metrics: healthMetrics,
      alerts: outbreakAlerts,
      predictions: predictiveModels,
      interventions: communityInterventions,
      equity: healthEquityMetrics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `population-health-report-${type}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'monitoring': case 'planning': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contained': case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'resolved': return 'bg-gray-100 text-gray-800 border-gray-200';
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
          <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              Population Health Analytics
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Globe className="w-3 h-3 mr-1" />
                Epidemiological
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                Predictive AI
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Target className="w-3 h-3 mr-1" />
                Evidence-Based
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Advanced population health surveillance, outbreak detection, and predictive analytics for public health intelligence
        </p>
      </motion.div>

      {/* Control Panel */}
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
                Analytics Control Panel
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={runAdvancedAnalysis}
                  disabled={isAnalyzing}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-2xl"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
                <Button
                  onClick={() => generateReport('json')}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
                <select 
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="all">All Regions</option>
                  <option value="urban">Urban Areas</option>
                  <option value="suburban">Suburban Areas</option>
                  <option value="rural">Rural Areas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Demographics</label>
                <select 
                  value={selectedDemographic}
                  onChange={(e) => setSelectedDemographic(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="all">All Demographics</option>
                  <option value="age">By Age Group</option>
                  <option value="gender">By Gender</option>
                  <option value="ethnicity">By Ethnicity</option>
                  <option value="income">By Income Level</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold</label>
                <Input
                  type="number"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                  min="50"
                  max="100"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* View Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex justify-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
            <div className="flex gap-2">
              {[
                { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'outbreaks', label: 'Outbreaks', icon: <AlertTriangle className="w-4 h-4" /> },
                { key: 'predictions', label: 'Predictions', icon: <Brain className="w-4 h-4" /> },
                { key: 'interventions', label: 'Interventions', icon: <Target className="w-4 h-4" /> },
                { key: 'equity', label: 'Health Equity', icon: <Users className="w-4 h-4" /> }
              ].map((view) => (
                <Button
                  key={view.key}
                  onClick={() => setActiveView(view.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    activeView === view.key
                      ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                      : 'bg-white/50 hover:bg-white/70 text-gray-700'
                  }`}
                >
                  {view.icon}
                  {view.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overview Dashboard */}
      {activeView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <PieChart className="w-6 h-6" />
                Population Health Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                {healthMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{metric.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{metric.category} condition</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(metric.trend)}
                        <Badge className={getSeverityColor(metric.severity)}>
                          {metric.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-3xl font-bold text-gray-900">{metric.value.toFixed(1)}</span>
                      <span className="text-gray-600">{metric.unit}</span>
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-red-600' : 
                        metric.trend === 'down' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{(metric.affectedPopulation / 1000000).toFixed(1)}M</div>
                        <div className="text-xs text-gray-600">Affected Population</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{metric.geographicDistribution.length}</div>
                        <div className="text-xs text-gray-600">Regions Tracked</div>
                      </div>
                    </div>

                    {/* Mini visualization */}
                    <div className="mt-3">
                      <div className="text-xs font-medium text-gray-700 mb-2">6-Month Trend</div>
                      <div className="flex items-end gap-1 h-12">
                        {metric.timeSeriesData.map((point, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-blue-500 to-green-500 rounded-sm flex-1 opacity-70"
                            style={{ height: `${(point.value / Math.max(...metric.timeSeriesData.map(p => p.value))) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Outbreak Alerts */}
      {activeView === 'outbreaks' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="w-6 h-6" />
                Active Outbreak Monitoring
              </CardTitle>
              <p className="text-gray-600">Real-time disease outbreak surveillance and response coordination</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outbreakAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 ${
                      alert.severity === 'critical' ? 'bg-red-50 border-red-200' :
                      alert.severity === 'high' ? 'bg-orange-50 border-orange-200' :
                      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{alert.condition}</h4>
                        <p className="text-gray-600 flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {alert.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{alert.casesReported}</div>
                        <div className="text-sm text-gray-600">Cases Reported</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{alert.incidenceRate}</div>
                        <div className="text-sm text-gray-600">Per 100k</div>
                      </div>
                      <div className="text-center p-3 bg-white/50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{alert.affectedFacilities.length}</div>
                        <div className="text-sm text-gray-600">Facilities Affected</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Risk Factors</h5>
                      <div className="flex flex-wrap gap-2">
                        {alert.riskFactors.map((factor, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {factor}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Public Health Recommendations</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {alert.recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div>
                        First detected: {alert.firstDetected.toLocaleDateString()}
                      </div>
                      <div>
                        Last updated: {alert.lastUpdated.toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Predictive Models */}
      {activeView === 'predictions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="w-6 h-6" />
                AI Predictive Models
              </CardTitle>
              <p className="text-gray-600">Machine learning models for epidemic forecasting and resource planning</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {predictiveModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{model.name}</h4>
                        <p className="text-gray-600 capitalize">{model.type.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">Last trained: {model.lastTrained.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{model.accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-5 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{(model.performanceMetrics.sensitivity * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Sensitivity</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{(model.performanceMetrics.specificity * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">Specificity</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{(model.performanceMetrics.ppv * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">PPV</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{(model.performanceMetrics.npv * 100).toFixed(1)}%</div>
                        <div className="text-xs text-gray-600">NPV</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-red-600">{model.performanceMetrics.auc.toFixed(2)}</div>
                        <div className="text-xs text-gray-600">AUC</div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Current Predictions</h5>
                      <div className="space-y-3">
                        {model.predictions.map((prediction, i) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-blue-900">{prediction.timeframe}</span>
                              <Badge className="bg-blue-100 text-blue-800">
                                {(prediction.probability * 100).toFixed(0)}% confidence
                              </Badge>
                            </div>
                            <div className="text-sm text-blue-800">
                              <pre className="whitespace-pre-wrap font-sans">
                                {JSON.stringify(prediction.prediction, null, 2)}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Community Interventions */}
      {activeView === 'interventions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6" />
                Community Health Interventions
              </CardTitle>
              <p className="text-gray-600">Population-level interventions and their effectiveness tracking</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {communityInterventions.map((intervention, index) => (
                  <motion.div
                    key={intervention.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{intervention.name}</h4>
                        <p className="text-gray-600 capitalize">{intervention.type} intervention</p>
                        <p className="text-sm text-gray-500">Target: {intervention.targetPopulation}</p>
                      </div>
                      <Badge className={getStatusColor(intervention.status)}>
                        {intervention.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{intervention.effectiveness.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Effectiveness</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">${intervention.costEffectiveness.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">ROI Ratio</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{intervention.participationRate.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Participation</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{(intervention.outcomes.livesImpacted / 1000).toFixed(0)}K</div>
                        <div className="text-sm text-gray-600">Lives Impacted</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Outcomes</h5>
                      <div className="grid md:grid-cols-3 gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-700">Incidence Reduction</div>
                          <div className="font-bold text-green-900">{intervention.outcomes.reductionInIncidence.toFixed(1)}%</div>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-700">Cost Savings</div>
                          <div className="font-bold text-blue-900">${(intervention.outcomes.costSavings / 1e6).toFixed(1)}M</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <div className="text-sm text-purple-700">Population Reached</div>
                          <div className="font-bold text-purple-900">{(intervention.outcomes.livesImpacted / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Timeline & Milestones</h5>
                      <div className="space-y-2">
                        {intervention.timeline.milestones.map((milestone, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            {milestone.completed ? 
                              <CheckCircle className="w-4 h-4 text-green-600" /> : 
                              <Clock className="w-4 h-4 text-gray-400" />
                            }
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{milestone.description}</div>
                              <div className="text-xs text-gray-600">{milestone.date.toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Health Equity */}
      {activeView === 'equity' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6" />
                Health Equity Analysis
              </CardTitle>
              <p className="text-gray-600">Identifying and addressing health disparities across populations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {healthEquityMetrics.map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-lg">{metric.condition}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="text-sm text-gray-600">
                          Overall Rate: <span className="font-medium">{metric.overallRate}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Disparity Index: <span className={`font-medium ${
                            metric.disparityIndex > 2 ? 'text-red-600' : 
                            metric.disparityIndex > 1.5 ? 'text-yellow-600' : 'text-green-600'
                          }`}>{metric.disparityIndex}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Group Comparisons</h5>
                      <div className="space-y-2">
                        {metric.groupComparisons.map((group, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{group.group}</div>
                              <div className="text-sm text-gray-600">Rate: {group.rate}</div>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${
                                group.riskRatio > 1.5 ? 'text-red-600' : 
                                group.riskRatio > 1.2 ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {group.riskRatio.toFixed(1)}x
                              </div>
                              <div className="text-xs text-gray-500">Risk Ratio</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Social Determinants Impact</h5>
                      <div className="space-y-2">
                        {metric.socialDeterminants.map((factor, i) => (
                          <div key={i} className="p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                              <span className="text-sm text-gray-600">Impact: {(factor.impact * 100).toFixed(0)}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${factor.impact * 100}%` }}
                                />
                              </div>
                              <div className="text-xs text-green-600">
                                {(factor.interventionPotential * 100).toFixed(0)}% addressable
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analytics Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-green-50 border border-green-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">Advanced Population Health Analytics Platform</p>
                <ul className="text-xs space-y-1">
                  <li>• Real-time epidemiological surveillance with outbreak detection algorithms</li>
                  <li>• Machine learning models for epidemic forecasting and resource demand prediction</li>
                  <li>• Community intervention effectiveness tracking with ROI analysis</li>
                  <li>• Health equity analysis identifying disparities and social determinants</li>
                  <li>• Predictive analytics for public health emergency preparedness</li>
                  <li>• Integration with CDC, WHO, and state health department data systems</li>
                  <li>• DEMO: This showcases enterprise population health intelligence capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}