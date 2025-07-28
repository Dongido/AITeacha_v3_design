import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo, 
  createContext,
  Fragment,
} from "react";

import { useRunner } from "react-runner";
import * as ReactNamespace from "react";

import * as Recharts from "recharts";
import * as LucideReact from "lucide-react";

interface SimulationRendererProps {
  code: string;
}

const SimulationRenderer: React.FC<SimulationRendererProps> = ({ code }) => {
  console.log("Code to be rendered:", code);

  const scope = useMemo(() => {
    return {
      React: React,
      useState: useState,
      useEffect: useEffect,
      useCallback: useCallback,
      useRef: useRef,
      useMemo: useMemo,
      createContext: createContext,
      Fragment: Fragment,

      import: {
        react: ReactNamespace,
        recharts: Recharts,
        "lucide-react": LucideReact,
      },
    };
  }, [
    React,
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
    createContext,
    Fragment,
    ReactNamespace,
    Recharts,
    LucideReact,
  ]);

  const { element: simulationElement, error: runnerError } = useRunner({
    code,
    scope,
  });

  useEffect(() => {
    if (runnerError) {
      console.error("Runner Execution Error:", runnerError);
    }
  }, [runnerError]);
  return (
    <div className="simulation-renderer-container p-4 border rounded-lg bg-white shadow-sm">
      {runnerError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Simulation Error:</strong>
          <span className="block sm:inline ml-2">
            {runnerError || String(runnerError)}
          </span>
        </div>
      )}

      {simulationElement}

      {!simulationElement && !runnerError && (
        <div className="text-gray-500 text-center py-8">
          Loading simulation... or no component to render.
        </div>
      )}
    </div>
  );
};

export default SimulationRenderer;
