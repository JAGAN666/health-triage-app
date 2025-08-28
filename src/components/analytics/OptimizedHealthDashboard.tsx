"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, Heart, Eye, Activity, TrendingUp, Calendar, AlertTriangle, Sparkles, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useHealthData } from "@/contexts/HealthDataContext";
import { usePerformanceMonitor, useDebounce, reactOptimization } from "@/utils/performance";
import { useAccessibility } from "@/hooks/useAccessibility";
import { LazyOnScroll, PerformanceWrapper } from "@/components/common/LazyComponents";
import { HealthMetricCard, AccessibleFeatureCard } from "@/components/common/AccessibleCard";

interface HealthMetric {
  id: string;
  type: 'vision' | 'vitals' | 'chat' | 'mental';
  timestamp: Date;
  data: any;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'alert' | 'recommendation';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
}

// Memoized metric card component for performance
const MetricCard = React.memo<{
  metric: HealthMetric;
  onViewDetails: (id: string) => void;
}>(({ metric, onViewDetails }) => {
  const { createSafeAnimation } = useAccessibility();
  
  const getRiskColor = useCallback((risk: string) => {
    switch (risk) {
      case 'HIGH': return 'critical';
      case 'MEDIUM': return 'warning';
      default: return 'normal';
    }
  }, []);

  const getMetricIcon = useCallback((type: string) => {
    switch (type) {
      case 'vitals': return <Heart className="w-5 h-5" />;
      case 'vision': return <Eye className="w-5 h-5" />;
      case 'chat': return <Brain className="w-5 h-5" />;
      case 'mental': return <Sparkles className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  }, []);

  const motionProps = createSafeAnimation({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.2 }
  });

  return (
    <motion.div {...motionProps}>
      <HealthMetricCard
        title={metric.type.charAt(0).toUpperCase() + metric.type.slice(1)}
        value={metric.data?.value || 'N/A'}
        unit={metric.data?.unit}
        status={getRiskColor(metric.riskLevel)}
        description={metric.data?.description}
        icon={getMetricIcon(metric.type)}
        onViewDetails={() => onViewDetails(metric.id)}
      />
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';

// Memoized insight card component
const InsightCard = React.memo<{
  insight: HealthInsight;
  onDismiss: (id: string) => void;
}>(({ insight, onDismiss }) => {
  const { createSafeAnimation } = useAccessibility();
  
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-50 border-red-200 text-red-800';
      case 'MEDIUM': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  }, []);

  const motionProps = createSafeAnimation({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  });

  return (
    <motion.div {...motionProps} layout>
      <Card className={`${getPriorityColor(insight.priority)} border-2`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              {getTypeIcon(insight.type)}
              <div>
                <h4 className="font-medium">{insight.title}</h4>
                <p className="text-sm mt-1">{insight.description}</p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(insight.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Dismiss insight"
            >
              ×
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

InsightCard.displayName = 'InsightCard';

export default function OptimizedHealthDashboard() {
  const { startMeasurement, endMeasurement } = usePerformanceMonitor();
  const { healthData, healthScore, recalculateHealthScore } = useHealthData();
  const { announceHealthData, prefersReducedMotion, createSafeAnimation } = useAccessibility();

  // State management with performance considerations
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Debounced search to prevent excessive updates
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized calculations
  const filteredMetrics = useMemo(() => {
    startMeasurement('filterMetrics');
    const filtered = healthMetrics.filter(metric =>
      metric.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    endMeasurement('filterMetrics');
    return filtered;
  }, [healthMetrics, debouncedSearchTerm, startMeasurement, endMeasurement]);

  const healthScoreColor = useMemo(() => {
    if (healthScore >= 80) return 'text-green-600';
    if (healthScore >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, [healthScore]);

  // Optimized metric generation
  const generateHealthMetrics = useCallback(() => {
    startMeasurement('generateMetrics');
    const metrics: HealthMetric[] = [];
    
    // Generate metrics only if data exists
    if (healthData.heartRate || healthData.stressLevel) {
      metrics.push({
        id: 'vitals-current',
        type: 'vitals',
        timestamp: new Date(),
        data: { 
          value: healthData.heartRate || 'N/A',
          unit: 'bpm',
          description: `Stress level: ${healthData.stressLevel || 'Unknown'}`
        },
        riskLevel: healthData.stressLevel === 'HIGH' ? 'HIGH' : 'LOW'
      });
    }

    if (healthData.moodScore) {
      metrics.push({
        id: 'mental-current',
        type: 'mental',
        timestamp: new Date(),
        data: { 
          value: healthData.moodScore,
          unit: '/10',
          description: 'Current mood assessment'
        },
        riskLevel: healthData.moodScore < 4 ? 'HIGH' : healthData.moodScore < 7 ? 'MEDIUM' : 'LOW'
      });
    }

    setHealthMetrics(metrics);
    endMeasurement('generateMetrics');
  }, [healthData, startMeasurement, endMeasurement]);

  // Optimized insight generation
  const generateHealthInsights = reactOptimization.callbackWithPerf(() => {
    const insights: HealthInsight[] = [];

    if (healthScore < 60) {
      insights.push({
        id: 'low-health-score',
        title: 'Health Score Needs Attention',
        description: 'Your current health score suggests room for improvement. Consider consulting healthcare providers.',
        type: 'alert',
        priority: 'HIGH',
        actionable: true
      });
    }

    if (healthData.stressLevel === 'HIGH') {
      insights.push({
        id: 'high-stress',
        title: 'Elevated Stress Detected',
        description: 'High stress levels can impact overall health. Try relaxation techniques or speak with a professional.',
        type: 'alert',
        priority: 'MEDIUM',
        actionable: true
      });
    }

    if (healthData.moodScore && healthData.moodScore < 4) {
      insights.push({
        id: 'low-mood',
        title: 'Mood Support Available',
        description: 'Low mood scores indicate you might benefit from mental health resources.',
        type: 'recommendation',
        priority: 'HIGH',
        actionable: true
      });
    }

    setHealthInsights(insights);
  }, [healthScore, healthData]);

  // Effects with performance monitoring
  useEffect(() => {
    generateHealthMetrics();
    generateHealthInsights();
  }, [generateHealthMetrics, generateHealthInsights]);

  // Optimized event handlers
  const handleViewMetricDetails = reactOptimization.callbackWithPerf((metricId: string) => {
    console.log(`Viewing details for metric: ${metricId}`);
    // Navigate to detailed view
  }, []);

  const handleDismissInsight = reactOptimization.callbackWithPerf((insightId: string) => {
    setHealthInsights(prev => prev.filter(insight => insight.id !== insightId));
  }, []);

  const handleRecalculateScore = reactOptimization.callbackWithPerf(() => {
    startMeasurement('recalculateScore');
    recalculateHealthScore();
    endMeasurement('recalculateScore');
    announceHealthData({
      metric: 'Health Score',
      value: healthScore,
      unit: 'points'
    });
  }, [recalculateHealthScore, healthScore, announceHealthData, startMeasurement, endMeasurement]);

  // Safe animation props
  const containerMotionProps = createSafeAnimation({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  });

  const scoreMotionProps = createSafeAnimation({
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: { duration: 0.6, ease: "back.out(1.7)" }
  });

  return (
    <PerformanceWrapper name="OptimizedHealthDashboard">
      <motion.div 
        className="space-y-8"
        {...containerMotionProps}
      >
        {/* Health Score Section */}
        <div className="text-center">
          <motion.div 
            className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-blue-50 to-indigo-100 border-4 border-indigo-200 mb-4"
            {...scoreMotionProps}
            role="img"
            aria-label={`Health score: ${healthScore} out of 100`}
          >
            <span className={`text-4xl font-bold ${healthScoreColor}`}>
              {healthScore}
            </span>
          </motion.div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your Health Score
          </h2>
          <p className="text-gray-600 mb-4">
            Based on your recent health data and assessments
          </p>
          <Button 
            onClick={handleRecalculateScore}
            variant="outline"
            aria-describedby="recalculate-help"
          >
            <Activity className="w-4 h-4 mr-2" />
            Recalculate Score
          </Button>
          <p id="recalculate-help" className="sr-only">
            Updates your health score based on latest data
          </p>
        </div>

        {/* Health Metrics Section */}
        <section aria-labelledby="metrics-heading">
          <h3 id="metrics-heading" className="text-xl font-semibold text-gray-900 mb-4">
            Recent Health Metrics
          </h3>
          
          {filteredMetrics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredMetrics.map((metric) => (
                  <MetricCard
                    key={metric.id}
                    metric={metric}
                    onViewDetails={handleViewMetricDetails}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No Health Data Yet
                </h4>
                <p className="text-gray-600 mb-4">
                  Start using our health tools to see personalized insights here
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link href="/triage">
                    <Button size="sm">Start Health Check</Button>
                  </Link>
                  <Link href="/vital-signs">
                    <Button size="sm" variant="outline">Monitor Vitals</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Health Insights Section - Lazy loaded */}
        <LazyOnScroll className="space-y-4">
          <section aria-labelledby="insights-heading">
            <h3 id="insights-heading" className="text-xl font-semibold text-gray-900 mb-4">
              Health Insights & Recommendations
            </h3>
            
            {healthInsights.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {healthInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={handleDismissInsight}
                    />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <Card className="p-6 text-center text-gray-600">
                <CardContent>
                  <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>No specific insights at this time. Keep using the platform for personalized recommendations!</p>
                </CardContent>
              </Card>
            )}
          </section>
        </LazyOnScroll>

        {/* Quick Actions - Lazy loaded */}
        <LazyOnScroll>
          <section aria-labelledby="actions-heading">
            <h3 id="actions-heading" className="text-xl font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AccessibleFeatureCard
                title="AI Health Chat"
                description="Get personalized health guidance through our AI-powered chat system"
                icon={<Brain className="w-6 h-6 text-blue-600" />}
                href="/triage"
              />
              <AccessibleFeatureCard
                title="Visual Analysis"
                description="Upload photos for AI-powered visual symptom analysis"
                icon={<Eye className="w-6 h-6 text-purple-600" />}
                href="/visual-analysis"
              />
              <AccessibleFeatureCard
                title="Vital Signs Monitor"
                description="Real-time monitoring of heart rate and other vital signs"
                icon={<Heart className="w-6 h-6 text-red-600" />}
                href="/vital-signs"
              />
            </div>
          </section>
        </LazyOnScroll>

        {/* Health Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" role="note">
          <p className="text-sm text-yellow-800">
            <strong>Medical Disclaimer:</strong> This dashboard provides health information for educational purposes only. 
            Always consult with qualified healthcare professionals for medical advice and treatment decisions.
          </p>
        </div>
      </motion.div>
    </PerformanceWrapper>
  );
}