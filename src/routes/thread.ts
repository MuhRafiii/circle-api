import express from "express";
import {
  handleCreateThread,
  handleGetThreadDetail,
  handleGetThreads,
  handleLikeThread,
} from "../controllers/thread";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.get("/", authenticate, handleGetThreads);
router.get("/:id", authenticate, handleGetThreadDetail);
router.post("/:id/like", authenticate, handleLikeThread);
router.post(
  "/upload",
  authenticate,
  upload.single("image"),
  handleCreateThread
);

export default router;
