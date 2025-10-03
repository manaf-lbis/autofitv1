import { Star, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
}

interface Prop {
  recentReviews: Review[] | null;
}

const RecentReviews: React.FC<Prop> = ({ recentReviews }) => {
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  if (!recentReviews || recentReviews.length === 0) {
    return (
      <div className="w-full lg:w-80 mt-6 lg:mt-0">
        <div className="bg-white rounded-xl lg:rounded-none shadow-sm lg:shadow-none lg:border-r border-gray-200 h-full">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="font-semibold text-lg text-gray-900">
                Recent Reviews
              </h2>
            </div>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No reviews yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 mt-6 lg:mt-0">
      <div className="bg-white rounded-xl lg:rounded-none shadow-sm lg:shadow-none lg:border-r border-gray-200 flex flex-col h-[500px] lg:h-screen">
        {/* Header - Fixed */}
        <div className="p-4 lg:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-lg text-gray-900">
                Recent Reviews
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {recentReviews.length} {recentReviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
          <div className="p-4 space-y-3">
            <style>{`
              .scrollbar-thin::-webkit-scrollbar {
                width: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: transparent;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 10px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
            `}</style>
            {recentReviews.slice(0, 10).map((review) => {
              const isExpanded = expandedReviews.has(review.id);
              const shouldTruncate = review.comment.length > 120;
              
              return (
                <div
                  key={review.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {review.reviewerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {review.rating}
                      </span>
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    {isExpanded ? review.comment : truncateText(review.comment)}
                  </p>

                  {/* Show More/Less Button */}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-medium transition-colors group"
                    >
                      <span>{isExpanded ? "Show less" : "Read more"}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentReviews;