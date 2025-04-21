import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized - No token Provided",
      });
    }

    let decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findUnique({
      where: {
        id: decodedUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid token",
    });
  }
};
