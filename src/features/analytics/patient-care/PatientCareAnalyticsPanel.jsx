// PatientCareAnalyticsPanel.jsx (idea base)
import React, { useEffect, useMemo, useState } from "react";
import PatientFiltersHeader from "./components/PatientFiltersHeader";
import CareAlertsPanel from "./components/CareAlertsPanel";
import PatientRiskMatrix from "./components/PatientRiskMatrix";
import PatientTimelineChart from "./components/PatientTimelineChart";
import PatientJourneyFunnel from "./components/PatientJourneyFunnel";
import PatientMetricsCard from "./components/PatientMetricsCard";

// Si ya tienes esto en src/api/clinic/patientCareAnalytics.js,
// lo re-exportas desde "@/api/analytics"
import { getPatientCareSnapshot } from "@/api/analytics";

const PatientCareAnalyticsPanel = ({
  variant = "management", // "management" | "operations" | "full" | "lite"
}) => {
  const [filters, setFilters] = useState(null);
  const [data, setData] = useState({
    kpis: [],
    alerts: [],
    riskCategories: [],
    timeline: [],
    funnel: []
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const snapshot = await getPatientCareSnapshot?.({ variant, filters });
        if (!cancelled && snapshot) setData(snapshot);
      } catch (e) {
        console.error("PatientCare snapshot error:", e);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [variant, filters]);

  const showFilters = variant !== "operations"; 
  // En ops puede ser más “live board” y menos filtro pesado.

  const kpis = useMemo(() => data.kpis || [], [data.kpis]);

  return (
    <div className="space-y-6">
      {showFilters && (
        <PatientFiltersHeader onFiltersChange={setFilters} />
      )}

      {/* KPI Row */}
      {!!kpis.length && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <PatientMetricsCard key={i} {...k} />
          ))}
        </section>
      )}

      {/* Main grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CareAlertsPanel alerts={data.alerts} />
          <PatientRiskMatrix categories={data.riskCategories} />
        </div>

        <div className="space-y-6">
          <PatientTimelineChart data={data.timeline} />
          <PatientJourneyFunnel data={data.funnel} />
        </div>
      </section>
    </div>
  );
};

export default PatientCareAnalyticsPanel;
