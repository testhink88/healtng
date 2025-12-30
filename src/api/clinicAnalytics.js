// Mock ligero para analítica clínica
// - getClinicOperationsSnapshot
// - getClinicHeatmapSnapshot

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Pequeño RNG determinístico para que el mock sea estable por clinicId
function seedFromString(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function seededRand(seed) {
  let x = seed || 123456;
  return () => {
    // LCG simple
    x = (Math.imul(48271, x) + 0x7fffffff) % 0x7fffffff;
    return x / 0x7fffffff;
  };
}

export function getClinicOperationsSnapshot(clinicId = "demo-clinic") {
  const seed = seedFromString(String(clinicId));
  const rnd = seededRand(seed);

  const scheduled = Math.floor(40 + rnd() * 60);
  const checkedIn = Math.floor(scheduled * (0.6 + rnd() * 0.25));
  const completed = Math.floor(checkedIn * (0.7 + rnd() * 0.2));
  const canceled = Math.max(0, scheduled - checkedIn - Math.floor(rnd() * 3));

  const waitTimeAvgMin = Math.floor(8 + rnd() * 22);
  const occupancyPct = Math.floor(45 + rnd() * 45);

  const revenueUSD = Math.floor(400 + rnd() * 1600);

  // Carga por hora simple para gráficos mini
  const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8am-7pm
  const hourlyLoad = hours.map((hr) => ({
    hour: hr,
    value: Math.max(
      0,
      Math.round(5 + rnd() * 18 + (hr >= 11 && hr <= 15 ? rnd() * 10 : 0))
    ),
  }));

  return {
    clinicId,
    dateISO: new Date().toISOString(),
    appointments: { scheduled, checkedIn, completed, canceled },
    waitTimeAvgMin,
    occupancyPct,
    revenueUSD,
    hourlyLoad,
    highlights: [
      occupancyPct > 80 ? "Alta ocupación" : "Flujo estable",
      waitTimeAvgMin > 20 ? "Posible cuello de botella" : "Tiempos controlados",
    ],
  };
}

export function getClinicHeatmapSnapshot(clinicId = "demo-clinic") {
  const seed = seedFromString(String(clinicId) + "-heatmap");
  const rnd = seededRand(seed);

  const hours = Array.from({ length: 12 }, (_, i) => 8 + i); // 8-19
  const intensity = DAYS.map((_, dIdx) =>
    hours.map((h) => {
      // patrón: medio alto en mitad de semana y horas pico
      const dayBias = dIdx >= 1 && dIdx <= 4 ? 0.15 : 0.0; // mar-vie
      const hourBias = h >= 11 && h <= 15 ? 0.25 : h >= 9 && h <= 10 ? 0.1 : 0;
      const noise = rnd() * 0.35;
      const val = Math.min(1, Math.max(0, 0.15 + dayBias + hourBias + noise));
      return Number(val.toFixed(2));
    })
  );

  return {
    clinicId,
    days: DAYS,
    hours,
    intensity, // matrix [7][12] values 0..1
    legend: { low: 0, high: 1 },
  };
}
