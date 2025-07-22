import React from "react";
import { FinanceHeroSection } from "./_components/hero";
import { AvailableCalculators } from "./_components/available-calculators";

const FinancialCalculator = () => {
  return (
    <div className="min-h-screen w-full bg-white space-y-6">
      <FinanceHeroSection />
      <AvailableCalculators />
    </div>
  );
};

export default FinancialCalculator;
