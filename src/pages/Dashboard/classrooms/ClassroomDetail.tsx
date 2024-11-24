import { useEffect, useState, useRef } from "react";
import { DeleteIcon, Edit, Undo2, Delete, ArrowRightIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteClassroomDialog from "./components/DeleteClassroomDialogue";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassroomByIdThunk } from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";

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

  const openDeleteDialog = () => {
    deleteDialogRef.current?.openDialog();
  };
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(classroom?.join_url || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  return (
    <div className="mt-12">
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
            variant={"gradient"}
            onClick={handleEditClassroom}
            className="flex items-center w-fit h-full gap-3 py-2 rounded-md"
          >
            <Edit size={"1.1rem"} color="white" />
            Edit Classroom
          </Button>
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

      {fetchingClassroom ? (
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

          <h3 className="mt-6 font-semibold">Tools:</h3>
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <div className=" border rounded-lg">
          <div className="bg-[#5C3CBB] text-white p-8 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Classroom Details</p>
            </div>

            <h2 className="text-2xl font-bold mt-2">
              {classroom?.classroom_name}
            </h2>
            <p className="text-lg mt-1">{classroom?.classroom_description}</p>
            <p className="text-lg">Status: {classroom?.status}</p>

            <div className="flex flex-col sm:flex-row items-center mt-2 justify-between sm:space-x-4">
              <button
                onClick={() =>
                  navigate(
                    `/dashboard/classrooms/${classroom?.classroom_id}/students`
                  )
                }
                className="mt- sm:mt-0 flex hover:bg-gray-200 items-center bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
              >
                View Students
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>

              <div className="mt-4 sm:mt-0 flex flex-row items-center">
                {/* Hide join URL on smaller screens */}
                <span
                  className="hidden sm:inline text-sm sm:text-xl font-medium mr-2 cursor-pointer"
                  onClick={handleCopyLink}
                >
                  <span className="text-md sm:text-md">
                    {classroom?.join_url || "Link not available"}
                  </span>
                </span>

                {/* Copy URL button visible only on small screens */}
                <button
                  className="inline sm:hidden bg-white text-[#5C3CBB] font-semibold py-2 px-4 rounded-full text-sm"
                  onClick={handleCopyLink}
                >
                  Copy Join URL
                </button>

                <div className="flex items-center mt-2 sm:mt-0">
                  <ClipboardIcon
                    className="h-5 w-5 cursor-pointer hover:text-gray-300"
                    onClick={handleCopyLink}
                  />
                  {copied && (
                    <CheckIcon className="h-5 w-5 ml-2 text-green-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="flex gap-4 overflow-x-auto">
              <button className="flex items-center gap-2 bg-purple-200 text-purple-800 rounded-full py-2 px-4 whitespace-nowrap">
                grade: {classroom?.grade}
              </button>
              <button className="flex items-center gap-2 bg-blue-200 text-blue-800 rounded-full py-2 px-4 whitespace-nowrap">
                max_students: {classroom?.number_of_students}
              </button>
              {/* <button className="flex items-center gap-2 bg-yellow-200 text-yellow-800 rounded-full py-2 px-4 whitespace-nowrap">
                no_of_students:{" "}
                {classroom?.number_of_students_joined !== null
                  ? classroom?.number_of_students_joined
                  : "null"}
              </button> */}
            </div>
          </div>

          <h3 className="mt-6 font-semibold">Tools:</h3>
          {classroom?.tools.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto mt-4">
              {classroom.tools.map((tool) => (
                <Link
                  key={tool.tool_id}
                  to={`/dashboard/tools/${tool.slug}`}
                  className="flex items-center border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
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
            <p className="text-gray-500 mt-4">No tools added.</p>
          )}
        </div>
      )}

      <DeleteClassroomDialog
        ref={deleteDialogRef}
        classroomId={Number(id)}
        onSuccess={() => navigate("/dashboard/classrooms")}
      />
    </div>
  );
};

export default ClassroomDetail;
