import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBook, FaRss, FaFileAlt, FaClipboard } from "react-icons/fa";

interface ToolboxItem {
  id: number;
  icon: JSX.Element;
  title: string;
  content: string;
}

const toolboxItems: ToolboxItem[] = [
  {
    id: 1,
    icon: <FaRss />,
    title: "Live Classes",
    content: "Engage in interactive sessions with experienced instructors.",
  },
  {
    id: 2,
    icon: <FaBook />,
    title: "Course Library",
    content: "Explore a comprehensive library of curated courses.",
  },
  {
    id: 3,
    icon: <FaFileAlt />,
    title: "Assignments",
    content: "Complete assignments and improve your learning skills.",
  },
  {
    id: 4,
    icon: <FaBook />,
    title: "Quizzes",
    content: "Test your knowledge with various quizzes and assessments.",
  },
  {
    id: 5,
    icon: <FaClipboard />,
    title: "Progress Tracking",
    content: "Monitor your learning journey and achieve your goals.",
  },
  {
    id: 6,
    icon: <FaBook />,
    title: "Resource Materials",
    content: "Access additional study materials and resources.",
  },
  {
    id: 7,
    icon: <FaBook />,
    title: "AI-Powered Feedback",
    content: "Receive personalized feedback through AI-powered analytics.",
  },
  {
    id: 8,
    icon: <FaBook />,
    title: "Discussion Forums",
    content: "Participate in discussions with peers and instructors.",
  },
  {
    id: 9,
    icon: <FaBook />,
    title: "E-Books",
    content: "Read and download e-books for offline learning.",
  },
  {
    id: 10,
    icon: <FaBook />,
    title: "Certification",
    content: "Earn certificates upon course completion.",
  },
  {
    id: 11,
    icon: <FaBook />,
    title: "Study Planner",
    content: "Organize your schedule with our study planning tool.",
  },
  {
    id: 12,
    icon: <FaBook />,
    title: "Support Center",
    content: "Get assistance from our support team for any queries.",
  },
  {
    id: 13,
    icon: <FaClipboard />,
    title: "Peer Reviews",
    content: "Get constructive feedback from peers on your assignments.",
  },
  {
    id: 14,
    icon: <FaFileAlt />,
    title: "Project Work",
    content: "Work on real-world projects to apply your knowledge.",
  },
  {
    id: 15,
    icon: <FaRss />,
    title: "News & Updates",
    content: "Stay updated with the latest industry news and trends.",
  },
  {
    id: 16,
    icon: <FaBook />,
    title: "Career Counseling",
    content: "Receive guidance on your career path and opportunities.",
  },
  {
    id: 17,
    icon: <FaFileAlt />,
    title: "Interactive Case Studies",
    content: "Analyze case studies for practical problem-solving skills.",
  },
  {
    id: 18,
    icon: <FaClipboard />,
    title: "Leaderboards",
    content: "See how you rank among other learners in the platform.",
  },
  {
    id: 19,
    icon: <FaBook />,
    title: "Webinars",
    content: "Attend webinars led by industry experts and instructors.",
  },
  {
    id: 20,
    icon: <FaRss />,
    title: "Daily Learning Goals",
    content: "Set and track your daily learning objectives.",
  },
  {
    id: 21,
    icon: <FaClipboard />,
    title: "Internship Opportunities",
    content: "Explore internship opportunities related to your courses.",
  },
  {
    id: 22,
    icon: <FaBook />,
    title: "Self-Assessment Tests",
    content: "Evaluate your knowledge through self-assessment tests.",
  },
  {
    id: 23,
    icon: <FaRss />,
    title: "Community Challenges",
    content: "Join learning challenges and compete with peers.",
  },
  {
    id: 24,
    icon: <FaClipboard />,
    title: "Progress Reports",
    content: "Receive detailed reports on your learning progress.",
  },
];

const ToolboxPage: React.FC = () => {
  const [displayItems, setDisplayItems] = useState<ToolboxItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const itemsToShow = screenWidth < 640 ? 8 : 12;

    const updateDisplayItems = () => {
      const start = currentIndex * itemsToShow;
      const end = start + itemsToShow;
      setDisplayItems(toolboxItems.slice(start, end));
    };

    updateDisplayItems();

    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex + 1) % Math.ceil(toolboxItems.length / itemsToShow)
      );
      updateDisplayItems();
    }, 1500);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="mx-auto mt-12 px-4 md:px-12 text-white">
      <h2 className="text-3xl font-extrabold text-gray-900">
        Over 37 Powerful tools
      </h2>
      <h2 className="text-lg font-medium text-gray-700 mb-6">
        Handle all administrative or learning tasks with our AI toolbox
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-center mx-auto">
        {displayItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex items-center border border-gray-300 px-4 py-3 rounded-md hover:bg-gray-50 cursor-pointer transition duration-500 ease-in-out transform hover:scale-105"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="text-primary text-2xl mr-4">{item.icon}</div>
            <div className="text-left">
              <h3 className="text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-700 text-sm">{item.content}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <button className="mt-8 px-4 py-2 bg-primary mx-auto text-white rounded-full flex items-center justify-center space-x-2">
        <span className="text-md">Explore All</span>
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.75 17.4166L12.4437 16.1333L16.6604 11.9166H1.83333V10.0833H16.6604L12.4667 5.86659L13.75 4.58325L20.1667 10.9999L13.75 17.4166Z"
            fill="#E8EAED"
          />
        </svg>
      </button>
    </section>
  );
};

export default ToolboxPage;
