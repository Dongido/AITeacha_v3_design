import { useEffect, useState, useRef } from "react";
import { DeleteIcon, Edit, Delete, ArrowRightIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteAssignmentDialog from "./components/DeleteAssignmentDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByIdThunk } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import { IoChevronBackOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialogRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "students">(
    "questions"
  );

  const assignment = useSelector(
    (state: RootState) => state.assignments.selectedAssignment
  );
  const fetchingAssignment = useSelector(
    (state: RootState) => state.assignments.fetchingAssignment
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAssignmentByIdThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleEditAssignment = () => {
    navigate(`/dashboard/assignments/edit/${id}`);
  };

  const openDeleteDialog = () => {
    deleteDialogRef.current?.openDialog();
  };

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(assignment?.join_url || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(assignment?.join_code || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  console.log(assignment)

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
    <div className="p-[30px]">
      <div className="flex w-full mb-6 items-center justify-between">
        <button
          className="flex items-center  text-black w-fit h-full mr-2 gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <IoChevronBackOutline size={"1.1rem"} color="black" />
          Back
        </button>
        <div className="flex gap-2"></div>
      </div>

      {fetchingAssignment ? (
        <div className="border rounded-3xl">
          <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
            <Skeleton className="h-6 w-1/4 mb-4" />
            {/* <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2" /> */}
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
          {/* <Skeleton className="h-4 w-1/3 mt-4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" /> */}
          {/* <Skeleton className="h-4 w-1/3" /> */}
        </div>
      ) : (
        <div className="border rounded-3-xl">
          <div className="bg-[#EFE6FD]  p-8 rounded-lg overflow-hidden">
            <h1 className="text-2xl font-extrabold  mt-2">
              {assignment?.assignment_name}
            </h1>
            <p className="text-xl font-extrabold mt-1">{assignment?.assignment_description}</p>
            <div className="flex items-center justify-between">
              <p className="px-2 text-green-600 rounded-full font-semibold border border-green-600 text-sm bg-green-50">
                Status: {assignment?.status}
              </p>
               <Button
                // variant={"destructive"}
                onClick={openDeleteDialog}
                className="flex items-center bg-transparent border rounded-full border-red-700 text-red-700 w-fit h-full gap-3 py-2"
              >
                <IoTrashOutline size={"1.1rem"} color="red" />
                Delete
              </Button>
            </div>

            
          </div>

        

          <div className="flex border-b-2 my-[30px] border-gray-300">
            <Link
              to={"/dashboard/assignments/joined"}
              className="w-full sm:w-auto"
            >
              <button
                className={`flex items-center w-full sm:w-fit font-semibold h-full gap-3 py-2 px-4 transition ${
                  activeTab === "questions"
                    ? "border-b-2 border-purple-900 text-purple-900"
                    : "text-gray-500 hover:text-purple-800"
                }`}
              >
                Questions
              </button>{" "}
            </Link>

            <Link to={`/dashboard/assignments/${assignment?.classroom_id}/students/${assignment?.assignment_id}`} className="w-full sm:w-auto">
              <button
                className={`flex items-center w-full sm:w-fit font-semibold h-full gap-3 py-2 px-4 transition ${
                  activeTab === "students"
                    ? "border-b-2 border-purple-900 text-purple-900"
                    : "text-gray-500 hover:text-purple-800"
                }`}
              >
                Students
              </button>
            </Link>
          </div>




          

          {assignment?.questions && assignment.questions.length > 0 && (
            <div className="mb-4 mt-4 bg-white p-4 md:p-[30px] rounded-3xl">
              <h3 className="mt-6 font-semibold">Questions:</h3>
              {assignment.questions.map((question, index) => (
                <div
                  key={question.assignmentquestion_id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                >
                  <p className="font-medium text-xl mb-2">
                    {question.assignment_question}
                  </p>
                </div>
              ))}
            </div>
          )}


          


          {/* <div className="mt-8 flex justify-center">
            <div className="flex gap-4 overflow-x-auto">
              <button className="flex items-center gap-2 bg-purple-200 text-purple-800 rounded-full py-2 px-4 whitespace-nowrap">
                Grade: {assignment?.grade}
              </button>
              <button className="flex items-center gap-2 bg-blue-200 text-blue-800 rounded-full py-2 px-4 whitespace-nowrap">
                Maximum No of Students: {assignment?.number_of_students}
              </button>
            </div>
          </div> */}
        </div>
      )}

      <DeleteAssignmentDialog
        ref={deleteDialogRef}
        assignmentId={Number(id)}
        onSuccess={() => navigate("/dashboard/assignments")}
      />
    </div>
  );
};

export default AssignmentDetail;
