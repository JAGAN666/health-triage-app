"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart,
  BarChart3,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Building,
  Heart,
  Activity,
  Brain,
  Target,
  Zap,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Filter,
  Calendar,
  MapPin,
  Shield,
  Database,
  Smartphone,
  Globe,
  FileText,
  CreditCard,
  Banknote,
  Wallet,
  Receipt,
  ChartBar,
  TrendingDownIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CostPrediction {
  id: string;
  patientId: string;
  patientProfile: {
    age: number;
    gender: string;
    chronicConditions: string[];
    riskFactors: string[];
    insuranceType: 'private' | 'medicare' | 'medicaid' | 'uninsured';
    socialDeterminants: {
      income: 'low' | 'medium' | 'high';
      education: 'high_school' | 'college' | 'graduate';
      location: 'urban' | 'suburban' | 'rural';
    };
  };
  predictions: {
    timeframe: '30d' | '90d' | '1y' | '5y';
    totalCost: number;
    breakdown: {
      inpatient: number;
      outpatient: number;
      emergency: number;
      prescription: number;
      diagnostics: number;
      procedures: number;
      preventive: number;
    };
    confidence: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }[];
  costDrivers: {
    factor: string;
    impact: number;
    modifiable: boolean;
    interventionCost: number;
    potentialSavings: number;
  }[];
  interventionRecommendations: {
    intervention: string;
    type: 'preventive' | 'disease_management' | 'lifestyle' | 'medication' | 'technology';
    costReduction: number;
    roi: number;
    timeline: string;
    evidenceLevel: 'high' | 'medium' | 'low';
  }[];
  lastUpdated: Date;
}

interface PopulationCostAnalysis {
  id: string;
  cohort: string;
  size: number;
  demographics: {
    averageAge: number;
    genderDistribution: { male: number; female: number };
    commonConditions: { condition: string; prevalence: number }[];
  };
  costMetrics: {
    totalCosts: number;
    perCapitaCost: number;
    costTrends: {
      period: string;
      cost: number;
      change: number;
    }[];
    costDistribution: {
      percentile: number;
      cost: number;
    }[];
  };
  predictedOutcomes: {
    scenario: 'baseline' | 'optimistic' | 'pessimistic';
    totalCost: number;
    avoidableCosts: number;
    interventionCosts: number;
    netSavings: number;
  }[];
  riskStratification: {
    lowRisk: { percentage: number; averageCost: number };
    mediumRisk: { percentage: number; averageCost: number };
    highRisk: { percentage: number; averageCost: number };
    criticalRisk: { percentage: number; averageCost: number };
  };
}

interface CostEffectivenessAnalysis {
  id: string;
  intervention: string;
  targetPopulation: string;
  studyType: 'rct' | 'observational' | 'modeling' | 'real_world_evidence';
  costs: {
    interventionCost: number;
    implementationCost: number;
    maintenanceCost: number;
    totalCost: number;
  };
  outcomes: {
    qaly: number; // Quality-Adjusted Life Years
    daly: number; // Disability-Adjusted Life Years
    lifeYearsGained: number;
    clinicalBenefits: string[];
  };
  economic: {
    icer: number; // Incremental Cost-Effectiveness Ratio
    costPerQALY: number;
    budgetImpact: number;
    paybackPeriod: number;
    roi: number;
  };
  sensitivity: {
    parameter: string;
    baseCase: number;
    lowValue: number;
    highValue: number;
    impactOnICER: number;
  }[];
}

interface FinancialRiskModel {
  id: string;
  name: string;
  type: 'individual' | 'population' | 'provider' | 'payer';
  accuracy: number;
  features: string[];
  predictions: {
    riskScore: number;
    expectedCost: number;
    costVariability: number;
    riskFactors: { factor: string; weight: number }[];
  };
  performanceMetrics: {
    rmse: number; // Root Mean Square Error
    mae: number;  // Mean Absolute Error
    r2: number;   // R-squared
    mape: number; // Mean Absolute Percentage Error
  };
  calibration: {
    decile: number;
    predicted: number;
    observed: number;
  }[];
}

export default function HealthcareCostPrediction() {
  const [costPredictions, setCostPredictions] = useState<CostPrediction[]>([]);
  const [populationAnalyses, setPopulationAnalyses] = useState<PopulationCostAnalysis[]>([]);
  const [costEffectivenessStudies, setCostEffectivenessStudies] = useState<CostEffectivenessAnalysis[]>([]);
  const [riskModels, setRiskModels] = useState<FinancialRiskModel[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30d' | '90d' | '1y' | '5y'>('1y');
  const [selectedView, setSelectedView] = useState<'individual' | 'population' | 'effectiveness' | 'models'>('individual');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisParams, setAnalysisParams] = useState({
    age: 45,
    conditions: 'diabetes,hypertension',
    insurance: 'private',
    location: 'urban'
  });
  
  const analysisTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializeCostPredictionData();
    return () => {
      if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    };
  }, []);

  const initializeCostPredictionData = async () => {
    // Mock individual cost predictions
    const mockPredictions: CostPrediction[] = [
      {
        id: 'pred-001',
        patientId: 'patient-12345',
        patientProfile: {
          age: 58,
          gender: 'female',
          chronicConditions: ['Type 2 Diabetes', 'Hypertension', 'Obesity'],
          riskFactors: ['Smoking history', 'Sedentary lifestyle', 'Family history of CAD'],
          insuranceType: 'medicare',
          socialDeterminants: {
            income: 'medium',
            education: 'high_school',
            location: 'suburban'
          }
        },
        predictions: [
          {
            timeframe: '1y',
            totalCost: 18450,
            breakdown: {
              inpatient: 8200,
              outpatient: 4850,
              emergency: 1200,
              prescription: 2400,
              diagnostics: 980,
              procedures: 650,
              preventive: 170
            },
            confidence: 87.3,
            riskLevel: 'high'
          },
          {
            timeframe: '5y',
            totalCost: 127800,
            breakdown: {
              inpatient: 58400,
              outpatient: 35200,
              emergency: 8900,
              prescription: 16200,
              diagnostics: 5800,
              procedures: 2900,
              preventive: 400
            },
            confidence: 72.1,
            riskLevel: 'high'
          }
        ],
        costDrivers: [
          {
            factor: 'Diabetes complications',
            impact: 0.34,
            modifiable: true,
            interventionCost: 2400,
            potentialSavings: 8200
          },
          {
            factor: 'Medication adherence',
            impact: 0.28,
            modifiable: true,
            interventionCost: 450,
            potentialSavings: 4800
          },
          {
            factor: 'Age-related comorbidities',
            impact: 0.22,
            modifiable: false,
            interventionCost: 0,
            potentialSavings: 0
          },
          {
            factor: 'Preventive care gaps',
            impact: 0.16,
            modifiable: true,
            interventionCost: 850,
            potentialSavings: 3200
          }
        ],
        interventionRecommendations: [
          {
            intervention: 'Continuous Glucose Monitoring',
            type: 'technology',
            costReduction: 15.2,
            roi: 3.4,
            timeline: '12 months',
            evidenceLevel: 'high'
          },
          {
            intervention: 'Medication Therapy Management',
            type: 'medication',
            costReduction: 22.8,
            roi: 4.8,
            timeline: '6 months',
            evidenceLevel: 'high'
          },
          {
            intervention: 'Lifestyle Coaching Program',
            type: 'lifestyle',
            costReduction: 18.5,
            roi: 2.9,
            timeline: '18 months',
            evidenceLevel: 'medium'
          }
        ],
        lastUpdated: new Date()
      },
      {
        id: 'pred-002',
        patientId: 'patient-67890',
        patientProfile: {
          age: 34,
          gender: 'male',
          chronicConditions: ['Asthma', 'Anxiety'],
          riskFactors: ['Urban air pollution exposure', 'High stress job'],
          insuranceType: 'private',
          socialDeterminants: {
            income: 'high',
            education: 'graduate',
            location: 'urban'
          }
        },
        predictions: [
          {
            timeframe: '1y',
            totalCost: 4850,
            breakdown: {
              inpatient: 0,
              outpatient: 2400,
              emergency: 450,
              prescription: 1200,
              diagnostics: 600,
              procedures: 150,
              preventive: 50
            },
            confidence: 92.7,
            riskLevel: 'low'
          }
        ],
        costDrivers: [
          {
            factor: 'Asthma medication costs',
            impact: 0.48,
            modifiable: true,
            interventionCost: 200,
            potentialSavings: 600
          },
          {
            factor: 'Mental health support',
            impact: 0.32,
            modifiable: true,
            interventionCost: 1200,
            potentialSavings: 800
          },
          {
            factor: 'Preventive care utilization',
            impact: 0.20,
            modifiable: true,
            interventionCost: 300,
            potentialSavings: 400
          }
        ],
        interventionRecommendations: [
          {
            intervention: 'Digital Therapeutics for Asthma',
            type: 'technology',
            costReduction: 12.4,
            roi: 2.1,
            timeline: '8 months',
            evidenceLevel: 'medium'
          },
          {
            intervention: 'Workplace Wellness Program',
            type: 'preventive',
            costReduction: 8.7,
            roi: 1.8,
            timeline: '12 months',
            evidenceLevel: 'medium'
          }
        ],
        lastUpdated: new Date()
      }
    ];

    // Mock population analyses
    const mockPopulationAnalyses: PopulationCostAnalysis[] = [
      {
        id: 'pop-001',
        cohort: 'Diabetes Patients (Age 50-70)',
        size: 125000,
        demographics: {
          averageAge: 58.4,
          genderDistribution: { male: 52.3, female: 47.7 },
          commonConditions: [
            { condition: 'Type 2 Diabetes', prevalence: 100.0 },
            { condition: 'Hypertension', prevalence: 78.5 },
            { condition: 'Dyslipidemia', prevalence: 65.2 },
            { condition: 'Obesity', prevalence: 58.7 }
          ]
        },
        costMetrics: {
          totalCosts: 2.8e9,
          perCapitaCost: 22400,
          costTrends: [
            { period: '2020', cost: 18200, change: 0 },
            { period: '2021', cost: 19800, change: 8.8 },
            { period: '2022', cost: 20900, change: 5.6 },
            { period: '2023', cost: 21700, change: 3.8 },
            { period: '2024', cost: 22400, change: 3.2 }
          ],
          costDistribution: [
            { percentile: 50, cost: 12400 },
            { percentile: 75, cost: 28900 },
            { percentile: 90, cost: 52300 },
            { percentile: 95, cost: 78200 },
            { percentile: 99, cost: 145000 }
          ]
        },
        predictedOutcomes: [
          {
            scenario: 'baseline',
            totalCost: 3.2e9,
            avoidableCosts: 0,
            interventionCosts: 0,
            netSavings: 0
          },
          {
            scenario: 'optimistic',
            totalCost: 2.6e9,
            avoidableCosts: 650e6,
            interventionCosts: 95e6,
            netSavings: 555e6
          },
          {
            scenario: 'pessimistic',
            totalCost: 3.8e9,
            avoidableCosts: 0,
            interventionCosts: 0,
            netSavings: -600e6
          }
        ],
        riskStratification: {
          lowRisk: { percentage: 35.2, averageCost: 8400 },
          mediumRisk: { percentage: 42.8, averageCost: 18900 },
          highRisk: { percentage: 18.5, averageCost: 42300 },
          criticalRisk: { percentage: 3.5, averageCost: 98500 }
        }
      }
    ];

    // Mock cost-effectiveness analyses
    const mockCEAnalyses: CostEffectivenessAnalysis[] = [
      {
        id: 'cea-001',
        intervention: 'Remote Patient Monitoring for Heart Failure',
        targetPopulation: 'Heart failure patients with NYHA Class II-III',
        studyType: 'rct',
        costs: {
          interventionCost: 2400,
          implementationCost: 850,
          maintenanceCost: 1200,
          totalCost: 4450
        },
        outcomes: {
          qaly: 0.68,
          daly: 0.43,
          lifeYearsGained: 0.85,
          clinicalBenefits: [
            'Reduced hospitalizations (38%)',
            'Improved quality of life scores',
            'Better medication adherence',
            'Early detection of decompensation'
          ]
        },
        economic: {
          icer: 28400,
          costPerQALY: 6540,
          budgetImpact: 145000000,
          paybackPeriod: 2.3,
          roi: 3.8
        },
        sensitivity: [
          {
            parameter: 'Hospitalization reduction',
            baseCase: 38,
            lowValue: 28,
            highValue: 48,
            impactOnICER: 15.2
          },
          {
            parameter: 'Device cost',
            baseCase: 2400,
            lowValue: 1800,
            highValue: 3200,
            impactOnICER: 12.8
          },
          {
            parameter: 'QALY gain',
            baseCase: 0.68,
            lowValue: 0.52,
            highValue: 0.84,
            impactOnICER: 23.5
          }
        ]
      }
    ];

    // Mock financial risk models
    const mockRiskModels: FinancialRiskModel[] = [
      {
        id: 'model-001',
        name: 'Multi-Morbidity Cost Predictor',
        type: 'individual',
        accuracy: 89.7,
        features: [
          'Age', 'Gender', 'Chronic conditions count', 'Prior year costs',
          'Medication adherence', 'Social determinants', 'Healthcare utilization',
          'Lab values', 'Vital signs', 'Functional status'
        ],
        predictions: {
          riskScore: 0.73,
          expectedCost: 28450,
          costVariability: 0.42,
          riskFactors: [
            { factor: 'Multiple chronic conditions', weight: 0.34 },
            { factor: 'Prior high utilization', weight: 0.28 },
            { factor: 'Medication non-adherence', weight: 0.22 },
            { factor: 'Social isolation', weight: 0.16 }
          ]
        },
        performanceMetrics: {
          rmse: 4850,
          mae: 3200,
          r2: 0.847,
          mape: 18.3
        },
        calibration: [
          { decile: 1, predicted: 2400, observed: 2650 },
          { decile: 2, predicted: 4200, observed: 4180 },
          { decile: 3, predicted: 6800, observed: 6950 },
          { decile: 4, predicted: 9200, observed: 9100 },
          { decile: 5, predicted: 12500, observed: 12400 },
          { decile: 6, predicted: 16800, observed: 16900 },
          { decile: 7, predicted: 22400, observed: 22200 },
          { decile: 8, predicted: 29800, observed: 30100 },
          { decile: 9, predicted: 42300, observed: 41800 },
          { decile: 10, predicted: 68400, observed: 69200 }
        ]
      }
    ];

    setCostPredictions(mockPredictions);
    setPopulationAnalyses(mockPopulationAnalyses);
    setCostEffectivenessStudies(mockCEAnalyses);
    setRiskModels(mockRiskModels);
  };

  const runCostAnalysis = async () => {
    setIsAnalyzing(true);
    
    analysisTimeoutRef.current = setTimeout(() => {
      setIsAnalyzing(false);
      // Could generate new predictions based on analysisParams
      console.log('Cost analysis completed');
    }, 4000);
  };

  const generateCostReport = (format: 'pdf' | 'excel' | 'csv') => {
    const reportData = {
      timestamp: new Date().toISOString(),
      type: `Healthcare Cost Analysis - ${format.toUpperCase()}`,
      individualPredictions: costPredictions,
      populationAnalyses: populationAnalyses,
      costEffectiveness: costEffectivenessStudies,
      riskModels: riskModels,
      parameters: {
        timeframe: selectedTimeframe,
        analysisParams: analysisParams
      }
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `healthcare-cost-analysis-${format}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLargeCurrency = (amount: number) => {
    if (amount >= 1e9) {
      return `$${(amount / 1e9).toFixed(1)}B`;
    } else if (amount >= 1e6) {
      return `$${(amount / 1e6).toFixed(1)}M`;
    } else if (amount >= 1e3) {
      return `$${(amount / 1e3).toFixed(1)}K`;
    } else {
      return formatCurrency(amount);
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
          <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Healthcare Cost Prediction AI
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <Calculator className="w-3 h-3 mr-1" />
                Predictive Analytics
              </Badge>
              <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                <Brain className="w-3 h-3 mr-1" />
                ML Models
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Target className="w-3 h-3 mr-1" />
                Cost-Effectiveness
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Advanced AI-powered healthcare cost prediction, financial risk modeling, and cost-effectiveness analysis
        </p>
      </motion.div>

      {/* Analysis Controls */}
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
                Cost Analysis Controls
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={runCostAnalysis}
                  disabled={isAnalyzing}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Calculator className="w-4 h-4 mr-2" />}
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </Button>
                <Button
                  onClick={() => generateCostReport('excel')}
                  className="bg-teal-500 hover:bg-teal-600 text-white rounded-2xl"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Age</label>
                <Input
                  type="number"
                  value={analysisParams.age}
                  onChange={(e) => setAnalysisParams(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  min="18"
                  max="100"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Conditions</label>
                <Input
                  value={analysisParams.conditions}
                  onChange={(e) => setAnalysisParams(prev => ({ ...prev, conditions: e.target.value }))}
                  placeholder="diabetes,hypertension"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Type</label>
                <select 
                  value={analysisParams.insurance}
                  onChange={(e) => setAnalysisParams(prev => ({ ...prev, insurance: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="private">Private Insurance</option>
                  <option value="medicare">Medicare</option>
                  <option value="medicaid">Medicaid</option>
                  <option value="uninsured">Uninsured</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  value={analysisParams.location}
                  onChange={(e) => setAnalysisParams(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="urban">Urban</option>
                  <option value="suburban">Suburban</option>
                  <option value="rural">Rural</option>
                </select>
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
                { key: 'individual', label: 'Individual Predictions', icon: <Users className="w-4 h-4" /> },
                { key: 'population', label: 'Population Analysis', icon: <BarChart3 className="w-4 h-4" /> },
                { key: 'effectiveness', label: 'Cost-Effectiveness', icon: <Target className="w-4 h-4" /> },
                { key: 'models', label: 'Risk Models', icon: <Brain className="w-4 h-4" /> }
              ].map((view) => (
                <Button
                  key={view.key}
                  onClick={() => setSelectedView(view.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    selectedView === view.key
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
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

      {/* Individual Cost Predictions */}
      {selectedView === 'individual' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Users className="w-6 h-6" />
                Individual Cost Predictions
              </CardTitle>
              <p className="text-gray-600">AI-powered individual healthcare cost forecasting and intervention recommendations</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costPredictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    {/* Patient Profile */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">Patient ID: {prediction.patientId}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{prediction.patientProfile.age} years old</span>
                          <span className="capitalize">{prediction.patientProfile.gender}</span>
                          <span className="capitalize">{prediction.patientProfile.insuranceType}</span>
                          <span className="capitalize">{prediction.patientProfile.socialDeterminants.location}</span>
                        </div>
                      </div>
                      <Badge className={getRiskColor(prediction.predictions[0]?.riskLevel)}>
                        {prediction.predictions[0]?.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>

                    {/* Chronic Conditions */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-2">Chronic Conditions</h5>
                      <div className="flex flex-wrap gap-2">
                        {prediction.patientProfile.chronicConditions.map((condition, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-red-50 border-red-200">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Cost Predictions */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-4">
                      {prediction.predictions.map((pred, i) => (
                        <div key={i} className="p-4 bg-emerald-50 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-semibold text-emerald-900">{pred.timeframe} Forecast</h5>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-emerald-600">{formatCurrency(pred.totalCost)}</div>
                              <div className="text-xs text-emerald-700">{pred.confidence.toFixed(1)}% confidence</div>
                            </div>
                          </div>
                          
                          {/* Cost Breakdown */}
                          <div className="space-y-2">
                            {Object.entries(pred.breakdown).map(([category, cost]) => (
                              <div key={category} className="flex justify-between text-sm">
                                <span className="text-gray-700 capitalize">{category.replace('_', ' ')}</span>
                                <span className="font-medium text-gray-900">{formatCurrency(cost)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cost Drivers */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Primary Cost Drivers</h5>
                      <div className="space-y-3">
                        {prediction.costDrivers.map((driver, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">{driver.factor}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">
                                  {(driver.impact * 100).toFixed(0)}% impact
                                </span>
                                {driver.modifiable ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                            {driver.modifiable && (
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Intervention cost: {formatCurrency(driver.interventionCost)}</span>
                                <span className="text-green-600">
                                  Potential savings: {formatCurrency(driver.potentialSavings)}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Intervention Recommendations */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Recommended Interventions</h5>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {prediction.interventionRecommendations.map((intervention, i) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`text-xs ${
                                intervention.evidenceLevel === 'high' ? 'bg-green-100 text-green-800' :
                                intervention.evidenceLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {intervention.evidenceLevel} evidence
                              </Badge>
                              <Badge variant="outline" className="text-xs capitalize">
                                {intervention.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="font-medium text-blue-900 text-sm mb-2">
                              {intervention.intervention}
                            </div>
                            <div className="flex justify-between text-xs text-blue-700">
                              <span>{intervention.costReduction.toFixed(1)}% reduction</span>
                              <span>{intervention.roi.toFixed(1)}x ROI</span>
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

      {/* Population Cost Analysis */}
      {selectedView === 'population' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="w-6 h-6" />
                Population Cost Analysis
              </CardTitle>
              <p className="text-gray-600">Large-scale healthcare cost analysis and population health economics</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {populationAnalyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{analysis.cohort}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          Population: {analysis.size.toLocaleString()} patients
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {formatLargeCurrency(analysis.costMetrics.totalCosts)}
                        </div>
                        <div className="text-sm text-gray-600">Total Annual Costs</div>
                      </div>
                    </div>

                    {/* Demographics & Conditions */}
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Demographics</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Average Age:</span>
                            <span className="font-medium">{analysis.demographics.averageAge.toFixed(1)} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Male:</span>
                            <span className="font-medium">{analysis.demographics.genderDistribution.male.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Female:</span>
                            <span className="font-medium">{analysis.demographics.genderDistribution.female.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Common Conditions</h5>
                        <div className="space-y-2">
                          {analysis.demographics.commonConditions.slice(0, 4).map((condition, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span>{condition.condition}</span>
                              <span className="font-medium">{condition.prevalence.toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Cost Metrics */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <div className="text-xl font-bold text-emerald-600">
                          {formatCurrency(analysis.costMetrics.perCapitaCost)}
                        </div>
                        <div className="text-sm text-emerald-800">Per Capita Cost</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(analysis.costMetrics.costDistribution[1].cost)}
                        </div>
                        <div className="text-sm text-blue-800">75th Percentile</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">
                          {formatCurrency(analysis.costMetrics.costDistribution[2].cost)}
                        </div>
                        <div className="text-sm text-orange-800">90th Percentile</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(analysis.costMetrics.costDistribution[4].cost)}
                        </div>
                        <div className="text-sm text-red-800">99th Percentile</div>
                      </div>
                    </div>

                    {/* Scenario Analysis */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Scenario Analysis</h5>
                      <div className="grid md:grid-cols-3 gap-4">
                        {analysis.predictedOutcomes.map((scenario, i) => (
                          <div key={i} className={`p-4 rounded-xl ${
                            scenario.scenario === 'baseline' ? 'bg-gray-50' :
                            scenario.scenario === 'optimistic' ? 'bg-green-50' : 'bg-red-50'
                          }`}>
                            <div className="font-semibold text-gray-900 capitalize mb-2">
                              {scenario.scenario} Scenario
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Total Cost:</span>
                                <span className="font-medium">{formatLargeCurrency(scenario.totalCost)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Net Savings:</span>
                                <span className={`font-medium ${
                                  scenario.netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {formatLargeCurrency(Math.abs(scenario.netSavings))}
                                  {scenario.netSavings < 0 ? ' loss' : ' savings'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Stratification */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Risk Stratification</h5>
                      <div className="grid md:grid-cols-4 gap-3">
                        {Object.entries(analysis.riskStratification).map(([risk, data]) => (
                          <div key={risk} className={`p-3 rounded-lg ${
                            risk === 'lowRisk' ? 'bg-green-50' :
                            risk === 'mediumRisk' ? 'bg-yellow-50' :
                            risk === 'highRisk' ? 'bg-orange-50' : 'bg-red-50'
                          }`}>
                            <div className="font-semibold text-gray-900 text-sm capitalize mb-2">
                              {risk.replace('Risk', ' Risk')}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div>{data.percentage.toFixed(1)}% of population</div>
                              <div className="font-medium">{formatCurrency(data.averageCost)} avg cost</div>
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

      {/* Cost-Effectiveness Analysis */}
      {selectedView === 'effectiveness' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6" />
                Cost-Effectiveness Analysis
              </CardTitle>
              <p className="text-gray-600">Economic evaluation of healthcare interventions and technologies</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {costEffectivenessStudies.map((study, index) => (
                  <motion.div
                    key={study.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-lg">{study.intervention}</h4>
                        <p className="text-gray-600 text-sm mt-1">{study.targetPopulation}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-blue-100 text-blue-800 text-xs capitalize">
                            {study.studyType.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          {study.economic.roi.toFixed(1)}x
                        </div>
                        <div className="text-sm text-gray-600">ROI</div>
                      </div>
                    </div>

                    {/* Economic Metrics */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(study.economic.icer)}
                        </div>
                        <div className="text-sm text-blue-800">ICER</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(study.economic.costPerQALY)}
                        </div>
                        <div className="text-sm text-green-800">Cost/QALY</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-xl font-bold text-purple-600">
                          {study.economic.paybackPeriod.toFixed(1)}
                        </div>
                        <div className="text-sm text-purple-800">Years Payback</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-xl font-bold text-orange-600">
                          {formatLargeCurrency(study.economic.budgetImpact)}
                        </div>
                        <div className="text-sm text-orange-800">Budget Impact</div>
                      </div>
                    </div>

                    {/* Costs & Outcomes */}
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Cost Components</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Intervention Cost:</span>
                            <span className="font-medium">{formatCurrency(study.costs.interventionCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Implementation:</span>
                            <span className="font-medium">{formatCurrency(study.costs.implementationCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Maintenance:</span>
                            <span className="font-medium">{formatCurrency(study.costs.maintenanceCost)}</span>
                          </div>
                          <div className="flex justify-between font-semibold border-t pt-2">
                            <span>Total Cost:</span>
                            <span>{formatCurrency(study.costs.totalCost)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Health Outcomes</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>QALYs Gained:</span>
                            <span className="font-medium">{study.outcomes.qaly.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Life Years Gained:</span>
                            <span className="font-medium">{study.outcomes.lifeYearsGained.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>DALYs Averted:</span>
                            <span className="font-medium">{study.outcomes.daly.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h6 className="font-medium text-gray-900 text-sm mb-2">Clinical Benefits</h6>
                          <div className="space-y-1">
                            {study.outcomes.clinicalBenefits.map((benefit, i) => (
                              <div key={i} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sensitivity Analysis */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Sensitivity Analysis</h5>
                      <div className="space-y-3">
                        {study.sensitivity.map((param, i) => (
                          <div key={i} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-900">{param.parameter}</span>
                              <span className="text-sm text-gray-600">
                                ±{param.impactOnICER.toFixed(1)}% ICER impact
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Low: {param.lowValue.toLocaleString()}</span>
                              <span>Base: {param.baseCase.toLocaleString()}</span>
                              <span>High: {param.highValue.toLocaleString()}</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-red-400 to-green-400 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, (param.impactOnICER / 50) * 100)}%` }}
                              />
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

      {/* Risk Models */}
      {selectedView === 'models' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Brain className="w-6 h-6" />
                Financial Risk Models
              </CardTitle>
              <p className="text-gray-600">Machine learning models for healthcare cost prediction and financial risk assessment</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {riskModels.map((model, index) => (
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
                        <p className="text-gray-600 text-sm capitalize mt-1">{model.type} risk model</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{model.accuracy.toFixed(1)}%</div>
                        <div className="text-sm text-gray-600">Accuracy</div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{model.performanceMetrics.r2.toFixed(3)}</div>
                        <div className="text-sm text-blue-800">R²</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{formatCurrency(model.performanceMetrics.mae)}</div>
                        <div className="text-sm text-green-800">MAE</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">{formatCurrency(model.performanceMetrics.rmse)}</div>
                        <div className="text-sm text-purple-800">RMSE</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-lg font-bold text-orange-600">{model.performanceMetrics.mape.toFixed(1)}%</div>
                        <div className="text-sm text-orange-800">MAPE</div>
                      </div>
                    </div>

                    {/* Current Predictions */}
                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Current Prediction</h5>
                        <div className="p-4 bg-emerald-50 rounded-xl">
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Expected Cost:</span>
                            <span className="text-xl font-bold text-emerald-600">
                              {formatCurrency(model.predictions.expectedCost)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="font-medium">Risk Score:</span>
                            <span className={`text-lg font-bold ${
                              model.predictions.riskScore > 0.7 ? 'text-red-600' :
                              model.predictions.riskScore > 0.4 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {(model.predictions.riskScore * 100).toFixed(0)}/100
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Variability:</span>
                            <span className="text-gray-600">
                              ±{(model.predictions.costVariability * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Top Risk Factors</h5>
                        <div className="space-y-2">
                          {model.predictions.riskFactors.map((factor, i) => (
                            <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-red-500 h-2 rounded-full" 
                                    style={{ width: `${factor.weight * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{(factor.weight * 100).toFixed(0)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Model Features */}
                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Model Features ({model.features.length})</h5>
                      <div className="flex flex-wrap gap-2">
                        {model.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Calibration Chart */}
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3">Model Calibration</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                          <span>Decile</span>
                          <span>Predicted vs Observed</span>
                        </div>
                        {model.calibration.slice(0, 5).map((cal, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-900">{cal.decile}</span>
                            <div className="flex items-center gap-4 text-sm">
                              <span>Pred: {formatCurrency(cal.predicted)}</span>
                              <span>Obs: {formatCurrency(cal.observed)}</span>
                              <span className={`font-medium ${
                                Math.abs(cal.predicted - cal.observed) / cal.observed < 0.1 ? 'text-green-600' :
                                Math.abs(cal.predicted - cal.observed) / cal.observed < 0.2 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {((Math.abs(cal.predicted - cal.observed) / cal.observed) * 100).toFixed(1)}% error
                              </span>
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

      {/* Cost Prediction Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="text-sm text-emerald-800">
                <p className="font-semibold mb-1">Advanced Healthcare Cost Prediction AI Platform</p>
                <ul className="text-xs space-y-1">
                  <li>• Machine learning models for individual and population-level cost forecasting</li>
                  <li>• Real-time financial risk assessment with intervention recommendations</li>
                  <li>• Cost-effectiveness analysis of healthcare technologies and interventions</li>
                  <li>• Population health economics with scenario modeling and budget impact analysis</li>
                  <li>• Evidence-based decision support for healthcare resource allocation</li>
                  <li>• Integration with claims data, EHR systems, and health economic databases</li>
                  <li>• DEMO: This showcases enterprise healthcare financial intelligence capabilities</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}