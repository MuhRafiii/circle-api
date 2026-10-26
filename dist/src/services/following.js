"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.getFollowers = getFollowers;
exports.getFollowing = getFollowing;
const client_1 = require("../prisma/client");
async function followUser(followerId, followedId) {
    const [follower, followed] = await client_1.prisma.$transaction([
        client_1.prisma.user.findUnique({
            where: {
                id: followerId,
            },
        }),
        client_1.prisma.user.findUnique({
            where: {
                id: followedId,
            },
        }),
    ]);
    if (followed === follower)
        throw { status: 401, message: "You cannot follow yourself" };
    const existingFollowing = await client_1.prisma.following.findFirst({
        where: {
            follower_id: followerId,
            following_id: followedId,
        },
    });
    if (existingFollowing)
        throw { status: 401, message: "You are already following this user" };
    await client_1.prisma.following.create({
        data: {
            follower_id: followerId,
            following_id: followedId,
        },
    });
    return {
        user_id: followedId.toString(),
        is_following: true,
    };
}
async function unfollowUser(followerId, followedId) {
    await client_1.prisma.following.deleteMany({
        where: {
            follower_id: followerId,
            following_id: followedId,
        },
    });
    return {
        user_id: followedId.toString(),
        is_following: false,
    };
}
async function getFollowers(userId) {
    const followers = await client_1.prisma.following.findMany({
        where: { following_id: userId },
        include: {
            follower: true,
        },
    });
    const result = await Promise.all(followers.map(async (f) => {
        const isFollowing = await client_1.prisma.following.findFirst({
            where: {
                follower_id: userId,
                following_id: f.follower.id,
            },
        });
        return {
            id: f.follower.id.toString(),
            username: f.follower.username,
            name: f.follower.full_name,
            bio: f.follower.bio,
            avatar: f.follower.photo_profile,
            is_following: Boolean(isFollowing),
        };
    }));
    return { followers: result };
}
async function getFollowing(userId) {
    const following = await client_1.prisma.following.findMany({
        where: { follower_id: userId },
        include: {
            following: true,
        },
    });
    const result = following.map((f) => ({
        id: f.following.id.toString(),
        username: f.following.username,
        bio: f.following.bio,
        name: f.following.full_name,
        avatar: f.following.photo_profile,
        is_following: true,
    }));
    return { following: result };
}
