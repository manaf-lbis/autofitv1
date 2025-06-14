import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import React from "react";

export const useNotification = () => {
  const notify = (sender: string, message: string, datetime: string) => {
    toast.custom((t) => (
      <div className="flex items-start justify-between gap-3 bg-green-50 border border-green-300 rounded-md px-4 py-2 shadow-sm w-[300px]">
        <div className="flex flex-col flex-grow text-sm text-gray-800">
          {/* Header */}
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-green-800 uppercase text-xs">
              {sender}
            </span>
            <span className="text-[11px] text-gray-500">{datetime}</span>
          </div>

          {/* Message preview */}
          <div className="text-gray-600 text-sm truncate max-w-[240px] leading-tight">
            {message}
          </div>
        </div>

        {/* Close icon */}
        <X
          className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-500 shrink-0 mt-1"
         onClick={(e) => {
            e.stopPropagation(); 
            toast.dismiss(t.id);
          }}
        />
      </div>
    ), {
      position: "top-right",
      duration: 3000,
    });
  };

  return notify;
};

