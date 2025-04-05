import express, { Router, Request, Response, NextFunction } from "express";
import { addPost, getPosts, getPostById, updateLikes } from "../controller/postController.js";
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


export default router;
