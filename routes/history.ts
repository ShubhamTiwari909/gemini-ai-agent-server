import express, { Router, Request, Response, NextFunction } from "express";
import { addHistory, getHistory, getHistoryById } from "../controller/historyController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";

const router: Router = express.Router();

router.post(
  "/add",
  dynamicLimiter(60),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await addHistory(req, res);
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
      await getHistory(req, res);
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
      await getHistoryById(req, res);
    } catch (error) {
      next(error);
    }
  }
);


export default router;
