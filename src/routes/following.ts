import express from "express";
import {
  handleFollowUser,
  handleGetFollows,
  handleUnfollowUser,
} from "../controllers/following";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

router.get("/follows", authenticate, handleGetFollows);
router.post("/follows", authenticate, handleFollowUser);
router.delete("/follows", authenticate, handleUnfollowUser);

export default router;
