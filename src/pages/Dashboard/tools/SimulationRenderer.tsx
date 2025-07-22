import React, { useEffect, useState } from "react";
import * as Babel from "@babel/standalone"; // Import Babel standalone

interface SimulationRendererProps {
  code: string;
}

const SimulationRenderer: React.FC<SimulationRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.FC | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComponent(null);
    setError(null);
    console.log("Input code:", code); // Log the input code for debugging

    if (!code) {
      return;
    }

    let objectUrl: string | null = null;

    try {
      // Configure Babel to output ES Modules
      const transpiledCode = Babel.transform(code, {
        presets: [
          "react",
          // Use @babel/preset-env with modules: false to preserve ES Modules syntax
          ["env", { modules: false }],
          "typescript",
        ],
        filename: "dynamic-component.tsx",
      }).code;

      if (!transpiledCode) {
        throw new Error("Babel transpilation resulted in empty code.");
      }

      console.log("Transpiled code:", transpiledCode); // Log the transpiled code for debugging

      // The `export default` needs to be correctly positioned at the end of the module.
      // Babel should handle this if the input code is a valid React component.
      const moduleCode = transpiledCode;

      const blob = new Blob([moduleCode], { type: "application/javascript" });
      objectUrl = URL.createObjectURL(blob);

      import(/* webpackIgnore: true */ objectUrl)
        .then((module) => {
          // Check for `module.default` as an ES Module export
          if (
            module.default &&
            (typeof module.default === "function" ||
              (typeof module.default === "object" &&
                React.isValidElement(module.default)))
          ) {
            setComponent(() => module.default);
          } else {
            setError(
              "The transpiled code does not export a valid React component as default. " +
                "Ensure your original code string ends with 'export default YourComponent;'"
            );
            console.error(
              "Dynamic module import failed: No default React component found.",
              module
            );
          }
        })
        .catch((err) => {
          setError(
            `Failed to load component after transpilation: ${err.message}. ` +
              `Check for errors in your original code string or missing global dependencies like 'React', 'recharts', 'lucide-react'.`
          );
          console.error("Dynamic module import error:", err);
        })
        .finally(() => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        });
    } catch (e: any) {
      setError(`Failed to transpile or prepare module: ${e.message}`);
      console.error(
        "Error during client-side transpilation or module preparation:",
        e
      );
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [code]);

  if (error) {
    return (
      <div
        style={{
          color: "red",
          border: "1px solid red",
          padding: "10px",
          margin: "10px",
        }}
      >
        <p>Error rendering simulation component:</p>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontSize: "0.9em",
          }}
        >
          {error}
        </pre>
      </div>
    );
  }

  return Component ? <Component /> : <p>Loading simulation...</p>;
};

export default SimulationRenderer;
