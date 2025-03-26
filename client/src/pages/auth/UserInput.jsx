import { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserInput = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    pan: "",
    dob: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Store user details in localStorage
    const userData = {
      name: formData.name,
      email: formData.email,
    };

    localStorage.setItem("user", JSON.stringify(userData)); // Ensure Dashboard gets updated user
    localStorage.setItem("userInput", JSON.stringify(formData));

    // Navigate to loan page
    navigate("/loan");

    // Notify Dashboard to update
    window.dispatchEvent(new Event("storage"));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/15 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20 animate-fadeIn">
        <h2 className="text-2xl font-bold text-white text-center mb-8 drop-shadow-md">
          Please enter the following details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="text-white text-sm font-medium mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none placeholder-white/70 focus:ring-2 focus:ring-blue-300 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-white text-sm font-medium mb-1 block">
                Mobile No
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Enter mobile number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none placeholder-white/70 focus:ring-2 focus:ring-blue-300 transition-all"
                required
              />
            </div>

            <div className="relative">
              <label className="text-white text-sm font-medium mb-1 block">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                required
              />
            </div>
            

            <div className="relative">
              <label className="text-white text-sm font-medium mb-1 block">
                PAN Card
              </label>
              <input
                type="text"
                name="pan"
                placeholder="Enter PAN number"
                value={formData.pan}
                onChange={handleChange}
                className="w-full bg-white/20 backdrop-blur-md p-3 rounded-xl text-white outline-none placeholder-white/70 focus:ring-2 focus:ring-blue-300 transition-all"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-white text-blue-700 font-bold p-4 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 mt-8 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserInput;
