import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { Button } from "../../../../components/ui/Button";
import { TextArea } from "../../../../components/ui/TextArea";

interface CustomizeDialogProps {
  toolName: string;
  customized_name: string;
  customized_description: string;
  additional_instruction: string;
  onCustomizeChange: (field: string, value: string) => void;
}

const CustomizeDialog: React.FC<CustomizeDialogProps> = ({
  toolName,
  customized_name,
  customized_description,
  additional_instruction,
  onCustomizeChange,
}) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <Button variant="gradient" className="rounded-full">
          Customize
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg sm:rounded-lg"
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Customize {toolName}</h2>
            <DialogPrimitive.Close className="p-2 rounded-full bg-gray-200">
              <X className="h-5 w-5 text-purple-700" />
            </DialogPrimitive.Close>
          </div>
          <div className="space-y-4">
            <TextArea
              placeholder="Custom Name"
              value={customized_name}
              onChange={(e) =>
                onCustomizeChange("customized_name", e.target.value)
              }
            />
            <TextArea
              placeholder="Custom Description"
              value={customized_description}
              onChange={(e) =>
                onCustomizeChange("customized_description", e.target.value)
              }
            />
            <TextArea
              placeholder="Additional Instruction"
              value={additional_instruction}
              onChange={(e) =>
                onCustomizeChange("additional_instruction", e.target.value)
              }
            />
          </div>
          <DialogPrimitive.Close asChild>
            <Button className="mt-4 rounded-md" variant="gradient">
              Save
            </Button>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default CustomizeDialog;
