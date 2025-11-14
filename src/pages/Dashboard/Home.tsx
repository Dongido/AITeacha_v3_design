import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadTools, loadToolsCategory } from "../../store/slices/toolsSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { IoSparklesSharp } from "react-icons/io5";
import dashImg from "../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { FaDraftingCompass, FaMagic, FaHeart, FaLongArrowAltRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "../../components/ui/Dialogue";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { checkEligibility } from "../../api/tools";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { getNotification } from "../../store/slices/notificationsSlice";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import {
  checkProfileCompletion,
  checkInterestCompletion,
} from "../../api/checkCompletion";

SwiperCore.use([Navigation, Pagination, Autoplay, A11y]);

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { tools, loading, error, categories, categoryLoading } = useSelector(
    (state: RootState) => state.tools
  );

  const { notificationList } = useSelector(
    (state: RootState) => state.notifications
  );

  // console.log("notificationlist", notificationList);

  const [userDetails, setUserDetails] = useState<any>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [latestNotification, setLatestNotification] = useState<any>(null);
  const [isNotificationDismissed, setIsNotificationDismissed] = useState(() => {
    const dismissedDate = localStorage.getItem("dismissedDate");
    const today = new Date().toDateString();
    return dismissedDate === today;
  });

  const stats = [
    { label: "Classrooms", value: 12, status: "Total", link: "" },
    { label: "Students", value: 105, status: "Total", link: "" },
    { label: "Assignments", value: 4, status: "Active", link: "" },
  ];

  // console.log("latestnotification", latestNotification);

  useEffect(() => {
    if (tools.length === 0) {
      dispatch(loadTools());
    }
    if (categories.length === 0) {
      dispatch(loadToolsCategory());
    }
  }, [dispatch, tools.length]);

  useEffect(() => {
    const checkCompletion = async () => {
      try {
        const token = Cookies.get("at-accessToken");
        if (!token) return;

        const decoded: any = jwtDecode(token);
        const userId = String(decoded.id);

        const profileComplete = await checkProfileCompletion(userId);
        const interestComplete = await checkInterestCompletion(userId);

        // if (!profileComplete) {
        //   console.log("🧭 Redirecting to /auth/complete-profile");
        //   navigate("/complete-profile");
        //   return;
        // }


        // if (!profileComplete) {
        //   console.log("🧭 Redirecting to /auth/complete-profile");
        //   navigate("/complete-profile");
        //   return;
        // }

        //  const interestSkipped = sessionStorage.getItem("interestSkipped");


      // console.log(interestSkipped)
      // if (!interestComplete && !interestSkipped) {
      //   console.log("🧭 Redirecting to /interest");
      //   navigate("/interest");
      //   return;
      // }


        const interestSkipped = sessionStorage.getItem("interestSkipped");

        console.log(interestSkipped);
        if (!interestComplete && !interestSkipped) {
          console.log("🧭 Redirecting to /interest");
          navigate("/interest");
          return;
        }
      } catch (err) {
        console.error("Error checking completion:", err);
      }
    };

    checkCompletion();
  }, [navigate]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");

    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setIsEmailVerified(parsedDetails.is_email_verified);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(notificationList) && notificationList.length > 0) {
      const now = new Date();
      const activeNotifications = notificationList
        .filter((notification) => {
          const expiry = new Date(notification.expiry_date);
          return notification.status === "active" && expiry > now;
        })
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      if (activeNotifications.length > 0) {
        setLatestNotification(activeNotifications[0]);
      }
    }
  }, [notificationList]);

  useEffect(() => {
    dispatch(getNotification());
  }, []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleToolClick = async (toolId: number, slug: string) => {
    try {
      const eligibility = await checkEligibility(toolId);
      if (eligibility) {
        navigate(`/dashboard/tools/${slug}`);
      } else {
        setIsDialogOpen(true);
      }
    } catch (error) {
      setIsDialogOpen(true);
    }
  };
  const getUpgradeText = () => {
    if (userDetails?.package === "AI Teacha Enterprise") {
      return "You're all set with AI Teacha Enterprise.";
    } else if (userDetails?.package === "AI Teacha Pro") {
      return "Upgrade to Premium";
    } else if (userDetails?.package === "AI Teacha Premium") {
      return "You're all set with AI Teacha Premium.";
    } else {
      return "Upgrade to Pro";
    }
  };

  const upgradeText = getUpgradeText();
  const showUpgradeLink =
    userDetails?.package !== "AI Teacha Enterprise" &&
    userDetails?.package !== "AI Teacha Premium";

  const upgradeLink = "/dashboard/upgrade";
  const filteredTools =
    selectedCategory && selectedCategory !== "all"
      ? tools.filter((tool) => tool.category === selectedCategory)
      : tools;

  const popularTools = filteredTools.filter((tool) => tool.tag === "popular");
  const otherTools = filteredTools.filter((tool) => tool.tag !== "popular");

  const handleExternalNavigation = async (tool: any) => {
    try {
      const eligibility = await checkEligibility(tool.id);
      if (eligibility) {
        switch (tool.service_id) {
          case "career guidance and counseling":
            window.location.href = "/dashboard/career-guidance";
            break;
          case "school staff workload management":
            window.location.href = "/dashboard/staff-work-management";
            break;
          case "student support screening assistant":
            window.location.href =
              "/dashboard/student-support-screening-assistant";
            break;
          case "virtual lab simulator":
            window.location.href = "/dashboard/virtual-lab-simulator";
            break;
          case "school Document and report generator":
            window.location.href = "/dashboard/report-generator";
            break;
          default:
            handleToolClick(tool.id, tool.slug);
        }
      } else {
        setIsDialogOpen(true);
      }
    } catch (error) {
      setIsDialogOpen(true);
    }
  };
  return (
    <div className="mt-4 p-4 md:p-[30px]">
      {latestNotification && !isNotificationDismissed && (
        <div
          className="text-black border px-4 py-3 rounded mb-4 overflow-hidden w-[80%] mx-auto"
          style={{
            background: "linear-gradient(135deg, #fffde4, #f9d423)",
            position: "relative",
          }}
        >
          <div
            onClick={() => {
              setIsNotificationDismissed(true);
              localStorage.setItem("dismissedDate", new Date().toDateString());
            }}
            className="absolute -top-3 right-2 p-3 cursor-pointer z-10"
          >
            <span className="text-black text-4xl font-bold">×</span>
          </div>

          <div className="marquee-container">
            <div className="marquee-text text-2xl">
              📢 <strong className="font-bold">Update:</strong>{" "}
              {latestNotification.title}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full mx-auto rounded-lg" />

          <div className="grid grid-cols-4 gap-4 mt-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div>
          <div className="relative mt-4">
            <div className="bg-[#EFE6FD] text-white p-8 rounded-lg overflow-hidden">
              <div className="bg-white inline-flex items-center justify-center pl-[16px] pr-[16px] rounded-full">
                <p className="text-sm m-0 py-1 sm:text-base bg-gradient-to-r from-[#F133E1] to-[#6200EE] bg-clip-text text-transparent font-[600] flex items-center ">
                  Teachers are heroes
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 mt-4 leading-snug">
                Hello, Inspiring Educator!
              </h2>
              <p className="text-sm sm:text-base text-black mb-5 max-w-md mx-auto md:mx-0">
                Empower your students and create meaningful learning experiences
                today.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Link to={"/dashboard/classrooms"}>
                  <button className="flex font-semibold items-center bg-[#6200EE] text-white py-2 px-4 rounded-full hover:bg-purple-300 transition  text-sm">
                    View Classrooms
                  </button>
                </Link>
                <Link to={"/dashboard/test"}>
                  <button className="flex font-semibold items-center bg-[#ffffff] text-primary py-2 px-4 rounded-full hover:bg-purple-300 transition hover:text-white text-sm">
                    View Test & Exams
                  </button>
                </Link>
              </div>
            </div>

            <img
              src={dashImg}
              alt="Robot reading a book"
              className="absolute lg:block hidden"
              style={{
                height: "300px",
                right: "10%",
                top: "45%",
                transform: "translateY(-50%)",
              }}
            />
          </div>

          <section className="relative text-center mt-10 mb-10">
            {/* Decorative background glow */}
            <motion.h2 className="relative text-xl sm:text-3xl md:text-4xl font-semibold text-[#6200EE] mb-4 inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] to-[#6200EE]">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EFE6FD] to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black, transparent)",
                  maskImage:
                    "linear-gradient(to right, transparent, black, transparent)",
                }}
              />
              Zyra is here to Assist you!
            </motion.h2>

            {/* <p className="text-[#3B3A3A] max-w-xl mx-auto mb-8">
              Zyra is here to assist you with educational tasks, provide
              resources, and answer your questions.
            </p> */}

            {/* CTA Button with Subtle Pulse */}
            <motion.button
              className="relative bg-[#6200EE] hover:bg-[#5200cc] text-sm md:text-base text-white px-3 py-2 md:px-8 md:py-4 rounded-full flex items-center justify-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard/chats")}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              ✨ Chat with Zyra
            </motion.button>
          </section>

          <div className="mt-8 overflow-x-auto">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl m-0 font-bold text-gray-900 px-2">
                Popular Tools
              </h2>

              
              <Link
                to="/dashboard/tools"
                className=" flex items-center gap-1 px-4 py-2 font-semibold transition "
              >
                View all tools <FaLongArrowAltRight />
              </Link>
              
            </div>
            {popularTools.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 text-center">
                  {popularTools.slice(0, 8).map((tool) => (
                    <div
                      onClick={() => handleExternalNavigation(tool)}
                      key={tool.id}
                      className="flex flex-col justify-left items-left border border-gray-300 pl-4 py-3 rounded-xl bg-[#EFE6FD] hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                    >
                      <div className="text-primary text-2xl mr-4">
                        {tool.thumbnail ? (
                          <img
                            src={
                              tool.thumbnail.startsWith("http")
                                ? tool.thumbnail
                                : `https://${tool.thumbnail}`
                            }
                            alt={tool.name || "Tool Thumbnail"}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <FaHeart className="text-[#6200EE] w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                        )}
                      </div>

                      <div className="text-left mt-3">
                        <h3 className="text-base capitalize font-semibold">
                          {tool.name === "math calculator"
                            ? "Solver"
                            : tool.name}
                        </h3>
                        <p className="text-[#000] text-sm max-w-sm mx-auto">
                          {tool.description.charAt(0).toUpperCase() +
                            tool.description.slice(1)}
                        </p>
                      </div>
                      {tool.tag === "new" && (
                        <div className="absolute bottom-2 right-2 bg-primary text-white text-xs font-semibold py-1 px-2 rounded-full">
                          New
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader className="flex justify-center items-center mx-auto text-center">
            <DialogTitle>Eligibility Check</DialogTitle>
            <DialogDescription className="text-xl font-medium">
              You are not eligible to access this tool.
            </DialogDescription>
            <Link to={"/dashboard/upgrade"}>
              <Button variant={"gradient"} className="rounded-full mt-6">
                Please Upgrade your Plan to use this
              </Button>
            </Link>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              className=" text-black rounded-lg p-2"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
