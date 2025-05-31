import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentApprove = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agents`;

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await axios.get(apiUrl);
        setAgents(response.data?.data?.agents || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
        setAgents([]); // fallback to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);


  const handleApprove = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/approve/${id}`);
      alert("Agent approved successfully!");
      const updated = agents.map(agent =>
        agent._id === id ? { ...agent, status: 'approved' } : agent
      );
      setAgents(updated);
    } catch (err) {
      console.error("Error approving agent:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/reject/${id}`);
      alert("Agent rejected successfully!");
      const updated = agents.map(agent =>
        agent._id === id ? { ...agent, status: 'rejected' } : agent
      );
      setAgents(updated);
    } catch (err) {
      console.error("Error rejecting agent:", err);
    }
  };



  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Agent Approval Panel</h2>

      {loading ? (
        <p className="text-center">Loading agents...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left text-sm">
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent._id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-4 py-3">{agent.fullName}</td>
                  <td className="px-4 py-3">{agent.companyName}</td>
                  <td className="px-4 py-3">{agent.email}</td>
                  <td className="px-4 py-3">{agent.phone}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleApprove(agent._id)}
                      className={`bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded ${agent.status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={agent.status === 'approved'}
                    >
                      {agent.status === 'approved' ? "Approved" : "Approve"}
                    </button>

                    <button
                      onClick={() => handleReject(agent._id)}
                      className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded ${agent.status === 'rejected' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={agent.status === 'rejected'}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {agents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No agents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentApprove;