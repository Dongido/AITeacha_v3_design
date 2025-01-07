import React, { useState, useEffect } from "react";
import { marked } from "marked";
import parse from "html-react-parser";

interface MarkdownRendererProps {
  content: string | Promise<string>;
  className?: string;
  style?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  style,
}) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const processContent = async () => {
      const resolvedContent =
        typeof content === "string" ? content : await content;
      const parsedHtml = marked(resolvedContent);
      setHtmlContent(parsedHtml as string);
    };

    processContent();
  }, [content]);

  return (
    <div className={className} style={style}>
      {parse(htmlContent)}
    </div>
  );
};

export default MarkdownRenderer;
