import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BACKEND_URL } from "../../../lib/utils";
const AITeachaOnboarding = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    location: "",
    organization: "",
    job_role: "",
    years_of_experience: "",
    onboard_target: "",
    is_introduced_tool: "",
    is_experienced: "",
    guidelines: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { guidelines, ...dataToSubmit } = formData;
      const response = await axios.post(
        `${BACKEND_URL}home/add/educator`,
        dataToSubmit
      );
      if (response.data.status == "success") {
        setSuccess(true);
      }
    } catch (err) {
      setError(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
                Join the AiTeacha School Onboarding Program!
              </h2>
            </figcaption>
          </section>
        </section>
        <div className="px-4 text-md lg:text-lg">
          <section className="bg-white shadow rounded-lg p-6 mb-10">
            Are you an educator passionate about innovation in education? AI
            Teacha invites you to be part of a groundbreaking initiative to
            bring AI-powered learning management solutions to schools. As a
            participant, you’ll help schools transition to a smarter, more
            efficient education system while earning rewards and recognition for
            your contributions.
          </section>
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
                AI-powered education trainer.
              </li>
              <li>
                Exclusive Training & Resources – Gain access to slides, demo
                videos, and FAQs to guide your presentations.
              </li>
              <li>
                Official Authorization – Receive a Letter of Authorization from
                AiTeacha for credibility.
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
              <li>Present AiTeacha’s LMS to school administrators.</li>
              <li>Facilitate the creation of school accounts on AiTeacha.</li>
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
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  1. Personal Information
                </h3>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  required
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  required
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  required
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City & State)"
                  value={formData.location}
                  required
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  2. Professional Information
                </h3>
                <input
                  type="text"
                  name="organization"
                  placeholder="School/Organization Name"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="job_role"
                  placeholder="job_role in Education"
                  value={formData.job_role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  name="years_of_experience"
                  placeholder="Years of Experience"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  3. Availability & Commitment
                </h3>
                <input
                  type="number"
                  name="onboard_target"
                  placeholder="How many schools can you onboard in a month?"
                  value={formData.onboard_target}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div>
                  <p className="text-gray-700">
                    Have you previously introduced digital tools to schools?
                  </p>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_introduced_tool"
                        value="yes"
                        checked={formData.is_introduced_tool === "yes"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-0"
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_introduced_tool"
                        value="no"
                        checked={formData.is_introduced_tool === "no"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-0"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    Do you have experience in conducting presentation or demos?
                  </p>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_experienced"
                        value="yes"
                        checked={formData.is_experienced === "yes"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-0"
                      />
                      <span className="text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="is_experienced"
                        value="no"
                        checked={formData.is_experienced === "no"}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 focus:ring-0"
                      />
                      <span className="text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  4. AiTeacha Guidelines & Agreement
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="guidelines"
                    checked={formData.guidelines}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="guidelines" className="text-gray-700">
                    I have read and agree to AiTeacha’s guidelines for school
                    onboarding.
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full text-white font-medium py-3 rounded-lg transition duration-300 ${
                  !formData.guidelines || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-blue-700"
                }`}
                disabled={!formData.guidelines || loading}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>

            {success && (
              <p className="text-green-600 text-xl mt-4">
                Application submitted successfully!
              </p>
            )}
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AITeachaOnboarding;
