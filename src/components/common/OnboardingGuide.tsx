/**
 * OnboardingGuide Component
 * Guided tour for new users of HealthTriage AI platform
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Stethoscope, 
  Video, 
  AlertTriangle, 
  BarChart3,
  User,
  CheckCircle,
  Lightbulb,
  Shield,
  Heart
} from 'lucide-react';
import Link from 'next/link';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    href: string;
  };
  highlight?: string;
  tips?: string[];
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to HealthTriage AI',
    description: 'Professional-grade healthcare technology designed to provide accurate health assessments and connect you with appropriate care.',
    icon: <Heart className="w-8 h-8" />,
    tips: [
      'HIPAA compliant and secure',
      'WCAG AAA accessible design',
      '99.2% accuracy rate'
    ]
  },
  {
    id: 'health-triage',
    title: 'Health Assessment',
    description: 'Start with our AI-powered health triage to understand your symptoms and get personalized recommendations.',
    icon: <Stethoscope className="w-8 h-8" />,
    action: {
      label: 'Try Health Assessment',
      href: '/triage'
    },
    highlight: 'Most popular feature',
    tips: [
      'Chat with advanced AI about symptoms',
      'Voice or text input supported',
      'Get risk assessment in under 2 minutes'
    ]
  },
  {
    id: 'telehealth',
    title: 'Professional Care',
    description: 'Connect with licensed healthcare providers through secure video consultations and EHR integration.',
    icon: <Video className="w-8 h-8" />,
    action: {
      label: 'Find Providers',
      href: '/telehealth/providers'
    },
    tips: [
      'Video consultations available 24/7',
      'Find specialists in your area',
      'Integrated medical records'
    ]
  },
  {
    id: 'emergency',
    title: 'Emergency Features',
    description: 'Automated emergency detection with GPS location services and instant alerts to emergency contacts.',
    icon: <AlertTriangle className="w-8 h-8" />,
    action: {
      label: 'Setup Emergency',
      href: '/emergency'
    },
    highlight: '<2min response time',
    tips: [
      'AI detects emergency situations',
      'Automatic location sharing',
      'Connects to emergency services'
    ]
  },
  {
    id: 'analytics',
    title: 'Health Insights',
    description: 'Track your health patterns, view risk assessments, and get predictive health insights powered by 15+ AI models.',
    icon: <BarChart3 className="w-8 h-8" />,
    action: {
      label: 'View Dashboard',
      href: '/dashboard'
    },
    tips: [
      'Personalized health analytics',
      'Risk prediction and prevention',
      'Population health comparisons'
    ]
  },
  {
    id: 'account',
    title: 'Your Health Profile',
    description: 'Manage your medical history, privacy settings, and access support resources in one secure location.',
    icon: <User className="w-8 h-8" />,
    action: {
      label: 'Setup Profile',
      href: '/account'
    },
    tips: [
      'Secure medical history storage',
      'Mental health tracking',
      'Privacy controls and support'
    ]
  }
];

interface OnboardingGuideProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function OnboardingGuide({ onComplete, autoStart = false }: OnboardingGuideProps) {
  const [isOpen, setIsOpen] = useState(autoStart);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding before
    const completed = localStorage.getItem('healthtriage-onboarding-completed');
    if (completed) {
      setHasCompleted(true);
      setIsOpen(false);
    } else if (autoStart) {
      setIsOpen(true);
    }
  }, [autoStart]);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('healthtriage-onboarding-completed', 'true');
    setHasCompleted(true);
    setIsOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-40 bg-white/80 backdrop-blur-sm border-blue-200 text-blue-700 hover:bg-blue-50 shadow-lg"
      >
        <Lightbulb className="w-4 h-4 mr-2" />
        {hasCompleted ? 'Replay Tour' : 'Take Tour'}
      </Button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && handleSkip()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    {currentStepData.icon}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      Step {currentStep + 1} of {onboardingSteps.length}
                    </div>
                    <div className="font-semibold text-gray-900">
                      {currentStepData.title}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <CardContent className="px-6 pb-6">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  {currentStepData.highlight && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium rounded-full mb-3">
                      <CheckCircle className="w-4 h-4" />
                      {currentStepData.highlight}
                    </div>
                  )}
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    {currentStepData.description}
                  </p>

                  {/* Tips */}
                  {currentStepData.tips && (
                    <div className="space-y-2 mb-6">
                      {currentStepData.tips.map((tip, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  {currentStepData.action && (
                    <Link href={currentStepData.action.href}>
                      <Button
                        onClick={handleComplete}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-4"
                      >
                        {currentStepData.action.label}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {onboardingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep
                          ? 'bg-blue-600'
                          : index < currentStep
                          ? 'bg-green-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                  {currentStep === onboardingSteps.length - 1 ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Skip Link */}
              <div className="text-center mt-4">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Skip tour and explore on my own
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}