import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { loadStudentTools } from "../../../store/slices/toolsSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";
import {
  submitToolData,
  SubmitToolData,
  submitStudentToolData,
} from "../../../api/tools";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastViewport,
  ToastClose,
} from "../../../components/ui/Toast";
import { marked } from "marked";
import { Button } from "../../../components/ui/Button";
import MarkdownRenderer from "../_components/MarkdownRenderer";
import LoadingToolDetails from "./Loading";

import StringToReactComponent from "string-to-react-component";
const markdownToPlainText = async (markdown: string): Promise<string> => {
  const html = await marked(markdown);
  return html.replace(/<[^>]*>?/gm, "");
};

const LabSimulator = () => {
  const dispatch = useAppDispatch();
  const { studentTools, studentLoading, studentError } = useAppSelector(
    (state) => state.tools
  );
  const [labSubject, setLabSubject] = useState("");
  const [groupLevel, setGroupLevel] = useState("");
  const [experiment, setExperiment] = useState("");
  const [experimentEdit, setExperimentEdit] = useState("");
  const [experiments, setExperiments] = useState<string[]>([]);
  const [reqParamDetails, setReqParamDetails] = useState<{
    lab_subject: string;
    group_level: string;
    experiment: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<any | "">("");
  const [powerUrl, setPowerUrl] = useState<string | null>(null);
  const [csvUrl, setCsvUrl] = useState<string | null>(null);
  const [tunedResponseMessage, setTunedResponseMessage] = useState<
    string | null
  >(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [propsDialogContent, setPropsDialogContent] = useState<string>("");
  const [simulationComponent, setSimulationComponent] =
    useState<React.ComponentType | null>(null);

  const [toastVariant, setToastVariant] = useState<"default" | "destructive">(
    "default"
  );
  useEffect(() => {
    if (!studentTools.length && !studentLoading && !studentError) {
      console.log("Student tools not loaded, fetching...");

      const demo = `
        <select 
          style={selectStyle}
          value={activity}
          onChange={(e) => {
            setActivity(e.target.value);
            setData([]);
            setTime(0);
          }}
          disabled={isRunning}
        >
          <option value="resting">Resting</option>
          <option value="walking">Walking</option>
          <option value="running">Running</option>
          <option value="swimming">Swimming</option>
        </select>
      </div>

      <div style={{height: '400px'}}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default HeartRateSimulation;`;
      console.log(demo.replace(/^\s*\};\s*export\s+default\s+.*?;?\s*$/m, ""));
      dispatch(loadStudentTools());
    }
  }, [dispatch, studentTools, studentLoading, studentError]);

  const labSimulatorTool = studentTools.find(
    (tool) => tool.name === "Virtual Lab Simulator"
  );
  const code = `  const [counter,setCounter]=React.useState(0);
         const increase=()=>{
           setCounter(counter+1);
         };
         return (<>
           <button onClick={increase}>+</button>
           <span>{'counter : '+ counter}</span>
           </>)`;

  useEffect(() => {
    if (labSimulatorTool?.req_param) {
      try {
        const cleanedReqParamString = labSimulatorTool.req_param.replace(
          /\n/g,
          ""
        );
        const parsedReqParam = JSON.parse(cleanedReqParamString);
        const allExperimentsString = parsedReqParam.experiment;
        if (allExperimentsString) {
          const experimentsArray = allExperimentsString
            .split(",")
            .map((exp: any) => exp.trim());
          setExperiments(experimentsArray);
          console.log("Experiments array:", experimentsArray);
        }
      } catch (error) {
        console.error("Error parsing req_param:", error);
      }
    }
  }, [labSimulatorTool?.req_param]);
  const handleLabSubjectChange = (value: string) => {
    setLabSubject(value);
  };

  const handleGroupLevelChange = (value: string) => {
    setGroupLevel(value);
  };

  const handleExperimentChange = (value: string) => {
    const parts = value.split(`${labSubject}_${groupLevel}_`);
    const experimentName = parts[1]?.replace(/_/g, " ") || value;
    setExperiment(value);

    setExperimentEdit(experimentName);
  };

  useEffect(() => {
    if (labSubject && groupLevel && experiment) {
      setReqParamDetails({
        lab_subject: labSubject,
        group_level: groupLevel,
        experiment,
      });
    } else {
      setReqParamDetails(null);
    }
  }, [labSubject, groupLevel, experiment]);
  const handleStartSimulation = async () => {
    if (!reqParamDetails) {
      setToastMessage("Please select a subject, level, and experiment.");
      setToastVariant("destructive");
      setShowToast(true);
      return;
    }

    const user = JSON.parse(localStorage.getItem("ai-teacha-user") || "{}");
    const user_Id = user?.id;

    if (!user_Id || !labSimulatorTool?.service_id) {
      setToastMessage("User ID or Service ID is missing.");
      setToastVariant("default");
      setShowToast(true);
      return;
    }

    const data: any = {
      user_id: user_Id,
      serviceId: labSimulatorTool.service_id,
      lab_subject: reqParamDetails.lab_subject,
      group_level: reqParamDetails.group_level,
      prompt: labSimulatorTool.prompt,
      purpose: labSimulatorTool.purpose,
      initial: true,
      experiment: reqParamDetails.experiment,
    };

    setIsSubmitting(true);
    try {
      const response = await submitStudentToolData(data);
      const staticResponse = response.data.data.replace(/^```jsx\n|```$/g, "");
      const toolResponse = response.data.data
        .replace(/^```jsx\n|```$/g, "")
        .replace(/^\s*import\s+.*?;?\s*$/gm, "")
        .replace(/^const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{\n?/, "")
        .replace(/^\s*\};\s*export\s+default\s+.*?;?\s*$/m, "")
        .replace(/^\s*const\s+\w+\s*=\s*\(\s*\)\s*=>\s*\{\s*$/m, "")
        .replace(/useState/g, "React.useState")
        .replace(/useEffect/g, "React.useEffect")
        .replace(/useRef/g, "React.useRef")
        .replace(/useMemo/g, "React.useMemo")
        .replace(/useCallback/g, "React.useCallback");
      const markedResponse = marked(response.data.data);
      console.log(staticResponse);
      console.log(toolResponse);
      setResponseMessage(markedResponse);
      setTunedResponseMessage(toolResponse);

      setToastMessage("Simulation results are being processed.");
      setToastVariant("default");
    } catch (error: any) {
      const errorMessage = error.message || "Failed to start simulation.";
      if (errorMessage.includes("Limit")) {
        setToastMessage(errorMessage || "Failed to submit tool data.");
        setToastVariant("destructive");
      } else {
        setResponseMessage(errorMessage);
        console.error("Error starting simulation:", error);
        setToastMessage(errorMessage || "Error starting simulation");
        setToastVariant("default");
        setShowToast(true);
      }
    } finally {
      setIsSubmitting(false);
      setShowToast(true);
    }
  };
  if (studentLoading) {
    return <LoadingToolDetails />;
  }

  if (studentError) {
    return <div>Error loading Lab Simulator.</div>;
  }

  if (!labSimulatorTool) {
    return <div>Lab Simulator tool details not found.</div>;
  }

  const subjectOptions = [
    { label: "Physics", value: "physics" },
    { label: "Biology", value: "biology" },
    { label: "Chemistry", value: "chemistry" },
  ];
  const groupLevelOptions = [
    { label: "Secondary", value: "secondary" },
    { label: "University", value: "university" },
  ];

  const filteredExperiments = experiments.filter((exp) =>
    exp.startsWith(`${labSubject}_${groupLevel}`)
  );

  return (
    <ToastProvider>
      <div className="mt-8 ">
        <div className="flex justify-center items-center w-full">
          {!responseMessage ? (
            <div>
              <div className="text-center">
                <h2>{labSimulatorTool.name}</h2>
                <p>{labSimulatorTool.description}</p>
              </div>
              <div>
                <label
                  htmlFor="labSubject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject:
                </label>
                <Select onValueChange={handleLabSubjectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Subject">
                      {labSubject}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="groupLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Group Level:
                </label>
                <Select onValueChange={handleGroupLevelChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Level">
                      {groupLevel}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {groupLevelOptions.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="experiment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Experiment:
                </label>
                <Select
                  onValueChange={handleExperimentChange}
                  disabled={
                    !labSubject ||
                    !groupLevel ||
                    filteredExperiments.length === 0
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Experiment">
                      {experimentEdit}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {filteredExperiments.map((exp) => {
                      const parts = exp.split(`${labSubject}_${groupLevel}_`);
                      const experimentName =
                        parts[1]?.replace(/_/g, " ") || exp;
                      return (
                        <SelectItem key={exp} value={exp}>
                          {experimentName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {!labSubject || !groupLevel ? (
                  <p className="text-sm text-gray-500 mt-1">
                    Select subject and group level first.
                  </p>
                ) : filteredExperiments.length === 0 ? (
                  <p className="text-sm text-gray-500 mt-1">
                    No experiments available for the selected subject and level.
                  </p>
                ) : null}
              </div>

              {reqParamDetails && (
                <div className="mt-4">
                  <button
                    className="bg-[#5c3cbb] w-full text-white py-2 px-4 rounded-md mt-2"
                    disabled={isSubmitting}
                    onClick={handleStartSimulation}
                  >
                    {isSubmitting
                      ? "Starting Simulation..."
                      : "Start Simulation"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <Button
                variant={"gradient"}
                className="bg-gray-500  py-2 px-4 rounded-md mb-4"
                onClick={() => setResponseMessage(null)}
                disabled={isSubmitting}
              >
                Checkout New Experiment
              </Button>
              <div className="w-full border border-gray-300 bg-white rounded-md h-full overflow-auto ">
                {tunedResponseMessage ? (
                  <>
                    <StringToReactComponent>
                      {`(props)=>{
                      
    ${tunedResponseMessage}
           }`}
                    </StringToReactComponent>
                  </>
                ) : (
                  <MarkdownRenderer
                    className="p-4 bg-white rounded shadow"
                    content={
                      isSubmitting ? "Loading..." : tunedResponseMessage || ""
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {showToast && (
          <Toast variant={toastVariant} onOpenChange={setShowToast}>
            <ToastTitle>
              {toastVariant === "destructive" ? "Error" : "Success"}
            </ToastTitle>
            <ToastDescription>{toastMessage}</ToastDescription>
            <ToastClose />
          </Toast>
        )}

        <ToastViewport />
      </div>
    </ToastProvider>
  );
};

export default LabSimulator;
