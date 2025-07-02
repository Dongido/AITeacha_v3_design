import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  fetchSingleAdminUser,
  clearCurrentAdminUser,
} from "../../../store/slices/adminUserSlice";
import { Skeleton } from "../../../components/ui/Skeleton";

import { Button } from "../../../components/ui/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const AdminUserDetailsPage = () => {
  const { id: userId } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentAdminUser: user,
    loading,
    error,
  } = useSelector((state: RootState) => state.adminUser);

  useEffect(() => {
    if (userId) {
      dispatch(fetchSingleAdminUser(userId));
    }
    return () => {
      dispatch(clearCurrentAdminUser());
    };
  }, [dispatch, userId]);

  const getRoleName = (roleId: number | undefined) => {
    switch (roleId) {
      case 1:
        return "Educator";
      case 2:
        return "Admin";
      case 3:
        return "Student";
      default:
        return "Unknown Role";
    }
  };

  if (!userId) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-lg text-gray-700">
            No user ID provided in the URL. Please go back and select a user.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex items-center mb-6">
          <Button variant="ghost" className="mr-4 rounded-full p-2" disabled>
            <ArrowLeftIcon className="h-5 w-5 text-gray-400" />
          </Button>
          <Skeleton className="h-10 w-64 rounded-md" />
        </div>
        <div className="bg-white shadow-xl rounded-lg p-8 animate-pulse grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 flex flex-col items-center">
            <Skeleton className="h-32 w-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 rounded-md mb-2" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-24 w-full rounded-md col-span-full" />{" "}
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700">
            {error || "User not found or data not available."}
          </p>
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="mt-6 rounded-full p-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const avatarInitials = `${user.firstname ? user.firstname[0] : ""}${
    user.lastname ? user.lastname[0] : ""
  }`.toUpperCase();

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center mb-6">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="mr-4 rounded-full p-2 bg-white shadow-sm hover:bg-gray-100 transition-all"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
          User Profile
        </h1>
      </div>

      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-10 border border-gray-100 transform transition-all hover:scale-[1.005]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="col-span-1 flex flex-col items-center text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-inner">
            {user.imageurl ? (
              <img
                src={user.imageurl}
                alt={`${user.firstname} ${user.lastname}`}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-4 ring-2 ring-blue-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/112x112/A7BEE8/FFFFFF?text=${avatarInitials}`;
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white text-4xl font-bold border-4 border-white shadow-md mb-4 ring-2 ring-blue-300">
                {avatarInitials || "N/A"}
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900 mb-1 capitalize">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-lg text-indigo-700 font-medium capitalize">
              {getRoleName(user.role_id)}
            </p>
            {user.active_status && (
              <span
                className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full ${
                  user.active_status === "YES"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.active_status === "YES" ? "Active" : "Inactive"}
              </span>
            )}
          </div>

          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="col-span-full text-xl font-bold text-gray-800 border-b pb-2 mb-4">
              Contact Information
            </h3>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">
                Email:
              </span>
              <a
                href={`mailto:${user.email}`}
                className="text-blue-600 hover:underline"
              >
                {user.email}
              </a>
            </div>
            {user.phone && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Phone:
                </span>
                <a
                  href={`tel:${user.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {user.phone}
                </a>
              </div>
            )}
            {user.organization && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Organization:
                </span>
                <span>{user.organization}</span>
              </div>
            )}
            {user.country && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Country:
                </span>
                <span>{user.country}</span>
              </div>
            )}
            {user.city && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  City:
                </span>
                <span>{user.city}</span>
              </div>
            )}
          </div>
          <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="col-span-full text-xl font-bold text-gray-800 border-b pb-2 mb-4">
              General Information
            </h3>
            {user.gender && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Gender:
                </span>
                <span className="capitalize">{user.gender}</span>
              </div>
            )}
            {user.age_range && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Age Range:
                </span>
                <span>{user.age_range}</span>
              </div>
            )}
            {user.disability_details && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Disability Details:
                </span>
                <span>{user.disability_details}</span>
              </div>
            )}
            {user.referral_code && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Referral Code:
                </span>
                <span>{user.referral_code}</span>
              </div>
            )}
            {user.referred_by && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Referred By:
                </span>
                <span>{user.referred_by}</span>
              </div>
            )}
            {user.package && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Package:
                </span>
                <span>{user.package}</span>
              </div>
            )}
            {user.expiry_date && (
              <div className="flex flex-col">
                <span className="font-semibold text-gray-700 text-sm">
                  Package Expiry:
                </span>
                <span>{new Date(user.expiry_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">
                Member Since:
              </span>
              <span>{new Date(user.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">
                Last Updated:
              </span>
              <span>{new Date(user.updated_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-y-6 gap-x-8 p-4 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="col-span-full text-xl font-bold text-gray-800 border-b pb-2 mb-4">
              Wallet Balances
            </h3>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">USD:</span>
              <span className="text-green-600 text-xl font-bold">
                ${user.wallet_balance_usd?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">NGN:</span>
              <span className="text-green-600 text-xl font-bold">
                ₦{user.wallet_balance_ngn?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-700 text-sm">GBP:</span>
              <span className="text-green-600 text-xl font-bold">
                £{user.wallet_balance_gbp?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>

          {user.about && (
            <div className="col-span-full p-4 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                About
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {user.about}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetailsPage;
