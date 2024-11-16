import { MenuItem as MTMenuItem } from "@material-tailwind/react";
import React, { ReactNode, CSSProperties } from "react";

interface CustomMenuItemProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

const MenuItem: React.FC<CustomMenuItemProps> = ({
  children,
  className,
  style,
  onClick,
}) => (
  <MTMenuItem
    className={className}
    style={style}
    onClick={onClick}
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
    placeholder=""
  >
    {children}
  </MTMenuItem>
);

export default MenuItem;
