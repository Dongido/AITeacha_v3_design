import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { CalendarDays, Plus, UserRound } from "lucide-react";
import { Undo2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store";
import {
  createStudentTopics,
  getAllStudentTopics,
  resetTopic,
} from "../../../store/slices/staffchats";
import RestrictedPage from "../classrooms/RestrictionPage";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import CreateTopicDialog from "../_components/Topicdialog";
import { BiMessageRoundedDetail } from "react-icons/bi";

const StudentClass = () => {
  const { id } = useParams<{ id: string }>();
  //  console.log("id", id)

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [userTopics, setUserTopics] = useState<any[]>([]);
  const dialogRef = useRef<{ openDialog: () => void }>(null);
  const {
    studentTopic: topics,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.staffChats);

  const topic = Array.isArray(topics) ? topics : [];

  useEffect(() => {
    dispatch(resetTopic());
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
    const result = await dispatch(
      createStudentTopics({
        category,
        topic,
        description,
        thumbnail,
        content_from: "student chat",
        classroom_id: id,
        team_host_id: "",
      })
    );
    console.log("classroom_id", id);
    if (result) {
      dispatch(getAllStudentTopics(id as string));
    }
  };

  return (
    <div className="lg:px-10 px-5 lg:-mt-6 md:mt-6 overflow-x-hidden">
      <div className="flex w-full mt-12 mb-6 items-center justify-between flex-col sm:flex-row">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start">
          {/* Create Topic Button */}
          {topic.length > 0 && (
            <button
              onClick={() => dialogRef.current?.openDialog()}
              className="flex items-center w-full sm:w-fit h-full gap-3 rounded-md bg-[#6200EE] p-3 text-white"
            >
              <Plus size={"1.1rem"} />
              Create Topic
            </button>
          )}
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
            <div className="text-center text-black bg-white py-28">
              <div className="flex justify-center mb-8">
                <BiMessageRoundedDetail className="text-6xl text-[#6200EE]" />
              </div>
              <p className="text-2xl font-semibold mb-2">
                📝 Forum topic is empty
              </p>
              <p className="text-sm mb-4">
                Proceed to creating a topic to start a discussion.
              </p>
              <button
                onClick={() => dialogRef.current?.openDialog()}
                // variant="gradient"
                className="bg-[#6200EE] text-white px-4 py-2 rounded-full inline-flex gap-2 items-center mt-8"
              >
                <Plus size={"1.1rem"} className="mr-2" />
                Create Your First Topic
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-4">
                {topic?.map((topicItem) =>
                  topicItem && topicItem.topic ? (
                    <div
                      key={topicItem.id}
                      className="border border-gray-200 rounded-2xl shadow-sm
       p-5 bg-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        {/* Circle with first letter */}
                        <Link
                          to={`/student/user-profile/${topicItem.user_id}`}
                          className="w-10 h-10 rounded-full bg-[#EFE6FD] flex 
      items-center justify-center text-[#6200EE] font-bold text-lg mt-5"
                        >
                          {topicItem.topic.charAt(0).toUpperCase()}
                        </Link>

                        <div className="flex-1">
                          {/* Topic title */}
                          <Link to={`/student/Studentchat/${topicItem.id}`}>
                            <h3 className="text-lg sm:text-xl font-semibold text-black cursor-pointer">
                              {topicItem.topic.charAt(0).toUpperCase() +
                                topicItem.topic.slice(1)}
                            </h3>
                          </Link>

                          {/* Author name */}
                          {(topicItem.firstname || topicItem.lastname) && (
                            <Link
                              to={`/student/user-profile/${topicItem.user_id}`}
                              className="text-sm text-[#6200EE]"
                            >
                              By {topicItem.firstname} {topicItem.lastname}
                            </Link>
                          )}

                          {/* Date */}
                          <div className="flex items-center text-sm text-black gap-1">
                            <CalendarDays className="w-4 h-4" />
                            <span>
                              {new Date(
                                topicItem.created_at || ""
                              ).toLocaleDateString("en-GB")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateTopicDialog
        ref={dialogRef}
        onCreate={handleCreate}
        loading={loading}
        categories={categories}
      />
    </div>
  );
};

export default StudentClass;
