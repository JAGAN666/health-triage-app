"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle, 
  Phone, 
  FileText, 
  Clock,
  Info
} from "lucide-react";
import { useState } from "react";

interface RiskAssessmentProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  rationale: string;
  actionPlan: string[];
  emergency?: boolean;
  confidence?: number;
  timestamp: Date;
  onExportPDF?: () => void;
}

const RISK_CONFIG = {
  LOW: {
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    title: 'Low Risk',
    description: 'Your symptoms appear to be minor and may not require immediate medical attention.'
  },
  MEDIUM: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Info,
    iconColor: 'text-amber-600',
    title: 'Medium Risk',
    description: 'Your symptoms warrant medical attention. Consider seeing a healthcare provider.'
  },
  HIGH: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    title: 'High Risk',
    description: 'Your symptoms require immediate medical attention. Seek care promptly.'
  }
};

const EMERGENCY_NUMBERS = [
  { label: 'Emergency Services', number: '911' },
  { label: 'Poison Control', number: '1-800-222-1222' },
  { label: 'Crisis Hotline', number: '988' }
];

export default function RiskAssessment({ 
  riskLevel, 
  rationale, 
  actionPlan, 
  emergency,
  confidence,
  timestamp,
  onExportPDF 
}: RiskAssessmentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const config = RISK_CONFIG[riskLevel];
  const IconComponent = config.icon;

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="space-y-4">
      {/* Emergency Alert */}
      {emergency && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">EMERGENCY SITUATION DETECTED</h3>
                <p className="text-sm text-red-700">Based on your symptoms, you should seek emergency care immediately</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {EMERGENCY_NUMBERS.map(({ label, number }) => (
                <Button
                  key={number}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open(`tel:${number}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {label}: {number}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Risk Assessment */}
      <Card className={`border-2 ${config.color.split(' ')[2]} ${riskLevel === 'HIGH' ? 'shadow-lg' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              <div>
                <CardTitle className="text-lg">{config.title} Assessment</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{formatTimeAgo(timestamp)}</span>
                </div>
              </div>
            </div>
            <Badge className={config.color}>
              {riskLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{config.description}</p>
          
          {/* Risk Level Explanation */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Why this assessment:</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">{rationale}</p>
          </div>

          {/* AI Confidence Score */}
          {confidence !== undefined && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-sm text-blue-900">AI Assessment Confidence</h4>
                <Badge variant="outline" className={`text-xs ${
                  confidence >= 0.8 ? 'border-green-300 text-green-700' :
                  confidence >= 0.6 ? 'border-blue-300 text-blue-700' :
                  confidence >= 0.4 ? 'border-yellow-300 text-yellow-700' : 
                  'border-red-300 text-red-700'
                }`}>
                  {Math.round(confidence * 100)}%
                </Badge>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    confidence >= 0.8 ? 'bg-green-500' :
                    confidence >= 0.6 ? 'bg-blue-500' :
                    confidence >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-800">
                {confidence >= 0.8 
                  ? 'High confidence in this assessment based on provided symptoms.'
                  : confidence >= 0.6
                    ? 'Moderate confidence. Additional information may improve accuracy.'
                    : 'Lower confidence due to limited or ambiguous symptom information. Consider providing more details or seeking professional evaluation.'
                }
              </p>
            </div>
          )}

          {/* Action Plan */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Recommended actions:</h4>
            <ul className="space-y-2">
              {actionPlan.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    riskLevel === 'HIGH' ? 'bg-red-500' : 
                    riskLevel === 'MEDIUM' ? 'bg-amber-500' : 
                    'bg-green-500'
                  }`} />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            
            {onExportPDF && (
              <Button
                variant="outline"
                size="sm"
                onClick={onExportPDF}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            )}

            {riskLevel !== 'LOW' && (
              <Button
                size="sm"
                className={
                  riskLevel === 'HIGH' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-amber-600 hover:bg-amber-700'
                }
                onClick={() => window.open('/resources', '_blank')}
              >
                Find Healthcare Resources
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information (Expandable) */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Risk Factors Considered:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Symptom severity and combination</li>
                  <li>• Duration and progression</li>
                  <li>• Age and health status indicators</li>
                  <li>• Potential for serious complications</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-1">When to Seek Immediate Care:</h4>
                <ul className="text-gray-600 space-y-1">
                  <li>• Severe chest pain or difficulty breathing</li>
                  <li>• Signs of stroke (face drooping, arm weakness, speech difficulty)</li>
                  <li>• Severe bleeding or injuries</li>
                  <li>• Loss of consciousness or severe confusion</li>
                  <li>• Thoughts of self-harm</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Follow-up Guidelines:</h4>
                <ul className="text-gray-600 space-y-1">
                  {riskLevel === 'LOW' && (
                    <>
                      <li>• Monitor symptoms for changes</li>
                      <li>• See a doctor if symptoms persist beyond expected timeframe</li>
                      <li>• Return if symptoms worsen significantly</li>
                    </>
                  )}
                  {riskLevel === 'MEDIUM' && (
                    <>
                      <li>• Schedule appointment within 24-48 hours</li>
                      <li>• Seek immediate care if symptoms worsen</li>
                      <li>• Keep a symptom diary until seen by provider</li>
                    </>
                  )}
                  {riskLevel === 'HIGH' && (
                    <>
                      <li>• Seek care immediately or go to emergency room</li>
                      <li>• Do not delay treatment</li>
                      <li>• Have someone drive you if possible</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-xs text-gray-600">
              <strong>Medical Disclaimer:</strong> This assessment is for informational purposes only 
              and is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any 
              questions you may have regarding a medical condition.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}