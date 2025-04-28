import jwt from 'jsonwebtoken';
import { db } from '../libs/db.js';
import dotenv from 'dotenv';
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized - No token Provided'
      });
    }

    let decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findUnique({
      where: {
        id: decodedUser.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true
      }
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized - Invalid token'
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await db.User.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Access denied - Admins only'
      });
    }
    next();
  } catch (error) {
    console.log('Error while checking admin', error);
    res.status(500).json({
      success: false,
      message: 'Error while checking admin'
    });
  }
};
