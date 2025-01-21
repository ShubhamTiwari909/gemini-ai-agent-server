import express, { Router } from "express";
import { addUser } from "../controller/usersController.js";

const router: Router = express.Router();

router.post("/add", addUser);

export default router;
