import { Request, Response } from "express";
import {
  login,
  // login,
  register,
} from "../services/auth";
import {
  loginSchema,
  //   loginSchema,
  registerSchema,
} from "../validations/auth";

export async function handleRegister(req: Request, res: Response) {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400).json({
        code: 400,
        status: "error",
        error: "Invalid register, " + error.message,
      });
      return;
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
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: "Invalid register, " + err.message,
    });
  }
}

export async function handleLogin(req: Request, res: Response) {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({
          code: 400,
          status: "error",
          error: "Invalid login, " + error.message,
        });
      return;
    }

    const { identifier, password } = req.body;
    const data = await login(identifier, password);
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
  } catch (err: any) {
    res
      .status(400)
      .json({
        code: 400,
        status: "error",
        message: "Invalid login, " + err.message,
      });
  }
}

// export async function handleUpdateUser(req: Request, res: Response) {
//   try {
//     const { error } = updateUserSchema.validate(req.body);
//     if (error) {
//       res
//         .status(400)
//         .json({ statusCode: 400, status: "error", error: error.message });
//       return;
//     }

//     if (!req.file) {
//       res.status(400).json({
//         statusCode: 400,
//         status: "error",
//         message: "Image is required",
//       });
//       return;
//     }

//     const user = (req as any).user;
//     const { name } = req.body;
//     const picture = req.file.filename;

//     const update = await updateUser(user.id, name, picture);

//     res.status(200).json({
//       statusCode: 200,
//       status: "success",
//       message: "User updated successfully",
//       update,
//     });
//   } catch (err: any) {
//     res
//       .status(400)
//       .json({ statusCode: 400, status: "error", message: err.message });
//   }
// }
