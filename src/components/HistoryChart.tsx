import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HistoryChartProps {
  plantId: string;
}

const HistoryChart = ({ plantId }: HistoryChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetchHistoricalData();
  }, [plantId]);

  const fetchHistoricalData = async () => {
    const { data: readings } = await supabase
      .from('sensor_readings')
      .select('*')
      .eq('plant_id', plantId)
      .order('recorded_at', { ascending: true })
      .limit(24);

    if (readings && readings.length > 0) {
      const formattedData = readings.map((r) => ({
        time: new Date(r.recorded_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        humidity: r.humidity || 0,
        light: r.light_intensity || 0,
        temp: r.temperature || 0,
      }));
      setData(formattedData);
    } else {
      // Fallback to mock data
      setData([
        { time: "00:00", humidity: 65, light: 450, temp: 22 },
        { time: "04:00", humidity: 68, light: 200, temp: 21 },
        { time: "08:00", humidity: 62, light: 850, temp: 23 },
        { time: "12:00", humidity: 58, light: 1200, temp: 26 },
        { time: "16:00", humidity: 60, light: 900, temp: 25 },
        { time: "20:00", humidity: 64, light: 300, temp: 23 },
      ]);
    }
  };

  return (
    <Card className="border-2 hover:shadow-lg transition-all duration-300 col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          24-Hour Sensor History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="humidity" 
              stroke="hsl(var(--info))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--info))' }}
              name="Humidity (%)"
            />
            <Line 
              type="monotone" 
              dataKey="light" 
              stroke="hsl(var(--warning))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--warning))' }}
              name="Light (lux)"
            />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))' }}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default HistoryChart;
