import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';
export const updateLikes = async (req: Request, res: Response) => {
  const { postId, user } = req.body;

  const post = await Posts.find({ postId: postId, 'likes.email': user.email });
  if (post.length === 0) {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $push: { likes: user } },
      { new: true } // or `returnDocument: 'after'` if using native MongoDB
    );
    res.json({ likes: updatedPost?.likes });
  } else {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId: postId },
      { $pull: { likes: user } },
      { new: true }
    );

    res.json({ likes: updatedPost?.likes });
  }
};
