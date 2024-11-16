import { StatusType } from "../../../lib/constants";
import { cn } from "../../../lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Dot } from "lucide-react";

interface NavProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  value: StatusType;
  variant?: StatusType;
}

const buttonVariants = cva(
  "border rounded-full flex justify-center items-center p-1 font-medium capitalize pr-5 whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "text-[#1691B2] border-[#1691B2]",
        ACTIVE: "text-[#1691B2] border-[#1691B2]",
        INACTIVE: "text-[#FF1717] border-[#FF1717]",
        CLOSED: "text-[#FF1717] border-[#FF1717]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function Status({ value, variant, className }: NavProps) {
  return (
    <div className={cn(buttonVariants({ variant: value, className }))}>
      <Dot size={60} className="-m-4" />
      {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
    </div>
  );
}
