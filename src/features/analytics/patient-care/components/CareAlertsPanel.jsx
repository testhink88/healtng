// src/features/analytics/patient-care/components/CareAlertsPanel.jsx
import React, { useMemo, useState } from "react";
import Icon from "@/components/AppIcon";

const CareAlertsPanel = ({ alerts = [] }) => {
  const [selectedPriority, setSelectedPriority] = useState("all");

  const priorities = useMemo(
    () => [
      { key: "all", label: "All Alerts", count: alerts.length },
      { key: "high", label: "High Priority", count: alerts.filter(a => a.priority === "high").length },
      { key: "medium", label: "Medium Priority", count: alerts.filter(a => a.priority === "medium").length },
      { key: "low", label: "Low Priority", count: alerts.filter(a => a.priority === "low").length },
    ],
    [alerts]
  );

  const getAlertIcon = (type) => {
    switch (type) {
      case "medication": return "Pill";
      case "appointment": return "Calendar";
      case "vitals": return "Activity";
      case "lab": return "TestTube";
      case "preventive": return "Shield";
      default: return "Bell";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "var(--color-warning)";
      case "in-progress": return "var(--color-clinical-blue)";
      case "completed": return "var(--color-success)";
      default: return "var(--color-muted-foreground)";
    }
  };

  const filteredAlerts =
    selectedPriority === "all"
      ? alerts
      : alerts.filter((alert) => alert.priority === selectedPriority);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Care Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Upcoming care requirements and critical notifications
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error rounded-full pulse-indicator" />
            <span className="text-xs text-muted-foreground">Live Updates</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {priorities.map((priority) => (
            <button
              key={priority.key}
              onClick={() => setSelectedPriority(priority.key)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-medium clinical-transition ${
                selectedPriority === priority.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <span>{priority.label}</span>
              <span className="bg-background/20 px-1 rounded">{priority.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 clinical-transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-background">
                    <Icon name={getAlertIcon(alert.type)} size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground">Patient: {alert.patient}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.priority === "high"
                        ? "bg-error/10 text-error"
                        : alert.priority === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                    }`}
                  >
                    {alert.priority.charAt(0).toUpperCase() + alert.priority.slice(1)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-foreground mb-3">{alert.message}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getStatusColor(alert.status) }}
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {alert.status.replace("-", " ")}
                  </span>
                </div>
                <button className="flex items-center space-x-1 px-3 py-1 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:bg-primary/90 clinical-transition">
                  <span>{alert.action}</span>
                  <Icon name="ArrowRight" size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} color="var(--color-success)" className="mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No alerts for selected priority level</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareAlertsPanel;
