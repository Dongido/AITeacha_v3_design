import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { BACKEND_URL } from "../../lib/utils";

const TrainingForm = () => {
  const [formData, setFormData] = useState({
    school_name: "",
    location: "",
    email: "",
    phone: "",
    contact_person: "",
    training_date: "",
    training_time: "",
  });

  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "error" | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch(
        `${BACKEND_URL}home/add/school/training`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setSubmissionStatus("success");
        setFormData({
          school_name: "",
          location: "",
          email: "",
          phone: "",
          contact_person: "",
          training_date: "",
          training_time: "",
        });
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmissionStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <section className="max-w-lg w-full bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <h3 className="text-3xl font-semibold text-[#07052D] sm:text-4xl">
            Enquire for AI Training
          </h3>
          <p className="mt-3 text-gray-600">
            Fill in the details below to request a training session for your
            school.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="flex flex-col">
            <label className="text-gray-700">School Name</label>
            <Input
              type="text"
              name="school_name"
              value={formData.school_name}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Location</label>
            <Input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Contact Person</label>
            <Input
              type="text"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Training Date</label>
            <Input
              type="date"
              name="training_date"
              value={formData.training_date}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700">Training Time</label>
            <Input
              type="time"
              name="training_time"
              value={formData.training_time}
              onChange={handleChange}
              className="p-3 rounded-lg bg-gray-100 text-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-medium ${
              loading ? "bg-gray-500" : "bg-[#07052D] hover:bg-[#171093]"
            } rounded-lg shadow-md`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>
        </form>
        {submissionStatus === "success" && (
          <p className="mt-4 text-green-600 font-semibold">
            Form submitted successfully!
          </p>
        )}
        {submissionStatus === "error" && (
          <p className="mt-4 text-red-600 font-semibold">
            Failed to submit the form. Please try again.
          </p>
        )}
      </section>
    </div>
  );
};

export default TrainingForm;
