import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const ReportConfigurator = ({ isOpen, onClose, onConfirm, patient, diagnosisData, specialtyName }) => {
  if (!isOpen) return null;

  // 1. CARGAR PERFIL DEL MÉDICO (Logo, Firma, Membrete)
  const [doctorProfile, setDoctorProfile] = useState(null);
  
  useEffect(() => {
    const saved = localStorage.getItem("DOCTOR_PROFILE");
    if (saved) {
      setDoctorProfile(JSON.parse(saved));
    } else {
      // Fallback por defecto si no ha configurado nada
      setDoctorProfile({
        name: "Dr. Usuario Healtng",
        specialty: "Medicina General",
        address: "Configura tu dirección en Perfil",
        phone: "000-0000",
        license: "MPPS: 0000",
      });
    }
  }, []);

  const [sections, setSections] = useState({
    evolution: true, vitals: true, diagnosis: true, plan: true,
  });

  // GENERAR TEXTO PLANO (Para guardar en BD interna)
  const generatePlainText = () => {
    let text = `INFORME CLÍNICO: ${specialtyName}\nPACIENTE: ${patient.name}\n\n`;
    if (sections.evolution) text += `EVOLUCIÓN:\n${diagnosisData.clinical_note || 'N/A'}\n\n`;
    if (sections.vitals) {
        text += `SIGNOS VITALES: FC: ${diagnosisData.heart_rate || '--'} | Temp: ${diagnosisData.temp || '--'} | TA: ${diagnosisData.bp_systolic || '--'}/${diagnosisData.bp_diastolic || '--'}\n\n`;
    }
    if (sections.diagnosis) text += `DIAGNÓSTICO: ${diagnosisData.main_diagnosis_cie10?.name || 'N/A'}\n\n`;
    if (sections.plan) text += `PLAN Y TRATAMIENTO:\n${diagnosisData.treatment_plan || 'N/A'}\n`;
    return text;
  };

  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-md">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">
        
        {/* IZQUIERDA: CONTROLES */}
        <div className="w-1/4 bg-gray-50 border-r border-gray-200 flex flex-col p-6">
          <h3 className="font-bold text-gray-900 mb-1">Personalizar Informe</h3>
          <p className="text-xs text-gray-500 mb-6">Elige qué secciones mostrar en la hoja membretada.</p>
          
          <div className="space-y-3 flex-1">
            {Object.keys(sections).map((key) => (
              <label key={key} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400">
                <input type="checkbox" checked={sections[key]} onChange={() => toggleSection(key)} className="rounded text-blue-600" />
                <span className="text-sm capitalize text-gray-700">{key.replace('_', ' ')}</span>
              </label>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
             <Button onClick={() => onConfirm(generatePlainText())} className="w-full bg-[#0E39B1] text-white">
               Confirmar y Generar PDF
             </Button>
             <button onClick={onClose} className="w-full mt-3 text-sm text-gray-500 hover:text-gray-900">Cancelar</button>
          </div>
        </div>

        {/* DERECHA: VISTA PREVIA WYSIWYG (LO QUE VES ES LO QUE OBTIENES) */}
        <div className="w-3/4 bg-gray-200 p-8 overflow-y-auto flex justify-center">
          
          {/* HOJA A4 (210mm x 297mm) */}
          <div className="bg-white shadow-2xl w-[210mm] min-h-[297mm] p-[15mm] flex flex-col relative text-gray-900 font-serif">
            
            {/* 1. MEMBRETE / CABECERA */}
            <header className="border-b-2 border-[#0E39B1] pb-4 mb-8 flex justify-between items-end">
               <div>
                  <h1 className="text-2xl font-bold text-[#0E39B1]">{doctorProfile?.name}</h1>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">{doctorProfile?.specialty}</p>
                  <p className="text-xs text-gray-400 mt-1">{doctorProfile?.address} • {doctorProfile?.phone}</p>
               </div>
               {doctorProfile?.logo && (
                 <img src={doctorProfile.logo} alt="Logo" className="h-20 object-contain" />
               )}
            </header>

            {/* 2. DATOS DEL PACIENTE */}
            <section className="bg-gray-50 p-4 rounded-lg mb-8 border border-gray-100 flex justify-between text-sm font-sans">
               <div>
                 <span className="block text-xs text-gray-400 uppercase">Paciente</span>
                 <strong className="text-lg">{patient.name}</strong>
               </div>
               <div>
                 <span className="block text-xs text-gray-400 uppercase">Identificación</span>
                 <span>{patient.dni}</span>
               </div>
               <div>
                 <span className="block text-xs text-gray-400 uppercase">Edad</span>
                 <span>{patient.age} años</span>
               </div>
               <div>
                 <span className="block text-xs text-gray-400 uppercase">Fecha</span>
                 <span>{new Date().toLocaleDateString()}</span>
               </div>
            </section>

            {/* 3. CUERPO DEL INFORME (Renderizado Condicional) */}
            <div className="flex-1 space-y-6 text-sm leading-relaxed text-justify">
              
              {sections.evolution && diagnosisData.clinical_note && (
                <div>
                  <h4 className="font-bold text-[#0E39B1] text-xs uppercase mb-1 tracking-widest border-b border-gray-100 pb-1">Nota de Evolución</h4>
                  <p className="whitespace-pre-wrap mt-2">{diagnosisData.clinical_note}</p>
                </div>
              )}

              {sections.vitals && (diagnosisData.heart_rate || diagnosisData.temp || diagnosisData.bp_systolic) && (
                 <div className="bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                    <h4 className="font-bold text-gray-400 text-[10px] uppercase mb-1">Constantes Vitales</h4>
                    <div className="flex gap-6 text-xs font-sans">
                       <span><strong>FC:</strong> {diagnosisData.heart_rate || '--'} lpm</span>
                       <span><strong>Temp:</strong> {diagnosisData.temp || '--'} °C</span>
                       <span><strong>TA:</strong> {diagnosisData.bp_systolic || '--'}/{diagnosisData.bp_diastolic || '--'} mmHg</span>
                    </div>
                 </div>
              )}

              {sections.diagnosis && diagnosisData.main_diagnosis_cie10 && (
                <div className="p-4 bg-blue-50/50 border-l-4 border-[#0E39B1] rounded-r-lg">
                   <h4 className="font-bold text-[#0E39B1] text-xs uppercase mb-1">Impresión Diagnóstica</h4>
                   <p className="font-bold text-lg">{diagnosisData.main_diagnosis_cie10.name}</p>
                   <p className="text-xs text-[#0E39B1]/70 font-mono mt-0.5">CIE-10: {diagnosisData.main_diagnosis_cie10.code}</p>
                </div>
              )}

              {sections.plan && diagnosisData.treatment_plan && (
                <div>
                  <h4 className="font-bold text-[#0E39B1] text-xs uppercase mb-1 tracking-widest border-b border-gray-100 pb-1">Plan Terapéutico</h4>
                  <p className="whitespace-pre-wrap mt-2">{diagnosisData.treatment_plan}</p>
                </div>
              )}
            </div>

            {/* 4. PIE DE PÁGINA Y FIRMA */}
            <footer className="mt-12 pt-8 text-center flex flex-col items-center">
               {doctorProfile?.signature && (
                 <img src={doctorProfile.signature} alt="Firma" className="h-24 object-contain -mb-6 relative z-10 mix-blend-multiply" />
               )}
               <div className="border-t border-gray-300 w-64 pt-2 mt-4">
                  <p className="font-bold text-gray-900">{doctorProfile?.name}</p>
                  <p className="text-xs text-gray-500">{doctorProfile?.license}</p>
               </div>
               
               <div className="mt-8 w-full border-t border-gray-100 pt-2 flex justify-between items-center text-[10px] text-gray-400 font-sans">
                  <span>Generado por Healtng - Historia Clínica Digital Unificada</span>
                  <span>ID: {Date.now().toString(36).toUpperCase()}</span>
               </div>
            </footer>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfigurator;