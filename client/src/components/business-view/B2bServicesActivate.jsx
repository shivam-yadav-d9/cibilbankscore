import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import {
    Banknote, CreditCard, ReceiptText, ShieldCheck, PiggyBank,
    Coins, Fingerprint, SendHorizontal, Building, Landmark,
    Gavel, UserPlus, FileText, Truck, HeartPulse, Pill,
    HandHelping, CalendarCheck2, DollarSign, MonitorSmartphone
} from "lucide-react";

const TermsAndConditions = () => {
    const [accepted, setAccepted] = useState(false);

    const handleAccept = () => {
        setAccepted(true);
    };

    const handleDecline = () => {
        alert("You must accept the terms and conditions to proceed.");
    };

    return (
        <div className="bg-gray-50 py-12 mt-20">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">

                    {/* Stylish Paragraph Section */}
                    <div className="px-8 py-6 bg-gray-100 border-b border-gray-200"> {/* Increased padding, subtle background */}
                        <p className="text-gray-600 leading-relaxed text-lg italic"> {/* Increased font size, added italic style */}
                            With B2B banking between businesses, you can track, manage and plan all your transaction processes. In this way, you can reach new businesses and expand the reach of your business. You can operate your business with The Kingdom Bank all over the world with no boundaries. Our dedicated team is ready to provide tailored solutions for your business.
                        </p>
                    </div>

                    {/* Centered Button */}
                    <div className="px-6 py-8 flex justify-center"> {/* Flex container for centering */}

                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300"
                        >
                            Now you can start your journey with us
                        </button>
                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
                        <Link to="/UserLoanpage"><div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Banknote size={50} />
                            </div>
                            <span className="font-semibold text-lg">Loan</span>
                        </div>
                        </Link>

                        <Link to="/credit-check">
                            <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                                <div className="hover:-translate-y-2 transition-transform duration-300">
                                    <CreditCard size={50} />
                                </div>
                                <span className="font-semibold text-lg">Credit Score</span>
                            </div>
                        </Link>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <CreditCard size={50} />
                            </div>
                            <span className="font-semibold text-lg">Credit Card</span>
                        </div>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <ReceiptText size={50} />
                            </div>
                            <span className="font-semibold text-lg">Bill Payment</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <ShieldCheck size={50} />
                            </div>
                            <span className="font-semibold text-lg">Insurance</span>
                        </div>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <PiggyBank size={50} />
                            </div>
                            <span className="font-semibold text-lg">FD (Fixed Deposit)</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Coins size={50} />
                            </div>
                            <span className="font-semibold text-lg">RD (Recurring Deposit)</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Fingerprint size={50} />
                            </div>
                            <span className="font-semibold text-lg">AEPS</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <SendHorizontal size={50} />
                            </div>
                            <span className="font-semibold text-lg">DMT</span>
                        </div>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Building size={50} />
                            </div>
                            <span className="font-semibold text-lg">IMPS/RTGS</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Landmark size={50} />
                            </div>
                            <span className="font-semibold text-lg">Govt Service</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Gavel size={50} />
                            </div>
                            <span className="font-semibold text-lg">Legal Services</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <UserPlus size={50} />
                            </div>
                            <span className="font-semibold text-lg">Apply Bank BC</span>
                        </div>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <FileText size={50} />
                            </div>
                            <span className="font-semibold text-lg">Account Opening</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Truck size={50} />
                            </div>
                            <span className="font-semibold text-lg">Courier Services</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <HeartPulse size={50} />
                            </div>
                            <span className="font-semibold text-lg">E-Health</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <Pill size={50} />
                            </div>
                            <span className="font-semibold text-lg">Medicine</span>
                        </div>

                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <HandHelping size={50} />
                            </div>
                            <span className="font-semibold text-lg">Affliction Service</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <CalendarCheck2 size={50} />
                            </div>
                            <span className="font-semibold text-lg">Booking</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <DollarSign size={50} />
                            </div>
                            <span className="font-semibold text-lg">Consumer Finance</span>
                        </div>
                        <div className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300">
                            <div className="hover:-translate-y-2 transition-transform duration-300">
                                <MonitorSmartphone size={50} />
                            </div>
                            <span className="font-semibold text-lg">Matm</span>
                        </div>
                    </div>




                    <div className="px-6 py-8 space-y-6">
                        <p className="text-gray-700 leading-relaxed">
                            Welcome to our B2B services platform. By accessing or using our
                            services, you agree to comply with and be bound by the following
                            terms and conditions.
                        </p>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">
                                1. Eligibility
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                Only verified businesses and registered users are allowed to
                                activate and use our B2B services. You must provide valid
                                documentation and comply with applicable laws.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">2. Usage</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Services must only be used for lawful and authorized purposes.
                                Any misuse may result in account suspension or termination.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">3. Charges</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Certain services may involve activation charges or usage fees.
                                These charges will be clearly communicated before activation.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">
                                4. Data Privacy
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We are committed to protecting your data. All user data is
                                handled securely and in compliance with applicable privacy laws.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">
                                5. Changes to Terms
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update these terms at any time. Continued use of the
                                services after changes implies your agreement to the updated
                                terms.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-blue-600">
                                6. Termination
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right to terminate or suspend access to services
                                immediately, without prior notice, for any violation of these
                                terms.
                            </p>
                        </div>
                    </div>

                    {/* Action Section: Checkbox and Buttons */}
                    <div className="px-6 py-6 border-t border-gray-200 bg-gray-50 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <input
                                type="checkbox"
                                id="acceptTerms"
                                className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={accepted}
                                onChange={handleAccept}
                            />
                            <label htmlFor="acceptTerms" className="text-gray-700">
                                I have read and agree to the Terms & Conditions
                            </label>
                        </div>

                        <div className="space-x-4">
                            <button
                                onClick={handleAccept}
                                disabled={accepted}
                                className={`px-5 py-2 text-sm font-semibold rounded-md focus:outline-none ${accepted ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
                                    }`}
                            >
                                Accept
                            </button>

                            <button
                                onClick={handleDecline}
                                className="px-5 py-2 text-sm font-semibold rounded-md bg-red-500 hover:bg-red-600 text-white focus:outline-none"
                            >
                                Decline
                            </button>
                        </div>
                    </div>

                    {/* <div className="px-6 py-4 bg-gray-100 text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} Your Company Name. All rights
                        reserved.
                    </div> */}
                </div>
            </div>
        </div >
    );
};

export default TermsAndConditions;