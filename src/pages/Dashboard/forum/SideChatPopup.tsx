import React, { useState, useEffect, useRef } from "react";
import { X, Smile } from "lucide-react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getMessages } from "../../../store/slices/staffchats";

const socket = io("https://api.aiteacha.com");

interface SideChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

interface ChatMessage {
  id: number;
  senderId: number;
  text: string;
  name: string;
  image: string;
  isMe: boolean;
  time: string;
}

const SideChatPopup: React.FC<SideChatPopupProps> = ({ isOpen, onClose, id: receiverId }) => {
  const dispatch = useAppDispatch();
  const { message, loading } = useAppSelector((state: RootState) => state.staffChats);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [senderId, setSenderId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setSenderId(parsedDetails.id);
    }
  }, []);

  useEffect(() => {
    if (senderId !== null) {
      dispatch(getMessages({ senderId, receiverId: parseInt(receiverId, 10) }));
    }
  }, [dispatch, senderId, receiverId]);

  useEffect(() => {
    if (message && Array.isArray(message)) {
      const transformed = message.map((msg) => {
        const isMe = msg.sender_id === senderId;
        const name = isMe ? "Me" : "User";
        const displayName = isMe ? "Me" : name.charAt(0).toUpperCase();
        const image = `https://ui-avatars.com/api/?name=${displayName}&background=${isMe ? "4B5563" : "E5E7EB"}&color=${isMe ? "fff" : "000"}`;

        return {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.content,
          name: displayName,
          image,
          isMe,
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        };
      });
      setMessages(transformed);
    }
  }, [message, senderId]);

  useEffect(() => {
    socket.on("receiveChat", (msg: any) => {
      const isMe = msg.sender_id === senderId;
      const name = isMe ? "Me" : msg.name || "User";
      const displayName = isMe ? "Me" : name.charAt(0).toUpperCase();
      const image = `https://ui-avatars.com/api/?name=${displayName}&background=${isMe ? "4B5563" : "E5E7EB"}&color=${isMe ? "fff" : "000"}`;

      const time = new Date(msg.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || Date.now(),
          senderId: msg.sender_id,
          text: msg.content,
          name: displayName,
          image,
          isMe,
          time,
        },
      ]);
    });

    return () => {
      socket.off("receiveChat");
    };
  }, [senderId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || senderId === null) return;

    const messageData = {
      sender_id: senderId,
      receiver_id: parseInt(receiverId, 10),
      content: input.trim(),
      mark_as_read: false,
    };

    socket.emit("sendChat", messageData);
    setInput("");
    setShowEmojiPicker(false);
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[370px] bg-white shadow-2xl transition-transform duration-300 z-[1000] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b bg-gray-100">
        <h3 className="font-semibold text-lg text-gray-800">Live Chat</h3>
        <button onClick={onClose}>
          <X className="text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* Messages */}
      <div className="p-4 overflow-y-auto h-[calc(100%-200px)] space-y-4 bg-gray-50">
        {loading ? (
          <p className="text-gray-500 text-sm text-center animate-pulse">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${msg.isMe ? "justify-end" : "justify-start"}`}
            >
              {!msg.isMe && (
                <img
                  src={msg.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                  msg.isMe
                    ? "bg-gray-700 text-white rounded-br-none shadow"
                    : "bg-gray-200 text-gray-800 rounded-bl-none shadow"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p className="text-[10px] mt-1 text-right opacity-70">{msg.time}</p>
              </div>
              {msg.isMe && (
                <img
                  src={msg.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-[90px] right-10 z-[2000] w-[250px]">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t flex items-center gap-2 bg-white">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700"
        >
          <Smile />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          onClick={handleSend}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SideChatPopup;
