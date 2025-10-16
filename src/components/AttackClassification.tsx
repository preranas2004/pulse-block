import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, Zap } from "lucide-react";
import { AnomalyResult } from "@/lib/mlDetectionEngine";

interface AttackClassificationProps {
  anomalies: AnomalyResult[];
}

export const AttackClassification = ({ anomalies }: AttackClassificationProps) => {
  const attackTypes = {
    'DDoS Attack': {
      count: 0,
      color: 'destructive',
      icon: Zap,
      description: 'Network congestion attacks flooding the blockchain'
    },
    'Double Spending': {
      count: 0,
      color: 'warning',
      icon: AlertTriangle,
      description: 'Attempts to spend the same cryptocurrency twice'
    },
    '51% Vulnerability': {
      count: 0,
      color: 'destructive',
      icon: Shield,
      description: 'Majority hash rate control threats'
    },
    'Unknown': {
      count: 0,
      color: 'default',
      icon: AlertTriangle,
      description: 'Unclassified anomalous patterns'
    }
  };

  // Count attack types
  anomalies.forEach(anomaly => {
    if (anomaly.isAnomaly && anomaly.attackType) {
      attackTypes[anomaly.attackType].count++;
    }
  });

  const totalAnomalies = anomalies.filter(a => a.isAnomaly).length;
  const detectionRate = ((totalAnomalies / anomalies.length) * 100).toFixed(1);

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Attack Classification (K-Means Clustering)
        </CardTitle>
        <CardDescription>
          Two-stage ML model: One-Class SVM + K-Means (k=3)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm text-muted-foreground">Total Analyzed</p>
            <p className="text-3xl font-bold text-primary">{anomalies.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-muted-foreground">Anomalies Detected</p>
            <p className="text-3xl font-bold text-destructive">{totalAnomalies}</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-muted/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Detection Rate</span>
            <span className="text-sm font-semibold text-primary">{detectionRate}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary-foreground transition-all duration-500"
              style={{ width: `${detectionRate}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Attack Type Distribution</h4>
          {Object.entries(attackTypes).map(([type, data]) => {
            const Icon = data.icon;
            const percentage = totalAnomalies > 0 ? ((data.count / totalAnomalies) * 100).toFixed(1) : '0';
            
            if (data.count === 0) return null;

            return (
              <div 
                key={type}
                className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card transition-all duration-300 animate-fade-in"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      data.color === 'destructive' 
                        ? 'bg-destructive/20 text-destructive' 
                        : data.color === 'warning'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{type}</p>
                      <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
                    </div>
                  </div>
                  <Badge variant={data.color as any} className="ml-2">
                    {data.count}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        data.color === 'destructive'
                          ? 'bg-destructive'
                          : data.color === 'warning'
                          ? 'bg-warning'
                          : 'bg-muted-foreground'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                    {percentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
