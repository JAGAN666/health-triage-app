"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import MainNavigation from './MainNavigation';
import LanguageSelector from './LanguageSelector';
import UserAuth from './UserAuth';
import { cn } from '@/lib/utils';

interface ModernHeaderProps {
  className?: string;
  showBackground?: boolean;
}

export default function ModernHeader({ className, showBackground = true }: ModernHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        showBackground && "bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Logo and Brand - Fixed width section */}
          <div className="flex items-center space-x-3 group min-w-0 flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                {/* Professional indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </motion.div>
              
              <div className="hidden sm:block min-w-0">
                <div className="flex items-baseline space-x-2">
                  <span className="text-xl font-bold text-gray-900 leading-tight">HealthTriage AI</span>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 hidden lg:inline-flex shrink-0"
                  >
                    Professional
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 font-medium leading-tight">Enterprise Healthcare AI</div>
              </div>
            </Link>
          </div>

          {/* Main Navigation - Centered flex section */}
          <div className="flex-1 flex justify-center px-4">
            <MainNavigation />
          </div>

          {/* Right Side Actions - Fixed width section */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Language Selector - Hidden on mobile */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-gray-100 hidden sm:flex"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Authentication */}
            <div className="hidden sm:block">
              <UserAuth />
            </div>

            {/* Mobile Navigation */}
            <MainNavigation variant="mobile" />
          </div>
        </div>
      </div>

      {/* Professional Status Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs">
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="whitespace-nowrap">HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="whitespace-nowrap">WCAG AAA Accessible</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0 hidden sm:flex">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="whitespace-nowrap">AI-Powered Healthcare</span>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}