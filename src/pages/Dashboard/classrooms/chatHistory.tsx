"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  clearChatHistory,
  getChatHistory,
} from "../../../store/slices/classroomSlice";
import { RootState } from "../../../store";
import { marked } from "marked";
import parse, { Element } from "html-react-parser";
import { motion } from "framer-motion";
import { IoArrowBackOutline } from "react-icons/io5";
import {
  fetchClassroomTools,
  fetchToolsChatHistory,
} from "../../../api/classrooms";
import { Loader2 } from "lucide-react";
interface Tool {
  tools_id: number;
  id: number;
  name: string;
}

const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { classroomId, studentId } = useParams<{
    classroomId: string;
    studentId: string;
  }>();

  const { chatHistory } = useAppSelector(
    (state: RootState) => state.classrooms
  );
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state for initial fetch
  const containerRef = useRef<HTMLDivElement>(null);

  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedToolId, setSelectedToolId] = useState<number | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const fetchMainChatHistory = (pageToFetch = 1, append = false) => {
    if (!classroomId || !studentId) return;
    if (!append) {
      setPage(1);
      dispatch(clearChatHistory());
    }

    const params = {
      classroomId: Number(classroomId),
      studentId: Number(studentId),
      page: pageToFetch,
      append,
    };
    dispatch(getChatHistory(params));
  };

  const fetchToolChatHistory = async (
    toolId: number,
    pageToFetch = 1,
    append = false
  ) => {
    if (!classroomId || !studentId) return;

    if (!append) {
      setPage(1);
      dispatch(clearChatHistory());
    }

    const params = {
      classroomId: Number(classroomId),
      userId: Number(studentId),
      page: pageToFetch,
      append,
      toolId,
    };

    try {
      const history = await fetchToolsChatHistory({
        classroomId: Number(classroomId),
        toolId,
        userId: Number(studentId),
        page: pageToFetch,
        limit: 10,
      });
      dispatch(getChatHistory({ ...params, history }));
    } catch (error) {
      console.error("Failed to fetch tool chat history:", error); // Optionally handle error state
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (classroomId && studentId) {
        setLoading(true); // Start loading
        try {
          const toolsData = await fetchClassroomTools(Number(classroomId));
          setTools(toolsData);
          setSelectedToolId(null);
          fetchMainChatHistory();
        } catch (error) {
          console.error("Failed to load initial data:", error);
        } finally {
          setLoading(false); // End loading regardless of outcome
        }
      }
    };

    loadInitialData();

    return () => {
      dispatch(clearChatHistory());
    };
  }, [dispatch, classroomId, studentId]);

  const handleToolClick = async (toolId: number | null) => {
    setSelectedToolId(toolId);
    setLoading(true); // Start loading when a new tool is selected
    console.log("Selected Tool ID:", toolId);
    try {
      if (toolId === null) {
        fetchMainChatHistory();
      } else {
        await fetchToolChatHistory(toolId);
      }
    } catch (error) {
      console.error("Failed to fetch chat history for tool:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (containerRef.current && page === 1 && !loading) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatHistory, page, loading]);

  const handleLoadMore = async () => {
    if (!classroomId || !studentId || !containerRef.current || isLoadingMore)
      return;

    const container = containerRef.current;
    const previousScrollHeight = container.scrollHeight;
    setIsLoadingMore(true);

    const nextPage = page + 1;

    try {
      if (selectedToolId === null) {
        fetchMainChatHistory(nextPage, true);
      } else {
        await fetchToolChatHistory(selectedToolId, nextPage, true);
      }
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load more chat history:", error);
    } finally {
      setIsLoadingMore(false);
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          newScrollHeight - previousScrollHeight + container.scrollTop;
      });
    }
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
        const resolvedContent =
          typeof content === "string" ? content : await content;
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
        {renderHtml(displayedHtml)}{" "}
      </div>
    );
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {" "}
      <div className="p-4 my-4 shadow-sm flex items-center">
        {" "}
        <button
          onClick={handleBack}
          className="flex items-center bg-white rounded-md p-3 px-6 text-[#5c3cbb] hover:text-indigo-700"
        >
          <IoArrowBackOutline size={24} />{" "}
          <span className="ml-2 font-semibold">Back</span>{" "}
        </button>{" "}
      </div>{" "}
      <div className="flex-none bg-white p-2 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
        {" "}
        <div className="inline-flex space-x-2">
          {" "}
          <button
            onClick={() => handleToolClick(null)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors
       ${
         selectedToolId === null
           ? "bg-[#5c3cbb] text-white"
           : "bg-gray-100 text-gray-700 hover:bg-gray-200"
       }`}
          >
            Main Chat{" "}
          </button>{" "}
          {tools.map((tool) => (
            <button
              key={tool.tools_id}
              onClick={() => handleToolClick(tool.tools_id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors capitalize
        ${
          selectedToolId === tool.tools_id
            ? "bg-[#5c3cbb] text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
            >
              {tool.name}{" "}
            </button>
          ))}{" "}
        </div>{" "}
      </div>{" "}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          {" "}
          <Loader2
            name="loader2"
            className="animate-spin text-[#5c3cbb] h-8 w-8"
          />{" "}
        </div>
      ) : chatHistory.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg font-semibold mb-2">
              No chat available for this tool.{" "}
            </p>
            <p className="text-gray-500 text-sm">
              Start a conversation to see messages here.{" "}
            </p>{" "}
          </div>{" "}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="p-4 bg-white space-y-4 overflow-y-auto flex-1 flex flex-col-reverse"
        >
          {" "}
          <div className="flex justify-center my-2">
            {" "}
            <button
              className="px-4 py-2 bg-[#5c3cbb] text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load More"}{" "}
            </button>{" "}
          </div>{" "}
          {[...chatHistory].reverse().map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`flex ${
                message.label === "question" ? "justify-end" : "justify-start"
              }`}
            >
              {" "}
              <div
                className={`p-3 text-sm max-w-xs md:max-w-md lg:max-lg rounded-lg shadow
         ${
           message.label === "question"
             ? "bg-[#5c3cbb] text-white rounded-tl-lg"
             : "bg-gray-200 text-black rounded-tr-lg"
         }`}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                {" "}
                <MarkdownRenderer
                  content={message.content}
                  shouldType={
                    message.label !== "question" && !message.isHistory
                  }
                />{" "}
                <div className="text-[10px] text-right mt-1 opacity-50">
                  {" "}
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>
          ))}{" "}
        </div>
      )}{" "}
    </div>
  );
};

export default ChatHistory;
