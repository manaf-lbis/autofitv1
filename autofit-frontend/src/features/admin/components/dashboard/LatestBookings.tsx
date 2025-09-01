import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock3, Receipt } from "lucide-react"

type Latest = {
  id: string
  customer: string
  service: string
  date: string
  amount: number
  status: string
}


export function LatestBookings({ items }: { items: Latest[] }) {
  return (
    <Card className="h-full border-blue-100/60 dark:border-blue-900/40">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-blue-600" aria-hidden />
          <CardTitle className="text-sm sm:text-base">Latest Bookings</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/30 p-2">
          <ul className="space-y-2">
            {items.map((b) => (
              <li key={b.id} className="flex items-center justify-between rounded-md bg-background p-2 shadow-sm">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium">{b.customer}</p>
                  <p className="truncate text-xs text-foreground/60">{b.service}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-foreground/60">
                    <Clock3 className="h-3 w-3 text-blue-600" aria-hidden />
                    <span>
                      {new Date(b.date).toLocaleDateString(undefined, {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-semibold">₹{b.amount.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}