import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BlockchainFeatures } from "@/lib/mlDetectionEngine";
import { Activity, TrendingUp, Clock, Database, Cpu, Box, Users } from "lucide-react";

interface FeatureAnalysisProps {
  features: BlockchainFeatures;
  isAnomaly: boolean;
}

export const FeatureAnalysis = ({ features, isAnomaly }: FeatureAnalysisProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const getFeatureStatus = (value: number, threshold: number): number => {
    return Math.min((value / threshold) * 100, 100);
  };

  const featureData = [
    {
      icon: Database,
      label: "Blockchain Size",
      value: `${features.blockchainSize.toFixed(2)} GB`,
      progress: getFeatureStatus(features.blockchainSize, 700),
      threshold: 500,
      isHigh: features.blockchainSize > 500
    },
    {
      icon: Cpu,
      label: "Hash Rate",
      value: `${formatNumber(features.hashRate)} H/s`,
      progress: getFeatureStatus(features.hashRate, 200000000000),
      threshold: 150000000000,
      isHigh: features.hashRate > 150000000000
    },
    {
      icon: TrendingUp,
      label: "Difficulty",
      value: formatNumber(features.difficulty),
      progress: getFeatureStatus(features.difficulty, 5000000000000),
      threshold: 3000000000000,
      isHigh: features.difficulty > 3000000000000
    },
    {
      icon: Activity,
      label: "Transaction Volume",
      value: `${formatNumber(features.transactionVolume)} BTC`,
      progress: getFeatureStatus(features.transactionVolume, 12000000000),
      threshold: 8000000000,
      isHigh: features.transactionVolume > 8000000000
    },
    {
      icon: Clock,
      label: "Median Confirmation Time",
      value: `${features.medianConfirmationTime.toFixed(1)} min`,
      progress: getFeatureStatus(features.medianConfirmationTime, 20),
      threshold: 8,
      isHigh: features.medianConfirmationTime < 8
    },
    {
      icon: Box,
      label: "Avg Block Size",
      value: `${features.avgBlockSize.toFixed(2)} MB`,
      progress: getFeatureStatus(features.avgBlockSize, 3),
      threshold: 1.5,
      isHigh: features.avgBlockSize > 1.5
    },
    {
      icon: Users,
      label: "Unique Transactions",
      value: formatNumber(features.uniqueTransactions),
      progress: getFeatureStatus(features.uniqueTransactions, 600000),
      threshold: 400000,
      isHigh: features.uniqueTransactions > 400000
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Feature Analysis
        </CardTitle>
        <CardDescription>
          Real-time blockchain metrics based on research paper parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {featureData.map((feature, index) => {
          const Icon = feature.icon;
          const isAnomalous = isAnomaly && feature.isHigh;
          
          return (
            <div 
              key={index} 
              className={`space-y-2 p-3 rounded-lg transition-all duration-300 ${
                isAnomalous 
                  ? 'bg-destructive/10 border border-destructive/30' 
                  : 'bg-muted/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isAnomalous ? 'text-destructive' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
                <span className={`text-sm font-semibold ${isAnomalous ? 'text-destructive' : 'text-primary'}`}>
                  {feature.value}
                </span>
              </div>
              <Progress 
                value={feature.progress} 
                className="h-2"
              />
              {isAnomalous && (
                <p className="text-xs text-destructive animate-pulse">
                  ⚠ Exceeds normal threshold
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
