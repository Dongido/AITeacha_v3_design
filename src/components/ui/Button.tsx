import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap  text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent text-black hover:bg-primary/90",
        dark: "bg-black text-white",
        green: "bg-green-500 text-white hover:bg-green-700 transition",
        destructive: "bg-red-700 text-white hover:bg-red-900",
        danger: "border border-[#2A2929] px-6 py-2 rounded-full",
        outline:
          "border border-input bg-background text-primary hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        "ghost-inner": "hover:bg-accent text-gray-600 hover:text-gray-800",
        "default-inner": "text-primary bg-primary/10 hover:bg-primary/20",
        gradient:
          "bg-[#EFE6FD] text-black border-r-[#6200EE] hover:opacity-90",
        black: "bg-black text-white hover:bg-gray-100 hover:text-gray-800",
        outlined: "border border-primary text-primary hover:bg-primary/10",
        gray: "bg-gray-400 text-black",
        text: "bg-transparent text-primary hover:bg-primary/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...props}
        className={cn(buttonVariants({ variant, size }), className)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
