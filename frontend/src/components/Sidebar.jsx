{/* Sidebar.jsx */}
import { useEffect, useState } from "react";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../Store/chatActions";
import { fetchGroups } from "../Store/groupActions";
import { setSelectedGroup } from "../Store/groupSlice";
import { setSelectedUser } from "../Store/chatSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { users, selectedUser, isUsersLoading } = useSelector((state) => state.chat);
  const { groups, selectedGroup, isGroupsLoading } = useSelector((state) => state.group);
  const { onlineUsers } = useSelector((state) => state.auth);
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchGroups());
  }, [dispatch]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id))
    : users;

  if (isUsersLoading || isGroupsLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Contacts Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
      </div>

      {/* Users */}
      <div className="overflow-y-auto w-full py-3 space-y-3">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => {
              dispatch(setSelectedUser(user));
              dispatch(setSelectedGroup(null)); // clear selected group
            }}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?.id === user.id ? "bg-base-300 ring-1 ring-base-300" : ""
            }`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user.id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user.id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {/* Groups */}
        {groups.map((group) => (
  <button
    key={group.id}
    onClick={() => {
      dispatch(setSelectedGroup(group)); // select the group
      dispatch(setSelectedUser(null));   // clear selected user
    }}
    className={`
      w-full p-3 flex items-center gap-3
      hover:bg-base-300 transition-colors
      ${selectedGroup?.id === group.id ? "bg-base-300 ring-1 ring-base-300" : ""}
    `}
  >
    <div className="relative mx-auto lg:mx-0">
      <div className="size-12 flex items-center justify-center bg-primary text-white rounded-full">
        {group.name[0].toUpperCase()}
      </div>
    </div>
    <div className="hidden lg:block text-left min-w-0">
      <div className="font-medium truncate">{group.name}</div>
      <div className="text-sm text-zinc-400">{group.Members?.length || 0} members</div>
    </div>
  </button>
))}

        {filteredUsers.length === 0 && groups.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users or groups</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
