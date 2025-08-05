"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { clearChatHistory, getChatHistory } from "../../../store/slices/classroomSlice";
import { RootState } from "../../../store";
import { marked } from "marked";
import parse, { Element } from "html-react-parser";
import { motion } from "framer-motion";

const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const { classroomId, studentId } = useParams<{
    classroomId: string;
    studentId: string;
  }>();

  const { chatHistory } = useAppSelector((state: RootState) => state.classrooms);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (classroomId && studentId) {
      dispatch(getChatHistory({ classroomId, studentId, page: 1, append: false }));
    }

    return () => {
      dispatch(clearChatHistory());
    };
  }, [dispatch, classroomId, studentId]);

  useEffect(() => {
    if (containerRef.current && page === 1) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatHistory, page]);
  const handleLoadMore = async () => {
    if (!classroomId || !studentId || !containerRef.current) return;
    const container = containerRef.current;
    const previousScrollHeight = container.scrollHeight;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    await dispatch(getChatHistory({ classroomId, studentId, page: nextPage, append: true }));
    setPage(nextPage);
    setIsLoadingMore(false);
    requestAnimationFrame(() => {
      const newScrollHeight = container.scrollHeight;
      container.scrollTop = newScrollHeight - previousScrollHeight + container.scrollTop;
    });
  };

  const MarkdownRenderer = ({
    content,
    shouldType = true,
    typingSpeed = 30,
    className,
    style,
  }: {
    content: string | Promise<string>;
    shouldType?: boolean;
    typingSpeed?: number;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const [fullHtml, setFullHtml] = useState<string>("");
    const [displayedHtml, setDisplayedHtml] = useState<string>("");

    useEffect(() => {
      const processContent = async () => {
        const resolvedContent = typeof content === "string" ? content : await content;
        const parsedHtml = await marked(resolvedContent);
        const decodedHtml = decodeHtml(parsedHtml);
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

      let index = 0;
      const maxDuration = 2000;
      const maxCharacters = Math.floor(maxDuration / typingSpeed);

      const interval = setInterval(() => {
        index++;
        if (index >= maxCharacters || index > fullHtml.length) {
          clearInterval(interval);
          setDisplayedHtml(fullHtml);
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
          if ((domNode as Element).name === "iframe" && (domNode as Element).attribs) {
            const { width, height, src, frameborder, allow } = (domNode as Element).attribs;
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

  return chatHistory.length === 0 ? (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-400 text-lg font-semibold mb-2">No chat available</p>
        <p className="text-gray-500 text-sm">Start a conversation to see messages here.</p>
      </div>
    </div>
  ) : (
    <div
      ref={containerRef}
      className="p-4 space-y-4 overflow-y-auto h-screen bg-gray-50 flex flex-col-reverse"
    >
      {/* Load More button at the top */}
      <div className="flex justify-center">
        <button
          className="px-4 py-2 bg-[#5c3cbb] text-white rounded hover:bg-indigo-700 disabled:opacity-50"
          onClick={handleLoadMore}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "Loading..." : "Load More"}
        </button>
      </div>
      {[...chatHistory].reverse().map((message, index) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className={`flex ${message.label === "question" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`p-3 text-sm max-w-xs md:max-w-md lg:max-w-lg rounded-lg shadow
            ${message.label === "question"
                ? "bg-[#5c3cbb] text-white rounded-tl-lg"
                : "bg-gray-200 text-black rounded-tr-lg"
              }`}
            style={{
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            <MarkdownRenderer
              content={message.content}
              shouldType={message.label !== "question" && !message.isHistory}
            />
            <div className="text-[10px] text-right mt-1 opacity-50">
              {new Date(message.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

};

export default ChatHistory;
