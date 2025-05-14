import Application from "../models/Application.js";

// Get all applications for the logged-in user
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.userId }).sort({ created_at: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// Create a new application for the logged-in user
export const createApplication = async (req, res) => {
  try {
    const { bank_id, bank_name, loan_amount, documents } = req.body;
    const application = new Application({
      user: req.userId,
      bank_id,
      bank_name,
      loan_amount,
      documents
    });
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ message: "Failed to create application" });
  }
};

// Get a single application by ID (for the logged-in user)
export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, user: req.userId });
    if (!app) return res.status(404).json({ message: "Not found" });
    res.json(app);
  } catch (err) {
    res.status(400).json({ message: "Invalid request" });
  }
};