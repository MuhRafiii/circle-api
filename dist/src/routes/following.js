"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const following_1 = require("../controllers/following");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/follows", auth_1.authenticate, following_1.handleGetFollows);
router.post("/follows", auth_1.authenticate, following_1.handleFollowUser);
router.delete("/follows", auth_1.authenticate, following_1.handleUnfollowUser);
exports.default = router;
