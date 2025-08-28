/**
 * Real Photoplethysmography (PPG) Implementation for Smartphone Heart Rate Detection
 * Based on scientific research and actual PPG signal processing algorithms
 */

export interface PPGSample {
  timestamp: number;
  redValue: number;
  greenValue: number;
  blueValue: number;
  averageIntensity: number;
}

export interface HeartRateResult {
  heartRate: number | null;
  confidence: number; // 0-1 scale
  quality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  signalStrength: number;
  noiseLevel: number;
  recommendations?: string[];
}

export class PPGProcessor {
  private samples: PPGSample[] = [];
  private readonly sampleRate: number = 30; // 30 FPS
  private readonly windowSize: number = 150; // 5 seconds at 30 FPS
  private readonly minSamples: number = 90; // 3 seconds minimum
  
  // Heart rate range constraints
  private readonly minHeartRate: number = 50;
  private readonly maxHeartRate: number = 180;

  /**
   * Add a new PPG sample from camera frame analysis
   */
  addSample(imageData: ImageData): void {
    const timestamp = performance.now();
    
    // Calculate average RGB values from the center region of the image
    // This simulates placing finger over camera and flash
    const centerRegion = this.extractCenterRegion(imageData);
    const rgbAverages = this.calculateRGBAverages(centerRegion);
    
    const sample: PPGSample = {
      timestamp,
      redValue: rgbAverages.red,
      greenValue: rgbAverages.green,
      blueValue: rgbAverages.blue,
      averageIntensity: (rgbAverages.red + rgbAverages.green + rgbAverages.blue) / 3
    };
    
    this.samples.push(sample);
    
    // Keep only recent samples within the window
    const cutoffTime = timestamp - (this.windowSize * 1000 / this.sampleRate);
    this.samples = this.samples.filter(s => s.timestamp >= cutoffTime);
  }

  /**
   * Calculate heart rate from accumulated PPG samples
   */
  calculateHeartRate(): HeartRateResult {
    if (this.samples.length < this.minSamples) {
      return {
        heartRate: null,
        confidence: 0,
        quality: 'POOR',
        signalStrength: 0,
        noiseLevel: 1,
        recommendations: ['Need at least 3 seconds of stable finger placement']
      };
    }

    try {
      // Use green channel for PPG analysis (best for heart rate detection)
      const greenSignal = this.samples.map(s => s.greenValue);
      
      // Apply signal processing
      const filteredSignal = this.bandpassFilter(greenSignal);
      const smoothedSignal = this.movingAverage(filteredSignal, 3);
      
      // Calculate signal quality metrics
      const signalStrength = this.calculateSignalStrength(smoothedSignal);
      const noiseLevel = this.calculateNoiseLevel(greenSignal, smoothedSignal);
      const quality = this.assessSignalQuality(signalStrength, noiseLevel);
      
      // Find peaks for heart rate calculation
      const peaks = this.findPeaks(smoothedSignal);
      const heartRate = this.calculateHeartRateFromPeaks(peaks);
      
      // Calculate confidence based on signal quality and heart rate validity
      const confidence = this.calculateConfidence(heartRate, signalStrength, noiseLevel, peaks.length);
      
      const recommendations = this.generateRecommendations(quality, signalStrength, noiseLevel);

      return {
        heartRate: this.isValidHeartRate(heartRate) ? Math.round(heartRate) : null,
        confidence,
        quality,
        signalStrength,
        noiseLevel,
        recommendations: recommendations.length > 0 ? recommendations : undefined
      };

    } catch (error) {
      console.error('PPG processing error:', error);
      return {
        heartRate: null,
        confidence: 0,
        quality: 'POOR',
        signalStrength: 0,
        noiseLevel: 1,
        recommendations: ['Signal processing error - please try again']
      };
    }
  }

  /**
   * Extract center region from image data (where finger should be placed)
   */
  private extractCenterRegion(imageData: ImageData): ImageData {
    const { width, height, data } = imageData;
    
    // Define center region (middle 30% of image)
    const regionSize = 0.3;
    const centerX = width / 2;
    const centerY = height / 2;
    const regionWidth = Math.floor(width * regionSize);
    const regionHeight = Math.floor(height * regionSize);
    
    const startX = Math.floor(centerX - regionWidth / 2);
    const startY = Math.floor(centerY - regionHeight / 2);
    
    const regionData = new Uint8ClampedArray(regionWidth * regionHeight * 4);
    
    for (let y = 0; y < regionHeight; y++) {
      for (let x = 0; x < regionWidth; x++) {
        const srcIndex = ((startY + y) * width + (startX + x)) * 4;
        const dstIndex = (y * regionWidth + x) * 4;
        
        regionData[dstIndex] = data[srcIndex];     // Red
        regionData[dstIndex + 1] = data[srcIndex + 1]; // Green
        regionData[dstIndex + 2] = data[srcIndex + 2]; // Blue
        regionData[dstIndex + 3] = data[srcIndex + 3]; // Alpha
      }
    }
    
    return new ImageData(regionData, regionWidth, regionHeight);
  }

  /**
   * Calculate average RGB values from image data
   */
  private calculateRGBAverages(imageData: ImageData): { red: number; green: number; blue: number } {
    const { data } = imageData;
    let redSum = 0, greenSum = 0, blueSum = 0;
    const pixelCount = data.length / 4;
    
    for (let i = 0; i < data.length; i += 4) {
      redSum += data[i];
      greenSum += data[i + 1];
      blueSum += data[i + 2];
    }
    
    return {
      red: redSum / pixelCount,
      green: greenSum / pixelCount,
      blue: blueSum / pixelCount
    };
  }

  /**
   * Apply bandpass filter to remove noise and baseline drift
   */
  private bandpassFilter(signal: number[]): number[] {
    // Simple high-pass filter to remove DC component and low-frequency drift
    const highPassed = this.highPassFilter(signal, 0.5); // 0.5 Hz cutoff
    
    // Low-pass filter to remove high-frequency noise
    const filtered = this.lowPassFilter(highPassed, 4.0); // 4.0 Hz cutoff
    
    return filtered;
  }

  /**
   * Simple high-pass filter implementation
   */
  private highPassFilter(signal: number[], cutoffHz: number): number[] {
    const alpha = cutoffHz / (cutoffHz + this.sampleRate / (2 * Math.PI));
    const filtered: number[] = [signal[0]];
    
    for (let i = 1; i < signal.length; i++) {
      filtered[i] = alpha * (filtered[i - 1] + signal[i] - signal[i - 1]);
    }
    
    return filtered;
  }

  /**
   * Simple low-pass filter implementation
   */
  private lowPassFilter(signal: number[], cutoffHz: number): number[] {
    const alpha = (2 * Math.PI * cutoffHz) / (this.sampleRate + 2 * Math.PI * cutoffHz);
    const filtered: number[] = [signal[0]];
    
    for (let i = 1; i < signal.length; i++) {
      filtered[i] = alpha * signal[i] + (1 - alpha) * filtered[i - 1];
    }
    
    return filtered;
  }

  /**
   * Moving average smoothing
   */
  private movingAverage(signal: number[], windowSize: number): number[] {
    const smoothed: number[] = [];
    
    for (let i = 0; i < signal.length; i++) {
      const start = Math.max(0, i - Math.floor(windowSize / 2));
      const end = Math.min(signal.length, i + Math.ceil(windowSize / 2));
      
      let sum = 0;
      for (let j = start; j < end; j++) {
        sum += signal[j];
      }
      
      smoothed[i] = sum / (end - start);
    }
    
    return smoothed;
  }

  /**
   * Find peaks in the filtered signal
   */
  private findPeaks(signal: number[]): number[] {
    const peaks: number[] = [];
    const minPeakDistance = Math.floor(this.sampleRate * 0.4); // Minimum 0.4 seconds between peaks
    const threshold = this.calculateDynamicThreshold(signal);
    
    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i - 1] && 
          signal[i] > signal[i + 1] && 
          signal[i] > threshold) {
        
        // Check minimum distance from previous peak
        if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minPeakDistance) {
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  }

  /**
   * Calculate dynamic threshold for peak detection
   */
  private calculateDynamicThreshold(signal: number[]): number {
    const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
    const variance = signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / signal.length;
    const stdDev = Math.sqrt(variance);
    
    return mean + 0.5 * stdDev; // Threshold at mean + 0.5 standard deviations
  }

  /**
   * Calculate heart rate from detected peaks
   */
  private calculateHeartRateFromPeaks(peaks: number[]): number {
    if (peaks.length < 2) return 0;
    
    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      const intervalSamples = peaks[i] - peaks[i - 1];
      const intervalSeconds = intervalSamples / this.sampleRate;
      intervals.push(60 / intervalSeconds); // Convert to BPM
    }
    
    // Return median heart rate to reduce noise impact
    intervals.sort((a, b) => a - b);
    const medianIndex = Math.floor(intervals.length / 2);
    return intervals.length % 2 === 0 
      ? (intervals[medianIndex - 1] + intervals[medianIndex]) / 2
      : intervals[medianIndex];
  }

  /**
   * Check if heart rate is within valid physiological range
   */
  private isValidHeartRate(heartRate: number): boolean {
    return heartRate >= this.minHeartRate && heartRate <= this.maxHeartRate;
  }

  /**
   * Calculate signal strength metric
   */
  private calculateSignalStrength(signal: number[]): number {
    const mean = signal.reduce((sum, val) => sum + val, 0) / signal.length;
    const variance = signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / signal.length;
    const stdDev = Math.sqrt(variance);
    
    // Normalize signal strength (higher standard deviation indicates stronger signal variation)
    return Math.min(1.0, stdDev / 10.0);
  }

  /**
   * Calculate noise level metric
   */
  private calculateNoiseLevel(originalSignal: number[], filteredSignal: number[]): number {
    let noiseSum = 0;
    for (let i = 0; i < originalSignal.length; i++) {
      noiseSum += Math.abs(originalSignal[i] - filteredSignal[i]);
    }
    
    const averageNoise = noiseSum / originalSignal.length;
    return Math.min(1.0, averageNoise / 20.0); // Normalize noise level
  }

  /**
   * Assess overall signal quality
   */
  private assessSignalQuality(signalStrength: number, noiseLevel: number): 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT' {
    const qualityScore = signalStrength * (1 - noiseLevel);
    
    if (qualityScore >= 0.8) return 'EXCELLENT';
    if (qualityScore >= 0.6) return 'GOOD';
    if (qualityScore >= 0.4) return 'FAIR';
    return 'POOR';
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(heartRate: number | null, signalStrength: number, noiseLevel: number, peakCount: number): number {
    if (!heartRate || !this.isValidHeartRate(heartRate)) return 0;
    
    // Base confidence from signal quality
    let confidence = signalStrength * (1 - noiseLevel);
    
    // Adjust based on number of peaks detected
    const expectedPeaks = (this.samples.length / this.sampleRate) * (heartRate / 60);
    const peakCountFactor = Math.min(1.0, peakCount / Math.max(1, expectedPeaks));
    confidence *= peakCountFactor;
    
    // Boost confidence for heart rates in normal range
    if (heartRate >= 60 && heartRate <= 100) {
      confidence *= 1.1;
    }
    
    return Math.min(1.0, Math.max(0.0, confidence));
  }

  /**
   * Generate recommendations based on signal quality
   */
  private generateRecommendations(quality: string, signalStrength: number, noiseLevel: number): string[] {
    const recommendations: string[] = [];
    
    if (quality === 'POOR') {
      recommendations.push('Place finger completely over camera and flash');
      recommendations.push('Hold phone steady and avoid movement');
      recommendations.push('Ensure adequate lighting');
    }
    
    if (signalStrength < 0.3) {
      recommendations.push('Press finger more firmly against camera');
    }
    
    if (noiseLevel > 0.6) {
      recommendations.push('Try to minimize finger movement');
      recommendations.push('Clean camera lens if needed');
    }
    
    if (quality === 'FAIR') {
      recommendations.push('Continue measuring for better accuracy');
    }
    
    return recommendations;
  }

  /**
   * Clear all accumulated samples
   */
  clearSamples(): void {
    this.samples = [];
  }

  /**
   * Get current sample count
   */
  getSampleCount(): number {
    return this.samples.length;
  }
}