import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AnomalyResult } from "@/lib/mlDetectionEngine";
import { AlertTriangle, Clock } from "lucide-react";

interface AnomalyTableProps {
  anomalies: AnomalyResult[];
}

export const AnomalyTable = ({ anomalies }: AnomalyTableProps) => {
  const anomalyList = anomalies
    .filter(a => a.isAnomaly)
    .map((anomaly, idx) => ({
      id: idx + 1,
      hash: `0x${Math.random().toString(16).substr(2, 32)}`,
      timestamp: anomaly.timestamp.toLocaleString(),
      amount: `${(Math.random() * 20 + 1).toFixed(2)} BTC`,
      type: anomaly.attackType || "Unknown",
      confidence: Math.round(anomaly.confidence),
      risk: anomaly.confidence > 75 ? "high" : anomaly.confidence > 50 ? "medium" : "low"
    }));

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getAttackIcon = (type: string) => {
    if (type.includes("DDoS")) return "🔥";
    if (type.includes("Double")) return "⚡";
    if (type.includes("51%")) return "🛡️";
    return "⚠️";
  };

  if (anomalyList.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Detected Anomalies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No anomalies detected. System running normally.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/95 border-primary/20 shadow-card">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
          Detected Anomalies ({anomalyList.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead>Transaction Hash</TableHead>
                <TableHead className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Timestamp
                </TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Attack Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalyList.slice(0, 10).map((anomaly) => (
                <TableRow key={anomaly.id} className="hover:bg-muted/30 animate-fade-in">
                  <TableCell className="font-mono text-xs">{anomaly.hash}</TableCell>
                  <TableCell className="text-sm">{anomaly.timestamp}</TableCell>
                  <TableCell className="font-semibold text-primary">{anomaly.amount}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      {getAttackIcon(anomaly.type)}
                      {anomaly.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {anomaly.confidence}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRiskColor(anomaly.risk) as any}>
                      {anomaly.risk.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {anomalyList.length > 10 && (
          <p className="text-sm text-muted-foreground text-center mt-4">
            Showing 10 of {anomalyList.length} anomalies
          </p>
        )}
      </CardContent>
    </Card>
  );
};
