import express, { Router, Request, Response, NextFunction } from "express";
import { addUser, getUserByEmail } from "../controller/usersController.js";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
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

export default router;
