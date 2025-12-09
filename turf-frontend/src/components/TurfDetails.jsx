import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MapPin, Clock, Users, Phone } from "lucide-react";

const API_BASE = "https://turfnation-backend.onrender.com"; // your backend

const TurfDetails = () => {
    const { turfId } = useParams();
    const [turf, setTurf] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alreadyBooked, setAlreadyBooked] = useState(false);
    const [bookedSlotsMap, setBookedSlotsMap] = useState({});
    const [allBookings, setAllBookings] = useState([]);

    const navigate = useNavigate();

    // ✅ 1️⃣ Fetch Turf Details + All Bookings
    useEffect(() => {
        const fetchTurfData = async () => {
            try {
                setLoading(true);

                // Fetch Turf
                const turfRes = await axios.get(`${API_BASE}/api/turf/${turfId}`);
                const turfData = turfRes.data.turf;
                setTurf(turfData);

                // Fetch Bookings for this Turf
                const bookingsRes = await axios.get(`${API_BASE}/api/booking/turf/${turfId}`);
                const turfBookings = bookingsRes.data.bookings || [];
                setAllBookings(turfBookings);

                // Build Map of booked slots per date
                const bookedMap = {};
                turfBookings.forEach((b) => {
                    if (!bookedMap[b.date]) bookedMap[b.date] = [];
                    bookedMap[b.date].push(b.slot);
                });
                setBookedSlotsMap(bookedMap);

            } catch (err) {
                console.error("Error fetching turf data:", err);
                setError("Failed to load turf details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTurfData();
    }, [turfId]);

    // ✅ 2️⃣ Re-check if logged-in user already booked on the selected date
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedInUser || !allBookings.length) {
            setAlreadyBooked(false);
            return;
        }

        // ✅ Check if this user has booked THIS slot (not just the date)
        const bookedByUser = allBookings.some(
            (b) =>
                b.user === loggedInUser.id &&
                b.date === selectedDate &&
                b.slot === selectedSlot
        );

        setAlreadyBooked(bookedByUser);
    }, [selectedDate, selectedSlot, allBookings]);


    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!turf) return <p className="text-center mt-10">Turf not found!</p>;

    const bookedSlots = bookedSlotsMap[selectedDate] || [];

    const handleSlotSelect = (slot) => {
        if (bookedSlots.includes(slot)) return;

        if (selectedSlot === slot) {
            setSelectedSlot(null);
            setAlreadyBooked(false);
        } else {
            setSelectedSlot(slot);
            setAlreadyBooked(false);
        }
    };

    const handleBookNow = () => {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedInUser) {
            alert("Please log in first to book a turf!");
            navigate("/login");
            return;
        }

        if (!selectedSlot) {
            alert("Please select a slot first!");
            return;
        }

        // ✅ Prevent booking for past dates
        const today = new Date().toISOString().split("T")[0];
        if (selectedDate < today) {
            alert("You cannot book a turf for a past date!");
            return;
        }

        if (alreadyBooked) {
            alert("You’ve already booked this turf!");
            return;
        }

        navigate("/payment", {
            state: {
                turf: turf._id,
                user: loggedInUser.id,
                game: turf.game._id,
                date: selectedDate,
                slot: selectedSlot,
                price: turf.pricePerHour,
                turfName: turf.name,
            },
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {/* Turf Banner */}
            <div className="relative">
                <img
                    src={turf.imageUrl}
                    alt={turf.name}
                    className="w-full h-[450px] object-cover brightness-75"
                />
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row justify-center gap-10 px-6 py-10">
                {/* LEFT SIDE - About Turf */}
                <div className="md:w-2/3 flex flex-col gap-5">
                    <div className="flex flex-row justify-between ml-[100px]">
                        <h2 className="text-4xl font-bold">{turf.name}</h2>
                        <p className="text-white font-bold bg-green-600 rounded-[10px] p-2 text-lg">
                            ₹ {turf.pricePerHour}/hr
                        </p>
                    </div>

                    <div className="flex ml-[100px] items-center gap-3 text-gray-600">
                        <MapPin size={18} />
                        <span>{turf.location}</span>
                    </div>

                    <p className="ml-[100px] text-gray-700 leading-relaxed">{turf.description}</p>

                    <div className="ml-[100px] flex items-center gap-8 text-gray-600 mt-4">
                        <div className="flex items-center gap-2">
                            <Clock size={18} /> <span>Open 6 AM - 11 PM</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={18} /> <span>22 Players Max</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={18} /> <span>{turf.contact}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE - Booking Box */}
                <div className="md:w-1/3 bg-white shadow-lg rounded-xl p-6 border">
                    <h3 className="text-lg font-bold mb-3">Book Your Slot</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            min={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedSlot(null);
                            }}
                            onBlur={(e) => {
                                const newDate = e.target.value;
                                const today = new Date().toISOString().split("T")[0];
                                if (newDate < today) {
                                    alert("You cannot select a past date!");
                                    setSelectedDate(today);
                                }
                            }}
                            className="border w-full p-2 rounded-md"
                        />


                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Select Time Slot:</label>
                        <div className="grid grid-cols-2 gap-2">
                            {turf.slots.map((slot) => {
                                const isBooked = bookedSlots.includes(slot);
                                const isSelected = selectedSlot === slot;

                                let bgClass = "bg-green-100 hover:bg-green-200";
                                if (isBooked) bgClass = "bg-gray-300 cursor-not-allowed";
                                if (isSelected) bgClass = "bg-green-500 text-white";

                                return (
                                    <button
                                        key={slot}
                                        disabled={isBooked}
                                        onClick={() => handleSlotSelect(slot)}
                                        className={`p-2 rounded-md font-semibold text-sm ${bgClass}`}
                                    >
                                        {isBooked ? `${slot} (Booked)` : slot}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-3 mt-4 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-green-100 border rounded"></span> Available
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-green-500 border rounded"></span> Selected
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-gray-300 border rounded"></span> Booked
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleBookNow}
                        disabled={alreadyBooked}
                        className={`w-full py-2 rounded-md font-bold transition ${alreadyBooked
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                    >
                        {alreadyBooked ? "Already Booked" : "Book Now"}
                    </button>

                    {alreadyBooked && (
                        <p className="text-sm text-gray-500 mt-2 text-center">
                            You’ve already booked this turf for the selected date.
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default TurfDetails;
