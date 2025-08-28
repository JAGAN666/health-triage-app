/**
 * Service Worker Manager for Healthcare Platform
 * Provides offline capabilities and performance optimization for healthcare apps
 */

"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  X,
  Smartphone
} from 'lucide-react';

interface ServiceWorkerManagerProps {
  enableOfflineSupport?: boolean;
  enableUpdatePrompts?: boolean;
  enableInstallPrompt?: boolean;
}

export default function ServiceWorkerManager({
  enableOfflineSupport = true,
  enableUpdatePrompts = true,
  enableInstallPrompt = true
}: ServiceWorkerManagerProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotice(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (enableOfflineSupport) {
        setShowOfflineNotice(true);
      }
    };

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableOfflineSupport]);

  // Service Worker registration and update detection
  useEffect(() => {
    if ('serviceWorker' in navigator && enableOfflineSupport) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Healthcare SW registered:', registration);
          
          // Check for updates
          if (enableUpdatePrompts) {
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          }
        })
        .catch((error) => {
          console.warn('Healthcare SW registration failed:', error);
        });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
          setUpdateAvailable(true);
        }
      });
    }
  }, [enableOfflineSupport, enableUpdatePrompts]);

  // PWA install prompt handling
  useEffect(() => {
    if (!enableInstallPrompt) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      
      // Show install banner after a delay if not already installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallBanner(true);
        }
      }, 10000); // Show after 10 seconds
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowInstallBanner(false);
    };

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [enableInstallPrompt, isInstalled]);

  const handleUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration?.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
        }
      });
    }
  };

  const handleInstall = async () => {
    if (installPrompt) {
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
        setShowInstallBanner(false);
      }
    }
  };

  return (
    <>
      {/* Offline Notice */}
      <AnimatePresence>
        {showOfflineNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-orange-50 border-orange-200 shadow-lg p-4">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="font-semibold text-orange-900">You're offline</h4>
                  <p className="text-sm text-orange-800">
                    Healthcare features available offline. Emergency services: 911
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOfflineNotice(false)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Available Banner */}
      <AnimatePresence>
        {updateAvailable && enableUpdatePrompts && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-blue-50 border-blue-200 shadow-lg p-4">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Update Available</h4>
                  <p className="text-sm text-blue-800">
                    New healthcare features and improvements ready
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Update
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUpdateAvailable(false)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install App Banner */}
      <AnimatePresence>
        {showInstallBanner && installPrompt && enableInstallPrompt && !isInstalled && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-xl p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 mb-1">
                    Install HealthTriage AI
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Access healthcare features instantly, even offline. Quick emergency access and secure health data.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleInstall}
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Install App
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowInstallBanner(false)}
                      className="text-gray-600 hover:text-gray-700"
                    >
                      Maybe Later
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInstallBanner(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`p-2 rounded-full shadow-lg ${
            isOnline 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
          title={isOnline ? 'Online' : 'Offline - Emergency: 911'}
        >
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        </motion.div>
      </div>

      {/* Installed Success Message */}
      <AnimatePresence>
        {isInstalled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-green-50 border-green-200 shadow-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">App Installed!</h4>
                  <p className="text-sm text-green-800">
                    HealthTriage AI is now available on your device
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}