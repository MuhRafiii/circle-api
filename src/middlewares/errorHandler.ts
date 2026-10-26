import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof Joi.ValidationError) {
    statusCode = 400;
    message = err.details[0]?.message ?? "Invalid input";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const target = err.meta?.target;
    const fields = Array.isArray(target) ? target.join(", ") : "Data";
    if (err.code === "P2002") {
      statusCode = 409;
      message = `${fields} already used`;
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = `${fields} is not found`;
    }
  } else if (typeof err?.status === "number" && err.status < 500) {
    statusCode = err.status;
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    code: statusCode,
    status: statusCode === 401 ? "unauthorized" : "error",
    message,
  });
}
