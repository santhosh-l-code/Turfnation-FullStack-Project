import bg from '../assets/home-bg-image.png'
import React from 'react'

const HeroSection = () => {
    return (
        <div
            className="relative h-[65vh] w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${bg})` }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
                    Book Your Perfect Turf
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mt-3 max-w-2xl drop-shadow-md">
                    Find and book premium sports facilities near you for cricket, football, tennis, and more.
                </p>
            </div>
        </div>
    )
}

export default HeroSection
