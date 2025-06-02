import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { submitToolData } from "../../../api/tools";
import { Button } from "../../../components/ui/Button";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import { useParams, useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";
type FormData = {
  report_type: string;
  progress_report_school_name: string;
  progress_report_student_name: string;
  progress_report_grade: string;
  progress_report_subject_grade: string;
  progress_report_teacher_comment: string;
  progress_report_additional_note: string;
  official_letter_school_name: string;
  official_letter_recipient: string;
  official_letter_student_name: string;
  official_letter_outstanding_fees: string;
  official_letter_deadline: string;
  official_letter_additional_note: string;
  meeting_minutes_meeting_date: string;
  meeting_minutes_type: string;
  meeting_minutes_agenda_items: string;
  meeting_minutes_key_decisions: string;
  file: FileList;
};

const ReportGenerator: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [result, setResult] = useState<string>("No response yet.");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReportType, setSelectedReportType] =
    useState<string>("progress_report");

  const navigate = useNavigate();
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    const formData = new FormData();
    for (const key in data) {
      if (key === "file") {
        formData.append(key, data.file[0]);
      } else {
        formData.append(key, data[key as keyof FormData] as string);
      }
    }
    formData.append("user_id", user_Id);
    formData.append("serviceId", "school Document and report generator");

    try {
      const response = await submitToolData(formData);
      setResult(response.data.data || "No result returned from the API.");
    } catch (error: any) {
      setResult(error.message);
    } finally {
      setLoading(false);
      reset();
    }
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
      <h1 className="text-2xl font-bold mb-6 text-center">
        School Document & Report Generator
      </h1>

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1 max-h-[500px] overflow-y-auto p-4 bg-white ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700">Report Type</label>
              <select
                className="w-full p-2 border border-gray-300 rounded"
                {...register("report_type")}
                onChange={(e) => setSelectedReportType(e.target.value)}
                required
              >
                <option value="progress_report">Progress Report</option>
                <option value="official_letter">Official Letter</option>
                <option value="meeting_minutes">Meeting Minutes</option>
              </select>
            </div>

            {selectedReportType === "progress_report" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    School Name (Progress Report)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_school_name")}
                    placeholder="Enter the name of the school for the progress report"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Student Name (Progress Report)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_student_name")}
                    placeholder="Enter the student's name for the progress report"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Grade (Progress Report)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_grade")}
                    placeholder="Specify the student's grade level"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Subject Grade (Progress Report)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_subject_grade")}
                    placeholder="Enter the grades received in each subject"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Teacher's Comment (Progress Report)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_teacher_comment")}
                    placeholder="Include any comments from the teacher"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Additional Notes (Progress Report)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("progress_report_additional_note")}
                    placeholder="Include any additional notes related to the progress report"
                  />
                </div>
              </>
            )}

            {selectedReportType === "official_letter" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    School Name (Official Letter)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("official_letter_school_name")}
                    placeholder="Enter the school's name for the official letter"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Recipient Name (Official Letter)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("official_letter_recipient")}
                    placeholder="Enter the recipient's name for the official letter"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Student Name (Official Letter)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("official_letter_student_name")}
                    placeholder="Enter the student's name referenced in the official letter"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Outstanding Fees (Official Letter)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("official_letter_outstanding_fees")}
                    placeholder="Enter the amount of outstanding fees"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Payment Deadline (Official Letter)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    type="date"
                    {...register("official_letter_deadline")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Additional Notes (Official Letter)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("official_letter_additional_note")}
                    placeholder="Include any additional notes related to the official letter"
                  />
                </div>
              </>
            )}

            {selectedReportType === "meeting_minutes" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    Meeting Date (Meeting Minutes)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    type="date"
                    {...register("meeting_minutes_meeting_date")}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Meeting Type (Meeting Minutes)
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("meeting_minutes_type")}
                    placeholder="Specify the type of meeting (e.g., staff meeting, PTA meeting)"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Agenda Items (Meeting Minutes)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("meeting_minutes_agenda_items")}
                    placeholder="List the agenda items discussed in the meeting"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">
                    Key Decisions (Meeting Minutes)
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    {...register("meeting_minutes_key_decisions")}
                    placeholder="Summarize the key decisions made in the meeting"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-gray-700">Upload File</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="file"
                {...register("file")}
              />
            </div>

            <Button
              type="submit"
              className="w-full  text-white font-semibold py-2 px-4 rounded"
              variant={"gradient"}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Document"}
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

export default ReportGenerator;
