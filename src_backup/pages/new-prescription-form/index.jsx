import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Icon from '@/components/AppIcon';
import PatientSummary from '@/components/PatientSummary';
import MedicationSearch from '@/components/MedicationSearch';
import PrescriptionPreview from '@/components/PrescriptionPreview';
import SignatureCapture from '@/components/SignatureCapture';

const NewPrescriptionForm = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState('doctor');
  
  // Form state
  const [patient, setPatient] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [medications, setMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [refillAuthorization, setRefillAuthorization] = useState(false);
  const [pharmacyPreference, setPharmacyPreference] = useState('');
  const [signature, setSignature] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get appointmentId from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const appointmentId = urlParams?.get('appointmentId');
    
    if (appointmentId) {
      loadAppointmentData(appointmentId);
    }
  }, [location]);

  const loadAppointmentData = async (appointmentId) => {
    setIsLoading(true);
    try {
      // Mock data - in real app this would be API calls
      const mockAppointment = {
        id: appointmentId,
        patientName: 'María González',
        patientAge: 45,
        patientAllergies: ['Penicilina', 'Sulfonamidas'],
        currentMedications: ['Metformina 850mg', 'Losartán 50mg'],
        doctorName: 'Dr. Carlos Rodríguez',
        date: new Date()?.toISOString()?.split('T')?.[0],
        time: '10:30'
      };
      
      setAppointment(mockAppointment);
      setPatient({
        name: mockAppointment?.patientName,
        age: mockAppointment?.patientAge,
        allergies: mockAppointment?.patientAllergies,
        currentMedications: mockAppointment?.currentMedications
      });
    } catch (error) {
      console.error('Error loading appointment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMedication = () => {
    if (!selectedMedication || !dosage || !frequency || !duration) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const newMedication = {
      id: Date.now(),
      name: selectedMedication,
      dosage,
      frequency,
      duration,
      instructions: specialInstructions
    };

    setMedications([...medications, newMedication]);
    
    // Reset form fields
    setSelectedMedication('');
    setDosage('');
    setFrequency('');
    setDuration('');
    setSpecialInstructions('');
  };

  const handleRemoveMedication = (medicationId) => {
    setMedications(medications?.filter(med => med?.id !== medicationId));
  };

  const handleSavePrescription = async () => {
    if (medications?.length === 0) {
      alert('Por favor agregue al menos un medicamento');
      return;
    }

    if (!signature) {
      alert('Por favor firme la receta');
      return;
    }

    setIsLoading(true);
    try {
      // Mock save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Receta guardada exitosamente');
      window.history?.back();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Error al guardar la receta');
    } finally {
      setIsLoading(false);
    }
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
      <main className={`pt-16 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <div className="p-4 lg:p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Nueva Receta Médica</h1>
              <p className="text-muted-foreground">Crear prescripción médica digital</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => window.history?.back()}
              >
                Volver
              </Button>
              <Button
                variant="outline"
                iconName="Eye"
                iconPosition="left"
                onClick={() => setShowPreview(!showPreview)}
                className={showPreview ? 'bg-primary text-primary-foreground' : ''}
              >
                Vista Previa
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Patient Summary */}
              {patient && (
                <PatientSummary 
                  patient={patient}
                  appointment={appointment}
                />
              )}

              {/* Medication Selection */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Selección de Medicamentos</h2>
                
                <div className="space-y-4">
                  <MedicationSearch
                    value={selectedMedication}
                    onChange={setSelectedMedication}
                    patient={patient}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Dosis <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={dosage}
                        onChange={(e) => setDosage(e?.target?.value)}
                        placeholder="ej. 500mg, 1 tableta"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Frecuencia <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={frequency}
                        onValueChange={setFrequency}
                      >
                        <option value="">Seleccionar frecuencia</option>
                        <option value="cada-6-horas">Cada 6 horas</option>
                        <option value="cada-8-horas">Cada 8 horas</option>
                        <option value="cada-12-horas">Cada 12 horas</option>
                        <option value="cada-24-horas">Cada 24 horas</option>
                        <option value="segun-necesidad">Según necesidad</option>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Duración <span className="text-destructive">*</span>
                      </label>
                      <Select
                        value={duration}
                        onValueChange={setDuration}
                      >
                        <option value="">Seleccionar duración</option>
                        <option value="3-dias">3 días</option>
                        <option value="5-dias">5 días</option>
                        <option value="7-dias">7 días</option>
                        <option value="10-dias">10 días</option>
                        <option value="15-dias">15 días</option>
                        <option value="30-dias">30 días</option>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Instrucciones Especiales
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e?.target?.value)}
                      placeholder="Instrucciones adicionales para el paciente..."
                      className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    onClick={handleAddMedication}
                    iconName="Plus"
                    iconPosition="left"
                    className="w-full md:w-auto"
                  >
                    Agregar Medicamento
                  </Button>
                </div>
              </div>

              {/* Current Medications */}
              {medications?.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Medicamentos Recetados</h2>
                  
                  <div className="space-y-3">
                    {medications?.map((medication) => (
                      <div key={medication?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Icon name="Pill" size={16} className="text-primary" />
                            <h3 className="font-medium text-foreground">{medication?.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {medication?.dosage} • {medication?.frequency} • {medication?.duration}
                          </p>
                          {medication?.instructions && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {medication?.instructions}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedication(medication?.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Digital Signature */}
              <SignatureCapture
                signature={signature}
                onSignatureChange={setSignature}
              />
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              {showPreview && (
                <PrescriptionPreview
                  patient={patient}
                  appointment={appointment}
                  medications={medications}
                  signature={signature}
                />
              )}

              {/* Actions */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Acciones</h2>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleSavePrescription}
                    iconName="Save"
                    iconPosition="left"
                    className="w-full"
                    disabled={medications?.length === 0 || !signature}
                  >
                    Guardar Receta
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="FileText"
                    iconPosition="left"
                    className="w-full"
                    disabled={medications?.length === 0}
                  >
                    Exportar PDF
                  </Button>
                  
                  <Button
                    variant="outline"
                    iconName="QrCode"
                    iconPosition="left"
                    className="w-full"
                    disabled={medications?.length === 0}
                  >
                    Generar QR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewPrescriptionForm;