import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserLoanpage = () => {
    const [loanTypes, setLoanTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await fetch("https://uat-api.evolutosolution.com/v1/loan/getLoanTypes");
                const data = await response.json();
                if (data.success) {
                    setLoanTypes(data.data);
                } else {
                    setError("Failed to fetch loan types");
                }
            } catch (err) {
                setError("Error fetching loan types");
            } finally {
                setLoading(false);
            }
        };

        fetchLoanTypes();
    }, []);

    if (loading) return <div className="text-center mt-24">Loading...</div>;
    if (error) return <div className="text-center mt-24 text-red-500">{error}</div>;

    return (
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center gap-6 p-5 mt-24">
            {loanTypes.map((loan) => (
                <div
                    key={loan.id}
                    className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 bg-white shadow-md rounded-2xl text-center hover:scale-105 hover:bg-blue-500 transition"
                >
                    <div className="h-48 overflow-hidden rounded-t-2xl">
                        <img
                            src={`/${loan.name.replace(/\s+/g, '').toLowerCase()}.png`}
                            alt={`${loan.name}-image`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h1 className="text-xl mt-3 text-black">{loan.name}</h1>
                    <button
                        className="mt-3 mb-3 px-5 py-1 bg-blue-600 text-white rounded-lg hover:bg-white hover:text-blue-600 border"
                        onClick={() => navigate(`/UserLoanInput`, { state: { loan_type_id: loan.id } })}
                    >
                        Click Here
                    </button>
                </div>
            ))}
        </div>
    );
};

export default UserLoanpage;