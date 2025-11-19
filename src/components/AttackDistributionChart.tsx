import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AnomalyResult } from "@/lib/mlDetectionEngine";
import { Shield } from "lucide-react";

interface AttackDistributionChartProps {
  anomalies: AnomalyResult[];
}

export const AttackDistributionChart = ({ anomalies }: AttackDistributionChartProps) => {
  const attackTypes = anomalies.reduce((acc, anomaly) => {
    if (anomaly.isAnomaly && anomaly.attackType) {
      acc[anomaly.attackType] = (acc[anomaly.attackType] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(attackTypes).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = [
    'hsl(var(--destructive))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Attack Distribution
        </CardTitle>
        <CardDescription>Breakdown of detected attack types</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
