import { cn } from "@/lib/utils"
import { DashboardRange } from "@/services/adminServices/adminApi" 



export function RangeToggle({
  value,
  onChange,
  className,
}: {
  value: DashboardRange
  onChange: (next: DashboardRange) => void
  className?: string
}) {
  const options: DashboardRange[] = Object.values(DashboardRange)
  return (
    <div
      className={cn(
        "inline-flex rounded-md border bg-background p-0.5",
        "border-blue-200/60 dark:border-blue-900/40",
        className,
      )}
      role="tablist"
      aria-label="Select range"
    >
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt)}
            className={cn(
              "px-2 py-1 text-xs sm:text-sm capitalize transition-colors rounded-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60",
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-foreground/70 hover:bg-blue-50 hover:text-foreground dark:hover:bg-blue-950/40",
            )}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}







import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

interface DateRange {
  from: Date
  to: Date
}

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "LLL dd, y")} - {format(value.to, "LLL dd, y")}
                </>
              ) : (
                format(value.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={{ from: value?.from, to: value?.to }}
            onSelect={(selected) => {
              if (selected?.from && selected?.to) {
                onChange({ from: selected.from, to: selected.to })
                setOpen(false)
              }
            }}
            numberOfMonths={2}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")} 
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}