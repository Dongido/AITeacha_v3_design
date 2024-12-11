export const solutions = [
  {
    name: "Pioneer Program",
    description:
      "Track and analyze user interactions to improve learning outcomes.",
    href: "##",
    icon: IconOne,
  },
  {
    name: "Heroes Wall",
    description: "Showcase achievements and celebrate learner milestones.",
    href: "##",
    icon: IconTwo,
  },
];
export const resources = [
  {
    name: "Support Center",
    description: "Get help and find answers to your questions.",
    href: "##",
    icon: IconSupport,
  },
  {
    name: "Educator Tools",
    description: "Leverage powerful tools designed for educators.",
    href: "##",
    icon: IconTools,
  },
];
export const about = [
  {
    name: "AI Teacha Mission",
    description: "Discover how we aim to revolutionize education with AI.",
    href: "##",
    icon: IconMission,
  },
  {
    name: "Privacy Policy",
    description: "Understand how we protect and use your data responsibly.",
    href: "##",
    icon: IconPrivacy,
  },
];

export function IconOne() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#e3e0eb" />
      <path
        d="M24 11L35.2583 17.5V30.5L24 37L12.7417 30.5V17.5L24 11Z"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.7417 19.8094V28.1906L24 32.3812L31.2584 28.1906V19.8094L24 15.6188L16.7417 19.8094Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7417 22.1196V25.882L24 27.7632L27.2584 25.882V22.1196L24 20.2384L20.7417 22.1196Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconTwo() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#e3e0eb" />
      <path
        d="M28.0413 20L23.9998 13L19.9585 20M32.0828 27.0001L36.1242 34H28.0415M19.9585 34H11.8755L15.9171 27"
        stroke="#FB923C"
        strokeWidth="2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.804 30H29.1963L24.0001 21L18.804 30Z"
        stroke="#FDBA74"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconSupport() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#D1FAE5" />
      <path
        d="M24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18ZM24 28C21.7909 28 20 26.2091 20 24C20 21.7909 21.7909 20 24 20C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28Z"
        fill="#10B981"
      />
      <path
        d="M16 24H10V22H16V24ZM38 24H32V22H38V24ZM24 10V16H22V10H24ZM24 38V32H22V38H24Z"
        fill="#047857"
      />
    </svg>
  );
}

export function IconTools() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#DBEAFE" />
      <path
        d="M20 14H14V20H20V14ZM34 14H28V20H34V14ZM20 28H14V34H20V28ZM34 28H28V34H34V28Z"
        fill="#2563EB"
      />
      <path d="M17 23H15V25H17V23ZM33 23H31V25H33V23Z" fill="#1E40AF" />
    </svg>
  );
}
export function IconMission() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#FFF7ED" />
      <path
        d="M24 12L18 24H30L24 12ZM24 28C22.3431 28 21 29.3431 21 31C21 32.6569 22.3431 34 24 34C25.6569 34 27 32.6569 27 31C27 29.3431 25.6569 28 24 28Z"
        fill="#FB923C"
      />
    </svg>
  );
}

export function IconPrivacy() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#EFF6FF" />
      <path
        d="M24 14C27.3137 14 30 16.6863 30 20V24C30 27.3137 27.3137 30 24 30C20.6863 30 18 27.3137 18 24V20C18 16.6863 20.6863 14 24 14ZM22 26H26V28H22V26Z"
        fill="#2563EB"
      />
      <path
        d="M24 32V34"
        stroke="#1D4ED8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
