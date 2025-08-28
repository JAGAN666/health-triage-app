"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Smile, 
  Meh, 
  Frown, 
  Heart,
  Brain,
  TrendingUp,
  Calendar,
  MessageSquare
} from "lucide-react";

interface MoodEntry {
  id: string;
  mood: number;
  notes?: string;
  timestamp: Date;
}

const MOOD_OPTIONS = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500', icon: Frown },
  { value: 2, emoji: '😕', label: 'Sad', color: 'text-orange-500', icon: Frown },
  { value: 3, emoji: '😐', label: 'Neutral', color: 'text-gray-500', icon: Meh },
  { value: 4, emoji: '🙂', label: 'Happy', color: 'text-green-500', icon: Smile },
  { value: 5, emoji: '😄', label: 'Very Happy', color: 'text-blue-500', icon: Smile },
];

const COPING_STRATEGIES = {
  1: [
    "Take 5 deep breaths (inhale for 4, hold for 4, exhale for 6)",
    "Try the 5-4-3-2-1 grounding technique",
    "Call a trusted friend or family member",
    "Consider reaching out to a crisis helpline if needed",
    "Practice gentle self-compassion - it's okay to feel this way"
  ],
  2: [
    "Go for a short walk outside",
    "Listen to calming music or sounds",
    "Write down 3 things you're grateful for",
    "Try progressive muscle relaxation",
    "Consider talking to someone you trust"
  ],
  3: [
    "Do a brief mindfulness exercise",
    "Engage in a hobby you enjoy",
    "Set a small, achievable goal for today",
    "Practice gentle movement or stretching",
    "Connect with a friend via text or call"
  ],
  4: [
    "Share your positive mood with others",
    "Engage in activities that bring you joy",
    "Practice gratitude journaling",
    "Help someone else - acts of kindness boost mood",
    "Maintain healthy habits that support your wellbeing"
  ],
  5: [
    "Celebrate what's going well in your life",
    "Share your joy with others",
    "Engage in creative activities",
    "Practice gratitude and mindfulness",
    "Consider how you can maintain this positive state"
  ]
};

interface MoodTrackerProps {
  onMoodSubmitted?: (entry: MoodEntry) => void;
}

export default function MoodTracker({ onMoodSubmitted }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [showCoping, setShowCoping] = useState(false);

  // Load recent entries from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moodEntries');
    if (saved) {
      const entries = JSON.parse(saved).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
      setRecentEntries(entries);
    }
  }, []);

  const handleSubmit = async () => {
    if (selectedMood === null) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      notes: notes.trim() || undefined,
      timestamp: new Date()
    };

    // Save locally
    const updatedEntries = [newEntry, ...recentEntries].slice(0, 30); // Keep last 30 entries
    setRecentEntries(updatedEntries);
    localStorage.setItem('moodEntries', JSON.stringify(updatedEntries));

    // TODO: Save to database
    try {
      const response = await fetch('/api/mood-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, notes: notes.trim() })
      });
      
      if (response.ok) {
        console.log('Mood entry saved to database');
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
    }

    // Show coping strategies
    setShowCoping(true);

    // Call callback
    onMoodSubmitted?.(newEntry);

    // Reset form
    setTimeout(() => {
      setSelectedMood(null);
      setNotes('');
      setShowCoping(false);
    }, 5000);
  };

  const getAverageMood = () => {
    if (recentEntries.length === 0) return 0;
    const sum = recentEntries.slice(0, 7).reduce((acc, entry) => acc + entry.mood, 0);
    return (sum / Math.min(recentEntries.length, 7)).toFixed(1);
  };

  const getMoodTrend = () => {
    if (recentEntries.length < 2) return 'neutral';
    const recent = recentEntries.slice(0, 3).map(e => e.mood);
    const older = recentEntries.slice(3, 6).map(e => e.mood);
    
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const selectedMoodData = selectedMood ? MOOD_OPTIONS.find(m => m.value === selectedMood) : null;

  return (
    <div className="space-y-6">
      {/* Daily Check-in */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            How are you feeling today?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mood Selection */}
            <div className="grid grid-cols-5 gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const IconComponent = mood.icon;
                return (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className="h-20 flex flex-col gap-2"
                    onClick={() => setSelectedMood(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                );
              })}
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                What's on your mind? (optional)
              </label>
              <Textarea
                placeholder="Share any thoughts, feelings, or what might be affecting your mood today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button 
              onClick={handleSubmit}
              disabled={selectedMood === null}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              Save Mood Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coping Strategies */}
      {showCoping && selectedMoodData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Brain className="w-5 h-5" />
              Helpful Strategies for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-3">
              Based on your mood today, here are some strategies that might help:
            </p>
            <ul className="space-y-2">
              {COPING_STRATEGIES[selectedMood as keyof typeof COPING_STRATEGIES].map((strategy, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                  <span className="text-blue-500 mt-1">•</span>
                  {strategy}
                </li>
              ))}
            </ul>
            
            {selectedMood <= 2 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-semibold mb-2">Need immediate support?</p>
                <div className="space-y-1 text-sm">
                  <p>Crisis Text Line: Text HOME to 741741</p>
                  <p>National Suicide Prevention Lifeline: 988</p>
                  <p>Or call emergency services: 911</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Trends */}
      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Your Mood Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{getAverageMood()}</div>
                <div className="text-sm text-gray-600">7-day average</div>
              </div>
              <div className="text-center">
                <Badge 
                  className={
                    getMoodTrend() === 'improving' ? 'bg-green-100 text-green-800' :
                    getMoodTrend() === 'declining' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {getMoodTrend() === 'improving' ? '↗️ Improving' :
                   getMoodTrend() === 'declining' ? '↘️ Needs attention' :
                   '→ Stable'}
                </Badge>
              </div>
            </div>

            {/* Recent Entries */}
            <div>
              <h4 className="font-medium mb-2">Recent entries:</h4>
              <div className="space-y-2">
                {recentEntries.slice(0, 5).map((entry) => {
                  const moodData = MOOD_OPTIONS.find(m => m.value === entry.mood)!;
                  return (
                    <div key={entry.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{moodData.emoji}</span>
                        <div>
                          <div className="font-medium text-sm">{moodData.label}</div>
                          {entry.notes && (
                            <div className="text-xs text-gray-600 truncate max-w-40">
                              {entry.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}