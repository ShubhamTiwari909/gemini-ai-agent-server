import connectDB from "../mongodb-connection.js";

export const connectionWrapper = async () => {
  const connection = await connectDB();

  if (connection) {
    return connection
  } else {
    throw new Error("Failed to connect to the database");
  }
};
