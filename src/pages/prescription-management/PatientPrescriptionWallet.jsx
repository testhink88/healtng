import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// Tus componentes originales (Modales, Tabs, Cards)
import PrescriptionCard from "@/pages/prescription-management/components/PrescriptionCard";
import PrescriptionFilters from "@/pages/prescription-management/components/PrescriptionFilters";
import PrescriptionTabs from "@/pages/prescription-management/components/PrescriptionTabs";
import PharmacyFinderModal from "@/pages/prescription-management/components/PharmacyFinderModal";
import RenewalRequestModal from "@/pages/prescription-management/components/RenewalRequestModal";
import { listPrescriptionsByPatient } from "@/api/prescriptions/prescriptions";
import { useAuth } from "@/context/AuthContext";

const PatientPrescriptionWallet = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Estado UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  // Estado Datos
  const [activeTab, setActiveTab] = useState("issued"); // issued (activas), dispensed, expired
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modales
  const [isPharmacyModalOpen, setIsPharmacyModalOpen] = useState(false);
  const [isRenewalModalOpen, setIsRenewalModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState([]);

  // CARGAR RECETAS REALES DE SUPABASE
  const loadPrescriptions = async () => {
    if (!profile?.id) return;
    setIsLoading(true);
    try {
      const data = await listPrescriptionsByPatient(profile.id);
      
      // Mapear campos de Supabase a la UI
      const mapped = data.map(p => ({
        ...p,
        medicationName: p.name,
        dosage: p.dosage,
        quantity: p.quantity,
        frequency: p.frequency,
        doctorName: p.doctor?.full_name || "Médico",
        specialty: p.doctor?.metadata?.specialty_label || "Especialista",
        issueDate: p.created_at,
        expiryDate: p.end_date || new Date(new Date(p.created_at).getTime() + 90*24*60*60*1000).toISOString(),
        status: p.status === 'active' ? 'issued' : p.status // Normalizar estados para la UI de paciente
      }));
      setPrescriptions(mapped);
    } catch (err) {
      console.error("Error loading patient prescriptions:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (profile?.id) loadPrescriptions();
  }, [profile?.id]);

  // Filtrado
  const filteredPrescriptions = useMemo(() => {
    const byTab = prescriptions.filter((p) => p.status === activeTab);
    if (!searchQuery) return byTab;
    return byTab.filter(p => 
        p.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [prescriptions, activeTab, searchQuery]);

  const counts = {
      issued: prescriptions.filter(p => p.status === 'issued').length,
      dispensed: prescriptions.filter(p => p.status === 'dispensed').length,
      expired: prescriptions.filter(p => p.status === 'expired').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="patient" onMenuToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar
        userRole="patient"
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          
          {/* Header Paciente */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Mis Recetas</h1>
            <p className="text-muted-foreground">Gestiona tus medicamentos y encuentra farmacias.</p>
          </div>

          {/* Tabs y Filtros */}
          <PrescriptionTabs activeTab={activeTab} onTabChange={setActiveTab} counts={counts} />
          <div className="mt-4 mb-6">
             <PrescriptionFilters 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                inputRef={searchRef}
                placeholder="Buscar medicamento..."
                onClearFilters={() => setSearchQuery("")}
             />
          </div>

          {/* Cards */}
          {isLoading ? (
             <div className="flex items-center justify-center p-20">
                <Icon name="Loader2" className="animate-spin text-primary" size={40} />
             </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredPrescriptions.map((rx) => (
                  <PrescriptionCard
                    key={rx.id}
                    prescription={rx}
                    // Eventos de Paciente
                    onFindPharmacy={() => {
                      setSelectedPrescription(rx);
                      setIsPharmacyModalOpen(true);
                    }}
                    onRenewRequest={() => {
                      setSelectedPrescription(rx);
                      setIsRenewalModalOpen(true);
                    }}
                    onDownload={() => alert("Descargando PDF...")}
                  />
                ))}
              </div>
              
              {filteredPrescriptions.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                    No tienes recetas en esta sección.
                    {activeTab === 'issued' && (
                        <div className="mt-4">
                            <Button onClick={() => navigate('/doctor-discovery')}>Buscar Médico</Button>
                        </div>
                    )}
                 </div>
              )}
            </>
          )}

          {/* Modales */}
          <PharmacyFinderModal 
             isOpen={isPharmacyModalOpen} 
             onClose={() => setIsPharmacyModalOpen(false)} 
             prescription={selectedPrescription} 
          />
          <RenewalRequestModal 
             isOpen={isRenewalModalOpen} 
             onClose={() => setIsRenewalModalOpen(false)} 
             prescription={selectedPrescription} 
          />

        </div>
      </main>
    </div>
  );
};

export default PatientPrescriptionWallet;