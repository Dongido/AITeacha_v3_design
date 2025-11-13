import { useEffect, useState, useRef } from "react";
import { DeleteIcon, Edit, Undo2, Delete, ArrowRightIcon } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useNavigate, useParams, Link } from "react-router-dom";
import DeleteClassroomDialog from "./components/DeleteClassroomDialogue";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClassroomByIdThunk,
  fetchStudentsForClassroomThunk,
} from "../../../store/slices/classroomSlice";
import { RootState, AppDispatch } from "../../../store";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "../../../components/ui/Skeleton";
import { IoCopyOutline } from "react-icons/io5";
import BaseTable from "../../../components/table/BaseTable";
import { studentColumns } from "./components/column.student";
import ReactMarkdown from "react-markdown";
import { TextArea } from "../../../components/ui/TextArea";
import { Input } from "../../../components/ui/Input";
import Assignment from "../assignment/Assignment";

const ClassroomDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const deleteDialogRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "contents" | "students" | "assignment"
  >("overview");

  const students = useSelector((state: RootState) => state.classrooms.students);
  const fetchingStudents = useSelector(
    (state: RootState) => state.classrooms.fetchingStudents
  );

  const addStudentDialogRef = useRef<any>(null);

  const handleOpenAddStudentDialog = (classroomId?: string) => {
    if (addStudentDialogRef.current) {
      addStudentDialogRef.current.openDialog(classroomId);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentsForClassroomThunk(Number(id)));
    }
  }, [dispatch, id]);

  const handleStudentAddedSuccessfully = () => {
    dispatch(fetchStudentsForClassroomThunk(Number(id)));
  };

  const classroom = useSelector(
    (state: RootState) => state.classrooms.selectedClassroom
  );
  const fetchingClassroom = useSelector(
    (state: RootState) => state.classrooms.fetchingClassroom
  );

  console.log("All about the classroom right here", classroom);

  // At the top of ClassroomDetail.tsx, inside your component
  const [isEditingClassroomDescription, setIsEditingClassroomDescription] =
    useState<boolean>(false);
  const [editedClassroomDescription, setEditedClassroomDescription] =
    useState<string>(classroom?.classroom_description || "");

  const [isEditingClassroomContent, setIsEditingClassroomContent] =
    useState<boolean>(false);
  const [editedClassroomContent, setEditedClassroomContent] = useState<{
    content: string;
  }>({
    content: classroom?.content || "",
  });

  const [editingOutlineId, setEditingOutlineId] = useState<number | null>(null);
  const [editedOutlines, setEditedOutlines] = useState<{
    [key: number]: { title: string; content: string };
  }>(
    () =>
      classroom?.classroomoutlines?.reduce((acc: any, outline: any) => {
        acc[outline.classroomoutline_id] = {
          title: outline.classroomoutline_title,
          content: outline.classroomoutline_content,
        };
        return acc;
      }, {}) || {}
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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(classroom?.join_url || "")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((error) => console.error("Failed to copy link:", error));
  };

  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(classroom?.join_code || "")
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

  function truncateMarkdownPreserveFormatting(md: string, wordLimit = 300) {
    if (!md) return "";
    const words = md.split(/\s+/); // split by whitespace
    if (words.length <= wordLimit) return md;
    return words.slice(0, wordLimit).join(" ") + "...";
  }

  return (
    <div className="p-2 md:p-[30px] md:pt-0">
      <div className="">
        <Button
          className="flex items-center bg-white rounded-md text-black w-fit h-full mr-2 gap-3 py-2"
          onClick={() => navigate(-1)}
        >
          <Undo2 size={"1.1rem"} color="black" />
          Back
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full mt-6 mb-6 md:items-center md:justify-between">
        <p
          className={`text-sm m-0 inline-flex w-fit border rounded-full px-3 py-1 text-[#0DBA86] bg-[#E7F8F3] border-[#0DBA86]`}
        >
          <strong className="mr-1">Status:</strong> {classroom?.status}
        </p>

        <div className="flex gap-2">
          <Button
            variant={"gray"}
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
            Delete Classroom
          </Button>
        </div>
      </div>

      {fetchingClassroom ? (
        <div className="border rounded-lg">
          <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
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
        <div className="pb-[15px] md:pb-[50px]">
          <div className="bg-[#EFE6FD] text-black p-4 lg:p-8 rounded-lg overflow-hidden">
            <h2 className="text-2xl font-semibold mt-2 capitalize">
              {classroom?.classroom_name}
            </h2>
            <p className="text-sm mt-1 m-0 capitalize">
              {classroom?.classroom_description
                ? classroom.classroom_description.length > 270
                  ? `${classroom.classroom_description.slice(0, 270)}...`
                  : classroom.classroom_description
                : ""}
            </p>
            <p
              
              className="w-full  font-medium m-0 text-sm"
            >
              {classroom?.grade} 
            </p>
            <p
              className="w-full  font-medium  text-sm m-0"
            >
              <span>Student Joined : </span>
              {classroom?.number_of_students_joined}
            </p>
            

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center mt-[20px] md:mt-[50px] justify-between gap-4 flex-wrap">
              <div className="flex flex-col items-center sm:flex-row gap-4 w-full sm:w-auto">
                
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
                  className="w-full sm:w-auto border border-[#6200EE] text-[#6200EE] font-medium py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      classroom?.join_url || "Link not available"
                    );
                    handleCopyLink();
                  }}
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Link
                </button>
                <button
                  className="w-full sm:w-auto bg-[#6200EE] text-white font-medium py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      classroom?.join_code || "Code not available"
                    );
                    handleCopyCode();
                  }}
                >
                  <IoCopyOutline className="mr-1" />
                  Copy Class Code
                </button>
                {copied && (
                  <CheckIcon className="h-5 w-5 mx-auto text-green-400" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            {/* Buttons */}
            <div className="flex border-b flex-wrap border-gray-300 gap-4 mb-6">
              <button
                // variant={activeTab === "overview" ? "default" : "outline"}
                onClick={() => setActiveTab("overview")}
                className={`px-1 md:px-6 py-2  font-semibold text-sm ${
                  activeTab === "overview"
                    ? " border-b-4 border-[#5C3CBB] text-[#5C3CBB]"
                    : "text-gray-700"
                }`}
              >
                Overview
              </button>

              <button
                // variant={activeTab === "students" ? "default" : "outline"}
                onClick={() => setActiveTab("contents")}
                className={`px-1 md:px-6 py-2 font-semibold text-sm ${
                  activeTab === "contents"
                    ? "border-b-4 border-[#5C3CBB]  text-[#5C3CBB]"
                    : "text-gray-700"
                }`}
              >
                Contents
              </button>

              <button
                // variant={activeTab === "students" ? "default" : "outline"}
                onClick={() => setActiveTab("students")}
                className={`px-1 md:px-6 py-2 font-semibold text-sm ${
                  activeTab === "students"
                    ? "border-b-4 border-[#5C3CBB]  text-[#5C3CBB]"
                    : "text-gray-700"
                }`}
              >
                Students
              </button>

              <button
                onClick={() => setActiveTab("assignment")}
                className={`px-1 md:px-6 py-2 font-semibold text-sm ${
                  activeTab === "assignment"
                    ? "border-b-4 border-[#5C3CBB]  text-[#5C3CBB]"
                    : "text-gray-700"
                }`}
              >
                Assignment
              </button>
            </div>

            {/* Conditional Content */}
            <div className="">
              {activeTab === "overview" && (
                <div>
                  <div className="flex gap-2 justify-between items-center mt-6">
                    <h3 className=" font-semibold">Tools:</h3>
                    <Button
                      variant={"gray"}
                      onClick={handleEditTools}
                      className="flex items-center w-fit h-full gap-3 py-2 rounded-full"
                    >
                      <Edit size={"1.1rem"} color="white" />
                      Edit Tools
                    </Button>
                  </div>
                  {classroom?.tools.length ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto mt-4">
                      {classroom.tools.map((tool) => (
                        <Link
                          key={tool.tool_id}
                          to={`/dashboard/student/tools/${tool.tool_slug}`}
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

              {activeTab === "contents" && (
                <div className="space-y-8">
                  {/* --- Classroom Description --- */}
                  {classroom?.classroom_description && (
                    <div className="bg-gray-50 p-2 md:p-4 rounded-xl border border-gray-200 transition-all">
                      <div className="flex justify-end mb-2">
                        
                        <button
                          onClick={() =>
                            setIsEditingClassroomDescription((prev) => !prev)
                          }
                          className=" w-fit float-right text-sm text-gray-600 hover:text-[#5C3CBB]"
                        >
                          {isEditingClassroomDescription ? "Cancel" : "Edit"}
                        </button>
                      </div>

                      {isEditingClassroomDescription ? (<h2 className="text-xl font-bold text-gray-900">
                        Classroom Description
                      </h2>) : ""}

                      <div className="prose max-w-none text-gray-800 leading-relaxed">
                        {isEditingClassroomDescription ? (
                          <>
                            <TextArea
                              value={
                                editedClassroomDescription ||
                                classroom.classroom_description
                              }
                              onChange={(e) =>
                                setEditedClassroomDescription(e.target.value)
                              }
                              className="w-full border rounded-md p-2"
                              rows={4}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                // onClick={() => {
                                //   fetch(
                                //     `/api/classrooms/${classroom.classroom_id}`,
                                //     {
                                //       method: "PUT",
                                //       headers: {
                                //         "Content-Type": "application/json",
                                //       },
                                //       body: JSON.stringify({
                                //         classroom_description:
                                //           editedClassroomDescription,
                                //       }),
                                //     }
                                //   )
                                //     .then((res) => res.json())
                                //     .then(() => {
                                //       setIsEditingClassroomDescription(false);
                                //       setEditedClassroomDescription("");
                                //       dispatch(
                                //         fetchClassroomByIdThunk(Number(id))
                                //       ); // refresh data
                                //     })
                                //     .catch((err) => console.error(err));
                                // }}
                                className="px-4 py-1 bg-[#5C3CBB] text-white rounded-full text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditedClassroomDescription(
                                    classroom.classroom_description
                                  );
                                  setIsEditingClassroomDescription(false);
                                }}
                                className="px-4 py-1 bg-gray-300 text-gray-700 rounded-full text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <ReactMarkdown>
                            {truncateMarkdownPreserveFormatting(
                              classroom.classroom_description,
                              300
                            )}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- Classroom Main Content --- */}
                  {classroom?.content && (
                    <div className="bg-gray-50 p-2 md:p-4 rounded-xl border border-gray-200  transition-all">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() =>
                            setIsEditingClassroomContent((prev) => !prev)
                          }
                          className="ml-4 text-sm text-gray-600 hover:text-[#5C3CBB]"
                          >
                          {isEditingClassroomContent ? "Cancel" : "Edit"}
                        </button>
                      </div>
                      {isEditingClassroomContent ? (<h2 className="text-2xl font-bold text-gray-900">
                        Classroom Content
                      </h2>) : ""}
                      

                      <div className="prose max-w-none text-gray-800 leading-relaxed">
                        {isEditingClassroomContent ? (
                          <>
                            <TextArea
                              value={
                                editedClassroomContent.content ||
                                classroom.content
                              }
                              onChange={(e) =>
                                setEditedClassroomContent((prev) => ({
                                  ...prev,
                                  content: e.target.value,
                                }))
                              }
                              className="w-full border rounded-md p-2"
                              rows={12}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                // onClick={() => {
                                //   fetch(
                                //     `/api/classrooms/${classroom.classroom_id}`,
                                //     {
                                //       method: "PUT",
                                //       headers: {
                                //         "Content-Type": "application/json",
                                //       },
                                //       body: JSON.stringify({
                                //         content: editedClassroomContent.content,
                                //       }),
                                //     }
                                //   )
                                //     .then((res) => res.json())
                                //     .then(() =>
                                //       setIsEditingClassroomContent(false)
                                //     )
                                //     .catch((err) => console.error(err));
                                // }}
                                className="px-4 py-1 bg-[#5C3CBB] text-white rounded-full text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditedClassroomContent({
                                    content: classroom.content,
                                  });
                                  setIsEditingClassroomContent(false);
                                }}
                                className="px-4 py-1 bg-gray-300 text-gray-700 rounded-full text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <ReactMarkdown>
                            {truncateMarkdownPreserveFormatting(
                              classroom.content,
                              300
                            )}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- Class Outlines --- */}
                  {classroom?.classroomoutlines?.length ? (
                    <div className="mt-6 space-y-6">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">
                        Class Outlines
                      </h2>

                      {classroom.classroomoutlines.map((outline: any) => {
                        const edited = editedOutlines[
                          outline.classroomoutline_id
                        ] || {
                          title: outline.classroomoutline_title,
                          content: outline.classroomoutline_content,
                        };
                        const isEditing =
                          editingOutlineId === outline.classroomoutline_id;

                        return (
                          <div
                            key={outline.classroomoutline_id}
                            className="bg-gray-50 p-2 md:p-4 rounded-xl border border-gray-200 transition-all"
                          >
                            {/* Title */}
                            <div className="flex justify-between items-start mb-2">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  value={edited.title}
                                  maxLength={100}
                                  onChange={(e) =>
                                    setEditedOutlines((prev) => ({
                                      ...prev,
                                      [outline.classroomoutline_id]: {
                                        ...prev[outline.classroomoutline_id],
                                        title: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-full border px-2 py-1 rounded-md text-lg font-semibold text-[#5C3CBB]"
                                />
                              ) : (
                                <h3 className="text-lg font-semibold text-[#5C3CBB]">
                                  {outline.classroomoutline_title}
                                </h3>
                              )}

                              <button
                                onClick={() =>
                                  isEditing
                                    ? setEditingOutlineId(null)
                                    : setEditingOutlineId(
                                        outline.classroomoutline_id
                                      )
                                }
                                className="ml-4 text-sm text-gray-600 hover:text-[#5C3CBB]"
                              >
                                {isEditing ? "" : "Edit"}
                              </button>
                            </div>

                            {/* Content */}
                            <div className="prose max-w-none text-gray-800 leading-relaxed">
                              {isEditing ? (
                                <>
                                  <TextArea
                                    value={edited.content}
                                    onChange={(e) =>
                                      setEditedOutlines((prev) => ({
                                        ...prev,
                                        [outline.classroomoutline_id]: {
                                          ...prev[outline.classroomoutline_id],
                                          content: e.target.value,
                                        },
                                      }))
                                    }
                                    className="w-full border rounded-md p-2"
                                    rows={15}
                                  />
                                  <div className="mt-2 flex gap-2">
                                    <button
                                      onClick={() => {
                                        fetch(
                                          `/api/classroomoutlines/${outline.classroomoutline_id}`,
                                          {
                                            method: "PUT",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              title: edited.title,
                                              content: edited.content,
                                            }),
                                          }
                                        )
                                          .then((res) => res.json())
                                          .then(() => setEditingOutlineId(null))
                                          .catch((err) => console.error(err));
                                      }}
                                      className="px-4 py-1 bg-[#5C3CBB] text-white rounded-full text-sm"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => {
                                        setEditedOutlines((prev) => ({
                                          ...prev,
                                          [outline.classroomoutline_id]: {
                                            title:
                                              outline.classroomoutline_title,
                                            content:
                                              outline.classroomoutline_content,
                                          },
                                        }));
                                        setEditingOutlineId(null);
                                      }}
                                      className="px-4 py-1 bg-gray-300 text-gray-700 rounded-full text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <ReactMarkdown>
                                  {truncateMarkdownPreserveFormatting(
                                    outline.classroomoutline_content,
                                    300
                                  )}
                                </ReactMarkdown>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p>No outlines available.</p>
                  )}
                </div>
              )}

              {activeTab === "students" && (
                <div>
                  {fetchingStudents ? (
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
                  ) : (
                    <BaseTable data={students} columns={studentColumns(id)} />
                  )}
                </div>
              )}

              {activeTab === "assignment" && (
                <div>
                  <Assignment />
                </div>
              )}
            </div>
          </div>
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
