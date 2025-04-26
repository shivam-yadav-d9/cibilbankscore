import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaMobile,
  FaHashtag,
  FaCalendarAlt,
  FaInfoCircle,
  FaMoneyBillWave,
  FaUniversity,
  FaIdCard,
  FaBriefcase,
} from "react-icons/fa";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      setError("User not found or email missing.");
      setLoading(false);
      return;
    }

    // Store user data from local storage
    setUserData(user);

    // If user is an agent, we don't need to fetch loan data
    if (user.userType === "business" || user.userType === "agent") {
      setLoading(false);
      return;
    }

    // Only fetch loan data for customer users
    axios
      .get(`http://localhost:3001/api/loan/get-by-email/${user.email}`)
      .then((res) => {
        setLoanData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loan data:", err);
        // For 404 errors, we'll just show the profile without loan data
        if (err.response && err.response.status === 404) {
          setLoading(false);
        } else {
          setError(err.response?.data?.message || "Failed to fetch loan data");
          setLoading(false);
        }
      });
  }, []);

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md w-full max-w-md">
          <strong className="font-semibold text-lg">Oops!</strong>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-ping"></div>
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-full"></div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col justify-start items-center py-10 bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 px-4 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl border border-gray-200">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold">My Profile</h2>
        </div>

        {/* User Basic Info - Always shown */}
        <div className="px-6 py-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Name", value: userData?.name || userData?.fullName || userData?.username || "N/A", icon: <FaUser /> },
              { label: "Email", value: userData?.email || "N/A", icon: <FaEnvelope /> },
              { label: "User Type", value: userData?.userType || "N/A", icon: <FaIdCard /> },
              { label: "Mobile", value: userData?.mobile || userData?.phone || "N/A", icon: <FaMobile /> },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-indigo-600 text-xl">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Information - Only shown for customers who have loan data */}
        {loanData && userData?.userType === "customer" && (
          <div className="px-6 py-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Loan Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  label: "Application ID",
                  value: loanData.application_id || "N/A",
                  icon: <FaHashtag />,
                },
                {
                  label: "Date of Birth",
                  value: loanData.dob
                    ? new Date(loanData.dob).toLocaleDateString()
                    : "N/A",
                  icon: <FaCalendarAlt />,
                },
                {
                  label: "Status",
                  value: loanData.status || "Pending",
                  icon: <FaInfoCircle />,
                },
                {
                  label: "Loan Amount",
                  value: loanData.loan_amount
                    ? `₹${loanData.loan_amount}`
                    : "N/A",
                  icon: <FaMoneyBillWave />,
                },
                {
                  label: "Income Source",
                  value: loanData.income_source || "N/A",
                  icon: <FaBriefcase />,
                },
                {
                  label: "Monthly Income",
                  value: loanData.monthly_income
                    ? `₹${loanData.monthly_income}`
                    : "N/A",
                  icon: <FaMoneyBillWave />,
                },
                {
                  label: "Preferred Banks",
                  value:
                    loanData.preferred_banks && loanData.preferred_banks.length
                      ? loanData.preferred_banks.join(", ")
                      : "Not Assigned",
                  icon: <FaUniversity />,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div className="text-indigo-600 text-xl">{item.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{item.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message when no loan data is found for customers */}
        {userData?.userType === "customer" && !loanData && (
          <div className="px-6 py-8 text-center text-gray-500 text-lg border-t border-gray-200">
            No loan data found for your profile. You can apply for a loan from the dashboard.
          </div>
        )}

        {/* Message for agents/business users */}
        {(userData?.userType === "business" || userData?.userType === "agent") && (
          <div className="px-6 py-8 text-center text-gray-500 border-t border-gray-200">
            <p className="text-lg">Welcome to your agent profile!</p>
            <p className="mt-2">You can manage your clients and applications from the business dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;