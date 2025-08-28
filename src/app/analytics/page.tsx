"use client";

import HealthDashboard from "@/components/analytics/HealthDashboard";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <HealthDashboard />
      </div>
    </div>
  );
}