// src/pages/patient-health-profile/index.jsx
import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";

const MOCK_PROFILE = {
  demographics: {
    fullName: "María González",
    gender: "female",
    age: 45,
  },
  allergies: [
    { id: "a1", name: "Penicilina", reaction: "Anafilaxia" },
    { id: "a2", name: "Maní", reaction: "Urticaria" },
  ],
  chronicConditions: [
    { id: "c1", name: "Hipertensión arterial" },
    { id: "c2", name: "Diabetes tipo 2" },
  ],
  medications: [
    { id: "m1", name: "Metformina", dose: "850 mg", frequency: "Cada 12 h" },
  ],
};

const PatientHealthProfilePage = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [defaultShareScope, setDefaultShareScope] = useState("clinical");
  const [includeSensitive, setIncludeSensitive] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* SIDEBAR */}
      <Sidebar
        userRole="patient"
        isCollapsed={sidebarCollapsed}
        isMobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* CONTENIDO PRINCIPAL */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        <Header
          userRole="patient"
          isAuthenticated={true}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />

        <div className="p-4 lg:p-6 max-w-6xl mx-auto space-y-6">
          {/* TÍTULO */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Mi Salud
              </h1>
              <p className="text-muted-foreground mt-1">
                Revisa tu información médica y decide qué compartir con tus
                médicos.
              </p>
            </div>
          </div>

          {/* FILA SUPERIOR: RESUMEN + PASAPORTE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resumen del paciente */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-1">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="User" className="w-5 h-5 text-primary mr-2" />
                Resumen del Paciente
              </h2>
              <p className="font-medium text-foreground">
                {MOCK_PROFILE.demographics.fullName}
              </p>
              <p className="text-sm text-muted-foreground">
                {MOCK_PROFILE.demographics.age} años ·{" "}
                {MOCK_PROFILE.demographics.gender === "female"
                  ? "Femenino"
                  : "Masculino"}
              </p>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs uppercase">
                    Alergias
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {MOCK_PROFILE.allergies.map((a) => (
                      <span
                        key={a.id}
                        className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-100"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground text-xs uppercase">
                    Condiciones crónicas
                  </span>
                  <ul className="mt-1 list-disc list-inside text-foreground text-sm">
                    {MOCK_PROFILE.chronicConditions.map((c) => (
                      <li key={c.id}>{c.name}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-muted-foreground text-xs uppercase">
                    Medicación actual
                  </span>
                  <ul className="mt-1 text-sm">
                    {MOCK_PROFILE.medications.map((m) => (
                      <li key={m.id}>
                        {m.name} – {m.dose} ({m.frequency})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pasaporte de Salud (lo que se comparte) */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="Shield" className="w-5 h-5 text-primary mr-2" />
                Pasaporte de Salud que se comparte
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Esta es la información que se envía a los médicos cuando
                reservas una cita o compras un servicio. Puedes ajustar la
                privacidad más abajo.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="border rounded-lg p-3 bg-muted/40">
                  <p className="font-medium mb-1">Siempre incluido</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Datos básicos del paciente</li>
                    <li>Alergias</li>
                    <li>Condiciones crónicas</li>
                    <li>Medicamentos habituales</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-3 bg-muted/40">
                  <p className="font-medium mb-1">Opcional según tu elección</p>
                  <ul className="list-disc list-inside text-muted-foreground">
                    <li>Historial de diagnósticos</li>
                    <li>Resultados de laboratorio</li>
                    <li>Datos sensibles (salud mental, ITS, etc.)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* HISTORIAL CLÍNICO + DOCUMENTOS + PRIVACIDAD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Historial clínico (placeholder) */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="ClipboardList" className="w-5 h-5 text-primary mr-2" />
                Historial clínico
              </h2>
              <p className="text-sm text-muted-foreground">
                Aquí aparecerán tus diagnósticos importantes, resultados de
                laboratorio y estudios clave, organizados por especialidad.
              </p>
              {/* Aquí luego puedes mapear DiagnosisRecord[] y LabResult[] */}
            </div>

            {/* Privacidad y compartir */}
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm lg:col-span-1 space-y-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Icon name="Lock" className="w-5 h-5 text-primary mr-2" />
                Privacidad y Compartir
              </h2>

              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    ¿Qué se comparte por defecto?
                  </label>
                  <select
                    value={defaultShareScope}
                    onChange={(e) => setDefaultShareScope(e.target.value)}
                    className="w-full h-10 rounded-md border border-border bg-input px-3 py-2 text-sm"
                  >
                    <option value="basic">
                      Solo información básica (alergias y condiciones crónicas)
                    </option>
                    <option value="clinical">
                      Historial clínico resumido (recomendado)
                    </option>
                  </select>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIncludeSensitive(!includeSensitive)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      includeSensitive ? "bg-primary" : "bg-muted"
                    }`}
                    aria-pressed={includeSensitive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                        includeSensitive ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <div className="text-xs text-muted-foreground">
                    <p className="font-medium text-foreground text-sm">
                      Incluir datos sensibles cuando comparto mi historial
                    </p>
                    <p>
                      Esto puede incluir información sobre salud mental, ITS u
                      otras condiciones delicadas. Puedes cambiarlo cada vez que
                      reserves una cita.
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2" size="sm">
                  Ver y editar permisos por médico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHealthProfilePage;
