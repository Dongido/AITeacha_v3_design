import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getForumConversation, getsingleforumById } from "../../store/slices/staffchats";
import { RootState } from "../../store";
import { Skeleton } from "../../components/ui/Skeleton";
import Forumcomments from "./forum/Forumcomments";
import EmojiPicker from 'emoji-picker-react';

const socket = io("https://vd.aiteacha.com");

interface Message {
  id: string;
  avatar: string;
  sender: string;
  text: string;
  date: string;
  topic: string;
  parent_id?: string | null;
}

interface SavedMessage {
  id: number;
  content: string;
  sender?: string;
  created_at: string;
  topic?: string;
  imageurl?: string;
  parent_id?: string | null;
}

const GroupChatForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedTopic, loading, error, conversation:chats } = useAppSelector(
    (state: RootState) => state.staffChats
  );
  //  console.log("chat", chats)

  const [userDetails, setUserDetails] = useState<any>();
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [visibleMessageCount, setVisibleMessageCount] = useState(10);
  const [visibleTopLevelMessageCount, setVisibleTopLevelMessageCount] = useState(5);
 const [showEmojiPicker, setShowEmojiPicker] = useState(false);


 
  
  



  
  const messagesEndRef = useRef<HTMLDivElement>(null);



  const currentUser = userDetails?.name || "You";

  useEffect(() => {
    if (id) {
      dispatch(getsingleforumById(id));
      dispatch(getForumConversation(id));
    }

    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserDetails(parsedDetails);
      setUserId(parsedDetails.id);
    }
  }, [dispatch, id]);

useEffect(() => {
  if (chats && chats.length > 0) {
    const historicalMessages: Message[] = chats.map((chat: any) => ({
      id: chat.id?.toString() || crypto.randomUUID(),
      avatar: chat.imageurl
        ? `https://${chat.imageurl}`
        : "https://i.pravatar.cc/150?img=10",
      sender: chat.lastname || "User",
      text: chat.content,
      date: new Date(chat.created_at).toLocaleString(),
      topic: chat.topic || "General",
      parent_id: chat.parent_id?.toString() || null,
    }));

    // Append them to message state
    setMessages(historicalMessages);
  }
}, [chats]);


  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.warn("❌ Disconnected from socket server");
    });

    socket.on("receiveMessage", (savedMessage: SavedMessage) => {
      const newMsg: Message = {
        id: savedMessage.id?.toString() || crypto.randomUUID(),
        avatar: savedMessage.imageurl 
         ? `https://${savedMessage.imageurl}`
        : "https://i.pravatar.cc/150?img=10",
        sender: savedMessage.sender || "User",
        text: savedMessage.content,
        date: new Date(savedMessage.created_at).toLocaleString(),
        topic: savedMessage.topic || "General",
        parent_id: savedMessage.parent_id?.toString() || null, 
      };
      setMessages((prev) => [...prev, newMsg]);
    });

    socket.on("errorMessage", (err: any) => {
      console.error("❌ Socket error:", err);
      alert("Socket error: " + err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receiveMessage");
      socket.off("errorMessage");
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

const inputRef = useRef<HTMLInputElement | null>(null);

// handlereply
  useEffect(() => {
    if (repliedMessage && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
      inputRef.current.focus();
    }
  }, [repliedMessage]); // run only when repliedMessage changes

  const handleReply = (msg: Message) => {
    setRepliedMessage(msg);
  };

  const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!newMessage.trim() || !userId || !id) return;
  const payload = {
    user_id: userId,
    forum_id: id,
    content: newMessage.trim(),
    parent_id: repliedMessage?.id || null,
  };

  socket.emit("sendMessage", payload);
  setNewMessage("");
  setRepliedMessage(null); // clear after send
};

// emoji
const handleEmojiClick = (emojiData: any) => {
  setNewMessage((prev) => prev + emojiData.emoji);
  setShowEmojiPicker(false); // auto close
};



  // Increment the number of visible messages
const handleLoadMore = () => {
    setVisibleTopLevelMessageCount((prevCount) => prevCount + 5);
};
const handleShowLess = () => {
    setVisibleTopLevelMessageCount(5); 
};



  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {[...Array(5)].map((_, index) => (
                <th key={index} className="p-4 border-b">
                  <Skeleton className="h-4 w-16 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(6)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {[...Array(5)].map((_, colIndex) => (
                  <td key={colIndex} className="p-4">
                    <Skeleton className="h-4 w-full rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-10">
        Error loading chat: {error || "An unknown error occurred."}
      </div>
    );
  }

  const iteratedTopic = selectedTopic?.[0];
  const thumbnailSrc = iteratedTopic?.thumbnail
    ? `https://${iteratedTopic.thumbnail}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen 
     bg-white overflow-y-hidden">
     {/* Topic Info */}
     <div className="bg-white shadow-xl border border-purple-200 rounded-2xl p-6 mb-10">
     {thumbnailSrc && (
     <div className="lg:w-[50%] w-full mb-6">
      <img
        src={thumbnailSrc}
        alt="Topic Thumbnail"
        className="w-full h-64 object-cover rounded-xl shadow"
      />
      </div>
       )}

     <h1 className="text-2xl md:text-3xl font-bold text-purple-900 mb-2">
    {iteratedTopic?.topic?.charAt(0).toUpperCase() + iteratedTopic?.topic?.slice(1)}
     </h1>

  {/* Extra Info Section */}
  <div className="flex flex-wrap gap-4 mb-4">
    <span className="bg-purple-100 text-gray px-3 py-2 rounded-md text-sm shadow-sm">
      👤 <strong>Author:</strong> {iteratedTopic?.firstname || "Unknown"}
    </span>
    
    <span className="bg-purple-200 text-gray px-3 py-2 rounded-md text-sm shadow-sm">
      🏷️ <strong>Category:</strong> {iteratedTopic?.category}
    </span>
    <span className="bg-purple-300 text-gray px-3 py-2 rounded-md text-sm shadow-sm">
      📅 <strong>Published:</strong>{" "}
      {new Date(iteratedTopic?.created_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </span>
    </div>
  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
    {iteratedTopic?.description}
  </p>
</div>

      {/* Comments */}
      <Forumcomments
        messages={messages}
        visibleMessageCount={visibleTopLevelMessageCount}
        onReply={handleReply}
        onLoadMore={handleLoadMore}
        onShowLess={handleShowLess}
     />

      {/* Form */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white/90 border border-purple-200 shadow-lg rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-purple-800 mb-3">Add a Comment</h3>
        {repliedMessage && (
        <div ref={inputRef} className="mb-4 p-3 bg-purple-100 border-l-4
         border-purple-400 text-purple-800 rounded relative">
          <p className="text-sm">
            Replying to <strong>{repliedMessage.sender}</strong>: "{repliedMessage.text}"
          </p>
          <button
            onClick={() => setRepliedMessage(null)}
            className="absolute top-1 right-2 text-[30px] text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        )}
        <div className="mb-4 relative">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={repliedMessage ? "Reply..." : "Write your comment..."}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none
           focus:ring-2 focus:ring-purple-400 bg-purple-50 mb-2 resize-none"
          rows={3}
        />

        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-purple-700 text-sm hover:underline mb-2"
        >
          😀 {showEmojiPicker ? "Hide" : "Add Emoji"}
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
        <div
        className="absolute z-50 mt-2 bg-white border rounded shadow-lg overflow-y-auto"
        style={{ maxHeight: "250px" }} // limit height, allows scroll within
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>
        )}
      </div>

        <Button
          variant="gradient"
          type="submit"
          className="px-4 py-2 text-white rounded-lg"
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default GroupChatForm;