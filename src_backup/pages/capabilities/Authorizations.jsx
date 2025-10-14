import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import { getAuthorizations, setAuthorizations } from "../../utils/mockData";

export default function Authorizations() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rows, setRows] = useState(() => {
    const initialData = getAuthorizations();
    return Array.isArray(initialData) ? initialData : [];
  });

  const set = (id, status) => {
    const next = rows?.map(r => r?.id === id ? { ...r, status } : r) || [];
    setRows(next); 
    setAuthorizations(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar userRole="provider" isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Autorizaciones</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Solicitudes</div>
            {rows?.length > 0 ? (
              rows?.map(r => (
                <div key={r?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="w-40 font-mono">{r?.id}</div>
                  <div className="flex-1">{r?.member} • {r?.procedure}</div>
                  <div className="w-40 text-right">
                    {r?.status === 'requested'
                      ? (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => set(r?.id, 'denied')}>Denegar</Button>
                          <Button size="sm" onClick={() => set(r?.id, 'approved')}>Aprobar</Button>
                        </div>
                      )
                      : <span className={`px-2 py-0.5 rounded-full text-xs ${
                          r?.status === 'approved' ?'bg-emerald-100 text-emerald-800' 
                            : r?.status === 'denied' ?'bg-red-100 text-red-800' :'bg-gray-100 text-gray-800'
                        }`}>{r?.status}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay autorizaciones disponibles
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}