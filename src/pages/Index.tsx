import { useState, useEffect } from "react";
import { Sun, Droplets, Thermometer } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import HealthStatusCard from "@/components/HealthStatusCard";
import SensorCard from "@/components/SensorCard";
import PlantImageCard from "@/components/PlantImageCard";
import WateringCard from "@/components/WateringCard";
import HistoryChart from "@/components/HistoryChart";
import ProtectedRoute from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [latestReading, setLatestReading] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedPlantId) {
      fetchLatestReading();
      
      // Set up realtime subscription
      const channel = supabase
        .channel('sensor-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'sensor_readings',
            filter: `plant_id=eq.${selectedPlantId}`,
          },
          (payload) => {
            setLatestReading(payload.new);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedPlantId]);

  const fetchLatestReading = async () => {
    if (!selectedPlantId) return;

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('plant_id', selectedPlantId)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast({ title: 'Error', description: 'Failed to fetch sensor data', variant: 'destructive' });
    } else if (data) {
      setLatestReading(data);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader selectedPlantId={selectedPlantId} onPlantSelect={setSelectedPlantId} />
        
        <main className="container mx-auto px-4 py-8">
          {!selectedPlantId ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Select a plant to view its health status</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Welcome back! 🌱</h2>
                <p className="text-muted-foreground">Your plant is thriving. Here's today's health report.</p>
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Health Status */}
                <div className="lg:col-span-1 space-y-6">
                  <HealthStatusCard />
                  <WateringCard />
                </div>

                {/* Right Column - Plant Image */}
                <div className="lg:col-span-2">
                  <PlantImageCard plantId={selectedPlantId} />
                </div>
              </div>

              {/* Sensor Readings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SensorCard
                  icon={Sun}
                  title="Light Intensity"
                  value={latestReading?.light_intensity?.toString() || "850"}
                  unit="lux"
                  status="good"
                  trend="up"
                />
                <SensorCard
                  icon={Droplets}
                  title="Humidity"
                  value={latestReading?.humidity?.toString() || "62"}
                  unit="%"
                  status="good"
                  trend="stable"
                />
                <SensorCard
                  icon={Thermometer}
                  title="Temperature"
                  value={latestReading?.temperature?.toString() || "23"}
                  unit="°C"
                  status="good"
                  trend="up"
                />
              </div>

              {/* History Chart */}
              <HistoryChart plantId={selectedPlantId} />
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Index;
