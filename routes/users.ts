import express, { Router, Request, Response, NextFunction } from "express";
import { addUser, getUserByEmail, getUserId } from "../controller/usersController.js";
import { dynamicLimiter } from "../middlewares/rate-limiting.js";

const router: Router = express.Router();

router.post("/add",dynamicLimiter(1),  async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addUser(req, res);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/find",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserByEmail(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/findById", async (req: Request, res: Response,next: NextFunction) => {
  try {
    await getUserId(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
