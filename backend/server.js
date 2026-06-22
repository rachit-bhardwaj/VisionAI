import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import User from "./models/User.js";
import generateToken from "./utils/generateToken.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middlewares/authMiddleware.js";


dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("VisionAI Backend Running");
});


app.get('/test-user', async(req, res) =>{
    const users = await User.find();
    res.json(users);
});

app.get("/token-test", (req, res) => {
  const token = generateToken("123456");

  res.json({
    success: true,
    token,
  });
});

app.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});