// src/@/@/pages/provider/product-details/@/@/components/MovementHistoryTab.jsx
import React from "react";
import Icon from "@/components/AppIcon"; 
import Button from "@/components/ui/Button";

const MovementHistoryTab = ({ productId }) => {
  const movements = [
    {
      id: 1,
      date: new Date('2025-01-12'),
      type: 'entry',
      quantity: 100,
      reference: 'PO-2025-001',
      reason: 'Compra a proveedor',
      user: 'Dr. María González',
      balanceAfter: 250,
      supplier: 'Farmacéutica Central S.A.'
    },
    {
      id: 2,
      date: new Date('2025-01-11'),
      type: 'exit',
      quantity: -25,
      reference: 'SO-2025-045',
      reason: 'Dispensación a paciente',
      user: 'Enfermera Ana López',
      balanceAfter: 150,
      department: 'Urgencias'
    },
    {
      id: 3,
      date: new Date('2025-01-10'),
      type: 'adjustment',
      quantity: -5,
      reference: 'ADJ-2025-012',
      reason: 'Ajuste por inventario físico',
      user: 'Dr. Carlos Ruiz',
      balanceAfter: 175,
      notes: 'Diferencia encontrada en conteo físico'
    },
    {
      id: 4,
      date: new Date('2025-01-09'),
      type: 'exit',
      quantity: -30,
      reference: 'SO-2025-044',
      reason: 'Transferencia entre departamentos',
      user: 'Farmacéutico Luis Martín',
      balanceAfter: 180,
      department: 'Cardiología'
    },
    {
      id: 5,
      date: new Date('2025-01-08'),
      type: 'entry',
      quantity: 50,
      reference: 'PO-2025-002',
      reason: 'Reposición de stock',
      user: 'Dr. María González',
      balanceAfter: 210,
      supplier: 'Distribuidora Médica Norte'
    }
  ];

  return (
    <div className="space-y-3">
      {movements.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay movimientos</h3>
          <p className="text-muted-foreground">No se encontraron movimientos para este producto.</p>
        </div>
      ) : (
        movements.map((movement) => (
          <div key={movement.id} className="bg-card border border-border rounded-lg p-4 hover:bg-muted/30 healthcare-transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${movement.type === 'entry' ? 'bg-green-500' : 'bg-red-500'}`}>
                  <Icon name={movement.type === 'entry' ? 'ArrowUp' : 'ArrowDown'} size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-foreground">{movement.type === 'entry' ? 'Entrada' : 'Salida'}</h4>
                    <span className="text-sm text-muted-foreground">
                      {movement.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md font-mono">
                      {movement.reference}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{movement.reason}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="User" size={12} />
                      <span>{movement.user}</span>
                    </span>
                    {movement.supplier && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Building" size={12} />
                        <span>{movement.supplier}</span>
                      </span>
                    )}
                    {movement.department && (
                      <span className="flex items-center space-x-1">
                        <Icon name="MapPin" size={12} />
                        <span>{movement.department}</span>
                      </span>
                    )}
                  </div>
                  {movement.notes && (
                    <div className="mt-2 p-2 bg-muted/50 rounded-md">
                      <p className="text-xs text-muted-foreground">{movement.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${movement.quantity > 0 ? 'text-success' : 'text-error'}`}>
                  {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                </div>
                <div className="text-sm text-muted-foreground">
                  Balance: {movement.balanceAfter}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MovementHistoryTab;
