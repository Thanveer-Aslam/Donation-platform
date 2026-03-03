import express from "express";
import { register, login } from "../controllers/authController.js";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// protected route (test)
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")  
        
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        res.json(user);
    } catch (error){
        console.error(error);
        res.status(500).json({ message: error.message });  
    }

});

export default router;
