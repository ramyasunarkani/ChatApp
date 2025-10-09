import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import NoChatSelected from "./NoChatSelected";
import { formatMessageTime } from "../lib/utils";
import { FileText } from "lucide-react";

import {
  fetchMessages,
  subscribeToMessages,
  unsubscribeFromMessages,
} from "../Store/chatActions";
import { fetchGroupMessages } from "../Store/groupActions";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  const { messages: userMessages, isMessagesLoading, selectedUser } = useSelector(
    (state) => state.chat
  );
  const { groupMessages, selectedGroup, isGroupMessagesLoading } = useSelector(
    (state) => state.group
  );
  console.log(groupMessages)
  const { authUser } = useSelector((state) => state.auth);


  const messages = selectedUser
    ? userMessages
    : selectedGroup
    ? groupMessages[selectedGroup.id] || []
    : [];

  useEffect(() => {

    if (selectedUser?.id) {
      dispatch(fetchMessages(selectedUser.id));
      dispatch(subscribeToMessages(selectedUser.id));
    } else if (selectedGroup?.id) {
      dispatch(fetchGroupMessages(selectedGroup.id));
    }

    return () => {
      dispatch(unsubscribeFromMessages());
    };
  }, [dispatch, selectedUser, selectedGroup]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser && !selectedGroup) return <NoChatSelected />;

  if (isMessagesLoading || isGroupMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader selectedUser={selectedUser} selectedGroup={selectedGroup} />
        <MessageSkeleton />
        <MessageInput selectedUser={selectedUser} selectedGroup={selectedGroup} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader selectedUser={selectedUser} selectedGroup={selectedGroup} />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          
          <div
            key={message.id}
            className={`chat ${
              message.senderId === authUser.id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser
                      ? selectedUser.profilePic || "/avatar.png"
                      : selectedGroup?.Members?.find((m) => m.id === message.senderId)
                          ?.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

           <div className="chat-bubble flex flex-col">
  {message.media && (() => {
    const fileType = message.media.split('.').pop()?.toLowerCase();

    // Render image
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
      return (
        <img
          src={message.media}
          alt="Attachment"
          className="sm:max-w-[200px] rounded-md mb-2"
        />
      );
    }

    // Render video
    if (["mp4", "webm", "ogg"].includes(fileType)) {
      return (
        <video
          src={message.media}
          className="sm:max-w-[250px] rounded-md mb-2"
          controls
        />
      );
    }

    // Render PDF or other files
    if (["pdf", "doc", "docx", "txt"].includes(fileType)) {
      return (
        <a
          href={message.media}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-blue-600 underline mb-2"
        >
          <FileText size={18} />
          {message.media.split('/').pop()}
        </a>
      );
    }

    // fallback: download link
    return (
      <a
        href={message.media}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-gray-600 underline mb-2"
      >
        Download file
      </a>
    );
  })()}

  {message.message && <p>{message.message}</p>}
</div>

          </div>
        ))}
      </div>

      <MessageInput selectedUser={selectedUser} selectedGroup={selectedGroup} />
    </div>
  );
};

export default ChatContainer;
