import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Banknote,
  Building,
  Calculator,
  CreditCard,
  GraduationCap,
  Heart,
  Home,
  PiggyBank,
  Receipt,
  Shield,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const calculatorCategories = [
  {
    title: "Investment & Growth",
    icon: TrendingUp,
    color: "from-blue-500 to-blue-600",
    calculators: [
      {
        name: "SIP Calculator",
        description: "Plan your systematic investments",
        href: "/sip-calculator",
        icon: TrendingUp,
      },
      {
        name: "Lump Sum Investment",
        description: "Calculate one-time investment returns",
        href: "/lump-sum",
        icon: TrendingUp,
      },
      {
        name: "SIP vs Lump Sum",
        description: "Compare investment strategies",
        href: "/sip-vs-lump-sum",
        icon: Trophy,
      },
      {
        name: "FD Calculator",
        description: "Fixed deposit returns",
        href: "/fd-calculator",
        icon: PiggyBank,
      },
      {
        name: "Stock Return Calculator",
        description: "Track your stock performance",
        href: "/stock-returns",
        icon: TrendingUp,
      },
      {
        name: "Mutual Fund Calculator",
        description: "Analyze fund performance",
        href: "/mutual-fund",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Personal Finance & Goals",
    icon: PiggyBank,
    color: "from-teal-500 to-teal-600",
    calculators: [
      {
        name: "Budget Planner",
        description: "Balance income vs expenses",
        href: "/budget-planner",
        icon: Receipt,
      },
      {
        name: "Emergency Fund",
        description: "Plan for unexpected expenses",
        href: "/emergency-fund",
        icon: Shield,
      },
      {
        name: "Dream House Calculator",
        description: "Plan your home savings",
        href: "/dream-house",
        icon: Home,
      },
      {
        name: "Education Planning",
        description: "Secure your child's future",
        href: "/education-planning",
        icon: GraduationCap,
      },
      {
        name: "Wedding Cost Calculator",
        description: "Plan your special day",
        href: "/wedding-cost",
        icon: Heart,
      },
      {
        name: "Net Worth Calculator",
        description: "Track your financial health",
        href: "/net-worth",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Loans & Debt Management",
    icon: CreditCard,
    color: "from-orange-500 to-orange-600",
    calculators: [
      {
        name: "EMI Calculator",
        description: "Home, auto & personal loans",
        href: "/emi-calculator",
        icon: Calculator,
      },
      {
        name: "Loan Eligibility",
        description: "Check your loan capacity",
        href: "/loan-eligibility",
        icon: Building,
      },
      {
        name: "Home Loan Affordability",
        description: "What can you afford?",
        href: "/home-loan-affordability",
        icon: Home,
      },
      {
        name: "Credit Card Payoff",
        description: "Plan your debt freedom",
        href: "/credit-card-payoff",
        icon: CreditCard,
      },
      {
        name: "Debt-to-Income Ratio",
        description: "Assess your debt load",
        href: "/debt-to-income",
        icon: Calculator,
      },
    ],
  },
  {
    title: "Retirement & Tax Planning",
    icon: Users,
    color: "from-purple-500 to-purple-600",
    calculators: [
      {
        name: "Retirement Corpus",
        description: "Plan your golden years",
        href: "/retirement-corpus",
        icon: Users,
      },
      {
        name: "Pension Calculator",
        description: "Post-retirement income",
        href: "/pension-calculator",
        icon: Users,
      },
      {
        name: "Income Tax Calculator",
        description: "Calculate tax liability",
        href: "/income-tax",
        icon: Receipt,
      },
      {
        name: "Salary Breakup",
        description: "Gross to net breakdown",
        href: "/salary-breakup",
        icon: Banknote,
      },
      {
        name: "Capital Gains Tax",
        description: "Tax on investments",
        href: "/capital-gains-tax",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Special Calculators",
    icon: Calculator,
    color: "from-green-500 to-green-600",
    calculators: [
      {
        name: "IPO Allotment Probability",
        description: "Nepal IPO allocation chances",
        href: "/ipo-allotment",
        icon: TrendingUp,
      },
      {
        name: "TDS Calculator",
        description: "Tax deducted at source",
        href: "/tds-calculator",
        icon: Receipt,
      },
      {
        name: "NPS Calculator",
        description: "National pension scheme",
        href: "/nps-calculator",
        icon: Shield,
      },
    ],
  },
];

export const AvailableCalculators = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our comprehensive collection of financial planning tools
          </p>
        </div>

        <div className="space-y-12">
          {calculatorCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <div key={categoryIndex} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {category.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.calculators.map((calc, index) => {
                    const CalcIcon = calc.icon;
                    return (
                      <Link
                        key={index}
                        href={`/financial-calculators${calc.href}`}
                      >
                        <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 bg-white/80 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className={`h-8 w-8 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                              >
                                <CalcIcon className="h-4 w-4 text-white" />
                              </div>
                              <CardTitle className="text-lg text-blue-500 group-hover:text-blue-600 transition-colors">
                                {calc.name}
                              </CardTitle>
                            </div>
                            <CardDescription className="text-sm leading-relaxed">
                              {calc.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-orange-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                            >
                              Calculate Now →
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
