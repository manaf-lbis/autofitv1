import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RangeToggle } from "../components/dashboard/RangeToggle"
import { KpiCards } from "../components/dashboard/KpiCards"
import { BookingsArea } from "../components/dashboard/BookingArea"
import { EarningsPie } from "../components/dashboard/EarningsPie"
import { NetBreakdown } from "../components/dashboard/NetBreakdown"
import { BarChart3, PieChartIcon, TrendingUp, CalendarRange, ClipboardList } from "lucide-react"
import { LatestBookings } from "../components/dashboard/LatestBookings"
import { DashboardRange, useAdminDashboardQuery } from "@/services/adminServices/adminApi"
import { DashboardShimmer } from "../components/dashboard/DashboardShimer" 
import { DateRangePicker } from "../components/dashboard/RangeToggle"  
import { subDays, format } from "date-fns" 

const AdminDashboard = () => {
  const [range, setRange] = useState<DashboardRange>(DashboardRange.DAY)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 6),
    to: new Date(),
  })
  const queryParams = {
    range,
    ...(range === DashboardRange.CUSTOM
      ? { from: dateRange.from.toISOString(), to: dateRange.to.toISOString() }
      : {}),
  }
  const { data, isLoading } = useAdminDashboardQuery(queryParams)

  if (isLoading) return <DashboardShimmer />

  const displayRange = range === DashboardRange.CUSTOM
    ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
    : range

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-4 w-4 text-blue-600" aria-hidden />
          <h1 className="text-pretty text-lg font-semibold sm:text-xl">Operations Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <RangeToggle value={range} onChange={setRange} />
          {range === DashboardRange.CUSTOM && (
            <DateRangePicker value={dateRange} onChange={(range) => { if (range) setDateRange(range); }} />
          )}
        </div>
      </div>

      {data && (
        <KpiCards
          users={data.summary.users}
          activeUsers={data.summary.activeUsers}
          mechanics={data.summary.mechanics}
          activeMechanics={data.summary.activeMechanics}
          todayCount={data.summary.todayCount}
        />
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <Card className="lg:col-span-7 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" aria-hidden />
              <CardTitle className="text-sm sm:text-base">Bookings by Service</CardTitle>
            </div>
            <span className="text-xs text-foreground/60 capitalize">{displayRange}</span>
          </CardHeader>
          <CardContent className="p-3">{data && <BookingsArea data={data.series.bookingsByService} range={range} />}</CardContent>
        </Card>

        <Card className="lg:col-span-5 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4 text-blue-600" aria-hidden />
              <CardTitle className="text-sm sm:text-base">Revenue & Earnings (Company)</CardTitle>
            </div>
            <span className="text-xs text-foreground/60 capitalize">{displayRange}</span>
          </CardHeader>
          <CardContent className="p-3">{data && <EarningsPie data={data.series.earningsByService} />}</CardContent>
        </Card>

        <Card className="lg:col-span-7 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" aria-hidden />
              <CardTitle className="text-sm sm:text-base">Earnings Breakdown</CardTitle>
            </div>
            <span className="text-xs text-foreground/60 capitalize">{displayRange}</span>
          </CardHeader>
          <CardContent className="p-3">{data && <NetBreakdown data={data.series.net} />}</CardContent>
        </Card>

        <div className="lg:col-span-5">{data && <LatestBookings items={data.latestBookings} />}</div>
      </div>

      {data && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Card className="border-blue-100/60 dark:border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-blue-600" aria-hidden />
                <CardTitle className="text-sm sm:text-base">Total Bookings</CardTitle>
              </div>
              <span className="text-xs text-foreground/60 capitalize">{displayRange}</span>
            </CardHeader>
            <CardContent className="p-3">
              <p className="text-xl font-semibold sm:text-2xl">{data.summary.totalBookings.toLocaleString()}</p>
              <p className="text-xs text-foreground/60">
                Average order value ₹{data.summary.avgOrderValue.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="border-blue-100/60 dark:border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" aria-hidden />
                <CardTitle className="text-sm sm:text-base">Company Profit</CardTitle>
              </div>
              <span className="text-xs text-foreground/60 capitalize">{displayRange}</span>
            </CardHeader>
            <CardContent className="p-3">
              <p className="text-xl font-semibold sm:text-2xl">₹{data.series.net.deductions.toLocaleString()}</p>
              <p className="text-xs text-foreground/60">
                Revenue ₹{data.series.net.revenue.toLocaleString()} • Paid ₹{data.series.net.paid.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard