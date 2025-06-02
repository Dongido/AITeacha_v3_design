// DynamicRenderer.tsx
import React from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

interface DynamicRendererProps {
  code: string;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ code }) => {
  return (
    <LiveProvider code={code} noInline={false}>
      <LivePreview />
      <LiveError />
    </LiveProvider>
  );
};

export default DynamicRenderer;
