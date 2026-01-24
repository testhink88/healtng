const KEY_PREFIX = "healtng_draft_";

export const encounterStorage = {
  save: (encounter) => {
    if (!encounter || !encounter.encounterId) return;
    const payload = { ...encounter, updatedAt: new Date().toISOString() };
    localStorage.setItem(`${KEY_PREFIX}${encounter.patientId}`, JSON.stringify(payload));
  },

  load: (patientId) => {
    const raw = localStorage.getItem(`${KEY_PREFIX}${patientId}`);
    return raw ? JSON.parse(raw) : null;
  },

  clear: (patientId) => {
    localStorage.removeItem(`${KEY_PREFIX}${patientId}`);
  }
};