import { Request, Response } from 'express';
import { Polls } from '../../schemas/Polls.js';

export const getPolls = async (req: Request, res: Response) => {
  try {
    const polls = await Polls.find().sort({ createdAt: -1 });
    return res.status(200).json(polls);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
