/**
 * Professional Healthcare Footer
 * HIPAA compliant footer with healthcare-specific links and compliance information
 */

"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Shield, 
  Heart, 
  Phone, 
  Mail, 
  MapPin,
  Globe,
  FileText,
  Lock,
  Award,
  Users,
  Clock,
  ExternalLink
} from 'lucide-react';
import DevelopmentInfo from './DevelopmentInfo';

const HealthcareFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Healthcare Services',
      links: [
        { label: 'AI Health Triage', href: '/triage', icon: <Stethoscope className="w-4 h-4" /> },
        { label: 'Telehealth Consultations', href: '/telehealth', icon: <Heart className="w-4 h-4" /> },
        { label: 'Emergency Detection', href: '/emergency', icon: <Shield className="w-4 h-4" /> },
        { label: 'Health Analytics', href: '/analytics', icon: <Globe className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Support & Resources',
      links: [
        { label: 'Help Center', href: '/support', icon: <Users className="w-4 h-4" /> },
        { label: 'Medical Guidelines', href: '/guidelines', icon: <FileText className="w-4 h-4" /> },
        { label: 'Emergency Contacts', href: '/emergency-contacts', icon: <Phone className="w-4 h-4" /> },
        { label: 'Healthcare Providers', href: '/providers', icon: <Award className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Compliance & Privacy',
      links: [
        { label: 'Privacy Policy', href: '/privacy', icon: <Lock className="w-4 h-4" /> },
        { label: 'HIPAA Compliance', href: '/hipaa', icon: <Shield className="w-4 h-4" /> },
        { label: 'Terms of Service', href: '/terms', icon: <FileText className="w-4 h-4" /> },
        { label: 'Accessibility (WCAG)', href: '/accessibility', icon: <Users className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Contact & Emergency',
      links: [
        { label: 'Contact Support', href: '/contact', icon: <Mail className="w-4 h-4" /> },
        { label: 'Emergency Services', href: 'tel:911', icon: <Phone className="w-4 h-4" />, external: true },
        { label: 'Find Nearby Hospitals', href: '/hospitals', icon: <MapPin className="w-4 h-4" /> },
        { label: '24/7 Health Hotline', href: 'tel:1-800-HEALTH', icon: <Clock className="w-4 h-4" />, external: true },
      ]
    }
  ];

  const complianceInfo = [
    { icon: <Shield className="w-5 h-5" />, text: 'HIPAA Compliant', color: 'text-green-600' },
    { icon: <Award className="w-5 h-5" />, text: 'WCAG AAA Accessible', color: 'text-blue-600' },
    { icon: <Lock className="w-5 h-5" />, text: 'SOC 2 Certified', color: 'text-purple-600' },
    { icon: <Globe className="w-5 h-5" />, text: 'Global Healthcare Standards', color: 'text-orange-600' },
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200/50">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                        target={link.href.startsWith('tel:') ? undefined : '_blank'}
                        rel={link.href.startsWith('tel:') ? undefined : 'noopener noreferrer'}
                      >
                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          {link.icon}
                        </span>
                        {link.label}
                        {!link.href.startsWith('tel:') && (
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
                      >
                        <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                          {link.icon}
                        </span>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Compliance Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-8 mb-8"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Healthcare Compliance & Standards</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {complianceInfo.map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-sm"
                >
                  <span className={item.color}>{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Emergency Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/50 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-red-500 rounded-xl shadow-lg flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-red-900 mb-2">Important Medical Disclaimer</h4>
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>This platform provides informational support only and is NOT a substitute for professional medical advice.</strong> 
                Always consult qualified healthcare professionals for medical decisions. In case of medical emergencies, 
                <strong className="text-red-900"> call 911 </strong>or your local emergency services immediately.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">HealthTriage AI</h3>
                <p className="text-xs text-gray-500">Professional Healthcare Technology Platform</p>
              </div>
            </div>

            {/* Copyright and Build Info */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 font-medium mb-1">
                © {currentYear} HealthTriage AI. All rights reserved.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-4 text-xs text-gray-500">
                <span>Enterprise Healthcare Platform</span>
                <span>•</span>
                <span>Version 2.0.0</span>
                <span>•</span>
                <span>Built with ❤️ for Healthcare</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Technical Info (Development Only) */}
        <DevelopmentInfo />
      </div>
    </footer>
  );
};

export default HealthcareFooter;