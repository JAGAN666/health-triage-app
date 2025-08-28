import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, Phone, Mail, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
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
              <h1 className="text-xl font-semibold">Support & Help</h1>
              <p className="text-sm text-gray-600">Get help using HealthTriage AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Emergency Notice */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Medical Emergency?</p>
                  <p className="text-sm text-red-700">
                    Don't use this form for emergencies. Call 911 or go to your nearest emergency room immediately.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <Input placeholder="Your full name" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input placeholder="Brief description of your issue" />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea 
                      placeholder="Please describe your question or issue in detail..."
                      rows={6}
                    />
                  </div>
                  
                  <Button className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
                
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    We typically respond within 24 hours during business days. 
                    For urgent non-emergency issues, please call our support line.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ & Contact Info */}
            <div className="space-y-6">
              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-green-600" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Is HealthTriage AI free to use?</h3>
                      <p className="text-xs text-gray-600">
                        Yes, our basic triage service is completely free. We may introduce premium features in the future.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Is my health information secure?</h3>
                      <p className="text-xs text-gray-600">
                        Yes, we use encryption and follow privacy best practices. Read our Privacy Policy for details.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Can I use this for medical emergencies?</h3>
                      <p className="text-xs text-gray-600">
                        No, never use our service for emergencies. Call 911 or go to your nearest emergency room.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm mb-1">How accurate is the AI assessment?</h3>
                      <p className="text-xs text-gray-600">
                        Our AI provides guidance based on symptoms, but it's not a diagnosis. Always consult healthcare professionals.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Can I delete my data?</h3>
                      <p className="text-xs text-gray-600">
                        Yes, you can request data deletion by contacting our support team or using the privacy controls in your account.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Other Ways to Reach Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">Email Support</p>
                        <p className="text-xs text-gray-600">support@healthtriage.ai</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-sm">Phone Support</p>
                        <p className="text-xs text-gray-600">1-800-TRIAGE-1</p>
                        <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM EST</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium text-sm mb-2">Technical Issues?</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      If you're experiencing technical problems, please include:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Your browser type and version</li>
                      <li>• Device type (mobile, desktop, tablet)</li>
                      <li>• Description of what you were trying to do</li>
                      <li>• Any error messages you saw</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Privacy & Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    We take your privacy seriously and will never share your personal health information 
                    without your consent.
                  </p>
                  <Link href="/privacy">
                    <Button variant="outline" size="sm">Read Privacy Policy</Button>
                  </Link>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Safety First</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Our platform includes safety measures and will direct you to emergency services 
                    when appropriate.
                  </p>
                  <Link href="/terms">
                    <Button variant="outline" size="sm">Read Terms of Service</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}