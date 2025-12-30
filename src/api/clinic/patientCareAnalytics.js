// src/api/clinic/patientCareAnalytics.js

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const getPatientCareSummary = async () => {
  await delay();
  return {
    metrics: [
      {
        key: "satisfaction",
        title: "Patient Satisfaction Score",
        value: "4.7/5.0",
        percentage: "+0.3",
        trend: "up",
        icon: "Heart",
        color: "clinical-blue",
        threshold: { good: 4.5, warning: 4.0 },
      },
      {
        key: "adherence",
        title: "Treatment Adherence Rate",
        value: "89.2%",
        percentage: "+2.1%",
        trend: "up",
        icon: "CheckCircle",
        color: "medical-green",
        threshold: { good: 85, warning: 75 },
      },
      {
        key: "outcomes",
        title: "Health Outcome Improvement",
        value: "76.8%",
        percentage: "+1.4%",
        trend: "up",
        icon: "TrendingUp",
        color: "accent",
        threshold: { good: 70, warning: 60 },
      },
      {
        key: "noshow",
        title: "Appointment No-Show Rate",
        value: "8.3%",
        percentage: "-1.2%",
        trend: "down",
        icon: "Calendar",
        color: "warning",
        threshold: { good: 10, warning: 15 },
      },
    ],
    totals: {
      patientsShown: 1247,
      lastUpdated: new Date().toISOString(),
    },
  };
};

export const getPatientCareTimeline = async () => {
  await delay();
  return [
    { date: "2024-05-01", satisfaction: 4.2, adherence: 85, outcomes: 78, appointments: 92 },
    { date: "2024-05-15", satisfaction: 4.3, adherence: 87, outcomes: 80, appointments: 89 },
    { date: "2024-06-01", satisfaction: 4.1, adherence: 83, outcomes: 75, appointments: 94 },
    { date: "2024-06-15", satisfaction: 4.4, adherence: 89, outcomes: 82, appointments: 91 },
    { date: "2024-07-01", satisfaction: 4.5, adherence: 91, outcomes: 85, appointments: 88 },
    { date: "2024-07-15", satisfaction: 4.6, adherence: 93, outcomes: 87, appointments: 93 },
    { date: "2024-07-27", satisfaction: 4.7, adherence: 95, outcomes: 89, appointments: 95 },
  ];
};

export const getPatientCareRisks = async () => {
  await delay();
  return [
    {
      level: "high",
      label: "High Risk",
      count: 23,
      color: "var(--color-error)",
      bgColor: "bg-error/10",
      patients: [
        { id: 1, name: "Sarah Johnson", condition: "Diabetes Type 2", score: 85, lastVisit: "2024-07-25" },
        { id: 2, name: "Michael Chen", condition: "Hypertension", score: 92, lastVisit: "2024-07-24" },
        { id: 3, name: "Emma Rodriguez", condition: "COPD", score: 88, lastVisit: "2024-07-26" },
      ],
    },
    {
      level: "medium",
      label: "Medium Risk",
      count: 67,
      color: "var(--color-warning)",
      bgColor: "bg-warning/10",
      patients: [
        { id: 4, name: "David Wilson", condition: "Pre-diabetes", score: 65, lastVisit: "2024-07-23" },
        { id: 5, name: "Lisa Thompson", condition: "Anxiety", score: 58, lastVisit: "2024-07-22" },
        { id: 6, name: "James Miller", condition: "Arthritis", score: 72, lastVisit: "2024-07-25" },
      ],
    },
    {
      level: "low",
      label: "Low Risk",
      count: 145,
      color: "var(--color-success)",
      bgColor: "bg-success/10",
      patients: [
        { id: 7, name: "Anna Davis", condition: "Routine Care", score: 25, lastVisit: "2024-07-20" },
        { id: 8, name: "Robert Brown", condition: "Preventive Care", score: 18, lastVisit: "2024-07-19" },
        { id: 9, name: "Maria Garcia", condition: "Annual Checkup", score: 32, lastVisit: "2024-07-21" },
      ],
    },
  ];
};

export const getPatientCareAlerts = async () => {
  await delay();
  return [
    {
      id: 1,
      type: "medication",
      priority: "high",
      title: "Medication Adherence Alert",
      patient: "Sarah Johnson",
      message: "Patient has missed 3 consecutive insulin doses. Immediate intervention required.",
      timestamp: "2024-07-27T14:30:00",
      action: "Contact Patient",
      status: "pending",
    },
    {
      id: 2,
      type: "appointment",
      priority: "medium",
      title: "Follow-up Overdue",
      patient: "Michael Chen",
      message: "Post-surgery follow-up appointment is 5 days overdue.",
      timestamp: "2024-07-27T10:15:00",
      action: "Schedule Appointment",
      status: "pending",
    },
    {
      id: 3,
      type: "vitals",
      priority: "high",
      title: "Critical Vital Signs",
      patient: "Emma Rodriguez",
      message: "Blood pressure readings consistently above 180/110 for 48 hours.",
      timestamp: "2024-07-27T08:45:00",
      action: "Emergency Protocol",
      status: "in-progress",
    },
    {
      id: 4,
      type: "lab",
      priority: "medium",
      title: "Lab Results Review",
      patient: "David Wilson",
      message: "HbA1c levels indicate poor glucose control. Adjustment needed.",
      timestamp: "2024-07-26T16:20:00",
      action: "Review with Provider",
      status: "pending",
    },
    {
      id: 5,
      type: "preventive",
      priority: "low",
      title: "Preventive Care Due",
      patient: "Lisa Thompson",
      message: "Annual mammography screening is due within 30 days.",
      timestamp: "2024-07-26T09:30:00",
      action: "Send Reminder",
      status: "completed",
    },
  ];
};

export const getPatientCareJourney = async () => {
  await delay();
  return [
    { stage: "Initial Consultation", patients: 1250, percentage: 100, conversionRate: 85.2, avgDuration: "45 min", color: "var(--color-clinical-blue)" },
    { stage: "Diagnosis & Assessment", patients: 1065, percentage: 85.2, conversionRate: 92.1, avgDuration: "2.3 days", color: "var(--color-medical-green)" },
    { stage: "Treatment Planning", patients: 981, percentage: 78.5, conversionRate: 88.7, avgDuration: "1.8 days", color: "var(--color-accent)" },
    { stage: "Treatment Initiation", patients: 870, percentage: 69.6, conversionRate: 94.3, avgDuration: "3.2 days", color: "var(--color-warning)" },
    { stage: "Active Treatment", patients: 821, percentage: 65.7, conversionRate: 89.2, avgDuration: "28.5 days", color: "var(--color-primary)" },
    { stage: "Treatment Completion", patients: 732, percentage: 58.6, conversionRate: 96.4, avgDuration: "2.1 days", color: "var(--color-success)" },
  ];
};
