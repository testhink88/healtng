// src/pages/assistant/components/BudgetManager.jsx
import React, { useState } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

// MOCK DE PROVEEDORES DEL MARKETPLACE (Fase Piloto)
const ALLIED_LABS = [
  { id: 'lab-sepro', name: 'Seprosalud (Rafael)', discount: 0.15, availability: 'Inmediata' },
  { id: 'lab-medicare', name: 'Suministros Medicare (Kevin)', discount: 0.10, availability: 'Previa Cita' }
];

// TARIFARIO MOCK (Punto 7 - Conexión con Marketplace)
const MARKETPLACE_PRICES = {
  'lab-01': 15.00, // Hematología Completa
  'lab-02': 45.00, // Perfil 20
  'img-01': 35.00, // Rayos X
  'img-02': 60.00  // Eco Abdominal
};

const BudgetManager = ({ order, onBudgetGenerated }) => {
  const [selectedLabId, setSelectedLabId] = useState('');
  const [finalBudget, setFinalBudget] = useState(null);

  const calculateBudget = () => {
    const lab = ALLIED_LABS.find(l => l.id === selectedLabId);
    if (!lab) return;

    let subtotal = 0;
    const itemsWithPrice = order.items.map(item => {
      const price = MARKETPLACE_PRICES[item.id] || 0;
      subtotal += price;
      return { ...item, price };
    });

    const total = subtotal * (1 - lab.discount);

    const budgetData = {
      budgetId: `BUD-${Date.now()}`,
      orderId: order.orderId,
      labName: lab.name,
      items: itemsWithPrice,
      subtotal,
      discount: subtotal * lab.discount,
      total,
      currency: 'USD',
      status: 'sent'
    };

    setFinalBudget(budgetData);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
        <h4 className="text-[10px] font-normal text-gray-400 uppercase tracking-widest mb-3">1. Seleccionar Proveedor de Red</h4>
        <select 
          className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-sm outline-none focus:border-[#0E39B1]"
          value={selectedLabId}
          onChange={(e) => setSelectedLabId(e.target.value)}
        >
          <option value="">Seleccione un laboratorio aliado...</option>
          {ALLIED_LABS.map(lab => (
            <option key={lab.id} value={lab.id}>{lab.name} ({lab.discount * 100}% Desc. Healtng)</option>
          ))}
        </select>
        <Button 
          onClick={calculateBudget}
          disabled={!selectedLabId}
          className="w-full mt-4 bg-[#0E39B1] text-white font-normal py-3 rounded-xl border-none shadow-none"
        >
          Calcular Presupuesto Healtng
        </Button>
      </div>

      {finalBudget && (
        <div className="border-2 border-[#0E39B1] rounded-2xl p-6 space-y-4 bg-white">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <h4 className="text-sm font-normal text-gray-900">Cotización: {finalBudget.labName}</h4>
            <span className="text-lg font-normal text-[#0E39B1]">${finalBudget.total.toFixed(2)}</span>
          </div>
          
          <ul className="space-y-2">
            {finalBudget.items.map(item => (
              <li key={item.id} className="flex justify-between text-xs text-gray-500 font-normal">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 flex gap-2">
            <Button className="flex-1 bg-emerald-500 text-white border-none text-xs rounded-xl py-3">
              <Icon name="Send" size={14} className="mr-2" /> Enviar al Paciente
            </Button>
            <Button className="bg-gray-100 text-gray-600 border-none text-xs rounded-xl px-4">
              <Icon name="Printer" size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;