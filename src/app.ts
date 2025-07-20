import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { authenticate } from "./middlwares/auth";
import { corsMiddleware } from "./middlwares/cors";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);

app.get("/", authenticate, (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
