import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProfessional } from "@/context/ProfessionalContext";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";

// Reutilizamos tus componentes visuales existentes
import PrescriptionCard from "@/pages/prescription-management/components/PrescriptionCard";
import PrescriptionFilters from "@/pages/prescription-management/components/PrescriptionFilters";
import PrescriptionTabs from "@/pages/prescription-management/components/PrescriptionTabs";

const DoctorPrescriptionManager = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentProfessional } = useProfessional();

  // Estados de UI
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const searchRef = useRef(null);

  // Estados de Datos
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);

  // MOCK DATA: Recetas emitidas POR este médico
  useEffect(() => {
    setPrescriptions([
      {
        id: "RX-MD-001",
        prescriptionNumber: "RX-2025-001",
        medicationName: "Losartán Potásico",
        dosage: "50mg",
        quantity: "30 tabletas",
        frequency: "Cada 24h",
        patientName: "María González",
        patientId: "PAT-001",
        issueDate: "2025-01-10T10:00:00Z",
        expiryDate: "2025-04-10T10:00:00Z",
        status: "active", 
        doctorName: currentProfessional?.name || "Yo"
      },
      {
        id: "RX-MD-002",
        prescriptionNumber: "RX-2025-002",
        medicationName: "Amoxicilina",
        dosage: "500mg",
        quantity: "21 cápsulas",
        frequency: "Cada 8h",
        patientName: "Carlos Pérez",
        patientId: "PAT-002",
        issueDate: "2024-12-01T10:00:00Z",
        expiryDate: "2024-12-08T10:00:00Z",
        status: "expired",
        doctorName: currentProfessional?.name || "Yo"
      }
    ]);
  }, [currentProfessional]);

  // Filtrado
  const filteredData = useMemo(() => {
    let data = prescriptions;
    // Filtro por Tab
    if (activeTab === 'active') data = data.filter(p => p.status === 'active' || p.status === 'dispensed');
    if (activeTab === 'expired') data = data.filter(p => p.status === 'expired');

    // Filtro por Búsqueda
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(p => 
        p.patientName.toLowerCase().includes(q) || 
        p.medicationName.toLowerCase().includes(q)
      );
    }
    return data;
  }, [prescriptions, activeTab, searchQuery]);

  const counts = {
    active: prescriptions.filter(p => p.status !== 'expired').length,
    expired: prescriptions.filter(p => p.status === 'expired').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="doctor" onMenuToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar
        userRole="doctor"
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          
          {/* Header de Sección */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Emisiones</h1>
              <p className="text-gray-500">Historial de recetas prescritas por ti.</p>
            </div>
            <Button 
                onClick={() => navigate('/prescriptions/new')} 
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
                <Icon name="Plus" size={18} /> Nueva Receta
            </Button>
          </div>

          {/* Tabs y Filtros */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 shadow-sm">
             <PrescriptionTabs 
                activeTab={activeTab} 
                onTabChange={setActiveTab} 
                counts={counts}
                tabs={[
                    { key: 'active', label: 'Activas/Vigentes', icon: 'CheckCircle' },
                    { key: 'expired', label: 'Vencidas/Histórico', icon: 'Clock' }
                ]}
             />
             <div className="mt-4 pt-4 border-t border-gray-100">
                <PrescriptionFilters 
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    inputRef={searchRef}
                    placeholder="Buscar por paciente o medicamento..."
                    // Ocultamos filtros complejos innecesarios para esta vista rápida
                    hideSort={true}
                    hideType={true}
                />
             </div>
          </div>

          {/* Lista de Resultados */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
             {filteredData.map(rx => (
                 <PrescriptionCard 
                    key={rx.id}
                    prescription={rx}
                    isDoctorView={true} // Importante: flag para ocultar cosas de pacientes
                    actions={[
                        { 
                          label: "Ver Paciente", 
                          icon: "User", 
                          onClick: () => navigate(`/patients/${rx.patientId}`) 
                        },
                        { 
                          label: "Duplicar Receta", 
                          icon: "Copy", 
                          onClick: () => navigate('/prescriptions/new', { state: { duplicate: rx } }) 
                        }
                    ]}
                 />
             ))}
             {filteredData.length === 0 && (
                <div className="col-span-full text-center py-10 text-gray-400">
                    No se encontraron recetas en esta categoría.
                </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default DoctorPrescriptionManager;