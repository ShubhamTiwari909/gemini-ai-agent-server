import express, { Router, Request, Response, NextFunction } from "express";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";
import { getFeed, getFeedBySearch, getFeedByTags } from "../controller/feedController.js";

const router: Router = express.Router();

router.post(
  "/",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFeed(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/search",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFeedBySearch(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/search/tags",
  dynamicLimiter(120),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFeedByTags(req, res);
    } catch (error) {
      next(error);
    }
  }
);


export default router;
