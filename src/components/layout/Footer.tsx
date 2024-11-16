import Text from "../ui/Text";
import { HeartIcon } from "@heroicons/react/24/solid";
import { FooterProps } from "../../interfaces";

export function Footer({
  brandName = "AI-Teacha",
  brandLink = "https://www.creative-tim.com",
  routes = [
    { name: "AI-Teacha", path: "https://www.creative-tim.com" },
    { name: "About Us", path: "https://www.creative-tim.com/presentation" },
    { name: "Blog", path: "https://www.creative-tim.com/blog" },
    { name: "License", path: "https://www.creative-tim.com/license" },
  ],
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-2">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Text variant="small" className="font-normal text-inherit">
          &copy; {year}, made with{" "}
          <HeartIcon className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" />{" "}
          by{" "}
          <a
            href={brandLink}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-blue-500 font-bold"
          >
            {brandName}
          </a>{" "}
          for a better web.
        </Text>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Text
                as="a"
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
              >
                {name}
              </Text>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
