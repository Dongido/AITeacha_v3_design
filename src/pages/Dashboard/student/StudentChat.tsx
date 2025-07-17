
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, UserRound } from "lucide-react";
import { Undo2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store";
import { createStudentTopics, getAllStudentTopics, resetTopic,  } from "../../../store/slices/staffchats";
import RestrictedPage from "../classrooms/RestrictionPage";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import CreateTopicDialog from "../_components/Topicdialog";






const StudentClass = () => {
   const { id } = useParams<{id:string}>()
  //  console.log("id", id)
    
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [userTopics, setUserTopics] = useState<any[]>([]);
   const dialogRef = useRef<{ openDialog: () => void }>(null);
  const { studentTopic:topics, loading, error } = useAppSelector(
    (state: RootState) => state.staffChats
  );
  
    const topic = Array.isArray(topics) ? topics : []



    useEffect(() => {
    dispatch(resetTopic())
    dispatch(getAllStudentTopics(id as string));
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

  //  categotries
    const categories = [
    "Class Discussions",
    "Assignments & Homework",
    "Exams & Test Prep",
    "School Events",
    "Clubs & Societies",
    "Fees & Payments",
    "Academic Calendar",
    "Student Welfare",
    ];

   const handleCreate = async (
      topic: string,
      category: string,
      description: string,
      thumbnail?: File | null
   ) => {

   const result = await dispatch(createStudentTopics({
      category,
      topic,
      description,
      thumbnail,
      content_from:"student chat",
      classroom_id:id,
      team_host_id:"",
   }));
   console.log("classroom_id",id)
    if (result) {
      dispatch(getAllStudentTopics( id as string));
    }  
  };
  

 


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
      <Link to={`/student/user-profile/${topicItem.user_id}`} className="w-10 h-10 rounded-full bg-purple-100 flex 
      items-center justify-center text-purple-700 font-bold text-lg">
        {topicItem.topic.charAt(0).toUpperCase()}
      </Link>

      <div className="flex-1">
      {/* Topic title */}
      <Link to={`/student/Studentchat/${topicItem.id}`}>
        <h3 className="text-lg sm:text-xl font-semibold text-purple-800 hover:underline cursor-pointer">
      {topicItem.topic.charAt(0).toUpperCase() + topicItem.topic.slice(1)}
        </h3>
      </Link>

      {/* Author name */}
      {(topicItem.firstname || topicItem.lastname) && (
        <Link
        to={`/student/user-profile/${topicItem.user_id}`}
         className="text-sm text-purple-700 mt-1">
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
      <CreateTopicDialog ref={dialogRef} onCreate={handleCreate} loading={loading} categories={categories} />
    </div>
  );
};

export default StudentClass;