import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  X,
  MessageSquare,
  UserPlus,
  Heart,
  Share2,
  Calendar,
} from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "message",
    title: "New message from Sarah",
    description: "Sarah sent you a message about the study group",
    time: "5 minutes ago",
    read: false,
    icon: MessageSquare,
  },
  {
    id: 2,
    type: "friend",
    title: "Friend request",
    description: "John Smith wants to be your friend",
    time: "1 hour ago",
    read: false,
    icon: UserPlus,
  },
  {
    id: 3,
    type: "like",
    title: "New like on your post",
    description: "Michael Chen and 5 others liked your post",
    time: "2 hours ago",
    read: true,
    icon: Heart,
  },
  {
    id: 4,
    type: "event",
    title: "Event reminder",
    description: "Campus Tech Fair starts in 2 days",
    time: "3 hours ago",
    read: false,
    icon: Calendar,
  },
  {
    id: 5,
    type: "share",
    title: "Your post was shared",
    description: "Emily Davis shared your post about the study group",
    time: "5 hours ago",
    read: true,
    icon: Share2,
  },
  {
    id: 6,
    type: "message",
    title: "New message from Study Group",
    description: "New message in the Computer Science Club group",
    time: "1 day ago",
    read: true,
    icon: MessageSquare,
  },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifs(notifs.filter((n) => n.id !== id));
  };

  const filteredNotifs =
    filter === "all"
      ? notifs
      : filter === "unread"
        ? notifs.filter((n) => !n.read)
        : notifs.filter((n) => n.type === filter);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600">
                {unreadCount > 0
                  ? `${unreadCount} unread notifications`
                  : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="btn-secondary flex items-center gap-2"
            >
              <Check className="w-5 h-5" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          All ({notifs.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("message")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "message"
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setFilter("friend")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "friend"
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Friends
        </button>
      </div>

      {/* Notifications List */}
      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
      >
        {filteredNotifs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications found</p>
          </motion.div>
        ) : (
          filteredNotifs.map((notification) => {
            const Icon = notification.icon;
            return (
              <motion.div
                key={notification.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ scale: 1.01 }}
                className={`card flex items-start gap-4 hover:shadow-lg transition-shadow ${
                  !notification.read
                    ? "bg-primary-50 border-l-4 border-primary-600"
                    : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === "message"
                      ? "bg-blue-100"
                      : notification.type === "friend"
                        ? "bg-green-100"
                        : notification.type === "like"
                          ? "bg-red-100"
                          : notification.type === "event"
                            ? "bg-primary-100"
                            : "bg-gray-100"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      notification.type === "message"
                        ? "text-blue-600"
                        : notification.type === "friend"
                          ? "text-green-600"
                          : notification.type === "like"
                            ? "text-red-600"
                            : notification.type === "event"
                              ? "text-primary"
                              : "text-gray-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.description}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {notification.time}
                    </span>
                    <div className="flex items-center gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Delete"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
} 
