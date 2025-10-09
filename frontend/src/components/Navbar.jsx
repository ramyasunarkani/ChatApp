import { LogOut, MessageSquare, User, PlusCircle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { logout } from "../Store/authActions";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import CreateGroupModal from "./CreateGroupModal";

const Navbar = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-primary/10 flex items-center justify-center w-9 h-9">
                <MessageSquare size={20} className="text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </div>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
            {authUser && (
              <>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-sm gap-2 transition-colors"
                >
                  <PlusCircle size={16} />
                  <span className="hidden sm:inline">Create Group</span>
                </button>
               

                <Link to="/profile" className="btn btn-sm gap-2">
                  <User size={20} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center btn btn-sm"
                  onClick={() => dispatch(logout())}
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && <CreateGroupModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Navbar;
