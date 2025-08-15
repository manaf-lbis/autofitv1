import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import {
  TrendingUp,
  DollarSign,
  Download,
  Filter,
  Minus,
  CreditCard,
  Wallet,
  PieChartIcon,
  BarChart3,
  Activity,
} from "lucide-react"

const useAnimatedCounter = (end: number, duration = 1000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

const generateDummyData = (period: string) => {
  const baseData = {
    today: {
      monthlyData: [{ month: "Today", net: 0 }],
      earningsTypeData: [],
      recentEarnings: [],
    },
    week: {
      monthlyData: [
        { month: "Mon", net: 32000 },
        { month: "Tue", net: 0 },
        { month: "Wed", net: 75000 },
        { month: "Thu", net: 45000 },
        { month: "Fri", net: 68000 },
        { month: "Sat", net: 0 },
        { month: "Sun", net: 0 },
      ],
      earningsTypeData: [
        { name: "Salary", value: 120000, net: 108000, color: "#1e40af" },
        { name: "Freelance", value: 100000, net: 90000, color: "#3b82f6" },
        { name: "Bonuses", value: 30000, net: 27000, color: "#60a5fa" },
      ],
      recentEarnings: [
        {
          id: 1,
          description: "Weekly Salary",
          grossAmount: 120000,
          deduction: 12000,
          netAmount: 108000,
          deductionRate: 10.0,
          type: "Salary",
          date: "2024-01-15",
          status: "Received",
          transactionId: "TXN-SAL-240115-001",
        },
        {
          id: 2,
          description: "Logo Design",
          grossAmount: 80000,
          deduction: 8000,
          netAmount: 72000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-13",
          status: "Received",
          transactionId: "TXN-FRL-240113-002",
        },
        {
          id: 3,
          description: "UI/UX Consultation",
          grossAmount: 60000,
          deduction: 6000,
          netAmount: 54000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-12",
          status: "Received",
          transactionId: "TXN-FRL-240112-003",
        },
        {
          id: 4,
          description: "Mobile App Design",
          grossAmount: 90000,
          deduction: 9000,
          netAmount: 81000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-11",
          status: "Received",
          transactionId: "TXN-FRL-240111-004",
        },
        {
          id: 5,
          description: "Brand Identity Project",
          grossAmount: 75000,
          deduction: 7500,
          netAmount: 67500,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-10",
          status: "Received",
          transactionId: "TXN-FRL-240110-005",
        },
        {
          id: 6,
          description: "Website Maintenance",
          grossAmount: 40000,
          deduction: 4000,
          netAmount: 36000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-09",
          status: "Received",
          transactionId: "TXN-FRL-240109-006",
        },
        {
          id: 7,
          description: "E-commerce Setup",
          grossAmount: 110000,
          deduction: 11000,
          netAmount: 99000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-08",
          status: "Received",
          transactionId: "TXN-FRL-240108-007",
        },
      ],
    },
    month: {
      monthlyData: [
        { month: "Week 1", net: 0 }, // No earnings in week 1
        { month: "Week 2", net: 180000 },
        { month: "Week 3", net: 240000 },
        { month: "Week 4", net: 190000 },
      ],
      earningsTypeData: [
        { name: "Salary", value: 500000, net: 450000, color: "#1e40af" },
        { name: "Freelance", value: 250000, net: 225000, color: "#3b82f6" },
        { name: "Investments", value: 80000, net: 72000, color: "#60a5fa" },
        { name: "Bonuses", value: 100000, net: 90000, color: "#93c5fd" },
      ],
      recentEarnings: [
        {
          id: 1,
          description: "Monthly Salary",
          grossAmount: 500000,
          deduction: 50000,
          netAmount: 450000,
          deductionRate: 10.0,
          type: "Salary",
          date: "2024-01-31",
          status: "Received",
          transactionId: "TXN-SAL-240131-001",
        },
        {
          id: 2,
          description: "E-commerce Project",
          grossAmount: 250000,
          deduction: 25000,
          netAmount: 225000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-28",
          status: "Received",
          transactionId: "TXN-FRL-240128-002",
        },
        {
          id: 3,
          description: "Stock Dividends",
          grossAmount: 80000,
          deduction: 8000,
          netAmount: 72000,
          deductionRate: 10.0,
          type: "Investments",
          date: "2024-01-25",
          status: "Received",
          transactionId: "TXN-INV-240125-003",
        },
        {
          id: 4,
          description: "Performance Bonus",
          grossAmount: 100000,
          deduction: 10000,
          netAmount: 90000,
          deductionRate: 10.0,
          type: "Bonuses",
          date: "2024-01-20",
          status: "Received",
          transactionId: "TXN-BON-240120-004",
        },
        {
          id: 5,
          description: "Consulting Work",
          grossAmount: 180000,
          deduction: 18000,
          netAmount: 162000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-18",
          status: "Received",
          transactionId: "TXN-CON-240118-005",
        },
        {
          id: 6,
          description: "Web Development",
          grossAmount: 120000,
          deduction: 12000,
          netAmount: 108000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-15",
          status: "Received",
          transactionId: "TXN-WEB-240115-006",
        },
        {
          id: 7,
          description: "Design System Creation",
          grossAmount: 95000,
          deduction: 9500,
          netAmount: 85500,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-12",
          status: "Received",
          transactionId: "TXN-DES-240112-007",
        },
      ],
    },
    "6months": {
      monthlyData: [
        { month: "Aug", net: 427500 },
        { month: "Sep", net: 494000 },
        { month: "Oct", net: 456000 },
        { month: "Nov", net: 579500 },
        { month: "Dec", net: 551000 },
        { month: "Jan", net: 684000 },
      ],
      earningsTypeData: [
        { name: "Salary", value: 3200000, net: 2880000, color: "#1e40af" },
        { name: "Freelance", value: 840000, net: 756000, color: "#3b82f6" },
        { name: "Investments", value: 320000, net: 288000, color: "#60a5fa" },
        { name: "Bonuses", value: 280000, net: 252000, color: "#93c5fd" },
      ],
      recentEarnings: [
        {
          id: 1,
          description: "January Salary",
          grossAmount: 600000,
          deduction: 60000,
          netAmount: 540000,
          deductionRate: 10.0,
          type: "Salary",
          date: "2024-01-31",
          status: "Received",
          transactionId: "TXN-SAL-240131-001",
        },
        {
          id: 2,
          description: "Year-end Bonus",
          grossAmount: 280000,
          deduction: 28000,
          netAmount: 252000,
          deductionRate: 10.0,
          type: "Bonuses",
          date: "2024-01-15",
          status: "Received",
          transactionId: "TXN-BON-240115-002",
        },
        {
          id: 3,
          description: "Investment Returns",
          grossAmount: 120000,
          deduction: 12000,
          netAmount: 108000,
          deductionRate: 10.0,
          type: "Investments",
          date: "2024-01-10",
          status: "Received",
          transactionId: "TXN-INV-240110-003",
        },
        {
          id: 4,
          description: "Freelance Project",
          grossAmount: 350000,
          deduction: 35000,
          netAmount: 315000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-05",
          status: "Received",
          transactionId: "TXN-FRL-240105-004",
        },
        {
          id: 5,
          description: "December Salary",
          grossAmount: 580000,
          deduction: 58000,
          netAmount: 522000,
          deductionRate: 10.0,
          type: "Salary",
          date: "2023-12-31",
          status: "Received",
          transactionId: "TXN-SAL-231231-005",
        },
        {
          id: 6,
          description: "Consulting Fee",
          grossAmount: 220000,
          deduction: 22000,
          netAmount: 198000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2023-12-28",
          status: "Received",
          transactionId: "TXN-CON-231228-006",
        },
        {
          id: 7,
          description: "Stock Dividends",
          grossAmount: 90000,
          deduction: 9000,
          netAmount: 81000,
          deductionRate: 10.0,
          type: "Investments",
          date: "2023-12-25",
          status: "Received",
          transactionId: "TXN-INV-231225-007",
        },
      ],
    },
    overall: {
      monthlyData: [
        { month: "Jan", net: 427500 },
        { month: "Feb", net: 494000 },
        { month: "Mar", net: 456000 },
        { month: "Apr", net: 579500 },
        { month: "May", net: 551000 },
        { month: "Jun", net: 684000 },
      ],
      earningsTypeData: [
        { name: "Salary", value: 6500000, net: 5850000, color: "#1e40af" },
        { name: "Freelance", value: 1840000, net: 1656000, color: "#3b82f6" },
        { name: "Investments", value: 620000, net: 558000, color: "#60a5fa" },
        { name: "Bonuses", value: 880000, net: 792000, color: "#93c5fd" },
      ],
      recentEarnings: [
        {
          id: 1,
          description: "Monthly Salary",
          grossAmount: 720000,
          deduction: 72000,
          netAmount: 648000,
          deductionRate: 10.0,
          type: "Salary",
          date: "2024-01-31",
          status: "Received",
          transactionId: "TXN-SAL-240131-001",
        },
        {
          id: 2,
          description: "Mobile App Project",
          grossAmount: 350000,
          deduction: 35000,
          netAmount: 315000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-28",
          status: "Received",
          transactionId: "TXN-FRL-240128-002",
        },
        {
          id: 3,
          description: "Quarterly Dividends",
          grossAmount: 120000,
          deduction: 12000,
          netAmount: 108000,
          deductionRate: 10.0,
          type: "Investments",
          date: "2024-01-25",
          status: "Pending",
          transactionId: "TXN-INV-240125-003",
        },
        {
          id: 4,
          description: "Performance Bonus",
          grossAmount: 200000,
          deduction: 20000,
          netAmount: 180000,
          deductionRate: 10.0,
          type: "Bonuses",
          date: "2024-01-20",
          status: "Pending",
          transactionId: "TXN-BON-240120-004",
        },
        {
          id: 5,
          description: "Consulting Work",
          grossAmount: 180000,
          deduction: 18000,
          netAmount: 162000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-18",
          status: "Received",
          transactionId: "TXN-CON-240118-005",
        },
        {
          id: 6,
          description: "Web Development",
          grossAmount: 280000,
          deduction: 28000,
          netAmount: 252000,
          deductionRate: 10.0,
          type: "Freelance",
          date: "2024-01-15",
          status: "Received",
          transactionId: "TXN-WEB-240115-006",
        },
        {
          id: 7,
          description: "Investment Returns",
          grossAmount: 95000,
          deduction: 9500,
          netAmount: 85500,
          deductionRate: 10.0,
          type: "Investments",
          date: "2024-01-12",
          status: "Received",
          transactionId: "TXN-INV-240112-007",
        },
      ],
    },
  }

  return baseData[period as keyof typeof baseData] || baseData.overall
}

const chartConfig = {
  net: {
    label: "Net Amount",
    color: "#3b82f6",
  },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-blue-600 font-bold">Net: ₹{(payload[0].value / 1000).toFixed(1)}k</p>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-medium text-slate-900">{data.name}</p>
        <p className="text-blue-600 font-bold">₹{(data.net / 1000).toFixed(1)}k</p>
        <p className="text-slate-500 text-sm">{((data.net / payload[0].payload.totalNet) * 100).toFixed(1)}%</p>
      </div>
    )
  }
  return null
}

export default function Earnings() {
  const [selectedPeriod, setSelectedPeriod] = useState("overall")

  const currentData = generateDummyData(selectedPeriod)
  const { monthlyData, earningsTypeData, recentEarnings } = currentData

  const totalGrossEarnings = earningsTypeData.reduce((sum, item) => sum + item.value, 0)
  const totalNetEarnings = earningsTypeData.reduce((sum, item) => sum + item.net, 0)
  const totalDeductions = totalGrossEarnings - totalNetEarnings
  const monthlyGrowth = totalNetEarnings > 0 ? 12.5 : 0 // No growth if no earnings

  const animatedGross = useAnimatedCounter(totalGrossEarnings)
  const animatedNet = useAnimatedCounter(totalNetEarnings)
  const animatedDeductions = useAnimatedCounter(totalDeductions)
  const animatedGrowth = useAnimatedCounter(monthlyGrowth * 10) / 10

  const last7DaysTransactions = recentEarnings.slice(0, 7)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 py-6">


        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "6months", label: "6 Months" },
            { value: "overall", label: "Overall" },
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
                  <p className="text-2xl font-bold text-emerald-600">₹{(animatedGross / 100000).toFixed(1)}L</p>
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
                  <p className="text-2xl font-bold text-blue-600">₹{(animatedNet / 100000).toFixed(1)}L</p>
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
                  <p className="text-2xl font-bold text-red-600">₹{(animatedDeductions / 1000).toFixed(0)}k</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {((totalDeductions / totalGrossEarnings) * 100).toFixed(1)}% of gross
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
                  <p className="text-2xl font-bold text-indigo-600">+{animatedGrowth.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">This period</p>
                <div className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <p className="text-xs font-semibold text-indigo-700">Trending Up</p>
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
                    No earnings recorded for {selectedPeriod === "today" ? "today" : `this ${selectedPeriod}`}. Your
                    earnings chart will appear here once you have transactions.
                  </p>
                </div>
              ) : (
                <div className="w-full h-[280px] -mb-2">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyData}
                        margin={{
                          top: 15,
                          right: 15,
                          left: 5,
                          bottom: 25,
                        }}
                      >
                        <XAxis
                          dataKey="month"
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
                          tickFormatter={(value:any) => `₹${(value / 1000).toFixed(0)}k`}
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
              {earningsTypeData.length === 0 ? (
                <div className="h-[200px] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <PieChartIcon className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No income sources</h3>
                  <p className="text-sm text-slate-500 max-w-xs">
                    No income data available for {selectedPeriod === "today" ? "today" : `this ${selectedPeriod}`}.
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
                            data={earningsTypeData.map((item) => ({ ...item, totalNet: totalNetEarnings }))}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={85}
                            paddingAngle={2}
                            dataKey="net"
                          >
                            {earningsTypeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                  <div className="space-y-2 lg:w-1/2">
                    {earningsTypeData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-slate-700 text-xs truncate">{item.name}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-slate-900 text-xs">₹{(item.net / 100000).toFixed(1)}L</p>
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
                  Last 7 days • {last7DaysTransactions.length} transactions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-4 py-2.5 rounded-lg border-slate-200 hover:bg-slate-50 bg-white font-medium transition-colors"
                >
                  <Filter className="h-3.5 w-3.5 mr-2" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-4 py-2.5 rounded-lg border-slate-200 hover:bg-slate-50 bg-white font-medium transition-colors"
                >
                  <Download className="h-3.5 w-3.5 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
              {last7DaysTransactions.map((earning) => (
                <div
                  key={earning.id}
                  className="border border-slate-100 rounded-lg p-3 hover:border-slate-200 hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-900 text-sm truncate">{earning.description}</h3>
                        <p className="text-xs text-slate-500">{earning.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-md">
                        {earning.type}
                      </Badge>
                      <Badge
                        variant={earning.status === "Received" ? "default" : "secondary"}
                        className={
                          earning.status === "Received"
                            ? "bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-md"
                            : "bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-md"
                        }
                      >
                        {earning.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Gross</p>
                      <p className="text-sm font-bold text-slate-900">₹{(earning.grossAmount / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Deducted</p>
                      <p className="text-sm font-bold text-red-600">-₹{(earning.deduction / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded-md">
                      <p className="text-xs text-slate-500 mb-0.5">Net</p>
                      <p className="text-sm font-bold text-emerald-600">₹{(earning.netAmount / 1000).toFixed(0)}k</p>
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

            {last7DaysTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No transactions yet</h3>
                <p className="text-sm text-slate-500 mb-4 max-w-md mx-auto">
                  {selectedPeriod === "today"
                    ? "No earnings recorded for today. Your transactions will appear here once you receive payments."
                    : selectedPeriod === "week"
                      ? "No transactions found for this week. Check back later or try a different time period."
                      : selectedPeriod === "month"
                        ? "No transactions recorded for this month. Your monthly earnings will show up here."
                        : `No transactions available for the selected ${selectedPeriod} period.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPeriod("overall")}
                    className="rounded-lg"
                  >
                    View All Time
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
  )
}
