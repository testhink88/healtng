import React, { useState, useEffect } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import { useAuth } from "@/context/AuthContext";

// API
import { fetchPatientHistory } from "@/api/patient/patients";

import DiagnosisCard from '@/pages/medical-history/components/DiagnosisCard';
import TreatmentCard from '@/pages/medical-history/components/TreatmentCard';
import MedicalTimeline from '@/pages/medical-history/components/MedicalTimeline';
import SearchFilters from '@/pages/medical-history/components/SearchFilters'; 

const PatientHistoryRecord = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [records, setRecords] = useState({
    diagnoses: [],
    treatments: [],
    timeline: [],
  });
  
  const [filteredData, setFilteredData] = useState({
    diagnoses: [],
    treatments: [],
    timeline: [],
  });

  const loadHistory = async () => {
    if (!profile?.id) return;
    setLoading(true);
    try {
      const data = await fetchPatientHistory(profile.id);
      
      // Mapear para compatibilidad con tarjetas UI
      const mappedDx = data.diagnoses.map(d => ({
         ...d,
         diagnosisDate: d.diagnosis_date,
         doctor: d.doctor?.full_name || "Médico",
         digitalSignature: d.metadata?.digital_signature
      }));

      const mappedTx = data.treatments.map(t => ({
         ...t,
         startDate: t.start_date,
         prescribedBy: t.doctor?.full_name || "Médico",
         progress: t.adherence_rate || 100
      }));

      // Timeline real basado en fechas
      const timeline = [
          ...mappedDx.map(d => ({ 
              id: d.id, 
              type: 'diagnosis', 
              title: `Dx: ${d.condition}`, 
              date: d.diagnosis_date, 
              doctor: d.doctor 
          })),
          ...mappedTx.map(t => ({ 
              id: t.id, 
              type: 'treatment', 
              title: `Tx: ${t.name}`, 
              date: t.start_date, 
              doctor: t.prescribedBy 
          }))
      ].sort((a,b) => b.date.localeCompare(a.date));

      const finalData = { diagnoses: mappedDx, treatments: mappedTx, timeline };
      setRecords(finalData);
      setFilteredData(finalData);
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [profile?.id]);

  const handleSearch = (filters) => {
    const query = (filters?.query || "").toLowerCase();
    
    setFilteredData({
      diagnoses: records.diagnoses.filter(d => d.condition.toLowerCase().includes(query)),
      treatments: records.treatments.filter(t => t.name.toLowerCase().includes(query)),
      timeline: records.timeline.filter(e => e.title.toLowerCase().includes(query)),
    });
  };

  const handleExportPDF = async (scope = 'all') => {
    alert(`Historial médico exportado en PDF (${scope === 'selected' ? 'seleccionados' : 'todo'})`);
  };

  const tabs = [
    { key: 'diagnoses', label: 'Diagnósticos', icon: 'Stethoscope', count: filteredData?.diagnoses?.length },
    { key: 'treatments', label: 'Tratamientos', icon: 'Pill', count: filteredData?.treatments?.length },
    { key: 'timeline', label: 'Cronología', icon: 'Clock', count: filteredData?.timeline?.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="patient" onMenuToggle={() => setIsMobileSidebarOpen(true)} />
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`transition-all duration-300 ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} pt-16`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 gap-3 text-left">
              <div className="min-w-0">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Mi Historial Médico</h1>
                <p className="text-muted-foreground">Tu salud centralizada en la nube con respaldo digital.</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" onClick={loadHistory}>
                    <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                </Button>
                <Button variant="default" onClick={() => handleExportPDF('all')}>
                  <Icon name="Download" size={16} className="mr-2" />
                  PDF
                </Button>
              </div>
            </div>

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
                  <Icon name="Pill" size={20} className="text-emerald-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{filteredData?.treatments?.length}</p>
                    <p className="text-sm text-muted-foreground">Tratamientos</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={20} className="text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {records?.diagnoses?.length + records?.treatments?.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Registros</p>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={20} className="text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{new Date().getFullYear()}</p>
                    <p className="text-sm text-muted-foreground">Año actual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SearchFilters onSearch={handleSearch} onFilter={handleSearch} className="mb-6" />

          <div className="mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${activeTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{tab.count}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
                <div className="py-20 text-center"><Icon name="Loader2" className="animate-spin mx-auto text-primary" size={40} /></div>
            ) : (
                <>
                {activeTab === 'diagnoses' && (
                  <div className="space-y-4">
                    {filteredData?.diagnoses?.length === 0 ? (
                      <div className="text-center py-12 grayscale opacity-40">
                        <Icon name="Stethoscope" size={48} className="mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Sin Diagnósticos</h3>
                        <p className="text-sm">Tu historial clínico aparecerá aquí después de tus consultas.</p>
                      </div>
                    ) : (
                      filteredData?.diagnoses?.map((d) => <DiagnosisCard key={d?.id} diagnosis={d} />)
                    )}
                  </div>
                )}

                {activeTab === 'treatments' && (
                  <div className="space-y-4">
                    {filteredData?.treatments?.length === 0 ? (
                      <div className="text-center py-12 grayscale opacity-40">
                        <Icon name="Pill" size={48} className="mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Sin Tratamientos</h3>
                        <p className="text-sm">Tus prescripciones médicas se sincronizarán en tiempo real.</p>
                      </div>
                    ) : (
                      filteredData?.treatments?.map((t) => <TreatmentCard key={t?.id} treatment={t} />)
                    )}
                  </div>
                )}

                {activeTab === 'timeline' && (
                  <MedicalTimeline events={filteredData?.timeline} />
                )}
                </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientHistoryRecord;