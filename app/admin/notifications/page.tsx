"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Simulating fetching data (replace this with an actual API call)
        const response = await new Promise<Notification[]>((resolve) =>
          setTimeout(() => {
            resolve([
              {
                id: "1",
                title: "Notification 1",
                message: "This is a message",
                type: "info",
                isRead: false,
                createdAt: new Date().toString(),
              },
              {
                id: "2",
                title: "Notification 2",
                message: "This is another message",
                type: "warning",
                isRead: false,
                createdAt: new Date().toString(),
              },
            ]);
          }, 1000)
        );
        setNotifications(response);
      } catch (err) {
        setError("Failed to load notifications");
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
    toast.success("Notification marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    toast.success("Notification deleted");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
    toast.success("All notifications marked as read");
  };

  const handleDeleteAll = () => {
    setNotifications([]);
    toast.success("All notifications deleted");
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2">
          <BellRing className="h-8 w-8 text-gray-700 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        </div>
        <div className="flex items-center justify-start mt-8">
          <div className="mb-4 space-x-4">
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Mark All as Read
            </Button>
            <Button variant="outline" onClick={handleDeleteAll}>
              Delete All
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {notifications.length === 0
            ? // Show skeletons while loading
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonNotification key={index} />
              ))
            : notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const typeColors = {
    info: "bg-blue-100 dark:bg-blue-900/10 border-blue-200 dark:border-blue-700/10",
    warning: "bg-yellow-100 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-700/10",
    success: "bg-green-100 dark:bg-green-900/10 border-green-200 dark:border-green-700/10",
    error: "bg-red-100 dark:bg-red-900/10 border-red-200 dark:border-red-700/10",
  };

  return (
    <div
      className={cn(
        "p-4 border rounded-lg",
        typeColors[notification.type],
        !notification.isRead && "font-semibold"
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{notification.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-100">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!notification.isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Badge
        variant={
          notification.type === "info" || notification.type === "success"
            ? "default"
            : notification.type === "warning"
            ? "secondary"
            : "destructive"
        }
        className="mt-2"
      >
        {notification.type}
      </Badge>
    </div>
  );
}

function SkeletonNotification() {
  return (
    <div className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt: string;
};
