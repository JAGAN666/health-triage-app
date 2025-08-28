"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Heart, Brain, Download, RefreshCw, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface HealthMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  target?: number;
  category: string;
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info';
  confidence: number;
}

export default function HealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(82);

  useEffect(() => {
    generateAnalytics();
  }, []);

  const generateAnalytics = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setMetrics([
      { id: 'hr', label: 'Avg. Heart Rate', value: 72, unit: 'bpm', change: -2.3, target: 70, category: 'vital' },
      { id: 'bp', label: 'Systolic BP', value: 118, unit: 'mmHg', change: 1.2, target: 120, category: 'vital' },
      { id: 'sleep', label: 'Sleep Quality', value: 78, unit: '%', change: 5.4, target: 85, category: 'wellness' },
      { id: 'activity', label: 'Activity Score', value: 85, unit: '%', change: 12.1, target: 90, category: 'behavior' },
      { id: 'stress', label: 'Stress Level', value: 3.2, unit: '/10', change: -8.1, target: 2.5, category: 'wellness' },
      { id: 'weight', label: 'Weight Trend', value: 165, unit: 'lbs', change: -1.2, target: 160, category: 'vital' }
    ]);

    setInsights([
      {
        id: '1',
        title: 'Heart Rate Improvement',
        description: 'Your resting heart rate has improved by 3.2% this month, indicating better cardiovascular fitness.',
        type: 'success',
        confidence: 0.89
      },
      {
        id: '2',
        title: 'Sleep Pattern Analysis',
        description: 'Sleep quality correlates with stress levels. Consider establishing a consistent bedtime routine.',
        type: 'info',
        confidence: 0.94
      },
      {
        id: '3',
        title: 'Blood Pressure Trend',
        description: 'Slight upward trend detected. Monitor salt intake and maintain regular exercise.',
        type: 'warning',
        confidence: 0.76
      }
    ]);
    
    setHealthScore(Math.round(metrics.reduce((acc, m) => acc + (m.target ? (m.value/m.target) * 100 : 75), 0) / 6) || 82);
    setLoading(false);
  };

  const exportReport = () => {
    const data = { metrics, insights, healthScore, generatedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getInsightColor = (type: string) => {
    switch(type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[1,2,3].map(i => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Health Analytics</h2>
          <p className="text-gray-600">AI-powered insights from your health data</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={generateAnalytics} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Health Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Overall Health Score</h3>
                <p className="opacity-90">Based on your comprehensive health data</p>
              </div>
              <div className="text-center">
                <motion.div 
                  className="text-6xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  {healthScore}
                </motion.div>
                <div className="text-lg opacity-80">/ 100</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  className="bg-white rounded-full h-3"
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                  <div className={`flex items-center gap-1 ${
                    metric.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">
                      {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                  <span className="text-sm text-gray-500">{metric.unit}</span>
                </div>
                
                {metric.target && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Target: {metric.target}{metric.unit}</span>
                      <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
                
                <Badge 
                  variant="outline" 
                  className="mt-2 text-xs capitalize"
                >
                  {metric.category}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`p-4 border rounded-lg ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(insight.confidence * 100)}% confident
                  </Badge>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {insight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Trends Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Recent Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Heart Rate', 'Sleep Quality', 'Activity Level'].map((trend, index) => (
              <div key={trend} className="text-center">
                <h4 className="font-medium text-gray-900 mb-3">{trend}</h4>
                <div className="h-20 bg-gray-50 rounded-lg flex items-end justify-center gap-1 p-2">
                  {Array.from({length: 7}, (_, i) => (
                    <div
                      key={i}
                      className="bg-blue-500 rounded-t flex-1 max-w-4"
                      style={{
                        height: `${Math.random() * 60 + 20}%`,
                        minHeight: '8px'
                      }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Last 7 days</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Schedule Check-up</div>
                <div className="text-sm text-gray-500">Based on your trends</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Update Goals</div>
                <div className="text-sm text-gray-500">Optimize targets</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <div className="font-medium">Share with Doctor</div>
                <div className="text-sm text-gray-500">Export full report</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}