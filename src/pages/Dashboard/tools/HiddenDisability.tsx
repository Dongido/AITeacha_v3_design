import React, { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import ReactMarkdown from "react-markdown";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { submitToolData } from "../../../api/tools";
import jsPDF from "jspdf";
import { Country } from "country-state-city";
import { Label } from "../../../components/ui/Label";
import { useParams, useNavigate } from "react-router-dom";
import { Undo2 } from "lucide-react";
import { sampleToolData } from "../../../Data/ToolData";
const HiddenDisability: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [selectedUser, setSelectedUser] = useState<"student" | "parent" | "">(
    ""
  );
  const [countries, setCountries] = useState<string[]>([]);
  const [test_focus, setTestFocus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [test_type, setTestType] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responseMarkdown, setResponseMarkdown] = useState("");
  const [formResponse, setFormResponse] = useState<string | null>(null);
  const navigate = useNavigate();
  const studentFocusOptions = [
    "Reading Comprehension",
    "Attention and Focus",
    "Cognitive Problem-Solving",
    "Social and Communication Skills",
  ];

  const parentFocusOptions = [
    "Behavioral Observations",
    "Study Habits",
    "Social Interaction",
  ];

  const testTypeOptions = ["Multiple-choice questions", "Open-ended responses"];

  const questionTypelist = [
    { label: "Multiple choice", value: "Multiple choice" },
    { label: "Short answer", value: "Short answer" },
    { label: "Essay", value: "Essay" },
  ];

  const gradeOptions = [
    "Pre School",
    "Early Years",
    "Nursery 1",
    "Nursery 2",
    ...Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`),
    ...Array.from({ length: 5 }, (_, i) => `Higher Institution Year ${i + 1}`),
  ];
  useEffect(() => {
    const countryList = Country.getAllCountries().map(
      (country) => country.name
    );
    setCountries(countryList);
  }, []);

  useEffect(() => {
    const form = document.querySelector("#assessmentForm");
    if (form) {
      form.addEventListener("submit", handleFormSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener("submit", handleFormSubmit);
      }
    };
  }, [responseMarkdown]);

  const handleFormSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const submittedData: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      submittedData[key] = value as string;
    });

    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    const requestData = {
      user_id: user_Id,
      serviceId: "hidden disability test report",
      studentName,
      age,
      grade,
      test_focus,
      test_user: selectedUser,
      curriculum_type: selectedCountry,
      test_type,
      questions: responseMarkdown,
      assessment_data: Object.entries(submittedData).map(
        ([question, answer]) => ({
          // Question: question,
          Answer: answer,
        })
      ),
    };

    try {
      const response = await submitToolData(requestData, "application/json");
      console.log(response.data.data);
      setFormResponse(response.data.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to generate test. Please try again.");
    } finally {
      setSubmitting(false);
    }

    console.log("Submitted Form Data:", requestData);
  };

  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormResponse("");
    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    const formData = {
      user_id: user_Id,
      serviceId: "student support screening assistant",
      studentName,
      age,
      grade,
      test_focus,
      test_user: selectedUser,
      curriculum_type: selectedCountry,
      test_type,
    };

    try {
      const response = await submitToolData(formData, "application/json");
      console.log(response.data.data);
      setResponseMarkdown(response.data.data);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to generate test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const content = formResponse || "";
    doc.text(content, 10, 10);
    doc.save("generated-test.pdf");
  };

   const handleSampleData = () => {
  const sample = sampleToolData?.["Staff Workload"];

    setStudentName("Happy");
    setAge("21"); 
    setGrade("Higher Institution Year 1"); 
    setSelectedUser("student"); 
    setTestFocus("Attention and Focus"); 
    setSelectedCountry("Nigeria"); 
    setTestType("Multiple-choice questions");
};


  return (
    <div className="p-6 mt-8 mx-auto bg-white shadow-lg rounded-xl flex flex-col gap-6">
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
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="flex-1 max-h-[500px] overflow-y-auto ">
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl text-center font-semibold mb-4">
              Student Support Screening Assistant
            </h2>
            <div className="space-y-4">
              <Input
                placeholder="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />

              <div>
                <h3 className="font-medium text-md mb-2">Grade Level</h3>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="w-full">
                    {grade || "Select Grade Level"}
                  </SelectTrigger>
                  <SelectContent>
                    {gradeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-medium mb-2 text-md">
                Who is taking the test?
              </h3>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="student"
                    checked={selectedUser === "student"}
                    onChange={() => setSelectedUser("student")}
                  />
                  <span>Student</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="parent"
                    checked={selectedUser === "parent"}
                    onChange={() => setSelectedUser("parent")}
                  />
                  <span>Parent/Teacher</span>
                </label>
              </div>
            </div>

            <div className="my-3">
              <Label>Curriculum Type</Label>
              <Select onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Curriculum Type" />
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

            {selectedUser && (
              <div className="mt-4">
                <h3 className="font-medium text-md mb-2">Select Focus Area</h3>
                <Select value={test_focus} onValueChange={setTestFocus}>
                  <SelectTrigger className="w-full">
                    {test_focus || "Select Focus Area"}
                  </SelectTrigger>
                  <SelectContent>
                    {(selectedUser === "student"
                      ? studentFocusOptions
                      : parentFocusOptions
                    ).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedUser === "student" && (
              <div className="mt-4">
                <h3 className="font-medium text-md mb-2">Select Test Type</h3>
                <Select value={test_type} onValueChange={setTestType}>
                  <SelectTrigger className="w-full">
                    {test_type || "Select Test Type"}
                  </SelectTrigger>
                  <SelectContent>
                    {testTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedUser === "parent" && (
              <div className="mt-4">
                <h3 className="font-medium text-md mb-2">Select Test Type</h3>
                <Select value={test_type} onValueChange={setTestType}>
                  <SelectTrigger className="w-full">
                    {test_type || "Select Test Type"}
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypelist.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              type="submit"
              variant={"gradient"}
              className="mt-6 w-full rounded-md"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Test"}
            </Button>
          </form>
        </div>

        <div className="flex-1 p-3 bg-gray-100 rounded-lg overflow-y-auto">
          <h2 className="text-lg font-semibold mb-3">Generated Test</h2>
          <div className="prose w-full">
            {formResponse ? (
              <>
                <ReactMarkdown>{formResponse}</ReactMarkdown>
                <button
                  onClick={handleDownloadPDF}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download as PDF
                </button>
              </>
            ) : (
              <>
                {submitting ? (
                  <p className="text-gray-500 animate-pulse">Loading...</p>
                ) : responseMarkdown ? (
                  <div
                    className="bg-white shadow-lg rounded-xl p-2 overflow-auto max-h-[900px]"
                    dangerouslySetInnerHTML={{ __html: responseMarkdown }}
                  />
                ) : (
                  <p className="text-gray-500">No results yet.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiddenDisability;
