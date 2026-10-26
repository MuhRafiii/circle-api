"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const cors_1 = require("./middlewares/cors");
const errorHandler_1 = require("./middlewares/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const following_1 = __importDefault(require("./routes/following"));
const reply_1 = __importDefault(require("./routes/reply"));
const thread_1 = __importDefault(require("./routes/thread"));
const user_1 = __importDefault(require("./routes/user"));
const swagger_1 = require("./utils/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
});
const port = process.env.PORT;
(0, swagger_1.setupSwagger)(app);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(cors_1.corsMiddleware);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/auth", auth_1.default);
app.use("/thread", thread_1.default);
app.use("/reply", reply_1.default);
app.use("/user", user_1.default);
app.use("/following", following_1.default);
app.use(errorHandler_1.errorHandler);
app.set("io", io);
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
