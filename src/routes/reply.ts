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
