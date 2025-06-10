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
  loadTeamClassrooms,
  loadClassrooms,
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
import { useNavigate } from "react-router-dom";

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

  if (loading) {
    return (
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
    );
  }

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
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Team Classroom Management</h2>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger className="bg-primary text-white px-4 py-2 rounded-full">
          Add Team Member
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Team Member</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAssign} className="space-y-4">
            <div className="mt-4">
              <label className="block text-gray-700">Select Team Member</label>
              <select
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
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

            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectionType"
                  value="teamClassroom"
                  checked={selectionType === "teamClassroom"}
                  onChange={() => handleSelectionTypeChange("teamClassroom")}
                  className="mr-2"
                />
                Team Classroom
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selectionType"
                  value="classroom"
                  checked={selectionType === "classroom"}
                  onChange={() => handleSelectionTypeChange("classroom")}
                  className="mr-2"
                />
                Classroom
              </label>
            </div>

            <div>
              <label className="block text-gray-700">
                {selectionType === "teamClassroom"
                  ? "Team Classroom"
                  : "Classroom"}
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">
                  Select{" "}
                  {selectionType === "teamClassroom"
                    ? "Team Classroom"
                    : "Classroom"}
                </option>
                {itemsToDisplay.map((item) => (
                  <option key={item.classroom_id} value={item.classroom_id}>
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

      <div className="flex items-center space-x-2 my-4">
        <span className="text-md font-semibold">
          Show Teacher Assigned Classrooms
        </span>
        <Switch
          checked={showTeacherAssigned}
          onCheckedChange={(checked) => setShowTeacherAssigned(checked)}
        />
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">
        {showTeacherAssigned
          ? "Teacher Assigned Classrooms"
          : "Assigned Classrooms"}
      </h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : showTeacherAssigned ? (
        teacherAssignedClassroomsList.length > 0 ? (
          <BaseTable
            data={teacherAssignedClassroomsList}
            columns={teamClassroomColumns}
          />
        ) : (
          <p>No teacher-assigned classrooms found.</p>
        )
      ) : assignedClassroomsList.length > 0 ? (
        <BaseTable
          data={assignedClassroomsList}
          columns={teamClassroomColumns}
        />
      ) : (
        <p>No assigned classrooms found.</p>
      )}
    </div>
  );
};

export default TeamClassroomPage;
