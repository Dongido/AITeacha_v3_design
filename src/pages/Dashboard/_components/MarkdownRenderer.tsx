import React, { useState, useEffect } from "react";
import { marked } from "marked";
import parse, { Element } from "html-react-parser";

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
      const resolvedContent = await (typeof content === "string"
        ? Promise.resolve(content)
        : content);

      const parsedHtml = marked(resolvedContent);

      const decodedHtml = decodeHtml(parsedHtml as string);

      setHtmlContent(decodedHtml);
    };

    processContent();
  }, [content]);

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const renderHtml = (html: string) => {
    return parse(html, {
      replace: (domNode) => {
        if (
          (domNode as Element).name === "iframe" &&
          (domNode as Element).attribs
        ) {
          const { width, height, src, frameborder, allow } = (
            domNode as Element
          ).attribs;
          return (
            <iframe
              width={width}
              height={height}
              src={src}
              frameBorder={frameborder || "0"}
              allow={allow}
              allowFullScreen
            ></iframe>
          );
        }
      },
    });
  };

  return (
    <div className={className} style={style}>
      {renderHtml(htmlContent)}
    </div>
  );
};

export default MarkdownRenderer;
