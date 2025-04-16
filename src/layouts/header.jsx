import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronsLeft, User, LogIn, UserPlus } from "lucide-react";
import PropTypes from "prop-types";
import { useAuth } from "@/contexts/auth-context";
import userImg from "@/assets/user.png";
import { useClickOutside } from "@/hooks/use-click-outside";

export const Header = ({ collapsed, setCollapsed }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const userImgRef = useRef(null);

    // Close user menu when clicking outside
    useClickOutside([userMenuRef, userImgRef], () => {
        setUserMenuOpen(false);
    });

    return (
        <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md">
            <div className="flex items-center gap-x-3">
                <button
                    className="btn-ghost size-10"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronsLeft className={collapsed ? "rotate-180" : ""} />
                </button>
            </div>
            
            {/* User section */}
            <div className="flex items-center">
                {isAuthenticated ? (
                    <div className="relative">
                        <div 
                            ref={userImgRef}
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="h-9 w-9 cursor-pointer overflow-hidden rounded-full border border-slate-200 hover:shadow-md transition-all"
                        >
                            <img 
                                src={userImg} 
                                alt={user?.name || "User"} 
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {userMenuOpen && (
                            <div 
                                ref={userMenuRef}
                                className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg border border-slate-200"
                            >
                                <div className="px-4 py-2 border-b border-slate-200">
                                    <p className="text-sm font-medium text-slate-900 truncate">
                                        {user?.name || "User"}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <Link 
                                    to="/profile" 
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                                    onClick={() => setUserMenuOpen(false)}
                                >
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <button 
                                    onClick={() => {
                                        logout();
                                        setUserMenuOpen(false);
                                    }}
                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link 
                            to="/login" 
                            className="flex items-center gap-1 text-sm font-medium text-[#1e628c] hover:underline"
                        >
                            <LogIn className="h-4 w-4" />
                            Sign In
                        </Link>
                        <Link 
                            to="/signup" 
                            className="flex items-center gap-1 rounded-lg bg-[#1e628c] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#17516f]"
                        >
                            <UserPlus className="h-4 w-4" />
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func,
};