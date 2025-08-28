/**
 * ProgressiveDisclosure Component
 * Contextual help and feature discovery for complex healthcare features
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';

interface DisclosureItem {
  id: string;
  title: string;
  level: 'basic' | 'intermediate' | 'advanced';
  type: 'tip' | 'warning' | 'info' | 'success';
  content: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  learnMore?: {
    label: string;
    href: string;
  };
  prerequisites?: string[];
}

interface ProgressiveDisclosureProps {
  topic: string;
  items: DisclosureItem[];
  userLevel?: 'beginner' | 'intermediate' | 'expert';
  className?: string;
  compact?: boolean;
}

const levelColors = {
  basic: 'bg-green-50 border-green-200 text-green-800',
  intermediate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  advanced: 'bg-red-50 border-red-200 text-red-800',
};

const typeIcons = {
  tip: <Lightbulb className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
};

const typeColors = {
  tip: 'text-blue-600 bg-blue-50 border-blue-200',
  warning: 'text-orange-600 bg-orange-50 border-orange-200',
  info: 'text-gray-600 bg-gray-50 border-gray-200',
  success: 'text-green-600 bg-green-50 border-green-200',
};

export default function ProgressiveDisclosure({
  topic,
  items,
  userLevel = 'beginner',
  className = '',
  compact = false
}: ProgressiveDisclosureProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [userSelectedLevel, setUserSelectedLevel] = useState<'beginner' | 'intermediate' | 'expert'>(userLevel);
  const [isCollapsed, setIsCollapsed] = useState(compact);

  // Filter items based on user level
  const getVisibleItems = () => {
    const levelMap = {
      beginner: ['basic'],
      intermediate: ['basic', 'intermediate'],
      expert: ['basic', 'intermediate', 'advanced']
    };
    
    const allowedLevels = levelMap[userSelectedLevel];
    return items.filter(item => allowedLevels.includes(item.level));
  };

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const visibleItems = getVisibleItems();

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <Card className={`w-full border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {topic} Guide
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {visibleItems.length} {visibleItems.length === 1 ? 'tip' : 'tips'} for your level
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Level Selector */}
            <select
              value={userSelectedLevel}
              onChange={(e) => setUserSelectedLevel(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-gray-400 hover:text-gray-600"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0 space-y-3">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-xl p-4 transition-all duration-200 ${typeColors[item.type]}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {typeIcons[item.type]}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          {item.title}
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${levelColors[item.level]}`}>
                            {item.level}
                          </span>
                        </h4>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItem(item.id)}
                          className="text-gray-500 hover:text-gray-700 p-1 h-auto"
                        >
                          {expandedItems.has(item.id) ? 
                            <ChevronDown className="w-4 h-4" /> : 
                            <ChevronRight className="w-4 h-4" />
                          }
                        </Button>
                      </div>

                      {/* Prerequisites */}
                      {item.prerequisites && item.prerequisites.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">Prerequisites:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.prerequisites.map((prereq, idx) => (
                              <span key={idx} className="text-xs bg-white/50 px-2 py-1 rounded border">
                                {prereq}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <AnimatePresence>
                        {expandedItems.has(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {item.content}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-2">
                              {item.action && (
                                <Button
                                  onClick={item.action.onClick}
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                >
                                  {item.action.label}
                                </Button>
                              )}
                              
                              {item.learnMore && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(item.learnMore!.href, '_blank')}
                                  className="flex items-center gap-2"
                                >
                                  {item.learnMore.label}
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                  <p className="text-sm text-gray-600">
                    Need more help? Try adjusting your level or explore advanced features.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const allItems = new Set(visibleItems.map(item => item.id));
                        setExpandedItems(allItems);
                      }}
                      className="text-xs"
                    >
                      Expand All
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedItems(new Set())}
                      className="text-xs"
                    >
                      Collapse All
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// Healthcare-specific disclosure data
export const healthTriageDisclosures: DisclosureItem[] = [
  {
    id: 'symptom-description',
    title: 'Describing Symptoms Effectively',
    level: 'basic',
    type: 'tip',
    content: 'Be specific about location, duration, intensity (1-10 scale), and what makes symptoms better or worse. Include when symptoms started and if they\'ve changed over time.',
    action: {
      label: 'Try Sample Questions',
      onClick: () => console.log('Show sample questions')
    }
  },
  {
    id: 'emergency-signs',
    title: 'Recognizing Emergency Signs',
    level: 'basic',
    type: 'warning',
    content: 'Call 911 immediately for: chest pain, difficulty breathing, severe head injury, loss of consciousness, severe allergic reactions, or thoughts of self-harm.',
    learnMore: {
      label: 'Emergency Guidelines',
      href: '/emergency-guidelines'
    }
  },
  {
    id: 'ai-limitations',
    title: 'Understanding AI Assessment Limits',
    level: 'intermediate',
    type: 'info',
    content: 'Our AI provides informational support only, not medical diagnosis. Always consult healthcare professionals for medical decisions, especially for persistent or concerning symptoms.',
    prerequisites: ['Complete basic health assessment']
  },
  {
    id: 'risk-interpretation',
    title: 'Interpreting Risk Levels',
    level: 'intermediate',
    type: 'info',
    content: 'Low risk suggests monitoring symptoms; Medium risk recommends healthcare consultation within 24-48 hours; High risk requires immediate medical attention.',
    action: {
      label: 'View Risk Examples',
      onClick: () => console.log('Show risk examples')
    }
  },
  {
    id: 'follow-up-care',
    title: 'Planning Follow-up Care',
    level: 'advanced',
    type: 'success',
    content: 'Use our care coordination features to book appointments, share assessment results with providers, and track symptom progression over time.',
    prerequisites: ['Complete risk assessment', 'Set up health profile'],
    action: {
      label: 'Setup Care Plan',
      onClick: () => console.log('Setup care plan')
    }
  }
];

export const telehealthDisclosures: DisclosureItem[] = [
  {
    id: 'video-setup',
    title: 'Preparing for Video Consultations',
    level: 'basic',
    type: 'tip',
    content: 'Test your camera and microphone beforehand. Ensure good lighting, stable internet connection, and a quiet, private space for your appointment.',
    action: {
      label: 'Test Equipment',
      onClick: () => console.log('Start equipment test')
    }
  },
  {
    id: 'provider-selection',
    title: 'Choosing the Right Provider',
    level: 'intermediate',
    type: 'info',
    content: 'Consider provider specialty, availability, patient reviews, and insurance acceptance. Our matching algorithm considers your health history and preferences.',
    prerequisites: ['Complete health profile']
  },
  {
    id: 'ehr-integration',
    title: 'Electronic Health Records Integration',
    level: 'advanced',
    type: 'success',
    content: 'Connect with major EHR systems to share your health data securely. This enables providers to access your complete medical history during consultations.',
    prerequisites: ['Verify identity', 'Setup secure access'],
    learnMore: {
      label: 'EHR Privacy Guide',
      href: '/ehr-privacy'
    }
  }
];