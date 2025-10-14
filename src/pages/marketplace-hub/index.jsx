import React, { useState, useEffect } from "react";
import { Building2, Heart } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import GlobalSearch from "@/components/ui/GlobalSearch";

// 👇 Todos los componentes específicos del Marketplace desde la misma carpeta
import MarketplaceCard from "@/pages/marketplace-hub/components/MarketplaceCard";
import RoleSwitcher from "@/pages/marketplace-hub/components/RoleSwitcher";
import QuickAccessShortcuts from "@/pages/marketplace-hub/components/QuickAccessShortcuts";
import MarketplaceAnalytics from "@/pages/marketplace-hub/components/MarketplaceAnalytics";


const MarketplaceHub = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query params (opcionales): ?role=patient|doctor|specialist|clinic&mode=b2c|b2b
  const qsRole = (searchParams.get('role') || '').toLowerCase();
  const qsMode = (searchParams.get('mode') || '').toLowerCase();

  // Rol y modo iniciales con prioridad al QS, luego localStorage, luego defaults
  const [userRole, setUserRole] = useState(() => {
    return qsRole || localStorage.getItem('userRole') || 'doctor';
  });

  const [mode, setMode] = useState(() => {
    const stored = localStorage.getItem('marketplace_mode');
    if (qsMode) return qsMode;
    if (stored) return stored;
    // Si el rol es patient por defecto, forzamos b2c; si no, b2b.
    const rol = qsRole || localStorage.getItem('userRole') || 'doctor';
    return rol === 'patient' ? 'b2c' : 'b2b';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [analyticsData] = useState({
    recentPurchases: [
      { id: 1, name: 'Losartán 50mg', date: '2025-09-01', amount: 25.5, status: 'delivered' },
      { id: 2, name: 'Vitamina D3', date: '2025-08-28', amount: 18.5, status: 'delivered' }
    ],
    savedItems: 12,
    totalSpent: 342.75,
    recommendations: [
      { id: 1, name: 'Paracetamol 500mg', price: 12.75, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200' },
      { id: 2, name: 'Termómetro Digital', price: 32.99, image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200' }
    ]
  });

  // Sincroniza QS -> estado -> localStorage una sola vez
  useEffect(() => {
    if (qsRole) {
      setUserRole(qsRole);
      localStorage.setItem('userRole', qsRole);
    } else {
      localStorage.setItem('userRole', userRole);
    }

    if (qsMode) {
      setMode(qsMode);
      localStorage.setItem('marketplace_mode', qsMode);
    } else {
      localStorage.setItem('marketplace_mode', mode);
    }

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMarketplaceSelection = (type) => {
    if (type === 'b2c') navigate('/marketplace/b2c');
    if (type === 'b2b') navigate('/marketplace/b2b');
  };

  const handleRoleSwitch = (newRole) => {
    setUserRole(newRole);
    localStorage.setItem('userRole', newRole);
    // si el usuario cambia a patient, forzar B2C; si vuelve a profesional/clinica, usar B2B
    const nextMode = newRole === 'patient' ? 'b2c' : (mode || 'b2b');
    setMode(nextMode);
    localStorage.setItem('marketplace_mode', nextMode);
  };

  const canSwitchRoles =
    userRole === 'professional' || userRole === 'clinic' || userRole === 'doctor' || userRole === 'specialist';

  // Mostrar tarjeta B2B sólo si no estamos en modo B2C y el rol no es patient
  const showB2B = !(mode === 'b2c' || userRole === 'patient');

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Marketplace Médico</h1>
                <p className="text-lg text-muted-foreground">
                  {userRole === 'patient'
                    ? 'Encuentra medicamentos y productos de salud para ti y tu familia'
                    : 'Accede a insumos médicos profesionales y productos para pacientes'}
                </p>
              </div>
              <div className="w-full lg:w-96">
                <GlobalSearch userRole={userRole} placeholder="Buscar productos, medicamentos, equipos..." variant="default" />
              </div>
            </div>

            {canSwitchRoles && (
              <div className="mt-6">
                <RoleSwitcher currentRole={userRole} onRoleSwitch={handleRoleSwitch} />
              </div>
            )}
          </div>

          {/* Tarjetas del Hub */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* B2C SIEMPRE visible */}
            <MarketplaceCard
              type="b2c"
              title="Marketplace Personal"
              subtitle="Medicamentos y productos de salud al detalle"
              description="Encuentra medicamentos, vitaminas, dispositivos médicos y productos de bienestar para uso personal y familiar."
              features={[
                'Medicamentos con y sin receta',
                'Entrega a domicilio rápida',
                'Precios accesibles',
                'Compatible con seguros médicos'
              ]}
              primaryAction={{
                label: userRole === 'patient' ? 'Explorar Tienda' : 'Comprar para Paciente',
                onClick: () => handleMarketplaceSelection('b2c')
              }}
              secondaryAction={{ label: 'Ver Ofertas', onClick: () => handleMarketplaceSelection('b2c') }}
              stats={[{ label: 'Productos', value: '2,500+' }, { label: 'Farmacias', value: '150+' }, { label: 'Entrega', value: '24-48h' }]}
              icon={Heart}
              gradient="from-blue-500 to-cyan-500"
              isRecommended={true}
            />

            {/* B2B SOLO si corresponde */}
            {showB2B && (
              <MarketplaceCard
                type="b2b"
                title="Marketplace Profesional"
                subtitle="Insumos médicos y equipos para profesionales"
                description="Accede a un catálogo especializado de insumos médicos, equipos profesionales y compras por volumen."
                features={[
                  'Precios por volumen y mayoreo',
                  'Equipos médicos certificados',
                  'Órdenes de compra empresariales',
                  'Soporte técnico especializado'
                ]}
                primaryAction={{ label: 'Catálogo Profesional', onClick: () => handleMarketplaceSelection('b2b') }}
                secondaryAction={{ label: 'Solicitar Cotización', onClick: () => handleMarketplaceSelection('b2b') }}
                stats={[{ label: 'Insumos', value: '5,000+' }, { label: 'Proveedores', value: '80+' }, { label: 'Descuentos', value: 'Hasta 30%' }]}
                icon={Building2}
                gradient="from-purple-500 to-pink-500"
                isRecommended={userRole !== 'patient'}
              />
            )}
          </div>

          {/* Accesos rápidos y analítica */}
          <div className="mb-8">
            <QuickAccessShortcuts userRole={userRole} onNavigate={navigate} />
          </div>

          <MarketplaceAnalytics data={analyticsData} userRole={userRole} onNavigate={navigate} />
        </div>
      </main>
    </div>
  );
};

export default MarketplaceHub;
