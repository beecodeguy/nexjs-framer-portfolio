"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  PieChart,
  BarChart3,
  Share2,
  Download,
  ArrowLeft,
  Info,
  RotateCcw,
  Home,
  Car,
  GraduationCap,
  User,
  Building,
  CreditCard,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LoanResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  processingFee: number;
  totalCost: number;
  monthlyRate: number;
  totalMonths: number;
}

interface AmortizationRow {
  month: number;
  principalPaid: number;
  interestPaid: number;
  emi: number;
  balanceRemaining: number;
  cumulativePrincipal: number;
  cumulativeInterest: number;
}

interface LoanType {
  id: string;
  name: string;
  icon: any;
  defaultRate: string;
  minTenure: number;
  maxTenure: number;
  description: string;
  color: string;
}

const LOAN_TYPES: LoanType[] = [
  {
    id: "home",
    name: "Home Loan",
    icon: Home,
    defaultRate: "9.5",
    minTenure: 5,
    maxTenure: 30,
    description: "Long-term housing finance with tax benefits",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "personal",
    name: "Personal Loan",
    icon: User,
    defaultRate: "14.5",
    minTenure: 1,
    maxTenure: 7,
    description: "Unsecured loan for personal needs",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "auto",
    name: "Auto/Vehicle Loan",
    icon: Car,
    defaultRate: "11.5",
    minTenure: 1,
    maxTenure: 7,
    description: "Finance your dream vehicle",
    color: "from-green-500 to-green-600",
  },
  {
    id: "education",
    name: "Education Loan",
    icon: GraduationCap,
    defaultRate: "10.5",
    minTenure: 5,
    maxTenure: 15,
    description: "Invest in your future education",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "business",
    name: "Business Loan",
    icon: Building,
    defaultRate: "13.5",
    minTenure: 1,
    maxTenure: 10,
    description: "Grow your business with capital",
    color: "from-teal-500 to-teal-600",
  },
];

const DEFAULT_VALUES = {
  loanAmount: "1000000",
  interestRate: "12",
  tenureYears: "10",
  processingFeePercent: "1",
  loanType: "home",
};

const COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<string>(
    DEFAULT_VALUES.loanAmount
  );
  const [interestRate, setInterestRate] = useState<string>(
    DEFAULT_VALUES.interestRate
  );
  const [tenureYears, setTenureYears] = useState<string>(
    DEFAULT_VALUES.tenureYears
  );
  const [processingFeePercent, setProcessingFeePercent] = useState<string>(
    DEFAULT_VALUES.processingFeePercent
  );
  const [loanType, setLoanType] = useState<string>(DEFAULT_VALUES.loanType);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedLoanType =
    LOAN_TYPES.find((type) => type.id === loanType) || LOAN_TYPES[0];

  const resetToDefaults = () => {
    setLoanAmount(DEFAULT_VALUES.loanAmount);
    setInterestRate(selectedLoanType.defaultRate);
    setTenureYears(DEFAULT_VALUES.tenureYears);
    setProcessingFeePercent(DEFAULT_VALUES.processingFeePercent);
  };

  const handleLoanTypeChange = (newType: string) => {
    setLoanType(newType);
    const newLoanType = LOAN_TYPES.find((type) => type.id === newType);
    if (newLoanType) {
      setInterestRate(newLoanType.defaultRate);
      // Adjust tenure if current value is outside the new loan type's range
      const currentTenure = parseInt(tenureYears);
      if (currentTenure < newLoanType.minTenure) {
        setTenureYears(newLoanType.minTenure.toString());
      } else if (currentTenure > newLoanType.maxTenure) {
        setTenureYears(newLoanType.maxTenure.toString());
      }
    }
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const tenure = parseInt(tenureYears);
    const processingFee = parseFloat(processingFeePercent);

    if (!amount || amount <= 0) {
      newErrors.loanAmount = "Loan amount must be greater than 0";
    } else if (amount > 100000000) {
      newErrors.loanAmount = "Loan amount seems too high";
    }

    if (!rate || rate <= 0 || rate > 50) {
      newErrors.interestRate = "Interest rate must be between 0% and 50%";
    }

    if (
      !tenure ||
      tenure < selectedLoanType.minTenure ||
      tenure > selectedLoanType.maxTenure
    ) {
      newErrors.tenureYears = `Tenure must be between ${selectedLoanType.minTenure} and ${selectedLoanType.maxTenure} years for ${selectedLoanType.name}`;
    }

    if (processingFee < 0 || processingFee > 10) {
      newErrors.processingFeePercent =
        "Processing fee must be between 0% and 10%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoan = useMemo((): {
    result: LoanResult | null;
    amortization: AmortizationRow[];
  } => {
    if (!validateInputs()) return { result: null, amortization: [] };

    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const years = parseInt(tenureYears);
    const processingFeeRate = parseFloat(processingFeePercent);

    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = years * 12;
    const processingFee = (P * processingFeeRate) / 100;

    // EMI Calculation
    const emi =
      (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - P;
    const totalCost = totalPayment + processingFee;

    const result: LoanResult = {
      emi,
      totalPayment,
      totalInterest,
      processingFee,
      totalCost,
      monthlyRate,
      totalMonths,
    };

    // Generate amortization schedule
    const amortization: AmortizationRow[] = [];
    let balance = P;
    let cumulativePrincipal = 0;
    let cumulativeInterest = 0;

    for (let month = 1; month <= totalMonths; month++) {
      const interestPaid = balance * monthlyRate;
      const principalPaid = emi - interestPaid;
      balance -= principalPaid;
      cumulativePrincipal += principalPaid;
      cumulativeInterest += interestPaid;

      amortization.push({
        month,
        principalPaid,
        interestPaid,
        emi,
        balanceRemaining: Math.max(0, balance),
        cumulativePrincipal,
        cumulativeInterest,
      });
    }

    return { result, amortization };
  }, [loanAmount, interestRate, tenureYears, processingFeePercent, loanType]);

  const { result, amortization } = calculateLoan;

  // Prepare chart data
  const pieChartData = result
    ? [
        {
          name: "Principal Amount",
          value: parseFloat(loanAmount),
          color: "#3b82f6",
        },
        {
          name: "Total Interest",
          value: result.totalInterest,
          color: "#ef4444",
        },
        {
          name: "Processing Fee",
          value: result.processingFee,
          color: "#f59e0b",
        },
      ]
    : [];

  const balanceChartData = amortization
    .slice(0, Math.min(amortization.length, 120))
    .filter(
      (_, index) =>
        index % Math.max(1, Math.floor(amortization.length / 50)) === 0
    )
    .map((row) => ({
      month: row.month,
      "Outstanding Balance": Math.round(row.balanceRemaining),
      "Principal Paid": Math.round(row.cumulativePrincipal),
      "Interest Paid": Math.round(row.cumulativeInterest),
    }));

  const downloadResults = () => {
    if (!result) return;

    const reportData = `
LOAN EMI ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}

═══════════════════════════════════════
LOAN DETAILS
═══════════════════════════════════════
Loan Type: ${selectedLoanType.name}
Loan Amount: NPR ${parseFloat(loanAmount).toLocaleString()}
Interest Rate: ${interestRate}% per annum
Loan Tenure: ${tenureYears} years (${result.totalMonths} months)
Processing Fee: ${processingFeePercent}%

═══════════════════════════════════════
EMI CALCULATION SUMMARY
═══════════════════════════════════════
Monthly EMI: NPR ${result.emi.toLocaleString()}
Total Payment: NPR ${result.totalPayment.toLocaleString()}
Total Interest: NPR ${result.totalInterest.toLocaleString()}
Processing Fee: NPR ${result.processingFee.toLocaleString()}
Total Cost of Loan: NPR ${result.totalCost.toLocaleString()}

Interest as % of Principal: ${(
      (result.totalInterest / parseFloat(loanAmount)) *
      100
    ).toFixed(1)}%

═══════════════════════════════════════
AMORTIZATION SCHEDULE (First 12 Months)
═══════════════════════════════════════
Month | Principal | Interest | EMI | Balance
${amortization
  .slice(0, 12)
  .map(
    (row) =>
      `${row.month.toString().padEnd(5)} | ${row.principalPaid
        .toLocaleString()
        .padEnd(9)} | ${row.interestPaid.toLocaleString().padEnd(8)} | ${row.emi
        .toLocaleString()
        .padEnd(7)} | ${row.balanceRemaining.toLocaleString()}`
  )
  .join("\n")}

═══════════════════════════════════════
KEY INSIGHTS
═══════════════════════════════════════
• Your ${selectedLoanType.name.toLowerCase()} EMI of NPR ${result.emi.toLocaleString()} for ${tenureYears} years
• Total interest: NPR ${(result.totalInterest / 100000).toFixed(1)}L (${(
      (result.totalInterest / parseFloat(loanAmount)) *
      100
    ).toFixed(1)}% of principal)
• Monthly commitment: ${((result.emi / parseFloat(loanAmount)) * 100).toFixed(
      2
    )}% of loan amount
• Break-even point: Month ${
      amortization.findIndex(
        (row) => row.cumulativePrincipal > row.cumulativeInterest
      ) + 1
    }

═══════════════════════════════════════
AFFORDABILITY GUIDELINES
═══════════════════════════════════════
Recommended monthly income: NPR ${(
      result.emi * 3.33
    ).toLocaleString()} (EMI should be ≤30% of income)
Debt-to-income ratio: Keep total EMIs under 40% of monthly income

═══════════════════════════════════════
DISCLAIMER
═══════════════════════════════════════
This calculation is for estimation purposes only. Actual loan terms
may vary based on bank policies, credit score, and other factors.
Please consult with financial institutions for accurate quotes.

Generated by FinanceCalc Pro
Visit: https://financecalc.pro
    `.trim();

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedLoanType.name.replace(" ", "_")}_EMI_Report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (!result) return;

    const shareText = `💰 ${selectedLoanType.name} EMI Analysis

🏦 Loan Details:
• Amount: NPR ${(parseFloat(loanAmount) / 100000).toFixed(1)}L
• Rate: ${interestRate}% for ${tenureYears} years

📊 Results:
• Monthly EMI: NPR ${result.emi.toLocaleString()}
• Total Interest: NPR ${(result.totalInterest / 100000).toFixed(1)}L
• Total Cost: NPR ${(result.totalCost / 100000).toFixed(1)}L

💡 Interest is ${(
      (result.totalInterest / parseFloat(loanAmount)) *
      100
    ).toFixed(1)}% of your loan amount!

Calculate your EMI at FinanceCalc Pro`;

    if (navigator.share) {
      navigator
        .share({
          title: `${selectedLoanType.name} EMI Analysis`,
          text: shareText,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Results copied to clipboard!");
        })
        .catch(() => {
          alert("Unable to copy. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20 md:pb-8">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="financial-calculators">
                <Button variant="ghost" size="sm" className="md:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  EMI Calculator
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Unified loan calculator for all loan types
                </p>
              </div>
            </div>
            <Link href="/" className="hidden md:block">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Loan Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Select Loan Type
                </CardTitle>
                <CardDescription>
                  Choose your loan type for optimized calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {LOAN_TYPES.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleLoanTypeChange(type.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          loanType === type.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`h-8 w-8 bg-gradient-to-r ${type.color} rounded-lg flex items-center justify-center`}
                          >
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-gray-800">
                              {type.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {type.defaultRate}% typical rate
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">
                          {type.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Loan Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <selectedLoanType.icon className="h-5 w-5" />
                      {selectedLoanType.name} Details
                    </CardTitle>
                    <CardDescription>
                      Configure your loan parameters
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetToDefaults}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">💰 Loan Amount (NPR)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="e.g., 10,00,000"
                      className={errors.loanAmount ? "border-red-500" : ""}
                    />
                    {errors.loanAmount && (
                      <p className="text-sm text-red-500">
                        {errors.loanAmount}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interestRate">
                      📈 Interest Rate (% per annum)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="e.g., 12"
                      step="0.1"
                      className={errors.interestRate ? "border-red-500" : ""}
                    />
                    {errors.interestRate && (
                      <p className="text-sm text-red-500">
                        {errors.interestRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenureYears">📆 Loan Tenure (Years)</Label>
                    <Input
                      id="tenureYears"
                      type="number"
                      value={tenureYears}
                      onChange={(e) => setTenureYears(e.target.value)}
                      placeholder="e.g., 10"
                      min={selectedLoanType.minTenure}
                      max={selectedLoanType.maxTenure}
                      className={errors.tenureYears ? "border-red-500" : ""}
                    />
                    {errors.tenureYears && (
                      <p className="text-sm text-red-500">
                        {errors.tenureYears}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Range: {selectedLoanType.minTenure}-
                      {selectedLoanType.maxTenure} years for{" "}
                      {selectedLoanType.name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingFeePercent">
                      🧾 Processing Fee (%)
                    </Label>
                    <Input
                      id="processingFeePercent"
                      type="number"
                      value={processingFeePercent}
                      onChange={(e) => setProcessingFeePercent(e.target.value)}
                      placeholder="e.g., 1"
                      step="0.1"
                      className={
                        errors.processingFeePercent ? "border-red-500" : ""
                      }
                    />
                    {errors.processingFeePercent && (
                      <p className="text-sm text-red-500">
                        {errors.processingFeePercent}
                      </p>
                    )}
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>EMI Formula:</strong> Fixed monthly payment
                    calculated using compound interest. Higher tenure = Lower
                    EMI but more total interest.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Amortization Schedule</Label>
                    <p className="text-sm text-gray-500">
                      Month-wise payment breakdown
                    </p>
                  </div>
                  <Switch
                    checked={showAmortization}
                    onCheckedChange={setShowAmortization}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* EMI Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>EMI Summary</span>
                      <Badge
                        variant="default"
                        className="bg-blue-100 text-blue-800"
                      >
                        NPR {result.emi.toLocaleString()}/month
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-700">
                          Monthly EMI
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          NPR {result.emi.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-sm font-medium text-red-700">
                          Total Interest
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          NPR {(result.totalInterest / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-semibold text-slate-800">
                          NPR {(parseFloat(loanAmount) / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Payment</span>
                        <span className="font-semibold text-slate-800">
                          NPR {(result.totalPayment / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-semibold text-orange-600">
                          NPR {result.processingFee.toLocaleString()}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-medium">
                          Total Cost of Loan
                        </span>
                        <span className="font-bold text-lg text-slate-800">
                          NPR {(result.totalCost / 100000).toFixed(1)}L
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Key Insight:</strong> Your{" "}
                        {selectedLoanType.name.toLowerCase()} EMI of NPR{" "}
                        {result.emi.toLocaleString()} for {tenureYears} years
                        will cost you NPR{" "}
                        {(result.totalInterest / 100000).toFixed(1)}L in total
                        interest — that&apos;s{" "}
                        {(
                          (result.totalInterest / parseFloat(loanAmount)) *
                          100
                        ).toFixed(1)}
                        % of your loan amount.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Loan Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="composition">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="composition">
                          Cost Breakdown
                        </TabsTrigger>
                        <TabsTrigger value="balance">
                          Balance Over Time
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="composition" className="mt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                formatter={(value: any) => [
                                  `NPR ${(value / 100000).toFixed(1)}L`,
                                  "",
                                ]}
                              />
                              <Legend />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>

                      <TabsContent value="balance" className="mt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={balanceChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis
                                tickFormatter={(value) =>
                                  `${(value / 100000).toFixed(0)}L`
                                }
                              />
                              <Tooltip
                                formatter={(value: any, name: string) => [
                                  `NPR ${(value / 100000).toFixed(1)}L`,
                                  name,
                                ]}
                                labelFormatter={(label) => `Month ${label}`}
                              />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="Outstanding Balance"
                                stackId="1"
                                stroke="#ef4444"
                                fill="#ef4444"
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="Principal Paid"
                                stackId="2"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Amortization Table */}
                {showAmortization && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Amortization Schedule
                      </CardTitle>
                      <CardDescription>
                        Month-wise payment breakdown (showing first 24 months)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table className="w-full text-sm">
                          <TableHeader>
                            <TableRow className="border-b">
                              <TableHead className="text-left p-2">
                                MonTableHead
                              </TableHead>
                              <TableHead className="text-right p-2">
                                Principal
                              </TableHead>
                              <TableHead className="text-right p-2">
                                Interest
                              </TableHead>
                              <TableHead className="text-right p-2">
                                EMI
                              </TableHead>
                              <TableHead className="text-right p-2">
                                Balance
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <tbody>
                            {amortization.slice(0, 24).map((row, index) => (
                              <TableRow
                                key={index}
                                className="border-b hover:bg-gray-50"
                              >
                                <TableCell className="p-2 font-medium">
                                  {row.month}
                                </TableCell>
                                <TableCell className="p-2 text-right text-blue-600">
                                  NPR{" "}
                                  {Math.round(
                                    row.principalPaid
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell className="p-2 text-right text-red-600">
                                  NPR{" "}
                                  {Math.round(
                                    row.interestPaid
                                  ).toLocaleString()}
                                </TableCell>
                                <TableCell className="p-2 text-right font-medium">
                                  NPR {Math.round(row.emi).toLocaleString()}
                                </TableCell>
                                <TableCell className="p-2 text-right">
                                  NPR{" "}
                                  {Math.round(
                                    row.balanceRemaining
                                  ).toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))}
                          </tbody>
                        </Table>
                        {amortization.length > 24 && (
                          <p className="text-xs text-gray-500 mt-2 text-center">
                            Showing first 24 months. Download full report for
                            complete schedule.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={shareResults}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Result
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={downloadResults}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
        <div className="grid grid-cols-4 py-2">
          <Link href="/" className="flex flex-col items-center py-2 px-1">
            <Calculator className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Home</span>
          </Link>
          <button className="flex flex-col items-center py-2 px-1">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-blue-600 mt-1">EMI</span>
          </button>
          <button className="flex flex-col items-center py-2 px-1">
            <PieChart className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Charts</span>
          </button>
          <button className="flex flex-col items-center py-2 px-1">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Schedule</span>
          </button>
        </div>
      </div>
    </div>
  );
}
