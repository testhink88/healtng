/**
 * src/data/cie10_catalog.js
 * BASE DE DATOS MAESTRA (CIE-10) PARA DEMO
 * Cobertura: 100% de las 55 Especialidades del SQL de Healtng.
 */

export const CIE10_CATALOG = [
  // ==========================================
  // 1. ATENCIÓN PRIMARIA (General, Familiar, Geriatría)
  // ==========================================
  { code: "Z00.0", name: "Examen médico general (Chequeo de rutina)", category: "Medicina General", searchTerms: "control sano chequeo rutina" },
  { code: "R53", name: "Malestar y fatiga (Debilidad general)", category: "Medicina General", searchTerms: "cansancio fatiga decaimiento" },
  { code: "R50.9", name: "Fiebre, no especificada", category: "Medicina General", searchTerms: "fiebre temperatura calentura" },
  { code: "Z73.3", name: "Estrés relacionado con el trabajo (Burnout)", category: "Medicina Familiar", searchTerms: "estres trabajo ansiedad burnout" },
  { code: "R54", name: "Senilidad (Debilidad del anciano)", category: "Geriatría", searchTerms: "vejez anciano debilidad geriatria" },
  { code: "F03", name: "Demencia, no especificada", category: "Geriatría", searchTerms: "memoria olvido demencia viejo" },
  { code: "Z51.5", name: "Cuidados paliativos", category: "Cuidados Paliativos", searchTerms: "dolor cancer terminal fin vida" },
  { code: "Z23", name: "Necesidad de inmunización (Vacunas)", category: "Medicina Preventiva", searchTerms: "vacuna inyeccion prevencion" },

  // ==========================================
  // 2. MEDICINA INTERNA (Cardio, Neumo, Gastro, etc.)
  // ==========================================
  // Cardiología
  { code: "I10", name: "Hipertensión esencial (HTA)", category: "Cardiología", searchTerms: "presion alta tension hipertensión" },
  { code: "I21.9", name: "Infarto agudo del miocardio (IAM)", category: "Cardiología", searchTerms: "infarto pecho dolor ataque corazon" },
  { code: "I50.9", name: "Insuficiencia cardíaca", category: "Cardiología", searchTerms: "falla corazon disnea edema" },
  { code: "I48", name: "Fibrilación auricular", category: "Cardiología", searchTerms: "arritmia palpitaciones ritmo irregular" },
  
  // Neumonología
  { code: "J45.9", name: "Asma, no especificada", category: "Neumonología", searchTerms: "ahogo silbido pecho aire" },
  { code: "J44.9", name: "EPOC", category: "Neumonología", searchTerms: "cigarrillo humo tos cronica" },
  { code: "J18.9", name: "Neumonía", category: "Neumonología", searchTerms: "pulmonia fiebre tos flema" },

  // Gastroenterología
  { code: "K29.7", name: "Gastritis", category: "Gastroenterología", searchTerms: "ardor estomago acidez" },
  { code: "K58.0", name: "Síndrome del intestino irritable (Colon)", category: "Gastroenterología", searchTerms: "colon inflamacion gases dolor" },
  { code: "K21.9", name: "Reflujo gastroesofágico (ERGE)", category: "Gastroenterología", searchTerms: "reflujo agrieras acidez" },
  { code: "K76.0", name: "Hígado graso (Esteatosis)", category: "Hepatología", searchTerms: "higado grasa obesidad alcohol" },

  // Endocrinología
  { code: "E11.9", name: "Diabetes mellitus tipo 2", category: "Endocrinología", searchTerms: "azucar glucosa diabetes sed" },
  { code: "E03.9", name: "Hipotiroidismo", category: "Endocrinología", searchTerms: "tiroides tsh lento peso" },
  { code: "E66.0", name: "Obesidad", category: "Endocrinología", searchTerms: "peso gordo imc sobrepeso" },

  // Nefrología
  { code: "N18.9", name: "Enfermedad renal crónica", category: "Nefrología", searchTerms: "riñon fallo renal dialisis creatinina" },
  { code: "N04", name: "Síndrome nefrótico", category: "Nefrología", searchTerms: "orina espuma edema riñon" },

  // Neurología
  { code: "G43.9", name: "Migraña", category: "Neurología", searchTerms: "dolor cabeza jaqueca aura" },
  { code: "G40.9", name: "Epilepsia", category: "Neurología", searchTerms: "convulsion ataque crisis" },
  { code: "I64", name: "Accidente cerebrovascular (ACV)", category: "Neurología", searchTerms: "ictus derrame trombosis" },

  // Reumatología
  { code: "M06.9", name: "Artritis reumatoide", category: "Reumatología", searchTerms: "articulacion dolor manos deformidad" },
  { code: "M32.9", name: "Lupus eritematoso sistémico", category: "Reumatología", searchTerms: "les autoimune piel riñon" },
  { code: "M10.9", name: "Gota", category: "Reumatología", searchTerms: "acido urico pie dedo dolor" },

  // Infectología
  { code: "B20", name: "Enfermedad por VIH", category: "Infectología", searchTerms: "sida virus inmunodeficiencia" },
  { code: "A90", name: "Dengue", category: "Infectología", searchTerms: "mosquito fiebre huesos plaquetas" },
  
  // Hematología
  { code: "D50.9", name: "Anemia ferropénica", category: "Hematología", searchTerms: "hierro sangre palidez cansancio" },
  { code: "C91.0", name: "Leucemia", category: "Hematología", searchTerms: "cancer sangre globulos blancos" },

  // Dermatología
  { code: "L70.0", name: "Acné vulgar", category: "Dermatología", searchTerms: "granos espinillas cara piel" },
  { code: "L20.9", name: "Dermatitis atópica", category: "Dermatología", searchTerms: "alergia piel picazon eczema" },
  { code: "C43.9", name: "Melanoma maligno", category: "Dermatología", searchTerms: "cancer piel lunar mancha" },

  // ==========================================
  // 3. BLOQUE QUIRÚRGICO (Cirugía, Trauma, ORL, Oftalmo)
  // ==========================================
  // Cirugía General
  { code: "K35.8", name: "Apendicitis aguda", category: "Cirugía General", searchTerms: "apendice dolor fosa iliaca" },
  { code: "K80.2", name: "Colelitiasis (Piedras vesícula)", category: "Cirugía General", searchTerms: "vesicula piedras dolor biliar" },
  { code: "K40.9", name: "Hernia inguinal", category: "Cirugía General", searchTerms: "hernia bulto ingle" },

  // Traumatología
  { code: "S82.4", name: "Fractura de peroné", category: "Traumatología", searchTerms: "hueso roto pierna fractura" },
  { code: "M54.5", name: "Lumbago", category: "Traumatología", searchTerms: "espalda dolor lumbar columna" },
  { code: "S93.4", name: "Esguince de tobillo", category: "Traumatología", searchTerms: "torcedura pie ligamento" },
  { code: "M17.9", name: "Gonartrosis (Rodilla)", category: "Traumatología", searchTerms: "artrosis rodilla desgaste dolor" },

  // Otorrinolaringología (COMPLETO)
  { code: "J03.9", name: "Amigdalitis aguda", category: "Otorrinolaringología", searchTerms: "garganta anginas dolor tragar" },
  { code: "J01.9", name: "Sinusitis aguda", category: "Otorrinolaringología", searchTerms: "nariz moco congestion cara" },
  { code: "H66.9", name: "Otitis media", category: "Otorrinolaringología", searchTerms: "oido dolor infeccion" },
  { code: "H91.9", name: "Hipoacusia (Sordera)", category: "Otorrinolaringología", searchTerms: "oido escuchar sordo audiometria" },
  { code: "J34.2", name: "Desviación tabique nasal", category: "Otorrinolaringología", searchTerms: "nariz respirar tabique operacion" },
  { code: "R04.0", name: "Epistaxis", category: "Otorrinolaringología", searchTerms: "sangrado nariz sangre" },

  // Oftalmología
  { code: "H10.9", name: "Conjuntivitis", category: "Oftalmología", searchTerms: "ojo rojo infeccion lagaña" },
  { code: "H25.9", name: "Catarata senil", category: "Oftalmología", searchTerms: "vista nublada lente intraocular" },
  { code: "H52.1", name: "Miopía", category: "Oftalmología", searchTerms: "vista lejos lentes borroso" },

  // Urología
  { code: "N20.0", name: "Litiasis renal (Cálculo)", category: "Urología", searchTerms: "piedra riñon colico renal" },
  { code: "N40", name: "Hiperplasia prostática", category: "Urología", searchTerms: "prostata orina hombre agrandada" },
  { code: "N39.0", name: "Infección urinaria", category: "Urología", searchTerms: "cistitis ardor orina" },

  // Cirugía Plástica / Maxilofacial
  { code: "T31.0", name: "Quemaduras", category: "Cirugía Plástica", searchTerms: "piel fuego quemado cicatriz" },
  { code: "K07.1", name: "Anomalías dentofaciales", category: "Cirugía Oral y Maxilofacial", searchTerms: "mandibula dientes mordida cara" },
  { code: "I83.9", name: "Várices extremidades inferiores", category: "Angiología", searchTerms: "venas piernas circulacion vascular" },

  // ==========================================
  // 4. MATERNO INFANTIL
  // ==========================================
  { code: "O80", name: "Parto espontáneo", category: "Ginecología y Obstetricia", searchTerms: "parto nacimiento bebe embarazo" },
  { code: "O14.9", name: "Preeclampsia", category: "Ginecología y Obstetricia", searchTerms: "presion alta embarazo riesgo" },
  { code: "N97.9", name: "Infertilidad femenina", category: "Reproducción Humana", searchTerms: "bebe no puedo fertilidad esteril" },
  { code: "J21.9", name: "Bronquiolitis", category: "Pediatría", searchTerms: "bebe respirar virus vrs" },
  { code: "B01.9", name: "Varicela", category: "Pediatría", searchTerms: "lechina granos niño pedia" },
  { code: "P07.3", name: "Recién nacido prematuro", category: "Neonatología", searchTerms: "bebe pretermino incubadora" },

  // ==========================================
  // 5. SALUD MENTAL
  // ==========================================
  { code: "F32.9", name: "Depresión mayor", category: "Psiquiatría", searchTerms: "tristeza animo suicidio" },
  { code: "F41.1", name: "Ansiedad generalizada", category: "Psiquiatría", searchTerms: "nervios panico angustia" },
  { code: "F20.9", name: "Esquizofrenia", category: "Psiquiatría", searchTerms: "voces locura psicosis" },
  { code: "F90.9", name: "TDAH", category: "Psiquiatría Infantil", searchTerms: "hiperactividad niño atencion escuela" },
  { code: "F43.1", name: "Estrés postraumático", category: "Psicología Clínica", searchTerms: "trauma evento choque" },

  // ==========================================
  // 6. APOYO Y BIENESTAR (Nutri, Sexo, Fisioterapia, etc.)
  // ==========================================
  // Nutrición
  { code: "E66.9", name: "Obesidad mórbida", category: "Nutriología y Nutrición", searchTerms: "peso dieta bariatrica gordo" },
  { code: "E44.0", name: "Desnutrición moderada", category: "Nutriología y Nutrición", searchTerms: "peso bajo flaco comer" },
  
  // Sexología
  { code: "F52.2", name: "Disfunción eréctil", category: "Sexología Médica", searchTerms: "sexo ereccion impotencia hombre" },
  { code: "F52.0", name: "Falta de deseo sexual", category: "Sexología Médica", searchTerms: "libido sexo ganas mujer" },
  { code: "F52.4", name: "Eyaculación precoz", category: "Sexología Médica", searchTerms: "rapido sexo hombre" },

  // Fisioterapia / Medicina del Deporte
  { code: "M54.2", name: "Cervicalgia", category: "Fisioterapia", searchTerms: "cuello dolor tension contractura" },
  { code: "M62.8", name: "Atrofia muscular", category: "Fisioterapia", searchTerms: "debilidad fuerza rehabilitacion" },
  { code: "S83.5", name: "Lesión ligamento cruzado (Rodilla)", category: "Medicina del Deporte", searchTerms: "rodilla futbol deporte ligamento" },
  { code: "M77.1", name: "Epicondilitis (Codo de tenista)", category: "Medicina del Deporte", searchTerms: "codo dolor tenis deporte" },

  // Fonoaudiología
  { code: "R47.0", name: "Disfasia y afasia", category: "Fonoaudiología", searchTerms: "habla lenguaje voz palabras" },
  { code: "R13", name: "Disfagia", category: "Fonoaudiología", searchTerms: "tragar comer atorarse" },

  // Otros
  { code: "Z57.9", name: "Riesgo laboral", category: "Salud Ocupacional", searchTerms: "trabajo riesgo accidente ocupacional" },
  { code: "L00", name: "Procedimiento estético", category: "Medicina Estética", searchTerms: "botox relleno cara arrugas" },
  { code: "G47.3", name: "Apnea del sueño", category: "Medicina del Sueño", searchTerms: "ronquidos dormir respirar sueño" },
  { code: "R52.2", name: "Dolor crónico", category: "Medicina del Dolor", searchTerms: "dolor constante algologia" }
];