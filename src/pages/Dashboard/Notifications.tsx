const Notifications = () => {
  const hasNotifications = false;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-medium text-gray-900 ">
        Welcome Back! 👋 View Notifications
      </h2>
      <div className="flex flex-col items-center justify-center h-screen">
        {!hasNotifications && (
          <p className="text-lg -mt-20 text-gray-500 ">
            Oops! No notifications found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
