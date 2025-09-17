// src/pages/new-referral-form/index.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

import SpecialtySelector from './components/SpecialtySelector';
import UrgencySelector from './components/UrgencySelector';
import ReferralReasonForm from './components/ReferralReasonForm';
import AttachmentUpload from './components/AttachmentUpload';
import InsuranceVerification from './components/InsuranceVerification';

const NewReferralForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Si viene de Clínica con ?scope=clinic&mode=list mostramos listado centralizado
  const isClinicList =
    new URLSearchParams(location.search).get('scope') === 'clinic' &&
    new URLSearchParams(location.search).get('mode') === 'list';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('doctor');
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  // ---------------------- VISTA LISTA (CLÍNICA) ----------------------
  if (isClinicList) {
    const mockReferrals = [
      { id: 'RF-001', patient: 'María González', doctor: 'Dr. Pérez', specialty: 'Cardiología', date: '2025-09-01', status: 'Enviada' },
      { id: 'RF-002', patient: 'Juan Rodríguez', doctor: 'Dra. López', specialty: 'Dermatología', date: '2025-08-29', status: 'Aceptada' },
      { id: 'RF-003', patient: 'Ana Martínez', doctor: 'Dr. García', specialty: 'Medicina Interna', date: '2025-08-25', status: 'Rechazada' },
    ];

    return (
      <div className="min-h-screen bg-background">
        <Header userRole="clinic" onMenuToggle={() => setMobileSidebarOpen(true)} />
        <Sidebar
          userRole="clinic"
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {/* Migas */}
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Button variant="ghost" className="px-2 py-1" onClick={() => navigate('/clinic-dashboard')}>
                <Icon name="Home" size={16} className="mr-2" />
                Panel Principal
              </Button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">Derivaciones — Vista Clínica</span>
            </div>

            {/* Título */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Derivaciones del Centro</h1>
                <p className="text-muted-foreground">Listado general por especialidad y médico</p>
              </div>
              <Button variant="outline" onClick={() => { /* hook para export */ }}>
                <Icon name="Download" size={16} className="mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Tabla */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="grid grid-cols-12 bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground">
                <div className="col-span-3">Paciente</div>
                <div className="col-span-2">Médico</div>
                <div className="col-span-3">Especialidad</div>
                <div className="col-span-2">Fecha</div>
                <div className="col-span-1 text-right">Estado</div>
                <div className="col-span-1 text-right">Acción</div>
              </div>

              {mockReferrals.map((r) => (
                <div key={r.id} className="grid grid-cols-12 px-4 py-3 border-t border-border text-sm hover:bg-muted/30">
                  <div className="col-span-3">
                    <div className="font-medium text-foreground">{r.patient}</div>
                    <div className="text-xs text-muted-foreground">{r.id}</div>
                  </div>
                  <div className="col-span-2">{r.doctor}</div>
                  <div className="col-span-3">{r.specialty}</div>
                  <div className="col-span-2">{r.date}</div>
                  <div className="col-span-1 text-right">{r.status}</div>
                  <div className="col-span-1 text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/professional-dashboard')} title="Ir al módulo profesional">
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

  // ---------------------- FORMULARIO (MÉDICO) ----------------------
  const [formData, setFormData] = useState({
    patientInfo: {
      name: '',
      id: '',
      age: '',
      phone: '',
      email: '',
    },
    referralInfo: {
      specialty: '',
      targetDoctor: '',
      urgencyLevel: 'normal',
      preferredDate: '',
      reason: '',
      clinicalNotes: '',
      medicalHistory: '',
    },
    attachments: [],
    insuranceVerified: false,
    communicationPreferences: {
      patientNotifications: true,
      progressUpdates: true,
      followUpReminders: true,
    },
  });

  // Cargar datos si llega ?appointmentId
  useEffect(() => {
    const urlParams = new URLSearchParams(location?.search);
    const id = urlParams?.get('appointmentId');
    if (id) {
      setAppointmentId(id);
      loadAppointmentData(id);
    }
  }, [location]);

  // Mock: precargar datos desde la cita
  const loadAppointmentData = async (id) => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800));
      const mock = {
        patientInfo: {
          name: 'María González',
          id: 'V-12345678',
          age: '45',
          phone: '+58 412-345-6789',
          email: 'maria.gonzalez@email.com',
        },
      };
      setFormData((prev) => ({ ...prev, patientInfo: mock.patientInfo }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) =>
    setFormData((prev) => ({ ...prev, [section]: { ...prev?.[section], [field]: value } }));

  const handleAttachmentAdd = (attachment) =>
    setFormData((prev) => ({ ...prev, attachments: [...prev?.attachments, attachment] }));

  const handleAttachmentRemove = (index) =>
    setFormData((prev) => ({ ...prev, attachments: prev?.attachments?.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    try {
      setLoading(true);

      if (!formData?.patientInfo?.name || !formData?.referralInfo?.specialty || !formData?.referralInfo?.reason) {
        alert('Por favor complete todos los campos requeridos');
        return;
      }

      // Mock submit
      await new Promise((r) => setTimeout(r, 1200));
      console.log('Referral submitted:', formData);
      alert('Derivación enviada exitosamente');
      window.location.href = '/professional-dashboard';
    } catch (e) {
      console.error(e);
      alert('Error al enviar la derivación. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Cancelar y salir? Se perderán los cambios no guardados.')) {
      window.location.href = '/professional-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        isAuthenticated={true}
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <Sidebar
        userRole={userRole}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="ArrowLeft" size={20} />
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Nueva Derivación</h1>
                <p className="text-muted-foreground">
                  {appointmentId ? 'Derivación desde cita médica' : 'Crear nueva derivación a especialista'}
                </p>
              </div>
            </div>
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Icon name="Loader2" size={32} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Cargando información...</p>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!loading && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Información del Paciente */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Información del Paciente</h2>
                    <p className="text-sm text-muted-foreground">
                      {appointmentId ? 'Datos precargados desde la cita' : 'Complete la información del paciente'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre Completo *"
                    value={formData?.patientInfo?.name}
                    onChange={(e) => handleInputChange('patientInfo', 'name', e?.target?.value)}
                    placeholder="Nombre del paciente"
                    required
                    disabled={!!appointmentId}
                  />
                  <Input
                    label="Cédula de Identidad *"
                    value={formData?.patientInfo?.id}
                    onChange={(e) => handleInputChange('patientInfo', 'id', e?.target?.value)}
                    placeholder="V-12345678"
                    required
                    disabled={!!appointmentId}
                  />
                  <Input
                    label="Edad"
                    type="number"
                    value={formData?.patientInfo?.age}
                    onChange={(e) => handleInputChange('patientInfo', 'age', e?.target?.value)}
                    placeholder="Edad en años"
                    disabled={!!appointmentId}
                  />
                  <Input
                    label="Teléfono"
                    value={formData?.patientInfo?.phone}
                    onChange={(e) => handleInputChange('patientInfo', 'phone', e?.target?.value)}
                    placeholder="+58 412-345-6789"
                    disabled={!!appointmentId}
                  />
                  <Input
                    label="Correo Electrónico"
                    type="email"
                    value={formData?.patientInfo?.email}
                    onChange={(e) => handleInputChange('patientInfo', 'email', e?.target?.value)}
                    placeholder="paciente@email.com"
                    disabled={!!appointmentId}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              {/* Información de la Derivación */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <Icon name="Share2" size={20} className="text-success" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Información de Derivación</h2>
                    <p className="text-sm text-muted-foreground">Detalles de la derivación al especialista</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Especialidad / Médico */}
                  <SpecialtySelector
                    selectedSpecialty={formData?.referralInfo?.specialty}
                    selectedDoctor={formData?.referralInfo?.targetDoctor}
                    onSpecialtyChange={(value) => handleInputChange('referralInfo', 'specialty', value)}
                    onDoctorChange={(value) => handleInputChange('referralInfo', 'targetDoctor', value)}
                  />

                  {/* Urgencia y Fecha preferida */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <UrgencySelector
                      selectedUrgency={formData?.referralInfo?.urgencyLevel}
                      onChange={(value) => handleInputChange('referralInfo', 'urgencyLevel', value)}
                    />
                    <Input
                      label="Fecha Preferida"
                      type="date"
                      value={formData?.referralInfo?.preferredDate}
                      onChange={(e) => handleInputChange('referralInfo', 'preferredDate', e?.target?.value)}
                      min={new Date()?.toISOString()?.split('T')?.[0]}
                    />
                  </div>

                  {/* Motivo / Notas / Historia */}
                  <ReferralReasonForm
                    reason={formData?.referralInfo?.reason}
                    clinicalNotes={formData?.referralInfo?.clinicalNotes}
                    medicalHistory={formData?.referralInfo?.medicalHistory}
                    onReasonChange={(value) => handleInputChange('referralInfo', 'reason', value)}
                    onClinicalNotesChange={(value) => handleInputChange('referralInfo', 'clinicalNotes', value)}
                    onMedicalHistoryChange={(value) => handleInputChange('referralInfo', 'medicalHistory', value)}
                  />
                </div>
              </div>

              {/* Adjuntos */}
              <div className="bg-card rounded-lg border border-border p-6">
                <AttachmentUpload
                  attachments={formData?.attachments}
                  onAttachmentAdd={handleAttachmentAdd}
                  onAttachmentRemove={handleAttachmentRemove}
                />
              </div>

              {/* Seguro */}
              <div className="bg-card rounded-lg border border-border p-6">
                <InsuranceVerification
                  patientId={formData?.patientInfo?.id}
                  specialty={formData?.referralInfo?.specialty}
                  isVerified={formData?.insuranceVerified}
                  onVerificationChange={(verified) =>
                    setFormData((prev) => ({ ...prev, insuranceVerified: verified }))
                  }
                />
              </div>

              {/* Preferencias de comunicación */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Icon name="MessageSquare" size={20} className="text-warning" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Preferencias de Comunicación</h2>
                    <p className="text-sm text-muted-foreground">Configure las notificaciones y seguimiento</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.communicationPreferences?.patientNotifications}
                      onChange={(e) =>
                        handleInputChange('communicationPreferences', 'patientNotifications', e?.target?.checked)
                      }
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Enviar notificaciones al paciente</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.communicationPreferences?.progressUpdates}
                      onChange={(e) =>
                        handleInputChange('communicationPreferences', 'progressUpdates', e?.target?.checked)
                      }
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Recibir actualizaciones de progreso</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.communicationPreferences?.followUpReminders}
                      onChange={(e) =>
                        handleInputChange('communicationPreferences', 'followUpReminders', e?.target?.checked)
                      }
                      className="rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">Programar recordatorios de seguimiento</span>
                  </label>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancelar
                </Button>

                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={() => {
                      console.log('Saving draft:', formData);
                      alert('Borrador guardado');
                    }}
                  >
                    Guardar Borrador
                  </Button>

                  <Button
                    type="submit"
                    variant="default"
                    disabled={
                      loading ||
                      !formData?.patientInfo?.name ||
                      !formData?.referralInfo?.specialty ||
                      !formData?.referralInfo?.reason
                    }
                    iconName={loading ? 'Loader2' : 'Send'}
                    iconPosition="left"
                    className={loading ? 'animate-spin' : ''}
                  >
                    {loading ? 'Enviando...' : 'Enviar Derivación'}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default NewReferralForm;
