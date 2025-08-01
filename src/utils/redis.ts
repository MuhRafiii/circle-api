import { createClient } from "redis";

export const redis = createClient();
redis.on("error", (err) => console.error("Redis Error:", err));
(async () => {
  try {
    await redis.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();
