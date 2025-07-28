import express from "express";
import { handleUpdateUser } from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.patch("/", authenticate, upload.single("avatar"), handleUpdateUser);

export default router;
