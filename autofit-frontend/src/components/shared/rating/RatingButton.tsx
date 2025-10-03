import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RatingReviewModal } from "./RatingReviewModal"
import { cn } from "@/lib/utils"
import { useReviewMutation } from "@/services/userServices/profileApi"
import { ServiceType } from "@/types/user"

interface RatingButtonProps {
    serviceId: string
    serviceType: ServiceType
    hasRated?: boolean
    userRating?: number
    userReview?: string
    serviceName?: string
    className?: string
    variant?: "default" | "outline" | "ghost"
    size?: "sm" | "md" | "lg" | 'xs'
    displayStyle?: "stars" | "single-star"
    refetch?: () => void
}

export function RatingButton({
    serviceId,
    serviceType,
    hasRated = false,
    userRating,
    userReview,
    serviceName = "Auto Service",
    className,
    variant = "default",
    size = "md",
    displayStyle = "stars",
    refetch
}: RatingButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
 
    const [createReview] = useReviewMutation()

    const handleSubmit = async (rating: number, review: string) => {
        try {
            await createReview({ rating, review, serviceId, serviceType })
            if (refetch) refetch()
        } catch (error) {
            console.error("Error submitting rating:", error)
        }
    }



    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => {
            const isFull = rating >= i + 1

            return (
                <Star
                    key={i}
                    className={cn(
                        "h-3 w-3 sm:h-4 sm:w-4 transition-all duration-300",
                        isFull ? "fill-yellow-400 text-yellow-500" : "fill-gray-200 text-gray-300",
                    )}
                />
            )
        })
    }

    const renderSingleStar = () => {
        return <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-500 drop-shadow-sm" />
    }

    const sizeClasses = {
        sm: "h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
        md: "h-9 sm:h-11 px-3 sm:px-4 text-sm",
        lg: "h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base",
        xs: "h-6 sm:h-7 px-2 sm:px-3 text-xs sm:text-sm",
    }

    if (hasRated && userRating) {
        if (displayStyle === "single-star") {
            return (
                <>
                    <Button
                        variant="ghost"
                        onClick={() => setIsModalOpen(true)}
                        className={cn(
                            "transition-all duration-300 hover:scale-105 active:scale-95 gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 h-auto",
                            "bg-white/80 backdrop-blur-sm border border-yellow-200/60 rounded-md shadow-sm",
                            "hover:bg-yellow-50/80 hover:border-yellow-300/60 hover:shadow-md",
                            "relative overflow-hidden",
                            className,
                        )}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                        <div className="flex items-center gap-1.5 sm:gap-2 relative z-10">
                            {renderSingleStar()}
                            <span className="text-xs sm:text-sm  text-gray-700">{userRating}</span>
                        </div>
                    </Button>

                    <RatingReviewModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        existingRating={userRating}
                        existingReview={userReview}
                        serviceName={serviceName}
                        serviceId={serviceId}
                        serviceType={serviceType}
                        onSubmit={handleSubmit}
                    />
                </>
            )
        }

        return (
            <>
                <Button
                    variant="ghost"
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105 active:scale-95 group",
                        "bg-white/80 backdrop-blur-sm border border-yellow-200/60 rounded-md p-2 sm:p-3 shadow-sm",
                        "hover:bg-yellow-50/80 hover:border-yellow-300/60 hover:shadow-md",
                        "relative overflow-hidden",
                        className,
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                    <div className="flex items-center gap-0.5 sm:gap-1 group-hover:scale-110 transition-transform duration-300 relative z-10">
                        {renderStars(userRating!)}
                    </div>
                </Button>

                <RatingReviewModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    existingRating={userRating}
                    existingReview={userReview}
                    serviceName={serviceName}
                    serviceId={serviceId}
                    serviceType={serviceType}
                    onSubmit={handleSubmit}
                />
            </>
        )
    }

    return (
        <>
            <Button
                variant={variant}
                onClick={() => setIsModalOpen(true)}
                className={cn(
                    "gap-2 sm:gap-3 transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden",
                    "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl rounded-md border-0",
                    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/30 before:to-white/0",
                    "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700",
                    displayStyle === "single-star" ? "p-2 sm:p-3" : sizeClasses[size],
                    className,
                )}
            >
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-200 text-yellow-200 group-hover:fill-white group-hover:text-white transition-all duration-300 relative z-10" />
                {displayStyle !== "single-star" && <span className="relative z-10 text-sm sm:text-base">Rate Service</span>}
            </Button>

            <RatingReviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                serviceName={serviceName}
                serviceId={serviceId}
                serviceType={serviceType}
                onSubmit={handleSubmit}
            />
        </>
    )
}
