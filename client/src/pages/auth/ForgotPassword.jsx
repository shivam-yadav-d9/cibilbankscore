import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setLoading(false);
      setMessage(data.message);

      // Optionally, navigate back to the login page or display a confirmation page
      // navigate('/login');
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-md shadow-md w-80">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <input
          className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              message.includes("sent") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}