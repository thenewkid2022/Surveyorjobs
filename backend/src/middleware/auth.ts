import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: any;
  headers: {
    authorization?: string;
  };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction): void | Response {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Kein Token übergeben" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
    return;
  } catch (err) {
    return res.status(401).json({ message: "Ungültiger Token" });
  }
} 