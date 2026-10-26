"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFollowUser = handleFollowUser;
exports.handleUnfollowUser = handleUnfollowUser;
exports.handleGetFollows = handleGetFollows;
const following_1 = require("../services/following");
const following_2 = require("../validations/following");
async function handleFollowUser(req, res, next) {
    var _a, _b;
    try {
        const followerId = req.user.id;
        const followerName = (_a = req.user) === null || _a === void 0 ? void 0 : _a.name;
        const followerUsername = (_b = req.user) === null || _b === void 0 ? void 0 : _b.username;
        const { followed_user_id } = req.body;
        const data = await (0, following_1.followUser)(followerId, followed_user_id);
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
    }
    catch (err) {
        next(err);
    }
}
async function handleUnfollowUser(req, res, next) {
    try {
        const followerId = req.user.id;
        const { followed_id } = req.body;
        const data = await (0, following_1.unfollowUser)(followerId, followed_id);
        const io = req.app.get("io");
        io.emit("new-unfollower", { followerId, followed_id });
        res.status(200).json({
            code: 200,
            status: "success",
            message: "You have successfully unfollowed the user.",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleGetFollows(req, res, next) {
    const { type } = req.query;
    const userId = req.user.id;
    const { error } = following_2.getFollowsSchema.validate(req.query);
    if (error) {
        return next(error);
    }
    try {
        const data = type === "followers"
            ? await (0, following_1.getFollowers)(userId)
            : await (0, following_1.getFollowing)(userId);
        res.status(200).json({
            code: 200,
            status: "success",
            data,
        });
    }
    catch (err) {
        next(err);
    }
}
