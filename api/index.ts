// import express, { Express, Request, Response } from "express";
// import historyRoutes from "../routes/history.js";
// import usersRoutes from "../routes/users.js";
// import cors from "cors";
// import helmet from "helmet";
// import "dotenv/config";
// import { connectionWrapper } from "../middlewares/db-connection.js";
// import { dynamicLimiter } from "../middlewares/rate-limiting.js";

// const app: Express = express();

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         "default-src": ["'self'"], // Only allow resources from the same origin
//         "script-src": ["'self'", process.env.WHITELISTING_CSP_API || ""], // Allow scripts from self and example.com (adjust as needed)
//         "style-src": ["'self'", "'unsafe-inline'"], // Allow styles from self.  'unsafe-inline' is generally discouraged but sometimes necessary (use sparingly!)
//         "img-src": ["'self'", "data:"], // Allow images from self and data URLs
//         "connect-src": ["'self'", process.env.WHITELISTING_CSP_API || ""], // Allow connections to self and your API
//         "font-src": ["'self'"], // Allow fonts from self
//         "object-src": ["'none'"], // Disable embedded objects (Flash, etc.)
//         "base-uri": ["'self'"],
//         "form-action": ["'self'"],
//         "frame-ancestors": ["'none'"], // Prevents iframing your site
//         "upgrade-insecure-requests": ["'self'"],
//       },
//     },
//   })
// );

// const corsOptions = {
//   origin: [process.env.WHITELISTING_CSP_API || ""],
// };

// // Middleware to parse JSON
// app.use(cors(corsOptions));
// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: true, limit: "50mb" })); // for parsing application/x-www-form-urlencoded
// app.use((req, res, next) => connectionWrapper(req, res, next));
// app.use(dynamicLimiter());

// // Routes
// app.get("/", async (_: Request, res: Response) => {
//   res.send("Hello world");
// });

// app.use("/history", historyRoutes);
// app.use(
//   "/users",
//   usersRoutes
// );

// // Start the server
// const PORT = Number(process.env.PORT) || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export default app;

import express, { Express, Request, Response } from "express";

const app: Express = express();
const PORT = 4000;

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("Welcome, your app is working well");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
