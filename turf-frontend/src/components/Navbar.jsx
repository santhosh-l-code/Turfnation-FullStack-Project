import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    User,
    LogOut,
    LayoutDashboard,
    UserCircle2,
} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null); // 🔹 reference for dropdown

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    // 🔹 Detect clicks outside the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMenu]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    };

    return (
        <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-md relative z-40">
            {/* ---------------- LEFT: Logo ---------------- */}
            <NavLink
                to="/"
                className="text-2xl font-bold text-green-600 hover:text-green-700"
            >
                TurfNation
            </NavLink>

            {/* ---------------- CENTER: Links ---------------- */}
            <div className="hidden md:flex gap-8 text-gray-700 font-medium">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `hover:text-green-600 ${isActive ? "text-black font-semibold" : ""
                        }`
                    }
                >
                    Home
                </NavLink>

                <NavLink
                    to="/how-it-works"
                    className={({ isActive }) =>
                        `hover:text-green-600 ${isActive ? "text-black font-semibold" : ""
                        }`
                    }
                >
                    How It Works
                </NavLink>
            </div>

            {/* ---------------- RIGHT: User / Auth ---------------- */}
            <div className="flex items-center gap-6">
                {!user ? (
                    <>
                        <NavLink
                            to="/login"
                            className="text-gray-700 font-semibold hover:text-green-600"
                        >
                            Log In
                        </NavLink>
                        <NavLink
                            to="/signup"
                            className="text-white font-semibold border-3 bg-green-500 p-2"
                        >
                            Sign Up
                        </NavLink>
                    </>
                ) : (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                        >
                            <User className="text-gray-700" size={22} />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border z-50">
                                <div
                                    className="flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <UserCircle2 size={28} className="text-green-600" />
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{user.name}</span>
                                        <span className="text-sm text-gray-500 capitalize">{user.role == 'user' ? 'player' : user.role}</span>
                                    </div>
                                </div>

                                <NavLink
                                    to={user.role === "owner" ? "/owner-dashboard" : "/dashboard"}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                                    onClick={() => setShowMenu(false)}
                                >
                                    <LayoutDashboard size={16} /> Dashboard
                                </NavLink>



                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-gray-100"
                                >
                                    <LogOut size={16} /> Log Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
