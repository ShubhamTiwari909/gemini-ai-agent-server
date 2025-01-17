import express from "express";
import { addHistory, getHistory } from "../controller/historyController.js";

const router = express.Router();

router.post("/add", addHistory);

router.get("/find", getHistory);

export default router;
