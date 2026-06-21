import RetinaImage from "../models/RetinaImage.js"; 
import cloudinary from "../config/cloudinary.js";

// 1. IMAGE UPLOAD (RAM TO CLOUDINARY)
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image file" });
    }

    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "visionai" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await uploadFromBuffer();

    const image = await RetinaImage.create({
      userId: req.user._id, 
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
      preprocessingStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. GET SINGLE IMAGE
export const getImage = async (req, res) => {
  try {
    const image = await RetinaImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this image" });
    }

    res.status(200).json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET LOGGED-IN USER IMAGES
export const getUserImages = async (req, res) => {
  try {
    const images = await RetinaImage.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: images.length, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. DELETE IMAGE
export const deleteImage = async (req, res) => {
  try {
    const image = await RetinaImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    if (image.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this image" });
    }

    await cloudinary.uploader.destroy(image.cloudinaryId);
    await image.deleteOne();

    res.status(200).json({ success: true, message: "Image deleted successfully from production server" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};