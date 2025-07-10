import React, { useState } from "react";
import { FiCopy } from "react-icons/fi";
import { VscPinned } from "react-icons/vsc";
import { TbPinnedOff } from "react-icons/tb";
import { ZyraType } from "../../../api/staffchat"; 
import { Link } from "react-router-dom";

interface Message {
  id: string;
  avatar: string;
  sender: string;
  text: string;
  date: string;
  topic: string;
  parent_id?: string | null;
  zyraResponse?: string | null; 
  isZyraLoading?: boolean;  
  user_id?:number   
}

interface Props {
  messages: Message[];
  visibleMessageCount: number;
  onReply: (msg: Message) => void;
  onLoadMore: () => void;
  onShowLess: () => void;
  admin: boolean;
  isZyraLoading: boolean;   
}

const ZyraResponse: React.FC<{ isLoading: boolean; response: string | null }> = ({
  isLoading,
  response,
}) => {
  if (!isLoading && !response) return null;

  return (
    <div className="mt-2 p-3 bg-blue-50 border-l-4 border-blue-200 rounded-md">
      <div className="flex items-center gap-2 mb-1">
        <img
          src="https://via.placeholder.com/24/0000FF/FFFFFF?text=AI"
          alt="Zyra AI"
          className="w-6 h-6 rounded-full object-cover"
        />
        <span className="text-sm font-medium text-blue-700">Zyra AI</span>
      </div>
      {isLoading ? (
        <p className="text-blue-700 text-sm animate-pulse">Zyra is thinking...</p>
      ) : (
        <p className="text-blue-700 text-sm">{response}</p>
      )}
    </div>
  );
};


const Forumcomments: React.FC<Props> = ({
  messages,
  visibleMessageCount,
  onReply,
  onLoadMore,
  onShowLess,
  admin,
 isZyraLoading
}) => {
  const [visibleReplies, setVisibleReplies] = useState<{ [key: string]: boolean }>({});
  const [pinnedId, setPinnedId] = useState<string | null>(null);
   

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



  const togglePin = (id: string) => {
    setPinnedId((prevId) => (prevId === id ? null : id));
  };

  const ReplyItem = ({ reply }: { reply: Message }) => {
    const children = getReplies(reply.id);
    const showZyraResponse = isZyraLoading || reply.zyraResponse;
    const isLoading = !!reply.isZyraLoading && !reply.zyraResponse;



    return (
      <div className="ml-6 mt-2 p-2 bg-purple-50 border-l-4 border-purple-200 rounded-md lg:max-w-[450px] w-[90%]">
        <div className="flex items-center gap-2 mb-1">
         <Link to={`/dashboard/user-profile/${reply?.user_id}`}>
          <img
            src={reply.avatar}
            alt={reply.sender}
            className="w-6 h-6 rounded-full object-cover"
          />
           </Link>
          <div className="flex flex-col">
            <Link to={`/dashboard/user-profile/${reply?.user_id}`}>
            <span className="text-sm font-medium text-purple-700">{reply.sender}</span>
            </Link>
            <span className="text-xs text-gray-400">{reply.date}</span>
          </div>
        </div>
        <p className="text-gray-700 text-sm">{reply.text}</p>

         <div className="mt-2 flex gap-3 text-xs text-purple-600">
        <button onClick={() => onReply(reply)} className="hover:underline">Reply</button>
        <button onClick={() => handleCopy(reply.text)} className="flex items-center gap-1 hover:underline">
          <FiCopy /> Copy
        </button>
    
        { children.length > 0 && (
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

  const pinnedMessage = messages.find((msg) => msg.id === pinnedId && !msg.parent_id);

  return (
    <div className="space-y-4 mb-10">
      {/* pinned */}
      {pinnedMessage && (
        <div className="border border-purple-100 bg-purple-50 p-3 rounded-md shadow max-w-[600px] w-full">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <Link to={`/dashboard/user-profile/${pinnedMessage?.user_id}`}> 
              <img
                src={pinnedMessage.avatar}
                alt={pinnedMessage.sender}
                className="w-8 h-8 rounded-full object-cover"
              />
              </Link>
              <div className="flex flex-col">
              <Link to={`/dashboard/user-profile/${pinnedMessage?.user_id}`}> 
              <span className="font-semibold text-black">{pinnedMessage.sender}</span>
              </Link>
                <span className="text-xs text-gray-800">{pinnedMessage.date}</span>
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-black text-[10px]">Pinned</span>
              <button
                onClick={() => togglePin(pinnedMessage.id)}
                className="text-xs text-purple-500 hover:underline"
              >
                <TbPinnedOff className="text-[16px]" />
              </button>
            </div>
          </div>
          <p className="text-gray-800 text-sm mb-2">{pinnedMessage.text}</p>
        </div>
      )}

      {/* all chats */}
      {topLevel.map((msg) => {
        const showZyraResponse = isZyraLoading || msg.zyraResponse;
        return (
          <div key={msg.id} className="flex flex-col items-start">
            {/* Comment Box */}
            <div className="bg-white border-b border-b-purple-100 p-3 rounded-md shadow-sm max-w-[600px] w-full">
              <div className="flex items-center gap-3 mb-2">
               <Link to={`/dashboard/user-profile/${msg?.user_id}`}>
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full object-cover"
                />
                </Link> 
                <div className="flex flex-col">
                   <Link to={`/dashboard/user-profile/${msg?.user_id}`}>
                  <span className="font-semibold text-black">{msg.sender}</span>
                  </Link>
                  <span className="text-xs text-gray-800">{msg.date}</span>
                </div>
              </div>
              <p className="text-gray-800 mb-2 text-sm">{msg.text}</p>

              <div className="flex gap-4 text-xs text-purple-600">
                <button onClick={() => onReply(msg)} className="hover:underline">Reply</button>
                <button onClick={() => handleCopy(msg.text)} className="flex items-center gap-1 hover:underline">
                  <FiCopy /> Copy
                </button>
                {admin && (
                  <button
                    onClick={() => togglePin(msg.id)}
                    className=""
                  >
                    {pinnedId === msg.id ? (
                      <>
                        <span className="flex items-center">
                          <TbPinnedOff className="text-[16px]" />{" "}
                        </span>{" "}
                      </>
                    ) : (
                      <>
                        <span className="flex">
                          {" "}
                          <VscPinned className="text-[16px]" />
                        </span>
                      </>
                    )}
                  </button>
                )}
               {msg.isZyraLoading ? (
                <span className="text-purple-600 text-xs animate-pulse">Loading reply...</span>
              ) : getReplies(msg.id).length > 0 && (
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
        );
      })}

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