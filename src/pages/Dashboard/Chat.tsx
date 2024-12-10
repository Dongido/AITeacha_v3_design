import React, { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { TextArea } from "../../components/ui/TextArea";
import { marked } from "marked";
import { motion } from "framer-motion";
import { sendChatMessage } from "../../api/chat";
import greyImg from "../../assets/img/greyimg.avif";
const Chat = () => {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<
    { text: string; fromUser: boolean; isLoading?: boolean }[]
  >([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setMessages((prev) => [
      ...prev,
      { text: inputText, fromUser: true, isLoading: false },
    ]);
    setInputText("");

    setMessages((prev) => [
      ...prev,
      { text: "Zyra is typing...", fromUser: false, isLoading: true },
    ]);

    try {
      const response = await sendChatMessage({
        content: inputText,
        content_from: "aichat",
      });

      const markdownToPlainText = async (markdown: string): Promise<string> => {
        const html = await marked(markdown);
        const decodedHtml = new DOMParser().parseFromString(html, "text/html")
          .body.innerText;
        return decodedHtml.replace(/<[^>]*>?/gm, "");
      };

      const plainTextResponse = await markdownToPlainText(response.data);

      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isLoading),
        { text: response.data, fromUser: false },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => !msg.isLoading),
        { text: "An error occurred. Please try again later.", fromUser: false },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-4 md:mt-0 lg:mt-0">
      <div className="flex flex-col h-[75vh] pt-4 md:pt-0 lg:pt-0 pb-8">
        <div className="flex-grow overflow-y-auto h-[200px] mt-12 lg:mt-4 md:pt-4 bg-gray-50 rounded-lg border border-gray-300 shadow-inner p-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-800 italic">
              Hi👋, welcome to the{" "}
              <span className="text-lg font-bold">Zyra chatbot</span>! Start
              your conversation here!
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex items-start mb-2 ${
                  message.fromUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs p-3 text-sm ${
                    message.fromUser
                      ? "bg-primary text-white rounded-tl-lg"
                      : "bg-gray-200 text-black rounded-tr-lg"
                  }`}
                  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {message.text}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="fixed bottom-0 left-0 w-full bg-white  border-t lg:flex lg:w-[calc(100%-5rem)] lg:ml-[5rem] flex-col lg:flex-row">
          <div className="flex justify-between items-center gap-24 w-full">
            <div
              className="w-64 h-20 bg-cover bg-center relative hidden lg:block"
              style={{ backgroundImage: `url(${greyImg})` }}
            >
              <span className="absolute inset-0 flex items-center text-sm italic justify-center text-white text-lg font-bold bg-black bg-opacity-20">
                Powered By <span className="text-lg ml-1"> Zyra</span>
              </span>
            </div>

            <div className="relative p-2 lg:-ml-24 flex items-center w-full">
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-grow pr-16 px-3 py-2 border text-md rounded-lg"
              />
              <button
                onClick={handleSend}
                aria-label="Send Message"
                disabled={inputText.trim().length === 0}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-full"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
