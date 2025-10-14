// src/pages/patient-profile/index.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

import QuickActions from "@/pages/patient-profile/components/QuickActions";
import PersonalInfo from "@/pages/patient-profile/components/PersonalInfo";
import MedicalHistory from "@/pages/patient-profile/components/MedicalHistory";
import PrescriptionsTab from "@/pages/patient-profile/components/PrescriptionsTab";
import AppointmentsTab from "@/pages/patient-profile/components/AppointmentsTab";


const PatientProfile = () => {
  const { id: idParam } = useParams();
  const id = idParam || "sin-id"; // defensivo
  const location = useLocation();
  const scope = new URLSearchParams(location.search).get("scope") || "doctor"; // 'doctor' | 'clinic'

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("medical"); // mostramos historial por defecto
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- Mock paciente (ejemplo con diagnósticos/recetas) ---
    const mockPatient = {
      id,
      fullName: "María Elena González",
      dni: "V-12345678",
      phone: "+58 424-123-4567",
      email: "maria.gonzalez@email.com",
      address: "Av. Francisco de Miranda, Los Palos Grandes, Caracas",
      dateOfBirth: "1985-03-15",
      age: 39,
      gender: "Femenino",
      allergies: ["Penicilina", "Polen", "Mariscos"],
      chronicConditions: ["Hipertensión Arterial", "Diabetes Tipo 2"],
      bloodType: "O+",
      emergencyContact: {
        name: "Carlos González",
        relationship: "Esposo",
        phone: "+58 414-987-6543",
      },
      insurance: {
        provider: "Seguros Caracas",
        policyNumber: "SC-789456123",
        status: "Vigente",
      },
      lastVisit: "2024-08-15",
      nextAppointment: "2024-09-10 10:30",
      avatarUrl: "/assets/images/avatar-woman-1.jpg",
      status: "active",
      diagnoses: [
        {
          id: "dx1",
          title: "Hipertensión Arterial Sistémica",
          date: "2024-08-15",
          doctorId: "dr1",
          doctorName: "Dr. María González",
          icd10: "I10",
          notes:
            "Paciente con cifras tensionales elevadas. Inicia tratamiento antihipertensivo.",
          status: "Firmado",
        },
        {
          id: "dx2",
          title: "Diabetes Mellitus Tipo 2",
          date: "2024-07-22",
          doctorId: "dr2",
          doctorName: "Dr. Carlos Pérez",
          icd10: "E11",
          notes:
            "Diabetes de novo. Glucemia en ayunas 145 mg/dL. Manejo nutricional y metformina.",
          status: "Firmado",
        },
      ],
      prescriptions: [
        {
          id: "rx1",
          issueDate: "2024-08-15",
          validUntil: "2024-11-15",
          status: "Emitida",
          pharmacy: "Farmacia San Juan",
          signedBy: "Dr. María González",
          meds: [
            {
              drug: "Losartán 50mg",
              dose: "1 tableta",
              freq: "cada 12 horas",
              duration: "30 días",
              instructions: "Tomar con alimentos",
            },
            {
              drug: "Metformina 850mg",
              dose: "1 tableta",
              freq: "cada 12 horas",
              duration: "30 días",
              instructions: "Tomar después de las comidas",
            },
          ],
        },
      ],
      referrals: [
        {
          id: "ref1",
          date: "2024-08-15",
          toSpecialty: "Cardiología",
          toProvider: "Dr. Antonio Rodríguez",
          reason:
            "Evaluación de hipertensión arterial de reciente diagnóstico",
          priority: "Normal",
          signedBy: "Dr. María González",
        },
      ],
    };

    setTimeout(() => {
      setPatient(mockPatient);
      setIsLoading(false);
    }, 300);
  }, [id]);

  const handleQuickAction = (action) => {
    const baseUrl =
      action === "prescription"
        ? "/prescriptions/new"
        : action === "diagnosis"
        ? "/diagnosis/new"
        : action === "referral"
        ? "/referrals/new"
        : null;

    if (baseUrl) {
      window.location.href = `${baseUrl}?patientId=${encodeURIComponent(id)}`;
    }
  };

  const tabs = [
    { key: "personal", label: "Información Personal", icon: "User" },
    { key: "medical", label: "Historial Médico", icon: "FileText" },
    { key: "prescriptions", label: "Recetas", icon: "Pill" },
    { key: "appointments", label: "Citas", icon: "Calendar" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          userRole={scope === "clinic" ? "clinic" : "doctor"}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <Sidebar
          userRole={scope === "clinic" ? "clinic" : "doctor"}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main
          className={`pt-16 transition-all duration-300 ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                Cargando perfil del paciente...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          userRole={scope === "clinic" ? "clinic" : "doctor"}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <Sidebar
          userRole={scope === "clinic" ? "clinic" : "doctor"}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main
          className={`pt-16 transition-all duration-300 ${
            isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
          }`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <Icon
                name="AlertCircle"
                size={48}
                className="mx-auto mb-4 text-error"
              />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Paciente no encontrado
              </h2>
              <p className="text-muted-foreground mb-4">
                El paciente que buscas no existe o no tienes permisos para
                verlo.
              </p>
              <Button
                onClick={() =>
                  (window.location.href =
                    scope === "clinic"
                      ? "/patients?scope=clinic&groupBy=specialty"
                      : "/patients")
                }
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Volver a Pacientes
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo patient={patient} />;
      case "medical":
        return <MedicalHistory patient={patient} />;
      case "prescriptions":
        return <PrescriptionsTab prescriptions={patient?.prescriptions} />;
      case "appointments":
        return <AppointmentsTab patient={patient} />;
      default:
        return <MedicalHistory patient={patient} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={scope === "clinic" ? "clinic" : "doctor"}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <Sidebar
        userRole={scope === "clinic" ? "clinic" : "doctor"}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      <main
        className={`pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <div className="p-6">
          {/* Breadcrumbs según scope */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                (window.location.href =
                  scope === "clinic"
                    ? "/patients?scope=clinic&groupBy=specialty"
                    : "/patients")
              }
              className="p-0 h-auto font-normal text-muted-foreground hover:text-foreground"
            >
              {scope === "clinic" ? "Pacientes del Centro" : "Mis Pacientes"}
            </Button>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground font-medium">
              {patient?.fullName}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Header paciente */}
              <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                        {patient?.avatarUrl ? (
                          <img
                            src={patient?.avatarUrl}
                            alt={patient?.fullName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : null}
                        {!patient?.avatarUrl && (
                          <div className="w-full h-full flex items-center justify-center text-primary font-medium text-xl">
                            {patient?.fullName
                              ?.split(" ")
                              ?.map((w) => w?.[0])
                              ?.join("")
                              ?.toUpperCase()
                              ?.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-foreground">
                          {patient?.fullName}
                        </h1>
                        <p className="text-muted-foreground">
                          {patient?.dni} • {patient?.age} años •{" "}
                          {patient?.gender}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Grupo sanguíneo: {patient?.bloodType} • Última visita:{" "}
                          {new Date(patient?.lastVisit).toLocaleDateString(
                            "es-VE"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          patient?.status === "active"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {patient?.status === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-border">
                  <nav className="flex space-x-0">
                    {tabs.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
                          activeTab === t.key
                            ? "border-primary text-primary bg-primary/5"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                        }`}
                      >
                        <Icon name={t.icon} size={16} />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Contenido de pestaña */}
              <div className="bg-card rounded-lg border border-border">
                {renderTabContent()}
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="lg:col-span-1">
              <QuickActions onAction={handleQuickAction} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientProfile;
