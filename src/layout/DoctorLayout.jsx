// src/layout/DoctorLayout.jsx
import React from "react";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import PracticeBar from "@/components/practice/PracticeBar";

export default function DoctorLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header userRole="doctor" />
      <Sidebar userRole="doctor" />
      <main className="lg:ml-64 pt-20">
        <PracticeBar />
        <div className="px-6 py-6 max-w-7xl mx-auto">
          {title ? <h1 className="text-xl font-medium text-gray-900 mb-4">{title}</h1> : null}
          {children}
        </div>
      </main>
    </div>
  );
}
