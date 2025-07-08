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
import { useNavigate, useParams } from "react-router-dom";
import GeneralRestrictedPage from "./_components/GeneralRestrictedPage";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, UserRound } from "lucide-react";
import CreateTopicDialog from "./_components/Topicdialog";
import { createStaffTopic, getAllStaffTopics } from "../../store/slices/staffchats";
import RestrictedPage from "./classrooms/RestrictionPage";
import { Undo2 } from "lucide-react";
import SideChatPopup from "./forum/SideChatPopup";






const StaffChat = () => {
   const { id } = useParams<{id:string}>()
  //  console.log("id", id)
    
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  const [userTopics, setUserTopics] = useState<any[]>([]);
   const dialogRef = useRef<{ openDialog: () => void }>(null);
  const { topics, loading, error } = useAppSelector(
    (state: RootState) => state.staffChats
  );
  
    const topic = Array.isArray(topics) ? topics : []



    useEffect(() => {
    dispatch(getAllStaffTopics(id as string));
  }, [dispatch]);


  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }

     const dummyTopics = [
      {
        id: "1",
        title: "How to Make Learning Fun for Kids",
        createdAt: "2024-06-01",
        createdBy: "Julieth",
      },
      {
        id: "2",
        title: "The Role of AI in Modern Education",
        createdAt: "2024-06-05",
        createdBy: "John Doe",
      },
      {
        id: "3",
        title: "Effective Ways to Manage a Classroom",
        createdAt: "2024-06-09",
        createdBy: "Julieth",
      },
    ];




    setTimeout(() => {
      setUserTopics(dummyTopics);
    }, 1000);
  }, []);

  const handleVerifyEmail = () => {
    navigate("/dashboard/verify-email");
  };

  const shareDialogRef = useRef<any>(null);

  const openShareDialog = () => {
    shareDialogRef.current.openDialog();
  };

  // categories
     const categories = [
      "General Discussions",
      "Exam Timetables",
      "Events & Activities",
      "Public Holidays",
      "Results & Reports",
      "School Fees",
      "Discipline & Conduct",
      "Academic Calendar",
    ];

   const handleCreate = async (
      topic: string,
      category: string,
      description: string,
      thumbnail?: File | null,
   ) => {

   const result = await dispatch(createStaffTopic({
      category,
      topic,
      description,
      thumbnail,
      content_from:"staff chat",
      classroom_id:"",
      team_host_id:id
   }));
  //  console.log(result, "result")

    if (result) {
      dispatch(getAllStaffTopics( id as string));
    }  
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
  <div className="lg:mt-12 md:mt-6 overflow-x-hidden">
      {/* Integrate the GroupChatForm component */}
  <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
  <h2 className="lg:text-3xl md:text-2xl text-lg font-extrabold text-gray-900 sm:mb-0 mb-4">
    📢  Chat Topics
  </h2>
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start">
    {/* Back Button */}
    <Button
      onClick={() => navigate(-1)}
      variant="outline"
      className="flex items-center gap-2 w-full sm:w-fit border border-gray-300 text-gray-700"
    >
       <Undo2 size={18} />
      Back
    </Button>

    {/* Create Topic Button */}
  {
  topic.length  > 0 && (
  <Button
    onClick={() => dialogRef.current?.openDialog()}
    variant="gradient"
    className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
  >
    <Plus size={"1.1rem"} />
    Create Topic
  </Button>
  )  
  }
  </div>
</div>

  <div className="mt-8">
  <div className="mt-8">
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
    ) : topic.length === 0 ? (
     <div className="text-center text-gray-600 py-8">
    <p className="text-lg font-semibold mb-2">📝 Forum topic is empty</p>
    <p className="text-sm mb-4">Proceed to creating a topic to start a discussion.</p>
    <Button
    onClick={() => dialogRef.current?.openDialog()}
    variant="gradient"
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
    >
    <Plus size={"1.1rem"} className="mr-2" />
    Create Your First Topic
  </Button>
  </div>
    ) : (
    <div className="grid gap-4">
      <div className="grid gap-4">
  {topic?.map((topicItem) =>
    topicItem && topicItem.topic ? (
      <div
      key={topicItem.id}
      className="border border-gray-200 rounded-lg shadow-sm
       p-5 bg-white hover:shadow-md transition-all duration-200"
      >
      <div className="flex items-start gap-3">
      {/* Circle with first letter */}
      <Link
      to={`/dashboard/user-profile/${topicItem.user_id}`} 
       className="w-10 h-10 rounded-full bg-purple-100 flex 
      items-center justify-center text-purple-700 font-bold text-lg ">
        {topicItem.topic.charAt(0).toUpperCase()}
      </Link>

      <div className="flex-1">
      {/* Topic title */}
      <Link to={`/dashboard/teacherChats/${topicItem.id}`}>
        <h3 className="text-lg sm:text-xl font-semibold  text-purple-800 hover:underline cursor-pointer  underline">
      {topicItem.topic.charAt(0).toUpperCase() + topicItem.topic.slice(1)}
        </h3>
      </Link>

      {/* Author name */}
      {(topicItem.firstname || topicItem.lastname) && (
        <Link
        to={`/dashboard/user-profile/${topicItem.user_id}`} 
         className="text-sm text-purple-700 mt-1 cursor-pointer hover:underline">
          By {topicItem.firstname} {topicItem.lastname}
        </Link>
      )}

      {/* Date */}
      <div className="mt-1 flex items-center text-sm text-gray-500 gap-1">
        <CalendarDays className="w-4 h-4" />
      <span>
        {new Date(topicItem.created_at || "").toLocaleDateString("en-GB")}
       </span>
        </div>
        </div>
        </div>
      </div>
    ) 
    : null
     )}
  </div>   
    </div>
      )}
      </div> 
      </div>
      <CreateTopicDialog ref={dialogRef} onCreate={handleCreate} loading={loading}   categories={categories} />
    
    </div>
  );
};

export default StaffChat;