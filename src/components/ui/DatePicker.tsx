import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "../../lib/utils";
import { Button } from "./Button";
import { Calendar } from "./Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Input } from "./Input";
import { Label } from "./Label";

interface DateTimePickerProps {
  className?: HTMLElement["className"];
  placeholder?: string;
  onChange?: (dateTime: Date | undefined) => void;
  defaultValue?: Date;
}

export function DateTimePicker({
  className,
  placeholder = "Pick date and time",
  onChange,
  defaultValue,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  const [timeString, setTimeString] = React.useState<string>(
    defaultValue ? format(defaultValue, "HH:mm") : ""
  );

  React.useEffect(() => {
    if (date) {
      const [hoursStr, minutesStr] = timeString.split(":");
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      if (!isNaN(hours) && !isNaN(minutes)) {
        const newDate = new Date(date);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        setDate(newDate);
        if (onChange) {
          onChange(newDate);
        }
      } else if (onChange) {
        onChange(date);
      }
    } else if (onChange) {
      onChange(undefined);
    }
  }, [timeString, date, onChange]);

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate && !timeString) {
      setTimeString("00:00");
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimeString(event.target.value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[320px] font-normal border border-gray-400 rounded-md",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP HH:mm")
          ) : (
            <span className="text-lg text-black">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="grid gap-2">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="" // Removed potential extra spacing class
          />
          <div className="grid grid-cols-2 items-center gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={timeString}
              onChange={handleTimeChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
