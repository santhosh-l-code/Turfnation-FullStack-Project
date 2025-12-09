import React from "react";
import Navbar from "./Navbar";

const HowItWorks = () => {
    return (
        <div>
            <Navbar></Navbar>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <h1 className="text-4xl font-bold text-green-600 mb-4">How TurfNation Works</h1>
                <p className="text-gray-700 max-w-lg text-center leading-relaxed">
                    TurfNation helps players book turfs and owners manage bookings easily.
                    Sign up as a player to explore and reserve available grounds,
                    or join as an owner to list and manage your turfs in real-time.
                </p>
            </div>
        </div>
    );
};

export default HowItWorks;
