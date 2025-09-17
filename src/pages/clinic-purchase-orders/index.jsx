import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const mockOrders = [
  {
    id: 'PO-000145',
    vendor: 'MediSupply Pro',
    date: '2025-09-02',
    items: 18,
    total: 1260.40,
    status: 'pending', // pending | received | processing | cancelled | draft
  },
  {
    id: 'PO-000144',
    vendor: 'PharmaPlus',
    date: '2025-08-28',
    items: 7,
    total: 342.10,
    status: 'received',
  },
  {
    id: 'PO-000143',
    vendor: 'LabEquip CA',
    date: '2025-08-26',
    items: 3,
    total: 2135.00,
    status: 'processing',
  },
];

const STATUS_META = {
  all: { label: 'Todos' },
  pending: { label: 'Pendiente de recibir', chip: 'bg-amber-100 text-amber-700' },
  received: { label: 'Recibida', chip: 'bg-emerald-100 text-emerald-700' },
  processing: { label: 'En proceso', chip: 'bg-sky-100 text-sky-700' },
  cancelled: { label: 'Anulada', chip: 'bg-rose-100 text-rose-700' },
  draft: { label: 'Borrador', chip: 'bg-zinc-100 text-zinc-700' },
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-card border border-border rounded-xl ${className}`}>{children}</div>
);

export default function ClinicPurchaseOrders() {
  const navigate = useNavigate();

  const [userRole] = useState(() => localStorage.getItem('userRole') || 'clinic');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filtros
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Simula fetch
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(mockOrders);
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchesText =
        !q ||
        r.id.toLowerCase().includes(q.toLowerCase()) ||
        r.vendor.toLowerCase().includes(q.toLowerCase());

      const matchesStatus = status === 'all' ? true : r.status === status;

      const ts = new Date(r.date).getTime();
      const fromOk = !dateFrom || ts >= new Date(dateFrom).getTime();
      const toOk = !dateTo || ts <= new Date(dateTo).getTime();

      return matchesText && matchesStatus && fromOk && toOk;
    });
  }, [rows, q, status, dateFrom, dateTo]);

  // KPIs
  const kpis = useMemo(() => {
    const pending = filtered.filter((r) => r.status === 'pending').length;
    const processing = filtered.filter((r) => r.status === 'processing').length;
    const totalAmount = filtered.reduce((acc, r) => acc + (r.total || 0), 0);
    return { pending, processing, totalAmount, count: filtered.length };
  }, [filtered]);

  const clearFilters = () => {
    setQ('');
    setStatus('all');
    setDateFrom('');
    setDateTo('');
  };

  const exportCSV = () => {
    // mínimo útil para demo
    const header = 'orden,vendedor,fecha,items,total,estado\n';
    const body = filtered
      .map((r) => `${r.id},${r.vendor},${r.date},${r.items},${r.total},${STATUS_META[r.status]?.label || r.status}`)
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ordenes_compra.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const goB2B = () => navigate('/marketplace/b2b');
  const newOrder = () => window.alert('Acción: crear nueva Orden (hookéalo a tu flujo/forma).');
  const viewOrder = (id) => window.alert(`Ver orden ${id}`);
  const receiveOrder = (id) => window.alert(`Recibir orden ${id}`);
  const printOrder = (id) => window.alert(`Imprimir orden ${id}`);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4">

          {/* ===== Título + Acciones (igual patrón que Inventario) ===== */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Órdenes de Compra</h1>
              <p className="text-muted-foreground">Gestiona las órdenes de compra de la clínica</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={goB2B} className="gap-2">
                <Icon name="Store" size={16} />
                Surtir desde B2B
              </Button>
              <Button variant="default" onClick={newOrder} className="gap-2">
                <Icon name="Plus" size={16} />
                Nueva Orden
              </Button>
              <Button variant="outline" onClick={exportCSV} className="gap-2">
                <Icon name="Download" size={16} />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* ===== Filtros ===== */}
          <Card className="p-3">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por # de orden o proveedor…"
                    className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(STATUS_META).map(([key, v]) => (
                    <option key={key} value={key}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="ghost" onClick={clearFilters} className="whitespace-nowrap">
                  Limpiar filtros
                </Button>
              </div>
            </div>
          </Card>

          {/* ===== KPIs ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-semibold mt-1">{kpis.pending}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">En proceso</p>
              <p className="text-2xl font-semibold mt-1">{kpis.processing}</p>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valor total</p>
                  <p className="text-2xl font-semibold mt-1">${kpis.totalAmount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total órdenes</p>
                  <p className="text-2xl font-semibold mt-1">{kpis.count}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* ===== Lista ===== */}
          <Card className="overflow-hidden">
            <div className="min-w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-muted-foreground">
                  <tr>
                    <th className="text-left font-medium px-4 py-3"># Orden</th>
                    <th className="text-left font-medium px-4 py-3">Proveedor</th>
                    <th className="text-left font-medium px-4 py-3">Fecha</th>
                    <th className="text-left font-medium px-4 py-3">Ítems</th>
                    <th className="text-left font-medium px-4 py-3">Total</th>
                    <th className="text-left font-medium px-4 py-3">Estado</th>
                    <th className="text-left font-medium px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-foreground">{r.id}</td>
                      <td className="px-4 py-3">{r.vendor}</td>
                      <td className="px-4 py-3">{r.date}</td>
                      <td className="px-4 py-3">{r.items} ítems</td>
                      <td className="px-4 py-3">${r.total.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${STATUS_META[r.status]?.chip || 'bg-zinc-100 text-zinc-700'}`}>
                          {STATUS_META[r.status]?.label || r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => viewOrder(r.id)}>
                            <Icon name="Eye" size={14} /> Ver
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => receiveOrder(r.id)}>
                            <Icon name="Inbox" size={14} /> Recibir
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1" onClick={() => printOrder(r.id)}>
                            <Icon name="Printer" size={14} /> Imprimir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td className="px-4 py-10 text-center text-muted-foreground" colSpan={7}>
                        No hay resultados con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
