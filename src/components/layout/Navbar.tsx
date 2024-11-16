import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/Button";
import Text from "../ui/Text";

interface Route {
  name: string;
  path: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface NavbarProps {
  brandName?: string;
  routes: Route[];
  action?: React.ReactNode;
}

export function Navbar({
  brandName = "AI-Teacha",
  routes,
  action,
}: NavbarProps) {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {routes.map(({ name, path, icon: Icon }) => (
        <li key={name} className="capitalize">
          <Text variant="small" color="blue-gray" className="capitalize">
            <Link to={path} className="flex items-center gap-1 p-1 font-normal">
              {Icon && <Icon className="w-[18px] h-[18px] opacity-50 mr-1" />}
              {name}
            </Link>
          </Text>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-3">
      <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
        <Link to="/">
          <Text
            variant="small"
            className="mr-4 ml-2 cursor-pointer py-1.5 font-bold"
          >
            {brandName}
          </Text>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        {action &&
          React.cloneElement(action as React.ReactElement, {
            className: "hidden lg:inline-block",
          })}
        <Button
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          aria-label="Toggle navigation"
        >
          {openNav ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </Button>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          {action &&
            React.cloneElement(action as React.ReactElement, {
              className: "w-full block lg:hidden",
            })}
        </div>
      </Collapse>
    </div>
  );
}

Navbar.defaultProps = {
  action: (
    <a
      href="https://www.creative-tim.com/product/material-tailwind-dashboard-react"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button size="sm" className="w-full">
        Free Download
      </Button>
    </a>
  ),
};

export default Navbar;
