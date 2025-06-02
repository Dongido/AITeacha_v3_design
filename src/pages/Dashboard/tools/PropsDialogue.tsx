import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../../../components/ui/Dialogue";
import { useNavigate } from "react-router-dom";

type PropsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  content: React.ReactNode;
};

const PropsDialog: React.FC<PropsDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  content,
}) => {
  const navigate = useNavigate();

  const handleVerifyEmail = () => {
    navigate("/dashboard/upgrade");
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="my-4">{content}</div>
        <DialogFooter>
          <button
            className="bg-primary px-4 py-2 rounded mr-2"
            onClick={handleVerifyEmail}
          >
            <span className="text-white"> Upgrade</span>
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropsDialog;
