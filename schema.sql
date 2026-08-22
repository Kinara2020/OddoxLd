-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    total_budget NUMERIC(12, 2) DEFAULT 0.00,
    base_currency TEXT DEFAULT 'USD',
    is_public BOOLEAN DEFAULT false,
    share_slug TEXT UNIQUE,
    cover_photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Trip Stops Table (Cities in a trip)
CREATE TABLE IF NOT EXISTS public.trip_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
    city_name TEXT NOT NULL,
    country TEXT,
    city_id TEXT, -- ID from GeoDB
    lat NUMERIC(10, 6),
    lon NUMERIC(10, 6),
    order_index INTEGER NOT NULL DEFAULT 0,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities Table (Things to do in a stop)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
    place_id TEXT, -- ID from Geoapify
    title TEXT NOT NULL,
    description TEXT,
    cost NUMERIC(12, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trips: Users can manage their own trips, public can view shared trips
CREATE POLICY "Users can manage own trips" ON public.trips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public can view shared trips" ON public.trips FOR SELECT USING (is_public = true);

-- Stops: Users can manage stops for their trips, public can view stops for shared trips
CREATE POLICY "Users can manage own trip stops" ON public.trip_stops FOR ALL USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "Public can view shared trip stops" ON public.trip_stops FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_stops.trip_id AND trips.is_public = true)
);

-- Activities: Users can manage activities for their stops, public can view activities for shared stops
CREATE POLICY "Users can manage own activities" ON public.activities FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.trip_stops 
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.stop_id AND trips.user_id = auth.uid()
    )
);
CREATE POLICY "Public can view shared activities" ON public.activities FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.trip_stops 
        JOIN public.trips ON trips.id = trip_stops.trip_id
        WHERE trip_stops.id = activities.stop_id AND trips.is_public = true
    )
);
