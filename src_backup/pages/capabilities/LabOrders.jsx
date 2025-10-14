import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { getLabOrders, setLabOrders } from "../../utils/mockData";

export default function LabOrders() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rows, setRows] = useState(getLabOrders() || []);
  const nextStatus = s => s==='received'?'in_progress': s==='in_progress'?'delivered':'delivered';

  const advance = (id) => {
    const rows2 = rows?.map(r=>r?.id===id?{...r,status: nextStatus(r?.status)}:r) || [];
    setRows(rows2); 
    setLabOrders(rows2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={()=>setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar userRole="provider" isCollapsed={sidebarCollapsed} onToggleCollapse={()=>setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} onMobileClose={()=>setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16':'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Órdenes de Laboratorio</h1>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Bandeja</div>
            {rows?.length > 0 ? (
              rows?.map(r=>(
                <div key={r?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="w-36 font-mono">{r?.id}</div>
                  <div className="flex-1">{r?.patient} • {r?.test}</div>
                  <div className="w-40 text-right">
                    {r?.status!=='delivered'
                      ? <Button size="sm" onClick={()=>advance(r?.id)}><Icon name="Play" size={14} className="mr-1"/>Avanzar ({r?.status})</Button>
                      : <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">{r?.status}</span>}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay órdenes de laboratorio disponibles
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}