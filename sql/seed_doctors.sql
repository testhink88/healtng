-- SEED DATA: 10 PROFESSIONAL PROFILES
-- Este script inserta 10 doctores de diferentes especialidades en la tabla de perfiles.
-- Útil para probar directorios, agendas y búsquedas.

INSERT INTO public.profiles (id, full_name, role, email, onboarding_completed, metadata)
VALUES
  (
    gen_random_uuid(), 
    'Dr. Carlos Mendoza', 
    'doctor', 
    'carlos.mendoza@healtng.test', 
    true, 
    '{
      "specialty_label": "Cardiología",
      "license": "MPPS-12345",
      "bio": "Especialista en salud cardiovascular con 15 años de experiencia.",
      "state": "Caracas",
      "phone": "+58 412-1112233"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dra. Elena Rodríguez', 
    'doctor', 
    'elena.rod@healtng.test', 
    true, 
    '{
      "specialty_label": "Pediatría",
      "license": "MPPS-54321",
      "bio": "Dedicada al cuidado integral de niños y adolescentes.",
      "state": "Miranda",
      "phone": "+58 424-2223344"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dr. Ricardo Silva', 
    'doctor', 
    'ricardo.silva@healtng.test', 
    true, 
    '{
      "specialty_label": "Traumatología",
      "license": "MPPS-99887",
      "bio": "Experto en cirugía ortopédica y medicina deportiva.",
      "state": "Caracas",
      "phone": "+58 414-3334455"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dra. Ana Martínez', 
    'doctor', 
    'ana.mtz@healtng.test', 
    true, 
    '{
      "specialty_label": "Ginecología",
      "license": "MPPS-11223",
      "state": "Valencia",
      "phone": "+58 416-7778899"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dr. Luis Romero', 
    'doctor', 
    'luis.romero@healtng.test', 
    true, 
    '{
      "specialty_label": "Dermatología",
      "license": "MPPS-44556",
      "state": "Anzoátegui",
      "phone": "+58 426-2223344"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dra. Sofía Ramírez', 
    'doctor', 
    'sofia.ram@healtng.test', 
    true, 
    '{
      "specialty_label": "Psiquiatría",
      "license": "MPPS-77889",
      "state": "Caracas",
      "phone": "+58 416-9997788"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dr. Jorge Blanco', 
    'doctor', 
    'jorge.blanco@healtng.test', 
    true, 
    '{
      "specialty_label": "Oftalmología",
      "license": "MPPS-33445",
      "state": "Zulia",
      "phone": "+58 412-3331122"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dra. Carmen Vega', 
    'doctor', 
    'carmen.vega@healtng.test', 
    true, 
    '{
      "specialty_label": "Nutrición",
      "license": "MPPS-66554",
      "state": "Aragua",
      "phone": "+58 424-2228899"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dr. Miguel Ferrer', 
    'doctor', 
    'miguel.ferrer@healtng.test', 
    true, 
    '{
      "specialty_label": "Neurología",
      "license": "MPPS-11998",
      "state": "Miranda",
      "phone": "+58 416-1122334"
    }'::jsonb
  ),
  (
    gen_random_uuid(), 
    'Dra. Patricia Salazar', 
    'doctor', 
    'patricia.salazar@healtng.test', 
    true, 
    '{
      "specialty_label": "Endocrinología",
      "license": "MPPS-88776",
      "state": "Nueva Esparta",
      "phone": "+58 426-7788991"
    }'::jsonb
  );
