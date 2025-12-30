import React, { useMemo, useState } from "react";
import { getBusinessContext, flagsFromProfile } from "@/utils/business";
import Button from "@/components/ui/Button";

const Tab = ({ active, onClick, children }) => (
  <Button variant={active ? "default" : "outline"} onClick={onClick} className="mr-2">{children}</Button>
);

export default function OrdersHub() {
  const flags = flagsFromProfile(getBusinessContext());
  const available = useMemo(() => ([
    flags.isB2C && { key: "b2c", label: "B2C" },
    flags.canB2BSell && { key: "b2b-sales", label: "B2B (Ventas)" },
    flags.canB2BBuy && { key: "purchase", label: "Órdenes de Compra" },
  ].filter(Boolean)), [flags]);

  const [tab, setTab] = useState(available[0]?.key ?? "b2c");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        {available.map(t => (
          <Tab key={t.key} active={tab===t.key} onClick={()=>setTab(t.key)}>{t.label}</Tab>
        ))}
      </div>
      {tab === "b2c" && <div>Tabla de Pedidos B2C</div>}
      {tab === "b2b-sales" && <div>Tabla de Pedidos B2B (Ventas)</div>}
      {tab === "purchase" && <div>Tabla de Órdenes de Compra</div>}
    </div>
  );
}
