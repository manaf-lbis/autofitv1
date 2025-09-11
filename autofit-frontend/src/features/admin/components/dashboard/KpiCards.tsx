import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Wrench, WrenchIcon, CalendarDays } from "lucide-react"

export function KpiCards({
  users,
  activeUsers,
  mechanics,
  activeMechanics,
  todayCount,
}: {
  users: number
  activeUsers: number
  mechanics: number
  activeMechanics: number
  todayCount?: number
}) {
  const items = [
    { title: "Users", value: users.toLocaleString(), icon: Users },
    { title: "Active Users", value: activeUsers.toLocaleString(), icon: UserCheck },
    { title: "Mechanics", value: mechanics.toLocaleString(), icon: Wrench },
    { title: "Active Mechanics", value: activeMechanics.toLocaleString(), icon: WrenchIcon },
  ]
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((i) => (
        <Card key={i.title} className="border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs sm:text-sm text-foreground/70">{i.title}</CardTitle>
            <i.icon className="h-4 w-4 text-blue-600" aria-hidden />
          </CardHeader>
          <CardContent className="p-3">
            <div className="text-xl font-semibold sm:text-2xl">{i.value}</div>
          </CardContent>
        </Card>
      ))}

      {typeof todayCount === "number" && (
        <Card className="sm:col-span-2 lg:col-span-4 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
            <CardTitle className="text-xs sm:text-sm text-foreground/70">Today&apos;s Bookings</CardTitle>
            <CalendarDays className="h-4 w-4 text-blue-600" aria-hidden />
          </CardHeader>
          <CardContent className="p-3">
            <div className="text-base sm:text-lg font-medium">{todayCount} bookings today</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}