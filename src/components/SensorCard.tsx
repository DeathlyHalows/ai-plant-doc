import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SensorCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  unit: string;
  status: "good" | "warning" | "critical";
  trend?: "up" | "down" | "stable";
}

const SensorCard = ({ icon: Icon, title, value, unit, status, trend }: SensorCardProps) => {
  const statusColors = {
    good: "text-success",
    warning: "text-warning",
    critical: "text-destructive"
  };

  const trendSymbols = {
    up: "↑",
    down: "↓",
    stable: "→"
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${statusColors[status]}`}>
                {value}
              </span>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
          </div>
          
          {trend && (
            <div className="text-2xl text-muted-foreground">
              {trendSymbols[trend]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
