import React, { ReactNode } from "react";
import { Inter } from "next/font/google";

const metadata = {
  title: "Financial Calculators | Essential Tools for Smart Money Management",
  description:
    "Explore a suite of free, easy-to-use financial calculators for budgeting, loans, investments, retirement, and more. Make informed financial decisions with our comprehensive tools.",
  keywords: [
    "financial calculators",
    "budget calculator",
    "loan calculator",
    "investment calculator",
    "retirement calculator",
    "mortgage calculator",
    "personal finance tools",
    "money management",
    "financial planning",
    "interest calculator",
  ],
  openGraph: {
    title: "Financial Calculators | Essential Tools for Smart Money Management",
    description:
      "Explore a suite of free, easy-to-use financial calculators for budgeting, loans, investments, retirement, and more. Make informed financial decisions with our comprehensive tools.",
    url: "https://beecodeguy.com/financial-calculators",
    type: "website",
    images: [
      {
        url: "https://beecodeguy.com/og-financial-calculators.png",
        width: 1200,
        height: 630,
        alt: "Financial Calculators Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Financial Calculators | Essential Tools for Smart Money Management",
    description:
      "Explore a suite of free, easy-to-use financial calculators for budgeting, loans, investments, retirement, and more. Make informed financial decisions with our comprehensive tools.",
    images: ["https://beecodeguy.com/og-financial-calculators.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://beecodeguy.com/financial-calculators",
  },
};

const FinancialCalculatorsLayout = ({ children }: { children: ReactNode }) => {
  return <main id="financial-calculator">{children}</main>;
};

export default FinancialCalculatorsLayout;
