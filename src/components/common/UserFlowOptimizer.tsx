/**
 * UserFlowOptimizer Component
 * Intelligent user flow suggestions and guided pathways through the healthcare platform
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight,
  CheckCircle,
  Clock,
  User,
  Stethoscope,
  Video,
  AlertTriangle,
  BarChart3,
  Lightbulb,
  Target,
  TrendingUp,
  Shield,
  Heart,
  X,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  completedSteps: string[];
  healthPriority: 'prevention' | 'monitoring' | 'treatment' | 'emergency';
  experienceLevel: 'new' | 'returning' | 'expert';
  lastVisit?: Date;
  preferredFeatures?: string[];
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'advanced';
  benefits: string[];
  prerequisites?: string[];
  category: 'triage' | 'telehealth' | 'emergency' | 'analytics' | 'account';
}

interface OptimizedFlow {
  id: string;
  title: string;
  description: string;
  steps: FlowStep[];
  totalTime: string;
  priority: number;
  personalized: boolean;
}

const flowSteps: FlowStep[] = [
  // Health Triage Flow
  {
    id: 'complete-health-profile',
    title: 'Complete Your Health Profile',
    description: 'Set up your medical history and current health status for personalized assessments.',
    icon: <User className="w-5 h-5" />,
    href: '/account/profile',
    estimatedTime: '5 min',
    difficulty: 'easy',
    benefits: ['More accurate AI assessments', 'Personalized recommendations', 'Faster consultations'],
    category: 'account'
  },
  {
    id: 'first-symptom-check',
    title: 'Try Your First Symptom Check',
    description: 'Experience our AI-powered health assessment with a guided walkthrough.',
    icon: <Stethoscope className="w-5 h-5" />,
    href: '/triage?guided=true',
    estimatedTime: '3 min',
    difficulty: 'easy',
    benefits: ['Understand your symptoms', 'Get risk assessment', 'Learn about care options'],
    prerequisites: ['complete-health-profile'],
    category: 'triage'
  },
  {
    id: 'setup-emergency-contacts',
    title: 'Set Up Emergency Contacts',
    description: 'Configure emergency contacts and location services for safety.',
    icon: <AlertTriangle className="w-5 h-5" />,
    href: '/emergency/setup',
    estimatedTime: '3 min',
    difficulty: 'easy',
    benefits: ['Faster emergency response', 'Family notifications', 'Location sharing'],
    category: 'emergency'
  },
  {
    id: 'connect-healthcare-provider',
    title: 'Connect with Healthcare Providers',
    description: 'Find and connect with healthcare professionals in your area.',
    icon: <Video className="w-5 h-5" />,
    href: '/telehealth/providers',
    estimatedTime: '5 min',
    difficulty: 'medium',
    benefits: ['Access to specialists', 'Video consultations', 'Integrated medical records'],
    prerequisites: ['complete-health-profile'],
    category: 'telehealth'
  },
  {
    id: 'explore-health-dashboard',
    title: 'Explore Your Health Dashboard',
    description: 'Learn how to track your health metrics and view personalized insights.',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/dashboard?tour=true',
    estimatedTime: '4 min',
    difficulty: 'medium',
    benefits: ['Track health trends', 'Predictive insights', 'Risk assessment'],
    prerequisites: ['first-symptom-check'],
    category: 'analytics'
  },
  {
    id: 'schedule-consultation',
    title: 'Schedule Your First Consultation',
    description: 'Book a video consultation with a healthcare provider.',
    icon: <Video className="w-5 h-5" />,
    href: '/telehealth/booking',
    estimatedTime: '7 min',
    difficulty: 'medium',
    benefits: ['Professional medical advice', 'Personalized care plan', 'Follow-up scheduling'],
    prerequisites: ['connect-healthcare-provider', 'first-symptom-check'],
    category: 'telehealth'
  },
  {
    id: 'advanced-analytics',
    title: 'Set Up Advanced Health Analytics',
    description: 'Configure detailed health tracking and predictive analysis features.',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/analytics/advanced',
    estimatedTime: '8 min',
    difficulty: 'advanced',
    benefits: ['Population health insights', 'Cost predictions', 'Advanced risk modeling'],
    prerequisites: ['explore-health-dashboard'],
    category: 'analytics'
  }
];

const optimizedFlows: OptimizedFlow[] = [
  {
    id: 'new-user-essentials',
    title: 'Essential Setup for New Users',
    description: 'Get started with the core features you need for comprehensive healthcare support.',
    steps: [
      flowSteps.find(s => s.id === 'complete-health-profile')!,
      flowSteps.find(s => s.id === 'first-symptom-check')!,
      flowSteps.find(s => s.id === 'setup-emergency-contacts')!,
    ],
    totalTime: '11 min',
    priority: 10,
    personalized: true
  },
  {
    id: 'comprehensive-healthcare',
    title: 'Complete Healthcare Platform Setup',
    description: 'Full platform configuration for users who want access to all features.',
    steps: [
      flowSteps.find(s => s.id === 'complete-health-profile')!,
      flowSteps.find(s => s.id === 'first-symptom-check')!,
      flowSteps.find(s => s.id === 'setup-emergency-contacts')!,
      flowSteps.find(s => s.id === 'connect-healthcare-provider')!,
      flowSteps.find(s => s.id === 'explore-health-dashboard')!,
    ],
    totalTime: '20 min',
    priority: 8,
    personalized: true
  },
  {
    id: 'emergency-preparedness',
    title: 'Emergency Preparedness Setup',
    description: 'Focus on emergency detection and response capabilities.',
    steps: [
      flowSteps.find(s => s.id === 'complete-health-profile')!,
      flowSteps.find(s => s.id === 'setup-emergency-contacts')!,
      flowSteps.find(s => s.id === 'first-symptom-check')!,
    ],
    totalTime: '11 min',
    priority: 9,
    personalized: false
  },
  {
    id: 'preventive-care',
    title: 'Preventive Care & Monitoring',
    description: 'Set up health monitoring and preventive care features.',
    steps: [
      flowSteps.find(s => s.id === 'complete-health-profile')!,
      flowSteps.find(s => s.id === 'first-symptom-check')!,
      flowSteps.find(s => s.id === 'explore-health-dashboard')!,
      flowSteps.find(s => s.id === 'advanced-analytics')!,
    ],
    totalTime: '20 min',
    priority: 7,
    personalized: false
  },
  {
    id: 'telehealth-focused',
    title: 'Professional Healthcare Access',
    description: 'Connect with healthcare providers and schedule consultations.',
    steps: [
      flowSteps.find(s => s.id === 'complete-health-profile')!,
      flowSteps.find(s => s.id === 'connect-healthcare-provider')!,
      flowSteps.find(s => s.id === 'schedule-consultation')!,
    ],
    totalTime: '17 min',
    priority: 6,
    personalized: false
  }
];

interface UserFlowOptimizerProps {
  userProfile?: UserProfile;
  className?: string;
  compact?: boolean;
}

export default function UserFlowOptimizer({ 
  userProfile, 
  className = '', 
  compact = false 
}: UserFlowOptimizerProps) {
  const [selectedFlow, setSelectedFlow] = useState<OptimizedFlow | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  // Get user's completed steps from profile or localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('healthtriage-flow-progress');
    if (savedProgress) {
      setCompletedSteps(new Set(JSON.parse(savedProgress)));
    } else if (userProfile) {
      setCompletedSteps(new Set(userProfile.completedSteps));
    }
  }, [userProfile]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('healthtriage-flow-progress', JSON.stringify([...completedSteps]));
  }, [completedSteps]);

  // Determine best flow based on user profile and current progress
  const getRecommendedFlow = (): OptimizedFlow => {
    const incomplete = optimizedFlows.map(flow => ({
      ...flow,
      remainingSteps: flow.steps.filter(step => !completedSteps.has(step.id)).length
    })).filter(flow => flow.remainingSteps > 0);

    if (incomplete.length === 0) {
      return optimizedFlows[0]; // Return default if all completed
    }

    // Sort by priority and personalization
    return incomplete.sort((a, b) => {
      if (a.personalized && !b.personalized) return -1;
      if (!a.personalized && b.personalized) return 1;
      return b.priority - a.priority;
    })[0];
  };

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const isStepCompleted = (stepId: string) => completedSteps.has(stepId);
  const isStepAvailable = (step: FlowStep) => {
    return !step.prerequisites || step.prerequisites.every(prereq => completedSteps.has(prereq));
  };

  const recommendedFlow = selectedFlow || getRecommendedFlow();
  const nextIncompleteStep = recommendedFlow.steps.find(step => !isStepCompleted(step.id) && isStepAvailable(step));
  const progress = (recommendedFlow.steps.filter(step => isStepCompleted(step.id)).length / recommendedFlow.steps.length) * 100;

  if (!isVisible || compact) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-40 bg-white/80 backdrop-blur-sm border-purple-200 text-purple-700 hover:bg-purple-50 shadow-lg"
      >
        <Target className="w-4 h-4 mr-2" />
        Guided Flow
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white shadow-lg">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-1">
                  {recommendedFlow.title}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {recommendedFlow.description}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                {recommendedFlow.steps.filter(step => isStepCompleted(step.id)).length} of{' '}
                {recommendedFlow.steps.length} steps completed
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recommendedFlow.totalTime} total
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Next Step Highlight */}
          {nextIncompleteStep && (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border-2 border-purple-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Next: {nextIncompleteStep.title}</h3>
                  <p className="text-sm text-gray-600">{nextIncompleteStep.estimatedTime} • {nextIncompleteStep.difficulty}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{nextIncompleteStep.description}</p>
              <Link href={nextIncompleteStep.href}>
                <Button 
                  onClick={() => markStepCompleted(nextIncompleteStep.id)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white w-full"
                >
                  Start This Step
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          )}

          {/* All Steps */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-purple-600" />
              Complete Flow Steps
            </h4>
            
            {recommendedFlow.steps.map((step, index) => {
              const completed = isStepCompleted(step.id);
              const available = isStepAvailable(step);
              const current = step.id === nextIncompleteStep?.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    completed
                      ? 'bg-green-50 border-green-200'
                      : current
                      ? 'bg-purple-50 border-purple-200'
                      : available
                      ? 'bg-white border-gray-200 hover:border-purple-200'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      completed
                        ? 'bg-green-600 text-white'
                        : current
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : available
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {completed ? <CheckCircle className="w-5 h-5" /> : step.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className={`font-semibold ${
                          completed ? 'text-green-800' :
                          current ? 'text-purple-900' :
                          available ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {step.estimatedTime}
                        </div>
                      </div>
                      
                      <p className={`text-sm mb-3 ${
                        available ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {step.description}
                      </p>

                      {/* Benefits */}
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {step.benefits.slice(0, 2).map((benefit, idx) => (
                            <span key={idx} className="text-xs bg-white/50 px-2 py-1 rounded border">
                              {benefit}
                            </span>
                          ))}
                          {step.benefits.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{step.benefits.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Prerequisites */}
                      {step.prerequisites && step.prerequisites.length > 0 && (
                        <div className="mb-3">
                          <span className="text-xs text-gray-500">Requires: </span>
                          {step.prerequisites.map((prereq, idx) => (
                            <span key={idx} className={`text-xs ${
                              completedSteps.has(prereq) ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              {flowSteps.find(s => s.id === prereq)?.title}
                              {idx < step.prerequisites!.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action */}
                      {available && !completed && (
                        <Link href={step.href}>
                          <Button
                            onClick={() => markStepCompleted(step.id)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {current ? 'Continue' : 'Start'}
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Flow Selection */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Try a different path?
              </span>
              <div className="flex gap-2">
                {optimizedFlows.slice(0, 3).map(flow => (
                  <Button
                    key={flow.id}
                    variant={flow.id === recommendedFlow.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFlow(flow)}
                    className="text-xs"
                  >
                    {flow.title.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}