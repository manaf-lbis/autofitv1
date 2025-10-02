import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ReviewItem, Review } from "./ReviewItem"
import { RatingStars } from "./RatingStar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LazyImage from "../LazyImage"

type Mechanic = {
  id: string
  name: string
  avatarUrl: string
  averageRating: number
  reviewsCount?: number
}

type ReviewsResponse = {
  reviews: Review[]
  hasMore: boolean
  nextPage: number | null
  totalCount: number
  averageRating: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function InfoButton(props: React.ComponentProps<"button">) {
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="View reviews"
      {...props}
      className={cn("rounded-full border bg-card hover:bg-accent", props.className)}
      onClick={(e) => {
        e.stopPropagation() 
        if (props.onClick) props.onClick(e)
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={cn("text-foreground", props.className)}
      >
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 10v6m0-8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </Button>
  )
}

export function ReviewListingModal({
  mechanic,
  triggerClassName,
  children,
}: {
  mechanic: Mechanic
  triggerClassName?: string
  children?: React.ReactNode
}) {
  const [sort, setSort] = React.useState<"all" | "top" | "least">("all")
  const [isChangingSort, setIsChangingSort] = React.useState(false)
  const [data, setData] = React.useState<ReviewsResponse[]>([])
  const [error, setError] = React.useState<Error | null>(null)
  const [page, setPage] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)

  const pageSize = 8

  const fetchReviews = React.useCallback(
    async (pageIndex: number, reset: boolean = false) => {
      setIsLoading(true)
      try {
        const url = `/api/reviews?mechanicId=${encodeURIComponent(mechanic.id)}&page=${pageIndex}&pageSize=${pageSize}&sort=${sort}`
        const response = await fetcher(url)
        setData((prev) => (reset ? [response] : [...prev, response]))
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load reviews"))
      } finally {
        setIsLoading(false)
      }
    },
    [mechanic.id, sort]
  )

  React.useEffect(() => {
    setIsChangingSort(true)
    setPage(1)
    fetchReviews(1, true)
  }, [sort, fetchReviews])

  const allReviews = React.useMemo(() => (data ? data.flatMap((d: any) => d.reviews) : []), [data])

  const overallAverage = data?.[0]?.averageRating ?? mechanic.averageRating
  const totalCount = data?.[0]?.totalCount ?? mechanic.reviewsCount ?? 0
  const hasMore = data?.[data.length - 1]?.hasMore ?? true

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (isChangingSort && data && data.length > 0) {
      setIsChangingSort(false)
    }
  }, [data, isChangingSort])

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "auto" })
    }
  }, [sort])

  const isInitialLoading = !data && !error
  const isFirstPageLoading = isLoading && page === 1 && allReviews.length === 0
  const showOverlayLoading = isInitialLoading || isChangingSort || isFirstPageLoading

  React.useEffect(() => {
    if (!sentinelRef.current) return
    const el = sentinelRef.current
    let ticking = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isLoading && !error) {
          if (!ticking) {
            ticking = true
            setPage((prev) => {
              const nextPage = prev + 1
              fetchReviews(nextPage)
              return nextPage
            })
            ticking = false
          }
        }
      },
      {
        root: scrollAreaRef.current,
        rootMargin: "120px",
        threshold: 0,
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, isLoading, error, fetchReviews])

  return (
    <Dialog>
      <DialogTrigger asChild>{children ? children : <InfoButton className={triggerClassName} />}</DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden border bg-card",
          "flex flex-col",
          // Mobile bottom sheet (only on small screens)
          "fixed inset-x-0 bottom-0 top-auto w-screen max-w-none h-[75vh] max-h-[75vh] rounded-t-2xl translate-x-0 translate-y-0",
          // Revert to centered dialog on md and up
          "md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-2xl md:h-auto md:max-h-[80vh] md:rounded-2xl md:-translate-x-1/2 md:-translate-y-1/2"
        )}
        aria-label="Mechanic reviews"
      >
        <DialogHeader className="px-4 sm:px-5 pt-3 sm:pt-4">
          <DialogTitle className="sr-only">Reviews</DialogTitle>
          <DialogDescription className="sr-only">Customer ratings and feedback for the mechanic.</DialogDescription>
        </DialogHeader>

        {/* Header block */}
        <div className="px-4 sm:px-5 pb-2 sm:pb-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
              <Avatar className="size-10 sm:size-12">
                <LazyImage publicId={mechanic.avatarUrl} resourceType="image" alt="Avatar" />
              </Avatar>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold text-foreground text-pretty truncate">
                  {mechanic.name}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <div className="shrink-0">
                    <RatingStars rating={overallAverage} />
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    {totalCount ? `(${totalCount} ${totalCount === 1 ? "review" : "reviews"})` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Sort control */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Sort</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8">
                    {sort === "all" ? "All" : sort === "top" ? "Top rated" : "Least rated"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem
                    onClick={() => {
                      if (sort !== "all") {
                        setIsChangingSort(true)
                        setSort("all")
                      }
                    }}
                    aria-checked={sort === "all"}
                    role="menuitemradio"
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (sort !== "top") {
                        setIsChangingSort(true)
                        setSort("top")
                      }
                    }}
                    aria-checked={sort === "top"}
                    role="menuitemradio"
                  >
                    Top rated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      if (sort !== "least") {
                        setIsChangingSort(true)
                        setSort("least")
                      }
                    }}
                    aria-checked={sort === "least"}
                    role="menuitemradio"
                  >
                    Least rated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-border" />

        <div
          ref={scrollAreaRef}
          className="relative flex-1 min-h-0 overflow-auto px-4 sm:px-5 py-3 sm:py-4"
          aria-label="Reviews list"
          aria-busy={showOverlayLoading ? "true" : "false"}
        >
          {showOverlayLoading && (
            <div
              className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px] flex items-center justify-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg
                  className="animate-spin text-muted-foreground"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
                Loading reviews…
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {allReviews.map((rev: any) => (
              <ReviewItem key={rev.id} review={rev} />
            ))}
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-center">
            {error ? (
              <p className="text-sm text-destructive">Failed to load reviews.</p>
            ) : isLoading && allReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading reviews…</p>
            ) : null}
          </div>

          {/* The sentinel must be inside the scrolling container */}
          <div ref={sentinelRef} aria-hidden className="h-2" />

          {hasMore && (
            <div className="mt-2 flex items-center justify-center">
              <Button variant="secondary" onClick={() => fetchReviews(page + 1)} disabled={isLoading}>
                {isLoading ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}