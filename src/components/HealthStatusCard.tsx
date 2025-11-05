import { Heart, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HealthStatusCard = () => {
  const healthStatus = "healthy" as const;
  
  const getStatusConfig = (status: "healthy" | "warning" | "critical" = healthStatus) => {
    switch (status) {
      case "healthy":
        return {
          icon: CheckCircle2,
          text: "Healthy",
          className: "bg-success/10 text-success border-success/20",
          iconClassName: "text-success"
        };
      case "warning":
        return {
          icon: AlertTriangle,
          text: "Needs Attention",
          className: "bg-warning/10 text-warning border-warning/20",
          iconClassName: "text-warning"
        };
      case "critical":
        return {
          icon: Heart,
          text: "Critical",
          className: "bg-destructive/10 text-destructive border-destructive/20",
          iconClassName: "text-destructive"
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <Card className="border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Overall Health
          </span>
          <Badge variant="outline" className={status.className}>
            <StatusIcon className="w-4 h-4 mr-1" />
            {status.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Health Score</span>
            <span className="text-2xl font-bold text-success">95%</span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-success transition-all duration-1000 ease-out rounded-full"
              style={{ width: '95%' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Light</div>
              <div className="text-sm font-semibold text-success">Good</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Water</div>
              <div className="text-sm font-semibold text-success">Optimal</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="text-xs text-muted-foreground">Humidity</div>
              <div className="text-sm font-semibold text-success">Perfect</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthStatusCard;
