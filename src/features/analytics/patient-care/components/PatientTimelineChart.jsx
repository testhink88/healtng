// src/features/analytics/patient-care/components/PatientTimelineChart.jsx
import React, { useMemo, useState } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const PatientTimelineChart = ({ data = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState("satisfaction");
  const [timeRange, setTimeRange] = useState("90days");

  const metrics = useMemo(
    () => [
      { key: "satisfaction", label: "Patient Satisfaction", color: "var(--color-clinical-blue)", unit: "/5.0" },
      { key: "adherence", label: "Treatment Adherence", color: "var(--color-medical-green)", unit: "%" },
      { key: "outcomes", label: "Health Outcomes", color: "var(--color-accent)", unit: "%" },
      { key: "appointments", label: "Appointment Attendance", color: "var(--color-warning)", unit: "%" },
    ],
    []
  );

  const timeRanges = [
    { key: "30days", label: "Last 30 Days" },
    { key: "90days", label: "Last 90 Days" },
    { key: "6months", label: "Last 6 Months" },
    { key: "1year", label: "Last Year" },
  ];

  const selectedMetricData = metrics.find((m) => m.key === selectedMetric) ?? metrics[0];

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Patient Care Timeline</h3>
            <p className="text-sm text-muted-foreground">Track patient outcomes and engagement over time</p>
          </div>

          <div className="flex space-x-2">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1 rounded-md text-xs font-medium clinical-transition ${
                  timeRange === range.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {metrics.map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium clinical-transition ${
                selectedMetric === metric.key
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: metric.color }} />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedMetricData.color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={selectedMetricData.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                domain={selectedMetric === "satisfaction" ? [0, 5] : [0, 100]}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={selectedMetricData.color}
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PatientTimelineChart;
