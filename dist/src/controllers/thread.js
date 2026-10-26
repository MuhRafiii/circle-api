"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetThreads = handleGetThreads;
exports.handleGetThreadDetail = handleGetThreadDetail;
exports.handleCreateThread = handleCreateThread;
exports.handleLikeThread = handleLikeThread;
const thread_1 = require("../services/thread");
const queue_1 = require("../utils/queue");
async function handleGetThreads(req, res, next) {
    var _a;
    try {
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (!currentUserId) {
            throw { status: 401, message: "User is not authenticated" };
        }
        const data = await (0, thread_1.getThreads)(currentUserId, page, limit);
        res.status(200).json({
            code: 200,
            status: "success",
            message: "Get Data Thread Successfully",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleGetThreadDetail(req, res, next) {
    var _a;
    try {
        const { id } = req.params;
        const currentUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!currentUserId) {
            throw { status: 401, message: "User is not authenticated" };
        }
        const data = await (0, thread_1.getThreadDetail)(Number(id), currentUserId);
        res.status(200).json({
            code: 200,
            status: "success",
            message: "Get Data Thread Successfully",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleCreateThread(req, res, next) {
    var _a, _b;
    try {
        const userId = req.user.id;
        const { content } = req.body;
        if (!content && !req.file) {
            throw { status: 400, message: "Content or image is required" };
        }
        console.log("REQ FILE:", req.file);
        const image = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : null;
        // Message Queue
        if (image) {
            await (0, queue_1.publishToQueue)("image_uploaded", {
                image,
                uploaded_by: userId,
            });
        }
        const { tweet } = await (0, thread_1.createThread)(userId, content, image);
        // WebSocket
        const io = req.app.get("io");
        io.emit("new-thread", { tweet, userId });
        res.status(201).json({
            code: 201,
            status: "success",
            message: "Thread berhasil diposting.",
            data: tweet,
        });
    }
    catch (err) {
        console.error("CREATE THREAD ERROR:", err);
        next(err);
    }
}
async function handleLikeThread(req, res, next) {
    var _a;
    try {
        const threadId = Number(req.params.id);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            throw { status: 401, message: "User is not authenticated" };
        }
        const result = await (0, thread_1.likeThread)(userId, threadId);
        res.status(200).json({
            code: 200,
            status: "success",
            message: result.liked ? "Thread liked" : "Thread unliked",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
}
