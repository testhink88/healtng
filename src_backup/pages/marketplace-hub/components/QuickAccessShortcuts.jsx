import React from 'react';
import { Upload, Truck, Heart, Package, Search, Plus, Building2 } from 'lucide-react';

const QuickAccessShortcuts = ({ userRole, onNavigate }) => {
  const getShortcuts = () => {
    const commonShortcuts = [
      {
        id: 'track-orders',
        title: 'Rastrear Pedidos',
        description: 'Seguimiento en tiempo real',
        icon: Truck,
        color: 'bg-blue-500',
        onClick: () => onNavigate('/orders')
      },
      {
        id: 'saved-items',
        title: 'Lista de Deseos',
        description: 'Productos guardados',
        icon: Heart,
        color: 'bg-red-500',
        onClick: () => onNavigate('/marketplace/b2c?tab=saved')
      }
    ];

    if (userRole === 'patient') {
      return [
        {
          id: 'upload-prescription',
          title: 'Subir Receta',
          description: 'Obtén tus medicamentos',
          icon: Upload,
          color: 'bg-green-500',
          onClick: () => onNavigate('/prescription-management')
        },
        {
          id: 'search-pharmacy',
          title: 'Buscar Farmacia',
          description: 'Encuentra la más cercana',
          icon: Search,
          color: 'bg-purple-500',
          onClick: () => onNavigate('/marketplace/b2c?filter=pharmacy')
        },
        ...commonShortcuts,
        {
          id: 'health-products',
          title: 'Productos de Salud',
          description: 'Vitaminas y suplementos',
          icon: Package,
          color: 'bg-orange-500',
          onClick: () => onNavigate('/marketplace/b2c?category=wellness')
        }
      ];
    } else {
      return [
        {
          id: 'create-po',
          title: 'Nueva Orden de Compra',
          description: 'Generar solicitud oficial',
          icon: Plus,
          color: 'bg-green-500',
          onClick: () => onNavigate('/marketplace/b2b?action=new-po')
        },
        {
          id: 'provider-catalog',
          title: 'Catálogo Proveedores',
          description: 'Explorar ofertas B2B',
          icon: Building2,
          color: 'bg-purple-500',
          onClick: () => onNavigate('/marketplace/b2b')
        },
        ...commonShortcuts,
        {
          id: 'bulk-orders',
          title: 'Pedidos por Volumen',
          description: 'Precios preferenciales',
          icon: Package,
          color: 'bg-orange-500',
          onClick: () => onNavigate('/marketplace/b2b?filter=bulk')
        }
      ];
    }
  };

  const shortcuts = getShortcuts();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Accesos Rápidos</h2>
          <p className="text-sm text-muted-foreground">
            Funciones frecuentes para {userRole === 'patient' ? 'pacientes' : 'profesionales'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {shortcuts?.map((shortcut) => (
          <button
            key={shortcut?.id}
            onClick={shortcut?.onClick}
            className="
              flex flex-col items-center gap-3 p-4 rounded-xl 
              bg-muted/50 hover:bg-muted transition-all duration-200
              hover:scale-105 hover:shadow-md group
              focus:outline-none focus:ring-2 focus:ring-primary/50
            "
          >
            <div className={`
              p-3 rounded-xl ${shortcut?.color} text-white 
              group-hover:scale-110 transition-transform duration-200
              shadow-lg
            `}>
              <shortcut.icon className="h-5 w-5" />
            </div>
            
            <div className="text-center">
              <div className="font-medium text-foreground text-sm mb-1">
                {shortcut?.title}
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                {shortcut?.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAccessShortcuts;