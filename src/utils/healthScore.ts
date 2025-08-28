/**
 * Dynamic Health Score Calculator
 * Calculates health scores based on actual user data from various sources
 */

export interface HealthData {
  // Vital Signs Data
  heartRate?: number;
  breathingRate?: number;
  stressLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  heartRateVariability?: number;
  
  // Triage Data
  recentSymptoms?: Array<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    timestamp: Date;
  }>;
  
  // Visual Analysis Data
  recentAnalyses?: Array<{
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    confidence: number;
    timestamp: Date;
  }>;
  
  // Mental Health Data
  moodScores?: Array<{
    score: number; // 1-10 scale
    timestamp: Date;
  }>;
  
  // Emergency History
  emergencyAlerts?: Array<{
    riskLevel: 'HIGH' | 'CRITICAL';
    timestamp: Date;
  }>;
}

export interface HealthScoreResult {
  overallScore: number; // 0-100
  confidence: 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH';
  factors: {
    vitalsScore: number;
    symptomsScore: number;
    visualScore: number;
    mentalHealthScore: number;
    recentActivityScore: number;
  };
  recommendations: string[];
  dataAvailability: {
    hasVitalSigns: boolean;
    hasRecentSymptoms: boolean;
    hasVisualAnalyses: boolean;
    hasMentalHealth: boolean;
    dataPoints: number;
  };
}

export class HealthScoreCalculator {
  
  calculateHealthScore(data: HealthData): HealthScoreResult {
    const factors = {
      vitalsScore: this.calculateVitalsScore(data),
      symptomsScore: this.calculateSymptomsScore(data),
      visualScore: this.calculateVisualScore(data),
      mentalHealthScore: this.calculateMentalHealthScore(data),
      recentActivityScore: this.calculateRecentActivityScore(data)
    };
    
    const dataAvailability = this.assessDataAvailability(data);
    const overallScore = this.calculateOverallScore(factors, dataAvailability);
    const confidence = this.calculateConfidence(dataAvailability);
    const recommendations = this.generateRecommendations(factors, dataAvailability);
    
    return {
      overallScore: Math.round(overallScore),
      confidence,
      factors,
      recommendations,
      dataAvailability
    };
  }
  
  private calculateVitalsScore(data: HealthData): number {
    let score = 80; // Default neutral score
    let adjustments = 0;
    
    // Heart Rate Assessment (60-100 BPM is normal)
    if (data.heartRate) {
      if (data.heartRate >= 60 && data.heartRate <= 100) {
        score += 10;
      } else if (data.heartRate >= 50 && data.heartRate <= 110) {
        score += 5; // Borderline normal
      } else {
        score -= 15; // Outside normal range
      }
      adjustments++;
    }
    
    // Breathing Rate Assessment (12-20 per minute is normal)
    if (data.breathingRate) {
      if (data.breathingRate >= 12 && data.breathingRate <= 20) {
        score += 8;
      } else if (data.breathingRate >= 10 && data.breathingRate <= 24) {
        score += 3; // Borderline normal
      } else {
        score -= 12; // Outside normal range
      }
      adjustments++;
    }
    
    // Stress Level Assessment
    if (data.stressLevel) {
      switch (data.stressLevel) {
        case 'LOW':
          score += 10;
          break;
        case 'MEDIUM':
          score += 0; // Neutral
          break;
        case 'HIGH':
          score -= 10;
          break;
      }
      adjustments++;
    }
    
    // HRV Assessment (if available)
    if (data.heartRateVariability) {
      if (data.heartRateVariability > 30) {
        score += 5; // Good HRV
      } else if (data.heartRateVariability < 20) {
        score -= 5; // Poor HRV
      }
      adjustments++;
    }
    
    return Math.max(0, Math.min(100, score));
  }
  
  private calculateSymptomsScore(data: HealthData): number {
    if (!data.recentSymptoms || data.recentSymptoms.length === 0) {
      return 80; // Default when no symptoms reported
    }
    
    let score = 90; // Start high, reduce for symptoms
    const recentSymptoms = data.recentSymptoms.filter(
      s => this.isRecent(s.timestamp, 7) // Last 7 days
    );
    
    for (const symptom of recentSymptoms) {
      const daysSince = this.daysSince(symptom.timestamp);
      const recencyFactor = Math.max(0.3, 1 - (daysSince / 7)); // More recent = more impact
      
      switch (symptom.riskLevel) {
        case 'HIGH':
          score -= 25 * recencyFactor;
          break;
        case 'MEDIUM':
          score -= 15 * recencyFactor;
          break;
        case 'LOW':
          score -= 5 * recencyFactor;
          break;
      }
    }
    
    return Math.max(20, Math.min(100, score));
  }
  
  private calculateVisualScore(data: HealthData): number {
    if (!data.recentAnalyses || data.recentAnalyses.length === 0) {
      return 80; // Default when no visual analyses
    }
    
    let score = 85;
    const recentAnalyses = data.recentAnalyses.filter(
      a => this.isRecent(a.timestamp, 14) // Last 14 days
    );
    
    for (const analysis of recentAnalyses) {
      const confidenceWeight = analysis.confidence; // Weight by AI confidence
      const daysSince = this.daysSince(analysis.timestamp);
      const recencyFactor = Math.max(0.2, 1 - (daysSince / 14));
      
      switch (analysis.riskLevel) {
        case 'HIGH':
          score -= 20 * confidenceWeight * recencyFactor;
          break;
        case 'MEDIUM':
          score -= 10 * confidenceWeight * recencyFactor;
          break;
        case 'LOW':
          score += 5 * confidenceWeight * recencyFactor; // Good news
          break;
      }
    }
    
    return Math.max(30, Math.min(100, score));
  }
  
  private calculateMentalHealthScore(data: HealthData): number {
    if (!data.moodScores || data.moodScores.length === 0) {
      return 75; // Default neutral when no mood data
    }
    
    const recentMoods = data.moodScores.filter(
      m => this.isRecent(m.timestamp, 30) // Last 30 days
    );
    
    if (recentMoods.length === 0) {
      return 75;
    }
    
    // Calculate weighted average (more recent scores have higher weight)
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    for (const mood of recentMoods) {
      const daysSince = this.daysSince(mood.timestamp);
      const weight = Math.max(0.1, 1 - (daysSince / 30)); // Decay over time
      
      totalWeightedScore += mood.score * weight * 10; // Convert 1-10 to 10-100 scale
      totalWeight += weight;
    }
    
    return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 75;
  }
  
  private calculateRecentActivityScore(data: HealthData): number {
    let score = 70; // Default baseline
    
    const now = new Date();
    const hasRecentVitals = data.heartRate !== undefined;
    const hasRecentSymptoms = data.recentSymptoms?.some(s => this.isRecent(s.timestamp, 7));
    const hasRecentAnalyses = data.recentAnalyses?.some(a => this.isRecent(a.timestamp, 7));
    const hasRecentMood = data.moodScores?.some(m => this.isRecent(m.timestamp, 7));
    const hasEmergencies = data.emergencyAlerts?.some(e => this.isRecent(e.timestamp, 30));
    
    // Bonus for active health monitoring
    if (hasRecentVitals) score += 10;
    if (hasRecentAnalyses) score += 8;
    if (hasRecentMood) score += 7;
    if (hasRecentSymptoms) score += 5; // Less bonus since symptoms might indicate problems
    
    // Penalty for emergency situations
    if (hasEmergencies) {
      const recentEmergencies = data.emergencyAlerts!.filter(e => this.isRecent(e.timestamp, 30));
      score -= recentEmergencies.length * 15;
    }
    
    return Math.max(20, Math.min(100, score));
  }
  
  private calculateOverallScore(factors: any, dataAvailability: any): number {
    // Weight factors based on data availability and reliability
    const weights = {
      vitalsScore: dataAvailability.hasVitalSigns ? 0.25 : 0,
      symptomsScore: dataAvailability.hasRecentSymptoms ? 0.25 : 0.15, // Always include with min weight
      visualScore: dataAvailability.hasVisualAnalyses ? 0.20 : 0,
      mentalHealthScore: dataAvailability.hasMentalHealth ? 0.15 : 0.10,
      recentActivityScore: 0.15 // Always include
    };
    
    // Normalize weights to sum to 1
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    Object.keys(weights).forEach(key => {
      weights[key] /= totalWeight;
    });
    
    // Calculate weighted average
    let weightedSum = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      weightedSum += factors[key] * weight;
    });
    
    return Math.max(0, Math.min(100, weightedSum));
  }
  
  private calculateConfidence(dataAvailability: any): 'VERY_LOW' | 'LOW' | 'MODERATE' | 'HIGH' {
    const { dataPoints, hasVitalSigns, hasRecentSymptoms, hasVisualAnalyses, hasMentalHealth } = dataAvailability;
    
    if (dataPoints >= 8 && hasVitalSigns && (hasRecentSymptoms || hasVisualAnalyses)) {
      return 'HIGH';
    } else if (dataPoints >= 5 && (hasVitalSigns || hasRecentSymptoms)) {
      return 'MODERATE';
    } else if (dataPoints >= 3) {
      return 'LOW';
    } else {
      return 'VERY_LOW';
    }
  }
  
  private generateRecommendations(factors: any, dataAvailability: any): string[] {
    const recommendations: string[] = [];
    
    // Data collection recommendations
    if (!dataAvailability.hasVitalSigns) {
      recommendations.push("Take vital signs measurements to improve health score accuracy");
    }
    
    if (!dataAvailability.hasVisualAnalyses) {
      recommendations.push("Use visual analysis for any skin or visible health concerns");
    }
    
    if (!dataAvailability.hasMentalHealth) {
      recommendations.push("Track your mood to get a more complete health picture");
    }
    
    // Score-based recommendations
    if (factors.vitalsScore < 70) {
      recommendations.push("Consider consulting a healthcare provider about your vital signs");
    }
    
    if (factors.symptomsScore < 60) {
      recommendations.push("Recent symptoms indicate need for medical attention");
    }
    
    if (factors.mentalHealthScore < 60) {
      recommendations.push("Focus on mental health and stress management");
    }
    
    if (factors.recentActivityScore < 50) {
      recommendations.push("Recent health events suggest need for professional care");
    }
    
    // General recommendations
    if (dataAvailability.dataPoints < 5) {
      recommendations.push("Use more health monitoring features for better insights");
    }
    
    return recommendations.length > 0 ? recommendations : [
      "Continue regular health monitoring",
      "Maintain healthy lifestyle habits",
      "Consult healthcare providers for routine check-ups"
    ];
  }
  
  private assessDataAvailability(data: HealthData) {
    let dataPoints = 0;
    
    const hasVitalSigns = !!(data.heartRate || data.breathingRate || data.stressLevel);
    const hasRecentSymptoms = !!(data.recentSymptoms && data.recentSymptoms.length > 0);
    const hasVisualAnalyses = !!(data.recentAnalyses && data.recentAnalyses.length > 0);
    const hasMentalHealth = !!(data.moodScores && data.moodScores.length > 0);
    
    if (data.heartRate) dataPoints++;
    if (data.breathingRate) dataPoints++;
    if (data.stressLevel) dataPoints++;
    if (data.heartRateVariability) dataPoints++;
    if (hasRecentSymptoms) dataPoints += Math.min(3, data.recentSymptoms!.length);
    if (hasVisualAnalyses) dataPoints += Math.min(3, data.recentAnalyses!.length);
    if (hasMentalHealth) dataPoints += Math.min(2, data.moodScores!.length);
    
    return {
      hasVitalSigns,
      hasRecentSymptoms,
      hasVisualAnalyses,
      hasMentalHealth,
      dataPoints
    };
  }
  
  private isRecent(timestamp: Date, days: number): boolean {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  }
  
  private daysSince(timestamp: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Export singleton instance
export const healthScoreCalculator = new HealthScoreCalculator();