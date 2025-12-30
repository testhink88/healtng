// src/features/analytics/patient-care/components/PatientRiskMatrix.jsx
import React, { useMemo, useState } from "react";
import Icon from "@/components/AppIcon";

const PatientRiskMatrix = ({ categories = [] }) => {
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");

  const riskCategories = useMemo(() => categories ?? [], [categories]);

  const getRiskIcon = (level) => {
    switch (level) {
      case "high": return "AlertTriangle";
      case "medium": return "AlertCircle";
      case "low": return "CheckCircle";
      default: return "Circle";
    }
  };

  const filteredCategories =
    selectedRiskLevel === "all"
      ? riskCategories
      : riskCategories.filter((cat) => cat.level === selectedRiskLevel);

  const totalPatients = riskCategories.reduce((acc, c) => acc + (c.count || 0), 0) || 1;

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Patient Risk Stratification</h3>
            <p className="text-sm text-muted-foreground">
              Monitor high-risk patients requiring immediate attention
            </p>
          </div>
          <Icon name="Users" size={20} color="var(--color-muted-foreground)" />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedRiskLevel("all")}
            className={`px-3 py-1 rounded-md text-xs font-medium clinical-transition ${
              selectedRiskLevel === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Levels
          </button>
          {riskCategories.map((category) => (
            <button
              key={category.level}
              onClick={() => setSelectedRiskLevel(category.level)}
              className={`px-3 py-1 rounded-md text-xs font-medium clinical-transition ${
                selectedRiskLevel === category.level
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {riskCategories.map((category) => (
            <div key={category.level} className={`p-4 rounded-lg ${category.bgColor ?? "bg-muted/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Icon name={getRiskIcon(category.level)} size={16} color={category.color} />
                  <span className="text-sm font-medium text-foreground">{category.label}</span>
                </div>
                <span className="text-lg font-bold text-foreground">{category.count}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {(((category.count || 0) / totalPatients) * 100).toFixed(1)}% of total patients
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Recent Patients</h4>
          {filteredCategories.map((category) => (
            <div key={category.level} className="space-y-2">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name={getRiskIcon(category.level)} size={16} color={category.color} />
                <span className="text-sm font-medium text-foreground">{category.label} Patients</span>
              </div>

              {(category.patients || []).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted clinical-transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="User" size={14} color="var(--color-primary)" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground">{patient.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium" style={{ color: category.color }}>
                      Risk: {patient.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientRiskMatrix;
