import React from "react";

const SimplePage = ({ title, subtitle }) => (
  <div className="min-h-screen bg-gray-50 pt-24 px-6 flex justify-center">
    <div className="max-w-2xl w-full bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
      <h1 className="text-3xl font-light text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-500 mb-8">{subtitle}</p>
      <button className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition">
        Volver al inicio
      </button>
    </div>
  </div>
);

export default SimplePage;
