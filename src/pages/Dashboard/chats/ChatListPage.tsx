import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getuserChat, getMessages } from "../../../store/slices/staffchats";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store";
import { FiSend, FiX } from "react-icons/fi";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("https://vd.aiteacha.com", { transports: ["websocket"] });

const ChatListPage = () => {
  const dispatch = useAppDispatch();
const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [input, setInput] = useState("");
  const [hasFetched, setHasFetched] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const { userChat, loading } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  // ✅ Fetch user chats once
  useEffect(() => {
    dispatch(getuserChat()).finally(() => setHasFetched(true));
  }, [dispatch]);

  // ✅ Load user id from localStorage
  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserId(parsedDetails?.id);
    }
  }, []);

  // ✅ Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat && userId) {
      const stored = localStorage.getItem(`chat_${selectedChat.user_id}`);
      if (stored) {
        setMessages(JSON.parse(stored));
      } else {
        dispatch(
          getMessages({ senderId: userId, receiverId: selectedChat.user_id })
        ).then((res: any) => {
          if (res.payload) {
            setMessages(res.payload);
            localStorage.setItem(
              `chat_${selectedChat.user_id}`,
              JSON.stringify(res.payload)
            );
          }
        });
      }
    }
  }, [selectedChat, userId, dispatch]);

  // ✅ Listen for new incoming messages via socket
  // useEffect(() => {
  //   socket.on("receiveChat", (newMessage:any) => {
  //     setMessages((prev) => {
  //       const updated = [...prev, newMessage];
  //       if (selectedChat) {
  //         localStorage.setItem(
  //           `chat_${selectedChat.user_id}`,
  //           JSON.stringify(updated)
  //         );
  //       }
  //       return updated;
  //     });
  //   });

  //   return () => {
  //     socket.off("receiveChat");
  //   };
  // }, [selectedChat]);


  useEffect(() => {
  const handleReceiveChat = (newMessage: any) => {
    // only update messages if it belongs to the current chat
    setMessages((prev) => {
      if (selectedChat && newMessage.sender_id === selectedChat.user_id) {
        const updated = [...prev, newMessage];
        localStorage.setItem(
          `chat_${selectedChat.user_id}`,
          JSON.stringify(updated)
        );
        return updated;
      }
      return prev;
    });
  };

  // ✅ Attach listener once
  if (!socket.hasListeners("receiveChat")) {
    socket.on("receiveChat", handleReceiveChat);
  }

  return () => {
    socket.off("receiveChat", handleReceiveChat);
  };
  // 👇 No dependencies (only once)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  // ✅ Filter out the current user’s own chat
  const filteredChats = userChat?.filter((chat) => chat.user_id !== userId);

  // ✅ Handle sending message
  const handleSend = () => {
    if (!input.trim() || !selectedChat || !userId) return;

    const messageData = {
      sender_id: userId,
      receiver_id: selectedChat.user_id,
      content: input.trim(),
      mark_as_read: false,
    };

    socket.emit("sendChat", messageData);

    const newMsg = {
      ...messageData,
      id: Date.now(),
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      localStorage.setItem(
        `chat_${selectedChat.user_id}`,
        JSON.stringify(updated)
      );
      return updated;
    });

    setInput("");
  };

  const closeChat = () => setSelectedChat(null);

  return (
    <div className="min-h-screen fixed inset-0 top-0 left-0 h-full bg-gray-50 flex flex-col lg:flex-row z-[50] overflow-hidden">
      {/* LEFT SIDE: Chat List */}
      <div
        className={`w-full lg:w-[380px] bg-white border-r border-gray-200 p-6 overflow-y-auto transition-transform duration-300 ease-in-out ${
          selectedChat ? "translate-x-[-100%] lg:translate-x-0" : ""
        }`}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Chats</h1>

       <button
      onClick={() => navigate(-1)}
      className="fixed top-[30px] right-[30px] z-[50]"
    >
      <FiX size={22} />
    </button>

        {!hasFetched ? (
          <div className="text-center text-gray-500">Loading chats...</div>
        ) : filteredChats?.length === 0 ? (
          <p className="text-gray-500 text-sm">No chats available.</p>
        ) : (
          <div className="space-y-3">
            {filteredChats?.map((chat) => {
              const hasUnread = chat.unreadMessageCount > 0;
              const isSelected = selectedChat?.user_id === chat.user_id;
              const initials = chat.name
                ?.split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={chat.user_id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-start gap-4 bg-gray-50 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-50 border-l-4 border-purple-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    {chat.imageurl ? (
                      <img
                        src={`https://${chat.imageurl}`}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
                        {initials}
                      </div>
                    )}
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {chat.unreadMessageCount > 9
                          ? "9+"
                          : chat.unreadMessageCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-semibold text-gray-800 truncate">
                        {chat.name}
                      </h2>
                      <span className="text-xs text-gray-500">
                        {chat.lastMessageTime
                          ? formatDistanceToNow(
                              new Date(chat.lastMessageTime),
                              { addSuffix: true }
                            )
                          : ""}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {chat.lastMessage || "No messages yet."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: Messages */}
      <div
        className={`flex-1 bg-white flex flex-col absolute lg:static top-0 right-0 h-full w-full lg:w-auto transition-transform duration-300 ease-in-out ${
          selectedChat ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        {selectedChat ? (
          <>
            {/* Header */}
           <div className="p-4 border-b flex items-center justify-between bg-gray-50">
  <div className="flex items-center gap-3">
    {selectedChat.imageurl ? (
      <img
        src={`https://${selectedChat.imageurl}`}
        alt={selectedChat.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-semibold">
        {selectedChat.name
          ?.split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()}
      </div>
    )}
    <div>
      <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
      <p className="text-xs text-gray-500">Active now</p>
    </div>
  </div>

  {/* Close (Back) Icon */}
  <button
    onClick={closeChat}
    className="text-gray-600 hover:text-gray-900 transition-all"
  >
    <FiX size={22} />
  </button>
</div>


            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {loading ? (
                <p className="text-center text-gray-500">Loading messages...</p>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.sender_id === userId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMe && (
                        <img
                          src={`https://ui-avatars.com/api/?name=${selectedChat.name}&background=E5E7EB`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-[#290064] text-white rounded-tr-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                      {isMe && (
                        <img
                          src={`https://ui-avatars.com/api/?name=Me&background=4B5563&color=fff`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-gray-400 italic">
                  No messages yet.
                </p>
              )}
            </div>

            {/* Input */}
            <div className="p-4 flex items-center gap-2 border-t bg-white">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 bg-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleSend}
                className="bg-[#6200EE] hover:bg-[#4B00B5] text-white p-2 rounded-full"
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat to start messaging 💬
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
