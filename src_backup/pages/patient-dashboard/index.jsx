import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import GlobalSearch from '@/components/ui/GlobalSearch';
import HealthGreeting from '@/components/HealthGreeting';
import QuickActionsGrid from '@/components/QuickActionsGrid';
import NextAppointment from '@/components/NextAppointment';
import RecentExams from '@/components/RecentExams';
import HealthProfileSummary from '@/components/HealthProfileSummary';

const PatientDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  const handleQuickActionClick = (action) => {
    console.log('Quick action clicked:', action);
    // Analytics or tracking can be added here
  };

  const handleSearchResult = (result) => {
    console.log('Search result selected:', result);
    // Analytics or tracking can be added here
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse-slow mb-4">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
          <p className="text-muted-foreground">Cargando tu dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        userRole="patient"
        isAuthenticated={true}
        onMenuToggle={handleMobileSidebarToggle}
      />

      {/* Sidebar */}
      <Sidebar
        userRole="patient"
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleSidebarToggle}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={handleMobileSidebarClose}
      />

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Health Greeting */}
          <HealthGreeting className="mb-6" />

          {/* Global Search */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <GlobalSearch
                userRole="patient"
                placeholder="Buscar médicos, servicios, medicamentos..."
                variant="hero"
                onSearchResult={handleSearchResult}
              />
            </div>
          </div>

          {/* Quick Actions Grid */}
          <QuickActionsGrid 
            className="mb-8"
            onActionClick={handleQuickActionClick}
          />

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Next Appointment */}
              <NextAppointment />

              {/* Recent Exams */}
              <RecentExams />
            </div>

            {/* Right Column - Secondary Panel */}
            <div className="lg:col-span-1">
              {/* Health Profile Summary */}
              <HealthProfileSummary />
            </div>
          </div>

          {/* Additional Quick Actions for Mobile */}
          <div className="mt-8 lg:hidden">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Accesos Rápidos</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.location.href = '/appointment-booking'}
                  className="p-3 bg-primary/10 rounded-lg text-primary font-medium text-sm hover:bg-primary/20 transition-colors duration-150"
                >
                  Nueva Cita
                </button>
                <button
                  onClick={() => window.location.href = '/prescription-management'}
                  className="p-3 bg-success/10 rounded-lg text-success font-medium text-sm hover:bg-success/20 transition-colors duration-150"
                >
                  Mis Recetas
                </button>
                <button
                  onClick={() => window.location.href = '/medical-history'}
                  className="p-3 bg-secondary/10 rounded-lg text-secondary font-medium text-sm hover:bg-secondary/20 transition-colors duration-150"
                >
                  Historial
                </button>
                <button
                  onClick={() => window.location.href = '/marketplace'}
                  className="p-3 bg-warning/10 rounded-lg text-warning font-medium text-sm hover:bg-warning/20 transition-colors duration-150"
                >
                  Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;