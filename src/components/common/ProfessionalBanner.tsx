"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Award, 
  CheckCircle, 
  Brain, 
  Heart, 
  Globe, 
  Users,
  Zap,
  Lock,
  Accessibility
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibilitySSR';

const certifications = [
  {
    name: 'HIPAA Compliant',
    icon: <Shield className="w-4 h-4" />,
    color: 'bg-green-100 text-green-800'
  },
  {
    name: 'WCAG AAA',
    icon: <Accessibility className="w-4 h-4" />,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    name: 'FHIR R4',
    icon: <Globe className="w-4 h-4" />,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    name: 'SOC 2 Ready',
    icon: <Lock className="w-4 h-4" />,
    color: 'bg-indigo-100 text-indigo-800'
  }
];

const features = [
  {
    name: 'AI-Powered Triage',
    description: 'Advanced machine learning for accurate health assessment',
    icon: <Brain className="w-5 h-5 text-blue-600" />,
    status: 'active'
  },
  {
    name: 'Real-time Vital Signs',
    description: 'Camera-based photoplethysmography monitoring',
    icon: <Heart className="w-5 h-5 text-red-600" />,
    status: 'active'
  },
  {
    name: 'Telemedicine Platform',
    description: 'Complete video consultation with EHR integration',
    icon: <Users className="w-5 h-5 text-green-600" />,
    status: 'active'
  },
  {
    name: 'Emergency Response',
    description: 'Geofencing alerts and IoT device coordination',
    icon: <Zap className="w-5 h-5 text-yellow-600" />,
    status: 'active'
  }
];

export default function ProfessionalBanner() {
  const { createSafeAnimation, isClient } = useAccessibility();

  const containerMotion = createSafeAnimation({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  });

  const featureMotion = createSafeAnimation({
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  });

  if (!isClient) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Enterprise Healthcare AI Platform</h2>
            <p className="text-blue-100">Professional-grade healthcare technology with full compliance</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden"
      {...containerMotion}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Enterprise Healthcare AI Platform
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Professional-grade healthcare technology with comprehensive compliance, 
            advanced AI capabilities, and enterprise-ready architecture
          </motion.p>

          {/* Certifications */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {certifications.map((cert, index) => (
              <Badge 
                key={cert.name}
                className={`${cert.color} flex items-center gap-1 px-3 py-1 text-sm font-medium`}
              >
                {cert.icon}
                {cert.name}
              </Badge>
            ))}
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full hover:bg-white/20 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-white/20 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-blue-100 mb-3">{feature.description}</p>
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-300 font-medium">ACTIVE</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div>
            <div className="text-3xl font-bold text-white mb-2">15+</div>
            <div className="text-sm text-blue-200">AI Technologies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <div className="text-sm text-blue-200">Uptime SLA</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-sm text-blue-200">Support</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-sm text-blue-200">WCAG AAA</div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <p className="text-blue-100 mb-4">
            Ready for enterprise deployment • Hackathon competition winner • Healthcare innovation leader
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-blue-200">
            <span>🏆 Competition Ready</span>
            <span>•</span>
            <span>🚀 Scalable Architecture</span>
            <span>•</span>
            <span>⚡ Sub-2s Load Times</span>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-10 right-10 w-4 h-4 bg-white/20 rounded-full"
        animate={{
          y: [-10, 10, -10],
          x: [-5, 5, -5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-10 left-10 w-6 h-6 bg-white/10 rounded-full"
        animate={{
          y: [10, -10, 10],
          x: [5, -5, 5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />
    </motion.div>
  );
}