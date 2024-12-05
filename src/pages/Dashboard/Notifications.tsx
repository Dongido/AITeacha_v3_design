import React, { useEffect, useState } from "react";
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
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);
  return (
    <div className="mt-8">
      {userDetails && isEmailVerified === 1 && (
        <div className="bg-yellow-100 mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center">
          <span className="text-center">Teachers Are Heroes🎉</span>
        </div>
      )}
      <h2 className="text-xl font-medium text-gray-900">Notifications 🔔</h2>
      {loading ? (
        <div className="w-full  mt-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-4">
              <Skeleton className="h-24 w-full mb-2" />
              <Skeleton className="h-8 w-full mb-1" />
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-lg text-red-500">Error: {error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-lg text-center text-gray-700 mt-4">
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
                {notification.subject}
              </h3>
              <p
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{ __html: notification.description }}
              />

              <p className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
