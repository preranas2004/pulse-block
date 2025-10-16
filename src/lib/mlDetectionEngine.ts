import { Matrix } from 'ml-matrix';
const mlKmeans = require('ml-kmeans');

// Feature interface based on the research paper
export interface BlockchainFeatures {
  blockchainSize: number;
  hashRate: number;
  difficulty: number;
  transactionVolume: number;
  medianConfirmationTime: number;
  avgBlockSize: number;
  uniqueTransactions: number;
}

export interface AnomalyResult {
  isAnomaly: boolean;
  attackType?: 'DDoS Attack' | 'Double Spending' | '51% Vulnerability' | 'Unknown';
  confidence: number;
  features: BlockchainFeatures;
  timestamp: Date;
  clusterLabel?: number;
}

// Normalize data between 0 and 1
function normalizeFeatures(features: BlockchainFeatures[]): number[][] {
  const featureArrays = features.map(f => [
    f.blockchainSize,
    f.hashRate,
    f.difficulty,
    f.transactionVolume,
    f.medianConfirmationTime,
    f.avgBlockSize,
    f.uniqueTransactions
  ]);

  const normalized: number[][] = [];
  const numFeatures = featureArrays[0].length;

  for (let i = 0; i < numFeatures; i++) {
    const column = featureArrays.map(row => row[i]);
    const min = Math.min(...column);
    const max = Math.max(...column);
    const range = max - min || 1;

    featureArrays.forEach((row, idx) => {
      if (!normalized[idx]) normalized[idx] = [];
      normalized[idx][i] = (row[i] - min) / range;
    });
  }

  return normalized;
}

// Simple One-Class SVM implementation (novelty detection)
class OneClassSVM {
  private threshold: number = 0.15;
  private normalData: number[][] = [];

  train(normalData: number[][]) {
    this.normalData = normalData;
    // Calculate threshold based on training data variance
    const distances = normalData.map(point => this.calculateDistance(point, this.getCentroid()));
    this.threshold = this.calculatePercentile(distances, 95);
  }

  predict(point: number[]): { isOutlier: boolean; distance: number } {
    const centroid = this.getCentroid();
    const distance = this.calculateDistance(point, centroid);
    return {
      isOutlier: distance > this.threshold,
      distance: distance
    };
  }

  private getCentroid(): number[] {
    if (this.normalData.length === 0) return [];
    const numFeatures = this.normalData[0].length;
    const centroid: number[] = new Array(numFeatures).fill(0);
    
    this.normalData.forEach(point => {
      point.forEach((val, idx) => {
        centroid[idx] += val;
      });
    });

    return centroid.map(sum => sum / this.normalData.length);
  }

  private calculateDistance(point1: number[], point2: number[]): number {
    return Math.sqrt(
      point1.reduce((sum, val, idx) => sum + Math.pow(val - point2[idx], 2), 0)
    );
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }
}

// ML Detection Engine implementing the two-stage model
export class MLDetectionEngine {
  private ocsvm: OneClassSVM;
  private isTrained: boolean = false;

  constructor() {
    this.ocsvm = new OneClassSVM();
  }

  // Stage 1: Train with normal data
  trainModel(normalTransactions: BlockchainFeatures[]) {
    const normalized = normalizeFeatures(normalTransactions);
    this.ocsvm.train(normalized);
    this.isTrained = true;
  }

  // Stage 1 & 2: Detect anomalies and classify them
  detectAnomalies(transactions: BlockchainFeatures[]): AnomalyResult[] {
    if (!this.isTrained) {
      throw new Error('Model must be trained before detection');
    }

    const normalized = normalizeFeatures(transactions);
    const results: AnomalyResult[] = [];
    const outliers: { data: number[]; index: number }[] = [];

    // Stage 1: Detect outliers using One-Class SVM
    normalized.forEach((point, idx) => {
      const prediction = this.ocsvm.predict(point);
      
      if (prediction.isOutlier) {
        outliers.push({ data: point, index: idx });
      }

      results.push({
        isAnomaly: prediction.isOutlier,
        confidence: Math.min(prediction.distance * 100, 100),
        features: transactions[idx],
        timestamp: new Date(),
        attackType: prediction.isOutlier ? undefined : undefined
      });
    });

    // Stage 2: Cluster outliers using K-Means (k=3 for 3 attack types)
    if (outliers.length >= 3) {
      const outlierData = outliers.map(o => o.data);
      const clusters = mlKmeans(outlierData, 3, {
        initialization: 'kmeans++',
        maxIterations: 100
      });

      // Classify attack types based on feature patterns
      outliers.forEach((outlier, idx) => {
        const clusterLabel = clusters.clusters[idx];
        const resultIdx = outlier.index;
        const features = transactions[resultIdx];

        results[resultIdx].clusterLabel = clusterLabel;
        results[resultIdx].attackType = this.classifyAttackType(features, clusterLabel);
      });
    } else if (outliers.length > 0) {
      // If too few outliers, classify individually
      outliers.forEach(outlier => {
        const resultIdx = outlier.index;
        results[resultIdx].attackType = this.classifyAttackType(transactions[resultIdx], 0);
      });
    }

    return results;
  }

  // Classify attack type based on feature patterns from the paper
  private classifyAttackType(
    features: BlockchainFeatures,
    clusterLabel: number
  ): 'DDoS Attack' | 'Double Spending' | '51% Vulnerability' | 'Unknown' {
    // DDoS: High blockchain size, high transactions, high block size
    const ddosScore = 
      (features.blockchainSize > 500 ? 1 : 0) +
      (features.uniqueTransactions > 400000 ? 1 : 0) +
      (features.avgBlockSize > 1.5 ? 1 : 0);

    // Double Spending: High transaction volume, low confirmation time
    const doubleSpendScore =
      (features.transactionVolume > 8000000000 ? 1 : 0) +
      (features.medianConfirmationTime < 8 ? 1 : 0);

    // 51% Attack: High hash rate, high difficulty
    const fiftyOneScore =
      (features.hashRate > 150000000000 ? 1 : 0) +
      (features.difficulty > 3000000000000 ? 1 : 0);

    const scores = {
      'DDoS Attack': ddosScore,
      'Double Spending': doubleSpendScore,
      '51% Vulnerability': fiftyOneScore
    };

    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) return 'Unknown';

    const attackType = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
    return (attackType as any) || 'Unknown';
  }
}

// Generate synthetic training data (normal transactions)
export function generateNormalData(count: number = 1000): BlockchainFeatures[] {
  const data: BlockchainFeatures[] = [];
  
  for (let i = 0; i < count; i++) {
    data.push({
      blockchainSize: 200 + Math.random() * 100,
      hashRate: 80000000000 + Math.random() * 40000000000,
      difficulty: 1500000000000 + Math.random() * 1000000000000,
      transactionVolume: 5000000000 + Math.random() * 2000000000,
      medianConfirmationTime: 8 + Math.random() * 4,
      avgBlockSize: 1.0 + Math.random() * 0.3,
      uniqueTransactions: 250000 + Math.random() * 100000
    });
  }
  
  return data;
}

// Generate synthetic test data with anomalies
export function generateTestData(count: number = 100): BlockchainFeatures[] {
  const data: BlockchainFeatures[] = [];
  const anomalyRate = 0.15; // 15% anomalies
  
  for (let i = 0; i < count; i++) {
    const isAnomaly = Math.random() < anomalyRate;
    
    if (isAnomaly) {
      const attackType = Math.floor(Math.random() * 3);
      
      if (attackType === 0) {
        // DDoS Attack pattern
        data.push({
          blockchainSize: 500 + Math.random() * 200,
          hashRate: 90000000000 + Math.random() * 30000000000,
          difficulty: 1800000000000 + Math.random() * 800000000000,
          transactionVolume: 6000000000 + Math.random() * 2000000000,
          medianConfirmationTime: 9 + Math.random() * 3,
          avgBlockSize: 1.5 + Math.random() * 0.5,
          uniqueTransactions: 400000 + Math.random() * 150000
        });
      } else if (attackType === 1) {
        // Double Spending pattern
        data.push({
          blockchainSize: 220 + Math.random() * 80,
          hashRate: 85000000000 + Math.random() * 35000000000,
          difficulty: 1600000000000 + Math.random() * 900000000000,
          transactionVolume: 8000000000 + Math.random() * 3000000000,
          medianConfirmationTime: 4 + Math.random() * 3,
          avgBlockSize: 1.1 + Math.random() * 0.3,
          uniqueTransactions: 280000 + Math.random() * 120000
        });
      } else {
        // 51% Vulnerability pattern
        data.push({
          blockchainSize: 230 + Math.random() * 90,
          hashRate: 150000000000 + Math.random() * 50000000000,
          difficulty: 3000000000000 + Math.random() * 1500000000000,
          transactionVolume: 6500000000 + Math.random() * 2500000000,
          medianConfirmationTime: 9 + Math.random() * 4,
          avgBlockSize: 1.2 + Math.random() * 0.4,
          uniqueTransactions: 290000 + Math.random() * 130000
        });
      }
    } else {
      // Normal transaction
      data.push({
        blockchainSize: 200 + Math.random() * 100,
        hashRate: 80000000000 + Math.random() * 40000000000,
        difficulty: 1500000000000 + Math.random() * 1000000000000,
        transactionVolume: 5000000000 + Math.random() * 2000000000,
        medianConfirmationTime: 8 + Math.random() * 4,
        avgBlockSize: 1.0 + Math.random() * 0.3,
        uniqueTransactions: 250000 + Math.random() * 100000
      });
    }
  }
  
  return data;
}
