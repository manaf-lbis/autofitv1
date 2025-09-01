import { cn } from "@/lib/utils"

type Range = "day" | "month" | "year"

export function RangeToggle({
  value,
  onChange,
  className,
}: {
  value: Range
  onChange: (next: Range) => void
  className?: string
}) {
  const options: Range[] = ["day", "month", "year"]
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