import React, { useState, useEffect, useRef } from "react";
import { X, Smile } from "lucide-react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { RootState } from "../../../store";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getCount,
  getMessages,
  unreadMessageCounts,
} from "../../../store/slices/staffchats";
import { FiSend } from "react-icons/fi";

const socket = io("https://vd.aiteacha.com");

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

const SideChatPopup: React.FC<SideChatPopupProps> = ({
  isOpen,
  onClose,
  id: receiverId,
}) => {
  const dispatch = useAppDispatch();
  const { message, loading, messageCount } = useAppSelector(
    (state: RootState) => state.staffChats
  );

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
    const payload = { senderId: receiverId };
    if (payload.senderId) {
      dispatch(unreadMessageCounts(payload));
    }
  }, [isOpen, dispatch, receiverId]);

  useEffect(() => {
    if (message && Array.isArray(message)) {
      const transformed = message.map((msg) => {
        const isMe = msg.sender_id === senderId;
        const name = isMe ? "Me" : "User";
        const displayName = isMe ? "Me" : name.charAt(0).toUpperCase();
        const image = `https://ui-avatars.com/api/?name=${displayName}&background=${
          isMe ? "4B5563" : "E5E7EB"
        }&color=${isMe ? "fff" : "000"}`;

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
      const image = `https://ui-avatars.com/api/?name=${displayName}&background=${
        isMe ? "4B5563" : "E5E7EB"
      }&color=${isMe ? "fff" : "000"}`;

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
    //  dispatch(getCount())
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`fixed inset-0 h-full w-full bg-white shadow-2xl transition-all duration-300 z-[1000] ${
        +isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}
    >
      {/* Header */}
      <div className="flex gap-10 items-center p-2 border-b bg-gray-100">
        <button onClick={onClose} className="lg:ml-10">
          <X className="text-black font-bold" />
        </button>
        <div className="mt-3">
          <h3 className="font-bold text-lg text-gray-800">Live Chat</h3>
          <p className="text-sm -mt-4">Author</p>
        </div>{" "} 
      </div>

      {/* Messages */}
      <div className="p-4 overflow-y-auto h-[calc(100%-200px)] space-y-4 bg-gray-50 lg:px-56">
        {loading ? (
          <p className="text-gray-500 text-sm text-center animate-pulse">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-400 italic text-center">
            No messages yet
          </p>
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
                className={`max-w-[40%] px-3 py-2 rounded-2xl text-sm flex flex-col tex-black  h-auto ${
                  msg.isMe
                    ? "bg-[#290064] p-4 text-white rounded-tr-none ml-auto"
                    : "bg-gray-100 text-gray-900 rounded-bl-none mr-auto"
                }`}
              >
                <span className=" text-sm mt-1">{msg.text}</span>
                <span className="text-[10px] text-right opacity-70 mt-0">
                  {msg.time}
                </span>
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
      {/* {showEmojiPicker && (
        <div className="absolute bottom-[90px] right-10 z-[2000] w-[250px]">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )} */}

      {/* Input */}
      <div className="p-8 flex items-center gap-2 lg:px-56 mb-10">
        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-gray-500 hover:text-gray-700"
        >
          {/* <Smile /> */}
        </button>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          rows={2}
          className="flex-1 bg-[#EBEBEB] rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-black"
        />
        <button
          onClick={handleSend}
          className="bg-[#6200EE] text-white p-2 hover:bg-black rounded-full w-8 h-8"
        >
          <FiSend className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default SideChatPopup;
