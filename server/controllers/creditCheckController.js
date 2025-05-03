import axios from "axios";
import CreditCheck from "../models/CreditCheck.js";

export const checkCredit = async (req, res) => {
  try {
    const { fname, lname, phone, pan_no, dob, ref_code } = req.body;

    // 1. Get the token from the authentication endpoint
    const authResponse = await axios.post(
      "https://uat-api.evolutosolution.com/v1/authentication",
      {},
      {
        headers: {
          source: "web",
          package: "10.0.2.215",
          outletid: "OUI202590898",
          Authorization: "Basic NDdlM2I4ODk1NDAwM2NhYjNlNGY1MThjNTk3NjUxYmU3M2QyZDk2NmE0MWY4YWVjN2YyNjk3YjcyNTkwZDZjNTpCTlJxOFJNQzM2NkNselUzWDVmdFA4NXlLSW5NL3RERWI4Z3l6d3YxL3dtZlZ2cEQ3R1RGNUxySVJoU3kxUEVGOTdZWHUzbnNKekMzVWhjclVsMlRMQVFNWXJtMFFHbFEwZGFteGUyTEVQVDhzYTVHSUZHZE1WUnJDOHZPRHRCU3Z0K3BOaktudWlvZFhRSHd1emExTXRxSzZFODZtUng4SzNBY0FBTzVGeWtHbDR0ZnplOXllSzNmR21nRlpKM3o="
        }
      }
    );

    const token = authResponse.data?.data?.token;
    if (!token) {
      return res.status(500).json({ success: false, message: "Failed to fetch API token" });
    }

    // 2. Call the credit score API with the dynamic token
    const creditResponse = await axios.post(
      "https://uat-api.evolutosolution.com/v1/loan/checkCreditScore",
      {
        ref_code,
        fname,
        lname,
        phone,
        pan_no,
        dob
      },
      {
        headers: {
          token,
          "Content-Type": "application/json"
        }
      }
    );

    // 3. Save request and response to the database
    await CreditCheck.create({
      fname,
      lname,
      phone,
      pan_no,
      dob,
      ref_code,
      result: creditResponse.data
    });

    return res.json({ success: true, data: creditResponse.data });
  } catch (error) {
    // Save failed requests too, for audit
    await CreditCheck.create({
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      pan_no: req.body.pan_no,
      dob: req.body.dob,
      ref_code: req.body.ref_code,
      result: error.response?.data || { error: error.message }
    });

    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to check credit score";
    return res.status(500).json({ success: false, message });
  }
};