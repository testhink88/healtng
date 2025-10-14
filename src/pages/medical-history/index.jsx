import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

import DiagnosisCard from '@/pages/medical-history/components/DiagnosisCard';
import TreatmentCard from '@/pages/medical-history/components/TreatmentCard';
import MedicalTimeline from '@/pages/medical-history/components/MedicalTimeline';
import SearchFilters from '@/pages/medical-history/components/SearchFilters';
import ExportModal from '@/pages/medical-history/components/ExportModal'; //  corregido (estaba duplicado)


const MedicalHistory = () => {
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [filteredData, setFilteredData] = useState({
    diagnoses: [],
    treatments: [],
    timeline: []
  });

  // Mock medical history data
  const mockDiagnoses = [
    {
      id: 1,
      condition: "Hipertensión Arterial",
      status: "Activo",
      severity: "Moderado",
      diagnosisDate: "15/03/2024",
      doctor: "Dr. Carlos Mendoza",
      icdCode: "I10",
      description: "Hipertensión arterial esencial sin complicaciones. Presión arterial consistentemente elevada por encima de 140/90 mmHg en múltiples mediciones.",
      symptoms: ["Dolor de cabeza", "Mareos", "Fatiga", "Visión borrosa"],
      relatedTests: [
        { name: "Electrocardiograma", date: "10/03/2024", result: "Normal" },
        { name: "Ecocardiograma", date: "12/03/2024", result: "Función ventricular preservada" }
      ],
      treatmentPlan: "Control dietético, ejercicio regular, medicación antihipertensiva y seguimiento mensual.",
      notes: "Paciente responde bien al tratamiento inicial. Recomendar reducción de sodio en la dieta.",
      digitalSignature: {
        verified: true,
        licenseNumber: "12345",
        doctor: "Dr. Carlos Mendoza"
      },
      lastUpdated: "20/03/2024"
    },
    {
      id: 2,
      condition: "Diabetes Mellitus Tipo 2",
      status: "Seguimiento",
      severity: "Leve",
      diagnosisDate: "08/01/2024",
      doctor: "Dr. Luis García",
      icdCode: "E11",
      description: "Diabetes mellitus tipo 2 con buen control glucémico mediante dieta y medicación oral.",
      symptoms: ["Sed excesiva", "Micción frecuente", "Fatiga"],
      relatedTests: [
        { name: "Hemoglobina Glicosilada", date: "05/01/2024", result: "7.2%" },
        { name: "Glucosa en ayunas", date: "05/01/2024", result: "126 mg/dL" }
      ],
      treatmentPlan: "Metformina 850mg dos veces al día, dieta controlada en carbohidratos, ejercicio regular.",
      notes: "Excelente adherencia al tratamiento. HbA1c dentro del objetivo terapéutico.",
      digitalSignature: {
        verified: true,
        licenseNumber: "67890",
        doctor: "Dr. Luis García"
      },
      lastUpdated: "15/03/2024"
    },
    {
      id: 3,
      condition: "Dermatitis Atópica",
      status: "Resuelto",
      severity: "Leve",
      diagnosisDate: "22/11/2023",
      doctor: "Dra. Ana Rodríguez",
      icdCode: "L20.9",
      description: "Dermatitis atópica localizada en extremidades superiores, respondió favorablemente al tratamiento tópico.",
      symptoms: ["Picazón", "Enrojecimiento", "Descamación"],
      relatedTests: [
        { name: "Biopsia de piel", date: "20/11/2023", result: "Compatible con dermatitis atópica" }
      ],
      treatmentPlan: "Corticosteroides tópicos, hidratación cutánea, evitar alérgenos conocidos.",
      notes: "Lesiones completamente resueltas. Continuar con medidas preventivas.",
      digitalSignature: {
        verified: true,
        licenseNumber: "54321",
        doctor: "Dra. Ana Rodríguez"
      },
      lastUpdated: "10/12/2023"
    }
  ];

  const mockTreatments = [
    {
      id: 1,
      name: "Losartán 50mg",
      type: "Medicamento",
      status: "Activo",
      startDate: "16/03/2024",
      prescribedBy: "Dr. Carlos Mendoza",
      duration: "Tratamiento continuo",
      progress: 85,
      description: "Antihipertensivo del grupo de los antagonistas de los receptores de angiotensina II (ARA-II).",
      dosage: "50mg",
      frequency: "Una vez al día",
      route: "Vía oral",
      instructions: "Tomar preferiblemente en la mañana, con o sin alimentos. No suspender abruptamente.",
      sideEffects: ["Mareos", "Tos seca", "Fatiga"],
      monitoringSchedule: [
        { type: "Control de presión arterial", date: "15/04/2024", completed: true },
        { type: "Exámenes de laboratorio", date: "15/05/2024", completed: false }
      ],
      relatedDiagnosis: "Hipertensión Arterial",
      digitalSignature: {
        verified: true,
        licenseNumber: "12345",
        doctor: "Dr. Carlos Mendoza"
      },
      lastUpdated: "25/03/2024"
    },
    {
      id: 2,
      name: "Metformina 850mg",
      type: "Medicamento",
      status: "Activo",
      startDate: "10/01/2024",
      prescribedBy: "Dr. Luis García",
      duration: "Tratamiento continuo",
      progress: 92,
      description: "Antidiabético oral que mejora la sensibilidad a la insulina y reduce la producción hepática de glucosa.",
      dosage: "850mg",
      frequency: "Dos veces al día",
      route: "Vía oral",
      instructions: "Tomar con las comidas principales (desayuno y cena) para reducir efectos gastrointestinales.",
      sideEffects: ["Náuseas", "Diarrea", "Dolor abdominal"],
      monitoringSchedule: [
        { type: "Hemoglobina glicosilada", date: "10/04/2024", completed: true },
        { type: "Función renal", date: "10/07/2024", completed: false }
      ],
      relatedDiagnosis: "Diabetes Mellitus Tipo 2",
      digitalSignature: {
        verified: true,
        licenseNumber: "67890",
        doctor: "Dr. Luis García"
      },
      lastUpdated: "20/03/2024"
    },
    {
      id: 3,
      name: "Fisioterapia Cardiovascular",
      type: "Terapia",
      status: "Completado",
      startDate: "01/02/2024",
      endDate: "01/03/2024",
      prescribedBy: "Dr. Carlos Mendoza",
      duration: "4 semanas",
      progress: 100,
      description: "Programa de rehabilitación cardiovascular para mejorar la capacidad funcional y reducir factores de riesgo.",
      instructions: "Ejercicios aeróbicos de baja intensidad, 3 sesiones por semana, duración progresiva de 20 a 45 minutos.",
      monitoringSchedule: [
        { type: "Evaluación inicial", date: "01/02/2024", completed: true },
        { type: "Evaluación intermedia", date: "15/02/2024", completed: true },
        { type: "Evaluación final", date: "01/03/2024", completed: true }
      ],
      relatedDiagnosis: "Hipertensión Arterial",
      digitalSignature: {
        verified: true,
        licenseNumber: "12345",
        doctor: "Dr. Carlos Mendoza"
      },
      lastUpdated: "05/03/2024"
    }
  ];

  const mockTimelineEvents = [
    {
      id: 1,
      type: "diagnosis",
      title: "Diagnóstico de Hipertensión Arterial",
      date: "2024-03-15",
      doctor: "Dr. Carlos Mendoza",
      severity: "moderate",
      description: "Diagnóstico confirmado tras múltiples mediciones de presión arterial elevada.",
      details: {
        diagnosis: "Hipertensión Arterial Esencial",
        result: "PA: 150/95 mmHg"
      },
      attachments: [
        { name: "electrocardiograma.pdf", type: "pdf" },
        { name: "ecocardiograma.pdf", type: "pdf" }
      ],
      digitalSignature: true,
      relatedRecords: 2
    },
    {
      id: 2,
      type: "treatment",
      title: "Inicio de Tratamiento Antihipertensivo",
      date: "2024-03-16",
      doctor: "Dr. Carlos Mendoza",
      description: "Prescripción de Losartán 50mg para control de presión arterial.",
      details: {
        medication: "Losartán 50mg - Una vez al día"
      },
      digitalSignature: true
    },
    {
      id: 3,
      type: "diagnosis",
      title: "Diagnóstico de Diabetes Mellitus Tipo 2",
      date: "2024-01-08",
      doctor: "Dr. Luis García",
      severity: "mild",
      description: "Diagnóstico basado en glucemia en ayunas y hemoglobina glicosilada elevadas.",
      details: {
        diagnosis: "Diabetes Mellitus Tipo 2",
        result: "HbA1c: 7.2%, Glucosa: 126 mg/dL"
      },
      attachments: [
        { name: "laboratorio_diabetes.pdf", type: "pdf" }
      ],
      digitalSignature: true,
      relatedRecords: 1
    },
    {
      id: 4,
      type: "treatment",
      title: "Inicio de Metformina",
      date: "2024-01-10",
      doctor: "Dr. Luis García",
      description: "Prescripción de Metformina 850mg para control glucémico.",
      details: {
        medication: "Metformina 850mg - Dos veces al día"
      },
      digitalSignature: true
    },
    {
      id: 5,
      type: "test",
      title: "Control de Hemoglobina Glicosilada",
      date: "2024-04-10",
      doctor: "Dr. Luis García",
      description: "Control de seguimiento para evaluar control glucémico.",
      details: {
        result: "HbA1c: 6.8% - Mejoría significativa"
      },
      attachments: [
        { name: "control_hba1c.pdf", type: "pdf" }
      ]
    }
  ];

  useEffect(() => {
    setFilteredData({
      diagnoses: mockDiagnoses,
      treatments: mockTreatments,
      timeline: mockTimelineEvents
    });
  }, []);

  const handleSearch = (filters) => {
    // Simulate filtering logic
    let filteredDiagnoses = mockDiagnoses;
    let filteredTreatments = mockTreatments;
    let filteredTimeline = mockTimelineEvents;

    if (filters?.query) {
      const query = filters?.query?.toLowerCase();
      filteredDiagnoses = filteredDiagnoses?.filter(d => 
        d?.condition?.toLowerCase()?.includes(query) ||
        d?.doctor?.toLowerCase()?.includes(query) ||
        d?.description?.toLowerCase()?.includes(query)
      );
      filteredTreatments = filteredTreatments?.filter(t => 
        t?.name?.toLowerCase()?.includes(query) ||
        t?.prescribedBy?.toLowerCase()?.includes(query) ||
        t?.description?.toLowerCase()?.includes(query)
      );
      filteredTimeline = filteredTimeline?.filter(e => 
        e?.title?.toLowerCase()?.includes(query) ||
        e?.doctor?.toLowerCase()?.includes(query) ||
        e?.description?.toLowerCase()?.includes(query)
      );
    }

    setFilteredData({
      diagnoses: filteredDiagnoses,
      treatments: filteredTreatments,
      timeline: filteredTimeline
    });
  };

  const handleExport = async (config) => {
    // Simulate export process
    console.log('Exporting with config:', config);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would trigger file download
    alert(`Historial médico exportado en formato ${config?.format?.toUpperCase()}`);
  };

  const handleRecordSelect = (recordId, type) => {
    const recordKey = `${type}_${recordId}`;
    setSelectedRecords(prev => 
      prev?.includes(recordKey) 
        ? prev?.filter(id => id !== recordKey)
        : [...prev, recordKey]
    );
  };

  const tabs = [
    { key: 'diagnoses', label: 'Diagnósticos', icon: 'Stethoscope', count: filteredData?.diagnoses?.length },
    { key: 'treatments', label: 'Tratamientos', icon: 'Pill', count: filteredData?.treatments?.length },
    { key: 'timeline', label: 'Cronología', icon: 'Clock', count: filteredData?.timeline?.length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="patient"
        onMenuToggle={() => setIsMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <main className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      } pt-16`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                  Historial Médico
                </h1>
                <p className="text-muted-foreground">
                  Accede a tu información médica completa con verificación digital
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {selectedRecords?.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setIsExportModalOpen(true)}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Exportar Seleccionados ({selectedRecords?.length})
                  </Button>
                )}
                <Button
                  variant="default"
                  onClick={() => setIsExportModalOpen(true)}
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Exportar Todo
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Stethoscope" size={20} className="text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{filteredData?.diagnoses?.length}</p>
                    <p className="text-sm text-muted-foreground">Diagnósticos</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Pill" size={20} className="text-success" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{filteredData?.treatments?.length}</p>
                    <p className="text-sm text-muted-foreground">Tratamientos</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={20} className="text-warning" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {[...filteredData?.diagnoses, ...filteredData?.treatments]?.filter(item => item?.digitalSignature)?.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Verificados</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={20} className="text-secondary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {new Date()?.getFullYear() - 2020}
                    </p>
                    <p className="text-sm text-muted-foreground">Años de historial</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchFilters
            onSearch={handleSearch}
            onFilter={handleSearch}
            onExport={(format) => setIsExportModalOpen(true)}
            className="mb-6"
          />

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.key}
                    onClick={() => setActiveTab(tab?.key)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab?.key
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab?.key
                        ? 'bg-primary/10 text-primary' :'bg-muted text-muted-foreground'
                    }`}>
                      {tab?.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'diagnoses' && (
              <div className="space-y-4">
                {filteredData?.diagnoses?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Stethoscope" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Sin Diagnósticos</h3>
                    <p className="text-muted-foreground">No se encontraron diagnósticos con los filtros aplicados.</p>
                  </div>
                ) : (
                  filteredData?.diagnoses?.map((diagnosis) => (
                    <DiagnosisCard
                      key={diagnosis?.id}
                      diagnosis={diagnosis}
                      onViewDetails={(diagnosis) => console.log('View diagnosis:', diagnosis)}
                      onExport={(diagnosis) => console.log('Export diagnosis:', diagnosis)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'treatments' && (
              <div className="space-y-4">
                {filteredData?.treatments?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Pill" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Sin Tratamientos</h3>
                    <p className="text-muted-foreground">No se encontraron tratamientos con los filtros aplicados.</p>
                  </div>
                ) : (
                  filteredData?.treatments?.map((treatment) => (
                    <TreatmentCard
                      key={treatment?.id}
                      treatment={treatment}
                      onViewDetails={(treatment) => console.log('View treatment:', treatment)}
                      onExport={(treatment) => console.log('Export treatment:', treatment)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <MedicalTimeline
                events={filteredData?.timeline}
                onEventClick={(event) => console.log('View event:', event)}
              />
            )}
          </div>
        </div>
      </main>
      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        selectedRecords={selectedRecords}
      />
    </div>
  );
};

export default MedicalHistory;