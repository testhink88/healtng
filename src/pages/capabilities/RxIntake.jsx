import React, { useState } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { getRxInbox, setRxInbox } from "../../utils/mockData";

export default function RxIntake() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [inbox, setInbox] = useState(getRxInbox() || []);

  const update = (id, status) => {
    const next = inbox?.map(i => i?.id === id ? {...i, status} : i) || [];
    setInbox(next); 
    setRxInbox(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole="provider" 
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
      />
      <Sidebar 
        userRole="provider" 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} 
        onMobileClose={() => setMobileSidebarOpen(false)} 
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16':'lg:ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Intake de Recetas</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Bandeja</div>
            {inbox?.length > 0 ? (
              inbox?.map(i => (
                <div key={i?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="w-36 font-mono">Rx {i?.rxCode}</div>
                  <div className="flex-1">{i?.medication} • {i?.patient}</div>
                  <div className="w-40 text-right">
                    {i?.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => update(i?.id, 'rejected')}
                        >
                          <Icon name="XCircle" size={14} className="mr-1"/>
                          Rechazar
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => update(i?.id, 'accepted')}
                        >
                          <Icon name="CheckCircle" size={14} className="mr-1"/>
                          Aceptar
                        </Button>
                      </div>
                    )}
                    {i?.status !== 'pending' && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                        {i?.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                No hay recetas en la bandeja
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}