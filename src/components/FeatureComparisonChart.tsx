import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BlockchainFeatures } from "@/lib/mlDetectionEngine";
import { BarChart3 } from "lucide-react";

interface FeatureComparisonChartProps {
  features: BlockchainFeatures;
}

export const FeatureComparisonChart = ({ features }: FeatureComparisonChartProps) => {
  const normalizeValue = (value: number, max: number) => (value / max) * 100;

  const data = [
    {
      name: 'Hash Rate',
      value: normalizeValue(features.hashRate, 200000000000),
      unit: 'H/s'
    },
    {
      name: 'Difficulty',
      value: normalizeValue(features.difficulty, 5000000000000),
      unit: ''
    },
    {
      name: 'TX Volume',
      value: normalizeValue(features.transactionVolume, 12000000000),
      unit: 'BTC'
    },
    {
      name: 'Block Size',
      value: normalizeValue(features.avgBlockSize, 3),
      unit: 'MB'
    },
    {
      name: 'Blockchain Size',
      value: normalizeValue(features.blockchainSize, 700),
      unit: 'GB'
    },
    {
      name: 'Conf. Time',
      value: normalizeValue(features.medianConfirmationTime, 20),
      unit: 'min'
    }
  ];

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Feature Comparison
        </CardTitle>
        <CardDescription>Normalized blockchain metrics analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))" 
              name="Metric Level (%)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
