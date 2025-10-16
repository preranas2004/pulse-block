import DashboardHeader from "@/components/DashboardHeader";
import MetricCard from "@/components/MetricCard";
import AnomalyTable from "@/components/AnomalyTable";
import AnomalyChart from "@/components/AnomalyChart";
import { Activity, AlertTriangle, Shield, TrendingUp } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Transactions"
            value="234,567"
            change="+12.5% from yesterday"
            icon={Activity}
            trend="up"
          />
          <MetricCard
            title="Anomalies Detected"
            value="1,432"
            change="+8.2% from yesterday"
            icon={AlertTriangle}
            trend="up"
          />
          <MetricCard
            title="High Risk"
            value="89"
            change="-3.1% from yesterday"
            icon={Shield}
            trend="down"
          />
          <MetricCard
            title="Detection Rate"
            value="94.2%"
            change="+2.4% from yesterday"
            icon={TrendingUp}
            trend="up"
          />
        </div>

        {/* Chart */}
        <AnomalyChart />

        {/* Anomalies Table */}
        <AnomalyTable />
      </main>
    </div>
  );
};

export default Index;
