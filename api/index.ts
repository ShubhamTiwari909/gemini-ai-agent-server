import express, { Express, Request, Response } from "express";
import historyRoutes from "../routes/history.js";
import usersRoutes from "../routes/users.js";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import { connectionWrapper } from "../middlewares/db-connection.js";
import compression from "compression";

const app: Express = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"], // Only allow resources from the same origin
        "script-src": ["'self'", process.env.WHITELISTING_CSP_API || ""], // Allow scripts from self and example.com (adjust as needed)
        "style-src": ["'self'", "'unsafe-inline'"], // Allow styles from self.  'unsafe-inline' is generally discouraged but sometimes necessary (use sparingly!)
        "img-src": ["'self'", "data:"], // Allow images from self and data URLs
        "connect-src": ["'self'", process.env.WHITELISTING_CSP_API || ""], // Allow connections to self and your API
        "font-src": ["'self'"], // Allow fonts from self
        "object-src": ["'none'"], // Disable embedded objects (Flash, etc.)
        "base-uri": ["'self'"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'none'"], // Prevents iframing your site
        "upgrade-insecure-requests": ["'self'"],
      },
    },
  })
);

const corsOptions = {
  origin: [process.env.WHITELISTING_CSP_API || "", "https://gemini-ai-agent.vercel.app/"],
};

// Middleware to parse JSON
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded
app.use((req, res, next) => connectionWrapper(req, res, next));
app.use(compression());

// Routes
app.get("/", async (_: Request, res: Response) => {
  res.send("Hello world");
});

app.use("/history", historyRoutes);
app.use(
  "/users",
  usersRoutes
);

// Start the server
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

