import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { saveLoanDocs } from "../controllers/saveDocsController.js";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Create upload middleware with file filtering
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max file size
  },
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedFileTypes.includes(ext)) {
      return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG, PNG and PDF files are allowed"));
  },
}).single("doc_file");

// Custom error handling middleware for multer
const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }
    // Everything went fine
    next();
  });
};

// POST endpoint to save loan documents
router.post("/save", handleUpload, saveLoanDocs);

export default router;
