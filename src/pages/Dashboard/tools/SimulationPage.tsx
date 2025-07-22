import React, { useEffect, useState } from "react";
import { getSimulation, SimulationResponse } from "../../../api/chat";
import SimulationRenderer from "./SimulationRenderer";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";

export default function SimulationDashboardPage() {
  const [simulationCode, setSimulationCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<string>("");
  const [topicsInput, setTopicsInput] = useState<string>("");

  const fetchSimulation = async () => {
    if (!gradeInput || !topicsInput) {
      setError("Please enter both grade and topics.");
      return;
    }

    setLoading(true);
    setError(null);
    setSimulationCode(null);
    try {
      const response: SimulationResponse = await getSimulation(
        gradeInput,
        topicsInput
      );
      if (response.status === "success" && response.data) {
        const example =
          'import React, { useState, useEffect } from \'react\';\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from \'recharts\';\nimport { Heart, Play, Pause, RotateCcw, Activity } from \'lucide-react\';\n\ninterface HeartRateVariables {\n  exercise: number;\n  caffeine: number;\n  temperature: number;\n  stress: number;\n  age: number;\n}\n\ninterface HeartRateData {\n  time: number;\n  heartRate: number;\n  exercise: number;\n  caffeine: number;\n  stress: number;\n  temperature: number;\n}\n\ninterface HeartRateStatus {\n  status: \'Bradycardia\' | \'Normal\' | \'Tachycardia\';\n  color: string;\n  bg: string;\n}\n\ntype VariableKey = keyof HeartRateVariables;\n\nconst HeartRateSimulator: React.FC = () => {\n  const [isRunning, setIsRunning] = useState<boolean>(false);\n  const [currentTime, setCurrentTime] = useState<number>(0);\n  const [heartRate, setHeartRate] = useState<number>(72);\n  const [data, setData] = useState<HeartRateData[]>([]);\n  const [variables, setVariables] = useState<HeartRateVariables>({\n    exercise: 0,\n    caffeine: 0,\n    temperature: 20,\n    stress: 0,\n    age: 16\n  });\n\n  const calculateHeartRate = (): number => {\n    const baseRate: number = 220 - variables.age;\n    const restingRate: number = variables.age < 20 ? 70 : variables.age < 40 ? 72 : 75;\n\n    const exerciseEffect: number = (variables.exercise / 100) * (baseRate - restingRate) * 0.8;\n    const caffeineEffect: number = variables.caffeine * 8;\n\n    let tempEffect: number = 0;\n    if (variables.temperature < 18) {\n      tempEffect = (18 - variables.temperature) * 2;\n    } else if (variables.temperature > 25) {\n      tempEffect = (variables.temperature - 25) * 1.5;\n    }\n\n    const stressEffect: number = (variables.stress / 100) * 20;\n\n    const calculatedRate: number = restingRate + exerciseEffect + caffeineEffect + tempEffect + stressEffect;\n    const variation: number = (Math.random() - 0.5) * 4;\n\n    return Math.max(50, Math.min(200, Math.round(calculatedRate + variation)));\n  };\n\n  useEffect(() => {\n    let interval: NodeJS.Timeout;\n    if (isRunning) {\n      interval = setInterval(() => {\n        setCurrentTime((prev: number) => prev + 1);\n        const newHeartRate: number = calculateHeartRate();\n        setHeartRate(newHeartRate);\n        setData((prev: HeartRateData[]) => {\n          const newData: HeartRateData[] = [...prev, {\n            time: currentTime,\n            heartRate: newHeartRate,\n            exercise: variables.exercise,\n            caffeine: variables.caffeine,\n            stress: variables.stress,\n            temperature: variables.temperature\n          }];\n          return newData.slice(-60);\n        });\n      }, 1000);\n    }\n    return () => {\n      if (interval) {\n        clearInterval(interval);\n      }\n    };\n  }, [isRunning, currentTime, variables, calculateHeartRate]);\n\n  const handleVariableChange = (variable: VariableKey, value: number): void => {\n    setVariables((prev: HeartRateVariables) => ({\n      ...prev,\n      [variable]: value\n    }));\n  };\n\n  const resetSimulation = (): void => {\n    setIsRunning(false);\n    setCurrentTime(0);\n    setData([]);\n    setHeartRate(72);\n    setVariables({\n      exercise: 0,\n      caffeine: 0,\n      temperature: 20,\n      stress: 0,\n      age: 16\n    });\n  };\n\n  const getHeartRateStatus = (): HeartRateStatus => {\n    if (heartRate < 60) return { status: \'Bradycardia\', color: \'text-blue-600\', bg: \'bg-blue-100\' };\n    if (heartRate > 100) return { status: \'Tachycardia\', color: \'text-red-600\', bg: \'bg-red-100\' };\n    return { status: \'Normal\', color: \'text-green-600\', bg: \'bg-green-100\' };\n  };\n\n  const formatTime = (time: number): string => {\n    return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, \'0\')}`;\n  };\n\n  const hrStatus: HeartRateStatus = getHeartRateStatus();\n\n  return (\n    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">\n      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">\n        <div className="flex items-center justify-between mb-6">\n          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">\n            <Heart className="text-red-500" size={36} />\n            Heart Rate Experiment Simulator\n          </h1>\n          <div className="flex gap-2">\n            <button\n              onClick={() => setIsRunning(!isRunning)}\n              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${\n                isRunning\n                  ? \'bg-red-500 hover:bg-red-600 text-white\'\n                  : \'bg-green-500 hover:bg-green-600 text-white\'\n              }`}\n            >\n              {isRunning ? <Pause size={20} /> : <Play size={20} />}\n              {isRunning ? \'Pause\' : \'Start\'}\n            </button>\n            <button\n              onClick={resetSimulation}\n              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"\n            >\n              <RotateCcw size={20} />\n              Reset\n            </button>\n          </div>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">\n          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white">\n            <div className="flex items-center justify-between">\n              <div>\n                <p className="text-red-100 text-sm">Current Heart Rate</p>\n                <p className="text-4xl font-bold">{heartRate}</p>\n                <p className="text-red-100 text-sm">BPM</p>\n              </div>\n              <Activity size={48} className={isRunning ? \'animate-pulse\' : \'\'} />\n            </div>\n          </div>\n\n          <div className={`${hrStatus.bg} rounded-xl p-6`}>\n            <div className="text-center">\n              <p className="text-gray-600 text-sm mb-2">Status</p>\n              <p className={`text-2xl font-bold ${hrStatus.color}`}>{hrStatus.status}</p>\n              <p className="text-gray-600 text-xs mt-2">\n                Normal: 60-100 BPM\n              </p>\n            </div>\n          </div>\n\n          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">\n            <div className="text-center">\n              <p className="text-blue-100 text-sm">Time Elapsed</p>\n              <p className="text-3xl font-bold">{formatTime(currentTime)}</p>\n              <p className="text-blue-100 text-sm">Minutes</p>\n            </div>\n          </div>\n        </div>\n\n        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">\n          <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">\n            <label className="block text-sm font-semibold text-orange-800 mb-2">\n              Exercise Intensity: {variables.exercise}%\n            </label>\n            <input\n              type="range"\n              min="0"\n              max="100"\n              value={variables.exercise}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n                handleVariableChange(\'exercise\', parseInt(e.target.value))\n              }\n              className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"\n            />\n            <p className="text-xs text-orange-600 mt-1">0% = Rest, 100% = Maximum</p>\n          </div>\n\n          <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-200">\n            <label className="block text-sm font-semibold text-amber-800 mb-2">\n              Caffeine: {variables.caffeine} cups\n            </label>\n            <input\n              type="range"\n              min="0"\n              max="3"\n              step="0.5"\n              value={variables.caffeine}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n                handleVariableChange(\'caffeine\', parseFloat(e.target.value))\n              }\n              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"\n            />\n            <p className="text-xs text-amber-600 mt-1">Coffee/Energy drinks</p>\n          </div>\n\n          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">\n            <label className="block text-sm font-semibold text-blue-800 mb-2">\n              Temperature: {variables.temperature}°C\n            </label>\n            <input\n              type="range"\n              min="5"\n              max="40"\n              value={variables.temperature}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n                handleVariableChange(\'temperature\', parseInt(e.target.value))\n              }\n              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"\n            />\n            <p className="text-xs text-blue-600 mt-1">Environmental temperature</p>\n          </div>\n\n          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">\n            <label className="block text-sm font-semibold text-purple-800 mb-2">\n              Stress Level: {variables.stress}%\n            </label>\n            <input\n              type="range"\n              min="0"\n              max="100"\n              value={variables.stress}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n                handleVariableChange(\'stress\', parseInt(e.target.value))\n              }\n              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"\n            />\n            <p className="text-xs text-purple-600 mt-1">Mental/emotional stress</p>\n          </div>\n\n          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">\n            <label className="block text-sm font-semibold text-green-800 mb-2">\n              Age: {variables.age} years\n            </label>\n            <input\n              type="range"\n              min="12"\n              max="25"\n              value={variables.age}\n              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n                handleVariableChange(\'age\', parseInt(e.target.value))\n              }\n              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"\n            />\n            <p className="text-xs text-green-600 mt-1">Affects maximum HR</p>\n          </div>\n        </div>\n\n        <div className="bg-gray-50 p-4 rounded-lg">\n          <h3 className="text-lg font-semibold mb-4 text-gray-800">Real-time Heart Rate Monitor</h3>\n          <ResponsiveContainer width="100%" height={300}>\n            <LineChart data={data}>\n              <CartesianGrid strokeDasharray="3 3" />\n              <XAxis\n                dataKey="time"\n                label={{ value: \'Time (seconds)\', position: \'insideBottom\', offset: -10 }}\n              />\n              <YAxis\n                label={{ value: \'Heart Rate (BPM)\', angle: -90, position: \'insideLeft\' }}\n                domain={[40, 200]}\n              />\n              <Tooltip\n                formatter={(value: number, name: string) => {\n                  switch (name) {\n                    case \'heartRate\':\n                      return [`${value} BPM`, \'Heart Rate\'];\n                    case \'exercise\':\n                      return [`${value}%`, \'Exercise Intensity\'];\n                    case \'caffeine\':\n                      return [`${value} cups`, \'Caffeine Intake\'];\n                    case \'stress\':\n                      return [`${value}%`, \'Stress Level\'];\n                    case \'temperature\':\n                      return [`${value}°C`, \'Temperature\'];\n                    default:\n                      return [value, name];\n                  }\n                }}\n              />\n              <Legend />\n              <Line\n                type="monotone"\n                dataKey="heartRate"\n                stroke="#dc2626"\n                strokeWidth={3}\n                dot={false}\n                name="Heart Rate (BPM)"\n              />\n              <Line\n                type="monotone"\n                dataKey="exercise"\n                stroke="#ea580c"\n                strokeWidth={2}\n                dot={false}\n                strokeDasharray="5 5"\n                name="Exercise Intensity"\n              />\n              <Line\n                type="monotone"\n                dataKey="caffeine"\n                stroke="#d97706"\n                strokeWidth={2}\n                dot={false}\n                strokeDasharray="3 3"\n                name="Caffeine Intake"\n              />\n              <Line\n                type="monotone"\n                dataKey="stress"\n                stroke="#8b5cf6"\n                strokeWidth={2}\n                dot={false}\n                strokeDasharray="2 2"\n                name="Stress Level"\n              />\n              <Line\n                type="monotone"\n                dataKey="temperature"\n                stroke="#3b82f6"\n                strokeWidth={2}\n                dot={false}\n                strokeDasharray="1 1"\n                name="Temperature (°C)"\n              />\n            </LineChart>\n          </ResponsiveContainer>\n        </div>\n\n        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">\n          <div className="bg-blue-50 p-4 rounded-lg">\n            <h4 className="font-semibold text-blue-800 mb-2">🧠 What affects heart rate?</h4>\n            <ul className="text-sm text-blue-700 space-y-1">\n              <li>• <strong>Exercise:</strong> Muscles need more oxygen, heart pumps faster</li>\n              <li>• <strong>Caffeine:</strong> Stimulates nervous system, increases heart rate</li>\n              <li>• <strong>Temperature:</strong> Body works harder to maintain temperature</li>\n              <li>• <strong>Stress:</strong> Fight-or-flight response increases heart rate</li>\n              <li>• <strong>Age:</strong> Maximum heart rate decreases with age</li>\n            </ul>\n          </div>\n\n          <div className="bg-green-50 p-4 rounded-lg">\n            <h4 className="font-semibold text-green-800 mb-2">🔬 Try these experiments:</h4>\n            <ul className="text-sm text-green-700 space-y-1">\n              <li>• Start with no exercise, then gradually increase intensity</li>\n              <li>• Compare heart rate at different temperatures</li>\n              <li>• See how caffeine affects resting vs. exercising heart rate</li>\n              <li>• Observe the combined effect of stress and exercise</li>\n              <li>• Compare different age groups\' maximum heart rates</li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  );\n};';
        setSimulationCode(example);
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

      <div className="grid gap-4 mb-8 max-w-xl">
        <div>
          <Label htmlFor="grade">Grade (e.g., "10th Grade")</Label>
          <Input
            id="grade"
            type="text"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            placeholder="e.g., 10th Grade"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="topics">
            Topics (e.g., "Physics, Electromagnetism")
          </Label>
          <Input
            id="topics"
            type="text"
            value={topicsInput}
            onChange={(e) => setTopicsInput(e.target.value)}
            placeholder="e.g., Physics, Electromagnetism"
            className="mt-1"
          />
        </div>
        <Button
          onClick={fetchSimulation}
          disabled={loading}
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
          Enter grade and topics to generate a simulation.
        </p>
      )}
    </div>
  );
}
