import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease: "easeOut" },
  }),
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, duration: 0.7, ease: "easeOut" },
  }),
};

const Pioneers = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    localStorage.setItem("selectedRole", "school");
    localStorage.setItem("roleId", "4");
    navigate("/auth/onboarding");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section>
        <Navbar />
      </section>

      {/* Hero Section */}
      <motion.section
        className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center items-center overflow-hidden overlow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <section className="px-2">
          <motion.figcaption
            className="desc z-10 relative px-2 text-center"
            variants={fadeInUp}
            custom={0.2}
          >
            <motion.h1
              className="text-3xl lg:text-5xl font-bold text-center my-6 text-header text-black"
              variants={fadeInUp}
              custom={0.3}
            >
              Empower Your School with AiTeacha
            </motion.h1>
            <center>
              <motion.p
                className="text-[16px] text-center text-black max-w-3xl"
                variants={fadeInUp}
                custom={0.5}
              >
                Discover the future of education with AiTeacha's Schools
                Onboarding Program. Streamline teaching, boost student
                engagement, and unlock access to innovative AI tools tailored
                for your institution. Begin your transformation today!
              </motion.p>
            </center>
          </motion.figcaption>
        </section>
      </motion.section>

      {/* Main Content */}
      <motion.div
        className="lg:px-48 pb-4 px-4 items-center flex flex-col w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.section
          className="pb-20 w-full"
          variants={fadeInScale}
          custom={0.2}
        >
          <img
            src="https://content.api.news/v3/images/bin/17ac3d7dcbb45ccf87725b9c52bac2b5"
            alt="Educator smiling"
            className="w-full object-cover lg:h-[400px] rounded-2xl"
          />
        </motion.section>

        <motion.div
          className="space-y-0 flex-1 text-left"
          variants={fadeInUp}
          custom={0.4}
        >
          <span className="text-sm font-medium mb-8 text-gray-900">
            The{" "}
            <span className="font-bold">
              AiTeacha AMS is the first AI Powered Academic Management System
            </span>{" "}
            for Schools and Institutions. Be the first to experience the power
            of AiTeacha, the revolutionary AI Academic Management System
            designed to simplify school operations, teaching, and learning.
            <br />
            <br />
            <span className="font-bold text-2xl">
              Why Be a Pioneer School with AiTeacha?
            </span>
            <p>
              AiTeacha empowers schools to streamline processes, enhance
              teaching, and improve learning outcomes with cutting-edge AI
              technology:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Save time on everyday tasks for teachers and administrators
              </li>
              <li>
                Foster personalized learning experiences for every student
              </li>
              <li>
                Empower parents to better support their children’s education
              </li>
              <li>
                Customize the platform to fit your school’s unique curriculum
                and needs.
              </li>
            </ul>
            <br />
            <br />
            <span className="text-2xl pt-4 font-bold">
              Features That Set AiTeacha Apart
            </span>
            <br />
            <ul className="list-disc list-inside ">
              <li>
                <span className="font-bold text-lg">
                  AI-Powered Task Simplification:
                </span>{" "}
                Automate lesson planning, grading, and other routine tasks for
                teachers and administrators.
              </li>
              <br />
              <li>
                {" "}
                <span className="font-bold text-lg">
                  Personalized Learning for Students:
                </span>{" "}
                Create AI-powered classrooms tailored to each student’s learning
                style and pace. Customizable for Your School: Personalize AI
                Teacha to align with your curriculum, policies, and goals.
              </li>
              <br />
              <li>
                {" "}
                <span className="font-bold text-lg">
                  Support for Struggling Students:
                </span>{" "}
                Use AI-driven insights to provide targeted support for students
                who need extra help. Empowered Parents: Equip parents with AI
                tools to support their children’s learning journey at home. And
                So Much More: From classroom management to real-time analytics,
                AiTeacha is designed to elevate every aspect of education.
              </li>
              <br />
              <li>
                <span className="font-bold text-lg">Custom Solutions:</span>{" "}
                Receive tailored support to maximize the impact of AiTeacha in
                your school.
              </li>
              <br />
              <li>
                <span className="font-bold text-lg">
                  Recognition and Partnership:
                </span>{" "}
                Be recognized as a Pioneer School shaping the future of
                education.
                <br />
              </li>
              <br />
              <li>
                <span className="font-bold text-lg">
                  Influence Development:
                </span>{" "}
                Share your insights to help us refine AiTeacha for schools
                worldwide.
              </li>
            </ul>
            <br />
            <span className="text-2xl pt-4 font-bold">
              Who Should Join the First Tester Program?
            </span>
            <br />
            <ul className="list-disc list-inside space-y-2">
              <li>
                Schools passionate about leveraging technology to transform
                teaching and learning.
              </li>
              <li>
                Institutions seeking to simplify administrative workflows and
                save time.
              </li>
              <li>
                Educators aiming to personalize and improve student learning
                outcomes.
              </li>
              <li>
                Schools looking for an adaptable, curriculum-aligned academic
                management system.
              </li>
            </ul>
          </span>
        </motion.div>
      </motion.div>

      {/* How to Get Started */}
      <motion.div
        className="flex flex-col items-center justify-center mt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.section
          className="pb-8 pt-8 w-full text-black text-center"
          variants={fadeInUp}
          custom={0.3}
        >
          <h2 className="text-3xl font-semibold mb-4 px-1">
            How to Get Started
          </h2>
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 max-w-4xl mx-auto"
            variants={fadeInUp}
            custom={0.4}
          >
            <motion.div
              className="flex flex-col items-center space-y-3"
              variants={fadeInUp}
              custom={0.5}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#EFE6FD] text-black rounded-full text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Apply Today</h3>
              <p className="text-black text-center text-sm">
                Fill out our application form to express your interest
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center space-y-3"
              variants={fadeInUp}
              custom={0.7}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#EFE6FD] text-black rounded-full text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Onboard with Ease</h3>
              <p className="text-black text-center text-sm">
                Receive hands-on support to set up AiTeacha for your school
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col items-center space-y-3"
              variants={fadeInUp}
              custom={0.9}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#EFE6FD] text-black rounded-full text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Test and Innovate</h3>
              <p className="text-black text-center text-sm">
                Explore the platform, test its features, and provide valuable
                feedback.
              </p>
            </motion.div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="lg:px-48 px-5 pb-4 flex flex-col lg:flex md:px-8 text-sm lg:mt-32 mt-20"
            variants={fadeInUp}
            custom={1.1}
          >
            <div className="space-y-2 sm:text-left lg:text-left">
              <h2 className="font-medium text-black text-sm">
                <strong> Limited Opportunities Available: </strong>
                Don’t miss the chance to lead the way in education innovation.
                Spaces are limited—act now to secure your spot!
                <br />
                <br />
                <strong>Become a Pioneer School Today:</strong>
                Take the first step toward transforming your school with
                AI-powered innovation. Sign up now and join the future of
                education.
                <br />
                <br />
                <strong>Apply Now to Be a First Tester:</strong> Spaces are
                filling fast—don’t wait to be part of this revolutionary
                journey!
              </h2>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 w-full text-white text-lg font-semibold py-4 bg-[#6200EE] rounded-full shadow-lg shadow-[#6200EE]/40 hover:bg-[#4d00c9]"
              onClick={handleNavigate}
            >
              Apply here
            </motion.button>
          </motion.div>
        </motion.section>
      </motion.div>

      <div className="mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Pioneers;
