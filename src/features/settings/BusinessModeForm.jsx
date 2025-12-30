import React, { useEffect, useState } from "react";
import { getBusinessContext, setBusinessContext } from "@/utils/business";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

export default function BusinessModeForm() {
  const [profile, setProfile] = useState(getBusinessContext());

  useEffect(() => setProfile(getBusinessContext()), []);

  const save = () => {
    setBusinessContext(profile);
    alert("Preferencias guardadas.");
  };

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Modo</label>
        <Select
          options={[
            {label:"B2C (vendo a público)", value:"b2c"},
            {label:"B2B (empresas)", value:"b2b"},
            {label:"Mixto", value:"hybrid"},
          ]}
          value={profile.mode}
          onChange={(v) => setProfile(p => ({ ...p, mode: v }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!profile.sellToPublic} onChange={(e)=>setProfile(p=>({...p, sellToPublic:e.target.checked}))}/>
          Vendo a público
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!profile.sellToBusinesses} onChange={(e)=>setProfile(p=>({...p, sellToBusinesses:e.target.checked}))}/>
          Vendo a empresas
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={!!profile.buyFromVendors} onChange={(e)=>setProfile(p=>({...p, buyFromVendors:e.target.checked}))}/>
          Compro a proveedores
        </label>
      </div>

      <Button onClick={save}>Guardar</Button>
    </div>
  );
}
