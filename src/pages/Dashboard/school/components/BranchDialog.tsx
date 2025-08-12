import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "../../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/Dialogue";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../../components/ui/Toast";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import { loadTeamMembers } from "../../../../store/slices/teamSlice";
import {
  createBranchThunk,
  updateBranchThunk,
  Branch,
  fetchBranchesThunk,
} from "../../../../store/slices/branchSlice";

interface IProps {
  branch?: Branch | null;
  onSuccess?: () => void;
}

const BranchDialog = forwardRef(
  ({ branch = null, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { members, loading: membersLoading } = useSelector(
      (state: RootState) => state.team
    );
    const { loading: branchLoading } = useSelector(
      (state: RootState) => state.branches
    );
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [selectedTeamMemberId, setSelectedTeamMemberId] =
      useState<string>("");
    const [location, setLocation] = useState<string>("");

    useEffect(() => {
      if (open && members.length === 0) {
        dispatch(loadTeamMembers());
      }
    }, [open, members, dispatch]);

    useEffect(() => {
      if (branch) {
        setSelectedTeamMemberId(branch.branch_admin_id.toString());
        console.log("Branch to edit:", branch);
        setLocation(branch.location);
      } else {
        setSelectedTeamMemberId("");
        setLocation("");
      }
    }, [branch, open]);
    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const onSubmit = async () => {
      if (!location) {
        setToastMessage("Location is required.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
      if (!userDetailsFromStorage) {
        setToastMessage("User details not found. Please log in again.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }
      const userDetails = JSON.parse(userDetailsFromStorage);
      const branchAdminId = userDetails.id;

      try {
        if (branch) {
          await dispatch(
            updateBranchThunk({
              updatedData: {
                id: branch.id,
                location: location,
                branch_admin_id: parseInt(
                  selectedTeamMemberId || branchAdminId.toString(),
                  10
                ),
              },
            })
          ).unwrap();
          dispatch(fetchBranchesThunk());
          setToastMessage("Branch updated successfully!");
        } else {
          if (!selectedTeamMemberId) {
            setToastMessage("A team member is required.");
            setToastVariant("destructive");
            setToastOpen(true);
            return;
          }
          await dispatch(
            createBranchThunk({
              teamMemberId: selectedTeamMemberId,
              branch_admin_id: selectedTeamMemberId || branchAdminId,
              location: location,
            })
          ).unwrap();
          dispatch(fetchBranchesThunk());
          setToastMessage("Branch created successfully!");
        }

        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        setSelectedTeamMemberId("");
        setLocation("");
        onSuccess();
      } catch (error: any) {
        setToastMessage(error || "An error occurred.");
        setToastVariant("destructive");
        setToastOpen(true);
      }
    };

    const isEditMode = !!branch;

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Branch" : "Create New Branch"}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription>
                {isEditMode
                  ? "Update the details for this branch."
                  : "Select a team member to be the branch admin and enter the location."}
              </DialogDescription>

              <div className="mt-4 grid gap-4">
                <div>
                  <Label htmlFor="team-member">
                    Team Member (Branch Admin)
                  </Label>
                  <Select
                    value={selectedTeamMemberId}
                    onValueChange={setSelectedTeamMemberId}
                    defaultValue={selectedTeamMemberId}
                    disabled={membersLoading}
                  >
                    <SelectTrigger className="h-1/2">
                      <SelectValue placeholder="Select a team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map((member) => (
                        <SelectItem key={member.user_id} value={member.user_id}>
                          {member.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter branch location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  variant="gradient"
                  className="rounded-md"
                  disabled={branchLoading || membersLoading}
                >
                  {isEditMode
                    ? branchLoading
                      ? "Saving..."
                      : "Save Changes"
                    : branchLoading
                    ? "Creating..."
                    : "Create Branch"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  disabled={branchLoading}
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

export default BranchDialog;
