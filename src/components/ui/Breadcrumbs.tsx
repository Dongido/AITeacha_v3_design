import {
  Breadcrumbs as MTBreadCrumbs,
  type BreadcrumbsProps as MTBreadcrumbsProps,
} from "@material-tailwind/react";
import React, { ReactNode } from "react";

interface CustomBreadcrumbsProps extends Partial<MTBreadcrumbsProps> {
  children: ReactNode;
  className?: string;
}

const Breadcrumbs: React.FC<CustomBreadcrumbsProps> = ({
  children,
  className,
  ...props
}) => (
  <MTBreadCrumbs
    className={className}
    {...props}
    placeholder=""
    onPointerEnterCapture={() => {}}
    onPointerLeaveCapture={() => {}}
  >
    {children}
  </MTBreadCrumbs>
);

export default Breadcrumbs;
