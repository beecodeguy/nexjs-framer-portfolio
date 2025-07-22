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
  Eye,
  EyeOff,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

interface SIPResult {
  totalInvested: number;
  maturityValue: number;
  realValue: number;
  totalGains: number;
  realGains: number;
  periodicInvestment: number;
  totalPeriods: number;
  effectiveRate: number;
}

interface BreakdownRow {
  period: number;
  year: number;
  cumulativeInvested: number;
  maturityValue: number;
  inflationAdjustedValue: number;
  gains: number;
  realGains: number;
}

const FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Monthly", periodsPerYear: 12 },
  { value: "quarterly", label: "Quarterly", periodsPerYear: 4 },
  { value: "semi-annually", label: "Semi-Annually", periodsPerYear: 2 },
  { value: "annually", label: "Annually", periodsPerYear: 1 },
];

const DEFAULT_VALUES = {
  amount: "5000",
  years: "10",
  returnRate: "12",
  inflationRate: "6",
  frequency: "monthly",
};

export default function SIPCalculator() {
  const [amount, setAmount] = useState<string>(DEFAULT_VALUES.amount);
  const [years, setYears] = useState<string>(DEFAULT_VALUES.years);
  const [returnRate, setReturnRate] = useState<string>(
    DEFAULT_VALUES.returnRate
  );
  const [inflationRate, setInflationRate] = useState<string>(
    DEFAULT_VALUES.inflationRate
  );
  const [frequency, setFrequency] = useState<string>(DEFAULT_VALUES.frequency);
  const [showRealValue, setShowRealValue] = useState<boolean>(true);
  const [chartView, setChartView] = useState<"period" | "year">("year");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetToDefaults = () => {
    setAmount(DEFAULT_VALUES.amount);
    setYears(DEFAULT_VALUES.years);
    setReturnRate(DEFAULT_VALUES.returnRate);
    setInflationRate(DEFAULT_VALUES.inflationRate);
    setFrequency(DEFAULT_VALUES.frequency);
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};

    const amountNum = parseFloat(amount);
    const yearsNum = parseInt(years);
    const returnNum = parseFloat(returnRate);
    const inflationNum = parseFloat(inflationRate);

    if (!amountNum || amountNum <= 0) {
      newErrors.amount = "Investment amount must be greater than 0";
    }

    if (!yearsNum || yearsNum < 1 || yearsNum > 40) {
      newErrors.years = "Investment period must be between 1 and 40 years";
    }

    if (!returnNum || returnNum < 0 || returnNum > 50) {
      newErrors.returnRate = "Expected return must be between 0% and 50%";
    }

    if (!inflationNum || inflationNum < 0 || inflationNum > 20) {
      newErrors.inflationRate = "Inflation rate must be between 0% and 20%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSIP = useMemo((): {
    result: SIPResult | null;
    breakdown: BreakdownRow[];
  } => {
    if (!validateInputs()) return { result: null, breakdown: [] };

    const P = parseFloat(amount);
    const Y = parseInt(years);
    const annualRate = parseFloat(returnRate) / 100;
    const inflationRateDecimal = parseFloat(inflationRate) / 100;

    const selectedFreq = FREQUENCY_OPTIONS.find((f) => f.value === frequency)!;
    const periodsPerYear = selectedFreq.periodsPerYear;
    const totalPeriods = Y * periodsPerYear;
    const periodicRate = annualRate / periodsPerYear;

    // Calculate future value using SIP formula
    const futureValue =
      P *
      (((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate) *
        (1 + periodicRate));
    const totalInvested = P * totalPeriods;
    const realValue = futureValue / Math.pow(1 + inflationRateDecimal, Y);

    const result: SIPResult = {
      totalInvested,
      maturityValue: futureValue,
      realValue,
      totalGains: futureValue - totalInvested,
      realGains: realValue - totalInvested,
      periodicInvestment: P,
      totalPeriods,
      effectiveRate: (futureValue / totalInvested - 1) * 100,
    };

    // Generate breakdown
    const breakdown: BreakdownRow[] = [];
    let cumulativeInvested = 0;
    let currentValue = 0;

    for (let period = 1; period <= totalPeriods; period++) {
      cumulativeInvested += P;

      // Calculate value at this period
      currentValue =
        P *
        (((Math.pow(1 + periodicRate, period) - 1) / periodicRate) *
          (1 + periodicRate));

      const yearProgress = period / periodsPerYear;
      const inflationAdjusted =
        currentValue / Math.pow(1 + inflationRateDecimal, yearProgress);

      breakdown.push({
        period,
        year: Math.ceil(period / periodsPerYear),
        cumulativeInvested,
        maturityValue: currentValue,
        inflationAdjustedValue: inflationAdjusted,
        gains: currentValue - cumulativeInvested,
        realGains: inflationAdjusted - cumulativeInvested,
      });
    }

    return { result, breakdown };
  }, [amount, years, returnRate, inflationRate, frequency]);

  const { result, breakdown } = calculateSIP;

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!breakdown.length) return [];

    if (chartView === "year") {
      // Group by year
      const yearlyData: Record<number, BreakdownRow> = {};
      breakdown.forEach((row) => {
        yearlyData[row.year] = row;
      });

      return Object.values(yearlyData).map((row) => ({
        period: row.year,
        label: `Year ${row.year}`,
        "Total Invested": Math.round(row.cumulativeInvested),
        "Maturity Value": Math.round(row.maturityValue),
        "Real Value": Math.round(row.inflationAdjustedValue),
      }));
    } else {
      // Show all periods
      return breakdown.map((row) => ({
        period: row.period,
        label: `Period ${row.period}`,
        "Total Invested": Math.round(row.cumulativeInvested),
        "Maturity Value": Math.round(row.maturityValue),
        "Real Value": Math.round(row.inflationAdjustedValue),
      }));
    }
  }, [breakdown, chartView]);

  const downloadResults = () => {
    if (!result) return;

    const selectedFreq = FREQUENCY_OPTIONS.find((f) => f.value === frequency)!;

    const reportData = `
SIP INVESTMENT ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}

═══════════════════════════════════════
INVESTMENT DETAILS
═══════════════════════════════════════
Investment Amount: NPR ${parseFloat(amount).toLocaleString()} (${
      selectedFreq.label
    })
Investment Period: ${years} years
Expected Annual Return: ${returnRate}%
Inflation Rate: ${inflationRate}%
Investment Frequency: ${selectedFreq.label}
Total Periods: ${result.totalPeriods}

═══════════════════════════════════════
INVESTMENT SUMMARY
═══════════════════════════════════════
Total Amount Invested: NPR ${result.totalInvested.toLocaleString()}
Maturity Value: NPR ${result.maturityValue.toLocaleString()}
Inflation-Adjusted Value: NPR ${result.realValue.toLocaleString()}
Total Gains: NPR ${result.totalGains.toLocaleString()}
Real Gains: NPR ${result.realGains.toLocaleString()}
Effective Return Rate: ${result.effectiveRate.toFixed(2)}%

═══════════════════════════════════════
PERIOD-WISE BREAKDOWN
═══════════════════════════════════════
Period | Year | Invested | Maturity | Real Value | Gains
${breakdown
  .slice(0, 20)
  .map(
    (row) =>
      `${row.period.toString().padEnd(6)} | ${row.year
        .toString()
        .padEnd(4)} | ${row.cumulativeInvested
        .toLocaleString()
        .padEnd(8)} | ${row.maturityValue
        .toLocaleString()
        .padEnd(8)} | ${row.inflationAdjustedValue
        .toLocaleString()
        .padEnd(10)} | ${row.gains.toLocaleString()}`
  )
  .join("\n")}
${breakdown.length > 20 ? "... (showing first 20 periods)" : ""}

═══════════════════════════════════════
KEY INSIGHTS
═══════════════════════════════════════
• Your ${selectedFreq.label.toLowerCase()} investment of NPR ${parseFloat(
      amount
    ).toLocaleString()} for ${years} years
• Grows to NPR ${(result.maturityValue / 100000).toFixed(1)}L (${(
      result.realValue / 100000
    ).toFixed(1)}L in today's value)
• Total return: ${(
      (result.maturityValue / result.totalInvested - 1) *
      100
    ).toFixed(1)}%
• Real return after inflation: ${(
      (result.realValue / result.totalInvested - 1) *
      100
    ).toFixed(1)}%

═══════════════════════════════════════
DISCLAIMER
═══════════════════════════════════════
This calculation is based on assumed returns and may not reflect
actual market performance. Past performance does not guarantee
future results. Please consult a financial advisor for investment decisions.

Generated by FinanceCalc Pro
Visit: https://financecalc.pro
    `.trim();

    const blob = new Blob([reportData], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `SIP_Analysis_Report_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (!result) return;

    const selectedFreq = FREQUENCY_OPTIONS.find((f) => f.value === frequency)!;
    const shareText = `💰 SIP Investment Analysis

📊 Investment: NPR ${parseFloat(
      amount
    ).toLocaleString()} ${selectedFreq.label.toLowerCase()} for ${years} years
📈 Expected Return: ${returnRate}% annually

🎯 Results:
• Total Invested: NPR ${(result.totalInvested / 100000).toFixed(1)}L
• Maturity Value: NPR ${(result.maturityValue / 100000).toFixed(1)}L
• Real Value: NPR ${(result.realValue / 100000).toFixed(1)}L
• Total Gains: NPR ${(result.totalGains / 100000).toFixed(1)}L

💡 Your ${selectedFreq.label.toLowerCase()} investment grows to ${(
      (result.maturityValue / result.totalInvested - 1) *
      100
    ).toFixed(1)}% returns!

Calculate your SIP returns at FinanceCalc Pro`;

    if (navigator.share) {
      navigator
        .share({
          title: "SIP Investment Analysis",
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
              <Link href="/">
                <Button variant="ghost" size="sm" className="md:hidden">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900">
                  SIP Calculator
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Systematic Investment Plan with inflation analysis
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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      SIP Investment Details
                    </CardTitle>
                    <CardDescription>
                      Configure your systematic investment plan
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
                    <Label htmlFor="amount">💰 Investment Amount (NPR)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g., 5,000"
                      className={errors.amount ? "border-red-500" : ""}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years">📆 Investment Period (Years)</Label>
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="e.g., 10"
                      min="1"
                      max="40"
                      className={errors.years ? "border-red-500" : ""}
                    />
                    {errors.years && (
                      <p className="text-sm text-red-500">{errors.years}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnRate">
                      📈 Expected Annual Return (%)
                    </Label>
                    <Input
                      id="returnRate"
                      type="number"
                      value={returnRate}
                      onChange={(e) => setReturnRate(e.target.value)}
                      placeholder="e.g., 12"
                      step="0.1"
                      className={errors.returnRate ? "border-red-500" : ""}
                    />
                    {errors.returnRate && (
                      <p className="text-sm text-red-500">
                        {errors.returnRate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inflationRate">📉 Inflation Rate (%)</Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(e.target.value)}
                      placeholder="e.g., 6"
                      step="0.1"
                      className={errors.inflationRate ? "border-red-500" : ""}
                    />
                    {errors.inflationRate && (
                      <p className="text-sm text-red-500">
                        {errors.inflationRate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">🔁 Investment Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Compounding Frequency:</strong> Matches your
                    investment frequency for accurate calculations
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Inflation-Adjusted Values</Label>
                    <p className="text-sm text-gray-500">
                      Display real purchasing power
                    </p>
                  </div>
                  <Switch
                    checked={showRealValue}
                    onCheckedChange={setShowRealValue}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chart View</Label>
                  <Select
                    value={chartView}
                    onValueChange={(value: "period" | "year") =>
                      setChartView(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year">Per Year</SelectItem>
                      <SelectItem value="period">Per Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Summary Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Investment Summary</span>
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        {result.effectiveRate.toFixed(1)}% Returns
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-700">
                          Total Invested
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          NPR {(result.totalInvested / 100000).toFixed(1)}L
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-sm font-medium text-green-700">
                          Maturity Value
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          NPR {(result.maturityValue / 100000).toFixed(1)}L
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total Gains</span>
                        <span className="font-semibold text-green-600">
                          NPR {(result.totalGains / 100000).toFixed(1)}L
                        </span>
                      </div>

                      {showRealValue && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Real Value (Today&apos;s Power)
                            </span>
                            <span className="font-semibold text-orange-600">
                              NPR {(result.realValue / 100000).toFixed(1)}L
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Real Gains</span>
                            <span className="font-semibold text-orange-600">
                              NPR {(result.realGains / 100000).toFixed(1)}L
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        💡 <strong>Key Insight:</strong> Your{" "}
                        {FREQUENCY_OPTIONS.find(
                          (f) => f.value === frequency
                        )?.label.toLowerCase()}{" "}
                        investment of NPR {parseFloat(amount).toLocaleString()}{" "}
                        for {years} years grows to NPR{" "}
                        {(result.maturityValue / 100000).toFixed(1)}L —
                        equivalent to NPR{" "}
                        {(result.realValue / 100000).toFixed(1)}L in today
                        purchasing power.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Growth Visualization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="line">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="line">Growth Chart</TabsTrigger>
                        <TabsTrigger value="area">Comparison Chart</TabsTrigger>
                      </TabsList>

                      <TabsContent value="line" className="mt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" />
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
                                labelFormatter={(label) =>
                                  `${
                                    chartView === "year" ? "Year" : "Period"
                                  } ${label}`
                                }
                              />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="Total Invested"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="Maturity Value"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                              />
                              {showRealValue && (
                                <Line
                                  type="monotone"
                                  dataKey="Real Value"
                                  stroke="#f59e0b"
                                  strokeWidth={2}
                                  strokeDasharray="5 5"
                                  dot={{ r: 3 }}
                                />
                              )}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>

                      <TabsContent value="area" className="mt-4">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="period" />
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
                                labelFormatter={(label) =>
                                  `${
                                    chartView === "year" ? "Year" : "Period"
                                  } ${label}`
                                }
                              />
                              <Legend />
                              <Area
                                type="monotone"
                                dataKey="Total Invested"
                                stackId="1"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.6}
                              />
                              <Area
                                type="monotone"
                                dataKey="Maturity Value"
                                stackId="2"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.6}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Breakdown Table */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Period-wise Breakdown
                    </CardTitle>
                    <CardDescription>
                      Showing {chartView === "year" ? "yearly" : "period-wise"}{" "}
                      investment growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table className="w-full text-sm">
                        <TableHeader>
                          <TableRow className="border-b">
                            <TableHead className="text-left p-2">
                              {chartView === "year" ? "Year" : "Period"}
                            </TableHead>
                            <TableHead className="text-right p-2">
                              Invested
                            </TableHead>
                            <TableHead className="text-right p-2">
                              Maturity Value
                            </TableHead>
                            {showRealValue && (
                              <TableHead className="text-right p-2">
                                Real Value
                              </TableHead>
                            )}
                            <TableHead className="text-right p-2">
                              Gains
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <tbody>
                          {(chartView === "year"
                            ? breakdown.filter(
                                (_, index) =>
                                  (index + 1) %
                                    FREQUENCY_OPTIONS.find(
                                      (f) => f.value === frequency
                                    )!.periodsPerYear ===
                                  0
                              )
                            : breakdown.slice(0, 10)
                          ).map((row, index) => (
                            <TableRow
                              key={index}
                              className="border-b hover:bg-gray-50"
                            >
                              <TableCell className="p-2 font-medium">
                                {chartView === "year" ? row.year : row.period}
                              </TableCell>
                              <TableCell className="p-2 text-right">
                                NPR {row.cumulativeInvested.toLocaleString()}
                              </TableCell>
                              <TableCell className="p-2 text-right text-green-600">
                                NPR{" "}
                                {Math.round(row.maturityValue).toLocaleString()}
                              </TableCell>
                              {showRealValue && (
                                <TableCell className="p-2 text-right text-orange-600">
                                  NPR{" "}
                                  {Math.round(
                                    row.inflationAdjustedValue
                                  ).toLocaleString()}
                                </TableCell>
                              )}
                              <TableCell className="p-2 text-right text-blue-600">
                                NPR {Math.round(row.gains).toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </tbody>
                      </Table>
                      {breakdown.length > 10 && chartView === "period" && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                          Showing first 10 periods. Download full report for
                          complete breakdown.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

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
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-xs text-blue-600 mt-1">SIP</span>
          </button>
          <button className="flex flex-col items-center py-2 px-1">
            <PieChart className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Charts</span>
          </button>
          <button className="flex flex-col items-center py-2 px-1">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
}
