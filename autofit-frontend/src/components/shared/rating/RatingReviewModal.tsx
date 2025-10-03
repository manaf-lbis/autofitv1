import { useState } from "react"
import { Star, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface RatingReviewModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceType: string
  existingRating?: number
  existingReview?: string
  serviceName?: string
  onSubmit?: (rating: number, review: string) => void
}

export function RatingReviewModal({
  isOpen,
  onClose,
  serviceId,
  serviceType,
  existingRating,
  existingReview,
  serviceName = "Auto Service",
  onSubmit,
}: RatingReviewModalProps) {
  const [rating, setRating] = useState(existingRating || 0)
  const [review, setReview] = useState(existingReview || "")
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReviewExpanded, setIsReviewExpanded] = useState(false)

  const isViewOnly = !!existingRating

  const handleStarClick = (starIndex: number) => {
    if (isViewOnly) return
    const newRating = starIndex + 1
    setRating(newRating)
    setHoveredRating(0)
  }

  const handleStarHover = (starIndex: number) => {
    if (isViewOnly) return
    const newHoverRating = starIndex + 1
    setHoveredRating(newHoverRating)
  }

  const getStarFill = (starIndex: number) => {
    const currentRating = hoveredRating || rating
    return currentRating >= starIndex + 1 ? "full" : "empty"
  }

  const handleSubmit = async () => {
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await onSubmit?.(rating, review)
      onClose()
    } catch (error) {
      console.error("Error submitting rating:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingMessage = (rating: number) => {
    if (rating <= 1) return "We're truly sorry about your experience"
    if (rating <= 2) return "We'll work hard to improve your experience"
    if (rating <= 3) return "Thank you for your honest feedback"
    if (rating <= 4) return "We're glad you had a good experience"
    return "Fantastic! You've made our day!"
  }

  const shouldTruncateReview = existingReview && existingReview.length > 150
  const displayReview =
    shouldTruncateReview && !isReviewExpanded ? existingReview!.substring(0, 150) + "..." : existingReview

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "w-[92vw] max-w-xl mx-auto p-0 gap-0 max-h-[90vh] overflow-hidden",
          "rounded-lg border border-gray-200/60 shadow-2xl bg-white/95 backdrop-blur-sm",
          "animate-in fade-in-0 zoom-in-95 duration-300",
        )}
      >
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100/80 bg-white/80">
          <div className="text-center space-y-2 sm:space-y-3">
            <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 text-balance leading-tight">
              {isViewOnly ? "Your Rating & Review" : "Rate Your Experience"}
            </DialogTitle>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-sm sm:text-base font-medium text-gray-700">{serviceName}</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                  {serviceType}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 font-mono text-xs">ID: {serviceId}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center gap-2 mb-3 sm:mb-4">
              {Array.from({ length: 5 }, (_, i) => {
                const fillType = getStarFill(i)
                const currentRating = hoveredRating || rating
                const isActive = currentRating > i

                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isViewOnly}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    onMouseLeave={() => !isViewOnly && setHoveredRating(0)}
                    className={cn(
                      "relative transition-all duration-200 hover:scale-110 active:scale-95 p-2 rounded-lg",
                      !isViewOnly && "cursor-pointer",
                      "focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-1",
                      "disabled:cursor-default",
                      "min-w-[48px] min-h-[48px] sm:min-w-[52px] sm:min-h-[52px] flex items-center justify-center",
                      isActive && !isViewOnly && "bg-blue-50/80",
                      !isActive && !isViewOnly && "hover:bg-gray-50/80",
                    )}
                  >
                    <div className="relative">
                      <Star
                        className={cn(
                          "h-8 w-8 sm:h-9 sm:w-9 transition-all duration-200",
                          fillType === "empty"
                            ? "fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-300"
                            : "fill-yellow-400 text-yellow-500 drop-shadow-sm",
                        )}
                      />
                    </div>
                  </button>
                )
              })}
            </div>

            {(rating > 0 || existingRating) && (
              <div className="animate-in slide-in-from-bottom-2 fade-in duration-300 text-center space-y-2">
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {getRatingMessage(rating || existingRating || 0)}
                </p>
                <p className="text-sm sm:text-base text-yellow-600 font-medium">
                  {rating || existingRating || 0} out of 5 stars
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <label className="text-sm sm:text-base font-semibold block text-gray-800">
              {isViewOnly ? "Your Review" : "Tell us more (optional)"}
            </label>

            {isViewOnly ? (
              // View-only mode: Show existing review or "No review" message
              <div className="space-y-2 sm:space-y-3">
                {existingReview && existingReview.trim() ? (
                  <>
                    <div
                      className={cn(
                        "p-3 sm:p-4 bg-gray-50/80 rounded-lg border border-gray-200/60",
                        "text-gray-700 leading-relaxed text-sm sm:text-base",
                      )}
                    >
                      <p className="whitespace-pre-wrap">{displayReview}</p>
                    </div>
                    {shouldTruncateReview && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsReviewExpanded(!isReviewExpanded)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 h-auto text-sm rounded-md"
                      >
                        <span className="flex items-center gap-1">
                          {isReviewExpanded ? (
                            <>
                              Show Less <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </span>
                      </Button>
                    )}
                  </>
                ) : (
                  <div
                    className={cn(
                      "p-3 sm:p-4 bg-gray-50/80 rounded-lg border border-gray-200/60",
                      "text-gray-500 leading-relaxed text-sm sm:text-base italic text-center",
                    )}
                  >
                    No review provided
                  </div>
                )}
              </div>
            ) : (
              // Edit mode: Allow user to write review
              <div className="space-y-2 sm:space-y-3">
                <Textarea
                  placeholder="Share your experience with our service..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className={cn(
                    "min-h-[100px] sm:min-h-[120px] resize-none transition-all duration-200 text-sm sm:text-base",
                    "border-gray-200/80 rounded-lg bg-gray-50/50 focus:bg-white",
                    "focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300",
                    "placeholder:text-gray-400 text-gray-700 leading-relaxed",
                  )}
                  maxLength={500}
                />
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500">Help others by sharing your experience</span>
                  <span className={cn("font-medium", review.length > 450 ? "text-amber-600" : "text-gray-400")}>
                    {review.length}/500
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isViewOnly && (
            <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className={cn(
                  "flex-1 h-10 sm:h-12 transition-all duration-200 hover:scale-105 rounded-lg font-medium text-sm sm:text-base",
                  "border-gray-300/80 bg-white/80 hover:bg-gray-50/80 text-gray-700",
                  "shadow-sm hover:shadow-md",
                )}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={cn(
                  "flex-1 h-10 sm:h-12 transition-all duration-200 hover:scale-105 disabled:hover:scale-100",
                  "rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold text-white text-sm sm:text-base",
                  "disabled:bg-gray-400 shadow-lg hover:shadow-xl",
                  "relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/40 before:to-white/0",
                  "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
                )}
              >
                <span className="relative z-10">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <span>Submit Rating</span>
                  )}
                </span>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}