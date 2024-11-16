import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import brandImg from "../../../logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/", current: true },
    { name: "Pricing", href: "#" },
    { name: "Features", href: "#" },
    { name: "FAQs", href: "#" },
    { name: "Blogs", href: "#" },
    { name: "Contact", href: "#" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md dark:bg-gray-800" : "bg-transparent"
      }`}
    >
      <nav className="border-gray-200 px-2 lg:px-12 py-2.5">
        <div className="flex flex-wrap justify-between items-center mx-auto py-3">
          <Link to="/" className="flex items-center">
            <img
              src={brandImg}
              className="mr-2 h-6 sm:h-9"
              alt="AI Teacha Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              AI Teacha
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <Link
              to="/auth/login"
              className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
            >
              Log in
            </Link>
            <Link
              to="/auth/sign-up"
              className="text-white bg-primary focus:ring-4 focus:ring-primary-300 font-medium rounded-full text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
            >
              Get started
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`${
              menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
            } lg:flex lg:opacity-100 lg:max-h-full lg:relative lg:bg-transparent absolute top-full left-0 w-full bg-white lg:w-auto z-40 lg:z-auto transition-[max-height,opacity] duration-500 ease-in-out overflow-hidden`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className={`block py-2 pr-2 pl-2 ${
                      link.current
                        ? "text-primary lg:bg-transparent"
                        : "text-gray-700"
                    } lg:p-2`}
                    aria-current={link.current ? "page" : undefined}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
