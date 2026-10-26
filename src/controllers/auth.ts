import { NextFunction, Request, Response } from "express";
import { login, register } from "../services/auth";
import { loginSchema, registerSchema } from "../validations/auth";

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { username, name, email, password } = req.body;

    const data = await register(username, name, email, password);

    res.cookie("token", data.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Registrasi berhasil. Akun berhasil dibuat.",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleLogin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { identifier, password } = req.body;
    const data = await login(identifier, password);
    if (!data) {
      const errObj = { status: 401, message: "Invalid username or password" };
      return next(errObj);
    }

    res.cookie("token", data.token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful.",
      data,
    });
  } catch (err) {
    next(err);
  }
}
