import { Users } from '../../schemas/Users.js';
import { Request, Response } from 'express';
import { encrypt } from '../../utils/hybrid-encryption.js';

export const getUserId = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: 'Bad Request - email and user id is required' });
  try {
    const user = await Users.findOne({ email }, { userId: 1 });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const encryptedUserId = encrypt(user.userId);
    res.status(200).json({
      uid: encryptedUserId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
