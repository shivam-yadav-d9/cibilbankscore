import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
  FaMapMarkerAlt,
  FaBuilding
} from "react-icons/fa";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState(null);

  const [loanStatus, setLoanStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      setError("User not found or email missing.");
      setLoading(false);
      return;
    }

    console.log("User data from localStorage:", user); // Debug log
    setUserData(user);

    // If user is an agent/business, fetch agent details
    if (user.userType === "business" || user.userType === "agent") {
      // If you have a specific endpoint for agent details, use that instead
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/agent/profile/${user._id || user.id}`)
        .then(res => {
          console.log("Agent details:", res.data); // Debug log
          setAgentDetails(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Could not fetch agent details:", err);
          // Even if we can't get agent details, we still show the basic profile
          setLoading(false);
        });
      return;
    }

    // Only fetch loan data for customer users
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/loan/get-by-email/${user.email}`)
      .then((res) => {
        setLoanData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loan data:", err);
        // For 404 errors, we'll just show the profile without loan data
        if (err.response && err.response.status === 404) {
          setLoanData(null); // Explicitly set loanData to null
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

  // Enhanced function to get user's phone/mobile number from various possible properties
  const getUserPhone = () => {
    // Check userData first (from localStorage)
    if (userData) {
      // Direct properties on userData
      if (userData.phone) return userData.phone;
      if (userData.mobile) return userData.mobile;
      if (userData.phoneNumber) return userData.phoneNumber;
      if (userData.mobileNumber) return userData.mobileNumber;
      if (userData.contactNumber) return userData.contactNumber;

      // If nested within contact object
      if (userData.contact && userData.contact.phone) return userData.contact.phone;
      if (userData.contact && userData.contact.mobile) return userData.contact.mobile;
    }

    // Then check in agentDetails from API
    if (agentDetails) {
      // Direct properties on agentDetails
      if (agentDetails.phone) return agentDetails.phone;
      if (agentDetails.mobile) return agentDetails.mobile;
      if (agentDetails.phoneNumber) return agentDetails.phoneNumber;
      if (agentDetails.mobileNumber) return agentDetails.mobileNumber;
      if (agentDetails.contactNumber) return agentDetails.contactNumber;

      // If nested within contact object
      if (agentDetails.contact && agentDetails.contact.phone) return agentDetails.contact.phone;
      if (agentDetails.contact && agentDetails.contact.mobile) return agentDetails.contact.mobile;
    }

    return "N/A";
  };

  // Enhanced function to get company name from various possible properties
  const getCompanyName = () => {
    if (agentDetails) {
      const companyFields = ['company', 'companyName', 'businessName', 'agencyName', 'organization', 'firm'];
      for (const field of companyFields) {
        if (agentDetails[field]) return agentDetails[field];
      }

      // If nested within business or company object
      if (agentDetails.business && agentDetails.business.name) return agentDetails.business.name;
      if (agentDetails.company && agentDetails.company.name) return agentDetails.company.name;
    }

    // Then check in userData
    const userCompanyFields = ['company', 'companyName', 'businessName', 'agencyName', 'organization', 'firm'];
    for (const field of userCompanyFields) {
      if (userData[field]) return userData[field];
    }

    // Check if nested
    if (userData.business && userData.business.name) return userData.business.name;
    if (userData.company && userData.company.name) return userData.company.name;

    return "N/A";
  };

  const checkLoanStatus = async () => {
    if (!loanData || !loanData.application_id) {
      setStatusError("Loan Application ID not found.");
      return;
    }

    console.log("loanData:", loanData);
    console.log("loanData.application_id:", loanData.application_id);

    setStatusLoading(true);
    setStatusError("");
    setLoanStatus(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/loan/check-loan-status`,
        {
          loan_application_id: loanData.application_id,
        }
      );

      setLoanStatus(response.data.data);
    } catch (error) {
      console.error("Error checking loan status:", error);
      console.error("Full error response:", error.response); // Log the full error response
      setStatusError(error.response?.data?.message || "Something went wrong");
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center py-10 bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 px-4 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full max-w-4xl border border-gray-200">
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold">My Profile</h2>
          <p className="text-indigo-200 mt-1">{userData?.userType === "business" || userData?.userType === "agent" ? "Agent Account" : "Customer Account"}</p>
        </div>

        {/* User Basic Info - Always shown */}
        <div className="px-6 py-8">

          <Link to="/dashboard"><button className="text-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg shadow-md transition duration-300 mb-4">
            Your Dashboard
          </button>
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                label: "Name",
                value: userData?.name || userData?.fullName || userData?.username || agentDetails?.name || agentDetails?.fullName || "N/A",
                icon: <FaUser />
              },
              {
                label: "Email",
                value: userData?.email || agentDetails?.email || "N/A",
                icon: <FaEnvelope />
              },
              {
                label: "User Type",
                value: (userData?.userType === "business" ? "Agent" : userData?.userType) || "N/A",
                icon: <FaIdCard />
              },
              {
                label: "Phone Number",
                value: getUserPhone(), // Use the getUserPhone function instead of direct properties
                icon: <FaMobile />
              },
              // Add more fields for agent if needed
              ...(userData?.userType === "business" || userData?.userType === "agent" ? [
                {
                  label: "Company",
                  value: getCompanyName(),
                  icon: <FaBuilding />
                },
                {
                  label: "Location",
                  value: agentDetails?.location || userData?.location || agentDetails?.city || userData?.city ||
                    (agentDetails?.address ? (typeof agentDetails.address === 'string' ? agentDetails.address :
                      `${agentDetails.address.city || ''} ${agentDetails.address.state || ''}`.trim()) : "N/A"),
                  icon: <FaMapMarkerAlt />
                }
              ] : [])
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
        <div className="mt-6 text-center">
          {loanData && ( // Conditionally render the button
            <button
              onClick={checkLoanStatus}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
            >
              Check Loan Status
            </button>
          )}

          {statusLoading && <p className="text-blue-600 mt-2">Checking loan status...</p>}
          {statusError && <p className="text-red-600 mt-2">{statusError}</p>}

          {loanStatus && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded text-green-800 text-left max-w-xl mx-auto">
              <h4 className="font-bold text-lg mb-2">Loan Status:</h4>
              <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(loanStatus, null, 2)}</pre>
            </div>
          )}
        </div>

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
          <div className="px-6 py-8 text-center border-t border-gray-200">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-lg font-medium text-indigo-700">Welcome to your agent profile!</p>
              <p className="mt-2 text-indigo-600">You can manage your clients and applications from the business dashboard.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;