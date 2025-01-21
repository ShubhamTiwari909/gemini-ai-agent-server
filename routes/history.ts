import express, { Router } from "express";
import { addHistory, getHistory } from "../controller/historyController.js";

const router: Router = express.Router();

router.post("/add", (req, res, next) => {
  addHistory(req, res).catch(next);
});

router.post("/find", (req, res, next) => {
  getHistory(req, res).catch(next);
});

export default router;
