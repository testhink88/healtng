// src/components/ui/ContextActionBar.jsx

import React from 'react';
// Asumimos que estos imports se resuelven correctamente desde el contexto de ui/
import Button from './Button'; 
import Input from './Input';   
import Select from './Select'; 
import Icon from '../AppIcon'; 

/**
 * Componente que provee la barra de acciones contextuales sobre una tabla o lista.
 * Fusiona búsqueda, filtros y acciones primarias/secundarias.
 * Este es un componente crucial para el diseño de HealthInventory.
 */
const ContextActionBar = ({ 
    title, 
    searchPlaceholder, 
    onSearch, 
    primaryAction, 
    secondaryActions = [], 
    filters = [], 
    selectedCount = 0,
    showFilters = true
}) => {
    
    // NOTA: La lógica completa de filtros complejos (modales/paneles) se delega a los componentes padres.
    // Aquí solo proveemos la estructura visual y los botones de acción.

    const renderPrimaryAction = () => {
        if (!primaryAction || !primaryAction.label) return null;
        
        return (
            <Button 
                variant={primaryAction?.variant || 'default'}
                onClick={primaryAction?.onClick}
                iconName={primaryAction?.icon}
                iconPosition="left"
            >
                {primaryAction?.label}
            </Button>
        );
    };

    return (
        <div className="bg-card border border-border rounded-lg p-4 mb-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                
                {/* Título y Conteo de Selección */}
                <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                    {selectedCount > 0 && (
                        <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                            {selectedCount} seleccionado{selectedCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Controles de Búsqueda y Acción */}
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        {/* 💡 Búsqueda */}
                        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder={searchPlaceholder || "Buscar..."}
                            onChange={(e) => onSearch(e.target.value)}
                            className="pl-9 w-64"
                        />
                    </div>
                    
                    {/* Botón de Filtros (Si existe) */}
                    {showFilters && filters?.length > 0 && (
                         <Button variant="outline" iconName="Filter">Filtros</Button>
                    )}

                    {/* Acciones Secundarias */}
                    {secondaryActions.map((action, index) => (
                        <Button key={index} variant={action.variant} onClick={action.onClick} size="sm">
                            <Icon name={action.icon} size={16} className="mr-1" />
                            {action.label}
                        </Button>
                    ))}

                    {/* Acción Primaria (Agregar) */}
                    {renderPrimaryAction()}
                </div>
            </div>
        </div>
    );
};

export default ContextActionBar;