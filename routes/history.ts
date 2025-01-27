import express, { Router, Request, Response, NextFunction } from "express";
import { addHistory, getHistory } from "../controller/historyController.js";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addHistory(req, res);
  } catch (error) {
    next(error);
  }
});

router.post("/find", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getHistory(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

