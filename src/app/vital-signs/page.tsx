"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { motion } from "framer-motion";
import VitalSignsMonitor from "@/components/triage/VitalSignsMonitor";
import RealTimeVitalMonitor from "@/components/analytics/RealTimeVitalMonitor";
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Activity, Zap } from "lucide-react";

export default function VitalSignsPage() {
  const [selectedMode, setSelectedMode] = useState<'standard' | 'realtime'>('standard');
  const [vitalSignsData, setVitalSignsData] = useState<any>(null);

  const handleVitalSignsUpdate = (data: any) => {
    setVitalSignsData(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-red-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 38,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-orange-400/10 to-red-400/10 rounded-full blur-3xl"
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
            <Link href="/">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </motion.div>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link href="/visual-analysis">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-purple-200 text-purple-700 rounded-full">
                    <Eye className="w-4 h-4 mr-2" />
                    AI Vision
                  </Button>
                </motion.div>
              </Link>
              <Link href="/triage">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-blue-200 text-blue-700 rounded-full">
                    AI Chat Triage
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mode Selection */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-0">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600 mb-2">
                Vital Signs Monitoring
              </h1>
              <p className="text-gray-600">Choose your monitoring mode for optimal health tracking</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedMode('standard')}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  selectedMode === 'standard'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70 text-gray-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">Standard Mode</div>
                  <div className="text-sm opacity-80">Basic PPG analysis</div>
                </div>
                {selectedMode === 'standard' && (
                  <Badge className="bg-white/20 text-white border-white/20">
                    Active
                  </Badge>
                )}
              </button>
              
              <button
                onClick={() => setSelectedMode('realtime')}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  selectedMode === 'realtime'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70 text-gray-700'
                }`}
              >
                <Zap className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold flex items-center gap-2">
                    Real-Time Mode
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                      NEW
                    </Badge>
                  </div>
                  <div className="text-sm opacity-80">WebRTC live monitoring</div>
                </div>
                {selectedMode === 'realtime' && (
                  <Badge className="bg-white/20 text-white border-white/20">
                    Active
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {selectedMode === 'standard' ? (
            <VitalSignsMonitor />
          ) : (
            <RealTimeVitalMonitor 
              onVitalSignsUpdate={handleVitalSignsUpdate}
              showAdvancedMetrics={true}
            />
          )}
        </div>
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center py-12"
      >
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 mx-4 max-w-2xl mx-auto border border-gray-200/50 shadow-lg">
          <p className="text-gray-600 font-medium mb-2">
            ❤️ Smartphone-Based Vital Signs Monitoring
          </p>
          <p className="text-sm text-gray-500">
            Revolutionary camera-based photoplethysmography and motion analysis for non-invasive health monitoring
          </p>
        </div>
      </motion.div>
    </div>
  );
}