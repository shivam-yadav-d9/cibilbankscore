import React, { useEffect, useState } from "react";
import axios from "axios";

const DashboardContent = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://cibilbankscore-server-gamma.vercel.app/dashboard/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchProfiles = async () => {
      try {
        const response = await axios.get("https://cibilbankscore-server-gamma.vercel.app/dashboard/profiles");
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchUsers();
    fetchProfiles();
  }, []);

  return (
    <div className="p-6">
      {/* Registered Users Section */}
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">All Registered Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">📧 {user.email}</p>
          </div>
        ))}
      </div>

      {/* Profile Users Section */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-green-700">All Profile Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
            <p className="text-gray-600">📧 {profile.email}</p>
            <p className="text-gray-600">📞 {profile.phoneNumber}</p>
            <p className="text-gray-600">🆔 PAN: {profile.pan}</p>
            <p className="text-gray-600">🆔 Aadhar: {profile.aadhar}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardContent;
