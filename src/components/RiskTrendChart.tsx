import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AnomalyResult } from "@/lib/mlDetectionEngine";
import { AlertTriangle } from "lucide-react";

interface RiskTrendChartProps {
  anomalies: AnomalyResult[];
}

export const RiskTrendChart = ({ anomalies }: RiskTrendChartProps) => {
  const generateRiskData = () => {
    const intervals = 8;
    const data = [];
    const totalCount = anomalies.length;
    const itemsPerInterval = Math.ceil(totalCount / intervals);

    for (let i = 0; i < intervals; i++) {
      const start = i * itemsPerInterval;
      const end = Math.min((i + 1) * itemsPerInterval, totalCount);
      const slice = anomalies.slice(start, end);
      
      const highRisk = slice.filter(a => a.isAnomaly && a.confidence > 75).length;
      const mediumRisk = slice.filter(a => a.isAnomaly && a.confidence > 50 && a.confidence <= 75).length;
      const lowRisk = slice.filter(a => a.isAnomaly && a.confidence <= 50).length;
      
      data.push({
        time: `T${i * 3}:00`,
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk
      });
    }
    
    return data;
  };

  const data = generateRiskData();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-glow">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-primary" />
          Risk Level Trends
        </CardTitle>
        <CardDescription>Real-time risk distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
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
            <Area 
              type="monotone" 
              dataKey="high" 
              stackId="1"
              stroke="hsl(var(--destructive))" 
              fill="hsl(var(--destructive))"
              fillOpacity={0.6}
              name="High Risk"
            />
            <Area 
              type="monotone" 
              dataKey="medium" 
              stackId="1"
              stroke="hsl(var(--chart-2))" 
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
              name="Medium Risk"
            />
            <Area 
              type="monotone" 
              dataKey="low" 
              stackId="1"
              stroke="hsl(var(--chart-3))" 
              fill="hsl(var(--chart-3))"
              fillOpacity={0.6}
              name="Low Risk"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
