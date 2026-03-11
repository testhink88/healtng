import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabase';

const PersonalInfo = ({ patient, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: patient?.fullName || '',
    dni: patient?.dni || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || '',
    bloodType: patient?.bloodType || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    address: patient?.address || '',
    emergencyName: patient?.emergencyContact?.name || '',
    emergencyRel: patient?.emergencyContact?.relationship || '',
    emergencyPhone: patient?.emergencyContact?.phone || '',
  });

  // Sync state if patient prop changes (after fetch or update)
  React.useEffect(() => {
    setFormData({
      fullName: patient?.fullName || '',
      dni: patient?.dni || '',
      dateOfBirth: patient?.dateOfBirth || '',
      gender: patient?.gender || '',
      bloodType: patient?.bloodType || '',
      phone: patient?.phone || '',
      email: patient?.email || '',
      address: patient?.address || '',
      emergencyName: patient?.emergencyContact?.name || '',
      emergencyRel: patient?.emergencyContact?.relationship || '',
      emergencyPhone: patient?.emergencyContact?.phone || '',
    });
  }, [patient]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log("Saving patient metadata:", patient.id, formData);
      
      // Construir el objeto de metadatos actualizado
      const updatedMetadata = {
        ...(patient.metadata || {}),
        document_id: formData.dni,
        date_of_birth: formData.dateOfBirth,
        gender: formData.gender,
        blood_type: formData.bloodType,
        phone: formData.phone,
        address: formData.address,
        emergency_contact: {
          name: formData.emergencyName,
          relationship: formData.emergencyRel,
          phone: formData.emergencyPhone
        }
      };

      const { data, error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          metadata: updatedMetadata
        })
        .eq('id', patient.id)
        .select();

      if (error) {
        console.error("Supabase error detail:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No se actualizó ninguna fila. Verifica que tengas permisos (RLS) para editar este paciente.");
      }

      console.log("Update success:", data);
      setIsEditing(false);
      if (onUpdate) await onUpdate(); // Asegurar que esperamos la actualización
    } catch (err) {
      console.error("Error updating patient info:", err);
      alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date?.toLocaleDateString('es-VE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'O+': 'bg-red-100 text-red-800 border-red-200',
      'O-': 'bg-red-100 text-red-800 border-red-200',
      'A+': 'bg-blue-100 text-blue-800 border-blue-200',
      'A-': 'bg-blue-100 text-blue-800 border-blue-200',
      'B+': 'bg-green-100 text-green-800 border-green-200',
      'B-': 'bg-green-100 text-green-800 border-green-200',
      'AB+': 'bg-purple-100 text-purple-800 border-purple-200',
      'AB-': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors?.[bloodType] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const inputClass = "bg-muted border-border focus:ring-primary/20";

  return (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <Icon name="User" size={20} className="mr-2" />
            Información Básica
          </h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} iconName="Edit2">
              Editar Información
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} loading={isLoading} iconName="Save">
                Guardar Cambios
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Nombre Completo</label>
            {isEditing ? (
              <Input 
                value={formData.fullName} 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{patient?.fullName}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Documento de Identidad</label>
            {isEditing ? (
              <Input 
                value={formData.dni} 
                onChange={(e) => setFormData({...formData, dni: e.target.value})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{patient?.dni}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</label>
            {isEditing ? (
              <Input 
                type="date"
                value={formData.dateOfBirth} 
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{formatDate(patient?.dateOfBirth)}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Género</label>
            {isEditing ? (
              <Select
                options={[
                  { label: "Masculino", value: "Masculino" },
                  { label: "Femenino", value: "Femenino" },
                  { label: "Otro", value: "Otro" }
                ]}
                value={formData.gender}
                onChange={(val) => setFormData({...formData, gender: val})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{patient?.gender}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Grupo Sanguíneo</label>
            {isEditing ? (
              <Select
                options={[
                  { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
                  { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" }
                ]}
                value={formData.bloodType}
                onChange={(val) => setFormData({...formData, bloodType: val})}
                className={inputClass}
              />
            ) : (
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getBloodTypeColor(patient?.bloodType)}`}>
                  {patient?.bloodType || 'N/A'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Phone" size={20} className="mr-2" />
          Información de Contacto
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
            {isEditing ? (
              <Input 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{patient?.phone}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground font-medium">{patient?.email}</p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Dirección</label>
            {isEditing ? (
              <Input 
                value={formData.address} 
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className={inputClass}
              />
            ) : (
              <p className="text-foreground font-medium">{patient?.address}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Heart" size={20} className="mr-2" />
          Información Médica
        </h3>
        
        <div className="space-y-4">
          {/* Allergies */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Alergias</label>
            {patient?.allergies?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient?.allergies?.map((allergy, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-error/10 text-error text-sm rounded-full border border-error/20 font-medium"
                  >
                    <Icon name="AlertTriangle" size={12} className="mr-1" />
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin alergias registradas</p>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Condiciones Crónicas</label>
            {patient?.chronicConditions?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {patient?.chronicConditions?.map((condition, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-warning/10 text-warning text-sm rounded-full border border-warning/20 font-medium"
                  >
                    <Icon name="Clock" size={12} className="mr-1" />
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Sin condiciones crónicas registradas</p>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="AlertCircle" size={20} className="mr-2" />
          Contacto de Emergencia
        </h3>
        <div className="bg-muted ring-1 ring-border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Nombre</label>
              {isEditing ? (
                <Input 
                  value={formData.emergencyName} 
                  onChange={(e) => setFormData({...formData, emergencyName: e.target.value})}
                  className={inputClass}
                />
              ) : (
                <p className="text-foreground font-medium">{patient?.emergencyContact?.name || '---'}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Relación</label>
              {isEditing ? (
                <Input 
                  value={formData.emergencyRel} 
                  onChange={(e) => setFormData({...formData, emergencyRel: e.target.value})}
                  className={inputClass}
                />
              ) : (
                <p className="text-foreground font-medium">{patient?.emergencyContact?.relationship || '---'}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
              {isEditing ? (
                <Input 
                  value={formData.emergencyPhone} 
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className={inputClass}
                />
              ) : (
                <p className="text-foreground font-medium">{patient?.emergencyContact?.phone || '---'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={20} className="mr-2" />
          Información del Seguro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Aseguradora</label>
            <p className="text-foreground font-medium">{patient?.insurance?.provider}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Número de Póliza</label>
            <p className="text-foreground font-medium">{patient?.insurance?.policyNumber}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Estado</label>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              patient?.insurance?.status === 'Vigente' ? 'bg-success/10 text-success border border-success/20': 'bg-error/10 text-error border border-error/20'
            }`}>
              {patient?.insurance?.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;