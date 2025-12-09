import React from "react";
import { Search, Calendar, Trophy } from "lucide-react"; // icons from lucide-react

const steps = [
    {
        id: 1,
        title: "Browse",
        description: "Discover premium sports turfs near you with advanced filters",
        icon: <Search className="w-8 h-8 text-green-600" />,
    },
    {
        id: 2,
        title: "Book",
        description: "Select your preferred date and time slot with instant confirmation",
        icon: <Calendar className="w-8 h-8 text-green-600" />,
    },
    {
        id: 3,
        title: "Play",
        description: "Show up and enjoy your game at world-class facilities",
        icon: <Trophy className="w-8 h-8 text-green-600" />,
    },
];

const Guide = () => {
    return (
        <section className="py-16 px-6 text-center bg-white">
            {/* Section heading */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-500 mb-10">
                Book your perfect turf in three simple steps
            </p>

            {/* Steps container */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className="w-[100%] h-[100%]  bg-white border border-gray-200 rounded-xl shadow-sm p-14 hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex flex-col items-center p-3 gap-2">
                            <div className="bg-green-50 p-4 rounded-full mb-4">
                                {step.icon}
                            </div>
                            <h3 className="p-2 text-lg font-semibold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Guide;
