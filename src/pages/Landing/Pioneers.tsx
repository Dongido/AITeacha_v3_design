import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Button } from "../../components/ui/Button";

const Pioneers = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Navbar />
      </section>

      <div className="mt-24 mx-auto max-w-screen-lg pb-4 px-4 items-center lg:flex md:px-8">
        <div className="space-y-0 flex-1 sm:text-center lg:text-left">
          <div className=" mx-auto  mb-3 lg:w-auto">
            <img
              src="https://content.api.news/v3/images/bin/17ac3d7dcbb45ccf87725b9c52bac2b5"
              alt=""
              className="w-full mb-2 rounded-3xl"
            />
            <h2 className="text-2xl mb-4 text-center font-bold">
              Introducing AI Teacha for Schools:{" "}
            </h2>
          </div>

          <span className="text-lg font-medium  mb-8 text-gray-900">
            The{" "}
            <span className="font-bold">
              AI Teacha AMS is the first AI Powered Academic Management System
            </span>{" "}
            for Schools and Institutions. Be the first to experience the power
            of AI Teacha, the revolutionary AI Academic Management System
            designed to simplify school operations, teaching, and learning.
            <br />
            <br />
            <span className="font-bold text-2xl">
              Why Be a Pioneer School with AI Teacha?
            </span>
            <p>
              AI Teacha empowers schools to streamline processes, enhance
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
            <span className="text-2xl pt-4 font-bold ">
              {" "}
              Features That Set AI Teacha Apart
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
                AI Teacha is designed to elevate every aspect of education.
                Benefits of Joining the First Tester Program Exclusive Access:
                Be the first to use our innovative platform before its official
                launch.
              </li>
              <br />
              <li>
                <span className="font-bold text-lg">Custom Solutions:</span>{" "}
                Receive tailored support to maximize the impact of AI Teacha in
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
                Share your insights to help us refine AI Teacha for schools
                worldwide.
              </li>
            </ul>
            <br />
            <span className="text-2xl pt-4 font-bold ">
              {" "}
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
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mx-auto">
        <section
          className="pb-8 pt-8 w-full text-black text-center"
          //   style={{ background: "linear-gradient(180deg, #5C3CBB, #8071AE)" }}
        >
          <h2 className="text-3xl font-semibold mb-4 px-1">
            How to Get Started
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-50 text-black rounded-full text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold">Apply Today</h3>
              <p className="text-gray-700 text-center max-w-xs">
                Fill out our application form to express your interest
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-50 text-black rounded-full text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold">Onboard with Ease</h3>
              <p className="text-gray-700  text-center max-w-xs">
                Receive hands-on support to set up AI Teacha for your school
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 flex items-center justify-center bg-purple-50 text-black rounded-full text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold">Test and Innovate</h3>
              <p className="text-gray-700  text-center max-w-xs">
                Explore the platform, test its features, and provide valuable
                feedback.
              </p>
            </div>
          </div>
          <div className="mt-8 mx-auto max-w-screen-lg pb-4 px-4 items-center lg:flex md:px-8">
            <div className="space-y-4 flex-1 sm:text-left lg:text-left">
              <h2 className="text-lg font-medium text-gray-900">
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
                Apply Now to Be a First Tester. Spaces are filling fast—don’t
                wait to be part of this revolutionary journey!
              </h2>
            </div>
          </div>
        </section>
        <Button variant={"gradient"} className="rounded-md  w-64">
          Apply here
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Pioneers;
