import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import { getOpticsOrders, setOpticsOrders } from "../../utils/mockData";

export default function OpticsOrders() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rows, setRows] = useState(getOpticsOrders() || []);

  const mark = (id, status) => {
    const next = rows?.map(r => r?.id === id ? { ...r, status } : r) || [];
    setRows(next); 
    setOpticsOrders(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar userRole="provider" isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Órdenes de Óptica</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Bandeja</div>
            {rows?.map(r => (
              <div key={r?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                <div className="w-36 font-mono">{r?.id}</div>
                <div className="flex-1">{r?.patient} • {r?.item} ({r?.grad})</div>
                <div className="w-40 text-right">
                  {r?.status === 'pending'
                    ? (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => mark(r?.id, 'rejected')}>Rechazar</Button>
                        <Button size="sm" onClick={() => mark(r?.id, 'accepted')}>Aceptar</Button>
                      </div>
                    )
                    : <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">{r?.status}</span>}
                </div>
              </div>
            ))}
            {(!rows || rows?.length === 0) && (
              <div className="px-4 py-8 text-center text-gray-500">
                No hay órdenes de óptica disponibles
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}