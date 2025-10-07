import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";
import { fetchMessages, subscribeToMessages, unsubscribeFromMessages } from "../Store/chatActions";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const messageEndRef = useRef(null);

  const { messages, isMessagesLoading, selectedUser } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);
console.log(messages)
  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (selectedUser?.id) {
      dispatch(fetchMessages(selectedUser.id));
      dispatch(subscribeToMessages(selectedUser.id));

    }
    return ()=>{
          dispatch(unsubscribeFromMessages());

    }
;
  }, [dispatch, selectedUser]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat ${message.senderId === authUser.id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="w-10 h-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser.id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser?.profilePic || "/avatar.png"
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
    const url = message.media.toLowerCase();

    if (url.endsWith(".pdf")) {
      // PDF
      return (
        <div className="mb-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View PDF
          </a>
          <iframe
            src={url}
            title="PDF Preview"
            className="w-full h-64 border rounded-md mt-1"
          />
        </div>
      );
    } else if (/\.(jpeg|jpg|png|gif)$/i.test(url)) {
      // Image
      return <img src={url} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2" />;
    } else if (/\.(mp4|webm|ogg)$/i.test(url)) {
      // Video
      return (
        <video
          src={url}
          controls
          className="sm:max-w-[300px] rounded-md mb-2"
        />
      );
    } else {
      // Other file types – just show a download link
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline mb-2"
        >
          Download File
        </a>
      );
    }
  })()}

  {message.message && <p>{message.message}</p>}
</div>

          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
