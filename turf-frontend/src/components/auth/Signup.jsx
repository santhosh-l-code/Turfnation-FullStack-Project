import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { UserRound, Building2, UserPlus, Eye, EyeOff } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import axios from "axios";

const API_BASE = "http://localhost:5000";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
    });
    const [errors, setErrors] = useState({});
    const [emailChecking, setEmailChecking] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // 🔹 Update form data + force lowercase for username
    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "fullName") value = value.toLowerCase(); // auto convert to lowercase
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    // 🔹 Validate form fields
    const validateForm = () => {
        const newErrors = {};

        // ✅ Username validation (lowercase only)
        const usernameRegex = /^[a-z0-9_]+$/;
        if (!formData.fullName.trim())
            newErrors.fullName = "Username is required.";
        else if (formData.fullName.length < 3)
            newErrors.fullName = "Username must be at least 3 characters.";
        else if (!usernameRegex.test(formData.fullName))
            newErrors.fullName =
                "Username can only contain lowercase letters, numbers, and underscores.";

        // ✅ Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!emailRegex.test(formData.email))
            newErrors.email = "Invalid email format.";

        // ✅ Password
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!formData.password)
            newErrors.password = "Password is required.";
        else if (!passwordRegex.test(formData.password))
            newErrors.password =
                "Password must include uppercase, lowercase, number & special char.";

        // ✅ Confirm password
        if (!formData.confirmPassword)
            newErrors.confirmPassword = "Please confirm your password.";
        else if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = "Passwords do not match.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 🔹 Check if email is duplicate
    const handleEmailBlur = async () => {
        const email = formData.email.trim();
        if (!email) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return;

        setEmailChecking(true);
        try {
            const res = await axios.post(`${API_BASE}/api/auth/check-email`, { email });
            if (!res.data.available) {
                setErrors((prev) => ({
                    ...prev,
                    email: "This email is already registered.",
                }));
            }
        } catch (err) {
            console.error("Email check failed:", err);
        } finally {
            setEmailChecking(false);
        }
    };

    // 🔹 Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (errors.email === "This email is already registered.") {
            alert("Please use a different email address.");
            return;
        }

        try {
            await axios.post(`${API_BASE}/api/auth/signup`, {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            alert("Account created successfully!");
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "Signup failed. Try again!");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex flex-col items-center justify-center flex-grow p-6">
                <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
                    <p className="text-gray-500 mb-6">
                        Join <span className="font-semibold text-green-600">TurfNation</span> and start booking turfs
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* Username */}
                        <input
                            type="text"
                            name="fullName"
                            placeholder="yourusername"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 ${errors.fullName ? "border-red-500" : ""
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm">{errors.fullName}</p>
                        )}

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleEmailBlur}
                            className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 ${errors.email ? "border-red-500" : ""
                                }`}
                        />
                        {emailChecking && (
                            <p className="text-gray-500 text-sm">Checking email...</p>
                        )}
                        {errors.email && (
                            <p className="text-red-500 text-sm">{errors.email}</p>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 ${errors.password ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-2.5 ${showPassword ? "text-green-600" : "text-gray-500"
                                    } hover:text-green-700`}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full border rounded-md p-2 focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className={`absolute right-3 top-2.5 ${showConfirm ? "text-green-600" : "text-gray-500"
                                    } hover:text-green-700`}
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="mt-3">
                            <p className="font-medium text-gray-700 mb-2">I am a</p>
                            <div className="flex flex-col gap-3">
                                <label
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${formData.role === "user"
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() => setFormData({ ...formData, role: "user" })}
                                >
                                    <UserRound
                                        className={
                                            formData.role === "user"
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }
                                    />
                                    <div>
                                        <p className="font-semibold">Player / User</p>
                                        <p className="text-sm text-gray-500">
                                            I want to book turfs and play sports
                                        </p>
                                    </div>
                                </label>

                                <label
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${formData.role === "owner"
                                            ? "border-green-500 bg-green-50"
                                            : "border-gray-300"
                                        }`}
                                    onClick={() => setFormData({ ...formData, role: "owner" })}
                                >
                                    <Building2
                                        className={
                                            formData.role === "owner"
                                                ? "text-green-600"
                                                : "text-gray-500"
                                        }
                                    />
                                    <div>
                                        <p className="font-semibold">Turf Owner</p>
                                        <p className="text-sm text-gray-500">
                                            I want to list and manage my turfs
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 flex justify-center items-center gap-2 bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                        >
                            <UserPlus size={18} /> Create Account
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-5">
                        Already have an account?{" "}
                        <NavLink
                            to="/login"
                            className="text-green-600 font-medium hover:underline"
                        >
                            Log In
                        </NavLink>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Signup;
