import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image1 from "../../../assets/img/course.png";

const LevelUp = () => {
  return (
    <div className="flex flex-col  min-h-screen bg-white">
      <section>
        <Navbar />
      </section>
      <div className="mt-32 ">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl text-black  flex justify-center items-center  text-center font-bold">
            Level Up Your Teaching: Introducing the AI Teacher Certification
            Course
          </h2>
          <h2 className="text-sm text-gray-600 text-center">
            AiTeacha Admin / September 14, 2024
          </h2>

          <img
            src={Image1}
            alt=" AI Teacher Certification"
            className="rounded-3xl  mt-6"
          />

          <div className="max-w-4xl mx-auto py-10 px-5">
            <h2>
              Are you ready to transform your classroom with the power of
              artificial intelligence? The AI Teacher Certification Course:
              Level 1 is designed to equip educators like you with the essential
              knowledge and skills to effectively integrate AI into your
              teaching practices.
            </h2>
            <h1 className="text-2xl font-bold mb-2 text-center text-primary">
              Why Choose This Course?
            </h1>

            <div className="space-y-6 text-sm">
              <div>
                <h2 className="text-md font-semibold mb-2 text-gray-900">
                  Comprehensive Curriculum
                </h2>
                <p className="text-gray-700">
                  Dive deep into the fundamentals of AI, exploring various
                  concepts, technologies, and applications. Our course covers
                  everything from machine learning and natural language
                  processing to neural networks and data analysis. You'll gain a
                  solid understanding of how AI works and how it can be applied
                  to education.
                </p>
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2 text-gray-900">
                  Industry-Recognized Quality
                </h2>
                <p className="text-gray-700">
                  The course has earned the coveted International Community for
                  Educational Technology (ICEDT) Educators Standards Badge,
                  indicating its alignment with industry-recognized best
                  practices and rigorous quality standards. This ensures that
                  you're receiving a top-tier education that will equip you with
                  the skills you need to succeed.
                </p>
              </div>

              <div>
                <h2 className="text-md font-bold mb-2 text-gray-900">
                  Practical Skills
                </h2>
                <p className="text-gray-700">
                  Learn how to use AI tools and techniques to enhance teaching,
                  personalize learning, and create engaging educational
                  experiences. Our hands-on approach will help you apply AI to
                  real-world classroom scenarios, such as automating grading,
                  creating personalized learning pathways, and using AI-powered
                  tutoring tools.
                </p>
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2 text-gray-900">
                  Key Topics Covered
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li className="mt-1">
                    <strong>AI Basics:</strong> Understanding AI concepts and
                    technologies
                  </li>
                  <li className="mt-1">
                    <strong>AI in Education:</strong> Exploring various
                    applications and use cases
                  </li>
                  <li className="mt-1">
                    <strong>Ethical Considerations:</strong> Navigating ethical
                    dilemmas and ensuring responsible AI use
                  </li>
                  <li className="mt-1">
                    <strong>Practical Implementation:</strong> Learning how to
                    integrate AI tools into your teaching
                  </li>
                  <li className="mt-1">
                    <strong>Assessment and Evaluation:</strong> Measuring the
                    impact of AI on student learning
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-md font-semibold mb-2 text-gray-900">
                  Benefits of Certification
                </h2>
                <ul className="list-disc list-inside text-gray-700">
                  <li className="mt-1">
                    Enhance your professional development and career prospects
                  </li>
                  <li className="mt-1">
                    Gain a competitive edge in the education field
                  </li>
                  <li className="mt-1">
                    Improve your teaching effectiveness and student outcomes
                  </li>
                  <li className="mt-1">
                    Stay ahead of the curve in the rapidly evolving landscape of
                    education technology
                  </li>
                </ul>
              </div>
              <br />
              <span>
                Don't miss this opportunity to revolutionize your teaching and
                empower your students with the latest AI advancements. Join the
                AI Teacher Certification Course and unlock a world of
                possibilities!
              </span>

              <div className="text-center mt-8">
                <a
                  href="https://uni.icedt.org/course/AI-TEACHER-CERTIFICATION-LEVEL-1"
                  className="inline-block bg-primary text-white font-bold py-3 px-6 rounded-lg"
                >
                  Enroll Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LevelUp;
