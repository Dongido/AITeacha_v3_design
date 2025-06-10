import React, { useEffect, useState } from "react";

interface SimulationRendererProps {
  code: string;
}

const SimulationRenderer: React.FC<SimulationRendererProps> = ({ code }) => {
  const [Component, setComponent] = useState<React.FC | null>(null);

  useEffect(() => {
    const createComponentFromString = (componentCode: string): React.FC => {
      const exports = {};
      const module = { exports };

      const fullCode = `
        const React = require("react");
        ${componentCode};
        module.exports = exports.default || module.exports;
      `;

      const Comp = new Function("require", "module", "exports", fullCode)(
        (lib: string) => {
          if (lib === "react") return React;
          throw new Error("Only React is supported");
        },
        module,
        exports
      );

      return Comp as React.FC;
    };

    try {
      const Comp = createComponentFromString(code);
      setComponent(() => Comp);
    } catch (error) {
      console.error("Failed to render simulation component:", error);
    }
  }, [code]);

  return Component ? <Component /> : <p>Loading simulation...</p>;
};

export default SimulationRenderer;
