import { Users } from "../../schemas/Users.js";
import { Request, Response } from "express";

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Bad Request - user id is required' });

  try {
    const user = await Users.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};