import express from "express";
import {
  handleCreateReply,
  handleGetRepliesByThread,
} from "../controllers/reply";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", authenticate, handleGetRepliesByThread);
router.post("/upload", authenticate, upload.single("image"), handleCreateReply);

export default router;

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
