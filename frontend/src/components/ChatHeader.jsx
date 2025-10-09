import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../Store/chatSlice";
import { setSelectedGroup } from "../Store/groupSlice";

const ChatHeader = ({ selectedUser, selectedGroup }) => {
  const dispatch = useDispatch();
  const { onlineUsers } = useSelector((state) => state.auth);

  if (!selectedUser && !selectedGroup) return null;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full relative">
              <img
                src={
                  selectedUser
                    ? selectedUser.profilePic || "/avatar.png"
                    : "/group.png"
                }
                alt={selectedUser ? selectedUser.fullName : selectedGroup.name}
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-medium">
              {selectedUser ? selectedUser.fullName : selectedGroup.name}
            </h3>
            <p className="text-sm text-base-content/70">
              {selectedUser
                ? onlineUsers.includes(selectedUser.id)
                  ? "Online"
                  : "Offline"
                : `${selectedGroup?.Members?.length || 0} members`}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            if (selectedUser) dispatch(setSelectedUser(null));
            if (selectedGroup) dispatch(setSelectedGroup(null));
          }}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
