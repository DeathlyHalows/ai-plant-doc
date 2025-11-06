-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create plants table
CREATE TABLE public.plants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  plant_type TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on plants
ALTER TABLE public.plants ENABLE ROW LEVEL SECURITY;

-- Plants policies
CREATE POLICY "Users can view own plants"
  ON public.plants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plants"
  ON public.plants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plants"
  ON public.plants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plants"
  ON public.plants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create sensor_readings table
CREATE TABLE public.sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  temperature NUMERIC,
  humidity NUMERIC,
  light_intensity NUMERIC,
  soil_moisture NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on sensor_readings
ALTER TABLE public.sensor_readings ENABLE ROW LEVEL SECURITY;

-- Sensor readings policies
CREATE POLICY "Users can view own plant sensor readings"
  ON public.sensor_readings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = sensor_readings.plant_id
      AND plants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own plant sensor readings"
  ON public.sensor_readings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = sensor_readings.plant_id
      AND plants.user_id = auth.uid()
    )
  );

-- Create plant_images table
CREATE TABLE public.plant_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plant_id UUID REFERENCES public.plants(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  disease_detected BOOLEAN DEFAULT false,
  disease_name TEXT,
  confidence NUMERIC,
  ai_analysis TEXT,
  captured_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on plant_images
ALTER TABLE public.plant_images ENABLE ROW LEVEL SECURITY;

-- Plant images policies
CREATE POLICY "Users can view own plant images"
  ON public.plant_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = plant_images.plant_id
      AND plants.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own plant images"
  ON public.plant_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.plants
      WHERE plants.id = plant_images.plant_id
      AND plants.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_plants_updated_at
  BEFORE UPDATE ON public.plants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for sensor_readings (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_readings;