import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../services/following";
import { getFollowsSchema } from "../validations/following";

export async function handleFollowUser(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const followerId = req.user!.id;
    const followerName = req.user?.name;
    const followerUsername = req.user?.username;
    const { followed_user_id } = req.body;
    const data = await followUser(followerId, followed_user_id);

    const io = req.app.get("io");
    io.emit("new-follower", {
      followerId,
      followerName,
      followerUsername,
      followed_user_id,
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "You have successfully followed the user.",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message:
        err.message || "Failed to follow the user. Please try again later.",
    });
  }
}

export async function handleUnfollowUser(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const followerId = req.user!.id;
    const { followed_id } = req.body;
    const data = await unfollowUser(followerId, followed_id);

    const io = req.app.get("io");
    io.emit("new-unfollower", { followerId, followed_id });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "You have successfully unfollowed the user.",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message:
        err.message || "Failed to unfollow the user. Please try again later.",
    });
  }
}

export async function handleGetFollows(
  req: AuthenticatedRequest,
  res: Response
) {
  const { type } = req.query;
  const userId = req.user!.id;

  const { error } = getFollowsSchema.validate(req.query);
  if (error) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: error.message,
    });
    return;
  }

  try {
    const data =
      type === "followers"
        ? await getFollowers(userId)
        : await getFollowing(userId);

    res.status(200).json({
      code: 200,
      status: "success",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message:
        err.message || `Failed to fetch ${type} data. Please try again later.`,
    });
  }
}
