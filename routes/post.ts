import express, { Router, Request, Response, NextFunction } from 'express';
import {
  addPost,
  getPosts,
  getPostById,
  updateLikes,
  updateViews,
  addComment,
  addReply,
  updateCommentLikes,
  updateReplyLikes,
  fetchComments,
  updateDownloads,
  updateCommentsToggle,
  updateDownloadToggle,
} from '../controller/post/index.js';
import { dynamicLimiter } from '../middlewares/rate-limiting.js';
import { deletePost } from '../controller/post/DeletePost.js';
import { updatePostPrompt } from '../controller/post/UpdatePost.js';

const router: Router = express.Router();

const routes = [
  {
    path: '/add',
    method: (req: Request, res: Response) => addPost(req, res),
  },
  {
    path: '/delete',
    method: (req: Request, res: Response) => deletePost(req, res),
  },
  {
    path: '/update/title',
    method: (req: Request, res: Response) => updatePostPrompt(req, res),
  },
  {
    path: '/find',
    method: (req: Request, res: Response) => getPosts(req, res),
  },
  {
    path: '/findById',
    method: (req: Request, res: Response) => getPostById(req, res),
  },
  {
    path: '/updateLikes',
    method: (req: Request, res: Response) => updateLikes(req, res),
  },
  {
    path: '/updateViews',
    method: (req: Request, res: Response) => updateViews(req, res),
  },
  {
    path: '/fetchComments',
    method: (req: Request, res: Response) => fetchComments(req, res),
  },
  {
    path: '/updateComments',
    method: (req: Request, res: Response) => addComment(req, res),
  },
  {
    path: '/updateReplies',
    method: (req: Request, res: Response) => addReply(req, res),
  },
  {
    path: '/updateCommentLikes',
    method: (req: Request, res: Response) => updateCommentLikes(req, res),
  },
  {
    path: '/updateReplyLikes',
    method: (req: Request, res: Response) => updateReplyLikes(req, res),
  },
  {
    path: '/updateDownloads',
    method: (req: Request, res: Response) => updateDownloads(req, res),
  },
  {
    path: '/toggle/comments',
    method: (req: Request, res: Response) => updateCommentsToggle(req, res),
  },
  {
    path: '/toggle/downloads',
    method: (req: Request, res: Response) => updateDownloadToggle(req, res),
  },
];

routes.map(route => {
  router.post(
    route.path,
    dynamicLimiter(60),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await route.method(req, res);
      } catch (error) {
        next(error);
      }
    }
  );
});

export default router;
