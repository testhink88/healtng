import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

import QuickActions from "@/pages/patient-profile/components/QuickActions";
import PersonalInfo from "@/pages/patient-profile/components/PersonalInfo";
import MedicalHistory from "@/pages/patient-profile/components/MedicalHistory";
import PrescriptionsTab from "@/pages/patient-profile/components/PrescriptionsTab";
import AppointmentsTab from "@/pages/patient-profile/components/AppointmentsTab";

import ConsultationDetailsModal from "@/components/patient/ConsultationDetailsModal";
import { getPatientById, fetchPatientHistory } from "@/api/patient/patients";
import { fetchAppointmentsByPatient } from "@/api/appointments";

const formatDateVE = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("es-VE");
};

const calculateAge = (birthday) => {
  if (!birthday) return "??";
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : "??";
};

const PatientProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const scope = new URLSearchParams(location.search).get("scope") || "doctor";
  const userRole = scope === "clinic" ? "clinic" : "doctor";

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("medical");
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);

  const tabs = [
    { key: "medical", label: "Historial Médico", icon: "FileText" },
    { key: "prescriptions", label: "Recetas", icon: "Pill" },
    { key: "appointments", label: "Citas", icon: "Calendar" },
    { key: "personal", label: "Información Personal", icon: "User" },
  ];

  const loadPatientData = async () => {
    setIsLoading(true);
    try {
      const profileData = await getPatientById(id);
      if (!profileData) {
        setPatient(null);
        return;
      }

      const history = await fetchPatientHistory(id);
      const apts = await fetchAppointmentsByPatient(id);

      setPatient({
        ...profileData,
        id: profileData.id,
        fullName: profileData.full_name,
        dni: profileData.metadata?.document_id || profileData.metadata?.dni || "---",
        age: profileData.metadata?.age || calculateAge(profileData.metadata?.date_of_birth),
        gender: profileData.metadata?.gender || "No definido",
        dateOfBirth: profileData.metadata?.date_of_birth || "",
        bloodType: profileData.metadata?.blood_type || "",
        address: profileData.metadata?.address || "",
        emergencyContact: profileData.metadata?.emergency_contact || {},
        insurance: profileData.metadata?.insurance || {},
        lastVisit: profileData.metadata?.last_visit_at,
        status: "active",
        diagnoses: (history.diagnoses || []).map(d => ({
          ...d,
          date: d.diagnosis_date || d.created_at,
          specialtyName: d.metadata?.specialty_code || "Medicina General",
          preview: d.condition || "Consulta Médica",
          doctorName: d.doctor?.full_name || "Médico",
          // Adaptar metadata para el modal de detalles
          data: {
             ...d.metadata,
             ...d.metadata?.full_data, // Expandir datos guardados en el formulario
             clinical_findings: d.findings || d.metadata?.full_data?.physical_exam,
             treatment_plan: d.plan || d.metadata?.full_data?.plan,
             prescriptions: d.metadata?.full_data?.prescriptions || d.metadata?.prescriptions || []
          }
        })),
        treatments: history.treatments || [],
        encounters: history.encounters || [],
        email: profileData.email,
        phone: profileData.metadata?.phone || "Sin teléfono"
      });
      setAppointments(apts || []);
    } catch (err) {
      console.error("Error loading patient profile:", err);
      setPatient(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadPatientData();
  }, [id, location.key]);

  const handleOpenConsultation = (diagId) => {
    if (!diagId) return;
    const found = patient?.diagnoses?.find((d) => String(d.id) === String(diagId));
    if (found) setSelectedDiagnosis(found);
  };

  const goBackUrl = scope === "clinic" ? "/patients?scope=clinic" : "/patients";

  const handleQuickAction = (action) => {
    const clinicSuffix = scope === "clinic" ? "?scope=clinic" : "";
    const actionRoutes = {
      evolution: `/patients/${id}/diagnosis/new${clinicSuffix}`,
      diagnosis: `/patients/${id}/diagnosis/new${clinicSuffix}`,
      prescription: `/patients/${id}/prescriptions/new${clinicSuffix}`,
      referral: `/patients/${id}/referrals/new${clinicSuffix}`,
      appointment: `/new-patient-appointment?patientId=${id}`,
    };

    if (actionRoutes[action]) navigate(actionRoutes[action]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} />
        <Sidebar userRole={userRole} />
        <main className="pt-16 lg:ml-64">
          <div className="p-4 lg:p-6 max-w-5xl mx-auto">
            <div className="bg-card rounded-lg border border-border p-10">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Icon name="Loader2" size={18} className="animate-spin text-primary" />
                </span>
                <span>Sincronizando expediente…</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) return <div className="p-20 text-center font-normal">Paciente no encontrado</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setIsMobileMenuOpen(true)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 uppercase tracking-wider">
            <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate(goBackUrl)}>
              {scope === "clinic" ? "Centro Médico" : "Mis Pacientes"}
            </span>
            <Icon name="ChevronRight" size={12} />
            <span className="text-foreground">Expediente Digital</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Header paciente */}
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-semibold text-3xl">
                        {patient.fullName?.charAt(0)}
                      </div>

                      <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                          {patient.fullName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                          <span className="text-primary font-medium">{patient.dni}</span>
                          <span>•</span>
                          <span>{patient.age === "??" ? "N/D" : `${patient.age} años`}</span>
                          <span>•</span>
                          <span className="capitalize">{patient.gender}</span>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                            Paciente Activo
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Última visita: {formatDateVE(patient.lastVisit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-t border-border bg-muted/20 overflow-x-auto">
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      className={`px-4 py-4 text-[11px] uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
                        activeTab === t.key
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="bg-card rounded-lg border border-border min-h-[400px]">
                <div className="p-6 lg:p-8">
                  {activeTab === "medical" && (
                    <MedicalHistory patient={patient} onShowDetails={(diag) => setSelectedDiagnosis(diag)} />
                  )}

                  {activeTab === "prescriptions" && (
                    <PrescriptionsTab patient={patient} onOpenConsultation={handleOpenConsultation} />
                  )}

                   {activeTab === "appointments" && (
                    <AppointmentsTab 
                      patient={patient} 
                      allAppointments={appointments} 
                      onUpdate={loadPatientData}
                      onOpenConsultation={handleOpenConsultation} 
                    />
                  )}

                  {activeTab === "personal" && <PersonalInfo patient={patient} onUpdate={loadPatientData} />}
                </div>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="lg:col-span-1 space-y-4">
              <Button
                onClick={() => handleQuickAction("evolution")}
                className="w-full py-4 bg-primary text-primary-foreground rounded-md flex items-center justify-center gap-2 border-none"
              >
                <Icon name="Zap" size={20} />
                Nueva Evolución
              </Button>

              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>
        </div>

        <ConsultationDetailsModal
          isOpen={!!selectedDiagnosis}
          diagnosis={selectedDiagnosis}
          onClose={() => setSelectedDiagnosis(null)}
        />
      </main>
    </div>
  );
};

export default PatientProfile;
