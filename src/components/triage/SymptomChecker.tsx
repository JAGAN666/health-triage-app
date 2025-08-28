"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { X, Plus, Search } from "lucide-react";

interface SelectedSymptom {
  id: string;
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

const SYMPTOM_CATEGORIES = {
  general: [
    "Fever", "Fatigue", "Weakness", "Weight loss", "Weight gain", 
    "Night sweats", "Chills", "Loss of appetite"
  ],
  head: [
    "Headache", "Dizziness", "Vision problems", "Hearing problems",
    "Sore throat", "Runny nose", "Congestion", "Ear pain"
  ],
  chest: [
    "Chest pain", "Difficulty breathing", "Shortness of breath", 
    "Cough", "Wheezing", "Heart palpitations"
  ],
  abdomen: [
    "Abdominal pain", "Nausea", "Vomiting", "Diarrhea", 
    "Constipation", "Bloating", "Heartburn"
  ],
  musculoskeletal: [
    "Back pain", "Joint pain", "Muscle pain", "Stiffness", 
    "Swelling", "Numbness", "Tingling"
  ],
  mental: [
    "Anxiety", "Depression", "Mood changes", "Confusion", 
    "Memory problems", "Sleep problems", "Stress"
  ],
  skin: [
    "Rash", "Itching", "Bruising", "Cuts/wounds", 
    "Changes in moles", "Dry skin", "Acne"
  ],
  urinary: [
    "Painful urination", "Frequent urination", "Blood in urine", 
    "Difficulty urinating", "Incontinence"
  ]
};

const BODY_PARTS = [
  "Head/Face", "Neck", "Chest", "Abdomen", "Back", "Arms", 
  "Hands", "Legs", "Feet", "Whole body", "Other"
];

const DURATION_OPTIONS = [
  "Less than 1 hour", "1-6 hours", "6-24 hours", "1-3 days", 
  "3-7 days", "1-2 weeks", "2-4 weeks", "More than 1 month"
];

interface SymptomCheckerProps {
  onSymptomsSelected: (symptoms: SelectedSymptom[], description: string) => void;
}

export default function SymptomChecker({ onSymptomsSelected }: SymptomCheckerProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<SelectedSymptom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [additionalDescription, setAdditionalDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('general');

  const filteredSymptoms = Object.entries(SYMPTOM_CATEGORIES).reduce((acc, [category, symptoms]) => {
    const filtered = symptoms.filter(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as Record<string, string[]>);

  const addSymptom = (symptomName: string) => {
    const isAlreadySelected = selectedSymptoms.some(s => s.name === symptomName);
    if (!isAlreadySelected) {
      const newSymptom: SelectedSymptom = {
        id: Date.now().toString(),
        name: symptomName,
        severity: 'moderate',
        duration: '1-3 days'
      };
      setSelectedSymptoms([...selectedSymptoms, newSymptom]);
    }
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.some(s => s.name === customSymptom.trim())) {
      addSymptom(customSymptom.trim());
      setCustomSymptom('');
    }
  };

  const removeSymptom = (id: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s.id !== id));
  };

  const updateSymptom = (id: string, field: keyof SelectedSymptom, value: string) => {
    setSelectedSymptoms(selectedSymptoms.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const handleSubmit = () => {
    let description = '';
    
    if (selectedBodyPart) {
      description += `Location: ${selectedBodyPart}. `;
    }
    
    if (selectedSymptoms.length > 0) {
      description += 'Symptoms: ';
      selectedSymptoms.forEach((symptom, index) => {
        description += `${symptom.name}`;
        if (symptom.severity) description += ` (${symptom.severity})`;
        if (symptom.duration) description += ` for ${symptom.duration}`;
        if (index < selectedSymptoms.length - 1) description += ', ';
      });
      description += '. ';
    }
    
    if (additionalDescription.trim()) {
      description += `Additional details: ${additionalDescription.trim()}`;
    }

    onSymptomsSelected(selectedSymptoms, description);
  };

  return (
    <div className="space-y-6">
      {/* Body Part Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Where are you experiencing symptoms?</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
            <SelectTrigger>
              <SelectValue placeholder="Select body part/area" />
            </SelectTrigger>
            <SelectContent>
              {BODY_PARTS.map(part => (
                <SelectItem key={part} value={part}>{part}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Symptom Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search for symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Type to search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(SYMPTOM_CATEGORIES).map(category => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {/* Symptom chips */}
            <div className="space-y-3">
              {(searchTerm ? Object.entries(filteredSymptoms) : [[activeCategory, SYMPTOM_CATEGORIES[activeCategory as keyof typeof SYMPTOM_CATEGORIES]]]).map(([category, symptoms]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <Button
                        key={symptom}
                        variant="outline"
                        size="sm"
                        onClick={() => addSymptom(symptom)}
                        disabled={selectedSymptoms.some(s => s.name === symptom)}
                        className="text-xs"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Symptom Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add custom symptom</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Describe your symptom..."
              value={customSymptom}
              onChange={(e) => setCustomSymptom(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
            />
            <Button onClick={addCustomSymptom} disabled={!customSymptom.trim()}>
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Symptoms */}
      {selectedSymptoms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your selected symptoms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedSymptoms.map(symptom => (
                <div key={symptom.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Badge variant="secondary">{symptom.name}</Badge>
                  
                  <Select 
                    value={symptom.severity} 
                    onValueChange={(value) => updateSymptom(symptom.id, 'severity', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={symptom.duration} 
                    onValueChange={(value) => updateSymptom(symptom.id, 'duration', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map(duration => (
                        <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSymptom(symptom.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional details</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe any additional symptoms, when they started, what makes them better/worse, any medications you're taking, etc."
            value={additionalDescription}
            onChange={(e) => setAdditionalDescription(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        onClick={handleSubmit}
        disabled={selectedSymptoms.length === 0 && !additionalDescription.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        Start Triage Assessment
      </Button>
    </div>
  );
}