import React from "react";
import ClinicLayout from "@/pages/clinic-layout";
import ProviderAuthorizations from "@/features/provider/pages/ProviderAuthorizations";

const ClinicAuthorizations = () => {
  return (
    <ClinicLayout>
      <ProviderAuthorizations />
    </ClinicLayout>
  );
};

export default ClinicAuthorizations;
