"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUpdateUser = handleUpdateUser;
exports.handleDeletePhotoProfile = handleDeletePhotoProfile;
exports.handleSearchUser = handleSearchUser;
exports.handleFollowSuggestions = handleFollowSuggestions;
const user_1 = require("../services/user");
const user_2 = require("../validations/user");
async function handleUpdateUser(req, res, next) {
    var _a, _b;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { error } = user_2.updateProfileSchema.validate(req.body);
        if (error) {
            next(error);
        }
        const { username, name, bio } = req.body;
        const avatar = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
        const updatedUser = await (0, user_1.updateUser)(userId, username, name, bio, avatar);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Profile updated",
            user: updatedUser,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleDeletePhotoProfile(req, res, next) {
    try {
        const userId = req.user.id;
        const avatar = await (0, user_1.deletePhotoProfile)(userId);
        res.status(200).json({
            code: 200,
            status: "success",
            message: "Photo profile deleted",
            data: avatar,
        });
    }
    catch (err) {
        next(err);
    }
}
async function handleSearchUser(req, res, next) {
    try {
        const { keyword } = req.query;
        const userId = req.user.id;
        const data = await (0, user_1.searchUser)(userId, keyword);
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
async function handleFollowSuggestions(req, res, next) {
    try {
        const userId = req.user.id;
        const data = await (0, user_1.followSuggestions)(userId);
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
