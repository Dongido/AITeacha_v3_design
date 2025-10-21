/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Urbanist", "sans-serif"],
      },
      keyframes: {
        animate: {
          "0%, 18%, 20%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92%": {
            color: "#5c3cbb",
            boxShadow: "none",
          },
          "18.1%, 20.1%, 30%, 50%, 60.1%, 65%, 80.1%, 90%, 92.1%, 100%": {
            color: "#fff",
            textShadow: "0 0 10px #03bcf4",
          },
        },
      },
      animation: {
        anim: "animate 5s infinite",
        "spin-slow": "spin 2.5s linear infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".box-reflect": {
          "-webkit-box-reflect":
            "below 1px linear-gradient(transparent, #0004)",
        },

        ".scrollbar-thin": {
          "scrollbar-width": "thin",
        },
        ".scrollbar-custom": {
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#EFE6FD",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#EFE6FD",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F3F4F6",
          },
        },
      });
    },
  ],
});
