"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Video, 
  AlertTriangle, 
  BarChart3, 
  User,
  Menu,
  X,
  Home,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LanguageSelector from './LanguageSelector';
import UserAuth from './UserAuth';

const navigationSections = [
  {
    id: 'health-triage',
    label: 'Health Triage',
    icon: <Stethoscope className="w-5 h-5" />,
    href: '/triage',
    description: 'AI-powered health assessment',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    subPages: [
      { label: 'AI Chat Diagnosis', href: '/triage', description: 'Chat-based symptom assessment' },
      { label: 'Visual Analysis', href: '/visual-analysis', description: 'Photo-based symptom detection' },
      { label: 'Vital Signs', href: '/vital-signs', description: 'Real-time health monitoring' },
      { label: 'Emergency Detection', href: '/emergency', description: 'Automated emergency alerts' },
    ]
  },
  {
    id: 'telehealth',
    label: 'Telehealth',
    icon: <Video className="w-5 h-5" />,
    href: '/telehealth',
    description: 'Professional healthcare services',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    subPages: [
      { label: 'Find Providers', href: '/telehealth/providers', description: 'Connect with healthcare professionals' },
      { label: 'Video Consultations', href: '/telemedicine', description: 'Virtual appointments' },
      { label: 'EHR Integration', href: '/healthcare-integration', description: 'Medical records sync' },
      { label: 'Appointment Booking', href: '/telehealth/appointments', description: 'Schedule consultations' },
    ]
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: <AlertTriangle className="w-5 h-5" />,
    href: '/emergency',
    description: 'Critical care and alerts',
    color: 'text-red-600',
    bgColor: 'bg-red-50 hover:bg-red-100',
    subPages: [
      { label: 'Emergency Detection', href: '/emergency', description: 'AI-powered emergency alerts' },
      { label: 'Location Services', href: '/geofencing-emergency', description: 'GPS-based emergency response' },
      { label: 'IoT Monitoring', href: '/iot-devices', description: 'Connected device alerts' },
      { label: 'Emergency Contacts', href: '/emergency/contacts', description: 'Manage emergency contacts' },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    href: '/analytics',
    description: 'Health insights and trends',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    subPages: [
      { label: 'Health Dashboard', href: '/dashboard', description: 'Personal health overview' },
      { label: 'Risk Assessment', href: '/risk-stratification', description: 'Advanced health risk analysis' },
      { label: 'Population Health', href: '/population-health', description: 'Community health insights' },
      { label: 'Cost Prediction', href: '/healthcare-cost', description: 'Healthcare cost forecasting' },
    ]
  },
  {
    id: 'account',
    label: 'Account',
    icon: <User className="w-5 h-5" />,
    href: '/account',
    description: 'User settings and history',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    subPages: [
      { label: 'Medical History', href: '/history', description: 'View past consultations' },
      { label: 'Mental Health', href: '/mental-health', description: 'Mood tracking and support' },
      { label: 'Privacy & Security', href: '/privacy', description: 'Data protection settings' },
      { label: 'Support', href: '/support', description: 'Get help and assistance' },
    ]
  }
];

interface MainNavigationProps {
  variant?: 'header' | 'mobile';
  className?: string;
}

export default function MainNavigation({ variant = 'header', className }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const getActiveSection = () => {
    return navigationSections.find(section => 
      section.subPages.some(subPage => isActivePath(subPage.href)) || isActivePath(section.href)
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setActiveDropdown(null);
  };

  if (variant === 'mobile') {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMobileMenu}
          className={cn("md:hidden", className)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 md:hidden"
              onClick={toggleMobileMenu}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" onClick={toggleMobileMenu} className="flex items-center space-x-2 min-w-0 flex-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 truncate">HealthTriage AI</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={toggleMobileMenu} className="flex-shrink-0">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation Sections */}
                <div className="space-y-2">
                  {navigationSections.map((section) => (
                    <div key={section.id} className="space-y-2">
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === section.id ? null : section.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors",
                          getActiveSection()?.id === section.id ? section.bgColor : 'hover:bg-gray-100'
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <span className={section.color}>{section.icon}</span>
                          <span className="font-medium text-gray-900">{section.label}</span>
                        </div>
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-500 transition-transform",
                            activeDropdown === section.id && "rotate-180"
                          )} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-6 space-y-1 border-l-2 border-gray-100 pl-4">
                              {section.subPages.map((subPage) => (
                                <Link
                                  key={subPage.href}
                                  href={subPage.href}
                                  onClick={toggleMobileMenu}
                                  className={cn(
                                    "block px-3 py-2 rounded-md text-sm transition-colors",
                                    isActivePath(subPage.href)
                                      ? "bg-blue-50 text-blue-700 font-medium"
                                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                  )}
                                >
                                  <div className="font-medium">{subPage.label}</div>
                                  <div className="text-xs text-gray-500">{subPage.description}</div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm text-gray-500 flex-shrink-0">Language</span>
                    <LanguageSelector />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <nav className={cn("hidden md:flex items-center space-x-1", className)}>
      {navigationSections.map((section) => (
        <div
          key={section.id}
          className="relative group"
          onMouseEnter={() => setActiveDropdown(section.id)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <Link href={section.href}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                getActiveSection()?.id === section.id 
                  ? `${section.bgColor} ${section.color}` 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {section.icon}
              <span className="font-medium">{section.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </Button>
          </Link>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {activeDropdown === section.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50"
              >
                <div className="space-y-1">
                  {section.subPages.map((subPage) => (
                    <Link
                      key={subPage.href}
                      href={subPage.href}
                      className={cn(
                        "block px-3 py-3 rounded-lg transition-colors",
                        isActivePath(subPage.href)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      <div className="font-medium text-sm">{subPage.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{subPage.description}</div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </nav>
  );
}