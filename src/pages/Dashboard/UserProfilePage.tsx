import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchUserDetails } from "../../api/user";
import { Skeleton } from "../../components/ui/Skeleton";

import { Button } from "../../components/ui/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
// import { FiMessageCircle } from "react-icons/fi";
import { TbMessageDots } from "react-icons/tb";
import { IoChevronBackOutline } from "react-icons/io5";
import SideChatPopup from "./forum/SideChatPopup";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  organization?: string;
  country?: string;
  city?: string;
  role_id: number;
  active_status: "YES" | "NO";
  imageurl?: string;
  gender?: string;
  age_range?: string;
  disability_details?: string;
  referral_code?: string;
  referred_by?: string;
  pkg?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  wallet_balance_usd?: number;
  wallet_balance_ngn?: number;
  wallet_balance_gbp?: number;
  about?: string;
}

const UserProfilePage = () => {
  const { id: userId } = useParams<{ id: string }>();
   console.log("id", userId)

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSideChat, setShowSideChat] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const  [usersId, setUserId] = useState<number>(0);


   
  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setUserId(parsedDetails.id);
    }
  }, [usersId]);

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) {
        setLoading(false);
        setError("No user ID provided.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await fetchUserDetails(userId);
        setUser(data);
      } catch (err: any) {
        console.error("Failed to fetch user details:", err);
        setError(err.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [userId]);
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
      <div className="p-6 min-h-screen  flex items-center justify-center">
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
      <div className="p-[30px] min-h-screen">
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
      <div className="p-6 min-h-screen  flex items-center justify-center">
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
            <IoChevronBackOutline className="h-5 w-5 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const avatarInitials = `${user.firstname ? user.firstname[0] : ""}${
    user.lastname ? user.lastname[0] : ""
  }`.toUpperCase();

  return (
    <div className="p-[30px] md:p-8 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="mr-4 rounded-full  flex items-center gap-2  transition-all"
        >
          <IoChevronBackOutline className="h-5 w-5 text-gray-700" />
          Back
        </button>
      </div>
        <h1 className="text-3xl font-bold text-gray-900 drop-shadow-sm">
          User Profile
        </h1>


        <div className="flex items-center justify-between my-[40px] gap-3">
          <p  className={`text-sm border-2 rounded-full  p-1 px-2 bg-green-50 font-semibold ${
                  user.active_status === "YES"
                    ? "bg-green-100 text-green-800 border-green-600"
                    : "bg-red-100 text-red-800"
                }`}>Status : {user.active_status && (
              <span
                className={` text-sm font-semibold rounded-full `}
              >
                {user.active_status === "YES" ? "Active" : "Inactive"}
              </span>
            )}</p>


             {Number(user.id) !== usersId && (
              <button
                onClick={() => setShowSideChat(true)}
                className="group flex items-center gap-2 bg-[#7256CE] text-white px-4 py-2 rounded-full shadow-sm hover:bg-purple-900 transition-all"
              >
                <TbMessageDots className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-semibold">Message</span>
              </button>
            )}

        </div>
      
      {/* user profile image and name */}
      <div className="bg-white p-4 rounded-3xl mb-[50px]">
        <div className="flex items-center p-4  gap-5">

        {/* <img src="" alt="" /> */}
        <img
                src={user.imageurl}
                alt={`${user.firstname} ${user.lastname}`}
                className="w-[80px] h-[80px] rounded-full object-cover border-4 border-white shadow-md  ring-2 ring-blue-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://placehold.co/112x112/A7BEE8/FFFFFF?text=${avatarInitials}`;
                }}
              />
        <div className="flex flex-col gap-3">
          <h3 className="m-0">{user.firstname} {user.lastname}</h3>
          <p className="m-0">{getRoleName(user.role_id)}</p>
        </div>
        </div>
      </div>



      {/* contact Information */}
      <div className="bg-white p-4 rounded-3xl mb-[50px]">
        <h3 className="font-bold text-xl">Contact Information</h3>

        <div className="flex  py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Email:</p>
          <a
                href={`mailto:${user.email}`}
                className="text-purple-900 font-semibold hover:underline"
              >
                {user.email}
              </a>
          {/* <p className="m-0 font-semibold text-purple-900">{user.email}</p> */}
        </div>
        <div className="flex  py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Phone:</p>
          <a
                  href={`tel:${user.phone}`}
                  className="text-purple-900 font-semibold hover:underline"
                >
                  {user.phone}
                </a>
          {/* <p className="m-0 font-semibold text-purple-900">08119045405</p> */}
        </div>
        {user.country && (
              <div className="flex justify-between py-3 border-b items-center">
                <span className="font-semibold text-gray-700 ">
                  Country:
                </span>
                <span className="font-semibold text-gray-700">{user.country}</span>
              </div>
            )}

            
        
        {user.city && (<div className="flex  py-3  items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">City:</p>
          <p className="m-0 font-semibold text-gray-700">{user.city}</p>
        </div>
        )}
      </div>



      {/* contact Information */}
      <div className="bg-white p-4 rounded-3xl mb-[50px]">
        <h6 className="font-bold text-xl">General Information</h6>

        {user.gender && (<div className="flex  py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Gender:</p>
          <p className="m-0 font-semibold text-gray-700">{user.gender}</p>
        </div>
        )}

        {user.age_range && (
        <div className="flex  py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Age Range:</p>
          <p className="m-0 font-semibold text-gray-700">{user.age_range}</p>
        </div>
        )}

        {user.referral_code && (
        <div className="flex  py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Referral Code:</p>
          <p className="m-0 font-semibold text-gray-700">{user.referral_code}</p>
        </div>
        )}

        <div className="flex py-3 border-b items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Member Since:</p>
          <p className="m-0 font-semibold text-gray-700">{new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <div className="flex  py-3  items-center justify-between">
          <p className="m-0 font-semibold text-gray-700">Last Updated:</p>
          <p className="m-0 font-semibold text-gray-700">{new Date(user.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    




    {/* About user */}

    {user.about && (
    <div className="bg-white p-5 flex flex-col gap-4 rounded-3xl mb-[50px]">
      <h4 className="font-bold text-xl">About</h4>

      <p className="m-0">{user.about}</p>
    </div>
    )}

     
       {
        showSideChat && (
          <SideChatPopup isOpen={showSideChat} onClose={() => setShowSideChat(false)} id={userId} />
        )
      }
    </div>
  );
};

export default UserProfilePage;
