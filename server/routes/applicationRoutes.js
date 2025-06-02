import express from 'express';
import { getUserApplications } from '../controllers/applicationController.js';

const router = express.Router();

router.get('/user', getUserApplications);

export default router;