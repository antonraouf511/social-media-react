import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { Home, User, LogOut, LogIn, UserPlus, Menu, X, Activity, Bell, Settings } from "lucide-react";
import { useProfile } from "../Hooks/useProfile";
import { useUnreadCount } from "../Hooks/useUnreadCount";

export default function Navbar() {
  const { data: useUnreadCountData } = useUnreadCount();
  const unreadCount = useUnreadCountData?.data?.unreadCount || 0;
  console.log("Unread Count:", unreadCount);
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { userLogin, setUserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = useProfile();

  function logOut() {
    localStorage.removeItem("userToken");
    setUserLogin(null);
    navigate("/login");
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-xs">
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Creative Minimalist Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
              <Activity size={18} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              pulse<span className="text-slate-900">.</span>
            </span>
          </Link>

          {/* Center Navigation (Home, Notifications & Settings Icons) - Desktop - Light Styled */}
          {userLogin && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 shadow-inner">
              <Link
                to="/"
                title="Home"
                className={`p-2.5 rounded-xl transition-all ${
                  isActive("/") || isActive("/home")
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Home size={20} />
              </Link>

              
                
                <Link
                  to="/notifications"
                  title="Notifications"
                  className={`p-2.5 rounded-xl transition-all relative ${
                    isActive("/notifications")
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Bell size={20} />
                  {unreadCount !== 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>}
                </Link>
              
             

              <Link
                to="/settings"
                title="Settings"
                className={`p-2.5 rounded-xl transition-all ${
                  isActive("/settings")
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Settings size={20} />
              </Link>
            </div>
          )}

          {/* Right: Profile Avatar Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {userLogin ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
                >
                  <img
                    src={user?.photo }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-xs hover:border-slate-400 transition-colors"
                  />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                    {/* User Info Header */}
                    <div className="flex items-center gap-3 p-3 border-b border-slate-100">
                      <img
                        src={user?.photo}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-slate-900 truncate">anton</div>
                        <div className="text-xs text-slate-500 truncate">@anton</div>
                      </div>
                    </div>

                    {/* Menu Options */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <User size={16} />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Settings size={16} />
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          logOut();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                >
                  <UserPlus size={17} />
                  Register
                </Link>

                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-black text-white font-medium rounded-xl shadow-md transition-all text-sm"
                >
                  <LogIn size={17} />
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className="md:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top duration-200">
          {userLogin ? (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Home size={18} />
                Home
              </Link>
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${
                  isActive("/notifications")
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <Bell size={18} />
                Notifications
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <User size={18} />
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logOut();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 font-medium rounded-xl hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-slate-700 font-medium rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <UserPlus size={18} />
                Register
              </Link>
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3 rounded-xl shadow-md text-sm"
                >
                  <LogIn size={18} />
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
