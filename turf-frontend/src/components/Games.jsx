import React, { useEffect, useState } from "react";
import axios from "axios";
import Game from "./Game";
import { NavLink } from "react-router-dom";

const API_BASE = "http://localhost:5000"; // change if your backend runs elsewhere

const Games = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch games from backend
    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/api/game`);
                setGames(response.data.games || []);
            } catch (err) {
                console.error("Error fetching games:", err);
                setError("Failed to load games.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    if (loading) {
        return (
            <div className="mt-16 text-center text-gray-600 text-lg">
                Loading games...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-16 text-center text-red-600 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="mt-16">
            <div className="flex flex-col items-center gap-4">
                <p className="text-4xl font-bold">Popular Sports</p>
                <p>Choose Your Favourite Sport and find the perfect turf</p>
            </div>

            <div className="flex flex-wrap flex-row gap-3 ml-6 mt-5">
                {games.map((game) => (
                    <NavLink to={`/turfs/${game._id}`} key={game._id}>
                        <Game
                            key={game._id}
                            name={game.name}
                            imgUrl={game.imageUrl}
                        // turfsCount={game.turfs ? game.turfs.length : 0} // optional, only if you want
                        />
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default Games;
