import { useEffect, useState, useRef } from "react";
import { ArrowRightIcon, ChevronLeft, Edit, Undo2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteClassroomDialog from "./components/DeleteClassroomDialogue";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import { IoCopyOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { MdChevronLeft } from "react-icons/md";

interface Tool {
  tool_id: number;
  tool_name: string;
  tool_description: string;
  tool_slug: string;
}

const ClassroomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialogRef = useRef<any>(null);

  const classroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );
  const fetchingClassroom = useSelector(
    (state: RootState) => state.classrooms.fetchingClassroom
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchClassroomByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleEditClassroom = () => {
    navigate(`/dashboard/classrooms/edit/${id}`);
  };

  const handleEditTools = () => {
    navigate(`/dashboard/classrooms/edit-tools/${id}`);
  };

  const openDeleteDialog = () => {
    deleteDialogRef.current?.openDialog();
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy:", error));
  };

  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  return (
    <div className="mt-4 mb-10">
      {/* Header */}
      <div className="flex w-full mt-4 mb-6 items-center justify-between flex-wrap gap-4">
        <button
          className="flex items-center rounded-md text-black w-fit gap-2 py-2"
          onClick={() => navigate(-1)}
        >
          <MdChevronLeft />
          Back
        </button>
      </div>

      <div className="flex gap-2 justify-between">
        <div>
          <p className="text-sm mt-2 text-[#0DBA86] bg-[#E7F8F3] border border-[#0DBA86] rounded-full px-6 py-2">
            <strong>Status:</strong> {classroom?.status}
          </p>
        </div>
        <div>
          {/* <button
            // variant={"gray"}
            onClick={handleEditClassroom}
            className="flex items-center gap-2 py-2 rounded-md"
          >
            <FaEdit size={"1rem"} />
            Edit Classroom
          </button> */}
          <button
            // variant={"danger"}
            onClick={openDeleteDialog}
            className="flex items-center gap-2 rounded-full px-6 py-2 border border-black text-black"
          >
            Delete Classroom
          </button>
        </div>
      </div>

      {/* Content */}
      {fetchingClassroom ? (
        <div className="border rounded-lg">
          <div className="bg-[#EFE6FD] p-8 rounded-lg overflow-hidden">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          {/* Top Card */}
          <div className="bg-[#EFE6FD] text-black p-4 lg:p-8 rounded-lg overflow-hidden">
            <h2 className="text-2xl font-semibold mt-2 capitalize">
              {classroom?.classroom_name}
            </h2>
            <p className="text-sm mt-1 capitalize">
              {classroom?.classroom_description
                ? classroom.classroom_description.length > 270
                  ? `${classroom.classroom_description.slice(0, 270)}...`
                  : classroom.classroom_description
                : ""}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center mt-4 justify-between gap-4 flex-wrap">
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() =>
                    navigate(`/dashboard/liveclass/${classroom?.classroom_id}`)
                  }
                  className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] font-medium py-2 px-4 rounded-full text-sm"
                >
                  Go to Live Class
                  <ArrowRightIcon className="ml-2 w-3 h-3" />
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/Studentforum/${classroom?.classroom_id}`
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center border border-[#6200EE] text-[#6200EE] font-medium py-2 px-4 rounded-full text-sm"
                >
                  Group Chats
                </button>
                <button
                  className="w-full sm:w-auto border border-[#6200EE] text-[#6200EE] font-medium py-2 px-4 rounded-full text-sm flex items-center gap-2"
                  onClick={() =>
                    handleCopy(classroom?.join_url || "Link not available")
                  }
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Link
                </button>
                <button
                  className="w-full sm:w-auto bg-[#6200EE] text-white font-medium py-2 px-4 rounded-full text-sm flex items-center gap-2"
                  onClick={() =>
                    handleCopy(classroom?.join_code || "Code not available")
                  }
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Code
                </button>
                {copied && <CheckIcon className="h-5 w-5 text-green-400" />}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2 sm:mt-0"></div>
            </div>
          </div>

          {/* Tools Section */}
          <div className="flex justify-between items-center mt-10 mb-3 p-4 bg-white rounded-2xl">
            <div>
              <h3 className="font-semibold text-lg">Course Introduction</h3>
              <p className="text-sm">
                Manage and add extra details such as polls, quiz, videos and
                more
              </p>
            </div>

            <div>
              <button
                // variant={"gray"}
                onClick={handleEditTools}
                className="flex items-center gap-2 rounded-full bg-black text-white px-6 py-2"
              >
                <Edit />
                Edit
              </button>
            </div>
          </div>

          {classroom?.tools && classroom.tools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 mb-10">
              {classroom.tools.map((tool: Tool) => (
                <Link
                  key={tool.tool_id}
                  to={`/dashboard/student/tools/${tool.tool_slug}`}
                  className="flex items-center border border-gray-200 px-4 py-3 rounded-2xl bg-white hover:shadow-md transition-transform duration-300 hover:scale-105"
                >
                  <div className="text-left">
                    <h3 className="text-base capitalize font-semibold text-gray-900">
                      {tool.tool_name}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {tool.tool_description.charAt(0).toUpperCase() +
                        tool.tool_description.slice(1)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 px-4 mb-8">No tools added.</p>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteClassroomDialog
        ref={deleteDialogRef}
        classroomId={Number(id)}
        onSuccess={() => navigate("/dashboard/classrooms")}
      />
    </div>
  );
};

export default ClassroomDetail;
