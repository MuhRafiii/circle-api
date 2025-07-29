import express from "express";
import {
  handleDeletePhotoProfile,
  handleFollowSuggestions,
  handleSearchUser,
  handleUpdateUser,
} from "../controllers/user";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router();

router.patch("/", authenticate, upload.single("avatar"), handleUpdateUser);
router.delete("/delete-photo", authenticate, handleDeletePhotoProfile);
router.get("/search", authenticate, handleSearchUser);
router.get("/suggestions", authenticate, handleFollowSuggestions);

export default router;
