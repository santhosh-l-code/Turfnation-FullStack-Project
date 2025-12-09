import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import TurfCard from "./TurfCard";
import Footer from "./Footer";
import { NavLink, useParams } from "react-router-dom";

const API_BASE = "https://turfnation-backend.onrender.com";

const Turfs = () => {
    const { gameId } = useParams();
    const [turfs, setTurfs] = useState([]);
    const [gameName, setGameName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTurf, setNewTurf] = useState({
        name: "",
        location: "",
        pricePerHour: "",
        description: "",
        contact: "",
        imageUrl: "",
        slots: "",
    });

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isOwner = loggedInUser?.role === "owner";

    const availableSlots = [
        "6am-7am",
        "7am-8am",
        "8am-9am",
        "9am-10am",
        "10am-11am",
        "11am-12pm",
        "12pm-1pm",
        "1pm-2pm",
        "2pm-3pm",
        "3pm-4pm",
        "4pm-5pm",
        "5pm-6pm",
        "6pm-7pm",
        "7pm-8pm",
        "8pm-9pm",
        "9pm-10pm",
    ];

    // ✅ Fetch Turfs by Game ID
    useEffect(() => {
        const fetchTurfs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/api/turf/game/${gameId}`);
                let turfsData = response.data.turfs || [];

                // ✅ If backend didn’t populate owner name, fetch it manually
                turfsData = await Promise.all(
                    turfsData.map(async (turf) => {
                        if (turf.owner && typeof turf.owner === "string") {
                            try {
                                const ownerRes = await axios.get(`${API_BASE}/api/user/${turf.owner}`);
                                turf.owner = { name: ownerRes.data.name || "Unknown Owner" };
                            } catch {
                                turf.owner = { name: "Unknown Owner" };
                            }
                        }
                        return turf;
                    })
                );

                setTurfs(turfsData);
                if (turfsData.length > 0)
                    setGameName(turfsData[0].game?.name || "Unknown Game");
            } catch (err) {
                console.error("Error fetching turfs:", err);
                setError("Failed to load turfs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchTurfs();
    }, [gameId]);

    // ✅ Add New Turf
    const handleAddTurf = async () => {
        if (!newTurf.name || !newTurf.location || !newTurf.pricePerHour) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE}/api/turf/add`, {
                ...newTurf,
                slots: selectedSlots,
                owner: loggedInUser?.id,
                game: gameId,
            });

            alert("Turf added successfully!");
            setTurfs([...turfs, response.data.turf]);
            setShowAddModal(false);
            setSelectedSlots([]);
            setNewTurf({
                name: "",
                location: "",
                pricePerHour: "",
                description: "",
                contact: "",
                imageUrl: "",
                slots: "",
            });
        } catch (error) {
            console.error("Error adding turf:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to add turf. Please try again.");
        }
    };

    return (
        <div className="flex flex-col">
            <Navbar />
            <p className="text-center text-4xl mt-3 font-thin">
                Add Your Turf Under {gameName} Game
            </p>

            {/* Add Turf Button (only for owners) */}
            {isOwner && (
                <div className="mt-5 flex justify-center mb-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                        + Add Turf
                    </button>
                </div>
            )}

            <div className="flex flex-col gap-2">
                {loading ? (
                    <p className="text-center p-3 text-lg text-gray-600">Loading turfs...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <p className="text-center p-3 text-xl font-bold">
                        {turfs.length} Turfs Found for {gameName}
                    </p>
                )}

                {/* Turf List */}
                <div className="flex flex-col items-center gap-4 mb-3">
                    {!loading &&
                        !error &&
                        turfs.map((turf) => (
                            <NavLink key={turf._id} to={`/turf/${turf._id}`} className="w-[95%] ml-11">
                                <TurfCard
                                    name={turf.name}
                                    location={turf.location}
                                    game={gameName}
                                    imageUrl={turf.imageUrl}
                                    ownerName={turf.owner?.name || "Unknown Owner"}
                                />
                            </NavLink>
                        ))}

                    {!loading && !error && turfs.length === 0 && (
                        <p className="text-gray-500 text-center">No turfs available for this game.</p>
                    )}
                </div>
            </div>

            {/* ✅ Add Turf Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                            Add New Turf
                        </h2>

                        <input
                            type="text"
                            placeholder="Turf Name"
                            value={newTurf.name}
                            onChange={(e) => setNewTurf({ ...newTurf, name: e.target.value })}
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        <input
                            type="text"
                            placeholder="Location"
                            value={newTurf.location}
                            onChange={(e) => setNewTurf({ ...newTurf, location: e.target.value })}
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        <input
                            type="number"
                            placeholder="Price per Hour"
                            value={newTurf.pricePerHour}
                            onChange={(e) =>
                                setNewTurf({ ...newTurf, pricePerHour: e.target.value })
                            }
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        <input
                            type="text"
                            placeholder="Contact Number"
                            value={newTurf.contact}
                            onChange={(e) => setNewTurf({ ...newTurf, contact: e.target.value })}
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        <textarea
                            placeholder="Description"
                            value={newTurf.description}
                            onChange={(e) =>
                                setNewTurf({ ...newTurf, description: e.target.value })
                            }
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        {/* Upload Turf Image */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Turf Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("upload_preset", "turf_uploads");

                                try {
                                    const uploadRes = await axios.post(
                                        `https://api.cloudinary.com/v1_1/dkswf608u/image/upload`,
                                        formData
                                    );
                                    setNewTurf({ ...newTurf, imageUrl: uploadRes.data.secure_url });
                                    alert("Image uploaded successfully ✅");
                                } catch (err) {
                                    console.error("Cloudinary upload error:", err);
                                    alert("Failed to upload image!");
                                }
                            }}
                            className="border w-full p-2 rounded-md mb-3"
                        />

                        {/* Image Preview */}
                        {newTurf.imageUrl && (
                            <img
                                src={newTurf.imageUrl}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-lg mb-3 border"
                            />
                        )}

                        {/* Available Slots */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Available Slots:
                            </label>

                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-2">
                                {availableSlots.map((slot) => (
                                    <label
                                        key={slot}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            value={slot}
                                            checked={selectedSlots.includes(slot)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedSlots([...selectedSlots, slot]);
                                                } else {
                                                    setSelectedSlots(
                                                        selectedSlots.filter((s) => s !== slot)
                                                    );
                                                }
                                            }}
                                            className="accent-green-600"
                                        />
                                        {slot}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-300 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddTurf}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                            >
                                Add Turf
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Turfs;
