"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Presentation, Users, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useEffect } from "react";
import DemoScenarios from "@/components/common/DemoScenarios";

export default function DemoPage() {
  const { setPageTitle, createSafeAnimation, announcePageChange } = useAccessibility();
  
  useEffect(() => {
    setPageTitle('Interactive Demo Scenarios');
    announcePageChange('Interactive Demo Scenarios');
  }, [setPageTitle, announcePageChange]);

  const motionProps = createSafeAnimation({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400/8 to-blue-400/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"
        />
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/60 backdrop-blur-md border-b border-white/20 sticky top-0 z-10 shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </motion.div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/risk-stratification">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-indigo-200 text-indigo-700 rounded-full">
                    Risk Tools
                  </Button>
                </motion.div>
              </Link>
              <Link href="/healthcare-cost">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-emerald-200 text-emerald-700 rounded-full">
                    Cost AI
                  </Button>
                </motion.div>
              </Link>
              <Link href="/population-health">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-green-200 text-green-700 rounded-full">
                    Analytics
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div {...motionProps}>
            <DemoScenarios />
          </motion.div>
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center py-12"
      >
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 mx-4 max-w-4xl mx-auto border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Presentation className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">Interactive Demos</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Guided Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">Hackathon Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">AI Powered</span>
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-2">
            🎯 Interactive Healthcare AI Demonstration Platform
          </p>
          <p className="text-sm text-gray-500">
            Comprehensive demo scenarios showcasing advanced healthcare AI features, telemedicine capabilities, 
            population health analytics, and emergency response systems with full accessibility compliance
          </p>
        </div>
      </motion.div>
    </div>
  );
}