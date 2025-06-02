import documentModel from '../models/documentModel.js'; // Note the .js extension

const documentController = {
  /**
   * GET /api/documents/:applicationId
   * Fetches documents for a specific application ID.
   */
  getDocuments: (req, res) => {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
    }
    try {
      const docs = documentModel.findByApplicationId(applicationId);
      res.status(200).json(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
    }
  },

  /**
   * POST /api/documents/upload
   * Handles uploading a single document.
   * Requires 'file' field in form-data.
   * Also expects doc_type and doc_no in form-data.
   */
  uploadDocument: (req, res) => {
    const { applicationId, doc_type, doc_no } = req.body;
    const file = req.file; // Multer adds the file to req.file

    if (!applicationId || !doc_type || !file) {
      return res.status(400).json({ message: 'Application ID, document type, and file are required for upload' });
    }

    let file_data = null;
    if (file && file.buffer) {
        const mimeType = file.mimetype;
        const base64 = file.buffer.toString('base64');
        file_data = `data:${mimeType};base64,${base64}`;
    } else {
         return res.status(400).json({ message: 'File data is missing or corrupted' });
    }

    try {
      const newDocument = documentModel.create({
        applicationId,
        doc_type,
        doc_no: doc_no || null,
        file_data,
        created_at: new Date().toISOString()
      });
      res.status(201).json(newDocument);
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({ message: 'Failed to upload document', error: error.message });
    }
  },

   /**
   * GET /api/user-data/:applicationId
   * Fetches user basic data for a specific application ID.
   */
  getUserBasicData: (req, res) => {
    const { applicationId } = req.params;
    if (!applicationId) {
      return res.status(400).json({ message: 'Application ID is required' });
    }
    try {
      const userData = documentModel.findUserBasicDataByApplicationId(applicationId);
      res.status(200).json(userData || {});
    } catch (error) {
      console.error('Error fetching user basic data:', error);
      res.status(500).json({ message: 'Failed to fetch user basic data', error: error.message });
    }
  },

   /**
   * POST /api/user-data/:applicationId
   * Saves or updates user basic data.
   * Expects JSON body with data like { pan: '...', aadhaar: '...' }
   */
   saveUserBasicData: (req, res) => {
       const { applicationId } = req.params;
       const userData = req.body;

       if (!applicationId) {
           return res.status(400).json({ message: 'Application ID is required' });
       }
       if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: 'User data in request body is required' });
       }

       try {
           const updatedUserData = documentModel.saveUserBasicData(applicationId, userData);
           res.status(200).json(updatedUserData);
       } catch (error) {
           console.error('Error saving user basic data:', error);
           res.status(500).json({ message: 'Failed to save user basic data', error: error.message });
       }
   },
};

// Export the controller methods
export default documentController;