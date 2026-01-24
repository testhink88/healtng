import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfessional } from "@/context/ProfessionalContext";

// Importación de datos centralizados
import { MOCK_PATIENTS } from "@/mock/patients";
import { MOCK_DIAGNOSES, MOCK_TREATMENTS } from "@/mock/clinicalHistory";

import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

// Componente interno para KPIs
const StatCard = ({ icon, title, value, subtext, color }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between transition-all hover:shadow-md">
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      {subtext && <p className={`text-xs mt-1 ${color}`}>{subtext}</p>}
    </div>
    <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('600', '100').replace('700', '100')}`}>
      <Icon name={icon} size={20} className={color} />
    </div>
  </div>
);

const DoctorHistoryViewer = () => {
  const { currentProfessional } = useProfessional();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si venimos de la lista de pacientes
  const patientFromState = location.state?.patient;
  
  const [activeTab, setActiveTab] = useState('diagnoses');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");

  const [data, setData] = useState({ diagnoses: [], treatments: [] });

  // ================= LÓGICA DE ALIMENTACIÓN DE DATOS =================
  useEffect(() => {
    let finalDiagnoses = [];
    let finalTreatments = [];

    if (patientFromState) {
      // 1. VISTA EXPEDIENTE (Específico de un paciente)
      finalDiagnoses = MOCK_DIAGNOSES.filter(d => d.patientId === String(patientFromState.id));
      finalTreatments = MOCK_TREATMENTS.filter(t => t.patientId === String(patientFromState.id));
    } else {
      // 2. VISTA INTELIGENCIA CLÍNICA (Global con cruce de datos)
      finalDiagnoses = MOCK_DIAGNOSES.map(diag => {
        const patient = MOCK_PATIENTS.find(p => p.id === diag.patientId);
        return { ...diag, patientName: patient?.name || "Paciente Desconocido" };
      });
      finalTreatments = MOCK_TREATMENTS.map(tx => {
        const patient = MOCK_PATIENTS.find(p => p.id === tx.patientId);
        return { ...tx, patientName: patient?.name || "Paciente Desconocido" };
      });
    }

    setData({ diagnoses: finalDiagnoses, treatments: finalTreatments });
  }, [patientFromState]);

  // ================= FILTRADO Y KPIS =================
  const filteredDiagnoses = useMemo(() => {
    return data.diagnoses.filter(d => {
        const matchesSearch = d.condition.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              (d.patientName || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSeverity = filterSeverity === "all" || d.severity === filterSeverity;
        return matchesSearch && matchesSeverity;
    });
  }, [data.diagnoses, searchTerm, filterSeverity]);

  const filteredTreatments = useMemo(() => {
    return data.treatments.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (t.patientName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.treatments, searchTerm]);

  const stats = useMemo(() => {
    const totalPx = patientFromState ? 1 : new Set(data.diagnoses.map(d => d.patientId)).size;
    const chronic = data.diagnoses.filter(d => d.type === 'Crónico').length;
    const highRisk = data.diagnoses.filter(d => d.severity === 'high').length;
    const totalAdherence = data.treatments.reduce((acc, curr) => acc + (curr.adherenceRate || 0), 0);
    const avgAdherence = data.treatments.length ? Math.round(totalAdherence / data.treatments.length) : 0;
    return { totalPx, chronic, highRisk, avgAdherence };
  }, [data, patientFromState]);

  // ================= ACCIONES =================
  const handleRenew = (treatment) => {
    navigate('/prescriptions/new', { 
        state: { 
            renew: true,
            patientId: treatment.patientId,
            patientName: treatment.patientName,
            medication: treatment.name,
            dosage: treatment.dosage
        } 
    });
  };

  const handleViewDetails = (diagnosis) => {
    alert(`Detalles Clínicos: ${diagnosis.condition}\nPaciente: ${diagnosis.patientName || patientFromState?.name}`);
  };

  // ================= HELPERS UI =================
  const getSeverityBadge = (severity) => {
    const map = { high: "bg-red-100 text-red-700 border-red-200", medium: "bg-orange-100 text-orange-700 border-orange-200", low: "bg-green-100 text-green-700 border-green-200" };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${map[severity]}`}>
        {severity === 'high' ? 'Alto' : severity === 'medium' ? 'Medio' : 'Leve'}
    </span>;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header userRole="doctor" onMenuToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar 
        userRole="doctor" 
        isCollapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} 
        isMobileOpen={mobileSidebarOpen} 
        onMobileClose={() => setMobileSidebarOpen(false)} 
      />

      <main className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} pt-16`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          
          {/* HEADER SECCIÓN */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3">
                    {patientFromState && (
                        <button onClick={() => navigate('/patients')} className="p-2 hover:bg-white rounded-full transition-colors">
                            <Icon name="ArrowLeft" size={20} className="text-gray-400"/>
                        </button>
                    )}
                    <h1 className="text-2xl font-bold">
                        {patientFromState ? `Expediente: ${patientFromState.name}` : "Inteligencia Clínica"}
                    </h1>
                </div>
                <p className="text-gray-500 mt-1 ml-1">
                    {patientFromState ? `Cédula: ${patientFromState.docId} • ${patientFromState.age} años` : "Resumen de salud poblacional y adherencia."}
                </p>
            </div>
            <div className="flex gap-2">
                 <Button variant="outline" className="gap-2 bg-white"><Icon name="Download" size={16} /> Reporte</Button>
                 <Button 
                    onClick={() => navigate(patientFromState ? '/diagnosis/new' : '/patients', { state: { patient: patientFromState } })} 
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2"
                 >
                    <Icon name="Plus" size={16} /> {patientFromState ? "Atender Paciente" : "Iniciar Consulta"}
                </Button>
            </div>
          </div>

          {/* KPIS POBLACIONALES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title={patientFromState ? "Visitas" : "Pacientes"} value={stats.totalPx} subtext="En seguimiento" color="text-blue-600" icon="Users" />
            <StatCard title="Casos Crónicos" value={stats.chronic} subtext="Bajo tratamiento" color="text-purple-600" icon="Activity" />
            <StatCard title="Riesgo Crítico" value={stats.highRisk} subtext="Atención Urgente" color="text-red-600" icon="AlertTriangle" />
            <StatCard title="Adherencia Tx" value={`${stats.avgAdherence}%`} subtext="Factor Teva" color={stats.avgAdherence > 80 ? "text-green-600" : "text-yellow-600"} icon="Pill" />
          </div>

          {/* BARRA DE HERRAMIENTAS MEJORADA */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
             <div className="flex flex-col lg:flex-row items-center justify-between p-3 gap-4 border-b border-gray-100">
                
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-lg w-full lg:w-auto">
                    <button onClick={() => setActiveTab('diagnoses')} className={`flex-1 lg:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'diagnoses' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Diagnósticos ({filteredDiagnoses.length})
                    </button>
                    <button onClick={() => setActiveTab('treatments')} className={`flex-1 lg:flex-none px-6 py-2 text-sm font-semibold rounded-md transition-all ${activeTab === 'treatments' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Tratamientos ({filteredTreatments.length})
                    </button>
                </div>

                {/* BUSCADOR CLARO Y ANCHO */}
                <div className="flex items-center gap-3 w-full lg:flex-1 justify-end">
                    <div className="relative w-full max-w-xl">
                        <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                        <input 
                            type="text" 
                            placeholder={patientFromState ? "Buscar en este historial..." : "Buscar por paciente, diagnóstico o medicamento..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                        />
                    </div>
                    {activeTab === 'diagnoses' && (
                        <select 
                            value={filterSeverity} 
                            onChange={(e) => setFilterSeverity(e.target.value)}
                            className="py-2.5 pl-3 pr-8 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm cursor-pointer"
                        >
                            <option value="all">Severidad: Todas</option>
                            <option value="high">Alto Riesgo</option>
                            <option value="medium">Moderado</option>
                            <option value="low">Leve</option>
                        </select>
                    )}
                </div>
             </div>

             {/* TABLAS DE DATOS */}
             <div className="p-0 overflow-hidden rounded-b-xl">
                {activeTab === 'diagnoses' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Diagnóstico</th>
                                    {!patientFromState && <th className="px-6 py-4">Paciente</th>}
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4">Severidad</th>
                                    <th className="px-6 py-4">Última Revisión</th>
                                    <th className="px-6 py-4 text-right">Detalle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredDiagnoses.map(d => (
                                    <tr key={d.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 group-hover:text-blue-700">{d.condition}</div>
                                            <div className="text-xs text-gray-400">{d.type} • Dx: {d.diagnosisDate}</div>
                                        </td>
                                        {!patientFromState && <td className="px-6 py-4 font-medium">{d.patientName}</td>}
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${d.status === 'Controlado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{getSeverityBadge(d.severity)}</td>
                                        <td className="px-6 py-4 text-gray-500">{d.lastCheck || d.diagnosisDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleViewDetails(d)} className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-blue-600 transition-all">
                                                <Icon name="ChevronRight" size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Tratamiento</th>
                                    {!patientFromState && <th className="px-6 py-4">Paciente</th>}
                                    <th className="px-6 py-4">Dosis</th>
                                    <th className="px-6 py-4">Adherencia</th>
                                    <th className="px-6 py-4">Próx. Renovación</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredTreatments.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{t.name}</div>
                                            <div className="text-xs text-gray-400">Inicio: {t.startDate}</div>
                                        </td>
                                        {!patientFromState && <td className="px-6 py-4 font-medium">{t.patientName}</td>}
                                        <td className="px-6 py-4 text-gray-600">{t.dosage}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${t.adherenceRate > 80 ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${t.adherenceRate}%`}} />
                                                </div>
                                                <span className="text-xs font-bold">{t.adherenceRate}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{t.nextRefill}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleRenew(t)}
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ml-auto"
                                            >
                                                <Icon name="RefreshCw" size={14} /> Renovar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorHistoryViewer;