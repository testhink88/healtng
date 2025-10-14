import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';

import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import PatientSummary from '@/pages/new-diagnosis-form/components/PatientSummary';
import DiagnosisSearch from '@/pages/new-diagnosis-form/components/DiagnosisSearch';
import ClinicalFindings from '@/pages/new-diagnosis-form/components/ClinicalFindings';
import TreatmentPlan from '@/pages/new-diagnosis-form/components/TreatmentPlan';


const NewDiagnosisForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('doctor');

  // ---- VISTA CLÍNICA (lista) ----
  const isClinicList = new URLSearchParams(location.search).get('scope') === 'clinic'
    && (new URLSearchParams(location.search).get('mode') === 'list');

  const mockDx = [
    { id: 'DX-001', patient: 'María González', doctor: 'Dr. Pérez', specialty: 'Medicina General', date: '2025-09-03', status: 'Confirmado' },
    { id: 'DX-002', patient: 'Juan Rodríguez', doctor: 'Dra. López', specialty: 'Pediatría', date: '2025-09-02', status: 'En estudio' },
  ];

  if (isClinicList) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="clinic" onMenuToggle={() => setMobileSidebarOpen(true)} />
        <Sidebar userRole="clinic" isCollapsed={sidebarCollapsed}
                 onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                 isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
        <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" className="px-2 py-1" onClick={() => navigate('/clinic-dashboard')}>
                <Icon name="Home" size={16} className="mr-2" /> Panel Principal
              </Button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">Diagnósticos — Vista Clínica</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">Diagnósticos del Centro</h1>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-3">Paciente</div>
                <div className="col-span-2">Médico</div>
                <div className="col-span-3">Especialidad</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1 text-right">Estado</div>
                <div className="col-span-1 text-right">Acción</div>
              </div>
              {mockDx.map(dx => (
                <div key={dx.id} className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30">
                  <div className="col-span-3"><div className="font-medium">{dx.patient}</div><div className="text-xs text-muted-foreground">{dx.id}</div></div>
                  <div className="col-span-2">{dx.doctor}</div>
                  <div className="col-span-3">{dx.specialty}</div>
                  <div className="col-span-2">{dx.date}</div>
                  <div className="col-span-1 text-right">{dx.status}</div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/professional-dashboard')}>
                      <Icon name="ExternalLink" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ---- FORMULARIO (original) ----
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('');
  const [secondaryDiagnoses, setSecondaryDiagnoses] = useState([]);
  const [severity, setSeverity] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [clinicalFindings, setClinicalFindings] = useState([]);
  const [vitalSigns, setVitalSigns] = useState({ bloodPressure: '', heartRate: '', temperature: '', oxygenSaturation: '' });
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [prognosis, setPrognosis] = useState('');
  const [patientEducation, setPatientEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const appointmentId = urlParams?.get('appointmentId');
    if (appointmentId) loadAppointmentData(appointmentId);
  }, [location]);

  const loadAppointmentData = async (appointmentId) => {
    setIsLoading(true);
    try {
      const mockAppointment = {
        id: appointmentId,
        patientName: 'María González',
        patientAge: 45,
        patientGender: 'Femenino',
        medicalHistory: ['Diabetes tipo 2', 'Hipertensión arterial'],
        chiefComplaint: 'Dolor torácico y dificultad para respirar',
        doctorName: 'Dr. Carlos Rodríguez',
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: '10:30'
      };
      setAppointment(mockAppointment);
      setPatient({
        name: mockAppointment?.patientName,
        age: mockAppointment?.patientAge,
        gender: mockAppointment?.patientGender,
        medicalHistory: mockAppointment?.medicalHistory,
        chiefComplaint: mockAppointment?.chiefComplaint
      });
    } catch (e) {
      console.error(e);
    } finally { setIsLoading(false); }
  };

  const handleAddSecondaryDiagnosis = (diagnosis) => {
    if (diagnosis && !secondaryDiagnoses?.find(d => d?.code === diagnosis?.code)) {
      setSecondaryDiagnoses([...secondaryDiagnoses, diagnosis]);
    }
  };
  const handleRemoveSecondaryDiagnosis = (id) => setSecondaryDiagnoses(secondaryDiagnoses?.filter(d => d?.id !== id));

  const handleSaveDiagnosis = async () => {
    if (!primaryDiagnosis) return alert('Por favor seleccione un diagnóstico principal');
    if (!severity) return alert('Por favor seleccione la severidad del diagnóstico');
    setIsLoading(true);
    try { await new Promise(r => setTimeout(r, 1000)); alert('Diagnóstico guardado exitosamente'); window.history?.back(); }
    catch (e) { console.error(e); alert('Error al guardar el diagnóstico'); }
    finally { setIsLoading(false); }
  };

  const handleCreatePrescription = () => {
    const appointmentId = new URLSearchParams(location.search)?.get('appointmentId');
    const url = appointmentId ? `/profesional/recetas/nueva?appointmentId=${appointmentId}` : '/profesional/recetas/nueva';
    window.location.href = url;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos del paciente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} isAuthenticated={true} onMenuToggle={() => setMobileSidebarOpen(true)} />
      <Sidebar userRole={userRole} isCollapsed={sidebarCollapsed}
               onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
               isMobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Nuevo Diagnóstico Médico</h1>
              <p className="text-muted-foreground">Documentación diagnóstica con codificación ICD-10</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="ArrowLeft" iconPosition="left" onClick={() => window.history?.back()}>
                Volver
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {patient && <PatientSummary patient={patient} appointment={appointment} />}

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Diagnóstico Principal</h2>
                <div className="space-y-4">
                  <DiagnosisSearch value={primaryDiagnosis} onChange={setPrimaryDiagnosis} label="Diagnóstico Principal" placeholder="Buscar diagnóstico principal..." required />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Severidad <span className="text-destructive">*</span></label>
                      <Select value={severity} onValueChange={setSeverity}>
                        <option value="">Seleccionar severidad</option>
                        <option value="leve">Leve</option>
                        <option value="moderado">Moderado</option>
                        <option value="severo">Severo</option>
                        <option value="critico">Crítico</option>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Pronóstico</label>
                      <Select value={prognosis} onValueChange={setPrognosis}>
                        <option value="">Seleccionar pronóstico</option>
                        <option value="excelente">Excelente</option>
                        <option value="bueno">Bueno</option>
                        <option value="reservado">Reservado</option>
                        <option value="grave">Grave</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Síntomas y Hallazgos Clínicos</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Síntomas Principales</label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e?.target?.value)}
                      placeholder="Describa los síntomas principales..."
                      className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>
                  <ClinicalFindings findings={clinicalFindings} onFindingsChange={setClinicalFindings}
                                    vitalSigns={vitalSigns} onVitalSignsChange={setVitalSigns} />
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Diagnósticos Secundarios</h2>
                <div className="space-y-4">
                  <DiagnosisSearch value="" onChange={handleAddSecondaryDiagnosis} label="Agregar Diagnóstico Secundario" placeholder="Buscar diagnóstico secundario..." />
                  {secondaryDiagnoses?.length > 0 && (
                    <div className="space-y-2">
                      {secondaryDiagnoses?.map((d) => (
                        <div key={d?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{d?.name}</p>
                            <p className="text-sm text-muted-foreground">Código: {d?.code}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveSecondaryDiagnosis(d?.id)} className="text-destructive hover:text-destructive">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <TreatmentPlan
                treatmentPlan={treatmentPlan}
                onTreatmentPlanChange={setTreatmentPlan}
                followUpDate={setFollowUpDate}
                onFollowUpDateChange={setFollowUpDate}
                patientEducation={patientEducation}
                onPatientEducationChange={setPatientEducation}
              />
            </div>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Acciones Rápidas</h2>
                <div className="space-y-3">
                  <Button onClick={handleCreatePrescription} iconName="FileText" iconPosition="left" className="w-full" variant="outline">Crear Receta</Button>
                  <Button iconName="Calendar" iconPosition="left" className="w-full" variant="outline">Agendar Seguimiento</Button>
                  <Button iconName="Share2" iconPosition="left" className="w-full" variant="outline">Derivar Especialista</Button>
                </div>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Guardar Diagnóstico</h2>
                <div className="space-y-3">
                  <Button onClick={handleSaveDiagnosis} iconName="Save" iconPosition="left" className="w-full" disabled={!primaryDiagnosis || !severity}>Guardar Diagnóstico</Button>
                  <Button variant="outline" iconName="FileText" iconPosition="left" className="w-full" disabled={!primaryDiagnosis}>Exportar Reporte</Button>
                  <Button variant="outline" iconName="Mail" iconPosition="left" className="w-full" disabled={!primaryDiagnosis}>Enviar al Paciente</Button>
                </div>
              </div>

              {primaryDiagnosis && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Resumen del Diagnóstico</h2>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-muted-foreground">Diagnóstico Principal:</span><p className="font-medium text-foreground">{primaryDiagnosis}</p></div>
                    {severity && <div><span className="text-muted-foreground">Severidad:</span><p className="font-medium text-foreground capitalize">{severity}</p></div>}
                    {secondaryDiagnoses?.length > 0 && <div><span className="text-muted-foreground">Diagnósticos Secundarios:</span><p className="font-medium text-foreground">{secondaryDiagnoses?.length}</p></div>}
                    {followUpDate && <div><span className="text-muted-foreground">Seguimiento:</span><p className="font-medium text-foreground">{new Date(followUpDate)?.toLocaleDateString('es-VE')}</p></div>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewDiagnosisForm;
