"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreads = getThreads;
exports.getThreadDetail = getThreadDetail;
exports.createThread = createThread;
exports.likeThread = likeThread;
const client_1 = require("../prisma/client");
async function getThreads(currentUserId, page = 1, limit = 10) {
    const threads = await client_1.prisma.thread.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    photo_profile: true,
                },
            },
            _count: {
                select: {
                    likes: true,
                    replies: true,
                },
            },
            likes: {
                where: {
                    user_id: currentUserId,
                },
                select: { id: true },
            },
        },
        orderBy: {
            created_at: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const fullThreads = threads.map((thread) => ({
        ...thread,
        image: thread.image && thread.image,
    }));
    const formattedThreads = fullThreads.map((thread) => {
        var _a, _b, _c, _d;
        return ({
            id: thread.id,
            content: thread.content,
            created_at: thread.created_at,
            image: thread.image,
            user: {
                id: (_a = thread.user) === null || _a === void 0 ? void 0 : _a.id,
                username: (_b = thread.user) === null || _b === void 0 ? void 0 : _b.username,
                name: (_c = thread.user) === null || _c === void 0 ? void 0 : _c.full_name,
                profile_picture: (_d = thread.user) === null || _d === void 0 ? void 0 : _d.photo_profile,
            },
            likes: thread._count.likes,
            replies: thread._count.replies,
            isLiked: thread.likes.length > 0,
        });
    });
    return { threads: formattedThreads };
}
async function getThreadDetail(id, currentUserId) {
    var _a, _b, _c, _d;
    const thread = await client_1.prisma.thread.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    photo_profile: true,
                },
            },
            _count: {
                select: {
                    replies: true,
                    likes: true,
                },
            },
            likes: {
                where: {
                    user_id: currentUserId,
                },
                select: { id: true },
            },
        },
    });
    const threadDetail = {
        id: thread === null || thread === void 0 ? void 0 : thread.id,
        content: thread === null || thread === void 0 ? void 0 : thread.content,
        image: (thread === null || thread === void 0 ? void 0 : thread.image) && (thread === null || thread === void 0 ? void 0 : thread.image),
        user: {
            id: (_a = thread === null || thread === void 0 ? void 0 : thread.user) === null || _a === void 0 ? void 0 : _a.id,
            username: (_b = thread === null || thread === void 0 ? void 0 : thread.user) === null || _b === void 0 ? void 0 : _b.username,
            name: (_c = thread === null || thread === void 0 ? void 0 : thread.user) === null || _c === void 0 ? void 0 : _c.full_name,
            profile_picture: (_d = thread === null || thread === void 0 ? void 0 : thread.user) === null || _d === void 0 ? void 0 : _d.photo_profile,
        },
        created_at: thread === null || thread === void 0 ? void 0 : thread.created_at,
        likes: thread === null || thread === void 0 ? void 0 : thread._count.likes,
        replies: thread === null || thread === void 0 ? void 0 : thread._count.replies,
        isLiked: (thread === null || thread === void 0 ? void 0 : thread.likes.length) > 0,
    };
    return threadDetail;
}
async function createThread(userId, content, image) {
    const [user, thread] = await client_1.prisma.$transaction([
        client_1.prisma.user.findUnique({
            where: {
                id: userId,
            },
        }),
        client_1.prisma.thread.create({
            data: {
                content,
                image,
                created_by: userId,
            },
        }),
    ]);
    const tweet = {
        id: thread.id,
        content: thread.content,
        image: thread.image && thread.image,
        created_at: thread.created_at,
        user: {
            id: user.id,
            username: user.username,
            name: user.full_name,
            profile_picture: user.photo_profile,
        },
        likes: 0,
        replies: 0,
        isLiked: false,
    };
    return { tweet };
}
async function likeThread(userId, threadId) {
    const existingLike = await client_1.prisma.like.findFirst({
        where: { user_id: userId, thread_id: threadId },
    });
    let liked;
    if (existingLike) {
        await client_1.prisma.like.delete({ where: { id: existingLike.id } });
        liked = false;
    }
    else {
        await client_1.prisma.like.create({
            data: { user_id: userId, thread_id: threadId },
        });
        liked = true;
    }
    const likeCount = await client_1.prisma.like.count({ where: { thread_id: threadId } });
    return { liked, likeCount };
}
