-- FIX FOR APPOINTMENTS TABLE
-- Run this in Supabase SQL Editor to fix the "column not found" error.

-- 1. Ensure the table exists
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    patient_id UUID REFERENCES public.profiles(id),
    professional_id UUID REFERENCES public.profiles(id),
    clinic_id UUID REFERENCES public.profiles(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT DEFAULT 'pending',
    patient_name TEXT,
    reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Add columns safely if the table already existed but was missing them
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='reason') THEN
        ALTER TABLE public.appointments ADD COLUMN reason TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='patient_name') THEN
        ALTER TABLE public.appointments ADD COLUMN patient_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='metadata') THEN
        ALTER TABLE public.appointments ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='appointments' AND column_name='updated_at') THEN
        ALTER TABLE public.appointments ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 4. Dropping old policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Personnel can view appointments in their clinic" ON public.appointments;
DROP POLICY IF EXISTS "Professionals can insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update their appointments" ON public.appointments;
DROP POLICY IF EXISTS "View appointments" ON public.appointments;
DROP POLICY IF EXISTS "Insert appointments" ON public.appointments;
DROP POLICY IF EXISTS "Update appointments" ON public.appointments;

-- 5. Creating clean policies for demo/dev stage
-- Anyone authenticated can view their relevant appointments
CREATE POLICY "View appointments" ON public.appointments 
FOR SELECT USING (
    auth.uid() = patient_id OR 
    auth.uid() = professional_id OR 
    auth.uid() = clinic_id
);

-- Professionals and Clinics can create appointments
CREATE POLICY "Insert appointments" ON public.appointments 
FOR INSERT WITH CHECK (true); -- Flexible for demo

-- Dynamic update for involved parties
CREATE POLICY "Update appointments" ON public.appointments 
FOR UPDATE USING (
    auth.uid() = professional_id OR 
    auth.uid() = clinic_id
);
