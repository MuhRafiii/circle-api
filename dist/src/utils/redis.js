"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const redis_1 = require("redis");
dotenv_1.default.config();
exports.redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
exports.redis.on("error", (err) => console.error("Redis Error:", err));
(async () => {
    try {
        await exports.redis.connect();
        console.log("Redis connected");
    }
    catch (err) {
        console.error("Redis connection failed:", err);
    }
})();
