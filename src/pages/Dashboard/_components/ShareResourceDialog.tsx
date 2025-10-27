import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button } from "../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/Dialogue";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  shareResourceThunk,
  loadResources,
} from "../../../store/slices/teamResourcesSlice";
import { loadTeamMembers } from "../../../store/slices/teamSlice";
import { loadUserResources } from "../../../store/slices/resourcesSlice";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
} from "../../../components/ui/Toast";
import { Label } from "../../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import { FormLabel } from "../../../components/ui/Form";

interface IProps {
  resourceName: string;
  resourceId: string;
  onSuccess?: () => void;
}

const ShareResourceDialog = forwardRef(
  ({ resourceName, resourceId, onSuccess = () => {} }: IProps, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const { members, loading: membersLoading } = useSelector(
      (state: RootState) => state.team
    );
    const { shareResourceLoading, shareResourceError } = useSelector(
      (state: RootState) => state.teamResources
    );
    const { resources, loading: resourcesLoading } = useSelector(
      (state: RootState) => state.resources
    );
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
      "default"
    );
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedResourceId, setSelectedResourceId] = useState<string>("");

    useEffect(() => {
      if (open && members.length === 0) {
        dispatch(loadTeamMembers());
      }
      if (open && resources.length === 0) {
        dispatch(loadUserResources());
      }
    }, [open, members, resources, dispatch]);

    useImperativeHandle(ref, () => ({
      openDialog: () => setOpen(true),
    }));

    const onSubmit = async () => {
      if (!selectedUserId || !selectedResourceId) {
        setToastMessage("Both User and Resource are required.");
        setToastVariant("destructive");
        setToastOpen(true);
        return;
      }

      try {
        await dispatch(
          shareResourceThunk({
            userId: selectedUserId,
            resourceId: selectedResourceId,
          })
        ).unwrap();
        setToastMessage("Resource shared successfully!");
        await dispatch(loadResources());
        if (shareResourceError) {
          setToastMessage(shareResourceError);
          setToastVariant("destructive");
          setToastOpen(true);
        }
        setToastVariant("default");
        setToastOpen(true);
        setOpen(false);
        setSelectedUserId("");
        onSuccess();
      } catch (error: any) {
        setToastMessage(error || "An error occurred.");
        setToastVariant("destructive");
        setToastOpen(true);
      }
    };

    return (
      <ToastProvider swipeDirection="right">
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[450px] h-[450px] text-gray-800">
              <DialogHeader>
                <DialogTitle>Share Resource</DialogTitle>
              </DialogHeader>
              <DialogDescription className="m-0 p-0">
                Enter the User and Resource to Share{" "}
                <strong>{resourceName}</strong>.
              </DialogDescription>

              <div className="">
                <label className="font-semibold mb-2">
                  Team Member
                </label>
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger  className="h-10 rounded-full">
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

              <div className="">
                <label className="font-semibold mb-2">
                  Resource
                </label>
                <Select
                  value={selectedResourceId}
                  onValueChange={setSelectedResourceId}
                  
                >
                  <SelectTrigger  className="h-10 rounded-full">
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.prompt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  onClick={onSubmit}
                  variant="gradient"
                  className="rounded-md"
                  disabled={shareResourceLoading || membersLoading}
                >
                  {shareResourceLoading ? "Sharing..." : "Share"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="ghost"
                  disabled={shareResourceLoading}
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

export default ShareResourceDialog;
