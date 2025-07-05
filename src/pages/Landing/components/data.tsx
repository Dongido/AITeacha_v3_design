import {
  BookOpenIcon,
  SpeakerWaveIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/solid";

export const cardsData = [
  {
    id: "teacher",
    title: "For Teachers",
    icon: BookOpenIcon,
    bullets: [
      "1-on-1 Lesson Customization",
      "Curriculum-Aligned Content",
      "AI-Powered Feedbacks",
      "Student Summary Reports",
    ],
    roleId: 2,
    buttonText: "Start as an Online Tutor",
    buttonBgColor: "#10B981",
    buttonHoverBgColor: "#059669",
  },
  {
    id: "lecturer",
    title: "For Lecturers",
    icon: SpeakerWaveIcon,
    bullets: [
      "Course Outline Generator",
      "Bulk Grading Assistant",
      "Research Companion",
      "AI Student Feedback Tool",
      "Thesis Topic Advisor (coming soon)n",
    ],
    buttonText: "Try AI Teacha for Lecturers",
    buttonBgColor: "#F59E0B",
    roleId: 2,
    buttonHoverBgColor: "#D97706",
  },
  {
    id: "school",
    title: "For Schools",
    icon: AcademicCapIcon,
    bullets: [
      "Standardized Lesson Plans",
      "School-Level Analytics",
      "Teacher Onboarding Support",
      " Identify Struggling Students Early",
      " Offline AI (Coming Soon)",
    ],
    buttonText: "Register as a School",
    buttonBgColor: "#5c3cbb",
    roleId: 4,
    buttonHoverBgColor: "#4a2f99",
  },
];
