import React, { useImperativeHandle, useState, forwardRef } from "react";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { loadTeamMembers } from "../../../store/slices/teamSlice";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import {
  getAssignedTeamClassrooms,
  getTeacherAssignedTeamClassrooms,
} from "../../../store/slices/teamClassroomSlice";
import { changeTeamMemberRole } from "../../../api/teams";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/Select";

interface IProps {
  userId: string;
  teamId: string;
  firstname: string;
  lastname: string;
  currentTeamRole: string;
  onSuccess?: () => void;
}

export interface EditTeacherRoleDialogRef {
  openDialog: (
    userId: string,
    teamId: string,
    firstname: string,
    lastname: string,
    currentTeamRole: string
  ) => void;
}

const EditTeacherRoleDialog = forwardRef(
  ({ onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [currentTeamId, setCurrentTeamId] = useState<string>("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [currentFirstname, setCurrentFirstname] = useState<string>("");
    const [currentLastname, setCurrentLastname] = useState<string>("");

    useImperativeHandle(ref, () => ({
      openDialog: (
        userId: string,
        teamId: string,
        firstname: string,
        lastname: string,
        currentTeamRole: string
      ) => {
        setCurrentUserId(userId);
        setCurrentTeamId(teamId);
        setCurrentFirstname(firstname);
        setCurrentLastname(lastname);
        setSelectedRole(currentTeamRole);
        setOpen(true);
      },
    }));

    const onSubmit = async () => {
      try {
        setIsUpdating(true);
        await changeTeamMemberRole(currentTeamId, currentUserId, selectedRole);
        dispatch(getAssignedTeamClassrooms());
        dispatch(getTeacherAssignedTeamClassrooms());

        await dispatch(loadTeamMembers());

        setToastMessage("Teacher role updated successfully!");
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        onSuccess();
      } catch (error: any) {
        setToastMessage(error.message || "Failed to update teacher role.");
        setToastVariant("destructive");
        setToastOpen(true);
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>
                  Edit Role for {currentFirstname} {currentLastname}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                Select the new role for {currentFirstname} {currentLastname}{" "}
                within this team.
              </DialogDescription>
              <div className="my-4">
                <label
                  htmlFor="role-select"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  New Role
                </label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value)}
                  disabled={isUpdating}
                >
                  <SelectTrigger id="role-select" className="w-full h-1/2">
                    <SelectValue
                      placeholder="Select a role"
                      className="w-full py-2"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="my-4">
                <Button
                  onClick={onSubmit}
                  variant="gradient"
                  className="rounded-md  text-white"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Role"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  disabled={isUpdating}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Toast
            open={toastOpen}
            onOpenChange={setToastOpen}
            variant={toastVariant}
          >
            <ToastTitle>{toastMessage}</ToastTitle>
          </Toast>
          <ToastViewport />
        </>
      </ToastProvider>
    );
  }
);

export default EditTeacherRoleDialog;
