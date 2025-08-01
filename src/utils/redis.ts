import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

export const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.on("error", (err) => console.error("Redis Error:", err));
(async () => {
  try {
    await redis.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();
