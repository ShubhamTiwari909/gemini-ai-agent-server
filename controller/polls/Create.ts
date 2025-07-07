import { Request, Response } from 'express';
import { Polls } from '../../schemas/Polls.js';

export const createPoll = async (req: Request, res: Response) => {
  try {
    const { question, options, user } = req.body;

    // Validate input
    if (!question || !Array.isArray(options) || options.length < 2 || !user) {
      return res.status(400).json({ error: 'Invalid poll data' });
    }

    const newPoll = await Polls.create({
      question: {
        text: question,
      },
      options,
      createdBy: user,
    });

    return res.status(201).json(newPoll);
  } catch (error) {
    console.error('Error creating poll:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
