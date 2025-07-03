import { Users } from '../../schemas/Users.js';
import { Request, Response } from 'express';
export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Bad Request - email is required' });

  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
