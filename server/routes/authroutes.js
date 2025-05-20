import express from "express";
import { 
    signup, 
    login, 
    getAllUsers, 
    deleteUserById // <-- Import the delete controller
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUserById);

export default router;
