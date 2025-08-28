"use client";

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import SymptomChecker from "@/components/triage/SymptomChecker";
import { Card, CardContent } from "@/components/ui/card";

interface SelectedSymptom {
  id: string;
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

export default function SymptomCheckerPage() {
  const router = useRouter();

  const handleSymptomsSelected = (symptoms: SelectedSymptom[], description: string) => {
    // Store symptoms in session storage and redirect to triage with prefilled message
    sessionStorage.setItem('symptomDescription', description);
    router.push('/triage');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Symptom Checker</h1>
              <p className="text-sm text-gray-600">Tell us about your symptoms for personalized guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Safety Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Important Medical Disclaimer</h3>
                  <p className="text-sm text-amber-700">
                    This tool provides informational support only and is <strong>NOT medical advice</strong>. 
                    Always consult with healthcare professionals for medical decisions. 
                    In emergencies, call 911 or your local emergency services immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptom Checker Component */}
          <SymptomChecker onSymptomsSelected={handleSymptomsSelected} />

          {/* Quick Start Alternative */}
          <div className="text-center pt-6 border-t">
            <p className="text-gray-600 mb-4">Or if you prefer to describe your symptoms in your own words:</p>
            <Link href="/triage">
              <Button variant="outline" size="lg">
                Start Free-Form Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}