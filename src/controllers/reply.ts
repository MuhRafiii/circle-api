import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { createReply, getRepliesByThread } from "../services/reply";
import { publishToQueue } from "../utils/queue";
import { redis } from "../utils/redis";

export async function handleGetRepliesByThread(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const threadId = Number(req.query.thread_id);
    const start = Date.now();

    const cacheKey = `replies:thread:${threadId}:page:${page}:limit:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      res.status(200).json({
        code: 200,
        status: "success",
        message: "Get Replies from Cache",
        data: JSON.parse(cached),
      });
      const duration = Date.now() - start;
      console.log(`Redis duration: ${duration} ms`);
      return;
    }

    const data = await getRepliesByThread(threadId, page, limit);

    await redis.setEx(cacheKey, 3600, JSON.stringify(data));

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Get Data Thread Successfully",
      data,
    });
    const duration = Date.now() - start;
    console.log(`Duration: ${duration} ms`);
  } catch (err: any) {
    res.status(400).json({
      code: 400,
      status: "error",
      message: err.message,
    });
  }
}

export async function handleCreateReply(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId = req.user!.id;
    const { content } = req.body;
    const threadId = Number(req.query.thread_id);

    if (!content && !req.file) {
      res.status(400).json({
        code: 400,
        status: "error",
        message: "Content or image is required",
      });
      return;
    }

    const image = req.file ? req.file.path : null;

    // Message Queue
    if (image) {
      await publishToQueue("image_uploaded", {
        image,
        uploaded_by: userId,
      });
    }

    const { reply } = await createReply(userId, threadId, content, image);
    const keys = await redis.keys(`replies:thread:${threadId}:*`);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redis.del(key)));
    }

    // WebSocket
    const io = req.app.get("io");
    io.emit("new-reply", reply);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Reply berhasil diposting.",
      data: reply,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
}
