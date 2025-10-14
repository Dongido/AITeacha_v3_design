import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { loadTools, loadToolsCategory } from "../../store/slices/toolsSlice";
import { Skeleton } from "../../components/ui/Skeleton";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import dashImg from "../../assets/img/0e846ab4-992d-48b3-a818-d62a7803bd8e 1.png";
import { FaDraftingCompass, FaMagic, FaHeart } from "react-icons/fa";
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
    <div className="mt-4 ">
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

      {/* {userDetails && isEmailVerified === 1 && (
        <div
          className="bg-[#e5dbff] mt-3 mb-4 text-black p-4 rounded-md flex justify-center items-center"
          style={{
            background:
              "linear-gradient(143.6deg, rgba(192, 132, 252, 0) 20.79%, rgba(232, 121, 249, 0.26) 40.92%, rgba(204, 171, 238, 0) 70.35%)",
          }}
        >
          <span className="text-center text-xl font-bold">
            Teachers Are 
          </span>
        </div>
      )} */}
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
              <div className="bg-white inline-block pl-[16px] pr-[16px] rounded-full">
                <p className="text-sm sm:text-base bg-gradient-to-r from-[#F133E1] to-[#6200EE] bg-clip-text text-transparent font-[600] flex items-center pt-2 -pb-1">
              Teachers are heroes
            </p>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 mt-4 leading-snug">
            Hello, Inspiring Educator!
          </h2>
              <p className="text-sm sm:text-base text-black mb-5 max-w-md mx-auto md:mx-0">
            Empower your students and create meaningful learning experiences today.
          </p>
              <div className="mt-4 flex items-center gap-2">
                <Link to={"/dashboard/tools"}>
                  <button className="flex items-center bg-[#6200EE] text-white py-2 px-4 rounded-full text-sm">
                    View All tools
                    {/* <ArrowRightIcon className="h-5 w-5 ml-2" /> */}
                  </button>
                </Link>
                {/* {showUpgradeLink && upgradeText && (
                  <Link to={upgradeLink}>
                    <button className="flex hover:bg-pink-200 items-center bg-purple-100 text-black font-semibold py-2 px-4 rounded-full text-sm">
                      {upgradeText}
                    </button>
                  </Link>
                )} */}
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

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
      {stats.map((s, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm text-left flex justify-between relative"
        >
          <div>
            <h3 className="text-3xl font-semibold text-[#C2C2C2] mb-1 text-left">
              {String(s.value).padStart(2, "0")}
            </h3>
            <p className="text-sm text-primary font-medium">{s.status}</p>
            <p className="text-black text-sm">{s.label}</p>
          </div>

          <div className="">
            <a
              href={s.link}
              className="bg-[#6200EE] rounded-full px-5 py-2 text-white absolute bottom-5 right-5 text-sm"
            >
              Click here
            </a>
          </div>
        </div>
      ))}
    </div>

          {/* <div className="mt-8 flex justify-center">
            <div className="flex gap-4 overflow-x-auto">
              <Link to={"/dashboard/history"}>
                <button className="flex items-center gap-2 bg-purple-200 text-purple-800 rounded-full py-2 px-4 whitespace-nowrap">
                  <FaMagic className="h-5 w-5" />
                  History
                </button>
              </Link>
              <Link to={"/dashboard/chats"}>
                <button className="flex items-center gap-2 bg-blue-200 text-blue-800 rounded-full py-2 px-4 whitespace-nowrap">
                  <FaDraftingCompass className="h-5 w-5" />
                  Chatbot
                </button>
              </Link>
              <Link to={"/dashboard/classrooms"}>
                <button className="flex items-center gap-2 bg-primary text-white rounded-full py-2 px-4 whitespace-nowrap">
                  {" "}
                  <BiImageAdd className="h-5 w-5" />
                  Classrooms
                </button>
              </Link>
            </div>
          </div> */}
          <div className="mt-8 overflow-x-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-4 px-2">
                Popular Tools
              </h2>

              <div>
                <Link to="/dashboard/tools" className="text-[#6200EE] font-semibold">View all tools</Link>
              </div>
              {/* <div className="mb-4">
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div> */}
            </div>
            {popularTools.length > 0 && (
              <div className="mb-8 bg-white p-6 rounded-xl">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 text-center">
                  {popularTools.slice(0, 8).map((tool) => (
                    <div
                      onClick={() => handleExternalNavigation(tool)}
                      key={tool.id}
                      className="flex flex-col justify-left items-left border border-gray-300 pl-4 py-3 rounded-xl bg-[#EFE6FD] hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
                      // style={{
                      //   background: "rgba(232, 121, 249, 0.15)",
                      //   transition: "background 0.3s ease",
                      // }}
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
                          <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
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
            {/* <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xl font-bold text-gray-900">All Tools</h2>
              <Link
                to="/dashboard/tools"
                className="text-sm text-blue-600 hover:underline"
              >
                <button className="text-sm flex text-[#6200EE] font-semibold">
                  See All Tools
                  <ArrowRightIcon className="h-5 w-4 ml-2" />
                </button>
              </Link>
            </div> */}

            {/* <motion.div
              className="flex gap-4"
              whileTap={{ cursor: "grabbing" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
                {otherTools.slice(0, 15).map((tool) => (
                  <div
                    onClick={() => handleExternalNavigation(tool)}
                    key={tool.id}
                    className="flex flex-col items-left border border-gray-300 px-4 py-3 rounded-3xl bg-white hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
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
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <FaHeart className="text-purple-500 w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center" />
                      )}
                    </div>

                    <div className="text-left mt-2">
                      <h3 className="text-base capitalize font-semibold text-black">
                        {tool.name === "math calculator" ? "Solver" : tool.name}
                      </h3>
                      <p className="text-[#7C7B7B] text-sm">
                        {tool.description.charAt(0).toUpperCase() +
                          tool.description.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div> */}
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
