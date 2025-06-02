import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { submitToolData } from "../../../api/tools";
import { Country } from "country-state-city";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { useParams, useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";
interface CareerGuidanceFormData {
  counseling_type: string;
  career_student_name: string;
  career_age: number;
  career_strength: string;
  career_personal_interest: string;
  career_work_style: string;
  career_future_goals: string;
  career_Location: string;
  career_others: string;
  scholarship_student_name: string;
  scholarship_country: string;
  scholarship_course: string;
  scholarship_academic_performance: string;
  scholarship_extracurricular_activities: string;
  scholarship_financial_need: string;
  scholarship_application_deadline: string;
  support_student_name: string;
  support_age: number;
  support_current_challenge: string;
  support_stress_level: string;
  support_support_needed: string;
  file: FileList | undefined;
}

const CareerGuidanceForm = () => {
  const [result, setResult] = useState<string>("No response yet.");
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  // Form state management with react-hook-form
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CareerGuidanceFormData>();

  const [counselingType, setCounselingType] = useState("");

  useEffect(() => {
    const countryList = Country.getAllCountries().map(
      (country) => country.name
    );
    setCountries(countryList);
  }, []);

  const handleCounselingTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCounselingType(event.target.value);
  };
  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "file" && value instanceof FileList && value?.[0]) {
        formData.append(key, value[0]);
      } else {
        if (typeof value === "string" || value instanceof Blob) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    // Get userId from localStorage
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const userId = user?.id;

    // Append the additional data to formData
    formData.append("user_id", userId);
    formData.append("serviceId", "career guidance and counseling");
    formData.append("scholarship_country", selectedCountry);
    formData.append("counseling_type", counselingType);

    try {
      const response = await submitToolData(formData);
      setResult(response.data.data);
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      setResult("Failed to get a response.");
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
  };

  return (
    <div className="mt-4">
      <Button
        className="flex items-center bg-white rounded-md text-black w-fit h-full gap-3 py-2 mb-4"
        onClick={() => navigate(-1)}
      >
        <Undo2 size={"1.1rem"} color="black" />
        Back
      </Button>
      <h2 className="text-2xl text-center font-semibold mb-4">
        Career Guidance & Counseling
      </h2>
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1 max-h-[500px] overflow-y-auto p-4 bg-white ">
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="w-full p-2 border border-gray-300 rounded"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Counseling Type
              </label>
              <select
                value={counselingType}
                onChange={handleCounselingTypeChange}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Counseling Type</option>
                <option value="career">Career</option>
                <option value="scholarship">Scholarship</option>
                <option value="support">Support</option>
              </select>
            </div>
            {counselingType === "career" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Student Name
                  </label>
                  <input
                    type="text"
                    {...register("career_student_name")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the name of the student seeking career counseling"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Student Age
                  </label>
                  <input
                    type="number"
                    {...register("career_age")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the student's age"
                  />
                </div>
                {/* Career Strengths */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Strengths
                  </label>
                  <input
                    type="text"
                    {...register("career_strength")}
                    className="border p-2 rounded w-full"
                    placeholder="List the student's key strengths"
                  />
                </div>
                {/* Personal Interests */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Personal Interests
                  </label>
                  <input
                    type="text"
                    {...register("career_personal_interest")}
                    className="border p-2 rounded w-full"
                    placeholder="Describe the student's interests"
                  />
                </div>
                {/* Work Style */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Work Style
                  </label>
                  <input
                    type="text"
                    {...register("career_work_style")}
                    className="border p-2 rounded w-full"
                    placeholder="Describe the student's preferred work style"
                  />
                </div>
                {/* Future Goals */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Future Goals
                  </label>
                  <input
                    type="text"
                    {...register("career_future_goals")}
                    className="border p-2 rounded w-full"
                    placeholder="List the student's future career goals"
                  />
                </div>
                {/* Preferred Location */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    {...register("career_Location")}
                    className="border p-2 rounded w-full"
                    placeholder="Specify the preferred career location"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Other Career Details
                  </label>
                  <input
                    type="text"
                    {...register("career_others")}
                    className="border p-2 rounded w-full"
                    placeholder="Provide any additional career-related information"
                  />
                </div>
              </>
            )}

            {counselingType === "scholarship" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Scholarship Student Name
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_student_name")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the name of the student applying for a scholarship"
                  />
                </div>

                <div className="my-3">
                  <Label>Scholarship Country</Label>
                  <Select onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Scholarship Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((countryName) => (
                        <SelectItem key={countryName} value={countryName}>
                          {countryName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Scholarship Course
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_course")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the intended course of study"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Academic Performance
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_academic_performance")}
                    className="border p-2 rounded w-full"
                    placeholder="Provide details on the student's academic achievements"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Extracurricular Activities
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_extracurricular_activities")}
                    className="border p-2 rounded w-full"
                    placeholder="List extracurricular activities the student is involved in"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Financial Need
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_financial_need")}
                    className="border p-2 rounded w-full"
                    placeholder="Describe the student's financial need for the scholarship"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="text"
                    {...register("scholarship_application_deadline")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the deadline for the scholarship application"
                  />
                </div>
              </>
            )}

            {counselingType === "support" && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Support Student Name
                  </label>
                  <input
                    type="text"
                    {...register("support_student_name")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the name of the student seeking support"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Support Age
                  </label>
                  <input
                    type="number"
                    {...register("support_age")}
                    className="border p-2 rounded w-full"
                    placeholder="Enter the student's age"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Current Challenge
                  </label>
                  <input
                    type="text"
                    {...register("support_current_challenge")}
                    className="border p-2 rounded w-full"
                    placeholder="Describe the student's current challenge"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Stress Level
                  </label>
                  <input
                    type="text"
                    {...register("support_stress_level")}
                    className="border p-2 rounded w-full"
                    placeholder="Specify the student's stress level"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Support Needed
                  </label>
                  <input
                    type="text"
                    {...register("support_support_needed")}
                    className="border p-2 rounded w-full"
                    placeholder="Describe the type of support the student requires"
                  />
                </div>
              </>
            )}

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Upload File
              </label>
              <input
                type="file"
                {...register("file")}
                className="border p-2 rounded w-full"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
              disabled={loading}
              variant={"gradient"}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </div>
        <div className="flex-1 bg-gray-50 p-6 shadow-md rounded-lg  max-h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4">Generated Result</h2>
          <MarkdownRenderer
            className="p-4 bg-white rounded shadow"
            content={loading ? "Loading..." : result}
          />
        </div>
      </div>
    </div>
  );
};

export default CareerGuidanceForm;
