-- CLINICAL HISTORY & ORDERS SCHEMA
-- Execute this in Supabase SQL Editor

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id),
    provider_id UUID REFERENCES public.profiles(id),
    clinic_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'received', -- received, processing, approved, shipped, delivered, cancelled
    priority TEXT DEFAULT 'normal', -- low, normal, high
    total_amount DECIMAL(12,2) DEFAULT 0.0,
    items JSONB DEFAULT '[]'::jsonb, -- [{sku, name, quantity, unitPrice}]
    shipping_address TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- tracking_number, processed_at, etc.
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ENCOUNTERS TABLE (Consultations)
CREATE TABLE IF NOT EXISTS public.encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.profiles(id),
    doctor_id UUID REFERENCES public.profiles(id),
    clinic_id UUID REFERENCES public.profiles(id),
    started_at TIMESTAMPTZ DEFAULT now(),
    finished_at TIMESTAMPTZ,
    status TEXT DEFAULT 'in-progress', -- in-progress, completed, cancelled
    type TEXT DEFAULT 'office', -- office, teleconsultation, home
    reason TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. DIAGNOSES TABLE
CREATE TABLE IF NOT EXISTS public.diagnoses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    encounter_id UUID REFERENCES public.encounters(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.profiles(id),
    doctor_id UUID REFERENCES public.profiles(id),
    condition TEXT NOT NULL,
    icd_code TEXT,
    type TEXT, -- Crónico, Agudo
    severity TEXT, -- low, medium, high
    status TEXT, -- Controlado, Activo, Seguimiento, Resuelto
    diagnosis_date DATE DEFAULT CURRENT_DATE,
    findings TEXT,
    plan TEXT,
    metadata JSONB DEFAULT '{}'::jsonb, -- digital_signature, symptoms, etc.
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TREATMENTS TABLE
CREATE TABLE IF NOT EXISTS public.treatments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    diagnosis_id UUID REFERENCES public.diagnoses(id) ON DELETE SET NULL,
    encounter_id UUID REFERENCES public.encounters(id),
    patient_id UUID REFERENCES public.profiles(id),
    doctor_id UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL, -- Medication or therapy name
    type TEXT DEFAULT 'Medicamento', -- Medicamento, Terapia, Cirugía
    dosage TEXT,
    frequency TEXT,
    route TEXT,
    instructions TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status TEXT DEFAULT 'active', -- active, completed, suspended
    adherence_rate INTEGER DEFAULT 100,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

-- Permissive policies for demo
CREATE POLICY "Allow all orders" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all encounters" ON encounters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all diagnoses" ON diagnoses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all treatments" ON treatments FOR ALL USING (true) WITH CHECK (true);
