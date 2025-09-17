// src/pages/prescription-management/components/PharmacyFinderModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

/* =================== CARGADOR DINÁMICO GOOGLE MAPS =================== */
let gmapsPromise = null;
function loadGoogleMaps(apiKey) {
  if (typeof window !== "undefined" && window.google && window.google?.maps) {
    return Promise.resolve(window.google?.maps);
  }
  if (!gmapsPromise) {
    gmapsPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-gmaps-loader="1"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.google.maps));
        existing.addEventListener("error", () => reject(new Error("Error loading Google Maps")));
        return;
      }
      const s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.defer = true;
      s.dataset.gmapsLoader = "1";
      const key =
        apiKey ||
        window.GMAPS_API_KEY ||
        import.meta?.env?.VITE_GOOGLE_MAPS_API_KEY;
      
      // Check if we have a valid API key
      if (!key || key === "YOUR_GOOGLE_MAPS_API_KEY" || key === "your-google-maps-api-key-here") {
        reject(new Error("Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment file."));
        return;
      }
      
      s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        key
      )}&libraries=places&loading=async`;
      s.onload = () => {
        if (window.google && window.google.maps) resolve(window.google.maps);
        else reject(new Error("Google Maps loaded but window.google.maps missing"));
      };
      s.onerror = () => reject(new Error("Failed to load Google Maps - invalid API key or network error"));
      document.head.appendChild(s);
    });
  }
  return gmapsPromise;
}
/* ===================================================================== */

/** MOCK DATA (conecta a API cuando esté lista) */
const mockPlaces = [
  { id:"ph1", name:"Farmacia Central", address:"Av. Francisco de Miranda, Caracas", distanceKm:0.8, phone:"+58 212-555-0123", hours:"Lun-Dom: 7:00 AM – 10:00 PM", price:12.5, rating:4.8, availability:"Disponible", delivery:true,  lat:10.4902, lng:-66.8529 },
  { id:"ph2", name:"Farmatodo Plaza Venezuela", address:"C.C. Plaza Venezuela, Caracas", distanceKm:1.2, phone:"+58 555-0109",   hours:"Lun-Dom: 8:00 AM – 9:00 PM", price:11.75,rating:4.6, availability:"Disponible", delivery:false, lat:10.4964, lng:-66.8754 },
  { id:"ph3", name:"Locatel Chacao", address:"Av. Francisco de Miranda, Chacao", distanceKm:2.1, phone:"+58 555-0789",        hours:"Lun-Dom: 6:00 AM – 11:00 PM", price:12.99,rating:4.7, availability:"Sin stock",  delivery:true,  lat:10.4959, lng:-66.8458 },
];

function Pill({ children, tone = "default" }) {
  const cls =
    tone === "success" ?"bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
      : tone === "warning" ?"bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800" :"bg-muted text-foreground/80 border-border";
  return <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${cls}`}>{children}</span>;
}

const Row = ({ place, selected, onSelect }) => {
  const available = place?.availability === "Disponible";
  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className={`w-full text-left rounded-lg border p-3 transition-colors ${
        selected ? "border-primary ring-2 ring-primary/40" : "border-border hover:bg-muted/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium text-foreground truncate">{place?.name}</div>
            <div className="text-xs text-muted-foreground">★ {place?.rating}</div>
          </div>
          <div className="text-xs text-muted-foreground truncate">{place?.address}</div>
          <div className="mt-1 flex items-center gap-2">
            <Pill tone={available ? "success" : "warning"}>{place?.availability}</Pill>
            {place?.delivery && <Pill>Delivery</Pill>}
            <span className="text-xs text-muted-foreground">· {place?.distanceKm} km</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {place?.hours} — <span className="font-medium">{place?.phone}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="text-sm font-semibold text-foreground">${place?.price?.toFixed(2)}</div>
          <Icon name={selected ? "CheckCircle2" : "Circle"} size={18} className={selected ? "text-primary mt-1" : "text-muted-foreground mt-1"} />
        </div>
      </div>
    </button>
  );
};

/* ========================= MAPA (con loader) ========================== */
const MapPane = ({ places, selected, onSelect, apiKey }) => {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    let mounted = true;
    loadGoogleMaps(apiKey)?.then(() => {
        if (!mounted) return;
        setReady(true);
      })?.catch((err) => {
        if (!mounted) return;
        setError(err?.message || "No fue posible cargar Google Maps");
      });
    return () => {
      mounted = false;
    };
  }, [apiKey]);

  // crear mapa cuando esté listo
  useEffect(() => {
    if (!ready || !mapDivRef?.current || mapRef?.current) return;
    mapRef.current = new window.google.maps.Map(mapDivRef.current, {
      center: { lat: places[0]?.lat ?? 0, lng: places[0]?.lng ?? 0 },
      zoom: 13,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
    });
  }, [ready, places]);

  // Dibujar/actualizar marcadores
  useEffect(() => {
    if (!ready || !mapRef?.current) return;
    // limpiar
    markersRef?.current?.forEach((m) => m?.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();
    places?.forEach((p) => {
      // Use AdvancedMarkerElement if available, fallback to legacy Marker
      let marker;
      if (window.google?.maps?.marker?.AdvancedMarkerElement) {
        marker = new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: p.lat, lng: p.lng },
          map: mapRef.current,
          title: p.name,
        });
        marker?.addListener("click", () => onSelect?.(p));
      } else {
        marker = new window.google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map: mapRef.current,
          title: p.name,
        });
        marker?.addListener("click", () => onSelect?.(p));
      }
      markersRef?.current?.push(marker);
      bounds?.extend(marker?.position || marker?.getPosition());
    });
    if (!bounds?.isEmpty()) mapRef?.current?.fitBounds(bounds, 60);
  }, [ready, places, onSelect]);

  // centrar cuando cambia selección
  useEffect(() => {
    if (!ready || !mapRef?.current || !selected) return;
    mapRef?.current?.panTo({ lat: selected?.lat, lng: selected?.lng });
    mapRef?.current?.setZoom(Math.max(mapRef?.current?.getZoom(), 15));
  }, [ready, selected]);

  if (error) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="h-[260px] md:h-[60vh] w-full flex items-center justify-center bg-muted">
          <div className="text-center max-w-md mx-auto p-4">
            <Icon name="MapOff" size={32} className="text-muted-foreground mx-auto mb-3" />
            <div className="text-sm font-medium text-foreground mb-2">Map unavailable</div>
            <div className="text-xs text-muted-foreground">{error}</div>
            {error?.includes("API key") && (
              <div className="mt-3 text-xs text-muted-foreground">
                <div className="font-medium mb-1">To enable maps:</div>
                <div>1. Get a Google Maps API key</div>
                <div>2. Add it to your .env file as VITE_GOOGLE_MAPS_API_KEY</div>
                <div>3. Restart your development server</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="h-[260px] md:h-[60vh] w-full flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-border border-t-primary rounded-full mr-2" />
          <span className="text-sm text-muted-foreground">Cargando mapa…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg border border-border overflow-hidden">
      <div ref={mapDivRef} className="h-[260px] md:h-[60vh] w-full" />
      {selected && (
        <div className="absolute bottom-3 left-3 bg-card/95 backdrop-blur rounded-lg border border-border px-3 py-2 shadow max-w-[85%] md:max-w-[60%]">
          <div className="text-xs text-muted-foreground">Seleccionado</div>
          <div className="text-sm font-medium text-foreground truncate">{selected?.name}</div>
          <div className="text-xs text-muted-foreground">
            ${selected?.price?.toFixed(2)} • {selected?.distanceKm} km
          </div>
        </div>
      )}
    </div>
  );
};
/* ===================================================================== */

const PharmacyFinderModal = ({ isOpen, onClose, prescription, onPurchase, googleMapsApiKey }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // 'list' | 'map'

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setQuery("");
      setMobileView("list");
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query?.trim()?.toLowerCase();
    if (!q) return mockPlaces;
    return mockPlaces?.filter(
      (p) => p?.name?.toLowerCase()?.includes(q) || p?.address?.toLowerCase()?.includes(q)
    );
  }, [query]);

  const canBuy = !!selected && selected?.availability === "Disponible";

  const handleBuy = () => {
    if (!canBuy) return;
    const payload = {
      pharmacyId: selected?.id,
      pharmacyName: selected?.name,
      price: selected?.price,
      prescriptionId: prescription?.id ?? null,
      medication: prescription?.medicationName ?? "",
      quantity: prescription?.quantity ?? "",
      dosage: prescription?.dosage ?? "",
    };
    onPurchase?.(payload);
    if (!onPurchase) {
      const qs = new URLSearchParams({
        rx: prescription?.id ?? "",
        med: prescription?.medicationName ?? "",
        ph: selected.name,
        price: String(selected.price),
      })?.toString();
      window.location.href = `/marketplace-hub?buy=1&${qs}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:max-w-5xl md:mx-auto rounded-t-2xl md:rounded-2xl bg-card border border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 md:px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">Buscar Farmacia</div>
            <div className="text-foreground font-semibold truncate">
              {prescription?.medicationName ?? "Medicamento"}{prescription?.dosage ? ` • ${prescription?.dosage}` : ""}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <Icon name="X" size={18} />
          </Button>
        </div>

        {/* Mobile tabs */}
        <div className="px-4 pt-3 pb-2 md:hidden">
          <div className="w-full bg-muted/60 p-1 rounded-lg grid grid-cols-2 gap-1">
            <Button variant={mobileView === "list" ? "default" : "ghost"} className="w-full" onClick={() => setMobileView("list")}>
              <Icon name="List" size={16} className="mr-2" />Listado
            </Button>
            <Button variant={mobileView === "map" ? "default" : "ghost"} className="w-full" onClick={() => setMobileView("map")}>
              <Icon name="MapPinned" size={16} className="mr-2" />Mapa
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 md:px-6">
          <div className="relative mb-3">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e?.target?.value)}
              placeholder="Buscar por ubicación o nombre de farmacia…"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Content */}
        <div className="md:grid md:grid-cols-2 md:gap-4 px-4 md:px-6 pb-24 md:pb-6">
          {/* List */}
          <div className={`${mobileView === "map" ? "hidden md:block" : "block"}`}>
            <div className="space-y-3 max-h-[52vh] md:max-h-[60vh] overflow-auto pr-1 md:pr-0">
              {results?.map((p) => (
                <Row key={p?.id} place={p} selected={selected?.id === p?.id} onSelect={setSelected} />
              ))}
              {results?.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  No se encontraron farmacias para “{query}”.
                </div>
              )}
            </div>
          </div>

          {/* Map con cargador dinámico */}
          <div className={`mt-3 md:mt-0 ${mobileView === "list" ? "hidden md:block" : "block"}`}>
            <MapPane
              places={results}
              selected={selected}
              onSelect={setSelected}
              apiKey={googleMapsApiKey}
            />
          </div>
        </div>

        {/* Sticky footer */}
        <div className="fixed md:static inset-x-0 bottom-0 bg-card border-t border-border px-4 md:px-6 py-3">
          <div className="flex items-center justify-between gap-3 max-w-5xl md:max-w-none mx-auto">
            <div className="min-w-0">
              {selected ? (
                <div className="text-sm text-foreground truncate">
                  Seleccionaste: <span className="font-medium">{selected?.name}</span> —{" "}
                  <span className="font-semibold">${selected?.price?.toFixed(2)}</span>{" "}
                  {selected?.availability === "Disponible" ? (
                    <span className="ml-2"><Pill tone="success">Disponible</Pill></span>
                  ) : (
                    <span className="ml-2"><Pill tone="warning">Sin stock</Pill></span>
                  )}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Selecciona una farmacia para continuar</div>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button onClick={handleBuy} disabled={!canBuy} className="min-w-[110px]">
                <Icon name="ShoppingCart" size={16} className="mr-2" />Comprar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyFinderModal;