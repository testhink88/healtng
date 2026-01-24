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

const PatientPrescriptionWallet = () => {
  const navigate = useNavigate();

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

  // Mock Data: MIS RECETAS (Paciente)
  const [prescriptions] = useState([
      {
        id: "RX-PT-001",
        prescriptionNumber: "CMV-2025-123",
        medicationName: "Losartán",
        dosage: "50mg",
        frequency: "1 diaria",
        quantity: "30",
        doctorName: "Dr. Carlos Mendoza",
        specialty: "Cardiología",
        issueDate: "2025-08-15T10:30:00Z",
        expiryDate: "2025-11-15T23:59:59Z",
        status: "issued", // "issued" es el equivalente a "activa" para paciente
        type: "cardiovascular"
      },
      // ... otros datos ...
  ]);

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
          
          {/* Empty State */}
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