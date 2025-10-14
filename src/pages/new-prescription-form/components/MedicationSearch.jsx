import React, { useState, useEffect } from 'react';
import Icon from "@/components/AppIcon";
import Input from '@/components/ui/Input';

const MedicationSearch = ({ value, onChange, patient }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [interactions, setInteractions] = useState([]);

  // Mock medication database
  const mockMedications = [
    { id: 1, name: 'Paracetamol', strength: '500mg', type: 'Analgésico' },
    { id: 2, name: 'Ibuprofeno', strength: '600mg', type: 'AINE' },
    { id: 3, name: 'Amoxicilina', strength: '500mg', type: 'Antibiótico' },
    { id: 4, name: 'Metformina', strength: '850mg', type: 'Antidiabético' },
    { id: 5, name: 'Losartán', strength: '50mg', type: 'Antihipertensivo' },
    { id: 6, name: 'Omeprazol', strength: '20mg', type: 'Gastroprotector' },
    { id: 7, name: 'Atorvastatina', strength: '20mg', type: 'Estatina' },
    { id: 8, name: 'Amlodipino', strength: '5mg', type: 'Antihipertensivo' }
  ];

  useEffect(() => {
    if (value && value?.length >= 2) {
      const filtered = mockMedications?.filter(med =>
        med?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [value]);

  const handleSelectMedication = (medication) => {
    const fullName = `${medication?.name} ${medication?.strength}`;
    onChange(fullName);
    setShowResults(false);
    
    // Check for interactions
    checkDrugInteractions(medication, patient?.currentMedications || []);
  };

  const checkDrugInteractions = (selectedMed, currentMeds) => {
    // Mock interaction checking
    const mockInteractions = [
      {
        medication: 'Metformina',
        severity: 'moderate',
        message: 'Puede potenciar el efecto hipoglucémico'
      }
    ];

    const foundInteractions = mockInteractions?.filter(interaction =>
      currentMeds?.some(med => med?.includes(interaction?.medication))
    );

    setInteractions(foundInteractions);
  };

  return (
    <div className="relative">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Buscar Medicamento <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(e) => onChange(e?.target?.value)}
            placeholder="Escriba el nombre del medicamento..."
            className="pl-10"
          />
        </div>
      </div>
      {/* Search Results Dropdown */}
      {showResults && searchResults?.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults?.map((medication) => (
            <button
              key={medication?.id}
              onClick={() => handleSelectMedication(medication)}
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 focus:outline-none focus:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">
                    {medication?.name} {medication?.strength}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {medication?.type}
                  </div>
                </div>
                <Icon name="Plus" size={16} className="text-muted-foreground" />
              </div>
            </button>
          ))}
        </div>
      )}
      {/* Drug Interactions Warning */}
      {interactions?.length > 0 && (
        <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-medium text-warning">Posibles Interacciones</span>
          </div>
          {interactions?.map((interaction, index) => (
            <div key={index} className="text-sm text-warning">
              <strong>{interaction?.medication}:</strong> {interaction?.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationSearch;