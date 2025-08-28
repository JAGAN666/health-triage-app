import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, AlertTriangle, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Terms of Service</h1>
              <p className="text-sm text-gray-600">Terms and conditions for using HealthTriage AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Medical Disclaimer */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Important Medical Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-red-700 space-y-3">
                <p className="font-semibold">
                  HealthTriage AI is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                <p>
                  This service provides informational support only. Always seek the advice of your physician 
                  or other qualified health provider with any questions you may have regarding a medical condition. 
                  Never disregard professional medical advice or delay in seeking it because of something you 
                  have read on this platform.
                </p>
                <p className="font-semibold">
                  In case of medical emergency, call 911 or go to your nearest emergency room immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Terms of Use
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                By using HealthTriage AI, you agree to these terms and conditions. These terms govern your 
                use of our AI-powered health triage service. Last updated: August 2025.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  HealthTriage AI provides:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>AI-powered symptom assessment and risk stratification</li>
                  <li>General health information and guidance</li>
                  <li>Mental health support tools and resources</li>
                  <li>Healthcare resource location services</li>
                  <li>Health tracking and history management</li>
                </ul>
                
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> Our AI is trained to provide general guidance based on symptoms described. 
                    It cannot diagnose conditions, prescribe treatments, or replace professional medical judgment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Your Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">When Using Our Service, You Must:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Provide accurate and honest information about your symptoms</li>
                    <li>Use the service only for its intended purpose</li>
                    <li>Understand this is informational support, not medical advice</li>
                    <li>Seek professional medical care when recommended</li>
                    <li>Respect our community guidelines and other users</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">You Must NOT:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Use the service for medical emergencies (call 911 instead)</li>
                    <li>Rely solely on AI recommendations for serious health decisions</li>
                    <li>Share your account or let others use it under your name</li>
                    <li>Attempt to reverse-engineer or abuse our AI systems</li>
                    <li>Use the service to seek advice for others without their knowledge</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-600" />
                Service Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  While we strive to provide accurate and helpful information, our service has limitations:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Technical Limitations</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>AI responses may not always be perfect</li>
                      <li>Service availability may vary</li>
                      <li>Internet connection required</li>
                      <li>Data processing delays may occur</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Medical Limitations</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      <li>Cannot perform physical examinations</li>
                      <li>Cannot access your medical records</li>
                      <li>Cannot provide prescription medications</li>
                      <li>Cannot guarantee diagnostic accuracy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  HealthTriage AI provides this service "as is" without warranties. We are not liable for:
                </p>
                
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Medical outcomes based on AI recommendations</li>
                  <li>Decisions made using our risk assessments</li>
                  <li>Delays in seeking appropriate medical care</li>
                  <li>Technical issues affecting service availability</li>
                  <li>Inaccuracies in AI-generated content</li>
                </ul>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800 text-sm">
                    <strong>Maximum Liability:</strong> Our liability is limited to the amount you paid for 
                    our services (currently $0 for our free service). In jurisdictions that don't allow 
                    liability limitations, our liability is limited to the maximum extent permitted by law.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We may update these terms periodically. We'll notify users of material changes via email 
                or through our service. Continued use after changes means you accept the new terms.
              </p>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500">
                  These terms were last updated on August 23, 2025. For questions, contact us at 
                  legal@healthtriage.ai
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}