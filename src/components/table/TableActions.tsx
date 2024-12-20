import { Button } from "../ui/Button";
import { EditIcon, Eye, EllipsisVertical, Trash, FileText } from "lucide-react";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Link } from "react-router-dom";

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
}: {
  viewLink?: string;
  editLink?: string;
  attemptLink?: string;
  isHidden?: boolean;
  hideFunction?: () => Promise<void>;
  editButton?: ReactNode;
  viewFunction?: () => Promise<void>;
  editFunction?: () => Promise<void>;
  deleteFunction?: () => Promise<void>;
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

        {attemptLink && ( // New Attempt Assignment action
          <DropdownMenuItem
            asChild
            className="flex gap-2 p-1 hover:bg-gray-100"
          >
            <Link to={attemptLink}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20">
                <FileText size={17} className="text-blue-600" />
              </div>
              <p>Attempt Assignment</p>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
