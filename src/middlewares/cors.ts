import cors from "cors";

export const corsMiddleware = cors({
  origin: "https://circle-dumbways.vercel.app",
  credentials: true,
});
