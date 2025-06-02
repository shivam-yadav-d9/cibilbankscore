import Application from '../models/MyApplication.js';

export const getUserApplications = async (req, res) => {
  try {
    console.log('getUserApplications called with query:', req.query); // Debug log
    const { user_id, email } = req.query;

    if (!user_id && !email) {
      return res.status(400).json({
        success: false,
        message: 'Either user_id or email is required',
      });
    }

    const query = {};
    if (user_id) query.user_id = user_id;
    if (email) query.email = email;

    const applications = await Application.find(query);
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error('Error in getUserApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};