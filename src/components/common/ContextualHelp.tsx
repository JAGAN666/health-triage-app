/**
 * ContextualHelp Component
 * Smart help system that provides relevant assistance based on user location and actions
 */

"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  HelpCircle, 
  X, 
  MessageCircle,
  Book,
  Video,
  Phone,
  ExternalLink,
  ChevronDown,
  Search,
  Lightbulb,
  Clock,
  Users
} from 'lucide-react';
import { usePathname } from 'next/navigation';

interface HelpResource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'chat' | 'phone' | 'faq';
  content: string;
  url?: string;
  estimatedTime?: string;
  popularity?: number;
  tags?: string[];
}

interface ContextualHelpProps {
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

// Help resources organized by page/context
const helpResources: Record<string, HelpResource[]> = {
  '/triage': [
    {
      id: 'symptom-checker-guide',
      title: 'How to Use the Symptom Checker',
      type: 'article',
      content: 'Learn how to effectively describe your symptoms for the most accurate AI assessment.',
      estimatedTime: '3 min read',
      popularity: 95,
      tags: ['symptoms', 'ai', 'assessment']
    },
    {
      id: 'emergency-vs-urgent',
      title: 'Emergency vs Urgent Care: When to Seek Help',
      type: 'video',
      content: 'Understand the difference between emergency and urgent care situations.',
      url: '/help/emergency-urgent-video',
      estimatedTime: '5 min watch',
      popularity: 88,
      tags: ['emergency', 'urgent care', 'when to call']
    },
    {
      id: 'ai-accuracy',
      title: 'Understanding AI Assessment Accuracy',
      type: 'faq',
      content: 'Common questions about how our AI works and its 99.2% accuracy rate.',
      popularity: 76,
      tags: ['ai', 'accuracy', 'limitations']
    }
  ],
  '/telehealth': [
    {
      id: 'video-consultation-prep',
      title: 'Preparing for Your Video Consultation',
      type: 'article',
      content: 'Everything you need to know before your telehealth appointment.',
      estimatedTime: '4 min read',
      popularity: 92,
      tags: ['video', 'preparation', 'consultation']
    },
    {
      id: 'provider-matching',
      title: 'How Provider Matching Works',
      type: 'article',
      content: 'Learn how we match you with the right healthcare providers based on your needs.',
      estimatedTime: '2 min read',
      popularity: 84,
      tags: ['providers', 'matching', 'selection']
    },
    {
      id: 'insurance-coverage',
      title: 'Telehealth Insurance Coverage',
      type: 'faq',
      content: 'Understanding what telehealth services are covered by your insurance.',
      popularity: 79,
      tags: ['insurance', 'coverage', 'billing']
    }
  ],
  '/emergency': [
    {
      id: 'emergency-detection',
      title: 'How Emergency Detection Works',
      type: 'article',
      content: 'Understanding our AI-powered emergency detection and alert system.',
      estimatedTime: '3 min read',
      popularity: 90,
      tags: ['emergency', 'detection', 'ai', 'alerts']
    },
    {
      id: 'location-services',
      title: 'Emergency Location Services',
      type: 'article',
      content: 'How GPS location sharing helps emergency responders find you quickly.',
      estimatedTime: '2 min read',
      popularity: 85,
      tags: ['gps', 'location', 'emergency response']
    },
    {
      id: 'emergency-contacts',
      title: 'Setting Up Emergency Contacts',
      type: 'video',
      content: 'Step-by-step guide to configuring your emergency contact system.',
      url: '/help/emergency-contacts-video',
      estimatedTime: '3 min watch',
      popularity: 87,
      tags: ['contacts', 'setup', 'configuration']
    }
  ],
  '/dashboard': [
    {
      id: 'reading-health-metrics',
      title: 'Understanding Your Health Metrics',
      type: 'article',
      content: 'How to interpret your health dashboard and track trends over time.',
      estimatedTime: '5 min read',
      popularity: 91,
      tags: ['metrics', 'dashboard', 'trends']
    },
    {
      id: 'risk-assessment-guide',
      title: 'Health Risk Assessment Explained',
      type: 'video',
      content: 'Learn how our 15+ AI models assess your health risks and provide predictions.',
      url: '/help/risk-assessment-video',
      estimatedTime: '7 min watch',
      popularity: 89,
      tags: ['risk', 'assessment', 'predictions']
    },
    {
      id: 'data-privacy',
      title: 'Your Health Data Privacy',
      type: 'article',
      content: 'How we protect your health information and comply with HIPAA regulations.',
      estimatedTime: '4 min read',
      popularity: 82,
      tags: ['privacy', 'hipaa', 'security']
    }
  ],
  'default': [
    {
      id: 'getting-started',
      title: 'Getting Started with HealthTriage AI',
      type: 'video',
      content: 'A comprehensive overview of all platform features and how to use them.',
      url: '/help/getting-started-video',
      estimatedTime: '8 min watch',
      popularity: 96,
      tags: ['getting started', 'overview', 'features']
    },
    {
      id: 'platform-overview',
      title: 'Platform Features Overview',
      type: 'article',
      content: 'Detailed guide to all features: Health Triage, Telehealth, Emergency, and Analytics.',
      estimatedTime: '6 min read',
      popularity: 93,
      tags: ['features', 'overview', 'platform']
    },
    {
      id: 'contact-support',
      title: 'Contact Support',
      type: 'chat',
      content: 'Get help from our support team via live chat, email, or phone.',
      popularity: 88,
      tags: ['support', 'contact', 'help']
    }
  ]
};

const typeIcons = {
  article: <Book className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  chat: <MessageCircle className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  faq: <HelpCircle className="w-4 h-4" />
};

const positionClasses = {
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4'
};

export default function ContextualHelp({ 
  className = '', 
  position = 'bottom-right' 
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<HelpResource | null>(null);
  const pathname = usePathname();

  // Get contextual help resources based on current page
  const getContextualResources = (): HelpResource[] => {
    const contextKey = Object.keys(helpResources).find(key => 
      key !== 'default' && pathname.startsWith(key)
    );
    
    const contextualResources = helpResources[contextKey || 'default'] || [];
    const defaultResources = helpResources.default;
    
    // Combine contextual and default resources, removing duplicates
    const allResources = [...contextualResources];
    defaultResources.forEach(resource => {
      if (!allResources.find(r => r.id === resource.id)) {
        allResources.push(resource);
      }
    });
    
    return allResources.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  };

  const filteredResources = getContextualResources().filter(resource =>
    searchQuery === '' || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleResourceClick = (resource: HelpResource) => {
    if (resource.type === 'chat') {
      // Open chat widget or redirect to support chat
      console.log('Opening chat support...');
    } else if (resource.type === 'phone') {
      // Show phone number or dial
      console.log('Initiating phone support...');
    } else if (resource.url) {
      // Open in new tab
      window.open(resource.url, '_blank');
    } else {
      // Show detailed view
      setSelectedResource(resource);
    }
  };

  return (
    <>
      {/* Help Button */}
      <motion.div
        className={`fixed ${positionClasses[position]} z-40 ${className}`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full p-3"
          size="sm"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="sr-only">Get Help</span>
        </Button>
      </motion.div>

      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                        <Lightbulb className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
                        <p className="text-sm text-gray-500">
                          Find answers and get assistance
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search help articles, videos, and guides..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-0 max-h-96 overflow-y-auto">
                  {selectedResource ? (
                    /* Detailed Resource View */
                    <div className="p-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedResource(null)}
                        className="mb-4 text-gray-500 hover:text-gray-700"
                      >
                        ← Back to help topics
                      </Button>
                      
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {typeIcons[selectedResource.type]}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedResource.title}
                          </h3>
                          {selectedResource.estimatedTime && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {selectedResource.estimatedTime}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        {selectedResource.content}
                      </p>
                      
                      {selectedResource.tags && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {selectedResource.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleResourceClick(selectedResource)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
                          {selectedResource.type === 'video' ? 'Watch Video' : 
                           selectedResource.type === 'chat' ? 'Start Chat' :
                           selectedResource.type === 'phone' ? 'Call Support' : 'Read More'}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedResource(null)}
                        >
                          Back
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Resource List */
                    <div className="divide-y divide-gray-100">
                      {filteredResources.map((resource, index) => (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleResourceClick(resource)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 flex-shrink-0">
                              {typeIcons[resource.type]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {resource.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {resource.content}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                {resource.estimatedTime && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {resource.estimatedTime}
                                  </div>
                                )}
                                {resource.popularity && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {resource.popularity}% helpful
                                  </div>
                                )}
                              </div>
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400 transform -rotate-90" />
                          </div>
                        </motion.div>
                      ))}
                      
                      {filteredResources.length === 0 && (
                        <div className="p-8 text-center">
                          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">
                            No help topics found matching "{searchQuery}"
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => setSearchQuery('')}
                            className="mt-3"
                          >
                            Clear search
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                {/* Footer */}
                {!selectedResource && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Still need help? 
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResourceClick({
                            id: 'chat-support',
                            title: 'Chat Support',
                            type: 'chat',
                            content: 'Chat with support team'
                          })}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open('tel:1-800-HEALTH', '_self')}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}