import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { buttonVariants } from "./Button";
import "react-day-picker/dist/style.css";
export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 rounded-md border shadow-sm w-fit bg-white",
        className
      )}
      components={
        {
          IconLeft: ({ ...props }) => (
            <ChevronLeft className="h-4 w-4" {...props} />
          ),
          IconRight: ({ ...props }) => (
            <ChevronRight className="h-4 w-4" {...props} />
          ),
        } as any
      }
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
