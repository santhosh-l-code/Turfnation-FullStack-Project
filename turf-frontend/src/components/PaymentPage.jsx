import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";

const API_BASE = "https://turfnation-backend.onrender.com";

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const bookingData = location.state; // passed from TurfDetails
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    const [cardDetails, setCardDetails] = useState({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
    });

    if (!bookingData) {
        return <p className="text-center mt-10">Invalid Payment Request</p>;
    }

    const handlePayNow = async () => {
        setIsProcessing(true);

        // simulate payment delay
        setTimeout(async () => {
            try {
                // send booking details to backend
                await axios.post(`${API_BASE}/api/booking/add`, bookingData);

                setPaymentDone(true);
                setIsProcessing(false);

                setTimeout(() => {
                    alert("Payment Successful and Turf Booked!");
                    navigate("/dashboard");
                }, 2000);
            } catch (err) {
                setIsProcessing(false);
                alert(err.response?.data?.message || "Payment failed. Try again.");
            }
        }, 2000);
    };

    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-gray-50">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                    TurfNation Payment
                </h2>

                <div className="mb-4 border-b pb-3">
                    <p className="text-gray-700 text-lg font-semibold">
                        {bookingData.turfName}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Date: {bookingData.date} | Slot: {bookingData.slot}
                    </p>
                    <p className="text-2xl font-bold text-green-700 mt-3">
                        ₹ {bookingData.price}
                    </p>
                </div>

                {/* Payment Options */}
                <h3 className="text-gray-800 font-semibold mb-3">Select Payment Method</h3>
                <div className="flex flex-col gap-2 mb-4">
                    {["UPI", "Credit/Debit Card", "Wallet"].map((method) => (
                        <label
                            key={method}
                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border transition ${paymentMethod === method
                                ? "border-green-600 bg-green-50"
                                : "border-gray-300"
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={() => setPaymentMethod(method)}
                                className="accent-green-600"
                            />
                            <span className="font-medium text-gray-700">{method}</span>
                        </label>
                    ))}
                </div>

                {/* Card Details Form */}
                {paymentMethod === "Credit/Debit Card" && (
                    <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                        <input
                            type="text"
                            placeholder="Cardholder Name"
                            value={cardDetails.name}
                            onChange={(e) =>
                                setCardDetails({ ...cardDetails, name: e.target.value })
                            }
                            className="w-full mb-2 border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Card Number"
                            maxLength="16"
                            value={cardDetails.number}
                            onChange={(e) =>
                                setCardDetails({
                                    ...cardDetails,
                                    number: e.target.value.replace(/\D/g, ""),
                                })
                            }
                            className="w-full mb-2 border p-2 rounded-md"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="MM/YY"
                                maxLength="5"
                                value={cardDetails.expiry}
                                onChange={(e) =>
                                    setCardDetails({ ...cardDetails, expiry: e.target.value })
                                }
                                className="w-1/2 border p-2 rounded-md"
                            />
                            <input
                                type="password"
                                placeholder="CVV"
                                maxLength="3"
                                value={cardDetails.cvv}
                                onChange={(e) =>
                                    setCardDetails({
                                        ...cardDetails,
                                        cvv: e.target.value.replace(/\D/g, ""),
                                    })
                                }
                                className="w-1/2 border p-2 rounded-md"
                            />
                        </div>
                    </div>
                )}

                {/* UPI Mock Field */}
                {paymentMethod === "UPI" && (
                    <input
                        type="text"
                        placeholder="Enter UPI ID (e.g. username@upi)"
                        className="w-full border p-2 rounded-md mb-4"
                    />
                )}

                {/* Wallet */}
                {paymentMethod === "Wallet" && (
                    <p className="text-sm text-gray-600 mb-4">
                        Using TurfNation Wallet – ₹{bookingData.price} will be deducted from your balance.
                    </p>
                )}

                {/* Pay Button */}
                {!isProcessing && !paymentDone && (
                    <button
                        onClick={handlePayNow}
                        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition"
                    >
                        Pay ₹{bookingData.price} Now
                    </button>
                )}

                {/* Processing Animation */}
                {isProcessing && (
                    <div className="flex flex-col items-center justify-center mt-4">
                        <Loader2 className="animate-spin text-green-600" size={30} />
                        <p className="text-gray-600 mt-2">Processing your payment...</p>
                    </div>
                )}

                {/* Payment Success */}
                {paymentDone && (
                    <div className="flex flex-col items-center justify-center mt-4 text-center">
                        <CheckCircle2 className="text-green-600" size={40} />
                        <p className="text-green-700 font-semibold mt-2 text-lg">
                            Payment Successful!
                        </p>
                        <p className="text-gray-600 text-sm">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
