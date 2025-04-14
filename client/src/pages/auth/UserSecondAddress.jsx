import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UserSecondAddress = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        application_id: "",
        residential_status: "Resident",
        residence_type: "1",
        years_of_residence: "3",
        monthly_rent: "5000",
        ref_code: "OUI202590898",
        addresses: {
            present_address: {
                address_line1: "",
                address_line2: "",
                address_line3: "",
                pincode: "",
                state: "",
                city: "",
                landmark: "",
                email: "",
                phone: ""
            },
            permanent_address: {
                address_line1: "",
                address_line2: "",
                address_line3: "",
                pincode: "",
                state: "",
                city: "",
                landmark: "",
                email: "",
                phone: ""
            },
            office_address: {
                address_line1: "",
                address_line2: "",
                address_line3: "",
                pincode: "",
                state: "",
                city: "",
                landmark: "",
                email: "",
                phone: ""
            }
        }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let applicationId = "";
    
        // First check if it was passed via navigation state
        if (location.state?.applicationId) {
          applicationId = location.state.applicationId;
        }
        // If not, try to get it from localStorage
        else {
          applicationId = localStorage.getItem("applicationId") || "";
        }
    
        setFormData((prev) => ({
          ...prev,
          application_id: applicationId,
        }));

        // If we have an application ID, fetch any existing address data
        if (applicationId) {
            fetchExistingData(applicationId);
        }
    }, [location]);
    
    const fetchExistingData = async (applicationId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user-second-address/${applicationId}`);
            if (response.data) {
                setFormData(response.data);
            }
        } catch (error) {
            // If 404, it's a new application - no need to show error
            if (error.response && error.response.status !== 404) {
                console.error("Error fetching existing data:", error);
            }
        }
    };

    const handleChange = (e, addressType = null, field = null) => {
        if (addressType) {
            setFormData(prev => ({
                ...prev,
                addresses: {
                    ...prev.addresses,
                    [addressType]: {
                        ...prev.addresses[addressType],
                        [field]: e.target.value
                    }
                }
            }));
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        
        try {
            const res = await axios.post("http://localhost:3001/api/user-second-address/save", formData);
            alert("Address information saved successfully!");
            console.log(res.data);
            
            // Navigate programmatically after successful submission
            navigate("/UserCoApplications", { 
                state: { applicationId: formData.application_id } 
            });
        } catch (err) {
            console.error("Submit error:", err.message);
            alert("Error submitting form: " + (err.response?.data?.error || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto mt-8 p-6 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Second Address Form</h2>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="application_id"
              >
                Application ID
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="application_id"
                name="application_id"
                type="text"
                value={formData.application_id}
                placeholder="Application ID"
                onChange={handleChange}
                required
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Present Address</h3>
            <label htmlFor="present_address_line1" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1:</label>
            <input
                type="text"
                id="present_address_line1"
                placeholder="Line 1"
                value={formData.addresses.present_address.address_line1}
                onChange={(e) => handleChange(e, "present_address", "address_line1")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_line2" className="block text-gray-700 text-sm font-bold mb-2">Address Line 2:</label>
            <input
                type="text"
                id="present_address_line2"
                placeholder="Line 2"
                value={formData.addresses.present_address.address_line2}
                onChange={(e) => handleChange(e, "present_address", "address_line2")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_line3" className="block text-gray-700 text-sm font-bold mb-2">Address Line 3:</label>
            <input
                type="text"
                id="present_address_line3"
                placeholder="Line 3"
                value={formData.addresses.present_address.address_line3}
                onChange={(e) => handleChange(e, "present_address", "address_line3")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode:</label>
            <input
                type="text"
                id="present_address_pincode"
                placeholder="Pincode"
                value={formData.addresses.present_address.pincode}
                onChange={(e) => handleChange(e, "present_address", "pincode")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
            <input
                type="text"
                id="present_address_city"
                placeholder="City"
                value={formData.addresses.present_address.city}
                onChange={(e) => handleChange(e, "present_address", "city")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
            <input
                type="text"
                id="present_address_state"
                placeholder="State"
                value={formData.addresses.present_address.state}
                onChange={(e) => handleChange(e, "present_address", "state")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_landmark" className="block text-gray-700 text-sm font-bold mb-2">Landmark:</label>
            <input
                type="text"
                id="present_address_landmark"
                placeholder="Landmark"
                value={formData.addresses.present_address.landmark}
                onChange={(e) => handleChange(e, "present_address", "landmark")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
                type="text"
                id="present_address_email"
                placeholder="Email"
                value={formData.addresses.present_address.email}
                onChange={(e) => handleChange(e, "present_address", "email")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="present_address_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
            <input
                type="text"
                id="present_address_phone"
                placeholder="Phone"
                value={formData.addresses.present_address.phone}
                onChange={(e) => handleChange(e, "present_address", "phone")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Permanent Address</h3>
            <label htmlFor="permanent_address_line1" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1:</label>
            <input
                type="text"
                id="permanent_address_line1"
                placeholder="Line 1"
                value={formData.addresses.permanent_address.address_line1}
                onChange={(e) => handleChange(e, "permanent_address", "address_line1")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_line2" className="block text-gray-700 text-sm font-bold mb-2">Address Line 2:</label>
            <input
                type="text"
                id="permanent_address_line2"
                placeholder="Line 2"
                value={formData.addresses.permanent_address.address_line2}
                onChange={(e) => handleChange(e, "permanent_address", "address_line2")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_line3" className="block text-gray-700 text-sm font-bold mb-2">Address Line 3:</label>
            <input
                type="text"
                id="permanent_address_line3"
                placeholder="Line 3"
                value={formData.addresses.permanent_address.address_line3}
                onChange={(e) => handleChange(e, "permanent_address", "address_line3")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode:</label>
            <input
                type="text"
                id="permanent_address_pincode"
                placeholder="Pincode"
                value={formData.addresses.permanent_address.pincode}
                onChange={(e) => handleChange(e, "permanent_address", "pincode")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
            <input
                type="text"
                id="permanent_address_city"
                placeholder="City"
                value={formData.addresses.permanent_address.city}
                onChange={(e) => handleChange(e, "permanent_address", "city")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
            <input
                type="text"
                id="permanent_address_state"
                placeholder="State"
                value={formData.addresses.permanent_address.state}
                onChange={(e) => handleChange(e, "permanent_address", "state")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_landmark" className="block text-gray-700 text-sm font-bold mb-2">Landmark:</label>
            <input
                type="text"
                id="permanent_address_landmark"
                placeholder="Landmark"
                value={formData.addresses.permanent_address.landmark}
                onChange={(e) => handleChange(e, "permanent_address", "landmark")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
                type="text"
                id="permanent_address_email"
                placeholder="Email"
                value={formData.addresses.permanent_address.email}
                onChange={(e) => handleChange(e, "permanent_address", "email")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="permanent_address_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
            <input
                type="text"
                id="permanent_address_phone"
                placeholder="Phone"
                value={formData.addresses.permanent_address.phone}
                onChange={(e) => handleChange(e, "permanent_address", "phone")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">Office Address</h3>

            <label htmlFor="office_address_line1" className="block text-gray-700 text-sm font-bold mb-2">Address Line 1:</label>
            <input
                type="text"
                id="office_address_line1"
                placeholder="Line 1"
                value={formData.addresses.office_address.address_line1}
                onChange={(e) => handleChange(e, "office_address", "address_line1")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_line2" className="block text-gray-700 text-sm font-bold mb-2">Address Line 2:</label>
            <input
                type="text"
                id="office_address_line2"
                placeholder="Line 2"
                value={formData.addresses.office_address.address_line2}
                onChange={(e) => handleChange(e, "office_address", "address_line2")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_line3" className="block text-gray-700 text-sm font-bold mb-2">Address Line 3:</label>
            <input
                type="text"
                id="office_address_line3"
                placeholder="Line 3"
                value={formData.addresses.office_address.address_line3}
                onChange={(e) => handleChange(e, "office_address", "address_line3")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_pincode" className="block text-gray-700 text-sm font-bold mb-2">Pincode:</label>
            <input
                type="text"
                id="office_address_pincode"
                placeholder="Pincode"
                value={formData.addresses.office_address.pincode}
                onChange={(e) => handleChange(e, "office_address", "pincode")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_city" className="block text-gray-700 text-sm font-bold mb-2">City:</label>
            <input
                type="text"
                id="office_address_city"
                placeholder="City"
                value={formData.addresses.office_address.city}
                onChange={(e) => handleChange(e, "office_address", "city")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_state" className="block text-gray-700 text-sm font-bold mb-2">State:</label>
            <input
                type="text"
                id="office_address_state"
                placeholder="State"
                value={formData.addresses.office_address.state}
                onChange={(e) => handleChange(e, "office_address", "state")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_landmark" className="block text-gray-700 text-sm font-bold mb-2">Landmark:</label>
            <input
                type="text"
                id="office_address_landmark"
                placeholder="Landmark"
                value={formData.addresses.office_address.landmark}
                onChange={(e) => handleChange(e, "office_address", "landmark")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
            <input
                type="text"
                id="office_address_email"
                placeholder="Email"
                value={formData.addresses.office_address.email}
                onChange={(e) => handleChange(e, "office_address", "email")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />
            <label htmlFor="office_address_phone" className="block text-gray-700 text-sm font-bold mb-2">Phone:</label>
            <input
                type="text"
                id="office_address_phone"
                placeholder="Phone"
                value={formData.addresses.office_address.phone}
                onChange={(e) => handleChange(e, "office_address", "phone")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
            />

             <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Save and Continue
            </button>
            
        </form>
    );
};

export default UserSecondAddress;