import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  name: string;
  plant_type: string | null;
  location: string | null;
}

interface PlantSelectorProps {
  selectedPlantId: string | null;
  onPlantSelect: (plantId: string) => void;
}

export default function PlantSelector({ selectedPlantId, onPlantSelect }: PlantSelectorProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [newPlantType, setNewPlantType] = useState('');
  const [newPlantLocation, setNewPlantLocation] = useState('');
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchPlants();
    }
  }, [user]);

  const fetchPlants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load plants', variant: 'destructive' });
    } else {
      setPlants(data || []);
      if (data && data.length > 0 && !selectedPlantId) {
        onPlantSelect(data[0].id);
      }
    }
    setLoading(false);
  };

  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    const { data, error } = await supabase
      .from('plants')
      .insert({
        user_id: user.id,
        name: newPlantName,
        plant_type: newPlantType || null,
        location: newPlantLocation || null,
      })
      .select()
      .single();

    setCreating(false);

    if (error) {
      toast({ title: 'Error', description: 'Failed to create plant', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `${newPlantName} has been added!` });
      setPlants([data, ...plants]);
      onPlantSelect(data.id);
      setDialogOpen(false);
      setNewPlantName('');
      setNewPlantType('');
      setNewPlantLocation('');
    }
  };

  if (loading) {
    return <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />;
  }

  return (
    <div className="flex items-center gap-3">
      <Select value={selectedPlantId || undefined} onValueChange={onPlantSelect}>
        <SelectTrigger className="w-[200px] border-2">
          <SelectValue placeholder="Select a plant" />
        </SelectTrigger>
        <SelectContent>
          {plants.map((plant) => (
            <SelectItem key={plant.id} value={plant.id}>
              {plant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" className="border-2">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Plant</DialogTitle>
            <DialogDescription>Add a new plant to your monitoring system</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePlant} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plant-name">Plant Name *</Label>
              <Input
                id="plant-name"
                placeholder="e.g., Tomato Plant"
                value={newPlantName}
                onChange={(e) => setNewPlantName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plant-type">Plant Type</Label>
              <Input
                id="plant-type"
                placeholder="e.g., Tomato, Rose, Basil"
                value={newPlantType}
                onChange={(e) => setNewPlantType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plant-location">Location</Label>
              <Input
                id="plant-location"
                placeholder="e.g., Garden, Balcony"
                value={newPlantLocation}
                onChange={(e) => setNewPlantLocation(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Add Plant'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
