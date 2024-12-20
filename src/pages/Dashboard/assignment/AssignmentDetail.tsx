import { useEffect, useState, useRef } from "react";
import { DeleteIcon, Edit, Undo2, Delete, ArrowRightIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteAssignmentDialog from "./components/DeleteAssignmentDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchAssignmentByIdThunk } from "../../../store/slices/assignmentSlice";
import { RootState, AppDispatch } from "../../../store";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";

const AssignmentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialogRef = useRef<any>(null);

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

      <div className="flex w-full mt-12 mb-6 items-center justify-between">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full mr-2 gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button
            variant={"destructive"}
            onClick={openDeleteDialog}
            className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
          >
            <DeleteIcon size={"1.1rem"} color="white" />
            Delete
          </Button>
        </div>
      </div>

      {fetchingAssignment ? (
        <div className="border rounded-lg">
          <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-32 mt-4" />
          </div>
          <Skeleton className="h-4 w-1/3 mt-4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ) : (
        <div className="border rounded-lg">
          <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Assignment Details</p>
            </div>

            <h2 className="text-2xl font-bold mt-2">
              {assignment?.assignment_name}
            </h2>
            <p className="text-lg mt-1">{assignment?.assignment_description}</p>
            <p className="text-lg">Status: {assignment?.status}</p>

            <div className="flex flex-col sm:flex-row items-center mt-2 justify-between sm:space-x-4">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/assignments/${assignment?.classroom_id}/students/${assignment?.assignment_id}`
                  )
                }
                className="mt- sm:mt-0 flex hover:bg-gray-200 items-center bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
              >
                View Students
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>

              <div className="mt-4 sm:mt-0 flex flex-row gap-4 items-center">
                <button
                  className="bg-[#e5dbff] text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      assignment?.join_url || "Link not available"
                    );
                    handleCopyLink();
                  }}
                >
                  Copy Link
                </button>

                <button
                  className=" bg-[#e5dbff] text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      assignment?.join_code || "Code not available"
                    );
                    handleCopyCode();
                  }}
                >
                  Copy Code
                </button>

                <div className="flex items-center mt-2">
                  {copied && (
                    <CheckIcon className="h-5 w-5 ml-2 text-green-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {assignment?.questions && assignment.questions.length > 0 && (
            <div className="mb-4 mt-4">
              <h3 className="mt-6 font-semibold">Questions:</h3>
              {assignment.questions.map((question, index) => (
                <div
                  key={question.assignmentquestion_id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
                >
                  <p className="font-semibold text-xl mb-2">
                    {index + 1}. {question.assignment_question}
                  </p>
                  <p className="text-gray-600 mb-2">
                    Answer: {question.assignment_answer || "Not yet answered"}
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
