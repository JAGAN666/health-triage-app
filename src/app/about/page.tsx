import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Users, Zap, Target, Award, Github } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
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
              <h1 className="text-xl font-semibold">About HealthTriage AI</h1>
              <p className="text-sm text-gray-600">Our mission to make healthcare more accessible</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                HealthTriage AI exists to bridge the gap between health concerns and healthcare access. 
                We believe everyone deserves immediate, intelligent guidance when facing health uncertainties.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-800 font-medium">
                  <span className="font-bold">40% of people</span> delay seeking medical care due to uncertainty, 
                  cost, or access barriers. Our AI-powered platform helps users understand when and where 
                  to seek care, potentially saving lives and reducing healthcare system burden.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* What We Do */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                What We Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">AI-Powered Triage</h3>
                    <p className="text-sm text-gray-600">
                      Our advanced AI analyzes symptoms and provides risk assessments (Low, Medium, High) 
                      with clear rationale and actionable next steps.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Mental Health Support</h3>
                    <p className="text-sm text-gray-600">
                      Daily mood tracking, coping strategies, breathing exercises, and crisis intervention 
                      resources for comprehensive mental wellness.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Resource Connection</h3>
                    <p className="text-sm text-gray-600">
                      Location-based finder for nearby clinics, hospitals, pharmacies, and mental health 
                      providers with real-time information.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Health History Tracking</h3>
                    <p className="text-sm text-gray-600">
                      Secure storage and export of your health assessments, perfect for sharing with 
                      healthcare providers during visits.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Built with Modern Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  HealthTriage AI is built using cutting-edge technologies to ensure reliability, 
                  security, and performance:
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js 15</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">OpenAI GPT-4</Badge>
                  <Badge variant="secondary">Prisma</Badge>
                  <Badge variant="secondary">SQLite</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Shadcn/ui</Badge>
                  <Badge variant="secondary">React</Badge>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-lg p-4 mb-2">
                      <Zap className="w-8 h-8 text-blue-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold">Lightning Fast</h3>
                    <p className="text-xs text-gray-600">Optimized for speed and performance</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 rounded-lg p-4 mb-2">
                      <Heart className="w-8 h-8 text-green-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold">Privacy First</h3>
                    <p className="text-xs text-gray-600">Your health data stays secure</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-lg p-4 mb-2">
                      <Users className="w-8 h-8 text-purple-600 mx-auto" />
                    </div>
                    <h3 className="font-semibold">Accessible</h3>
                    <p className="text-xs text-gray-600">Works on all devices, everywhere</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hackathon */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Award className="w-5 h-5" />
                Built for Bay2BayHacks 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-yellow-700">
                <p className="mb-4">
                  HealthTriage AI was created for Bay2BayHacks 2025, a virtual hackathon focused on 
                  using AI technology to address real-world problems and contribute to societal betterment.
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Hackathon Theme</h3>
                    <p className="text-sm">AI for Societal Good</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Development Time</h3>
                    <p className="text-sm">7 days (August 23-29, 2025)</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Challenge</h3>
                    <p className="text-sm">Create an AI app that helps society</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Prize Pool</h3>
                    <p className="text-sm">$32,518 in cash prizes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety & Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Safety & Medical Disclaimers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>Important:</strong> HealthTriage AI is an informational tool and is NOT a substitute 
                    for professional medical advice, diagnosis, or treatment. Always consult with qualified 
                    healthcare professionals for medical decisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Our Commitment to Safety</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Clear disclaimers on every page and interaction</li>
                    <li>Emergency escalation for high-risk situations</li>
                    <li>Direct links to crisis hotlines and emergency services</li>
                    <li>Encouragement to seek professional care when appropriate</li>
                    <li>No medical diagnoses or prescription recommendations</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Open Source */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Open Source & Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We believe in transparency and community-driven development. Our codebase will be made 
                available on GitHub after the hackathon to encourage collaboration and further development 
                in the healthcare AI space.
              </p>
              
              <div className="flex gap-4">
                <Button variant="outline" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub (Coming Soon)
                </Button>
                <Link href="/support">
                  <Button variant="outline" size="sm">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}