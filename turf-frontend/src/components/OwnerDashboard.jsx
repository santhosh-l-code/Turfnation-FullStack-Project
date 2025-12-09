import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Trash2, Edit3 } from "lucide-react";

const API_BASE = "https://turfnation-backend.onrender.com";

const OwnerDashboard = () => {
    const [turfs, setTurfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingTurf, setEditingTurf] = useState(null);
    const [formData, setFormData] = useState({});
    const [slotError, setSlotError] = useState("");


    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const ownerId = loggedInUser?._id || loggedInUser?.id;

    useEffect(() => {
        if (!ownerId) return;

        const fetchOwnerTurfs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/api/turf/owner/${ownerId}`);
                setTurfs(res.data.turfs || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load your turfs.");
            } finally {
                setLoading(false);
            }
        };

        fetchOwnerTurfs();
    }, [ownerId]);

    const handleDelete = async (turfId) => {
        if (!window.confirm("Are you sure you want to delete this turf?")) return;

        try {
            await axios.delete(`${API_BASE}/api/turf/${turfId}`);
            setTurfs(turfs.filter((turf) => turf._id !== turfId));
            alert("Turf deleted successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to delete turf.");
        }
    };

    const handleEditClick = (turf) => {
        setEditingTurf(turf);
        setFormData({
            name: turf.name,
            location: turf.location,
            pricePerHour: turf.pricePerHour,
            description: turf.description,
            slots: turf.slots || [], // ✅ include slots
        });
    };


    const handleUpdate = async () => {
        try {
            const res = await axios.put(`${API_BASE}/api/turf/${editingTurf._id}`, formData);

            // Find the old turf (which has the populated game info)
            const oldTurf = turfs.find(t => t._id === editingTurf._id);

            // If backend response has only ID, preserve the old game object
            const updatedTurf = {
                ...res.data.turf,
                game: oldTurf.game, // keep the old game info (name & id)
            };

            setTurfs(
                turfs.map((turf) =>
                    turf._id === editingTurf._id ? updatedTurf : turf
                )
            );

            alert("Turf updated successfully!");
            setEditingTurf(null);
        } catch (err) {
            console.error(err);
            alert("Failed to update turf.");
        }
    };

    if (loading)
        return <p className="text-center mt-10 text-gray-600">Loading your turfs...</p>;
    if (error)
        return <p className="text-center mt-10 text-red-500">{error}</p>;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            <div className="flex-grow container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
                    My Turfs
                </h1>

                {turfs.length === 0 ? (
                    <p className="text-center text-gray-600">
                        You haven’t added any turfs yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {turfs.map((turf) => (
                            <div
                                key={turf._id}
                                className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition relative"
                            >
                                <img
                                    src={turf.imageUrl}
                                    alt={turf.name}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <div className="mt-3">
                                    <h2 className="text-xl font-semibold">{turf.name}</h2>
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">{turf.location}</p>
                                        <p className="text-sm text-green-600 font-medium">
                                            {turf.game?.name || "Unknown Game"}
                                        </p>
                                    </div>
                                    <p className="text-green-600 font-bold mt-1">
                                        ₹{turf.pricePerHour}/hr
                                    </p>
                                </div>

                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={() => handleEditClick(turf)}
                                        className="bg-blue-100 hover:bg-blue-200 p-2 rounded-full"
                                        title="Edit Turf"
                                    >
                                        <Edit3 size={18} className="text-blue-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(turf._id)}
                                        className="bg-red-100 hover:bg-red-200 p-2 rounded-full"
                                        title="Delete Turf"
                                    >
                                        <Trash2 size={18} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Edit Modal */}
                {editingTurf && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                            <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                                Edit Turf
                            </h2>

                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Turf Name"
                                className="border w-full p-2 rounded-md mb-3"
                            />

                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Location"
                                className="border w-full p-2 rounded-md mb-3"
                            />

                            <input
                                type="number"
                                value={formData.pricePerHour}
                                onChange={(e) =>
                                    setFormData({ ...formData, pricePerHour: e.target.value })
                                }
                                placeholder="Price per hour"
                                className="border w-full p-2 rounded-md mb-3"
                            />

                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Description"
                                className="border w-full p-2 rounded-md mb-3"
                            />

                            {/* Slots Editor */}
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-2">Available Slots:</label>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.slots.map((slot, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full"
                                        >
                                            <span>{slot}</span>
                                            <button
                                                onClick={() =>
                                                    setFormData({
                                                        ...formData,
                                                        slots: formData.slots.filter((_, i) => i !== index),
                                                    })
                                                }
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="e.g. 8am-9am"
                                            id="new-slot"
                                            className={`border w-full p-2 rounded-md ${slotError ? "border-red-500" : ""}`}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById("new-slot");
                                                const newSlot = input.value.trim();
                                                const validSlot = /^([1-9]|1[0-2])(am|pm)-([1-9]|1[0-2])(am|pm)$/i;

                                                if (!newSlot) {
                                                    setSlotError("Please enter a slot!");
                                                    return;
                                                }

                                                if (!validSlot.test(newSlot)) {
                                                    setSlotError("Invalid format! Use '8am-9am'.");
                                                    return;
                                                }

                                                // ✅ Split and validate logical time order
                                                const [start, end] = newSlot.toLowerCase().split("-");
                                                const to24 = (t) => {
                                                    let hour = parseInt(t);
                                                    if (t.includes("pm") && hour !== 12) hour += 12;
                                                    if (t.includes("am") && hour === 12) hour = 0;
                                                    return hour;
                                                };

                                                const startHour = to24(start);
                                                const endHour = to24(end);

                                                if (endHour <= startHour) {
                                                    setSlotError("End time must be later than start time!");
                                                    return;
                                                }

                                                if (formData.slots.includes(newSlot)) {
                                                    setSlotError("Slot already exists!");
                                                    return;
                                                }

                                                setFormData({ ...formData, slots: [...formData.slots, newSlot] });
                                                setSlotError("");
                                                input.value = "";
                                            }}
                                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {slotError && <p className="text-red-500 text-sm">{slotError}</p>}
                                </div>


                            </div>


                            <div className="flex justify-between">
                                <button
                                    onClick={() => setEditingTurf(null)}
                                    className="bg-gray-300 px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default OwnerDashboard;
