import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import path from "path";
import { Server } from "socket.io";
import { corsMiddleware } from "./middlewares/cors";
import authRouter from "./routes/auth";
import followingRouter from "./routes/following";
import replyRouter from "./routes/reply";
import threadRouter from "./routes/thread";
import userRouter from "./routes/user";
import { setupSwagger } from "./utils/swagger";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});
const port = process.env.PORT;
setupSwagger(app);

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/auth", authRouter);
app.use("/thread", threadRouter);
app.use("/reply", replyRouter);
app.use("/user", userRouter);
app.use("/following", followingRouter);

app.set("io", io);
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
