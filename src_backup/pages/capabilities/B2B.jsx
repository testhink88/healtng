import React, { useState } from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import Button from "@/components/ui/Button";
import Icon from "@/components/AppIcon";
import { getProducts, getB2BOrders, setB2BOrders } from "../../utils/mockData";

export default function B2B() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const products = (getProducts() || [])?.filter(p => p?.retailChannels?.b2b);
  const [orders, setOrders] = useState(getB2BOrders() || []);

  const confirm = (id) => {
    const next = orders?.map(o => o?.id === id ? {...o, status: 'confirmed'} : o) || [];
    setOrders(next); 
    setB2BOrders?.(next);
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
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16':'lg:ml-64'}`}>
        <div className="max-w-6xl mx-auto p-6 space-y-4">
          <h1 className="text-2xl font-bold">Abastecimiento B2B</h1>

          <section className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Catálogo Mayorista</div>
            {products?.length > 0 ? (
              products?.map(p => (
                <div key={p?.id || p?.sku} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="flex-1">{p?.name || 'Sin nombre'}</div>
                  <div className="w-28 text-right">${p?.price?.toFixed(2) || '0.00'}</div>
                  <div className="w-20 text-right">{p?.stock || 0}</div>
                  <div className="w-40 text-right">
                    <Button size="sm" variant="outline">
                      <Icon name="ShoppingCart" size={14} className="mr-1"/>
                      Crear Oferta
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay productos disponibles para B2B
              </div>
            )}
          </section>

          <section className="rounded-xl border border-border overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 border-b border-border text-sm">Órdenes de Compra entrantes</div>
            {orders?.length > 0 ? (
              orders?.map(o => (
                <div key={o?.id} className="px-4 py-2 border-b border-border flex items-center text-sm">
                  <div className="w-40 font-mono">{o?.id || 'N/A'}</div>
                  <div className="flex-1">{o?.buyer || o?.clinic || 'Sin nombre'}</div>
                  <div className="w-28 text-right">${o?.total?.toFixed(2) || '0.00'}</div>
                  <div className="w-40 text-right">
                    {o?.status === 'awaiting_confirm' || o?.status === 'Pendiente' ? (
                      <Button size="sm" onClick={() => confirm(o?.id)}>
                        <Icon name="CheckCircle" size={14} className="mr-1" />
                        Confirmar
                      </Button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs">
                        {o?.status || 'Desconocido'}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No hay órdenes de compra disponibles
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}