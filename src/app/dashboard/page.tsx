"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, Heart, AlertTriangle, Database, Video, MapPin, Watch, Shield, BarChart3, DollarSign, Target, Presentation } from "lucide-react";
import { motion } from "framer-motion";
import HealthDashboard from "@/components/analytics/HealthDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-purple-400/8 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"
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
              <Link href="/vital-signs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-red-200 text-red-700 rounded-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Vital Signs
                  </Button>
                </motion.div>
              </Link>
              <Link href="/emergency">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-orange-200 text-orange-700 rounded-full">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Emergency
                  </Button>
                </motion.div>
              </Link>
              <Link href="/healthcare-integration">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-blue-200 text-blue-700 rounded-full">
                    <Database className="w-4 h-4 mr-2" />
                    FHIR/HL7
                  </Button>
                </motion.div>
              </Link>
              <Link href="/telemedicine">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-purple-200 text-purple-700 rounded-full">
                    <Video className="w-4 h-4 mr-2" />
                    Telemedicine
                  </Button>
                </motion.div>
              </Link>
              <Link href="/geofencing-emergency">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-red-200 text-red-700 rounded-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Geofencing
                  </Button>
                </motion.div>
              </Link>
              <Link href="/iot-devices">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-blue-200 text-blue-700 rounded-full">
                    <Watch className="w-4 h-4 mr-2" />
                    IoT Devices
                  </Button>
                </motion.div>
              </Link>
              <Link href="/blockchain-records">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-indigo-200 text-indigo-700 rounded-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Blockchain
                  </Button>
                </motion.div>
              </Link>
              <Link href="/population-health">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-green-200 text-green-700 rounded-full">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analytics
                  </Button>
                </motion.div>
              </Link>
              <Link href="/healthcare-cost">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-emerald-200 text-emerald-700 rounded-full">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Cost AI
                  </Button>
                </motion.div>
              </Link>
              <Link href="/risk-stratification">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-indigo-200 text-indigo-700 rounded-full">
                    <Target className="w-4 h-4 mr-2" />
                    Risk Tools
                  </Button>
                </motion.div>
              </Link>
              <Link href="/demo">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-purple-200 text-purple-700 rounded-full">
                    <Presentation className="w-4 h-4 mr-2" />
                    Demo
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <HealthDashboard />
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
            🧠 Multimodal AI Health Intelligence
          </p>
          <p className="text-sm text-gray-500">
            Comprehensive health insights combining visual analysis, vital signs monitoring, and AI chat triage
          </p>
        </div>
      </motion.div>
    </div>
  );
}