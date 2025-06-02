import express from 'express';
import multer from 'multer'; // Import multer
import documentController from '../controllers/documentController.js'; // Note the .js extension

const router = express.Router();

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define routes
router.get('/documents/:applicationId', documentController.getDocuments);

// Apply multer middleware specifically to the upload route
router.post('/documents/upload', upload.single('file'), documentController.uploadDocument);

router.get('/user-data/:applicationId', documentController.getUserBasicData);

router.post('/user-data/:applicationId', documentController.saveUserBasicData);

// Export the router
export default router;