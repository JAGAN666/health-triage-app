"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthData, HealthScoreResult, healthScoreCalculator } from '@/utils/healthScore';

interface HealthDataContextType {
  healthData: HealthData;
  healthScore: HealthScoreResult | null;
  updateHealthData: (updates: Partial<HealthData>) => void;
  addSymptomRecord: (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH') => void;
  addVisualAnalysis: (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', confidence: number) => void;
  addMoodScore: (score: number) => void;
  addVitalSigns: (heartRate?: number, breathingRate?: number, stressLevel?: 'LOW' | 'MEDIUM' | 'HIGH', hrv?: number) => void;
  addEmergencyAlert: (riskLevel: 'HIGH' | 'CRITICAL') => void;
  recalculateHealthScore: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

interface HealthDataProviderProps {
  children: ReactNode;
}

export function HealthDataProvider({ children }: HealthDataProviderProps) {
  const [healthData, setHealthData] = useState<HealthData>({
    // Initialize with empty arrays
    recentSymptoms: [],
    recentAnalyses: [],
    moodScores: [],
    emergencyAlerts: []
  });
  
  const [healthScore, setHealthScore] = useState<HealthScoreResult | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('health-triage-data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Convert timestamp strings back to Date objects
        const processedData: HealthData = {
          ...parsed,
          recentSymptoms: parsed.recentSymptoms?.map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp)
          })) || [],
          recentAnalyses: parsed.recentAnalyses?.map((a: any) => ({
            ...a,
            timestamp: new Date(a.timestamp)
          })) || [],
          moodScores: parsed.moodScores?.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })) || [],
          emergencyAlerts: parsed.emergencyAlerts?.map((e: any) => ({
            ...e,
            timestamp: new Date(e.timestamp)
          })) || []
        };
        setHealthData(processedData);
      }
    } catch (error) {
      console.error('Error loading health data:', error);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('health-triage-data', JSON.stringify(healthData));
    } catch (error) {
      console.error('Error saving health data:', error);
    }
  }, [healthData]);

  // Recalculate health score whenever data changes
  useEffect(() => {
    recalculateHealthScore();
  }, [healthData]);

  const updateHealthData = (updates: Partial<HealthData>) => {
    setHealthData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const addSymptomRecord = (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH') => {
    setHealthData(prev => ({
      ...prev,
      recentSymptoms: [
        ...(prev.recentSymptoms || []),
        {
          riskLevel,
          timestamp: new Date()
        }
      ].slice(-10) // Keep only last 10 records
    }));
  };

  const addVisualAnalysis = (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', confidence: number) => {
    setHealthData(prev => ({
      ...prev,
      recentAnalyses: [
        ...(prev.recentAnalyses || []),
        {
          riskLevel,
          confidence,
          timestamp: new Date()
        }
      ].slice(-10) // Keep only last 10 records
    }));
  };

  const addMoodScore = (score: number) => {
    setHealthData(prev => ({
      ...prev,
      moodScores: [
        ...(prev.moodScores || []),
        {
          score,
          timestamp: new Date()
        }
      ].slice(-20) // Keep only last 20 mood records
    }));
  };

  const addVitalSigns = (
    heartRate?: number, 
    breathingRate?: number, 
    stressLevel?: 'LOW' | 'MEDIUM' | 'HIGH',
    hrv?: number
  ) => {
    const updates: Partial<HealthData> = {};
    
    if (heartRate !== undefined) updates.heartRate = heartRate;
    if (breathingRate !== undefined) updates.breathingRate = breathingRate;
    if (stressLevel !== undefined) updates.stressLevel = stressLevel;
    if (hrv !== undefined) updates.heartRateVariability = hrv;
    
    updateHealthData(updates);
  };

  const addEmergencyAlert = (riskLevel: 'HIGH' | 'CRITICAL') => {
    setHealthData(prev => ({
      ...prev,
      emergencyAlerts: [
        ...(prev.emergencyAlerts || []),
        {
          riskLevel,
          timestamp: new Date()
        }
      ].slice(-5) // Keep only last 5 emergency records
    }));
  };

  const recalculateHealthScore = () => {
    try {
      const calculatedScore = healthScoreCalculator.calculateHealthScore(healthData);
      setHealthScore(calculatedScore);
    } catch (error) {
      console.error('Error calculating health score:', error);
      setHealthScore(null);
    }
  };

  return (
    <HealthDataContext.Provider value={{
      healthData,
      healthScore,
      updateHealthData,
      addSymptomRecord,
      addVisualAnalysis,
      addMoodScore,
      addVitalSigns,
      addEmergencyAlert,
      recalculateHealthScore
    }}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
}