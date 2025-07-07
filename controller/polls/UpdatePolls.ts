import { Request, Response } from 'express';
import { Polls } from '../../schemas/Polls.js';
import mongoose from 'mongoose';

export const updatePollVotes = async (req: Request, res: Response) => {
  try {
    const { _id, userVoted, optionId } = req.body;
    if (!_id || !userVoted || !optionId) {
      return res.status(400).json({ error: 'Poll ID, user, and option ID are required' });
    }

    const poll = await Polls.findById(_id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    const userAlreadyVoted = poll.options.some(option =>
      option.votes?.some(vote => vote.user?.email === userVoted.email)
    );

    if (userAlreadyVoted) {
      return res.status(400).json({ message: 'User has already voted on this option' });
    }

    const updatedPoll = await Polls.findOneAndUpdate(
      {
        _id,
        'options._id': new mongoose.Types.ObjectId(optionId),
      },
      {
        $inc: {
          'question.totalVotes': 1,
        },
        $push: {
          'options.$.votes': {
            user: {
              name: userVoted.name,
              email: userVoted.email,
              userId: userVoted.userId,
              image: userVoted.image,
              createdAt: new Date(),
            },
          },
        },
      },
      { new: true }
    );
    return res.status(200).json({ message: 'Poll votes updated successfully', updatedPoll });
  } catch (error) {
    console.error('Error updating poll votes:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
