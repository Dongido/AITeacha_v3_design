import { Button } from "../ui/Button";
import {
  EditIcon,
  Eye,
  EllipsisVertical,
  Trash,
  Play,
  Pause,
  FileText,
  UserCog, // Import UserCog icon for role editing
} from "lucide-react"; // Make sure to import UserCog
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";

export default function Actions<T>({
  viewLink,

  editLink,
  attemptLink,
  isHidden,
  hideFunction,
  editFunction,
  viewFunction,
  editButton,
  deleteFunction,
  activateFunction,
  deactivateFunction,
  editRoleFunction,
  viewParticipant,
  viewPerformanceLink,
}: {
  viewLink?: string;

  editLink?: string;
  attemptLink?: string;
  isHidden?: boolean;
  viewParticipant?: string;
  hideFunction?: () => Promise<void>;
  editButton?: ReactNode;
  viewFunction?: () => Promise<void>;
  editFunction?: () => Promise<void>;
  deleteFunction?: () => Promise<void>;
  activateFunction?: () => Promise<void>;
  deactivateFunction?: () => Promise<void>;
  editRoleFunction?: () => Promise<void>;
  viewPerformanceLink?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-purple-50 hover:p-3 border hover:border-purple-200"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" forceMount>
        {viewLink ? (
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={viewLink}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600/20">
                <Eye size={17} className="text-green-600" />
              </div>
              <p>View</p>
            </Link>
          </DropdownMenuItem>
        ) : viewFunction ? (
          <DropdownMenuItem
            onClick={() => viewFunction()}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600/20">
              <Eye size={17} className="text-green-600" />
            </div>
            <p>View</p>
          </DropdownMenuItem>
        ) : null}

        {editLink ? (
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={editLink}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
                <EditIcon size={17} className="text-primary" />
              </div>
              <p>Edit</p>
            </Link>
          </DropdownMenuItem>
        ) : editFunction ? (
          <DropdownMenuItem
            onClick={() => editFunction()}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-50">
              <EditIcon size={17} className="text-primary" />
            </div>
            <p>Edit</p>
          </DropdownMenuItem>
        ) : null}

        {editRoleFunction && (
          <DropdownMenuItem
            onClick={() => editRoleFunction()}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
              <UserCog size={17} className="text-blue-500" />
            </div>
            <p>Edit Role</p>
          </DropdownMenuItem>
        )}

        {attemptLink && (
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={attemptLink}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20">
                <FileText size={17} className="text-blue-600" />
              </div>
              <p>Attempt </p>
            </Link>
          </DropdownMenuItem>
        )}
        {viewPerformanceLink && (
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={viewPerformanceLink}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600/20">
                <FileText size={17} className="text-orange-600" />
              </div>
              <p>View Performance </p>
            </Link>
          </DropdownMenuItem>
        )}

        {viewParticipant && (
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={viewParticipant}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20">
                <FaUsers size={16} className="text-blue-600" />
              </div>
              <p className="pt-1">Participant </p>
            </Link>
          </DropdownMenuItem>
        )}

        {deleteFunction && (
          <DropdownMenuItem
            onClick={() => deleteFunction()}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
              <Trash size={17} className="text-red-500" />
            </div>
            <p>Delete</p>
          </DropdownMenuItem>
        )}

        {activateFunction && (
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              activateFunction();
            }}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20">
              <Play size={17} className="text-green-500" />
            </div>
            <p>Activate</p>
          </DropdownMenuItem>
        )}

        {deactivateFunction && (
          <DropdownMenuItem
            onClick={() => deactivateFunction()}
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20">
              <Pause size={17} className="text-red-500" />
            </div>
            <p>Deactivate</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
