// src/utils/intakeUtils.js
import { encounterStorage } from "@/pages/new-diagnosis-form/utils/encounterStorage";

export const getIntakeStatus = (patientId) => {
  const draft = encounterStorage.load(patientId);
  if (!draft) return { hasFiles: false, isReady: false };

  return {
    hasFiles: draft.data?.attachments?.length > 0,
    isReady: draft.status === 'ready_for_doctor'
  };
};