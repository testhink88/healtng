export const reportEngine = {
  /**
   * Genera el texto del informe basado en la data de la consulta y una plantilla
   */
  generate: (encounter, patient) => {
    const { data, specialtyCode } = encounter;
    
    // 1. Fragmentos de texto condicionales (Puntos 2 y 3: Antecedentes)
    const surgicalText = data.surgicalHistory?.hasHistory 
      ? `Presenta antecedentes quirúrgicos de: ${data.surgicalHistory.detail}.`
      : "No refiere antecedentes quirúrgicos de importancia.";

    // 2. Procesamiento de TNM (Punto 9)
    const tnmText = (data.tnm_staging?.t || data.tnm_staging?.n || data.tnm_staging?.m)
      ? `Estadificación TNM: T${data.tnm_staging.t || 'X'} N${data.tnm_staging.n || 'X'} M${data.tnm_staging.m || 'X'}.`
      : "";

    // 3. Procesamiento de Recetas para el informe
    const prescriptionText = data.prescriptions?.length > 0
      ? "Se indica el siguiente tratamiento:\n" + data.prescriptions.map(p => `- ${p.med}: ${p.dose} cada ${p.freq}`).join("\n")
      : "No se indican medicamentos en esta consulta.";

    // 4. Plantilla Maestra (Editable por sección)
    // Usamos literales de plantilla para construir la prosa
    const reportText = `
PACIENTE: ${patient?.fullName || 'N/P'}
DOCUMENTO: ${patient?.dni || 'N/P'}
FECHA: ${new Date().toLocaleDateString('es-VE')}
ESPECIALIDAD: ${specialtyCode}

MOTIVO DE CONSULTA / HALLAZGOS:
${data.reason || 'Evaluación de control.'}

ANTECEDENTES CLÍNICOS:
${surgicalText}
${data.medical_history_notes || 'Sin otros antecedentes relevantes.'}

EXAMEN FÍSICO / EVALUACIÓN:
${data.physical_exam || 'Paciente en condiciones estables.'}
${tnmText}

IMPRESIÓN DIAGNÓSTICA:
${data.main_diagnosis_cie10?.name || 'Pendiente por diagnóstico definitivo.'} (${data.main_diagnosis_cie10?.code || 'S/C'})

PLAN Y TRATAMIENTO:
${prescriptionText}
${data.followUpDate ? `\nSe programa cita de control para el día ${new Date(data.followUpDate).toLocaleDateString()}.` : ""}
    `.trim();

    return reportText;
  }
};