"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Stethoscope, 
  Video, 
  AlertTriangle, 
  BarChart3, 
  User, 
  ArrowRight,
  Play,
  Shield,
  Award,
  Zap,
  Brain,
  Heart,
  Eye,
  Activity,
  Users,
  Clock,
  Star,
  CheckCircle,
  TrendingUp,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ModernHeader from "@/components/common/ModernHeader";
import ProfessionalBanner from "@/components/common/ProfessionalBanner";
// import OnboardingGuide from "@/components/common/OnboardingGuide"; // DISABLED
import ContextualHelp from "@/components/common/ContextualHelp";
import UserFlowOptimizer from "@/components/common/UserFlowOptimizer";
import HealthcareFooter from "@/components/common/HealthcareFooter";
import { useAccessibility } from "@/hooks/useAccessibilitySSR";
import { useEffect } from "react";

// Main sections data
const mainSections = [
  {
    id: 'health-triage',
    title: 'Health Triage',
    description: 'AI-powered health assessment and symptom analysis with real-time monitoring',
    icon: <Stethoscope className="w-8 h-8" />,
    href: '/triage',
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    features: ['AI Chat Diagnosis', 'Visual Analysis', 'Vital Signs Monitoring', 'Voice Input'],
    stats: '99.2% Accuracy'
  },
  {
    id: 'telehealth',
    title: 'Telehealth',
    description: 'Professional healthcare services with video consultations and EHR integration',
    icon: <Video className="w-8 h-8" />,
    href: '/telemedicine',
    color: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    features: ['Video Consultations', 'Find Providers', 'EHR Integration', 'Appointment Booking'],
    stats: '24/7 Available'
  },
  {
    id: 'emergency',
    title: 'Emergency Care',
    description: 'Critical care detection with automated alerts and location-based response',
    icon: <AlertTriangle className="w-8 h-8" />,
    href: '/emergency',
    color: 'from-red-600 to-red-700',
    bgColor: 'bg-red-50',
    features: ['Emergency Detection', 'GPS Location', 'IoT Monitoring', 'Instant Alerts'],
    stats: '<2min Response'
  },
  {
    id: 'analytics',
    title: 'Health Analytics',
    description: 'Advanced health insights, risk assessment, and predictive healthcare analytics',
    icon: <BarChart3 className="w-8 h-8" />,
    href: '/dashboard',
    color: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    features: ['Risk Assessment', 'Health Predictions', 'Cost Analysis', 'Population Health'],
    stats: '15+ AI Models'
  }
];

const trustIndicators = [
  { icon: <Shield className="w-5 h-5" />, text: 'HIPAA Compliant', color: 'text-green-600' },
  { icon: <Award className="w-5 h-5" />, text: 'WCAG AAA Accessible', color: 'text-blue-600' },
  { icon: <Zap className="w-5 h-5" />, text: 'Enterprise Ready', color: 'text-purple-600' },
  { icon: <Users className="w-5 h-5" />, text: '10,000+ Users', color: 'text-orange-600' },
];

export default function Home() {
  const { t } = useLanguage();
  const { setPageTitle, createSafeAnimation, isClient } = useAccessibility();
  
  useEffect(() => {
    setPageTitle('HealthTriage AI - Professional Healthcare Platform');
  }, [setPageTitle]);

  const heroMotion = createSafeAnimation({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  });

  const sectionMotion = createSafeAnimation({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  });

  const cardMotion = createSafeAnimation({
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    whileHover: { scale: 1.02, y: -5 },
    transition: { duration: 0.4 }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Modern Header */}
      <ModernHeader />

      {/* Professional Banner */}
      <ProfessionalBanner />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23e5e7eb%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16 sm:mb-20 lg:mb-24"
          {...heroMotion}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 mb-4 sm:mb-6 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Healthcare AI Platform
          </motion.h1>
          
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional-grade healthcare technology with comprehensive AI capabilities,
            enterprise compliance, and seamless user experience.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={indicator.text}
                className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-gray-200/50 shadow-sm min-h-[44px] touch-manipulation"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
              >
                <span className={indicator.color}>{indicator.icon}</span>
                <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">{indicator.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Link href="/triage" className="w-full sm:w-auto">
              <motion.div {...cardMotion}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-4 rounded-2xl min-h-[56px] touch-manipulation"
                >
                  <Stethoscope className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Start Health Assessment</span>
                  <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
                </Button>
              </motion.div>
            </Link>
            
            <Link href="/demo" className="w-full sm:w-auto">
              <motion.div {...cardMotion}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-purple-200 hover:border-purple-300 text-purple-700 hover:text-purple-800 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-4 rounded-2xl min-h-[56px] touch-manipulation"
                >
                  <Play className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">Watch Demo</span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.section>

        {/* Main Sections */}
        <motion.section 
          className="mb-16 sm:mb-20 lg:mb-24"
          {...sectionMotion}
        >
          <motion.div 
            className="text-center mb-12 sm:mb-16 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Healthcare Solutions</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive AI-powered healthcare tools organized into four core areas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
            {mainSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={section.href}>
                  <motion.div {...cardMotion}>
                    <Card className={`h-full ${section.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl relative overflow-hidden group cursor-pointer`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${section.color.replace('from-', 'from-').replace('to-', 'to-')}/5 group-hover:${section.color.replace('from-', 'from-').replace('to-', 'to-')}/10 transition-all duration-500`}></div>
                      
                      <CardHeader className="relative z-10 pb-4">
                        <CardTitle className="flex items-center gap-4 text-2xl font-bold text-gray-900">
                          <div className={`p-3 bg-gradient-to-r ${section.color} rounded-2xl shadow-lg text-white`}>
                            {section.icon}
                          </div>
                          <div>
                            <div>{section.title}</div>
                            <div className={`text-xs font-medium mt-1 ${section.color.includes('blue') ? 'text-blue-600' : section.color.includes('purple') ? 'text-purple-600' : section.color.includes('red') ? 'text-red-600' : 'text-green-600'}`}>
                              {section.stats}
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="relative z-10 space-y-4">
                        <p className="text-gray-700 text-lg leading-relaxed mb-6">
                          {section.description}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {section.features.map((feature, featureIndex) => (
                            <div key={feature} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm text-gray-600 font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="pt-4">
                          <Button 
                            className={`w-full bg-gradient-to-r ${section.color} hover:shadow-lg text-white font-semibold py-3 rounded-xl transition-all duration-300`}
                          >
                            Explore {section.title}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Impact Metrics */}
        <motion.section
          className="mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">Real Impact</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Healthcare technology that makes a difference in people's lives
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            <motion.div
              className="text-center p-8 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg w-fit mx-auto mb-6">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <div className="text-4xl font-black text-red-600 mb-2">40%</div>
              <div className="text-gray-700 font-medium">
                Reduction in unnecessary ER visits through early detection
              </div>
            </motion.div>
            
            <motion.div
              className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg w-fit mx-auto mb-6">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <div className="text-4xl font-black text-blue-600 mb-2">&lt;2min</div>
              <div className="text-gray-700 font-medium">
                Average time to get AI health assessment results
              </div>
            </motion.div>
            
            <motion.div
              className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg w-fit mx-auto mb-6">
                <TrendingUp className="w-12 h-12 text-white" />
              </div>
              <div className="text-4xl font-black text-green-600 mb-2">99.2%</div>
              <div className="text-gray-700 font-medium">
                Accuracy rate for symptom classification and risk assessment
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* How it Works */}
        <motion.section className="mb-16 sm:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16 px-4"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get professional-grade health guidance in three simple steps
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              {...cardMotion}
            >
              <Card className="text-center h-full bg-white/60 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 group-hover:from-blue-100/50 group-hover:to-cyan-100/50 transition-all duration-500"></div>
                <CardHeader className="relative z-10 pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Stethoscope className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">1</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Describe Your Symptoms</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Chat with our advanced AI about what you're experiencing. Use voice or text input 
                    with intelligent follow-up questions for accurate assessment.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              {...cardMotion}
            >
              <Card className="text-center h-full bg-white/60 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 group-hover:from-green-100/50 group-hover:to-emerald-100/50 transition-all duration-500"></div>
                <CardHeader className="relative z-10 pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">2</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Get Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Receive an immediate, evidence-based risk assessment (Low, Medium, High) with clear 
                    rationale and personalized action steps.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              {...cardMotion}
            >
              <Card className="text-center h-full bg-white/60 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 group-hover:from-purple-100/50 group-hover:to-pink-100/50 transition-all duration-500"></div>
                <CardHeader className="relative z-10 pb-6">
                  <div className="relative mx-auto mb-6">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Globe className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-800">3</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Find Resources</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-lg text-gray-600 leading-relaxed">
                    Get instantly connected to nearby clinics, pharmacies, hotlines, and mental health 
                    resources with real-time availability and contact info.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>


        {/* User Flow Optimizer */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20 lg:mb-24 px-4 sm:px-0"
        >
          <UserFlowOptimizer />
        </motion.section>

        {/* Safety Disclaimer */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-sm border border-amber-200/50 rounded-3xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-yellow-500/5"></div>
            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-2xl shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Important Medical Disclaimer</h3>
                <p className="text-amber-800 text-lg font-medium leading-relaxed">
                  This tool provides <span className="font-black">informational support only</span> and is <strong>NOT medical advice</strong>. 
                  Always consult with healthcare professionals for medical decisions. 
                  In emergencies, <span className="font-black text-red-700">call 911</span> or your local emergency services immediately.
                </p>
              </div>
            </div>
          </div>
        </motion.section>


      </div>

      {/* Professional Healthcare Footer */}
      <HealthcareFooter />

      {/* Onboarding Guide - DISABLED per user request */}
      {/* <OnboardingGuide autoStart={false} /> */}
      
      {/* Contextual Help */}
      <ContextualHelp position="bottom-right" />
    </div>
  );
}
