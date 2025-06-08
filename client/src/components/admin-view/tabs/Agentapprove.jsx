import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentApprove = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const limit = 5; // Agents per page
  const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/agent`;

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get(apiUrl, { params });

      setAgents(response.data.agents);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchAgents();
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/approve/${id}`);
      alert("Agent approved successfully!");
      fetchAgents();
    } catch (err) {
      console.error("Error approving agent:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/SignupRoutes/reject/${id}`);
      alert("Agent rejected successfully!");
      fetchAgents();
    } catch (err) {
      console.error("Error rejecting agent:", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Agent Approval Panel</h2>

      {/* Date Filter UI */}
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

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

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Previous
            </button>
            <span className="px-4 py-1">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentApprove;
