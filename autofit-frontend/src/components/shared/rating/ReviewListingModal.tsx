import * as React from "react"
import { cn } from "@/lib/utils"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ReviewItem } from "./ReviewItem"
import { RatingStars } from "./RatingStar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import LazyImage from "../LazyImage"
import { useListReviewsQuery } from "@/services/userServices/profileApi"

type Mechanic = {
  id: string
  name: string
  avatarUrl: string
  averageRating: number
  reviewsCount?: number
}

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
  const [queryArgs, setQueryArgs] = React.useState<{ page: number; sort: "all" | "top" | "least"; resetId: number }>({ page: 1, sort: "all", resetId: 0 })
  const [isChangingSort, setIsChangingSort] = React.useState(false)

  const { data, error, isLoading, isFetching } = useListReviewsQuery(
    { ...queryArgs, mechanic: mechanic.id },
    {
      skip: !mechanic.id,
    }
  )

  const allReviews = React.useMemo(() => data?.reviews ?? [], [data?.reviews])
  const totalCount = data?.totalCount ?? mechanic.reviewsCount ?? 0
  const hasMore = data?.hasMore ?? false

  const sentinelRef = React.useRef<HTMLDivElement | null>(null)
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null)

  const handleSortChange = (newSort: "all" | "top" | "least") => {
    if (queryArgs.sort !== newSort) {
      setIsChangingSort(true)
      setQueryArgs((prev) => ({
        page: 1,
        sort: newSort,
        resetId: prev.resetId + 1
      }))
    }
  }

  React.useEffect(() => {
    if (isChangingSort && data && !isFetching) {
      setIsChangingSort(false)
    }
  }, [data, isChangingSort, isFetching])

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "auto" })
    }
  }, [queryArgs.sort])

  const isInitialLoading = isLoading && queryArgs.page === 1
  const isFirstPageLoading = isFetching && queryArgs.page === 1 && allReviews.length === 0
  const showOverlayLoading = isInitialLoading || isChangingSort || isFirstPageLoading

  React.useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    const el = sentinelRef.current
    let ticking = false

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isFetching && !error) {
          if (!ticking) {
            ticking = true
            setQueryArgs((prev) => ({ ...prev, page: prev.page + 1 }))
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
  }, [hasMore, isFetching, error, queryArgs.sort])

  const loadMore = () => {
    if (hasMore && !isFetching) {
      setQueryArgs((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children ? children : <InfoButton className={triggerClassName} />}</DialogTrigger>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden border bg-card",
          "flex flex-col",
          "fixed inset-x-0 bottom-0 top-auto w-screen max-w-none h-[75vh] max-h-[75vh] rounded-t-2xl translate-x-0 translate-y-0",
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
                    <RatingStars rating={mechanic.averageRating} />
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
                    {queryArgs.sort === "all" ? "All" : queryArgs.sort === "top" ? "Top rated" : "Least rated"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem
                    onClick={() => handleSortChange("all")}
                    aria-checked={queryArgs.sort === "all"}
                    role="menuitemradio"
                  >
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("top")}
                    aria-checked={queryArgs.sort === "top"}
                    role="menuitemradio"
                  >
                    Top rated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("least")}
                    aria-checked={queryArgs.sort === "least"}
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
            {allReviews.map((rev) => (
              <ReviewItem key={rev.id} review={{
                customerName: rev.customerName,
                dateISO: rev.createdAt,
                rating: rev.rating,
                comment: rev.review,
                id: rev.id
              }} />
            ))}
          </div>

          <div className="mt-3 sm:mt-4 flex items-center justify-center">
            {error ? (
              <p className="text-sm text-destructive">Failed to load reviews.</p>
            ) : isFetching && allReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Loading reviews…</p>
            ) : null}
          </div>

          <div ref={sentinelRef} aria-hidden className="h-2" />

          {hasMore && (
            <div className="mt-2 flex items-center justify-center">
              <Button variant="secondary" onClick={loadMore} disabled={isFetching}>
                {isFetching ? "Loading…" : "Load more"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}