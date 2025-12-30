// Simula latencia y retorna estructuras que tu UI ya espera
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchKpis(filters) {
  await delay(300);
  return [
    { label: "Atenciones", value: 856, deltaPct: +6.2, trend: "up" },
    { label: "Pacientes únicos", value: 499, deltaPct: +3.1, trend: "up" },
    { label: "Asistencia", value: "80.9%", deltaPct: +1.2, trend: "up" },
    { label: "Cancelación", value: "16.5%", deltaPct: -0.7, trend: "down" },
    { label: "Espera (min)", value: 17, deltaPct: -8.0, trend: "down" },
    { label: "Duración (min)", value: 22, deltaPct: +0.3, trend: "flat" },
  ];
}

export async function fetchPerformance(filters) {
  await delay(300);
  const seqDays = (fromIso, toIso) => {
    const out = [];
    const from = new Date(fromIso);
    const to = new Date(toIso);
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      const x = new Date(d); x.setHours(0,0,0,0);
      out.push(x.toISOString());
    }
    return out;
  };
  const days = seqDays(filters.from, filters.to);
  return [
    { label: "Atenciones", data: days.map((d, i) => ({ x: d, y: 30 + ((i * 7) % 18) })) },
    { label: "Espera (min)", data: days.map((d, i) => ({ x: d, y: 10 + ((i * 5) % 9) })) },
    { label: "Duración consulta (min)", data: days.map((d, i) => ({ x: d, y: 18 + ((i * 3) % 7) })) },
  ];
}

export async function fetchSatisfaction(filters) {
  await delay(250);
  const seq = (n, fromIso) =>
    Array.from({ length: n }, (_, i) => {
      const d = new Date(fromIso); d.setDate(d.getDate() + i);
      d.setHours(0,0,0,0);
      return d.toISOString();
    });

  const from = new Date(filters.from); from.setHours(0,0,0,0);
  const n = 30;
  const dates = seq(n, from.toISOString());

  return {
    nps: dates.map((d, i) => ({ x: d, y: 30 + ((i * 11) % 40) })),
    csat: dates.map((d, i) => ({ x: d, y: 3.8 + ((i % 4) * 0.1) })),
    reasons: [
      { reason: "Tiempo de espera", count: 18 },
      { reason: "Atención del médico", count: 44 },
      { reason: "Costos", count: 11 },
      { reason: "Instalaciones", count: 7 },
    ],
  };
}
