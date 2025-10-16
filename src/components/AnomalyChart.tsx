import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AnomalyResult } from "@/lib/mlDetectionEngine";
import { TrendingUp } from "lucide-react";

interface AnomalyChartProps {
  anomalies: AnomalyResult[];
}

export const AnomalyChart = ({ anomalies }: AnomalyChartProps) => {
  // Group anomalies by time intervals
  const generateChartData = () => {
    const intervals = 6;
    const data = [];
    const totalCount = anomalies.length;
    const itemsPerInterval = Math.ceil(totalCount / intervals);

    for (let i = 0; i < intervals; i++) {
      const start = i * itemsPerInterval;
      const end = Math.min((i + 1) * itemsPerInterval, totalCount);
      const slice = anomalies.slice(start, end);
      
      const anomalyCount = slice.filter(a => a.isAnomaly).length;
      const normalCount = slice.length - anomalyCount;
      
      data.push({
        time: `T${i * 4}:00`,
        anomalies: anomalyCount,
        normal: normalCount
      });
    }
    
    return data;
  };

  const data = generateChartData();

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Detection Trends
        </CardTitle>
        <CardDescription>Real-time analysis of transaction patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="anomalies" 
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))' }}
              name="Anomalies"
            />
            <Line 
              type="monotone" 
              dataKey="normal" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              name="Normal"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
