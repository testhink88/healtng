import React, { useState, useEffect } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SpecialtySelector = ({ 
  selectedSpecialty, 
  selectedDoctor, 
  onSpecialtyChange, 
  onDoctorChange 
}) => {
  const [showDoctorFinder, setShowDoctorFinder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock specialties data
  const specialties = [
    { value: 'cardiology', label: 'Cardiología' },
    { value: 'dermatology', label: 'Dermatología' },
    { value: 'endocrinology', label: 'Endocrinología' },
    { value: 'gastroenterology', label: 'Gastroenterología' },
    { value: 'neurology', label: 'Neurología' },
    { value: 'orthopedics', label: 'Ortopedia y Traumatología' },
    { value: 'psychiatry', label: 'Psiquiatría' },
    { value: 'pulmonology', label: 'Neumología' },
    { value: 'urology', label: 'Urología' },
    { value: 'oncology', label: 'Oncología' }
  ];

  // Mock doctors data
  const mockDoctors = {
    cardiology: [
      { id: 1, name: 'Dr. Carlos Mendoza', hospital: 'Hospital Central', rating: 4.8, available: true },
      { id: 2, name: 'Dra. Ana García', hospital: 'Clínica Santa Fe', rating: 4.9, available: false }
    ],
    dermatology: [
      { id: 3, name: 'Dr. Miguel Torres', hospital: 'Centro Médico Los Andes', rating: 4.7, available: true },
      { id: 4, name: 'Dra. Carmen López', hospital: 'Hospital Universitario', rating: 4.6, available: true }
    ],
    endocrinology: [
      { id: 5, name: 'Dr. Roberto Silva', hospital: 'Hospital Central', rating: 4.8, available: true },
      { id: 6, name: 'Dra. Patricia Ruiz', hospital: 'Clínica Las Mercedes', rating: 4.9, available: true }
    ]
  };

  // Load doctors when specialty changes
  useEffect(() => {
    if (selectedSpecialty) {
      loadDoctorsBySpecialty(selectedSpecialty);
    } else {
      setAvailableDoctors([]);
    }
  }, [selectedSpecialty]);

  const loadDoctorsBySpecialty = async (specialty) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const doctors = mockDoctors?.[specialty] || [];
      setAvailableDoctors(doctors);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setAvailableDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = availableDoctors?.filter(doctor => 
    doctor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    doctor?.hospital?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleDoctorSelect = (doctor) => {
    onDoctorChange?.(doctor?.id);
    setShowDoctorFinder(false);
    setSearchQuery('');
  };

  const selectedDoctorData = availableDoctors?.find(doc => doc?.id === selectedDoctor);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Especialidad *"
          value={selectedSpecialty}
          onChange={onSpecialtyChange}
          placeholder="Seleccione una especialidad"
          required
        >
          <option value="">Seleccione una especialidad</option>
          {specialties?.map(specialty => (
            <option key={specialty?.value} value={specialty?.value}>
              {specialty?.label}
            </option>
          ))}
        </Select>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Médico Especialista
          </label>
          {selectedDoctorData ? (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{selectedDoctorData?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDoctorData?.hospital}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => onDoctorChange?.(null)}
              />
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDoctorFinder(true)}
              disabled={!selectedSpecialty || loading}
              iconName="Search"
              iconPosition="left"
              fullWidth
            >
              {loading ? 'Cargando médicos...' : 'Buscar Médico Especialista'}
            </Button>
          )}
        </div>
      </div>

      {/* Doctor Finder Modal */}
      {showDoctorFinder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Seleccionar Médico Especialista
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDoctorFinder(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  placeholder="Buscar por nombre o hospital..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-96 p-4">
              {filteredDoctors?.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="UserX" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No se encontraron médicos que coincidan con la búsqueda' : 'No hay médicos disponibles para esta especialidad'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDoctors?.map(doctor => (
                    <div
                      key={doctor?.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                        doctor?.available 
                          ? 'border-border hover:border-primary/50' :'border-error/20 bg-error/5 cursor-not-allowed'
                      }`}
                      onClick={() => doctor?.available && handleDoctorSelect(doctor)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            doctor?.available ? 'bg-primary/10' : 'bg-muted'
                          }`}>
                            <Icon 
                              name="User" 
                              size={20} 
                              className={doctor?.available ? 'text-primary' : 'text-muted-foreground'} 
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{doctor?.name}</p>
                            <p className="text-sm text-muted-foreground">{doctor?.hospital}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                <Icon name="Star" size={12} className="text-warning fill-current" />
                                <span className="text-xs text-muted-foreground">{doctor?.rating}</span>
                              </div>
                              <div className={`w-2 h-2 rounded-full ${
                                doctor?.available ? 'bg-success' : 'bg-error'
                              }`}></div>
                              <span className="text-xs text-muted-foreground">
                                {doctor?.available ? 'Disponible' : 'No disponible'}
                              </span>
                            </div>
                          </div>
                        </div>
                        {doctor?.available && (
                          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialtySelector;