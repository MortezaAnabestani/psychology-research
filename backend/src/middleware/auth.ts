import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../types";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "احراز هویت لازم است" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as any;
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    res.status(401).json({ message: "توکن نامعتبر است" });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: "دسترسی غیرمجاز" });
  }
  next();
};
