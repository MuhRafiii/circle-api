"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetRepliesByThread = handleGetRepliesByThread;
exports.handleCreateReply = handleCreateReply;
const reply_1 = require("../services/reply");
const queue_1 = require("../utils/queue");
const redis_1 = require("../utils/redis");
async function handleGetRepliesByThread(req, res, next) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const threadId = Number(req.query.thread_id);
        const start = Date.now();
        const cacheKey = `replies:thread:${threadId}:page:${page}:limit:${limit}`;
        const cached = await redis_1.redis.get(cacheKey);
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
        const data = await (0, reply_1.getRepliesByThread)(threadId, page, limit);
        await redis_1.redis.setEx(cacheKey, 3600, JSON.stringify(data));
        res.status(200).json({
            code: 200,
            status: "success",
            message: "Get Data Thread Successfully",
            data,
        });
        const duration = Date.now() - start;
        console.log(`Duration: ${duration} ms`);
    }
    catch (err) {
        next(err);
    }
}
async function handleCreateReply(req, res, next) {
    try {
        const userId = req.user.id;
        const { content } = req.body;
        const threadId = Number(req.query.thread_id);
        if (!content && !req.file) {
            throw { status: 400, message: "Content or image is required" };
        }
        const image = req.file ? req.file.path : null;
        // Message Queue
        if (image) {
            await (0, queue_1.publishToQueue)("image_uploaded", {
                image,
                uploaded_by: userId,
            });
        }
        const { reply } = await (0, reply_1.createReply)(userId, threadId, content, image);
        const keys = await redis_1.redis.keys(`replies:thread:${threadId}:*`);
        if (keys.length > 0) {
            await Promise.all(keys.map((key) => redis_1.redis.del(key)));
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
    }
    catch (err) {
        next(err);
    }
}
