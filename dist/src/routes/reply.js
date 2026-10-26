"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reply_1 = require("../controllers/reply");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.get("/", auth_1.authenticate, reply_1.handleGetRepliesByThread);
router.post("/upload", auth_1.authenticate, multer_1.upload.single("image"), reply_1.handleCreateReply);
exports.default = router;
/**
 * @swagger
 * tags:
 *   - name: Replies
 *     description: Endpoints terkait balasan thread
 */
/**
 * @swagger
 * /reply:
 *   get:
 *     summary: Ambil daftar balasan sebuah thread
 *     tags: [Replies]
 *     parameters:
 *       - in: query
 *         name: thread_id
 *         schema: { type: integer }
 *         required: true
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         default: 10
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar balasan
 *
 * /reply/upload:
 *   post:
 *     summary: Buat balasan baru (opsional gambar)
 *     tags: [Replies]
 *     parameters:
 *       - in: query
 *         name: thread_id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string }
 *               image:   { type: string, format: binary }
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201: { description: Balasan berhasil dibuat }
 */
