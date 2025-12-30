import React from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Search, Calendar } from "lucide-react";

export default function LotsFilters({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div className="flex flex-wrap gap-3 items-end flex-1">
        <div className="min-w-[260px] flex-1">
          <label className="block text-xs text-gray-500 mb-1">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              className="w-full pl-9"
              placeholder="Buscar por producto, SKU o lote…"
              value={value.q}
              onChange={(e) => set("q", e.target.value)}
            />
          </div>
        </div>

        <div className="min-w-[180px]">
          <label className="block text-xs text-gray-500 mb-1">Estado de vencimiento</label>
          <Select
            value={value.status}
            onChange={(v) => set("status", v)}
            options={["Todos", "Por vencer", "Vencido", "OK"].map((x) => ({ label: x, value: x }))}
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="date" className="pl-9" value={value.from} onChange={(e) => set("from", e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input type="date" className="pl-9" value={value.to} onChange={(e) => set("to", e.target.value)} />
          </div>
        </div>
      </div>

      <button
        className="text-sm text-gray-500"
        onClick={() => onChange({ q: "", status: "Todos", from: "", to: "" })}
      >
        Limpiar
      </button>
    </div>
  );
}
