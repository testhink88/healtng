// src/@/@/pages/prescription-intake-portal/index.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';
import { getproviderProfile } from '../../utils/providerProfile';

// Bandeja local (simula pedidos que llegan desde paciente o QR)
const INBOX_KEY = 'providerRxInbox';
const loadInbox = () => {
  try { return JSON.parse(localStorage.getItem(INBOX_KEY) || '[]'); } catch { return []; }
};
const saveInbox = (arr) => localStorage.setItem(INBOX_KEY, JSON.stringify(arr));

export default function PrescriptionIntakePortal() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const profile = getproviderProfile();

  // Si llega un link del buscador de farmacias: /prescription-intake-portal?rx=...&patient=...&med=Losartan%2050mg
  const initial = useMemo(() => {
    const rx = params?.get('rx');
    if (!rx) return null;
    const item = {
      id: `IN-${Date.now()}`,
      rxCode: rx,
      patientName: params?.get('patient') || 'Paciente',
      medication: params?.get('med') || 'Medicamento',
      qty: Number(params?.get('qty') || 1),
      status: 'pending',
      createdAt: new Date()?.toISOString(),
      doctor: params?.get('doctor') || 'Médico',
      clinic: params?.get('clinic') || 'Centro',
    };
    const current = loadInbox();
    // evitar duplicados por rxCode
    if (!current?.find((i) => i?.rxCode === item?.rxCode)) {
      current?.unshift(item);
      saveInbox(current);
    }
    return item;
  }, [params]);

  const [inbox, setInbox] = useState(loadInbox());
  const [selected, setSelected] = useState(inbox?.[0] || initial);

  const accept = () => {
    setInbox((prev) => {
      const next = prev?.map((i) => i?.id === selected?.id ? { ...i, status: 'accepted' } : i);
      saveInbox(next); return next;
    });
  };
  const reject = () => {
    setInbox((prev) => {
      const next = prev?.map((i) => i?.id === selected?.id ? { ...i, status: 'rejected' } : i);
      saveInbox(next); return next;
    });
  };
  const markDispensed = () => {
    setInbox((prev) => {
      const next = prev?.map((i) => i?.id === selected?.id ? { ...i, status: 'dispensed', dispensedAt: new Date()?.toISOString() } : i);
      saveInbox(next); return next;
    });
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
        <div className="max-w-7xl mx-auto p-6">
          {/* Breadcrumbs */}
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" className="px-2 py-1" onClick={() => navigate('/provider-dashboard')}>
              <Icon name="Home" size={16} className="mr-2" /> Panel Proveedor
            </Button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-foreground font-medium">Intake de Recetas</span>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Intake de Recetas</h1>
              <p className="text-muted-foreground">
                {profile?.businessName} • {profile?.businessType || 'Tipo no definido'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/prescription-management')}>
                <Icon name="Link" size={16} className="mr-2" />
                Probar flujo desde Paciente
              </Button>
              <Button variant="outline" onClick={() => navigate('/provider-profile-setup')}>
                <Icon name="Settings" size={16} className="mr-2" />
                Configurar negocio
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Bandeja */}
            <section className="lg:col-span-1 rounded-xl border border-border overflow-hidden">
              <header className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
                <div className="font-medium text-foreground">Bandeja</div>
                <span className="text-xs text-muted-foreground">{inbox?.length} items</span>
              </header>
              <ul className="divide-y divide-border max-h-[60vh] overflow-auto">
                {inbox?.map((i) => (
                  <li
                    key={i?.id}
                    className={`p-3 cursor-pointer hover:bg-muted/30 ${selected?.id === i?.id ? 'bg-primary/5' : ''}`}
                    onClick={() => setSelected(i)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-foreground truncate">
                        {i?.medication} <span className="text-muted-foreground">• {i?.patientName}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        i?.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                        i?.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                        i?.status === 'dispensed'? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300'
                      }`}>
                        {i?.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rx: {i?.rxCode} • {new Date(i.createdAt)?.toLocaleString('es-VE')}
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Detalle */}
            <section className="lg:col-span-2 rounded-xl border border-border p-4">
              {selected ? (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{selected?.medication}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rx <b>{selected?.rxCode}</b> • Paciente: {selected?.patientName} • Cantidad: {selected?.qty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Médico: {selected?.doctor} • Centro: {selected?.clinic}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Recibido: {new Date(selected.createdAt)?.toLocaleString('es-VE')}</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Button variant="outline" onClick={accept} disabled={selected?.status !== 'pending'}>
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      Aceptar
                    </Button>
                    <Button variant="outline" onClick={reject} disabled={selected?.status !== 'pending'}>
                      <Icon name="XCircle" size={16} className="mr-2" />
                      Rechazar
                    </Button>
                    <Button onClick={markDispensed} disabled={selected?.status !== 'accepted'}>
                      <Icon name="PackageCheck" size={16} className="mr-2" />
                      Marcar como dispensada
                    </Button>
                  </div>

                  <div className="mt-4 rounded-lg border border-dashed border-border p-4">
                    <div className="text-sm text-muted-foreground">
                      <Icon name="ShieldCheck" size={16} className="inline mr-1" />
                      Validación básica: coincidencia de campos (Rx, paciente, médico). Para producción, este módulo debe consultar
                      al backend/autoridad de firma digital para validar QR/Hash y evitar fraude.
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground">Selecciona un elemento de la bandeja.</div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}