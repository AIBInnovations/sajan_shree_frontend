import React from "react";
import { Menu, PanelLeftClose, PanelLeft, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const Header = ({ onMenuClick, sidebarExpanded, onToggleSidebar }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-card shadow-sm border-b border-border print:hidden">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* wrappers (not classes on Button) so responsive display can't collide with its base inline-flex */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onMenuClick} title="Open menu">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="hidden md:block">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarExpanded ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeft className="w-5 h-5" />
            )}
          </Button>
        </div>

        <div className="flex-1 min-w-0 px-3 md:px-4">
          <h1 className="text-lg font-semibold text-foreground truncate">
            {user?.role === "Admin" ? "Admin Dashboard" : "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          {isAuthenticated && user && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-muted rounded-full">
                <User className="w-5 h-5" />
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground">
                {user?.name || "User"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-destructive" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
