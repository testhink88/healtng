import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import { getClaims, setClaims } from "../../utils/mockData";

export default function Claims() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rows, setRows] = useState(getClaims() || []);

  const pay = (id) => {
    const next = rows?.map(r => r?.id === id ? { ...r, status: 'paid' } : r) || [];
    setRows(next); 
    setClaims(next);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar userRole="provider" isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Siniestros / Claims</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Reembolsos</div>
            {rows?.map(r => (
              <div key={r?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                <div className="w-40 font-mono">{r?.id}</div>
                <div className="flex-1">{r?.member}</div>
                <div className="w-28 text-right">${r?.amount?.toFixed(2)}</div>
                <div className="w-40 text-right">
                  {r?.status === 'submitted'
                    ? <Button size="sm" onClick={() => pay(r?.id)}>Pagar</Button>
                    : <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">{r?.status}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}