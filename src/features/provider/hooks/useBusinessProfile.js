// src/features/provider/hooks/useBusinessProfile.js
import { useEffect, useMemo, useState } from "react";
import { getProviderProfile, modulesFor, hasProviderOnboarding } from "@/utils/providerProfile";

export function useBusinessProfile() {
  const [profile, setProfile] = useState(getProviderProfile());

  useEffect(() => {
    const onUpd = () => setProfile(getProviderProfile());
    window.addEventListener("providerProfile:updated", onUpd);
    return () => window.removeEventListener("providerProfile:updated", onUpd);
  }, []);

  const hydrated = useMemo(() => {
    if (!profile) return null;
    const bt = profile.businessType || "mixto";
    const aud = profile.audience || "both";
    const buy = !!profile.canBuy;
    const mods = modulesFor(bt, aud, buy);
    return { ...profile, businessModules: mods };
  }, [profile]);

  return {
    profile: hydrated,
    isOnboarded: hasProviderOnboarding(),
  };
}

export function useBusinessFlags() {
  const { profile } = useBusinessProfile();
  const flags = useMemo(() => {
    const bt = profile?.businessType || "mixto";
    const aud = profile?.audience || "both";
    const canBuy = !!profile?.canBuy;

    return {
      isProduct: bt === "producto" || bt === "mixto",
      isService: bt === "servicio" || bt === "mixto",
      sellsToB2C: aud === "b2c" || aud === "both",
      sellsToB2B: aud === "b2b" || aud === "both",
      canBuy, // habilita compras/marketplace
      modules: profile?.businessModules || modulesFor(bt, aud, canBuy),
    };
  }, [profile]);

  return flags;
}
