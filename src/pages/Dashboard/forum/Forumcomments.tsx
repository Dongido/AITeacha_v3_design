import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";

interface Message {
  id: string;
  avatar: string;
  sender: string;
  text: string;
  date: string;
  topic: string;
  parent_id?: string | null;
}

interface Props {
  messages: Message[];
  visibleMessageCount: number;
  onReply: (msg: Message) => void;
   onLoadMore: () => void;
   onShowLess:() => void
}

const Forumcomments: React.FC<Props> = ({
  messages,
  visibleMessageCount,
  onReply,
  onLoadMore,
  onShowLess
}) => {
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});

  const toggleReplies = (parentId: string) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const getReplies = (parentId: string) =>
    messages.filter((msg) => msg.parent_id === parentId);

 const topLevel = messages
  .filter((msg) => !msg.parent_id)
  .slice(0, visibleMessageCount);

  const ReplyItem = ({ reply }: { reply: Message }) => {
    const children = getReplies(reply.id);
    return (
      <div className="ml-6 mt-2 p-2 bg-purple-50 border-l-4 border-purple-200 rounded-md lg:max-w-[450px] w-[90%]">
        <div className="flex items-center gap-2 mb-1">
          <img
            src={reply.avatar}
            alt={reply.sender}
            className="w-6 h-6 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-purple-700">{reply.sender}</span>
            <span className="text-xs text-gray-400">{reply.date}</span>
          </div>
        </div>
        <p className="text-gray-700 text-sm">{reply.text}</p>
        <div className="mt-2 flex gap-3 text-xs text-purple-600">
          <button onClick={() => onReply(reply)} className="hover:underline">Reply</button>
          <button onClick={() => handleCopy(reply.text)} className="flex items-center gap-1 hover:underline">
            <FiCopy /> Copy
          </button>
          {children.length > 0 && (
            <button onClick={() => toggleReplies(reply.id)} className="hover:underline">
              {visibleReplies[reply.id] ? "Hide Replies" : "View Replies"}
            </button>
          )}
        </div>

        {/* Render nested replies */}
       <div className="w-[80%] border-purple-200 border-1">
         {visibleReplies[reply.id] &&
          children.map((childReply) => <ReplyItem key={childReply.id} reply={childReply} />)}
       </div>


      </div>
    );
  };

  return (
    <div className="space-y-4 mb-10">
      {topLevel.map((msg) => (
        <div key={msg.id} className="flex flex-col items-start">
          {/* Comment Box */}
          <div className="bg-white border border-purple-100 p-3 rounded-md shadow-sm max-w-[600px] w-full">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-purple-800">{msg.sender}</span>
                <span className="text-xs text-gray-500">{msg.date}</span>
              </div>
            </div>

            <p className="text-gray-800 mb-2 text-sm">{msg.text}</p>

            <div className="flex gap-4 text-xs text-purple-600">
              <button onClick={() => onReply(msg)} className="hover:underline">Reply</button>
              <button onClick={() => handleCopy(msg.text)} className="flex items-center gap-1 hover:underline">
                <FiCopy /> Copy
              </button>
              {getReplies(msg.id).length > 0 && (
                <button
                  onClick={() => toggleReplies(msg.id)}
                  className="hover:underline"
                >
                  {visibleReplies[msg.id] ? "Hide Replies" : "View Replies"}
                </button>
              )}
            </div>
          </div>

          {/* Replies */}
          {visibleReplies[msg.id] &&
            getReplies(msg.id).map((reply) => (
              <ReplyItem key={reply.id} reply={reply} />
            ))}
        </div>
      ))}

      <div className="flex gap-4 mt-4">
     {messages.filter((msg) => !msg.parent_id).length > visibleMessageCount && (
    <button
      onClick={() => onLoadMore()}
      className="text-sm text-purple-700 hover:underline"
    >
      Show More
    </button>
    )}
    {visibleMessageCount > 5 && (
    <button
      onClick={() => onShowLess()}
      className="text-sm text-purple-700 hover:underline"
    >
      Show Less
    </button>
  )}
</div>

    </div>
  );
};

export default Forumcomments;
