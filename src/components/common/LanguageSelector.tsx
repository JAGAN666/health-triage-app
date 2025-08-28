"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es' as Language, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' }
];

interface LanguageSelectorProps {
  variant?: 'button' | 'inline';
}

export default function LanguageSelector({ variant = 'button' }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'inline') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Globe className="w-4 h-4" />
          <span>Language / Idioma / भाषा</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <motion.div
              key={lang.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={language === lang.code ? "default" : "outline"}
                className={`w-full justify-start gap-3 p-4 h-auto ${
                  language === lang.code 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'hover:bg-blue-50 hover:border-blue-200'
                }`}
                onClick={() => setLanguage(lang.code)}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <div className="font-semibold">{lang.name}</div>
                  <div className="text-xs opacity-80">{lang.nativeName}</div>
                </div>
                {language === lang.code && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/50 hover:bg-white/70 backdrop-blur-sm rounded-full border-gray-200/50"
      >
        <Globe className="w-4 h-4 mr-2" />
        {languages.find(l => l.code === language)?.flag}
        <span className="ml-1 font-medium">
          {languages.find(l => l.code === language)?.code.toUpperCase()}
        </span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Language Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full mt-2 right-0 z-50"
            >
              <Card className="bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <Globe className="w-4 h-4" />
                        <span>Select Language</span>
                      </div>
                    </div>
                    <div className="py-2">
                      {languages.map((lang) => (
                        <motion.button
                          key={lang.code}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-blue-50 transition-colors ${
                            language === lang.code ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsOpen(false);
                          }}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{lang.name}</div>
                            <div className="text-sm text-gray-600">{lang.nativeName}</div>
                          </div>
                          {language === lang.code && (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                                Active
                              </Badge>
                              <Check className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        AI responses will be in selected language
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}