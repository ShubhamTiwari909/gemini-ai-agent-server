import express from "express";
import connectDB from "../mongodb-connection.mjs";
import historyRoutes from "../routes/history.js";
import usersRoutes from "../routes/users.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());
const connection = await connectDB();

const connectionWrapper = (req, res, next) => {
  if (connection) {
    next();
  } else {
    res.status(500).send("MongoDB Connection Failed!");
  }
};
app.use(connectionWrapper);

// Routes
app.get("/", async (req, res) => {
  res.send("Hello world")
})

app.use("/history", historyRoutes);
app.use("/users", usersRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app