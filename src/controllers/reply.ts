import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { createReply, getRepliesByThread } from "../services/reply";
import { publishToQueue } from "../utils/queue";

export async function handleGetRepliesByThread(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const threadId = Number(req.query.thread_id);
    const data = await getRepliesByThread(threadId);

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

    const image = req.file ? req.file.filename : null;

    // Message Queue
    if (image) {
      await publishToQueue("image_uploaded", {
        image,
        uploaded_by: userId,
      });
    }

    const { reply } = await createReply(userId, threadId, content, image);

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
