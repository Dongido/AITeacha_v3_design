import React, { useEffect, useState } from "react";
import {
  getSimulation,
  fetchTopics,
  SimulationResponse,
  TopicsResponse,
} from "../../../api/chat";
import SimulationRenderer from "./SimulationRenderer";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
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

  useEffect(() => {
    const getAvailableTopics = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: TopicsResponse = await fetchTopics(
          grade,
          classroom_id,
          classroom_content,
          outline_title,
          outline_content
        );

        if (response.status === "success" && response.data) {
          setAvailableTopics(response.data);
          if (response.data.length > 0) {
            setSelectedTopic(response.data[0]);
          }
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

    getAvailableTopics();
  }, [grade, classroom_id, classroom_content, outline_title, outline_content]);

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Simulation Generator</h1>

      <div className="mb-4">
        <p className="text-lg text-gray-700">
          <strong className="text-blue-600">Grade:</strong> {grade}
        </p>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid gap-4 mb-8 max-w-xl">
        <div>
          <Label htmlFor="topics">Select Topic</Label>
          {loading ? (
            <p className="text-muted-foreground mt-1">Loading topics...</p>
          ) : availableTopics.length > 0 ? (
            <Select
              onValueChange={setSelectedTopic}
              value={selectedTopic || ""}
            >
              <SelectTrigger className="w-full mt-1">
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
          ) : (
            <p className="text-muted-foreground mt-1">
              No topics available for these parameters.
            </p>
          )}
        </div>
        <Button
          onClick={fetchSimulation}
          disabled={loading || !selectedTopic}
          variant={"gradient"}
          className="mt-4"
        >
          {loading ? "Generating Simulation..." : "Generate Simulation"}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {simulationCode && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Generated Simulation:</h2>
          <SimulationRenderer code={simulationCode} />
        </div>
      )}

      {!simulationCode && !loading && !error && (
        <p className="text-muted-foreground">
          Select a topic and click "Generate Simulation" to get started.
        </p>
      )}
    </div>
  );
}
