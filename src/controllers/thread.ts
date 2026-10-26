import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import {
  createThread,
  getThreadDetail,
  getThreads,
  likeThread,
} from "../services/thread";
import { publishToQueue } from "../utils/queue";

export async function handleGetThreads(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!currentUserId) {
      throw { status: 401, message: "User is not authenticated" };
    }

    const data = await getThreads(currentUserId, page, limit);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleGetThreadDetail(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      throw { status: 401, message: "User is not authenticated" };
    }
    const data = await getThreadDetail(Number(id), currentUserId);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleCreateThread(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const { content } = req.body;

    if (!content && !req.file) {
      throw { status: 400, message: "Content or image is required" };
    }

    console.log("REQ FILE:", req.file);

    const image = req.file?.path ?? null;

    // Message Queue
    if (image) {
      await publishToQueue("image_uploaded", {
        image,
        uploaded_by: userId,
      });
    }

    const { tweet } = await createThread(userId, content, image);

    // WebSocket
    const io = req.app.get("io");
    io.emit("new-thread", { tweet, userId });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Thread berhasil diposting.",
      data: tweet,
    });
  } catch (err) {
    console.error("CREATE THREAD ERROR:", err);
    next(err);
  }
}

export async function handleLikeThread(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const threadId = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      throw { status: 401, message: "User is not authenticated" };
    }

    const result = await likeThread(userId, threadId);

    res.status(200).json({
      code: 200,
      status: "success",
      message: result.liked ? "Thread liked" : "Thread unliked",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}
