import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface RealTimeMonitorProps {
  isRunning: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  stats: {
    processed: number;
    anomalies: number;
    accuracy: number;
  };
}

export const RealTimeMonitor = ({ isRunning, onToggle, onRefresh, stats }: RealTimeMonitorProps) => {
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setUptime(prev => prev + 1);
      }, 1000);
    } else {
      setUptime(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatUptime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-primary/20 shadow-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              Real-Time Monitoring
            </CardTitle>
            <CardDescription>
              Live blockchain transaction analysis
            </CardDescription>
          </div>
          <Badge variant={isRunning ? "default" : "secondary"} className="text-xs">
            {isRunning ? "ACTIVE" : "PAUSED"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Processed</p>
            <p className="text-2xl font-bold text-primary">{stats.processed}</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Anomalies</p>
            <p className="text-2xl font-bold text-destructive">{stats.anomalies}</p>
          </div>
          <div className="p-3 rounded-lg bg-card/50 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
            <p className="text-2xl font-bold text-green-500">{stats.accuracy}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
          <div>
            <p className="text-sm font-medium">System Uptime</p>
            <p className="text-2xl font-mono font-bold text-primary">{formatUptime(uptime)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={onToggle} 
            className="flex-1"
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Detection
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start Detection
              </>
            )}
          </Button>
          <Button onClick={onRefresh} variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-xs text-muted-foreground mb-2">Model Status</p>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Stage 1: One-Class SVM</span>
              <Badge variant="outline" className="text-xs">Trained</Badge>
            </div>
            <div className="flex justify-between text-xs">
              <span>Stage 2: K-Means (k=3)</span>
              <Badge variant="outline" className="text-xs">Active</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
