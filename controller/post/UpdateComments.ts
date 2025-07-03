import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';

export const fetchComments = async (req: Request, res: Response) => {
  const { postId, skip, limit, localComments } = req.body;
  let hasMore;
  try {
    const post = await Posts.findOne({ postId: postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const localCommentIds = localComments.map((comment: { id: string }) => comment.id);

    const comments = post.comments
      .slice(skip, limit)
      .filter(comment => !localCommentIds.includes(comment.id));

    if (comments.length !== 0) {
      if (post.comments[post.comments.length - 1].id === comments[comments.length - 1].id) {
        hasMore = false;
      } else {
        hasMore = true;
      }
    }

    res.status(200).json({ comments, limit: limit + 20, hasMore });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addComment = async (req: Request, res: Response) => {
  const { postId, commentId, commentText, user } = req.body;

  try {
    await Posts.updateOne(
      { postId },
      {
        $push: {
          comments: {
            id: commentId,
            text: commentText,
            user,
            createdAt: new Date().toISOString(),
            replies: [], // optional — will default to []
          },
        },
      },
      { new: true }
    );
    const updatedPost = await Posts.findOne({ postId: postId });
    const comment = updatedPost?.comments[updatedPost?.comments.length - 1];

    res.status(200).json({ comment: [comment], commentsLength: updatedPost?.comments.length });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCommentLikes = async (req: Request, res: Response) => {
  const { postId, commentId, user } = req.body;

  try {
    const post = await Posts.findOne({ postId });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.find(comment => comment.id === commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const alreadyLiked = comment.likes?.some(likedUser => likedUser.email === user.email);

    if (alreadyLiked) {
      comment.likes.pull(user);
    } else {
      // Otherwise, push the user into likes
      comment.likes.push(user);
    }

    await post.save();

    return res.status(200).json({ comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
