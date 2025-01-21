import express, { Router } from "express";
import { addHistory, getHistory } from "../controller/historyController.js";

const router: Router = express.Router();

router.post("/add", addHistory);

router.post("/find", getHistory);

export default router;
