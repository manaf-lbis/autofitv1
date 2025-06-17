import { Button } from "@/components/ui/button";
import { Bell, X, User, Clock } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { initSocket } from "@/lib/socket";
import { useNotification } from "@/hooks/useNotification";
import { formatTimeToNow } from "@/lib/dateFormater";
import { useNotificationReadMutation } from "../api/mechanicApi";
import toast from "react-hot-toast";

interface Notification {
  _id: number;
  senderName?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationProps {
  notifications: Notification[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  const [localNotifications, setLocalNotifications] =
  useState<Notification[]>(notifications);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const socket = initSocket();
  const notify = useNotification();
  const [setRead] = useNotificationReadMutation();

  useEffect(() => {
    socket.on("notification", (data) => {
      notify("Notification", data.message, formatTimeToNow(data.createdAt));
      setLocalNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const unreadCount: number = localNotifications.filter(
    (n) => !n.isRead
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (unreadCount > 0) {
      try {
        await setRead({}).unwrap();
        setLocalNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-gray-50"
        aria-label="Notifications"
        onClick={toggleDropdown}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 md:w-80 lg:w-96 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
              Notifications
            </h3>
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-xs sm:text-sm text-gray-500">
                {unreadCount} new
              </span>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 sm:max-h-96 min-h-24 sm:min-h-32 overflow-y-auto">
            {localNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-gray-500">
                <Bell className="h-6 w-6 sm:h-8 sm:w-8 mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {localNotifications.map((notification: Notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 sm:p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors duration-150 ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {notification.senderName ? (
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                          ) : (
                            <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 sm:gap-2 mb-1">
                          <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                            {notification.senderName || "Service Notification"}
                          </p>
                          {!notification.isRead && (
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 sm:line-clamp-2 mb-1 leading-relaxed">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          <span className="text-xs">
                            {formatTimeToNow(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {localNotifications.length > 0 && (
            <div className="p-2 sm:p-3 border-t border-gray-100">
              <div className="flex justify-center text-xs sm:text-sm text-blue-600 py-2 sm:py-2.5">
                Latest Notifications
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
