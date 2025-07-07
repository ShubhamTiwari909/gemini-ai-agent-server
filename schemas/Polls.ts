import mongoose from 'mongoose';

export const User = {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
};

export const pollSchema = new mongoose.Schema({
  question: {
    text: {
      type: String,
      required: true,
    },
    totalVotes: {
      type: Number,
      default: 0,
    },
  },
  options: [
    {
      answer: {
        type: String,
        required: true,
      },
      votes: [
        {
          user: User,
        },
      ],
    },
  ],
  createdBy: User,
  createdAt: String,
});

pollSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString();
  }
  next();
});

export const Polls = mongoose.model('Polls', pollSchema);
