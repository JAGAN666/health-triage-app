"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Building, Shield } from "lucide-react";
import { motion } from "framer-motion";
import FHIRHealthcareIntegration from "@/components/telehealth/FHIRHealthcareIntegration";
import EHRIntegrationCenter from "@/components/telehealth/EHRIntegrationCenter";
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";

export default function HealthcareIntegrationPage() {
  const [activeTab, setActiveTab] = useState<'fhir' | 'ehr'>('fhir');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
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
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-400/8 to-green-400/8 rounded-full blur-3xl"
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
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-green-400/8 to-blue-400/8 rounded-full blur-3xl"
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
              <Link href="/vital-signs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-red-200 text-red-700 rounded-full">
                    Vital Signs
                  </Button>
                </motion.div>
              </Link>
              <Link href="/visual-analysis">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-purple-200 text-purple-700 rounded-full">
                    AI Vision
                  </Button>
                </motion.div>
              </Link>
              <Link href="/emergency">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border-orange-200 text-orange-700 rounded-full">
                    Emergency AI
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 pt-8 relative z-10">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border-0">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 mb-2">
                Healthcare Systems Integration
              </h1>
              <p className="text-gray-600">Choose your integration approach for comprehensive healthcare interoperability</p>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab('fhir')}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === 'fhir'
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70 text-gray-700'
                }`}
              >
                <Database className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">FHIR/HL7 Standards</div>
                  <div className="text-sm opacity-80">Protocol-level integration</div>
                </div>
                {activeTab === 'fhir' && (
                  <Badge className="bg-white/20 text-white border-white/20">
                    Active
                  </Badge>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('ehr')}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === 'ehr'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/50 hover:bg-white/70 text-gray-700'
                }`}
              >
                <Building className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-bold">EHR System Integration</div>
                  <div className="text-sm opacity-80">Direct vendor connections</div>
                </div>
                {activeTab === 'ehr' && (
                  <Badge className="bg-white/20 text-white border-white/20">
                    Active
                  </Badge>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'fhir' ? (
            <FHIRHealthcareIntegration />
          ) : (
            <EHRIntegrationCenter />
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
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 mx-4 max-w-4xl mx-auto border border-gray-200/50 shadow-lg">
          <div className="flex items-center justify-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">FHIR R4</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-700">HL7 v2.5</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-700">HIPAA Compliant</span>
            </div>
          </div>
          <p className="text-gray-600 font-medium mb-2">
            🏥 Enterprise Healthcare Interoperability
          </p>
          <p className="text-sm text-gray-500">
            Seamless integration with Epic, Cerner, Allscripts, and other major EHR systems using industry-standard FHIR and HL7 protocols
          </p>
        </div>
      </motion.div>
    </div>
  );
}