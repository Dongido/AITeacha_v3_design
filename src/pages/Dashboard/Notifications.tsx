import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadUserNotifications } from "../../store/slices/notificationsSlice";
import { Skeleton } from "../../components/ui/Skeleton";
const Notifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading, error } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(loadUserNotifications());
  }, [dispatch]);

  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-900">
        Welcome Back! 👋 View Notifications
      </h2>

      {loading ? (
        <div className="w-full max-w-md mt-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-lg text-red-500">Error: {error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-lg text-gray-500 mt-4">
          Oops! No notifications found.
        </p>
      ) : (
        <ul className="w-full max-w-md mt-6">
          {notifications.map((notification: any) => (
            <li
              key={notification.id}
              className="p-4 mb-4 bg-gray-100 border border-gray-200 rounded-md shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {notification.title}
              </h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
