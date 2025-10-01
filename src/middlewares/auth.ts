import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    name: string;
    photo_profile: string;
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token = req.cookies.token;

  if (!token) {
    token = req.headers.authorization?.split(" ")[1];
  }

  if (!token) {
    res
      .status(401)
      .json({ code: 401, status: "error", message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded as any;
    next();
  } catch {
    res
      .status(401)
      .json({ code: 401, status: "error", message: "Invalid token" });
    return;
  }
}
