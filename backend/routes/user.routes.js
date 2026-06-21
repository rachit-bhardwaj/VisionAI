import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteProfile, getProfile, getUserHistory, updateProfile } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/user_profile", authMiddleware, getProfile);

userRouter.update("/user_profile", authMiddleware, updateProfile);

userRouter.delete("/user_profile", authMiddleware, deleteProfile);

userRouter.get("/user_history", authMiddleware, getUserHistory);

export default userRouter;