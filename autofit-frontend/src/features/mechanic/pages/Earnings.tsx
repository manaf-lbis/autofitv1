import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { EarningsDuration, useEarningsQuery } from "@/services/mechanicServices/mechanicApi";
import {
  TrendingUp,
  DollarSign,
  Minus,
  CreditCard,
  Wallet,
  PieChartIcon,
  BarChart3,
  Activity,
  CalendarIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const useAnimatedCounter = (end: number, duration = 1000) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return count;
};

const chartConfig = {
  net: { label: "Net Amount", color: "#3b82f6" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-blue-600 font-bold">Net: ₹{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-medium text-slate-900">{data._id}</p>
        <p className="text-blue-600 font-bold">₹{data.net}</p>
        <p className="text-slate-500 text-sm">{((data.net / payload[0].payload.totalNet) * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const monthOrder = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const dayOrder = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };

export default function Earnings() {
  const [selectedPeriod, setSelectedPeriod] = useState<EarningsDuration>(EarningsDuration.YEAR);
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const { data: earningsData } = useEarningsQuery({
    duration: selectedPeriod,
    ...(selectedPeriod === EarningsDuration.CUSTOM && range.from && range.to
      ? { customFrom: format(range.from, "yyyy-MM-dd"), customTo: format(range.to, "yyyy-MM-dd") }
      : {}),
  },{
    refetchOnMountOrArgChange :true,
    refetchOnReconnect: true,  
  });

  const processedData = useMemo(() => {
    if (!earningsData) return { data: [], earningsTypeData: [], recentEarnings: [] };

    const chartData = earningsData.data.map((item: { param: string; net: number }) => ({ param: item.param, net: item.net }));

    const getOrder = (param: string) => {
      if (selectedPeriod === EarningsDuration.YEAR) return parseInt(param, 10);
      if (selectedPeriod === EarningsDuration.MONTH) return monthOrder[param as keyof typeof monthOrder];
      if (selectedPeriod === EarningsDuration.WEEK) return dayOrder[param as keyof typeof dayOrder];
      if (selectedPeriod === EarningsDuration.CUSTOM) return new Date(param).getTime();
      return 0;
    };

    chartData.sort((a: any, b: any) => getOrder(a.param) - getOrder(b.param));

    if (selectedPeriod === EarningsDuration.DAY && chartData.length > 0) {
      chartData[0].param = "Today";
    }

    const earningsTypeData = earningsData.earnings.map((item: any) => ({
      ...item,
      color: item._id === "pretrip" ? "#1e40af" : item._id === "roadside" ? "#3b82f6" : item._id === "liveAssistance" ? "#60a5fa" : "#93c5fd",
    }));

    return {
      data: chartData,
      earningsTypeData,
      recentEarnings: earningsData.recentEarnings,
    };
  }, [earningsData, selectedPeriod]);

  const { data } = processedData;

  const totalGrossEarnings = processedData.earningsTypeData.reduce((sum: number, item: any) => sum + item.value, 0);
  const totalNetEarnings = processedData.earningsTypeData.reduce((sum: number, item: any) => sum + item.net, 0);
  const totalDeductions = totalGrossEarnings - totalNetEarnings;

  const growthRate = useMemo(() => {
    if (data.length < 2) return 0;
    const last = data[data.length - 1].net;
    const prev = data[data.length - 2].net;
    if (prev === 0) return 0;
    return ((last - prev) / prev) * 100;
  }, [data]);

  const animatedGross = useAnimatedCounter(totalGrossEarnings);
  const animatedNet = useAnimatedCounter(totalNetEarnings);
  const animatedDeductions = useAnimatedCounter(totalDeductions);
  const animatedGrowth = useAnimatedCounter(Math.abs(growthRate) * 10) / 10;

  const isDetailedView = selectedPeriod === EarningsDuration.DAY || selectedPeriod === EarningsDuration.CUSTOM;
  const recentTransactions = processedData.recentEarnings.slice(0, isDetailedView ? 20 : 7);

  const periodLabel = selectedPeriod === EarningsDuration.DAY ? "today" : selectedPeriod === EarningsDuration.CUSTOM ? "selected range" : `this ${selectedPeriod}`;
  const recentLabel = selectedPeriod === EarningsDuration.DAY ? "Today's" : selectedPeriod === EarningsDuration.CUSTOM ? "Custom Range's" : "Recent";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: EarningsDuration.DAY, label: "Today" },
            { value: EarningsDuration.WEEK, label: "This Week" },
            { value: EarningsDuration.MONTH, label: "This Month" },
            { value: EarningsDuration.YEAR, label: "Year" },
          ].map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                selectedPeriod === period.value
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {period.label}
            </Button>
          ))}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={selectedPeriod === EarningsDuration.CUSTOM ? "default" : "outline"}
                size="sm"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  selectedPeriod === EarningsDuration.CUSTOM
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {range.from && range.to ? `${format(range.from, "MMM dd")} - ${format(range.to, "MMM dd")}` : "Custom Range"}
                <CalendarIcon className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="range"
                selected={{ from: range.from, to: range.to }}
                onSelect={(selectedRange) => {
                  if (selectedRange?.from && selectedRange?.to && selectedRange.to <= new Date()) {
                    setRange({ from: selectedRange.from, to: selectedRange.to });
                    setSelectedPeriod(EarningsDuration.CUSTOM);
                  } else if (selectedRange?.from && !selectedRange.to) {
                    setRange({ from: selectedRange.from, to: undefined });
                  }
                }}
                disabled={(date: Date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border border-emerald-200 rounded-lg flex items-center justify-center shadow-sm">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Gross</p>
                  <p className="text-2xl font-bold text-emerald-600">₹{animatedGross}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Before deductions</p>
                <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-xs font-semibold text-emerald-700">Gross Income</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border border-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Net Earnings</p>
                  <p className="text-2xl font-bold text-blue-600">₹{animatedNet}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">After deductions</p>
                <div className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-blue-700">Take Home</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border border-red-200 rounded-lg flex items-center justify-center shadow-sm">
                  <Minus className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deductions</p>
                  <p className="text-2xl font-bold text-red-600">₹{animatedDeductions}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {totalGrossEarnings > 0 ? ((totalDeductions / totalGrossEarnings) * 100).toFixed(1) : 0}% of gross
                </p>
                <div className="px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs font-semibold text-red-700">Tax & Fees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border border-indigo-200 rounded-lg flex items-center justify-center shadow-sm">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-indigo-600">{growthRate >= 0 ? '+' : ''}{animatedGrowth.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">This period</p>
                <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-700">Trending {growthRate >= 0 ? 'Up' : 'Down'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border border-slate-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Net Profit Trends
                  </CardTitle>
                  <CardDescription className="text-slate-600 text-sm">
                    Track your net earnings performance
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span className="text-xs font-medium text-blue-700">Net Profit</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {totalNetEarnings === 0 ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No earnings data</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    No earnings recorded for {periodLabel}. Your earnings chart will appear here once you have transactions.
                  </p>
                </div>
              ) : (
                <div className="w-full h-[280px] -mb-2">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={data}
                        margin={{
                          top: 15,
                          right: 15,
                          left: 5,
                          bottom: 25,
                        }}
                      >
                        <XAxis
                          dataKey="param"
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                          interval={0}
                          height={25}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fill: "#64748b" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${value}`}
                          width={50}
                        />
                        <ChartTooltip content={<CustomTooltip />} />
                        <Line
                          dataKey="net"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 3, fill: "#ffffff" }}
                          name="Net Profit"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm bg-white rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                Income Sources
              </CardTitle>
              <CardDescription className="text-slate-600 text-sm">Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {processedData.earningsTypeData.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <PieChartIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No income sources</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    No income data available for {periodLabel}.
                    Income breakdown will show here once you have earnings.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="w-full max-w-[200px] mx-auto lg:mx-0">
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                          <Pie
                            data={processedData.earningsTypeData.map((item: any) => ({ ...item, totalNet: totalNetEarnings }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="net"
                          >
                            {processedData.earningsTypeData.map((entry: any, index: any) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="space-y-2 lg:w-1/2">
                    {processedData.earningsTypeData.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-slate-700 text-xs truncate">{item._id}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-slate-900 text-xs">₹{item.net}</p>
                          <p className="text-xs text-slate-500">{((item.net / totalNetEarnings) * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-slate-200 shadow-sm bg-white rounded-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-slate-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription className="text-slate-600 text-sm">
                  {recentLabel} • {recentTransactions.length} transactions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
              {recentTransactions.map((earning: any) => (
                <div
                  key={earning.transactionId}
                  className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{earning.description}</h3>
                        <p className="text-xs text-slate-500">{new Date(earning.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md">
                        {earning.serviceType}
                      </Badge>
                      <Badge
                        variant={earning.status === "received" ? "default" : "secondary"}
                        className={
                          earning.status === "received"
                            ? "bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-md"
                            : "bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md"
                        }
                      >
                        {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Gross</p>
                      <p className="text-sm font-bold text-slate-900">₹{earning.grossAmount}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Deducted</p>
                      <p className="text-sm font-bold text-red-600">-₹{earning.deductionAmount}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Net</p>
                      <p className="text-sm font-bold text-emerald-600">₹{earning.netAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Deduction: {earning.deductionRate}%</span>
                    <code className="text-xs text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded">
                      {earning.transactionId}
                    </code>
                  </div>
                </div>
              ))}
            </div>

            {recentTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No transactions yet</h3>
                <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
                  No transactions available for the selected period.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPeriod(EarningsDuration.YEAR)}
                    className="rounded-lg"
                  >
                    View Year
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg bg-transparent">
                    Add Transaction
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}