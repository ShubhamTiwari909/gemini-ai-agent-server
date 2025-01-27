import express, { Router, Request, Response, NextFunction } from "express";
import { addUser } from "../controller/usersController.js";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  res.send("User added");
  // try {
  //   await addUser(req, res);
  // } catch (error) {
  //   next(error);
  // }
});

export default router;
