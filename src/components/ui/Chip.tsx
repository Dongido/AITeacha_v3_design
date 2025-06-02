import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";
interface ChipProps {
  children: ReactNode;
  onDismiss?: () => void;
  dismissIcon?: ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "destructive";
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      children,
      onDismiss,
      dismissIcon,
      className,
      variant = "default",
      ...props
    },
    ref
  ) => {
    const variantStyles = cn(
      "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
      {
        "bg-gray-200 text-gray-700": variant === "default",
        "bg-blue-200 text-blue-700": variant === "secondary",
        "bg-red-200 text-red-700": variant === "destructive",
      }
    );

    return (
      <div ref={ref} className={cn(variantStyles, className)} {...props}>
        {children}
        {onDismiss && dismissIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent any outer click handlers
              onDismiss();
            }}
            className="ml-1 inline-flex items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline"
            aria-label="Dismiss chip"
          >
            {dismissIcon}
          </button>
        )}
        {onDismiss && !dismissIcon && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-ring focus-visible:outline"
            aria-label="Dismiss chip"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Chip.displayName = "Chip";

export { Chip };
