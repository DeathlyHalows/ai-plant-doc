import { useEffect, useState } from "react";
import { Camera, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import plantImage from "@/assets/plant-healthy.jpg";

interface PlantImageCardProps {
  plantId: string;
}

const PlantImageCard = ({ plantId }: PlantImageCardProps) => {
  const [latestImage, setLatestImage] = useState<any>(null);

  useEffect(() => {
    fetchLatestImage();
  }, [plantId]);

  const fetchLatestImage = async () => {
    const { data } = await supabase
      .from('plant_images')
      .select('*')
      .eq('plant_id', plantId)
      .order('captured_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setLatestImage(data);
    }
  };

  const diseaseDetected = latestImage?.disease_detected || false;
  const lastCapture = "2 minutes ago";

  return (
    <Card className="border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Live Plant Monitor
          </span>
          <Badge variant="outline" className="bg-muted">
            {lastCapture}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
          <img 
            src={latestImage?.image_url || plantImage} 
            alt="Current plant status" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            <div className="px-3 py-1 rounded-full bg-background/90 backdrop-blur-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-xs font-medium">Live</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">AI Disease Detection</span>
            {diseaseDetected ? (
              <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                <AlertCircle className="w-3 h-3 mr-1" />
                Disease Found
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                No Issues
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Confidence</div>
              <div className="text-lg font-bold text-success">
                {latestImage?.confidence ? `${latestImage.confidence}%` : '98.5%'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Images Today</div>
              <div className="text-lg font-bold text-foreground">24</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantImageCard;
