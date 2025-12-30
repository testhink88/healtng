import React from "react";
import ClinicLayout from "@/pages/clinic-layout";
import ProviderBillingManagement from "@/features/provider/pages/ProviderBillingManagement";

const ClinicBilling = () => {
  return (
    <ClinicLayout>
      <ProviderBillingManagement />
    </ClinicLayout>
  );
};

export default ClinicBilling;
