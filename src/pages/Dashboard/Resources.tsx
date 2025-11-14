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
import GeneralRestrictedPage from "./_components/GeneralRestrictedPage";
import { Input } from "../../components/ui/Input";

const Resources = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>(""); // ✅ Search state
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const { resources, loading, error } = useAppSelector(
    (state: RootState) => state.teamResources
  );

  const shareDialogRef = useRef<any>(null);

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

  const openShareDialog = () => {
    shareDialogRef.current.openDialog();
  };

  // ✅ Filter resources by title
  const filteredResources = resources.filter((resource: any) => {
    if (!searchTerm.trim()) return true; // show all if empty
    return resource.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // ------------------------
  // Loading State
  // ------------------------
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

  // ------------------------
  // Restricted/Error Handling
  // ------------------------
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

  // ------------------------
  // MAIN RETURN
  // ------------------------
  return (
    <div className="mt-4 p-4 md:p-[30px] ">
      <div className="flex justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold m-0">Resources</h1>
          <p className="text-sm text-gray-800">View all resources</p>
        </div>
        <Button
          className="rounded-md"
          variant={"gradient"}
          onClick={() => openShareDialog()}
        >
          Share Resource
        </Button>
      </div>

      <div className="bg-white rounded-3xl p-4">
        {/* ✅ Search Field */}
        <div className="mb-5">
          <Input
            type="text"
            placeholder="Search resources by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-3 w-full bg-gray-100 md:w-[300px]"
          />
        </div>

        {/* ✅ Filtered Results */}
        <BaseTable data={filteredResources} columns={sharedResourceColumns} />
      </div>

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
