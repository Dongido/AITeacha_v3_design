import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  loadTeamMembers,
  inviteTeamMemberThunk,
} from "../../store/slices/teamSlice";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import BaseTable from "../../components/table/BaseTable";
import { teamColumns } from "./_components/column.team";

import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "../../components/ui/Toast";
import GeneralRestrictedPage from "./_components/GeneralRestrictedPage";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const dispatch = useAppDispatch();
  const { members, loading, error, inviteLoading, inviteError } =
    useAppSelector((state) => state.team);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [showToast, setShowToast] = useState(false);
  const [isInviteAttempted, setIsInviteAttempted] = useState(false);
  useEffect(() => {
    dispatch(loadTeamMembers());
  }, [dispatch]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  useEffect(() => {
    if (inviteError && isInviteAttempted) {
      setShowToast(true);
    }
  }, [inviteError, isInviteAttempted]);

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  const handleInvite = async () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsInviteAttempted(true);
    await dispatch(inviteTeamMemberThunk(email)).then(() => {
      setEmail("");
    });
    dispatch(loadTeamMembers());
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

  return (
    <ToastProvider>
      <div className="mt-4">
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

        <div className="flex items-center gap-2 my-8">
          <Input
            type="email"
            placeholder="Enter email to invite"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full py-3"
          />
          <Button
            onClick={handleInvite}
            disabled={inviteLoading}
            variant={"gradient"}
            className={`px-4 py-3 rounded-md  ${
              inviteLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {inviteLoading ? "Inviting..." : "Invite"}
          </Button>
        </div>

        <BaseTable data={members} columns={teamColumns} />
      </div>

      {showToast && (
        <Toast
          variant="destructive"
          onOpenChange={(isOpen) => {
            if (!isOpen) setShowToast(false);
          }}
        >
          <ToastTitle>Invitation Failed</ToastTitle>
          <ToastDescription>{inviteError}</ToastDescription>
          <ToastClose />
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
};

export default Team;
