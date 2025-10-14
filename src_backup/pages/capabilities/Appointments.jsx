import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { getAppointments, setAppointments } from "../../utils/mockData";

export default function Appointments() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rows, setRows] = useState(getAppointments() || []);

  const complete = (id) => {
    const next = rows?.map(r => r?.id === id ? { ...r, status: 'done' } : r) || [];
    setRows(next); 
    setAppointments(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar 
        userRole="provider" 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} 
        onMobileClose={() => setMobileSidebarOpen(false)} 
      />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Agenda / Servicios</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Próximas citas</div>
            {rows?.length > 0 ? (
              rows?.map(r => (
                <div key={r?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="w-40 font-mono">{r?.id}</div>
                  <div className="flex-1">{r?.service} — {r?.customer}</div>
                  <div className="w-48">{r?.when}</div>
                  <div className="w-40 text-right">
                    {r?.status === 'booked' ? (
                      <Button size="sm" onClick={() => complete(r?.id)}>
                        <Icon name="Check" size={14} className="mr-1" />
                        Completar
                      </Button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                        {r?.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay citas programadas
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}