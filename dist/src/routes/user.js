"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.patch("/", auth_1.authenticate, multer_1.upload.single("avatar"), user_1.handleUpdateUser);
router.delete("/delete-photo", auth_1.authenticate, user_1.handleDeletePhotoProfile);
router.get("/search", auth_1.authenticate, user_1.handleSearchUser);
router.get("/suggestions", auth_1.authenticate, user_1.handleFollowSuggestions);
exports.default = router;
