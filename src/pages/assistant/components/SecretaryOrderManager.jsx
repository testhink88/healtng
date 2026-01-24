import React from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

const SecretaryOrderManager = ({ orders = [] }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-normal text-gray-900">Órdenes por Presupuestar</h2>
      {orders.map(order => (
        <div key={order.orderId} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-normal uppercase">Pendiente</span>
              <p className="text-sm font-normal text-gray-500">Paciente: <span className="text-gray-900 font-medium">{order.patientName}</span></p>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              {order.items.map(item => <li key={item.id}>• {item.name}</li>)}
            </ul>
          </div>
          
          <div className="flex items-center gap-3">
             <Button className="bg-white border border-gray-200 text-gray-600 font-normal px-4 py-2 rounded-xl text-xs">
                Imprimir con QR
             </Button>
             <Button className="bg-[#0E39B1] text-white font-normal px-6 py-2 rounded-xl text-xs border-none">
                Generar Presupuesto
             </Button>
          </div>
        </div>
      ))}
    </div>
  );
};