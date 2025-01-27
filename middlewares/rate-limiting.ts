import rateLimit from "express-rate-limit";

export const dynamicLimiter = (limit: number) =>
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: () => {
      if (process.env.MODE === "development") {
        return 1000; // Higher limit for development
      }
      return limit; // Default limit for regular users
    },
    handler: (req, res, next) => {
      console.error(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        message: "Too many requests, please try again later after 1 minute",
      });
    },
  });
