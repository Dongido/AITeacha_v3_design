import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Logo from "../../../logo.png";

const Navbar = () => {
  const navLinks = [
    { name: "Community", link: "/communities/pioneer-program" },
    { name: "Pricing", link: "/pricing" },
    { name: "Resources", link: "/educator-tools" },
    { name: "About", link: "/about" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  const location = useLocation();
  const navigate = useNavigate();

  // Check login status and role
  useEffect(() => {
    const token = Cookies.get("at-accessToken");
    if (token) {
      const userDetails = JSON.parse(
        localStorage.getItem("ai-teacha-user") || "{}"
      );
      setIsLoggedIn(true);
      if (userDetails?.role === 2 || userDetails?.role_id === 2) {
        setDashboardPath("/dashboard");
      } else if (userDetails?.role === 3 || userDetails?.role_id === 3) {
        setDashboardPath("/student/home");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Redirect logged-in user away from login page
  useEffect(() => {
    const token = Cookies.get("at-accessToken");
    if (token && location.pathname === "/auth/login") {
      navigate(dashboardPath);
    }
  }, [dashboardPath, location.pathname, navigate]);

  return (
    <div className="relative bg-white text-gray-900">
      {/* Fixed Navbar */}
      <nav className="fixed top-4 sm:top-6 left-4 sm:left-6 right-4 lg:left-[10%] lg:right-[10%] sm:right-6 z-30 bg-white shadow-sm rounded-full">
        <div className="relative max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          {/* Left: Logo */}
          <div className="flex items-center gap-6">
            <Link to="/">
              <img src={Logo} alt="AiTeacha Logo" className="w-12 h-12" />
            </Link>

            {/* Medium view links */}
            <ul className="hidden md:flex lg:hidden items-center gap-8">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.link}
                    className={`hover:text-[#6200EE] text-[#2A2929] transition-colors duration-200 font-[500] ${
                      location.pathname === link.link ? "text-[#6200EE]" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Centered nav links for large screens */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden lg:flex">
            <ul className="flex items-center gap-8 font-medium">
              {navLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.link}
                    className={`hover:text-[#6200EE] text-[#2A2929] text-lg transition-colors duration-200 ${
                      location.pathname === link.link ? "text-[#6200EE]" : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Auth buttons + Mobile menu */}
          <div className="flex items-center gap-4">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <Link
                  to={dashboardPath}
                  className="bg-[#6200EE] text-white font-semibold px-5 py-2 rounded-full shadow-md hover:opacity-90 transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-[#6200EE] font-medium hover:underline"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/auth/onboarding"
                    className="bg-[#6200EE] text-white font-semibold px-5 py-2 rounded-full shadow-md hover:opacity-90 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger / Close Button */}
            <div className="relative md:hidden">
              {/* Hamburger Icon */}
              {!menuOpen && (
                <button
                  onClick={() => setMenuOpen(true)}
                  className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
                  aria-label="Open menu"
                >
                  <svg
                    className="w-7 h-7 text-gray-800"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              )}

              {/* Close Icon (appears over same spot) */}
              {menuOpen && (
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute -top-5 right-0 p-2 rounded-md bg-white focus:outline-none z-100"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-7 h-7 text-gray-800"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } rounded-r-2xl shadow-2xl`}
      >
        <div className="p-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, i) => (
              <Link
                key={i}
                to={link.link}
                className="text-gray-800 font-medium text-lg"
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-3">
            {isLoggedIn ? (
              <Link
                to={dashboardPath}
                className="bg-[#6200EE] text-white font-semibold px-4 py-2 rounded-full shadow-md text-center"
                onClick={() => setMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-[#6200EE] font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/auth/onboarding"
                  className="bg-[#6200EE] text-white font-semibold px-4 py-2 rounded-full shadow-md text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Navbar;