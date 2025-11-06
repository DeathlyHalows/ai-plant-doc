import { Leaf, Bell, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import PlantSelector from "./PlantSelector";

interface DashboardHeaderProps {
  selectedPlantId: string | null;
  onPlantSelect: (plantId: string) => void;
}

const DashboardHeader = ({ selectedPlantId, onPlantSelect }: DashboardHeaderProps) => {
  const { signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Plant Doctor</h1>
              <p className="text-sm text-muted-foreground">Smart Plant Monitoring System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <PlantSelector selectedPlantId={selectedPlantId} onPlantSelect={onPlantSelect} />
            
            <div className="relative">
              <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <Badge className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 bg-destructive text-xs">
                2
              </Badge>
            </div>

            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
