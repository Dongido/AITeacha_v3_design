import React, { useState, useEffect } from "react";
import { X, Smile } from "lucide-react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { getZaraChats } from "../../../api/staffchat";
import { getMessages } from "../../../store/slices/staffchats";

// Connect to backend
const socket = io("https://api.aiteacha.com");

interface SideChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
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

const SideChatPopup: React.FC<SideChatPopupProps> = ({ isOpen, onClose }) => {
  const payload: getZaraChats = {
    senderId: 15,
    receiverId: 7723,
  };

  const senderImage = "https://ui-avatars.com/api/?name=You";
  const dispatch = useAppDispatch();
  const { message, loading } = useAppSelector((state: RootState) => state.staffChats);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    socket.on("connect", () => console.log("✅ Connected:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected"));

    socket.on("receiveChat", (msg: any) => {
      const isMe = msg.sender_id === payload.senderId;
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
          name: isMe ? "Me" : "User",
          image: isMe ? senderImage : "https://ui-avatars.com/api/?name=User",
          isMe,
          time,
        },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receiveChat");
    };
  }, []);

  useEffect(() => {
    dispatch(getMessages(payload));
  }, [dispatch]);

  useEffect(() => {
    if (message && Array.isArray(message)) {
      const transformed = message.map((msg) => {
        const isMe = msg.sender_id === payload.senderId;
        return {
          id: msg.id,
          senderId: msg.sender_id,
          text: msg.content,
          name: isMe ? "Me" : "User",
          image: isMe ? senderImage : "https://ui-avatars.com/api/?name=User",
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
  }, [message]);

  const handleSend = () => {
    if (!input.trim()) return;

    const messageData = {
      sender_id: payload.senderId,
      receiver_id: payload.receiverId,
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
      className={`fixed top-0 right-0 h-full w-full sm:w-[370px] bg-white shadow-xl transition-transform duration-300 z-[1000] ${
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
          <p className="text-blue-500 text-sm text-center animate-pulse">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.isMe && (
                <img
                  src={msg.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                  msg.isMe
                    ? "bg-blue-100 text-gray-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <p className="text-[10px] mt-1 text-right text-gray-500">{msg.time}</p>
              </div>
            </div>
          ))
        )}
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
          className="text-gray-500 hover:text-blue-600"
        >
          <Smile />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={handleSend}
          className="bg-[#5c3cbb] text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SideChatPopup;
