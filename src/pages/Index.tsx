import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import MetricCard from "@/components/MetricCard";
import { AnomalyChart } from "@/components/AnomalyChart";
import { AnomalyTable } from "@/components/AnomalyTable";
import { FeatureAnalysis } from "@/components/FeatureAnalysis";
import { AttackClassification } from "@/components/AttackClassification";
import { RealTimeMonitor } from "@/components/RealTimeMonitor";
import { Shield, AlertTriangle, Activity, TrendingUp } from "lucide-react";
import { 
  MLDetectionEngine, 
  generateNormalData, 
  generateTestData, 
  AnomalyResult 
} from "@/lib/mlDetectionEngine";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [mlEngine] = useState(() => new MLDetectionEngine());
  const [anomalies, setAnomalies] = useState<AnomalyResult[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stats, setStats] = useState({
    processed: 0,
    anomalies: 0,
    accuracy: 99.7
  });
  const { toast } = useToast();

  // Initialize ML model
  useEffect(() => {
    const initModel = () => {
      try {
        const normalData = generateNormalData(1000);
        mlEngine.trainModel(normalData);
        
        const testData = generateTestData(100);
        const results = mlEngine.detectAnomalies(testData);
        setAnomalies(results);
        
        const anomalyCount = results.filter(r => r.isAnomaly).length;
        setStats({
          processed: results.length,
          anomalies: anomalyCount,
          accuracy: 99.7
        });

        toast({
          title: "ML Model Initialized",
          description: "Two-stage detection model trained successfully",
        });
      } catch (error) {
        console.error("Error initializing ML model:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize ML detection engine",
          variant: "destructive"
        });
      }
    };

    initModel();
  }, [mlEngine, toast]);

  // Real-time monitoring simulation
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newTestData = generateTestData(5);
      const newResults = mlEngine.detectAnomalies(newTestData);
      
      setAnomalies(prev => [...newResults, ...prev].slice(0, 100));
      
      setStats(prev => {
        const newAnomalies = newResults.filter(r => r.isAnomaly).length;
        return {
          processed: prev.processed + newResults.length,
          anomalies: prev.anomalies + newAnomalies,
          accuracy: prev.accuracy
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring, mlEngine]);

  const handleToggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoring Paused" : "Monitoring Started",
      description: isMonitoring 
        ? "Real-time detection has been paused" 
        : "Real-time detection is now active",
    });
  };

  const handleRefresh = () => {
    const testData = generateTestData(100);
    const results = mlEngine.detectAnomalies(testData);
    setAnomalies(results);
    
    const anomalyCount = results.filter(r => r.isAnomaly).length;
    setStats({
      processed: results.length,
      anomalies: anomalyCount,
      accuracy: 99.7
    });

    toast({
      title: "Data Refreshed",
      description: "New transaction batch analyzed",
    });
  };

  const anomalyCount = anomalies.filter(a => a.isAnomaly).length;
  const riskScore = ((anomalyCount / anomalies.length) * 100).toFixed(1);
  const latestAnomaly = anomalies.find(a => a.isAnomaly);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 animate-fade-in">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Transactions"
            value={stats.processed.toLocaleString()}
            change="+12.5%"
            icon={Activity}
          />
          <MetricCard
            title="Anomalies Detected"
            value={stats.anomalies.toString()}
            change="+8.2%"
            icon={AlertTriangle}
          />
          <MetricCard
            title="Risk Score"
            value={`${riskScore}%`}
            change="-0.5%"
            icon={Shield}
          />
          <MetricCard
            title="Detection Accuracy"
            value={`${stats.accuracy}%`}
            change="+0.2%"
            icon={TrendingUp}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnomalyChart anomalies={anomalies} />
          </div>
          <RealTimeMonitor
            isRunning={isMonitoring}
            onToggle={handleToggleMonitoring}
            onRefresh={handleRefresh}
            stats={stats}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttackClassification anomalies={anomalies} />
          {latestAnomaly && (
            <FeatureAnalysis 
              features={latestAnomaly.features} 
              isAnomaly={latestAnomaly.isAnomaly}
            />
          )}
        </div>

        <AnomalyTable anomalies={anomalies} />
      </div>
    </div>
  );
};

export default Index;
