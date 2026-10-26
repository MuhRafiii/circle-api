"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = updateUser;
exports.deletePhotoProfile = deletePhotoProfile;
exports.searchUser = searchUser;
exports.followSuggestions = followSuggestions;
const client_1 = require("../prisma/client");
async function updateUser(userId, username, name, bio, avatar) {
    const updatedUser = await client_1.prisma.user.update({
        where: { id: userId },
        data: {
            photo_profile: avatar,
            username: username === null || username === void 0 ? void 0 : username.toLowerCase(),
            full_name: name,
            bio: bio,
            updated_by: userId,
        },
    });
    return {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.full_name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        avatar: updatedUser.photo_profile && updatedUser.photo_profile,
    };
}
async function deletePhotoProfile(userId) {
    const updatedUser = await client_1.prisma.user.update({
        where: { id: userId },
        data: {
            photo_profile: "https://res.cloudinary.com/dxlevzn3n/image/upload/v1754074668/default_pmdws2.png",
        },
    });
    return {
        avatar: updatedUser.photo_profile,
    };
}
async function searchUser(userId, keyword) {
    const users = await client_1.prisma.user.findMany({
        where: {
            OR: [
                { username: { contains: keyword } },
                { full_name: { contains: keyword } },
            ],
        },
        include: {
            _count: {
                select: {
                    followers: true,
                },
            },
        },
    });
    const filteredUsers = users.filter((user) => user.id !== userId);
    const result = await Promise.all(filteredUsers.map(async (user) => {
        const isFollowing = await client_1.prisma.following.findFirst({
            where: {
                follower_id: userId,
                following_id: user.id,
            },
        });
        return {
            id: user.id.toString(),
            username: user.username,
            name: user.full_name,
            bio: user.bio,
            avatar: user.photo_profile,
            followers: user._count.followers,
            is_following: Boolean(isFollowing),
        };
    }));
    return { users: result };
}
async function followSuggestions(userId) {
    const users = await client_1.prisma.user.findMany({
        where: {
            id: {
                not: userId,
            },
        },
        include: {
            _count: {
                select: {
                    followers: true,
                },
            },
        },
    });
    const result = await Promise.all(users.map(async (user) => {
        const isFollowing = await client_1.prisma.following.findFirst({
            where: {
                follower_id: userId,
                following_id: user.id,
            },
        });
        return {
            id: user.id.toString(),
            username: user.username,
            name: user.full_name,
            bio: user.bio,
            avatar: user.photo_profile,
            followers: user._count.followers,
            is_following: Boolean(isFollowing),
        };
    }));
    const suggestions = result.filter((user) => !user.is_following).slice(0, 5);
    return { users: suggestions };
}
