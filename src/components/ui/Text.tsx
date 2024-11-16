import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { CSSProperties, ReactNode } from "react";

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  as?: "span" | "p" | "a" | "div";
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  variant?: "small" | "large" | "title";
  color?: string;
  href?: string; // To enable href for anchor tags
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const Text: React.FC<TextProps> = ({
  asChild,
  as = "span",
  children,
  style,
  className,
  variant,
  color,
  href,
  target,
  rel,
  ...props
}) => {
  const Comp = asChild ? Slot : as;

  const customStyle: CSSProperties = {
    fontSize:
      variant === "small" ? "12px" : variant === "large" ? "18px" : "16px",
    color: color || "inherit",
    ...style,
  };

  return (
    <Comp
      className={className}
      style={customStyle}
      href={as === "a" ? href : undefined}
      target={as === "a" ? target : undefined}
      rel={as === "a" ? rel : undefined}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Text;
