import React, { ReactNode } from "react";
import {
  Navbar as MTNavbar,
  NavbarProps as MTNavbarProps,
} from "@material-tailwind/react";

interface MinimalNavbarProps extends Partial<MTNavbarProps> {
  className?: string;
  children: ReactNode;
}

const MinimalNavbar: React.FC<MinimalNavbarProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <MTNavbar
      className={className}
      placeholder=""
      onPointerEnterCapture={() => {}}
      onPointerLeaveCapture={() => {}}
      onResize={() => {}}
      onResizeCapture={() => {}}
      {...props}
    >
      {children}
    </MTNavbar>
  );
};

export default MinimalNavbar;
