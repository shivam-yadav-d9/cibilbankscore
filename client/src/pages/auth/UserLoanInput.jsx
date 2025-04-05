import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const UserLoanInput= () => {
    const location = useLocation();
    const loanTypeId = location.state?.loan_type_id;

    const [formData, setFormData] = useState({
        ref_code: "OUI202590898",
        loan_type_id: loanTypeId,
        name: "",
        email: "",
        mobile: "",
        income_source: "1",
        income: "",
        pincode: "",
        dob: "",
        pan_no: "",
        aadhaar_no: "",
        cibil_score: "750",
        loan_amount: ""
    });

    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://uat-api.evolutosolution.com/v1/loan/checkEligibility", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (result.success) {
                setOffers(result.data);
            } else {
                setError("Failed to fetch eligible loans");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl mb-4 font-semibold text-center">Enter Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {[
                    { name: "name", type: "text" },
                    { name: "email", type: "email" },
                    { name: "mobile", type: "text" },
                    { name: "income", type: "number" },
                    { name: "pincode", type: "text" },
                    { name: "dob", type: "date" },
                    { name: "pan_no", type: "text" },
                    { name: "aadhaar_no", type: "text" },
                    { name: "loan_amount", type: "number" }
                ].map(({ name, type }) => (
                    <input
                        key={name}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={name.replace(/_/g, " ").toUpperCase()}
                        className="w-full p-2 border rounded"
                        required
                    />
                ))}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Check Eligibility
                </button>
            </form>

            {loading && <p className="mt-4 text-center">Checking...</p>}
            {error && <p className="mt-4 text-center text-red-500">{error}</p>}

            {offers.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-2 text-center">Eligible Loan Offers</h3>
                    <div className="space-y-4">
                        {offers.map((offer) => (
                            <div key={offer.id} className="p-4 border rounded shadow">
                                <p><strong>Bank:</strong> {offer.bank}</p>
                                <p><strong>Loan Amount:</strong> {offer.loan_amount}</p>
                                <p><strong>Tenure:</strong> {offer.tenure}</p>
                                <p><strong>Interest Rate:</strong> {offer.bank_interest_rate || "N/A"}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserLoanInput;
