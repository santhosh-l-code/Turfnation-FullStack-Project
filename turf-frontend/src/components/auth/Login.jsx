import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { LogIn, Eye, EyeOff } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim()) newErrors.email = "Email is required.";
        else if (!emailRegex.test(email)) newErrors.email = "Invalid email format.";

        if (!password.trim()) newErrors.password = "Password is required.";
        else if (password.length < 6)
            newErrors.password = "Password must be at least 6 characters.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE}/api/auth/login`, {
                email,
                password,
            });

            const { user, token } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Login successful!");
            if (user.role === "owner") navigate("/owner-dashboard");
            else navigate("/dashboard");
        } catch (error) {
            if (error.response?.data?.message) {
                const msg = error.response.data.message.toLowerCase();
                if (msg.includes("not found"))
                    setErrors({ email: "No account found with this email." });
                else if (msg.includes("invalid password"))
                    setErrors({ password: "Incorrect password. Try again." });
                else setErrors({ general: error.response.data.message });
            } else {
                setErrors({
                    general: "Login failed. Please check your credentials and try again.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex flex-col justify-center items-center flex-grow p-6">
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
                        TurfNation
                    </h1>

                    <h2 className="text-xl font-bold text-gray-800 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 text-center mb-6">
                        Log in to your account to continue
                    </p>

                    {errors.general && (
                        <p className="text-red-500 text-center mb-3 text-sm">
                            {errors.general}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {/* Email */}
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="youremail@gmail.com"
                                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.email ? "border-red-500" : ""
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password with eye toggle */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 focus:outline-none ${errors.password ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-3 flex justify-center items-center gap-2 py-2 rounded-md font-semibold transition ${loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                        >
                            {loading ? "Logging in..." : <><LogIn size={18} /> Log In</>}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Don’t have an account?{" "}
                        <NavLink
                            to="/signup"
                            className="text-green-600 font-medium hover:underline"
                        >
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
