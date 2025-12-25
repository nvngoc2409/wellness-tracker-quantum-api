import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteUserProfile, getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import upload from "../config/multerConfig.js";

const router = express.Router();
router.route('/profile')
    .get(authMiddleware, getUserProfile)
    .put(authMiddleware, upload.single('avatar'), updateUserProfile);

router.route('/')
    .delete(authMiddleware, deleteUserProfile);

export default router;
