// src/utils/business.js
export const getBusinessContext = () => {
  try {
    const raw = localStorage.getItem("supplierProfile");
    return raw ? JSON.parse(raw) : {
      businessType: "mixto",
      mode: "b2c",
      sellToPublic: true,
      sellToBusinesses: false,
      buyFromVendors: false,
    };
  } catch {
    return { businessType: "mixto", mode: "b2c", sellToPublic: true };
  }
};

export const setBusinessContext = (partial) => {
  const current = getBusinessContext();
  const next = { ...current, ...partial };
  localStorage.setItem("supplierProfile", JSON.stringify(next));
  return next;
};

export const flagsFromProfile = (p) => {
  const isB2C = p.mode === "b2c" || p.mode === "hybrid" || !!p.sellToPublic;
  const canB2BSell = p.mode === "b2b" || p.mode === "hybrid" || !!p.sellToBusinesses;
  const canB2BBuy  = p.mode === "b2b" || p.mode === "hybrid" || !!p.buyFromVendors;
  return { isB2C, canB2BSell, canB2BBuy };
};
