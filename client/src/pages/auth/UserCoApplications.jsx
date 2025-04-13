import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserCoApplications = () => {
    const [formData, setFormData] = useState({
        application_id: "SLA00779",
        name: "",
        relationship: "",
        email: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        address_line3: "",
        pincode: "",
        state: "",
        city: "",
        landmark: "",
        alternate_no: "",
        occupation: "",
        ref_code: "OUI202590898"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/user-co-app/save", formData);
            alert("Co-Applicant info saved successfully!");
            console.log(res.data);
        } catch (err) {
            console.error("Error submitting:", err.message);
            alert("Submission failed!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-20 mb-20">
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    placeholder="Name"
                    id="name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:</label>
                <input
                    type="text"
                    name="relationship"
                    onChange={handleChange}
                    placeholder="Relationship"
                    id="relationship"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email"
                    id="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                <input
                    type="tel"
                    name="phone"
                    onChange={handleChange}
                    placeholder="Phone"
                    id="phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address_line1" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1:</label>
                <input
                    type="text"
                    name="address_line1"
                    onChange={handleChange}
                    placeholder="Address Line 1"
                    id="address_line1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address_line2" className="block text-gray-700 text-sm font-bold mb-2">Address Line 2:</label>
                <input
                    type="text"
                    name="address_line2"
                    onChange={handleChange}
                    placeholder="Address Line 2"
                    id="address_line2"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="address_line3" className="block text-gray-700 text-sm font-bold mb-2">Address Line 3:</label>
                <input
                    type="text"
                    name="address_line3"
                    onChange={handleChange}
                    placeholder="Address Line 3"
                    id="address_line3"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode:</label>
                <input
                    type="text"
                    name="pincode"
                    onChange={handleChange}
                    placeholder="Pincode"
                    id="pincode"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
                <input
                    type="text"
                    name="state"
                    onChange={handleChange}
                    placeholder="State"
                    id="state"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                <input
                    type="text"
                    name="city"
                    onChange={handleChange}
                    placeholder="City"
                    id="city"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="landmark" className="block text-gray-700 text-sm font-bold mb-2">Landmark:</label>
                <input
                    type="text"
                    name="landmark"
                    onChange={handleChange}
                    placeholder="Landmark"
                    id="landmark"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="alternate_no" className="block text-gray-700 text-sm font-bold mb-2">Alternate No:</label>
                <input
                    type="tel"
                    name="alternate_no"
                    onChange={handleChange}
                    placeholder="Alternate No"
                    id="alternate_no"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="occupation" className="block text-gray-700 text-sm font-bold mb-2">Occupation:</label>
                <input
                    type="text"
                    name="occupation"
                    onChange={handleChange}
                    placeholder="Occupation"
                    id="occupation"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>

            <Link to="/UserSaveRefrences"><button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Save and Continue
            </button>
            </Link>
        </form>
    );
};

export default UserCoApplications;
