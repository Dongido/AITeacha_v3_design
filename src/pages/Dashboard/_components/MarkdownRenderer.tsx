import React, { useState, useEffect } from "react";
import { marked } from "marked";
import parse, { Element, Text } from "html-react-parser";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
  content: string | Promise<string>;
  className?: string;
  style?: React.CSSProperties;
  typingSpeed?: number; 
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
  style,
  typingSpeed = 10,
}) => {
  const [fullMarkdownContent, setFullMarkdownContent] = useState<string>("");
  const [typedMarkdownContent, setTypedMarkdownContent] = useState<string>("");
  const [displayedHtmlContent, setDisplayedHtmlContent] = useState<string>("");
  const [isTypingComplete, setIsTypingComplete] = useState<boolean>(false);

  useEffect(() => {
    const resolveAndSetMarkdown = async () => {
      setIsTypingComplete(false);
      setTypedMarkdownContent("");
      setDisplayedHtmlContent("");

      const resolved = await (typeof content === "string"
        ? Promise.resolve(content)
        : content);

      setFullMarkdownContent(resolved);
    };

    resolveAndSetMarkdown();
  }, [content]);

  // Effect for the typing animation (types Markdown character by character)
  useEffect(() => {
    if (!fullMarkdownContent) {
      setTypedMarkdownContent("");
      setIsTypingComplete(false);
      return;
    }

    let index = 0;
    setIsTypingComplete(false);
    setTypedMarkdownContent(""); // Reset for new typing animation

    const intervalId = setInterval(() => {
      if (index < fullMarkdownContent.length) {
        setTypedMarkdownContent(
          (prev) => prev + fullMarkdownContent.charAt(index)
        );
        index++;
      } else {
        clearInterval(intervalId);
        setIsTypingComplete(true);
      }
    }, typingSpeed);

    return () => clearInterval(intervalId);
  }, [fullMarkdownContent, typingSpeed]);

  // Effect to convert typed Markdown to HTML for display
  // This runs whenever `typedMarkdownContent` changes, ensuring `html-react-parser` always gets valid HTML.
  useEffect(() => {
    if (typedMarkdownContent) {
      const parsedHtml = marked.parse(typedMarkdownContent);
      const htmlString =
        typeof parsedHtml === "string" ? parsedHtml : String(parsedHtml);
      const decodedHtml = decodeHtml(htmlString);
      setDisplayedHtmlContent(decodedHtml);
    } else {
      setDisplayedHtmlContent(""); // Clear if no markdown is typed yet
    }
  }, [typedMarkdownContent]);

  // Helper function to decode HTML entities
  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Function to render HTML using html-react-parser with custom replacements
  const renderHtml = (html: string) => {
    return parse(html, {
      replace: (domNode) => {
        // Ensure domNode is an Element (HTML tag)
        if (domNode.type === "tag") {
          // --- IFRAME RENDERING LOGIC ---
          // This part is already correct and will now work with the new typing method
          if (domNode.name === "iframe" && domNode.attribs) {
            const { width, height, src, frameborder, allow } = domNode.attribs;
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

          // --- CODE BLOCK RENDERING LOGIC (for Syntax Highlighting) ---
          if (
            domNode.name === "pre" &&
            domNode.children &&
            domNode.children[0] &&
            domNode.children[0].type === "tag" &&
            (domNode.children[0] as Element).name === "code"
          ) {
            const codeElement = domNode.children[0] as Element;

            // The actual code content is usually in a Text node child of the <code> tag
            const codeTextNode = codeElement.children[0];
            let codeContent = "";

            // Type guard to ensure codeTextNode is a Text node before accessing 'data'
            if (codeTextNode && codeTextNode.type === "text") {
              codeContent = (codeTextNode as Text).data || "";
            }

            // Extract language from class attribute (e.g., class="language-js")
            const languageMatch =
              codeElement.attribs?.class?.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : "plaintext";

            return (
              <SyntaxHighlighter
                style={dark}
                language={language}
                showLineNumbers
              >
                {codeContent}
              </SyntaxHighlighter>
            );
          }
        }
        // Return undefined for nodes that should be rendered normally by html-react-parser
        return undefined;
      },
    });
  };

  return (
    <div className={className} style={style}>
      {renderHtml(displayedHtmlContent)}
    </div>
  );
};

export default MarkdownRenderer;
