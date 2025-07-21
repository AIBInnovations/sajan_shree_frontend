import React from "react";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Header = ({ onMenuClick }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 print:hidden">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-gray-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 px-4 md:px-0">
          <h1 className="text-lg font-semibold text-gray-800">
            {user?.role === "Admin" ? "Admin Dashboard" : "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-gray-100 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gray-200 rounded-full">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </span>
              <button
                className="ml-2 p-2 rounded hover:bg-gray-100"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-red-500" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
