import { Button } from "@/components/ui/moving-borders";
import React from "react";

export const FinanceHeroSection = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Financial
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              Calculators
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Make informed financial decisions with our comprehensive suite of
            calculators. Plan investments, track goals, and optimize your
            financial future with beautiful charts and detailed breakdowns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 p-4 rounded"
            >
              Start Calculating
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
