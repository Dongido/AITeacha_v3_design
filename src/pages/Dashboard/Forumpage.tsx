import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';
import { getpremiumUsers } from '../../store/slices/staffchats';
import { Link, useNavigate } from 'react-router-dom';
import RestrictedPage from './classrooms/RestrictionPage';
import { Skeleton } from '../../components/ui/Skeleton';
import { FaGraduationCap } from 'react-icons/fa';
import { User } from 'lucide-react';

const Forumpage = () => {
const dispatch = useAppDispatch();
const navigate = useNavigate();
const [userDetails, setUserDetails] = useState<any>(null);
const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
const { checkuser ,loading, error } = useAppSelector(
(state: RootState) => state.staffChats
);
 const  users =  Array.isArray(checkuser) ? checkuser  : []

 console.log("user", users)

useEffect(() => {
dispatch(getpremiumUsers());
const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

if (userDetailsFromStorage) {
const parsedDetails = JSON.parse(userDetailsFromStorage);
setUserDetails(parsedDetails);
setIsEmailVerified(parsedDetails.is_email_verified);
}

}, [dispatch]);


const handleVerifyEmail = () => {
navigate("/dashboard/verify-email");
};


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
if (error === "Permission restricted: for free account") {
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

if (error === "Permission restricted for unverified email") {
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
    <div className="min-h-screen p-6">
      <h2 className="text-3xl font-bold text-purple-700 text-left mb-10">
        Discussion Forums
      </h2>
      {loading && (
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
      )}

      {!loading && users?.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {users.map((user:any) => (
            <div
              key={user.user_id}
              className="bg-white shadow rounded-xl p-6 text-center border border-purple-200"
            >
            <div className="w-24 h-24 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center mx-auto mb-4">
            <FaGraduationCap className="text-purple-700 text-5xl" />
            </div>

              <h3 className="text-xl font-bold text-purple-700 mb-2">
                {user.organization?.trim()
                  ? user.organization
                  : `${user.firstname} ${user.lastname}`}
              </h3>
              <p className="text-gray-600 text-sm">
                This forum gives you access to {user.organization} team discussions.
              </p>
               <Link
               to={`/dashboard/stafforum/${user.host_team_id}`}
                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-full transition"   
              >
                View Topics
              </Link>
            </div>
          ))}
        </div>
      )}

      {!loading && users?.length === 0 && (
        <p className="text-center text-gray-500">No premium users found.</p>
      )}
    </div>
  );
};

export default Forumpage;
