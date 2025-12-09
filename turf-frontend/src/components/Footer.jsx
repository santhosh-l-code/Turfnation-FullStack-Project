import React from "react";

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-16 p-3">
            <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                {/* Logo + Description */}
                <div className="mr-8">
                    <h2 className="text-3xl font-extrabold text-green-600 mb-4">
                        TurfNation
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                        Book premium sports facilities with ease and confidence.
                    </p>
                </div>

                {/* Product */}
                <div>
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Product</h3>
                    <ul className="space-y-3 text-gray-600 text-base">
                        <li><a href="#" className="hover:text-green-600">Browse Turfs</a></li>
                        <li><a href="#" className="hover:text-green-600">How It Works</a></li>
                        <li><a href="#" className="hover:text-green-600">Pricing</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div>
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Company</h3>
                    <ul className="space-y-3 text-gray-600 text-base">
                        <li><a href="#" className="hover:text-green-600">About Us</a></li>
                        <li><a href="#" className="hover:text-green-600">Contact</a></li>
                        <li><a href="#" className="hover:text-green-600">Careers</a></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h3 className="text-gray-900 font-bold text-lg mb-4">Legal</h3>
                    <ul className="space-y-3 text-gray-600 text-base">
                        <li><a href="#" className="hover:text-green-600">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-green-600">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-green-600">Refund Policy</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Line (Centered) */}
            <div className="flex justify-center items-center mt-16 border-t border-gray-300 h-10 text-gray-600 text-base">
                <p className="mt-16 text-lg ml-5">© {new Date().getFullYear()}{" "}
                    <span className="font-semibold text-gray-800 mx-1">TurfNation</span>
                    . All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
