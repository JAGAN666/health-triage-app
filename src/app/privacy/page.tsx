import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
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
              <h1 className="text-xl font-semibold">Privacy Policy</h1>
              <p className="text-sm text-gray-600">How we protect your health information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Your Privacy Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                At HealthTriage AI, we take your privacy seriously. This privacy policy explains how we collect, 
                use, and protect your personal and health information when you use our service. 
                Last updated: August 2025.
              </p>
            </CardContent>
          </Card>

          {/* Information Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Health Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Symptoms and health concerns you describe</li>
                  <li>Mood and mental health check-in data</li>
                  <li>Triage assessment results and recommendations</li>
                  <li>Chat conversations with our AI assistant</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Technical Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>IP address and general location (for resource recommendations)</li>
                  <li>Browser type and device information</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Session timestamps and duration</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Optional Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Email address (if provided for account creation)</li>
                  <li>ZIP code or city (for local resource finding)</li>
                  <li>Language preferences</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Primary Purposes</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Provide AI-powered health triage assessments</li>
                    <li>Generate personalized recommendations and action plans</li>
                    <li>Connect you with appropriate healthcare resources</li>
                    <li>Track your mood and mental health trends</li>
                    <li>Improve our AI models and service quality</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What We DON'T Do</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Sell your health data to third parties</li>
                    <li>Share individual health information with advertisers</li>
                    <li>Use your data for marketing unrelated to health</li>
                    <li>Store more data than necessary for service provision</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Security Measures</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>End-to-end encryption for all health data transmission</li>
                    <li>Secure database storage with access controls</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Staff training on HIPAA and privacy best practices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Retention</h3>
                  <p className="text-gray-700">
                    We retain your health information only as long as necessary to provide our services 
                    or as required by law. You can request deletion of your data at any time through 
                    our support channels.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">You Have the Right To:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Export your health data</li>
                    <li>Opt out of data collection</li>
                    <li>Restrict certain data processing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">How to Exercise Your Rights:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Email us at privacy@healthtriage.ai</li>
                    <li>Use the data controls in your account settings</li>
                    <li>Contact our support team</li>
                    <li>Submit requests will be processed within 30 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or how we handle your data:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> privacy@healthtriage.ai</p>
                <p><strong>Address:</strong> HealthTriage AI Privacy Office, [Address]</p>
                <p><strong>Phone:</strong> 1-800-TRIAGE-1</p>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500">
                  This privacy policy was last updated on August 23, 2025. We will notify users of any 
                  material changes via email or through our service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}