import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./src/uploads/",
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname);

    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".JPG") {
      cb(null, false);
      return;
    }

    cb(null, true);
  },
});
