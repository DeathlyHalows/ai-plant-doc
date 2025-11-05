import { Sun, Droplets, Thermometer } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import HealthStatusCard from "@/components/HealthStatusCard";
import SensorCard from "@/components/SensorCard";
import PlantImageCard from "@/components/PlantImageCard";
import WateringCard from "@/components/WateringCard";
import HistoryChart from "@/components/HistoryChart";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
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
              <PlantImageCard />
            </div>
          </div>

          {/* Sensor Readings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SensorCard
              icon={Sun}
              title="Light Intensity"
              value="850"
              unit="lux"
              status="good"
              trend="up"
            />
            <SensorCard
              icon={Droplets}
              title="Humidity"
              value="62"
              unit="%"
              status="good"
              trend="stable"
            />
            <SensorCard
              icon={Thermometer}
              title="Temperature"
              value="23"
              unit="°C"
              status="good"
              trend="up"
            />
          </div>

          {/* History Chart */}
          <HistoryChart />
        </div>
      </main>
    </div>
  );
};

export default Index;
