import connectDB from "../mongodb-connection.mjs";

export const connectionWrapper = async (req, res, next) => {
const connection = await connectDB();

  if (connection) {
    next();
  } else {
    res.status(500).send("MongoDB Connection Failed!");
  }
};
