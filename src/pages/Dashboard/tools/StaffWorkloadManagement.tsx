import React, { useState } from "react";
import { submitToolData } from "../../../api/tools";
import { Button } from "../../../components/ui/Button";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { useParams, useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { sampleToolData } from "../../../Data/ToolData";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const StaffWorkloadManagementForm = () => {
  const [result, setResult] = useState<string>("No response yet.");
  const navigate = useNavigate();
   const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    workload_type: string;
    teachers_school_name: string;
    teachers_number_of_teachers: string;
    teachers_subject: string;
    teachers_total_weekly_hours: string;
    teachers_max_daily_lessons: string;
    teachers_free_periods: string;
    teachers_additional_duties: string;
    administrative_number_of_nonteacher: string;
    administrative_roles: string;
    administrative_working_hours: string;
    administrative_break_times: string;
    administrative_requirements: string;
    file: File | null;
  }>({
    workload_type: "",
    teachers_school_name: "",
    teachers_number_of_teachers: "",
    teachers_subject: "",
    teachers_total_weekly_hours: "",
    teachers_max_daily_lessons: "",
    teachers_free_periods: "",
    teachers_additional_duties: "",
    administrative_number_of_nonteacher: "",
    administrative_roles: "",
    administrative_working_hours: "",
    administrative_break_times: "",
    administrative_requirements: "",
    file: null,
  });
  console.log("formDate", formData)
  // const { tools, loading } = useSelector((state: RootState) => state.tools);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSubmit.append(key, value as string | Blob);
      }
    });
    formDataToSubmit.append("user_id", user_Id);
    formDataToSubmit.append("serviceId", "school staff workload management");

    try {
      setIsSubmitting(true)
      const response = await submitToolData(formDataToSubmit);
      setResult(response.data.data);
    } catch (error: any) {
      console.error("Error submitting form:", error.message);
      setResult("Failed to get a response.");
    }finally{
      setIsSubmitting(false)
    }
  };

    const handleSampleData = () => {
     const sample = sampleToolData?.["Staff Workload"]
     console.log("sample", sample)
     
  
    if (sample) {
      setFormData((prev) => ({
        ...prev,
        ...sample,
      }));
    } else {
      alert("No sample data available for this tool.");
    }
  };

  return (
    <div className="mt-4">
      <div className="flex gap-4">
      <Button
        className="flex items-center bg-white  rounded-md text-black w-fit h-full gap-3 py-2 mb-4"
        onClick={() => navigate(-1)}
      >
        <Undo2 size={"1.1rem"} color="black" />
        Back
      </Button>
      {/* <Button
        variant="gradient"
        className="flex items-center bg-red-500 text-white rounded-md  w-fit h-full gap-3 py-2 mb-4"
        onClick={handleSampleData}
      >
        Auto Fill Form With Sample Data
      </Button> */}
    </div>
      <h2 className="text-2xl font-bold text-center mb-4">
        Staff Workload Management Form
      </h2>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1 max-h-[500px] overflow-y-auto p-4 bg-white ">
          {" "}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Workload Type</label>
              <select
                name="workload_type"
                value={formData.workload_type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select Workload Type</option>
                <option value="teachers">Teaching</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>
            {formData.workload_type === "teachers" && (
              <>
                <div>
                  <label className="block text-sm font-medium">
                    School Name
                  </label>
                  <input
                    type="text"
                    name="teachers_school_name"
                    value={formData.teachers_school_name}
                    onChange={handleChange}
                    placeholder="Enter the name of the school for teachers' workload"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Number of Teachers
                  </label>
                  <input
                    type="number"
                    name="teachers_number_of_teachers"
                    value={formData.teachers_number_of_teachers}
                    onChange={handleChange}
                    placeholder="Enter the total number of teachers in the school"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Subjects Taught
                  </label>
                  <input
                    type="text"
                    name="teachers_subject"
                    value={formData.teachers_subject}
                    onChange={handleChange}
                    placeholder="List the subjects taught by teachers"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Total Weekly Hours
                  </label>
                  <input
                    type="number"
                    name="teachers_total_weekly_hours"
                    value={formData.teachers_total_weekly_hours}
                    onChange={handleChange}
                    placeholder="Specify the total teaching hours per week"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Maximum Daily Lessons
                  </label>
                  <input
                    type="number"
                    name="teachers_max_daily_lessons"
                    value={formData.teachers_max_daily_lessons}
                    onChange={handleChange}
                    placeholder="Specify the maximum number of lessons a teacher can teach daily"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Free Periods
                  </label>
                  <input
                    type="number"
                    name="teachers_free_periods"
                    value={formData.teachers_free_periods}
                    onChange={handleChange}
                    placeholder="Enter the number of free periods available for teachers"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Additional Duties
                  </label>
                  <input
                    type="text"
                    name="teachers_additional_duties"
                    value={formData.teachers_additional_duties}
                    onChange={handleChange}
                    placeholder="List any additional responsibilities assigned to teachers"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            {formData.workload_type === "administrative" && (
              <>
                <div>
                  <label className="block text-sm font-medium">
                    Number of Non-Teaching Staff
                  </label>
                  <input
                    type="number"
                    name="administrative_number_of_nonteacher"
                    value={formData.administrative_number_of_nonteacher}
                    onChange={handleChange}
                    placeholder="Enter the total number of administrative staff"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Administrative Roles
                  </label>
                  <input
                    type="text"
                    name="administrative_roles"
                    value={formData.administrative_roles}
                    onChange={handleChange}
                    placeholder="List the roles of administrative staff"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Working Hours
                  </label>
                  <input
                    type="text"
                    name="administrative_working_hours"
                    value={formData.administrative_working_hours}
                    onChange={handleChange}
                    placeholder="Specify the working hours for administrative staff"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Break Times
                  </label>
                  <input
                    type="text"
                    name="administrative_break_times"
                    value={formData.administrative_break_times}
                    onChange={handleChange}
                    placeholder="Specify the break times for administrative staff"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium">Upload File</label>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <Button
              type="submit"
              className="mt-4 w-full  text-white py-2 rounded-md "
              variant={"gradient"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "AiTeacha is Typing..." : "Submit"}
            </Button>
          </form>
        </div>
        <div className=" bg-gray-50 flex-1 shadow-md rounded-lg p-4 max-h-[500px] overflow-y-auto">
          <h2 className="text-xl font-bold">Generated Result</h2>
          <MarkdownRenderer
            className="whitespace-pre-wrap break-words"
            content={result}
          />
        </div>
      </div>
    </div>
  );
};

export default StaffWorkloadManagementForm;
