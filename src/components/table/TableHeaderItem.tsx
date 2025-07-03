import { cn } from "../../lib/utils";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function Header<T, K>({
  title,
  column,
  className,
}: {
  title: React.ReactNode;
  column: Column<T, K>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex items-center text-black text-base gap-2 capitalize whitespace-nowrap",
        className
      )}
    >
      {title}
      {column.getCanSort() ? (
        <button
          type="button"
          onClick={() => column.toggleSorting()}
          className="hover:bg-gray-200 rounded p-1"
        >
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={15} />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown size={15} />
          ) : (
            <ArrowUp size={15} className="opacity-0 hover:opacity-100" />
          )}
        </button>
      ) : undefined}
    </span>
  );
}
