"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Brain, Heart, Phone, ExternalLink, Play, Pause } from "lucide-react";
import Link from "next/link";
import MoodTracker from "@/components/common/MoodTracker";

const MENTAL_HEALTH_RESOURCES = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "24/7 crisis support for those in emotional distress or suicidal crisis",
    website: "https://suicidepreventionlifeline.org",
    type: "Crisis"
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Free 24/7 support via text message",
    website: "https://crisistextline.org",
    type: "Crisis"
  },
  {
    name: "NAMI HelpLine",
    phone: "1-800-950-NAMI (6264)",
    description: "Information, referrals and support for mental health",
    website: "https://nami.org",
    type: "Support"
  },
  {
    name: "SAMHSA Treatment Locator",
    phone: "1-800-662-4357",
    description: "Find mental health and substance abuse treatment",
    website: "https://findtreatment.samhsa.gov",
    type: "Treatment"
  }
];

const BREATHING_EXERCISES = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    duration: "4 cycles",
    instructions: [
      "Sit comfortably with your back straight",
      "Exhale completely through your mouth",
      "Inhale through nose for 4 counts",
      "Hold your breath for 7 counts",
      "Exhale through mouth for 8 counts",
      "Repeat 3-4 times"
    ]
  },
  {
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold",
    duration: "5-10 minutes",
    instructions: [
      "Inhale for 4 counts",
      "Hold for 4 counts",
      "Exhale for 4 counts",
      "Hold empty for 4 counts",
      "Repeat for 5-10 minutes"
    ]
  },
  {
    name: "Belly Breathing",
    description: "Deep diaphragmatic breathing",
    duration: "5-10 minutes",
    instructions: [
      "Place one hand on chest, one on belly",
      "Breathe slowly through nose",
      "Feel belly rise more than chest",
      "Exhale slowly through mouth",
      "Focus on deep, slow breaths"
    ]
  }
];

const GROUNDING_TECHNIQUES = [
  {
    name: "5-4-3-2-1 Technique",
    description: "Use your senses to ground yourself in the present",
    steps: [
      "5 things you can see",
      "4 things you can touch",
      "3 things you can hear",
      "2 things you can smell",
      "1 thing you can taste"
    ]
  },
  {
    name: "Progressive Muscle Relaxation",
    description: "Tense and release different muscle groups",
    steps: [
      "Start with your toes, tense for 5 seconds",
      "Release and notice the relaxation",
      "Move up through each muscle group",
      "End with your face and head",
      "Notice the contrast between tension and relaxation"
    ]
  }
];

export default function MentalHealthPage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [exerciseTimer, setExerciseTimer] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
              <h1 className="text-xl font-semibold">Mental Health Support</h1>
              <p className="text-sm text-gray-600">Tools and resources for your mental wellbeing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Crisis Alert */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-red-600" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-1">In Crisis? Get Help Now</h3>
                  <p className="text-sm text-red-700 mb-3">
                    If you're having thoughts of suicide or self-harm, please reach out immediately:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => window.open('tel:988')}
                    >
                      Call 988
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => window.open('sms:741741?body=HOME')}
                    >
                      Text 741741
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => window.open('tel:911')}
                    >
                      Call 911
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Mood Tracker */}
            <div className="space-y-6">
              <MoodTracker />
            </div>

            {/* Tools and Exercises */}
            <div className="space-y-6">
              {/* Breathing Exercises */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-blue-500" />
                    Breathing Exercises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {BREATHING_EXERCISES.map((exercise) => (
                      <div key={exercise.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <Badge variant="secondary">{exercise.duration}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                        
                        {activeExercise === exercise.name ? (
                          <div className="space-y-2">
                            <ol className="text-sm space-y-1">
                              {exercise.instructions.map((step, index) => (
                                <li key={index} className="flex gap-2">
                                  <span className="font-medium text-blue-600">{index + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveExercise(null)}
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Hide Instructions
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => setActiveExercise(exercise.name)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Exercise
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grounding Techniques */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-green-500" />
                    Grounding Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {GROUNDING_TECHNIQUES.map((technique) => (
                      <div key={technique.name} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{technique.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{technique.description}</p>
                        <ul className="text-sm space-y-1">
                          {technique.steps.map((step, index) => (
                            <li key={index} className="flex gap-2">
                              <span className="text-green-500 mt-0.5">•</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mental Health Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Mental Health Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {MENTAL_HEALTH_RESOURCES.map((resource) => (
                  <div key={resource.name} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{resource.name}</h4>
                      <Badge 
                        className={
                          resource.type === 'Crisis' ? 'bg-red-100 text-red-800' :
                          resource.type === 'Support' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }
                      >
                        {resource.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(`tel:${resource.phone.replace(/\D/g, '')}`)}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {resource.phone}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(resource.website, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Professional Help */}
          <Card>
            <CardHeader>
              <CardTitle>When to Seek Professional Help</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-amber-700">Consider professional support if you experience:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Persistent sadness, anxiety, or mood changes lasting weeks
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Difficulty functioning at work, school, or in relationships
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Changes in sleep, appetite, or energy levels
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Substance use as a coping mechanism
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500 mt-0.5">•</span>
                      Social isolation or withdrawal from activities
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-red-700">Seek immediate help if you experience:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      Thoughts of suicide or self-harm
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      Thoughts of harming others
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      Hallucinations or delusions
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      Severe panic attacks or anxiety
                    </li>
                    <li className="flex gap-2">
                      <span className="text-red-500 mt-0.5">•</span>
                      Complete inability to function daily
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link href="/resources">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Find Mental Health Providers Near You
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