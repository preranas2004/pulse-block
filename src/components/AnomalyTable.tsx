import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface Anomaly {
  id: string;
  hash: string;
  timestamp: string;
  amount: string;
  riskLevel: "high" | "medium" | "low";
  type: string;
  confidence: number;
}

const mockAnomalies: Anomaly[] = [
  {
    id: "1",
    hash: "0x7f8a...3d4e",
    timestamp: "2025-10-16 14:32:10",
    amount: "125.4 ETH",
    riskLevel: "high",
    type: "Unusual Volume",
    confidence: 94
  },
  {
    id: "2",
    hash: "0x9b2c...7a1f",
    timestamp: "2025-10-16 14:28:45",
    amount: "0.03 BTC",
    riskLevel: "medium",
    type: "Suspicious Pattern",
    confidence: 76
  },
  {
    id: "3",
    hash: "0x4e5f...9c2b",
    timestamp: "2025-10-16 14:15:22",
    amount: "450.2 USDT",
    riskLevel: "high",
    type: "Mixer Activity",
    confidence: 89
  },
  {
    id: "4",
    hash: "0x1a3d...6f8e",
    timestamp: "2025-10-16 13:59:33",
    amount: "23.7 ETH",
    riskLevel: "low",
    type: "Velocity Check",
    confidence: 62
  },
  {
    id: "5",
    hash: "0x8c7b...4d2a",
    timestamp: "2025-10-16 13:47:18",
    amount: "1,250 USDC",
    riskLevel: "medium",
    type: "Geographic Alert",
    confidence: 71
  }
];

const AnomalyTable = () => {
  const getRiskBadge = (level: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      high: "destructive",
      medium: "default",
      low: "secondary"
    };
    return variants[level] || "default";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <CardTitle>Recent Anomalies</CardTitle>
          </div>
          <Badge variant="outline" className="font-mono">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnomalies.map((anomaly) => (
                <TableRow key={anomaly.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{anomaly.hash}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{anomaly.timestamp}</TableCell>
                  <TableCell className="font-semibold">{anomaly.amount}</TableCell>
                  <TableCell>{anomaly.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${anomaly.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{anomaly.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskBadge(anomaly.riskLevel)} className="capitalize">
                      {anomaly.riskLevel}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnomalyTable;
