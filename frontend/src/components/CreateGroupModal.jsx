import { X } from "lucide-react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUsers } from "../Store/chatSlice";
import { fetchGroups } from "../Store/groupActions";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const CreateGroupModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    try {
      const { data } = await axiosInstance.get(
        `/messages/users/search?email=${searchTerm}`
      );
      setSearchResults(data);
      dispatch(setUsers(data));
    } catch (err) {
      console.error("Search failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Search failed");
    }
  };

  const handleAddMember = (user) => {
    if (!selectedMembers.find((m) => m.id === user.id)) {
      setSelectedMembers((prev) => [...prev, user]);
    }
  };

  const handleRemoveMember = (userId) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return toast.error("Enter group name");
    if (selectedMembers.length === 0) return toast.error("Add at least one member");

    const memberIds = selectedMembers.map((m) => m.id);
    try {
      await axiosInstance.post("/groups", { name: groupName, members: memberIds });
      toast.success("Group created successfully 🎉");
      dispatch(fetchGroups());
      onClose();
    } catch (err) {
      console.error("Group creation failed:", err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Failed to create group");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 m-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-900 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Create New Group</h2>

          {/* Group Name */}
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input input-bordered w-full mb-4"
            autoComplete="off"
          />

          {/* Search */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered flex-1"
              autoComplete="off"
            />
            <button onClick={handleSearch} className="btn btn-primary">
              Search
            </button>
          </div>

          {/* Search Results */}
          <ul className="max-h-60 overflow-auto mb-4 border rounded p-1">
            {searchResults.map((user) => (
              <li
                key={user.id}
                className="flex justify-between items-center py-2 px-3 border-b last:border-b-0 text-black"
              >
                <span>{user.email}</span>
                <button
                  onClick={() => handleAddMember(user)}
                  className="btn btn-xs btn-secondary"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>

          {/* Selected Members */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-black">Selected Members:</h3>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
              {selectedMembers.map((m) => (
                <span
                  key={m.id}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-black rounded text-sm"
                >
                  {m.email}
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Create Group Button */}
          <button
            onClick={handleCreateGroup}
            className="btn btn-primary w-full py-3 text-lg"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;
