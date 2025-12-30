// src/features/analytics/patient-care/PatientCareAnalyticsLite.jsx
import React, { useEffect, useMemo, useState } from "react";

import PatientFiltersHeader from "./components/PatientFiltersHeader";
import PatientMetricsCard from "./components/PatientMetricsCard";
import PatientTimelineChart from "./components/PatientTimelineChart";
import PatientRiskMatrix from "./components/PatientRiskMatrix";
import CareAlertsPanel from "./components/CareAlertsPanel";
import PatientJourneyFunnel from "./components/PatientJourneyFunnel";

import {
  getPatientCareSummary,
  getPatientCareTimeline,
  getPatientCareRisks,
  getPatientCareAlerts,
  getPatientCareJourney,
} from "@/api/clinic/patientCareAnalytics";

const PatientCareAnalyticsLite = ({ embedded = false }) => {
  const [filters, setFilters] = useState({
    cohort: "all",
    diagnosis: "all",
    timePeriod: "90days",
    provider: "all",
    searchTerm: "",
  });

  const [summary, setSummary] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [risks, setRisks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [journey, setJourney] = useState([]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      const [s, t, r, a, j] = await Promise.all([
        getPatientCareSummary(),
        getPatientCareTimeline(),
        getPatientCareRisks(),
        getPatientCareAlerts(),
        getPatientCareJourney(),
      ]);

      if (!alive) return;
      setSummary(s);
      setTimeline(t);
      setRisks(r);
      setAlerts(a);
      setJourney(j);
    };

    load();
    return () => { alive = false; };
  }, []);

  const patientMetrics = useMemo(() => summary?.metrics ?? [], [summary]);

  return (
    <div className={embedded ? "" : "min-h-screen bg-background"}>
      <div className={embedded ? "" : "pt-2 pb-6"}>
        <div className={embedded ? "" : "max-w-7xl mx-auto px-6"}>
          <PatientFiltersHeader
            onFiltersChange={setFilters}
            totals={summary?.totals}
            embedded={embedded}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {patientMetrics.map((metric) => (
              <PatientMetricsCard
                key={metric.key}
                title={metric.title}
                value={metric.value}
                percentage={metric.percentage}
                trend={metric.trend}
                icon={metric.icon}
                color={metric.color}
                threshold={metric.threshold}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PatientTimelineChart data={timeline} />
            </div>
            <div className="space-y-6">
              <PatientRiskMatrix categories={risks} />
              <CareAlertsPanel alerts={alerts} />
            </div>
          </div>

          <div className="mb-8">
            <PatientJourneyFunnel data={journey} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientCareAnalyticsLite;
