import { Request, Response, NextFunction } from "express";
import connectDB from "../mongodb-connection.js";

export const connectionWrapper = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const connection = await connectDB();

  if (connection) {
    next();
  } else {
    res.status(500).send("MongoDB Connection Failed!");
  }
};
