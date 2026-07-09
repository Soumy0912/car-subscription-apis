import User from "../models/user/user.js";
import jwt from "jsonwebtoken";
import {sendResponse} from "../utils/handleresponse.js";

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: "Access token required" });

    try {
        const decoded = jwt.verify(token, "hello");
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return sendResponse(res,400,null,"User not found!!!!!!!!!!!");
        }
        req.user = user;
        next();
    } catch (err) {
        return sendResponse(res,403,null,"Invalid or expired token");
    }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return sendResponse(res,403,null,"Access denied. Only admins can perform this action.");

  } catch (error) {
    return sendResponse(res,403,null,error.message);
  }
};