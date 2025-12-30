import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// IMPORTS GLOBALES
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

// IMPORTS LOCALES
import PatientSummary from "./components/PatientSummary";
import SpecialtySelector from "./components/SpecialtySelector";
import SpecialtyDiagnosisCore from "./components/SpecialtyDiagnosisCore";
import ClinicalFindings from "./components/ClinicalFindings";
import DiagnosisSearch from "./components/DiagnosisSearch";
import TreatmentPlan from "./components/TreatmentPlan";

// MOCK DATA
const MOCK_PATIENT_DATA = {
  name: "María González",
  age: 45,
  gender: "Femenino",
  medicalHistory: {
    consultationReason: "Dolor en el pecho",
    symptoms: "Dificultad para respirar, dolor en el pecho al respirar profundamente",
    allergies: ["Penicilina", "Sulfonamidas"],
    currentMedications: ["Metformina 850mg", "Losartán 50mg"]
  },
  appointmentDetails: {
    date: "2025-11-14",
    time: "10:30",
    doctor: "Dr. Carlos Mendoza",
    specialty: "Cardiología"
  }
};

const ActionsSidebar = ({ onSave }) => (
  <div className="space-y-6">
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h4 className="font-semibold text-lg mb-4 text-gray-900">Acciones Rápidas</h4>
      <div className="space-y-3">
        <button className="w-full flex items-center text-left py-2 px-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md">
          <Icon name="Plus" size={16} className="mr-2 opacity-70" /> Crear Receta
        </button>
        <button className="w-full flex items-center text-left py-2 px-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md">
          <Icon name="Calendar" size={16} className="mr-2 opacity-70" /> Agendar Seguimiento
        </button>
        <button className="w-full flex items-center text-left py-2 px-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md">
          <Icon name="Share" size={16} className="mr-2 opacity-70" /> Derivar Especialista
        </button>
      </div>
    </div>
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <h4 className="font-semibold text-lg mb-4 text-gray-900">Guardar Diagnóstico</h4>
      <Button className="w-full mb-3" onClick={onSave} iconName="Save">
        Guardar Diagnóstico
      </Button>
      <button className="w-full flex items-center text-left py-2 px-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md">
        <Icon name="Download" size={16} className="mr-2 opacity-70" /> Exportar Reporte
      </button>
      <button className="w-full flex items-center text-left py-2 px-3 text-sm text-gray-800 hover:bg-gray-50 rounded-md">
        <Icon name="Mail" size={16} className="mr-2 opacity-70" /> Enviar al Paciente
      </button>
    </div>
  </div>
);

const PatientInfoHeader = ({ patient }) => {
  return (
    <div className="bg-blue-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold">Información del Paciente</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div><strong>Nombre: </strong>{patient.name}</div>
        <div><strong>Edad: </strong>{patient.age} años</div>
        <div><strong>Género: </strong>{patient.gender}</div>
        <div><strong>Médico: </strong>{patient.appointmentDetails.doctor}</div>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold">Motivo de Consulta</h4>
        <p>{patient.medicalHistory.consultationReason}</p>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold">Síntomas</h4>
        <p>{patient.medicalHistory.symptoms}</p>
      </div>
      <div className="mt-4">
        <h4 className="text-md font-semibold">Alergias</h4>
        <ul>
          {patient.medicalHistory.allergies.map((allergy, index) => (
            <li key={index}>{allergy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const NewDiagnosisForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado del Layout
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Estado del Formulario
  const [selectedSpecialty, setSelectedSpecialty] = useState("GEN");
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState("");
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState([]);
  const [clinicalFindings, setClinicalFindings] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "37.0",
    oxygenSaturation: "98",
  });
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [patientEducation, setPatientEducation] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Diagnóstico guardado con éxito (simulado).");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        userRole="doctor"
      />

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col items-center pt-16 overflow-y-auto transition-all duration-300">
        <Header
          userRole="doctor"
          onMenuToggle={() => setIsMobileSidebarOpen(true)}
        />
        <div className="w-full max-w-5xl p-4 lg:p-8 mx-auto">
          {/* Header de la página */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Nuevo Diagnóstico Médico
              </h1>
              <p className="text-gray-500 mt-1">
                Documentación diagnóstica con codificación ICD-10 internacional
              </p>
            </div>
            <Button
              variant="ghost"
              iconName="ArrowLeft"
              type="button"
              onClick={() => navigate(-1)}
            >
              Volver
            </Button>
          </div>
          
          {/* Información del Paciente en la cabecera */}
          <PatientInfoHeader patient={MOCK_PATIENT_DATA} />
          
          {/* Formulario principal centrado */}
          <form
            onSubmit={handleSubmit}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Columna principal */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Bloque diagnóstico principal */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                  <Icon name="Clipboard" size={20} className="mr-2 text-primary" /> Diagnóstico Principal
                </h3>
                <DiagnosisSearch
                  label="Diagnóstico Principal"
                  value={primaryDiagnosis}
                  onChange={setPrimaryDiagnosis}
                  required={true}
                />
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  Búsqueda basada en codificación ICD-10 internacional
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SpecialtySelector
                    label="Especialidad de la Consulta"
                    selectedSpecialty={selectedSpecialty}
                    onSpecialtyChange={setSelectedSpecialty}
                  />
                  <div className="flex gap-4 w-full">
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Severidad *</label>
                      <select className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
                        <option>Seleccione una opción</option>
                        <option>Leve</option>
                        <option>Moderada</option>
                        <option>Severa</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">Pronóstico *</label>
                      <select className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800">
                        <option>Seleccione una opción</option>
                        <option>Bueno</option>
                        <option>Reservado</option>
                        <option>Malo</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-4 border-t">
                  <h4 className="font-semibold text-base mb-3 text-primary">
                    Detalles Específicos ({selectedSpecialty})
                  </h4>
                  <SpecialtyDiagnosisCore specialtyCode={selectedSpecialty} />
                </div>
              </div>
              {/* Bloque síntomas y hallazgos */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                  <Icon name="Monitor" size={20} className="mr-2 text-primary" /> Síntomas y Hallazgos Clínicos
                </h3>
                <ClinicalFindings
                  findings={clinicalFindings}
                  onFindingsChange={setClinicalFindings}
                  vitalSigns={vitalSigns}
                  onVitalSignsChange={setVitalSigns}
                />
              </div>
              {/* Bloque tratamiento */}
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
                  <Icon name="Heart" size={20} className="mr-2 text-primary" /> Plan de Tratamiento
                </h3>
                <TreatmentPlan
                  treatmentPlan={treatmentPlan}
                  onTreatmentPlanChange={setTreatmentPlan}
                  followUpDate={followUpDate}
                  onFollowUpDateChange={setFollowUpDate}
                  patientEducation={patientEducation}
                  onPatientEducationChange={setPatientEducation}
                />
              </div>
            </div>
            {/* Columna acciones rápidas lateral */}
            <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-24 self-start">
              <ActionsSidebar onSave={handleSubmit} />
            </aside>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewDiagnosisForm;
