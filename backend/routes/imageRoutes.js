import express from "express";
const router = express.Router();

import {
  uploadImage,
  getImage,
  getUserImages,
  deleteImage,
} from "../controllers/imageController.js";

import upload from "../middlewares/upload.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/my-images", authMiddleware, getUserImages);
router.get("/:id", authMiddleware, getImage);
router.delete("/:id", authMiddleware, deleteImage);


export default router;