import document from "../models/saveDocs.js";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const saveLoanDocs = async (req, res) => {
  let tempFilePath = null;
  
  try {
    // Validate required fields
    const requiredFields = ["application_id", "doc_type", "doc_no"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Missing document file" });
    }

    tempFilePath = req.file.path;
    const { application_id, doc_type, doc_no } = req.body;

    // Find or create loan application
    let application = await document.findOne({ application_id });
    
    if (!application) {
      // Create new application if it doesn't exist
      application = new document({
        application_id,
        documents: []
      });
    }
    
    // Add document information to the application
    application.documents.push({
      doc_type,
      doc_no,
      file_name: req.file.originalname,
      uploaded_at: new Date()
    });
    
    await application.save();

    // Move file to permanent storage
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const permanentPath = path.join(uploadsDir, req.file.filename);
    if (tempFilePath !== permanentPath) {
      fs.renameSync(tempFilePath, permanentPath);
    }

    res.status(200).json({
      message: "Document uploaded successfully",
      application_id,
      doc_type,
      doc_no,
      file_name: req.file.originalname
    });

  } catch (error) {
    console.error("Error uploading document:", error);
    
    res.status(500).json({ 
      message: "Internal server error", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    // Clean up: Delete temp file if it exists and wasn't moved
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (unlinkError) {
        console.error("Error deleting temp file:", unlinkError);
      }
    }
  }
};