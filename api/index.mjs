import express from "express";
import historyRoutes from "../routes/history.js";
import usersRoutes from "../routes/users.js";
import cors from "cors";
import { connectionWrapper } from "../middlewares/db-connection.js";

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", "https://gemini-ai-agent.vercel.app"],
};
// Middleware to parse JSON
app.use(cors(corsOptions));
app.use(express.json());
app.use(connectionWrapper);

// Routes
app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.use("/history", historyRoutes);
app.use("/users", usersRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
