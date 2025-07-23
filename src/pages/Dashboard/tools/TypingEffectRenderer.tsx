import React, { useEffect, useState } from "react";
import parse, { Element } from "html-react-parser";

interface TypingEffectRendererProps {
  content: string;
  typingSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TypingEffectRenderer: React.FC<TypingEffectRendererProps> = ({
  content,
  typingSpeed = 15,
  className,
  style,
}) => {
  const [displayedContent, setDisplayedContent] = useState<string>("");

  useEffect(() => {
    setDisplayedContent("");
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedContent((prev) => {
        const next = content.slice(0, index);
        index++;
        if (index > content.length) clearInterval(interval);
        return next;
      });
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [content, typingSpeed]);

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
      {renderHtml(displayedContent)}
    </div>
  );
};

export default TypingEffectRenderer;
