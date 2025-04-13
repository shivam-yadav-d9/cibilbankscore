import React, { useState } from "react";
import axios from "axios";

const UserPreviousData = () => {
    const [formData, setFormData] = useState({
        ref_code: "OUI202590898",
        application_id: "SLA00779",
        loan_data: [
            {
                loan_account_no: "",
                loan_year: "",
                loan_amount: "",
                emi_amount: "",
                product: "",
                bank_name: ""
            }
        ]
    });

    const handleChange = (index, field, value) => {
        const updatedLoanData = [...formData.loan_data];
        updatedLoanData[index][field] = value;
        setFormData({ ...formData, loan_data: updatedLoanData });
    };

    const addLoan = () => {
        setFormData({
            ...formData,
            loan_data: [...formData.loan_data, {
                loan_account_no: "",
                loan_year: "",
                loan_amount: "",
                emi_amount: "",
                product: "",
                bank_name: ""
            }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3001/api/user-previous-loans/save", formData);
            alert("Previous loans submitted successfully!");
            console.log(res.data);
        } catch (err) {
            console.error("Error submitting:", err.message);
            alert("Error submitting previous loan data");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md mt-20 mb-20">
            {formData.loan_data.map((loan, idx) => (
                <div key={idx} className="mb-6 p-4 border border-gray-300 rounded-md bg-white">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Loan {idx + 1}</h3>

                    <div className="mb-4">
                        <label htmlFor={`loan_account_no-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            Loan Account No:
                        </label>
                        <input
                            type="text"
                            id={`loan_account_no-${idx}`}
                            placeholder="Loan Account No"
                            value={loan.loan_account_no}
                            onChange={e => handleChange(idx, "loan_account_no", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor={`loan_year-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            Loan Year:
                        </label>
                        <input
                            type="number"
                            id={`loan_year-${idx}`}
                            placeholder="Loan Year"
                            value={loan.loan_year}
                            onChange={e => handleChange(idx, "loan_year", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor={`loan_amount-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            Loan Amount:
                        </label>
                        <input
                            type="number"
                            id={`loan_amount-${idx}`}
                            placeholder="Loan Amount"
                            value={loan.loan_amount}
                            onChange={e => handleChange(idx, "loan_amount", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor={`emi_amount-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            EMI Amount:
                        </label>
                        <input
                            type="number"
                            id={`emi_amount-${idx}`}
                            placeholder="EMI Amount"
                            value={loan.emi_amount}
                            onChange={e => handleChange(idx, "emi_amount", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor={`product-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            Product:
                        </label>
                        <input
                            type="text"
                            id={`product-${idx}`}
                            placeholder="Product"
                            value={loan.product}
                            onChange={e => handleChange(idx, "product", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor={`bank_name-${idx}`} className="block text-gray-700 text-sm font-bold mb-2">
                            Bank Name:
                        </label>
                        <input
                            type="text"
                            id={`bank_name-${idx}`}
                            placeholder="Bank Name"
                            value={loan.bank_name}
                            onChange={e => handleChange(idx, "bank_name", e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                </div>
            ))}
            <div className="flex justify-between">
                <button type="button" onClick={addLoan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Another Loan
                </button>
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default UserPreviousData;
