import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  onChange: (selectedValues: string[]) => void;
  selectedValues?: string[];
  placeholder?: string;
}
const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  onChange,
  selectedValues = [],
  placeholder = "Select options",
}) => {
  const toggleOption = (value: string) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(newSelection);
  };

  return (
    <SelectPrimitive.Root>
      <SelectPrimitive.Trigger
        className={cn(
          "flex h-full w-full items-center justify-between rounded-md border border-input bg-white px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#5c3cbb] focus:ring-offset-2"
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder}>
          {selectedValues.length > 0
            ? selectedValues
                .map(
                  (value) =>
                    options.find((option) => option.value === value)?.label
                )
                .join(", ")
            : placeholder}
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Content className="z-50 w-full overflow-hidden rounded-md border bg-white shadow-md">
        <SelectPrimitive.Viewport className="p-1 max-h-48 overflow-y-auto">
          {options.map((option) => (
            <SelectPrimitive.Item
              key={option.value}
              value={option.value}
              onSelect={(e) => {
                e.preventDefault();
                toggleOption(option.value);
              }}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-md hover:bg-gray-50 focus:bg-accent focus:text-accent-foreground",
                selectedValues.includes(option.value) && "bg-gray-100"
              )}
            >
              <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {selectedValues.includes(option.value) && (
                  <Check className="h-4 w-4 text-[#5c3cbb]" />
                )}
              </span>
              {option.label}
            </SelectPrimitive.Item>
          ))}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  );
};
export default MultiSelect;
