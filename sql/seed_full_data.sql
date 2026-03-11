-- SEED DATA: 10 DOCTORS AND 10 PATIENTS WITH APPOINTMENTS
-- Con IDs fijas para que puedas localizarlos fácilmente.

-- 1. LIMPIEZA OPCIONAL (Descomenta si quieres borrar datos previos de prueba)
-- DELETE FROM public.appointments;
-- DELETE FROM public.profiles WHERE email LIKE '%@healtng.test';

-- 2. INSERTAR DOCTORES
INSERT INTO public.profiles (id, full_name, role, email, onboarding_completed, metadata)
VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Dr. Carlos Mendoza', 'doctor', 'carlos.mendoza@healtng.test', true, '{"specialty_label": "Cardiología", "license": "MPPS-1001", "state": "Caracas"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000002', 'Dra. Elena Rodríguez', 'doctor', 'elena.rod@healtng.test', true, '{"specialty_label": "Pediatría", "license": "MPPS-1002", "state": "Miranda"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000003', 'Dr. Ricardo Silva', 'doctor', 'ricardo.silva@healtng.test', true, '{"specialty_label": "Traumatología", "license": "MPPS-1003", "state": "Caracas"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000004', 'Dra. Ana Martínez', 'doctor', 'ana.mtz@healtng.test', true, '{"specialty_label": "Ginecología", "license": "MPPS-1004", "state": "Valencia"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000005', 'Dr. Luis Romero', 'doctor', 'luis.romero@healtng.test', true, '{"specialty_label": "Dermatología", "license": "MPPS-1005", "state": "Anzoátegui"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000006', 'Dra. Sofía Ramírez', 'doctor', 'sofia.ram@healtng.test', true, '{"specialty_label": "Psiquiatría", "license": "MPPS-1006", "state": "Caracas"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000007', 'Dr. Jorge Blanco', 'doctor', 'jorge.blanco@healtng.test', true, '{"specialty_label": "Oftalmología", "license": "MPPS-1007", "state": "Zulia"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000008', 'Dra. Carmen Vega', 'doctor', 'carmen.vega@healtng.test', true, '{ "specialty_label": "Nutrición", "license": "MPPS-1008", "state": "Aragua"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000009', 'Dr. Miguel Ferrer', 'doctor', 'miguel.ferrer@healtng.test', true, '{"specialty_label": "Neurología", "license": "MPPS-1009", "state": "Miranda"}'::jsonb),
  ('d0000000-0000-0000-0000-000000000010', 'Dra. Patricia Salazar', 'doctor', 'patricia.salazar@healtng.test', true, '{"specialty_label": "Endocrinología", "license": "MPPS-1010", "state": "Nueva Esparta"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 3. INSERTAR PACIENTES
INSERT INTO public.profiles (id, full_name, role, email, onboarding_completed, metadata)
VALUES
  ('p0000000-0000-0000-0000-000000000001', 'Juan Pérez', 'patient', 'juan.perez@test.com', true, '{"phone": "+58 412-1112233", "age": 35, "gender": "Masculino", "document_id": "V-12345678"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000002', 'María López', 'patient', 'maria.lopez@test.com', true, '{"phone": "+58 424-2223344", "age": 28, "gender": "Femenino", "document_id": "V-87654321"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000003', 'Ana Martínez', 'patient', 'ana.m@test.com', true, '{"phone": "+58 414-3334455", "age": 42, "gender": "Femenino", "document_id": "V-11223344"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000004', 'Carlos Rodríguez', 'patient', 'carlos.r@test.com', true, '{"phone": "+58 416-7778899", "age": 50, "gender": "Masculino", "document_id": "V-44332211"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000005', 'Carmen Silva', 'patient', 'carmen.s@test.com', true, '{"phone": "+58 426-2223344", "age": 31, "gender": "Femenino", "document_id": "V-99887766"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000006', 'Luis Romero', 'patient', 'luis.r@test.com', true, '{"phone": "+58 416-9997788", "age": 24, "gender": "Masculino", "document_id": "V-33445566"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000007', 'Sofía Ramírez', 'patient', 'sofia.r@test.com', true, '{"phone": "+58 412-3331122", "age": 19, "gender": "Femenino", "document_id": "V-77665544"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000008', 'Ignacio Mendoza', 'patient', 'ignacio.m@test.com', true, '{"phone": "+58 424-2228899", "age": 60, "gender": "Masculino", "document_id": "V-55667788"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000009', 'Patricia Salazar', 'patient', 'patricia.s@test.com', true, '{"phone": "+58 416-1122334", "age": 45, "gender": "Femenino", "document_id": "V-22334455"}'::jsonb),
  ('p0000000-0000-0000-0000-000000000010', 'Roberto Fernández', 'patient', 'roberto.f@test.com', true, '{"phone": "+58 426-7788991", "age": 38, "gender": "Masculino", "document_id": "V-66778899"}'::jsonb)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 4. INSERTAR CITAS (Para que los pacientes aparezcan en el directorio del doctor)
-- Vinculamos pacientes con los primeros 3 doctores de la lista como ejemplo
INSERT INTO public.appointments (id, professional_id, patient_id, patient_name, date, time, status, reason, amount, metadata)
VALUES
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Juan Pérez', CURRENT_DATE::text, '09:00:00', 'confirmed', 'Control de Hipertensión', 80.00, '{"payMethod": "zelle"}'::jsonb),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000002', 'María López', CURRENT_DATE::text, '10:00:00', 'pending', 'Chequeo General', 50.00, '{"payMethod": "cash"}'::jsonb),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000003', 'Ana Martínez', CURRENT_DATE::text, '09:30:00', 'confirmed', 'Control Pediátrico', 60.00, '{"payMethod": "zelle"}'::jsonb),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000004', 'Carlos Rodríguez', CURRENT_DATE::text, '11:00:00', 'attended', 'Vacunación', 40.00, '{"payMethod": "cash"}'::jsonb),
  (gen_random_uuid(), 'd0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000005', 'Carmen Silva', CURRENT_DATE::text, '15:00:00', 'confirmed', 'Dolor de rodilla', 100.00, '{"payMethod": "transfer"}'::jsonb);
