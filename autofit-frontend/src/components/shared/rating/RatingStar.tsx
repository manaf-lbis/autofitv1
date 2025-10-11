import { cn } from "@/lib/utils"

type RatingStarsProps = {
  rating: number 
  size?: number
  className?: string
  "aria-label"?: string
}

const STAR_PATH =
  "M10 1.5l2.472 5.006 5.528.804-4 3.898.944 5.508L10 13.75 5.056 16.716 6 11.208l-4-3.898 5.528-.804L10 1.5z"

export function RatingStars({ rating, size = 18, className, ...rest }: RatingStarsProps) {
  const percentage = Math.max(0, Math.min(100, (rating / 5) * 100))
  const gapPx = 4
  const totalGapWidth = gapPx * 4
  const totalWidth = size * 5 + totalGapWidth

  return (
    <div
      className={cn("inline-flex items-center whitespace-nowrap shrink-0", className)}
      role="img"
      aria-label={rest["aria-label"] ?? `Rating: ${rating?.toFixed(1) || 0} out of 5`}
      title={`${rating?.toFixed(1) || 0} / 5`}
    >
      <div className="relative inline-block align-middle" style={{ width: totalWidth, height: size }}>
        <div className="absolute inset-0 flex gap-1 text-muted-foreground/40 pointer-events-none">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className="shrink-0">
              <path d={STAR_PATH} fill="currentColor" />
            </svg>
          ))}
        </div>
        <div
          className="absolute inset-0 flex gap-1 text-chart-4 overflow-hidden pointer-events-none"
          style={{ width: `${percentage}%` }}
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} viewBox="0 0 20 20" width={size} height={size} className="shrink-0">
              <path d={STAR_PATH} fill="currentColor" />
            </svg>
          ))}
        </div>
      </div>
      <span className="ml-2 shrink-0 text-xs sm:text-sm text-muted-foreground">{rating?.toFixed(1) || 0}</span>
    </div>
  )
}
