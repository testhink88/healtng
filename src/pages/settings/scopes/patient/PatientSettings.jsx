import React, { useEffect, useState, useMemo, useRef } from "react";
import Header from "@/components/ui/Header"; 
import Sidebar from "@/components/ui/Sidebar"; 
import Icon from "@/components/AppIcon";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

/* =========================================================
   PATIENT SETTINGS
   - Persistencia: Supabase + LocalStorage (Buffer)
   - Lógica: Manejo de perfil personal y datos de contacto
========================================================= */

const STORAGE_KEY = "PATIENT_SETTINGS_BUFFER";

export default function PatientSettings() {
  const { profile, fetchProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    documentId: "",
    birthDate: "",
    gender: "",
    address: "",
    avatar_url: ""
  });

  const [baseline, setBaseline] = useState({});
  const photoInputRef = useRef(null);

  // Carga inicial
  useEffect(() => {
    if (profile) {
      const data = {
        fullName: profile.full_name || "",
        email: profile.email || "",
        phone: profile.metadata?.phone || "",
        documentId: profile.metadata?.document_id || "",
        birthDate: profile.metadata?.birth_date || "",
        gender: profile.metadata?.gender || "",
        address: profile.metadata?.address || "",
        avatar_url: profile.metadata?.avatar_url || ""
      };
      setFormData(data);
      setBaseline(data);
    }
  }, [profile]);

  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(baseline);
  }, [formData, baseline]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    setIsSaving(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          metadata: {
            ...profile.metadata,
            phone: formData.phone,
            document_id: formData.documentId,
            birth_date: formData.birthDate,
            gender: formData.gender,
            address: formData.address,
            avatar_url: formData.avatar_url
          }
        })
        .eq('id', profile.id);

      if (error) throw error;

      await fetchProfile();
      setBaseline(formData);
      setStatusMsg("Perfil actualizado correctamente.");
    } catch (err) {
      console.error("Error saving patient profile:", err);
      setErrorMsg("Error al guardar los cambios.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulación de preview Base64 (idealmente subir a Storage)
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField('avatar_url', reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar userRole="patient" />
      
      <main className="flex-1 lg:ml-64 pt-16 transition-all duration-300">
        <Header userRole="patient" isAuthenticated />
        
        <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
          {/* Header de la sección */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configuración de Cuenta</h1>
              <p className="text-sm text-muted-foreground">Administra tu información personal y de contacto.</p>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={!isDirty || isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>

          {statusMsg && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <Icon name="CheckCircle" size={20} />
              <span className="text-sm font-medium">{statusMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Menú Lateral de Configuración */}
            <div className="lg:col-span-3">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    activeSection === "profile" 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon name="User" size={18} />
                  Mi Perfil
                </button>
                <button
                  onClick={() => window.location.href = "/patient-health-profile"}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
                >
                  <Icon name="Activity" size={18} />
                  Perfil de Salud
                </button>
              </nav>
            </div>

            {/* Area de Contenido */}
            <div className="lg:col-span-9">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-8">
                
                {/* Foto de Perfil */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-md bg-muted">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon name="User" size={40} className="text-muted-foreground opacity-50" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => photoInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Icon name="Camera" size={14} />
                    </button>
                    <input 
                      type="file" 
                      ref={photoInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">Foto de Perfil</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">
                      Sube una foto clara para que tus médicos puedan identificarte fácilmente.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" onClick={() => photoInputRef.current?.click()}>Cambiar</Button>
                      {formData.avatar_url && (
                        <Button variant="ghost" size="sm" onClick={() => updateField('avatar_url', '')} className="text-destructive hover:bg-destructive/10">Eliminar</Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre Completo */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Nombre Completo</label>
                    <input 
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 opacity-60">
                    <label className="text-sm font-semibold text-foreground">Correo Electrónico</label>
                    <input 
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full h-11 rounded-xl border border-border bg-muted px-4 py-2 text-sm cursor-not-allowed"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Teléfono</label>
                    <input 
                      type="tel"
                      placeholder="+58 414-000-0000"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {/* Cédula / DNI */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Cédula / Pasaporte</label>
                    <input 
                      type="text"
                      value={formData.documentId}
                      onChange={(e) => updateField('documentId', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {/* Fecha de Nacimiento */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Fecha de Nacimiento</label>
                    <input 
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => updateField('birthDate', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>

                  {/* Género */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Género</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => updateField('gender', e.target.value)}
                      className="w-full h-11 rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                      <option value="prefer_not_to_say">Prefiero no decirlo</option>
                    </select>
                  </div>

                  {/* Dirección */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-sm font-semibold text-foreground">Dirección Residencial</label>
                    <textarea 
                      rows={2}
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
