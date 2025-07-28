import React, { useState } from "react";
import {
  getSimulation,
  fetchTopics,
  SimulationResponse,
  TopicsResponse,
} from "../../../api/chat";
import SimulationRenderer from "./SimulationRenderer";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Loader2 } from "lucide-react";
import { Label } from "../../../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/Select";

interface SimulationDashboardPageProps {
  description: string;
  grade: string;
  classroom_id: any;
  classroom_content: any;
  outline_title: any;
  outline_content: any;
}

export default function SimulationDashboardPage({
  description,
  grade,
  classroom_id,
  classroom_content,
  outline_title,
  outline_content,
}: SimulationDashboardPageProps) {
  const [simulationCode, setSimulationCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTopics, setAvailableTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicsGenerated, setTopicsGenerated] = useState<boolean>(false);

  const handleFetchTopics = async () => {
    setLoading(true);
    setError(null);
    setTopicsGenerated(false);
    setAvailableTopics([]);
    setSelectedTopic(null);
    setSimulationCode(null);

    try {
      const response: TopicsResponse = await fetchTopics(
        grade,
        classroom_id,
        classroom_content,
        outline_title,
        outline_content
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        console.log(response);

        setAvailableTopics(response.data);
        if (response.data.length > 0) {
          setSelectedTopic(response.data[0]);
        }

        setTopicsGenerated(true);
      } else {
        setError(response.message || "Failed to fetch topics.");
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching topics."
      );
      console.error("Error fetching topics:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSimulation = async () => {
    if (!selectedTopic) {
      setError("Please select a topic before generating a simulation.");
      return;
    }

    setLoading(true);
    setError(null);
    setSimulationCode(null);
    try {
      const response: SimulationResponse = await getSimulation(
        grade,
        selectedTopic
      );
      if (response.status === "success" && response.data) {
        setSimulationCode(response.data);
      } else {
        setError(response.message || "Failed to get simulation code.");
      }
    } catch (err: any) {
      setError(
        err.message || "An unexpected error occurred while fetching simulation."
      );
      console.error("Error fetching simulation:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full  bg-white shadow-sm rounded-2xl p-6 sm:p-8 space-y-6 border border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-2">
            AI Simulation Generator
          </h1>
          <p className="text-center text-gray-600 text-md sm:text-lg mb-6 max-w-prose mx-auto">
            Generate interactive simulations for your students based on specific
            topics within your classroom content.
          </p>

          <div
            className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-md mb-6"
            role="alert"
          >
            <p className="font-semibold">Context:</p>
            <p className="text-sm">
              <span className="font-medium">Grade:</span> {grade}
            </p>
            <p className="text-sm">
              <span className="font-medium">Description:</span> {description}
            </p>
          </div>

          <div className="space-y-4">
            {!topicsGenerated && (
              <Button
                onClick={handleFetchTopics}
                disabled={loading}
                variant={"gradient"}
                className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Topics...
                  </>
                ) : (
                  "Generate Suggested Topics"
                )}
              </Button>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}

            {topicsGenerated && availableTopics.length > 0 && (
              <div className="space-y-3">
                <Label
                  htmlFor="topics"
                  className="text-base font-medium text-gray-700"
                >
                  Select a Topic
                </Label>
                <Select
                  onValueChange={setSelectedTopic}
                  value={selectedTopic || ""}
                >
                  <SelectTrigger className="w-full h-12 text-base">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchSimulation}
                  disabled={loading || !selectedTopic}
                  variant={"gradient"}
                  className="w-full h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Simulation...
                    </>
                  ) : (
                    "Generate Simulation"
                  )}
                </Button>
              </div>
            )}

            {topicsGenerated && availableTopics.length === 0 && !loading && (
              <p className="text-muted-foreground text-center py-4">
                No topics available for these parameters. Try adjusting your
                classroom content.
              </p>
            )}

            {!topicsGenerated && !loading && !error && !simulationCode && (
              <p className="text-muted-foreground text-center py-4">
                Click "Generate Suggested Topics" to get started and create an
                engaging learning experience.
              </p>
            )}
          </div>
        </div>
        {simulationCode && (
          <div className="mt-8 p-2 border rounded-xl bg-gray-50 shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Generated Simulation
            </h2>
            <SimulationRenderer code={simulationCode} />
          </div>
        )}
      </div>
    </div>
  );
}
