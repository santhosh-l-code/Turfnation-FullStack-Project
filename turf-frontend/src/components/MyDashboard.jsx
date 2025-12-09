import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CalendarDays, Clock, CheckCircle2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://turfnation-backend.onrender.com";

const MyDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("upcoming");

    // ✅ Read user only once
    const userFromStorage = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchBookings = async () => {
            if (!userFromStorage) {
                alert("Please log in first!");
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/api/booking/user/${userFromStorage.id}`);
                setBookings(response.data.bookings || []);
                console.log(response.data.bookings)
            } catch (error) {
                console.error("Error fetching bookings:", error);
                alert("Failed to load your bookings. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []); // ✅ Run only once when the component mounts

    const today = new Date().toISOString().split("T")[0];
    const upcomingBookings = bookings.filter((b) => b.date >= today);
    const pastBookings = bookings.filter((b) => b.date < today);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.delete(`${API_BASE}/api/booking/${bookingId}`);
            setBookings(bookings.filter((b) => b._id !== bookingId));
            alert("Booking canceled successfully!");
        } catch (error) {
            console.error("Error canceling booking:", error);
            alert("Failed to cancel booking. Please try again.");
        }
    };

    if (loading) return <p className="text-center mt-10 text-lg">Loading your bookings...</p>;

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="m-7 mx-auto w-full p-7">
                <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                <p className="text-gray-500 mb-8">Manage your bookings and view your activity</p>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 gap-4 p-6 rounded-lg shadow-sm border">
                        <p className="text-gray-500 text-sm">Total Bookings</p>
                        <div className="flex justify-between p-2">
                            <h2 className="text-3xl font-bold">{bookings.length}</h2>
                            <p className="text-green-600 text-sm mt-1">+5% from last month</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                        <p className="text-gray-500 text-sm">Upcoming</p>
                        <div className="flex justify-between p-2">
                            <h2 className="text-3xl font-bold">{upcomingBookings.length}</h2>
                            <div className="text-green-600 mt-1">
                                <CalendarDays size={18} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm border">
                        <p className="text-gray-500 text-sm">Completed</p>
                        <div className="flex justify-between p-2">
                            <h2 className="text-3xl font-bold">{pastBookings.length}</h2>
                            <div className="text-green-600 mt-1">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === "upcoming"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        onClick={() => setActiveTab("upcoming")}
                    >
                        Upcoming Bookings
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md font-medium ${activeTab === "past"
                            ? "bg-green-600 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                        onClick={() => setActiveTab("past")}
                    >
                        Past Bookings
                    </button>
                </div>

                {/* Booking Cards */}
                <div className="flex flex-col gap-5">
                    {(activeTab === "upcoming" ? upcomingBookings : pastBookings).map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-lg shadow-sm border p-4 flex flex-col md:flex-row justify-between items-center"
                        >
                            {/* Turf Info */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={booking.turf.imageUrl}
                                    alt={booking.turf.name}
                                    className="w-32 h-24 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{booking.turf.name}</h3>
                                    <div className="flex items-center text-gray-600 text-sm gap-2 mt-1">
                                        <MapPin size={14} /> {booking.turf.location}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm gap-2 mt-1">
                                        <CalendarDays size={14} /> {booking.date}
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm gap-2 mt-1">
                                        <Clock size={14} /> {booking.slot}
                                    </div>
                                    <p className="text-green-700 font-bold mt-2">₹{booking.price}</p>
                                    <p className="text-xs text-gray-400 mt-1">Booking ID: {booking._id}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                                <span
                                    className={`text-sm font-semibold px-3 py-1 rounded-md ${booking.date < today
                                        ? "bg-gray-200 text-gray-600"
                                        : "bg-green-100 text-green-700"
                                        }`}
                                >
                                    {booking.date < today ? "Completed" : "Confirmed"}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/turf/${booking.turf._id}`)}
                                        className="border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-100"
                                    >
                                        View Details
                                    </button>
                                    {booking.date >= today && (
                                        <button
                                            onClick={() => handleCancel(booking._id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(activeTab === "upcoming" ? upcomingBookings : pastBookings).length === 0 && (
                        <p className="text-center text-gray-500 mt-6">
                            No {activeTab === "upcoming" ? "upcoming" : "past"} bookings found.
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default MyDashboard;
