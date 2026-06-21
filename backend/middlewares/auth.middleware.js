import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function authMiddleware(req, res, next) {
  try {

    const token = req.cookies.token;
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    const id = tokenData.id

    if(!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated"
      })
    }

    const user = await User.findById(id);

    if(!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't exist"
      })
    }

    req.user = user;
    next();

  } catch (error) {
    next(error);
  }
}