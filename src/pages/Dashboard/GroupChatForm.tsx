import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { createZyraChat, getForumConversation, getsingleforumById, getUserRole, resetConversation, resetZyraChat } from "../../store/slices/staffchats";
import { RootState } from "../../store";
import { Skeleton } from "../../components/ui/Skeleton";
import Forumcomments from "./forum/Forumcomments";
import EmojiPicker from 'emoji-picker-react';
import { MentionsInput, Mention } from 'react-mentions';

const socket = io("https://vd.aiteacha.com");

interface Message {
  id: string;
  avatar: string;
  firstname?:string;
  sender: string;
  text: string;
  date: string;
  topic: string;
  parent_id?: string | null;
  zyraResponse?: string | null;
  isZyraLoading?: boolean;
}

interface SavedMessage {
  id: number;
  content: string;
  firstname?:string;
  sender?: string;
  created_at: string;
  topic?: string;
  imageurl?: string;
  parent_id?: string | null;
}

interface ZyraRequestPayload {
  main_post: string;
  question: string;
  reply?: string;
}

const GroupChatForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedTopic, loading, error, conversation:chats, userRole, zyrachat } = useAppSelector(
    (state: RootState) => state.staffChats
  );

  const [userDetails, setUserDetails] = useState<any>();
  const [userId, setUserId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [repliedMessage, setRepliedMessage] = useState<Message | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [visibleTopLevelMessageCount, setVisibleTopLevelMessageCount] = useState(5);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [plainTextMessage, setPlainTextMessage] = useState("");
  const [zyraIsTyping, setZyraIsTyping] = useState(false);

  const [zyraTriggeringMessageId, setZyraTriggeringMessageId] = useState<string | null>(null);
  const [awaitingZyraTriggerId, setAwaitingZyraTriggerId] = useState(false);
  const lastSentZyraTriggerMessageContentRef = useRef<string | null>(null);

  const [zyraRequestData, setZyraRequestData] = useState<ZyraRequestPayload | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const iteratedTopic = selectedTopic?.[0];
const isAdmin = useMemo(() => {
    return iteratedTopic?.user_id?.toString() === userId?.toString() || userRole?.member_role === "admin";
  }, [iteratedTopic, userId, userRole]);

  useEffect(() => {
    setAdmin(isAdmin);
  }, [isAdmin]);

  useEffect(() => {
    if (id) {
      dispatch(getsingleforumById(id));
      dispatch(getForumConversation(id));
       dispatch(resetZyraChat())
       setMessages([])
    }
    if (iteratedTopic?.team_host_id) {
      dispatch(getUserRole(iteratedTopic.team_host_id));
    }
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      try {
        const parsedDetails = JSON.parse(userDetailsFromStorage);
        setUserDetails(parsedDetails);
        setUserId(parsedDetails.id);
      } catch (e) {
        console.error("Failed to parse user details from localStorage", e);
      }
    }
     dispatch(resetConversation());
  }, [dispatch, id, iteratedTopic?.team_host_id]);

  useEffect(() => {
    if (chats && chats.length > 0) {
      const historicalMessages: Message[] = chats.map((chat: any) => ({
        id: chat.id?.toString() || crypto.randomUUID(),
        avatar: chat.imageurl
          ? `https://${chat.imageurl}`
          : "https://i.pravatar.cc/150?img=10",
        sender: `${chat.firstname || ""} ${chat.lastname || "User"}`.trim(),
        text: chat.content,
        date: new Date(chat.created_at).toLocaleString(),
        topic: chat.topic || "General",
        parent_id: chat.parent_id?.toString() || null,
        zyraResponse: null, 
        isZyraLoading: false, 
      }));
      setMessages(historicalMessages);
       dispatch(resetZyraChat())
    }
  }, [chats]);

  useEffect(() => {
  dispatch(resetConversation());
  dispatch(resetZyraChat());
  setMessages([]); 
}, [id]);

  useEffect(() => {
    if (zyrachat) {
      setTimeout(() => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((msg) =>
            msg.id === zyraTriggeringMessageId && msg.isZyraLoading
              ? { ...msg, zyraResponse: zyrachat, isZyraLoading: false }
              : msg
          );

          const zyraMessage: Message = {
            id: crypto.randomUUID(),
            avatar: "https://i.pravatar.cc/150?img=10",
            sender: "Zyra",
            text: zyrachat,
            date: new Date().toLocaleString(),
            topic: iteratedTopic?.topic || "General",
            parent_id: zyraTriggeringMessageId,
            isZyraLoading: false,
            zyraResponse: null
          };

         return updatedMessages;
        });

        if (id && zyraTriggeringMessageId) {
             socket.emit("sendMessage", {
                user_id: "19538",
                forum_id: id,
                content: zyrachat,
                parent_id: zyraTriggeringMessageId,
                sender: "Zyra",
                imageurl: "https://i.pravatar.cc/150?img=10"
             });
        }

        setZyraTriggeringMessageId(null);
        setZyraIsTyping(false);
         dispatch(resetZyraChat());
      }, 50);
    }
  }, [zyrachat, zyraTriggeringMessageId, iteratedTopic?.topic, id]);

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
    zyraResponse: null,
    isZyraLoading:
  awaitingZyraTriggerId &&
  savedMessage.content === lastSentZyraTriggerMessageContentRef.current &&
  savedMessage.firstname !== 'Zyra',
  };

  // ✅ Prevent duplication
  setMessages((prev) => {
    const exists = prev.some((msg) => msg.id === newMsg.id);
    if (exists) return prev;
    return [...prev, newMsg];
  });

  if (
    awaitingZyraTriggerId &&
    savedMessage.content === lastSentZyraTriggerMessageContentRef.current &&
    savedMessage.firstname !== 'Zyra'
  ) {
    setZyraTriggeringMessageId(savedMessage.id?.toString());
    setAwaitingZyraTriggerId(false);
    lastSentZyraTriggerMessageContentRef.current = null;
  }
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
  }, [awaitingZyraTriggerId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const isUserMessage = lastMessage && lastMessage.sender === (userDetails?.name || "You");

    if (messagesEndRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesEndRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 100;

      if (isUserMessage || isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [messages, userDetails?.name]);

  useEffect(() => {
    if (repliedMessage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [repliedMessage]);

  const handleReply = (msg: Message) => {
    setRepliedMessage(msg);
  };

  const handleEmojiClick = (emojiData: any) => {
    setNewMessage((prev) => prev + emojiData.emoji);
    setPlainTextMessage((prev) => prev + emojiData.emoji); 
    setShowEmojiPicker(false);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    const messageText = plainTextMessage.trim();
    if (!messageText || !userId || !id) return;

    const payload = {
      user_id: userId,
      forum_id: id,
      content: messageText,
      parent_id: repliedMessage?.id || null,
      sender: userDetails?.name || "User",
    };

    socket.emit("sendMessage", payload);

    if (/@zyra\b/i.test(messageText)) {
      setZyraIsTyping(true);
      setAwaitingZyraTriggerId(true);
      lastSentZyraTriggerMessageContentRef.current = messageText;
       
      if (repliedMessage) {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === repliedMessage.id
          ? { ...msg, isZyraLoading: true }
          : msg
        )
      );
    }
      

      setZyraRequestData({
        main_post: iteratedTopic?.description || "No topic description",
        question: messageText,
        reply: repliedMessage?.text || undefined,
      });
    }

    setNewMessage("");
    setPlainTextMessage("");
    setRepliedMessage(null);
  };

  useEffect(() => {
    const submitZyraRequest = async () => {
      if (zyraRequestData && zyraTriggeringMessageId) {
        console.log("Submitting Zyra request with parent ID:", zyraTriggeringMessageId);
        try {
          await dispatch(createZyraChat(zyraRequestData));
        } catch (error) {
          console.error("Error creating Zyra chat:", error);
          setZyraIsTyping(false);
        } finally {
          setZyraRequestData(null);
        }
      }
    };

    submitZyraRequest();
  }, [zyraRequestData, zyraTriggeringMessageId, dispatch]);

  const handleLoadMore = () => {
    setVisibleTopLevelMessageCount((prevCount) => prevCount + 5);
  };
6
  const handleShowLess = () => {
    setVisibleTopLevelMessageCount(5);
  };

  const thumbnailSrc = iteratedTopic?.thumbnail
    ? `https://${iteratedTopic.thumbnail}`
    : null;

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 min-h-screen
      bg-white overflow-y-hidden">

        
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

        <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
          {iteratedTopic?.topic?.charAt(0).toUpperCase() + iteratedTopic?.topic?.slice(1)}
        </h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <span className="bg-purple-50 text-gray px-3 py-2 rounded-md text-sm shadow-sm">
            👤 <strong>Author:</strong> {iteratedTopic?.firstname || "Unknown"}
          </span>

          <span className="bg-purple-50 text-gray text-gray px-3 py-2 rounded-md text-sm shadow-sm">
            🏷️ <strong>Category:</strong> {iteratedTopic?.category}
          </span>
          <span className="bg-purple-50 text-gray text-gray px-3 py-2 rounded-md text-sm shadow-sm">
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

        <p className="text-[12px] text-gray-700 mb-2 text-right">
          🤖 use <strong>@zyra</strong> to get automated response
        </p>
      </div>

      <Forumcomments
        messages={messages}
        visibleMessageCount={visibleTopLevelMessageCount}
        onReply={handleReply}
        onLoadMore={handleLoadMore}
        onShowLess={handleShowLess}
        admin={isAdmin}
        isZyraLoading={zyraIsTyping}
      />
      <form
        onSubmit={handleSendMessage}
        className="bg-white/90 border border-purple-200 shadow-lg rounded-xl p-6 relative"
      >
        <h3 className="text-xl font-semibold text-purple-800 mb-3">Add a Comment</h3>
        <p className="text-sm text-purple-700 mb-2">
          🤖 use <strong>@zyra</strong> to get automated response
        </p>

        {repliedMessage && (
          <div className="mb-4 p-3 bg-purple-100 border-l-4
              border-purple-400 text-purple-800 rounded relative">
            <p className="text-sm">
              Replying to <strong>{repliedMessage.sender}</strong>:
               {repliedMessage.text.length > 80
                ? repliedMessage.text.slice(0, 100) + "......"
                : repliedMessage.text}
                "
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
          <div className="mb-4 relative">
            <MentionsInput
              value={newMessage}
              onChange={(event, newValue, newPlainTextValue) => {
                setNewMessage(newValue);
                setPlainTextMessage(newPlainTextValue);
              }}
              placeholder={repliedMessage ? "Reply..." : "Write your comment..."}
              inputRef={inputRef}
              className="mentions-input w-full mb-2"
              style={{
                control: {
                  backgroundColor: '#faf5ff',
                  fontSize: 16,
                  fontFamily: 'inherit',
                  border: '1px solid #5c3cbb',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  minHeight: '3rem',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s ease-in-out',
                },
                highlighter: {
                  overflow: 'hidden',
                  padding: '0.75rem',
                  backgroundColor: '#faf5ff',
                },
                input: {
                  margin: 0,
                  padding: 4,
                  backgroundColor: '#faf5ff',
                  color: '#1f2937',
                  border: 'none',
                },
              suggestions: {
                backgroundColor: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                zIndex: 50,
                position: 'absolute',
                top: '-2.5rem', 
                left: '0.5rem', 
                width: 'max-content', 
                minWidth: '100px', 
                maxWidth: '250px', 
                padding: '0.5rem',
              },

              }}
            >
              <Mention
                trigger="@"
                data={[{ id: 'Zyra', display: '@Zyra' }]}
                style={{
                  color: '#1d4ed8',
                  backgroundColor: '#e0f2fe',
                  padding: '2px 6px',
                  textAlign: 'center',
                  borderRadius: '4px',
                  fontWeight: 500,
                }}
                appendSpaceOnAdd={true}
              />
            </MentionsInput>
          </div>


          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="text-purple-700 text-sm hover:underline mb-2"
          >
            😀 {showEmojiPicker ? "Hide" : "Add Emoji"}
          </button>

          {showEmojiPicker && (
            <div
              className="fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50 p-4"
              onClick={() => setShowEmojiPicker(false)}
            >
              <div
                className="relative rounded-lg shadow-xl lg:shadow-none p-4 overflow-y-auto
                  w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
                style={{ maxHeight: "80vh" }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700
                  text-4xl font-bold p-1 rounded-full hover:bg-gray-100
                    md:hidden"
                  aria-label="Close emoji picker"
                >
                  &times;
                </button>
                <div className="w-full">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              </div>
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
      <div ref={messagesEndRef} />
    </div>
  );
};

export default GroupChatForm;