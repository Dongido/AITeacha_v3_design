import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const AITeachaOnboarding = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100  py-24 ">
        <section className="relative bg-blight w-full h-[60vh] pt-[5rem] flex justify-center bg-gradient-to-r from-[#07052D] to-[#171093] items-center overflow-hidden overlow-hidden mb-4">
          <span className="absolute inse=t-0 z-0 p-5  justif-center top-[rem]"></span>
          <section>
            <figcaption className="desc z-10 relative px-2">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center my-6 text-header text-white">
                {" "}
                AI In Education Trainer Program
              </h1>
              <h2 className="text-xl text-gray-300 text-center">
                Join the AI Teacha School Onboarding Program!
              </h2>
            </figcaption>
          </section>
        </section>
        <div className="px-4">
          <section className="bg-white shadow rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Why Join?
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Empower Schools with AI – Help institutions streamline lesson
                planning, assessments, and student management.
              </li>
              <li>
                Earn Rewards & Perks – Get compensated for successful school
                presentations and onboarding, plus exclusive perks.
              </li>
              <li>
                Receive a Certificate of Recognition – Stand out as an
                AI-powered education master trainer.
              </li>
              <li>
                Exclusive Training & Resources – Gain access to slides, demo
                videos, and FAQs to guide your presentations.
              </li>
              <li>
                Official Authorization – Receive a Letter of Authorization from
                AI Teacha for credibility.
              </li>
              <li>
                Community & Support – Join a WhatsApp group for ongoing
                training, updates, and peer support.
              </li>
              <li>
                School Community Engagement – Schools onboarded will also be
                added to a dedicated WhatsApp group for continued support and
                training.
              </li>
            </ul>
          </section>

          <section className="bg-white shadow rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Program Structure
            </h2>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>
                Receive training materials and a structured onboarding guide.
              </li>
              <li>Present AI Teacha’s LMS to school administrators.</li>
              <li>Facilitate the creation of school accounts on AI Teacha.</li>
              <li>
                Earn financial rewards, perks, and a certificate for every
                successful onboarding.
              </li>
            </ol>
          </section>

          <section className="bg-white shadow rounded-lg p-6 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Application Form
            </h2>
            <form className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  1. Personal Information
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Location (City & State)"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  2. Professional Information
                </h3>
                <input
                  type="text"
                  placeholder="School/Organization Name"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Role in Education (Teacher, Principal, School Owner, etc.)"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Years of Experience"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  3. Availability & Commitment
                </h3>
                <input
                  type="number"
                  placeholder="How many schools can you onboard in a month?"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="digital-tools"
                    className="w-5 h-5 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="digital-tools" className="text-gray-700">
                    Have you previously introduced digital tools to schools?
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="presentations"
                    className="w-5 h-5 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="presentations" className="text-gray-700">
                    Do you have experience in conducting presentations or demos?
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  4. AI Teacha Guidelines & Agreement
                </h3>
                <p className="text-gray-700 text-sm">
                  Before submitting your application, please carefully review
                  and agree to the following guidelines:
                </p>
                <ul className="list-disc pl-6 text-gray-700 text-sm">
                  <li>
                    Do not share AI Teacha’s demo account details with anyone.
                  </li>
                  <li>
                    All presentations must be done professionally and in
                    alignment with AI Teacha’s values.
                  </li>
                  <li>
                    Ensure schools are onboarded using the correct sign-up link
                    provided by AI Teacha.
                  </li>
                  <li>
                    Accurately document school onboarding details, including
                    school name, location, and administrator details.
                  </li>
                  <li>
                    Engage actively in the AI Teacha community and provide
                    updates on your progress.
                  </li>
                  <li>
                    Misrepresentation or false onboarding claims will lead to
                    disqualification from the program.
                  </li>
                </ul>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="guidelines"
                    className="w-5 h-5 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="guidelines" className="text-gray-700">
                    I have read and agree to AI Teacha’s guidelines for school
                    onboarding.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Submit Application
              </button>
            </form>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AITeachaOnboarding;
