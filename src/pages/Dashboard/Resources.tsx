import React, { useEffect, useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import {
  loadResources,
  shareResourceThunk,
} from "../../store/slices/teamResourcesSlice";
import { RootState } from "../../store";
import ShareResourceDialog from "./_components/ShareResourceDialog";
import { Button } from "../../components/ui/Button";
import BaseTable from "../../components/table/BaseTable";
import { sharedResourceColumns } from "./_components/column.sharedresource";
import { Skeleton } from "../../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import RestrictedPage from "./classrooms/RestrictionPage";
const Resources = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const { resources, loading, error, shareResourceLoading } = useAppSelector(
    (state: RootState) => state.teamResources
  );

  useEffect(() => {
    dispatch(loadResources());
  }, [dispatch]);
  
  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  const shareDialogRef = useRef<any>(null);

  const openShareDialog = () => {
    shareDialogRef.current.openDialog();
  };

  if (loading) {
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
        <RestrictedPage error={error} />
      </div>
    );
  }

  if (error) {
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
            <button
              onClick={handleVerifyEmail}
              className="text-primary hover:underline"
            >
              Verify Email
            </button>
          </div>
        )}
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between mb-4">
        <h1>Resources</h1>
        <Button
          className="rounded-md"
          variant={"gradient"}
          onClick={() => openShareDialog()}
        >
          Share Resource
        </Button>
      </div>

      <BaseTable data={resources} columns={sharedResourceColumns} />

      <ShareResourceDialog
        ref={shareDialogRef}
        resourceName=""
        resourceId=""
        onSuccess={() => console.log("Resource shared!")}
      />
    </div>
  );
};

export default Resources;
