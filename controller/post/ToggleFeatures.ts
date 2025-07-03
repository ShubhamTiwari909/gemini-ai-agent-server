import { Posts } from '../../schemas/Post.js';
import { Request, Response } from 'express';

export const updateToggle = async (
  _: Request,
  res: Response,
  postId: string,
  feature: string,
  value: boolean | string
) => {
  try {
    const updatedPost = await Posts.findOneAndUpdate(
      { postId },
      { $set: { [`toggle.${feature}`]: value } },
      { new: true }
    );

    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });

    res.status(200).json({ toggle: updatedPost.toggle });
  } catch (error) {
    console.error('Error updating toggle:', error);
    res.status(500).json({ message: 'Error retrieving post' });
  }
};

export const updateCommentsToggle = async (req: Request, res: Response) => {
  const { postId, value } = req.body;

  await updateToggle(req, res, postId, 'comments', value);
};

export const updateDownloadToggle = async (req: Request, res: Response) => {
  const { postId, value } = req.body;

  await updateToggle(req, res, postId, 'downloads', value);
};
