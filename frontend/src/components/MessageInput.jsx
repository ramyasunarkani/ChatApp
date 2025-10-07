import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Send, X, FileText, Video } from "lucide-react";
import toast from "react-hot-toast";
import { sendMessage } from "../Store/chatActions";

const MessageInput = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((state) => state.chat);
  const { authUser } = useSelector((state) => state.auth);

  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState(null); // { file: File, preview: string }
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "image/",
      "video/",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    const isValid = allowedTypes.some(
      (type) =>
        file.type.startsWith(type) ||
        file.name.toLowerCase().endsWith(type.split("/")[1])
    );

    if (!isValid) {
      toast.error("Unsupported file type");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setFilePreview({ file, preview: reader.result });
    reader.readAsDataURL(file);
  };

  // Remove selected file
  const removeFile = () => {
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedUser) return toast.error("Select a user to send message");
    if (!text.trim() && !filePreview) return;

    const formData = new FormData();
    if (text.trim()) formData.append("text", text.trim());
    if (filePreview) formData.append("media", filePreview.file);

    try {
      await dispatch(sendMessage(selectedUser.id, formData));
      setText("");
      removeFile();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="p-4 w-full">
      {/* File Preview */}
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {filePreview.file.type.startsWith("image/") && (
              <img
                src={filePreview.preview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            {filePreview.file.type.startsWith("video/") && (
              <video
                src={filePreview.preview}
                className="w-32 h-20 rounded-lg border border-zinc-700"
                controls
              />
            )}
            {!filePreview.file.type.startsWith("image/") &&
              !filePreview.file.type.startsWith("video/") && (
                <div className="flex items-center gap-1 border rounded-lg p-2 bg-gray-100">
                  <FileText size={20} />
                  <span className="truncate max-w-[120px]">{filePreview.file.name}</span>
                </div>
              )}

            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              filePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !filePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
