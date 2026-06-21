import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import userRouter from "./routes/user.routes.js";
import imageRouter from "./routes/imageRoutes.js"; 
import { errorMiddleware } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use(userRouter);
app.use("/api/images", imageRouter); 


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;


mongoose
  .connect(process.env.DBURL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connected successfully, running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1); 
  });