import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/Button";
import BaseTable from "../../../components/table/BaseTable";
import { notificationColumns } from "./components/column.admin.notification";
import AddAdminNotificationDialog from "./components/AddNotificationDialog";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getNotification } from "../../../store/slices/notificationsSlice";
import { useAppSelector } from "../../../store/hooks";
import AddNotificationEditDialog from "./components/AddNotificationEditModal";
import GeneralRestrictedPage from "../_components/GeneralRestrictedPage";
import { Skeleton } from "../../../components/ui/Skeleton";



const Notification: React.FC = () => {
  const addResourceDialogRef = useRef<{ openDialog: () => void }>(null);
  const dispatch = useDispatch<AppDispatch>()
  const [editModal, seteditModal] = useState(false)
  const { notificationList, error, isloading, notification } = useAppSelector(
    (state: RootState) => state.notifications
  );
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  // console.log("isloading", isloading)

  //  console.log(notificationList , "notification response")
  const handleAddResourceClick = () => {
    addResourceDialogRef.current?.openDialog();
  };

  useEffect(() => {
    dispatch(getNotification())
  }, [])

  useEffect(() => {
  const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
  if (userDetailsFromStorage) {
  const parsedDetails = JSON.parse(userDetailsFromStorage);
  setUserDetails(parsedDetails);
  setIsEmailVerified(parsedDetails.is_email_verified);
  }
  
  }, [dispatch]);


  if (isloading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4 border-b">
                  <Skeleton className="h-4 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }


  if (
    error === "Permission restricted: upgrade to premium account to gain access"
  ) {
    return (
      <div>
    {userDetails && isEmailVerified === 1 && (
      <div
        className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      >
        <span className="text-center text-xl font-bold">
          Teachers Are Heroes🎉
        </span>
      </div>
    )}
        <GeneralRestrictedPage error={error} />
      </div>
    );
  }

   if (
    error === "Failed to fetch premium users"
  ) {
    return (
      <div>
    {userDetails && isEmailVerified === 1 && (
      <div
        className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
        style={{
          background:
            "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
        }}
      >
        <span className="text-center text-xl font-bold">
          Teachers Are Heroes🎉
        </span>
      </div>
    )}
        <GeneralRestrictedPage error={error} />
      </div>
    );
  }


  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Admin Notification</h1>
        <Button
          onClick={handleAddResourceClick}
          variant={"gradient"}
          className="rounded-full px-4 py-2  focus:ring-opacity-50"
        >
          Add New Notification
        </Button>
      </div>

      {!isloading ? (
        notificationList.length > 0 ? (
          <BaseTable columns={notificationColumns} data={notificationList} />
        ) : (
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg mb-4">
              No notification is available. Proceed to create notification.
            </p>
            <button
              onClick={handleAddResourceClick}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Create Notification
            </button>
          </div>
        )
      ) : null}


      <AddAdminNotificationDialog
        ref={addResourceDialogRef}
        onSuccess={() => {
          dispatch(getNotification());
        }}
      />


    </div>
  );
};

export default Notification;
