"use client";

import { useEffect } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import HealthDashboard from "@/components/analytics/HealthDashboard";

export default function AnalyticsPage() {
  const { isAuthenticated, isDemo, enableDemoMode } = useDemoAuth();

  useEffect(() => {
    // Auto-enable demo mode if not authenticated
    if (!isAuthenticated) {
      enableDemoMode();
    }
  }, [isAuthenticated, enableDemoMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Mode Banner */}
      {isDemo && (
        <div className="bg-blue-100 border-b border-blue-200 px-4 py-2">
          <div className="max-w-6xl mx-auto">
            <p className="text-sm text-blue-800 text-center">
              🧪 <strong>Demo Mode Active</strong> - You're viewing analytics with demo data. AI insights are simulated.
            </p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8">
        <HealthDashboard />
      </div>
    </div>
  );
}