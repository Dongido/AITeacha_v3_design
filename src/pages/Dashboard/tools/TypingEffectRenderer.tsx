import React, { useState, useEffect } from "react";
import parse from "html-react-parser";

interface TypingEffectRendererProps {
  content: string;
  typingSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TypingEffectRenderer: React.FC<TypingEffectRendererProps> = ({
  content,
  typingSpeed = 10,
  className,
  style,
}) => {
  const [typedContent, setTypedContent] = useState<string>("");
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  useEffect(() => {
    setTypedContent("");
    setIsTypingComplete(false);

    if (!content) {
      return;
    }

    let index = 0;
    const intervalId = setInterval(() => {
      if (index < content.length) {
        setTypedContent((prev) => prev + content.charAt(index));
        index++;
      } else {
        clearInterval(intervalId);
        setIsTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [content, typingSpeed]);

  return (
    <div className={className} style={style}>
      {parse(typedContent)}
      {!isTypingComplete && <span className="animate-pulse">_</span>}
    </div>
  );
};

export default TypingEffectRenderer;
