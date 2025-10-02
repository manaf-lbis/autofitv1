import * as React from "react"
import { RatingStars } from "./RatingStar"
import { cn } from "@/lib/utils"

export type Review = {
  id: string
  customerName: string
  rating: number
  comment?: string | null
  dateISO: string
}

const MAX_CHARS = 160

export function ReviewItem({
  review,
  className,
}: {
  review: Review
  className?: string
}) {
  const [expanded, setExpanded] = React.useState(false)
  const commentText = review.comment ?? ""
  const tooLong = commentText.length > MAX_CHARS
  const visibleText = expanded ? commentText : commentText.slice(0, MAX_CHARS)

  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-3 sm:p-4 shadow-sm transition hover:shadow-md",
        className,
      )}
      aria-label={`Review by ${review.customerName}`}
    >
      <header className="min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-medium text-foreground text-pretty truncate">{review.customerName}</h3>
          <p className="text-xs text-muted-foreground">{new Date(review.dateISO).toLocaleDateString()}</p>
        </div>
        <div className="shrink-0 mt-1 sm:mt-0">
          <RatingStars rating={review.rating} size={16} aria-label={`Rated ${review.rating} stars`} />
        </div>
      </header>

      {commentText ? (
        <>
          <p id={`review-${review.id}-content`} className="mt-2 sm:mt-3 text-sm leading-relaxed text-foreground/90">
            {visibleText}
            {tooLong && !expanded ? "…" : ""}
          </p>

          {tooLong && (
            <div className="mt-1.5">
              <button
                type="button"
                onClick={() => setExpanded((s) => !s)}
                className="text-sm font-medium text-primary hover:underline"
                aria-expanded={expanded}
                aria-controls={`review-${review.id}-content`}
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            </div>
          )}
        </>
      ) : null}
    </article>
  )
}
