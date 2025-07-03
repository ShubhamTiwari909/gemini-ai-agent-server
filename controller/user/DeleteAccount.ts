import { Posts } from "../../schemas/Post.js";
import { Users } from "../../schemas/Users.js";
import { checkIfUserExists } from "../../utils/checkIfUserExist.js";
import { Request, Response } from "express";

export const deleteAccount = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'Bad Request - user id is required' });

  try {
    const userExists = await checkIfUserExists(userId);
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    const posts = await Posts.deleteMany({ 'user.userId': userId });
    const result = await Users.deleteOne({ userId });
    res.status(200).json({ message: 'User deleted', result, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
