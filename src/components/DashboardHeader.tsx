import { Shield } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">BlockGuard AI</h1>
            <p className="text-sm text-muted-foreground">Blockchain Anomaly Detection System</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
