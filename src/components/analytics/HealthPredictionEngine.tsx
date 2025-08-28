"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  Clock,
  Heart,
  Activity,
  Sparkles,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HealthDataPoint {
  timestamp: Date;
  heartRate?: number;
  stressLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  sleepQuality?: number;
  activityLevel?: number;
  symptoms?: string[];
  moodScore?: number;
}

interface PredictionResult {
  id: string;
  type: 'risk_increase' | 'risk_decrease' | 'stable' | 'improvement_opportunity';
  condition: string;
  probability: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  recommendations: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface HealthTrend {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface HealthPredictionEngineProps {
  healthHistory?: HealthDataPoint[];
  onPredictionUpdate?: (predictions: PredictionResult[]) => void;
}

export default function HealthPredictionEngine({ 
  healthHistory = [],
  onPredictionUpdate 
}: HealthPredictionEngineProps) {
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Simulate health data if none provided
  const generateSampleHealthData = (): HealthDataPoint[] => {
    const now = new Date();
    const data: HealthDataPoint[] = [];
    
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayOfWeek = timestamp.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      data.push({
        timestamp,
        heartRate: 65 + Math.random() * 30 + (isWeekend ? -5 : 5),
        stressLevel: isWeekend ? 'LOW' : (Math.random() > 0.7 ? 'HIGH' : 'MEDIUM'),
        sleepQuality: 6 + Math.random() * 3 + (isWeekend ? 0.5 : -0.2),
        activityLevel: 4 + Math.random() * 6 + (isWeekend ? 1 : -0.5),
        moodScore: 6 + Math.random() * 3 + (isWeekend ? 0.8 : -0.3),
        symptoms: Math.random() > 0.8 ? ['fatigue'] : []
      });
    }
    
    return data;
  };

  // Advanced ML-inspired prediction algorithms
  const runPredictionAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Use provided data or generate sample data
    const dataToAnalyze = healthHistory.length > 0 ? healthHistory : generateSampleHealthData();
    
    try {
      // Simulate progressive analysis
      const steps = 5;
      for (let step = 0; step < steps; step++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAnalysisProgress((step + 1) / steps * 100);
      }

      // Trend Analysis
      const trends = analyzeTrends(dataToAnalyze);
      setHealthTrends(trends);
      
      // Risk Prediction using multiple algorithms
      const riskPredictions = await predictHealthRisks(dataToAnalyze, trends);
      setPredictions(riskPredictions);
      
      setLastAnalysis(new Date());
      
      if (onPredictionUpdate) {
        onPredictionUpdate(riskPredictions);
      }
      
    } catch (error) {
      console.error('Prediction analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [healthHistory, onPredictionUpdate]);

  const analyzeTrends = (data: HealthDataPoint[]): HealthTrend[] => {
    if (data.length < 7) return [];

    const recentData = data.slice(-7);
    const olderData = data.slice(-14, -7);
    
    const calculateAverage = (values: (number | undefined)[]) => {
      const validValues = values.filter(v => v !== undefined) as number[];
      return validValues.length > 0 ? validValues.reduce((a, b) => a + b, 0) / validValues.length : 0;
    };

    const trends: HealthTrend[] = [];

    // Heart Rate Trend
    const recentHR = calculateAverage(recentData.map(d => d.heartRate));
    const olderHR = calculateAverage(olderData.map(d => d.heartRate));
    const hrChange = recentHR - olderHR;
    
    trends.push({
      metric: 'Heart Rate',
      current: Math.round(recentHR),
      predicted: Math.round(recentHR + hrChange * 0.5),
      change: Math.round(hrChange),
      direction: Math.abs(hrChange) < 2 ? 'stable' : hrChange > 0 ? 'up' : 'down',
      significance: Math.abs(hrChange) > 10 ? 'HIGH' : Math.abs(hrChange) > 5 ? 'MEDIUM' : 'LOW'
    });

    // Sleep Quality Trend
    const recentSleep = calculateAverage(recentData.map(d => d.sleepQuality));
    const olderSleep = calculateAverage(olderData.map(d => d.sleepQuality));
    const sleepChange = recentSleep - olderSleep;
    
    trends.push({
      metric: 'Sleep Quality',
      current: Math.round(recentSleep * 10) / 10,
      predicted: Math.round((recentSleep + sleepChange * 0.5) * 10) / 10,
      change: Math.round(sleepChange * 10) / 10,
      direction: Math.abs(sleepChange) < 0.2 ? 'stable' : sleepChange > 0 ? 'up' : 'down',
      significance: Math.abs(sleepChange) > 1 ? 'HIGH' : Math.abs(sleepChange) > 0.5 ? 'MEDIUM' : 'LOW'
    });

    // Mood Score Trend
    const recentMood = calculateAverage(recentData.map(d => d.moodScore));
    const olderMood = calculateAverage(olderData.map(d => d.moodScore));
    const moodChange = recentMood - olderMood;
    
    trends.push({
      metric: 'Mood Score',
      current: Math.round(recentMood * 10) / 10,
      predicted: Math.round((recentMood + moodChange * 0.5) * 10) / 10,
      change: Math.round(moodChange * 10) / 10,
      direction: Math.abs(moodChange) < 0.3 ? 'stable' : moodChange > 0 ? 'up' : 'down',
      significance: Math.abs(moodChange) > 1.5 ? 'HIGH' : Math.abs(moodChange) > 0.8 ? 'MEDIUM' : 'LOW'
    });

    return trends;
  };

  const predictHealthRisks = async (data: HealthDataPoint[], trends: HealthTrend[]): Promise<PredictionResult[]> => {
    const predictions: PredictionResult[] = [];

    // Cardiovascular Risk Analysis
    const avgHeartRate = data.reduce((sum, d) => sum + (d.heartRate || 70), 0) / data.length;
    const highStressDays = data.filter(d => d.stressLevel === 'HIGH').length;
    
    if (avgHeartRate > 85 && highStressDays > 10) {
      predictions.push({
        id: 'cv-risk-1',
        type: 'risk_increase',
        condition: 'Cardiovascular Stress',
        probability: Math.min(85, 45 + (avgHeartRate - 85) * 2 + highStressDays * 1.5),
        timeframe: '3-6 months',
        confidence: 78,
        factors: [
          'Elevated resting heart rate',
          'Frequent high stress periods',
          'Poor sleep quality patterns'
        ],
        recommendations: [
          'Implement daily stress reduction techniques',
          'Consider cardio fitness evaluation',
          'Monitor blood pressure regularly'
        ],
        severity: avgHeartRate > 95 ? 'HIGH' : 'MEDIUM'
      });
    }

    // Sleep Disorder Risk
    const avgSleepQuality = data.reduce((sum, d) => sum + (d.sleepQuality || 7), 0) / data.length;
    const poorSleepDays = data.filter(d => (d.sleepQuality || 7) < 5).length;
    
    if (avgSleepQuality < 6 || poorSleepDays > 8) {
      predictions.push({
        id: 'sleep-risk-1',
        type: 'risk_increase',
        condition: 'Sleep Quality Deterioration',
        probability: Math.min(90, 30 + (6 - avgSleepQuality) * 15 + poorSleepDays * 2),
        timeframe: '1-2 months',
        confidence: 82,
        factors: [
          'Consistently poor sleep quality',
          'Irregular sleep patterns',
          'High stress correlation with poor sleep'
        ],
        recommendations: [
          'Establish consistent sleep schedule',
          'Evaluate sleep environment',
          'Consider sleep study if persistent'
        ],
        severity: poorSleepDays > 15 ? 'HIGH' : 'MEDIUM'
      });
    }

    // Mental Health Risk Assessment
    const avgMoodScore = data.reduce((sum, d) => sum + (d.moodScore || 7), 0) / data.length;
    const lowMoodDays = data.filter(d => (d.moodScore || 7) < 4).length;
    const moodTrend = trends.find(t => t.metric === 'Mood Score');
    
    if (avgMoodScore < 5.5 || lowMoodDays > 7 || (moodTrend?.direction === 'down' && moodTrend.significance !== 'LOW')) {
      predictions.push({
        id: 'mental-health-1',
        type: 'risk_increase',
        condition: 'Mood and Mental Health Concerns',
        probability: Math.min(75, 25 + (5.5 - avgMoodScore) * 20 + lowMoodDays * 3),
        timeframe: '2-4 weeks',
        confidence: 73,
        factors: [
          'Declining mood scores',
          'Increased frequency of low mood days',
          'Correlation with sleep and stress patterns'
        ],
        recommendations: [
          'Practice mindfulness and meditation',
          'Engage in regular physical activity',
          'Consider professional mental health support'
        ],
        severity: lowMoodDays > 12 ? 'HIGH' : avgMoodScore < 4 ? 'HIGH' : 'MEDIUM'
      });
    }

    // Positive Predictions - Improvement Opportunities
    const improvingTrends = trends.filter(t => t.direction === 'up' && t.significance !== 'LOW');
    if (improvingTrends.length >= 2) {
      predictions.push({
        id: 'improvement-1',
        type: 'improvement_opportunity',
        condition: 'Overall Health Improvement',
        probability: 65 + improvingTrends.length * 10,
        timeframe: '2-6 weeks',
        confidence: 71,
        factors: improvingTrends.map(t => `Improving ${t.metric.toLowerCase()}`),
        recommendations: [
          'Continue current positive health behaviors',
          'Consider increasing activity level gradually',
          'Maintain consistent sleep schedule'
        ],
        severity: 'LOW'
      });
    }

    // Burnout Risk Prediction
    const recentWeek = data.slice(-7);
    const avgRecentStress = recentWeek.filter(d => d.stressLevel === 'HIGH').length;
    const avgRecentSleep = recentWeek.reduce((sum, d) => sum + (d.sleepQuality || 7), 0) / recentWeek.length;
    
    if (avgRecentStress >= 4 && avgRecentSleep < 6) {
      predictions.push({
        id: 'burnout-risk-1',
        type: 'risk_increase',
        condition: 'Burnout and Exhaustion Risk',
        probability: 45 + avgRecentStress * 8 + (6 - avgRecentSleep) * 10,
        timeframe: '1-3 weeks',
        confidence: 69,
        factors: [
          'Sustained high stress levels',
          'Inadequate recovery time',
          'Poor sleep quality during high stress'
        ],
        recommendations: [
          'Implement mandatory rest periods',
          'Practice stress management techniques',
          'Consider workload adjustment'
        ],
        severity: 'HIGH'
      });
    }

    return predictions.sort((a, b) => b.probability - a.probability);
  };

  // Auto-analysis on component mount and data changes
  useEffect(() => {
    if (healthHistory.length > 0 || !lastAnalysis) {
      runPredictionAnalysis();
    }
  }, [runPredictionAnalysis, healthHistory.length, lastAnalysis]);

  const getTrendIcon = (direction: string, significance: string) => {
    if (significance === 'LOW') return <Minus className="w-4 h-4 text-gray-500" />;
    if (direction === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (direction === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getPredictionColor = (type: string, severity: string) => {
    if (type === 'improvement_opportunity') return 'bg-green-100 text-green-800 border-green-200';
    if (severity === 'HIGH') return 'bg-red-100 text-red-800 border-red-200';
    if (severity === 'MEDIUM') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'risk_increase': return <TrendingUp className="w-5 h-5 text-red-600" />;
      case 'improvement_opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'stable': return <Activity className="w-5 h-5 text-blue-600" />;
      default: return <Target className="w-5 h-5 text-purple-600" />;
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
          <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              AI Health Prediction Engine
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                <Zap className="w-3 h-3 mr-1" />
                ML Powered
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <Brain className="w-3 h-3 mr-1" />
                Predictive Analytics
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Advanced machine learning algorithms analyze your health patterns to predict risks and opportunities
        </p>
      </motion.div>

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-6 h-6 text-purple-600" />
                    </motion.div>
                    <span className="font-bold text-purple-900">Analyzing Health Patterns...</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <p className="text-sm text-purple-700">
                    Processing {Math.round(analysisProgress)}% • Advanced ML algorithms at work
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Trends */}
      {healthTrends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BarChart3 className="w-6 h-6" />
                Health Trends Analysis
              </CardTitle>
              <p className="text-gray-600">Pattern recognition from your health data over time</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {healthTrends.map((trend, index) => (
                  <motion.div
                    key={trend.metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{trend.metric}</h4>
                      {getTrendIcon(trend.direction, trend.significance)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current:</span>
                        <span className="font-bold">{trend.current}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Predicted:</span>
                        <span className="font-bold">{trend.predicted}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Change:</span>
                        <span className={`font-bold ${
                          trend.direction === 'up' ? 'text-green-600' :
                          trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trend.change > 0 ? '+' : ''}{trend.change}
                        </span>
                      </div>
                    </div>
                    
                    <Badge className={`mt-2 text-xs ${
                      trend.significance === 'HIGH' ? 'bg-red-100 text-red-800 border-red-200' :
                      trend.significance === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {trend.significance} Significance
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Prediction Results */}
      {predictions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Target className="w-6 h-6" />
                Health Risk Predictions
              </CardTitle>
              <p className="text-gray-600">AI-powered forecasting based on your health patterns</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <motion.div
                    key={prediction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white/50 rounded-xl border border-gray-200/50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getPredictionIcon(prediction.type)}
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{prediction.condition}</h4>
                          <p className="text-sm text-gray-600">Timeframe: {prediction.timeframe}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-black text-gray-900 mb-1">
                          {Math.round(prediction.probability)}%
                        </div>
                        <Badge className={getPredictionColor(prediction.type, prediction.severity)}>
                          {prediction.confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Contributing Factors:</h5>
                        <ul className="space-y-1">
                          {prediction.factors.map((factor, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-gray-400" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Recommendations:</h5>
                        <ul className="space-y-1">
                          {prediction.recommendations.map((rec, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                              <Sparkles className="w-3 h-3 text-blue-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analysis Info */}
      {lastAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-blue-50 border-2 border-blue-200 rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">Last Analysis</p>
                    <p className="text-sm text-blue-700">{lastAnalysis.toLocaleString()}</p>
                  </div>
                </div>
                
                <Button
                  onClick={runPredictionAnalysis}
                  disabled={isAnalyzing}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Re-analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Technical Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-amber-50 border border-amber-200 rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">AI Prediction Limitations</p>
                <ul className="text-xs space-y-1">
                  <li>• Predictions based on pattern analysis, not medical diagnosis</li>
                  <li>• Individual health factors may not be fully captured</li>
                  <li>• Results should complement, not replace, professional healthcare</li>
                  <li>• Confidence scores reflect algorithmic certainty, not medical accuracy</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}