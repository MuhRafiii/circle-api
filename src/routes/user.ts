import express from "express";
import {
  handleDeletePhotoProfile,
  handleUpdateUser,
} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.patch("/", authenticate, upload.single("avatar"), handleUpdateUser);
router.delete("/delete-photo", authenticate, handleDeletePhotoProfile);

export default router;
