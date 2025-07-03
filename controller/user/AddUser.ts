import { Users } from '../../schemas/Users.js';
import { Request, Response } from 'express';
import { checkIfUserExists } from '../../utils/checkIfUserExist.js';

export const addUser = async (req: Request, res: Response) => {
  const { userId, name, email, image } = req.body;

  if (!userId || !name || !email || !image)
    return res.status(400).json({ message: 'Bad Request - userId, name and email is required' });

  if (await checkIfUserExists(userId)) {
    return res.status(200).json({ message: 'User already exists' });
  }

  try {
    const newUser = new Users({ userId, name, email, image });
    const result = await newUser.save();
    res.status(201).json(`User saved - ${result}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
