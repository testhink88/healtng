// src/@/@/@/@/pages/provider/product-details/@/@/@/@/components/OrderAssociationsTab.jsx
import React from "react";
import Icon from "@/components/AppIcon";   // ✅ Ruta correcta
import Button from "@/components/ui/Button"; // ✅ Esto sí está en /ui

const OrderAssociationsTab = ({ productId }) => {
  const orders = [
    {
      id: "PO-2025-001",
      type: "purchase",
      date: new Date("2025-01-12"),
      status: "completed",
      quantity: 100,
      unitPrice: 12.50,
      totalAmount: 1250.00,
      supplier: "Farmacéutica Central S.A.",
      deliveryDate: new Date("2025-01-15"),
      notes: "Entrega completa según especificaciones"
    },
    {
      id: "SO-2025-045",
      type: "sales",
      date: new Date("2025-01-11"),
      status: "pending",
      quantity: 25,
      unitPrice: 18.75,
      totalAmount: 468.75,
      customer: "Hospital Regional Norte",
      deliveryDate: new Date("2025-01-16"),
      notes: "Pendiente de confirmación de entrega"
    },
    {
      id: "PO-2025-002",
      type: "purchase",
      date: new Date("2025-01-08"),
      status: "confirmed",
      quantity: 50,
      unitPrice: 12.00,
      totalAmount: 600.00,
      supplier: "Distribuidora Médica Norte",
      deliveryDate: new Date("2025-01-20"),
      notes: "Pedido urgente para reposición"
    },
    {
      id: "SO-2025-044",
      type: "sales",
      date: new Date("2025-01-09"),
      status: "completed",
      quantity: 30,
      unitPrice: 18.75,
      totalAmount: 562.50,
      customer: "Clínica San Rafael",
      deliveryDate: new Date("2025-01-12"),
      notes: "Entregado en tiempo y forma"
    },
    {
      id: "PO-2025-003",
      type: "purchase",
      date: new Date("2025-01-05"),
      status: "canceled",
      quantity: 75,
      unitPrice: 11.80,
      totalAmount: 885.00,
      supplier: "Suministros Médicos del Sur",
      deliveryDate: null,
      notes: "Cancelado por problemas de calidad del proveedor"
    }
  ];

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No hay pedidos</h3>
          <p className="text-muted-foreground">No se encontraron pedidos para este producto.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-card border border-border rounded-lg p-6 hover:bg-muted/30 healthcare-transition">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 bg-muted flex items-center justify-center ${order.status === "completed" ? 'bg-green-500' : 'bg-yellow-500'}`}>
                  <Icon name={order.status === "completed" ? "CheckCircle" : "Clock"} size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{order.id}</h4>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      <Icon name="DollarSign" size={12} />
                      <span>{order.totalAmount} €</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {order.date.toLocaleDateString("es-ES", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs">Proveedor / Cliente</p>
                      <p className="text-sm">{order.supplier || order.customer}</p>
                    </div>
                    {order.deliveryDate && (
                      <div>
                        <p className="text-xs">Fecha de entrega</p>
                        <p className="text-sm">{order.deliveryDate.toLocaleDateString("es-ES")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => console.log(`Ver detalles de ${order.id}`)} iconName="Eye" iconPosition="left">
                  Ver detalles
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderAssociationsTab;
