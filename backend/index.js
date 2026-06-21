import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(userRouter);

app.use(errorMiddleware);

mongoose.connect(process.env.DBURL).then(() => {
  app.listen(3000, () => {
    console.log("Database connected successfully, running at port 3000")
  })
})

