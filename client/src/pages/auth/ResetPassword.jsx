import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link.");
    }
  }, [token]);


  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setLoading(false);
      setMessage(data.message);

      if (data.message === "Password reset successfully") {
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-md w-80">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        <input
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-500"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading || !token}
        >
          {loading ? "Reseting..." : "Reset Password"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message === "Password reset successfully"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}