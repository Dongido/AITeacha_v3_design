import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getCount, getuserChat } from "../../../store/slices/staffchats";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { RootState } from "../../../store";
import SideChatPopup from "../forum/SideChatPopup";

const ChatListPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSideChat, setShowSideChat] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const { userChat , messageCount } = useAppSelector((state: RootState) => state.staffChats);

  useEffect(() => {
    dispatch(getuserChat()).finally(() => {
      setHasFetched(true);
    });
  }, [dispatch]);

  useEffect(() => {
    const userDetailsFromStorage = localStorage.getItem("ai-teacha-user");
    if (userDetailsFromStorage) {
      const parsedDetails = JSON.parse(userDetailsFromStorage);
      setUserId(parsedDetails?.id);
    }
  }, []);

  const filteredChats = userChat?.filter(chat => chat.user_id !== userId);


  const handleShowChat = (chat:any) => {
   setShowSideChat(true);
   setSelectedId(chat.user_id.toString());
   dispatch(getuserChat())
    dispatch(getCount())
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col lg:flex-row">
      {/* Chat List */}
      <div className="w-full lg:max-w-md mb-6 lg:mb-0">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Chats</h1>

        {!hasFetched ? (
          <div className="text-center text-gray-500">Loading chats...</div>
        ) : (
          <div className="space-y-4">
            {filteredChats?.length === 0 ? (
              <p className="text-gray-500 text-sm">No chats available.</p>
            ) : (
              filteredChats?.map((chat) => {
                const hasUnread = chat.unreadMessageCount > 0;
                const isSelected = selectedId === chat.user_id.toString();
                const initials = chat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <div
                    key={chat.user_id}
                    onClick={() => handleShowChat(chat)}
                    className={`flex items-start gap-4 bg-white shadow-sm p-4  rounded-lg hover:bg-gray-100 transition cursor-pointer ${
                      isSelected ? "border-l-4 border-purple-500" : ""
                    } ${hasUnread ? "border border-purple-200" : "border border-gray-100"}`}
                  >
                    <div className="relative">
                      {chat.imageurl ? (
                        <img
                          src={
                            chat.imageurl.startsWith("https:")
                              ? chat.imageurl
                              : `https:\\${chat.imageurl}`
                          }
                          alt={chat.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-600 text-white
                         flex items-center justify-center font-semibold">
                          {initials}
                        </div>
                      )}

                      {hasUnread && (
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] 
                        font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                          {chat.unreadMessageCount > 9
                            ? "9+"
                            : chat.unreadMessageCount}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">
                          {chat.name}
                        </h2>
                        <span className="text-xs text-gray-700">
                          {chat.lastMessageTime
                            ? formatDistanceToNow(
                                new Date(chat.lastMessageTime),
                                { addSuffix: true }
                              )
                            : ""}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate max-w-[90%]">
                        {chat.lastMessage || "No messages yet."}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Chat Popup */}
      {showSideChat && selectedId && (
        <SideChatPopup
          isOpen={showSideChat}
          onClose={() => setShowSideChat(false)}
          id={selectedId}
        />
      )}
    </div>
  );
};

export default ChatListPage;
