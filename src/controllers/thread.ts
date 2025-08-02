import { Response } from "express";
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
  res: Response
) {
  try {
    const currentUserId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!currentUserId) {
      return res.status(401).json({
        code: 401,
        status: "unauthorized",
        message: "User is not authenticated",
      });
    }

    const data = await getThreads(currentUserId, page, limit);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: err.message,
    });
  }
}

export async function handleGetThreadDetail(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({
        code: 401,
        status: "unauthorized",
        message: "User is not authenticated",
      });
    }
    const data = await getThreadDetail(Number(id), currentUserId);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data,
    });
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: err.message,
    });
  }
}

export async function handleCreateThread(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user!.id;
    const { content } = req.body;

    if (!content && !req.file) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "Content or image is required",
      });
      return;
    }

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
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
}

export async function handleLikeThread(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const threadId = Number(req.params.id);
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized",
      });
    }

    const result = await likeThread(userId, threadId);

    res.status(200).json({
      code: 200,
      status: "success",
      message: result.liked ? "Thread liked" : "Thread unliked",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: err.message,
    });
  }
}
