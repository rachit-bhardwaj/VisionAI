const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require('./models/User');
const generateToken = require("./utils/generateToken");
const authRoutes = require("./routes/authRoutes");
const protect = require("./middlewares/authMiddleware");

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