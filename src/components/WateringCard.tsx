import { Droplets, Power } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const WateringCard = () => {
  const isAutoMode = true;
  const lastWatered = "3 hours ago";
  const nextWatering = "in 21 hours";

  return (
    <Card className="border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-info" />
            Watering System
          </span>
          <Badge variant="outline" className={isAutoMode ? "bg-success/10 text-success border-success/20" : "bg-muted"}>
            {isAutoMode ? "Auto Mode" : "Manual"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Last Watered</div>
            <div className="text-sm font-semibold text-foreground">{lastWatered}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-xs text-muted-foreground mb-1">Next Watering</div>
            <div className="text-sm font-semibold text-foreground">{nextWatering}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Soil Moisture</span>
            <span className="font-semibold text-info">65%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-info transition-all duration-1000 ease-out rounded-full"
              style={{ width: '65%' }}
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-gradient-primary hover:opacity-90">
            <Droplets className="w-4 h-4 mr-2" />
            Water Now
          </Button>
          <Button variant="outline" size="icon">
            <Power className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WateringCard;
