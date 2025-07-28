import React, { useState, useEffect } from "react";
import { marked } from "marked";
import parse, { Element } from "html-react-parser";

interface MarkdownRendererProps {
  content: string | Promise<string>;
  className?: string;
  style?: React.CSSProperties;
  typingSpeed?: number;
  shouldType?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  style,
  typingSpeed = 30,
  shouldType = true,
}) => {
  const [fullHtml, setFullHtml] = useState<string>("");
  const [displayedHtml, setDisplayedHtml] = useState<string>("");

  useEffect(() => {
    const processContent = async () => {
      const resolvedContent =
        typeof content === "string" ? content : await content;
      const parsedHtml = marked(resolvedContent);
      const decodedHtml = decodeHtml(parsedHtml as string);

      setFullHtml(decodedHtml);

      if (!shouldType) {
        setDisplayedHtml(decodedHtml);
      } else {
        setDisplayedHtml("");
      }
    };

    processContent();
  }, [content, shouldType]);

  useEffect(() => {
    if (!fullHtml || !shouldType) return;

    const maxDuration = 2000; // 4 seconds
    const maxCharacters = Math.floor(maxDuration / typingSpeed);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index >= maxCharacters || index > fullHtml.length) {
        clearInterval(interval);
        setDisplayedHtml(fullHtml); // Show rest of content instantly
      } else {
        setDisplayedHtml(fullHtml.slice(0, index));
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [fullHtml, typingSpeed, shouldType]);

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
            />
          );
        }
      },
    });
  };

  return (
    <div className={className} style={style}>
      {renderHtml(displayedHtml)}
    </div>
  );
};

export default MarkdownRenderer;
