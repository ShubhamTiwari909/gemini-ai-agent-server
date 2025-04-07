import express, { Router, Request, Response, NextFunction } from "express";
import { addPost, getPosts, getPostById, updateLikes, updateViews, addComment, addReply, updateCommentLikes, updateReplyLikes } from "../controller/postController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";

const router: Router = express.Router();

router.post(
  "/add",
  dynamicLimiter(60),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addPost(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/find",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getPosts(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/findById",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getPostById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateLikes",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateLikes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateViews",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateViews(req, res);
    } catch (error) {
      next(error);
    }
  }
);


router.post(
  "/updateComments",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addComment(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateReplies",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addReply(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateCommentLikes",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateCommentLikes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/updateReplyLikes",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateReplyLikes(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
