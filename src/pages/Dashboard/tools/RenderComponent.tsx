import { useMemo } from "react";

const RenderComponent = ({ componentCode }: { componentCode: string }) => {
  const Component = useMemo(() => {
    try {
      console.log(componentCode);
      const ComponentFunc = new Function(`return (${componentCode});`);
      return ComponentFunc();
    } catch (error) {
      console.error("Error rendering JSX component:", error);
      return () => <div>Error rendering component.</div>;
    }
  }, [componentCode]);

  return <>{Component}</>;
};
export default RenderComponent;
