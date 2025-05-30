import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

// Lucide Icons
import {
  Banknote, CreditCard, ReceiptText, ShieldCheck, PiggyBank,
  Coins, Fingerprint, SendHorizontal, Building, Landmark,
  Gavel, UserPlus, FileText, Truck, HeartPulse, Pill
} from "lucide-react";

const B2BDashboard = () => {
  const [agentData, setAgentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(null);
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      console.warn("No userId found in location state");
      setLoading(false);
      return;
    }

    const fetchAgentStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agent/${userId}`
        );
        setAgentData(res.data);
        setIsApproved(res.data.status); // Should be "approved", "rejected", etc.
      } catch (err) {
        console.error("Error fetching agent data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgentStatus();
  }, [userId]);

  return (
    <>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-12 gap-5 flex-col-reverse md:flex-row text-center md:text-left mt-16">
        <div className="left">
          <h1 className="text-2xl md:text-5xl text-crimson">
            Our aim is to provide <span className="font-bold text-blue-500">Business</span> <br />
            with everything they need to manage their finances in one place
          </h1>
          <p className="text-gray-800 text-base md:text-lg my-4 pt-2">
            B2B banking helps businesses grow by bringing a whole new perspective to payment methods. It also accelerates international transaction processes.
          </p>
          <button className="text-white bg-crimson py-2 px-4 text-base md:text-lg rounded hover:bg-red-700 transition mt-4">
            Get Start
          </button>
        </div>
        <div className="right mt-5 md:mt-0">
          <img src="/b2bimage.png" alt="Hero Image" className="max-w-full w-full h-auto" />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 my-8">
        <h2 className="text-center font-bold text-crimson text-2xl md:text-4xl lg:text-5xl mb-6">
          B2B Banking Services in DBNpe Pvt. Ltd
        </h2>

        <div className="w-full min-h-screen px-6">
          <div className="flex items-center justify-center p-10">
            {
              loading ? (
                <p className="text-blue-500 font-medium">Loading...</p>
              ) : !userId ? (
                <p className="text-red-500 font-semibold">User ID is missing. Please login again.</p>
              ) : typeof isApproved === "string" && isApproved.toLowerCase() === "approved" ? (
                <Link to="/TermsAndConditions">
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                    Click here! to Use Services
                  </button>
                </Link>
              ) : typeof isApproved === "string" && isApproved.toLowerCase() === "rejected" ? (
                <p className="text-red-600 font-semibold">Your application is being reviewed. Access will be granted once approved 😊 </p>
              ) : (
                <p className="text-yellow-600 font-semibold">Your account is under review.</p>
              )
            }
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-screen-xl mx-auto">
            {[
              { icon: <Banknote size={50} />, label: "Loan" },
              { icon: <CreditCard size={50} />, label: "Credit Card" },
              { icon: <ReceiptText size={50} />, label: "Bill Payment" },
              { icon: <ShieldCheck size={50} />, label: "Insurance" },
              { icon: <PiggyBank size={50} />, label: "FD (Fixed Deposit)" },
              { icon: <Coins size={50} />, label: "RD (Recurring Deposit)" },
              { icon: <Fingerprint size={50} />, label: "AEPS" },
              { icon: <SendHorizontal size={50} />, label: "DMT" },
              { icon: <Building size={50} />, label: "IMPS/RTGS" },
              { icon: <Landmark size={50} />, label: "Govt Service" },
              { icon: <Gavel size={50} />, label: "Legal Services" },
              { icon: <UserPlus size={50} />, label: "Apply Bank BC" },
              { icon: <FileText size={50} />, label: "Account Opening" },
              { icon: <Truck size={50} />, label: "Courier Services" },
              { icon: <HeartPulse size={50} />, label: "E-Health" },
              { icon: <Pill size={50} />, label: "Medicine" },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-sky-950 text-white p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-lg hover:scale-105 transition duration-300"
              >
                <div className="hover:-translate-y-2 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="font-semibold text-lg">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default B2BDashboard;