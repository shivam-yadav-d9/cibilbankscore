import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UserSaveRefrences = () => {
    const [formData, setFormData] = useState({
        application_id: "SLA00779",
        ref_code: "OUI202590898",
        reference1: {
            name: "",
            relationship: "",
            email: "",
            phone: "",
            address: ""
        },
        reference2: {
            name: "",
            relationship: "",
            email: "",
            phone: "",
            address: ""
        }
    });

    const handleChange = (e, refType, field) => {
        setFormData(prev => ({
            ...prev,
            [refType]: {
                ...prev[refType],
                [field]: e.target.value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3001/api/user-references/save", formData);
            alert("References submitted successfully!");
            console.log(res.data);
        } catch (err) {
            console.error("Error submitting:", err.message);
            alert("Error submitting references");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
            {/* Reference 1 Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Reference 1</h2>

                <div className="mb-4">
                    <label htmlFor="ref1_name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        id="ref1_name"
                        placeholder="Name"
                        onChange={e => handleChange(e, "reference1", "name")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref1_relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:</label>
                    <input
                        type="text"
                        id="ref1_relationship"
                        placeholder="Relationship"
                        onChange={e => handleChange(e, "reference1", "relationship")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref1_email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="ref1_email"
                        placeholder="Email"
                        onChange={e => handleChange(e, "reference1", "email")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref1_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                    <input
                        type="text"
                        id="ref1_phone"
                        placeholder="Phone"
                        onChange={e => handleChange(e, "reference1", "phone")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref1_address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                    <input
                        type="text"
                        id="ref1_address"
                        placeholder="Address"
                        onChange={e => handleChange(e, "reference1", "address")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            {/* Reference 2 Section */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Reference 2</h2>

                <div className="mb-4">
                    <label htmlFor="ref2_name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        id="ref2_name"
                        placeholder="Name"
                        onChange={e => handleChange(e, "reference2", "name")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref2_relationship" className="block text-gray-700 text-sm font-bold mb-2">Relationship:</label>
                    <input
                        type="text"
                        id="ref2_relationship"
                        placeholder="Relationship"
                        onChange={e => handleChange(e, "reference2", "relationship")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref2_email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="ref2_email"
                        placeholder="Email"
                        onChange={e => handleChange(e, "reference2", "email")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref2_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
                    <input
                        type="text"
                        id="ref2_phone"
                        placeholder="Phone"
                        onChange={e => handleChange(e, "reference2", "phone")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="ref2_address" className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                    <input
                        type="text"
                        id="ref2_address"
                        placeholder="Address"
                        onChange={e => handleChange(e, "reference2", "address")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            <Link to="/UserPreviousData"> <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Save and continue
            </button>
            </Link>
        </form>
    );
};

export default UserSaveRefrences;
