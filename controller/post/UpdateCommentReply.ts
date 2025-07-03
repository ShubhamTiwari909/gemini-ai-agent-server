import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';

export type User = {
  name: string;
  email: string;
  image: string;
  userId: string;
};

export const addReply = async (req: Request, res: Response) => {
  const { postId, commentId, replyId, replyText, user } = req.body;

  try {
    const updatedPost = await Posts.findOneAndUpdate(
      {
        postId,
        'comments.id': commentId,
      },
      {
        $push: {
          'comments.$.replies': {
            id: replyId,
            text: replyText,
            user,
            createdAt: new Date().toISOString(),
          },
        },
      },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post or comment not found' });
    }

    res.status(200).json({ comments: updatedPost.comments });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateReplyLikes = async (req: Request, res: Response) => {
  const { postId, commentId, replyId, user } = req.body;

  try {
    const post = await Posts.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.find(comment => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const reply = comment.replies.find(reply => reply.id === replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found' });

    const alreadyLiked = reply.likes?.some((likedUser: User) => likedUser.email === user.email);

    if (alreadyLiked) {
      reply.likes.pull(user);
    } else {
      // Otherwise, push the user into likes
      reply.likes.push(user);
    }

    await post.save();

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
