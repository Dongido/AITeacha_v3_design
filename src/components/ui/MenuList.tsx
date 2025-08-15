import {
  MenuList as MTMenuList,
  MenuListProps as MTMenuListProps,
} from "@material-tailwind/react";
import React from "react";

interface CustomMenuListProps extends Partial<MTMenuListProps> {
  children: React.ReactNode;
  className?: string;
}

const MenuList: React.FC<CustomMenuListProps> = ({
  children,
  className,
  ...props
}) => (
  <MTMenuList
    className={className}
    {...props}
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
    // FIX: Add the missing required props with empty function handlers
    onResize={() => {}}
    onResizeCapture={() => {}}
  >
    {children}
  </MTMenuList>
);

export default MenuList;
