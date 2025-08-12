import {
  Avatar as MTAvatar,
  AvatarProps as MTAvatarProps,
} from "@material-tailwind/react";
import React from "react";

interface CustomAvatarProps extends Partial<MTAvatarProps> {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  variant?: "circular" | "rounded" | "square";
}

const Avatar: React.FC<CustomAvatarProps> = ({
  src,
  alt,
  size = "sm",
  variant = "circular",
  ...props
}) => (
  <MTAvatar
    src={src}
    alt={alt}
    size={size}
    variant={variant}
    {...props}
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
    // FIX: Add the missing required props with empty function handlers
    onResize={() => {}}
    onResizeCapture={() => {}}
  />
);

export default Avatar;
