// This file simulates a database model using ES Modules.
// In a real application, this would be a database interface.

// Simple in-memory data store for demonstration
const documents = [];
const userBasicData = {}; // Store user data keyed by applicationId

// Helper to generate a unique ID (for demonstration)
let nextDocumentId = 1;

const documentModel = {
  /**
   * In a real app, this would query a database.
   */
  findByApplicationId: (applicationId) => {
    return documents.filter(doc => doc.applicationId === applicationId);
  },

  /**
   * Saves a new document.
   * In a real app, this would insert into a database and handle file storage.
   */
  create: ({ applicationId, doc_type, doc_no, file_data, created_at }) => {
    const newDocument = {
      id: nextDocumentId++,
      applicationId,
      doc_type,
      doc_no,
      file_data, // Storing base64 for simplicity
      created_at: created_at || new Date().toISOString()
    };
    documents.push(newDocument);
    console.log(`Document created for app ${applicationId}, type ${doc_type}`);
    return newDocument;
  },

   /**
   * Finds user basic data for a given application ID.
   * In a real app, this would query a user/application details table.
   */
  findUserBasicDataByApplicationId: (applicationId) => {
      return userBasicData[applicationId];
  },

  /**
   * Saves or updates user basic data.
   * In a real app, this would insert or update a user/application details table.
   */
  saveUserBasicData: (applicationId, data) => {
      userBasicData[applicationId] = { ...userBasicData[applicationId], ...data };
      console.log(`User basic data saved for app ${applicationId}`);
      return userBasicData[applicationId];
  },

  // --- Add other necessary database operations here ---
};

// Export the model object
export default documentModel;