import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/index";
import {
  assignToTeamClassroom,
  getAssignedTeamClassrooms,
  getTeacherAssignedTeamClassrooms,
} from "../../../store/slices/teamClassroomSlice";
import { loadTeamMembers } from "../../../store/slices/teamSlice";
import {
  loadClassrooms,
  loadTeamClassrooms,
} from "../../../store/slices/classroomSlice";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../../../components/ui/Dialogue";
import BaseTable from "../../../components/table/BaseTable";
import { teamClassroomColumns } from "./column.classroom";
import { Switch } from "../../../components/ui/Switch";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import RestrictedPage from "../classrooms/RestrictionPage";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../../../components/ui/Input";
const TeamClassroomPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [classroomId, setClassroomId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const [showTeacherAssigned, setShowTeacherAssigned] = useState(false);
  const [selectionType, setSelectionType] = useState("teamClassroom");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [activeTab, setActiveTab] = useState("teamClassrooms"); // New state for active tab
  const [searchTerm, setSearchTerm] = useState("");
  const { assignedClassrooms, teacherAssignedClassrooms, loading, error } =
    useSelector((state: RootState) => state.teamClassroom);

  const { classrooms, teamClassrooms } = useSelector(
    (state: RootState) => state.classrooms
  );
  const { members, inviteLoading, inviteError } = useSelector(
    (state: RootState) => state.team
  );

  const assignedClassroomsList = assignedClassrooms ?? [];
  const teacherAssignedClassroomsList = teacherAssignedClassrooms ?? [];

  useEffect(() => {
    dispatch(getAssignedTeamClassrooms());
    dispatch(getTeacherAssignedTeamClassrooms());
    dispatch(loadClassrooms());
    dispatch(loadTeamClassrooms());
    dispatch(loadTeamMembers());
  }, [dispatch]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !selectedItemId) return alert("Please fill all fields.");

    setSubmitting(true);
    try {
      await dispatch(
        assignToTeamClassroom({ email, classroomId: selectedItemId })
      );
      setEmail("");
      setClassroomId("");
      setOpenDialog(false);
      dispatch(getAssignedTeamClassrooms());
    } catch (error) {
      console.error("Error assigning team member", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddStudentsClick = () => {
    // addTeachersDialogRef.current?.openDialog();
    console.log("clicked..");
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "firstname,lastname,phone,email,country,city,gender,age,disability_details\n" +
      "John,Doe,1234567890,teacher.john@example.com,Nigeria,Lagos,Male,40,Wheelchair user\n" +
      "Jane,Smith,0987654321,teacher.jane@example.com,Ghana,Accra,Female,35,";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "teacher_template.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      window.open(
        `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
      );
    }
  };

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

  const handleSelectionTypeChange = (type: string) => {
    setSelectionType(type);
    setSelectedItemId("");
  };

  const itemsToDisplay =
    selectionType === "teamClassroom" ? teamClassrooms : classrooms;

  // Render Skeleton for loading state
  // if (loading) {
  //   return (
  //     <div className="overflow-x-auto">
  //       <table className="min-w-full border-collapse">
  //         <thead>
  //           <tr>
  //             {[...Array(5)].map((_, index) => (
  //               <th key={index} className="p-4 border-b">
  //                 <Skeleton className="h-4 w-16 rounded" />
  //               </th>
  //             ))}
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {[...Array(6)].map((_, rowIndex) => (
  //             <tr key={rowIndex} className="border-b">
  //               {[...Array(5)].map((_, colIndex) => (
  //                 <td key={colIndex} className="p-4">
  //                   <Skeleton className="h-4 w-full rounded" />
  //                 </td>
  //               ))}
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   );
  // }

  // Render RestrictedPage for specific errors
  if (
    error ===
      "Permission restricted: upgrade to premium account to gain access" ||
    error === "Permission restricted: for free account" ||
    error === "Permission restricted for unverified email"
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

  // Render generic error with email verification prompt
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
    <div className="p-4 md:p-[30px]  ">
      <div>
        <h2 className="text-lg font-semibold m-0">Class Management</h2>
        <p className="text-sm">Manage classroom</p>
      </div>

      <div className="mb-4 mt-[50px] border-b-2 ">
        <button
          className={` font-bold text-[19px] ${
            activeTab === "teamClassrooms"
              ? "text-purple-900 border-b-4 border-purple-900"
              : "text-gray-900 "
          } flex-1 text-center py-2 px-5  transition-colors duration-200 font-medium text-sm`}
          onClick={() => setActiveTab("teamClassrooms")}
        >
          Team Classrooms
        </button>
        <button
          className={` font-bold text-[19px] ${
            activeTab === "teamMembers"
              ? "text-purple-900 border-b-4 border-purple-900"
              : "text-gray-900"
          } flex-1 text-center py-2 px-5  transition-colors duration-200 font-medium text-sm`}
          onClick={() => setActiveTab("teamMembers")}
        >
          Team Members
        </button>
      </div>
      {activeTab === "teamClassrooms" && (
        <>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 my-4">
            <div className="flex  items-center space-x-2">
              <span className="text-md font-semibold whitespace-nowrap">
                Show Classrooms Assigned to me
              </span>
              <Switch
                checked={showTeacherAssigned}
                onCheckedChange={(checked) => setShowTeacherAssigned(checked)}
              />
            </div>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger className="bg-primary text-white px-4 py-2 rounded-md mb-4 sm:mb-0">
                Assign Classroom
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Classroom to a Team Member</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleAssign} className="space-y-4">
                  <div className="mt-4">
                    <label className="block text-gray-700">
                      Select Team Member
                    </label>
                    <select
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-full"
                      required
                    >
                      <option value="">Select a Team Member</option>
                      {members?.map((member) => (
                        <option key={member.id} value={member.email}>
                          {member.firstname} {member.lastname} ({member.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex bg-white rounded-full p-1 mb-4">
                    <button
                      type="button"
                      className={`flex-1 text-center py-2 px-4 rounded-md transition-colors duration-200 ${
                        selectionType === "teamClassroom"
                          ? "bg-primary text-white shadow"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSelectionTypeChange("teamClassroom")}
                    >
                      Team Classroom
                    </button>
                    <button
                      type="button"
                      className={`flex-1 text-center py-2 px-4 rounded-md transition-colors duration-200 ${
                        selectionType === "classroom"
                          ? "bg-primary text-white shadow"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => handleSelectionTypeChange("classroom")}
                    >
                      Classroom
                    </button>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      {selectionType === "teamClassroom"
                        ? "Team Classrooms"
                        : "My Classrooms"}
                    </label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full p-2 border rounded-full"
                      required
                    >
                      <option value="">
                        Select{" "}
                        {selectionType === "teamClassroom"
                          ? "Team Classroom"
                          : "Classroom"}
                      </option>
                      {itemsToDisplay.map((item) => (
                        <option
                          key={item.classroom_id}
                          value={item.classroom_id}
                        >
                          {item.classroom_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <DialogClose className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                      Cancel
                    </DialogClose>
                    <Button
                      type="submit"
                      className=" text-white px-4 py-2 rounded-md "
                      variant={"gradient"}
                      disabled={submitting || loading}
                    >
                      {submitting || loading ? "Assigning..." : "Assign"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <h3 className="text-xl font-medium mt-6 mb-2">
            {showTeacherAssigned
              ? "Below are classrooms Assigned to Me"
              : "Below are classrooms Assigned by me"}
          </h3>
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
          ) : showTeacherAssigned ? (
            teacherAssignedClassroomsList.length > 0 ? (
              <div className="bg-white p-4 rounded-3xl">
                <div className="py-2 flex gap-3 flex-col  md:flex-row md:justify-between mb-5 items-center">
                  {/* search Teamates */}
                  <div>
                    <Input
                      type="text"
                      placeholder="Search team by name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="py-3 w-full md:w-[300px] bg-gray-100"
                    />
                  </div>
                  {/* sample and upload csv */}
                  <div className="flex justify-end">
                    <Button onClick={handleDownloadTemplate}>
                      Sample Template
                    </Button>
                    <Button
                      onClick={handleAddStudentsClick}
                      variant={"gradient"}
                      className="rounded-md"
                    >
                      Upload CSV
                    </Button>
                  </div>
                </div>

                <BaseTable
                  // data={teacherAssignedClassroomsList}
                  data={teacherAssignedClassroomsList.filter((item) =>
                    item.classroom_name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )}
                  columns={teamClassroomColumns}
                />
              </div>
            ) : (
              <p>No Classrooms assigned to you.</p>
            )
          ) : assignedClassroomsList.length > 0 ? (
            <div className="bg-white p-4 rounded-3xl">
              <div className="py-2 flex gap-3 flex-col  md:flex-row md:justify-between mb-5 items-center">
                {/* search Teamates */}
                <div>
                  <Input
                    type="text"
                    placeholder="Search team by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="py-3 max-w-full w-[300px] bg-gray-100"
                  />
                </div>
                {/* sample and upload csv */}
                <div className="flex justify-end">
                  <Button onClick={handleDownloadTemplate}>
                    Sample Template
                  </Button>
                  <Button
                    onClick={handleAddStudentsClick}
                    variant={"gradient"}
                    className="rounded-md"
                  >
                    Upload CSV
                  </Button>
                </div>
              </div>
              <BaseTable
                // data={assignedClassroomsList}
                data={assignedClassroomsList.filter((item) =>
                  item.classroom_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )}
                columns={teamClassroomColumns}
              />
            </div>
          ) : (
            <p>No assigned classrooms found.</p>
          )}
        </>
      )}

      {activeTab === "teamMembers" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Team Members</h3>
          {inviteLoading ? (
            <p>Loading team members...</p>
          ) : inviteError ? (
            <p className="text-red-500">{inviteError}</p>
          ) : members && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="border bg-white rounded-lg p-4 shadow-sm flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold mb-4">
                    {member.firstname?.charAt(0).toUpperCase()}
                    {member.lastname?.charAt(0).toUpperCase()}
                  </div>

                  <h4 className="text-lg font-semibold">
                    {member.firstname} {member.lastname}
                  </h4>
                  <p className="text-gray-600 mb-4">{member.email}</p>
                  <div className="mt-auto flex justify-center space-x-2 w-full">
                    <Link to={`/dashboard/user-profile/${member.user_id}`}>
                      <Button variant="outline" className="rounded-full">
                        View Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="text-blue-800 underline"
                      onClick={() =>
                        navigate(
                          `/dashboard/premium/classrooms/user/${member.user_id}`
                        )
                      }
                    >
                      View {member.firstname} Classrooms
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No team members found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamClassroomPage;
