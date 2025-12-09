import React from "react";
import { MapPin } from "lucide-react";

const TurfCard = ({ name, location, game, imageUrl, ownerName }) => {
    return (

        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-[95%] hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            {/* Image Section */}
            <div className="relative">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-52 object-cover"
                />
            </div>

            {/* Details Section */}
            <div className="p-4 bg-blue-50 relative">
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                    {name}
                </h3>

                {/* Location */}
                <div className="flex items-center mt-2 text-gray-600 text-sm mb-2">
                    <MapPin size={16} className="mr-1 text-gray-500" />
                    {location}
                </div>

                {/* Game Tag */}
                <div className=" flex justify-end">
                    <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-lg">
                        {game}

                    </span>


                </div>
                {/* <p className="text-sm text-red-700 absolute bottom-0 right-3 ">
                    Turf Owner : {ownerName}
                </p> */}
            </div>
        </div>
    );
};

export default TurfCard;
