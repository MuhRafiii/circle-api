"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const thread_1 = require("../controllers/thread");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.get("/", auth_1.authenticate, thread_1.handleGetThreads);
router.get("/:id", auth_1.authenticate, thread_1.handleGetThreadDetail);
router.post("/:id/like", auth_1.authenticate, thread_1.handleLikeThread);
router.post("/upload", auth_1.authenticate, multer_1.upload.single("image"), thread_1.handleCreateThread);
exports.default = router;
