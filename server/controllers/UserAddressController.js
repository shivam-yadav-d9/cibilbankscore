import axios from "axios";

export const saveUserAddress = async (req, res) => {
  try {
    console.log("Incoming data:", req.body); // 👀 Log incoming data

    const tokenRes = await axios.post("https://uat-api.evolutosolution.com/v1/authentication", {
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      ref_code: req.body.ref_code,
    });

    const token = tokenRes.data?.data?.token;
    console.log("Generated token:", token); // 👀 Log token

    if (!token) {
      return res.status(401).json({ success: false, message: "Token generation failed" });
    }

    const response = await axios.post(
      "https://uat-api.evolutosolution.com/v1/loan/saveApplicant",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const saved = await UserAddressModel.create(response.data.data);

    res.status(200).json({ success: true, data: saved });
  } catch (err) {
    console.error("❌ Save User Address Error:", err.response?.data || err.message); // 👀 Log actual error
    res.status(500).json({ success: false, message: err.message });
  }
};
