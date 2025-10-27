// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { ArrowRightIcon } from "@heroicons/react/24/solid";
// import dashImg from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
// import { classroomColumns } from "./_components/column.classroom";
// import { Skeleton } from "../../../components/ui/Skeleton";
// import { useDispatch, useSelector } from "react-redux";
// import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
// import { RootState, AppDispatch } from "../../../store";
// import BaseTable from "../../../components/table/BaseTable";

// interface UserDetails {
//   id: string;
//   email: string;
//   role: string;
//   package: string;
//   firstname: string;
// }

// const Home = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { classrooms, loading, error } = useSelector(
//     (state: RootState) => state.studentClassrooms
//   );

//   useEffect(() => {
//     if (classrooms.length === 0) {
//       dispatch(loadStudentClassrooms());
//     }
//   }, [dispatch, classrooms.length]);

//   const displayedClassrooms = classrooms.slice(0, 5);
//   const navigate = useNavigate();

//   const [userDetails, setUserDetails] = useState<any>(null);
//   const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

//   useEffect(() => {
//     const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

//     if (userDetailsFromStorage) {
//       const parsedDetails = JSON.parse(userDetailsFromStorage);
//       setUserDetails(parsedDetails);
//       setIsEmailVerified(parsedDetails.is_email_verified);
//     }
//   }, []);
//   const handleVerifyEmail = () => {
//     navigate("/dashboard/verify-email");
//   };

//   return (
//     <div className="mt-12">
//       {userDetails && isEmailVerified === 0 && (
//         <div className="bg-yellow-200 mt-3 text-black p-4 rounded-md flex justify-between items-center">
//           <span>Your email is not verified. Please verify your email.</span>
//           <button
//             onClick={handleVerifyEmail}
//             className="text-primary hover:underline"
//           >
//             Verify Email
//           </button>
//         </div>
//       )}
//       <div className="relative mt-4">
//         <div className="bg-[#EFE6FD] text-black p-8 rounded-lg overflow-hidden">
//           <p className="text-sm font-semibold">Your Journey</p>
//           {userDetails ? (
//             <h2 className="text-2xl font-bold mt-2 capitalize">
//               Hi, {userDetails.firstname} 👋
//             </h2>
//           ) : (
//             <h2 className="text-2xl font-bold mt-2">Hi, there 👋</h2>
//           )}
//           <p className="text-lg mt-1">You may have some assignments!</p>
//           <Link to={"#"}>
//             <Link to={"/student/assignments"}>
//               <button className="mt-4 flex gap-2 items-center border border-[#6200EE] text-[#6200EE] rounded-full font-semibold py-2 px-6 text-sm">
//                 See All
//                 <ArrowRightIcon className="h-3 w-3" />
//               </button>
//             </Link>
//           </Link>
//         </div>

//         <img
//           src={dashImg}
//           alt="Robot reading a book"
//           className="absolute lg:block hidden"
//           style={{
//             height: "300px",
//             right: "10%",
//             top: "28%",
//             transform: "translateY(-50%)",
//           }}
//         />
//       </div>

//       <div className="flex flex-col lg:flex-row gap-5 mt-5">
//         <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
//           <h1 className="text-gray-500 font-semibold text-3xl">12</h1>
//           <span>
//             <p className="text-[#6200EE]">Total</p>
//             <p className="text-black font-semibold">Assignments</p>
//           </span>
//         </div>

//         <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
//           <h1 className="text-gray-500 font-semibold text-3xl">04</h1>
//           <span>
//             <p className="text-[#6200EE]">Active</p>
//             <p className="text-black font-semibold">Tests & Exams</p>
//           </span>
//         </div>

//         <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
//           <h1 className="text-gray-500 font-semibold text-3xl">00</h1>
//           <span>
//             <p className="text-[#6200EE]">Total</p>
//             <p className="text-black font-semibold">Tests & Exams</p>
//           </span>
//         </div>
//       </div>

//       <div className="mt-8 overflow-x-auto py-4">
//         <div className="flex justify-between items-center mb-4 px-2">
//           <h2 className="text-xl font-bold text-gray-900">Your AI Tools</h2>
//           {/* <Link
//             to="/student/class"
//             className="text-sm text-blue-600 hover:underline"
//           >
//             <button className="text-sm flex rounded-full px-6 py-2 bg-purple-100 hover:bg-gray-400 text-primary hover:text-black text-white">
//               See All
//               <ArrowRightIcon className="h-5 w-4 ml-2" />
//             </button>
//           </Link> */}
//         </div>
//         {loading ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr>
//                   {[...Array(5)].map((_, index) => (
//                     <th key={index} className="p-4 border-b">
//                       <Skeleton className="h-4 w-16 rounded" />
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {[...Array(6)].map((_, rowIndex) => (
//                   <tr key={rowIndex} className="border-b">
//                     {[...Array(5)].map((_, colIndex) => (
//                       <td key={colIndex} className="p-4">
//                         <Skeleton className="h-4 w-full rounded" />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <BaseTable
//             data={displayedClassrooms}
//             showPagination={false}
//             columns={classroomColumns}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Home;


import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import dashImg from "../../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { classroomColumns } from "./_components/column.classroom";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { loadStudentClassrooms } from "../../../store/slices/studentClassroomSlice";
import { RootState, AppDispatch } from "../../../store";
import BaseTable from "../../../components/table/BaseTable";

interface UserDetails {
  id: string;
  email: string;
  role: string;
  package: string;
  firstname: string;
}

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { classrooms, loading, error } = useSelector(
    (state: RootState) => state.studentClassrooms
  );

  // Example placeholder for tools
  const [tools, setTools] = useState<any[]>([]); // You’ll replace this with your fetched tools

  useEffect(() => {
    if (classrooms.length === 0) {
      dispatch(loadStudentClassrooms());
    }
  }, [dispatch, classrooms.length]);

  const displayedClassrooms = classrooms.slice(0, 5);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

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

  return (
    <div className="mt-12">
      {/* Email Verification Alert */}
      {userDetails && isEmailVerified === 0 && (
        <div className="bg-yellow-200 mt-3 text-black p-4 rounded-md flex justify-between items-center">
          <span>Your email is not verified. Please verify your email.</span>
          <button
            onClick={handleVerifyEmail}
            className="text-primary hover:underline"
          >
            Verify Email
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative mt-4">
        <div className="bg-[#EFE6FD] text-black p-8 rounded-lg overflow-hidden">
          <p className="text-sm font-semibold">Your Journey</p>
          {userDetails ? (
            <h2 className="text-2xl font-bold mt-2 capitalize">
              Hi, {userDetails.firstname} 👋
            </h2>
          ) : (
            <h2 className="text-2xl font-bold mt-2">Hi, there 👋</h2>
          )}
          <p className="text-lg mt-1">You may have some assignments!</p>
          <Link to="/student/assignments">
            <button className="mt-4 flex gap-2 items-center border border-[#6200EE] text-[#6200EE] rounded-full font-semibold py-2 px-6 text-sm">
              See All
              <ArrowRightIcon className="h-3 w-3" />
            </button>
          </Link>
        </div>

        <img
          src={dashImg}
          alt="Robot reading a book"
          className="absolute lg:block hidden"
          style={{
            height: "300px",
            right: "10%",
            top: "28%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
          <h1 className="text-gray-500 font-semibold text-3xl">12</h1>
          <span>
            <p className="text-[#6200EE]">Total</p>
            <p className="text-black font-semibold">Assignments</p>
          </span>
        </div>

        <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
          <h1 className="text-gray-500 font-semibold text-3xl">04</h1>
          <span>
            <p className="text-[#6200EE]">Active</p>
            <p className="text-black font-semibold">Tests & Exams</p>
          </span>
        </div>

        <div className="inline-flex w-full shadow-sm flex-col gap-4 bg-white rounded-2xl p-6">
          <h1 className="text-gray-500 font-semibold text-3xl">00</h1>
          <span>
            <p className="text-[#6200EE]">Total</p>
            <p className="text-black font-semibold">Tests & Exams</p>
          </span>
        </div>
      </div>

      {/* Tools or Class Table */}
      <div className="mt-8 overflow-x-auto py-4">
        {tools && tools.length > 0 ? (
          <>
            {/* Tools Section */}
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">Your AI Tools</h2>
              <Link to="/student/class">
                <button className="text-sm flex rounded-full px-6 py-2 bg-purple-100 hover:bg-gray-400 text-primary hover:text-black">
                  See All
                  <ArrowRightIcon className="h-5 w-4 ml-2" />
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between gap-2 p-3 rounded-lg shadow-sm cursor-pointer transition-all duration-200 
                    w-36 sm:w-40 md:w-44 lg:w-48 aspect-square
                    bg-white text-gray-800 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="w-full h-24 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                    {tool.tool_thumbnail ? (
                      <img
                        src={
                          tool.tool_thumbnail.startsWith("http")
                            ? tool.tool_thumbnail
                            : `https://${tool.tool_thumbnail}`
                        }
                        alt={tool.tool_name || "Tool Thumbnail"}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <span className="text-purple-500 text-sm font-medium">
                        No Image
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-center truncate w-full">
                    {tool.tool_name}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Fallback Table Section */}
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">
                Your Active Classrooms
              </h2>
            </div>

            {loading ? (
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
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <BaseTable
                data={displayedClassrooms}
                showPagination={false}
                columns={classroomColumns}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
