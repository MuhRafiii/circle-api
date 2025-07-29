import { Response } from "express";
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
  res: Response
) {
  try {
    const userId = req.user?.id;
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ code: 400, status: "error", message: error.message });
    }

    const updates = req.body;
    const avatar = req.file?.filename;
    const updatedUser = await updateUser(userId!, updates, avatar);
    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message,
      error: err,
    });
  }
}

export async function handleDeletePhotoProfile(
  req: AuthenticatedRequest,
  res: Response
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
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to delete photo profile",
    });
  }
}

export async function handleSearchUser(
  req: AuthenticatedRequest,
  res: Response
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
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch user data. Please try again later.",
    });
  }
}

export async function handleFollowSuggestions(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user!.id;
    const data = await followSuggestions(userId);
    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: "Failed to fetch user data. Please try again later.",
    });
  }
}
