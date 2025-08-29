"use client";

import { useState, useEffect } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Heart, 
  Calendar, 
  Edit3, 
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHealthData } from "@/contexts/HealthDataContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
    bloodType: string;
  };
  preferences: {
    notifications: boolean;
    language: string;
    units: 'metric' | 'imperial';
  };
}

export default function AccountPage() {
  const { healthData, healthScore } = useHealthData();
  const { isAuthenticated, isDemo, user, enableDemoMode } = useDemoAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    medicalHistory: {
      conditions: ['Hypertension'],
      medications: ['Lisinopril 10mg'],
      allergies: ['Penicillin'],
      bloodType: 'A+'
    },
    preferences: {
      notifications: true,
      language: 'English',
      units: 'imperial'
    }
  });

  useEffect(() => {
    // Auto-enable demo mode if not authenticated
    if (!isAuthenticated) {
      enableDemoMode();
    }
    
    // Load user profile from localStorage or API
    const savedProfile = localStorage.getItem('user-profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else if (isDemo && user) {
      // Set profile to demo user data if in demo mode
      const demoProfile = {
        ...profile,
        name: user.name,
        email: user.email,
        // Keep other defaults for demo
      };
      setProfile(demoProfile);
    }
  }, [isAuthenticated, isDemo, user, enableDemoMode]);

  const handleSave = () => {
    localStorage.setItem('user-profile', JSON.stringify(profile));
    setIsEditing(false);
    // TODO: Save to backend API
  };

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof UserProfile],
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-blue-100 border-b border-blue-200 px-4 py-2">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-blue-800 text-center">
              👤 <strong>Demo Mode Active</strong> - You're viewing account settings with demo data. Changes are saved locally.
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isEditing ? "default" : "outline"}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="gap-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => updateProfile('name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => updateProfile('email', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => updateProfile('phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profile.address}
                    onChange={(e) => updateProfile('address', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={profile.emergencyContact.name}
                      onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => updateNestedField('emergencyContact', 'phone', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={profile.emergencyContact.relationship}
                      onChange={(e) => updateNestedField('emergencyContact', 'relationship', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="conditions">Medical Conditions</Label>
                  <Textarea
                    id="conditions"
                    value={profile.medicalHistory.conditions.join(', ')}
                    onChange={(e) => updateNestedField('medicalHistory', 'conditions', e.target.value.split(', ').filter(Boolean))}
                    disabled={!isEditing}
                    placeholder="List your medical conditions separated by commas"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={profile.medicalHistory.medications.join(', ')}
                    onChange={(e) => updateNestedField('medicalHistory', 'medications', e.target.value.split(', ').filter(Boolean))}
                    disabled={!isEditing}
                    placeholder="List your current medications separated by commas"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={profile.medicalHistory.allergies.join(', ')}
                    onChange={(e) => updateNestedField('medicalHistory', 'allergies', e.target.value.split(', ').filter(Boolean))}
                    disabled={!isEditing}
                    placeholder="List your allergies separated by commas"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input
                    id="bloodType"
                    value={profile.medicalHistory.bloodType}
                    onChange={(e) => updateNestedField('medicalHistory', 'bloodType', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g., A+, O-, AB+"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Score */}
            {healthScore && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-600" />
                    Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {healthScore.overallScore}
                    </div>
                    <Badge 
                      variant={
                        healthScore.overallScore >= 80 ? "default" : 
                        healthScore.overallScore >= 60 ? "secondary" : 
                        "destructive"
                      }
                      className="mb-4"
                    >
                      {healthScore.overallScore >= 80 ? "Excellent" : 
                       healthScore.overallScore >= 60 ? "Good" : "Needs Attention"}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Based on your recent health data
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/history">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    Medical History
                  </Button>
                </Link>
                <Link href="/mental-health">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Heart className="w-4 h-4" />
                    Mental Health
                  </Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Shield className="w-4 h-4" />
                    Privacy Settings
                  </Button>
                </Link>
                <Link href="/support">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <Bell className="w-4 h-4" />
                    Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData.recentSymptoms.slice(0, 3).map((symptom, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        symptom.riskLevel === 'HIGH' ? 'bg-red-500' :
                        symptom.riskLevel === 'MEDIUM' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Health Assessment</p>
                        <p className="text-xs text-gray-600">
                          {symptom.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {healthData.recentSymptoms.length === 0 && (
                    <p className="text-sm text-gray-500">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}