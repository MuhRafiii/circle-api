import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import {
  deletePhotoProfile,
  followSuggestions,
  searchUser,
  updateUser,
} from "../services/user";
import { updateProfileSchema } from "../validations/user";

export async function handleUpdateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      next(error);
    }

    const { username, name, bio } = req.body;
    const avatar = req.file?.path;
    const updatedUser = await updateUser(userId!, username, name, bio, avatar);
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleDeletePhotoProfile(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const avatar = await deletePhotoProfile(userId);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Photo profile deleted",
      data: avatar,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleSearchUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { keyword } = req.query;
    const userId = req.user!.id;
    const data = await searchUser(userId, keyword as string);
    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleFollowSuggestions(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const data = await followSuggestions(userId);
    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
}
