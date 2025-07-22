import React, { useState, useEffect } from "react";
import * as Babel from "@babel/standalone";
import * as FramerMotion from "framer-motion"; // <--- Import Framer Motion here

interface ApiResponse {
  code: string;
}

function DynamicComponentLoader() {
  const [component, setComponent] = useState<React.ComponentType<any> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAndRenderComponent = async () => {
      try {
        const response = await new Promise<ApiResponse>((resolve) =>
          setTimeout(() => {
            resolve({
              code: `
              // The dynamic component expects 'React' and 'FramerMotion' to be passed in
              function MyApiComponent(props) {
                const [count, setCount] = React.useState(0);
                const { motion } = FramerMotion; // <--- Access from the passed-in 'FramerMotion' object

                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.5 } }} // Added transition for visibility
                    style={{ border: '1px solid blue', padding: '10px', margin: '10px' }} // Added style for layout
                  >
                    <h3>Dynamic Component from API!</h3>
                    <p>Message: {props.message}</p>
                    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
                  </motion.div>
                );
              }
              return MyApiComponent;
            `,
            });
          }, 1000)
        );

        const babelResult = Babel.transform(response.code, {
          presets: ["react", "env"],
        });

        if (typeof babelResult.code !== "string") {
          throw new Error(
            "Babel transformation failed: transpiled code is not a string."
          );
        }
        const transpiledCode: string = babelResult.code;

        // Pass FramerMotion (and any other global libraries) as arguments
        const DynamicComponent: React.ComponentType<any> = new Function(
          "React",
          "FramerMotion",
          transpiledCode
        )(React, FramerMotion);
        //                                                      ^ Parameter names          ^ Actual imported objects

        setComponent(() => DynamicComponent);
      } catch (err) {
        console.error("Error loading dynamic component:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchAndRenderComponent();
  }, []);

  if (loading) {
    return <div>Loading dynamic component...</div>;
  }

  if (error) {
    return <div>Error loading component: {error.message}</div>;
  }

  const ComponentToRender = component;
  return ComponentToRender ? (
    <ComponentToRender message="Hello from Parent!" />
  ) : null;
}

export default DynamicComponentLoader;
