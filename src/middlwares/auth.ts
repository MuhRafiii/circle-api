import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({ code: 401, status: "error", message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded as any;
    next();
  } catch {
    res
      .status(401)
      .json({ code: 401, status: "error", message: "Invalid token" });
    return;
  }
}
