import React from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { getAnalytics, getProducts, getB2BOrders } from "../../utils/mockData";

export default function Analytics() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const a = getAnalytics();
  const products = getProducts();
  const b2b = getB2BOrders();

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="provider" onMenuToggle={()=>setMobileSidebarOpen(!mobileSidebarOpen)} />
      <Sidebar userRole="provider" isCollapsed={sidebarCollapsed} onToggleCollapse={()=>setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen} onMobileClose={()=>setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16':'lg:ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Analítica y KPIs</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Kpi title="Ventas (hoy)" value={`$ ${a?.salesToday || 0}`} icon="DollarSign"/>
            <Kpi title="Órdenes activas" value={a?.orders || 0} icon="ShoppingCart"/>
            <Kpi title="Top SKU" value={a?.topSku || 'N/A'} icon="Award"/>
            <Kpi title="Fill rate" value={`${Math.round((a?.fillRate || 0)*100)}%`} icon="Activity"/>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Catálogo (resumen)</div>
            {products?.map(p=>(
              <div key={p?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                <div className="w-40 font-mono">{p?.sku}</div>
                <div className="flex-1">{p?.name}</div>
                <div className="w-20 text-right">${p?.price?.toFixed(2) || '0.00'}</div>
                <div className="w-20 text-right">{p?.stock || 0}</div>
                <div className="w-24 text-xs text-muted-foreground text-right">
                  {p?.retailChannels?.b2c && <span className="mr-1">B2C</span>}
                  {p?.retailChannels?.b2b && <span>B2B</span>}
                </div>
              </div>
            )) || <div className="px-4 py-2 text-sm text-muted-foreground">No hay productos disponibles</div>}
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Órdenes B2B recientes</div>
            {b2b?.map(o=>(
              <div key={o?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                <div className="w-40 font-mono">{o?.id}</div>
                <div className="flex-1">{o?.buyer}</div>
                <div className="w-28 text-right">${o?.total?.toFixed(2) || '0.00'}</div>
                <div className="w-32 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs">{o?.status || 'N/A'}</span>
                </div>
              </div>
            )) || <div className="px-4 py-2 text-sm text-muted-foreground">No hay órdenes B2B disponibles</div>}
          </div>

          <div className="flex justify-end">
            <Button variant="outline"><Icon name="Download" size={16} className="mr-2" />Exportar CSV</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({title,value,icon}) {
  return (
    <div className="rounded-xl border border-border p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}